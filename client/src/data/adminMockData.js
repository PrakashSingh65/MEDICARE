import { axiosClient } from "../api/axiosClient";
import {
  adaptDoctorFromBackend,
  adaptPatientFromBackend,
  adaptAppointmentFromBackend,
} from "../api/adapters";

const STORAGE_KEYS = {
  ADMIN_DOCTORS: "medicare_admin_doctors",
  ADMIN_PATIENTS: "medicare_admin_patients",
  ADMIN_APPOINTMENTS: "medicare_admin_appointments",
  ADMIN_PAYMENTS: "medicare_admin_payments",
  ADMIN_CONTENT: "medicare_admin_content",
  ADMIN_SYSTEM: "medicare_admin_system",
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

const initialAdminDoctors = [
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
    status: "Active",
    verificationStatus: "Verified",
    registeredDate: "2024-01-12",
    documents: [
      { id: "doc-med-1", name: "Medical_Degree_MD_Cardiology.pdf", type: "Degree", verified: true },
      { id: "doc-med-2", name: "MCI_State_License_AIIMS.pdf", type: "License", verified: true },
      { id: "doc-med-3", name: "Govt_ID_Passport.pdf", type: "Identity", verified: true }
    ],
    bio: "Senior interventional cardiologist with 12+ years expertise in preventive heart health and hypertension management."
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
    status: "Active",
    verificationStatus: "Verified",
    registeredDate: "2024-03-20",
    documents: [
      { id: "doc-med-4", name: "MBBS_Degree_Certificate.pdf", type: "Degree", verified: true },
      { id: "doc-med-5", name: "DNB_Family_Medicine_Cert.pdf", type: "Specialty", verified: true }
    ],
    bio: "Primary care physician dedicated to comprehensive chronic disease management and preventive medicine."
  },
  {
    id: "doc-3",
    name: "Dr. Sneha Reddy",
    avatar: "https://images.unsplash.com/photo-1594824813682-1262d057778b?auto=format&fit=crop&q=80&w=300",
    specialty: "Dermatology",
    experience: 10,
    rating: 4.8,
    patientsCount: 128,
    clinic: "Radiance Skin & Laser Center",
    location: "Hyderabad, Jubilee Hills",
    fee: "$65",
    qualification: "MBBS, MD - Dermatology (CMC Vellore)",
    email: "sneha.reddy@medicare.com",
    phone: "+91 98765 43212",
    status: "Active",
    verificationStatus: "Verified",
    registeredDate: "2024-02-15",
    documents: [
      { id: "doc-med-6", name: "MD_Dermatology_CMC.pdf", type: "Degree", verified: true },
      { id: "doc-med-7", name: "Medical_Council_License.pdf", type: "License", verified: true }
    ],
    bio: "Cosmetic and clinical dermatologist specializing in acne therapies, laser resurfacing, and eczema management."
  },
  {
    id: "doc-4",
    name: "Dr. Rajesh Iyer",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
    specialty: "Neurology",
    experience: 15,
    rating: 4.9,
    patientsCount: 95,
    clinic: "Apex Neuro & Spine Institute",
    location: "Chennai, Adyar",
    fee: "$90",
    qualification: "MBBS, DM - Neurology (NIMHANS)",
    email: "rajesh.iyer@medicare.com",
    phone: "+91 98765 43213",
    status: "Active",
    verificationStatus: "Verified",
    registeredDate: "2023-11-05",
    documents: [
      { id: "doc-med-8", name: "DM_Neurology_NIMHANS.pdf", type: "Degree", verified: true },
      { id: "doc-med-9", name: "TamilNadu_Medical_Reg.pdf", type: "License", verified: true }
    ],
    bio: "Specialist in neurodegenerative disorders, stroke rehabilitation, and chronic migraine management."
  },
  {
    id: "doc-5",
    name: "Dr. Meera Nambiar",
    avatar: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=300",
    specialty: "Pediatrics",
    experience: 7,
    rating: 4.6,
    patientsCount: 88,
    clinic: "Little Stars Child Clinic",
    location: "Kochi, Ernakulam",
    fee: "$55",
    qualification: "MBBS, DCH - Pediatrics",
    email: "meera.nambiar@medicare.com",
    phone: "+91 98765 43214",
    status: "Pending",
    verificationStatus: "Pending",
    registeredDate: "2026-09-24",
    documents: [
      { id: "doc-med-10", name: "MBBS_Graduation_KeralaUniv.pdf", type: "Degree", verified: true },
      { id: "doc-med-11", name: "DCH_Pediatrics_Certificate.pdf", type: "Diploma", verified: false },
      { id: "doc-med-12", name: "State_Council_Receipt.pdf", type: "License", verified: false }
    ],
    bio: "Pediatric care professional focusing on early developmental milestones and pediatric nutrition."
  },
  {
    id: "doc-6",
    name: "Dr. Rohan Sengupta",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
    specialty: "Orthopedics",
    experience: 11,
    rating: 4.8,
    patientsCount: 115,
    clinic: "Orthocare Bone & Joint Center",
    location: "Kolkata, Salt Lake",
    fee: "$70",
    qualification: "MBBS, MS - Orthopedics",
    email: "rohan.sengupta@medicare.com",
    phone: "+91 98765 43215",
    status: "Pending",
    verificationStatus: "Pending",
    registeredDate: "2026-09-27",
    documents: [
      { id: "doc-med-13", name: "MS_Orthopedics_WBUHS.pdf", type: "Degree", verified: false },
      { id: "doc-med-14", name: "West_Bengal_Medical_ID.pdf", type: "License", verified: false }
    ],
    bio: "Joint replacement and sports injury rehabilitation surgeon with minimally invasive experience."
  },
  {
    id: "doc-7",
    name: "Dr. Farhan Ali",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=300",
    specialty: "Psychiatry",
    experience: 9,
    rating: 4.5,
    patientsCount: 74,
    clinic: "MindPeace Behavioral Clinic",
    location: "Delhi, Saket",
    fee: "$60",
    qualification: "MBBS, MD - Psychiatry",
    email: "farhan.ali@medicare.com",
    phone: "+91 98765 43216",
    status: "Suspended",
    verificationStatus: "Needs Review",
    registeredDate: "2024-05-18",
    documents: [
      { id: "doc-med-15", name: "MD_Psychiatry_Certificate.pdf", type: "Degree", verified: true },
      { id: "doc-med-16", name: "Expired_State_License.pdf", type: "License", verified: false }
    ],
    bio: "Consultant psychiatrist specializing in anxiety management, insomnia, and behavioral therapy."
  }
];

