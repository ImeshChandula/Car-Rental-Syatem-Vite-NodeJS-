import dotenv from 'dotenv';
import UserService from '../services/userService.js';

dotenv.config();
const userService = new UserService();

const createDefaultSuperAdmin = async () => {
    try {
        const email = process.env.SUPER_ADMIN_EMAIL;
        const existingSuperAdmin = await userService.findByEmail(email);

        if (!existingSuperAdmin) {
            const index = Math.floor(Math.random() * 100) + 1;
            const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;

            // create user data object
            const superAdminData  = {
                name: process.env.SUPER_ADMIN_NAME ,
                email: process.env.SUPER_ADMIN_EMAIL,
                password: process.env.SUPER_ADMIN_PASSWORD,
                phone: process.env.SUPER_ADMIN_PHONE,
                licenseNumber: process.env.SUPER_ADMIN_LICENSE_NUMBER,
                profilePicture: randomAvatar,
                isAccountVerified: true,
                role: 'owner',
            };

            await userService.create(superAdminData);
            console.log("✅ Default Super Admin created.");
        } else {
            console.log("ℹ️ Default Super Admin already exists.");
        }
    } catch (error) {
        console.error("❌ Error creating default Super Admin:", error);
    }
};


const initializeDefaultSuperAdmin = async () => {
    try {
        await createDefaultSuperAdmin();
        console.log("✅ Super admin initialization completed...");
    } catch (err) {
        console.error("❌ Failed to initialize super admin:", err.message);
    }
};

export {createDefaultSuperAdmin, initializeDefaultSuperAdmin};