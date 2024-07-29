const express = require('express')
const { makeOrder, updateStatus } = require('./controller')
const accessor = require('../middlewares/accessor')

const orderRouter = express.Router()

orderRouter.post('/makeOrder', accessor, makeOrder)
orderRouter.put('/updateOrder/:orderId', accessor, updateStatus)

module.exports = orderRouter