import React, { useState } from "react";
import AdminDashboard from "./components/AdminDashboard";
import HrPortal, { HrTicket } from "./components/HrPortal";
import CompliancePortal, { ComplianceReport } from "./components/CompliancePortal";

import neonCyprus from "./assets/images/neon_cyprus_1783766539962.jpg";
import neonMalta from "./assets/images/neon_malta_1783766550652.jpg";
import neonRwanda from "./assets/images/neon_rwanda_1783766561662.jpg";
import neonMalaysia from "./assets/images/neon_malaysia_1783766573318.jpg";
import neonParaguay from "./assets/images/neon_paraguay_1783766584359.jpg";
import neonLondon from "./assets/images/neon_london_1783766593631.jpg";
import neonDubai from "./assets/images/neon_dubai_1783766603861.jpg";
import neonParis from "./assets/images/neon_paris_1783767894468.jpg";
import neonBerlin from "./assets/images/neon_berlin_1783767908842.jpg";
import neonGuernsey from "./assets/images/neon_guernsey_1783767921351.jpg";
import neonSingapore from "./assets/images/neon_singapore_1783767878394.jpg";
import neonCayman from "./assets/images/neon_cayman_1783767936674.jpg";
import neonVanuatu from "./assets/images/neon_vanuatu_1783767949363.jpg";
import neonMauritius from "./assets/images/neon_mauritius_1783767963307.jpg";

// ─── Types and Interfaces ────────────────────────────────────────────────────
export interface ThreadEntry {
  type: string; // "status" | "comment"
  from?: string;
  to?: string;
  by: string;
  time: string;
  note: string;
  internal?: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  category: string;
  dept: string;
  priority: string; // "Critical" | "High" | "Medium" | "Low"
  status: string; // "Submitted" | "Assigned" | "In Progress" | "Resolved" | "Closed" | "Open"
  location: string;
  desk: string;
  date: string;
  staffName: string;
  staffId: string;
  assetTag?: string;
  assetModel?: string;
  description: string;
  technician: string;
  thread: ThreadEntry[];
  attachments?: { name: string; size: string; type: string; url?: string }[];
}

// ─── Deriv Brand Tokens ───────────────────────────────────────────────────────
const C_LIGHT = {
  coral:       "#FF444F",
  coralDark:   "#D93540",
  coralLight:  "#FFF0F1",
  coralMid:    "#FFE0E2",
  slate:       "#181C25",
  slateMid:    "#2A3042",
  slateLight:  "#3D4459",
  bg:          "#F4F5F7",
  card:        "#FFFFFF",
  border:      "#E4E7ED",
  borderLight: "#EFF1F5",
  text:        "#181C25",
  textSub:     "#5C6479",
  textMuted:   "#9AA0B4",
  green:       "#00C07B",
  greenLight:  "#E6FAF3",
  amber:       "#D97706",
  amberLight:  "#FFFBEB",
  red:         "#FF444F",
  redLight:    "#FFF0F1",
  blue:        "#1A6CCC",
  blueLight:   "#EBF3FF",
  purple:      "#7C3AED",
  purpleLight: "#F5F3FF",
};

const C_DARK = {
  coral:       "#FF444F",
  coralDark:   "#FF5A65",
  coralLight:  "#201A1B",
  coralMid:    "#352022",
  slate:       "#F8FAFC",
  slateMid:    "#E2E8F0",
  slateLight:  "#94A3B8",
  bg:          "#0F172A",
  card:        "#1E293B",
  border:      "#334155",
  borderLight: "#1E293B",
  text:        "#F8FAFC",
  textSub:     "#94A3B8",
  textMuted:   "#64748B",
  green:       "#10B981",
  greenLight:  "#0F2922",
  amber:       "#F59E0B",
  amberLight:  "#282012",
  red:         "#EF4444",
  redLight:    "#281A1C",
  blue:        "#3B82F6",
  blueLight:   "#13253E",
  purple:      "#8B5CF6",
  purpleLight: "#231B36",
};

let currentTheme: "light" | "dark" = "light";

export const C = new Proxy({} as typeof C_LIGHT, {
  get(_, prop) {
    const active = currentTheme === "dark" ? C_DARK : C_LIGHT;
    return active[prop as keyof typeof C_LIGHT];
  }
});
const F = "'Plus Jakarta Sans', 'Outfit', 'Inter', sans-serif";

// ─── Status workflow order ────────────────────────────────────────────────────
const STATUS_FLOW = ["Submitted", "Assigned", "In Progress", "Resolved", "Closed"];

const TECHNICIANS: Record<string, string[]> = {
  "IT Admin":             ["James Okonkwo", "Sarah Tan", "Priya Nair", "Unassigned"],
  "Facilities Management":["Peter Müller",  "Aisha Kamara", "Tom Reyes", "Unassigned"],
  "Office Admin":         ["Clara Santos",  "David Lim",   "Yuki Tanaka","Unassigned"],
};

// ─── Deriv Physical Offices ───────────────────────────────────────────────────
const OFFICES = [
  "Cyberjaya, Malaysia (HQ)",
  "Labuan, Malaysia",
  "Ipoh, Malaysia",
  "Melaka, Malaysia",
  "Limassol, Cyprus",
  "Nicosia, Cyprus",
  "Birkirkara, Malta",
  "London, UK",
  "Reading, UK",
  "Paris, France",
  "Berlin, Germany",
  "Guernsey, Channel Islands",
  "Singapore",
  "Dubai – JLT, UAE",
  "Dubai – Business Bay, UAE",
  "Asunción, Paraguay",
  "Ciudad del Este, Paraguay",
  "George Town, Cayman Islands",
  "Port Vila, Vanuatu",
  "Kigali, Rwanda",
  "Mauritius",
];

