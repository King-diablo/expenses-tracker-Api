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

async function CreateTransaction(userId, amount, description, transactionType) {
    const newAmount = parseFloat(amount);
    const transactionId = uuidv4();
    // console.log(transactionType);
    const newTransaction = {
        transactionId,
        amount: newAmount,
        description,
        transactionType,
        createdAt: new Date()
    }

    const user = await FindUser(userId);

    let Transactions = user.user?.Transactions;
    let balance = user.user.balance;

    if (Transactions === undefined) {
        Transactions = [
            newTransaction
        ];
    } else {
        Transactions.push(newTransaction);
    }

    if (transactionType === 'credit') {
        balance += parseFloat(newAmount);
    }

    if (transactionType === "debit") {
        balance -= parseFloat(newAmount);
    }

    const updatedUser = await User.updateOne({ userId }, { Transactions: Transactions, balance: balance });

    return {
        message: `${transactionType} alert created`,
        balance
    };
}

async function GetTransactions(userId, transactionType) {
    const user = await FindUser(userId);

    const transactions = user.user?.Transactions;
    const balance = user?.user?.balance;
    const balances = {
        credits: 0,
        debits: 0
    };

    if (transactions === undefined) {
        return {
            message: "no transactions",
        }
    }

    const transaction = transactions.filter((data) => {
        if (data.transactionType === 'credit') {
            balances.credits += data.amount;
        }
        if (data.transactionType === 'debit') {
            balances.debits += data.amount;
        }
        if (transactionType === "") {
            return data;
        }
        return data.transactionType === transactionType;
    });

    const trx = {
        totalBalance: balance,
        transaction,
        balances,
    }

    switch (transactionType) {
        case "credit":
            return { trx }
            break;
        case "debit":
            return { trx }
            break;
        case "":
            return { trx }
            break;
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
    CreateTransaction,
    GetTransactions,
    UpdateInfo,
}

///TODO Fix bug cast error for balance