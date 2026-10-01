import express from "express";
import {
  startVideoConsultation,
  endVideoConsultation,
  getConsultationById,
  updateConsultationDetails,
  getConsultationChatMessages,
  sendConsultationChatMessage,
} from "../../controller/doctor/doctorConsultation.controller.js";

const router = express.Router();

router.post("/start-video", startVideoConsultation);
router.patch("/:id/end-video", endVideoConsultation);
router.get("/:id", getConsultationById);
router.put("/:id/notes", updateConsultationDetails);
router
  .route("/:id/chat")
  .get(getConsultationChatMessages)
  .post(sendConsultationChatMessage);

export default router;
