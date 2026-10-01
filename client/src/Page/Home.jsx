import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Stethoscope,
  User,
  ArrowRight,
  Activity,
  Sparkles,
  TrendingUp,
  Pill,
  HeartPulse,
  Award,
  CheckCircle2,
  Lock,
  Clock,
  ChevronRight,
  Search,
  Calendar,
  Video,
  PhoneCall,
  Star,
  FileText,
  SlidersHorizontal,
  Layers,
  Zap,
  Shield,
  Heart,
  Droplets,
  ArrowUpRight,
  HelpCircle,
  Check,
  ChevronDown,
  Play,
  Mic,
  X,
  Volume2,
  RefreshCw,
  Share2,
  Eye,
  Radio,
  Dna,
  Thermometer,
  Cpu,
  UserCheck
} from "lucide-react";

export default function Home() {
  const [telemetryTab, setTelemetryTab] = useState("vitals");
  const [selectedBodyPart, setSelectedBodyPart] = useState("chest");
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [activeConsultationsCount, setActiveConsultationsCount] = useState(248);
  const [bpmValue, setBpmValue] = useState(74);
  const [audioWaves, setAudioWaves] = useState([24, 48, 72, 35, 90, 60, 40, 80, 55, 30]);

  const canvasRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConsultationsCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(230, Math.min(270, prev + delta));
      });
      setBpmValue((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(71, Math.min(78, prev + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isListening) return;
    const waveInterval = setInterval(() => {
      setAudioWaves([
        Math.floor(Math.random() * 70) + 15,
        Math.floor(Math.random() * 90) + 20,
        Math.floor(Math.random() * 60) + 25,
        Math.floor(Math.random() * 95) + 30,
        Math.floor(Math.random() * 80) + 20,
        Math.floor(Math.random() * 70) + 15,
        Math.floor(Math.random() * 85) + 25,
        Math.floor(Math.random() * 65) + 20,
        Math.floor(Math.random() * 90) + 30,
        Math.floor(Math.random() * 50) + 15,
      ]);
    }, 150);
    return () => clearInterval(waveInterval);
  }, [isListening]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let rotation = 0;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth || 450;
      canvas.height = 380;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const nodes = [
      { lat: 0.7, lon: 0.2, label: "New York Hub", ping: 12, color: "#06B6D4", glow: "rgba(6,182,212,0.9)" },
      { lat: 0.85, lon: 1.8, label: "London Central", ping: 18, color: "#F59E0B", glow: "rgba(245,158,11,0.9)" },
      { lat: 0.35, lon: 4.1, label: "Mumbai Telehealth", ping: 9, color: "#10B981", glow: "rgba(16,185,129,0.9)" },
      { lat: 0.55, lon: 5.2, label: "Tokyo Bio-Node", ping: 15, color: "#EC4899", glow: "rgba(236,72,153,0.9)" },
      { lat: -0.4, lon: 4.9, label: "Singapore Care", ping: 22, color: "#8B5CF6", glow: "rgba(139,92,246,0.9)" },
      { lat: -0.5, lon: 2.5, label: "Zurich Clinical", ping: 14, color: "#F43F5E", glow: "rgba(244,63,94,0.9)" },
    ];

    const connectionPairs = [
      { from: 0, to: 1, c1: "#06B6D4", c2: "#F59E0B", name: "NY-LON" },
      { from: 1, to: 5, c1: "#F59E0B", c2: "#F43F5E", name: "LON-ZUR" },
      { from: 5, to: 2, c1: "#F43F5E", c2: "#10B981", name: "ZUR-MUM" },
      { from: 2, to: 4, c1: "#10B981", c2: "#8B5CF6", name: "MUM-SIN" },
      { from: 4, to: 3, c1: "#8B5CF6", c2: "#EC4899", name: "SIN-TYO" },
      { from: 3, to: 0, c1: "#EC4899", c2: "#06B6D4", name: "TYO-NY" },
      { from: 0, to: 4, c1: "#06B6D4", c2: "#8B5CF6", name: "NY-SIN" },
    ];

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 34;

      const bgGlow = ctx.createRadialGradient(centerX, centerY, radius * 0.1, centerX, centerY, radius * 1.35);
      bgGlow.addColorStop(0, "rgba(6, 182, 212, 0.16)");
      bgGlow.addColorStop(0.45, "rgba(13, 148, 136, 0.12)");
      bgGlow.addColorStop(0.75, "rgba(10, 25, 47, 0.4)");
      bgGlow.addColorStop(1, "rgba(2, 6, 23, 0)");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.55)";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#06B6D4";
      ctx.shadowBlur = 24;
      ctx.stroke();
      ctx.shadowBlur = 0;

      const globeGrad = ctx.createRadialGradient(
        centerX - radius * 0.35,
        centerY - radius * 0.35,
        radius * 0.05,
        centerX,
        centerY,
        radius
      );
      globeGrad.addColorStop(0, "rgba(6, 182, 212, 0.38)");
      globeGrad.addColorStop(0.25, "rgba(14, 45, 95, 0.88)");
      globeGrad.addColorStop(0.75, "rgba(5, 18, 44, 0.98)");
      globeGrad.addColorStop(1, "rgba(6, 182, 212, 0.7)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = globeGrad;
      ctx.fill();

      ctx.strokeStyle = "rgba(6, 182, 212, 0.9)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#06B6D4";
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.shadowBlur = 0;

      for (let lat = -60; lat <= 60; lat += 25) {
        const phi = (lat * Math.PI) / 180;
        const y = centerY - radius * Math.sin(phi);
        const rLat = radius * Math.cos(phi);
        ctx.beginPath();
        ctx.ellipse(centerX, y, rLat, rLat * 0.24, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(6, 182, 212, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      for (let i = 0; i < 8; i++) {
        const angle = rotation + (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, radius * Math.abs(Math.cos(angle)), radius, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(20, 184, 166, 0.26)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      const projectedNodes = nodes.map((node) => {
        const angle = node.lon + rotation;
        const x3d = Math.cos(angle) * Math.cos(node.lat);
        const z3d = Math.sin(angle) * Math.cos(node.lat);
        const y3d = Math.sin(node.lat);
        const screenX = centerX + x3d * radius;
        const screenY = centerY - y3d * radius;
        const visible = z3d > -0.25;
        const scale = Math.max(0.2, (z3d + 1) / 2);
        return { ...node, screenX, screenY, visible, scale };
      });

      connectionPairs.forEach((pair, idx) => {
        const n1 = projectedNodes[pair.from];
        const n2 = projectedNodes[pair.to];

        if (n1.visible || n2.visible) {
          const arcGrad = ctx.createLinearGradient(n1.screenX, n1.screenY, n2.screenX, n2.screenY);
          arcGrad.addColorStop(0, pair.c1);
          arcGrad.addColorStop(0.5, "#D946EF");
          arcGrad.addColorStop(1, pair.c2);

          const midX = (n1.screenX + n2.screenX) / 2;
          const midY = (n1.screenY + n2.screenY) / 2 - 34;

          ctx.beginPath();
          ctx.moveTo(n1.screenX, n1.screenY);
          ctx.quadraticCurveTo(midX, midY, n2.screenX, n2.screenY);
          ctx.strokeStyle = arcGrad;
          ctx.lineWidth = 2.4;
          ctx.shadowColor = pair.c1;
          ctx.shadowBlur = 14;
          ctx.stroke();
          ctx.shadowBlur = 0;

          const t = (rotation * 2.5 + idx * 0.22) % 1;
          const px = (1 - t) * (1 - t) * n1.screenX + 2 * (1 - t) * t * midX + t * t * n2.screenX;
          const py = (1 - t) * (1 - t) * n1.screenY + 2 * (1 - t) * t * midY + t * t * n2.screenY;

          ctx.beginPath();
          ctx.arc(px, py, 3.8, 0, Math.PI * 2);
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = pair.c2;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      projectedNodes.forEach((node) => {
        if (node.visible) {
          ctx.beginPath();
          ctx.arc(node.screenX, node.screenY, 7 * node.scale, 0, Math.PI * 2);
          ctx.fillStyle = node.color;
          ctx.shadowColor = node.color;
          ctx.shadowBlur = 16;
          ctx.fill();

          const pulseR = (11 + Math.sin(rotation * 8) * 3) * node.scale;
          ctx.beginPath();
          ctx.arc(node.screenX, node.screenY, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = node.glow;
          ctx.lineWidth = 1.6;
          ctx.stroke();
          ctx.shadowBlur = 0;

          ctx.fillStyle = "rgba(3, 7, 18, 0.85)";
          ctx.fillRect(node.screenX + 10, node.screenY - 14, 94, 18);
          ctx.strokeStyle = node.color;
          ctx.lineWidth = 0.8;
          ctx.strokeRect(node.screenX + 10, node.screenY - 14, 94, 18);

          ctx.fillStyle = "#F8FAFC";
          ctx.font = "bold 9px sans-serif";
          ctx.fillText(`${node.label} (${node.ping}ms)`, node.screenX + 13, node.screenY - 2);
        }
      });

      rotation += 0.005;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const bodyPartsData = {
    head: {
      name: "Cranial & Neuro System",
      status: "Optimal Function",
      statusColor: "text-emerald-400 bg-emerald-950/80 border-emerald-500/50",
      temp: "36.6 °C",
      risk: "Low Risk (8%)",
      symptoms: "Mild screen fatigue, normal cognitive alertness.",
      prognosis: "Healthy EEG frequencies detected. Hydration and 15-min rest advised.",
    },
    chest: {
      name: "Cardiothoracic Matrix",
      status: "Active Tele-Monitoring",
      statusColor: "text-amber-400 bg-amber-950/80 border-amber-500/50",
      temp: "37.0 °C",
      risk: "Moderate Risk (28%)",
      symptoms: "Elevated resting pulse after exertion; stable ST segment on 12-lead telemetry.",
      prognosis: "Sinus rhythm verified. Proactive lipid profile screening scheduled.",
    },
    abdomen: {
      name: "Metabolic & Gastrointestinal",
      status: "Stable Baseline",
      statusColor: "text-cyan-400 bg-cyan-950/80 border-cyan-500/50",
      temp: "36.8 °C",
      risk: "Normal (14%)",
      symptoms: "Normal glycemic indices, fasting glucose 94 mg/dL.",
      prognosis: "Optimal gut microbiome metabolic activity. Maintain daily dietary fiber.",
    },
    joints: {
      name: "Musculoskeletal & Locomotor",
      status: "Optimal Mobility",
      statusColor: "text-emerald-400 bg-emerald-950/80 border-emerald-500/50",
      temp: "36.4 °C",
      risk: "Low Risk (11%)",
      symptoms: "Normal range of motion across spinal, knee, and shoulder joints.",
      prognosis: "Daily step goal 8,240 achieved. Joint inflammation biomarkers absent.",
    },
  };

  const genomicRisks = [
    { name: "Cardiovascular Susceptibility", value: 24, level: "Low", color: "from-cyan-500 to-teal-400" },
    { name: "Type-2 Diabetes Marker", value: 42, level: "Moderate", color: "from-amber-400 to-orange-500" },
    { name: "Hypertension Disposition", value: 18, level: "Low", color: "from-emerald-400 to-teal-500" },
    { name: "CYP2D6 Drug Metabolism Rate", value: 88, level: "Extensive (Rapid)", color: "from-blue-500 to-indigo-600" },
    { name: "Autoimmune Reactivity", value: 12, level: "Minimal", color: "from-fuchsia-400 to-pink-500" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-teal-500 selection:text-white font-sans flex flex-col relative overflow-x-hidden">
      
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 px-4 lg:px-8 py-3.5 shadow-xs transition-all">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 lg:gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06B6D4] via-[#0D9488] to-[#6366F1] flex items-center justify-center text-white shadow-[0_0_18px_rgba(6,182,212,0.45)] group-hover:scale-105 transition-transform">
                <HeartPulse className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-[#0A2540] via-[#0D9488] to-[#0066FF] bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(6,182,212,0.2)] flex items-center gap-1.5">
                  MEDICARE
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06B6D4] animate-pulse"></span>
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-700">
                  Unified Clinical Platform
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-2.5 pl-4 border-l border-slate-200">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-500/10 via-cyan-500/15 to-indigo-500/10 border border-cyan-400/50 text-teal-900 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]">
                <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_#06B6D4] animate-ping"></span>
                <span>Patient Workspace</span>
              </div>

              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/15 to-pink-500/10 border border-blue-400/40 text-slate-800 text-xs font-semibold shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                <Radio className="w-3.5 h-3.5 text-[#0066FF] animate-pulse" />
                <span className="font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {activeConsultationsCount}
                </span>
                <span className="text-slate-600 font-medium">Active Consultations</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5">
            <Link
              to="/contact"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-700 transition px-3 py-2 rounded-xl hover:bg-slate-100/80"
            >
              <HelpCircle className="w-4 h-4 text-teal-600" />
              <span>Help & Support</span>
            </Link>

            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <Link
                to="/patient/profile"
                className="flex items-center gap-2.5 p-1 sm:px-3 sm:py-1.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition group"
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                    alt="sandip singh"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full"></span>
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-extrabold text-slate-900 group-hover:text-teal-700 transition block leading-tight">
                    sandip singh
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 block leading-tight">
                    Patient #MED-9924
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition hidden sm:block" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1720px] w-full mx-auto px-4 lg:px-8 py-8 space-y-10">
        
        <section className="grid lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-7 rounded-3xl bg-gradient-to-br from-[#020817] via-[#051329] to-[#0A192F] text-white border border-cyan-500/30 p-6 lg:p-10 shadow-[0_0_50px_rgba(6,182,212,0.18)] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-teal-500/20 via-blue-600/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between relative z-10 mb-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                <span>Global Telehealth Activity Network</span>
                <span className="h-3 w-px bg-cyan-500/40"></span>
                <span className="text-teal-300 font-medium">Real-time Telemetry</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-semibold drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                NODE LATENCY: 14ms
              </span>
            </div>

            <div className="relative w-full h-[380px] flex items-center justify-center my-1 z-10">
              <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
              <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-cyan-500/40 text-[11px] font-semibold text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06B6D4] animate-pulse"></span>
                <span>Luminous 3D Tele-Grid • Iridescent Neural Arcs</span>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-800/80 relative z-10">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] bg-gradient-to-r from-white via-cyan-100 to-teal-200 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(6,182,212,0.25)]">
                Intelligent Healthcare, Engineered for Humans.
              </h1>
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-amber-500/20 text-cyan-300 border border-cyan-400/40 font-bold text-xs tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                  Secure. Proactive. Seamless.
                </span>
                <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  AES-256 Encrypted Telemetry & Zero-Trust Architecture
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
                A unified, data-dense operating framework providing synchronized clinical triage, real-time hemodynamic telemetry, and instant diagnostic continuity between patients and world-class specialists.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
            <div className="p-5 pb-4 bg-gradient-to-r from-[#030B1C] via-[#0A1D3D] to-[#041128] text-white border-b border-cyan-500/20 shadow-md">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                      Live Clinical Telemetry
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#06B6D4] animate-pulse"></span>
                    </h2>
                    <span className="text-[10px] text-cyan-300/90 font-mono">
                      STREAM ID: #BIO-99420 • HIGH FIDELITY
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-teal-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  Neon Command Center
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setTelemetryTab("vitals")}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
                    telemetryTab === "vitals"
                      ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-[0_0_16px_rgba(6,182,212,0.6)] border border-cyan-300/50"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Live Vitals
                </button>
                <button
                  onClick={() => setTelemetryTab("symptom")}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
                    telemetryTab === "symptom"
                      ? "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white shadow-[0_0_16px_rgba(217,70,239,0.6)] border border-fuchsia-300/50"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  AI Prognostic
                </button>
                <button
                  onClick={() => setTelemetryTab("genomic")}
                  className={`flex-1 py-1.5 px-2 rounded-lg font-bold text-center transition-all ${
                    telemetryTab === "genomic"
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_16px_rgba(245,158,11,0.6)] border border-amber-300/50"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  GRS Score
                </button>
              </div>
            </div>

            <div className="p-5 flex-1 space-y-4">
              {telemetryTab === "vitals" && (
                <div className="space-y-4">
                  <div className="bg-[#020817] rounded-2xl p-4 text-white relative overflow-hidden border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-rose-500 animate-ping" />
                        <span className="font-extrabold text-cyan-300 font-mono tracking-wider drop-shadow-[0_0_6px_rgba(6,182,212,0.7)]">
                          LEAD II EKG WAVEFORM
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-amber-400 font-bold drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]">
                        {bpmValue} BPM • SINUS RHYTHM
                      </span>
                    </div>

                    <div className="w-full h-24 relative flex items-center overflow-hidden">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 500 100"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient id="ekgMultiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06B6D4" />
                            <stop offset="25%" stopColor="#14B8A6" />
                            <stop offset="50%" stopColor="#FACC15" />
                            <stop offset="70%" stopColor="#F97316" />
                            <stop offset="85%" stopColor="#EC4899" />
                            <stop offset="100%" stopColor="#06B6D4" />
                          </linearGradient>
                          <filter id="ekgGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2.5" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <line x1="0" y1="50" x2="500" y2="50" stroke="rgba(6,182,212,0.15)" strokeDasharray="4 4" />
                        <line x1="0" y1="25" x2="500" y2="25" stroke="rgba(6,182,212,0.08)" />
                        <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(6,182,212,0.08)" />
                        <path
                          d="M0,50 L40,50 L48,45 L54,53 L60,50 L80,50 L88,30 L94,85 L102,15 L108,60 L114,50 L140,50 L155,42 L170,50 L200,50 L208,45 L214,53 L220,50 L240,50 L248,30 L254,85 L262,15 L268,60 L274,50 L300,50 L315,42 L330,50 L360,50 L368,45 L374,53 L380,50 L400,50 L408,30 L414,85 L422,15 L428,60 L434,50 L460,50 L475,42 L490,50 L500,50"
                          fill="none"
                          stroke="url(#ekgMultiGradient)"
                          filter="url(#ekgGlow)"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#020817] to-transparent"></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-cyan-300/80 font-mono pt-1">
                      <span>SWEEP SPEED: 25 mm/s</span>
                      <span>GAIN: 10 mm/mV</span>
                      <span>QTC: 412ms</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-orange-500/15 to-rose-600/25 border border-red-500/40 shadow-[0_0_18px_rgba(239,68,68,0.2)] hover:border-red-400 transition-all group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold text-orange-900 uppercase tracking-wider">
                          Heart Rate
                        </span>
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/40">
                          <Heart className="w-3.5 h-3.5 fill-white" />
                        </div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900">{bpmValue}</span>
                        <span className="text-[10px] text-slate-600 font-bold">BPM</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-red-700 bg-red-100/90 border border-red-300 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                        Normal Resting
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-500/15 via-cyan-500/15 to-blue-600/25 border border-teal-500/40 shadow-[0_0_18px_rgba(20,184,166,0.2)] hover:border-teal-400 transition-all group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold text-teal-900 uppercase tracking-wider">
                          Blood Pressure
                        </span>
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-teal-500/40">
                          <Activity className="w-3.5 h-3.5" />
                        </div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900">118/76</span>
                        <span className="text-[10px] text-slate-600 font-bold">mmHg</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-teal-700 bg-teal-100/90 border border-teal-300 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                        Optimal Range
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600/15 via-indigo-600/15 to-purple-600/25 border border-purple-500/40 shadow-[0_0_18px_rgba(147,51,234,0.2)] hover:border-purple-400 transition-all group">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-extrabold text-purple-900 uppercase tracking-wider">
                          SpO2 Oxygen
                        </span>
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/40">
                          <Droplets className="w-3.5 h-3.5 fill-white" />
                        </div>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-slate-900">99</span>
                        <span className="text-[10px] text-slate-600 font-bold">%</span>
                      </div>
                      <span className="text-[10px] font-extrabold text-purple-700 bg-purple-100/90 border border-purple-300 px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                        Target Met
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {telemetryTab === "symptom" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        AI Heat Map Body Visualization
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Select anatomical zone to query diagnostic AI engine
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-fuchsia-500/15 to-pink-500/15 text-fuchsia-700 text-[10px] font-extrabold border border-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.25)]">
                      Neural Scan Active
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {["head", "chest", "abdomen", "joints"].map((part) => (
                      <button
                        key={part}
                        onClick={() => setSelectedBodyPart(part)}
                        className={`py-2 px-1 rounded-xl text-xs font-extrabold border transition-all ${
                          selectedBodyPart === part
                            ? "bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white border-fuchsia-400 shadow-[0_0_14px_rgba(217,70,239,0.5)]"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {part.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-[#0A1A33] to-[#040D1D] text-white border border-fuchsia-500/30 shadow-[0_0_20px_rgba(217,70,239,0.15)] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                        {bodyPartsData[selectedBodyPart].name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${bodyPartsData[selectedBodyPart].statusColor}`}
                      >
                        {bodyPartsData[selectedBodyPart].status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/15">
                        <span className="text-[10px] text-cyan-300 font-mono font-semibold block">
                          THERMAL INDEX
                        </span>
                        <span className="text-sm font-bold text-white">
                          {bodyPartsData[selectedBodyPart].temp}
                        </span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/15">
                        <span className="text-[10px] text-amber-300 font-mono font-semibold block">
                          CALCULATED RISK
                        </span>
                        <span className="text-sm font-bold text-white">
                          {bodyPartsData[selectedBodyPart].risk}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs space-y-1.5 pt-1 border-t border-white/15">
                      <p className="text-slate-300 font-medium">
                        <strong className="text-cyan-400">Telemetry:</strong> {bodyPartsData[selectedBodyPart].symptoms}
                      </p>
                      <p className="text-slate-300 font-medium">
                        <strong className="text-fuchsia-400">Prognosis:</strong> {bodyPartsData[selectedBodyPart].prognosis}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {telemetryTab === "genomic" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Genomic Risk Assessment (GRS)
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Polygenic risk scores & pharmacogenomic variance
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                      <Dna className="w-3.5 h-3.5 text-amber-600" />
                      <span>SCORE: 28/100</span>
                    </div>
                  </div>

                  <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                    {genomicRisks.map((risk, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-semibold text-slate-800">{risk.name}</span>
                          <span className="font-extrabold text-slate-700">{risk.level} ({risk.value}%)</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden shadow-inner">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${risk.color}`}
                            style={{ width: `${risk.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-indigo-500/10 border border-teal-300 shadow-xs space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-900 block">
                      Personalized Recommendations
                    </span>
                    <ul className="text-xs text-teal-900 space-y-1 list-disc pl-4 font-medium">
                      <li>Maintain current low-sodium hydration routine to sustain healthy BP index.</li>
                      <li>Standard CYP2D6 enzyme rate confirms standard dosage efficacy for beta-blockers.</li>
                      <li>Schedule annual coronary calcium scan in Q4 2026.</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#0A2540] tracking-tight flex items-center gap-2">
                Unified Care Network
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-teal-500/15 via-cyan-500/20 to-indigo-500/15 text-teal-900 border border-teal-300 shadow-[0_0_12px_rgba(20,184,166,0.2)]">
                  Real-Time Clinical Grid
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Active teleconsultations, verified specialists, and encrypted health data vaults
              </p>
            </div>
            <Link
              to="/patient/appointments"
              className="text-xs font-bold text-[#0D9488] hover:underline flex items-center gap-1"
            >
              <span>View All Encounters</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-md hover:shadow-[0_0_30px_rgba(6,182,212,0.18)] hover:border-cyan-400/50 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center font-bold shadow-[0_0_10px_rgba(13,148,136,0.2)]">
                      <Video className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Active Consultations
                      </h3>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        2 Live Physician Channels
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                    HD Tele-Stream
                  </span>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/60 transition">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"
                        alt="Dr. Ananya Sharma"
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                      />
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">Dr. Ananya Sharma</h4>
                        <p className="text-[10px] text-slate-500">Senior Cardiologist • Room #402</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full shadow-2xs">
                      In-Session
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between hover:bg-slate-100/60 transition">
                    <div className="flex items-center gap-2.5">
                      <img
                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
                        alt="Dr. Rajesh Kulkarni"
                        className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                      />
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">Dr. Rajesh Kulkarni</h4>
                        <p className="text-[10px] text-slate-500">Neurologist • Room #NEURO-88</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full shadow-2xs">
                      Ready Next
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/patient/consultation"
                className="mt-5 w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#0A2540] text-cyan-300 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-md shadow-slate-900/30"
              >
                <span>Access Clinical Tele-Encounter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-md hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] hover:border-emerald-400/50 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Available Specialists
                      </h3>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Chief Specialist On Duty
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Open Slot
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-50/70 to-emerald-50/70 border border-teal-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1594824813583-0574744ebc40?auto=format&fit=crop&q=80&w=150"
                      alt="Dr. Sarah Jenkins"
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-black text-slate-900">Dr. Sarah Jenkins, MD</h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <p className="text-[11px] text-teal-800 font-semibold">
                        Chief of Cardiovascular Surgery
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span className="text-amber-600 font-bold">★ 4.98 (1.8k reviews)</span>
                        <span>•</span>
                        <span>16 yrs exp</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/90 p-2.5 rounded-xl border border-teal-200 flex items-center justify-between text-xs font-semibold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-teal-600" />
                      <span>Today, 04:30 PM</span>
                    </div>
                    <span className="text-teal-700 font-extrabold">Fee: $75</span>
                  </div>
                </div>
              </div>

              <Link
                to="/patient/appointments"
                className="mt-5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 shadow-[0_0_15px_rgba(20,184,166,0.3)]"
              >
                <span>Book Direct Consultation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-md hover:shadow-[0_0_30px_rgba(99,102,241,0.18)] hover:border-indigo-400/50 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center font-bold shadow-[0_0_10px_rgba(0,102,255,0.2)]">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Health Records Access Points
                      </h3>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Encrypted Diagnostic Vault
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#0066FF] border border-blue-200 font-bold shadow-2xs">
                    AES-256
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#0066FF]" />
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">
                          Lipid & Metabolic Panel
                        </span>
                        <span className="text-[10px] text-slate-400">PDF • Verified 2h ago</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Signed
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Dna className="w-4 h-4 text-purple-600" />
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">
                          Genomic Microarray Report
                        </span>
                        <span className="text-[10px] text-slate-400">XML • GRS Index 28</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Synced
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/patient/records"
                className="mt-5 w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>Unlock Complete Health Vault</span>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
              </Link>
            </div>

          </div>
        </section>

        <section className="bg-gradient-to-r from-[#030B1C] via-[#0A1D3D] to-[#030B1C] rounded-3xl p-6 sm:p-8 text-white shadow-[0_0_40px_rgba(6,182,212,0.15)] border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl font-black tracking-tight text-white flex items-center justify-center md:justify-start gap-2">
              <span>Primary Workspace Portals</span>
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06B6D4] animate-pulse"></span>
            </h3>
            <p className="text-xs text-slate-300">
              Immediate single sign-on access across clinical, patient, and management nodes
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <Link
              to="/patient"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-extrabold text-xs transition duration-200 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95"
            >
              <User className="w-4 h-4 text-white" />
              <span>Patient Hub</span>
            </Link>

            <Link
              to="/doctor"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs transition duration-200 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-95"
            >
              <Stethoscope className="w-4 h-4 text-white" />
              <span>Doctor Workspace</span>
            </Link>

            <Link
              to="/admin"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-700 to-purple-700 hover:from-indigo-600 hover:to-purple-600 text-white font-extrabold text-xs transition duration-200 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(147,51,234,0.35)] active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-purple-200" />
              <span>Admin Control</span>
            </Link>
          </div>
        </section>

      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => {
            setShowVoiceAssistant(true);
            setIsListening(true);
          }}
          className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-500 to-fuchsia-600 text-white shadow-[0_0_35px_rgba(6,182,212,0.6)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all group ring-4 ring-cyan-400/50"
          aria-label="Voice AI Health Assistant"
        >
          <span className="absolute inset-0 rounded-full bg-cyan-400/35 animate-ping"></span>
          <Mic className="w-7 h-7 text-white relative z-10 transition-transform group-hover:scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full shadow-[0_0_8px_#34D399]"></span>
        </button>
      </div>

      {showVoiceAssistant && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-200 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    Voice AI Health Assistant
                  </h3>
                  <p className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                    Ready for Clinical Voice Query
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowVoiceAssistant(false);
                  setIsListening(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#020817] via-[#0A1A33] to-[#040D1D] text-white flex flex-col items-center justify-center space-y-4 border border-cyan-500/30 shadow-inner">
              <div className="flex items-end justify-center gap-1.5 h-16 w-full">
                {audioWaves.map((height, i) => (
                  <div
                    key={i}
                    className="w-2 bg-gradient-to-t from-cyan-400 via-teal-400 to-fuchsia-500 rounded-full transition-all duration-150 shadow-[0_0_6px_rgba(6,182,212,0.8)]"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>

              <div className="text-center">
                <span className="text-xs font-mono text-cyan-300 block drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]">
                  {isListening ? "Listening to your health query..." : "Tap mic to resume"}
                </span>
                <p className="text-xs text-slate-300 mt-1">
                  "Analyze my latest ECG and explain my cardiac sinus score"
                </p>
              </div>

              <button
                onClick={() => setIsListening(!isListening)}
                className={`px-5 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition ${
                  isListening
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]"
                    : "bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{isListening ? "Pause Listening" : "Start Speaking"}</span>
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Quick Health Voice Commands:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => alert("AI Command: Querying latest BP telemetry...")}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 text-left font-medium transition"
                >
                  "Check my blood pressure trend"
                </button>
                <button
                  onClick={() => alert("AI Command: Connecting to Dr. Sharma's availability...")}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 text-left font-medium transition"
                >
                  "Book with Dr. Ananya Sharma"
                </button>
                <button
                  onClick={() => alert("AI Command: Summarizing Genomic Risk Score (GRS)...")}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 text-left font-medium transition"
                >
                  "Summarize GRS Risk Score"
                </button>
                <button
                  onClick={() => alert("AI Command: Reviewing active prescriptions...")}
                  className="p-2.5 rounded-xl bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 text-left font-medium transition"
                >
                  "Check medication refill dates"
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">MEDICARE Unified Platform</span>
            <span>•</span>
            <span>All Clinical Systems Nominal</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Security ID: SEC-9942</span>
            <span>•</span>
            <span>HIPAA Verified</span>
            <span>•</span>
            <span>© 2026 MEDICARE Health Systems</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
