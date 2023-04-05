const yaml = require("js-yaml");
const fs = require("fs");
const path = require("path");

let config = {};

// Application Environment
const appEnv = process.env.APP_ENV;

// Get document, or throw exception on error
try {
  config = yaml.load(
    fs.readFileSync(path.join(__dirname, "config.yml"), "utf8")
  );
} catch (error) {
  console.log(error.message);
}

const { protocol, host, port, api_prefix } = config.app[appEnv];

module.exports = {
  dbConfig: config.db[appEnv],
  appConfig: {
    ...config.app[appEnv],
    baseAPIEndpoint: `${protocol}://${host}:${port}${api_prefix}`,
},
};
