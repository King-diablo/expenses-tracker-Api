require("dotenv").config();
const Joi = require('joi');
var jwt = require('jsonwebtoken');

async function validateInput(req, res, next) {

    const { email, password } = req.body;

    const inputSchema = Joi.object({
        email: Joi.string()
            .email()
            .required(),

        password: Joi.string()
            .required()
            .alphanum()
    });

    try {
        const value = await inputSchema.validateAsync({ email, password });
        next();
        return;

    } catch (error) {
        return res.status(400).json({ error });
    }
}

async function validateUpdatedInput(req, res, next) {
    const { name, Gender, picture } = req.body;

    const inputSchema = Joi.object({
        name: Joi.string()
            .min(4)
            .message("a name of atleast 4 character long is needed"),

        Gender: Joi.string()
            .min(1)
            .message("Gender is required"),

        picture: Joi.string()
            .message("A url of an imagae is needed")
    });

    try {
        const value = await inputSchema.validateAsync({ email, password });
        next();
        return;

    } catch (error) {
        return res.status(400).json({ error });
    }
}

async function Authorzie(req, res, next) {

    const token = req.headers.authorization;

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        if (decoded) {
            req.user = decoded;
            next();
            return;
        }
    } catch (error) {
        res.status(400).json({
            issuse: error.name,
            message: "invalid token"
        });
    }

    console.log(req.headers);
}

module.exports = {
    validateInput,
    validateUpdatedInput,
    Authorzie
}