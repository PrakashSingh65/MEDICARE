const escapePdfText = (value) =>
  String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, " ");

export const buildPrescriptionPdfBuffer = (prescription) => {
  const lines = [
    `MEDICARE - OFFICIAL MEDICAL PRESCRIPTION`,
    `Prescription No: ${prescription.prescriptionNumber || ""}`,
    `Issued Date: ${new Date(prescription.issuedAt || Date.now()).toISOString().split("T")[0]}`,
    `------------------------------------------------------------------------`,
    `Doctor: ${prescription.doctorName || ""} (${prescription.doctorSpecialty || "Specialist"})`,
    `Clinic/Hospital: ${prescription.clinicName || "Medicare Medical Center"}`,
    `Patient: ${prescription.patientName || ""} | Age: ${prescription.patientAge || "N/A"} | Gender: ${prescription.patientGender || "N/A"}`,
    `------------------------------------------------------------------------`,
    `Diagnosis: ${prescription.diagnosis || "General Consultation"}`,
    `Symptoms: ${Array.isArray(prescription.symptoms) && prescription.symptoms.length ? prescription.symptoms.join(", ") : "N/A"}`,
    `------------------------------------------------------------------------`,
    `PRESCRIBED MEDICINES:`,
  ];

  (prescription.medicines || []).forEach((med, index) => {
    lines.push(
      `${index + 1}. ${med.name} | Dosage: ${med.dosage} | Freq: ${med.frequency} | Duration: ${med.duration}`
    );
    if (med.instructions || med.timing || med.route) {
      lines.push(
        `   Route: ${med.route || "Oral"} | Timing: ${med.timing || "After Meal"} | Note: ${med.instructions || "-"}`
      );
    }
  });

  lines.push(`------------------------------------------------------------------------`);
  lines.push(`General Instructions: ${prescription.generalInstructions || "Follow standard dosage schedule."}`);
  lines.push(
    `Follow-up Date: ${
      prescription.followUpDate
        ? new Date(prescription.followUpDate).toISOString().split("T")[0]
        : "As needed"
    }`
  );

  const textOps = ["BT", "/F1 10 Tf", "50 770 Td", "14 TL"];
  lines.forEach((line, idx) => {
    if (idx === 0) {
      textOps.push(`(${escapePdfText(line)}) Tj`);
    } else {
      textOps.push(`T* (${escapePdfText(line)}) Tj`);
    }
  });
  textOps.push("ET");

  const streamContent = textOps.join("\n");
  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${Buffer.byteLength(streamContent, "utf8")} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += obj;
  }

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
};
