const db = require("../db");

async function makeOrder(req, res) {
    try {
        const { cartId, userId } = req.body;

        if (!cartId || !userId) {
            return res.status(400).json({ msg: "Cart ID and User ID are required" });
        }

        const checkUserSql = 'SELECT id FROM users WHERE id = ?';

        const [userResults] = await db.query(checkUserSql, [userId]);

        if (userResults.length === 0) {
            return res.status(404).json({ msg: "User not found" });
        }

        const checkCartSql = 'SELECT id FROM cart WHERE id = ?';

        const [cartResults] = await db.query(checkCartSql, [cartId]);

        if (cartResults.length === 0) {
            return res.status(404).json({ msg: "Cart item not found" });
        }

        const insertOrderSql = 'INSERT INTO orders (cartId, status) VALUES (?, ?)';

        await db.query(insertOrderSql, [cartId, 'pending']);

        return res.status(201).json({ msg: "Order created successfully" });

    } catch (error) {

        return res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
}

async function updateStatus(req, res) {
    try {
        const { orderId } = req.params; 
        const { status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ msg: "orderId and status are required" });
        }

        const allowedStatuses = ['pending', 'shipped', 'delivered'];
s
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ msg: "Invalid status. Allowed values are 'pending', 'shipped', 'delivered'" });
        }

        const checkOrderSql = 'SELECT id FROM orders WHERE id = ?';
        const [orderResults] = await db.query(checkOrderSql, [orderId]);

        if (orderResults.length === 0) {
            return res.status(404).json({ msg: "Order not found" });
        }

        const updateOrderSql = 'UPDATE orders SET status = ? WHERE id = ?';
        await db.query(updateOrderSql, [status, orderId]);

        return res.status(200).json({ msg: "Order status updated successfully" });

    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
}


module.exports = { makeOrder, updateStatus }
