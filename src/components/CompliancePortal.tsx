import React, { useState } from "react";
import { 
  ShieldCheck, 
  ChevronLeft, 
  Lock, 
  Key, 
  Send, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  Paperclip,
  Check,
  Eye,
  Settings,
  History,
  FolderOpen
} from "lucide-react";

export interface TimelineEntry {
  date: string;
  title: string;
  description: string;
  by: string;
}

export interface MessageEntry {
  id: string;
  sender: "Compliance Officer" | "Anonymous Reporter";
  text: string;
  date: string;
}

export interface ComplianceReport {
  id: string; // e.g. COM-2026-X7R9
  category: string; // "Financial Misconduct" | "Harassment/Discrimination" | "Safety Violation" | "Conflict of Interest" | "Policy Breach" | "Other"
  description: string;
  incidentDate: string;
  department: string;
  office: string;
  dateSubmitted: string;
  status: "Pending Review" | "Under Investigation" | "Action Taken" | "Dismissed" | "Closed";
  hasEvidence: boolean;
  timeline: TimelineEntry[];
  messages: MessageEntry[];
}

interface CompliancePortalProps {
  office: string;
  theme: "light" | "dark";
  onBack: () => void;
  complianceReports: ComplianceReport[];
  onAddComplianceReport: (report: ComplianceReport) => void;
  onUpdateComplianceReport: (report: ComplianceReport) => void;
}

