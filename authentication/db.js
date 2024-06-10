const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const User = require("../model/user");
const bcrypt = require('bcryptjs');

const connectDB = async () => {
    const localDB = process.env.MONGODB_URI;
    //console.log('MongoDB URI:', localDB);
    if (!localDB) {
        console.error("MongoDB URI not defined in .env file");
        process.exit(1);
    }

    try {
        await mongoose.connect(localDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log("MongoDB Connected");

        const db = mongoose.connection;
        console.log("Database Name:", db.name);
        console.log("Collections:", await db.listCollections().toArray());
        mongoose.connection.close();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    } 
};

connectDB();
module.exports = connectDB;
