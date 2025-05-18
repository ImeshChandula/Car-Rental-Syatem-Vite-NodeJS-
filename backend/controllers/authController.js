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


//@desc     Send verification OTP to the user email
const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({success: false, msg: "user not found"});
        } else if (user.isAccountVerified) {
            return res.status(400).json({success: false, msg: "user already verified"});
        }

        // create otp
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        
        const userData = {};
        
        userData.verifyOtp = otp;
        userData.verifyOtpExpiredAt = new Date(Date.now() + 2.5 * 60 * 1000).toISOString(); // expires at 2 minutes 30 seconds from now

        const updatedUser = await User.updateById(userId, userData);
        if (!updatedUser) {
            return res.status(400).json({success: false, msg: "OTP creation failed"});
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: updatedUser.email,
            subject: "Account Verification OTP",
            text: `Your OTP is: ${otp}. Verify your account using this OTP.`
        };

        const result = await transporter.sendMail(mailOptions);
        if (!result) {
            return res.status(400).json({ message: 'Verification OTP sending failed' });
        }

        res.status(200).json({success: true, msg: "Verification OTP sent to email"});
    } catch (error) {
        console.error('Send Verify OTP error:', error.message);
        res.status(500).json({success: false, message: error.message });
    }
};


//@desc     Verify email by otp
const verifyEmail = async (req, res) => {
    try {
        const userId = req.user.id;
        const { otp } = req.body;

        if (!userId || !otp) {
            return res.status(400).json({success: false, message: "Missing UserID or OTP"});
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({success: false, message: "user not found"});
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.status(400).json({success: false, message: "Invalid OTP"});
        }

        if (user.verifyOtpExpiredAt < new Date().toISOString()) {
            return res.status(400).json({success: false, message: "OTP Expired"});
        }

        const updateUserData = {
            isAccountVerified: true,
            verifyOtp: '',
            verifyOtpExpiredAt: new Date().toISOString(),
        };

        await User.updateById(userId, updateUserData);

        res.status(200).json({success: true, message: "Email verified Successfully"});
    } catch (error) {
        console.error('Sending otp error:', error.message);
        res.status(500).json({success: false, message: error.message });
    }
};


//@desc     Get otp to reset password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({success: false, message: "Email is required"});
        }

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        // create otp
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        
        const userData = {};
        
        userData.resetOtp = otp;
        userData.resetOtpExpiredAt = new Date(Date.now() + 2.5 * 60 * 1000).toISOString(); // expires at 2 minutes 30 seconds from now

        const updatedUser = await User.updateById(user.id, userData);
        if (!updatedUser) {
            return res.status(400).json({success: false, msg: "OTP creation failed"});
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: updatedUser.email,
            subject: "Password Reset OTP",
            text: `Your OTP for resetting password is: ${otp}. Use this OTP to reset your Password.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({success: true, message: "Reset password OTP sent to your email"});
    } catch (error) {
        console.error('Send Reset OTP error:', error.message);
        res.status(500).json({success: false, message: error.message });
    }
};


//@desc     Reset password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({success: false, message: "Email, OTP, Password are required"});
        }

        const user = await User.findByEmail(email);
        if(!user) {
            return res.status(404).json({success: false, message: "User not available"});
        }

        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.status(400).json({success: false, message: "Invalid OTP"});
        }

        if (user.resetOtpExpiredAt < new Date().toISOString()){
            return res.status(400).json({success: false, message: "OTP Expired"});
        }

        const updateUserData = {
            password: newPassword,
            resetOtp: '',
            resetOtpExpiredAt: new Date().toISOString(),
        };

        await User.updateById(user.id, updateUserData);

        res.status(201).json({success: true, message: "Password has been reset successfully"})
    } catch (error) {
        console.error('Reset password error:', error.message);
        res.status(500).json({success: false, message: error.message });
    }
};


module.exports = { 
    register, 
    login, 
    logout, 
    checkCurrent, 
    sendVerifyOtp, 
    verifyEmail,
    forgotPassword,
    resetPassword
};