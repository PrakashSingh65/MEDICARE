// Centralized mock data & persistence layer for Medicare Portal

const STORAGE_KEYS = {
  DOCTORS: "medicare_doctors",
  PATIENTS: "medicare_patients",
  MEDICINES: "medicare_medicines",
  APPOINTMENTS: "medicare_appointments",
};

const initialDoctors = [
  {
    id: "doc-1",
    name: "Dr. Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    specialty: "Cardiology",
    experience: 12,
    rating: 4.9,
    patientsCount: 142,
    clinic: "HeartCare Super Specialty Clinic",
    location: "Bangalore, Indiranagar",
    fee: "$75",
    qualification: "MBBS, MD - Cardiology (AIIMS)",
    email: "priya.sharma@medicare.com",
    phone: "+91 98765 43210",
    status: "Available",
    bio: "Senior interventional cardiologist with 12+ years expertise in preventive heart health, coronary artery disease, and hypertension management.",
    consultationHistory: [
      {
        id: "hist-101",
        patientName: "Aditi Kapoor",
        patientId: "pat-1",
        date: "2026-03-15",
        diagnosis: "Mild Stage 1 Hypertension with stress-induced palpitations",
        treatment: "Amlodipine 5mg daily, lifestyle counseling & low-sodium diet",
        fee: 75,
        rating: 5,
        status: "Completed",
      },
      {
        id: "hist-102",
        patientName: "Vikram Nair",
        patientId: "pat-4",
        date: "2026-03-08",
        diagnosis: "Post-angioplasty routine checkup & lipid review",
        treatment: "Atorvastatin 20mg maintained, ECG normal",
        fee: 75,
        rating: 5,
        status: "Completed",
      },
      {
        id: "hist-103",
        patientName: "Karan Shah",
        patientId: "pat-6",
        date: "2026-02-22",
        diagnosis: "Atypical chest discomfort, stress echo recommended",
        treatment: "Stress ECG cleared, prescribed antacid and magnesium supplement",
        fee: 75,
        rating: 4.8,
        status: "Completed",
      },
    ],
  },
  {
    id: "doc-2",
    name: "Dr. Ankit Verma",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    specialty: "General Medicine",
    experience: 8,
    rating: 4.7,
    patientsCount: 110,
    clinic: "CityHealth Family Medical Center",
    location: "Mumbai, Bandra West",
    fee: "$50",
    qualification: "MBBS, DNB - Family Medicine",
    email: "ankit.verma@medicare.com",
    phone: "+91 98765 43211",
    status: "Available",
    bio: "Primary care physician dedicated to comprehensive chronic disease management, seasonal illness recovery, and immunizations.",
    consultationHistory: [
      {
        id: "hist-201",
        patientName: "Rohan Mehta",
        patientId: "pat-2",
        date: "2026-03-18",
        diagnosis: "Viral respiratory tract infection & mild dehydration",
        treatment: "Paracetamol 650mg, oral rehydration salts, 3 days rest",
        fee: 50,
        rating: 4.5,
        status: "Completed",
      },
      {
        id: "hist-202",
        patientName: "Aarav Kulkarni",
        patientId: "pat-8",
        date: "2026-03-02",
        diagnosis: "Seasonal allergies with acute rhinitis",
        treatment: "Cetirizine 10mg, Fluticasone nasal spray",
        fee: 50,
        rating: 4.9,
        status: "Completed",
      },
    ],
  },
  {
    id: "doc-3",
    name: "Dr. Meera Singh",
    avatar: "https://images.unsplash.com/photo-1594824813576-47b2c938ef67?auto=format&fit=crop&q=80&w=300",
    specialty: "Pediatrics",
    experience: 10,
    rating: 4.8,
    patientsCount: 96,
    clinic: "Little Steps Children Clinic",
    location: "Delhi, South Extension",
    fee: "$60",
    qualification: "MBBS, MD - Pediatrics",
    email: "meera.singh@medicare.com",
    phone: "+91 98765 43212",
    status: "On Leave",
    bio: "Compassionate pediatrician committed to newborn care, childhood immunizations, developmental milestones, and pediatric nutrition.",
    consultationHistory: [
      {
        id: "hist-301",
        patientName: "Priya Desai",
        patientId: "pat-5",
        date: "2026-03-10",
        diagnosis: "Infant colic and teething fever",
        treatment: "Simethicone infant drops, oral gel",
        fee: 60,
        rating: 5,
        status: "Completed",
      },
    ],
  },
  {
    id: "doc-4",
    name: "Dr. Rohit Patel",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
    specialty: "Orthopedics",
    experience: 14,
    rating: 4.6,
    patientsCount: 92,
    clinic: "Bone & Joint Excellence Hospital",
    location: "Chennai, Anna Nagar",
    fee: "$80",
    qualification: "MS - Orthopedics, Fellowship Joint Replacement",
    email: "rohit.patel@medicare.com",
    phone: "+91 98765 43213",
    status: "Available",
    bio: "Renowned orthopedic surgeon specializing in knee and hip arthroplasty, sports injury rehabilitation, and spinal health.",
    consultationHistory: [
      {
        id: "hist-401",
        patientName: "Vikram Nair",
        patientId: "pat-4",
        date: "2026-02-14",
        diagnosis: "Right knee osteoarthritis Grade 2",
        treatment: "Glucosamine + Chondroitin, targeted physiotherapy",
        fee: 80,
        rating: 4.6,
        status: "Completed",
      },
    ],
  },
  {
    id: "doc-5",
    name: "Dr. Leena Dutta",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
    specialty: "Dermatology",
    experience: 9,
    rating: 4.7,
    patientsCount: 78,
    clinic: "SkinWell Aesthetic & Dermatology Studio",
    location: "Kolkata, Salt Lake",
    fee: "$65",
    qualification: "MBBS, DVD - Dermatology",
    email: "leena.dutta@medicare.com",
    phone: "+91 98765 43214",
    status: "Available",
    bio: "Expert dermatologist specializing in clinical dermatology, acne scarring, eczema, and skin allergy diagnostic therapies.",
    consultationHistory: [
      {
        id: "hist-501",
        patientName: "Sneha Patel",
        patientId: "pat-3",
        date: "2026-03-01",
        diagnosis: "Contact dermatitis on wrists & forearms",
        treatment: "Hydrocortisone 1% topical ointment, hypoallergenic soap",
        fee: 65,
        rating: 4.8,
        status: "Completed",
      },
    ],
  },
  {
    id: "doc-6",
    name: "Dr. Aarav Joshi",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300",
    specialty: "Neurology",
    experience: 15,
    rating: 4.8,
    patientsCount: 115,
    clinic: "NeuroPoint Specialty Hospital",
    location: "Pune, Shivaji Nagar",
    fee: "$90",
    qualification: "MBBS, DM - Neurology",
    email: "aarav.joshi@medicare.com",
    phone: "+91 98765 43215",
    status: "Available",
    bio: "Consultant neurologist treating migraine, epilepsy, neuropathies, and stroke prevention with advanced clinical protocols.",
    consultationHistory: [],
  },
];

