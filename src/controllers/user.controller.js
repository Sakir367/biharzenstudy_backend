const userService = require("../services/user.service");

exports.createUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await userService.createUser(name, email);
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
