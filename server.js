require("dotenv").config({ path: "./config/.env" });
const cors = require("cors");
const express = require("express");
const { appConfig } = require("./config/config");

const connectDatabase = require("./config/database");

const route = require("./routes/api/route");

const app = express();

app.use(cors());
// Connect to the database
connectDatabase();

// Init Middleware
app.use(express.json({ extended: false }));

app.use("/", route);

const PORT = appConfig.port;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