const initialPatients = [
  {
    id: "pat-1",
    name: "Aditi Kapoor",
    email: "aditi.kapoor@example.com",
    phone: "+91 98201 11223",
    city: "Mumbai",
    age: 32,
    gender: "Female",
    bloodGroup: "B+",
    plan: "Premium",
    joined: "2024-01-15",
    status: "Active",
    allergies: ["Penicillin", "Dust Mites"],
    chronicConditions: ["Hypertension"],
    totalVisits: 6,
    medicalHistory: [
      {
        id: "medrec-1",
        date: "2026-03-15",
        doctorName: "Dr. Priya Sharma",
        specialty: "Cardiology",
        reason: "Routine BP review & sudden palpitations",
        diagnosis: "Stage 1 Hypertension; sinus tachycardia during stress",
        prescriptions: ["Amlodipine 5mg - Once daily morning", "Propranolol 10mg - SOS"],
        labResults: "Lipid Profile normal, Serum Electrolytes normal",
        notes: "Advised to continue DASH diet and reduce caffeine intake.",
      },
      {
        id: "medrec-2",
        date: "2025-11-20",
        doctorName: "Dr. Ankit Verma",
        specialty: "General Medicine",
        reason: "Persistent migraine & fatigue",
        diagnosis: "Tension headache secondary to work stress",
        prescriptions: ["Naproxen 250mg - As needed for acute episodes"],
        labResults: "CBC normal, Vitamin D3 slightly low (22 ng/mL)",
        notes: "Prescribed Vitamin D 60k IU weekly for 8 weeks.",
      },
      {
        id: "medrec-3",
        date: "2025-06-12",
        doctorName: "Dr. Leena Dutta",
        specialty: "Dermatology",
        reason: "Facial acne flare-up",
        diagnosis: "Acne vulgaris Grade 2",
        prescriptions: ["Clindamycin gel 1%", "Gentle foaming cleanser"],
        labResults: "None",
        notes: "Cleared in 4 weeks follow-up.",
      },
    ],
  },
  {
    id: "pat-2",
    name: "Rohan Mehta",
    email: "rohan.mehta@example.com",
    phone: "+91 98111 22334",
    city: "Delhi",
    age: 28,
    gender: "Male",
    bloodGroup: "O+",
    plan: "Basic",
    joined: "2024-03-04",
    status: "Active",
    allergies: ["None known"],
    chronicConditions: ["None"],
    totalVisits: 3,
    medicalHistory: [
      {
        id: "medrec-4",
        date: "2026-03-18",
        doctorName: "Dr. Ankit Verma",
        specialty: "General Medicine",
        reason: "High fever (102 F), sore throat, body chills",
        diagnosis: "Acute Viral Upper Respiratory Infection",
        prescriptions: ["Paracetamol 650mg - 3 times daily", "Azithromycin 500mg - Once daily for 3 days"],
        labResults: "Rapid Strep test negative",
        notes: "Hydration recommended, recovery expected within 5-7 days.",
      },
    ],
  },
  {
    id: "pat-3",
    name: "Sneha Patel",
    email: "sneha.patel@example.com",
    phone: "+91 98450 33445",
    city: "Ahmedabad",
    age: 39,
    gender: "Female",
    bloodGroup: "A+",
    plan: "Standard",
    joined: "2023-11-22",
    status: "Active",
    allergies: ["Sulfa drugs"],
    chronicConditions: ["Type 2 Diabetes (Controlled)"],
    totalVisits: 8,
    medicalHistory: [
      {
        id: "medrec-5",
        date: "2026-03-01",
        doctorName: "Dr. Leena Dutta",
        specialty: "Dermatology",
        reason: "Severe itching and rash on wrist after jewelry wear",
        diagnosis: "Nickel Contact Dermatitis",
        prescriptions: ["Hydrocortisone Cream 1% - Apply twice daily", "Levocetirizine 5mg - Nightly"],
        labResults: "None",
        notes: "Avoid metallic watch straps and costume jewelry.",
      },
      {
        id: "medrec-6",
        date: "2026-01-14",
        doctorName: "Dr. Ankit Verma",
        specialty: "General Medicine",
        reason: "Quarterly HbA1c screening",
        diagnosis: "Type 2 Diabetes Mellitus - Good Glycemic Control",
        prescriptions: ["Metformin 500mg - Twice daily with meals"],
        labResults: "HbA1c: 6.4%, Fasting Glucose: 112 mg/dL",
        notes: "Advised to continue current fitness routine and diet.",
      },
    ],
  },
  {
    id: "pat-4",
    name: "Vikram Nair",
    email: "vikram.nair@example.com",
    phone: "+91 97400 44556",
    city: "Bangalore",
    age: 52,
    gender: "Male",
    bloodGroup: "AB+",
    plan: "Premium",
    joined: "2023-08-11",
    status: "Active",
    allergies: ["NSAIDs (Aspirin triggers bronchospasm)"],
    chronicConditions: ["Coronary Artery Disease", "Mild Knee Osteoarthritis"],
    totalVisits: 11,
    medicalHistory: [
      {
        id: "medrec-7",
        date: "2026-03-08",
        doctorName: "Dr. Priya Sharma",
        specialty: "Cardiology",
        reason: "Post-angioplasty 6-month checkup",
        diagnosis: "Stable CAD, post-PCI status, excellent functional capacity",
        prescriptions: ["Clopidogrel 75mg - Once daily", "Atorvastatin 40mg - Nightly"],
        labResults: "Echo LVEF 58%, Lipid LDL: 68 mg/dL",
        notes: "Patient tolerating medications well. Repeat stress echo in 1 year.",
      },
      {
        id: "medrec-8",
        date: "2026-02-14",
        doctorName: "Dr. Rohit Patel",
        specialty: "Orthopedics",
        reason: "Right knee stiffness when climbing stairs",
        diagnosis: "Bilateral Knee Osteoarthritis (Grade 2 right, Grade 1 left)",
        prescriptions: ["Paracetamol 500mg - PRN for knee ache", "Glucosamine Sulfate 1500mg daily"],
        labResults: "Knee X-ray shows minor joint space narrowing",
        notes: "Referred to physical therapy for quadriceps strengthening.",
      },
    ],
  },
  {
    id: "pat-5",
    name: "Priya Desai",
    email: "priya.desai@example.com",
    phone: "+91 98220 55667",
    city: "Pune",
    age: 26,
    gender: "Female",
    bloodGroup: "O-",
    plan: "Basic",
    joined: "2024-04-02",
    status: "Active",
    allergies: ["Peanuts"],
    chronicConditions: ["None"],
    totalVisits: 2,
    medicalHistory: [
      {
        id: "medrec-9",
        date: "2026-03-10",
        doctorName: "Dr. Meera Singh",
        specialty: "Pediatrics",
        reason: "Pediatric well-baby wellness check for 6-month-old infant",
        diagnosis: "Healthy infant growth, normal milestones",
        prescriptions: ["Vitamin D3 Infant Drops (400 IU daily)"],
        labResults: "Weight: 7.8 kg (50th percentile)",
        notes: "Administered Rotavirus & DTaP booster vaccinations.",
      },
    ],
  },
  {
    id: "pat-6",
    name: "Karan Shah",
    email: "karan.shah@example.com",
    phone: "+91 98840 66778",
    city: "Chennai",
    age: 31,
    gender: "Male",
    bloodGroup: "A-",
    plan: "Standard",
    joined: "2024-02-18",
    status: "Active",
    allergies: ["None"],
    chronicConditions: ["GERD"],
    totalVisits: 4,
    medicalHistory: [
      {
        id: "medrec-10",
        date: "2026-02-22",
        doctorName: "Dr. Priya Sharma",
        specialty: "Cardiology",
        reason: "Burning chest pain and acid regurgitation",
        diagnosis: "Gastroesophageal Reflux Disease (Cardiac etiology ruled out)",
        prescriptions: ["Pantoprazole 40mg - 30 mins before breakfast for 14 days", "Magnesium antacid liquid"],
        labResults: "Resting ECG completely normal",
        notes: "Advised to elevate head of bed and avoid late-night dining.",
      },
    ],
  },
];

