const bcrypt = require("bcrypt");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await pool.query(
      "INSERT INTO admins(username, password) VALUES($1, $2) ON CONFLICT (username) DO NOTHING",
      ["admin", hashedPassword]
    );

    console.log("Admin created ✅");
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    pool.end();
  }
}

createAdmin();
