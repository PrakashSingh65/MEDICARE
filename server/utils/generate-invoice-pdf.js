const escapePdfText = (value) =>
  String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, " ");

export const buildInvoicePdfBuffer = (transaction) => {
  const lines = [
    `MEDICARE - OFFICIAL PAYMENT INVOICE & RECEIPT`,
    `Invoice No: INV-${transaction.transactionReference || transaction._id}`,
    `Transaction Reference: ${transaction.transactionReference || ""}`,
    `Date: ${new Date(transaction.paidAt || transaction.createdAt || Date.now()).toISOString().split("T")[0]}`,
    `------------------------------------------------------------------------`,
    `Patient Name: ${transaction.patientName || ""}`,
    `Doctor Name: ${transaction.doctorName || ""}`,
    `Payment Method: ${String(transaction.paymentMethod || "upi").toUpperCase()}`,
    `Payment Status: ${String(transaction.status || "completed").toUpperCase()}`,
    `------------------------------------------------------------------------`,
    `Amount Paid: ${transaction.currency || "INR"} ${Number(transaction.amount || 0).toFixed(2)}`,
  ];

  if (transaction.refund?.isRefunded) {
    lines.push(
      `Refund Status: REFUNDED (${transaction.currency || "INR"} ${Number(
        transaction.refund.refundAmount || 0
      ).toFixed(2)})`
    );
    lines.push(`Refund Reference: ${transaction.refund.refundReference || ""}`);
  }

  lines.push(`------------------------------------------------------------------------`);
  lines.push(`Thank you for choosing Medicare Healthcare Platform.`);

  const textOps = ["BT", "/F1 10 Tf", "50 760 Td", "15 TL"];
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
