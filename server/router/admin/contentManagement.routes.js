import express from "express";
import {
  getSpecialties,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty,
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getHealthArticles,
  createHealthArticle,
  updateHealthArticle,
  deleteHealthArticle,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../controller/admin/contentManagement.controller.js";

const router = express.Router();

router.route("/specialties").get(getSpecialties).post(createSpecialty);
router
  .route("/specialties/:id")
  .put(updateSpecialty)
  .delete(deleteSpecialty);

router.route("/departments").get(getDepartments).post(createDepartment);
router
  .route("/departments/:id")
  .put(updateDepartment)
  .delete(deleteDepartment);

router.route("/faqs").get(getFaqs).post(createFaq);
router.route("/faqs/:id").put(updateFaq).delete(deleteFaq);

router.route("/articles").get(getHealthArticles).post(createHealthArticle);
router
  .route("/articles/:id")
  .put(updateHealthArticle)
  .delete(deleteHealthArticle);

router
  .route("/announcements")
  .get(getAnnouncements)
  .post(createAnnouncement);
router
  .route("/announcements/:id")
  .put(updateAnnouncement)
  .delete(deleteAnnouncement);

export default router;
