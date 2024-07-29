const express = require('express');
const { addCart, getCart, deleteCart, editCart, makeOrder } = require('./controller');
const accessor = require('../middlewares/accessor'); 

const cartRouter = express.Router();

cartRouter.post('/addCart', accessor, addCart);
cartRouter.get('/getCart/:userId', accessor, getCart); 
cartRouter.put('/editCart/:cartId', accessor, editCart);
cartRouter.delete('/delCart/:cartId', accessor, deleteCart);

module.exports = cartRouter;
