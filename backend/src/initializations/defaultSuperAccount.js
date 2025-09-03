import SUPER_ADMIN_DATA from '../data/SuperAdmin.js';
import USER_ROLES from '../enums/UserRoles.js';
import UserService from '../services/userService.js';


const userService = new UserService();

const createDefaultSuperAdmin = async () => {
    try {
        const email = SUPER_ADMIN_DATA.EMAIL;
        const existingSuperAdmin = await userService.findByEmail(email);

        if (!existingSuperAdmin) {
            const index = Math.floor(Math.random() * 100) + 1;
            const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`;

            // create user data object
            const superAdminData  = {
                name: SUPER_ADMIN_DATA.NAME ,
                email: SUPER_ADMIN_DATA.EMAIL,
                password: SUPER_ADMIN_DATA.PASSWORD,
                phone: SUPER_ADMIN_DATA.PHONE,
                licenseNumber: SUPER_ADMIN_DATA.LICENSE_NUMBER,
                profilePicture: randomAvatar,
                isAccountVerified: true,
                role: USER_ROLES.OWNER,
            };

            await userService.create(superAdminData);
            console.log("✅ Default Account created.");
        } else {
            console.log("✅ Default Account already exists.");
        }
    } catch (error) {
        console.error("❌ Error creating default Account:", error);
    }
};


const initializeDefaultSuperAdmin = async () => {
    try {
        await createDefaultSuperAdmin();
        console.log("✅ Default Account initialization completeD...");
    } catch (err) {
        console.error("❌ Failed to initialize Default Account:", err.message);
    }
};

export {createDefaultSuperAdmin, initializeDefaultSuperAdmin};