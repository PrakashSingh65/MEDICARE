import { axiosClient } from "../api/axiosClient";
import {
  adaptAppointmentFromBackend,
  adaptDoctorFromBackend,
  adaptPrescriptionFromBackend,
} from "../api/adapters";

const STORAGE_KEYS = {
  PATIENT_PROFILE: "medicare_patient_profile",
  PATIENT_APPOINTMENTS: "medicare_patient_appointments",
  PATIENT_RECORDS: "medicare_patient_records",
  PATIENT_CONSULTATIONS: "medicare_patient_consultations",
  PATIENT_PRESCRIPTIONS: "medicare_patient_prescriptions",
  PATIENT_PAYMENTS: "medicare_patient_payments",
  PATIENT_NOTIFICATIONS: "medicare_patient_notifications",
  AVAILABLE_DOCTORS: "medicare_available_doctors",
};

const safeGet = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return null;
  }
};

const initialPatientProfile = {
  id: "pat-1",
  name: "Aditi Kapoor",
  email: "aditi.kapoor@example.com",
  phone: "+91 98111 22334",
  avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
  dateOfBirth: "1997-04-18",
  gender: "Female",
  bloodGroup: "B+",
  emergencyContactName: "Kabir Kapoor",
  emergencyContactPhone: "+91 98111 99887",
  emergencyContactRelation: "Spouse",
  address: "Flat 402, Green Glen Layout, Bellandur, Outer Ring Road",
  city: "Bangalore",
  state: "Karnataka",
  postalCode: "560103",
  isEmailVerified: true,
  isPhoneVerified: true,
  plan: "Premium Comprehensive Care",
  allergies: ["Penicillin", "Peanuts"],
  chronicConditions: ["Stage 1 Essential Hypertension"],
  heightCm: 165,
  weightKg: 58,
  bmi: 21.3
};

const initialAvailableDoctors = [
  {
    id: "doc-1",
    name: "Dr. Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    specialty: "Cardiology",
    qualifications: "MBBS, MD (AIIMS), DM (Cardiology - NIMHANS), FACC",
    experience: 12,
    rating: 4.9,
    reviewsCount: 142,
    fee: 75,
    clinic: "HeartCare Super Specialty Clinic",
    location: "Bangalore, Indiranagar",
    languages: ["English", "Hindi", "Kannada"],
    bio: "Senior interventional cardiologist with 12+ years expertise in preventive cardiology and hypertension management.",
    availableSlots: ["09:00 AM", "09:30 AM", "11:00 AM", "02:00 PM", "03:30 PM", "04:30 PM"]
  },
  {
    id: "doc-2",
    name: "Dr. Ankit Verma",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    specialty: "General Medicine",
    qualifications: "MBBS, DNB - Family Medicine",
    experience: 8,
    rating: 4.7,
    reviewsCount: 110,
    fee: 50,
    clinic: "CityHealth Family Medical Center",
    location: "Mumbai, Bandra West",
    languages: ["English", "Hindi", "Marathi"],
    bio: "Primary care physician dedicated to comprehensive chronic disease management, fever, and immunizations.",
    availableSlots: ["10:00 AM", "10:30 AM", "11:30 AM", "04:00 PM", "05:00 PM"]
  },
  {
    id: "doc-3",
    name: "Dr. Sneha Reddy",
    avatar: "https://images.unsplash.com/photo-1594824813682-1262d057778b?auto=format&fit=crop&q=80&w=300",
    specialty: "Dermatology",
    qualifications: "MBBS, MD - Dermatology (CMC Vellore)",
    experience: 10,
    rating: 4.8,
    reviewsCount: 128,
    fee: 65,
    clinic: "Radiance Skin & Laser Center",
    location: "Hyderabad, Jubilee Hills",
    languages: ["English", "Telugu", "Hindi"],
    bio: "Cosmetic and clinical dermatologist specializing in acne therapies, laser resurfacing, and eczema management.",
    availableSlots: ["09:30 AM", "11:00 AM", "02:30 PM", "03:30 PM"]
  },
  {
    id: "doc-4",
    name: "Dr. Rajesh Iyer",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
    specialty: "Neurology",
    qualifications: "MBBS, DM - Neurology (NIMHANS)",
    experience: 15,
    rating: 4.9,
    reviewsCount: 95,
    fee: 90,
    clinic: "Apex Neuro & Spine Institute",
    location: "Chennai, Adyar",
    languages: ["English", "Tamil", "Hindi"],
    bio: "Consultant neurologist specializing in chronic migraine, vertigo, sleep disorders, and neuropathy.",
    availableSlots: ["10:00 AM", "11:30 AM", "03:00 PM", "04:00 PM"]
  },
  {
    id: "doc-5",
    name: "Dr. Meera Nambiar",
    avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300",
    specialty: "Pediatrics",
    qualifications: "MBBS, DCH - Pediatrics",
    experience: 7,
    rating: 4.6,
    reviewsCount: 88,
    fee: 55,
    clinic: "Little Stars Child Clinic",
    location: "Kochi, Ernakulam",
    languages: ["English", "Malayalam", "Hindi"],
    bio: "Pediatric care specialist focusing on pediatric nutrition, routine vaccinations, and developmental milestones.",
    availableSlots: ["09:00 AM", "10:00 AM", "02:00 PM", "04:30 PM"]
  }
];

