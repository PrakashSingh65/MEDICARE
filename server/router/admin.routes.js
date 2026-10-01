import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

import dashboardRoutes from "./admin/dashboard.routes.js";
import doctorManagementRoutes from "./admin/doctorManagement.routes.js";
import patientManagementRoutes from "./admin/patientManagement.routes.js";
import appointmentManagementRoutes from "./admin/appointmentManagement.routes.js";
import paymentManagementRoutes from "./admin/paymentManagement.routes.js";
import contentManagementRoutes from "./admin/contentManagement.routes.js";
import systemManagementRoutes from "./admin/systemManagement.routes.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("admin", "sub_admin"));

router.use("/", dashboardRoutes);
router.use("/doctors", doctorManagementRoutes);
router.use("/patients", patientManagementRoutes);
router.use("/appointments", appointmentManagementRoutes);
router.use("/payments", paymentManagementRoutes);
router.use("/content", contentManagementRoutes);
router.use("/system", systemManagementRoutes);

export default router;
