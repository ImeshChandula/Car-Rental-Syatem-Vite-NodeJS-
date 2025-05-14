const User = require('../models/User');


// Get all users - Admin only
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
    
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
        
        res.json({count: sanitizedUsers.length, data: sanitizedUsers});
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// Update user
const updateUserById = async (req, res) => {
    try {
        const userIdToUpdate = req.params.id;
        const currentUserId = req.user.id;

        // Only allow users to update their own profile unless admin
        if (currentUserId !== 'owner' && currentUserId !== userIdToUpdate) {
            return res.status(403).json({ message: 'Not authorized to update this user' });
        }
        
        // Don't allow role change unless admin
        if (req.body.role && req.user.role !== 'owner') {
            delete req.body.role;
        }
        
        // Hash password if it's being updated
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
        
        const updatedUser = await User.updateById(req.params.id, req.body);
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Remove password from response
        updatedUser.password = undefined;
        
        res.json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Delete user - Admin only
const deleteUserById = async (req, res) => {
    try {
        const userIdToDelete = req.params.id;
        const currentUserId = req.user.id; // From auth middleware
        
        // Prevent users from deleting their own account
        if (userIdToDelete === currentUserId) {
            return res.status(403).json({success: false, message: 'You cannot delete your own account'});
        }
        
        // Check if user exists before attempting deletion
        const userToDelete = await User.findById(userIdToDelete);
        if (!userToDelete) {
            return res.status(404).json({success: false, message: 'User not found'});
        }
        
        await User.deleteById(req.params.id);   
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


module.exports = {getAllUsers, updateUserById, deleteUserById};