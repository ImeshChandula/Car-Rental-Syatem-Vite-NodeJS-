const express = require('express');
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");
const { validateUserData } = require("../middleware/validator");
const userController  = require("../controllers/userController");

const router = express.Router();

//http://localhost:5000

//@route   POST api/users/getLoggedUserProfile
//@desc    Get Logged User Profile
//@access  private 
router.get("/getLoggedUserProfile", authenticateUser, userController.getLoggedUserProfile);

//@route   POST api/users/getAllUsers
//@desc    Get all users
//@access  private - Admin only
router.get("/getAllUsers", authenticateUser, authorizeRoles("owner"), userController.getAllUsers);

//@route   PATCH api/users/updateUserById/:id
//@desc    Update user
//@access  private 
router.patch("/updateUserById/:id", validateUserData, authenticateUser, userController.updateUserById);

//@route   PATCH api/users/updateUserProfileImage/:id
//@desc    Update User Profile Image
//@access  private 
router.patch("/updateUserProfileImage/:id", validateUserData, authenticateUser, userController.updateUserProfileImage);

//@route   DELETE api/users/deleteUserById/:id
//@desc    Update user
//@access  private 
router.delete("/deleteUserById/:id", authenticateUser, userController.deleteUserById);



module.exports = router;