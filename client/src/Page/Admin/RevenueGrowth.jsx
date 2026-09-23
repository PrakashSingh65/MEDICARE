import React from "react";
import { TrendingUp, DollarSign, Users, Award, ArrowUpRight, BarChart2, CheckCircle2 } from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import GrowthAnalyticsChart from "../../components/panels/GrowthAnalyticsChart";
import { revenueGrowthStats, getDoctors } from "../../data/mockData";

export default function RevenueGrowth() {
  const doctors = getDoctors();

  const departmentRevenues = [
    { department: "Cardiology", revenue: 52400, growth: "+21.5%", cases: 280, share: 35 },
    { department: "General Medicine", revenue: 38900, growth: "+16.2%", cases: 410, share: 26 },
    { department: "Orthopedics", revenue: 26800, growth: "+14.0%", cases: 145, share: 18 },
    { department: "Dermatology", revenue: 18200, growth: "+19.8%", cases: 190, share: 12 },
    { department: "Pediatrics", revenue: 11950, growth: "+9.4%", cases: 160, share: 9 },
  ];

  return (
    <PanelLayout
      role="admin"
      title="Revenue Performance & Overall Growth"
      subtitle="Detailed financial audit, clinic utilization, revenue stream distribution, and long-term organizational growth metrics."
    >
      <div className="space-y-8">
        {/* Main Growth Analytics Component */}
        <GrowthAnalyticsChart />

        {/* Deep Dive Department Revenues */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Revenue by Clinical Specialty</h3>
                <p className="text-xs text-slate-500">Gross revenue generation ranked by department</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                All 5 Departments Positive
              </span>
            </div>

            <div className="space-y-4">
              {departmentRevenues.map((dept) => (
                <div key={dept.department} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{dept.department}</span>
                      <span className="text-xs text-slate-400 ml-2">({dept.cases} consultations)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 text-sm">${dept.revenue.toLocaleString()}</span>
                      <span className="text-xs font-semibold text-emerald-600 ml-2">{dept.growth}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      style={{ width: `${dept.share}%` }}
                      className="h-full rounded-full bg-sky-600 transition-all duration-500"
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Department share: {dept.share}%</span>
                    <span>Average per case: ${Math.round(dept.revenue / dept.cases)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Highlights Card */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-semibold backdrop-blur-xs mb-4">
                <TrendingUp className="w-3.5 h-3.5" />
                Strategic Target
              </div>
              <h3 className="text-xl font-bold text-white">Quarterly Growth Targets</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Medicare has achieved 118% of its annual clinical revenue target, spurred by strong doctor onboarding and digitized pharmacy delivery.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">Doctor Retention Rate</p>
                    <p className="text-slate-400">96.8% active specialists</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">Patient NPS Satisfaction</p>
                    <p className="text-slate-400">4.8 / 5.0 across all reviews</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">Pharmacy Fulfillment Time</p>
                    <p className="text-slate-400">Average under 45 minutes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-[11px] text-slate-400">
                Audited data updated live via Medicare Core Financial Ledger.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PanelLayout>
  );
}
