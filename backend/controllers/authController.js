const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Register a new user
const register = async (req, res) => {
    try {
        const { email } = req.body;

        const existingUser  = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await User.create(req.body);
        
        // block password displaying
        user.password = undefined;

        res.status(201).json({
            message: 'User registered successfully',
            user
        });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


// User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        const isMatch = await User.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // create JWT token
        const payload = {
            id: user.id,
            username: user.name,
            role: user.role,
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // block password displaying
        user.password = undefined;

        res.json({
            message: 'Login successful',
            token,
            user
        });
    } catch {}
};


// Get current user profile
const checkCurrent = async (req, res) => {
  try {
    const user = req.user;
    user.password = undefined;
    
    res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { register, login, checkCurrent };