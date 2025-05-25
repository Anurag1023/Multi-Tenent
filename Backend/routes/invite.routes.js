import express from 'express';
import { verifyUserSession } from '../middleware/auth.middleware.js';
import { inviteUser } from '../controllers/invite.controller.js';

const router = express.Router();

router.post('/invite', verifyUserSession, inviteUser);

export default router;