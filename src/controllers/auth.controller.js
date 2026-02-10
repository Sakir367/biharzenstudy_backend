const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("Login attempt:", username, password);

    const result = await pool.query("SELECT * FROM admins WHERE username=$1", [username]);
    const admin = result.rows[0];
    console.log("Admin fetched:", admin); // check if DB returned anything

    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err); // more detailed log
    res.status(500).json({ error: "Server error" });
  }
};

