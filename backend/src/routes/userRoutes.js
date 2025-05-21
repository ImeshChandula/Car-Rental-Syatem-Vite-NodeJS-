import express from 'express';
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
import { validateUserData } from "../middleware/validator.js";
import { deleteUserById, getAllUsers, getLoggedUserProfile, updateUserById, updateUserProfileImage }  from "../controllers/userController.js";

const router = express.Router();

//http://localhost:5000

//@route   POST api/users/getLoggedUserProfile
//@desc    Get Logged User Profile
//@access  private 
router.get("/getLoggedUserProfile", authenticateUser, getLoggedUserProfile);

//@route   POST api/users/getAllUsers
//@desc    Get all users
//@access  private - Admin only
router.get("/getAllUsers", authenticateUser, authorizeRoles("owner"), getAllUsers);

//@route   PATCH api/users/updateUserById/:id
//@desc    Update user
//@access  private 
router.patch("/updateUserById/:id", validateUserData, authenticateUser, updateUserById);

//@route   PATCH api/users/updateUserProfileImage/:id
//@desc    Update User Profile Image
//@access  private 
router.patch("/updateUserProfileImage/:id", validateUserData, authenticateUser, updateUserProfileImage);

//@route   DELETE api/users/deleteUserById/:id
//@desc    Update user
//@access  private 
router.delete("/deleteUserById/:id", authenticateUser, deleteUserById);



export default router;