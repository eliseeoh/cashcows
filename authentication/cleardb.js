const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' })

const localDB = process.env.MONGODB_URI;

mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB Connected');
    return mongoose.connection.dropDatabase();
}).then(() => {
    console.log('Database cleared');
    process.exit(0);
}).catch((error) => {
    console.error('Error clearing database:', error.message);
    process.exit(1);
});