const initialPatientAppointments = [
  {
    id: "papt-101",
    appointmentNumber: "APT-84920",
    doctorId: "doc-1",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialty: "Cardiology",
    doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    date: "2026-10-02",
    time: "10:30 AM",
    type: "In-Clinic",
    fee: 75,
    status: "Confirmed",
    room: "Suite 4B",
    clinic: "HeartCare Super Specialty Clinic",
    reminderSet: true,
    symptoms: "Routine blood pressure checkup & Holter monitor review",
    isUpcoming: true
  },
  {
    id: "papt-102",
    appointmentNumber: "APT-84935",
    doctorId: "doc-3",
    doctorName: "Dr. Sneha Reddy",
    doctorSpecialty: "Dermatology",
    doctorAvatar: "https://images.unsplash.com/photo-1594824813682-1262d057778b?auto=format&fit=crop&q=80&w=300",
    date: "2026-10-08",
    time: "02:30 PM",
    type: "Video Call",
    fee: 65,
    status: "Confirmed",
    room: "Telehealth Room #2",
    clinic: "Radiance Skin & Laser Center",
    reminderSet: true,
    symptoms: "Follow-up consultation for mild seasonal contact dermatitis",
    isUpcoming: true
  },
  {
    id: "papt-103",
    appointmentNumber: "APT-84720",
    doctorId: "doc-1",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialty: "Cardiology",
    doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    date: "2026-09-15",
    time: "10:00 AM",
    type: "In-Clinic",
    fee: 75,
    status: "Completed",
    room: "Suite 4B",
    clinic: "HeartCare Super Specialty Clinic",
    reminderSet: false,
    symptoms: "Stage 1 Essential Hypertension diagnosis and ECG",
    diagnosis: "Stage 1 Essential Hypertension",
    treatment: "Amlodipine 5mg daily prescribed",
    isUpcoming: false
  },
  {
    id: "papt-104",
    appointmentNumber: "APT-84510",
    doctorId: "doc-2",
    doctorName: "Dr. Ankit Verma",
    doctorSpecialty: "General Medicine",
    doctorAvatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    date: "2026-08-20",
    time: "11:30 AM",
    type: "Video Call",
    fee: 50,
    status: "Completed",
    room: "Telehealth Room #1",
    clinic: "CityHealth Family Medical Center",
    reminderSet: false,
    symptoms: "Seasonal viral fever and body ache",
    diagnosis: "Acute viral respiratory illness",
    treatment: "Paracetamol 650mg, hydration salts",
    isUpcoming: false
  }
];

