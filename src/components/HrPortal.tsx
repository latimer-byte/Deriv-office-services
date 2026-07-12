import React, { useState } from "react";
import { 
  Briefcase, 
  ChevronLeft, 
  Send, 
  User, 
  ShieldAlert, 
  Lock, 
  CheckCircle, 
  Clock, 
  Plus, 
  MessageSquare, 
  UserCheck, 
  HelpCircle,
  FileText,
  Trash2,
  Paperclip,
  Activity
} from "lucide-react";

export interface ThreadEntry {
  type: string; // "comment" | "status"
  from?: string;
  to?: string;
  by: string;
  time: string;
  note: string;
  internal?: boolean;
}

export interface HrTicket {
  id: string;
  subject: string;
  type: string; // "Grievance" | "Payroll/Salary" | "Benefits" | "Leave/Time-off" | "General Inquiry"
  description: string;
  confidentiality: "Standard" | "Sensitive - HR Managers Only";
  isAnonymous: boolean;
  staffName: string;
  staffId: string;
  date: string;
  status: "Submitted" | "Reviewed" | "Under Investigation" | "Action Taken" | "Resolved" | "Closed";
  assignedRep: string;
  office: string;
  thread: ThreadEntry[];
  attachments?: { name: string; size: string; type: string; url?: string }[];
}

interface HrPortalProps {
  office: string;
  theme: "light" | "dark";
  onBack: () => void;
  hrTickets: HrTicket[];
  onAddHrTicket: (ticket: HrTicket) => void;
  onUpdateHrTicket: (ticket: HrTicket) => void;
}

