const express = require("express");
const router = express.Router();
const { createUser, getUsers } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/", authMiddleware, createUser); // ✅
router.get("/", getUsers);    // ✅

module.exports = router;
