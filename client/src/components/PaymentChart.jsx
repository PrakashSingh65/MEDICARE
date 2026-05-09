import React from "react";

export default function PaymentChart({ data, seriesLabel }) {
  const maxValue = Math.max(...data.map((item) => item.amount), 1);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Payment trend</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{seriesLabel}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-700">
          {data.length} points
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-500">highest</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">${Math.max(...data.map((item) => item.amount)).toLocaleString()}</p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.26em] text-slate-500">average</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">${Math.round(data.reduce((sum, item) => sum + item.amount, 0) / data.length).toLocaleString()}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-slate-100 p-4">
          <div className="flex items-end gap-3">
            {data.map((point) => {
              const height = (point.amount / maxValue) * 180;
              return (
                <div key={point.label} className="flex-1">
                  <div className="relative h-44">
                    <div
                      className="absolute bottom-0 w-full rounded-t-3xl bg-sky-600 transition-all duration-300"
                      style={{ height: `${Math.max(height, 16)}px` }}
                    />
                  </div>
                  <p className="mt-3 text-center text-xs font-medium text-slate-700">{point.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
