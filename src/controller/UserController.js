require("dotenv").config();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { User } = require("../model/UserModel");

async function CreateUser(email, password) {
    const userId = uuidv4();
    const rounds = parseInt(process.env.SALT_ROUND);

    const salt = bcrypt.genSaltSync(rounds);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
        userId,
        email,
        password: hash
    });

    try {
        const result = await newUser.save();
        return {
            statusCode: 201,
            status: "created",
            message: "user created successfuly",
            result
        };
    } catch (error) {
        return {
            statusCode: 400,
            status: error.message,
            error
        }
    }

}

async function LogIn(email, password) {
    const user = await User.findOne({ email });

    if (user === null || user === undefined) {
        return {
            message: "user does not exist",
        }
    }

    if (user) {
        const hash = user.password;
        const value = bcrypt.compareSync(password, hash);

        if (value) {
            return {
                statusCode: 200,
                status: "success",
                message: "logged in successfuly",
                user
            }
        } else {
            return {
                statusCode: 400,
                status: "error",
                message: "incorrect password"
            }
        }
    }

}

async function FindUser(userId) {
    const user = await User.findOne({ userId });

    if (user) {
        return {
            statusCode: 200,
            status: "success",
            message: "userFound",
            user
        };
    } else {
        return {
            statusCode: 404,
            status: "error",
            message: "userNot Found"
        }
    }
}

async function UpdateInfo(userId, info) {
    const user = await User.findOne({ userId });


    if (info.name != undefined && info.name != "") {
        user.name = info.name;
    }

    if (info.Gender != undefined && info.Gender != "") {
        user.Gender = info.Gender;
    }

    if (info.picture != undefined && info.picture != "") {
        user.picture = info.picture;
    }

    try {
        const result = await user.save();
        return {
            statusCode: 200,
            status: "success",
            message: "info updated",
            result
        }
    } catch (error) {
        return {
            statusCode: 400,
            status: "error",
            message: "info not updated",
            error
        }
    }

}

async function DeleteUser(userId) {
    const user = await User.findOneAndDelete({ userId });

    if (user) {
        return {
            statusCode: 200,
            status: "success",
            message: "user deleted successfuly",
        }
    } else {
        return {
            statusCode: 404,
            status: "error",
            message: "user not found"
        }
    }
}

module.exports = {
    CreateUser,
    LogIn,
    UpdateInfo,
    FindUser,
    DeleteUser
}