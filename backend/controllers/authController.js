const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
const register = async (req, res) => {
    try {
        const {name, email, password, phone, licenseNumber} = req.body;

        const existingUser  = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create(req.body);
        
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user
        });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {register};