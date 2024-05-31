const express = require("express");
const router = express.Router();
const { register, login, update, deleteUser } = require("./Auth");

router.post("/register", register);
router.post("/login", login);
router.put("/update", update);
router.delete("/deleteUser", deleteUser);

module.exports = router;

