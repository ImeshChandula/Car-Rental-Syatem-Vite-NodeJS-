
class User {
    constructor (id, data) {
        this.id = id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.phone = data.phone;
        this.licenseNumber = data.licenseNumber;
        this.profilePicture = data.profilePicture;
        this.role = data.role || 'customer'; // 'manager', 'owner'

        this.verifyOtp = data.verifyOtp || '';
        this.verifyOtpExpiredAt = data.verifyOtpExpiredAt || new Date().toISOString();
        this.isAccountVerified = data.isAccountVerified || false;
        this.resetOtp = data.resetOtp || '';
        this.resetOtpExpiredAt = data.resetOtpExpiredAt || new Date().toISOString();

        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    };
    
};



module.exports = User;