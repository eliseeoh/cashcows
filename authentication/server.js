const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./db");
const authRoutes = require("./Auth/route");
const { adminAuth, userAuth } = require("./middleware/auth.js");

const app = express();
const PORT = 5000;

app.set("view engine", "ejs");

app.use(express.json());
app.use(cookieParser());

connectDB();

app.listen(PORT, () => console.log(`Server Connected to port ${PORT}`));

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.render("home"));
app.get("/register", (req, res) => res.render("register"));
app.get("/login", (req, res) => res.render("login"));
app.get("/admin", adminAuth, (req, res) => res.render("admin"));
app.get("/basic", userAuth, (req, res) => res.render("user"));
