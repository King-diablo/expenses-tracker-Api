require("dotenv").config();
const express = require("express");
var jwt = require('jsonwebtoken');

const { CreateUser, UpdateInfo, LogIn, DeleteUser } = require("../controller/UserController");
const { Authorzie, validateInput, validateUpdatedInput } = require("../middleware/Validation");
const { Payload } = require("../helper/Helpers");
const { transactionRoute } = require("./TransactionRoute");

const userRoute = express.Router();

const secret = process.env.SECRET_KEY;

userRoute.post("/create", validateInput, async (req, res) => {
    const { email, password } = req.body;
    if (email === undefined || email === "") {
        res.status(400).json({
            message: "Invlid email",
        });
    }

    if (password === undefined || password === "") {
        res.status(400).json({
            message: "Invlid password",
        });
    }

    const response = await CreateUser(email, password);

    if (response.error) {
        res.status(response.statusCode).json({
            message: `${response.error.keyValue.email} already exist`
        })
        return;
    }

    const userId = response?.result?.userId;

    var token = jwt.sign(Payload(userId, email), secret, { expiresIn: "1h" });

    res.status(response.statusCode).json({ response, token });

});

userRoute.post("/login", validateInput, async (req, res) => {
    const { email, password } = req.body;

    console.log(req.headers);

    const response = await LogIn(email, password);

    const userId = response?.user?.userId;

    var token = jwt.sign(Payload(userId, email), secret, { expiresIn: "1h" });

    const newResponse = {
        statusCode: response.statusCode,
        status: response.status,
        message: response.message,
    }

    res.status(response.statusCode).json({ newResponse, token });
})

userRoute.post("/update", Authorzie, validateUpdatedInput, async (req, res) => {
    const { name, Gender, picture } = req.body;
    const { userId } = req.user;

    const info = {
        name,
        Gender,
        picture,
    }

    const result = await UpdateInfo(userId, info);

    res.status(result.statusCode).json({
        result
    })
})

userRoute.delete("/delete", Authorzie, async (req, res) => {
    const user = req.user;

    const response = await DeleteUser(user.userId);

    res.status(response.statusCode).json({ response });
})

userRoute.use("/transaction", transactionRoute);


module.exports = {
    userRoute,
}