const initialMedicines = [
  {
    id: "med-1",
    name: "Amlodipine 5mg",
    genericName: "Amlodipine Besylate",
    category: "Cardiovascular",
    form: "Tablet",
    strength: "5 mg",
    stock: 450,
    unitPrice: 12.5,
    manufacturer: "Sun Pharma Ltd",
    expiryDate: "2027-10-31",
    prescriptionRequired: true,
    description: "Calcium channel blocker used to treat high blood pressure and prevent chest pain (angina).",
  },
  {
    id: "med-2",
    name: "Atorvastatin 20mg",
    genericName: "Atorvastatin Calcium",
    category: "Cardiovascular",
    form: "Tablet",
    strength: "20 mg",
    stock: 320,
    unitPrice: 18.0,
    manufacturer: "Cipla Therapeutics",
    expiryDate: "2027-08-15",
    prescriptionRequired: true,
    description: "HMG-CoA reductase inhibitor (statin) used to lower LDL cholesterol and triglyceride levels.",
  },
  {
    id: "med-3",
    name: "Metformin 500mg ER",
    genericName: "Metformin Hydrochloride",
    category: "Endocrinology",
    form: "Extended Release Tablet",
    strength: "500 mg",
    stock: 600,
    unitPrice: 8.5,
    manufacturer: "Dr. Reddy's Labs",
    expiryDate: "2028-02-28",
    prescriptionRequired: true,
    description: "Biguanide antihyperglycemic agent for managing type 2 diabetes mellitus.",
  },
  {
    id: "med-4",
    name: "Paracetamol 650mg",
    genericName: "Acetaminophen",
    category: "Analgesic & Antipyretic",
    form: "Tablet",
    strength: "650 mg",
    stock: 1200,
    unitPrice: 3.5,
    manufacturer: "Micro Labs",
    expiryDate: "2028-06-30",
    prescriptionRequired: false,
    description: "Effective fever reducer and mild-to-moderate pain reliever for headaches and body aches.",
  },
  {
    id: "med-5",
    name: "Azithromycin 500mg",
    genericName: "Azithromycin Monohydrate",
    category: "Antibiotics",
    form: "Tablet",
    strength: "500 mg",
    stock: 180,
    unitPrice: 24.0,
    manufacturer: "Zydus Cadila",
    expiryDate: "2027-04-12",
    prescriptionRequired: true,
    description: "Macrolide antibiotic used for respiratory tract, ear, and bacterial infections.",
  },
  {
    id: "med-6",
    name: "Pantoprazole 40mg",
    genericName: "Pantoprazole Sodium",
    category: "Gastroenterology",
    form: "Delayed Release Tablet",
    strength: "40 mg",
    stock: 540,
    unitPrice: 14.0,
    manufacturer: "Alkem Laboratories",
    expiryDate: "2027-12-01",
    prescriptionRequired: true,
    description: "Proton pump inhibitor (PPI) decreasing stomach acid production for GERD and ulcers.",
  },
  {
    id: "med-7",
    name: "Cetirizine 10mg",
    genericName: "Cetirizine Hydrochloride",
    category: "Antihistamine",
    form: "Tablet",
    strength: "10 mg",
    stock: 750,
    unitPrice: 6.0,
    manufacturer: "Lupin Pharmaceuticals",
    expiryDate: "2028-01-20",
    prescriptionRequired: false,
    description: "Second-generation antihistamine relieving allergy symptoms like sneezing, runny nose, and hives.",
  },
  {
    id: "med-8",
    name: "Glucosamine + Chondroitin",
    genericName: "Joint Complex Formula",
    category: "Orthopedics & Supplements",
    form: "Capsule",
    strength: "1500mg / 1200mg",
    stock: 140,
    unitPrice: 32.0,
    manufacturer: "HealthVit Biocare",
    expiryDate: "2027-09-15",
    prescriptionRequired: false,
    description: "Joint cartilage support formulation for osteoarthritic knee and hip flexibility.",
  },
];