// ─── Ticket data with full thread history ─────────────────────────────────────
const BASE_TICKETS: Record<string, Ticket[]> = {
  "Cyberjaya, Malaysia (HQ)": [
    {
      id: "REQ-2024-001", title: "Laptop screen flickering intermittently",
      category: "Monitor / Display", dept: "IT Admin", priority: "High",
      status: "In Progress", location: "Floor 3 — Open Plan", desk: "Desk 3-14",
      date: "8 Jul 2024", staffName: "Ali Hassan", staffId: "DRV-03812",
      assetTag: "DRV-IT-00421", assetModel: "Dell UltraSharp U2722D",
      description: "Screen has been flickering since yesterday afternoon. Happens every 10–15 minutes and lasts about 30 seconds. Very disruptive to work.",
      technician: "James Okonkwo",
      thread: [
        { type: "status", from: "Submitted", to: "Assigned", by: "System", time: "8 Jul, 09:14", note: "Auto-routed to IT Admin based on category." },
        { type: "comment", by: "James Okonkwo", time: "8 Jul, 10:02", note: "Visited the desk. Identified a loose display cable on the back of the monitor. Replacement part ordered — ETA 1 business day.", internal: false },
        { type: "status", from: "Assigned", to: "In Progress", by: "James Okonkwo", time: "8 Jul, 10:05", note: "" },
        { type: "comment", by: "James Okonkwo", time: "8 Jul, 14:30", note: "Part arrived. Fitting the replacement cable now.", internal: true },
      ],
    },
    {
      id: "REQ-2024-002", title: "Air conditioning not working in main conference room",
      category: "HVAC / Air Conditioning", dept: "Facilities Management", priority: "Critical",
      status: "Assigned", location: "Floor 4 — Boardroom", desk: "",
      date: "7 Jul 2024", staffName: "Mei Lin Chong", staffId: "DRV-02156",
      assetTag: "", assetModel: "",
      description: "The AC in the main boardroom has completely stopped. Room temperature is above 30°C. Board meeting scheduled tomorrow at 09:00.",
      technician: "Peter Müller",
      thread: [
        { type: "status", from: "Submitted", to: "Assigned", by: "Peter Müller", time: "7 Jul, 11:45", note: "Assigned to Facilities team. Critical — board meeting tomorrow." },
        { type: "comment", by: "Peter Müller", time: "7 Jul, 12:30", note: "HVAC contractor contacted. Inspection scheduled for this afternoon.", internal: false },
        { type: "comment", by: "Peter Müller", time: "7 Jul, 16:10", note: "Contractor on site. Compressor fault identified. Parts being sourced urgently.", internal: true },
      ],
    },
    {
      id: "REQ-2024-003", title: "Printer on Floor 5 not connecting to network",
      category: "Printer / Scanner", dept: "IT Admin", priority: "Medium",
      status: "Resolved", location: "Floor 5 — Kitchen Area", desk: "",
      date: "5 Jul 2024", staffName: "Raj Patel", staffId: "DRV-01944",
      assetTag: "DRV-IT-00318", assetModel: "HP LaserJet Pro M404dn",
      description: "The printer near the kitchen on Floor 5 shows as offline for everyone. Last working Friday morning.",
      technician: "Sarah Tan",
      thread: [
        { type: "status", from: "Submitted", to: "Assigned", by: "System", time: "5 Jul, 08:50", note: "" },
        { type: "status", from: "Assigned", to: "In Progress", by: "Sarah Tan", time: "5 Jul, 09:30", note: "" },
        { type: "comment", by: "Sarah Tan", time: "5 Jul, 10:15", note: "Network port on switch had been accidentally disabled after cabling work. Re-enabled and tested — printer is online.", internal: false },
        { type: "status", from: "In Progress", to: "Resolved", by: "Sarah Tan", time: "5 Jul, 10:20", note: "Network port reconfigured. Printer confirmed online by requester." },
      ],
    },
    {
      id: "REQ-2024-004", title: "Broken chair in trading floor area",
      category: "Furniture / Fixtures", dept: "Facilities Management", priority: "Medium",
      status: "Submitted", location: "Floor 2 — Trading Floor", desk: "Desk 2-11",
      date: "10 Jul 2024", staffName: "Farah Zubairi", staffId: "DRV-04103",
      assetTag: "", assetModel: "",
      description: "The office chair at Desk 2-11 has a broken armrest and the gas lift is failing — chair slowly sinks while seated.",
      technician: "Unassigned",
      thread: [
        { type: "status", from: "Submitted", to: "Submitted", by: "System", time: "10 Jul, 08:02", note: "Request received. Awaiting assignment." },
      ],
    },
    {
      id: "REQ-2024-005", title: "Request for additional monitor — dual screen setup",
      category: "Office Supplies", dept: "Office Admin", priority: "Low",
      status: "Assigned", location: "Floor 3 — Open Plan", desk: "Desk 3-07",
      date: "9 Jul 2024", staffName: "Nurul Aina", staffId: "DRV-03701",
      assetTag: "", assetModel: "",
      description: "I've been struggling with a single-screen setup while managing multiple spreadsheets. A second monitor would significantly help my productivity.",
      technician: "Clara Santos",
      thread: [
        { type: "status", from: "Submitted", to: "Assigned", by: "Clara Santos", time: "9 Jul, 14:20", note: "" },
        { type: "comment", by: "Clara Santos", time: "9 Jul, 14:45", note: "Inventory checked. One spare Dell 24\" monitor available in the storeroom. Will arrange delivery to desk tomorrow morning.", internal: false },
      ],
    },
    {
      id: "REQ-2024-006", title: "Water leak under pantry sink",
      category: "Plumbing / Water", dept: "Facilities Management", priority: "High",
      status: "In Progress", location: "Floor 2 — Pantry", desk: "",
      date: "9 Jul 2024", staffName: "Hafiz Razak", staffId: "DRV-02867",
      assetTag: "", assetModel: "",
      description: "Water pooling under the sink in the Floor 2 pantry. Dripping quite fast — bucket placed as temporary measure.",
      technician: "Tom Reyes",
      thread: [
        { type: "status", from: "Submitted", to: "Assigned", by: "Tom Reyes", time: "9 Jul, 07:55", note: "" },
        { type: "status", from: "Assigned", to: "In Progress", by: "Tom Reyes", time: "9 Jul, 08:30", note: "" },
        { type: "comment", by: "Tom Reyes", time: "9 Jul, 09:00", note: "Plumber on site. Pipe joint has failed. Temporary sealant applied. Waiting for replacement fitting.", internal: false },
        { type: "comment", by: "Tom Reyes", time: "9 Jul, 14:00", note: "Permanent repair done. Sink tested — no further leaks. Recommend inspection in 48hrs.", internal: true },
      ],
    },
    {
      id: "REQ-2024-007", title: "Suspicious phishing email received",
      category: "Security / Phishing", dept: "IT Admin", priority: "Critical",
      status: "In Progress", location: "Floor 3 — Open Plan", desk: "Desk 3-22",
      date: "10 Jul 2024", staffName: "Ben Oduya", staffId: "DRV-04420",
      assetTag: "", assetModel: "",
      description: "Received an email purporting to be from Deriv IT asking me to reset my password via an external link. I did not click it. Forwarding to IT now.",
      technician: "Priya Nair",
      thread: [
        { type: "status", from: "Submitted", to: "Assigned", by: "System", time: "10 Jul, 07:12", note: "Auto-escalated: Security category." },
        { type: "status", from: "Assigned", to: "In Progress", by: "Priya Nair", time: "10 Jul, 07:25", note: "" },
        { type: "comment", by: "Priya Nair", time: "10 Jul, 07:40", note: "Email quarantined at gateway. Sender domain spoofed. No links clicked — no compromise. Blocking domain and alerting all staff.", internal: false },
        { type: "comment", by: "Priya Nair", time: "10 Jul, 08:00", note: "Blocking domain rule applied in M365. Sending all-staff advisory. Checking if same email hit any other inboxes.", internal: true },
      ],
    },
    {
      id: "REQ-2024-008", title: "Stationery restock — Floor 4 supply room",
      category: "Office Supplies", dept: "Office Admin", priority: "Low",
      status: "Resolved", location: "Floor 4 — Supply Room", desk: "",
      date: "6 Jul 2024", staffName: "Siti Mariam", staffId: "DRV-03215",
      assetTag: "", assetModel: "",
      description: "Pens, notebooks and sticky notes are completely out of stock in the Floor 4 supply room.",
      technician: "David Lim",
      thread: [
        { type: "status", from: "Submitted", to: "Assigned", by: "David Lim", time: "6 Jul, 10:00", note: "" },
        { type: "comment", by: "David Lim", time: "6 Jul, 11:00", note: "Order placed with stationery supplier. Delivery expected next morning.", internal: false },
        { type: "status", from: "Assigned", to: "Resolved", by: "David Lim", time: "7 Jul, 09:30", note: "Stationery delivered and fully restocked." },
      ],
    },
  ],
  "Labuan, Malaysia": [
    { id: "REQ-2024-010", title: "VPN access failing after Windows update", category: "Network / VPN", dept: "IT Admin", priority: "High", status: "In Progress", location: "Level 1 — Open Plan", desk: "Desk 1-05", date: "9 Jul 2024", staffName: "Yong Kiat", staffId: "DRV-02201", assetTag: "DRV-IT-00510", assetModel: "Lenovo ThinkPad X1 Carbon", description: "VPN stopped working after Windows forced an update last night. Can't access internal systems.", technician: "Sarah Tan", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Sarah Tan", time:"9 Jul, 08:30", note:"Investigating update conflict with Cisco AnyConnect." }, { type:"comment", by:"Sarah Tan", time:"9 Jul, 10:00", note:"Rollback patch being tested in staging. Will deploy if successful.", internal:true }] },
    { id: "REQ-2024-011", title: "Water dispenser leaking near reception", category: "Plumbing / Water", dept: "Facilities Management", priority: "High", status: "Open", location: "Ground Floor — Reception", desk: "", date: "10 Jul 2024", staffName: "Linda Chin", staffId: "DRV-02890", assetTag: "", assetModel: "", description: "The water dispenser by reception is dripping constantly. The floor is getting slippery.", technician: "Unassigned", thread: [{ type:"status", from:"Submitted", to:"Submitted", by:"System", time:"10 Jul, 09:00", note:"Awaiting assignment." }] },
    { id: "REQ-2024-012", title: "Stationery restock — Level 1 supply cabinet", category: "Office Supplies", dept: "Office Admin", priority: "Low", status: "Resolved", location: "Level 1 — Supply Cabinet", desk: "", date: "6 Jul 2024", staffName: "Omar Haji", staffId: "DRV-01755", assetTag: "", assetModel: "", description: "Pens and A4 paper completely depleted.", technician: "David Lim", thread: [{ type:"status", from:"Submitted", to:"Resolved", by:"David Lim", time:"7 Jul, 10:00", note:"Stationery delivered and stocked." }] },
  ],
  "Ipoh, Malaysia": [
    { id: "REQ-2024-020", title: "Projector bulb replacement needed in training room", category: "AV Equipment", dept: "IT Admin", priority: "Medium", status: "In Progress", location: "Floor 1 — Training Room", desk: "", date: "8 Jul 2024", staffName: "Kavitha Suresh", staffId: "DRV-03102", assetTag: "DRV-IT-00222", assetModel: "Epson EB-S41", description: "Projector shows 'Lamp hours exceeded' warning. Image is very dim.", technician: "James Okonkwo", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"James Okonkwo", time:"8 Jul, 09:00", note:"" }, { type:"comment", by:"James Okonkwo", time:"8 Jul, 10:00", note:"Bulb ordered from supplier. Arriving tomorrow.", internal:false }] },
    { id: "REQ-2024-021", title: "Loose carpet tile near stairwell — trip hazard", category: "Safety / Hazard", dept: "Facilities Management", priority: "High", status: "Assigned", location: "Floor 1 — Stairwell B", desk: "", date: "10 Jul 2024", staffName: "Ahmad Fadzli", staffId: "DRV-04001", assetTag: "", assetModel: "", description: "A carpet tile has come loose near Stairwell B and is a clear trip hazard.", technician: "Aisha Kamara", thread: [{ type:"status", from:"Submitted", to:"Assigned", by:"Aisha Kamara", time:"10 Jul, 08:45", note:"Taped down temporarily. Permanent repair booked." }] },
  ],
  "Melaka, Malaysia": [
    { id: "REQ-2024-030", title: "Wi-Fi dropping on Floor 2 intermittently", category: "Network / Wi-Fi", dept: "IT Admin", priority: "Medium", status: "In Progress", location: "Floor 2 — Open Plan", desk: "", date: "7 Jul 2024", staffName: "Lim Boon Keat", staffId: "DRV-02503", assetTag: "", assetModel: "", description: "Wi-Fi drops for everyone on Floor 2 about every 20 minutes. Reconnects after 1–2 minutes.", technician: "Sarah Tan", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Sarah Tan", time:"7 Jul, 11:00", note:"" }, { type:"comment", by:"Sarah Tan", time:"7 Jul, 14:00", note:"Access point firmware updated. Monitoring for stability.", internal:false }] },
    { id: "REQ-2024-031", title: "Broken window blind in meeting room", category: "Facilities / Fixtures", dept: "Facilities Management", priority: "Low", status: "Resolved", location: "Floor 1 — Meeting Room A", desk: "", date: "5 Jul 2024", staffName: "Nurul Huda", staffId: "DRV-02211", assetTag: "", assetModel: "", description: "The roller blind in Meeting Room A won't roll back up.", technician: "Tom Reyes", thread: [{ type:"status", from:"Submitted", to:"Resolved", by:"Tom Reyes", time:"6 Jul, 11:00", note:"Blind mechanism replaced." }] },
  ],
  "Limassol, Cyprus": [
    { id: "REQ-2024-040", title: "Server room temperature alert", category: "Infrastructure", dept: "IT Admin", priority: "Critical", status: "Assigned", location: "Ground Floor — Data Centre", desk: "", date: "10 Jul 2024", staffName: "Nikos Papadopoulos", staffId: "DRV-05012", assetTag: "DRV-IT-00701", assetModel: "APC Cooling Unit CR020", description: "Temperature monitoring dashboard showing 34°C in the server room. Threshold is 28°C.", technician: "Priya Nair", thread: [{ type:"status", from:"Submitted", to:"Assigned", by:"Priya Nair", time:"10 Jul, 06:55", note:"Critical escalation. On-site within 30 mins." }, { type:"comment", by:"Priya Nair", time:"10 Jul, 07:30", note:"Cooling unit fan seized. Emergency bypass enabled. Monitoring.", internal:true }] },
    { id: "REQ-2024-041", title: "Slippery floor near fire exit", category: "Safety / Hazard", dept: "Facilities Management", priority: "Critical", status: "In Progress", location: "Floor 1 — Fire Exit Corridor", desk: "", date: "10 Jul 2024", staffName: "Elena Georgiou", staffId: "DRV-04788", assetTag: "", assetModel: "", description: "The floor by the fire exit is very slippery after the cleaner used the wrong product. Someone nearly fell.", technician: "Peter Müller", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Peter Müller", time:"10 Jul, 08:00", note:"Warning signs placed immediately. Deep clean with correct product underway." }] },
    { id: "REQ-2024-042", title: "Meeting room AV setup for all-hands call", category: "Meeting Rooms", dept: "Office Admin", priority: "High", status: "Resolved", location: "Floor 3 — Conference Suite", desk: "", date: "8 Jul 2024", staffName: "Stavros Andreou", staffId: "DRV-03345", assetTag: "", assetModel: "", description: "Need the conference suite fully set up for an all-hands video call — camera, mics, screen sharing tested.", technician: "Yuki Tanaka", thread: [{ type:"status", from:"Submitted", to:"Resolved", by:"Yuki Tanaka", time:"8 Jul, 17:00", note:"AV fully configured and tested. Call ran without issues." }] },
    { id: "REQ-2024-043", title: "MFA reset required for returning employee", category: "Access / Security", dept: "IT Admin", priority: "Medium", status: "Resolved", location: "Floor 1 — HR Area", desk: "", date: "7 Jul 2024", staffName: "Maria Constantinou", staffId: "DRV-01830", assetTag: "", assetModel: "", description: "Employee returning from parental leave — MFA authenticator app no longer linked to their account.", technician: "James Okonkwo", thread: [{ type:"status", from:"Submitted", to:"Resolved", by:"James Okonkwo", time:"7 Jul, 15:00", note:"MFA reset completed. User confirmed access restored." }] },
  ],
  "Nicosia, Cyprus": [
    { id: "REQ-2024-050", title: "New hire laptop setup — engineering team", category: "Hardware", dept: "IT Admin", priority: "High", status: "In Progress", location: "Floor 12 — Engineering Wing", desk: "", date: "9 Jul 2024", staffName: "Christos Ioannou", staffId: "DRV-05201", assetTag: "DRV-IT-00890", assetModel: "MacBook Pro 14\" M3", description: "3 new engineers starting Monday. Need MacBooks configured with dev tools, GitHub access, and VPN.", technician: "Sarah Tan", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Sarah Tan", time:"9 Jul, 09:00", note:"" }, { type:"comment", by:"Sarah Tan", time:"9 Jul, 15:00", note:"2 of 3 laptops configured. Final unit awaiting IT security approval.", internal:false }] },
    { id: "REQ-2024-051", title: "Standing desk motor not working", category: "Furniture / Fixtures", dept: "Facilities Management", priority: "Medium", status: "Submitted", location: "Floor 12 — Open Plan", desk: "Desk 12-08", date: "10 Jul 2024", staffName: "Anna Petrou", staffId: "DRV-05104", assetTag: "DRV-FAC-00214", assetModel: "Flexispot E7 Standing Desk", description: "The electric motor on my standing desk stopped responding. Control panel shows no lights.", technician: "Unassigned", thread: [{ type:"status", from:"Submitted", to:"Submitted", by:"System", time:"10 Jul, 11:00", note:"Awaiting assignment." }] },
    { id: "REQ-2024-052", title: "GitHub access for new DevOps engineer", category: "Software Access", dept: "IT Admin", priority: "Medium", status: "In Progress", location: "Floor 12 — Engineering", desk: "", date: "9 Jul 2024", staffName: "Demetrios Vasiliou", staffId: "DRV-05198", assetTag: "", assetModel: "", description: "New DevOps engineer needs access to deriv-com org on GitHub, including infra and deployment repos.", technician: "Priya Nair", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Priya Nair", time:"9 Jul, 13:00", note:"" }, { type:"comment", by:"Priya Nair", time:"9 Jul, 14:30", note:"Access provisioned for public repos. Restricted repos require team-lead approval — request sent.", internal:false }] },
  ],
  "Birkirkara, Malta": [
    { id: "REQ-2024-060", title: "Outlook calendar sync broken for 3 users", category: "Software / M365", dept: "IT Admin", priority: "High", status: "Assigned", location: "Level 3 — Finance Team", desk: "", date: "10 Jul 2024", staffName: "Marco Borg", staffId: "DRV-04601", assetTag: "", assetModel: "", description: "Three members of the finance team can't see shared calendars or meeting invites in Outlook since this morning.", technician: "James Okonkwo", thread: [{ type:"status", from:"Submitted", to:"Assigned", by:"James Okonkwo", time:"10 Jul, 09:30", note:"Investigating M365 tenant sync issue." }] },
    { id: "REQ-2024-061", title: "Coffee machine broken — Level 3 kitchen", category: "Kitchen Appliances", dept: "Office Admin", priority: "High", status: "In Progress", location: "Level 3 — Kitchen", desk: "", date: "8 Jul 2024", staffName: "Claire Farrugia", staffId: "DRV-03890", assetTag: "DRV-ADM-00045", assetModel: "De'Longhi ECAM 450.55", description: "Coffee machine making grinding noise then shutting off. No coffee dispensed.", technician: "Clara Santos", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Clara Santos", time:"8 Jul, 10:00", note:"" }, { type:"comment", by:"Clara Santos", time:"8 Jul, 11:00", note:"Engineer contacted. Grinder unit needs replacement. Parts on order — ETA 2 days.", internal:false }] },
    { id: "REQ-2024-062", title: "Ergonomic chair replacement on medical advice", category: "Furniture / Fixtures", dept: "Office Admin", priority: "Medium", status: "Submitted", location: "Level 3 — Open Plan", desk: "Desk 3-19", date: "10 Jul 2024", staffName: "Joseph Mifsud", staffId: "DRV-04102", assetTag: "", assetModel: "", description: "My GP has recommended a lumbar-support chair due to lower back issues. HR have approved. Need Facilities to source one.", technician: "Unassigned", thread: [{ type:"status", from:"Submitted", to:"Submitted", by:"System", time:"10 Jul, 08:00", note:"Awaiting assignment." }] },
  ],
  "London, UK": [
    { id: "REQ-2024-070", title: "New Slack workspace access for contractors", category: "Software Access", dept: "IT Admin", priority: "Medium", status: "Assigned", location: "Floor 1 — Workspace", desk: "", date: "8 Jul 2024", staffName: "Sophie Clarke", staffId: "DRV-06011", assetTag: "", assetModel: "", description: "Four external contractors starting Monday need guest access to our Slack workspace (specific channels only).", technician: "Sarah Tan", thread: [{ type:"status", from:"Submitted", to:"Assigned", by:"Sarah Tan", time:"8 Jul, 14:00", note:"Setting up guest invites — will send by EOD." }] },
    { id: "REQ-2024-071", title: "Broken coffee grinder in kitchen", category: "Kitchen Appliances", dept: "Office Admin", priority: "Low", status: "Submitted", location: "Floor 1 — Kitchen", desk: "", date: "10 Jul 2024", staffName: "Tom Harrington", staffId: "DRV-05877", assetTag: "DRV-ADM-00088", assetModel: "Sage BCG820BSS", description: "The coffee grinder blade has snapped. Machine won't run at all.", technician: "Unassigned", thread: [{ type:"status", from:"Submitted", to:"Submitted", by:"System", time:"10 Jul, 09:00", note:"Awaiting assignment." }] },
    { id: "REQ-2024-072", title: "Fire safety equipment annual inspection due", category: "Safety / Compliance", dept: "Facilities Management", priority: "High", status: "Assigned", location: "All Floors", desk: "", date: "7 Jul 2024", staffName: "Fiona Walsh", staffId: "DRV-05501", assetTag: "", assetModel: "", description: "Annual fire extinguisher and alarm panel inspection is overdue by 2 weeks. Compliance deadline this Friday.", technician: "Aisha Kamara", thread: [{ type:"status", from:"Submitted", to:"Assigned", by:"Aisha Kamara", time:"7 Jul, 13:00", note:"Inspection company booked for Thursday. All floors to be covered." }] },
  ],
  "Reading, UK": [
    { id: "REQ-2024-080", title: "Docking station not charging laptop", category: "Hardware", dept: "IT Admin", priority: "Medium", status: "Resolved", location: "Ground Floor — Open Plan", desk: "Desk G-14", date: "6 Jul 2024", staffName: "Amelia Cox", staffId: "DRV-05741", assetTag: "DRV-IT-00641", assetModel: "Dell WD22TB4 Thunderbolt Dock", description: "Docking station stopped charging my laptop. Also the USB-C video output isn't working.", technician: "James Okonkwo", thread: [{ type:"status", from:"Submitted", to:"Resolved", by:"James Okonkwo", time:"6 Jul, 16:00", note:"Faulty dock replaced from stock. All ports confirmed working." }] },
    { id: "REQ-2024-081", title: "Cleaning quality complaint — washrooms", category: "Cleaning", dept: "Office Admin", priority: "Medium", status: "In Progress", location: "Ground Floor — Washrooms", desk: "", date: "9 Jul 2024", staffName: "Daniel Hughes", staffId: "DRV-05812", assetTag: "", assetModel: "", description: "Washrooms have not been cleaned to standard for 3 consecutive days. Soap dispensers empty, bins overflowing.", technician: "Clara Santos", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Clara Santos", time:"9 Jul, 09:30", note:"Cleaning contractor notified. Additional deep clean scheduled for today." }] },
  ],
  "Paris, France": [
    { id: "REQ-2024-090", title: "Access badge not reading on main door", category: "Access / Security", dept: "Facilities Management", priority: "High", status: "In Progress", location: "Ground Floor — Main Entrance", desk: "", date: "9 Jul 2024", staffName: "Lucie Moreau", staffId: "DRV-07001", assetTag: "", assetModel: "", description: "My badge stopped working on the main entrance reader. Works on internal doors. Started after badge was demagnetised near phone.", technician: "Aisha Kamara", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Aisha Kamara", time:"9 Jul, 08:30", note:"" }, { type:"comment", by:"Aisha Kamara", time:"9 Jul, 09:00", note:"Badge reprogrammed at security desk. Testing on door readers now.", internal:false }] },
    { id: "REQ-2024-091", title: "Monitor not detected after docking station update", category: "Monitor / Display", dept: "IT Admin", priority: "Medium", status: "Resolved", location: "Floor 1 — Open Plan", desk: "Desk 1-11", date: "7 Jul 2024", staffName: "Pierre Dupont", staffId: "DRV-07105", assetTag: "DRV-IT-00712", assetModel: "LG 27UK850-W", description: "After a docking station firmware update, my external monitor is no longer being detected.", technician: "Sarah Tan", thread: [{ type:"status", from:"Submitted", to:"Resolved", by:"Sarah Tan", time:"7 Jul, 15:30", note:"Display driver rolled back to previous version. Monitor recognised correctly." }] },
  ],
  "Berlin, Germany": [
    { id: "REQ-2024-100", title: "Pest sighting in pantry area", category: "Pest Control", dept: "Facilities Management", priority: "Critical", status: "In Progress", location: "Floor 1 — Pantry", desk: "", date: "8 Jul 2024", staffName: "Klaus Weber", staffId: "DRV-08001", assetTag: "", assetModel: "", description: "A mouse was spotted in the pantry area this morning. Food storage is at risk.", technician: "Peter Müller", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Peter Müller", time:"8 Jul, 08:00", note:"Pest control team called. Treatment scheduled today. Pantry closed until clear." }] },
    { id: "REQ-2024-101", title: "Password reset — locked out after holiday", category: "Access / Security", dept: "IT Admin", priority: "High", status: "Resolved", location: "Floor 1 — Open Plan", desk: "Desk 1-03", date: "8 Jul 2024", staffName: "Anna Becker", staffId: "DRV-07890", assetTag: "", assetModel: "", description: "Locked out of my account after returning from 3-week holiday. Password expired while I was away.", technician: "James Okonkwo", thread: [{ type:"status", from:"Submitted", to:"Resolved", by:"James Okonkwo", time:"8 Jul, 09:30", note:"Account unlocked and password reset via verified identity check." }] },
  ],
  "Guernsey, Channel Islands": [
    { id: "REQ-2024-110", title: "Printer offline — Floor 1", category: "Printer / Scanner", dept: "IT Admin", priority: "Medium", status: "Resolved", location: "Floor 1 — Finance", desk: "", date: "6 Jul 2024", staffName: "Emily Le Page", staffId: "DRV-09001", assetTag: "DRV-IT-00810", assetModel: "Canon imageRUNNER C3125i", description: "Network printer on Floor 1 shows offline since yesterday. Restarting didn't help.", technician: "Priya Nair", thread: [{ type:"status", from:"Submitted", to:"Resolved", by:"Priya Nair", time:"6 Jul, 14:00", note:"Network port reconfigured on switch. Printer confirmed online." }] },
    { id: "REQ-2024-111", title: "AC unit making loud noise during working hours", category: "HVAC / Air Conditioning", dept: "Facilities Management", priority: "Medium", status: "In Progress", location: "Floor 1 — Open Plan", desk: "", date: "9 Jul 2024", staffName: "Matthew Dorey", staffId: "DRV-09102", assetTag: "DRV-FAC-00301", assetModel: "Mitsubishi MSZ-AP35VGK", description: "The ceiling AC unit is making a loud rattling noise. Very disruptive to open-plan work.", technician: "Tom Reyes", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Tom Reyes", time:"9 Jul, 11:00", note:"Fan blade loose inside unit. HVAC engineer attending Monday morning." }] },
  ],
  "Singapore": [
    { id: "REQ-2024-120", title: "Monitor flickering on trading workstation", category: "Monitor / Display", dept: "IT Admin", priority: "High", status: "In Progress", location: "Floor 3 — Trading Floor", desk: "Desk 3-06", date: "9 Jul 2024", staffName: "Wei Jing Tan", staffId: "DRV-10201", assetTag: "DRV-IT-00920", assetModel: "Bloomberg Terminal Monitor", description: "The primary trading monitor is flickering every few seconds. Unacceptable during live market hours.", technician: "Sarah Tan", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Sarah Tan", time:"9 Jul, 07:30", note:"" }, { type:"comment", by:"Sarah Tan", time:"9 Jul, 08:00", note:"Display cable replaced. Monitoring for recurrence before confirming resolved.", internal:false }] },
    { id: "REQ-2024-121", title: "Refrigerator not cooling — Floor 2 pantry", category: "Kitchen Appliances", dept: "Facilities Management", priority: "High", status: "Assigned", location: "Floor 2 — Pantry", desk: "", date: "10 Jul 2024", staffName: "Jasmine Loh", staffId: "DRV-10345", assetTag: "DRV-FAC-00189", assetModel: "Panasonic NR-BX468", description: "Fridge in the Floor 2 pantry not cooling. Staff food is spoiling.", technician: "Aisha Kamara", thread: [{ type:"status", from:"Submitted", to:"Assigned", by:"Aisha Kamara", time:"10 Jul, 09:00", note:"Appliance repair company called. Visit scheduled this afternoon." }] },
    { id: "REQ-2024-122", title: "Request for visitor desk setup — 2 days", category: "Meeting Rooms", dept: "Office Admin", priority: "Medium", status: "Resolved", location: "Floor 2 — Hot Desk Area", desk: "", date: "7 Jul 2024", staffName: "Jin Hui Koh", staffId: "DRV-10112", assetTag: "", assetModel: "", description: "Two visitors from Limassol arriving Thursday–Friday. Need hot desks with monitor, keyboard, and guest Wi-Fi access.", technician: "Yuki Tanaka", thread: [{ type:"status", from:"Submitted", to:"Resolved", by:"Yuki Tanaka", time:"7 Jul, 16:00", note:"Desks configured with peripherals and guest Wi-Fi credentials prepared." }] },
  ],
  "Dubai – JLT, UAE": [
    { id: "REQ-2024-130", title: "Access card not working on main floor", category: "Access / Security", dept: "Facilities Management", priority: "High", status: "In Progress", location: "Floor 6 — Main Door", desk: "", date: "9 Jul 2024", staffName: "Khalid Al-Rashid", staffId: "DRV-11001", assetTag: "", assetModel: "", description: "My access card gives 3 beeps and flashes red on the Floor 6 door reader. All other floors work fine.", technician: "Peter Müller", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Peter Müller", time:"9 Jul, 08:45", note:"Card reprogrammed at security desk. Testing now." }] },
    { id: "REQ-2024-131", title: "Broken chair — trading desk area", category: "Furniture / Fixtures", dept: "Facilities Management", priority: "Medium", status: "Submitted", location: "Floor 6 — Trading Area", desk: "Desk 6-04", date: "10 Jul 2024", staffName: "Fatima Al-Zaabi", staffId: "DRV-11203", assetTag: "", assetModel: "", description: "Chair backrest has snapped. Sitting on it is dangerous.", technician: "Unassigned", thread: [{ type:"status", from:"Submitted", to:"Submitted", by:"System", time:"10 Jul, 08:30", note:"Awaiting assignment." }] },
  ],
  "Dubai – Business Bay, UAE": [
    { id: "REQ-2024-140", title: "Outlook calendar sync broken for team", category: "Software / M365", dept: "IT Admin", priority: "High", status: "Assigned", location: "Floor 2 — Open Plan", desk: "", date: "10 Jul 2024", staffName: "Hassan Ibrahim", staffId: "DRV-11401", assetTag: "", assetModel: "", description: "Entire trading operations team (6 people) can't see shared Outlook calendars since this morning.", technician: "Priya Nair", thread: [{ type:"status", from:"Submitted", to:"Assigned", by:"Priya Nair", time:"10 Jul, 09:15", note:"Investigating M365 Exchange sync issue." }] },
    { id: "REQ-2024-141", title: "Water dispenser leaking near reception", category: "Plumbing / Water", dept: "Facilities Management", priority: "High", status: "Open", location: "Floor 2 — Reception", desk: "", date: "10 Jul 2024", staffName: "Nour Khalil", staffId: "DRV-11589", assetTag: "", assetModel: "", description: "The floor-standing water dispenser is leaking from the base. Puddle forming on the floor.", technician: "Unassigned", thread: [{ type:"status", from:"Submitted", to:"Submitted", by:"System", time:"10 Jul, 10:00", note:"Awaiting assignment." }] },
  ],
  "Asunción, Paraguay": [
    { id: "REQ-2024-150", title: "UPS check required before generator test", category: "Infrastructure", dept: "Facilities Management", priority: "High", status: "Assigned", location: "Ground Floor — Plant Room", desk: "", date: "8 Jul 2024", staffName: "Carlos Benítez", staffId: "DRV-12001", assetTag: "DRV-FAC-00402", assetModel: "APC Smart-UPS 3000VA", description: "Monthly generator test on Friday. Need UPS batteries inspected first to ensure failover is reliable.", technician: "Tom Reyes", thread: [{ type:"status", from:"Submitted", to:"Assigned", by:"Tom Reyes", time:"8 Jul, 10:00", note:"UPS inspection booked for Thursday." }] },
    { id: "REQ-2024-151", title: "New employee laptop setup — 3 units", category: "Hardware", dept: "IT Admin", priority: "High", status: "In Progress", location: "Floor 1 — IT Storeroom", desk: "", date: "9 Jul 2024", staffName: "Ana González", staffId: "DRV-12110", assetTag: "DRV-IT-01001", assetModel: "Lenovo ThinkPad E14", description: "Three new hires starting Monday. Laptops need Windows, M365, Slack, VPN, and company MDM profile.", technician: "James Okonkwo", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"James Okonkwo", time:"9 Jul, 08:00", note:"" }, { type:"comment", by:"James Okonkwo", time:"9 Jul, 15:00", note:"2 of 3 laptops configured. Final unit awaiting MDM enrolment.", internal:false }] },
  ],
  "Ciudad del Este, Paraguay": [
    { id: "REQ-2024-160", title: "Wi-Fi signal weak on second floor", category: "Network / Wi-Fi", dept: "IT Admin", priority: "Medium", status: "In Progress", location: "Floor 2 — Open Plan", desk: "", date: "9 Jul 2024", staffName: "Jorge Ramírez", staffId: "DRV-12301", assetTag: "", assetModel: "", description: "Wi-Fi on Floor 2 is very slow and frequently disconnects. Floor 1 is fine.", technician: "Sarah Tan", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Sarah Tan", time:"9 Jul, 10:00", note:"Additional access point being installed on Floor 2." }] },
    { id: "REQ-2024-161", title: "Ceiling light flickering — safety concern", category: "Electrical", dept: "Facilities Management", priority: "High", status: "Submitted", location: "Floor 1 — Corridor", desk: "", date: "10 Jul 2024", staffName: "María Valdez", staffId: "DRV-12415", assetTag: "", assetModel: "", description: "The fluorescent light in the main corridor flickers constantly. Could trigger photosensitive conditions.", technician: "Unassigned", thread: [{ type:"status", from:"Submitted", to:"Submitted", by:"System", time:"10 Jul, 08:00", note:"Awaiting assignment." }] },
  ],
  "George Town, Cayman Islands": [
    { id: "REQ-2024-170", title: "AC unit making loud noise overnight", category: "HVAC / Air Conditioning", dept: "Facilities Management", priority: "Medium", status: "In Progress", location: "Floor 1 — Open Plan", desk: "", date: "9 Jul 2024", staffName: "Marcus Reid", staffId: "DRV-13001", assetTag: "DRV-FAC-00501", assetModel: "Carrier 42GW Series", description: "The AC has started making a loud banging noise during after-hours. Security guards have reported it too.", technician: "Aisha Kamara", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Aisha Kamara", time:"9 Jul, 12:00", note:"Fan blade loose. HVAC engineer booked for Monday morning." }] },
    { id: "REQ-2024-171", title: "Visitor Wi-Fi network not broadcasting", category: "Network / Wi-Fi", dept: "IT Admin", priority: "Medium", status: "Resolved", location: "Ground Floor — Reception", desk: "", date: "7 Jul 2024", staffName: "Camille Ebanks", staffId: "DRV-13108", assetTag: "", assetModel: "", description: "The guest Wi-Fi SSID has disappeared. Visitors can't connect.", technician: "James Okonkwo", thread: [{ type:"status", from:"Submitted", to:"Resolved", by:"James Okonkwo", time:"7 Jul, 14:00", note:"Router restarted and guest SSID restored. Password unchanged." }] },
  ],
  "Port Vila, Vanuatu": [
    { id: "REQ-2024-180", title: "Desk phone not connecting to office line", category: "Telephony", dept: "IT Admin", priority: "Medium", status: "In Progress", location: "Floor 1 — Open Plan", desk: "Desk 1-02", date: "9 Jul 2024", staffName: "James Tarileo", staffId: "DRV-14001", assetTag: "DRV-IT-01101", assetModel: "Cisco IP Phone 8841", description: "Desk phone shows 'Unregistered' and can't dial in or out.", technician: "Priya Nair", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Priya Nair", time:"9 Jul, 09:00", note:"VOIP registration settings being reconfigured remotely." }] },
  ],
  "Kigali, Rwanda": [
    { id: "REQ-2024-190", title: "Power outage backup — UPS battery check", category: "Infrastructure", dept: "Facilities Management", priority: "High", status: "Assigned", location: "Ground Floor — Server Room", desk: "", date: "8 Jul 2024", staffName: "Jean-Pierre Habimana", staffId: "DRV-15001", assetTag: "DRV-FAC-00601", assetModel: "Eaton 5P 1550i UPS", description: "We've had two power cuts this week. Need UPS batteries checked to ensure they can hold during outages.", technician: "Tom Reyes", thread: [{ type:"status", from:"Submitted", to:"Assigned", by:"Tom Reyes", time:"8 Jul, 11:00", note:"Battery capacity test scheduled. Replacement units on standby." }] },
    { id: "REQ-2024-191", title: "New hire onboarding — laptop and access setup", category: "Hardware", dept: "IT Admin", priority: "Medium", status: "In Progress", location: "Floor 1 — HR Area", desk: "", date: "10 Jul 2024", staffName: "Amina Uwimana", staffId: "DRV-15102", assetTag: "DRV-IT-01201", assetModel: "HP EliteBook 840 G9", description: "New team member starting today. Laptop, email, Slack, VPN and M365 all need to be ready.", technician: "Sarah Tan", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Sarah Tan", time:"10 Jul, 08:00", note:"Laptop configured. Access provisioning in progress." }] },
  ],
  "Mauritius": [
    { id: "REQ-2024-200", title: "Office setup for new Mauritius team", category: "Furniture / Fixtures", dept: "Office Admin", priority: "High", status: "In Progress", location: "Floor 1 — Open Plan", desk: "", date: "10 Jul 2024", staffName: "Priya Gopal", staffId: "DRV-16001", assetTag: "", assetModel: "", description: "New Mauritius office opening this week. Need 8 desks, chairs, and monitors set up before Monday.", technician: "Yuki Tanaka", thread: [{ type:"status", from:"Submitted", to:"In Progress", by:"Yuki Tanaka", time:"10 Jul, 07:00", note:"Desks and chairs delivered. IT setup underway." }] },
    { id: "REQ-2024-201", title: "Internet connectivity intermittent", category: "Network / ISP", dept: "IT Admin", priority: "Critical", status: "Assigned", location: "Floor 1 — Server Room", desk: "", date: "10 Jul 2024", staffName: "Kevin Ramdhun", staffId: "DRV-16089", assetTag: "", assetModel: "", description: "Internet dropping every 5–10 minutes. Unusable for work. ISP circuit may be faulty.", technician: "James Okonkwo", thread: [{ type:"status", from:"Submitted", to:"Assigned", by:"James Okonkwo", time:"10 Jul, 09:00", note:"ISP notified. Engineer visiting tomorrow morning." }] },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function priorityCfg(p: string) {
  const cfgMap: Record<string, { bg: string; color: string; dot: string; icon: string }> = {
    Critical: { bg: "#FFF0F1", color: C.coral,   dot: C.coral,   icon: "⚡" },
    High:     { bg: "#FFF7ED", color: "#C05000",  dot: "#F97316", icon: "" },
    Medium:   { bg: "#FFFBEB", color: "#92600A",  dot: "#F59E0B", icon: "" },
    Low:      { bg: "#E8FAF3", color: "#065F46",  dot: C.green,   icon: "" },
  };
  return cfgMap[p] || { bg: C.bg, color: C.textSub, dot: C.textMuted, icon: "" };
}

function statusCfg(s: string) {
  const cfgMap: Record<string, { bg: string; color: string; dot: string }> = {
    Submitted:     { bg: "#EBF3FF", color: C.blue,    dot: C.blue },
    Assigned:      { bg: "#EBF3FF", color: C.blue,    dot: C.blue },
    Open:          { bg: "#EBF3FF", color: C.blue,    dot: C.blue },
    "In Progress": { bg: C.amberLight, color: C.amber, dot: C.amber },
    Resolved:      { bg: C.greenLight,  color: "#065F46", dot: C.green },
    Closed:        { bg: "#F1F3F7",    color: C.textSub, dot: C.textMuted },
    Overdue:       { bg: C.redLight,   color: C.coral,   dot: C.coral },
  };
  return cfgMap[s] || { bg: "#F1F3F7", color: C.textSub, dot: C.textMuted };
}

function PriBadge({ p }: { p: string }) {
  const cfg = priorityCfg(p);
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 11px", borderRadius:20, background:cfg.bg, color:cfg.color, fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
      {cfg.icon && <span>{cfg.icon}</span>}{p}
    </span>
  );
}

function StaBadge({ s }: { s: string }) {
  const cfg = statusCfg(s);
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:20, background:cfg.bg, color:cfg.color, fontSize:12, fontWeight:600, whiteSpace:"nowrap" }}>
      <span style={{ width:7, height:7, borderRadius:"50%", background:cfg.dot, flexShrink:0 }} />{s}
    </span>
  );
}

// ─── Toast notification ───────────────────────────────────────────────────────
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  React.useEffect(() => {
    const t = setTimeout(onDone, 3600);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{ position:"fixed", bottom:28, right:28, zIndex:999, background:C.slate, color: currentTheme === "dark" ? "#0F172A" : "#fff", padding:"14px 22px", borderRadius:14, fontSize:13, fontWeight:600, boxShadow:"0 8px 32px rgba(0,0,0,0.25)", display:"flex", alignItems:"center", gap:10, maxWidth:360, animation:"slideup 0.25s ease" }}>
      <span style={{ fontSize:18 }}>✉️</span>
      <span>{msg}</span>
    </div>
  );
}

// ─── Portal selector ──────────────────────────────────────────────────────────
const PORTALS = [
  { id:"staff",      label:"Staff Member",         desc:"Submit and track your repair or maintenance requests",         icon:"👤", iconBg:C.slate },
  { id:"it",         label:"IT Admin",             desc:"Manage technology, software, and hardware requests",           icon:"💻", iconBg:C.purple },
  { id:"facilities", label:"Facilities Management", desc:"Handle physical space, equipment, and infrastructure issues",  icon:"🔧", iconBg:"#0F766E" },
  { id:"admin",      label:"Office Admin",          desc:"Process administrative requests, supplies, and general tasks", icon:"📋", iconBg:"#475569" },
  { id:"hr",         label:"HR Team",               desc:"Raise confidential complaints, request consultations, and track grievances", icon:"💼", iconBg:"#8B5CF6" },
  { id:"compliance", label:"Compliance team",       desc:"Anonymous whistleblower gateway. Report misconduct with zero identity leaks", icon:"🛡️", iconBg:"#DC2626" },
];

// ─── Deriv Global Office Locations with Neon Landmarks ────────────────────────
const NEON_LOCATIONS = [
  {
    country: "CYPRUS",
    city: "Limassol",
    flag: "🇨🇾",
    staff: "142 Staff",
    image: neonCyprus,
    color: "#F97316", // Vibrant orange
    shadow: "rgba(249,115,22,0.35)",
    officeValue: "Limassol, Cyprus"
  },
  {
    country: "MALTA",
    city: "St. Julian's",
    flag: "🇲🇹",
    staff: "128 Staff",
    image: neonMalta,
    color: "#EC4899", // Glowing pink
    shadow: "rgba(236,72,153,0.35)",
    officeValue: "Birkirkara, Malta"
  },
  {
    country: "RWANDA",
    city: "Kigali",
    flag: "🇷🇼",
    staff: "156 Staff",
    image: neonRwanda,
    color: "#10B981", // Emerald green
    shadow: "rgba(16,185,129,0.35)",
    officeValue: "Kigali, Rwanda"
  },
  {
    country: "MALAYSIA",
    city: "Cyberjaya",
    flag: "🇲🇾",
    staff: "198 Staff",
    image: neonMalaysia,
    color: "#3B82F6", // Cyan blue
    shadow: "rgba(59,130,246,0.35)",
    officeValue: "Cyberjaya, Malaysia (HQ)"
  },
  {
    country: "PARAGUAY",
    city: "Asunción",
    flag: "🇵🇾",
    staff: "96 Staff",
    image: neonParaguay,
    color: "#EF4444", // Neon red
    shadow: "rgba(239,68,68,0.35)",
    officeValue: "Asunción, Paraguay"
  },
  {
    country: "UK",
    city: "London",
    flag: "🇬🇧",
    staff: "113 Staff",
    image: neonLondon,
    color: "#EAB308", // Sun yellow
    shadow: "rgba(234,179,8,0.35)",
    officeValue: "London, UK"
  },
  {
    country: "UAE",
    city: "Dubai",
    flag: "🇦🇪",
    staff: "134 Staff",
    image: neonDubai,
    color: "#A855F7", // Purple neon
    shadow: "rgba(168,85,247,0.35)",
    officeValue: "Dubai – JLT, UAE"
  },
  {
    country: "FRANCE",
    city: "Paris",
    flag: "🇫🇷",
    staff: "105 Staff",
    image: neonParis,
    color: "#2563EB", // Blue glow
    shadow: "rgba(37,99,235,0.35)",
    officeValue: "Paris, France"
  },
  {
    country: "GERMANY",
    city: "Berlin",
    flag: "🇩🇪",
    staff: "89 Staff",
    image: neonBerlin,
    color: "#F59E0B", // Amber glow
    shadow: "rgba(245,158,11,0.35)",
    officeValue: "Berlin, Germany"
  },
  {
    country: "GUERNSEY",
    city: "St. Peter Port",
    flag: "🇬🇬",
    staff: "62 Staff",
    image: neonGuernsey,
    color: "#10B981", // Emerald green glow
    shadow: "rgba(16,185,129,0.35)",
    officeValue: "Guernsey, Channel Islands"
  },
  {
    country: "SINGAPORE",
    city: "Singapore",
    flag: "🇸🇬",
    staff: "120 Staff",
    image: neonSingapore,
    color: "#EC4899", // Pink glow
    shadow: "rgba(236,72,153,0.35)",
    officeValue: "Singapore"
  },
  {
    country: "CAYMAN ISLANDS",
    city: "George Town",
    flag: "🇰🇾",
    staff: "45 Staff",
    image: neonCayman,
    color: "#06B6D4", // Cyan glow
    shadow: "rgba(6,182,212,0.35)",
    officeValue: "George Town, Cayman Islands"
  },
  {
    country: "VANUATU",
    city: "Port Vila",
    flag: "🇻🇺",
    staff: "38 Staff",
    image: neonVanuatu,
    color: "#F43F5E", // Rose glow
    shadow: "rgba(244,63,94,0.35)",
    officeValue: "Port Vila, Vanuatu"
  },
  {
    country: "MAURITIUS",
    city: "Port Louis",
    flag: "🇲🇺",
    staff: "55 Staff",
    image: neonMauritius,
    color: "#8B5CF6", // Purple glow
    shadow: "rgba(139,92,246,0.35)",
    officeValue: "Mauritius"
  }
];

function PortalSelector({ onSelect, office, setOffice, theme, toggleTheme }: { onSelect: (id: string) => void; office: string; setOffice: (off: string) => void; theme: "light" | "dark"; toggleTheme: () => void }) {
  const allTickets = Object.values(BASE_TICKETS).flat();
  const activeCount  = allTickets.filter(t => t.status !== "Resolved" && t.status !== "Closed").length;
  const resolvedRate = Math.round(allTickets.filter(t => t.status === "Resolved").length / allTickets.length * 100);
  const [localToast, setLocalToast] = useState("");
  
  const [activeLocationIdx, setActiveLocationIdx] = useState(() => {
    const idx = NEON_LOCATIONS.findIndex(loc => loc.officeValue === office || (loc.officeValue === "Cyberjaya, Malaysia (HQ)" && office.includes("Malaysia")));
    return idx >= 0 ? idx : 3;
  });

  const [isMobile, setIsMobile] = useState(false);
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  React.useEffect(() => {
    const idx = NEON_LOCATIONS.findIndex(loc => loc.officeValue === office || (loc.officeValue === "Cyberjaya, Malaysia (HQ)" && office.includes("Malaysia")));
    if (idx >= 0 && idx !== activeLocationIdx) {
      setActiveLocationIdx(idx);
    }
  }, [office]);

  React.useEffect(() => {
    if (!localToast) return;
    const t = setTimeout(() => setLocalToast(""), 3500);
    return () => clearTimeout(t);
  }, [localToast]);

  return (
    <div style={{ minHeight:"100vh", background: theme === "dark" ? "#0F172A" : "#F4F5F7", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"flex-start", padding:"24px 20px 40px", fontFamily:F, position: "relative", overflowX: "hidden" }}>
      {/* Dynamic Background Grid Mesh */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255, 68, 79, 0.03) 1px, transparent 1px), radial-gradient(rgba(139, 92, 246, 0.02) 1.5px, transparent 1.5px)", backgroundSize: "32px 32px", backgroundPosition: "0 0, 16px 16px", pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "15%", left: "10%", width: "450px", height: "450px", borderRadius: "50%", background: `radial-gradient(circle, ${C.coral}05 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "15%", right: "10%", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${C.purple}05 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0 }} />

      {/* Top Header Bar containing Brand logo and Theme Switcher (Perfect spacing, never overlaps on mobile) */}
      <div style={{
        width: "100%",
        maxWidth: "1000px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 44,
        zIndex: 1,
        padding: "0 4px",
        boxSizing: "border-box",
        gap: 12
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:36, height:36, borderRadius:8, background:C.coral, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 4h9a7 7 0 0 1 0 14H3V4z" fill="white" fillOpacity="0.9"/>
                <circle cx="12" cy="11" r="3.5" fill="white" fillOpacity="0.5"/>
              </svg>
            </div>
            <span style={{ fontFamily:F, fontWeight:800, fontSize:20, color: theme === "dark" ? "#F8FAFC" : "#181C25", letterSpacing:-0.5 }}>Deriv</span>
          </div>
          <div style={{ width:1, height:22, background: theme === "dark" ? "#334155" : "#E4E7ED" }} />
          <span style={{ fontSize:13, color: theme === "dark" ? "#94A3B8" : "#515A70", fontWeight:500, whiteSpace: "nowrap" }}>Office Services</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            padding: "8px 14px",
            borderRadius: 12,
            border: `1.5px solid ${theme === "dark" ? "#334155" : "#E4E7ED"}`,
            background: theme === "dark" ? "#1E293B" : "#FFFFFF",
            color: theme === "dark" ? "#FF444F" : "#181C25",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            boxShadow: theme === "dark" ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
            fontFamily: F,
            transition: "all 0.2s"
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* ─── Iconic Global Locations Section (Moved to the Top) ─────────────────── */}
      <div style={{
        marginBottom: 40,
        width: "100%",
        maxWidth: "1000px",
        background: theme === "dark" ? "#1E293B" : "#FFFFFF",
        borderRadius: 24,
        border: theme === "dark" ? "1.5px solid #334155" : "1.5px solid #E4E7ED",
        padding: "24px 28px",
        boxShadow: theme === "dark" ? "0 12px 36px rgba(15,23,42,0.5)" : "0 4px 20px rgba(0,0,0,0.03)",
        animation: "slideup 0.5s ease-out",
        zIndex: 1,
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="animate-pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF444F", boxShadow: "0 0 12px #FF444F" }} />
            <span style={{ fontSize: 13, fontWeight: 800, color: theme === "dark" ? "#94A3B8" : "#515A70", letterSpacing: "1px", fontFamily: F }}>OUR GLOBAL LOCATIONS</span>
          </div>
          <span style={{ fontSize: 11, color: theme === "dark" ? "#64748B" : "#8E9AA8", fontWeight: 600 }}>Click cards or use arrows to navigate (No rows layout)</span>
        </div>

        <div style={{
          position: "relative",
          height: isMobile ? "220px" : "320px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          overflow: "hidden",
          paddingBottom: "10px"
        }}>
          {/* Glowing Orbit Line */}
          <div style={{
            position: "absolute",
            bottom: isMobile ? "-110px" : "-175px",
            width: isMobile ? "240px" : "680px",
            height: isMobile ? "240px" : "680px",
            borderRadius: "50%",
            border: `1.5px dashed ${theme === "dark" ? "rgba(255, 68, 79, 0.25)" : "rgba(255, 68, 79, 0.15)"}`,
            boxShadow: theme === "dark" ? "0 0 16px rgba(255, 68, 79, 0.05)" : "none",
            pointerEvents: "none",
            left: "50%",
            transform: "translateX(-50%)"
          }} />

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const prevIdx = (activeLocationIdx - 1 + NEON_LOCATIONS.length) % NEON_LOCATIONS.length;
              setActiveLocationIdx(prevIdx);
              setOffice(NEON_LOCATIONS[prevIdx].officeValue);
            }}
            style={{
              position: "absolute",
              left: isMobile ? 0 : 10,
              bottom: "50%",
              transform: "translateY(50%)",
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: theme === "dark" ? "#1E293B" : "#FFFFFF",
              border: `1.5px solid ${theme === "dark" ? "#334155" : "#E4E7ED"}`,
              color: theme === "dark" ? "#F8FAFC" : "#181C25",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 15,
              boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(50%) scale(1.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(50%) scale(1)"; }}
          >
            ←
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              const nextIdx = (activeLocationIdx + 1) % NEON_LOCATIONS.length;
              setActiveLocationIdx(nextIdx);
              setOffice(NEON_LOCATIONS[nextIdx].officeValue);
            }}
            style={{
              position: "absolute",
              right: isMobile ? 0 : 10,
              bottom: "50%",
              transform: "translateY(50%)",
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: theme === "dark" ? "#1E293B" : "#FFFFFF",
              border: `1.5px solid ${theme === "dark" ? "#334155" : "#E4E7ED"}`,
              color: theme === "dark" ? "#F8FAFC" : "#181C25",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 15,
              boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(50%) scale(1.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(50%) scale(1)"; }}
          >
            →
          </button>

          {NEON_LOCATIONS.map((loc, i) => {
            const isSelected = office === loc.officeValue || (loc.officeValue === "Cyberjaya, Malaysia (HQ)" && office.includes("Malaysia"));
            
            // Circular Math
            const total = NEON_LOCATIONS.length;
            let targetDiff = i - activeLocationIdx;
            if (targetDiff > total / 2) targetDiff -= total;
            if (targetDiff < -total / 2) targetDiff += total;

            const isVisible = isMobile ? Math.abs(targetDiff) <= 1 : Math.abs(targetDiff) <= 3;
            const opacity = isVisible ? 1 : 0;
            const zIndex = 10 - Math.abs(targetDiff);

            const angle = targetDiff * (isMobile ? 36 : 22); // Angle of separation
            const rad = (angle * Math.PI) / 180;

            const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 360;
            const radiusX = isMobile ? Math.max(80, Math.min(120, (containerWidth - 60) / 2 - 20)) : 340;
            const radiusY = isMobile ? 35 : 65;

            const tx = Math.sin(rad) * radiusX;
            const ty = (1 - Math.cos(rad)) * radiusY;

            const scale = isVisible ? (targetDiff === 0 ? 1.15 : 1 - Math.abs(targetDiff) * (isMobile ? 0.2 : 0.11)) : 0.5;
            const rot = angle;

            const cardWidth = isMobile ? 100 : 135;
            const cardHeight = isMobile ? 145 : 195;

            return (
              <div
                key={loc.country}
                onClick={() => {
                  setActiveLocationIdx(i);
                  setOffice(loc.officeValue);
                }}
                style={{
                  position: "absolute",
                  left: `calc(50% - ${cardWidth / 2}px)`,
                  bottom: isMobile ? "20px" : "30px",
                  width: cardWidth,
                  height: cardHeight,
                  background: theme === "dark" ? "#1E293B" : "#F8FAFC",
                  borderRadius: 16,
                  border: `1.5px solid ${isSelected ? loc.color : (theme === "dark" ? "#334155" : "#E2E8F0")}`,
                  padding: isMobile ? "8px" : "12px",
                  cursor: "pointer",
                  transition: "all 0.5s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s, box-shadow 0.3s",
                  boxShadow: isSelected ? `0 0 20px ${loc.shadow}` : (theme === "dark" ? "none" : "0 2px 8px rgba(0,0,0,0.03)"),
                  display: "flex",
                  flexDirection: "column",
                  transform: `translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rot}deg)`,
                  opacity: opacity,
                  pointerEvents: isVisible ? "auto" : "none",
                  zIndex: zIndex,
                  overflow: "hidden"
                }}
                className="group"
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = loc.color;
                    e.currentTarget.style.boxShadow = `0 0 12px ${loc.shadow}`;
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = theme === "dark" ? "#334155" : "#E2E8F0";
                    e.currentTarget.style.boxShadow = theme === "dark" ? "none" : "0 2px 8px rgba(0,0,0,0.03)";
                  }
                }}
              >
                {/* Landmark Neon Graphic */}
                <div style={{
                  position: "relative",
                  width: "100%",
                  paddingBottom: "80%",
                  borderRadius: 10,
                  overflow: "hidden",
                  background: theme === "dark" ? "#0F172A" : "#F1F5F9",
                  marginBottom: 8
                }}>
                  <img
                    src={loc.image}
                    alt={`${loc.city} landmark`}
                    referrerPolicy="no-referrer"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.4s ease"
                    }}
                    className="group-hover:scale-110"
                  />
                  <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 60%)"
                  }} />
                </div>

                {/* Info Text */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    {/* Country Header */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}>
                      <span style={{ fontSize: isMobile ? 9 : 10 }}>{loc.flag}</span>
                      <span style={{ fontSize: isMobile ? 8 : 9, fontWeight: 800, color: theme === "dark" ? "#F8FAFC" : "#181C25", letterSpacing: "0.5px" }}>{loc.country}</span>
                    </div>
                    {/* City Subtitle */}
                    <div style={{ fontSize: isMobile ? 10 : 11, color: theme === "dark" ? "#94A3B8" : "#515A70", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{loc.city}</div>
                  </div>

                  {/* Footprint Indicator */}
                  <div style={{
                    marginTop: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: isMobile ? 8 : 9,
                    color: isSelected ? loc.color : (theme === "dark" ? "#64748B" : "#7C8BA1"),
                    fontFamily: "monospace",
                    fontWeight: 700
                  }}>
                    <span>👥</span>
                    <span>{loc.staff}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div style={{ textAlign:"center", marginBottom:40, maxWidth:540, zIndex: 1 }}>
        <h1 className="text-3xl sm:text-[40px]" style={{ fontFamily:F, fontWeight:800, color: theme === "dark" ? "#F8FAFC" : "#181C25", margin:"0 0 14px", letterSpacing:-1, lineHeight: 1.1 }}>Select your portal</h1>
        <p className="text-sm sm:text-base px-2" style={{ color: theme === "dark" ? "#94A3B8" : "#515A70", lineHeight:1.6, margin:0 }}>Choose your role to access the appropriate workspace. Staff submit and track requests; teams manage and resolve them.</p>
      </div>

      <div style={{ marginBottom:36, display:"flex", alignItems:"center", gap:10, background: theme === "dark" ? "#1E293B" : "#FFFFFF", padding:"10px 18px", borderRadius:12, border: theme === "dark" ? "1.5px solid #334155" : "1.5px solid #E4E7ED", zIndex: 1, boxShadow: theme === "dark" ? "none" : "0 4px 12px rgba(0,0,0,0.03)" }}>
        <span style={{ fontSize:16 }}>📍</span>
        <span style={{ fontSize:13, color: theme === "dark" ? "#94A3B8" : "#515A70", fontWeight:500 }}>Your office:</span>
        <select value={office} onChange={e => {
          setOffice(e.target.value);
        }} style={{ border:"none", fontSize:13, background:"transparent", color: theme === "dark" ? "#F8FAFC" : "#181C25", fontFamily:F, fontWeight:700, outline:"none", cursor:"pointer", paddingRight:8 }}>
          {OFFICES.map(o => <option key={o} style={{ background: theme === "dark" ? "#1E293B" : "#FFFFFF", color: theme === "dark" ? "#F8FAFC" : "#181C25" }}>{o}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full" style={{ zIndex: 1 }}>
        {PORTALS.map(p => {
          // Dynamic custom glowing indicators based on portal roles
          const glowColor = p.id === "staff" ? C.coral : p.id === "it" ? C.purple : p.id === "facilities" ? "#0F766E" : p.id === "hr" ? "#8B5CF6" : p.id === "compliance" ? "#DC2626" : "#475569";
          return (
            <div key={p.id} onClick={() => onSelect(p.id)}
              style={{
                background: theme === "dark" ? "#1E293B" : "#FFFFFF",
                borderRadius: 20,
                padding: "28px 28px 24px",
                border: theme === "dark" ? "1.5px solid #334155" : "1.5px solid #E4E7ED",
                cursor: "pointer",
                transition: "all 0.22s cubic-bezier(0.25, 0.8, 0.25, 1)",
                position: "relative",
                boxShadow: theme === "dark" ? "none" : "0 4px 16px rgba(0,0,0,0.02)"
              }}
              onMouseEnter={e => { 
                e.currentTarget.style.borderColor = glowColor; 
                e.currentTarget.style.transform = "translateY(-3px)"; 
                e.currentTarget.style.boxShadow = `0 8px 30px ${glowColor}25`; 
              }}
              onMouseLeave={e => { 
                e.currentTarget.style.borderColor = theme === "dark" ? "#334155" : "#E4E7ED"; 
                e.currentTarget.style.transform = "none"; 
                e.currentTarget.style.boxShadow = theme === "dark" ? "none" : "0 4px 16px rgba(0,0,0,0.02)"; 
              }}>
              <div style={{ position:"absolute", top:24, right:24, color:"#515A70", fontSize:18 }}>→</div>
              <div style={{ width:50, height:50, borderRadius:14, background: `${glowColor}18`, border: `1.5px solid ${glowColor}30`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, marginBottom:16 }}>
                <span style={{ filter: `drop-shadow(0 0 3px ${glowColor})` }}>{p.icon}</span>
              </div>
              <div style={{ fontWeight:700, fontSize:16, color: theme === "dark" ? "#F8FAFC" : "#181C25", marginBottom:8 }}>{p.label}</div>
              <div style={{ fontSize:14, color: theme === "dark" ? "#94A3B8" : "#515A70", lineHeight:1.5 }}>{p.desc}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-8 md:gap-14" style={{ marginBottom: 40, zIndex: 1 }}>
        {[["Active Requests",activeCount,C.coral],["Offices",OFFICES.length, theme === "dark" ? "#F8FAFC" : "#181C25"],["Resolution Rate",`${resolvedRate}%`,C.green]].map(([l,v,col]) => (
          <div key={l as string} style={{ textAlign:"center" }}>
            <div style={{ fontSize:22, fontWeight:800, color:col as string, filter: l === "Active Requests" ? `drop-shadow(0 0 4px ${C.coral}35)` : l === "Resolution Rate" ? `drop-shadow(0 0 4px ${C.green}35)` : "none" }}>{v}</div>
            <div style={{ fontSize:11, color: theme === "dark" ? "#64748B" : "#7C8BA1", letterSpacing:0.8, textTransform:"uppercase", fontWeight:600, marginTop:4 }}>{l as string}</div>
          </div>
        ))}
      </div>



      {/* Floating Interactive Toast */}
      {localToast && (
        <div style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          background: "#181C25",
          border: "1.5px solid #FF444F",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 14,
          fontWeight: 700,
          fontSize: 13,
          boxShadow: "0 8px 32px rgba(255,68,79,0.25)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          animation: "slideup 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
        }}>
          <span style={{ fontSize: 16 }}>🔴</span>
          <span>{localToast}</span>
        </div>
      )}

    </div>
  );
}

// ─── Top bar ──────────────────────────────────────────────────────────────────
function TopBar({ portal, office, onBack, view, setView, onPortalChange, theme, toggleTheme }: { portal: string; office: string; onBack: () => void; view: string; setView: (v: string) => void; onPortalChange: (p: string) => void; theme: "light" | "dark"; toggleTheme: () => void }) {
  const navItems = portal === "staff"
    ? [{ id:"requests", label:"My Requests", icon:"📋" }, { id:"new", label:"New Request", icon:"➕" }]
    : [
        { id:"incoming", label:"Incoming Requests", icon:"📥" },
        { id:"resolved", label:"Resolved", icon:"✅" },
        { id:"dashboard", label:"Dashboard", icon:"📊" }
      ];
  return (
    <div className="bg-[#181C25] border-b border-[#2A3042] px-4 md:px-8 py-3 md:py-2.5 min-h-[56px] flex flex-row flex-wrap items-center justify-between gap-3 sticky top-0 z-20" style={{ fontFamily:F }}>
      {/* Left side: Logo & Portal Selection */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
          <div style={{ width:26, height:26, borderRadius:6, background:C.coral, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
              <path d="M3 4h9a7 7 0 0 1 0 14H3V4z" fill="white" fillOpacity="0.9"/>
              <circle cx="12" cy="11" r="3.5" fill="white" fillOpacity="0.45"/>
            </svg>
          </div>
          <span style={{ fontWeight:800, fontSize:15, color:"#fff", letterSpacing:-0.4 }}>Deriv</span>
          <span className="hidden xs:inline text-[11px] text-[#9AA0B4] font-normal ml-0.5">Office Services</span>
        </div>
        <div className="hidden md:block w-px h-5 bg-[#2A3042]" />
        
        {/* Dynamic Workspace Quick Switcher */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[#9AA0B4] font-bold uppercase tracking-wider hidden sm:inline">Portal:</span>
          <select 
            value={portal} 
            onChange={e => onPortalChange(e.target.value)}
            style={{ background:"#2A3042", color:"#fff", border:`1.5px solid ${C.slateLight}`, borderRadius:6, padding:"3px 8px", fontSize:11, fontWeight:700, fontFamily:F, outline:"none", cursor:"pointer" }}
          >
            <option value="staff">👤 Staff Portal</option>
            <option value="it">💻 IT Admin</option>
            <option value="facilities">🔧 Facilities</option>
            <option value="admin">📋 Office Admin</option>
            <option value="hr">💼 HR Team</option>
            <option value="compliance">🛡️ Compliance team</option>
          </select>
        </div>
      </div>

      {/* Right side: Location & Action buttons */}
      <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
        <div className="hidden sm:flex px-2.5 py-1 rounded-full bg-[#2A3042] text-[#9AA0B4] text-[11px] font-semibold items-center gap-1.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
          <span>📍</span>{office.split(",")[0]}
        </div>
        
        {/* Navigation Items - Scrollable horizontally on narrow screens */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-1 sm:flex-initial min-w-0 -my-1 py-1">
          {navItems.map(n => (
            <button key={n.id} onClick={() => setView(n.id)}
              style={{ padding:"5px 10px", borderRadius:6, border:`1.5px solid ${view===n.id ? C.coral : C.slateMid}`, background:view===n.id ? C.coral : "transparent", color:view===n.id ? "#fff" : "#9AA0B4", fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:F, whiteSpace:"nowrap" }}>
              {n.icon} {n.label}
            </button>
          ))}
          {/* Dynamic Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
            style={{
              padding: "5px 8px",
              borderRadius: 6,
              border: "1.5px solid #2A3042",
              background: "transparent",
              color: "#9AA0B4",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: F,
              whiteSpace: "nowrap"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = C.coral; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2A3042"; e.currentTarget.style.color = "#9AA0B4"; }}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <button onClick={onBack} style={{ padding:"5px 10px", borderRadius:6, border:`1px solid ${C.slateMid}`, background:"transparent", color:"#9AA0B4", fontSize:11, fontWeight: 600, cursor:"pointer", fontFamily:F, whiteSpace:"nowrap" }}>
            ← Portals
          </button>
        </div>
      </div>
    </div>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-11 py-6 md:py-11 box-border" style={{ fontFamily:F }}>
      {children}
    </div>
  );
}

// ─── Preset Common Updates / Steps Taken ──────────────────────────────────────
const STEPS_PRESETS: Record<string, { label: string; text: string }[]> = {
  "IT Admin": [
    { label: "🔍 Diagnosis", text: "We have run hardware/software diagnostics on the device to isolate the root cause." },
    { label: "📦 Parts Ordered", text: "Replacement parts have been ordered from our supplier. Estimated delivery is 2 business days." },
    { label: "⚙️ Patch Applied", text: "We have deployed the latest software patches and firmware upgrades to your machine." },
    { label: "💻 Setup Temp Workstation", text: "A loaner laptop is ready for collection at the IT Service Desk to keep you unblocked." },
    { label: "✅ Fix Complete", text: "We have resolved the issue. Please restart your device and let us know if everything is working." }
  ],
  "Facilities Management": [
    { label: "🔍 Fault Inspected", text: "A facilities coordinator has inspected the reported physical defect on-site." },
    { label: "👷 Contractor Assigned", text: "An external professional contractor has been scheduled to execute repairs." },
    { label: "📦 Materials Sourced", text: "Required replacement materials are being procured from our warehouse/vendors." },
    { label: "🚧 Safety Cordoned", text: "The affected location has been temporarily cordoned off for occupant safety." },
    { label: "✅ Repairs Completed", text: "Physical repair works are finished. The area/equipment is now safe and functional." }
  ],
  "Office Admin": [
    { label: "🔍 Request Reviewed", text: "Administrative services have reviewed your submission and are processing approvals." },
    { label: "📦 Reorder Supplies", text: "Stationery/supplies replenishment order has been placed with our local vendors." },
    { label: "📋 Escalated to HR", text: "This request has been forwarded to the HR and Operations department for processing." },
    { label: "🚚 Courier Dispatched", text: "The requested packages or paperwork have been handed over to our courier." },
    { label: "✅ Supplies Ready", text: "Your requested documents/supplies are ready for pickup at the main administrative office." }
  ]
};

// ─── Smart Department Recommendation Engine ───────────────────────────────────
function getRecommendation(title: string, desc: string): string | null {
  const text = `${title} ${desc}`.toLowerCase();
  
  // IT Admin triggers
  const itKeywords = ["monitor", "display", "screen", "laptop", "pc", "desktop", "mouse", "keyboard", "printer", "wi-fi", "wifi", "internet", "network", "vpn", "slack", "password", "docking", "port", "phishing", "email", "outlook", "m365", "software", "hardware", "device", "cisco", "headset"];
  // Facilities Management triggers
  const facilitiesKeywords = ["ac", "air conditioning", "hvac", "leak", "water", "plumbing", "chair", "desk", "furniture", "light", "flickering light", "pest", "mouse", "room", "boardroom", "conference", "door", "badge", "lock", "key", "ceiling", "pantry", "fridge", "refrigerator", "sink"];
  // Office Admin triggers
  const adminKeywords = ["stationery", "supplies", "replenish", "paper", "pen", "notebook", "office setup", "courier", "package", "documents", "onboarding", "hr", "clearing", "cleaning", "washroom", "soap"];

  const itCount = itKeywords.filter(k => text.includes(k)).length;
  const facCount = facilitiesKeywords.filter(k => text.includes(k)).length;
  const admCount = adminKeywords.filter(k => text.includes(k)).length;

  if (itCount === 0 && facCount === 0 && admCount === 0) return null;

  if (itCount >= facCount && itCount >= admCount) return "IT Admin";
  if (facCount >= itCount && facCount >= admCount) return "Facilities Management";
  return "Office Admin";
}

// ─── TICKET DETAIL PAGE ───────────────────────────────────────────────────────
function TicketDetail({ ticket, onBack, onUpdate, isAdmin }: { ticket: Ticket; onBack: () => void; onUpdate: (updated: Ticket) => void; isAdmin: boolean }) {
  const [newNote, setNewNote]       = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [technicianSel, setTechSel] = useState(ticket.technician);
  const [assignNote, setAssignNote] = useState("");

  const deptsList = ["IT Admin", "Facilities Management", "Office Admin"];
  const initialRedirectDept = deptsList.find(d => d !== ticket.dept) || "IT Admin";
  const [redirectDept, setRedirectDept] = useState(initialRedirectDept);
  const [redirectReason, setRedirectReason] = useState("");

  React.useEffect(() => {
    const defaultDept = ["IT Admin", "Facilities Management", "Office Admin"].find(d => d !== ticket.dept) || "IT Admin";
    setRedirectDept(defaultDept);
    setRedirectReason("");
    setTechSel(ticket.technician);
  }, [ticket.id, ticket.dept, ticket.technician]);

  const recommendedDept = getRecommendation(ticket.title, ticket.description);

  const inp = { width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:14, outline:"none", background:C.card, boxSizing:"border-box", color:C.slate, fontFamily:F };

  const currentIdx = STATUS_FLOW.indexOf(ticket.status);
  const canAdvance = currentIdx < STATUS_FLOW.length - 1;
  const canRevert  = currentIdx > 0;

  function advanceStatus() {
    const next = STATUS_FLOW[currentIdx + 1];
    const entry: ThreadEntry = { type:"status", from:ticket.status, to:next, by:isAdmin ? (ticket.technician !== "Unassigned" ? ticket.technician : "Admin") : "Staff", time:new Date().toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}), note:`Status advanced to ${next}.` };
    onUpdate({ ...ticket, status:next, thread:[...ticket.thread, entry] });
  }

  function revertStatus() {
    const prev = STATUS_FLOW[currentIdx - 1];
    const entry: ThreadEntry = { type:"status", from:ticket.status, to:prev, by:isAdmin ? (ticket.technician !== "Unassigned" ? ticket.technician : "Admin") : "Staff", time:new Date().toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}), note:"Status reverted." };
    onUpdate({ ...ticket, status:prev, thread:[...ticket.thread, entry] });
  }

  function addNote() {
    if (!newNote.trim()) return;
    const entry: ThreadEntry = { type:"comment", by:isAdmin ? (ticket.technician !== "Unassigned" ? ticket.technician : "Admin") : ticket.staffName, time:new Date().toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}), note:newNote.trim(), internal:isInternal };
    onUpdate({ ...ticket, thread:[...ticket.thread, entry] });
    setNewNote("");
  }

  function assignTech() {
    const noteText = assignNote.trim() ? ` Note: ${assignNote.trim()}` : "";
    const entry: ThreadEntry = { type:"status", from:ticket.technician, to:technicianSel, by:"Admin", time:new Date().toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}), note:`Assigned to ${technicianSel}.${noteText}` };
    onUpdate({ 
      ...ticket, 
      technician:technicianSel, 
      status: ticket.status === "Submitted" ? "Assigned" : ticket.status, 
      thread:[...ticket.thread, entry] 
    });
    setAssignNote("");
  }

  const threadVisible = isAdmin ? ticket.thread : ticket.thread.filter(e => !e.internal);

  const threadIcon = (type: string, internal?: boolean) => {
    if (type === "status") return { icon:"🔄", bg:"#F1F3F7", color:C.textSub };
    if (internal)          return { icon:"🔒", bg:C.purpleLight, color:C.purple };
    return                        { icon:"💬", bg:C.blueLight,   color:C.blue };
  };

  const presets = STEPS_PRESETS[ticket.dept] || [];
  const lastTeamComment = [...ticket.thread].reverse().find(e => e.type === "comment" && !e.internal && e.by !== ticket.staffName && e.by !== "Staff");

  return (
    <div>
      {/* Back */}
      <button onClick={onBack} style={{ background:"none", border:"none", color:C.textSub, cursor:"pointer", fontSize:13, padding:0, marginBottom:20, display:"flex", alignItems:"center", gap:6 }}>
        ← Back to list
      </button>

      {/* Independent Portals Tip Ribbon */}
      <div style={{ background:"#FFF8E6", border:"1.5px solid #FFEBAA", borderRadius:12, padding:"12px 18px", display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
        <span style={{ fontSize:18 }}>💡</span>
        <div style={{ fontSize:13, color:"#78350F", lineHeight:1.4 }}>
          <strong>Multi-Role Simulation Guide</strong>: Changes made here reflect instantly. Switch between <strong>Staff</strong> and <strong>Team</strong> portals in the top navigation bar to simulate and verify full bidirectional feedback loop!
        </div>
      </div>

      <div style={{ display:"flex", gap:24, alignItems:"flex-start", flexWrap:"wrap" }}>
        {/* ── LEFT: main thread ── */}
        <div style={{ flex:1, minWidth:"min(320px, 100%)", display:"flex", flexDirection:"column", gap:20 }}>
          {/* Header card */}
          <div style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, padding:"24px 28px" }}>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:12 }}>
              <PriBadge p={ticket.priority} />
              <StaBadge s={ticket.status} />
              <span style={{ fontSize:12, color:C.textMuted, display:"flex", alignItems:"center" }}>{ticket.id} · {ticket.date}</span>
            </div>
            <h2 style={{ fontSize:22, fontWeight:800, color:C.slate, margin:"0 0 10px", lineHeight:1.3 }}>{ticket.title}</h2>
            <div style={{ fontSize:13, color:C.textSub, marginBottom:14 }}>
              {[ticket.category, ticket.dept, ticket.location, ticket.desk].filter(Boolean).join(" · ")}
            </div>
            <div style={{ padding:"14px 16px", background:C.bg, borderRadius:10, fontSize:14, color:C.text, lineHeight:1.65 }}>
              {ticket.description}
            </div>
            {ticket.attachments && ticket.attachments.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize:11, color:C.coral, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>Attachments</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                  {ticket.attachments.map((file, idx) => (
                    <a
                      key={idx}
                      href={file.url || "#"}
                      download={file.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: currentTheme === "dark" ? "#1E293B" : "#F8FAFC",
                        border: `1.5px solid ${C.border}`,
                        borderRadius: 10,
                        padding: "8px 14px",
                        textDecoration: "none",
                        color: C.slate,
                        cursor: "pointer",
                        maxWidth: "280px"
                      }}
                    >
                      <span style={{ fontSize: 18 }}>📄</span>
                      <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.slate, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</span>
                        <span style={{ fontSize: 11, color: C.textMuted }}>{file.size}</span>
                      </div>
                      <span style={{ fontSize: 12, color: C.coral, marginLeft: 4 }}>⬇️</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Staff & Asset info */}
          <div style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, padding:"20px 28px" }}>
            <div style={{ fontSize:11, color:C.coral, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:14 }}>Staff & Asset Details</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
              {[
                ["StaffName", ticket.staffName],
                ["StaffID", ticket.staffId],
                ...(ticket.assetTag  ? [["Asset Tag",  ticket.assetTag ]] : []),
                ...(ticket.assetModel? [["Asset Model",ticket.assetModel]] : []),
              ].map(([lbl,val]) => (
                <div key={lbl}>
                  <div style={{ fontSize:11, color:C.textMuted, fontWeight:600, textTransform:"uppercase", letterSpacing:0.5, marginBottom:3 }}>{lbl === "StaffName" ? "Staff" : lbl === "StaffID" ? "Staff ID" : lbl}</div>
                  <div style={{ fontSize:14, color:C.slate, fontWeight:600 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bidirectional Feedback Message Hub */}
          {!isAdmin ? (
            <div style={{ background:C.card, borderRadius:16, border:`1.5px dashed ${C.coralMid}`, padding:"22px 28px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                <span style={{ fontSize:18 }}>💬</span>
                <span style={{ fontSize:14, fontWeight:700, color:C.slate }}>Message support team / Revert with update</span>
              </div>
              <p style={{ fontSize:13, color:C.textSub, margin:"0 0 12px", lineHeight:1.5 }}>
                Do you have additional information to provide, or want to ask the team for an update? Write a reply below.
              </p>
              <textarea 
                value={newNote} 
                onChange={e => setNewNote(e.target.value)}
                placeholder="Type your reply to the support team here..."
                style={{ ...inp, minHeight:70, resize:"vertical", lineHeight:1.5, marginBottom:12 }} 
              />
              <button 
                onClick={() => {
                  if (!newNote.trim()) return;
                  const entry: ThreadEntry = { 
                    type: "comment", 
                    by: ticket.staffName, 
                    time: new Date().toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }), 
                    note: newNote.trim(), 
                    internal: false 
                  };
                  onUpdate({ ...ticket, thread: [...ticket.thread, entry] });
                  setNewNote("");
                }} 
                disabled={!newNote.trim()}
                style={{ padding:"10px 22px", borderRadius:10, border:"none", background:newNote.trim() ? C.slate : C.border, color:newNote.trim() ? (currentTheme === "dark" ? "#0F172A" : "#fff") : C.textMuted, fontWeight:700, cursor:newNote.trim() ? "pointer" : "not-allowed", fontSize:13, fontFamily:F }}
              >
                Send reply to team
              </button>
            </div>
          ) : null}

          {/* Activity thread */}
          <div style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, padding:"20px 28px" }}>
            <div style={{ fontSize:11, color:C.coral, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:18 }}>
              {isAdmin ? "Activity & Communications Log" : "Steps Taken Timeline"}
            </div>
            
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {threadVisible.map((e, i) => {
                const ic = threadIcon(e.type, e.internal);
                return (
                  <div key={i} style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:ic.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0, marginTop:2 }}>{ic.icon}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:4 }}>
                        <span style={{ fontSize:13, fontWeight:700, color:C.slate }}>{e.by}</span>
                        {e.internal && <span style={{ fontSize:10, background:C.purpleLight, color:C.purple, padding:"2px 8px", borderRadius:10, fontWeight:700 }}>INTERNAL</span>}
                        <span style={{ fontSize:12, color:C.textMuted }}>{e.time}</span>
                      </div>
                      {e.type === "status" ? (
                        <div style={{ fontSize:13, color:C.textSub }}>
                          {e.from && e.to && ["IT Admin", "Facilities Management", "Office Admin"].includes(e.from) && ["IT Admin", "Facilities Management", "Office Admin"].includes(e.to) ? (
                            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                                <span style={{ fontSize:10, background:"#FFF0F1", color:C.coral, padding:"2px 8px", borderRadius:10, fontWeight:700, letterSpacing:0.5 }}>🔄 PORTAL REDIRECT</span>
                                <span style={{ fontSize:12, fontWeight:600, color:C.textSub }}>
                                  <span style={{ color: C.coral, fontWeight: 700 }}>{e.from}</span>
                                  {" ➔ "}
                                  <span style={{ color: C.green, fontWeight: 700 }}>{e.to}</span>
                                </span>
                              </div>
                              {e.note && <div style={{ fontSize:13, color:C.text, background:"#FFF8F8", border:`1.5px solid ${C.coralMid}`, padding:"10px 14px", borderRadius:10, lineHeight:1.5 }}>{e.note}</div>}
                            </div>
                          ) : e.from && e.to ? (
                            e.from === e.to ? (
                              <span>Status: <StaBadge s={e.to} /></span>
                            ) : (
                              <span>Status changed: <StaBadge s={e.from} /> → <StaBadge s={e.to} /></span>
                            )
                          ) : (
                            <span>Activity update</span>
                          )}
                          {(!e.from || !e.to || !["IT Admin", "Facilities Management", "Office Admin"].includes(e.from) || !["IT Admin", "Facilities Management", "Office Admin"].includes(e.to)) && e.note && (
                            <div style={{ marginTop:4, fontSize:13, color:C.textSub, background:C.bg, padding:"8px 12px", borderRadius:8 }}>{e.note}</div>
                          )}
                        </div>
                      ) : (
                        <div style={{ fontSize:14, color:C.text, background:e.internal ? C.purpleLight : (e.by === ticket.staffName ? C.coralLight : C.bg), padding:"10px 14px", borderRadius:10, lineHeight:1.6 }}>{e.note}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Admin Add Note / Feedback Reversion */}
            {isAdmin && (
              <div style={{ marginTop:24, borderTop:`1px solid ${C.borderLight}`, paddingTop:18 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:C.slate }}>Revert to staff / Post update</span>
                </div>
                
                {/* Steps presets */}
                {presets.length > 0 && (
                  <div style={{ marginBottom:14 }}>
                    <span style={{ fontSize:11, color:C.textSub, fontWeight:600, display:"block", marginBottom:6 }}>⚡ QUICK UPDATE TEMPLATES (STEPS TAKEN):</span>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                      {presets.map((p, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => { setNewNote(p.text); setIsInternal(false); }}
                          style={{ padding:"4px 10px", borderRadius:6, border:`1px solid ${C.border}`, background:C.card, fontSize:11, color:C.slate, cursor:"pointer", fontWeight:600 }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = C.coral}
                          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
                  placeholder="Describe current steps taken or feedback for the requester…"
                  style={{ ...inp, minHeight:80, resize:"vertical", lineHeight:1.6, marginBottom:12 }} />
                
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, cursor:"pointer" }}>
                  <input type="checkbox" id="internal_checkbox" checked={isInternal} onChange={e => setIsInternal(e.target.checked)} style={{ width:16, height:16 }} />
                  <label htmlFor="internal_checkbox" style={{ fontSize:13, color:isInternal ? C.purple : C.textSub, fontWeight:600, cursor:"pointer" }}>
                    🔒 Internal note only (not visible to staff member)
                  </label>
                </div>
                
                <div style={{ fontSize:12, color:isInternal ? C.purple : C.green, marginBottom:14, padding:"6px 10px", borderRadius:6, background:isInternal ? C.purpleLight : C.greenLight, fontWeight:500 }}>
                  {isInternal ? "🔒 Hidden from staff: This note will only be visible to internal support teams." : "📢 Revert to Staff: This update will be published to the staff member's request timeline."}
                </div>

                <button onClick={addNote} disabled={!newNote.trim()}
                  style={{ padding:"10px 22px", borderRadius:10, border:"none", background:newNote.trim() ? C.coral : C.border, color:newNote.trim() ? "#fff" : C.textMuted, fontWeight:700, cursor:newNote.trim() ? "pointer" : "not-allowed", fontSize:13, fontFamily:F }}>
                  Post update
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: actions panel ── */}
        <div style={{ flex: "1 1 280px", maxWidth: "100%", display:"flex", flexDirection:"column", gap:16, flexShrink:0 }}>
          
          {/* Support representative status (For Staff Portal) */}
          {!isAdmin && (
            <div style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, padding:"20px 22px" }}>
              <div style={{ fontSize:11, color:C.coral, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:12 }}>Assigned specialist</div>
              {ticket.technician && ticket.technician !== "Unassigned" ? (
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <div style={{ width:32, height:32, borderRadius:"50%", background:C.coralLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16 }}>👤</div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:C.slate }}>{ticket.technician}</div>
                      <div style={{ fontSize:11, color:C.textSub }}>{ticket.dept} specialist</div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:C.green, background:C.greenLight, padding:"6px 10px", borderRadius:8, fontWeight:500, lineHeight:1.4 }}>
                    ✓ Assigned to look at this issue. They will revert shortly with any progress.
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize:13, color:C.amber, fontWeight:700, display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                    <span style={{ fontSize:14 }}>⏳</span> Awaiting assignment
                  </div>
                  <p style={{ fontSize:12, color:C.textSub, margin:0, lineHeight:1.4 }}>
                    Your request is in the queue and will be picked up by the next available team member.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Last response alert (For Staff Portal) */}
          {!isAdmin && lastTeamComment && (
            <div style={{ background:"#FFFBF0", borderRadius:16, border:"1.5px solid #FCD34D", padding:"20px 22px" }}>
              <div style={{ fontSize:11, color:"#B45309", letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:8 }}>Latest message from team</div>
              <div style={{ fontSize:13, color:"#78350F", fontStyle:"italic", lineHeight:1.5 }}>
                "{lastTeamComment.note}"
              </div>
              <div style={{ fontSize:11, color:"#B45309", marginTop:8, textAlign:"right" }}>
                — {lastTeamComment.by}, {lastTeamComment.time}
              </div>
            </div>
          )}

          {/* Status workflow */}
          <div style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, padding:"20px 22px" }}>
            <div style={{ fontSize:11, color:C.coral, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:14 }}>Status workflow</div>
            <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:16 }}>
              {STATUS_FLOW.map((s, i) => {
                const cur = i === currentIdx;
                const done = i < currentIdx;
                const cfg = statusCfg(s);
                return (
                  <div key={s} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:10, background: cur ? cfg.bg : done ? (currentTheme === "dark" ? "#0F172A" : "#F8F9FA") : C.card, border:`1.5px solid ${cur ? cfg.dot : C.borderLight}` }}>
                    <div style={{ width:20, height:20, borderRadius:"50%", background: done ? C.green : cur ? cfg.dot : C.border, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      {done && <span style={{ color:"#fff", fontSize:11 }}>✓</span>}
                      {cur  && <span style={{ width:8, height:8, borderRadius:"50%", background:"#fff", display:"block" }} />}
                    </div>
                    <span style={{ fontSize:13, fontWeight: cur ? 700 : 400, color: cur ? cfg.color : done ? C.textSub : C.textMuted }}>{s}</span>
                    {cur && <span style={{ marginLeft:"auto", fontSize:10, background:cfg.bg, color:cfg.color, padding:"2px 7px", borderRadius:8, fontWeight:700 }}>NOW</span>}
                  </div>
                );
              })}
            </div>
            {isAdmin && (
              <div style={{ display:"flex", gap:8 }}>
                {canAdvance && (
                  <button onClick={advanceStatus}
                    style={{ flex:1, padding:"10px 14px", borderRadius:10, border:"none", background:C.coral, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:12, fontFamily:F }}>
                    Advance → {STATUS_FLOW[currentIdx + 1]}
                  </button>
                )}
                {canRevert && currentIdx > 1 && (
                  <button onClick={revertStatus}
                    style={{ padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, background:C.card, color:C.textSub, fontWeight:600, cursor:"pointer", fontSize:12, fontFamily:F }}>
                    ↩
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Technician assignment (admin only) */}
          {isAdmin && (
            <div style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, padding:"20px 22px" }}>
              <div style={{ fontSize:11, color:C.coral, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:14 }}>Assign request to team member</div>
              <label style={{ fontSize:11, color:C.textSub, fontWeight:600, display:"block", marginBottom:4 }}>Select Team Member:</label>
              <select value={technicianSel} onChange={e => setTechSel(e.target.value)}
                style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:13, background:C.card, color:C.slate, fontFamily:F, outline:"none", marginBottom:12 }}>
                {(TECHNICIANS[ticket.dept] || ["Unassigned"]).map(t => <option key={t} style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>{t}</option>)}
              </select>
              
              <label style={{ fontSize:11, color:C.textSub, fontWeight:600, display:"block", marginBottom:4 }}>Reversion/Assignment Note (Optional):</label>
              <input 
                type="text" 
                value={assignNote} 
                onChange={e => setAssignNote(e.target.value)} 
                placeholder="e.g. Please troubleshoot diagnostics"
                style={{ ...inp, padding:"8px 12px", fontSize:12, marginBottom:12 }} 
              />

              <button onClick={assignTech}
                style={{ width:"100%", padding:"10px", borderRadius:10, border:"none", background:C.slate, color: currentTheme === "dark" ? "#0F172A" : "#fff", fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:F }}>
                Assign & Save
              </button>
            </div>
          )}

          {/* Cross-Department Redirection / Portal Assignment (admin only) */}
          {isAdmin && (
            <div style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, padding:"20px 22px" }}>
              <div style={{ fontSize:11, color:C.coral, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:14 }}>Cross-Department Redirect</div>
              
              <p style={{ fontSize:12, color:C.textSub, margin:"0 0 12px", lineHeight:1.45 }}>
                If this request is misrouted, transfer it to another service desk portal. It will be reassigned instantly.
              </p>

              {recommendedDept && recommendedDept !== ticket.dept && (
                <div style={{ background: recommendedDept === "IT Admin" ? "#F5F3FF" : recommendedDept === "Facilities Management" ? "#E6F4F2" : "#FFFBEB", border: `1px solid ${recommendedDept === "IT Admin" ? C.purple : recommendedDept === "Facilities Management" ? "#0F766E" : C.amber}`, borderRadius: 10, padding: "10px 12px", marginBottom: 12, fontSize: 11, display: "flex", alignItems: "flex-start", gap: 6, lineHeight:1.4 }}>
                  <span style={{ fontSize:14 }}>💡</span>
                  <div style={{ flex: 1, color: recommendedDept === "IT Admin" ? C.purple : recommendedDept === "Facilities Management" ? "#0F766E" : "#92400E" }}>
                    <strong>System Recommendation:</strong> Description matches items handled by <strong>{recommendedDept}</strong>.
                    <button 
                      onClick={() => { setRedirectDept(recommendedDept); setRedirectReason(`Rerouted based on system suggestion for "${ticket.title}".`); }}
                      style={{ display:"block", marginTop:6, background: "none", border: "none", color: C.coral, textDecoration: "underline", padding: 0, fontWeight: 700, fontSize:11, cursor: "pointer" }}
                    >
                      Quick apply recommendation
                    </button>
                  </div>
                </div>
              )}

              <label style={{ fontSize:11, color:C.textSub, fontWeight:600, display:"block", marginBottom:4 }}>Select Destination Portal:</label>
              <select value={redirectDept} onChange={e => setRedirectDept(e.target.value)}
                style={{ width:"100%", padding:"10px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:13, background:C.card, color:C.slate, fontFamily:F, outline:"none", marginBottom:12 }}>
                {["IT Admin", "Facilities Management", "Office Admin"].map(d => (
                  <option key={d} disabled={d === ticket.dept} style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>{d} {d === ticket.dept ? "(Current)" : ""}</option>
                ))}
              </select>

              <label style={{ fontSize:11, color:C.textSub, fontWeight:600, display:"block", marginBottom:4 }}>Reason for Transfer:</label>
              
              {/* Quick Preset Reasons */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {[
                  { label: "Wrong Portal", val: "Misrouted ticket; request belongs to " },
                  { label: "Hardware Issue", val: "Requires dedicated hardware specialist from " },
                  { label: "Office Supplies", val: "Relates to general office supplies/administration." }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRedirectReason(preset.val + (redirectDept === ticket.dept ? "another team" : redirectDept) + ".")}
                    style={{ padding: "3px 8px", borderRadius: 6, border: `1.5px solid ${C.border}`, background:C.card, fontSize: 10, color: C.textSub, fontWeight: 600, cursor: "pointer" }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <textarea 
                value={redirectReason} 
                onChange={e => setRedirectReason(e.target.value)} 
                placeholder="Explain why you are redirecting this ticket..."
                style={{ ...inp, minHeight:60, fontSize:12, padding:"8px 12px", marginBottom:12, resize:"vertical" }} 
              />

              <button 
                onClick={() => {
                  if (redirectDept === ticket.dept) return;
                  const reasonText = redirectReason.trim() ? redirectReason.trim() : "Transferred to correct department.";
                  const entry: ThreadEntry = {
                    type: "status",
                    from: ticket.dept,
                    to: redirectDept,
                    by: "Admin (Redirected)",
                    time: new Date().toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
                    note: `Portal redirect reason: ${reasonText}`
                  };
                  
                  const updated: Ticket = {
                    ...ticket,
                    dept: redirectDept,
                    technician: "Unassigned", // reset assignee since department changed
                    thread: [...ticket.thread, entry]
                  };
                  onUpdate(updated);
                  onBack(); // Return to list cleanly
                }}
                disabled={redirectDept === ticket.dept}
                style={{ width:"100%", padding:"10px", borderRadius:10, border:"none", background:C.coral, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:13, fontFamily:F, opacity: redirectDept === ticket.dept ? 0.5 : 1 }}
              >
                🔄 Redirect & Transfer
              </button>
            </div>
          )}

          {/* Priority */}
          <div style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, padding:"20px 22px" }}>
            <div style={{ fontSize:11, color:C.coral, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:12 }}>Urgency</div>
            <PriBadge p={ticket.priority} />
          </div>

          {/* Location */}
          <div style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, padding:"20px 22px" }}>
            <div style={{ fontSize:11, color:C.coral, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:12 }}>Location</div>
            <div style={{ fontSize:13, color:C.slate, fontWeight:600, lineHeight:1.6 }}>{ticket.location}{ticket.desk ? `, ${ticket.desk}` : ""}</div>
            <div style={{ fontSize:12, color:C.textSub, marginTop:4 }}>{ticket.dept}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Staff: Request History ───────────────────────────────────────────────────
function RequestHistory({ tickets, office, onOpenTicket }: { tickets: Ticket[]; office: string; onOpenTicket: (t: Ticket) => void }) {
  const statuses = ["All","Submitted","Assigned","In Progress","Resolved","Closed"];
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");

  const counts = statuses.reduce((acc, s) => {
    acc[s] = s === "All" ? tickets.length : tickets.filter(t => t.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  const filtered = (activeStatus === "All" ? tickets : tickets.filter(t => t.status === activeStatus))
    .filter(t => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.technician && t.technician.toLowerCase().includes(q))
      );
    });

  return (
    <div>
      <div style={{ fontSize:11, color:C.coral, letterSpacing:1.2, textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>MY REQUESTS</div>
      <h1 className="text-2xl sm:text-[34px]" style={{ fontWeight:800, color:C.slate, margin:"0 0 8px", letterSpacing:-0.8 }}>Request history</h1>
      <p style={{ fontSize:15, color:C.textSub, margin:"0 0 32px" }}>Track the status and progress of all your submitted requests · {office}</p>
      <div style={{ display:"flex", justifyContent:"space-between", gap:16, marginBottom:28, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ display:"flex", gap:8 }} className="overflow-x-auto no-scrollbar max-w-full -my-1 py-1">
          {statuses.map(s => {
            const active = activeStatus === s;
            return (
              <button key={s} onClick={() => setActiveStatus(s)}
                style={{ padding:"6px 12px", borderRadius:24, border:`1.5px solid ${active ? C.slate : C.border}`, background:active ? C.slate : C.card, color:active ? (currentTheme === "dark" ? "#0F172A" : "#fff") : C.textSub, fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontFamily:F, whiteSpace:"nowrap" }}>
                {s}<span style={{ fontWeight:700, fontSize:11, color:active ? "rgba(255,255,255,0.55)" : C.textMuted }}>{counts[s]}</span>
              </button>
            );
          })}
        </div>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search my requests..."
            style={{
              padding: "8px 16px",
              borderRadius: 24,
              border: `1.5px solid ${C.border}`,
              fontSize: 13,
              background: C.card,
              color: C.slate,
              fontFamily: F,
              outline: "none",
              minWidth: "220px",
              width: "100%"
            }}
          />
        </div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {filtered.length === 0 && (
          <div style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, padding:"56px 32px", textAlign:"center" }}>
            <div style={{ fontSize:32, marginBottom:12 }}>📭</div>
            <div style={{ fontWeight:700, color:C.slate, fontSize:16, marginBottom:6 }}>No requests here</div>
            <div style={{ color:C.textSub, fontSize:14 }}>Requests in this status will appear here.</div>
          </div>
        )}
        {filtered.map(t => {
          const lastPublic = [...t.thread].reverse().find(e => !e.internal);
          return (
            <div key={t.id} onClick={() => onOpenTicket(t)}
              style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, padding:"22px 26px", transition:"border-color 0.15s, box-shadow 0.15s", cursor:"pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.coral; e.currentTarget.style.boxShadow="0 4px 16px rgba(255,68,79,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.boxShadow="none"; }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-2">
                <div className="flex items-center gap-2.5">
                  <span style={{ fontSize:12, color:C.textMuted, fontWeight:500 }}>{t.id}</span>
                  <PriBadge p={t.priority} />
                </div>
                <div className="flex items-center gap-3">
                  <StaBadge s={t.status} />
                  <span style={{ fontSize:13, color:C.textMuted }}>{t.date}</span>
                </div>
              </div>
              <div title={t.title} style={{ fontWeight:700, fontSize:17, color:C.slate, marginBottom:6 }}>{t.title}</div>
              <div style={{ fontSize:13, color:C.textSub }}>
                {[t.category, t.dept, `${t.location}${t.desk ? `, ${t.desk}` : ""}`].join(" · ")}
              </div>
              {lastPublic && lastPublic.note && (
                <div style={{ marginTop:14, display:"flex", gap:9, alignItems:"flex-start", padding:"12px 14px", background:C.bg, borderRadius:10 }}>
                  <span style={{ fontSize:14, marginTop:1 }}>💬</span>
                  <div style={{ fontSize:13, color:C.text, lineHeight:1.55 }}>
                    <span style={{ color:C.textSub }}>Latest update: </span>{lastPublic.note}
                  </div>
                </div>
              )}
              <div style={{ marginTop:10, fontSize:12, color:C.coral, fontWeight:600 }}>View details →</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Asset categories ─────────────────────────────────────────────────────────
const ASSET_CATEGORIES = ["Monitor / Display","Printer / Scanner","Laptop / Desktop","Docking Station","Mobile Device","AV Equipment","Keyboard / Mouse / Peripheral","Phone / Headset","UPS / Power Equipment","Server / Network Hardware"];
const ALL_CATEGORIES = [...ASSET_CATEGORIES,"Network / VPN","HVAC / Air Conditioning","Plumbing / Water","Furniture / Fixtures","Office Supplies","Access / Security","Safety / Hazard","Kitchen Appliances","Software Access","Cleaning","Electrical","Pest Control","Meeting Rooms","Other"];

// ─── Staff: New Request ───────────────────────────────────────────────────────
function NewRequest({ office, onSubmit }: { office: string; onSubmit: (newTicket: Ticket) => void }) {
  const [dept, setDept] = useState("IT Admin");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [floor, setFloor] = useState("Level 2");
  const [desk, setDesk] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [description, setDescription] = useState("");
  
  const recommendedDept = getRecommendation(title, description);
  
  const [staffName, setStaffName] = useState("Amir Syarif");
  const [staffId, setStaffId] = useState("DRV-08422");
  const [email, setEmail] = useState("amir.syarif@deriv.com");
  const [team, setTeam] = useState("Engineering / Technology (core tech, platform, infrastructure)");
  
  const [assetTagVal, setAssetTagVal] = useState("");
  const [assetModel, setAssetModel] = useState("");
  const [assetCondition, setAssetCondition] = useState("Not working at all");
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<{ name: string; size: string; type: string; url?: string }[]>([]);

  const handleFiles = (fileList: FileList) => {
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
    setFiles(prev => [...prev, ...newFiles]);
  };

  const isAssetCategory = ASSET_CATEGORIES.includes(category);
  const inp = { width:"100%", padding:"11px 14px", borderRadius:10, border:`1.5px solid ${C.border}`, fontSize:14, outline:"none", background:C.card, boxSizing:"border-box", color:C.slate, fontFamily:F };
  const lbl = { fontSize:13, fontWeight:600, color:C.slate, display:"block", marginBottom:6 };

  const SectionDivider = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <div style={{ margin:"28px 0 22px", paddingTop:28, borderTop:`1px solid ${C.borderLight}` }}>
      <div style={{ fontSize:11, color:C.coral, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:3 }}>{title}</div>
      {subtitle && <div style={{ fontSize:13, color:C.textSub }}>{subtitle}</div>}
    </div>
  );

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("Please provide an issue title.");
      return;
    }
    if (!category) {
      alert("Please select a category.");
      return;
    }
    if (!description.trim()) {
      alert("Please provide a description of the issue.");
      return;
    }
    if (!staffName.trim()) {
      alert("Please provide your name.");
      return;
    }
    if (isAssetCategory && !assetTagVal.trim()) {
      alert(`An asset tag is required for ${category} requests. Please find the tag on the device.`);
      return;
    }

    const nextIdNum = Math.floor(100 + Math.random() * 900);
    const newTicket: Ticket = {
      id: `REQ-2024-${nextIdNum}`,
      title: title.trim(),
      category: category,
      dept: dept,
      priority: priority,
      status: "Submitted",
      location: `${floor} — ${office.split(",")[0]}`,
      desk: desk.trim(),
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      staffName: staffName.trim(),
      staffId: staffId.trim(),
      assetTag: isAssetCategory ? assetTagVal.toUpperCase().trim() : undefined,
      assetModel: isAssetCategory && assetModel.trim() ? assetModel.trim() : undefined,
      description: description.trim(),
      technician: "Unassigned",
      attachments: files,
      thread: [
        {
          type: "status",
          from: "None",
          to: "Submitted",
          by: "System",
          time: new Date().toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
          note: `Ticket submitted via Staff Portal for the ${dept} department.`
        }
      ]
    };

    onSubmit(newTicket);
  };

  return (
    <div>
      <div style={{ fontSize:11, color:C.coral, letterSpacing:1.2, textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>NEW REQUEST</div>
      <h1 className="text-2xl sm:text-[34px]" style={{ fontWeight:800, color:C.slate, margin:"0 0 8px", letterSpacing:-0.8 }}>Submit a request</h1>
      <p style={{ fontSize:15, color:C.textSub, margin:"0 0 32px" }}>Describe your issue and the right team will respond within SLA targets.</p>
      <div className="p-4 sm:p-[36px]" style={{ background:C.card, borderRadius:20, border:`1.5px solid ${C.border}` }}>
        <div style={{ fontSize:11, color:C.coral, letterSpacing:1, textTransform:"uppercase", fontWeight:700, marginBottom:18 }}>Request details</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label style={lbl}>Department <span style={{ color:C.coral }}>*</span></label>
            <select value={dept} onChange={e => setDept(e.target.value)} style={inp}>
              <option style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>IT Admin</option>
              <option style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>Facilities Management</option>
              <option style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>Office Admin</option>
            </select>
            {recommendedDept && recommendedDept !== dept && (
              <div style={{ marginTop: 8, padding: "10px 12px", borderRadius: 8, background: "#FFFBEB", border: "1.5px solid #FDE68A", fontSize: 12, lineHeight: 1.45 }}>
                <span style={{ fontSize:14, marginRight: 4 }}>💡</span>
                <span style={{ color: "#92400E" }}>
                  <strong>Smart Routing Suggestion:</strong> Your description matches requests normally handled by <strong>{recommendedDept}</strong>.
                </span>
                <button 
                  type="button"
                  onClick={() => setDept(recommendedDept)}
                  style={{ display: "block", marginTop: 4, background: "none", border: "none", color: C.coral, fontWeight: 700, padding: 0, cursor: "pointer", textDecoration: "underline", fontSize: 11 }}
                >
                  Switch department to {recommendedDept}
                </button>
              </div>
            )}
          </div>
          <div>
            <label style={lbl}>Category <span style={{ color:C.coral }}>*</span></label>
            <select value={category} onChange={e => { setCategory(e.target.value); setAssetTagVal(""); }} style={inp}>
              <option value="" style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>Select a category</option>
              <optgroup label="── Asset-related" style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>{ASSET_CATEGORIES.map(c => <option key={c} style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>{c}</option>)}</optgroup>
              <optgroup label="── General" style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>{ALL_CATEGORIES.filter(c => !ASSET_CATEGORIES.includes(c)).map(c => <option key={c} style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>{c}</option>)}</optgroup>
            </select>
          </div>
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={lbl}>Issue title <span style={{ color:C.coral }}>*</span></label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Brief, clear summary of the issue" style={inp} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
          <div>
            <label style={lbl}>Office Location</label>
            <input value={office} disabled style={{ ...inp, background:C.borderLight, color:C.textSub }} />
          </div>
          <div>
            <label style={lbl}>Floor / Area</label>
            <select value={floor} onChange={e => setFloor(e.target.value)} style={inp}>
              {["Ground Floor","Level 1","Level 2","Level 3","Level 4","Level 5"].map(f => <option key={f} style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>{f}</option>)}
            </select>
          </div>
          <div>
            <label style={lbl}>Desk / Room</label>
            <input value={desk} onChange={e => setDesk(e.target.value)} placeholder="e.g. Desk 3-14 or Conf. Room B" style={inp} />
          </div>
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={lbl}>Urgency <span style={{ color:C.coral }}>*</span></label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {["Low","Medium","High","Critical"].map(p => { const cfg=priorityCfg(p); const active=priority===p; return (
              <div key={p} onClick={() => setPriority(p)} style={{ padding:"12px", borderRadius:12, border:`2px solid ${active?(p==="Critical"?C.coral:cfg.dot):C.border}`, background:active?cfg.bg:C.card, cursor:"pointer", textAlign:"center", fontWeight:600, fontSize:13, color:active?cfg.color:C.textSub, transition:"all 0.15s" }}>{p}</div>
            ); })}
          </div>
        </div>
        <div style={{ marginBottom:4 }}>
          <label style={lbl}>Description <span style={{ color:C.coral }}>*</span></label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the issue in detail — what happened, when it started, and any steps already tried." style={{ ...inp, minHeight:110, resize:"vertical", lineHeight:1.6 }} />
        </div>
        
        <SectionDivider title="Staff details" subtitle="Who is this request for?" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label style={lbl}>Staff name <span style={{ color:C.coral }}>*</span></label>
            <input value={staffName} onChange={e => setStaffName(e.target.value)} placeholder="Full name of the staff member affected" style={inp} />
          </div>
          <div>
            <label style={lbl}>Staff ID / Employee number</label>
            <input value={staffId} onChange={e => setStaffId(e.target.value)} placeholder="e.g. DRV-04821" style={inp} />
          </div>
          <div>
            <label style={lbl}>Email address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="staff.name@deriv.com" style={inp} />
          </div>
          <div>
            <label style={lbl}>Team / Department <span style={{ color:C.coral }}>*</span></label>
            <select value={team} onChange={e => setTeam(e.target.value)} style={inp}>
              {["Finance", "Compliance", "Engineering / Technology (core tech, platform, infrastructure)", "Data Analytics", "Security & DR", "HR (Human Resources)", "Growth AI & Product", "Global Partnerships", "CX (Customer Experience / Support)", "Operations"].map(t => (
                <option key={t} value={t} style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        {isAssetCategory && (
          <>
            <SectionDivider title="Asset details" subtitle={`An asset tag is required for ${category} requests.`} />
            <div style={{ padding:"18px 20px", borderRadius:14, background:C.coralLight, border:`1.5px solid ${C.coralMid}`, marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}><span style={{ fontSize:16 }}>🏷️</span><span style={{ fontSize:13, fontWeight:700, color:C.coral }}>Asset tag required</span></div>
              <p style={{ fontSize:13, color:C.coralDark, margin:0, lineHeight:1.55 }}>Find the asset tag label on the device (usually a white sticker with a barcode). Enter the full tag number below.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label style={lbl}>Asset tag <span style={{ color:C.coral }}>*</span></label>
                <div style={{ position:"relative" }}>
                  <input value={assetTagVal} onChange={e => setAssetTagVal(e.target.value.toUpperCase())} placeholder="e.g. DRV-IT-00842" style={{ ...inp, paddingLeft:42, fontFamily:"'Courier New', monospace", fontWeight:600, letterSpacing:1 }} />
                  <span style={{ position:"absolute", left:13, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>🏷️</span>
                </div>
                <div style={{ fontSize:11, color:C.textMuted, marginTop:5 }}>Format: DRV-[DEPT]-[NUMBER]</div>
              </div>
              <div><label style={lbl}>Asset type</label><input disabled style={{ ...inp, background:C.borderLight, color:C.textSub }} value={category} /></div>
              <div><label style={lbl}>Asset make / model</label><input value={assetModel} onChange={e => setAssetModel(e.target.value)} placeholder="e.g. Dell UltraSharp U2722D" style={inp} /></div>
              <div><label style={lbl}>Asset condition</label>
                <select value={assetCondition} onChange={e => setAssetCondition(e.target.value)} style={inp}>
                  {["Not working at all", "Intermittent fault", "Degraded performance", "Physical damage", "Lost / stolen"].map(c => (
                    <option key={c} style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
        <SectionDivider title="Attachments" subtitle="Photos help the team diagnose the issue faster." />
        <div style={{ marginBottom:30 }}>
          <input
            type="file"
            multiple
            id="file-upload-input"
            style={{ display: "none" }}
            onChange={e => {
              if (e.target.files) {
                handleFiles(e.target.files);
              }
            }}
          />
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files) {
                handleFiles(e.dataTransfer.files);
              }
            }}
            onClick={() => document.getElementById("file-upload-input")?.click()}
            style={{ border:`2px dashed ${dragOver?C.coral:C.border}`, borderRadius:12, padding:"30px 24px", textAlign:"center", background:dragOver?C.coralLight:C.bg, transition:"all 0.15s", cursor:"pointer" }}
          >
            <div style={{ fontSize:26, marginBottom:8 }}>📎</div>
            <div style={{ fontSize:14, color:C.slate, fontWeight:600 }}>Drop files here or <span style={{ color:C.coral }}>browse</span></div>
            <div style={{ fontSize:12, color:C.textMuted, marginTop:4 }}>JPG, PNG, PDF, DOCX · Max 10 MB per file</div>
          </div>

          {files.length > 0 && (
            <div style={{ marginTop: 15, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.slate, textTransform: "uppercase", fontFamily: F }}>Selected Files ({files.length})</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {files.map((f, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: C.bg, border: `1.5px solid ${C.borderLight}`, borderRadius: 10, padding: "8px 12px", fontFamily: F }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}>
                      <span style={{ fontSize: 18 }}>📄</span>
                      <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: C.slate, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                        <span style={{ fontSize: 11, color: C.textMuted }}>{f.size}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFiles(prev => prev.filter((_, i) => i !== idx));
                      }}
                      style={{ background: "none", border: "none", color: C.coral, fontWeight: 700, fontSize: 12, cursor: "pointer", padding: "4px" }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div style={{ display:"flex", justifyContent:"flex-end", gap:12 }}>
          <button style={{ padding:"12px 24px", borderRadius:12, border:`1.5px solid ${C.border}`, background:C.card, color:C.textSub, fontWeight:600, cursor:"pointer", fontSize:14, fontFamily:F }}>Cancel</button>
          <button onClick={handleSubmit} style={{ padding:"12px 28px", borderRadius:12, border:"none", background:C.coral, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14, fontFamily:F, boxShadow:"0 4px 16px rgba(255,68,79,0.30)" }}>Submit request →</button>
        </div>
      </div>
    </div>
  );
}

function SubmitSuccess({ onAnother, onHistory }: { onAnother: () => void; onHistory: () => void }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"55vh", gap:16, textAlign:"center" }}>
      <div style={{ width:76, height:76, borderRadius:"50%", background:C.greenLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34 }}>✅</div>
      <h2 className="text-2xl sm:text-3xl" style={{ fontWeight:800, color:C.slate, margin:0, letterSpacing:-0.6 }}>Request submitted</h2>
      <p className="text-sm sm:text-base px-2" style={{ color:C.textSub, maxWidth:400, lineHeight:1.65, margin:0 }}>Your ticket has been created and routed to the right team. You'll receive updates here and by email.</p>
      <div style={{ display:"flex", gap:12, marginTop:8 }}>
        <button onClick={onAnother} style={{ padding:"11px 22px", borderRadius:12, border:`1.5px solid ${C.slate}`, background:C.card, color:C.slate, fontWeight:700, cursor:"pointer", fontSize:14, fontFamily:F }}>Submit another</button>
        <button onClick={onHistory} style={{ padding:"11px 22px", borderRadius:12, border:"none", background:C.coral, color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14, fontFamily:F }}>View my requests</button>
      </div>
    </div>
  );
}

// ─── Admin: Incoming Requests ─────────────────────────────────────────────────
function IncomingRequests({ tickets, deptFilter, title, office, onOpenTicket }: { tickets: Ticket[]; deptFilter: string; title: string; office: string; onOpenTicket: (t: Ticket) => void }) {
  const filtered = deptFilter ? tickets.filter(t => t.dept === deptFilter) : tickets;
  const statuses   = ["All","Submitted","Assigned","In Progress","Resolved"];
  const priorities = ["All","Critical","High","Medium","Low"];
  const [activeS, setActiveS] = useState("All");
  const [activeP, setActiveP] = useState("All");
  const [sort, setSort]       = useState("Urgency");
  const [search, setSearch]   = useState("");

  const priOrder: Record<string, number> = { Critical:0, High:1, Medium:2, Low:3 };
  const staOrder: Record<string, number> = { Submitted:0, Assigned:1, "In Progress":2, Resolved:3 };

  let shown = filtered
    .filter(t => activeS === "All" || t.status === activeS)
    .filter(t => activeP === "All" || t.priority === activeP)
    .filter(t => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.staffName && t.staffName.toLowerCase().includes(q)) ||
        (t.technician && t.technician.toLowerCase().includes(q))
      );
    });

  if (sort === "Urgency") {
    shown = [...shown].sort((a,b) => (priOrder[a.priority] ?? 99) - (priOrder[b.priority] ?? 99));
  } else if (sort === "Status") {
    shown = [...shown].sort((a,b) => (staOrder[a.status] ?? 99) - (staOrder[b.status] ?? 99));
  } else if (sort === "Date") {
    shown = [...shown].sort((a,b) => b.date.localeCompare(a.date));
  }

  const awaiting   = filtered.filter(t => t.status==="Submitted"||t.status==="Open").length;
  const inProgress = filtered.filter(t => t.status==="In Progress"||t.status==="Assigned").length;
  const resolved   = filtered.filter(t => t.status==="Resolved").length;
  const critical   = filtered.filter(t => t.priority==="Critical"&&t.status!=="Resolved").length;

  const kpis = [
    { label:"AWAITING ACTION", value:awaiting,   bg:"#EBF3FF",    numColor:C.blue },
    { label:"IN PROGRESS",     value:inProgress, bg:C.amberLight, numColor:C.amber },
    { label:"RESOLVED",        value:resolved,   bg:C.greenLight, numColor:C.green },
    { label:"CRITICAL OPEN",   value:critical,   bg:C.coralLight, numColor:C.coral },
  ];

  const handleExportCSV = () => {
    if (shown.length === 0) return;
    const headers = ["Ticket ID", "Title", "Category", "Department", "Priority", "Status", "Location", "Desk", "Date Submitted", "Staff Name", "Staff ID", "Asset Tag", "Asset Model", "Description", "Technician"];
    const rows = shown.map(t => [
      t.id,
      t.title,
      t.category,
      t.dept,
      t.priority,
      t.status,
      t.location,
      t.desk,
      t.date,
      t.staffName,
      t.staffId,
      t.assetTag || "",
      t.assetModel || "",
      t.description,
      t.technician
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => 
        row.map(val => {
          const stringVal = String(val ?? "").replace(/"/g, '""');
          return `"${stringVal}"`;
        }).join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `deriv_office_services_requests_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const PillRow = ({ active, setActive, items }: { active: string; setActive: (s: string) => void; items: string[] }) => (
    <div style={{ display:"flex", gap:8 }} className="overflow-x-auto no-scrollbar max-w-full -my-1 py-1">
      {items.map(s => (
        <button key={s} onClick={() => setActive(s)}
          style={{ padding:"6px 12px", borderRadius:20, border:`1.5px solid ${active===s?C.slate:C.border}`, background:active===s?C.slate:C.card, color:active===s?(currentTheme === "dark" ? "#0F172A" : "#fff"):C.textSub, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:F, whiteSpace:"nowrap" }}>
          {s}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ fontSize:11, color:C.coral, letterSpacing:1.2, textTransform:"uppercase", fontWeight:700, marginBottom:6 }}>{title}</div>
      <h1 className="text-2xl sm:text-[34px]" style={{ fontWeight:800, color:C.slate, margin:"0 0 6px", letterSpacing:-0.8 }}>Incoming requests</h1>
      <p style={{ fontSize:15, color:C.textSub, margin:"0 0 32px" }}>Manage and resolve requests assigned to your team · {office}</p>
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 mb-8">
        {kpis.map(k => (
          <div key={k.label} className="p-3.5 sm:p-5" style={{ background:k.bg, borderRadius:16, border:`1px solid ${k.numColor}20`, minWidth: 0 }}>
            <div className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase mb-2 text-ellipsis overflow-hidden whitespace-nowrap" style={{ color:k.numColor, opacity:0.75 }} title={k.label}>{k.label}</div>
            <div className="text-xl sm:text-4xl font-extrabold text-ellipsis overflow-hidden whitespace-nowrap" style={{ color:k.numColor, lineHeight:1 }}>{k.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:16, alignItems:"center", flexWrap:"wrap" }}>
        <PillRow active={activeS} setActive={setActiveS} items={statuses} />
        <div className="hidden md:block" style={{ width:1, height:28, background:C.border, margin:"0 4px" }} />
        <PillRow active={activeP} setActive={setActiveP} items={priorities} />
        <div className="w-full sm:w-auto flex flex-wrap items-center gap-2 sm:ml-auto mt-2 sm:mt-0">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search requests..."
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              fontSize: 13,
              background: C.card,
              color: C.slate,
              fontFamily: F,
              outline: "none",
              minWidth: "160px",
              flex: "1 1 auto"
            }}
          />
          <span style={{ fontSize:13, color:C.textSub, marginLeft: 6 }}>Sort:</span>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ padding:"7px 12px", borderRadius:8, border:`1px solid ${C.border}`, fontSize:13, background:C.card, color:C.slate, fontFamily:F, outline:"none" }}>
            <option style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>Urgency</option>
            <option style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>Status</option>
            <option style={{ background: currentTheme === "dark" ? "#1E293B" : "#FFFFFF", color: currentTheme === "dark" ? "#F8FAFC" : "#181C25" }}>Date</option>
          </select>
        </div>
      </div>
      <div style={{ background:C.card, borderRadius:16, border:`1.5px solid ${C.border}`, overflow:"hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth: "800px" }}>
            <thead>
              <tr style={{ background:C.bg }}>
                {["ID","TITLE","LOCATION","URGENCY","STATUS","TECHNICIAN","SUBMITTED",""].map((h,i) => (
                  <th key={i} style={{ padding:"12px 20px", textAlign:"left", color:C.textMuted, fontWeight:700, fontSize:11, letterSpacing:0.6, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr><td colSpan={8} style={{ padding:"48px", textAlign:"center", color:C.textMuted }}>No requests match this filter.</td></tr>
              )}
              {shown.map((t) => (
                <tr key={t.id} onClick={() => onOpenTicket(t)} style={{ borderTop:`1px solid ${C.borderLight}`, background:C.card, cursor:"pointer", transition:"background 0.12s" }}
                  onMouseEnter={e => e.currentTarget.style.background=C.bg}
                  onMouseLeave={e => e.currentTarget.style.background=C.card}>
                  <td style={{ padding:"16px 20px", color:C.textMuted, fontSize:12, fontWeight:500, whiteSpace:"nowrap" }}>{t.id}</td>
                  <td style={{ padding:"16px 20px", maxWidth:240 }}>
                    <div title={t.title} style={{ fontWeight:700, color:C.slate, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{t.title}</div>
                    <div style={{ fontSize:12, color:C.textSub, marginTop:2 }}>{t.category}</div>
                  </td>
                  <td title={t.location} style={{ padding:"16px 20px", color:C.textSub, fontSize:13, whiteSpace:"nowrap" }}>{t.location.length>22?t.location.slice(0,22)+"…":t.location}</td>
                  <td style={{ padding:"16px 20px" }}><PriBadge p={t.priority} /></td>
                  <td style={{ padding:"16px 20px" }}><StaBadge s={t.status} /></td>
                  <td style={{ padding:"16px 20px", fontSize:12, color:t.technician==="Unassigned"?C.textMuted:C.slate, fontWeight:t.technician==="Unassigned"?400:600 }}>{t.technician}</td>
                  <td style={{ padding:"16px 20px", color:C.textMuted, fontSize:12, whiteSpace:"nowrap" }}>{t.date.replace(" 2024","")}</td>
                  <td style={{ padding:"16px 20px", textAlign:"right" }}><span style={{ color:C.coral, fontSize:16 }}>→</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:"12px 20px", fontSize:13, color:C.textMuted, borderTop:`1px solid ${C.borderLight}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span>Showing {shown.length} of {filtered.length} requests</span>
          <span onClick={handleExportCSV} style={{ color:C.coral, fontSize:12, fontWeight:600, cursor:"pointer" }}>Export CSV →</span>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme]         = useState<"light" | "dark">("light");
  const [portal, setPortal]       = useState<string | null>(null);
  const [office, setOffice]       = useState("Cyberjaya, Malaysia (HQ)");
  const [view, setView]           = useState("requests");
  const [submitted, setSubmitted] = useState(false);
  const [openTicket, setOpenTicket] = useState<Ticket | null>(null);
  const [toast, setToast]         = useState<string | null>(null);
  const [ticketStore, setTicketStore] = useState<Record<string, Ticket[]>>(BASE_TICKETS);

  // HR & Compliance State
  const [hrTickets, setHrTickets] = useState<HrTicket[]>(() => [
    {
      id: "HR-2026-001",
      subject: "Inquiry regarding revised dental coverage limits",
      type: "Benefits",
      description: "Hi HR, I noticed that the annual limit for dental claims was updated in the recent handbook. Could you clarify if surgical extraction is fully covered or subject to a co-payment?",
      confidentiality: "Standard",
      isAnonymous: false,
      staffName: "Ahmad Ridzuan",
      staffId: "DRV-04512",
      date: "10 Jul 2026",
      status: "Reviewed",
      assignedRep: "Shirley Wong (Senior Benefits Specialist)",
      office: "Cyberjaya, Malaysia (HQ)",
      thread: [
        { type: "status", from: "None", to: "Submitted", by: "Ahmad Ridzuan", time: "10 Jul, 09:00", note: "Grievance file successfully registered." },
        { type: "status", from: "Submitted", to: "Reviewed", by: "Shirley Wong", time: "11 Jul, 09:30", note: "Assigning to Benefits specialist for details." },
        { type: "comment", by: "Shirley Wong (Senior Benefits Specialist)", time: "11 Jul, 09:35", note: "Hi Ahmad, I am looking into this with our insurance provider. Regular extractions are 100% covered, while surgical extraction has a 10% co-pay up to your annual maximum." }
      ]
    },
    {
      id: "HR-2026-002",
      subject: "Interpersonal conflict during project sprints",
      type: "Grievance",
      description: "I am raising a formal concern regarding communication style and collaborative behavior from one of the senior leads during our retrospective sessions. It has created a hostile environment.",
      confidentiality: "Sensitive - HR Managers Only",
      isAnonymous: true,
      staffName: "Anonymous HR Consultation",
      staffId: "ANON-HR",
      date: "9 Jul 2026",
      status: "Under Investigation",
      assignedRep: "Marcus Tan (HR Director)",
      office: "Cyberjaya, Malaysia (HQ)",
      thread: [
        { type: "status", from: "None", to: "Submitted", by: "Anonymous Staff", time: "09 Jul, 13:30", note: "Grievance file successfully registered." },
        { type: "status", from: "Submitted", to: "Under Investigation", by: "Marcus Tan", time: "9 Jul, 14:00", note: "Escalated to Director level due to sensitivity." },
        { type: "comment", by: "Marcus Tan (HR Director)", time: "10 Jul, 11:00", note: "We have scheduled a private one-on-one session to discuss the details. Confidentiality is strictly assured." }
      ]
    },
    {
      id: "HR-2026-003",
      subject: "Relocation allowance reimbursement processing time",
      type: "Payroll/Salary",
      description: "Hi, I submitted my flight and moving invoices three weeks ago. Could you please let me know when this will reflect in my bank account?",
      confidentiality: "Standard",
      isAnonymous: false,
      staffName: "Andreas Georgiou",
      staffId: "DRV-12093",
      date: "8 Jul 2026",
      status: "Resolved",
      assignedRep: "Elena Demetriou (HR Business Partner)",
      office: "Limassol, Cyprus",
      thread: [
        { type: "status", from: "None", to: "Submitted", by: "Andreas Georgiou", time: "08 Jul, 09:15", note: "Grievance file successfully registered." },
        { type: "status", from: "Submitted", to: "Resolved", by: "Elena Demetriou", time: "9 Jul, 10:00", note: "Approved and submitted to Finance." },
        { type: "comment", by: "Elena Demetriou (HR Business Partner)", time: "9 Jul, 10:05", note: "Hi Andreas, this has been processed and will be paid out with this month's salary cycle on July 25th." }
      ]
    }
  ]);

  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>(() => [
    {
      id: "COM-2026-N2B9",
      category: "Conflict of Interest",
      description: "A manager in the procurement team is allegedly awarding software licensing contracts to a vendor company owned by their spouse, without declaring this connection or obtaining competing bids.",
      incidentDate: "2026-06-15",
      department: "Procurement",
      office: "Cyberjaya, Malaysia (HQ)",
      dateSubmitted: "05 Jul 2026",
      status: "Under Investigation",
      hasEvidence: true,
      timeline: [
        { date: "05 Jul 2026", title: "Report Received Anonymously", description: "The compliance office received the anonymous report and assigned code COM-2026-N2B9.", by: "Compliance Officer" },
        { date: "06 Jul 2026", title: "Preliminary Assessment", description: "Conflict of interest policies reviewed. Vendor ownership records searched and spouse relationship verified.", by: "Compliance Auditor" },
        { date: "08 Jul 2026", title: "Formal Investigation Opened", description: "Internal Audit has been notified to pull procurement records for the specified software vendor.", by: "Compliance Board" }
      ],
      messages: [
        { id: "msg-1", sender: "Compliance Officer", text: "Thank you for bringing this matter to our attention. Do you have copies of the bidding documents or communication records regarding these awards?", date: "06 Jul 2026, 09:15" },
        { id: "msg-2", sender: "Anonymous Reporter", text: "I don't have copies of the contracts, but you can check the approval logs for March 2026. The approval was signed off without the standard three-quote rule.", date: "07 Jul 2026, 18:40" },
        { id: "msg-3", sender: "Compliance Officer", text: "Received. We are pulling the approval logs for March 2026. This is very helpful.", date: "08 Jul 2026, 10:30" }
      ]
    }
  ]);

  const handleAddHrTicket = (newTicket: HrTicket) => {
    setHrTickets(prev => [newTicket, ...prev]);
  };

  const handleUpdateHrTicket = (updated: HrTicket) => {
    setHrTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleAddComplianceReport = (newReport: ComplianceReport) => {
    setComplianceReports(prev => [newReport, ...prev]);
  };

  const handleUpdateComplianceReport = (updated: ComplianceReport) => {
    setComplianceReports(prev => prev.map(r => r.id === updated.id ? updated : r));
  };

  // Preload all location images instantly
  React.useEffect(() => {
    NEON_LOCATIONS.forEach(loc => {
      if (loc.image) {
        const img = new Image();
        img.src = loc.image;
      }
    });
  }, []);

  // Sync global Proxy variable with React's state
  currentTheme = theme;

  const tickets = ticketStore[office] || [];
  const activeTicket = openTicket ? (tickets.find(t => t.id === openTicket.id) || openTicket) : null;

  const deptMap: Record<string, string>  = { it:"IT Admin", facilities:"Facilities Management", admin:"Office Admin" };
  const titleMap: Record<string, string> = { it:"IT ADMIN DASHBOARD", facilities:"FACILITIES MANAGEMENT DASHBOARD", admin:"OFFICE ADMIN DASHBOARD" };

  function handleUpdate(updated: Ticket) {
    const oldTicket = tickets.find(t => t.id === updated.id);
    const oldStatus = oldTicket?.status;
    setTicketStore(prev => ({
      ...prev,
      [office]: prev[office].map(t => t.id === updated.id ? updated : t),
    }));
    setOpenTicket(updated);
    if (oldStatus !== updated.status) {
      setToast(`✉️ Email sent to ${updated.staffName}: ticket ${updated.id} moved to "${updated.status}"`);
    } else {
      setToast(`Note added to ${updated.id}`);
    }
  }

  const handleNewRequest = (newTicket: Ticket) => {
    setTicketStore(prev => ({
      ...prev,
      [office]: [newTicket, ...(prev[office] || [])]
    }));
    setSubmitted(true);
  };

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");

  if (!portal) return <PortalSelector onSelect={p => { setPortal(p); setView(p==="staff"?"requests":"incoming"); }} office={office} setOffice={setOffice} theme={theme} toggleTheme={toggleTheme} />;

  const isAdmin = portal !== "staff" && portal !== "hr" && portal !== "compliance";

  return (
    <div style={{ display:"flex", flexDirection:"column", minHeight:"100vh", background:C.bg, fontFamily:F, transition: "background 0.2s ease-out, color 0.2s ease-out" }}>
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <style>{`@keyframes slideup { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }`}</style>
      <TopBar portal={portal} office={office} onPortalChange={p => { setPortal(p); setView(p === "staff" ? "requests" : "incoming"); }} onBack={() => { setPortal(null); setView("requests"); setSubmitted(false); setOpenTicket(null); }} view={view} setView={v => { setView(v); setSubmitted(false); setOpenTicket(null); }} theme={theme} toggleTheme={toggleTheme} />
      <Page>
        {/* HR Portal flow */}
        {portal === "hr" && (
          <HrPortal
            office={office}
            theme={theme}
            onBack={() => { setPortal(null); setView("requests"); }}
            hrTickets={hrTickets}
            onAddHrTicket={handleAddHrTicket}
            onUpdateHrTicket={handleUpdateHrTicket}
          />
        )}

        {/* Compliance Portal flow */}
        {portal === "compliance" && (
          <CompliancePortal
            office={office}
            theme={theme}
            onBack={() => { setPortal(null); setView("requests"); }}
            complianceReports={complianceReports}
            onAddComplianceReport={handleAddComplianceReport}
            onUpdateComplianceReport={handleUpdateComplianceReport}
          />
        )}

        {/* Staff flows */}
        {portal === "staff" && view === "requests" && !activeTicket && <RequestHistory tickets={tickets} office={office} onOpenTicket={t => setOpenTicket(t)} />}
        {portal === "staff" && view === "requests" && activeTicket  && <TicketDetail ticket={activeTicket} onBack={() => setOpenTicket(null)} onUpdate={handleUpdate} isAdmin={false} />}
        {portal === "staff" && view === "new" && !submitted && <NewRequest office={office} onSubmit={handleNewRequest} />}
        {portal === "staff" && view === "new" && submitted  && <SubmitSuccess onAnother={() => setSubmitted(false)} onHistory={() => { setView("requests"); setSubmitted(false); }} />}

        {/* Admin flows */}
        {isAdmin && (view === "incoming" || view === "resolved") && !activeTicket && (
          <IncomingRequests
            tickets={view === "resolved" ? tickets.filter(t => t.status === "Resolved") : tickets}
            deptFilter={deptMap[portal] || ""}
            title={titleMap[portal] || ""}
            office={office}
            onOpenTicket={t => setOpenTicket(t)}
          />
        )}
        {isAdmin && view === "dashboard" && !activeTicket && (
          <AdminDashboard
            ticketStore={ticketStore}
            office={office}
            deptFilter={deptMap[portal] || ""}
            title={titleMap[portal] || ""}
            theme={theme}
          />
        )}
        {isAdmin && activeTicket && <TicketDetail ticket={activeTicket} onBack={() => setOpenTicket(null)} onUpdate={handleUpdate} isAdmin={true} />}
      </Page>
    </div>
  );
}
