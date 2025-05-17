const User = require('../models/User');
const { generateToken } = require("../utils/utils");
const transporter = require("../config/nodemailer");
require('dotenv').config();


//@desc     Register a new user
const register = async (req, res) => {
    try {
        const { name, email, password, phone, licenseNumber } = req.body;

        const existingUser  = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // generate a num between 1-100
        const index = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
        
        const userData = {
            name, 
            email, 
            password, 
            phone, 
            licenseNumber, 
            profilePicture: randomAvatar,
            role: 'customer',
        };

        // Create new user
        const user = await User.create(userData);

        // create JWT token
        const payload = {
            id: user.id,
            username: user.name,
            role: user.role,
        };

        generateToken(payload, res);
        
        // sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to System...!",
            text: `Your account has been created with email: ${email}`
        };

        const result = await transporter.sendMail(mailOptions);
        if (!result) {
            return res.status(400).json({ message: 'welcome email sending failed' });
        }

        // block password displaying
        user.password = undefined;

        res.status(201).json({ message: 'User registered successfully',user });
    } catch (error) {
        console.error('Registration error:', error.message);
        res.status(500).json({success: false, message: error.message });
    }
};


//@desc     User login
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

        generateToken(payload, res); 

        // block password displaying
        user.password = undefined;

        res.status(201).json({message: 'Login successful', user });
    } catch {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


//@desc     User logout
const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};


//@desc     Get current user profile
const checkCurrent = async (req, res) => {
  try {
    const user = req.user;
    user.password = undefined;
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { register, login, logout, checkCurrent };