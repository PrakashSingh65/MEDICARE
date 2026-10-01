import React, { useState } from "react";
import {
  FolderOpen,
  UploadCloud,
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Eye,
  Plus,
  Edit,
  User,
  Activity,
  Calendar,
  X,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import ReportInterpretationModal from "../../components/panels/ReportInterpretationModal";
import {
  getDoctorReports,
  getDoctorPatients,
  addDoctorReport,
  updateReportInterpretation,
} from "../../data/doctorMockData";

export default function DoctorReports() {
  const [reports, setReports] = useState(getDoctorReports);
  const patients = getDoctorPatients();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadPatientId, setUploadPatientId] = useState(patients[0]?.id || "pat-1");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState("Cardiovascular Telemetry");
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().substring(0, 10));
  const [uploadNotes, setUploadNotes] = useState("");

  const [selectedReportForNotes, setSelectedReportForNotes] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);

  const handleOpenNotes = (report) => {
    setSelectedReportForNotes(report);
    setIsNotesModalOpen(true);
  };

  const handleSaveNotes = (reportId, notes) => {
    const updated = updateReportInterpretation(reportId, notes);
    setReports(updated);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;
    const pat = patients.find((p) => p.id === uploadPatientId) || patients[0];
    const newReport = {
      patientId: pat.id,
      patientName: pat.name,
      reportTitle: uploadTitle,
      reportType: uploadType,
      date: uploadDate,
      uploadedBy: "Dr. Priya Sharma",
      interpretationNotes: uploadNotes,
    };
    const updated = addDoctorReport(newReport);
    setReports(updated);
    setUploadTitle("");
    setUploadNotes("");
    setIsUploadModalOpen(false);
  };

  const filteredReports = reports.filter((rep) => {
    const matchesSearch =
      rep.reportTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.reportType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || rep.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PanelLayout
      role="doctor"
      title="Medical Reports & Diagnostic Charts"
      subtitle="Upload patient clinical reports, view telemetry and lab panels, and attach expert doctor interpretations and treatment notes."
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports by title, patient, or type..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Interpreted">Interpreted</option>
                <option value="Pending Review">Pending Review</option>
              </select>
            </div>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Report</span>
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filteredReports.map((report) => {
            const isInterpreted = report.status === "Interpreted";

            return (
              <div
                key={report.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md hover:border-emerald-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{report.reportTitle}</h4>
                        <p className="text-xs text-purple-700 font-bold">{report.reportType}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                        isInterpreted
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : "bg-amber-100 text-amber-800 border-amber-200"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600 mt-3">
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Patient:</span>
                      <span className="font-bold text-slate-900">{report.patientName}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Report Date:</span>
                      <span className="font-semibold text-slate-800">{report.date}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400 font-medium">Diagnostic Lab:</span>
                      <span className="text-slate-700">{report.uploadedBy}</span>
                    </p>
                  </div>

                  <div className="mt-3">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                      Doctor Clinical Interpretation:
                    </span>
                    {report.interpretationNotes ? (
                      <p className="text-xs text-slate-700 leading-relaxed bg-emerald-50/60 p-3 rounded-xl border border-emerald-100">
                        {report.interpretationNotes}
                      </p>
                    ) : (
                      <p className="text-xs text-amber-700 italic bg-amber-50/60 p-3 rounded-xl border border-amber-100">
                        No clinical notes added yet. Click Add Interpretation to record findings.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenNotes(report)}
                    className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>{report.interpretationNotes ? "Edit Interpretation" : "Add Interpretation"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-extrabold text-slate-800 text-lg">No medical reports found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              No diagnostic reports match your active search keyword or review status filter.
            </p>
          </div>
        )}
      </div>

      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden p-6 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Upload Medical Diagnostic Report</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Select Patient</label>
                <select
                  value={uploadPatientId}
                  onChange={(e) => setUploadPatientId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}y, {p.gender})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Report Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  required
                  placeholder="e.g. 12-Lead ECG, Fasting Lipid Profile"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Diagnostic Category</label>
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800"
                >
                  <option value="Cardiovascular Telemetry">Cardiovascular Telemetry</option>
                  <option value="Electrophysiology">Electrophysiology (ECG/Holter)</option>
                  <option value="Biochemistry">Biochemistry & Blood Panel</option>
                  <option value="Radiology & Doppler">Radiology & Ultrasound Doppler</option>
                  <option value="General Pathology">General Pathology</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Report Date</label>
                <input
                  type="date"
                  value={uploadDate}
                  onChange={(e) => setUploadDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Preliminary Interpretation / Findings</label>
                <textarea
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  rows={3}
                  placeholder="Clinical observations or diagnostic findings..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
                >
                  Upload & Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ReportInterpretationModal
        report={selectedReportForNotes}
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        onSave={handleSaveNotes}
      />
    </PanelLayout>
  );
}
