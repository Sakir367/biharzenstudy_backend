// server.js
require("dotenv").config();
const app = require("./app");
const { Pool } = require("pg"); // PostgreSQL library

// DB config
const dbConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
};

// DB connection
const pool = new Pool(dbConfig);

// Example: check connection
pool.connect()
  .then(client => {
    console.log("Connected to PostgreSQL!");
    client.release(); // release back to pool
  })
  .catch(err => {
    console.error("DB connection error:", err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

module.exports = pool; // optional, agar app me queries karni ho