const initialAppointments = [
  {
    id: "apt-1",
    patientId: "pat-1",
    patientName: "Aditi Kapoor",
    doctorId: "doc-1",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialty: "Cardiology",
    date: "2026-03-24",
    time: "10:30 AM",
    type: "Follow-up Consultation",
    status: "Confirmed",
    symptoms: "Checking blood pressure stabilization following new dosage",
    fee: "$75",
  },
  {
    id: "apt-2",
    patientId: "pat-2",
    patientName: "Rohan Mehta",
    doctorId: "doc-2",
    doctorName: "Dr. Ankit Verma",
    doctorSpecialty: "General Medicine",
    date: "2026-03-24",
    time: "11:45 AM",
    type: "General Examination",
    status: "Pending",
    symptoms: "Persistent dry cough and mild chest tightness",
    fee: "$50",
  },
  {
    id: "apt-3",
    patientId: "pat-3",
    patientName: "Sneha Patel",
    doctorId: "doc-5",
    doctorName: "Dr. Leena Dutta",
    doctorSpecialty: "Dermatology",
    date: "2026-03-25",
    time: "02:15 PM",
    type: "Skin Assessment",
    status: "Confirmed",
    symptoms: "Wrist dermatitis patch review",
    fee: "$65",
  },
  {
    id: "apt-4",
    patientId: "pat-4",
    patientName: "Vikram Nair",
    doctorId: "doc-4",
    doctorName: "Dr. Rohit Patel",
    doctorSpecialty: "Orthopedics",
    date: "2026-03-26",
    time: "04:00 PM",
    type: "Physical Rehab Review",
    status: "Confirmed",
    symptoms: "Right knee range of motion testing after 4 weeks of PT",
    fee: "$80",
  },
  {
    id: "apt-5",
    patientId: "pat-6",
    patientName: "Karan Shah",
    doctorId: "doc-1",
    doctorName: "Dr. Priya Sharma",
    doctorSpecialty: "Cardiology",
    date: "2026-03-27",
    time: "09:15 AM",
    type: "Cardiac Screening",
    status: "Pending",
    symptoms: "Cardiovascular risk factor assessment",
    fee: "$75",
  },
];

