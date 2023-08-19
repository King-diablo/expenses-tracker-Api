const { FindUser } = require("../controller/UserController");
const { v4: uuidv4 } = require('uuid');
const { User } = require("../model/UserModel");

async function CreateTransaction(userId, amount, description, transactionType, transactionCategory = "default") {
    const user = await FindUser(userId);
    const newAmount = parseFloat(amount);
    const transactionId = uuidv4();

    const trxCategory = user.user.TransactionCategory;

    const result = trxCategory.filter((category) => {
        if (category === transactionType) {
            return category;
        }
    });

    if (result.length === 0) {
        TransactionCategory = "default";
    }

    const newTransaction = {
        transactionId,
        amount: newAmount,
        description,
        transactionType,
        transactionCategory,
        createdAt: new Date()
    }


    if (user.status === "error") {
        return {
            statusCode: user.statusCode,
            status: "error",
            message: user.message,
        };
    }
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

    try {
        const updatedUser = await User.updateOne({ userId }, { Transactions: Transactions, balance: balance });
        return {
            statusCode: 201,
            status: "success",
            message: `${transactionType} alert created`,
            balance
        };

    } catch (error) {
        return {
            statusCode: 400,
            status: "error",
            message: error.message,
        };
    }
}

async function GetTransactions(userId, transactionType) {
    const user = await FindUser(userId);

    if (user.status === "error") {
        return {
            statusCode: user.statusCode,
            status: "error",
            message: user.message,
        };
    }

    const transactions = user.user?.Transactions;
    const balance = user?.user?.balance;
    const balances = {
        credits: 0,
        debits: 0
    };

    if (transactions === undefined) {
        return {
            statusCode: 200,
            status: "success",
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

async function GetTransactionsCategory(userId, category) {
    const user = await FindUser(userId);

    if (user.status === "error") {
        return {
            statusCode: user.statusCode,
            status: "error",
            message: user.message,
        };
    }

    const transactions = user.user?.Transactions;
    const balance = user?.user?.balance;

    const filiteredCategory = transactions.filter((data) => {
        if (data.transactionCategory === category) {
            return data;
        }
    });

    if (filiteredCategory.length === 0) {
        return {
            statusCode: 200,
            status: "success",
            message: "no available transactions for this category",
        }
    } else {
        return {
            statusCode: 200,
            status: "success",
            totalBalance: balance,
            filiteredCategory,
        }
    }
}

module.exports = {
    CreateTransaction,
    GetTransactions,
    GetTransactionsCategory,
}