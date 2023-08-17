require("dotenv").config();
const express = require("express");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const { CreateUser, UpdateInfo, LogIn } = require("../controller/UserController");
const { Authorzie, validateInput } = require("../middleware/Validation");
const { Payload } = require("../helper/Helpers");
const { transactionRoute } = require("./TransactionRoute");

const userRoute = express.Router();

const secret = process.env.SECRET_KEY;

userRoute.post("/create", validateInput, async (req, res) => {
    const { email, password } = req.body;
    if (email === undefined || email === "") {
        res.status(403).json({
            message: "Invlid email",
        });
    }

    if (password === undefined || password === "") {
        res.status(403).json({
            message: "Invlid password",
        });
    }

    const response = await CreateUser(email, password);

    if (response.error) {
        res.status(400).json({
            message: `${response.error.keyValue.email} already exist`
        })
        return;
    }

    const userId = response?.result?.userId;

    var token = jwt.sign(Payload(userId, email), secret);

    res.status(200).json({ response, token });

});

userRoute.post("/login", validateInput, async (req, res) => {
    const { email, password } = req.body;

    const response = await LogIn(email, password);

    const userId = response?.result?.userId;

    var token = jwt.sign(Payload(userId, email), secret);

    res.status(200).json({ response, token });
})

userRoute.post("/update", Authorzie, async (req, res) => {
    const { name, Gender, picture } = req.body;
    const { userId } = req.user;

    const info = {
        name,
        Gender,
        picture,
    }

    const result = await UpdateInfo(userId, info);

    res.status(200).json({
        result
    })
})

userRoute.post("/logout", Authorzie, async (req, res) => {

});

userRoute.delete("/delete", async (req, res) => {

})

userRoute.use("/transaction", transactionRoute);


module.exports = {
    userRoute,
}

///TODO Create a logout system
///TODO Create a delete endpoint to delete a user