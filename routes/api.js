import * as userController from "../src/controller/userController.js";
import express from "express";
import {authenticateUser, isAdmin} from "../src/middleware/authMiddleware.js";
const router = express.Router();

router.post('/register', userController.Registration);
router.get('/login', userController.login);
router.get('/read-profile', authenticateUser, userController.readProfile);
router.put('/update-profile', authenticateUser, userController.updateProfile);

router.get('/all-user-profile', authenticateUser, isAdmin, userController.allUserprofile);
router.delete('/delete-user/:id', authenticateUser, isAdmin, userController.deleteUser);
router.get('/logout', authenticateUser, userController.logout);


export default router;