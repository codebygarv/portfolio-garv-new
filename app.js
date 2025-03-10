const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
const connectDB = require('./db/db.js');
const cors = require('cors');
const projectRoutes = require('./routes/project.routes');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(cookieParser());

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.use('/projects',projectRoutes)
app.use('/user', userRoutes);

module.exports = app;