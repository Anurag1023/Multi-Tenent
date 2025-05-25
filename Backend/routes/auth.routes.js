import express from 'express';
import { login, logout, register, OrganizationLogin, OrganizationRegister, checkAuth } from '../controllers/auth.controller.js';
import { verifyUserSession } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.post('/organizationLogin',verifyUserSession, OrganizationLogin);
router.post('/organizationRegister', verifyUserSession, OrganizationRegister);
router.get('/check-auth', verifyUserSession, checkAuth);

export default router;