export default function CompliancePortal({
  office,
  theme,
  onBack,
  complianceReports,
  onAddComplianceReport,
  onUpdateComplianceReport
}: CompliancePortalProps) {
  const [role, setRole] = useState<"select" | "reporter" | "officer">("select");
  const [reporterSubTab, setReporterSubTab] = useState<"submit" | "track">("submit");
  
  // Whistleblower Submission Form State
  const [category, setCategory] = useState("Financial Misconduct");
  const [department, setDepartment] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Tracking State
  const [trackingKey, setTrackingKey] = useState("");
  const [trackedReport, setTrackedReport] = useState<ComplianceReport | null>(null);
  const [trackingError, setTrackingError] = useState("");
  const [whistleblowerReply, setWhistleblowerReply] = useState("");

  // Officer Admin State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [officerReply, setOfficerReply] = useState("");
  
  // Officer logs/timeline update state
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineDesc, setTimelineDesc] = useState("");
  const [addingLog, setAddingLog] = useState(false);

  // Styling colors
  const isDark = theme === "dark";
  const C = {
    red: "#DC2626",
    redLight: isDark ? "rgba(220, 38, 38, 0.15)" : "#FEF2F2",
    redText: isDark ? "#F87171" : "#B91C1C",
    bg: isDark ? "#0F172A" : "#F4F5F7",
    card: isDark ? "#1E293B" : "#FFFFFF",
    border: isDark ? "#334155" : "#E4E7ED",
    text: isDark ? "#F8FAFC" : "#181C25",
    textSub: isDark ? "#94A3B8" : "#515A70",
    textMuted: isDark ? "#64748B" : "#9AA0B4",
    green: "#10B981",
    greenLight: isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5",
    greenText: isDark ? "#34D399" : "#047857",
    amber: "#F59E0B",
    amberLight: isDark ? "rgba(245, 158, 11, 0.15)" : "#FEF3C7",
    amberText: isDark ? "#FBBF24" : "#B45309"
  };

  const handleWhistleblowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description) return;
    setSubmitting(true);

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let keyRandom = "";
    for (let i = 0; i < 4; i++) {
      keyRandom += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const reportId = `COM-2026-${keyRandom}`;

    const newReport: ComplianceReport = {
      id: reportId,
      category,
      description,
      incidentDate: incidentDate || "Unknown Date",
      department: department || "General / Corporate",
      office,
      dateSubmitted: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      status: "Pending Review",
      hasEvidence: uploadedFiles.length > 0,
      timeline: [
        {
          date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
          title: "Anonymous Submission Received",
          description: "Report safely logged through high-security gateway. Case access key generated.",
          by: "Compliance Integrity Engine"
        }
      ],
      messages: []
    };

    setTimeout(() => {
      onAddComplianceReport(newReport);
      setSubmitting(false);
      setGeneratedKey(reportId);
      // Clean up form
      setDepartment("");
      setIncidentDate("");
      setDescription("");
      setUploadedFiles([]);
    }, 1000);
  };

  const handleTrackReport = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError("");
    const report = complianceReports.find(r => r.id.trim().toUpperCase() === trackingKey.trim().toUpperCase());
    
    if (report) {
      setTrackedReport(report);
    } else {
      setTrackingError("Invalid access key. Please double-check formatting (e.g., COM-2026-N2B9).");
      setTrackedReport(null);
    }
  };

  const handleSendWhistleblowerReply = (report: ComplianceReport) => {
    if (!whistleblowerReply.trim()) return;

    const newMsg: MessageEntry = {
      id: `msg-${Date.now()}`,
      sender: "Anonymous Reporter",
      text: whistleblowerReply,
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short" }) + " " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };

    const updatedReport: ComplianceReport = {
      ...report,
      messages: [...report.messages, newMsg]
    };

    onUpdateComplianceReport(updatedReport);
    setTrackedReport(updatedReport);
    setWhistleblowerReply("");
  };

  const handleOfficerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "compliance123" || pinInput === "admin") {
      setIsAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Invalid compliance pin code. For testing, use PIN 'compliance123'.");
    }
  };

  const handleSendOfficerReply = (report: ComplianceReport) => {
    if (!officerReply.trim()) return;

    const newMsg: MessageEntry = {
      id: `msg-${Date.now()}`,
      sender: "Compliance Officer",
      text: officerReply,
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short" }) + " " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };

    const updatedReport: ComplianceReport = {
      ...report,
      messages: [...report.messages, newMsg]
    };

    onUpdateComplianceReport(updatedReport);
    setOfficerReply("");
  };

  const handleUpdateOfficerStatus = (report: ComplianceReport, newStatus: ComplianceReport["status"]) => {
    const todayStr = new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    const timelineNote = `Investigation status updated to: ${newStatus}`;

    const newTimeline: TimelineEntry = {
      date: todayStr,
      title: "Status Update",
      description: timelineNote,
      by: "Compliance Board Officer"
    };

    const updatedReport: ComplianceReport = {
      ...report,
      status: newStatus,
      timeline: [...report.timeline, newTimeline]
    };

    onUpdateComplianceReport(updatedReport);
  };

  const handleAddTimelineLog = (report: ComplianceReport) => {
    if (!timelineTitle.trim() || !timelineDesc.trim()) return;
    const todayStr = new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });

    const newLog: TimelineEntry = {
      date: todayStr,
      title: timelineTitle,
      description: timelineDesc,
      by: "Compliance Investigation Board"
    };

    const updatedReport: ComplianceReport = {
      ...report,
      timeline: [...report.timeline, newLog]
    };

    onUpdateComplianceReport(updatedReport);
    setTimelineTitle("");
    setTimelineDesc("");
    setAddingLog(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedReport = complianceReports.find(r => r.id === selectedReportId);
  const officeReports = complianceReports.filter(r => r.office === office);

  // Compliance KPIs
  const kpiTotal = officeReports.length;
  const kpiActive = officeReports.filter(r => r.status === "Pending Review" || r.status === "Under Investigation").length;
  const kpiActions = officeReports.filter(r => r.status === "Action Taken").length;
  const kpiClosed = officeReports.filter(r => r.status === "Closed" || r.status === "Dismissed").length;

  return (
    <div style={{ color: C.text }} className="max-w-7xl mx-auto px-1 py-4 sm:px-4">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4 border-b pb-4" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-3">
          <button 
            onClick={role === "select" ? onBack : () => { setRole("select"); setTrackedReport(null); setSelectedReportId(null); }}
            style={{ border: `1.5px solid ${C.border}`, background: C.card }}
            className="p-2 rounded-xl hover:scale-105 transition-all cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <div style={{ fontSize: 11, color: C.red, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 700 }}>
              {office} · SECURITY CODE ACTIVE
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <ShieldCheck size={26} className="text-red-600" /> Anonymous Whistleblowing Gateway
            </h1>
          </div>
        </div>

        {role !== "select" && (
          <button
            onClick={() => {
              if (role === "reporter") {
                setRole("officer");
              } else {
                setRole("reporter");
                setIsAuthenticated(false);
              }
              setTrackedReport(null);
              setSelectedReportId(null);
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border"
            style={{ background: C.redLight, borderColor: C.red, color: C.redText }}
          >
            Switch to {role === "reporter" ? "Compliance Officer View" : "Whistleblower View"}
          </button>
        )}
      </div>

      {/* 1. MAIN SELECTION SCREEN */}
      {role === "select" && (
        <div className="min-h-[45vh] flex flex-column items-center justify-center py-4">
          <div className="text-center max-w-xl mb-10">
            <p className="text-sm sm:text-base opacity-80 mb-2">
              Our compliance policy guarantees safe, uncompromised, and 100% anonymous channels to report corruption, safety threats, financial misconduct, or discrimination.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 mt-2">
              <Lock size={12} /> Double-isolated VPN sandbox protocol active
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {/* Whistleblower portal */}
            <div 
              onClick={() => { setRole("reporter"); setReporterSubTab("submit"); setGeneratedKey(null); }}
              style={{ background: C.card, borderColor: C.border }}
              className="border-2 rounded-2xl p-6 cursor-pointer hover:border-red-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-all">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-lg font-bold mb-2">Anonymous Whistleblower</h2>
              <p className="text-sm opacity-70 leading-relaxed">
                Submit a new incident report completely anonymously. Generate a unique secure Key to track updates and reply to compliance officers.
              </p>
              <div className="mt-4 text-xs font-bold text-red-600 flex items-center gap-1 group-hover:translate-x-1 transition-all">
                Report Incident securely &rarr;
              </div>
            </div>

            {/* Officer Portal */}
            <div 
              onClick={() => { setRole("officer"); setIsAuthenticated(false); setPinInput(""); }}
              style={{ background: C.card, borderColor: C.border }}
              className="border-2 rounded-2xl p-6 cursor-pointer hover:border-red-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 transition-all">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-lg font-bold mb-2">Compliance Officer</h2>
              <p className="text-sm opacity-70 leading-relaxed">
                Log in with an authorization PIN to assess anonymous reports, coordinate investigation logs, and respond securely to reporters.
              </p>
              <div className="mt-4 text-xs font-bold text-red-600 flex items-center gap-1 group-hover:translate-x-1 transition-all">
                Enter Compliance Board &rarr;
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. REPORTER SUB-PORTAL */}
      {role === "reporter" && (
        <div>
          <div className="flex border-b mb-6" style={{ borderColor: C.border }}>
            <button
              onClick={() => { setReporterSubTab("submit"); setGeneratedKey(null); }}
              className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${reporterSubTab === "submit" ? "border-red-600 text-red-600" : "border-transparent text-gray-400"}`}
            >
              🛡️ Submit Anonymous Report
            </button>
            <button
              onClick={() => { setReporterSubTab("track"); setTrackedReport(null); setTrackingKey(""); setTrackingError(""); }}
              className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${reporterSubTab === "track" ? "border-red-600 text-red-600" : "border-transparent text-gray-400"}`}
            >
              🔑 Track Report Status
            </button>
          </div>

          {/* Submission Form */}
          {reporterSubTab === "submit" && (
            <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-6 max-w-3xl mx-auto shadow-sm">
              {generatedKey ? (
                <div className="py-6 text-center">
                  <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key size={26} />
                  </div>
                  <h3 className="text-xl font-bold mb-1.5 text-red-600">Anonymous Report Registered</h3>
                  <p className="text-xs opacity-75 max-w-lg mx-auto mb-6">
                    Your report is encrypted and queued. To protect your anonymity, we do NOT have your email, password, or ID. You MUST write down or copy the key below to access replies or check investigation progress.
                  </p>

                  <div className="bg-red-50 dark:bg-gray-800 border rounded-xl p-4 max-w-md mx-auto mb-6 flex flex-column gap-3">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Confidential Access Key:</div>
                    <div className="font-mono text-xl sm:text-2xl font-extrabold tracking-widest text-red-600">{generatedKey}</div>
                    <button
                      onClick={() => copyToClipboard(generatedKey)}
                      className="px-4 py-1.5 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-700 transition cursor-pointer self-center"
                    >
                      {copied ? "✓ Copied Key!" : "📋 Copy Access Key"}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setTrackingKey(generatedKey);
                      const report = complianceReports.find(r => r.id === generatedKey);
                      if (report) setTrackedReport(report);
                      setReporterSubTab("track");
                    }}
                    className="px-6 py-2.5 bg-[#181C25] dark:bg-slate-700 text-white rounded-xl text-xs font-bold hover:opacity-90 transition cursor-pointer"
                  >
                    Proceed to Investigation Tracker &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWhistleblowSubmit} className="space-y-5">
                  <div className="bg-red-50 text-red-950 border border-red-200 p-4 rounded-xl text-xs flex gap-3 leading-relaxed">
                    <Lock size={20} className="text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Strict Anonymity Safeguard:</strong> This interface does not track cookies, IP addresses, browser fingerprints, or authentication tokens. Your name and identity are completely safe. Do not mention your own name in the description below.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider opacity-80">Incident Category <span className="text-red-500">*</span></label>
                      <select
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                        className="w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                      >
                        <option value="Financial Misconduct">💼 Financial Misconduct / Fraud</option>
                        <option value="Harassment/Discrimination">🚨 Harassment / Discrimination</option>
                        <option value="Safety Violation">☣️ Safety & Environmental Violation</option>
                        <option value="Conflict of Interest">🤝 Conflict of Interest</option>
                        <option value="Policy Breach">📜 Core Policy Breach</option>
                        <option value="Other">❓ Other Ethical Violations</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider opacity-80">Department Involved</label>
                      <input
                        type="text"
                        placeholder="e.g. Finance, Marketing, IT"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                        className="w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider opacity-80">Approximate Date</label>
                      <input
                        type="date"
                        value={incidentDate}
                        onChange={e => setIncidentDate(e.target.value)}
                        style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                        className="w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider opacity-80">Misconduct Details & Description <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={6}
                      placeholder="Please provide explicit details of what happened, who is involved, and any potential witnesses or relevant files. Your security is paramount — please omit any personal pronouns that would give away your own identity."
                      style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                      className="w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none leading-relaxed"
                    />
                  </div>

                  {/* Drag and drop file upload */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider opacity-80">Attach Evidence / Documents <span className="text-gray-400 font-normal">(Optional)</span></label>
                    <div
                      onClick={() => {
                        setUploadedFiles([...uploadedFiles, `secure_attachment_${uploadedFiles.length + 1}.pdf`]);
                      }}
                      className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-red-600 transition bg-opacity-35"
                      style={{ borderColor: C.border, background: isDark ? "#0F172A" : "#F8FAFC" }}
                    >
                      <Paperclip size={20} className="mx-auto mb-1 text-gray-400" />
                      <span className="text-xs font-semibold block">Click to attach evidence securely</span>
                      <span className="text-[10px] text-gray-400">Attached files will be automatically scrubbed of metadata.</span>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uploadedFiles.map((f, idx) => (
                          <div key={idx} className="flex items-center gap-1 px-2 py-1 rounded bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
                            <FileText size={12} />
                            <span>{f}</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx)); }} className="text-red-500 hover:text-red-800 ml-1">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl cursor-pointer hover:shadow-lg transition-all text-sm"
                    >
                      {submitting ? "Establishing secure channel & uploading..." : "🔒 Submit 100% Anonymous Whistleblower Report"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Tracking Subtab */}
          {reporterSubTab === "track" && (
            <div className="max-w-4xl mx-auto">
              {!trackedReport ? (
                <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-6 max-w-md mx-auto shadow-sm">
                  <h3 className="text-base font-bold mb-3 flex items-center gap-1.5"><Key size={18} className="text-red-600" /> Track Existing Report</h3>
                  <p className="text-xs opacity-75 mb-4 leading-relaxed">
                    To access replies and updates on your anonymous complaint, please input your secure 12-digit Case Access Key.
                  </p>

                  <form onSubmit={handleTrackReport} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold mb-1 uppercase tracking-wider opacity-80">Enter Case Key</label>
                      <input
                        type="text"
                        placeholder="e.g. COM-2026-N2B9"
                        required
                        value={trackingKey}
                        onChange={e => setTrackingKey(e.target.value)}
                        style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                        className="w-full border rounded-xl px-3.5 py-2 text-sm focus:outline-none font-mono tracking-widest text-center"
                      />
                    </div>
                    {trackingError && <p className="text-xs font-semibold text-red-500">{trackingError}</p>}
                    <button
                      type="submit"
                      className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-all"
                    >
                      🔑 Unlock Investigation Folder
                    </button>
                  </form>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Case Info / Timeline */}
                  <div className="lg:col-span-1 space-y-6">
                    <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-mono text-xs font-bold text-white px-2 py-0.5 bg-red-600 rounded">{trackedReport.id}</span>
                        <span className="text-[10px] opacity-70 font-semibold">{trackedReport.dateSubmitted}</span>
                      </div>
                      <h4 className="font-bold text-sm mb-1">{trackedReport.category}</h4>
                      <p className="text-xs opacity-70 mb-3">Office Location: {trackedReport.office}</p>

                      <div className="border-t pt-3" style={{ borderColor: C.border }}>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Investigation Progress:</div>
                        <span className="inline-block text-xs px-2.5 py-0.5 rounded-full font-bold" 
                          style={{ 
                            background: trackedReport.status === "Pending Review" ? C.redLight : trackedReport.status === "Under Investigation" ? C.amberLight : C.greenLight,
                            color: trackedReport.status === "Pending Review" ? C.redText : trackedReport.status === "Under Investigation" ? C.amberText : C.greenText
                          }}
                        >
                          {trackedReport.status}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-4 shadow-sm">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Official Logs & Milestones:</div>
                      <div className="space-y-4 relative pl-3 border-l" style={{ borderColor: C.border }}>
                        {trackedReport.timeline.map((item, idx) => (
                          <div key={idx} className="text-xs relative">
                            {/* Dot */}
                            <div className="absolute -left-[17.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-red-600 border border-white" />
                            <div className="font-bold mb-0.5">{item.title}</div>
                            <div className="text-[10px] opacity-60 mb-1">{item.date} · {item.by}</div>
                            <p className="opacity-75 leading-relaxed">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Anonymous Chat Section */}
                  <div className="lg:col-span-2">
                    <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-6 shadow-sm flex flex-col min-h-[450px]">
                      <div className="border-b pb-3 mb-4" style={{ borderColor: C.border }}>
                        <h3 className="font-bold text-base flex items-center gap-1.5">💬 Secure Integrity Messenger</h3>
                        <p className="text-xs opacity-70">Communicate directly with the Compliance Officer while remaining completely anonymous.</p>
                      </div>

                      {/* Original allegation description for reference */}
                      <div style={{ background: isDark ? "#0F172A" : "#F8FAFC", borderColor: C.border }} className="border p-3.5 rounded-xl text-xs mb-4">
                        <strong className="block mb-1 text-gray-500 uppercase tracking-wider">Your Anonymous Statement:</strong>
                        <p className="opacity-80 line-clamp-3">{trackedReport.description}</p>
                      </div>

                      {/* Chat Messages */}
                      <div className="flex-1 space-y-4 mb-4 overflow-y-auto max-h-[220px] pr-2">
                        {trackedReport.messages.length === 0 ? (
                          <div className="text-center py-8 text-xs text-gray-400">
                            No messages from the Investigator yet. Check back periodically.
                          </div>
                        ) : (
                          trackedReport.messages.map((msg, idx) => {
                            const isCompliance = msg.sender === "Compliance Officer";
                            return (
                              <div key={idx} className={`flex flex-col gap-1 max-w-[85%] ${isCompliance ? "mr-auto" : "ml-auto text-right"}`}>
                                <div className="flex justify-between items-center text-[10px] opacity-60 gap-3">
                                  <strong>{msg.sender}</strong>
                                  <span>{msg.date}</span>
                                </div>
                                <div className="p-3 rounded-xl text-xs leading-relaxed text-left"
                                  style={{
                                    background: isCompliance ? C.redLight : (isDark ? "#1E293B" : "#E2E8F0"),
                                    border: isCompliance ? `1px solid ${C.red}30` : `1px solid ${C.border}`
                                  }}
                                >
                                  {msg.text}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Send Box */}
                      {trackedReport.status !== "Closed" && (
                        <div className="flex gap-2 border-t pt-3" style={{ borderColor: C.border }}>
                          <input
                            type="text"
                            placeholder="Type secure anonymous reply back to Compliance Officer..."
                            value={whistleblowerReply}
                            onChange={e => setWhistleblowerReply(e.target.value)}
                            style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                            className="flex-1 border rounded-xl px-3.5 py-2 text-xs focus:outline-none"
                            onKeyDown={e => { if (e.key === "Enter") handleSendWhistleblowerReply(trackedReport); }}
                          />
                          <button
                            onClick={() => handleSendWhistleblowerReply(trackedReport)}
                            className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl text-xs hover:bg-red-700 transition cursor-pointer"
                          >
                            Send
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 3. OFFICER BOARD */}
      {role === "officer" && (
        <div>
          {/* PIN Authentication block */}
          {!isAuthenticated ? (
            <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-6 max-w-md mx-auto shadow-sm text-center">
              <Lock size={36} className="text-red-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-1">Compliance Board Authorization</h3>
              <p className="text-xs opacity-75 mb-4">
                Access to the anonymous complaint queue is restricted to authorized Integrity Officers. Please input your secure PIN.
              </p>

              <form onSubmit={handleOfficerLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    placeholder="Enter compliance authorization PIN"
                    value={pinInput}
                    onChange={e => setPinInput(e.target.value)}
                    style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                    className="w-full border rounded-xl px-3.5 py-2 text-sm text-center focus:outline-none"
                  />
                  <span className="block text-[10px] text-gray-500 mt-1">For demo review: enter <strong>compliance123</strong></span>
                </div>
                {pinError && <p className="text-xs font-semibold text-red-500">{pinError}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-all"
                  >
                    Authorize Access
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsAuthenticated(true); setPinError(""); }}
                    className="px-3 py-2 border rounded-xl text-xs font-bold hover:bg-gray-100 transition cursor-pointer"
                    style={{ color: C.text, borderColor: C.border }}
                  >
                    Bypass / Auto-Auth
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              {/* Officer dashboard KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div style={{ background: C.card, borderColor: C.border }} className="border p-4 rounded-xl text-center shadow-xs">
                  <div style={{ fontSize: 26, fontWeight: 800, color: C.red }}>{kpiTotal}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Disclosures</div>
                </div>
                <div style={{ background: C.card, borderColor: C.border }} className="border p-4 rounded-xl text-center shadow-xs">
                  <div style={{ fontSize: 26, fontWeight: 800, color: C.amber }}>{kpiActive}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Active Cases</div>
                </div>
                <div style={{ background: C.card, borderColor: C.border }} className="border p-4 rounded-xl text-center shadow-xs">
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#10B981" }}>{kpiActions}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Actions Enforced</div>
                </div>
                <div style={{ background: C.card, borderColor: C.border }} className="border p-4 rounded-xl text-center shadow-xs">
                  <div style={{ fontSize: 26, fontWeight: 800, color: C.textMuted }}>{kpiClosed}</div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Archived Cases</div>
                </div>
              </div>

              {/* Grid split */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Reports Queue */}
                <div className="lg:col-span-1 space-y-4">
                  <h3 className="text-sm font-bold opacity-80 uppercase tracking-wider mb-2">Anonymous Disclosure Inbox ({officeReports.length})</h3>
                  {officeReports.length === 0 ? (
                    <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-6 text-center text-sm text-gray-400">
                      No compliance cases registered for this location.
                    </div>
                  ) : (
                    officeReports.map(r => (
                      <div
                        key={r.id}
                        onClick={() => setSelectedReportId(r.id)}
                        style={{ 
                          background: selectedReportId === r.id ? C.redLight : C.card,
                          borderColor: selectedReportId === r.id ? C.red : C.border 
                        }}
                        className="border rounded-xl p-4 cursor-pointer hover:shadow-sm transition"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-mono text-xs font-bold text-red-600">{r.id}</span>
                          <span className="text-[10px] opacity-60 font-semibold">{r.dateSubmitted}</span>
                        </div>
                        <h4 className="font-bold text-sm mb-1 line-clamp-1">{r.category}</h4>
                        <p className="text-xs opacity-75 mb-2.5">Dept: {r.department}</p>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold"
                            style={{ 
                              background: r.status === "Pending Review" ? C.redLight : r.status === "Under Investigation" ? C.amberLight : C.greenLight,
                              color: r.status === "Pending Review" ? C.redText : r.status === "Under Investigation" ? C.amberText : C.greenText
                            }}
                          >
                            {r.status}
                          </span>
                          {r.hasEvidence && <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 border border-indigo-100">📎 Evidence</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Detail View / Action Room */}
                <div className="lg:col-span-2">
                  {selectedReport ? (
                    <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[500px]">
                      
                      {/* Top status */}
                      <div className="border-b pb-4 mb-4 flex justify-between items-start flex-wrap gap-2 animate-[slideup_0.15s_ease]" style={{ borderColor: C.border }}>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-white px-2 py-0.5 bg-red-600 rounded">{selectedReport.id}</span>
                            <span className="text-xs font-semibold opacity-70">Disclosure submitted on {selectedReport.dateSubmitted}</span>
                          </div>
                          <h2 className="text-lg font-bold">{selectedReport.category}</h2>
                          <div className="text-xs opacity-70 mt-1">
                            Target Department: <strong>{selectedReport.department}</strong> · Office: <strong>{selectedReport.office}</strong>
                          </div>
                        </div>
                        <div>
                          <select
                            value={selectedReport.status}
                            onChange={e => handleUpdateOfficerStatus(selectedReport, e.target.value as any)}
                            style={{ background: C.redLight, color: C.redText, borderColor: C.red }}
                            className="border rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none cursor-pointer"
                          >
                            <option value="Pending Review">Pending Review</option>
                            <option value="Under Investigation">Under Investigation</option>
                            <option value="Action Taken">Action Taken</option>
                            <option value="Dismissed">Dismissed</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>
                      </div>

                      {/* Description */}
                      <div style={{ background: isDark ? "#0F172A" : "#F8FAFC", border: `1.5px solid ${C.border}` }} className="p-4 rounded-xl text-sm leading-relaxed mb-6">
                        <div className="text-xs font-bold mb-1 opacity-60 uppercase tracking-wider">Secure Disclosure Allegation Log:</div>
                        <p>{selectedReport.description}</p>
                      </div>

                      {/* Logs & updates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        
                        {/* Investigation Milestones */}
                        <div style={{ borderRight: `1px solid ${C.border}` }} className="pr-0 md:pr-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Milestones & Audit Logs:</div>
                            <button
                              onClick={() => setAddingLog(!addingLog)}
                              className="text-[10px] text-red-600 font-bold hover:underline"
                            >
                              {addingLog ? "Cancel" : "+ Add milestone log"}
                            </button>
                          </div>

                          {addingLog && (
                            <div className="bg-red-50 dark:bg-gray-800 border p-3 rounded-xl mb-3 space-y-3" style={{ borderColor: C.border }}>
                              <input
                                type="text"
                                placeholder="Milestone title (e.g. Audit Complete)"
                                value={timelineTitle}
                                onChange={e => setTimelineTitle(e.target.value)}
                                style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                                className="w-full border rounded-lg p-1.5 text-xs focus:outline-none"
                              />
                              <textarea
                                placeholder="Detailed description of the action taken..."
                                value={timelineDesc}
                                onChange={e => setTimelineDesc(e.target.value)}
                                rows={2}
                                style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                                className="w-full border rounded-lg p-1.5 text-xs focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleAddTimelineLog(selectedReport)}
                                className="w-full py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-bold hover:bg-red-700 transition"
                              >
                                Save Log Entry
                              </button>
                            </div>
                          )}

                          <div className="space-y-4 max-h-[160px] overflow-y-auto pr-1">
                            {selectedReport.timeline.map((item, idx) => (
                              <div key={idx} className="text-xs pl-2 border-l-2 border-red-400">
                                <div className="font-bold">{item.title}</div>
                                <div className="text-[9px] opacity-60 mb-0.5">{item.date} · {item.by}</div>
                                <p className="opacity-75">{item.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Interactive chat with anon reporter */}
                        <div className="flex flex-col">
                          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Messenger with Anon Reporter:</div>
                          
                          <div className="flex-1 space-y-2 max-h-[160px] overflow-y-auto mb-3 pr-1">
                            {selectedReport.messages.length === 0 ? (
                              <div className="text-center py-6 text-[10px] text-gray-400">
                                No messages exchanged with this whistleblower yet. Use box below to initiate contact.
                              </div>
                            ) : (
                              selectedReport.messages.map((m, idx) => {
                                const isOfficer = m.sender === "Compliance Officer";
                                return (
                                  <div key={idx} className={`text-[11px] p-2 rounded-xl leading-relaxed ${isOfficer ? "bg-red-50 dark:bg-gray-800 ml-4 border" : "bg-gray-100 dark:bg-gray-700 mr-4 border"}`} style={{ borderColor: C.border }}>
                                    <div className="flex justify-between items-center opacity-60 text-[9px] mb-0.5">
                                      <strong>{m.sender}</strong>
                                      <span>{m.date}</span>
                                    </div>
                                    <p>{m.text}</p>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          <div className="flex gap-1.5 mt-auto">
                            <input
                              type="text"
                              placeholder="Message anonymous whistleblower..."
                              value={officerReply}
                              onChange={e => setOfficerReply(e.target.value)}
                              style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                              className="flex-1 border rounded-lg px-2 py-1 text-xs focus:outline-none"
                              onKeyDown={e => { if (e.key === "Enter") handleSendOfficerReply(selectedReport); }}
                            />
                            <button
                              onClick={() => handleSendOfficerReply(selectedReport)}
                              className="px-3 py-1 bg-red-600 text-white font-bold rounded-lg text-xs hover:bg-red-700 transition"
                            >
                              Send
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>
                  ) : (
                    <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-12 text-center text-sm text-gray-400 shadow-sm h-full flex flex-col justify-center items-center">
                      <ShieldCheck size={36} className="text-red-600 mb-3 opacity-60" />
                      <p className="font-bold text-gray-500">Select an active anonymous disclosure report from the queue to review files, register investigation logs, and safely chat with the anonymous reporter.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
