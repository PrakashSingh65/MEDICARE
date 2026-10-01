import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import User from "../model/user.model.js";
import Doctor from "../model/doctor.model.js";
import Patient from "../model/patient.model.js";
import Appointment from "../model/appointment.model.js";
import Prescription from "../model/prescription.model.js";
import Consultation from "../model/consultation.model.js";
import { Transaction, DoctorPayout } from "../model/payment.model.js";
import MedicalReport from "../model/report.model.js";
import {
  Specialty,
  Department,
  Faq,
  HealthArticle,
  Announcement,
} from "../model/content.model.js";
import {
  RolePermission,
  AuditLog,
  Notification,
  SystemSetting,
} from "../model/system.model.js";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://host.docker.internal:27017/MEDICARE";

export const seedDatabase = async () => {
  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding.");

    // 1. Clear existing seed collections
    console.log("Clearing collections...");
    await Promise.all([
      User.deleteMany({}),
      Doctor.deleteMany({}),
      Patient.deleteMany({}),
      Appointment.deleteMany({}),
      Prescription.deleteMany({}),
      Consultation.deleteMany({}),
      Transaction.deleteMany({}),
      DoctorPayout.deleteMany({}),
      MedicalReport.deleteMany({}),
      Specialty.deleteMany({}),
      Department.deleteMany({}),
      Faq.deleteMany({}),
      HealthArticle.deleteMany({}),
      Announcement.deleteMany({}),
      RolePermission.deleteMany({}),
      AuditLog.deleteMany({}),
      Notification.deleteMany({}),
      SystemSetting.deleteMany({}),
    ]);

    // 2. Create Users
    console.log("Creating users...");
    const adminUser = await User.create({
      username: "Medicare Administrator",
      email: "admin@medicare.com",
      password: "password123",
      role: "admin",
      imageUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      phone: "+91 99999 11111",
      isActive: true,
      isEmailVerified: true,
    });

    const docUser1 = await User.create({
      username: "Dr. Priya Sharma",
      email: "doctor@medicare.com",
      password: "password123",
      role: "doctor",
      imageUrl:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
      phone: "+91 98765 43210",
      isActive: true,
      isEmailVerified: true,
    });

    const docUser2 = await User.create({
      username: "Dr. Ankit Verma",
      email: "dr.ankit@medicare.com",
      password: "password123",
      role: "doctor",
      imageUrl:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
      phone: "+91 98765 43211",
      isActive: true,
      isEmailVerified: true,
    });

    const docUser3 = await User.create({
      username: "Dr. Rajesh Nair",
      email: "dr.rajesh@medicare.com",
      password: "password123",
      role: "doctor",
      imageUrl:
        "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300",
      phone: "+91 98765 43212",
      isActive: true,
      isEmailVerified: true,
    });

    const docUser4 = await User.create({
      username: "Dr. Sneha Patel",
      email: "dr.sneha@medicare.com",
      password: "password123",
      role: "doctor",
      imageUrl:
        "https://images.unsplash.com/photo-1594824813576-90c74900cb4f?auto=format&fit=crop&q=80&w=300",
      phone: "+91 98765 43213",
      isActive: true,
      isEmailVerified: true,
    });

    const patUser1 = await User.create({
      username: "Aditi Kapoor",
      email: "patient@medicare.com",
      password: "password123",
      role: "patient",
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      phone: "+91 98765 00001",
      isActive: true,
      isEmailVerified: true,
    });

    const patUser2 = await User.create({
      username: "Rahul Verma",
      email: "rahul.verma@medicare.com",
      password: "password123",
      role: "patient",
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      phone: "+91 98765 00002",
      isActive: true,
      isEmailVerified: true,
    });

    const patUser3 = await User.create({
      username: "Sunita Rao",
      email: "sunita.rao@medicare.com",
      password: "password123",
      role: "patient",
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
      phone: "+91 98765 00003",
      isActive: true,
      isEmailVerified: true,
    });

    const patUser4 = await User.create({
      username: "Kavita Reddy",
      email: "kavita.reddy@medicare.com",
      password: "password123",
      role: "patient",
      imageUrl:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
      phone: "+91 98765 00004",
      isActive: true,
      isEmailVerified: true,
    });

    // 3. Create Doctors
    console.log("Creating doctor profiles...");
    const doctor1 = await Doctor.create({
      userId: docUser1._id,
      name: "Dr. Priya Sharma",
      email: "doctor@medicare.com",
      phone: "+91 98765 43210",
      specialty: "Cardiology",
      department: "Cardiology Department",
      experience: 12,
      fee: 75,
      rating: 4.9,
      totalConsultations: 142,
      imageUrl: docUser1.imageUrl,
      bio: "Senior interventional cardiologist with 12+ years expertise in preventive heart health and hypertension management.",
      languages: ["English", "Hindi"],
      clinicInfo: {
        clinicName: "HeartCare Super Specialty Clinic",
        hospitalAffiliation: "Medicare Super Specialty Hospital",
        address: "100ft Road, Indiranagar",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560038",
        contactPhone: "+91 98765 43210",
        consultationType: ["in_clinic", "video"],
      },
      registrationStatus: "approved",
      accountStatus: "active",
      isQualifiedVerified: true,
      qualifications: [
        {
          degree: "MBBS",
          institution: "AIIMS New Delhi",
          year: 2011,
          verified: true,
        },
        {
          degree: "MD - Cardiology",
          institution: "AIIMS New Delhi",
          year: 2015,
          verified: true,
        },
      ],
      availability: {
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        startTime: "09:00",
        endTime: "17:00",
        breakStart: "13:00",
        breakEnd: "14:00",
        slotDurationMinutes: 30,
      },
    });

    const doctor2 = await Doctor.create({
      userId: docUser2._id,
      name: "Dr. Ankit Verma",
      email: "dr.ankit@medicare.com",
      phone: "+91 98765 43211",
      specialty: "General Medicine",
      department: "Internal Medicine",
      experience: 8,
      fee: 50,
      rating: 4.7,
      totalConsultations: 110,
      imageUrl: docUser2.imageUrl,
      bio: "Consultant physician specializing in chronic disease triage, diabetes reversal protocols, and primary care.",
      languages: ["English", "Hindi"],
      clinicInfo: {
        clinicName: "CityHealth Family Medical Center",
        hospitalAffiliation: "Apollo Clinics",
        address: "Koramangala 5th Block",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560034",
        contactPhone: "+91 98765 43211",
        consultationType: ["in_clinic", "video"],
      },
      registrationStatus: "approved",
      accountStatus: "active",
      isQualifiedVerified: true,
      qualifications: [
        {
          degree: "MBBS",
          institution: "KMC Manipal",
          year: 2015,
          verified: true,
        },
        {
          degree: "MD - General Medicine",
          institution: "KMC Manipal",
          year: 2018,
          verified: true,
        },
      ],
      availability: {
        days: ["Monday", "Wednesday", "Friday", "Saturday"],
        startTime: "10:00",
        endTime: "18:00",
        breakStart: "13:30",
        breakEnd: "14:30",
        slotDurationMinutes: 30,
      },
    });

    const doctor3 = await Doctor.create({
      userId: docUser3._id,
      name: "Dr. Rajesh Nair",
      email: "dr.rajesh@medicare.com",
      phone: "+91 98765 43212",
      specialty: "Orthopedics",
      department: "Orthopedic Surgery",
      experience: 15,
      fee: 85,
      rating: 4.8,
      totalConsultations: 205,
      imageUrl: docUser3.imageUrl,
      bio: "Joint replacement and sports injury surgeon with international fellowship in arthroscopy.",
      languages: ["English", "Malayalam", "Hindi"],
      clinicInfo: {
        clinicName: "Nair Ortho & Sports Clinic",
        hospitalAffiliation: "Fortis Hospital",
        address: "MG Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        contactPhone: "+91 98765 43212",
        consultationType: ["in_clinic"],
      },
      registrationStatus: "pending",
      accountStatus: "active",
      isQualifiedVerified: false,
      qualifications: [
        {
          degree: "MS - Orthopedics",
          institution: "Christian Medical College Vellore",
          year: 2009,
          verified: false,
        },
      ],
    });

    const doctor4 = await Doctor.create({
      userId: docUser4._id,
      name: "Dr. Sneha Patel",
      email: "dr.sneha@medicare.com",
      phone: "+91 98765 43213",
      specialty: "Dermatology",
      department: "Dermatology OPD",
      experience: 9,
      fee: 65,
      rating: 4.9,
      totalConsultations: 98,
      imageUrl: docUser4.imageUrl,
      bio: "Board-certified dermatologist focusing on clinical dermatology, pediatric eczema, and acne therapies.",
      languages: ["English", "Gujarati", "Hindi"],
      clinicInfo: {
        clinicName: "DermaCare Skin & Laser Clinic",
        hospitalAffiliation: "Manipal Hospital",
        address: "HSR Layout Sector 2",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560102",
        contactPhone: "+91 98765 43213",
        consultationType: ["in_clinic", "video"],
      },
      registrationStatus: "approved",
      accountStatus: "active",
      isQualifiedVerified: true,
      qualifications: [
        {
          degree: "MD - Dermatology",
          institution: "Grant Medical College Mumbai",
          year: 2014,
          verified: true,
        },
      ],
    });

    // 4. Create Patients
    console.log("Creating patient profiles...");
    const patient1 = await Patient.create({
      userId: patUser1._id,
      name: "Aditi Kapoor",
      email: "patient@medicare.com",
      phone: "+91 98765 00001",
      age: 28,
      gender: "Female",
      bloodGroup: "O+",
      address: "Indiranagar, Bangalore",
      imageUrl: patUser1.imageUrl,
      plan: "Premium Care",
      accountStatus: "active",
      medicalConditions: ["Mild Asthma", "Seasonal Allergies"],
      allergies: ["Penicillin", "Dust Mites"],
      emergencyContact: {
        name: "Vikram Kapoor",
        relationship: "Brother",
        phone: "+91 98765 99991",
        email: "vikram.kapoor@example.com",
      },
      currentMedications: [
        {
          name: "Montelukast",
          dosage: "10mg",
          frequency: "Once daily at bedtime",
          prescribedBy: "Dr. Ankit Verma",
        },
      ],
      medicalHistory: [
        {
          condition: "Bronchitis",
          diagnosedDate: new Date("2023-11-15"),
          status: "resolved",
          notes: "Treated with 5-day course of inhalers and rest.",
        },
      ],
    });

    const patient2 = await Patient.create({
      userId: patUser2._id,
      name: "Rahul Verma",
      email: "rahul.verma@medicare.com",
      phone: "+91 98765 00002",
      age: 34,
      gender: "Male",
      bloodGroup: "B+",
      address: "Whitefield, Bangalore",
      imageUrl: patUser2.imageUrl,
      plan: "Standard",
      accountStatus: "active",
      medicalConditions: ["Hypertension Stage 1"],
      allergies: ["Sulfa drugs"],
      emergencyContact: {
        name: "Pooja Verma",
        relationship: "Spouse",
        phone: "+91 98765 99992",
        email: "pooja.verma@example.com",
      },
    });

    const patient3 = await Patient.create({
      userId: patUser3._id,
      name: "Sunita Rao",
      email: "sunita.rao@medicare.com",
      phone: "+91 98765 00003",
      age: 62,
      gender: "Female",
      bloodGroup: "AB+",
      address: "Jayanagar, Bangalore",
      imageUrl: patUser3.imageUrl,
      plan: "Senior Plus",
      accountStatus: "active",
      medicalConditions: ["Type 2 Diabetes", "Osteoarthritis"],
      allergies: ["Aspirin"],
      emergencyContact: {
        name: "Anand Rao",
        relationship: "Son",
        phone: "+91 98765 99993",
        email: "anand.rao@example.com",
      },
    });

    const patient4 = await Patient.create({
      userId: patUser4._id,
      name: "Kavita Reddy",
      email: "kavita.reddy@medicare.com",
      phone: "+91 98765 00004",
      age: 41,
      gender: "Female",
      bloodGroup: "A+",
      address: "Electronic City, Bangalore",
      imageUrl: patUser4.imageUrl,
      plan: "Family Shield",
      accountStatus: "active",
      medicalConditions: ["Atopic Dermatitis"],
      allergies: [],
    });

    // 5. Create Appointments
    console.log("Creating appointments...");
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const appt1 = await Appointment.create({
      patientId: patient1._id,
      patientName: patient1.name,
      patientEmail: patient1.email,
      doctorId: doctor1._id,
      doctorName: doctor1.name,
      specialty: doctor1.specialty,
      department: doctor1.department,
      appointmentDate: today,
      timeSlot: "10:00 - 10:30",
      consultationType: "video",
      status: "confirmed",
      fee: doctor1.fee,
      paymentStatus: "paid",
      reasonForVisit: "Routine cardiovascular checkup and pulse rate review.",
    });

    const appt2 = await Appointment.create({
      patientId: patient2._id,
      patientName: patient2.name,
      patientEmail: patient2.email,
      doctorId: doctor1._id,
      doctorName: doctor1.name,
      specialty: doctor1.specialty,
      department: doctor1.department,
      appointmentDate: today,
      timeSlot: "14:00 - 14:30",
      consultationType: "in_clinic",
      status: "scheduled",
      fee: doctor1.fee,
      paymentStatus: "paid",
      reasonForVisit: "Blood pressure evaluation and stress test consult.",
    });

    const appt3 = await Appointment.create({
      patientId: patient3._id,
      patientName: patient3.name,
      patientEmail: patient3.email,
      doctorId: doctor2._id,
      doctorName: doctor2.name,
      specialty: doctor2.specialty,
      department: doctor2.department,
      appointmentDate: tomorrow,
      timeSlot: "11:00 - 11:30",
      consultationType: "video",
      status: "scheduled",
      fee: doctor2.fee,
      paymentStatus: "pending",
      reasonForVisit: "Quarterly HbA1c review and insulin dosage adjustments.",
    });

    const appt4 = await Appointment.create({
      patientId: patient4._id,
      patientName: patient4.name,
      patientEmail: patient4.email,
      doctorId: doctor4._id,
      doctorName: doctor4.name,
      specialty: doctor4.specialty,
      department: doctor4.department,
      appointmentDate: yesterday,
      timeSlot: "15:00 - 15:30",
      consultationType: "in_clinic",
      status: "completed",
      fee: doctor4.fee,
      paymentStatus: "paid",
      reasonForVisit: "Follow-up for eczema rash and topical prescription refill.",
    });

    // 6. Create Prescriptions
    console.log("Creating prescriptions...");
    await Prescription.create({
      prescriptionNumber: `RX-${Date.now().toString().slice(-6)}`,
      appointmentId: appt1._id,
      doctorId: doctor1._id,
      doctorName: doctor1.name,
      doctorSpecialty: doctor1.specialty,
      clinicName: doctor1.clinicInfo.clinicName,
      patientId: patient1._id,
      patientName: patient1.name,
      patientAge: patient1.age,
      patientGender: patient1.gender,
      diagnosis: "Mild Sinus Tachycardia",
      symptoms: ["Palpitations after exertion", "Fatigue"],
      medicines: [
        {
          name: "Metoprolol Succinate",
          dosage: "25mg",
          frequency: "Once daily in the morning",
          duration: "30 days",
          instructions: "Take with food",
        },
        {
          name: "Omega-3 Triglycerides",
          dosage: "1000mg",
          frequency: "Once daily with dinner",
          duration: "60 days",
          instructions: "Swallow whole with plenty of water",
        },
      ],
      generalInstructions:
        "Maintain adequate hydration, limit caffeine, and monitor resting heart rate twice daily.",
      followUpDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
      issuedAt: yesterday,
    });

    // 7. Create Transactions
    console.log("Creating transactions...");
    await Transaction.create({
      transactionReference: `TXN-${Date.now().toString().slice(-8)}-1`,
      appointmentId: appt1._id,
      patientId: patient1._id,
      patientName: patient1.name,
      doctorId: doctor1._id,
      doctorName: doctor1.name,
      amount: 75,
      platformFee: 15,
      doctorEarning: 60,
      currency: "INR",
      paymentMethod: "upi",
      status: "completed",
      paidAt: today,
    });

    await Transaction.create({
      transactionReference: `TXN-${Date.now().toString().slice(-8)}-2`,
      appointmentId: appt4._id,
      patientId: patient4._id,
      patientName: patient4.name,
      doctorId: doctor4._id,
      doctorName: doctor4.name,
      amount: 65,
      platformFee: 13,
      doctorEarning: 52,
      currency: "INR",
      paymentMethod: "card",
      status: "completed",
      paidAt: yesterday,
    });

    await DoctorPayout.create({
      doctorId: doctor1._id,
      doctorName: doctor1.name,
      amount: 480,
      currency: "INR",
      periodStart: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
      periodEnd: today,
      status: "paid",
      bankReference: "HDFC-NEFT-92847192",
      notes: "Bi-weekly consultation fee disbursement",
      processedAt: today,
    });

    // 8. Create Specialties & Departments
    console.log("Creating specialties and departments...");
    await Specialty.insertMany([
      { name: "Cardiology", code: "CARD", description: "Heart and vascular healthcare", isActive: true },
      { name: "General Medicine", code: "GENMED", description: "Comprehensive primary & adult care", isActive: true },
      { name: "Orthopedics", code: "ORTHO", description: "Musculoskeletal & joint treatments", isActive: true },
      { name: "Dermatology", code: "DERM", description: "Skin, hair and nail treatments", isActive: true },
      { name: "Neurology", code: "NEURO", description: "Brain and nervous system disorders", isActive: true },
      { name: "Pediatrics", code: "PED", description: "Childhood and adolescent care", isActive: true },
    ]);

    await Department.insertMany([
      { name: "Cardiology Department", code: "DEP-CARD", headDoctorName: "Dr. Priya Sharma", description: "Specialized cardiac ICU and catheterization laboratory", isActive: true },
      { name: "Internal Medicine", code: "DEP-MED", headDoctorName: "Dr. Ankit Verma", description: "Inpatient and outpatient adult medical care", isActive: true },
      { name: "Orthopedic Surgery", code: "DEP-ORTHO", headDoctorName: "Dr. Rajesh Nair", description: "Trauma, joint replacement, and arthroscopy unit", isActive: true },
      { name: "Dermatology OPD", code: "DEP-DERM", headDoctorName: "Dr. Sneha Patel", description: "Medical dermatology and allergy clinics", isActive: true },
    ]);

    // 9. Create FAQs & Articles
    console.log("Creating FAQs and articles...");
    await Faq.insertMany([
      {
        question: "How do video consultations work on Medicare?",
        answer: "Simply book an appointment, and at your scheduled time, enter the consultation room directly from your dashboard to connect with your doctor in HD encrypted video.",
        category: "Consultations",
        isPublished: true,
      },
      {
        question: "How are doctor credentials verified?",
        answer: "Every doctor is subjected to thorough manual and automated state council checks, medical degree validation, and background identity verification by Medicare clinical directors.",
        category: "Safety & Security",
        isPublished: true,
      },
      {
        question: "Can I download my digital prescription?",
        answer: "Yes, once your specialist completes the consultation, an official digitally-signed prescription is immediately accessible and downloadable in your Prescriptions portal.",
        category: "Prescriptions",
        isPublished: true,
      },
    ]);

    await HealthArticle.insertMany([
      {
        title: "Preventing Hypertension: 5 Daily Habits That Protect Your Heart",
        slug: "preventing-hypertension-5-daily-habits",
        summary: "Cardiologist recommendations for blood pressure control, sodium reduction, and stress moderation.",
        content: "High blood pressure is often symptomless until damage has accumulated. Daily aerobic exercise, potassium-rich nutrition, and monitoring sodium intake under 2,000mg/day drastically lower cardiovascular risk.",
        authorName: "Dr. Priya Sharma",
        category: "Cardiology",
        status: "published",
        isPublished: true,
      },
      {
        title: "Managing Eczema Flare-ups: Evidence-Based Skin Protocols",
        slug: "managing-eczema-flare-ups-skin-protocols",
        summary: "Gentle bathing regimens, ceramide moisturizers, and avoiding common household irritants.",
        content: "Eczema management requires consistent barrier repair. Apply ceramide-based ointments within 3 minutes of warm lukewarm baths and wear breathable cotton garments to avoid micro-trauma to the epidermis.",
        authorName: "Dr. Sneha Patel",
        category: "Dermatology",
        status: "published",
        isPublished: true,
      },
    ]);

    await Announcement.insertMany([
      {
        title: "Medicare 2.0 Live: Real-Time Specialist Portals",
        message: "We have upgraded our platform with seamless appointment booking, live audio/video consultation, and immediate digital prescriptions.",
        priority: "high",
        targetAudience: "all",
        isActive: true,
      },
    ]);

    // Create a live Consultation record
    console.log("Creating consultation...");
    await Consultation.create({
      appointmentId: appt1._id,
      doctorId: doctor1._id,
      doctorName: doctor1.name,
      patientId: patient1._id,
      patientName: patient1.name,
      consultationMode: "video",
      videoSession: {
        roomId: `room-video-${appt1._id}`,
        meetingUrl: `https://meet.medicare.internal/${appt1._id}`,
        status: "active",
        startedAt: today,
      },
      chatMessages: [
        {
          senderId: String(doctor1._id),
          senderRole: "doctor",
          senderName: doctor1.name,
          message: "Hello Aditi, I am reviewing your blood panel from yesterday.",
          sentAt: new Date(today.getTime() - 10 * 60 * 1000),
        },
        {
          senderId: String(patient1._id),
          senderRole: "patient",
          senderName: patient1.name,
          message: "Thank you Dr. Priya. The palpitations have been noticeably lower today.",
          sentAt: new Date(today.getTime() - 5 * 60 * 1000),
        },
      ],
      symptoms: ["Mild palpitations", "Normal fatigue"],
      diagnosis: "Post-viral Sinus Tachycardia - Improving",
      status: "in_progress",
    });

    // 10. System Settings & Audit Logs
    console.log("Creating system settings and audit logs...");
    await SystemSetting.insertMany([
      {
        key: "platform_name",
        value: "Medicare Healthcare Network",
        category: "general",
        description: "Official Medicare portal branding name",
      },
      {
        key: "maintenance_mode",
        value: false,
        category: "maintenance",
        description: "Toggle platform maintenance mode window",
      },
      {
        key: "commission_rate",
        value: 20,
        category: "payment",
        description: "Platform commission percentage per appointment",
      },
      {
        key: "session_timeout_mins",
        value: 120,
        category: "security",
        description: "Inactivity timeout before re-authentication",
      },
    ]);

    await AuditLog.insertMany([
      {
        actorId: String(adminUser._id),
        actorName: "Medicare Administrator",
        actorRole: "admin",
        action: "SYSTEM_INITIALIZATION",
        module: "system",
        details: { message: "Platform initialized and database seeded successfully." },
      },
      {
        actorId: String(adminUser._id),
        actorName: "Medicare Administrator",
        actorRole: "admin",
        action: "DOCTOR_VERIFICATION",
        module: "doctor",
        targetType: "Doctor",
        targetId: String(doctor1._id),
        details: { doctorName: "Dr. Priya Sharma", status: "approved" },
      },
    ]);

    // Create notifications for patient and doctor
    await Notification.insertMany([
      {
        title: "Appointment Confirmed",
        message: "Your video consultation with Dr. Priya Sharma is confirmed for today at 10:00 AM.",
        type: "appointment",
        recipientRole: "patient",
        recipientId: patUser1._id,
        patientId: patient1._id,
        isRead: false,
      },
      {
        title: "New Patient Scheduled",
        message: "Aditi Kapoor has booked a video consultation for today at 10:00 AM.",
        type: "appointment",
        recipientRole: "doctor",
        recipientId: docUser1._id,
        doctorId: doctor1._id,
        isRead: false,
      },
    ]);

    console.log("Database seeded successfully!");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exit(1);
  }
};

// Run if called directly
seedDatabase();
