import React, { useState } from "react";
import { X, UploadCloud, FileText, CheckCircle2 } from "lucide-react";

export default function UploadMedicalDocumentModal({ isOpen, onClose, onUpload }) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Laboratory Report");
  const [fileSize, setFileSize] = useState("1.8 MB");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const doc = {
      title,
      category,
      fileSize: "1.8 MB",
      notes,
    };
    onUpload(doc);
    setTitle("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 bg-gradient-to-r from-sky-800 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
              <UploadCloud className="w-5 h-5 text-sky-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg leading-tight">Upload Medical Document</h3>
              <p className="text-xs text-sky-200 font-medium">Add reports, lab panels, or scans</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">Document / Report Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. 12-Lead ECG, Blood Chemistry Panel"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">Report Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Laboratory Report">Laboratory Report</option>
              <option value="Cardiology Imaging">Cardiology Imaging (Echo/Angio)</option>
              <option value="Diagnostic ECG">Diagnostic ECG / Holter</option>
              <option value="Radiology">Radiology & X-Ray / CT / MRI</option>
              <option value="Discharge Summary">Discharge Summary / Clinical Notes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">Select File (PDF, PNG, JPG)</label>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center bg-slate-50 hover:bg-sky-50/50 hover:border-sky-300 transition cursor-pointer">
              <UploadCloud className="w-8 h-8 text-sky-500 mx-auto mb-1" />
              <p className="text-xs font-bold text-slate-700">Click to browse or drag file here</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Maximum upload size 25 MB</p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 mb-1">Notes / Referring Doctor</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Any specific symptoms or doctor recommendations..."
              className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 rounded-2xl">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
