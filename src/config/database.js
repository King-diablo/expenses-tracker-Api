require("dotenv").config();
const mongoose = require("mongoose");

const databaseUrl = process.env.DATABASE_URL;
const databaseName = "expensesTracker";
const connectionString = databaseUrl + "/" + databaseName;

const openDatabase = mongoose.connect(connectionString).then(() => {
    console.log("Connected to the database");
}).catch((error) => {
    console.log(error);
})


module.exports = { openDatabase };