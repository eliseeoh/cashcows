const mongoose = require('mongoose');

const localDB = 'mongodb://localhost:27017/role_auth';

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