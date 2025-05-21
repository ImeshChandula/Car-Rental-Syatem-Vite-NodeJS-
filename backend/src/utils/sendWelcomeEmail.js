import transporter from '../config/nodemailer.js';
import dotenv from 'dotenv';

dotenv.config();

const sendWelcomeEmail = async (email) => {
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to System...!",
        text: `Your account has been created with email: ${email}`
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        console.error('Error sending welcome email:', error.message);
        return null;
    }
};

export default sendWelcomeEmail;
