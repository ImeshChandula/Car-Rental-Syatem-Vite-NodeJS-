import express from 'express';
import USER_ROLES from '../enums/UserRoles.js';
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
import { getLoggedProfile, updateLoggedProfile, updateLoggedProfileImage } from '../controllers/commonUserController.js';
import { validateAccountUpdate } from '../validators/AccountValidator.js';

const router = express.Router();

const owner = USER_ROLES.OWNER;
const manager = USER_ROLES.MANAGER;

//http://localhost:5000/api/myProfile

router.get("/get", authenticateUser, getLoggedProfile);
router.patch("/update/account/:id", validateAccountUpdate, authenticateUser, updateLoggedProfile);
router.patch("/update/profileImage/:id", validateAccountUpdate, authenticateUser, updateLoggedProfileImage);

export default router;