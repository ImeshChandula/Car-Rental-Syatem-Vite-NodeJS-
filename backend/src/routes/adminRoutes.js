import express from 'express';
import USER_ROLES from '../enums/UserRoles.js';
import { authenticateUser, authorizeRoles } from "../middleware/authMiddleware.js";
import { deleteAdminById, getAdminById, getAllAdmins } from '../controllers/adminController.js';

const router = express.Router();

const owner = USER_ROLES.OWNER;
const manager = USER_ROLES.MANAGER;

//http://localhost:5000/api/admin

router.get("/getAll", authenticateUser, authorizeRoles(owner), getAllAdmins);
router.get("/get/:id", authenticateUser, authorizeRoles(owner), getAdminById);
router.delete("/delete/:id", authenticateUser, authorizeRoles(owner), deleteAdminById);

export default router;