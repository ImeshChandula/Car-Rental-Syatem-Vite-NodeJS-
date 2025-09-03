const SUPER_ADMIN_DATA = {
    EMAIL: process.env.SUPER_ADMIN_EMAIL || "admin@test.lk",
    PASSWORD: process.env.SUPER_ADMIN_PASSWORD || "admin@123",
    NAME: process.env.SUPER_ADMIN_NAME || "Owner",
    LICENSE_NUMBER: process.env.SUPER_ADMIN_LICENSE_NUMBER || "B2548524",
    PHONE: process.env.SUPER_ADMIN_PHONE || "+94552233555"
};

export default SUPER_ADMIN_DATA;