export const revenueGrowthStats = {
  totalRevenue: 148250,
  monthlyRevenue: 39200,
  revenueGrowthRate: "+18.4%",
  patientGrowthRate: "+24.2%",
  activeDoctors: 24,
  totalPatients: 1324,
  consultationsThisMonth: 890,
  medicineDispensedThisMonth: 3410,
  monthlyBreakdown: [
    { month: "Jan", revenue: 21200, consultations: 490, pharmacy: 7800, newPatients: 64 },
    { month: "Feb", revenue: 23900, consultations: 530, pharmacy: 8900, newPatients: 71 },
    { month: "Mar", revenue: 28100, consultations: 620, pharmacy: 10400, newPatients: 85 },
    { month: "Apr", revenue: 26300, consultations: 590, pharmacy: 9700, newPatients: 78 },
    { month: "May", revenue: 29500, consultations: 670, pharmacy: 11200, newPatients: 92 },
    { month: "Jun", revenue: 32800, consultations: 740, pharmacy: 12500, newPatients: 104 },
    { month: "Jul", revenue: 31000, consultations: 710, pharmacy: 11900, newPatients: 98 },
    { month: "Aug", revenue: 33900, consultations: 780, pharmacy: 13100, newPatients: 112 },
    { month: "Sep", revenue: 32200, consultations: 750, pharmacy: 12400, newPatients: 106 },
    { month: "Oct", revenue: 34700, consultations: 810, pharmacy: 13600, newPatients: 118 },
    { month: "Nov", revenue: 36300, consultations: 850, pharmacy: 14200, newPatients: 125 },
    { month: "Dec", revenue: 39200, consultations: 890, pharmacy: 15400, newPatients: 138 },
  ],
  revenueStreams: [
    { source: "Doctor Consultations", percentage: 54, amount: 80055, color: "bg-sky-500" },
    { source: "Pharmacy & Medicines", percentage: 32, amount: 47440, color: "bg-emerald-500" },
    { source: "Diagnostics & Labs", percentage: 14, amount: 20755, color: "bg-indigo-500" },
  ],
};

