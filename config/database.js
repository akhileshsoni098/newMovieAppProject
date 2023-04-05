const mongoose = require("mongoose");

const { dbConfig } = require("./config");

const connectDatabase = async () => {
  try { 
    await mongoose.connect(
      `mongodb+srv://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}/MovieApp?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Mongo DB Connected"); 
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
 
module.exports = connectDatabase;
