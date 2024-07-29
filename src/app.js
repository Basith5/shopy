const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./user/route');
const db = require('./db');
const cartRouter = require('./cart/route');
const orderRouter = require('./orders/route');

const app = express();


app.use(bodyParser.json());


app.use('/user', userRouter, cartRouter,orderRouter);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

module.exports = db; 