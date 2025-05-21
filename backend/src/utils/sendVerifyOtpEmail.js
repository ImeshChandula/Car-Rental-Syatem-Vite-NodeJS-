const transporter = require('../config/nodemailer');

const sendVerifyOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Account Verification OTP",
        text: `Your OTP is: ${otp}. Verify your account using this OTP.`,
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error("Error sending verification OTP email:", error.message);
        return null;
    }
};

const resetPasswordOtpEmail = async (email, otp) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Password Reset OTP",
        text: `Your OTP for resetting password is: ${otp}. Use this OTP to reset your Password.`
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error("Error sending verification OTP email:", error.message);
        return null;
    }
};

module.exports = {sendVerifyOtpEmail, resetPasswordOtpEmail};
