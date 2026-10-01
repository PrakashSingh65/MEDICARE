import express from "express";
import { getDashboardStats } from "../../controller/admin/dashboard.controller.js";

const router = express.Router();

router.get("/dashboard", getDashboardStats);
router.get("/", getDashboardStats);

export default router;
