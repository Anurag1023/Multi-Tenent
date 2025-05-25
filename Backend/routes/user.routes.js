import express from "express";
import { verifyUserSession } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/rbac.js";
import { changeUserRole, listUsers, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

// List users: admin/manager only
router.get(
  "/",
  verifyUserSession,
  authorizeRoles("admin", "manager"),
  listUsers
);

// Change user role: admin only
router.patch(
  "/:id/role",
  verifyUserSession,
  authorizeRoles("admin"),
  changeUserRole
);

// Delete user: admin only
router.delete(
  "/:id",
  verifyUserSession,
  authorizeRoles("admin"),
  deleteUser
);

export default router;