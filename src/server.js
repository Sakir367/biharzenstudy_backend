// server.js
require("dotenv").config();
const app = require("./app");
const { Pool } = require("pg"); // PostgreSQL library

// Create PostgreSQL connection pool
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

// Optional: Check database connection
pool.connect()
  .then(client => {
    console.log("✅ Connected to PostgreSQL database!");
    console.log(`📊 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    client.release(); // release back to pool
  })
  .catch(err => {
    console.error("❌ DB connection error:", err.message);
    console.error("Please check your database credentials and make sure PostgreSQL is running");
  });

// Determine if running locally or on Vercel
const isLocal = process.env.NODE_ENV !== "production";

// Local server: only start app.listen() in local
if (isLocal) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running locally on http://localhost:${PORT}`);
  });
}

// Export pool for routes and app for Vercel serverless
module.exports = { pool, app };

// // server.js
// require("dotenv").config();
// const app = require("./app");
// const { Pool } = require("pg"); // PostgreSQL library

// // Create PostgreSQL connection pool
// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   port: process.env.DB_PORT,
// });

// // Check database connection
// pool.connect()
//   .then(client => {
//     console.log("✅ Connected to PostgreSQL database!");
//     console.log(`📊 Database: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
//     client.release(); // release back to pool
//   })
//   .catch(err => {
//     console.error("❌ DB connection error:", err.message);
//     console.error("Please check your database credentials and make sure PostgreSQL is running");
//   });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

// module.exports = pool; 