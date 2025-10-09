import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import AdminService from "../services/adminService.js";
import UserService from "../services/userService.js";
import USER_ROLES from "../enums/UserRoles.js";

const adminService = new AdminService();
const userService = new UserService();

// Configure Local Strategy
passport.use(
    new LocalStrategy(
        {usernameField: "email"}, // Options object
        async (email, password, done) => { // Strategy function
            try {
                const user = await userService.findByEmail(email);
                const admin = await adminService.findByEmail(email);

                const userAccount = user ?? admin;

                if (!userAccount) {
                    return done(null, false, { message: "Invalid credentials"});
                }

                const isAdmin = [USER_ROLES.OWNER, USER_ROLES.MANAGER].includes(userAccount.role);

                const isMatch = isAdmin 
                    ? await adminService.comparePassword(password, userAccount.password) 
                    : await userService.comparePassword(password, userAccount.password);

                if (isMatch) {
                    return done(null, userAccount);
                } else {
                    return done(null, false, { message: "Invalid credentials"});
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

// Serialize user for session
passport.serializeUser((user, done) => {
    // Store user ID and role in session
    done(null, { id: user.user_id ?? user.admin_id, role: user.role });
});

// Deserialize user from session
passport.deserializeUser(async (sessionData, done) => {
    try {
        const isAdmin = [USER_ROLES.OWNER, USER_ROLES.MANAGER].includes(sessionData.role);
        
        let user;
        if (isAdmin) {
            user = await adminService.findById(sessionData.id);
        } else {
            user = await userService.findById(sessionData.id);
        }

        if (!user) {
            return done(null, false);
        }

        done(null, user);
    } catch (error) {
        done(error);
    }
});