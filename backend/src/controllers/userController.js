import UserService from '../services/userService.js';

const userService = new UserService();

const getUserById = async (req, res) => {
    try {
        const user_id = req.params.id;

        const user = await userService.findById(user_id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found"});
        }

        // Remove password before sending user
        const { password, ...userWithoutPassword } = user;

        return res.status(200).json({ success: true, message: "Admin found: ", data: userWithoutPassword});
    } catch (error) {
        console.error("Get user by id error: ", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllUsers = async (req, res) => {
	try {
        const { isAccountVerified } = req.query;

        const filters = {};
        const filterDescription = [];

        if (isAccountVerified !== undefined) {
            const isBoolean = isAccountVerified === 'true';
            filters.isAccountVerified = isBoolean;
            filterDescription.push(`isAccountVerified: ${isAccountVerified}`);
        }
        
        const filteredUsers = Object.keys(filters).length > 0 
            ? await userService.findWithFilters(filters)
            : await userService.findAll();

        const sortedUsers = filteredUsers.length > 0
        ? filteredUsers.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
            })
            .map(user => {
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            })
        : [];

        return res.status(200).json({ 
            success: true, 
            message: "All users fetched successfully", 
            count: sortedUsers.length, 
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null,
            data: sortedUsers
        });
    } catch (error) {
        console.error("Get all admins error: ", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const user_id = req.params.id;

        const user = await userService.findById(user_id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found"});
        }
        
        await userService.deleteById(user_id); 

        return res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete Admin error: ", error);
        return res.status(500).json({ success: false, message: "Server Error"});
    }
};


export { getUserById,getAllUsers, deleteUserById };