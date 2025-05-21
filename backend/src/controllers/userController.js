import UserService from '../services/userService.js';
import uploadImage from '../utils/uploadMedia.js';

//@desc     Get all users - Admin only
const getLoggedUserProfile = async (req, res) => {
    try {
        const loggedUser = req.user.id;

        const user = await UserService.findById(loggedUser);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // remove password
        user.password = undefined;

        res.status(200).json({msg: "User found:", user});
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

//@desc     Get all users - Admin only
const getAllUsers = async (req, res) => {
    try {
        const users = await UserService.findAll();
    
        const rolePriority = {
            'owner': 3,
            'manager': 2,
            'customer': 1
        };

        // Sort users by role priority (highest first)
        const sortedUsers = users.sort((a, b) => {
            const priorityA = rolePriority[a.role] || 0;
            const priorityB = rolePriority[b.role] || 0;
        
            // Sort by priority first (descending)
            if (priorityB !== priorityA) {
                return priorityB - priorityA;
            }
        
            // If same priority, sort alphabetically by name (ascending)
            return (a.name || '').localeCompare(b.name || '');
        });

        // Remove passwords from response
        const sanitizedUsers = sortedUsers.map(user => {
            user.password = undefined;
            return user;
        });
        
        res.status(200).json({count: sanitizedUsers.length, data: sanitizedUsers});
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


//@desc     Update user by user id
const updateUserById = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id;
        const currentUserId = req.user.id;

        // Only allow users to update their own profile unless admin
        if (req.user.role !== 'owner' && currentUserId !== userIdToUpdate) {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }
        
        // Don't allow role change unless admin
        if (req.body.role && req.user.role !== 'owner') {
            delete req.body.role;
        }
        
        const updatedUser = await UserService.updateById(req.params.id, req.body);
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Remove password from response
        updatedUser.password = undefined;
        
        res.status(201).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


//@desc     Update user profile image by user id
const updateUserProfileImage = async (req, res) => {
    try {
        const { profilePicture } = req.body;
        const userIdToUpdate = req.params.id;
        const currentUserId = req.user.id;

        if (currentUserId !== userIdToUpdate) {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }

        if (!profilePicture) {
            return res.status(400).json({msg: "Profile picture is required"});
        }

        // data object
        const updatedData = { };

        try {
            const imageUrl = await uploadImage(profilePicture);
            updatedData.profilePicture = imageUrl;
        } catch (error) {
            return res.status(400).json({error: "Failed to upload profile picture", message: error.message});
        }

        const updatedUser = await UserService.updateById(userIdToUpdate, updatedData);

        // remove password
        updatedUser.password = undefined;

        res.status(201).json({msg: "Profile picture updated successfully", updatedUser})
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};


//@desc     Delete user by user id - Admin only
const deleteUserById = async (req, res) => {
    try {
        const userIdToDelete = req.params.id;
        const currentUserId = req.user.id; // From auth middleware
        
        // Only allow users to update their own profile unless admin
        if (req.user.role !== 'owner' && currentUserId !== userIdToDelete) {
            return res.status(403).json({ message: 'Not authorized to delete this user' });
        }
        
        // Check if user exists before attempting deletion
        const userToDelete = await UserService.findById(userIdToDelete);
        if (!userToDelete) {
            return res.status(404).json({success: false, message: 'User not found'});
        }
        
        await UserService.deleteById(req.params.id);   
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


export {getAllUsers, updateUserById, deleteUserById, getLoggedUserProfile, updateUserProfileImage};