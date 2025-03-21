const express = require('express');
const router = express.Router();
const userModel = require('../model/user.model');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../model/blacklistToken.model');


const verifyToken = (req, res, next) => {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token." });
    }
};

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
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
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
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ user, token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


router.get('/logout', verifyToken, async (req, res) => {
    const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    try {
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided' });
        }

        const isblacklisted = await blacklistTokenModel.findOne({ token });

        if (isblacklisted) {
            return res.status(401).json({ message: 'Access denied. Token blacklisted' });
        }

        res.clearCookie('token');
        await blacklistTokenModel.create({ token });
        res.status(200).json({ msg: 'Logged out' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
);

module.exports = router;