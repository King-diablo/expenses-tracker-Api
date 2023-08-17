const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    name: String,
    Gender: String,
    picture: String,
    balance: {
        type: Number,
        default: 0,
    },
    Transactions: {
        type: Array,
        default: []
    }
})



const User = new mongoose.model("user", UserSchema);

module.exports = {
    User,
}