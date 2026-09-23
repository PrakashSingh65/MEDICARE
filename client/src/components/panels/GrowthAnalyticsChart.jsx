import React, { useState } from "react";
import { TrendingUp, DollarSign, Users, Activity, ShoppingBag, ArrowUpRight, Calendar } from "lucide-react";
import { revenueGrowthStats } from "../../data/mockData";

export default function GrowthAnalyticsChart() {
  const [metricType, setMetricType] = useState("revenue"); // "revenue" | "consultations" | "pharmacy" | "newPatients"
  const [period, setPeriod] = useState("monthly"); // "daily" | "monthly" | "yearly"

  const data = revenueGrowthStats.monthlyBreakdown;
  const maxValue = Math.max(...data.map((item) => item[metricType]), 1);

  const getMetricLabel = () => {
    switch (metricType) {
      case "revenue":
        return "Total Revenue ($)";
      case "consultations":
        return "Doctor Consultations Count";
      case "pharmacy":
        return "Pharmacy Medicine Sales ($)";
      case "newPatients":
        return "New Patient Signups";
      default:
        return "Metric";
    }
  };

  const formatValue = (val) => {
    if (metricType === "revenue" || metricType === "pharmacy") {
      return `$${val.toLocaleString()}`;
    }
    return val.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Top Growth & Revenue KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Total Platform Revenue</span>
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              ${revenueGrowthStats.totalRevenue.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {revenueGrowthStats.revenueGrowthRate}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Overall growth across all clinics & pharmacy</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Patient Base Growth</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {revenueGrowthStats.totalPatients.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              {revenueGrowthStats.patientGrowthRate}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">+138 new active patients registered this month</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Monthly Consultations</span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {revenueGrowthStats.consultationsThisMonth.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
              +14.8%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Doctor appointments completed</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold uppercase tracking-wider">Pharmacy Sales</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <ShoppingBag className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900">
              {revenueGrowthStats.medicineDispensedThisMonth.toLocaleString()}
            </span>
            <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              +22.1%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Units of medicine dispensed & delivered</p>
        </div>
      </div>

      {/* Main Growth Chart Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-sky-600">Overall Growth Analytics</span>
              <span className="text-xs text-slate-400">• Real-Time Performance</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              Financial & Clinical Growth Trajectory
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Compare revenue, doctor visits, and patient acquisition month-over-month.
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setMetricType("revenue")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                metricType === "revenue"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Revenue ($)
            </button>
            <button
              onClick={() => setMetricType("consultations")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                metricType === "consultations"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Consultations
            </button>
            <button
              onClick={() => setMetricType("pharmacy")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                metricType === "pharmacy"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Pharmacy
            </button>
            <button
              onClick={() => setMetricType("newPatients")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                metricType === "newPatients"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              New Patients
            </button>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="bg-slate-50/70 p-6 rounded-2xl border border-slate-100">
          <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Displaying: {getMetricLabel()}</span>
            <span>Peak Month: Dec ({formatValue(maxValue)})</span>
          </div>

          <div className="flex items-end gap-2 sm:gap-4 h-56 pt-6">
            {data.map((item) => {
              const val = item[metricType];
              const heightPercent = Math.max((val / maxValue) * 100, 12);
              const isPeak = val === maxValue;
              return (
                <div key={item.month} className="flex-1 flex flex-col items-center group relative">
                  {/* Hover tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg shadow-md whitespace-nowrap transition-opacity pointer-events-none z-10">
                    {item.month}: {formatValue(val)}
                  </div>

                  <div className="w-full flex justify-center h-44 items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[38px] rounded-t-xl transition-all duration-500 group-hover:brightness-95 ${
                        isPeak
                          ? "bg-gradient-to-t from-sky-600 to-indigo-600 shadow-sm"
                          : "bg-sky-500/80 group-hover:bg-sky-600"
                      }`}
                    />
                  </div>
                  <span className="mt-2 text-[11px] font-semibold text-slate-600 group-hover:text-slate-900">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Distribution breakdown */}
        <div className="pt-4 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
            Revenue Streams Breakdown (% of Overall Gross Income)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {revenueGrowthStats.revenueStreams.map((stream) => (
              <div key={stream.source} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{stream.source}</span>
                  <span className="font-bold text-slate-900">{stream.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    style={{ width: `${stream.percentage}%` }}
                    className={`h-full rounded-full ${stream.color}`}
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium">${stream.amount.toLocaleString()} earned</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
