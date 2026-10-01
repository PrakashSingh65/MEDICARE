/**
 * Normalization & data adapter utilities to map between
 * Backend MongoDB models and Frontend Component structures.
 */

export const adaptDoctorFromBackend = (doc) => {
  if (!doc) return null;
  const isVerified = Boolean(doc.isQualifiedVerified);
  const statusStr =
    doc.accountStatus === "active"
      ? "Active"
      : doc.accountStatus === "suspended"
      ? "Suspended"
      : "Pending";

  const verificationStr = isVerified
    ? "Verified"
    : doc.registrationStatus === "pending"
    ? "Pending"
    : doc.registrationStatus === "approved"
    ? "Verified"
    : "Rejected";

  const quals = Array.isArray(doc.qualifications) ? doc.qualifications : [];
  const qualText = quals.length > 0 ? quals.map((q) => q.degree).join(", ") : "MBBS, MD";

  const docsList = quals.map((q, idx) => ({
    id: q._id || `doc-qual-${idx}`,
    name: `${q.degree || "Medical_Degree"}_Verification.pdf`,
    type: "Degree",
    verified: Boolean(q.verified),
  }));

  return {
    id: String(doc._id || doc.id),
    name: doc.name || "Dr. Medical Specialist",
    avatar:
      doc.imageUrl ||
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    specialty: doc.specialty || "General Medicine",
    department: doc.department || "Internal Medicine",
    experience: Number(doc.experience) || 5,
    rating: Number(doc.rating) || 4.8,
    patientsCount: Number(doc.totalConsultations) || 42,
    clinic: doc.clinicInfo?.clinicName || "Medicare Super Specialty Clinic",
    location:
      doc.clinicInfo?.address ||
      doc.clinicInfo?.city ||
      "Indiranagar, Bangalore",
    fee: typeof doc.fee === "number" ? `$${doc.fee}` : doc.fee || "$60",
    rawFee: Number(doc.fee) || 60,
    qualification: qualText,
    email: doc.email || "",
    phone: doc.phone || "+91 98765 43210",
    status: statusStr,
    verificationStatus: verificationStr,
    registeredDate: doc.createdAt ? doc.createdAt.split("T")[0] : "2026-01-10",
    documents: docsList.length > 0 ? docsList : [
      { id: "doc-med-1", name: "Medical_Degree_MD.pdf", type: "Degree", verified: isVerified },
      { id: "doc-med-2", name: "State_Medical_Council_License.pdf", type: "License", verified: isVerified },
    ],
    bio: doc.bio || "Certified medical specialist practicing at Medicare Clinical Network.",
    availability: doc.availability || {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: "09:00",
      endTime: "17:00",
    },
  };
};

export const adaptPatientFromBackend = (pat) => {
  if (!pat) return null;
  const statusStr = pat.accountStatus === "active" ? "Active" : "Deactivated";

  return {
    id: String(pat._id || pat.id),
    name: pat.name || "Medicare Patient",
    avatar:
      pat.imageUrl ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    age: Number(pat.age) || 30,
    gender: pat.gender || "Unspecified",
    bloodGroup: pat.bloodGroup || "O+",
    phone: pat.phone || "+91 98765 00000",
    email: pat.email || "",
    plan: pat.plan || "Standard",
    status: statusStr,
    totalVisits: (pat.medicalHistory || []).length + 1,
    lastVisit: "2026-09-24",
    city: pat.address ? pat.address.split(",").pop().trim() : "Bangalore",
    address: pat.address || "Bangalore, India",
    medicalHistory: Array.isArray(pat.medicalHistory) ? pat.medicalHistory : [],
    emergencyContact: pat.emergencyContact || {
      name: "Emergency Contact",
      relationship: "Family",
      phone: "+91 98765 99999",
      email: "contact@medicare.com",
    },
    allergies: Array.isArray(pat.allergies) ? pat.allergies : [],
    medicalConditions: Array.isArray(pat.medicalConditions) ? pat.medicalConditions : [],
  };
};

