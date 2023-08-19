const express = require("express");
const transactionRoute = express.Router();

const { CreateTransaction, GetTransactions, GetTransactionsCategory } = require("../controller/TransactionController");

const { Authorzie } = require("../middleware/Validation");

transactionRoute.post("/credit", Authorzie, async (req, res) => {
    const { amount, description, category } = req.body;
    const { userId } = req.user;

    const response = await CreateTransaction(userId, amount, description, "credit", category);

    res.status(response.statusCode).json({ response });
});

transactionRoute.post("/debit", Authorzie, async (req, res) => {
    const { amount, description, category } = req.body;
    const { userId } = req.user;

    console.log(req.user);

    const response = await CreateTransaction(userId, amount, description, "debit", category);

    console.log(response);

    res.status(response.statusCode).json({ response });
});


transactionRoute.get("/fetch", Authorzie, async (req, res) => {
    const { userId } = req.user;

    // console.log(transactionType);

    let transaction = []

    transaction = await GetTransactions(userId, "");

    res.status(200).json({ transaction });
});

transactionRoute.get("/fetch/transactionType/:type", Authorzie, async (req, res) => {
    const { userId } = req.user;
    const transactionType = req.params.type;

    //console.log(transactionType);

    let transaction = []

    switch (transactionType) {
        case "credit":
            transaction = await GetTransactions(userId, transactionType);
            break;
        case "debit":
            transaction = await GetTransactions(userId, transactionType);
            break;
        default:
            return res.status(400).json({
                message: "invalid transaction type. it can be between credit or debit"
            })
            break;
    }

    res.status(200).json(transaction);
});

transactionRoute.get("/fetch/transactionCategory/:category", Authorzie, async (req, res) => {
    const { userId } = req.user;
    const category = req.params.category;

    let transaction = []

    transaction = await GetTransactionsCategory(userId, category);

    res.status(200).json(transaction);
})

module.exports = {
    transactionRoute
}