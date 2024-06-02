const express = require("express");
const router = express.Router();
const { register, login, update, deleteUser } = require("./Auth");

router.post("/register", register);
router.post("/login", login);
router.put("/update", update);
router.delete("/deleteUser", deleteUser);
// Define a route for GET requests to "/api/auth"
router.get("/", (req, res) => {
    res.send("Server is running");
});

module.exports = router;