const initialPatientRecords = {
  medicalHistory: [
    { id: "mh-1", condition: "Stage 1 Essential Hypertension", diagnosedDate: "2025-06-12", doctor: "Dr. Priya Sharma", status: "Active", severity: "Mild", notes: "Monitored on Amlodipine 5mg with daily ambulatory BP logging." },
    { id: "mh-2", condition: "Sinus Palpitations (Stress Induced)", diagnosedDate: "2026-01-18", doctor: "Dr. Priya Sharma", status: "Controlled", severity: "Mild", notes: "2D Echo normal with LVEF 62%. Lifestyle counseling and salt restriction." },
    { id: "mh-3", condition: "Seasonal Allergic Rhinitis", diagnosedDate: "2024-03-22", doctor: "Dr. Ankit Verma", status: "Intermittent", severity: "Low", notes: "Triggered by dust and pollen during spring months." }
  ],
  uploadedDocuments: [
    { id: "doc-rec-1", title: "Comprehensive Lipid Profile & Fasting Blood Sugar", category: "Laboratory Report", uploadDate: "2026-09-12", fileType: "PDF", fileSize: "1.4 MB", downloadUrl: "#" },
    { id: "doc-rec-2", title: "2D Transthoracic Echocardiogram Scan", category: "Cardiology Imaging", uploadDate: "2026-06-08", fileType: "PDF", fileSize: "3.2 MB", downloadUrl: "#" },
    { id: "doc-rec-3", title: "12-Lead Electrocardiogram (ECG) Recording", category: "Diagnostic ECG", uploadDate: "2026-09-15", fileType: "PDF", fileSize: "850 KB", downloadUrl: "#" },
    { id: "doc-rec-4", title: "Chest X-Ray Posteroanterior (PA) View", category: "Radiology", uploadDate: "2026-01-10", fileType: "PDF", fileSize: "2.8 MB", downloadUrl: "#" }
  ],
  labReports: [
    { id: "lab-1", testName: "Complete Blood Count (CBC) with Platelets", diagnosticCenter: "Medicare Central Pathology Lab", testDate: "2026-09-12", status: "Normal", resultSummary: "Hemoglobin 13.8 g/dL, WBC 7,200/mcL, Platelets 260,000/mcL. All parameters within reference limits." },
    { id: "lab-2", testName: "Lipid Profile Panel", diagnosticCenter: "HeartCare Diagnostic Center", testDate: "2026-09-12", status: "Borderline", resultSummary: "Total Cholesterol 210 mg/dL, LDL 128 mg/dL, HDL 54 mg/dL, Triglycerides 140 mg/dL." },
    { id: "lab-3", testName: "Comprehensive Metabolic Panel (CMP)", diagnosticCenter: "Medicare Central Pathology Lab", testDate: "2026-06-08", status: "Normal", resultSummary: "Fasting Glucose 92 mg/dL, Serum Creatinine 0.8 mg/dL, eGFR >90 mL/min." }
  ],
  trackedDiagnoses: [
    { id: "diag-1", condition: "Essential (Primary) Hypertension", icdCode: "I10", firstDiagnosed: "2025-06-12", lastReviewed: "2026-09-15", primarySpecialist: "Dr. Priya Sharma", status: "Under Control", currentTherapy: "Amlodipine 5mg OD" },
    { id: "diag-2", condition: "Stress-Related Autonomic Palpitations", icdCode: "R00.2", firstDiagnosed: "2026-01-18", lastReviewed: "2026-09-15", primarySpecialist: "Dr. Priya Sharma", status: "Asymptomatic", currentTherapy: "Magnesium Supplementation & Yoga" }
  ]
};

const initialPatientConsultations = [
  {
    id: "pcons-1",
    appointmentNumber: "APT-84720",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialty: "Cardiology",
    doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    date: "2026-09-15",
    time: "10:00 AM",
    type: "Video Call",
    duration: "18 minutes",
    symptoms: "Mild chest tightness, episodic palpitation",
    diagnosis: "Stage 1 Essential Hypertension with mild autonomic anxiety",
    notes: "Patient is compliant with Amlodipine 5mg. Clinic BP 134/86 mmHg. S1, S2 audible with no murmurs.",
    treatmentPlan: "Continue Amlodipine 5mg morning. Add magnesium glycinate 200mg at bedtime for 30 days. Maintain low sodium diet.",
    followUpDate: "2026-10-30",
    sharedDocuments: [
      { name: "24h_BP_Log_Sep.pdf", size: "640 KB" },
      { name: "ECG_Sep15.pdf", size: "850 KB" }
    ],
    chatMessages: [
      { id: "cmsg-1", sender: "patient", text: "Good morning Dr. Priya, I have logged my BP readings for the past 7 days.", time: "10:01 AM" },
      { id: "cmsg-2", sender: "doctor", text: "Good morning Aditi! I see the average is around 134/86 mmHg which shows steady improvement.", time: "10:02 AM" },
      { id: "cmsg-3", sender: "patient", text: "Should I continue taking Amlodipine at the exact same time every morning?", time: "10:03 AM" },
      { id: "cmsg-4", sender: "doctor", text: "Yes, consistent morning timing helps maintain therapeutic plasma levels throughout your day.", time: "10:04 AM" }
    ]
  }
];

