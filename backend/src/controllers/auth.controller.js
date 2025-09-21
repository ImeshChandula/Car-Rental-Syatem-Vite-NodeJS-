import AdminService from '../services/adminService.js';
import UserService from '../services/userService.js';
import sendWelcomeEmail from '../utils/sendWelcomeEmail.js';
import { generateToken, removeToken } from '../utils/jwtTokenManager.js';
import USER_ROLES from '../enums/UserRoles.js';

const userService = new UserService();
const adminService = new AdminService();

const registerAdmin = async (req, res) => {
    try {
        const { email, nic } = req.body;

        const adminByEmail  = await adminService.findByEmail(email);
        const adminByNIC  = await adminService.findByNIC(nic);
        const userByEmail  = await userService.findByEmail(email);

        if (adminByEmail || adminByNIC || userByEmail) {
            return res.status(400).json({ success: false, message: "Admin already exists with your email or NIC" });
        }

        // generate a num between 1-100
        const index = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
        
        const userData = {
            ...req.body,
            profilePicture: randomAvatar,
        };

        const admin = await adminService.create(userData);
        if (!admin) {
            return res.status(400).json({ success: false, message: "Admin registration failed" });
        }

        // send welcome email
        const result = await sendWelcomeEmail(email);
        if (!result) {
            return res.status(400).json({ message: "Welcome email sending failed" });
        }

        const { password, ...adminWithoutPassword } = admin;

        return res.status(201).json({ 
            success: true,
            message: "Admin registered successfully", 
            data: adminWithoutPassword 
        });
    } catch (error) {
        console.error("Admin Registration error: ", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const registerUser = async (req, res) => {
    try {
        const { email, nic } = req.body;

        const userByEmail  = await userService.findByEmail(email);
        const userByNIC  = await userService.findByNIC(nic);
        const adminByEmail  = await adminService.findByEmail(email);

        if (userByEmail || userByNIC || adminByEmail) {
            return res.status(400).json({ success: false, message: "Admin already exists with your email or NIC" });
        }

        // generate a num between 1-100
        const index = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;
        
        const userData = {
            ...req.body,
            profilePicture: randomAvatar,
        };

        const user = await userService.create(userData);
        if (!user) {
            return res.status(400).json({ success: false, message: "User registration failed" });
        }

        // send welcome email
        const result = await sendWelcomeEmail(email);
        if (!result) {
            return res.status(400).json({ message: "Welcome email sending failed" });
        }

        const { password, ...userWithoutPassword } = user;

        return res.status(201).json({ 
            success: true,
            message: "User registered successfully", 
            data: userWithoutPassword 
        });
    } catch (error) {
        console.error("User Registration error: ", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
    
        const admin = await adminService.findByEmail(email);
        const user = await userService.findByEmail(email);

        const account = user ?? admin;

        if (!account) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const isAdmin = [USER_ROLES.OWNER, USER_ROLES.MANAGER].includes(account.role);
        
        const isMatch = isAdmin 
            ? await adminService.comparePassword(password, account.password) 
            : await userService.comparePassword(password, account.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const validations = [
            { condition: !account.isAccountVerified, message: "Your account is not verified" },
            ...(isAdmin ? [{ condition: !account.isAccountAccepted, message: "Your account is not accepted by admin panel" }] : [])
        ];

        for (const validation of validations) {
            if (validation.condition) {
                return res.status(400).json({ success: false, message: validation.message });
            }
        }

        // create JWT token
        const payload = {
            id: isAdmin ? account.admin_id : account.user_id,
            username: account.name,
            role: account.role,
            isAccountVerified: account.isAccountVerified,
        };

        generateToken(payload, res); 

        const { password: accountPassword, ...adminWithoutPassword } = account;

        return res.status(200).json({ success: true, message: "Login successful", data: adminWithoutPassword });
    } catch (error) {
        console.error("Login error: ", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const logout = async (req, res) => {
    try {
        removeToken(res);
        
        return res.status(200).json({ success: true, message: "Logout successfully"});
    } catch (error) {
        console.error("Logout error: ", error.message);
        return res.status(500).json({ message: "Server Error" });
    }
};

const checkAuth = async (req, res) => {
    try {
        const loggedUser_id = req.user.id;

        const user = await userService.findById(loggedUser_id);
        const admin = await adminService.findById(loggedUser_id);

        const loggedUser = user ?? admin;

        if (!loggedUser) {
            return res.status(404).json({success: false, message: "Account not found:",});
        }

        const isAdmin = [USER_ROLES.OWNER, USER_ROLES.MANAGER].includes(loggedUser.role);

        const validations = [
            { condition: !loggedUser.isAccountVerified, message: "Your account is not verified" },
            ...(isAdmin ? [{ condition: !loggedUser.isAccountAccepted, message: "Your account is not accepted by admin panel" }] : [])
        ];

        for (const validation of validations) {
            if (validation.condition) {
                removeToken(res);
                return res.status(400).json({ success: false, message: validation.message });
            }
        }

        const loggedUserData = {
            id: isAdmin ? loggedUser.admin_id : loggedUser.user_id,
            username: loggedUser.name,
            role: loggedUser.role,
            isAccountVerified: loggedUser.isAccountVerified
        };
        
        return res.status(200).json({ success: true, message: "Authenticated user: ", data: loggedUserData});
    } catch (error) {
        console.error("Check Auth error: ", error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};


export { registerAdmin, registerUser, login, logout, checkAuth };