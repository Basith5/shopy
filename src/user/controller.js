const bcrypt = require("bcryptjs");
const db = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Sign-Up Function
async function signUp(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        msg: "Name, email, and password are required",
      });
    }

    // Check if email already exists
    const checkSql = "SELECT id FROM users WHERE email = ?";
    const [existingUser] = await db.query(checkSql, [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({
        msg: "Email already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const insertSql =
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    await db.query(insertSql, [name, email, hashedPassword]);

    return res.status(201).json({
      msg: "User registered successfully",
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
}

// Login Function
async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // Find the user by email
    const sql = "SELECT id, password FROM users WHERE email = ?";
    const [results] = await db.query(sql, [email]);

    if (results.length === 0) {
      return res.status(401).json({ msg: "Incorrect email or password" });
    }

    const user = results[0];

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ msg: "Incorrect email or password" });
    }

    // Generate a JWT token on successful login
    const token = jwt.sign(
      { id: user.id, email: email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      msg: "Login Successful",
      token: token,
    });
  } catch (error) {
    console.error("Error during user login:", error);
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
}

module.exports = { signUp, login };
