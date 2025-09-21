import UserService from '../services/userService.js';
import { OAuth2Client } from 'google-auth-library';
import { generateToken } from '../utils/jwtTokenManager.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const userService = new UserService();


// Register/Login with Google
const googleAuth = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Google token is required'
            });
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { 
            sub: googleId, 
                email, 
                name, 
                picture,
                email_verified 
        } = payload;

        // Check if email is verified by Google
        if (!email_verified) {
            return res.status(400).json({
                success: false,
                message: 'Google email is not verified'
            });
        }

        // Check if user already exists
        let user = await userService.findByEmail(email);

        if (user) {
            // User exists - this is a login
            // Update user with Google info if not already set
            const updateData = {};
                
            if (!user.googleId) {
                updateData.googleId = googleId;
            }
                
            if (!user.profilePicture && picture) {
                updateData.profilePicture = picture;
            }

            if (!user.isAccountVerified) {
                updateData.isAccountVerified = true; // Google accounts are pre-verified
            }

            // Update if there are changes
            if (Object.keys(updateData).length > 0) {
                user = await userService.updateById(user.id, updateData);
            }

            // Generate JWT token
            const payload = {
                id: user.id,
                username: user.name,
                role: user.role,
                isAccountVerified: user.isAccountVerified,
            };
            
            generateToken(payload, res);

            const { password, ...accountWithoutPassword } = user;

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: accountWithoutPassword
            });
        } else {
            // User doesn't exist - this is a registration
            // generate a num between 1-100
            const index = Math.floor(Math.random() * 100) + 1;
            const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
        
            const userData = {
                googleId,
                name,
                email,
                password: '', // No password needed for Google auth
                phone: '', // Will be updated later if needed
                nic: '', // Will be updated later if needed
                profilePicture: picture || randomAvatar,
                isAccountVerified: true, // Google accounts are pre-verified
            };

            // Create new user
            const user = await userService.create(userData);

            // Generate JWT token
            const payload = {
                id: user.id,
                username: user.name,
                role: user.role,
                isAccountVerified: user.isAccountVerified,
            };

            generateToken(payload, res);

            const { password, ...accountWithoutPassword } = user;

            return res.status(200).json({
                success: true,
                message: 'Registration successful',
                data: accountWithoutPassword
            });
        }
    } catch (error) {
        console.error('Google Auth Error:', error);

        if (error.message.includes('Token used too late') || 
            error.message.includes('Invalid token signature')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired Google token'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Internal server error during Google authentication'
        });
    }
};

// Link Google account to existing user (optional)
const linkGoogleAccount = async (req, res) => {
    try {
        const { token } = req.body;
        const userId = req.user.id; // From JWT middleware

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Google token is required'
            });
        }

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, picture, email_verified } = payload;

        if (!email_verified) {
            return res.status(400).json({
                success: false,
                message: 'Google email is not verified'
            });
        }

        // Get current user
        const user = await userService.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if Google account is already linked to another user
        const existingGoogleUser = await userService.findByEmail(email);
        if (existingGoogleUser && existingGoogleUser.id !== userId) {
            return res.status(400).json({
                success: false,
                message: 'This Google account is already linked to another user'
            });
        }

        // Update user with Google info
        const updateData = {
            googleId,
            profilePicture: picture || user.profilePicture,
            isAccountVerified: true
        };

        const updatedUser = await userService.updateById(userId, updateData);

        const { password, ...accountWithoutPassword } = updatedUser;
        
        return res.status(200).json({
            success: true,
            message: 'Google account linked successfully',
            data: accountWithoutPassword
        });

    } catch (error) {
        console.error('Link Google Account Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while linking Google account'
        });
    }
};

// Unlink Google account (optional)
const unlinkGoogleAccount = async (req, res) => {
    try {
        const userId = req.user.id; // From JWT middleware

        const user = await userService.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.googleId) {
            return res.status(400).json({
                success: false,
                message: 'No Google account linked to this user'
            });
        }

        // Check if user has a password (so they can still login)
        if (!user.password || user.password === '') {
            return res.status(400).json({
                success: false,
                message: 'Cannot unlink Google account. Please set a password first.'
            });
        }

        // Remove Google ID
        const updatedUser = await userService.updateById(userId, {
            googleId: ''
        });

        const { password, ...accountWithoutPassword } = updatedUser;

        return res.status(200).json({
            success: true,
            message: 'Google account unlinked successfully',
            data: accountWithoutPassword
        });

    } catch (error) {
        console.error('Unlink Google Account Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error while unlinking Google account'
        });
    }
};

export { googleAuth, linkGoogleAccount, unlinkGoogleAccount};