const initialPatientPrescriptions = [
  {
    id: "prx-101",
    prescriptionNumber: "RX-MED-84920",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialty: "Cardiology & Vascular Interventions",
    doctorQualifications: "MBBS, MD (AIIMS), DM (Cardiology), FACC",
    clinic: "HeartCare Super Specialty Clinic, Bangalore",
    date: "2026-09-15",
    validUntil: "2026-12-15",
    diagnosis: "Stage 1 Essential Hypertension & Autonomic Palpitations",
    medicines: [
      { id: "m-1", name: "Amlodipine Besylate", dosage: "5mg", frequency: "1-0-0 (Morning)", duration: "90 Days", instructions: "Take after breakfast with water" },
      { id: "m-2", name: "Telmisartan", dosage: "40mg", frequency: "0-0-1 (Night)", duration: "90 Days", instructions: "Take before bedtime" },
      { id: "m-3", name: "Magnesium Glycinate", dosage: "200mg", frequency: "0-0-1 (Night)", duration: "30 Days", instructions: "Take after dinner with milk or water" }
    ],
    generalAdvice: "Limit sodium intake to under 2 grams daily. Avoid caffeine after 4:00 PM. Daily 30-minute brisk walking.",
    followUpDate: "2026-10-30"
  },
  {
    id: "prx-102",
    prescriptionNumber: "RX-MED-84510",
    doctorName: "Dr. Ankit Verma",
    doctorSpecialty: "General Medicine",
    doctorQualifications: "MBBS, DNB - Family Medicine",
    clinic: "CityHealth Family Medical Center, Mumbai",
    date: "2026-08-20",
    validUntil: "2026-09-20",
    diagnosis: "Acute Viral Respiratory Tract Illness",
    medicines: [
      { id: "m-4", name: "Paracetamol", dosage: "650mg", frequency: "1-0-1 (Twice a day)", duration: "5 Days", instructions: "Take after meals for fever or body ache" },
      { id: "m-5", name: "Cetirizine Hydrochloride", dosage: "10mg", frequency: "0-0-1 (Night)", duration: "5 Days", instructions: "Take at bedtime for allergic runny nose" },
      { id: "m-6", name: "Vitamin C with Zinc", dosage: "500mg", frequency: "1-0-0 (Morning)", duration: "15 Days", instructions: "Chew after breakfast" }
    ],
    generalAdvice: "Adequate hydration (at least 3 liters of warm water daily). Steam inhalation twice daily.",
    followUpDate: "2026-08-27"
  }
];

const initialPatientPayments = {
  transactions: [
    { id: "ptx-1", invoiceNo: "INV-2026-9901", appointmentNumber: "APT-84920", doctorName: "Dr. Priya Sharma", specialty: "Cardiology", amount: 75, paymentMethod: "Credit Card (Visa •••• 4242)", date: "2026-10-01", time: "14:17", status: "Paid", description: "Follow-up consultation fee (In-Clinic)" },
    { id: "ptx-2", invoiceNo: "INV-2026-9903", appointmentNumber: "APT-84935", doctorName: "Dr. Sneha Reddy", specialty: "Dermatology", amount: 65, paymentMethod: "UPI (Google Pay)", date: "2026-09-28", time: "11:20", status: "Paid", description: "Telehealth video consultation fee" },
    { id: "ptx-3", invoiceNo: "INV-2026-9482", appointmentNumber: "APT-84720", doctorName: "Dr. Priya Sharma", specialty: "Cardiology", amount: 75, paymentMethod: "Credit Card (Visa •••• 4242)", date: "2026-09-14", time: "09:30", status: "Paid", description: "Comprehensive cardiology consultation & ECG" },
    { id: "ptx-4", invoiceNo: "INV-2026-9210", appointmentNumber: "APT-84300", doctorName: "Dr. Rajesh Iyer", specialty: "Neurology", amount: 90, paymentMethod: "UPI (PhonePe)", date: "2026-08-10", time: "16:45", status: "Refunded", description: "Cancelled appointment - Slot conflict refund" }
  ],
  refunds: [
    { id: "pref-1", refundId: "RF-8815", invoiceNo: "INV-2026-9210", appointmentNumber: "APT-84300", amount: 90, reason: "Appointment cancelled by patient 24 hours prior to slot", requestedDate: "2026-08-10", processedDate: "2026-08-11", status: "Completed", refundSource: "Original Payment Method (UPI PhonePe)" }
  ]
};

