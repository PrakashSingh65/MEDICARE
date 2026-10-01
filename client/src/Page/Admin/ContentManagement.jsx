import React, { useState } from "react";
import {
  Layers,
  HeartPulse,
  Building,
  HelpCircle,
  FileText,
  Bell,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Sparkles,
  Stethoscope,
  X,
  Save,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import {
  getAdminContent,
  saveAdminContent,
  toggleSpecialtyStatus,
  toggleFaqStatus,
  toggleArticleStatus,
  toggleAnnouncementStatus,
} from "../../data/adminMockData";

export default function ContentManagement() {
  const [content, setContent] = useState(getAdminContent);
  const [activeTab, setActiveTab] = useState("specialties");

  const [isAddSpecialtyOpen, setIsAddSpecialtyOpen] = useState(false);
  const [newSpecialty, setNewSpecialty] = useState({ name: "", code: "", department: "", description: "" });

  const [isAddFaqOpen, setIsAddFaqOpen] = useState(false);
  const [newFaq, setNewFaq] = useState({ question: "", answer: "", category: "Appointments" });

  const [isAddArticleOpen, setIsAddArticleOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: "", author: "", category: "General", readTime: "5 min read", excerpt: "" });

  const [isAddAnnounceOpen, setIsAddAnnounceOpen] = useState(false);
  const [newAnnounce, setNewAnnounce] = useState({ title: "", message: "", priority: "Normal", targetAudience: "All" });

  const specialties = content.specialties || [];
  const departments = content.departments || [];
  const faqs = content.faqs || [];
  const articles = content.articles || [];
  const announcements = content.announcements || [];

  const handleToggleSpecialty = (id) => {
    const updated = toggleSpecialtyStatus(id);
    setContent(updated);
  };

  const handleToggleFaq = (id) => {
    const updated = toggleFaqStatus(id);
    setContent(updated);
  };

  const handleToggleArticle = (id) => {
    const updated = toggleArticleStatus(id);
    setContent(updated);
  };

  const handleToggleAnnounce = (id) => {
    const updated = toggleAnnouncementStatus(id);
    setContent(updated);
  };

  const handleCreateSpecialty = (e) => {
    e.preventDefault();
    if (!newSpecialty.name) return;
    const item = {
      id: `spec-${Date.now()}`,
      name: newSpecialty.name,
      code: newSpecialty.code || "SPEC",
      department: newSpecialty.department || "Clinical Medicine",
      doctorCount: 1,
      description: newSpecialty.description || "Comprehensive clinical specialty division.",
      active: true,
    };
    const updated = { ...content, specialties: [item, ...specialties] };
    saveAdminContent(updated);
    setContent(updated);
    setNewSpecialty({ name: "", code: "", department: "", description: "" });
    setIsAddSpecialtyOpen(false);
  };

  const handleCreateFaq = (e) => {
    e.preventDefault();
    if (!newFaq.question) return;
    const item = {
      id: `faq-${Date.now()}`,
      question: newFaq.question,
      answer: newFaq.answer,
      category: newFaq.category,
      order: faqs.length + 1,
      published: true,
    };
    const updated = { ...content, faqs: [item, ...faqs] };
    saveAdminContent(updated);
    setContent(updated);
    setNewFaq({ question: "", answer: "", category: "Appointments" });
    setIsAddFaqOpen(false);
  };

  const handleCreateArticle = (e) => {
    e.preventDefault();
    if (!newArticle.title) return;
    const item = {
      id: `art-${Date.now()}`,
      title: newArticle.title,
      slug: newArticle.title.toLowerCase().replace(/\s+/g, "-"),
      author: newArticle.author || "Medicare Editorial Board",
      category: newArticle.category,
      readTime: newArticle.readTime || "4 min read",
      publishedDate: new Date().toISOString().substring(0, 10),
      status: "Published",
      views: 0,
      excerpt: newArticle.excerpt || "Clinical editorial guideline published by Medicare.",
    };
    const updated = { ...content, articles: [item, ...articles] };
    saveAdminContent(updated);
    setContent(updated);
    setNewArticle({ title: "", author: "", category: "General", readTime: "5 min read", excerpt: "" });
    setIsAddArticleOpen(false);
  };

  const handleCreateAnnounce = (e) => {
    e.preventDefault();
    if (!newAnnounce.title) return;
    const item = {
      id: `ann-${Date.now()}`,
      title: newAnnounce.title,
      message: newAnnounce.message,
      priority: newAnnounce.priority,
      targetAudience: newAnnounce.targetAudience,
      startDate: new Date().toISOString().substring(0, 10),
      endDate: "2026-10-31",
      active: true,
    };
    const updated = { ...content, announcements: [item, ...announcements] };
    saveAdminContent(updated);
    setContent(updated);
    setNewAnnounce({ title: "", message: "", priority: "Normal", targetAudience: "All" });
    setIsAddAnnounceOpen(false);
  };

  return (
    <PanelLayout
      role="admin"
      title="Content Management"
      subtitle="Organize hospital clinical specialties, clinical departments, patient help FAQs, healthcare education articles, and network announcements."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("specialties")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === "specialties"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Specialties ({specialties.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("departments")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === "departments"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Building className="w-4 h-4" />
              <span>Departments ({departments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("faqs")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === "faqs"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>FAQs ({faqs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("articles")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === "articles"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Health Articles ({articles.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("announcements")}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                activeTab === "announcements"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Announcements ({announcements.length})</span>
            </button>
          </div>

          <div>
            {activeTab === "specialties" && (
              <button
                onClick={() => setIsAddSpecialtyOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Specialty</span>
              </button>
            )}

            {activeTab === "faqs" && (
              <button
                onClick={() => setIsAddFaqOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            )}

            {activeTab === "articles" && (
              <button
                onClick={() => setIsAddArticleOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Health Article</span>
              </button>
            )}

            {activeTab === "announcements" && (
              <button
                onClick={() => setIsAddAnnounceOpen(true)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Post Announcement</span>
              </button>
            )}
          </div>
        </div>

        {activeTab === "specialties" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialties.map((spec) => (
              <div
                key={spec.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                      <HeartPulse className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        spec.active
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {spec.active ? "Active" : "Disabled"}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-base mt-3 leading-snug">{spec.name}</h4>
                  <p className="text-[11px] text-purple-700 font-bold uppercase tracking-wider">{spec.code} • {spec.department}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{spec.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-600">{spec.doctorCount} Specialists</span>
                  <button
                    onClick={() => handleToggleSpecialty(spec.id)}
                    className="text-xs font-bold text-purple-600 hover:underline"
                  >
                    {spec.active ? "Disable" : "Enable"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "departments" && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">
                    <Building className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {dept.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">{dept.name}</h4>
                  <p className="text-xs text-purple-700 font-bold">{dept.code} • {dept.contactExtension}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <p className="flex justify-between">
                    <span className="text-slate-400">Head of Dept:</span>
                    <span className="font-bold text-slate-900">{dept.headDoctor}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Bed Capacity:</span>
                    <span className="font-bold text-slate-900">{dept.availableBeds} / {dept.totalBeds} available</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="font-bold text-slate-800">{dept.floor}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "faqs" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition space-y-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 uppercase tracking-wide">
                      {faq.category}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{faq.question}</h4>
                  </div>
                  <button
                    onClick={() => handleToggleFaq(faq.id)}
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                      faq.published
                        ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {faq.published ? "Published" : "Draft"}
                  </button>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-1">{faq.answer}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "articles" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {articles.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] uppercase">
                      {art.category}
                    </span>
                    <span>{art.readTime} • {art.views} views</span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-base leading-snug">{art.title}</h4>
                  <p className="text-xs text-purple-700 font-bold mt-1">By {art.author}</p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{art.excerpt}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Published: {art.publishedDate}</span>
                  <button
                    onClick={() => handleToggleArticle(art.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold border ${
                      art.status === "Published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {art.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "announcements" && (
          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                        ann.priority === "Urgent"
                          ? "bg-red-100 text-red-800 border-red-200"
                          : ann.priority === "High"
                          ? "bg-amber-100 text-amber-800 border-amber-200"
                          : "bg-sky-100 text-sky-800 border-sky-200"
                      }`}
                    >
                      {ann.priority} Priority
                    </span>
                    <span className="text-xs text-slate-400 font-bold">
                      Audience: <strong className="text-slate-700">{ann.targetAudience}</strong>
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{ann.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{ann.message}</p>
                  <p className="text-[11px] text-slate-400">
                    Active Window: {ann.startDate} to {ann.endDate}
                  </p>
                </div>

                <button
                  onClick={() => handleToggleAnnounce(ann.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition self-start sm:self-center ${
                    ann.active
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                      : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  {ann.active ? "Broadcasting Active" : "Disabled"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isAddSpecialtyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900">Add Medical Specialty</h3>
              <button onClick={() => setIsAddSpecialtyOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSpecialty} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specialty Name</label>
                <input
                  type="text"
                  value={newSpecialty.name}
                  onChange={(e) => setNewSpecialty({ ...newSpecialty, name: e.target.value })}
                  required
                  placeholder="e.g. Oncology, Ophthalmology"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Code</label>
                <input
                  type="text"
                  value={newSpecialty.code}
                  onChange={(e) => setNewSpecialty({ ...newSpecialty, code: e.target.value })}
                  placeholder="e.g. ONCO"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Parent Department</label>
                <input
                  type="text"
                  value={newSpecialty.department}
                  onChange={(e) => setNewSpecialty({ ...newSpecialty, department: e.target.value })}
                  placeholder="e.g. Comprehensive Cancer Care"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  value={newSpecialty.description}
                  onChange={(e) => setNewSpecialty({ ...newSpecialty, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSpecialtyOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Save Specialty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddFaqOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900">Add Portal FAQ</h3>
              <button onClick={() => setIsAddFaqOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateFaq} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newFaq.category}
                  onChange={(e) => setNewFaq({ ...newFaq, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                >
                  <option value="General">General</option>
                  <option value="Appointments">Appointments</option>
                  <option value="Billing">Billing</option>
                  <option value="Doctors">Doctors</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Question</label>
                <input
                  type="text"
                  value={newFaq.question}
                  onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Answer</label>
                <textarea
                  value={newFaq.answer}
                  onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddFaqOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddArticleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900">Add Health Article</h3>
              <button onClick={() => setIsAddArticleOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateArticle} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article Title</label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Author Specialist</label>
                <input
                  type="text"
                  value={newArticle.author}
                  onChange={(e) => setNewArticle({ ...newArticle, author: e.target.value })}
                  placeholder="e.g. Dr. Priya Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <input
                  type="text"
                  value={newArticle.category}
                  onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                  placeholder="e.g. Cardiology, Wellness"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brief Excerpt</label>
                <textarea
                  value={newArticle.excerpt}
                  onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddArticleOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Publish Article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddAnnounceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-base text-slate-900">Post Announcement</h3>
              <button onClick={() => setIsAddAnnounceOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAnnounce} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Headline</label>
                <input
                  type="text"
                  value={newAnnounce.title}
                  onChange={(e) => setNewAnnounce({ ...newAnnounce, title: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={newAnnounce.priority}
                    onChange={(e) => setNewAnnounce({ ...newAnnounce, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Audience</label>
                  <select
                    value={newAnnounce.targetAudience}
                    onChange={(e) => setNewAnnounce({ ...newAnnounce, targetAudience: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                  >
                    <option value="All">All Users</option>
                    <option value="Doctors">Doctors Only</option>
                    <option value="Patients">Patients Only</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message Body</label>
                <textarea
                  value={newAnnounce.message}
                  onChange={(e) => setNewAnnounce({ ...newAnnounce, message: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddAnnounceOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Broadcast Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PanelLayout>
  );
}
