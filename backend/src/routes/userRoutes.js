import express from 'express';
import USER_ROLES from '../enums/UserRoles.js';
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
import { deleteUserById, getAllUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

const owner = USER_ROLES.OWNER;
const manager = USER_ROLES.MANAGER;

//http://localhost:5000/api/user

router.get("/getAll", authenticateUser, authorizeRoles(owner), getAllUsers);
router.get("/get/:id", authenticateUser, authorizeRoles(owner), getUserById);
router.delete("/delete/:id", authenticateUser, authorizeRoles(owner), deleteUserById);

export default router;