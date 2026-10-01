// server/scripts/test_integration.mjs
const BASE_URL = "http://localhost:5000";

async function post(url, data, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error(`POST ${url} [${res.status}]:`, text.slice(0, 150));
    return { success: false, status: res.status };
  }
}

async function get(url, token = null) {
  const headers = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${url}`, { headers });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error(`GET ${url} [${res.status}]:`, text.slice(0, 150));
    return { success: false, status: res.status };
  }
}

async function patch(url, data, token = null) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${url}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(data),
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    console.error(`PATCH ${url} [${res.status}]:`, text.slice(0, 150));
    return { success: false, status: res.status };
  }
}

async function runTests() {
  console.log("=== Medicare Integration Test Suite ===");

  // 1. Admin Login
  console.log("\n1. Testing Admin Authentication...");
  const adminLogin = await post("/api/v1/user/login", {
    email: "admin@medicare.com",
    password: "password123",
  });
  console.log("Admin Login Result:", adminLogin.success ? "SUCCESS" : "FAILED", adminLogin.message || "");
  const adminToken = adminLogin.token;

  if (adminToken) {
    const adminStats = await get("/api/v1/admin/dashboard/stats", adminToken);
    console.log("Admin Dashboard Stats:", adminStats.success ? "SUCCESS" : "FAILED", adminStats.data ? `Total Users: ${adminStats.data.totalUsers}, Total Doctors: ${adminStats.data.totalDoctors}` : "");

    const adminDoctors = await get("/api/v1/admin/doctors", adminToken);
    console.log("Admin Doctors Count:", adminDoctors.data?.length || 0);

    const adminPatients = await get("/api/v1/admin/patients", adminToken);
    console.log("Admin Patients Count:", adminPatients.data?.length || 0);
  }

  // 2. Doctor Login
  console.log("\n2. Testing Doctor Authentication...");
  const docLogin = await post("/api/v1/user/login", {
    email: "doctor@medicare.com",
    password: "password123",
  });
  console.log("Doctor Login Result:", docLogin.success ? "SUCCESS" : "FAILED", docLogin.message || "");
  const docToken = docLogin.token;

  let doctorId = null;
  if (docToken) {
    const docProfile = await get("/api/v1/doctor/profile", docToken);
    console.log("Doctor Profile:", docProfile.success ? "SUCCESS" : "FAILED", docProfile.data?.name, `(${docProfile.data?.specialty})`);
    doctorId = docProfile.data?._id;

    const docAppointments = await get("/api/v1/doctor/appointments", docToken);
    console.log("Doctor Appointments Count:", docAppointments.data?.length || 0);
  }

  // 3. Patient Login
  console.log("\n3. Testing Patient Authentication...");
  const patLogin = await post("/api/v1/user/login", {
    email: "patient@medicare.com",
    password: "password123",
  });
  console.log("Patient Login Result:", patLogin.success ? "SUCCESS" : "FAILED", patLogin.message || "");
  const patToken = patLogin.token;

  if (patToken) {
    const patProfile = await get("/api/v1/patient/profile", patToken);
    console.log("Patient Profile:", patProfile.success ? "SUCCESS" : "FAILED", patProfile.data?.name);

    const availableDoctors = await get("/api/v1/patient/doctors", patToken);
    console.log("Patient Directory Doctors Count:", availableDoctors.data?.length || 0);

    const targetDocId = doctorId || availableDoctors.data?.[0]?._id;
    console.log("Target Doctor ID for booking:", targetDocId);

    // 4. Patient books appointment with Doctor
    console.log("\n4. Testing Patient Appointment Booking...");
    const bookResult = await post("/api/v1/patient/appointments", {
      doctorId: targetDocId,
      appointmentDate: new Date(Date.now() + 86400000).toISOString(),
      timeSlot: "11:30 AM",
      consultationType: "video",
      reasonForVisit: "Integration test consultation for seasonal allergies",
    }, patToken);
    console.log("Booking Result:", bookResult.success ? "SUCCESS" : "FAILED", bookResult.message || "", "Appointment ID:", bookResult.data?._id);

    const newAptId = bookResult.data?._id;

    // 5. Doctor views and accepts appointment
    if (newAptId && docToken) {
      console.log("\n5. Testing Doctor Appointment Confirmation...");
      const respondResult = await patch(`/api/v1/doctor/appointments/${newAptId}/respond`, {
        action: "accept",
      }, docToken);
      console.log("Doctor Respond Result:", respondResult.success ? "SUCCESS" : "FAILED", "Status:", respondResult.data?.status);
    }

    // 6. Doctor writes prescription for patient
    if (docToken && patProfile.data?._id) {
      console.log("\n6. Testing Doctor Prescription Creation...");
      const rxResult = await post("/api/v1/doctor/prescriptions", {
        patientId: patProfile.data._id,
        patientName: patProfile.data.name,
        diagnosis: "Seasonal Allergic Rhinitis",
        medicines: [
          { name: "Levocetirizine", dosage: "5mg", frequency: "0-0-1", duration: "7 days", instructions: "Take at night" },
          { name: "Fluticasone Nasal Spray", dosage: "50mcg", frequency: "1 spray daily", duration: "14 days", instructions: "Morning" }
        ],
        generalInstructions: "Keep windows closed during high pollen count. Stay well hydrated.",
        followUpDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      }, docToken);
      console.log("Doctor Prescription Result:", rxResult.success ? "SUCCESS" : "FAILED", "Prescription #:", rxResult.data?.prescriptionNumber);
    }

    // 7. Patient views prescriptions
    console.log("\n7. Testing Patient Fetching Prescriptions...");
    const patPrescriptions = await get("/api/v1/patient/prescriptions", patToken);
    console.log("Patient Prescriptions Count:", patPrescriptions.data?.length || 0);
  }

  console.log("\n=== Integration Test Suite Completed ===");
}

runTests().catch(console.error);
