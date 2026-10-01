import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Calendar,
  Pill,
  CreditCard,
  MessageSquare,
  CheckCircle2,
  Check,
  Filter,
  Trash2,
  Clock,
  Sparkles,
  ArrowRight
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import {
  getPatientNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from "../../data/patientMockData";

export default function PatientNotifications() {
  const [notifications, setNotifications] = useState(getPatientNotifications);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => {
    const updated = markNotificationAsRead(id);
    setNotifications([...updated]);
  };

  const handleMarkAll = () => {
    const updated = markAllNotificationsAsRead();
    setNotifications([...updated]);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (selectedCategory === "all") return true;
    return n.category === selectedCategory;
  });

  const getCategoryMeta = (category) => {
    switch (category) {
      case "appointment":
        return {
          icon: Calendar,
          label: "Appointment Reminder",
          color: "text-sky-600 bg-sky-50 border-sky-200",
          link: "/patient/appointments",
          linkText: "View Appointments"
        };
      case "prescription":
        return {
          icon: Pill,
          label: "Prescription Alert",
          color: "text-purple-600 bg-purple-50 border-purple-200",
          link: "/patient/prescriptions",
          linkText: "View Prescription"
        };
      case "payment":
        return {
          icon: CreditCard,
          label: "Payment & Invoice",
          color: "text-emerald-600 bg-emerald-50 border-emerald-200",
          link: "/patient/payments",
          linkText: "View Receipt"
        };
      case "message":
        return {
          icon: MessageSquare,
          label: "Doctor Message",
          color: "text-amber-600 bg-amber-50 border-amber-200",
          link: "/patient/consultation",
          linkText: "Open Chat"
        };
      default:
        return {
          icon: Bell,
          label: "General Notice",
          color: "text-slate-600 bg-slate-50 border-slate-200",
          link: "/patient",
          linkText: "View Dashboard"
        };
    }
  };

  return (
    <PanelLayout
      role="patient"
      title="Notifications & Clinical Alerts"
      subtitle="Direct updates on upcoming appointment schedules, pharmacy refill dispatches, billing invoices, and physician chat communications."
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center relative">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="w-3 h-3 rounded-full bg-rose-500 border-2 border-white absolute top-2 right-2" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-base">Inbox & Clinical Alerts</h3>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {unreadCount} Unread
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {notifications.length} total notifications recorded
              </p>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="px-4 py-2 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition self-start sm:self-center"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Mark All as Read</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Category:
          </span>

          {[
            { id: "all", label: "All Notifications" },
            { id: "appointment", label: "Appointment Reminders" },
            { id: "prescription", label: "Prescriptions" },
            { id: "payment", label: "Payments" },
            { id: "message", label: "Doctor Messages" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                selectedCategory === cat.id
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              No notifications found in this category.
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const meta = getCategoryMeta(notif.category);
              const Icon = meta.icon;

              return (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                  className={`bg-white rounded-3xl border p-5 shadow-xs transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                    !notif.read
                      ? "border-sky-300 ring-1 ring-sky-100 bg-sky-50/20"
                      : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${meta.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {meta.label}
                        </span>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-sky-600" />
                        )}
                        <span className="text-[11px] text-slate-400 font-semibold">• {notif.timestamp}</span>
                      </div>

                      <h4 className="font-extrabold text-slate-900 text-sm">{notif.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-xl">{notif.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <Link
                      to={meta.link}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      <span>{meta.linkText}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>

                    {!notif.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notif.id);
                        }}
                        className="p-1.5 rounded-xl hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </PanelLayout>
  );
}
