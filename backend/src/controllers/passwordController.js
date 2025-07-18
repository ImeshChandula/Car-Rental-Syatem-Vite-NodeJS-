import UserService from '../services/userService.js';
import sendOtp from '../utils/sendOtp.js';

const userService = new UserService();

//@desc     Send verification OTP to the user email
const sendVerifyOtp = async (req, res) => {
    try {
        const {email} = req.body;

        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(400).json({success: false, message: "User not found"});
        }
        
        if (user.isAccountVerified) {
            return res.status(400).json({success: false, message: "User already verified"});
        }

        // create otp
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        
        const userData = {};
        
        userData.verifyOtp = otp;
        userData.verifyOtpExpiredAt = new Date(Date.now() + 2.5 * 60 * 1000).toISOString(); // expires at 2 minutes 30 seconds from now

        const updatedUser = await userService.updateById(user.id, userData);
        if (!updatedUser) {
            return res.status(400).json({success: false, message: "OTP creation failed"});
        }

        const mailData = {
            to: updatedUser.email,
            subject: "Account Verification OTP",
            otp: otp,
            time: "2 mins 30 seconds"
        };

        const mailAction = "verify";

        const result = await sendOtp(mailData, mailAction);
        if (!result) {
            return res.status(400).json({ success: false, message: 'Verification OTP sending failed' });
        }

        res.status(200).json({success: true, message: "Verification OTP sent to email"});
    } catch (error) {
        console.error('Send Verify OTP error:', error.message);
        res.status(500).json({success: false, message: error.message });
    }
};


//@desc     Verify email by otp
const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(400).json({success: false, message: "User not found"});
        }

        const userId = user.id;
        if (!userId || !otp) {
            return res.status(400).json({success: false, message: "Missing email or OTP"});
        }

        if (user.isAccountVerified) {
            return res.status(400).json({success: false, message: "Your gmail has been already verified"});
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

        await userService.updateById(userId, updateUserData);

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

        const user = await userService.findByEmail(email);
        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        // create otp
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        
        const userData = {};
        
        userData.resetOtp = otp;
        userData.resetOtpExpiredAt = new Date(Date.now() + 2.5 * 60 * 1000).toISOString(); // expires at 2 minutes 30 seconds from now

        const updatedUser = await userService.updateById(user.id, userData);
        if (!updatedUser) {
            return res.status(400).json({success: false, message: "OTP creation failed"});
        }

        const mailData = {
            to: updatedUser.email,
            subject: "Password Reset OTP",
            otp: otp,
            time: "2 mins 30 seconds"
        };

        const mailAction = "reset";

        const result = await sendOtp(mailData, mailAction);
        if (!result) {
            return res.status(400).json({ success: false, message: 'Verification OTP sending failed' });
        }

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

        const user = await userService.findByEmail(email);
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

        await userService.updateById(user.id, updateUserData);

        res.status(201).json({success: true, message: "Password has been reset successfully"})
    } catch (error) {
        console.error('Reset password error:', error.message);
        res.status(500).json({success: false, message: error.message });
    }
};



export {sendVerifyOtp, verifyEmail, forgotPassword, resetPassword}