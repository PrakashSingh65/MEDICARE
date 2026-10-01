import Appointment from "../../model/appointment.model.js";
import { Transaction, DoctorPayout } from "../../model/payment.model.js";
import { resolveDoctorRecord } from "../../utils/doctorResolver.js";

export const getDoctorDashboard = async (req, res) => {
  try {
    const doctor = await resolveDoctorRecord(req, true);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor profile not found" });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [
      todayAppointmentsList,
      uniquePatients,
      completedConsultationsCount,
      pendingAppointmentsCount,
      revenueAggregation,
      payoutsSummary,
      monthlyAppointmentStats,
    ] = await Promise.all([
      Appointment.find({
        doctorId: doctor._id,
        appointmentDate: { $gte: startOfToday, $lte: endOfToday },
      }).sort({ timeSlot: 1 }),
      Appointment.distinct("patientId", { doctorId: doctor._id }),
      Appointment.countDocuments({ doctorId: doctor._id, status: "completed" }),
      Appointment.countDocuments({
        doctorId: doctor._id,
        status: { $in: ["pending", "scheduled", "confirmed", "accepted", "rescheduled"] },
      }),
      Transaction.aggregate([
        { $match: { doctorId: doctor._id, status: "completed" } },
        {
          $group: {
            _id: null,
            grossFeeCollected: { $sum: "$amount" },
            netDoctorRevenue: { $sum: "$doctorEarning" },
            transactionsCount: { $sum: 1 },
          },
        },
      ]),
      DoctorPayout.aggregate([
        { $match: { doctorId: doctor._id } },
        {
          $group: {
            _id: "$status",
            totalAmount: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Appointment.aggregate([
        { $match: { doctorId: doctor._id } },
        {
          $group: {
            _id: {
              year: { $year: "$appointmentDate" },
              month: { $month: "$appointmentDate" },
            },
            totalAppointments: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $in: ["$status", ["cancelled", "rejected"]] }, 1, 0] },
            },
            pending: {
              $sum: {
                $cond: [
                  {
                    $in: [
                      "$status",
                      ["pending", "scheduled", "confirmed", "accepted", "rescheduled"],
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            estimatedRevenue: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$fee", 0] },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 12 },
      ]),
    ]);

    const rev = revenueAggregation[0] || {
      grossFeeCollected: 0,
      netDoctorRevenue: 0,
      transactionsCount: 0,
    };

    return res.status(200).json({
      success: true,
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          specialty: doctor.specialty,
          department: doctor.department,
          registrationStatus: doctor.registrationStatus,
          isQualifiedVerified: doctor.isQualifiedVerified,
        },
        todayAppointments: {
          count: todayAppointmentsList.length,
          appointments: todayAppointmentsList,
        },
        totalPatients: uniquePatients.length,
        completedConsultations: completedConsultationsCount,
        pendingAppointments: pendingAppointmentsCount,
        revenue: {
          grossFeeCollected: rev.grossFeeCollected,
          netDoctorRevenue: rev.netDoctorRevenue,
          transactionsCount: rev.transactionsCount,
          payoutsSummary,
        },
        monthlyAppointmentStatistics: monthlyAppointmentStats,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
