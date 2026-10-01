const STORAGE_KEYS = {
  DOCTOR_PROFILE: "medicare_doctor_profile",
  DOCTOR_SCHEDULE: "medicare_doctor_schedule",
  DOCTOR_APPOINTMENTS: "medicare_doctor_appointments",
  DOCTOR_PATIENTS: "medicare_doctor_patients",
  DOCTOR_CONSULTATIONS: "medicare_doctor_consultations",
  DOCTOR_PRESCRIPTIONS: "medicare_doctor_prescriptions",
  DOCTOR_REPORTS: "medicare_doctor_reports",
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

const initialDoctorProfile = {
  id: "doc-1",
  name: "Dr. Priya Sharma",
  title: "Senior Interventional Cardiologist",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
  email: "priya.sharma@medicare.com",
  phone: "+91 98765 43210",
  specialization: "Cardiology & Vascular Interventions",
  qualifications: "MBBS, MD (General Medicine - AIIMS), DM (Cardiology - NIMHANS), FACC",
  experience: 12,
  consultationFee: "$75",
  clinicName: "HeartCare Super Specialty Clinic & Research Institute",
  clinicAddress: "Suite 402, 4th Floor, East Tower, 100 Feet Road, Indiranagar, Bangalore - 560038",
  availableLanguages: ["English", "Hindi", "Kannada", "Tamil"],
  verificationStatus: "Verified",
  mciRegistrationNumber: "MCI-2014-98432-KA",
  stateMedicalCouncil: "Karnataka Medical Council",
  bio: "Senior interventional cardiologist with over a decade of clinical practice specializing in non-invasive coronary diagnostics, preventive hypertension protocols, heart failure management, and lipidology. Published author in 14 peer-reviewed clinical cardiology journals.",
  awards: [
    "Distinguished Clinical Cardiologist Award (2024)",
    "AIIMS Gold Medal in Clinical Pharmacology (2014)"
  ],
  memberships: [
    "Cardiological Society of India (CSI)",
    "American College of Cardiology (FACC)"
  ]
};

const initialDoctorSchedule = {
  workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  workingHours: {
    start: "09:00",
    end: "17:00",
    slotDurationMinutes: 30,
    breakStart: "13:00",
    breakEnd: "14:00"
  },
  slots: [
    { id: "slot-1", time: "09:00 AM", status: "Booked", patient: "Aditi Kapoor" },
    { id: "slot-2", time: "09:30 AM", status: "Available", patient: null },
    { id: "slot-3", time: "10:00 AM", status: "Booked", patient: "Rohan Mehta" },
    { id: "slot-4", time: "10:30 AM", status: "Booked", patient: "Sunita Deshmukh" },
    { id: "slot-5", time: "11:00 AM", status: "Available", patient: null },
    { id: "slot-6", time: "11:30 AM", status: "Available", patient: null },
    { id: "slot-7", time: "02:00 PM", status: "Booked", patient: "Vikram Nair" },
    { id: "slot-8", time: "02:30 PM", status: "Available", patient: null },
    { id: "slot-9", time: "03:00 PM", status: "Booked", patient: "Ananya Iyer" },
    { id: "slot-10", time: "03:30 PM", status: "Blocked", patient: null },
    { id: "slot-11", time: "04:00 PM", status: "Available", patient: null },
    { id: "slot-12", time: "04:30 PM", status: "Available", patient: null }
  ],
  blockedDates: [
    { id: "blk-1", date: "2026-10-12", reason: "Medical Conference (Annual Cardiology Summit, Delhi)" },
    { id: "blk-2", date: "2026-10-24", reason: "Scheduled Clinic Equipment Maintenance" }
  ],
  leaves: [
    { id: "lv-1", startDate: "2026-11-02", endDate: "2026-11-06", type: "Annual Vacation", reason: "Family Vacation", status: "Approved" },
    { id: "lv-2", startDate: "2026-12-18", endDate: "2026-12-20", type: "CME Conference", reason: "Speaker at European Cardiology Congress", status: "Pending" }
  ]
};

const initialDoctorAppointments = [
  {
    id: "dapt-101",
    appointmentNumber: "APT-84920",
    patientId: "pat-1",
    patientName: "Aditi Kapoor",
    patientAge: 29,
    patientGender: "Female",
    patientPhone: "+91 98111 22334",
    patientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    date: "2026-10-01",
    time: "09:00 AM",
    type: "In-Clinic",
    status: "Confirmed",
    isToday: true,
    symptoms: "Mild chest tightness upon morning exertion, stress-induced palpitations",
    room: "Suite 4B",
    fee: "$75"
  },
  {
    id: "dapt-102",
    appointmentNumber: "APT-84921",
    patientId: "pat-2",
    patientName: "Rohan Mehta",
    patientAge: 34,
    patientGender: "Male",
    patientPhone: "+91 98222 33445",
    patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    date: "2026-10-01",
    time: "10:00 AM",
    type: "Video Call",
    status: "Confirmed",
    isToday: true,
    symptoms: "Review of 24h Holter monitor report & blood pressure log",
    room: "Telehealth Room #1",
    fee: "$75"
  },
  {
    id: "dapt-103",
    appointmentNumber: "APT-84924",
    patientId: "pat-3",
    patientName: "Sunita Deshmukh",
    patientAge: 52,
    patientGender: "Female",
    patientPhone: "+91 98333 44556",
    patientAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    date: "2026-10-01",
    time: "10:30 AM",
    type: "In-Clinic",
    status: "Pending",
    isToday: true,
    symptoms: "Elevated systolic BP readings (150/95 mmHg) despite current dosage",
    room: "Suite 4B",
    fee: "$75"
  },
  {
    id: "dapt-104",
    appointmentNumber: "APT-84931",
    patientId: "pat-4",
    patientName: "Vikram Nair",
    patientAge: 46,
    patientGender: "Male",
    patientPhone: "+91 98444 55667",
    patientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    date: "2026-10-01",
    time: "02:00 PM",
    type: "In-Clinic",
    status: "Confirmed",
    isToday: true,
    symptoms: "Post-stent 6-month angiogram evaluation & lipid panel check",
    room: "Suite 4B",
    fee: "$75"
  },
  {
    id: "dapt-105",
    appointmentNumber: "APT-84942",
    patientId: "pat-5",
    patientName: "Ananya Iyer",
    patientAge: 24,
    patientGender: "Female",
    patientPhone: "+91 98555 66778",
    patientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    date: "2026-10-01",
    time: "03:00 PM",
    type: "Video Call",
    status: "Confirmed",
    isToday: true,
    symptoms: "Tachycardia episodes following caffeine intake, postural dizziness",
    room: "Telehealth Room #2",
    fee: "$75"
  },
  {
    id: "dapt-106",
    appointmentNumber: "APT-85002",
    patientId: "pat-6",
    patientName: "Amitabh Banerjee",
    patientAge: 58,
    patientGender: "Male",
    patientPhone: "+91 98666 77889",
    patientAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200",
    date: "2026-10-03",
    time: "11:00 AM",
    type: "In-Clinic",
    status: "Confirmed",
    isToday: false,
    symptoms: "Routine cardiac follow up, ECG scheduled",
    room: "Suite 4B",
    fee: "$75"
  },
  {
    id: "dapt-107",
    appointmentNumber: "APT-85010",
    patientId: "pat-7",
    patientName: "Meenakshi Sundaram",
    patientAge: 41,
    patientGender: "Female",
    patientPhone: "+91 98777 88990",
    patientAvatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=200",
    date: "2026-10-04",
    time: "03:30 PM",
    type: "Video Call",
    status: "Pending",
    isToday: false,
    symptoms: "Family history of early coronary artery disease screening",
    room: "Telehealth Room #1",
    fee: "$75"
  },
  {
    id: "dapt-108",
    appointmentNumber: "APT-84720",
    patientId: "pat-1",
    patientName: "Aditi Kapoor",
    patientAge: 29,
    patientGender: "Female",
    patientPhone: "+91 98111 22334",
    patientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    date: "2026-09-15",
    time: "10:00 AM",
    type: "In-Clinic",
    status: "Completed",
    isToday: false,
    symptoms: "Stage 1 Essential Hypertension diagnosis",
    room: "Suite 4B",
    fee: "$75"
  },
  {
    id: "dapt-109",
    appointmentNumber: "APT-84615",
    patientId: "pat-4",
    patientName: "Vikram Nair",
    patientAge: 46,
    patientGender: "Male",
    patientPhone: "+91 98444 55667",
    patientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    date: "2026-09-08",
    time: "02:30 PM",
    type: "In-Clinic",
    status: "Completed",
    isToday: false,
    symptoms: "Post-angioplasty 3-month review",
    room: "Suite 4B",
    fee: "$75"
  }
];

const initialDoctorPatients = [
  {
    id: "pat-1",
    name: "Aditi Kapoor",
    email: "aditi.kapoor@example.com",
    phone: "+91 98111 22334",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    age: 29,
    gender: "Female",
    bloodGroup: "B+",
    city: "Bangalore",
    plan: "Premium",
    allergies: ["Penicillin", "Peanuts"],
    currentMedications: [
      { name: "Amlodipine", dosage: "5mg", frequency: "1-0-0", duration: "Continuous", instructions: "Morning with water" },
      { name: "Telmisartan", dosage: "40mg", frequency: "0-0-1", duration: "Continuous", instructions: "Bedtime" }
    ],
    medicalHistory: [
      { condition: "Stage 1 Essential Hypertension", diagnosedDate: "2025-06-12", status: "Active" },
      { condition: "Sinus Palpitations (Stress Induced)", diagnosedDate: "2026-01-18", status: "Controlled" }
    ],
    previousConsultations: [
      { id: "c-101", date: "2026-09-15", doctor: "Dr. Priya Sharma", diagnosis: "Mild Stage 1 Hypertension with stress-induced palpitations", treatment: "Amlodipine 5mg maintained, lifestyle counsel", fee: 75 },
      { id: "c-102", date: "2026-06-10", doctor: "Dr. Priya Sharma", diagnosis: "Initial cardiac evaluation & 2D Echo", treatment: "Echo cleared with EF 62%, advised salt restriction", fee: 75 }
    ],
    previousPrescriptions: [
      { id: "rx-901", date: "2026-09-15", medicinesCount: 2, summary: "Amlodipine 5mg, Telmisartan 40mg" },
      { id: "rx-842", date: "2026-06-10", medicinesCount: 1, summary: "Telmisartan 20mg" }
    ],
    uploadedReports: [
      { id: "rep-101", title: "Comprehensive Lipid Profile & Fasting Blood Sugar", date: "2026-09-12", fileType: "PDF", size: "1.4 MB", interpretation: "Total cholesterol 210 mg/dL, LDL 128 mg/dL. Statin therapy not immediately indicated." },
      { id: "rep-102", title: "2D Transthoracic Echocardiogram Report", date: "2026-06-08", fileType: "PDF", size: "3.2 MB", interpretation: "Normal LV systolic function, LVEF 62%, no regional wall motion abnormalities." },
      { id: "rep-103", title: "12-Lead Electrocardiogram (ECG)", date: "2026-09-15", fileType: "PDF", size: "850 KB", interpretation: "Normal sinus rhythm, heart rate 74 bpm, PR interval 150ms." }
    ]
  },
  {
    id: "pat-2",
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "+91 98222 33445",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    age: 34,
    gender: "Male",
    bloodGroup: "O+",
    city: "Mumbai",
    plan: "Standard",
    allergies: ["Sulfa drugs"],
    currentMedications: [
      { name: "Metoprolol Succinate", dosage: "25mg", frequency: "1-0-0", duration: "30 days", instructions: "After breakfast" },
      { name: "Multivitamin Gold", dosage: "1 tab", frequency: "0-1-0", duration: "60 days", instructions: "After lunch" }
    ],
    medicalHistory: [
      { condition: "Benign Ventricular Ectopics", diagnosedDate: "2025-11-20", status: "Monitoring" },
      { condition: "Mild Dyslipidemia", diagnosedDate: "2026-02-14", status: "Active" }
    ],
    previousConsultations: [
      { id: "c-201", date: "2026-08-20", doctor: "Dr. Priya Sharma", diagnosis: "Post-viral fatigue and occasional skipped beats", treatment: "Metoprolol 25mg ER, 24h Holter prescribed", fee: 75 }
    ],
    previousPrescriptions: [
      { id: "rx-711", date: "2026-08-20", medicinesCount: 2, summary: "Metoprolol Succinate 25mg, Multivitamin" }
    ],
    uploadedReports: [
      { id: "rep-201", title: "24-Hour Ambulatory Holter Monitoring Record", date: "2026-09-28", fileType: "PDF", size: "4.1 MB", interpretation: "Predominant sinus rhythm, isolated unifocal PVCs under 0.8% total beats. Benign profile." }
    ]
  },
  {
    id: "pat-3",
    name: "Sunita Deshmukh",
    email: "sunita.d@example.com",
    phone: "+91 98333 44556",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    age: 52,
    gender: "Female",
    bloodGroup: "A+",
    city: "Pune",
    plan: "Premium",
    allergies: ["None"],
    currentMedications: [
      { name: "Olmesartan Medoxomil", dosage: "20mg", frequency: "1-0-0", duration: "Continuous", instructions: "Daily morning" },
      { name: "Atorvastatin", dosage: "10mg", frequency: "0-0-1", duration: "Continuous", instructions: "At bedtime" }
    ],
    medicalHistory: [
      { condition: "Primary Hypertension (10 years)", diagnosedDate: "2016-04-10", status: "Active" },
      { condition: "Familial Hypercholesterolemia", diagnosedDate: "2018-09-02", status: "Active" }
    ],
    previousConsultations: [
      { id: "c-301", date: "2026-07-14", doctor: "Dr. Priya Sharma", diagnosis: "Uncontrolled systolic pressure with headaches", treatment: "Dose stepped up from 10mg to 20mg Olmesartan", fee: 75 }
    ],
    previousPrescriptions: [
      { id: "rx-602", date: "2026-07-14", medicinesCount: 2, summary: "Olmesartan 20mg, Atorvastatin 10mg" }
    ],
    uploadedReports: [
      { id: "rep-301", title: "Carotid Doppler & Intima-Media Thickness Scan", date: "2026-07-10", fileType: "PDF", size: "2.8 MB", interpretation: "Bilateral carotid IMT within normal limits. No hemodynamically significant stenosis." },
      { id: "rep-302", title: "Renal Function & Serum Electrolytes Panel", date: "2026-07-11", fileType: "PDF", size: "1.1 MB", interpretation: "Serum Creatinine 0.9 mg/dL, eGFR >90 mL/min, Potassium 4.3 mEq/L." }
    ]
  },
  {
    id: "pat-4",
    name: "Vikram Nair",
    email: "vikram.nair@example.com",
    phone: "+91 98444 55667",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    age: 46,
    gender: "Male",
    bloodGroup: "AB+",
    city: "Chennai",
    plan: "Standard",
    allergies: ["Aspirin (Mild Gastric Sensitivity)"],
    currentMedications: [
      { name: "Clopidogrel", dosage: "75mg", frequency: "1-0-0", duration: "1 Year Post-PCI", instructions: "After lunch" },
      { name: "Rosuvastatin", dosage: "20mg", frequency: "0-0-1", duration: "Continuous", instructions: "Bedtime" },
      { name: "Pantoprazole", dosage: "40mg", frequency: "1-0-0", duration: "30 days", instructions: "Before breakfast" }
    ],
    medicalHistory: [
      { condition: "Single Vessel CAD (LAD Stented 2026-03)", diagnosedDate: "2026-03-05", status: "Stable Post-PCI" },
      { condition: "Type 2 Diabetes Mellitus", diagnosedDate: "2022-08-11", status: "Controlled" }
    ],
    previousConsultations: [
      { id: "c-401", date: "2026-09-08", doctor: "Dr. Priya Sharma", diagnosis: "Post-angioplasty routine checkup & lipid review", treatment: "Dual antiplatelet therapy monitored, ECG normal", fee: 75 },
      { id: "c-402", date: "2026-03-08", doctor: "Dr. Priya Sharma", diagnosis: "Post-discharge angiographic review", treatment: "Prescribed DAPT protocol, cardiac rehab initiated", fee: 75 }
    ],
    previousPrescriptions: [
      { id: "rx-551", date: "2026-09-08", medicinesCount: 3, summary: "Clopidogrel 75mg, Rosuvastatin 20mg, Pantoprazole 40mg" }
    ],
    uploadedReports: [
      { id: "rep-401", title: "Post-Intervention Coronary Angiogram DVD & Report", date: "2026-03-06", fileType: "PDF", size: "8.5 MB", interpretation: "Successful DES placement in mid-LAD with TIMI 3 flow, 0% residual stenosis." },
      { id: "rep-402", title: "High-Sensitivity Troponin I & CK-MB Profile", date: "2026-03-07", fileType: "PDF", size: "900 KB", interpretation: "Troponin I returned to baseline <0.02 ng/mL." }
    ]
  },
  {
    id: "pat-5",
    name: "Ananya Iyer",
    email: "ananya.iyer@example.com",
    phone: "+91 98555 66778",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    age: 24,
    gender: "Female",
    bloodGroup: "O-",
    city: "Hyderabad",
    plan: "Basic",
    allergies: ["Dust", "Pollen"],
    currentMedications: [
      { name: "Propranolol", dosage: "10mg", frequency: "1-0-1", duration: "14 days", instructions: "As needed for tachycardia" }
    ],
    medicalHistory: [
      { condition: "Postural Orthostatic Tachycardia Syndrome (POTS)", diagnosedDate: "2026-04-19", status: "Active" },
      { condition: "Iron Deficiency Anemia", diagnosedDate: "2026-02-10", status: "Resolved" }
    ],
    previousConsultations: [
      { id: "c-501", date: "2026-05-12", doctor: "Dr. Priya Sharma", diagnosis: "Orthostatic intolerance and postural palpitations", treatment: "Increased fluid & electrolyte intake, low-dose beta blocker", fee: 75 }
    ],
    previousPrescriptions: [
      { id: "rx-499", date: "2026-05-12", medicinesCount: 1, summary: "Propranolol 10mg" }
    ],
    uploadedReports: [
      { id: "rep-501", title: "Head-Up Tilt Table (HUTT) Test Examination", date: "2026-05-08", fileType: "PDF", size: "2.1 MB", interpretation: "Heart rate increase of 38 bpm within 10 minutes of upright tilt without orthostatic hypotension. Consistent with POTS." }
    ]
  }
];

const initialDoctorConsultations = [
  {
    id: "cons-101",
    appointmentId: "dapt-101",
    patientName: "Aditi Kapoor",
    patientAge: 29,
    patientGender: "Female",
    date: "2026-10-01",
    time: "09:00 AM",
    symptoms: "Mild chest tightness, episodic palpitation",
    diagnosis: "Stage 1 Essential Hypertension with mild autonomic anxiety",
    notes: "Patient is compliant with Amlodipine 5mg. BP recorded at 134/86 mmHg in clinic. Heart sounds S1, S2 audible with no murmurs. Lungs clear to auscultation bilaterally. Advised mindfulness breathing and daily 30-minute aerobic walk.",
    treatmentPlan: "Continue Amlodipine 5mg morning. Add magnesium glycinate 200mg at bedtime for 30 days. Maintain low sodium diet (<2g/day).",
    followUpDate: "2026-10-30",
    status: "Completed",
    chatMessages: [
      { id: "msg-1", sender: "patient", senderName: "Aditi Kapoor", text: "Good morning Dr. Priya, I have logged my BP readings for the past 7 days.", time: "09:01 AM" },
      { id: "msg-2", sender: "doctor", senderName: "Dr. Priya Sharma", text: "Good morning Aditi. Thank you, I see the average is around 134/86 mmHg which shows steady improvement.", time: "09:02 AM" },
      { id: "msg-3", sender: "patient", senderName: "Aditi Kapoor", text: "Should I continue taking Amlodipine at the exact same time every morning?", time: "09:03 AM" },
      { id: "msg-4", sender: "doctor", senderName: "Dr. Priya Sharma", text: "Yes, consistent morning timing helps maintain therapeutic plasma levels throughout your work hours.", time: "09:04 AM" }
    ]
  }
];

const initialDoctorPrescriptions = [
  {
    id: "rx-2026-001",
    prescriptionNumber: "RX-MED-84920",
    patientId: "pat-1",
    patientName: "Aditi Kapoor",
    patientAge: 29,
    patientGender: "Female",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialty: "Cardiology",
    date: "2026-10-01",
    diagnosis: "Stage 1 Essential Hypertension & Autonomic Palpitations",
    medicines: [
      { id: "med-1", name: "Amlodipine Besylate", dosage: "5mg", frequency: "1-0-0 (Morning)", duration: "30 Days", instructions: "Take after breakfast with water" },
      { id: "med-2", name: "Telmisartan", dosage: "40mg", frequency: "0-0-1 (Night)", duration: "30 Days", instructions: "Take before bedtime" },
      { id: "med-3", name: "Magnesium Glycinate", dosage: "200mg", frequency: "0-0-1 (Night)", duration: "30 Days", instructions: "Take after dinner with milk or water" }
    ],
    generalAdvice: "Limit sodium intake to under 2 grams daily. Avoid caffeine after 4:00 PM. Schedule follow-up ECG in 4 weeks.",
    followUpDate: "2026-10-30"
  },
  {
    id: "rx-2026-002",
    prescriptionNumber: "RX-MED-84615",
    patientId: "pat-4",
    patientName: "Vikram Nair",
    patientAge: 46,
    patientGender: "Male",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialty: "Cardiology",
    date: "2026-09-08",
    diagnosis: "Post-PCI LAD Stenting Review & Lipid Target",
    medicines: [
      { id: "med-4", name: "Clopidogrel", dosage: "75mg", frequency: "1-0-0 (Morning)", duration: "90 Days", instructions: "Take after food, do not skip doses" },
      { id: "med-5", name: "Rosuvastatin Calcium", dosage: "20mg", frequency: "0-0-1 (Night)", duration: "90 Days", instructions: "Take at bedtime" },
      { id: "med-6", name: "Pantoprazole", dosage: "40mg", frequency: "1-0-0 (Morning)", duration: "30 Days", instructions: "Take 30 mins before breakfast" }
    ],
    generalAdvice: "Strict adherence to DAPT regimen is vital for stent patency. Promptly report any unusual gum or nasal bleeding.",
    followUpDate: "2026-12-08"
  }
];

const initialDoctorReports = [
  {
    id: "rep-dr-1",
    patientId: "pat-1",
    patientName: "Aditi Kapoor",
    reportTitle: "24h Blood Pressure Ambulatory Monitor Summary",
    reportType: "Cardiovascular Telemetry",
    date: "2026-09-29",
    uploadedBy: "Central Diagnostic Lab",
    status: "Interpreted",
    fileUrl: "#",
    fileSize: "2.1 MB",
    interpretationNotes: "Mean daytime systolic pressure 132 mmHg, mean nighttime dipping preserved at 12%. No evidence of secondary renovascular hypertension. Current regimen effective."
  },
  {
    id: "rep-dr-2",
    patientId: "pat-2",
    patientName: "Rohan Mehta",
    reportTitle: "24-Hour Ambulatory Holter Monitoring Record",
    reportType: "Electrophysiology",
    date: "2026-09-28",
    uploadedBy: "CardioTest Center",
    status: "Pending Review",
    fileUrl: "#",
    fileSize: "4.1 MB",
    interpretationNotes: ""
  },
  {
    id: "rep-dr-3",
    patientId: "pat-4",
    patientName: "Vikram Nair",
    reportTitle: "Fasting Cardiac Lipid Subfraction & Apolipoprotein B",
    reportType: "Biochemistry",
    date: "2026-09-22",
    uploadedBy: "MetroPath Diagnostics",
    status: "Interpreted",
    fileUrl: "#",
    fileSize: "1.6 MB",
    interpretationNotes: "LDL cholesterol reduced to 54 mg/dL achieving target goal post-PCI (<55 mg/dL). Liver enzymes SGOT/SGPT normal on Rosuvastatin 20mg."
  },
  {
    id: "rep-dr-4",
    patientId: "pat-3",
    patientName: "Sunita Deshmukh",
    reportTitle: "Renal Artery Duplex Ultrasound Scan",
    reportType: "Radiology & Doppler",
    date: "2026-09-18",
    uploadedBy: "Insight Imaging",
    status: "Interpreted",
    fileUrl: "#",
    fileSize: "3.7 MB",
    interpretationNotes: "Peak systolic velocity in main renal arteries <180 cm/s. Renal-aortic ratio <3.5. Excludes significant renal artery stenosis."
  }
];

const initialMonthlyStatistics = [
  { month: "Apr", appointments: 38, revenue: 2850 },
  { month: "May", appointments: 42, revenue: 3150 },
  { month: "Jun", appointments: 46, revenue: 3450 },
  { month: "Jul", appointments: 41, revenue: 3075 },
  { month: "Aug", appointments: 52, revenue: 3900 },
  { month: "Sep", appointments: 58, revenue: 4350 },
  { month: "Oct (Proj)", appointments: 64, revenue: 4800 }
];

export const getDoctorProfile = () => safeGet(STORAGE_KEYS.DOCTOR_PROFILE, initialDoctorProfile);

export const saveDoctorProfile = (profile) => {
  safeSet(STORAGE_KEYS.DOCTOR_PROFILE, profile);
  return profile;
};

export const getDoctorSchedule = () => safeGet(STORAGE_KEYS.DOCTOR_SCHEDULE, initialDoctorSchedule);

export const saveDoctorSchedule = (schedule) => {
  safeSet(STORAGE_KEYS.DOCTOR_SCHEDULE, schedule);
  return schedule;
};

export const getDoctorAppointments = () => safeGet(STORAGE_KEYS.DOCTOR_APPOINTMENTS, initialDoctorAppointments);

export const saveDoctorAppointments = (appointments) => {
  safeSet(STORAGE_KEYS.DOCTOR_APPOINTMENTS, appointments);
  return appointments;
};

export const acceptAppointment = (id) => {
  const list = getDoctorAppointments();
  const updated = list.map((a) => (a.id === id ? { ...a, status: "Confirmed" } : a));
  return saveDoctorAppointments(updated);
};

export const rejectAppointment = (id, reason = "Doctor unavailable / schedule conflict") => {
  const list = getDoctorAppointments();
  const updated = list.map((a) =>
    a.id === id ? { ...a, status: "Cancelled", rejectionReason: reason } : a
  );
  return saveDoctorAppointments(updated);
};

export const rescheduleAppointment = (id, newDate, newTime) => {
  const list = getDoctorAppointments();
  const updated = list.map((a) =>
    a.id === id ? { ...a, date: newDate, time: newTime, status: "Confirmed" } : a
  );
  return saveDoctorAppointments(updated);
};

export const getDoctorPatients = () => safeGet(STORAGE_KEYS.DOCTOR_PATIENTS, initialDoctorPatients);

export const saveDoctorPatients = (patients) => {
  safeSet(STORAGE_KEYS.DOCTOR_PATIENTS, patients);
  return patients;
};

export const getDoctorConsultations = () => safeGet(STORAGE_KEYS.DOCTOR_CONSULTATIONS, initialDoctorConsultations);

export const saveDoctorConsultation = (consultation) => {
  const list = getDoctorConsultations();
  const newConsultation = {
    ...consultation,
    id: `cons-${Date.now()}`,
    date: consultation.date || new Date().toISOString().substring(0, 10),
    time: consultation.time || "10:00 AM",
    status: "Completed"
  };
  list.unshift(newConsultation);
  safeSet(STORAGE_KEYS.DOCTOR_CONSULTATIONS, list);
  return newConsultation;
};

export const getDoctorPrescriptions = () => safeGet(STORAGE_KEYS.DOCTOR_PRESCRIPTIONS, initialDoctorPrescriptions);

export const saveDoctorPrescription = (prescription) => {
  const list = getDoctorPrescriptions();
  const newPrescription = {
    ...prescription,
    id: `rx-${Date.now()}`,
    prescriptionNumber: `RX-MED-${Math.floor(10000 + Math.random() * 90000)}`,
    date: prescription.date || new Date().toISOString().substring(0, 10)
  };
  list.unshift(newPrescription);
  safeSet(STORAGE_KEYS.DOCTOR_PRESCRIPTIONS, list);
  return newPrescription;
};

export const getDoctorReports = () => safeGet(STORAGE_KEYS.DOCTOR_REPORTS, initialDoctorReports);

export const saveDoctorReports = (reports) => {
  safeSet(STORAGE_KEYS.DOCTOR_REPORTS, reports);
  return reports;
};

export const addDoctorReport = (report) => {
  const list = getDoctorReports();
  const newReport = {
    ...report,
    id: `rep-dr-${Date.now()}`,
    date: report.date || new Date().toISOString().substring(0, 10),
    status: report.interpretationNotes ? "Interpreted" : "Pending Review",
    fileSize: "1.8 MB"
  };
  list.unshift(newReport);
  return saveDoctorReports(list);
};

export const updateReportInterpretation = (reportId, notes) => {
  const list = getDoctorReports();
  const updated = list.map((r) =>
    r.id === reportId ? { ...r, interpretationNotes: notes, status: "Interpreted" } : r
  );
  return saveDoctorReports(updated);
};

export const getMonthlyStatistics = () => initialMonthlyStatistics;
