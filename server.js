require("dotenv").config({ path: "./config/.env" });

const express = require("express");
const { appConfig } = require("./config/config");

const connectDatabase = require("./config/database");

const userRoute = require("./routes/api/user");

const app = express();

// Connect to the database
connectDatabase();

// Init Middleware
app.use(express.json({ extended: false }));

// Server Check
app.get("/", (req, res) => res.send("API Running"));

app.use("/api/users", userRoute);

const PORT = appConfig.port;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
