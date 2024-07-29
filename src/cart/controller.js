const db = require("../db");

async function addCart(req, res) {
  try {
    const { name, quantity, userId } = req.body;

    if (!name || !quantity || !userId) {
      return res.status(400).json({ msg: "Name, quantity, and userId are required" });
    }

    const checkUserSql = "SELECT id FROM users WHERE id = ?";
    const [userResults] = await db.query(checkUserSql, [userId]);

    if (userResults.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const insertCartSql =
      "INSERT INTO cart (name, quantity, userId) VALUES (?, ?, ?)";

    const adding = await db.query(insertCartSql, [name, quantity, userId]);

    return res.status(201).json(
        { msg: "Cart item added successfully" }
    );
  } catch (error) {
    
    return res.status(500).json(
        { msg: "Internal server error", error: error.message }
    );
  }
}

async function getCart(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const checkUserSql = "SELECT id FROM users WHERE id = ?";
    const [userResults] = await db.query(checkUserSql, [userId]);

    if (userResults.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const getCartSql = "SELECT * FROM cart WHERE userId = ?";
    const [cartItems] = await db.query(getCartSql, [userId]);

    if (cartItems.length === 0) {
      return res.status(404).json({ msg: "No items found in cart" });
    }

    return res.status(200).json(cartItems);

  } catch (error) {
    return res.status(500).json({ msg: "Internal server error", error: error.message });
  }
}

async function editCart(req, res) {
    try {
        const { cartId } = req.params;

        const { quantity } = req.body; 

        if (!cartId || quantity === undefined) {
            return res.status(400).json({ msg: "Cart ID and quantity are required" });
        }

        if (quantity <= 0) {
            return res.status(400).json({ msg: "Quantity must be greater than zero" });
        }

        const checkCartSql = 'SELECT id FROM cart WHERE id = ?';

        const [cartResults] = await db.query(checkCartSql, [cartId]);

        if (cartResults.length === 0) {
            return res.status(404).json({ msg: "Cart item not found" });
        }

        const updateCartSql = 'UPDATE cart SET quantity = ? WHERE id = ?';

        await db.query(updateCartSql, [quantity, cartId]);

        return res.status(200).json({ msg: "Cart item updated successfully" });

    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error', error: error.message });
    }
}

async function deleteCart(req, res) {
    try {
        const { cartId } = req.params; 

        if (!cartId) {
            return res.status(400).json({ msg: "Cart ID is required" });
        }

        const checkCartSql = 'SELECT id FROM cart WHERE id = ?';

        const [cartResults] = await db.query(checkCartSql, [cartId]);

        if (cartResults.length === 0) {

            return res.status(404).json({ msg: "Cart item not found" });

        }

        const deleteCartSql = 'DELETE FROM cart WHERE id = ?';

        await db.query(deleteCartSql, [cartId]);

        return res.status(200).json({ msg: "Cart item deleted successfully" });

    } catch (error) {
        
        return res.status(500).json({ msg: 'Internal server error', error: error.message });

    }
}

module.exports = { addCart, getCart,editCart , deleteCart };
