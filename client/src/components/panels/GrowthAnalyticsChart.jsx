import React, { useState } from "react";
import {
  TrendingUp,
  DollarSign,
  Users,
  Activity,
  ShoppingBag,
  ArrowUpRight,
  Calendar,
  Sparkles,
  BarChart3,
  PieChart,
} from "lucide-react";
import { revenueGrowthStats } from "../../data/mockData";

export default function GrowthAnalyticsChart() {
  const [metricType, setMetricType] = useState("revenue"); // "revenue" | "consultations" | "pharmacy" | "newPatients"
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const data = revenueGrowthStats.monthlyBreakdown;
  const maxValue = Math.max(...data.map((item) => item[metricType]), 1);

  const getMetricDetails = () => {
    switch (metricType) {
      case "revenue":
        return { label: "Total Revenue", unit: "$", color: "from-sky-500 to-indigo-600" };
      case "consultations":
        return { label: "Doctor Consultations", unit: "", color: "from-emerald-500 to-teal-600" };
      case "pharmacy":
        return { label: "Pharmacy Sales", unit: "$", color: "from-purple-500 to-indigo-600" };
      case "newPatients":
        return { label: "New Patients Registered", unit: "", color: "from-amber-500 to-orange-600" };
      default:
        return { label: "Performance", unit: "", color: "from-sky-500 to-blue-600" };
    }
  };

  const details = getMetricDetails();

  const formatValue = (val) => {
    if (metricType === "revenue" || metricType === "pharmacy") {
      return `$${val.toLocaleString()}`;
    }
    return val.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Top Level Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-slate-400">Total Platform Revenue</span>
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              ${revenueGrowthStats.totalRevenue.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {revenueGrowthStats.revenueGrowthRate}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span>Quarterly Growth</span>
            <span className="font-bold text-slate-800">+$23,450 vs Q3</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Patient Base Growth */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-slate-400">Patient Population</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {revenueGrowthStats.totalPatients.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {revenueGrowthStats.patientGrowthRate}
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span>New Enrollees</span>
            <span className="font-bold text-slate-800">+138 This Month</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Monthly Consultations */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-slate-400">Consultation Volume</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {revenueGrowthStats.consultationsThisMonth.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200/60">
              +14.8%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span>Active Specialists</span>
            <span className="font-bold text-slate-800">24 On Duty</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Pharmacy Dispensed */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 group relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="font-extrabold uppercase tracking-wider text-slate-400">Pharmacy Dispensing</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {revenueGrowthStats.medicineDispensedThisMonth.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200/60">
              +22.1%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100 pt-2.5">
            <span>Prescription Fulfill</span>
            <span className="font-bold text-slate-800">99.4% Rate</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Main Interactive Chart Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
                Dynamic Growth Visualization
              </span>
              <span className="text-xs text-slate-400">• MoM Analytics</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              {details.label} Trajectory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking of multi-clinic activity, telemedicine sessions, and pharmacy revenue.
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              onClick={() => setMetricType("revenue")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                metricType === "revenue"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Revenue</span>
            </button>

            <button
              onClick={() => setMetricType("consultations")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                metricType === "consultations"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Consults</span>
            </button>

            <button
              onClick={() => setMetricType("pharmacy")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                metricType === "pharmacy"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Pharmacy</span>
            </button>

            <button
              onClick={() => setMetricType("newPatients")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                metricType === "newPatients"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Patients</span>
            </button>
          </div>
        </div>

        {/* Visual Modern Gradient Bar Chart */}
        <div className="bg-slate-50/80 p-6 sm:p-8 rounded-3xl border border-slate-200/80">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-6 font-semibold">
            <span>Annual Trend (January – December)</span>
            <span className="flex items-center gap-1 font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
              <Sparkles className="w-3.5 h-3.5" />
              Peak: Dec ({formatValue(maxValue)})
            </span>
          </div>

          <div className="flex items-end gap-2 sm:gap-3 md:gap-4 h-60 pt-6">
            {data.map((item) => {
              const val = item[metricType];
              const heightPercent = Math.max((val / maxValue) * 100, 10);
              const isPeak = val === maxValue;
              const isHovered = hoveredMonth === item.month;

              return (
                <div
                  key={item.month}
                  onMouseEnter={() => setHoveredMonth(item.month)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className="flex-1 flex flex-col items-center group relative cursor-pointer"
                >
                  {/* Floating Tooltip */}
                  <div
                    className={`absolute -top-12 z-20 pointer-events-none transition-all duration-200 ${
                      isHovered
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95"
                    }`}
                  >
                    <div className="bg-slate-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap border border-slate-700 flex items-center gap-1.5">
                      <span>{item.month}:</span>
                      <span className="text-sky-300">{formatValue(val)}</span>
                    </div>
                  </div>

                  {/* Bar Column */}
                  <div className="w-full flex justify-center h-48 items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[42px] rounded-t-2xl transition-all duration-300 ${
                        isPeak
                          ? "bg-gradient-to-t from-sky-600 via-indigo-600 to-purple-600 shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/50"
                          : `bg-gradient-to-t ${details.color} opacity-85 group-hover:opacity-100 group-hover:scale-y-105`
                      }`}
                    />
                  </div>

                  <span
                    className={`mt-2.5 text-[11px] font-bold transition ${
                      isHovered || isPeak ? "text-slate-900 font-extrabold" : "text-slate-400"
                    }`}
                  >
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Streams Distribution Cards */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-sky-600" />
              <span>Revenue Distribution by Health Channel</span>
            </h4>
            <span className="text-xs text-slate-400 font-medium">Verified Fiscal Data</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {revenueGrowthStats.revenueStreams.map((stream) => (
              <div
                key={stream.source}
                className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:shadow-xs transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${stream.color}`} />
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{stream.source}</span>
                  </div>
                  <span className="font-black text-slate-900 text-sm">{stream.percentage}%</span>
                </div>

                <div className="w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    style={{ width: `${stream.percentage}%` }}
                    className={`h-full rounded-full ${stream.color} transition-all duration-700`}
                  />
                </div>

                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Gross Share</span>
                  <span className="font-extrabold text-slate-800">${stream.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
