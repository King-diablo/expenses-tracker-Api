require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const { openDatabase } = require("./src/config/database");
const { userRoute } = require("./src/routes/UserRoute");

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

const Port = process.env.PORT;

openDatabase

app.use("/api/user", userRoute);

app.listen(Port, () => {
    console.log(`Listening on port ${Port}`);
});