const User = require("../model/user");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

const jwtSecret = '5310e07a5d2204812ad20a9c030f4455ef1d858dc7e1f6ec4edc64b8a3ac8f7d1dc7ff';


exports.register = async (req, res, next) => {
    const { email, username, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already in use",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });

        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
            { id: user._id, email, role: user.role },
            jwtSecret,
            { expiresIn: maxAge }
        );

        res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
        });

        res.status(201).json({
            message: "User successfully created",
            user: user._id,
        });
    } catch (error) {
        res.status(400).json({
            message: "User not successfully created",
            error: error.message,
        });
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log('Login attempt:', email);  // Log email

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);  // Log if user not found
            return res.status(400).json({
                message: "Login not successful",
                error: "User not found",
            });
        }

        console.log('User found:', user);  // Log user details

        bcrypt.compare(password, user.password)
            .then((result) => {
                if (result) {
                    console.log('Password match for user:', user.email);  // Log successful password match

                    const maxAge = 3 * 60 * 60;
                    const token = jwt.sign(
                        { id: user._id, username: user.username, role: user.role },
                        jwtSecret,
                        { expiresIn: maxAge }
                    );

                    res.cookie("jwt", token, {
                        httpOnly: true,
                        maxAge: maxAge * 1000,
                    });

                    return res.status(200).json({
                        message: "User successfully logged in",
                        user: user._id,
                    });
                } else {
                    console.log('Password mismatch for user:', user.email);  // Log password mismatch
                    return res.status(400).json({ message: "Login not successful" });
                }
            })
            .catch((error) => {
                console.log('Error during password comparison:', error.message);  // Log error during password comparison
                return res.status(400).json({
                    message: "An error occurred",
                    error: error.message,
                });
            });
    } catch (error) {
        console.log('Error during login process:', error.message);  // Log error during login process
        return res.status(400).json({
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