const initialPatientNotifications = [
  { id: "notif-1", category: "reminder", title: "Upcoming Appointment in 24 Hours", message: "Your Cardiology consultation with Dr. Priya Sharma is scheduled for tomorrow at 10:30 AM in Suite 4B.", timestamp: "2 hours ago", read: false },
  { id: "notif-2", category: "prescription", title: "New Digital Prescription Issued", message: "Dr. Priya Sharma has issued electronic prescription #RX-MED-84920 with 3 active medicines.", timestamp: "Yesterday at 04:15 PM", read: false },
  { id: "notif-3", category: "payment", title: "Payment Receipt Generated", message: "Your consultation payment of $75 for Invoice #INV-2026-9901 has been confirmed. Download your invoice.", timestamp: "2 days ago", read: true },
  { id: "notif-4", category: "message", title: "Message from Dr. Priya Sharma", message: "Please log your morning blood pressure readings before our upcoming consultation tomorrow.", timestamp: "3 days ago", read: true }
];

export const syncPatientAppointments = async () => {
  try {
    const [upcomingRes, historyRes] = await Promise.allSettled([
      axiosClient.get("/api/v1/patient/appointments/upcoming"),
      axiosClient.get("/api/v1/patient/appointments/history"),
    ]);

    const upcomingData =
      upcomingRes.status === "fulfilled" && Array.isArray(upcomingRes.value.data?.data)
        ? upcomingRes.value.data.data.map(adaptAppointmentFromBackend)
        : [];

    const historyData =
      historyRes.status === "fulfilled" && Array.isArray(historyRes.value.data?.data)
        ? historyRes.value.data.data.map(adaptAppointmentFromBackend)
        : [];

    const combinedMap = new Map();
    [...upcomingData, ...historyData].forEach((apt) => {
      if (apt && apt.id) combinedMap.set(apt.id, apt);
    });

    if (combinedMap.size > 0) {
      const combined = Array.from(combinedMap.values());
      savePatientAppointments(combined);
      return combined;
    }
  } catch (err) {
    console.warn("syncPatientAppointments notice:", err.message);
  }
  return getPatientAppointments();
};

export const syncPatientPrescriptions = async () => {
  try {
    const res = await axiosClient.get("/api/v1/patient/prescriptions");
    if (res.data?.data && Array.isArray(res.data.data)) {
      const adapted = res.data.data.map(adaptPrescriptionFromBackend);
      savePatientPrescriptions(adapted);
      return adapted;
    }
  } catch (err) {
    console.warn("syncPatientPrescriptions notice:", err.message);
  }
  return getPatientPrescriptions();
};

export const syncPatientDoctors = async () => {
  try {
    const res = await axiosClient.get("/api/v1/patient/doctors");
    if (res.data?.data && Array.isArray(res.data.data)) {
      const adapted = res.data.data.map(adaptDoctorFromBackend);
      safeSet(STORAGE_KEYS.AVAILABLE_DOCTORS, adapted);
      return adapted;
    }
  } catch (err) {
    console.warn("syncPatientDoctors notice:", err.message);
  }
  return getAvailableDoctors();
};

