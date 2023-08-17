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
            message: "user created successfuly",
            result
        };
    } catch (error) {
        return { error }
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
                message: "logged in successfuly",
                user
            }
        } else {
            return {
                message: "incorrect password"
            }
        }
    }

}

async function FindUser(userId) {
    const user = await User.findOne({ userId });

    if (user) {
        return {
            message: "userFound",
            user
        };
    } else {
        return {
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

    const result = await user.save();

    return {
        message: "info updated",
    }
}

module.exports = {
    CreateUser,
    LogIn,
    UpdateInfo,
    FindUser,
}

///TODO Fix bug cast error for balance