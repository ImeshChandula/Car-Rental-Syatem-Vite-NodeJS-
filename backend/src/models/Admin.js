
class Admin {
    constructor (id, data) {
        this.admin_id = id;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.phone = data.phone;
        this.nic = data.nic;
        this.profilePicture = data.profilePicture;
        this.role = data.role;
        this.googleId = data.googleId;
        this.isAccountAccepted = data.isAccountAccepted;

        this.verifyOtp = data.verifyOtp;
        this.verifyOtpExpiredAt = data.verifyOtpExpiredAt;
        this.isAccountVerified = data.isAccountVerified;
        this.resetOtp = data.resetOtp;
        this.resetOtpExpiredAt = data.resetOtpExpiredAt;

        this.created_at = data.created_at;
        this.updated_at = data.updated_at;
    };
    
};

export default Admin;