export default function HrPortal({
  office,
  theme,
  onBack,
  hrTickets,
  onAddHrTicket,
  onUpdateHrTicket
}: HrPortalProps) {
  const [role, setRole] = useState<"select" | "staff" | "admin">("select");
  const [activeTab, setActiveTab] = useState<"history" | "new">("history");
  
  // Staff form state
  const [subject, setSubject] = useState("");
  const [type, setType] = useState("Grievance");
  const [description, setDescription] = useState("");
  const [confidentiality, setConfidentiality] = useState<"Standard" | "Sensitive - HR Managers Only">("Standard");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [staffName, setStaffName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string; url?: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleHrFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(file => {
      let url = "";
      try {
        url = URL.createObjectURL(file);
      } catch (e) {
        // Fallback
      }
      return {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        type: file.type,
        url: url
      };
    });
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  // Active HR ticket detail
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  // Admin filters
  const [adminFilterType, setAdminFilterType] = useState("All");
  const [adminFilterStatus, setAdminFilterStatus] = useState("All");
  const [adminSearch, setAdminSearch] = useState("");

  // Colors based on theme
  const isDark = theme === "dark";
  const C = {
    coral: "#FF444F",
    coralDark: "#D93540",
    bg: isDark ? "#0F172A" : "#F4F5F7",
    card: isDark ? "#1E293B" : "#FFFFFF",
    border: isDark ? "#334155" : "#E4E7ED",
    text: isDark ? "#F8FAFC" : "#181C25",
    textSub: isDark ? "#94A3B8" : "#515A70",
    textMuted: isDark ? "#64748B" : "#9AA0B4",
    purple: "#8B5CF6",
    purpleLight: isDark ? "rgba(139, 92, 246, 0.15)" : "#F3E8FF",
    purpleText: isDark ? "#A78BFA" : "#6D28D9",
    green: "#10B981",
    greenLight: isDark ? "rgba(16, 185, 129, 0.15)" : "#ECFDF5",
    greenText: isDark ? "#34D399" : "#047857",
    amber: "#F59E0B",
    amberLight: isDark ? "rgba(245, 158, 11, 0.15)" : "#FEF3C7",
    amberText: isDark ? "#FBBF24" : "#B45309",
    red: "#EF4444",
    redLight: isDark ? "rgba(239, 68, 68, 0.15)" : "#FEE2E2",
    redText: isDark ? "#F87171" : "#B91C1C"
  };

  const hrReps = ["Marcus Tan (HR Director)", "Shirley Wong (Senior Benefits Specialist)", "Elena Demetriou (HR Business Partner)", "Sarah Jenkins (Employee Relations)"];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;
    setSubmitting(true);

    const generatedId = `HR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: HrTicket = {
      id: generatedId,
      subject,
      type,
      description,
      confidentiality,
      isAnonymous,
      staffName: isAnonymous ? "Anonymous Consultation" : (staffName || "Staff Member"),
      staffId: isAnonymous ? "ANON-HR" : (staffId || "DRV-9999"),
      date: new Date().toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }),
      status: "Submitted",
      assignedRep: "Unassigned",
      office,
      attachments: uploadedFiles,
      thread: [
        {
          type: "status",
          from: "None",
          to: "Submitted",
          by: isAnonymous ? "Anonymous Staff" : (staffName || "Staff Member"),
          time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          note: "Grievance file successfully registered."
        }
      ]
    };

    setTimeout(() => {
      onAddHrTicket(newTicket);
      setSubmitting(false);
      setSuccessMsg(true);
      // Reset form
      setSubject("");
      setDescription("");
      setIsAnonymous(false);
      setStaffName("");
      setStaffId("");
      setUploadedFiles([]);
    }, 800);
  };

  const handleAddComment = (ticket: HrTicket, isRep: boolean) => {
    if (!newComment.trim()) return;

    const timeString = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + " today";
    const commentBy = isRep ? (ticket.assignedRep === "Unassigned" ? "HR Specialist" : ticket.assignedRep) : (ticket.isAnonymous ? "Anonymous Staff" : ticket.staffName);

    const updatedThread = [
      ...ticket.thread,
      {
        type: "comment",
        by: commentBy,
        time: timeString,
        note: newComment,
        internal: false
      }
    ];

    const updatedTicket: HrTicket = {
      ...ticket,
      thread: updatedThread
    };

    onUpdateHrTicket(updatedTicket);
    setNewComment("");
  };

  const handleUpdateStatus = (ticket: HrTicket, newStatus: HrTicket["status"]) => {
    const timeString = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + " today";
    
    const updatedThread = [
      ...ticket.thread,
      {
        type: "status",
        from: ticket.status,
        to: newStatus,
        by: "HR Representative",
        time: timeString,
        note: `Ticket status updated to ${newStatus}.`
      }
    ];

    const updatedTicket: HrTicket = {
      ...ticket,
      status: newStatus,
      thread: updatedThread
    };

    onUpdateHrTicket(updatedTicket);
  };

  const handleAssignRep = (ticket: HrTicket, rep: string) => {
    const timeString = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) + " today";

    const updatedThread = [
      ...ticket.thread,
      {
        type: "status",
        from: ticket.assignedRep,
        to: ticket.status,
        by: "HR Operations",
        time: timeString,
        note: `Assigned investigation representative to: ${rep}`
      }
    ];

    const updatedTicket: HrTicket = {
      ...ticket,
      assignedRep: rep,
      thread: updatedThread
    };

    onUpdateHrTicket(updatedTicket);
  };

  const filteredTickets = hrTickets.filter(t => {
    if (t.office !== office) return false;
    const matchesType = adminFilterType === "All" || t.type === adminFilterType;
    const matchesStatus = adminFilterStatus === "All" || t.status === adminFilterStatus;
    const matchesSearch = adminSearch === "" || 
      t.subject.toLowerCase().includes(adminSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(adminSearch.toLowerCase()) ||
      t.staffName.toLowerCase().includes(adminSearch.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  const selectedTicket = hrTickets.find(t => t.id === selectedTicketId);

  // KPI Calculations
  const officeTickets = hrTickets.filter(t => t.office === office);
  const kpiTotal = officeTickets.length;
  const kpiPending = officeTickets.filter(t => t.status === "Submitted" || t.status === "Reviewed").length;
  const kpiInvestigating = officeTickets.filter(t => t.status === "Under Investigation" || t.status === "Action Taken").length;
  const kpiResolved = officeTickets.filter(t => t.status === "Resolved" || t.status === "Closed").length;

  return (
    <div style={{ color: C.text }} className="max-w-7xl mx-auto px-1 py-4 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4 border-b pb-4" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-3">
          <button 
            onClick={role === "select" ? onBack : () => { setRole("select"); setSelectedTicketId(null); }}
            style={{ border: `1.5px solid ${C.border}`, background: C.card }}
            className="p-2 rounded-xl hover:scale-105 transition-all cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <div>
            <div style={{ fontSize: 11, color: C.purple, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 700 }}>
              {office} · {role === "admin" ? "ADMIN WORKSPACE" : "STAFF PORTAL"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              <Briefcase size={26} className="text-[#8B5CF6]" /> HR Grievance & Complaint Portal
            </h1>
          </div>
        </div>

        {role !== "select" && (
          <button
            onClick={() => { setRole(role === "staff" ? "admin" : "staff"); setSelectedTicketId(null); }}
            className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border"
            style={{ background: C.purpleLight, borderColor: C.purple, color: C.purpleText }}
          >
            Switch to {role === "staff" ? "HR representative" : "Staff view"}
          </button>
        )}
      </div>

      {/* 1. ROLE SELECTION SCREEN */}
      {role === "select" && (
        <div className="min-h-[45vh] flex flex-col items-center justify-center py-6">
          <div className="text-center max-w-xl mb-10">
            <p className="text-sm sm:text-base opacity-80 mb-2">
              Welcome to the secure Human Resources Portal. This system provides staff with a direct, confidential path to raise complaints, report grievances, or query leave and payroll.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 mt-2">
              <Lock size={12} /> Encrypted & strict privacy controls active
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
            {/* Staff Entry */}
            <div 
              onClick={() => { setRole("staff"); setActiveTab("new"); }}
              style={{ background: C.card, borderColor: C.border }}
              className="border-2 rounded-2xl p-6 cursor-pointer hover:border-[#8B5CF6] transition-all duration-300 transform hover:-translate-y-1 shadow-md group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-[#8B5CF6] mb-4 group-hover:scale-110 transition-all">
                <User size={24} />
              </div>
              <h2 className="text-lg font-bold mb-2">I am a Staff Member</h2>
              <p className="text-sm opacity-70 leading-relaxed">
                File a workplace grievance, register a payroll dispute, request benefits inquiry, or view your history of tickets confidentially.
              </p>
              <div className="mt-4 text-xs font-bold text-[#8B5CF6] flex items-center gap-1 group-hover:translate-x-1 transition-all">
                Enter Staff Portal &rarr;
              </div>
            </div>

            {/* Admin Entry */}
            <div 
              onClick={() => { setRole("admin"); setActiveTab("history"); }}
              style={{ background: C.card, borderColor: C.border }}
              className="border-2 rounded-2xl p-6 cursor-pointer hover:border-[#8B5CF6] transition-all duration-300 transform hover:-translate-y-1 shadow-md group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-[#8B5CF6] mb-4 group-hover:scale-110 transition-all">
                <ShieldAlert size={24} />
              </div>
              <h2 className="text-lg font-bold mb-2">I am an HR Representative</h2>
              <p className="text-sm opacity-70 leading-relaxed">
                Access the secure HR panel to investigate complaints, assign representatives, communicate with staff, and update case resolutions.
              </p>
              <div className="mt-4 text-xs font-bold text-[#8B5CF6] flex items-center gap-1 group-hover:translate-x-1 transition-all">
                Enter Administration &rarr;
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. STAFF WORKSPACE */}
      {role === "staff" && (
        <div>
          {/* Subheader tabs */}
          <div className="flex border-b mb-6" style={{ borderColor: C.border }}>
            <button
              onClick={() => { setActiveTab("new"); setSuccessMsg(false); }}
              className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === "new" ? "border-[#8B5CF6] text-[#8B5CF6]" : "border-transparent text-gray-400"}`}
            >
              <Plus size={14} className="inline mr-1.5" /> File New HR Complaint / Request
            </button>
            <button
              onClick={() => { setActiveTab("history"); setSelectedTicketId(null); }}
              className={`pb-3 px-6 text-sm font-bold border-b-2 transition-all cursor-pointer ${activeTab === "history" ? "border-[#8B5CF6] text-[#8B5CF6]" : "border-transparent text-gray-400"}`}
            >
              <Clock size={14} className="inline mr-1.5" /> View My Request History
            </button>
          </div>

          {/* Form tab */}
          {activeTab === "new" && (
            <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-6 max-w-3xl mx-auto shadow-sm">
              {successMsg ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-100 text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                    ✓
                  </div>
                  <h3 className="text-xl font-bold mb-2">Grievance Registered Successfully</h3>
                  <p className="text-sm opacity-80 max-w-md mx-auto mb-6">
                    Your HR ticket has been securely created and routed to the Employee Relations Board. All details are protected under standard corporate compliance regulations.
                  </p>
                  <div className="flex justify-center gap-3">
                    <button 
                      onClick={() => setSuccessMsg(false)}
                      className="px-4 py-2 border rounded-xl text-xs font-bold hover:bg-gray-100 transition cursor-pointer"
                      style={{ color: C.text, borderColor: C.border }}
                    >
                      File another
                    </button>
                    <button 
                      onClick={() => { setActiveTab("history"); setSuccessMsg(false); }}
                      className="px-4 py-2 text-white text-xs font-bold rounded-xl bg-[#8B5CF6] hover:bg-[#7C4DFF] transition cursor-pointer"
                    >
                      Go to My History
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCreateTicket} className="space-y-5">
                  <div className="bg-purple-50 text-indigo-900 border border-indigo-100 p-3.5 rounded-xl text-xs leading-relaxed flex gap-2.5">
                    <Lock size={16} className="text-[#8B5CF6] shrink-0" />
                    <div>
                      <strong>Privacy Assurance:</strong> HR tickets are strictly viewable only by designated HR Professionals. Standard staff lists cannot access these details. You can also file as <strong>anonymous</strong> below.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider opacity-80">Subject / Allegation Title <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        required
                        value={subject}
                        onChange={e => setSubject(e.target.value)}
                        placeholder="e.g. Unfair overtime distribution or Payroll inquiry"
                        style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                        className="w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider opacity-80">Category / Type <span className="text-red-500">*</span></label>
                      <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                        className="w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                      >
                        <option value="Grievance">🚨 Grievance (Hostility, Harassment)</option>
                        <option value="Payroll/Salary">💰 Payroll / Salary Discrepancy</option>
                        <option value="Benefits">🏥 Health & Medical Benefits</option>
                        <option value="Leave/Time-off">📅 Leave & Time-off Policies</option>
                        <option value="General Inquiry">ℹ️ General HR Consultation</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider opacity-80">Grievance Description & Timeline <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={5}
                      placeholder="Please describe the incident, dates, and people involved with as much detail as possible. Absolute honesty and accurate timeline are critical for effective resolution."
                      style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                      className="w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider opacity-80">Security Level</label>
                      <select
                        value={confidentiality}
                        onChange={e => setConfidentiality(e.target.value as any)}
                        style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                        className="w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                      >
                        <option value="Standard">🔒 Standard Confidential (HR Generalist team)</option>
                        <option value="Sensitive - HR Managers Only">🛡️ Sensitive (Only escalated HR Directors)</option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-center pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={e => setIsAnonymous(e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <div>
                          <span className="text-xs font-bold">Anonymous HR Consultation</span>
                          <span className="block text-[10px] text-gray-500">Muffles your name and ID on all general ticket indexes.</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {!isAnonymous && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider opacity-80">Your Full Name <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input 
                          type="text" 
                          value={staffName}
                          onChange={e => setStaffName(e.target.value)}
                          placeholder="e.g. Ahmad Ridzuan"
                          style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                          className="w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider opacity-80">Employee ID <span className="text-gray-400 font-normal">(Optional)</span></label>
                        <input 
                          type="text" 
                          value={staffId}
                          onChange={e => setStaffId(e.target.value)}
                          placeholder="e.g. DRV-04512"
                          style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                          className="w-full border rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Drag and Drop File Selection */}
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider opacity-80">Upload Evidence / Attachments</label>
                    <input
                      type="file"
                      multiple
                      id="hr-file-upload-input"
                      style={{ display: "none" }}
                      onChange={e => {
                        if (e.target.files) {
                          handleHrFiles(e.target.files);
                        }
                      }}
                    />
                    <div 
                      onClick={() => document.getElementById("hr-file-upload-input")?.click()}
                      onDragOver={e => { e.preventDefault(); }}
                      onDrop={e => {
                        e.preventDefault();
                        if (e.dataTransfer.files) {
                          handleHrFiles(e.dataTransfer.files);
                        }
                      }}
                      className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:border-[#8B5CF6] transition-all bg-opacity-30"
                      style={{ borderColor: C.border, background: isDark ? "#0F172A" : "#F8FAFC" }}
                    >
                      <Paperclip size={20} className="mx-auto mb-1 text-gray-400" />
                      <span className="text-xs font-semibold block">Click to upload documents (PDF, JPG, DOCX)</span>
                      <span className="text-[10px] text-gray-500">Attach chats, emails, policy screenshots</span>
                    </div>

                    {uploadedFiles.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
                            <FileText size={12} />
                            <span>{file.name}</span>
                            <span className="text-[10px] opacity-60">({file.size})</span>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setUploadedFiles(uploadedFiles.filter((_, i) => i !== idx)); }} className="text-red-500 hover:text-red-700 ml-1">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-[#8B5CF6] hover:bg-[#7C4DFF] text-white font-bold rounded-xl cursor-pointer hover:shadow-lg hover:shadow-purple-200 transition-all text-sm"
                    >
                      {submitting ? "Registering Grievance secure link..." : "🔒 Submit Grievance Record Securely"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* History tab */}
          {activeTab === "history" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Request list */}
              <div className="lg:col-span-1 space-y-4">
                <h3 className="text-sm font-bold opacity-80 uppercase tracking-wider mb-2">My HR Records ({officeTickets.length})</h3>
                {officeTickets.length === 0 ? (
                  <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-6 text-center text-sm text-gray-400">
                    No registered HR tickets in this office location.
                  </div>
                ) : (
                  officeTickets.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTicketId(t.id)}
                      style={{ 
                        background: selectedTicketId === t.id ? C.purpleLight : C.card,
                        borderColor: selectedTicketId === t.id ? C.purple : C.border 
                      }}
                      className="border rounded-xl p-4 cursor-pointer hover:shadow-sm transition duration-150"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-mono text-xs font-bold text-[#8B5CF6]">{t.id}</span>
                        <span className="text-[10px] opacity-60 font-semibold">{t.date}</span>
                      </div>
                      <h4 title={t.subject} className="font-bold text-sm mb-2 line-clamp-1">{t.subject}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold" 
                          style={{ 
                            background: t.status === "Submitted" ? C.purpleLight : t.status === "Under Investigation" ? C.amberLight : C.greenLight,
                            color: t.status === "Submitted" ? C.purpleText : t.status === "Under Investigation" ? C.amberText : C.greenText
                          }}
                        >
                          {t.status}
                        </span>
                        <span className="text-[11px] opacity-70">Rep: {t.assignedRep.split(" ")[0]}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat / Timeline Detail */}
              <div className="lg:col-span-2">
                {selectedTicket ? (
                  <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[500px]">
                    <div className="border-b pb-4 mb-4 flex justify-between items-start flex-wrap gap-2" style={{ borderColor: C.border }}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-white px-2 py-0.5 bg-[#8B5CF6] rounded-md">{selectedTicket.id}</span>
                          <span className="text-xs font-semibold opacity-70">Filed on {selectedTicket.date}</span>
                        </div>
                        <h2 className="text-lg font-bold">{selectedTicket.subject}</h2>
                        <div className="text-xs opacity-70 mt-1">
                          Category: <strong>{selectedTicket.type}</strong> · Confidentiality: <span className="text-red-500 font-bold">{selectedTicket.confidentiality}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block text-xs px-3 py-1 rounded-full font-bold"
                          style={{ 
                            background: selectedTicket.status === "Submitted" ? C.purpleLight : selectedTicket.status === "Under Investigation" ? C.amberLight : C.greenLight,
                            color: selectedTicket.status === "Submitted" ? C.purpleText : selectedTicket.status === "Under Investigation" ? C.amberText : C.greenText
                          }}
                        >
                          {selectedTicket.status}
                        </span>
                      </div>
                    </div>

                    {/* Original Complaint */}
                    <div style={{ background: isDark ? "#0F172A" : "#F8FAFC", border: `1.5px solid ${C.border}` }} className="p-4 rounded-xl text-sm leading-relaxed mb-6">
                      <div className="text-xs font-bold mb-1 opacity-60 uppercase tracking-wider">Original Grievance Log:</div>
                      <p>{selectedTicket.description}</p>
                      
                      {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-dashed" style={{ borderColor: C.border }}>
                          <div className="text-xs font-bold mb-2 opacity-65 uppercase tracking-wider">Uploaded Evidence / Attachments:</div>
                          <div className="flex flex-wrap gap-2">
                            {selectedTicket.attachments.map((file, idx) => (
                              <a
                                key={idx}
                                href={file.url || "#"}
                                download={file.name}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border hover:opacity-80 transition-all cursor-pointer bg-purple-50 text-purple-700 border-purple-200"
                              >
                                <span>📄</span>
                                <div className="flex flex-col text-left min-w-0">
                                  <span className="font-bold truncate max-w-[150px]">{file.name}</span>
                                  <span className="text-[10px] opacity-75">{file.size}</span>
                                </div>
                                <span className="text-purple-500">⬇️</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timeline & Thread messages */}
                    <div className="flex-1 space-y-4 mb-6 overflow-y-auto max-h-[300px] pr-2">
                      <div className="text-xs font-bold opacity-60 uppercase tracking-wider">Investigation Thread & Updates</div>
                      {selectedTicket.thread.map((entry, idx) => {
                        const isStatus = entry.type === "status";
                        return (
                          <div key={idx} className="text-xs">
                            {isStatus ? (
                              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2.5 rounded-lg border border-dashed text-gray-500" style={{ borderColor: C.border }}>
                                <Clock size={12} />
                                <span>
                                  <strong>{entry.by}</strong> updated status from <strong>{entry.from}</strong> to <strong>{entry.to}</strong> · <span className="opacity-60">{entry.time}</span>
                                  {entry.note && <span className="block mt-1 font-semibold text-gray-600 dark:text-gray-300">Note: {entry.note}</span>}
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <div className="flex justify-between font-bold opacity-70">
                                  <span>👤 {entry.by}</span>
                                  <span>{entry.time}</span>
                                </div>
                                <div className="p-3 rounded-xl text-sm leading-relaxed" 
                                  style={{ 
                                    background: entry.by.includes("HR") || entry.by.includes("Wong") || entry.by.includes("Tan") ? C.purpleLight : (isDark ? "#1E293B" : "#F3F4F6"),
                                    border: `1px solid ${C.border}`
                                  }}
                                >
                                  {entry.note}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Chat Reply Area */}
                    {selectedTicket.status !== "Closed" && (
                      <div className="flex gap-2 border-t pt-4" style={{ borderColor: C.border }}>
                        <input
                          type="text"
                          value={newComment}
                          onChange={e => setNewComment(e.target.value)}
                          placeholder="Type confidential reply to HR Board..."
                          style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                          className="flex-1 border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                          onKeyDown={e => { if (e.key === "Enter") handleAddComment(selectedTicket, false); }}
                        />
                        <button
                          onClick={() => handleAddComment(selectedTicket, false)}
                          className="px-4 py-2 bg-[#8B5CF6] text-white font-bold rounded-xl text-xs hover:bg-[#7C4DFF] transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Send size={12} /> Send
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-12 text-center text-sm text-gray-400 shadow-sm h-full flex flex-col justify-center items-center">
                    <MessageSquare size={36} className="text-[#8B5CF6] mb-3 opacity-60" />
                    <p className="font-bold text-gray-500">Select a record from the history panel to view detailed investigation logs, timeline progression, and chat securely with HR.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ADMIN WORKSPACE */}
      {role === "admin" && (
        <div>
          {/* Admin KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div style={{ background: C.card, borderColor: C.border }} className="border p-4 rounded-xl text-center shadow-xs">
              <div style={{ fontSize: 26, fontWeight: 800, color: C.purple }}>{kpiTotal}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Total Complaints</div>
            </div>
            <div style={{ background: C.card, borderColor: C.border }} className="border p-4 rounded-xl text-center shadow-xs">
              <div style={{ fontSize: 26, fontWeight: 800, color: C.amber }}>{kpiPending}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Pending Review</div>
            </div>
            <div style={{ background: C.card, borderColor: C.border }} className="border p-4 rounded-xl text-center shadow-xs">
              <div style={{ fontSize: 26, fontWeight: 800, color: C.purpleText }}>{kpiInvestigating}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">In Progress</div>
            </div>
            <div style={{ background: C.card, borderColor: C.border }} className="border p-4 rounded-xl text-center shadow-xs">
              <div style={{ fontSize: 26, fontWeight: 800, color: C.green }}>{kpiResolved}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">Resolved Cases</div>
            </div>
          </div>

          {/* Filter Bar */}
          <div style={{ background: C.card, borderColor: C.border }} className="border p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-1 text-xs font-bold opacity-80 uppercase">
                <Activity size={14} /> Filters:
              </div>
              <select
                value={adminFilterType}
                onChange={e => setAdminFilterType(e.target.value)}
                style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                className="border rounded-lg px-2.5 py-1 text-xs font-semibold"
              >
                <option value="All">All Categories</option>
                <option value="Grievance">🚨 Grievances</option>
                <option value="Payroll/Salary">💰 Payroll</option>
                <option value="Benefits">🏥 Benefits</option>
                <option value="Leave/Time-off">📅 Leave</option>
                <option value="General Inquiry">ℹ️ Inquiries</option>
              </select>

              <select
                value={adminFilterStatus}
                onChange={e => setAdminFilterStatus(e.target.value)}
                style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                className="border rounded-lg px-2.5 py-1 text-xs font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="Submitted">Submitted</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Under Investigation">Under Investigation</option>
                <option value="Action Taken">Action Taken</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search by ID, title, name..."
                value={adminSearch}
                onChange={e => setAdminSearch(e.target.value)}
                style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                className="w-full border rounded-lg pl-3 pr-8 py-1.5 text-xs focus:outline-none"
              />
              <span className="absolute right-2.5 top-1.5 text-gray-400">🔍</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List panel */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-sm font-bold opacity-80 uppercase tracking-wider mb-2">Complaint Queue ({filteredTickets.length})</h3>
              {filteredTickets.length === 0 ? (
                <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-6 text-center text-sm text-gray-400">
                  No matching grievances in the queue.
                </div>
              ) : (
                filteredTickets.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    style={{ 
                      background: selectedTicketId === t.id ? C.purpleLight : C.card,
                      borderColor: selectedTicketId === t.id ? C.purple : C.border 
                    }}
                    className="border rounded-xl p-4 cursor-pointer hover:shadow-sm transition duration-150"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-mono text-xs font-bold text-[#8B5CF6]">{t.id}</span>
                      <span className="text-[10px] opacity-60 font-semibold">{t.date}</span>
                    </div>
                    <h4 title={t.subject} className="font-bold text-sm mb-1.5 line-clamp-1">{t.subject}</h4>
                    <div className="text-xs opacity-70 mb-2.5">
                      Reporter: <strong className={t.isAnonymous ? "text-[#8B5CF6]" : ""}>{t.staffName}</strong> ({t.staffId})
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" 
                        style={{ 
                          background: t.status === "Submitted" ? C.purpleLight : t.status === "Under Investigation" ? C.amberLight : C.greenLight,
                          color: t.status === "Submitted" ? C.purpleText : t.status === "Under Investigation" ? C.amberText : C.greenText
                        }}
                      >
                        {t.status}
                      </span>
                      {t.confidentiality.includes("Sensitive") && (
                        <span className="text-[9px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                          <Lock size={8} /> SENSITIVE
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Detail / Action panel */}
            <div className="lg:col-span-2">
              {selectedTicket ? (
                <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-6 shadow-sm flex flex-col h-full min-h-[500px]">
                  <div className="border-b pb-4 mb-4 flex justify-between items-start flex-wrap gap-2" style={{ borderColor: C.border }}>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-white px-2 py-0.5 bg-[#8B5CF6] rounded-md">{selectedTicket.id}</span>
                        <span className="text-xs font-semibold opacity-70">Filed by: <strong>{selectedTicket.staffName}</strong> ({selectedTicket.staffId})</span>
                      </div>
                      <h2 className="text-lg font-bold">{selectedTicket.subject}</h2>
                      <div className="text-xs opacity-70 mt-1">
                        Category: <strong>{selectedTicket.type}</strong> · Level: <span className="text-red-500 font-bold">{selectedTicket.confidentiality}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <select
                        value={selectedTicket.status}
                        onChange={e => handleUpdateStatus(selectedTicket, e.target.value as any)}
                        style={{ background: C.purpleLight, color: C.purpleText, borderColor: C.purple }}
                        className="border rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Under Investigation">Under Investigation</option>
                        <option value="Action Taken">Action Taken</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  {/* Grievance Text */}
                  <div style={{ background: isDark ? "#0F172A" : "#F8FAFC", border: `1.5px solid ${C.border}` }} className="p-4 rounded-xl text-sm leading-relaxed mb-6">
                    <div className="text-xs font-bold mb-1 opacity-60 uppercase tracking-wider">Complaint Log Details:</div>
                    <p>{selectedTicket.description}</p>
                    
                    {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-dashed" style={{ borderColor: C.border }}>
                        <div className="text-xs font-bold mb-2 opacity-65 uppercase tracking-wider">Uploaded Evidence / Attachments:</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedTicket.attachments.map((file, idx) => (
                            <a
                              key={idx}
                              href={file.url || "#"}
                              download={file.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border hover:opacity-80 transition-all cursor-pointer bg-purple-50 text-purple-700 border-purple-200"
                            >
                              <span>📄</span>
                              <div className="flex flex-col text-left min-w-0">
                                <span className="font-bold truncate max-w-[150px]">{file.name}</span>
                                <span className="text-[10px] opacity-75">{file.size}</span>
                              </div>
                              <span className="text-purple-500">⬇️</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Assign Representative Section */}
                  <div className="mb-6 flex flex-wrap gap-3 items-center bg-purple-50 p-3 rounded-xl border border-purple-100 text-xs">
                    <UserCheck size={16} className="text-[#8B5CF6]" />
                    <span className="font-bold">Assign Investigation Representative:</span>
                    <select
                      value={selectedTicket.assignedRep}
                      onChange={e => handleAssignRep(selectedTicket, e.target.value)}
                      style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                      className="border rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none"
                    >
                      <option value="Unassigned">⚠️ Select HR Officer...</option>
                      {hrReps.map(rep => <option key={rep} value={rep}>{rep}</option>)}
                    </select>
                  </div>

                  {/* Timeline Logs */}
                  <div className="flex-1 space-y-4 mb-6 overflow-y-auto max-h-[250px] pr-2">
                    <div className="text-xs font-bold opacity-60 uppercase tracking-wider">Case Investigation Log History</div>
                    {selectedTicket.thread.map((entry, idx) => {
                      const isStatus = entry.type === "status";
                      return (
                        <div key={idx} className="text-xs">
                          {isStatus ? (
                            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg border border-dashed text-gray-500" style={{ borderColor: C.border }}>
                              <Clock size={12} />
                              <span>
                                <strong>{entry.by}</strong> moved status from <strong>{entry.from}</strong> to <strong>{entry.to}</strong> · <span className="opacity-60">{entry.time}</span>
                                {entry.note && <span className="block mt-1 font-semibold text-gray-600 dark:text-gray-300">Update Note: {entry.note}</span>}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <div className="flex justify-between font-bold opacity-70">
                                <span>👤 {entry.by}</span>
                                <span>{entry.time}</span>
                              </div>
                              <div className="p-3 rounded-xl text-sm leading-relaxed" 
                                style={{ 
                                  background: entry.by.includes("HR") || entry.by.includes("Wong") || entry.by.includes("Tan") ? C.purpleLight : (isDark ? "#1E293B" : "#F3F4F6"),
                                  border: `1px solid ${C.border}`
                                }}
                              >
                                {entry.note}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Input */}
                  <div className="flex gap-2 border-t pt-4" style={{ borderColor: C.border }}>
                    <input
                      type="text"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      placeholder="Add investigation note or respond to employee..."
                      style={{ background: isDark ? "#1E293B" : "#FFFFFF", color: C.text, borderColor: C.border }}
                      className="flex-1 border rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
                      onKeyDown={e => { if (e.key === "Enter") handleAddComment(selectedTicket, true); }}
                    />
                    <button
                      onClick={() => handleAddComment(selectedTicket, true)}
                      className="px-4 py-2 bg-[#8B5CF6] text-white font-bold rounded-xl text-xs hover:bg-[#7C4DFF] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Send size={12} /> Send Response
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ background: C.card, borderColor: C.border }} className="border rounded-2xl p-12 text-center text-sm text-gray-400 shadow-sm h-full flex flex-col justify-center items-center">
                  <Briefcase size={36} className="text-[#8B5CF6] mb-3 opacity-60" />
                  <p className="font-bold text-gray-500">Select an active workplace complaint from the queue to run assessments, assign specialist leads, and issue resolutions.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
