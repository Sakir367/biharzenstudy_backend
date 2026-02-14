require("dotenv").config();
const app = require("./app");
const { Pool } = require("pg"); // PostgreSQL library

// PostgreSQL pool setup
let pool;
if (!global.pool) {
  pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  });
  global.pool = pool;
} else {
  pool = global.pool;
}

// Optional: check DB connection
pool.connect()
  .then(client => {
    console.log("✅ Connected to PostgreSQL database!");
    client.release();
  })
  .catch(err => {
    console.error("❌ DB connection error:", err.message);
  });

// Start server (Railway requires this)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = { pool, app };
