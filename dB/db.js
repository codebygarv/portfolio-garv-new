const mongoose = require('mongoose');
const MONGO_URI = 'mongodb+srv://Garvthakral:Garv%407654@garv-portfolio.8vtyz.mongodb.net/?retryWrites=true&w=majority&appName=Garv-portfolio';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;