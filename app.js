const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
const connectDB = require('./db/db.js');

connectDB();

const path = require('path');
const connectDB = require(path.join(__dirname, 'db', 'db.js'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.use('/user', userRoutes);

module.exports = app;