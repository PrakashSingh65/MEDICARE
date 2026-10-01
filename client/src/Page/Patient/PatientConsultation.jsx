import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Phone,
  Send,
  Paperclip,
  Image,
  FileText,
  Clock,
  ShieldCheck,
  User,
  Stethoscope,
  Maximize2,
  Calendar,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  AlertCircle
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import {
  getPatientConsultations,
  addConsultationChatMessage
} from "../../data/patientMockData";

export default function PatientConsultation() {
  const [consultations, setConsultations] = useState(getPatientConsultations);
  const [activeTab, setActiveTab] = useState("live");
  const [selectedConsultationId, setSelectedConsultationId] = useState("cons-live-1");

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [consultationMode, setConsultationMode] = useState("video");
  const [callDuration, setCallDuration] = useState(145);
  const [isCallActive, setIsCallActive] = useState(true);

  const [messageInput, setMessageInput] = useState("");
  const chatBottomRef = useRef(null);

  const activeConsultation =
    consultations.find((c) => c.id === selectedConsultationId) || consultations[0];

  useEffect(() => {
    let interval = null;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConsultation?.chatMessages]);

  const formatTimer = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "Aditi Kapoor",
      senderRole: "patient",
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = addConsultationChatMessage(activeConsultation.id, newMessage);
    setConsultations([...updated]);
    setMessageInput("");
  };

  const handleShareDocument = () => {
    const docName = window.prompt("Enter Document or Image name to share with doctor:", "ECG_Recent_Recording.pdf");
    if (!docName) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: "Aditi Kapoor",
      senderRole: "patient",
      text: `Shared clinical document: ${docName}`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attachment: {
        name: docName,
        type: docName.endsWith(".pdf") ? "pdf" : "image",
        size: "2.4 MB"
      }
    };

    const updated = addConsultationChatMessage(activeConsultation.id, newMessage);
    setConsultations([...updated]);
  };

  const handleToggleCallState = () => {
    setIsCallActive(!isCallActive);
  };

  return (
    <PanelLayout
      role="patient"
      title="Telehealth Consultation Room"
      subtitle="HD encrypted video and audio sessions, real-time doctor-patient text chat, diagnostic document sharing, and clinical visit history."
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex border-b border-slate-200 gap-4">
          <button
            onClick={() => setActiveTab("live")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeTab === "live"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Active Consultation Room</span>
            {isCallActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 text-xs sm:text-sm font-extrabold flex items-center gap-2 border-b-2 transition ${
              activeTab === "history"
                ? "border-sky-600 text-sky-700"
                : "border-transparent text-slate-500 hover:text-slate-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Consultation History & Advice</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600">
              {consultations.length}
            </span>
          </button>
        </div>

        {activeTab === "live" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-950 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative flex flex-col justify-between min-h-[500px] sm:min-h-[560px]">
                <div className="p-4 sm:p-5 flex items-center justify-between z-20 bg-gradient-to-b from-slate-950/80 to-transparent">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeConsultation.doctorAvatar}
                      alt={activeConsultation.doctorName}
                      className="w-10 h-10 rounded-2xl object-cover border border-slate-700 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-white text-sm">
                          {activeConsultation.doctorName}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {consultationMode === "video" ? "Video HD" : "Audio HD"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{activeConsultation.doctorSpecialty}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/80">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-mono font-bold text-white tracking-widest">
                      {isCallActive ? formatTimer(callDuration) : "CALL PAUSED"}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative p-6">
                  {consultationMode === "video" && isVideoEnabled && isCallActive ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200"
                        alt="Doctor Stream"
                        className="max-h-[380px] w-full object-cover rounded-2xl shadow-inner opacity-90"
                      />
                      <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-white text-xs font-bold border border-slate-700 flex items-center gap-2">
                        <Stethoscope className="w-3.5 h-3.5 text-sky-400" />
                        <span>Dr. Priya Sharma (Consultant)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 text-sky-400 flex items-center justify-center mx-auto shadow-xl">
                        {consultationMode === "video" ? (
                          <VideoOff className="w-10 h-10" />
                        ) : (
                          <Phone className="w-10 h-10 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-white">
                          {consultationMode === "video"
                            ? isCallActive
                              ? "Video Camera Muted"
                              : "Consultation Paused"
                            : "Encrypted High-Fidelity Voice Session"}
                        </h4>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                          Connected via 256-bit WebRTC Medicare Secure Channel. Latency: 24ms.
                        </p>
                      </div>
                    </div>
                  )}

                  {consultationMode === "video" && isCallActive && (
                    <div className="absolute bottom-6 right-6 w-32 h-44 rounded-2xl overflow-hidden border-2 border-slate-600 bg-slate-900 shadow-2xl z-20">
                      {isVideoEnabled ? (
                        <img
                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300"
                          alt="Patient Stream"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px] font-bold">
                          <User className="w-6 h-6 mb-1" />
                          <span>Cam Off</span>
                        </div>
                      )}
                      <span className="absolute bottom-1.5 left-2 text-[9px] font-black text-white bg-slate-950/70 px-1.5 py-0.5 rounded">
                        You
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5 bg-gradient-to-t from-slate-950/90 to-transparent z-20 flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
                  <button
                    onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                    className={`p-3.5 rounded-2xl border transition ${
                      isAudioEnabled
                        ? "bg-slate-800/90 border-slate-700 text-white hover:bg-slate-700"
                        : "bg-rose-600 border-rose-500 text-white"
                    }`}
                    title={isAudioEnabled ? "Mute Microphone" : "Unmute Microphone"}
                  >
                    {isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                    className={`p-3.5 rounded-2xl border transition ${
                      isVideoEnabled
                        ? "bg-slate-800/90 border-slate-700 text-white hover:bg-slate-700"
                        : "bg-rose-600 border-rose-500 text-white"
                    }`}
                    title={isVideoEnabled ? "Disable Camera" : "Enable Camera"}
                  >
                    {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() =>
                      setConsultationMode((prev) => (prev === "video" ? "audio" : "video"))
                    }
                    className={`px-4 py-3 rounded-2xl border text-xs font-bold transition flex items-center gap-2 ${
                      consultationMode === "audio"
                        ? "bg-emerald-600 border-emerald-500 text-white"
                        : "bg-slate-800/90 border-slate-700 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    <Phone className="w-4 h-4" />
                    <span>{consultationMode === "video" ? "Audio Only Mode" : "Video Mode"}</span>
                  </button>

                  <button
                    onClick={handleToggleCallState}
                    className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg transition ${
                      isCallActive
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>{isCallActive ? "End / Leave Call" : "Resume Session"}</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-sky-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Encrypted Clinical Room</h4>
                    <p className="text-[11px] text-slate-500">
                      Channel ID: {activeConsultation.channel || "MED-8841-SEC"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleShareDocument}
                  className="px-4 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-2 border border-sky-100 transition"
                >
                  <Paperclip className="w-4 h-4 text-sky-600" />
                  <span>Share Document / Image</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col h-[580px] overflow-hidden">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  <h3 className="font-extrabold text-slate-900 text-sm">Consultation Chat</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Doctor Online
                </span>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                {activeConsultation.chatMessages?.map((msg) => {
                  const isPatient = msg.senderRole === "patient";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isPatient ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-extrabold text-slate-500">{msg.sender}</span>
                        <span className="text-[9px] text-slate-400">• {msg.time}</span>
                      </div>

                      <div
                        className={`p-3 rounded-2xl max-w-[85%] text-xs font-medium shadow-xs leading-relaxed ${
                          isPatient
                            ? "bg-sky-600 text-white rounded-tr-xs"
                            : "bg-white border border-slate-200/80 text-slate-900 rounded-tl-xs"
                        }`}
                      >
                        <p>{msg.text}</p>

                        {msg.attachment && (
                          <div
                            className={`mt-2 p-2 rounded-xl flex items-center gap-2 text-xs ${
                              isPatient
                                ? "bg-white/10 text-white"
                                : "bg-slate-100 text-slate-800 border border-slate-200"
                            }`}
                          >
                            <FileText className="w-4 h-4 shrink-0" />
                            <div className="overflow-hidden">
                              <span className="font-bold truncate block">{msg.attachment.name}</span>
                              <span className="text-[10px] opacity-75">{msg.attachment.size}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 bg-white space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleShareDocument}
                    title="Attach medical document or photo"
                    className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    placeholder="Type message to doctor..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />

                  <button
                    type="submit"
                    className="p-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-xs transition"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            {consultations.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={c.doctorAvatar}
                      alt={c.doctorName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-base">{c.doctorName}</h4>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-800">
                          {c.doctorSpecialty}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {c.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">Session: {c.scheduledTime}</p>
                    </div>
                  </div>

                  <Link
                    to="/patient/prescriptions"
                    className="px-4 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-center"
                  >
                    <span>View Prescriptions</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-extrabold text-slate-900 block">Clinical Summary & Diagnosis</span>
                    <p className="text-slate-600 leading-relaxed">{c.clinicalSummary}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                    <span className="font-extrabold text-slate-900 block">Doctor Advice & Directives</span>
                    <p className="text-slate-600 leading-relaxed">{c.doctorAdvice}</p>
                    {c.followUpDate && (
                      <p className="text-sky-700 font-bold pt-1">Follow-up: {c.followUpDate}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PanelLayout>
  );
}
