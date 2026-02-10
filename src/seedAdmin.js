const bcrypt = require("bcrypt");
const pool = require("./config/db");

const login = async (username, password) => {
  const result = await pool.query(
    "SELECT * FROM admins WHERE username = $1",
    [username]
  );

  if (result.rows.length === 0) return false; // user not found

  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password); // compare hashed

  if (!match) return false; // password mismatch

  return true; // login successful
};

login("admin", "admin123").then(console.log); // true ya false