const initialAdminPatients = [
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
    status: "Active",
    registeredDate: "2025-01-14",
    lastActive: "Today at 09:30 AM",
    totalVisits: 6,
    allergies: ["Penicillin", "Peanuts"],
    emergencyContact: "+91 98111 99887",
    activityLog: [
      { id: "act-1", type: "appointment", title: "Consultation Booked", description: "Scheduled cardiology checkup with Dr. Priya Sharma", timestamp: "2026-09-30 14:15", ip: "103.21.244.1" },
      { id: "act-2", type: "payment", title: "Payment Completed", description: "Paid $75 for consultation #APT-84920", timestamp: "2026-09-30 14:17", ip: "103.21.244.1" },
      { id: "act-3", type: "prescription", title: "Prescription Refill", description: "Downloaded prescription for Amlodipine 5mg", timestamp: "2026-09-18 10:20", ip: "103.21.244.1" },
      { id: "act-4", type: "login", title: "User Logged In", description: "Authenticated via Email Magic Link", timestamp: "2026-09-30 14:10", ip: "103.21.244.1" }
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
    status: "Active",
    registeredDate: "2025-03-22",
    lastActive: "Yesterday at 04:12 PM",
    totalVisits: 4,
    allergies: ["Sulfa drugs"],
    emergencyContact: "+91 98222 88776",
    activityLog: [
      { id: "act-5", type: "appointment", title: "General Consultation", description: "Completed appointment with Dr. Ankit Verma", timestamp: "2026-09-28 11:00", ip: "14.139.112.4" },
      { id: "act-6", type: "payment", title: "Payment Completed", description: "Paid $50 for consultation #APT-84881", timestamp: "2026-09-28 11:05", ip: "14.139.112.4" },
      { id: "act-7", type: "login", title: "User Logged In", description: "Two-factor SMS verification successful", timestamp: "2026-09-28 10:45", ip: "14.139.112.4" }
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
    status: "Active",
    registeredDate: "2024-11-08",
    lastActive: "3 days ago",
    totalVisits: 9,
    allergies: ["None"],
    emergencyContact: "+91 98333 77665",
    activityLog: [
      { id: "act-8", type: "appointment", title: "Follow-up Completed", description: "Follow-up video call with Dr. Rajesh Iyer", timestamp: "2026-09-26 16:30", ip: "49.36.128.90" },
      { id: "act-9", type: "profile_update", title: "Profile Updated", description: "Changed primary emergency contact number", timestamp: "2026-09-20 09:15", ip: "49.36.128.90" }
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
    status: "Deactivated",
    registeredDate: "2024-09-19",
    lastActive: "2 weeks ago",
    totalVisits: 3,
    allergies: ["Aspirin"],
    emergencyContact: "+91 98444 66554",
    activityLog: [
      { id: "act-10", type: "profile_update", title: "Account Deactivated", description: "Account suspended by Administrator pending identity verification", timestamp: "2026-09-14 17:00", ip: "127.0.0.1" },
      { id: "act-11", type: "payment", title: "Failed Payment", description: "Card declined for booking #APT-84610", timestamp: "2026-09-14 16:50", ip: "115.110.82.12" }
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
    status: "Active",
    registeredDate: "2025-06-01",
    lastActive: "Today at 08:15 AM",
    totalVisits: 2,
    allergies: ["Dust", "Pollen"],
    emergencyContact: "+91 98555 11223",
    activityLog: [
      { id: "act-12", type: "appointment", title: "Appointment Booked", description: "Dermatology session with Dr. Sneha Reddy", timestamp: "2026-10-01 08:20", ip: "182.72.19.4" }
    ]
  }
];

const initialAdminAppointments = [
  {
    id: "apt-101",
    appointmentNumber: "APT-84920",
    patientName: "Aditi Kapoor",
    patientId: "pat-1",
    patientAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    doctorName: "Dr. Priya Sharma",
    doctorId: "doc-1",
    specialty: "Cardiology",
    date: "2026-10-02",
    time: "10:30 AM",
    type: "In-Clinic",
    fee: 75,
    status: "Confirmed",
    room: "Consultation Suite 4B",
    issue: null
  },
  {
    id: "apt-102",
    appointmentNumber: "APT-84921",
    patientName: "Rohan Mehta",
    patientId: "pat-2",
    patientAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    doctorName: "Dr. Ankit Verma",
    doctorId: "doc-2",
    specialty: "General Medicine",
    date: "2026-10-02",
    time: "11:15 AM",
    type: "Video Call",
    fee: 50,
    status: "Confirmed",
    room: "Telehealth Room #2",
    issue: null
  },
  {
    id: "apt-103",
    appointmentNumber: "APT-84922",
    patientName: "Ananya Iyer",
    patientId: "pat-5",
    patientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    doctorName: "Dr. Sneha Reddy",
    doctorId: "doc-3",
    specialty: "Dermatology",
    date: "2026-10-02",
    time: "02:00 PM",
    type: "In-Clinic",
    fee: 65,
    status: "Issue Reported",
    room: "Skin Clinic 1A",
    issue: {
      id: "iss-1",
      type: "Doctor Delayed / Overbooked",
      description: "Doctor is in emergency surgical rotation; patient waiting over 45 minutes without notice.",
      reportedAt: "2026-10-01 16:30",
      reportedBy: "Patient Care Coordinator",
      status: "Open",
      resolution: ""
    }
  },
  {
    id: "apt-104",
    appointmentNumber: "APT-84880",
    patientName: "Sunita Deshmukh",
    patientId: "pat-3",
    patientAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    doctorName: "Dr. Rajesh Iyer",
    doctorId: "doc-4",
    specialty: "Neurology",
    date: "2026-09-28",
    time: "04:30 PM",
    type: "Video Call",
    fee: 90,
    status: "Completed",
    room: "Telehealth Room #1",
    issue: null
  },
  {
    id: "apt-105",
    appointmentNumber: "APT-84872",
    patientName: "Vikram Nair",
    patientId: "pat-4",
    patientAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    doctorName: "Dr. Priya Sharma",
    doctorId: "doc-1",
    specialty: "Cardiology",
    date: "2026-09-25",
    time: "09:00 AM",
    type: "In-Clinic",
    fee: 75,
    status: "Cancelled",
    room: "Consultation Suite 4B",
    cancelReason: "Patient acute travel conflict; refunded to original payment method",
    issue: null
  },
  {
    id: "apt-106",
    appointmentNumber: "APT-84930",
    patientName: "Amitabh Banerjee",
    patientId: "pat-6",
    patientAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=200",
    doctorName: "Dr. Rohan Sengupta",
    doctorId: "doc-6",
    specialty: "Orthopedics",
    date: "2026-10-03",
    time: "03:15 PM",
    type: "In-Clinic",
    fee: 70,
    status: "Issue Reported",
    room: "Bone Clinic Room 3",
    issue: {
      id: "iss-2",
      type: "Payment Dispute / Billing Discrepancy",
      description: "Patient charged twice on UPI gateway during checkout timeout.",
      reportedAt: "2026-10-01 11:20",
      reportedBy: "Billing Gateway Webhook",
      status: "Open",
      resolution: ""
    }
  }
];

const initialAdminPayments = {
  transactions: [
    { id: "tx-9901", invoiceNo: "INV-2026-9901", patientName: "Aditi Kapoor", doctorName: "Dr. Priya Sharma", department: "Cardiology", amount: 75, method: "Credit Card", date: "2026-10-01", time: "14:17", status: "Completed" },
    { id: "tx-9902", invoiceNo: "INV-2026-9902", patientName: "Rohan Mehta", doctorName: "Dr. Ankit Verma", department: "General Medicine", amount: 50, method: "UPI", date: "2026-10-01", time: "11:05", status: "Completed" },
    { id: "tx-9903", invoiceNo: "INV-2026-9903", patientName: "Ananya Iyer", doctorName: "Dr. Sneha Reddy", department: "Dermatology", amount: 65, method: "Net Banking", date: "2026-10-01", time: "08:22", status: "Completed" },
    { id: "tx-9904", invoiceNo: "INV-2026-9904", patientName: "Amitabh Banerjee", doctorName: "Dr. Rohan Sengupta", department: "Orthopedics", amount: 70, method: "UPI", date: "2026-09-30", time: "18:40", status: "Refunded" },
    { id: "tx-9905", invoiceNo: "INV-2026-9905", patientName: "Kavita Rao", doctorName: "Dr. Rajesh Iyer", department: "Neurology", amount: 90, method: "Insurance", date: "2026-09-30", time: "15:10", status: "Failed" },
    { id: "tx-9906", invoiceNo: "INV-2026-9906", patientName: "Vikram Nair", doctorName: "Dr. Priya Sharma", department: "Cardiology", amount: 75, method: "Credit Card", date: "2026-09-25", time: "09:12", status: "Refunded" },
    { id: "tx-9907", invoiceNo: "INV-2026-9907", patientName: "Sanjay Gupta", doctorName: "Dr. Ankit Verma", department: "General Medicine", amount: 50, method: "Debit Card", date: "2026-09-24", time: "12:00", status: "Completed" }
  ],
  refunds: [
    { id: "ref-1", refundId: "RF-8812", transactionId: "tx-9904", invoiceNo: "INV-2026-9904", patientName: "Amitabh Banerjee", amount: 70, reason: "Duplicate charge on UPI network", requestDate: "2026-09-30", status: "Approved", processedDate: "2026-10-01" },
    { id: "ref-2", refundId: "RF-8813", transactionId: "tx-9906", invoiceNo: "INV-2026-9906", patientName: "Vikram Nair", amount: 75, reason: "Appointment cancelled by patient before cutoff", requestDate: "2026-09-25", status: "Completed", processedDate: "2026-09-26" },
    { id: "ref-3", refundId: "RF-8814", transactionId: "tx-9889", invoiceNo: "INV-2026-9889", patientName: "Deepak Joshi", amount: 65, reason: "Doctor unavailable due to emergency duty", requestDate: "2026-10-01", status: "Pending", processedDate: null }
  ],
  failedPayments: [
    { id: "fp-1", transactionId: "tx-9905", invoiceNo: "INV-2026-9905", patientName: "Kavita Rao", amount: 90, failureReason: "Insurance claim API timeout / pre-authorization reject", date: "2026-09-30", attempts: 2, status: "Unresolved" },
    { id: "fp-2", transactionId: "tx-9870", invoiceNo: "INV-2026-9870", patientName: "Manoj Tiwari", amount: 50, failureReason: "Insufficient funds / bank 3D secure decline", date: "2026-09-29", attempts: 3, status: "Retried" },
    { id: "fp-3", transactionId: "tx-9861", invoiceNo: "INV-2026-9861", patientName: "Neha Chawla", amount: 75, failureReason: "Card expired / invalid CVV validation", date: "2026-09-27", attempts: 1, status: "Resolved" }
  ],
  doctorPayouts: [
    { id: "po-1", payoutBatch: "PAY-2026-W39", doctorName: "Dr. Priya Sharma", doctorId: "doc-1", specialty: "Cardiology", bankAccount: "HDFC •••• 4892", ifsc: "HDFC0001824", consultations: 38, grossAmount: 2850, platformCut: 285, netPayout: 2565, status: "Paid", payoutDate: "2026-09-28" },
    { id: "po-2", payoutBatch: "PAY-2026-W39", doctorName: "Dr. Ankit Verma", doctorId: "doc-2", specialty: "General Medicine", bankAccount: "ICICI •••• 3120", ifsc: "ICIC0000491", consultations: 44, grossAmount: 2200, platformCut: 220, netPayout: 1980, status: "Paid", payoutDate: "2026-09-28" },
    { id: "po-3", payoutBatch: "PAY-2026-W39", doctorName: "Dr. Sneha Reddy", doctorId: "doc-3", specialty: "Dermatology", bankAccount: "SBI •••• 9014", ifsc: "SBIN0008412", consultations: 31, grossAmount: 2015, platformCut: 201.5, netPayout: 1813.5, status: "Processing", payoutDate: "2026-10-02" },
    { id: "po-4", payoutBatch: "PAY-2026-W39", doctorName: "Dr. Rajesh Iyer", doctorId: "doc-4", specialty: "Neurology", bankAccount: "Axis •••• 7741", ifsc: "UTIB0002104", consultations: 26, grossAmount: 2340, platformCut: 234, netPayout: 2106, status: "Pending", payoutDate: "2026-10-03" }
  ]
};

const initialAdminContent = {
  specialties: [
    { id: "spec-1", name: "Cardiology", icon: "HeartPulse", code: "CARD", department: "Cardiovascular Sciences", doctorCount: 8, description: "Heart health, ECG, echocardiograms, hypertension and angiogram management.", active: true },
    { id: "spec-2", name: "General Medicine", icon: "Stethoscope", code: "GMED", department: "Internal Medicine", doctorCount: 14, description: "Primary diagnosis, seasonal infectious diseases, fever and preventive wellness.", active: true },
    { id: "spec-3", name: "Dermatology", icon: "Sparkles", code: "DERM", department: "Dermatology & Cosmetology", doctorCount: 6, description: "Clinical skin disorders, acne therapy, hair care and laser resurfacing.", active: true },
    { id: "spec-4", name: "Neurology", icon: "Brain", code: "NEUR", department: "Neurosciences", doctorCount: 5, description: "Brain disorders, stroke intervention, seizures, migraine and neuromuscular health.", active: true },
    { id: "spec-5", name: "Pediatrics", icon: "Baby", code: "PEDI", department: "Child Health & Neonatology", doctorCount: 9, description: "Comprehensive child healthcare, immunizations, and developmental tracking.", active: true },
    { id: "spec-6", name: "Orthopedics", icon: "Activity", code: "ORTH", department: "Orthopedic & Joint Institute", doctorCount: 6, description: "Joint reconstruction, sports physiotherapy, trauma and fracture restoration.", active: true }
  ],
  departments: [
    { id: "dep-1", name: "Cardiovascular Sciences", code: "DEPT-CARD", headDoctor: "Dr. Priya Sharma", totalBeds: 60, availableBeds: 14, activeDoctors: 8, floor: "4th Floor, East Wing", contactExtension: "Ext 401", status: "Active" },
    { id: "dep-2", name: "Internal Medicine", code: "DEPT-MED", headDoctor: "Dr. Ankit Verma", totalBeds: 120, availableBeds: 32, activeDoctors: 14, floor: "2nd Floor, Main Block", contactExtension: "Ext 201", status: "Active" },
    { id: "dep-3", name: "Neurosciences", code: "DEPT-NEURO", headDoctor: "Dr. Rajesh Iyer", totalBeds: 45, availableBeds: 8, activeDoctors: 5, floor: "5th Floor, Tower B", contactExtension: "Ext 501", status: "Active" },
    { id: "dep-4", name: "Dermatology & Cosmetology", code: "DEPT-DERM", headDoctor: "Dr. Sneha Reddy", totalBeds: 15, availableBeds: 9, activeDoctors: 6, floor: "3rd Floor, Outpatient Block", contactExtension: "Ext 305", status: "Active" },
    { id: "dep-5", name: "Child Health & Neonatology", code: "DEPT-PEDI", headDoctor: "Dr. Meera Nambiar", totalBeds: 50, availableBeds: 12, activeDoctors: 9, floor: "1st Floor, Child Pavilion", contactExtension: "Ext 108", status: "Active" }
  ],
  faqs: [
    { id: "faq-1", question: "How do patients schedule an appointment with a registered specialist?", answer: "Patients can search specialists by department or symptom, choose an available date and time slot, and confirm booking via online payment or insurance voucher.", category: "Appointments", order: 1, published: true },
    { id: "faq-2", question: "What is the qualification verification process for medical practitioners?", answer: "All practitioners undergo rigorous credential checks including state medical council registration, MBBS/MD certificates, government identity proof, and criminal background clearance.", category: "Doctors", order: 2, published: true },
    { id: "faq-3", question: "What is Medicare's cancellation and refund policy?", answer: "Appointments cancelled up to 2 hours prior to the session are eligible for 100% instant refund to the original payment source or patient Medicare wallet.", category: "Billing", order: 3, published: true },
    { id: "faq-4", question: "How is patient health record privacy and HIPAA compliance maintained?", answer: "All medical consultations and electronic health records are encrypted at rest using AES-256 and transmitted securely with TLS 1.3.", category: "General", order: 4, published: true }
  ],
  articles: [
    { id: "art-1", title: "Preventive Cardiology: 7 Vital Heart Screening Tests After Age 35", slug: "preventive-cardiology-7-vital-screenings", author: "Dr. Priya Sharma", category: "Cardiology", readTime: "5 min read", publishedDate: "2026-09-22", status: "Published", views: 2480, excerpt: "Early cardiovascular screenings can detect asymptomatic arterial plaque and stage-1 hypertension before complications arise." },
    { id: "art-2", title: "Managing Seasonal Fevers and Viral Infections in Children", slug: "managing-seasonal-fevers-children", author: "Dr. Meera Nambiar", category: "Pediatrics", readTime: "4 min read", publishedDate: "2026-09-18", status: "Published", views: 1940, excerpt: "A pediatric guide on hydration formulas, temperature tracking, and danger signs requiring emergency hospital visits." },
    { id: "art-3", title: "Modern Dermatology: Breakthroughs in Adult Acne and Barrier Repair", slug: "modern-dermatology-breakthroughs-acne", author: "Dr. Sneha Reddy", category: "Dermatology", readTime: "6 min read", publishedDate: "2026-09-10", status: "Published", views: 3120, excerpt: "How retinoids, peptide serums, and ceramide barrier matrices reverse inflammatory breakouts." },
    { id: "art-4", title: "Migraine Triggers and Neurological Management in Modern Workplaces", slug: "migraine-triggers-neurological-management", author: "Dr. Rajesh Iyer", category: "Neurology", readTime: "7 min read", publishedDate: "2026-08-29", status: "Draft", views: 420, excerpt: "Understanding blue-light exposure, sleep hygiene, and prescription triptans for chronic headache control." }
  ],
  announcements: [
    { id: "ann-1", title: "Scheduled Central Server Maintenance Window", message: "Medicare Cloud Telehealth nodes will undergo scheduled maintenance on Sunday 02:00 AM - 04:00 AM IST. Offline emergency services remain active.", priority: "High", targetAudience: "All", startDate: "2026-10-01", endDate: "2026-10-05", active: true },
    { id: "ann-2", title: "Mandatory Medical Council Re-Verification for Q4", message: "All verified clinical specialists must update their annual state council practice affidavits by October 31, 2026.", priority: "Urgent", targetAudience: "Doctors", startDate: "2026-09-25", endDate: "2026-10-31", active: true },
    { id: "ann-3", title: "Complimentary Seasonal Flu Vaccination Camps Announced", message: "Premium health plan subscribers can avail free influenza immunization across all partner clinic locations this month.", priority: "Normal", targetAudience: "Patients", startDate: "2026-10-01", endDate: "2026-10-20", active: true }
  ]
};

const initialAdminSystem = {
  roles: [
    {
      id: "role-superadmin",
      name: "Super Administrator",
      description: "Unrestricted platform oversight, credential approvals, fiscal payouts, and system configurations.",
      userCount: 2,
      permissions: {
        dashboard: { view: true, edit: true, delete: true },
        doctors: { view: true, edit: true, delete: true },
        patients: { view: true, edit: true, delete: true },
        appointments: { view: true, edit: true, delete: true },
        payments: { view: true, edit: true, delete: true },
        content: { view: true, edit: true, delete: true },
        system: { view: true, edit: true, delete: true }
      }
    },
    {
      id: "role-clinicadmin",
      name: "Clinic Manager",
      description: "Supervises day-to-day doctor rosters, clinic rooms, appointment schedules, and patient intake.",
      userCount: 6,
      permissions: {
        dashboard: { view: true, edit: false, delete: false },
        doctors: { view: true, edit: true, delete: false },
        patients: { view: true, edit: true, delete: false },
        appointments: { view: true, edit: true, delete: true },
        payments: { view: true, edit: false, delete: false },
        content: { view: true, edit: false, delete: false },
        system: { view: false, edit: false, delete: false }
      }
    },
    {
      id: "role-auditor",
      name: "Medical Credential Auditor",
      description: "Dedicated to verifying practitioner degrees, state licenses, background checks, and compliance.",
      userCount: 3,
      permissions: {
        dashboard: { view: true, edit: false, delete: false },
        doctors: { view: true, edit: true, delete: false },
        patients: { view: true, edit: false, delete: false },
        appointments: { view: true, edit: false, delete: false },
        payments: { view: false, edit: false, delete: false },
        content: { view: false, edit: false, delete: false },
        system: { view: false, edit: false, delete: false }
      }
    },
    {
      id: "role-support",
      name: "Patient Billing & Support Rep",
      description: "Manages appointment issues, disputes, patient queries, refunds, and rescheduling assistance.",
      userCount: 12,
      permissions: {
        dashboard: { view: true, edit: false, delete: false },
        doctors: { view: true, edit: false, delete: false },
        patients: { view: true, edit: true, delete: false },
        appointments: { view: true, edit: true, delete: false },
        payments: { view: true, edit: true, delete: false },
        content: { view: true, edit: false, delete: false },
        system: { view: false, edit: false, delete: false }
      }
    }
  ],
  auditLogs: [
    { id: "log-501", user: "admin@medicare.com", role: "Super Administrator", action: "Approved Doctor Registration", module: "Doctor Management", detail: "Verified credentials for Dr. Sneha Reddy (MCI-2016-9821)", ip: "103.24.188.10", timestamp: "2026-10-01 10:14:22", severity: "success" },
    { id: "log-502", user: "billing.lead@medicare.com", role: "Support Rep", action: "Processed Refund Approval", module: "Payment Management", detail: "Approved refund of $70 for transaction tx-9904 (INV-2026-9904)", ip: "103.24.188.14", timestamp: "2026-10-01 09:45:10", severity: "warning" },
    { id: "log-503", user: "system_cron", role: "Automated System", action: "Automated Database Snapshot", module: "System Backup", detail: "Incremental snapshot completed (3.8 GB) to encrypted S3 cluster", ip: "10.0.4.1", timestamp: "2026-10-01 04:00:00", severity: "info" },
    { id: "log-504", user: "admin@medicare.com", role: "Super Administrator", action: "Suspended Doctor Account", module: "Doctor Management", detail: "Suspended Dr. Farhan Ali pending state medical license renewal", ip: "103.24.188.10", timestamp: "2026-09-30 17:32:05", severity: "critical" },
    { id: "log-505", user: "clinic.mgr@medicare.com", role: "Clinic Manager", action: "Rescheduled Patient Consultation", module: "Appointment Management", detail: "Moved appointment #APT-84880 to 2026-10-04 per doctor emergency request", ip: "103.24.188.22", timestamp: "2026-09-30 14:18:44", severity: "info" }
  ],
  notificationTemplates: [
    { id: "tmpl-1", name: "Appointment Confirmation Alert", channel: "SMS & Push", trigger: "appointment_confirmed", subject: "Your Medicare appointment is confirmed", body: "Hello {{patient_name}}, your consultation with {{doctor_name}} is confirmed for {{date}} at {{time}}.", active: true },
    { id: "tmpl-2", name: "Doctor Registration Approved", channel: "Email", trigger: "doctor_approved", subject: "Welcome to Medicare Medical Network!", body: "Dear {{doctor_name}}, your credential verification has been approved. Your clinical portal is now active.", active: true },
    { id: "tmpl-3", name: "Emergency Delay Notification", channel: "SMS & In-App", trigger: "doctor_delayed", subject: "Doctor Delay Notice", body: "Notice: {{doctor_name}} is currently delayed by approx {{delay_minutes}} minutes due to an emergency procedure.", active: true },
    { id: "tmpl-4", name: "Refund Processed Notification", channel: "Email & SMS", trigger: "refund_completed", subject: "Medicare Refund Confirmation", body: "Your refund of ${{amount}} for appointment {{appointment_id}} has been processed to your original payment method.", active: true }
  ],
  settings: {
    hospitalName: "Medicare Super Specialty Health Network",
    portalVersion: "v4.6.0-enterprise",
    supportEmail: "support@medicare.com",
    emergencyHotline: "+91 80 4000 9999",
    currency: "USD ($)",
    maintenanceMode: false,
    sessionTimeoutMinutes: 60,
    maxLoginAttempts: 5,
    enableTwoFactor: true,
    dataBackupSchedule: "Daily at 04:00 AM UTC",
    autoApproveVerifiedDocs: false
  },
  reports: [
    { id: "rep-1", title: "Monthly Clinical Encounters Summary", type: "Clinical", frequency: "Monthly", lastGenerated: "2026-09-30", format: "PDF, CSV", size: "3.2 MB" },
    { id: "rep-2", title: "Revenue & Payout Audit Report", type: "Financial", frequency: "Weekly", lastGenerated: "2026-09-28", format: "PDF, XLSX", size: "5.8 MB" },
    { id: "rep-3", title: "Doctor Performance & Rating Ledger", type: "Staff", frequency: "Monthly", lastGenerated: "2026-09-30", format: "PDF, CSV", size: "1.9 MB" },
    { id: "rep-4", title: "Patient Demographic & Health Plan Distribution", type: "Demographics", frequency: "Quarterly", lastGenerated: "2026-09-15", format: "PDF, CSV", size: "4.1 MB" },
    { id: "rep-5", title: "System Security & Compliance Audit Log", type: "Security", frequency: "Daily", lastGenerated: "2026-10-01", format: "JSON, CSV", size: "8.6 MB" }
  ]
};

export const syncAdminDoctors = async () => {
  try {
    const res = await axiosClient.get("/api/v1/admin/doctors");
    if (res.data?.data && Array.isArray(res.data.data)) {
      const adapted = res.data.data.map(adaptDoctorFromBackend);
      saveAdminDoctors(adapted);
      return adapted;
    }
  } catch (err) {
    console.warn("syncAdminDoctors notice:", err.message);
  }
  return getAdminDoctors();
};

export const syncAdminPatients = async () => {
  try {
    const res = await axiosClient.get("/api/v1/admin/patients");
    if (res.data?.data && Array.isArray(res.data.data)) {
      const adapted = res.data.data.map(adaptPatientFromBackend);
      saveAdminPatients(adapted);
      return adapted;
    }
  } catch (err) {
    console.warn("syncAdminPatients notice:", err.message);
  }
  return getAdminPatients();
};

export const syncAdminAppointments = async () => {
  try {
    const res = await axiosClient.get("/api/v1/admin/appointments");
    if (res.data?.data && Array.isArray(res.data.data)) {
      const adapted = res.data.data.map(adaptAppointmentFromBackend);
      saveAdminAppointments(adapted);
      return adapted;
    }
  } catch (err) {
    console.warn("syncAdminAppointments notice:", err.message);
  }
  return getAdminAppointments();
};

export const getAdminDoctors = () => safeGet(STORAGE_KEYS.ADMIN_DOCTORS, initialAdminDoctors);

export const saveAdminDoctors = (doctors) => {
  safeSet(STORAGE_KEYS.ADMIN_DOCTORS, doctors);
  return doctors;
};

export const approveDoctor = (id) => {
  const list = getAdminDoctors();
  const updated = list.map((doc) =>
    doc.id === id ? { ...doc, status: "Active", verificationStatus: "Verified" } : doc
  );
  // Dispatch to backend API
  axiosClient.patch(`/api/v1/admin/doctors/${id}/registration`, {
    status: "approved",
  }).catch((err) => console.warn("Backend approveDoctor notice:", err.message));

  return saveAdminDoctors(updated);
};

export const rejectDoctor = (id, reason = "Credentials could not be verified") => {
  const list = getAdminDoctors();
  const updated = list.map((doc) =>
    doc.id === id ? { ...doc, status: "Rejected", verificationStatus: "Rejected", rejectionReason: reason } : doc
  );
  // Dispatch to backend API
  axiosClient.patch(`/api/v1/admin/doctors/${id}/registration`, {
    status: "rejected",
    rejectionReason: reason,
  }).catch((err) => console.warn("Backend rejectDoctor notice:", err.message));

  return saveAdminDoctors(updated);
};

export const toggleDoctorStatus = (id, nextStatus) => {
  const list = getAdminDoctors();
  const updated = list.map((doc) =>
    doc.id === id ? { ...doc, status: nextStatus } : doc
  );
  // Dispatch to backend API
  axiosClient.patch(`/api/v1/admin/doctors/${id}/status`, {
    accountStatus: nextStatus.toLowerCase(),
  }).catch((err) => console.warn("Backend toggleDoctorStatus notice:", err.message));

  return saveAdminDoctors(updated);
};

export const updateDoctorInfo = (id, fields) => {
  const list = getAdminDoctors();
  const updated = list.map((doc) =>
    doc.id === id ? { ...doc, ...fields } : doc
  );
  // Dispatch to backend API
  axiosClient.put(`/api/v1/admin/doctors/${id}`, fields).catch((err) =>
    console.warn("Backend updateDoctorInfo notice:", err.message)
  );

  return saveAdminDoctors(updated);
};

export const verifyDoctorDocument = (docId, documentId) => {
  const list = getAdminDoctors();
  const updated = list.map((doc) => {
    if (doc.id !== docId) return doc;
    const updatedDocs = doc.documents.map((d) =>
      d.id === documentId ? { ...d, verified: true } : d
    );
    const allVerified = updatedDocs.every((d) => d.verified);
    return {
      ...doc,
      documents: updatedDocs,
      verificationStatus: allVerified ? "Verified" : "Pending"
    };
  });
  // Dispatch to backend API
  axiosClient.patch(`/api/v1/admin/doctors/${docId}/verify-qualifications`, {
    isQualifiedVerified: true,
  }).catch((err) => console.warn("Backend verifyDoctorDocument notice:", err.message));

  return saveAdminDoctors(updated);
};

export const getAdminPatients = () => safeGet(STORAGE_KEYS.ADMIN_PATIENTS, initialAdminPatients);

export const saveAdminPatients = (patients) => {
  safeSet(STORAGE_KEYS.ADMIN_PATIENTS, patients);
  return patients;
};

export const togglePatientStatus = (id) => {
  const list = getAdminPatients();
  const target = list.find((p) => p.id === id);
  const nextStatus = target?.status === "Active" ? "Deactivated" : "Active";

  const updated = list.map((pat) => {
    if (pat.id !== id) return pat;
    const newLog = {
      id: `act-${Date.now()}`,
      type: "profile_update",
      title: nextStatus === "Active" ? "Account Activated" : "Account Deactivated",
      description: `Account status updated to ${nextStatus} by Administrator`,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16),
      ip: "127.0.0.1"
    };
    return {
      ...pat,
      status: nextStatus,
      activityLog: [newLog, ...(pat.activityLog || [])]
    };
  });

  // Dispatch to backend API
  axiosClient.patch(`/api/v1/admin/patients/${id}/status`, {
    accountStatus: nextStatus.toLowerCase(),
  }).catch((err) => console.warn("Backend togglePatientStatus notice:", err.message));

  return saveAdminPatients(updated);
};

export const getAdminAppointments = () => safeGet(STORAGE_KEYS.ADMIN_APPOINTMENTS, initialAdminAppointments);

export const saveAdminAppointments = (appointments) => {
  safeSet(STORAGE_KEYS.ADMIN_APPOINTMENTS, appointments);
  return appointments;
};

export const cancelAdminAppointment = (id, reason = "Cancelled by administrator") => {
  const list = getAdminAppointments();
  const updated = list.map((apt) =>
    apt.id === id ? { ...apt, status: "Cancelled", cancelReason: reason } : apt
  );

  // Dispatch to backend API
  axiosClient.patch(`/api/v1/admin/appointments/${id}/cancel`, {
    cancellationReason: reason,
  }).catch((err) => console.warn("Backend cancelAdminAppointment notice:", err.message));

  return saveAdminAppointments(updated);
};

export const resolveAppointmentIssue = (id, notes = "") => {
  const list = getAdminAppointments();
  const updated = list.map((apt) => {
    if (apt.id !== id) return apt;
    return {
      ...apt,
      status: "Confirmed",
      issue: apt.issue
        ? { ...apt.issue, status: "Resolved", resolution: notes, resolvedAt: new Date().toISOString().substring(0, 16) }
        : null
    };
  });

  // Dispatch to backend API
  axiosClient.patch(`/api/v1/admin/appointments/${id}/resolve-issue`, {
    notes,
  }).catch((err) => console.warn("Backend resolveAppointmentIssue notice:", err.message));

  return saveAdminAppointments(updated);
};

export const getAdminPayments = () => safeGet(STORAGE_KEYS.ADMIN_PAYMENTS, initialAdminPayments);

export const saveAdminPayments = (payments) => {
  safeSet(STORAGE_KEYS.ADMIN_PAYMENTS, payments);
  return payments;
};

export const processAdminRefund = (refundId, status = "Approved") => {
  const data = getAdminPayments();
  const updatedRefunds = data.refunds.map((r) =>
    r.id === refundId ? { ...r, status, processedDate: new Date().toISOString().substring(0, 10) } : r
  );
  const updated = { ...data, refunds: updatedRefunds };

  // Dispatch to backend API
  axiosClient.post(`/api/v1/admin/payments/transactions/${refundId}/refund`, {
    refundReason: "Approved by administrator",
  }).catch((err) => console.warn("Backend processAdminRefund notice:", err.message));

  return saveAdminPayments(updated);
};

export const resolveFailedPayment = (id) => {
  const data = getAdminPayments();
  const updatedFailed = data.failedPayments.map((f) =>
    f.id === id ? { ...f, status: "Resolved" } : f
  );
  const updated = { ...data, failedPayments: updatedFailed };

  // Dispatch to backend API
  axiosClient.patch(`/api/v1/admin/payments/transactions/${id}/status`, {
    status: "completed",
  }).catch((err) => console.warn("Backend resolveFailedPayment notice:", err.message));

  return saveAdminPayments(updated);
};

export const executePayout = (payoutId) => {
  const data = getAdminPayments();
  const updatedPayouts = data.doctorPayouts.map((p) =>
    p.id === payoutId
      ? { ...p, status: "Paid", executionDate: new Date().toISOString().substring(0, 10), reference: `HDFC-RTGS-${Date.now().toString().slice(-6)}` }
      : p
  );
  const updated = { ...data, doctorPayouts: updatedPayouts };

  // Dispatch to backend API
  axiosClient.patch(`/api/v1/admin/payments/payouts/${payoutId}/status`, {
    status: "paid",
  }).catch((err) => console.warn("Backend executePayout notice:", err.message));

  return saveAdminPayments(updated);
};

export const getAdminContent = () => safeGet(STORAGE_KEYS.ADMIN_CONTENT, initialAdminContent);

export const saveAdminContent = (content) => {
  safeSet(STORAGE_KEYS.ADMIN_CONTENT, content);
  return content;
};

export const toggleSpecialtyStatus = (id) => {
  const data = getAdminContent();
  const updated = {
    ...data,
    specialties: data.specialties.map((s) => s.id === id ? { ...s, active: !s.active } : s)
  };
  return saveAdminContent(updated);
};

export const toggleFaqStatus = (id) => {
  const data = getAdminContent();
  const updated = {
    ...data,
    faqs: data.faqs.map((f) => f.id === id ? { ...f, published: !f.published } : f)
  };
  return saveAdminContent(updated);
};

export const toggleArticleStatus = (id) => {
  const data = getAdminContent();
  const updated = {
    ...data,
    articles: data.articles.map((a) =>
      a.id === id ? { ...a, status: a.status === "Published" ? "Draft" : "Published" } : a
    )
  };
  return saveAdminContent(updated);
};

export const toggleAnnouncementStatus = (id) => {
  const data = getAdminContent();
  const updated = {
    ...data,
    announcements: data.announcements.map((an) => an.id === id ? { ...an, active: !an.active } : an)
  };
  return saveAdminContent(updated);
};

export const getAdminSystem = () => safeGet(STORAGE_KEYS.ADMIN_SYSTEM, initialAdminSystem);

export const saveAdminSystem = (system) => {
  safeSet(STORAGE_KEYS.ADMIN_SYSTEM, system);
  return system;
};

export const addAuditLog = (logEntry) => {
  const system = getAdminSystem();
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
    ...logEntry
  };
  const updated = {
    ...system,
    auditLogs: [newLog, ...(system.auditLogs || [])]
  };
  return saveAdminSystem(updated);
};

export const updateSystemSettings = (newSettings) => {
  const system = getAdminSystem();
  const updated = {
    ...system,
    settings: { ...system.settings, ...newSettings }
  };
  return saveAdminSystem(updated);
};
