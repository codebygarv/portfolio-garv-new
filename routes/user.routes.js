const express = require('express');
const router = express.Router();
const userModel = require('../model/user.model');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    const { Email, Password } = req.body;
    console.log(Email, Password);
    try {
        let user
        user = new userModel({
            Email,
            Password
        });
        await user.save();
        const payload = {
            user: {
                id: user.id
            }
        };
        const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ user, token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.post('/login', async (req, res) => {
    const { Email, Password } = req.body;
    
    try {
        let user = await userModel.findOne({ Email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await user.comparePassword(Password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };
        const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });
        res.status(200).json({ user, token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;