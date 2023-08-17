const express = require("express");
const bodyParser = require("body-parser");
const { openDatabase } = require("./src/config/database");
const { userRoute } = require("./src/routes/UserRoute");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const Port = 3000;

openDatabase

app.use("/api/user", userRoute);

app.listen(Port, () => {
    console.log(`Listening on port ${Port}`);
});