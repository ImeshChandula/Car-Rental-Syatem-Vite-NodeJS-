import express from 'express';
import USER_ROLES from '../enums/UserRoles.js';
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
import { validateUserUpdate } from '../validators/authValidator.js';
import { deleteUserById, getAllUsers, getLoggedUserProfile, updateUserById, updateUserProfileImage }  from "../controllers/userController.js";

const router = express.Router();

const owner = USER_ROLES.OWNER;

//http://localhost:5000/api/users

router.get("/getLoggedUserProfile", authenticateUser, getLoggedUserProfile);
router.get("/getAllUsers", authenticateUser, authorizeRoles(owner), getAllUsers);
router.patch("/updateUserById/:id", validateUserUpdate, authenticateUser, updateUserById);
router.patch("/updateUserProfileImage/:id", validateUserUpdate, authenticateUser, updateUserProfileImage);
router.delete("/deleteUserById/:id", authenticateUser, deleteUserById);



export default router;