import AdminService from '../services/adminService.js';
import UserService from '../services/userService.js';
import USER_ROLES from '../enums/UserRoles.js';
import { uploadImage } from '../utils/storage/cloudinary/uploadMedia.js';

const userService = new UserService();
const adminService = new AdminService();


const getLoggedProfile = async (req, res) => {
    try {
        const loggedUser_id = req.user.id;

        const user = await userService.findById(loggedUser_id);
        const admin = await adminService.findById(loggedUser_id);

        const loggedUser = user ?? admin;

        if (!loggedUser) {
            return res.status(404).json({success: false, message: "Account not found:",});
        }

        const { password, ...userWithoutPassword } = loggedUser;

        return res.status(200).json({success: true, message: "Account details fetched successfully", data: userWithoutPassword});
    } catch (error) {
        console.error("Error fetching user profile: ", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateLoggedProfile = async (req, res) => {
    try {
        const loggedUser_id = req.user.id;
        const account_id = req.params.id;

        if (account_id !== loggedUser_id) {
            return res.status(403).json({success: false, message: "Access forbidden"});
        }

        const user = await userService.findById(loggedUser_id);
        const admin = await adminService.findById(loggedUser_id);

        const loggedUser = user ?? admin;

        if (!loggedUser) {
            return res.status(404).json({success: false, message: "Account not found"});
        }

        const updateData = { ...req.body };

        let updatedUser = null;
        const isAdmin = [USER_ROLES.OWNER, USER_ROLES.MANAGER].includes(loggedUser.role);
        if (isAdmin) {
            updatedUser = await adminService.updateById(loggedUser_id, updateData);
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "Failed to update account" });
            }
        } else {
            updatedUser = await userService.updateById(loggedUser_id, updateData);
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "Failed to update account" });
            }
        }
        
        const { password, ...accountWithoutPassword } = updatedUser;
        
        return res.status(201).json({ success: true, message: 'Account updated successfully', user: accountWithoutPassword });
    } catch (error) {
        console.error("Update account error: ", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const updateLoggedProfileImage = async (req, res) => {
    try {
        const account_id = req.params.id;
        const loggedUser_id = req.user.id;
        const { profilePicture } = req.body;

        if (account_id !== loggedUser_id) {
            return res.status(403).json({success: false, message: "Access forbidden"});
        }

        const user = await userService.findById(loggedUser_id);
        const admin = await adminService.findById(loggedUser_id);

        const loggedUser = user ?? admin;

        if (!loggedUser) {
            return res.status(404).json({success: false, message: "Account not found"});
        }

        const updateData = { };

        try {
            const imageUrl = await uploadImage(profilePicture);
            updateData.profilePicture = imageUrl;
        } catch (error) {
            return res.status(400).json({error: "Failed to upload profile picture", message: error.message});
        }

        let updatedUser = null;
        const isAdmin = [USER_ROLES.OWNER, USER_ROLES.MANAGER].includes(loggedUser.role);
        if (isAdmin) {
            updatedUser = await adminService.updateById(loggedUser_id, updateData);
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "Failed to update account" });
            }
        } else {
            updatedUser = await userService.updateById(loggedUser_id, updateData);
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "Failed to update account" });
            }
        }

        const { password, ...accountWithoutPassword } = updatedUser;

        return res.status(200).json({ success: true, message: "Profile picture updated successfully", data: accountWithoutPassword});
    } catch (error) {
        console.error("Update account error:", error.message);
        return res.status(500).send({ success: false, message: "Server Error" });
    }
};

const unVerifyAccount = async (req, res) => {
	try {
        const account_id = req.params.id;
        const loggedUser_id = req.user.id;

        if (account_id !== loggedUser_id) {
            return res.status(403).json({success: false, message: "Access forbidden"});
        }

        const user = await userService.findById(loggedUser_id);
        const admin = await adminService.findById(loggedUser_id);

        const loggedUser = user ?? admin;

        if (!loggedUser) {
            return res.status(404).json({success: false, message: "Account not found"});
        }

        const updateData = { isAccountVerified: false };

        let updatedUser = null;
        const isAdmin = [USER_ROLES.OWNER, USER_ROLES.MANAGER].includes(loggedUser.role);
        if (isAdmin) {
            updatedUser = await adminService.updateById(loggedUser_id, updateData);
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "Failed to un-verify account" });
            }
        } else {
            updatedUser = await userService.updateById(loggedUser_id, updateData);
            if (!updatedUser) {
                return res.status(404).json({ success: false, message: "Failed to un-verify account" });
            }
        }

        const { password, ...accountWithoutPassword } = updatedUser;

        return res.status(200).json({ success: true, message: "Account deleted successfully", data: accountWithoutPassword});
    } catch (error) {
        console.error("Method_name error:", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

export { getLoggedProfile, updateLoggedProfile, updateLoggedProfileImage, unVerifyAccount };