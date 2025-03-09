const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
const connectDB = require('./DB/db');

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.use('/user', userRoutes);

module.exports = app;