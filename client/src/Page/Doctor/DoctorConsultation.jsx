import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Send,
  FileText,
  Calendar,
  Save,
  CheckCircle2,
  Clock,
  User,
  Activity,
  HeartPulse,
  Pill,
  Sparkles,
  Maximize2,
  Share2,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import {
  getDoctorPatients,
  saveDoctorConsultation,
} from "../../data/doctorMockData";

export default function DoctorConsultation() {
  const patients = getDoctorPatients();
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "pat-1");

  const patient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const [isVideoActive, setIsVideoActive] = useState(true);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(524);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: "patient", text: "Hello Doctor, I have uploaded my updated blood pressure chart.", time: "09:01 AM" },
    { id: 2, sender: "doctor", text: "Good morning! I am reviewing it right now. How are your morning symptoms?", time: "09:02 AM" },
    { id: 3, sender: "patient", text: "Much better since taking the medication with breakfast.", time: "09:03 AM" },
  ]);
  const [newChatMessage, setNewChatMessage] = useState("");

  const [symptomsInput, setSymptomsInput] = useState("Mild chest tightness upon morning exertion, stress-induced palpitations");
  const [diagnosisInput, setDiagnosisInput] = useState("Stage 1 Essential Hypertension with mild autonomic anxiety");
  const [notesInput, setNotesInput] = useState("Patient shows compliance with Amlodipine 5mg. Clinic BP 134/86 mmHg. S1, S2 audible with no murmurs. Lungs clear to auscultation bilaterally.");
  const [treatmentPlanInput, setTreatmentPlanInput] = useState("Continue Amlodipine 5mg daily. Add magnesium glycinate 200mg at bedtime for 30 days. Maintain low-sodium diet (<2g/day). Daily 30-min walking.");
  const [followUpDateInput, setFollowUpDateInput] = useState("2026-10-30");

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    const msg = {
      id: Date.now(),
      sender: "doctor",
      text: newChatMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChatMessages([...chatMessages, msg]);
    setNewChatMessage("");
  };

  const handleSaveConsultation = (e) => {
    e.preventDefault();
    const record = {
      appointmentId: `dapt-${Date.now()}`,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      symptoms: symptomsInput,
      diagnosis: diagnosisInput,
      notes: notesInput,
      treatmentPlan: treatmentPlanInput,
      followUpDate: followUpDateInput,
      chatMessages,
    };
    saveDoctorConsultation(record);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <PanelLayout
      role="doctor"
      title="Telehealth Consultation Room"
      subtitle="Conduct live encrypted video consultations, exchange chat messages, record clinical findings, symptoms, diagnoses, and treatment plans."
    >
      <div className="space-y-6">
        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Consultation recorded and saved to patient's electronic health chart!</span>
            </div>
            <Link
              to="/doctor/prescriptions"
              className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
            >
              Write Prescription Now →
            </Link>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src={patient.avatar}
              alt={patient.name}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Active Patient:</span>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="font-extrabold text-slate-900 text-sm bg-transparent border-b border-slate-300 pb-0.5 focus:outline-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}y, {p.gender})
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Blood Group: <strong className="text-emerald-700">{patient.bloodGroup}</strong> • Allergies: {patient.allergies?.join(", ") || "None"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Encrypted Session • {formatTimer(callDuration)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-3xl bg-slate-950 overflow-hidden aspect-video border border-slate-800 shadow-2xl flex items-center justify-center">
              {isVideoActive ? (
                <>
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800"
                    alt="Patient Stream"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>{patient.name} (Live Feed)</span>
                  </div>

                  <div className="absolute bottom-16 right-4 w-32 sm:w-40 aspect-video rounded-2xl bg-slate-900 border-2 border-white/60 overflow-hidden shadow-2xl">
                    {!isCameraOff ? (
                      <img
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300"
                        alt="Doctor Stream"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold bg-slate-800">
                        Camera Off
                      </div>
                    )}
                    <span className="absolute bottom-1 left-2 text-[9px] font-bold text-white bg-black/50 px-1 rounded">
                      You (Dr. Priya)
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center text-white space-y-2">
                  <VideoOff className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-sm font-bold">Video Stream Disconnected</p>
                  <button
                    onClick={() => setIsVideoActive(true)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 text-xs font-bold hover:bg-emerald-700"
                  >
                    Reconnect Video
                  </button>
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/70 backdrop-blur-md p-2 rounded-2xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`p-3 rounded-xl transition ${
                    isMicMuted ? "bg-red-600 text-white" : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                  title={isMicMuted ? "Unmute Microphone" : "Mute Microphone"}
                >
                  {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCameraOff(!isCameraOff)}
                  className={`p-3 rounded-xl transition ${
                    isCameraOff ? "bg-red-600 text-white" : "bg-white/15 text-white hover:bg-white/25"
                  }`}
                  title={isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
                >
                  {isCameraOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoActive(!isVideoActive)}
                  className="p-3 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
                  title="End Video Call"
                >
                  <PhoneOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex flex-col h-[320px]">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <h4 className="font-extrabold text-slate-900 text-sm">Doctor-Patient Live Consultation Chat</h4>
              </div>

              <div className="flex-1 overflow-y-auto py-3 space-y-2.5 pr-1">
                {chatMessages.map((msg) => {
                  const isDoc = msg.sender === "doctor";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isDoc ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-md px-3.5 py-2 rounded-2xl text-xs ${
                          isDoc
                            ? "bg-emerald-600 text-white rounded-br-xs"
                            : "bg-slate-100 text-slate-800 rounded-bl-xs"
                        }`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.time}</span>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  placeholder="Type advice or instructions for patient..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Clinical Consultation Notes</h3>
                <p className="text-xs text-slate-400">Record diagnostic evaluation and therapy guidelines</p>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Reported Symptoms</label>
                <textarea
                  value={symptomsInput}
                  onChange={(e) => setSymptomsInput(e.target.value)}
                  rows={2}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Clinical Diagnosis</label>
                <input
                  type="text"
                  value={diagnosisInput}
                  onChange={(e) => setDiagnosisInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Consultation & Examination Notes</label>
                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Treatment Plan & Lifestyle Guidelines</label>
                <textarea
                  value={treatmentPlanInput}
                  onChange={(e) => setTreatmentPlanInput(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  Follow-up Consultation Date
                </label>
                <input
                  type="date"
                  value={followUpDateInput}
                  onChange={(e) => setFollowUpDateInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Link
                to="/doctor/prescriptions"
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Pill className="w-4 h-4" />
                <span>Open Rx Pad</span>
              </Link>

              <button
                type="button"
                onClick={handleSaveConsultation}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Consultation Record</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
