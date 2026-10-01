import React, { useState } from "react";
import {
  Settings,
  Shield,
  FileText,
  Bell,
  Sliders,
  BarChart3,
  Check,
  CheckCircle2,
  AlertTriangle,
  Download,
  Search,
  Filter,
  RefreshCw,
  Lock,
  Globe,
  Mail,
  Phone,
  Server,
  Save,
  Users,
} from "lucide-react";
import PanelLayout from "../../components/panels/PanelLayout";
import {
  getAdminSystem,
  saveAdminSystem,
  updateSystemSettings,
  addAuditLog,
} from "../../data/adminMockData";

export default function SystemManagement() {
  const [systemData, setSystemData] = useState(getAdminSystem);
  const [activeTab, setActiveTab] = useState("roles");

  const [auditSearch, setAuditSearch] = useState("");
  const [auditSeverity, setAuditSeverity] = useState("All");

  const [settingsForm, setSettingsForm] = useState(systemData.settings || {});
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState("");

  const roles = systemData.roles || [];
  const auditLogs = systemData.auditLogs || [];
  const templates = systemData.notificationTemplates || [];
  const reports = systemData.reports || [];

  const handleTogglePermission = (roleId, module, permKey) => {
    const updatedRoles = roles.map((role) => {
      if (role.id !== roleId) return role;
      const currentModPerms = role.permissions[module] || { view: false, edit: false, delete: false };
      return {
        ...role,
        permissions: {
          ...role.permissions,
          [module]: {
            ...currentModPerms,
            [permKey]: !currentModPerms[permKey],
          },
        },
      };
    });
    const updated = { ...systemData, roles: updatedRoles };
    saveAdminSystem(updated);
    setSystemData(updated);
  };

  const handleToggleTemplate = (templateId) => {
    const updatedTemplates = templates.map((tmpl) =>
      tmpl.id === templateId ? { ...tmpl, active: !tmpl.active } : tmpl
    );
    const updated = { ...systemData, notificationTemplates: updatedTemplates };
    saveAdminSystem(updated);
    setSystemData(updated);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const updated = updateSystemSettings(settingsForm);
    setSystemData(updated);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  const handleDownloadReport = (reportTitle) => {
    setDownloadSuccess(`Generated and downloaded ${reportTitle}`);
    setTimeout(() => setDownloadSuccess(""), 4000);
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.module.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.detail.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesSeverity =
      auditSeverity === "All" || log.severity === auditSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <PanelLayout
      role="admin"
      title="System Management"
      subtitle="Role-based permissions matrix, security audit logs, notification templates, enterprise settings, and compliance reporting."
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab("roles")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === "roles"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Roles & Permissions ({roles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === "audit"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Audit Logs ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === "notifications"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notification Management ({templates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === "settings"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>System Settings</span>
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
              activeTab === "reports"
                ? "bg-purple-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Reports & Analytics ({reports.length})</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {activeTab === "roles" && (
          <div className="space-y-6">
            {roles.map((role) => (
              <div
                key={role.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-slate-900 text-base">{role.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        {role.userCount} assigned users
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{role.description}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">{role.id}</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5 rounded-l-xl">Module</th>
                        <th className="px-4 py-2.5 text-center">View / Read</th>
                        <th className="px-4 py-2.5 text-center">Create / Edit</th>
                        <th className="px-4 py-2.5 text-center rounded-r-xl">Delete / Void</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {["dashboard", "doctors", "patients", "appointments", "payments", "content", "system"].map((mod) => {
                        const perms = role.permissions[mod] || { view: false, edit: false, delete: false };
                        return (
                          <tr key={mod} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 capitalize font-bold text-slate-900">{mod}</td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={perms.view}
                                onChange={() => handleTogglePermission(role.id, mod, "view")}
                                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={perms.edit}
                                onChange={() => handleTogglePermission(role.id, mod, "edit")}
                                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={perms.delete}
                                onChange={() => handleTogglePermission(role.id, mod, "delete")}
                                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600 cursor-pointer"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "audit" && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Search user, action, module, or detail..."
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-bold">Severity:</span>
                <select
                  value={auditSeverity}
                  onChange={(e) => setAuditSeverity(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                >
                  <option value="All">All Levels</option>
                  <option value="success">Success</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Timestamp</th>
                      <th className="px-6 py-4">Actor & Role</th>
                      <th className="px-6 py-4">Action</th>
                      <th className="px-6 py-4">Module</th>
                      <th className="px-6 py-4">Detail & Context</th>
                      <th className="px-6 py-4">IP Address</th>
                      <th className="px-6 py-4 text-right">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                        <td className="px-6 py-4 text-xs">
                          <p className="font-extrabold text-slate-900 leading-snug">{log.user}</p>
                          <p className="text-[11px] text-slate-400 font-medium">{log.role}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 text-xs">{log.action}</td>
                        <td className="px-6 py-4 text-xs font-semibold text-purple-700">{log.module}</td>
                        <td className="px-6 py-4 text-xs text-slate-600 max-w-sm">{log.detail}</td>
                        <td className="px-6 py-4 text-xs font-mono text-slate-500">{log.ip}</td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                              log.severity === "success"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : log.severity === "warning"
                                ? "bg-amber-100 text-amber-800 border-amber-200"
                                : log.severity === "critical"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-sky-100 text-sky-800 border-sky-200"
                            }`}
                          >
                            {log.severity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 uppercase">
                        {tmpl.channel}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          tmpl.active
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {tmpl.active ? "Trigger Active" : "Disabled"}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-snug">{tmpl.name}</h4>
                    <p className="text-xs font-mono text-purple-700 mt-0.5">event: {tmpl.trigger}</p>
                    <p className="text-xs font-bold text-slate-800 mt-2">Subject: {tmpl.subject}</p>
                    <p className="text-xs text-slate-500 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed font-mono">
                      {tmpl.body}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Automated Dispatch</span>
                    <button
                      onClick={() => handleToggleTemplate(tmpl.id)}
                      className="font-bold text-purple-600 hover:underline"
                    >
                      {tmpl.active ? "Disable Trigger" : "Enable Trigger"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">Hospital & Platform Settings</h3>
                <p className="text-xs text-slate-400">Core operational configuration and security policies</p>
              </div>
              {settingsSaved && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  Settings saved successfully
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Health Network Name</label>
                <input
                  type="text"
                  value={settingsForm.hospitalName || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hospitalName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Official Support Email</label>
                <input
                  type="email"
                  value={settingsForm.supportEmail || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, supportEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Emergency 24/7 Hotline</label>
                <input
                  type="text"
                  value={settingsForm.emergencyHotline || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, emergencyHotline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Platform Currency</label>
                <input
                  type="text"
                  value={settingsForm.currency || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, currency: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Session Timeout (Minutes)</label>
                <input
                  type="number"
                  value={settingsForm.sessionTimeoutMinutes || 60}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sessionTimeoutMinutes: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1">Automated Cloud Backup</label>
                <input
                  type="text"
                  value={settingsForm.dataBackupSchedule || ""}
                  onChange={(e) => setSettingsForm({ ...settingsForm, dataBackupSchedule: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!settingsForm.enableTwoFactor}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enableTwoFactor: e.target.checked })}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
                  />
                  <span>Enforce Two-Factor Authentication</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-bold text-red-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!settingsForm.maintenanceMode}
                    onChange={(e) => setSettingsForm({ ...settingsForm, maintenanceMode: e.target.checked })}
                    className="w-4 h-4 rounded text-red-600 focus:ring-red-500 accent-red-600"
                  />
                  <span>Maintenance Mode (Emergency Lockdown)</span>
                </label>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save System Settings</span>
              </button>
            </div>
          </form>
        )}

        {activeTab === "reports" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Analytical & Compliance Reports</h3>
                <p className="text-xs text-slate-400">Download HIPAA, fiscal audit, and clinical activity summaries</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Report Title</th>
                    <th className="px-6 py-4">Classification</th>
                    <th className="px-6 py-4">Frequency</th>
                    <th className="px-6 py-4">Last Generated</th>
                    <th className="px-6 py-4">File Format & Size</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-extrabold text-slate-900 text-xs">{rep.title}</td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 uppercase">
                          {rep.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-700">{rep.frequency}</td>
                      <td className="px-6 py-4 text-xs font-mono text-slate-500">{rep.lastGenerated}</td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-600">
                        {rep.format} • {rep.size}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDownloadReport(rep.title)}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 text-xs font-bold transition inline-flex items-center gap-1 shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </PanelLayout>
  );
}