export const syncPatientNotifications = async () => {
  try {
    const res = await axiosClient.get("/api/v1/patient/notifications");
    if (res.data?.data && Array.isArray(res.data.data)) {
      const mapped = res.data.data.map((n) => ({
        id: String(n._id || n.id),
        category: n.type || "reminder",
        title: n.title,
        message: n.message,
        timestamp: "Recently",
        read: Boolean(n.isRead),
      }));
      savePatientNotifications(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn("syncPatientNotifications notice:", err.message);
  }
  return getPatientNotifications();
};

export const syncPatientProfile = async () => {
  try {
    const res = await axiosClient.get("/api/v1/patient/profile");
    if (res.data?.data) {
      const pat = res.data.data;
      const current = getPatientProfile();
      const updated = {
        ...current,
        name: pat.name || current.name,
        email: pat.email || current.email,
        phone: pat.phone || current.phone,
        gender: pat.gender || current.gender,
        bloodGroup: pat.bloodGroup || current.bloodGroup,
        age: Number(pat.age) || current.age,
        address: pat.address || current.address,
        allergies: Array.isArray(pat.allergies) && pat.allergies.length > 0 ? pat.allergies : current.allergies,
        medicalConditions: Array.isArray(pat.medicalConditions) && pat.medicalConditions.length > 0 ? pat.medicalConditions : current.medicalConditions,
      };
      safeSet(STORAGE_KEYS.PATIENT_PROFILE, updated);
      return updated;
    }
  } catch (err) {
    console.warn("syncPatientProfile notice:", err.message);
  }
  return getPatientProfile();
};

export const getPatientProfile = () => safeGet(STORAGE_KEYS.PATIENT_PROFILE, initialPatientProfile);

export const savePatientProfile = (profile) => {
  safeSet(STORAGE_KEYS.PATIENT_PROFILE, profile);
  // Dispatch to backend API
  axiosClient.put("/api/v1/patient/profile", profile).catch((err) =>
    console.warn("Backend savePatientProfile notice:", err.message)
  );
  return profile;
};

export const getAvailableDoctors = () => safeGet(STORAGE_KEYS.AVAILABLE_DOCTORS, initialAvailableDoctors);

export const getPatientAppointments = () => safeGet(STORAGE_KEYS.PATIENT_APPOINTMENTS, initialPatientAppointments);

export const savePatientAppointments = (appointments) => {
  safeSet(STORAGE_KEYS.PATIENT_APPOINTMENTS, appointments);
  return appointments;
};

export const bookPatientAppointment = (booking) => {
  const list = getPatientAppointments();
  const tempId = `papt-${Date.now()}`;
  const newAppointment = {
    ...booking,
    id: tempId,
    appointmentNumber: `APT-${Math.floor(10000 + Math.random() * 90000)}`,
    status: "Confirmed",
    reminderSet: true,
    isUpcoming: true
  };
  list.unshift(newAppointment);
  savePatientAppointments(list);

  const notifs = getPatientNotifications();
  const newNotif = {
    id: `notif-${Date.now()}`,
    category: "reminder",
    title: "Appointment Successfully Booked",
    message: `Your appointment with ${booking.doctorName} for ${booking.date} at ${booking.time} is confirmed.`,
    timestamp: "Just now",
    read: false
  };
  savePatientNotifications([newNotif, ...notifs]);

  // Dispatch to backend API
  if (booking.doctorId) {
    axiosClient.post("/api/v1/patient/appointments", {
      doctorId: booking.doctorId,
      appointmentDate: booking.date,
      timeSlot: booking.time,
      consultationType: booking.type?.toLowerCase().includes("video") ? "video" : "in_clinic",
      reasonForVisit: booking.symptoms || booking.reason || "General consultation",
    }).then((res) => {
      if (res.data?.data) {
        const realApt = adaptAppointmentFromBackend(res.data.data);
        const currentList = getPatientAppointments();
        const replaced = currentList.map((a) => (a.id === tempId ? realApt : a));
        savePatientAppointments(replaced);
      }
    }).catch((err) => console.warn("Backend bookPatientAppointment notice:", err.message));
  }

  return newAppointment;
};

export const cancelPatientAppointment = (id, reason = "Cancelled by patient") => {
  const list = getPatientAppointments();
  const updated = list.map((a) =>
    a.id === id ? { ...a, status: "Cancelled", isUpcoming: false, cancelReason: reason } : a
  );

  // Dispatch to backend API
  axiosClient.patch(`/api/v1/patient/appointments/${id}/cancel`, {
    cancellationReason: reason,
  }).catch((err) => console.warn("Backend cancelPatientAppointment notice:", err.message));

  return savePatientAppointments(updated);
};

export const reschedulePatientAppointment = (id, newDate, newTime) => {
  const list = getPatientAppointments();
  const updated = list.map((a) =>
    a.id === id ? { ...a, date: newDate, time: newTime, status: "Confirmed" } : a
  );

  // Dispatch to backend API
  axiosClient.patch(`/api/v1/patient/appointments/${id}/reschedule`, {
    newDate,
    newTimeSlot: newTime,
    reason: "Rescheduled by patient",
  }).catch((err) => console.warn("Backend reschedulePatientAppointment notice:", err.message));

  return savePatientAppointments(updated);
};

export const toggleAppointmentReminder = (id) => {
  const list = getPatientAppointments();
  const updated = list.map((a) =>
    a.id === id ? { ...a, reminderSet: !a.reminderSet } : a
  );
  return savePatientAppointments(updated);
};

export const getPatientRecords = () => safeGet(STORAGE_KEYS.PATIENT_RECORDS, initialPatientRecords);

export const savePatientRecords = (records) => {
  safeSet(STORAGE_KEYS.PATIENT_RECORDS, records);
  return records;
};

export const uploadPatientMedicalDocument = (document) => {
  const data = getPatientRecords();
  const newDoc = {
    ...document,
    id: `doc-rec-${Date.now()}`,
    uploadDate: new Date().toISOString().substring(0, 10),
    fileType: "PDF",
    downloadUrl: "#"
  };
  const updated = {
    ...data,
    uploadedDocuments: [newDoc, ...(data.uploadedDocuments || [])]
  };
  return savePatientRecords(updated);
};

export const getPatientConsultations = () => safeGet(STORAGE_KEYS.PATIENT_CONSULTATIONS, initialPatientConsultations);

export const savePatientConsultations = (consultations) => {
  safeSet(STORAGE_KEYS.PATIENT_CONSULTATIONS, consultations);
  return consultations;
};

export const addConsultationChatMessage = (consultationId, message) => {
  const list = getPatientConsultations();
  const updated = list.map((c) => {
    if (c.id !== consultationId) return c;
    return {
      ...c,
      chatMessages: [...(c.chatMessages || []), message]
    };
  });

  // Dispatch to backend API
  axiosClient.post(`/api/v1/patient/consultations/${consultationId}/messages`, {
    message: typeof message === "string" ? message : message.text || message.message,
  }).catch((err) => console.warn("Backend consultation message notice:", err.message));

  return savePatientConsultations(updated);
};

export const getPatientPrescriptions = () => safeGet(STORAGE_KEYS.PATIENT_PRESCRIPTIONS, initialPatientPrescriptions);

export const savePatientPrescriptions = (prescriptions) => {
  safeSet(STORAGE_KEYS.PATIENT_PRESCRIPTIONS, prescriptions);
  return prescriptions;
};

export const getPatientPayments = () => safeGet(STORAGE_KEYS.PATIENT_PAYMENTS, initialPatientPayments);

export const savePatientPayments = (payments) => {
  safeSet(STORAGE_KEYS.PATIENT_PAYMENTS, payments);
  return payments;
};

export const makePatientPayment = (paymentData) => {
  const data = getPatientPayments();
  const newTx = {
    ...paymentData,
    id: `ptx-${Date.now()}`,
    invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().substring(0, 10),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    status: "Paid",
    receiptUrl: "#"
  };
  const updated = {
    ...data,
    transactions: [newTx, ...(data.transactions || [])]
  };
  savePatientPayments(updated);

  const notifs = getPatientNotifications();
  const newNotif = {
    id: `notif-${Date.now()}`,
    category: "payment",
    title: "Payment Receipt Available",
    message: `Payment of $${paymentData.amount} for ${paymentData.doctorName} was successful. Invoice #${newTx.invoiceNo} is ready.`,
    timestamp: "Just now",
    read: false
  };
  savePatientNotifications([newNotif, ...notifs]);

  // Dispatch to backend API
  axiosClient.post("/api/v1/patient/payments/checkout", {
    amount: paymentData.amount,
    doctorId: paymentData.doctorId,
    paymentMethod: paymentData.paymentMethod || "upi",
  }).catch((err) => console.warn("Backend payment checkout notice:", err.message));

  return newTx;
};

export const getPatientNotifications = () => safeGet(STORAGE_KEYS.PATIENT_NOTIFICATIONS, initialPatientNotifications);

export const savePatientNotifications = (notifications) => {
  safeSet(STORAGE_KEYS.PATIENT_NOTIFICATIONS, notifications);
  return notifications;
};

export const markNotificationAsRead = (id) => {
  const list = getPatientNotifications();
  const updated = list.map((n) => (n.id === id ? { ...n, read: true } : n));

  // Dispatch to backend API
  axiosClient.patch(`/api/v1/patient/notifications/${id}/read`).catch(() => null);

  return savePatientNotifications(updated);
};

export const markAllNotificationsAsRead = () => {
  const list = getPatientNotifications();
  const updated = list.map((n) => ({ ...n, read: true }));

  // Dispatch to backend API
  axiosClient.patch("/api/v1/patient/notifications/read-all").catch(() => null);

  return savePatientNotifications(updated);
};
