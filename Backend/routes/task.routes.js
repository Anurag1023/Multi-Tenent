import express from "express";
import { verifyUserSession } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/rbac.js";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

// Create task: admin/manager only
router.post(
  "/",
  verifyUserSession,
  authorizeRoles("admin", "manager"),
  createTask
);

// Get all tasks: any logged-in user in org
router.get("/", verifyUserSession, getTasks);

// Update task status: all roles, but RBAC in controller
router.patch(
  "/:id/status",
  verifyUserSession,
  updateTaskStatus
);

// Delete task: admin only
router.delete(
  "/:id",
  verifyUserSession,
  authorizeRoles("admin"),
  deleteTask
);

export default router;