// Safe storage accessors
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
  } catch (err) {
    console.error("Storage error:", err);
  }
};

export const getDoctors = () => safeGet(STORAGE_KEYS.DOCTORS, initialDoctors);

export const saveDoctor = (doctor) => {
  const list = getDoctors();
  const index = list.findIndex((d) => d.id === doctor.id);
  if (index >= 0) {
    list[index] = doctor;
  } else {
    list.unshift({ ...doctor, id: `doc-${Date.now()}` });
  }
  safeSet(STORAGE_KEYS.DOCTORS, list);
  return list;
};

export const getPatients = () => safeGet(STORAGE_KEYS.PATIENTS, initialPatients);

export const savePatient = (patient) => {
  const list = getPatients();
  const index = list.findIndex((p) => p.id === patient.id);
  if (index >= 0) {
    list[index] = patient;
  } else {
    list.unshift({ ...patient, id: `pat-${Date.now()}` });
  }
  safeSet(STORAGE_KEYS.PATIENTS, list);
  return list;
};

export const addPatientMedicalRecord = (patientId, record) => {
  const list = getPatients();
  const patient = list.find((p) => p.id === patientId);
  if (patient) {
    if (!patient.medicalHistory) patient.medicalHistory = [];
    patient.medicalHistory.unshift({
      id: `medrec-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      ...record,
    });
    patient.totalVisits = (patient.totalVisits || 0) + 1;
    safeSet(STORAGE_KEYS.PATIENTS, list);
  }
  return list;
};

export const getMedicines = () => safeGet(STORAGE_KEYS.MEDICINES, initialMedicines);

export const addMedicine = (medicine) => {
  const list = getMedicines();
  const newMed = {
    ...medicine,
    id: `med-${Date.now()}`,
    stock: Number(medicine.stock) || 0,
    unitPrice: Number(medicine.unitPrice) || 0,
  };
  list.unshift(newMed);
  safeSet(STORAGE_KEYS.MEDICINES, list);
  return list;
};

export const updateMedicine = (id, updatedFields) => {
  const list = getMedicines();
  const index = list.findIndex((m) => m.id === id);
  if (index >= 0) {
    list[index] = { ...list[index], ...updatedFields };
    safeSet(STORAGE_KEYS.MEDICINES, list);
  }
  return list;
};

export const deleteMedicine = (id) => {
  const list = getMedicines().filter((m) => m.id !== id);
  safeSet(STORAGE_KEYS.MEDICINES, list);
  return list;
};

export const getAppointments = () => safeGet(STORAGE_KEYS.APPOINTMENTS, initialAppointments);

export const addAppointment = (appointment) => {
  const list = getAppointments();
  const newApt = {
    ...appointment,
    id: `apt-${Date.now()}`,
    status: "Confirmed",
  };
  list.unshift(newApt);
  safeSet(STORAGE_KEYS.APPOINTMENTS, list);
  return newApt;
};

export const updateAppointmentStatus = (id, status) => {
  const list = getAppointments();
  const item = list.find((a) => a.id === id);
  if (item) {
    item.status = status;
    safeSet(STORAGE_KEYS.APPOINTMENTS, list);
  }
  return list;
};
