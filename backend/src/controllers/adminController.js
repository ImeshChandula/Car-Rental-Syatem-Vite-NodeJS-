import USER_ROLES from '../enums/UserRoles.js';
import AdminService from '../services/adminService.js';

const adminService = new AdminService();

const getAdminById = async (req, res) => {
    try {
        const admin_id = req.params.id;

        const admin = await adminService.findById(admin_id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found"});
        }

        // Remove password before sending user
        const { password, ...adminWithoutPassword } = admin;

        return res.status(200).json({ success: true, message: "Admin found: ", data: adminWithoutPassword});
    } catch (error) {
        console.error("Get admin by id error: ", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getAllAdmins = async (req, res) => {
	try {
        const { isAccountAccepted, isAccountVerified } = req.query;

        const filters = {};
        const filterDescription = [];

        if (isAccountAccepted !== undefined) {
            const isBoolean = isAccountAccepted === 'true';
            filters.isAccountAccepted = isBoolean;
            filterDescription.push(`isAccountAccepted: ${isAccountAccepted}`);
        } 
        if (isAccountVerified !== undefined) {
            const isBoolean = isAccountVerified === 'true';
            filters.isAccountVerified = isBoolean;
            filterDescription.push(`isAccountVerified: ${isAccountVerified}`);
        }
        
        const filteredAdmins = Object.keys(filters).length > 0 
            ? await adminService.findWithFilters(filters)
            : await adminService.findAll();

        const rolePriority = {
            [USER_ROLES.OWNER]: 2,
            [USER_ROLES.MANAGER]: 1
        };

        const sortedAdmins = filteredAdmins.length > 0
        ? filteredAdmins.sort((a, b) => {
            const priorityA = rolePriority[a.role] || 0;
            const priorityB = rolePriority[b.role] || 0;

            if (priorityB !== priorityA) {
                return priorityB - priorityA;
            }

            return (a.firstName || '').localeCompare(b.firstName || '');
            })
            .map(admin => {
                const { password, ...adminWithoutPassword } = admin;
                return adminWithoutPassword;
            })
        : [];

        return res.status(200).json({ 
            success: true, 
            message: "All admins fetched successfully", 
            count: sortedAdmins.length, 
            filtered: filterDescription.length > 0 ? filterDescription.join(', ') : null,
            data: sortedAdmins
        });
    } catch (error) {
        console.error("Get all admins error: ", error.message);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteAdminById = async (req, res) => {
    try {
        const admin_id = req.params.id;

        const admin = await adminService.findById(admin_id);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found"});
        }
        
        await adminService.deleteById(admin_id); 

        return res.status(200).json({ success: true, message: "Admin deleted successfully" });
    } catch (error) {
        console.error("Delete Admin error: ", error);
        return res.status(500).json({ success: false, message: "Server Error"});
    }
};


export { getAdminById, getAllAdmins, deleteAdminById };