export const adaptAppointmentFromBackend = (appt) => {
  if (!appt) return null;
  const rawStatus = (appt.status || "scheduled").toLowerCase();
  const statusStr =
    rawStatus === "confirmed" || rawStatus === "accepted"
      ? "Confirmed"
      : rawStatus === "completed"
      ? "Completed"
      : rawStatus === "cancelled" || rawStatus === "rejected"
      ? "Cancelled"
      : rawStatus === "rescheduled"
      ? "Rescheduled"
      : "Scheduled";

  const typeStr =
    appt.consultationType === "video"
      ? "Video Consultation"
      : appt.consultationType === "audio"
      ? "Audio Call"
      : "In-Clinic Visit";

  const dateStr = appt.appointmentDate
    ? String(appt.appointmentDate).split("T")[0]
    : new Date().toISOString().split("T")[0];

  const todayStr = new Date().toISOString().split("T")[0];
  const isToday = dateStr === todayStr;
  const idStr = String(appt._id || appt.id || "");
  const appointmentNumber =
    appt.appointmentNumber || `APT-${idStr.length >= 5 ? idStr.slice(-5).toUpperCase() : Math.floor(10000 + Math.random() * 90000)}`;

  const symptomsText =
    appt.reasonForVisit || appt.symptoms || "Routine medical consultation";

  return {
    id: idStr,
    appointmentNumber,
    patientId: String(appt.patientId?._id || appt.patientId || ""),
    patientName: appt.patientName || appt.patientId?.name || "Patient",
    patientAvatar:
      appt.patientAvatar ||
      appt.patientId?.imageUrl ||
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    patientEmail: appt.patientEmail || appt.patientId?.email || "",
    patientAge: Number(appt.patientAge || appt.patientId?.age) || 30,
    patientGender: appt.patientGender || appt.patientId?.gender || "Unspecified",
    patientPhone: appt.patientPhone || appt.patientId?.phone || "+91 98765 00000",
    doctorId: String(appt.doctorId?._id || appt.doctorId || ""),
    doctorName: appt.doctorName || appt.doctorId?.name || "Doctor",
    doctorSpecialty: appt.specialty || appt.doctorId?.specialty || "General Medicine",
    doctorAvatar:
      appt.doctorAvatar ||
      appt.doctorId?.imageUrl ||
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
    specialty: appt.specialty || "General Medicine",
    department: appt.department || "Internal Medicine",
    clinic: appt.clinic || appt.department || "Medicare Care Center",
    date: dateStr,
    time: appt.timeSlot || "10:00 AM",
    type: typeStr,
    consultationType: appt.consultationType || "video",
    status: statusStr,
    rawStatus: appt.status,
    isToday,
    isUpcoming: statusStr !== "Completed" && statusStr !== "Cancelled",
    symptoms: symptomsText,
    reasonForVisit: symptomsText,
    room: appt.room || (appt.consultationType === "video" ? "Telehealth Room #1" : "Suite 4B"),
    fee: typeof appt.fee === "number" ? `$${appt.fee}` : appt.fee || "$60",
    rawFee: Number(appt.fee) || 60,
    paymentStatus: appt.paymentStatus || "paid",
    reminderSet: Array.isArray(appt.reminders) && appt.reminders.length > 0,
    issue: appt.issue?.hasIssue
      ? {
          hasIssue: true,
          type: "Dispute",
          description: appt.issue.description || "Reported dispute",
          status: appt.issue.status || "open",
        }
      : null,
  };
};

export const adaptPrescriptionFromBackend = (rx) => {
  if (!rx) return null;
  const issuedDateStr = rx.issuedAt
    ? String(rx.issuedAt).split("T")[0]
    : String(rx.createdAt || "").split("T")[0] || "2026-10-01";

  const followUpStr = rx.followUpDate
    ? String(rx.followUpDate).split("T")[0]
    : "2026-11-01";

  return {
    id: String(rx._id || rx.id),
    prescriptionNumber: rx.prescriptionNumber || `RX-${Date.now().toString().slice(-6)}`,
    rxNumber: rx.prescriptionNumber || `RX-${Date.now().toString().slice(-6)}`,
    status: rx.status || "Active",
    doctorName: rx.doctorName || "Dr. Priya Sharma",
    doctorSpecialty: rx.doctorSpecialty || "Cardiology",
    doctorQualifications: rx.doctorQualifications || "MBBS, MD",
    clinic: rx.clinicName || rx.clinic || "Medicare Center",
    clinicName: rx.clinicName || rx.clinic || "Medicare Center",
    patientId: String(rx.patientId?._id || rx.patientId || ""),
    patientName: rx.patientName || "Patient",
    patientAge: Number(rx.patientAge) || 28,
    patientGender: rx.patientGender || "Female",
    diagnosis: rx.diagnosis || "General Consultation",
    date: issuedDateStr,
    validUntil: rx.validUntil || followUpStr,
    followUp: followUpStr,
    followUpDate: followUpStr,
    medicines: Array.isArray(rx.medicines)
      ? rx.medicines.map((m, idx) => ({
          id: m._id || m.id || `m-${idx}`,
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration || "14 days",
          instructions: m.instructions || "Take as directed",
        }))
      : [],
    generalInstructions: rx.generalInstructions || "Take medications as prescribed.",
    generalAdvice: rx.generalAdvice || rx.generalInstructions || "Take medications as prescribed.",
  };
};
