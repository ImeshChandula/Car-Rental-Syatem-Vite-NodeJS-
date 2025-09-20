const SUPER_ADMIN_DATA = {
    EMAIL: process.env.SUPER_ADMIN_EMAIL || "superadmin@test.lk",
    PASSWORD: process.env.SUPER_ADMIN_PASSWORD || "admin@123",
    NAME: process.env.SUPER_ADMIN_NAME || "Business Owner",
    NIC: process.env.SUPER_ADMIN_NIC || "200010102222",
    PHONE: process.env.SUPER_ADMIN_PHONE || "+94552233555"
};

export default SUPER_ADMIN_DATA;