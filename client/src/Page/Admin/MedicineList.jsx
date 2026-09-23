import React, { useState } from "react";
import { Search, Filter, Plus, Pill, AlertTriangle, CheckCircle, Trash2, Edit3, ShieldAlert } from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import AddMedicineModal from "../../components/panels/AddMedicineModal";
import { getMedicines, addMedicine, deleteMedicine } from "../../data/mockData";

export default function MedicineList() {
  const [medicines, setMedicines] = useState(getMedicines);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const categories = ["All", ...new Set(medicines.map((m) => m.category))];

  const handleAddMedicine = (newMed) => {
    const updated = addMedicine(newMed);
    setMedicines(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to remove this medicine from inventory?")) {
      const updated = deleteMedicine(id);
      setMedicines(updated);
    }
  };

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const totalStockUnits = medicines.reduce((sum, m) => sum + (Number(m.stock) || 0), 0);
  const lowStockCount = medicines.filter((m) => m.stock < 200).length;

  return (
    <PanelLayout
      role="admin"
      title="Pharmacy & Medicine Inventory"
      subtitle="Manage medicine catalog, add new pharmaceutical drugs, monitor stock thresholds, and review pricing."
    >
      <div className="space-y-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400">Total Medicine Brands</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">{medicines.length} Items</p>
              <p className="text-xs text-slate-500 mt-0.5">Across {categories.length - 1} therapeutic classes</p>
            </div>
            <div className="p-3 rounded-2xl bg-sky-50 text-sky-600">
              <Pill className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400">Total Units in Stock</span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{totalStockUnits.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-0.5">Central warehouse repository</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400">Low Stock Warnings</span>
              <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount} Drugs</p>
              <p className="text-xs text-slate-500 mt-0.5">Under 200 units remaining</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Search, Filter & Add Medicine CTA */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medicine brand, formula, manufacturer..."
              className="w-full pl-10 pr-4 py-2 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm ml-auto md:ml-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Medicine</span>
            </button>
          </div>
        </div>

        {/* Medicines Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Medicine Details</th>
                  <th className="px-6 py-4">Category & Form</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4">Manufacturer</th>
                  <th className="px-6 py-4">Rx Required</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredMedicines.map((med) => {
                  const isLow = med.stock < 200;
                  return (
                    <tr key={med.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                            <Pill className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{med.name}</p>
                            <p className="text-xs text-slate-400">{med.genericName || "Standard salt"}</p>
                            {med.strength && (
                              <span className="inline-block mt-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                {med.strength}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold text-slate-800">{med.category}</span>
                        <p className="text-xs text-slate-400">{med.form || "Tablet"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-900">{med.stock} units</span>
                        <div>
                          <span
                            className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isLow
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {isLow ? "Low Stock" : "In Stock"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-emerald-600">${med.unitPrice}</td>
                      <td className="px-6 py-4 text-xs text-slate-600">
                        {med.manufacturer || "Certified Pharma"}
                        {med.expiryDate && (
                          <span className="block text-[11px] text-slate-400">
                            Exp: {med.expiryDate}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {med.prescriptionRequired ? (
                          <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold text-[11px] border border-purple-200">
                            Rx Needed
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px]">
                            OTC
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(med.id)}
                          className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Medicine"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredMedicines.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <Pill className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-bold text-slate-700">No medicines found matching criteria.</p>
            <p className="text-xs text-slate-400 mt-1">Try another keyword or click "Add New Medicine".</p>
          </div>
        )}
      </div>

      {/* Add Medicine Modal */}
      <AddMedicineModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddMedicine={handleAddMedicine}
      />
    </PanelLayout>
  );
}
