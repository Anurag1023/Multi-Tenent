import express from "express";
import { getOrganizationDetails } from "../controllers/organization.controller.js";
import { verifyUserSession } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/me", verifyUserSession, getOrganizationDetails);

export default router;