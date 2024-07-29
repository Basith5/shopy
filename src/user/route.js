const { signUp, login } = require("./controller")
const express = require('express')
const userRouter = express.Router()

userRouter.post('/signUp', signUp);
userRouter.post('/login', login);

module.exports = userRouter