const User = require("../model/User");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const jwtSecret = '5310e07a5d2204812ad20a9c030f4455ef1d858dc7e1f6ec4edc64b8a3ac8f7d1dc7ff';

exports.register = async (req, res, next) => {
    const { username, password } = req.body;
  
    bcrypt.hash(password, 10)
        .then(async (hash) => {
            const user = await User.create({
                username,
                password: hash,
            });
            const maxAge = 3 * 60 * 60;
            const token = jwt.sign(
                { id: user._id, username, role: user.role },
                jwtSecret,
                { expiresIn: maxAge } // 3hrs in sec
            );
            res.cookie("jwt", token, {
                httpOnly: true,
                maxAge: maxAge * 1000, // 3hrs in ms
            });
            res.status(201).json({
                message: "User successfully created",
                user: user._id,
            });
        })
        .catch((error) =>
            res.status(400).json({
                message: "User not successfully created",
                error: error.message,
            })
        );
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            });
        }
        bcrypt.compare(password, user.password)
            .then((result) => {
                if (result) {
                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user._id, username, role: user.role },
                        jwtSecret,
                        { expiresIn: maxAge } // 3hrs in sec
                    );
                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000, // 3hrs in ms
                    });
                    res.status(200).json({
                        message: "User successfully logged in",
                        user: user._id,
                    });
                } else {
                    res.status(400).json({ message: "Login not successful" });
                }
            })
            .catch((error) => {
                res.status(400).json({
                    message: "An error occurred",
                    error: error.message,
                });
            });
    } catch (error) {
        res.status(400).json({
            message: "An error occurred",
            error: error.message,
        });
    }
};

exports.update = async (req, res, next) => {
    const { role, id } = req.body;
    if (!role || !id) {
        return res.status(400).json({ message: "Role or Id not present" });
    }
    if (role !== "admin") {
        return res.status(400).json({ message: "Role is not admin" });
    }
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (user.role === "admin") {
            return res.status(400).json({ message: "User is already an Admin" });
        }
        user.role = role;
        await user.save();
        res.status(201).json({ message: "Update successful", user });
    } catch (error) {
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};

exports.deleteUser = async (req, res, next) => {
    const { id } = req.body;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        await user.remove();
        res.status(201).json({ message: "User successfully deleted", user });
    } catch (error) {
        res.status(400).json({ message: "An error occurred", error: error.message });
    }
};

