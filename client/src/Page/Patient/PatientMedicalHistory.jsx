import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Calendar,
  Pill,
  AlertTriangle,
  Activity,
  Stethoscope,
  Heart,
  User,
  CheckCircle2,
  UploadCloud,
  Download,
  FileCheck,
  Search,
  Filter,
  Eye,
  Plus,
  ArrowRight,
  ShieldCheck,
  ClipboardList,
  Sparkles
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import UploadMedicalDocumentModal from "../../components/panels/UploadMedicalDocumentModal";
import {
  getPatientRecords,
  uploadPatientMedicalDocument
} from "../../data/patientMockData";

export default function PatientMedicalHistory() {
  const [records, setRecords] = useState(getPatientRecords);
  const [activeSection, setActiveSection] = useState("timeline");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleUploadSuccess = (doc) => {
    const updated = uploadPatientMedicalDocument(doc);
    setRecords({ ...updated });
  };

  const handleSimulateDownload = (title) => {
    setDownloadSuccessToast(`Downloading encrypted copy of "${title}"...`);
    setTimeout(() => {
      setDownloadSuccessToast("");
    }, 3500);
  };

  const filteredTimeline = records.timeline?.filter((item) => {
    return (
      item.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  const filteredReports = records.diagnosticReports?.filter((rep) => {
    return (
      rep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rep.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }) || [];

  return (
    <PanelLayout
      role="patient"
      title="Medical Records, Lab Reports & Diagnoses"
      subtitle="Unified, tamper-proof electronic health records: clinical history timeline, diagnostic lab tests, uploaded documents, and chronic disease tracking."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {downloadSuccessToast && (
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-bold flex items-center gap-2.5 shadow-sm">
            <Download className="w-4 h-4 text-sky-600 animate-bounce" />
            <span>{downloadSuccessToast}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-600 text-white font-black flex items-center justify-center text-xl shadow-md">
              {records.patientInfo?.name?.charAt(0) || "A"}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-black text-slate-900">{records.patientInfo?.name}</h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800">
                  ID: {records.patientInfo?.id}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700">
                  Blood Group: {records.patientInfo?.bloodGroup}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                Age: {records.patientInfo?.age} yrs • Gender: {records.patientInfo?.gender} • BMI: {records.patientInfo?.bmi}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </button>

            <Link
              to="/patient/prescriptions"
              className="px-4 py-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Pill className="w-4 h-4 text-sky-600" />
              <span>Prescriptions</span>
            </Link>
          </div>
        </div>

        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveSection("timeline")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeSection === "timeline"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Consultation Encounters</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-100 text-sky-800">
              {records.timeline?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveSection("labs")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeSection === "labs"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Lab & Diagnostic Tests</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {records.diagnosticReports?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveSection("diagnoses")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeSection === "diagnoses"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Tracked Diagnoses</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800">
              {records.trackedDiagnoses?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveSection("uploads")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeSection === "uploads"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Uploaded Files</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-100 text-purple-800">
              {records.uploadedDocuments?.length || 0}
            </span>
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search medical records, doctor names, tests, or diagnoses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {activeSection === "timeline" && (
          <div className="space-y-4">
            {filteredTimeline.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-5 hover:border-sky-200 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 text-base">{item.event}</h3>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {item.specialty}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold">
                      Consultant: <span className="text-slate-800 font-bold">{item.doctor}</span>
                    </p>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <p className="font-bold text-slate-800">
                        Diagnosis: <span className="font-semibold text-slate-700">{item.diagnosis}</span>
                      </p>
                      <p className="text-slate-600 leading-relaxed">{item.notes}</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  {item.prescriptionId && (
                    <Link
                      to="/patient/prescriptions"
                      className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>View Rx</span>
                    </Link>
                  )}
                  <button
                    onClick={() => handleSimulateDownload(item.event)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                    title="Download Encounter Summary"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "labs" && (
          <div className="space-y-4">
            {filteredReports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-slate-900 text-sm">{rep.title}</h3>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            rep.status === "Normal"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}
                        >
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {rep.department} • Ordered by {rep.doctor} • {rep.testDate}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSimulateDownload(rep.title)}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-center"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download Report (PDF)</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3 rounded-l-xl">Parameter</th>
                        <th className="py-2.5 px-3">Result Value</th>
                        <th className="py-2.5 px-3">Reference Range</th>
                        <th className="py-2.5 px-3 rounded-r-xl">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold">
                      {rep.parameters?.map((param, pIdx) => (
                        <tr key={pIdx}>
                          <td className="py-2.5 px-3 text-slate-900">{param.name}</td>
                          <td className="py-2.5 px-3 font-black text-slate-800">{param.value}</td>
                          <td className="py-2.5 px-3 text-slate-500">{param.referenceRange}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                                param.status === "Normal"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-amber-50 text-amber-800"
                              }`}
                            >
                              {param.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                  <strong className="text-slate-800 font-bold block mb-0.5">Clinical Summary:</strong>
                  {rep.summary}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "diagnoses" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {records.trackedDiagnoses?.map((diag) => (
              <div
                key={diag.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">{diag.condition}</h3>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {diag.code}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">Onset Date: {diag.onsetDate}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                    {diag.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Attending Physician</span>
                    <span className="font-bold text-slate-800">{diag.physician}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Therapy</span>
                    <span className="font-semibold text-slate-700 leading-relaxed block">{diag.treatmentPlan}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
                  <span>Last Reviewed: {diag.lastAssessed}</span>
                  <Link to="/patient/consultation" className="text-sky-600 font-bold hover:underline">
                    Schedule Follow-up
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeSection === "uploads" && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-slate-900 text-base">Your Uploaded Clinical Files</h3>
                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-4 py-2 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload File</span>
                </button>
              </div>

              {records.uploadedDocuments?.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No documents uploaded yet.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {records.uploadedDocuments?.map((doc) => (
                    <div
                      key={doc.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                          <p className="text-xs text-slate-400">
                            {doc.category} • {doc.fileSize} • Uploaded on {doc.uploadDate}
                          </p>
                          {doc.notes && <p className="text-xs text-slate-600 mt-0.5">{doc.notes}</p>}
                        </div>
                      </div>

                      <button
                        onClick={() => handleSimulateDownload(doc.title)}
                        className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 self-start sm:self-center transition"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-500" />
                        <span>Download</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <UploadMedicalDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadSuccess}
      />
    </PanelLayout>
  );
}
