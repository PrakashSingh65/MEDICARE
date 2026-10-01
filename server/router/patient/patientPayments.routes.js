import express from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import {
  payConsultationFee,
  getPatientPaymentHistory,
  getPaymentInvoiceReceipt,
  getPatientRefundStatus,
  requestPaymentRefund,
} from "../../controller/patient/patientPayments.controller.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("patient", "user", "admin"));

router.post("/payments/pay", payConsultationFee);
router.get("/payments/history", getPatientPaymentHistory);
router.get("/payments/refunds", getPatientRefundStatus);
router.get("/payments/:id/invoice", getPaymentInvoiceReceipt);
router.post("/payments/:id/request-refund", requestPaymentRefund);

export default router;
