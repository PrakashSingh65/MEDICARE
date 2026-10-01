import express from "express";
import { handleUpload } from "../../middleware/handleUpload.middleware.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { authorizeRoles } from "../../middleware/role.middleware.js";
import {
  joinOrStartVideoConsultation,
  joinOrStartAudioConsultation,
  getPatientConsultationChat,
  sendPatientConsultationChat,
  shareConsultationDocument,
  getPatientConsultationHistory,
} from "../../controller/patient/patientConsultation.controller.js";

const router = express.Router();

router.use(authMiddleware, authorizeRoles("patient", "user", "admin"));

router.get("/consultations/history", getPatientConsultationHistory);
router.post("/consultations/:id/video", joinOrStartVideoConsultation);
router.post("/consultations/:id/audio", joinOrStartAudioConsultation);
router
  .route("/consultations/:id/chat")
  .get(getPatientConsultationChat)
  .post(sendPatientConsultationChat);
router.post("/consultations/:id/share-file", handleUpload, shareConsultationDocument);

export default router;
