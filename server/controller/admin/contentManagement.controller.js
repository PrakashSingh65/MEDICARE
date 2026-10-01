import {
  Specialty,
  Department,
  Faq,
  HealthArticle,
  Announcement,
} from "../../model/content.model.js";
import { recordAudit } from "../../utils/auditLogger.js";

export const getSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find().sort({ name: 1 });
    return res.status(200).json({ success: true, data: specialties });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.create(req.body);
    await recordAudit(req, {
      action: "CREATE_SPECIALTY",
      module: "content",
      targetType: "Specialty",
      targetId: specialty._id,
      details: { name: specialty.name, code: specialty.code },
    });
    return res.status(201).json({
      success: true,
      message: "Medical specialty created",
      data: specialty,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!specialty) {
      return res.status(404).json({ success: false, message: "Specialty not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_SPECIALTY",
      module: "content",
      targetType: "Specialty",
      targetId: specialty._id,
      details: req.body,
    });
    return res.status(200).json({
      success: true,
      message: "Specialty updated",
      data: specialty,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSpecialty = async (req, res) => {
  try {
    const specialty = await Specialty.findByIdAndDelete(req.params.id);
    if (!specialty) {
      return res.status(404).json({ success: false, message: "Specialty not found" });
    }
    await recordAudit(req, {
      action: "DELETE_SPECIALTY",
      module: "content",
      targetType: "Specialty",
      targetId: specialty._id,
      details: { name: specialty.name },
    });
    return res.status(200).json({ success: true, message: "Specialty deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });
    return res.status(200).json({ success: true, data: departments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const department = await Department.create(req.body);
    await recordAudit(req, {
      action: "CREATE_DEPARTMENT",
      module: "content",
      targetType: "Department",
      targetId: department._id,
      details: { name: department.name, code: department.code },
    });
    return res.status(201).json({
      success: true,
      message: "Department created",
      data: department,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_DEPARTMENT",
      module: "content",
      targetType: "Department",
      targetId: department._id,
      details: req.body,
    });
    return res.status(200).json({
      success: true,
      message: "Department updated",
      data: department,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ success: false, message: "Department not found" });
    }
    await recordAudit(req, {
      action: "DELETE_DEPARTMENT",
      module: "content",
      targetType: "Department",
      targetId: department._id,
      details: { name: department.name },
    });
    return res.status(200).json({ success: true, message: "Department deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getFaqs = async (req, res) => {
  try {
    const { category, isPublished } = req.query;
    const query = {};
    if (category) query.category = category;
    if (isPublished !== undefined) query.isPublished = isPublished === "true";

    const faqs = await Faq.find(query).sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: faqs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createFaq = async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    await recordAudit(req, {
      action: "CREATE_FAQ",
      module: "content",
      targetType: "Faq",
      targetId: faq._id,
      details: { question: faq.question },
    });
    return res.status(201).json({
      success: true,
      message: "FAQ created",
      data: faq,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_FAQ",
      module: "content",
      targetType: "Faq",
      targetId: faq._id,
      details: req.body,
    });
    return res.status(200).json({
      success: true,
      message: "FAQ updated",
      data: faq,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ success: false, message: "FAQ not found" });
    }
    await recordAudit(req, {
      action: "DELETE_FAQ",
      module: "content",
      targetType: "Faq",
      targetId: faq._id,
      details: { question: faq.question },
    });
    return res.status(200).json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getHealthArticles = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { summary: { $regex: search, $options: "i" } },
      ];
    }

    const articles = await HealthArticle.find(query).sort({ publishedAt: -1 });
    return res.status(200).json({ success: true, data: articles });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createHealthArticle = async (req, res) => {
  try {
    const slug =
      req.body.slug ||
      String(req.body.title || "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        `-${Date.now()}`;

    const article = await HealthArticle.create({
      ...req.body,
      slug,
      authorName: req.body.authorName || req.user?.username || "Medicare Editorial",
    });

    await recordAudit(req, {
      action: "CREATE_HEALTH_ARTICLE",
      module: "content",
      targetType: "HealthArticle",
      targetId: article._id,
      details: { title: article.title, status: article.status },
    });

    return res.status(201).json({
      success: true,
      message: "Health article created",
      data: article,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateHealthArticle = async (req, res) => {
  try {
    const article = await HealthArticle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!article) {
      return res.status(404).json({ success: false, message: "Health article not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_HEALTH_ARTICLE",
      module: "content",
      targetType: "HealthArticle",
      targetId: article._id,
      details: { title: article.title, status: article.status },
    });
    return res.status(200).json({
      success: true,
      message: "Health article updated",
      data: article,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteHealthArticle = async (req, res) => {
  try {
    const article = await HealthArticle.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: "Health article not found" });
    }
    await recordAudit(req, {
      action: "DELETE_HEALTH_ARTICLE",
      module: "content",
      targetType: "HealthArticle",
      targetId: article._id,
      details: { title: article.title },
    });
    return res.status(200).json({ success: true, message: "Health article deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAnnouncements = async (req, res) => {
  try {
    const { targetAudience, isActive } = req.query;
    const query = {};
    if (targetAudience) query.targetAudience = targetAudience;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const announcements = await Announcement.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create(req.body);
    await recordAudit(req, {
      action: "CREATE_ANNOUNCEMENT",
      module: "content",
      targetType: "Announcement",
      targetId: announcement._id,
      details: { title: announcement.title, targetAudience: announcement.targetAudience },
    });
    return res.status(201).json({
      success: true,
      message: "Announcement published",
      data: announcement,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }
    await recordAudit(req, {
      action: "UPDATE_ANNOUNCEMENT",
      module: "content",
      targetType: "Announcement",
      targetId: announcement._id,
      details: req.body,
    });
    return res.status(200).json({
      success: true,
      message: "Announcement updated",
      data: announcement,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    if (!announcement) {
      return res.status(404).json({ success: false, message: "Announcement not found" });
    }
    await recordAudit(req, {
      action: "DELETE_ANNOUNCEMENT",
      module: "content",
      targetType: "Announcement",
      targetId: announcement._id,
      details: { title: announcement.title },
    });
    return res.status(200).json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
