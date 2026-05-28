import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bell,
  Building2,
  Camera,
  CircleAlert,
  CircleCheckBig,
  CircleX,
  Crown,
  Palette,
  Inbox,
  ImagePlus,
  Megaphone,
  Power,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  Vote,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { candidateService, electionService, superAdminService, userService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import type { Candidate as ApiCandidate, Election as ApiElection } from "../types";

// ════════════════════════════════════════ TYPES ════════════════════════════════════════

interface University {
  id: number;
  name: string;
  code: string;
  abbreviation: string;
  isActive: boolean;
  description?: string;
  location?: string;
  website?: string;
  contact_email?: string;
}

interface Election {
  id: number;
  title: string;
  universityId: number;
  status: "active" | "pending" | "completed";
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  votes?: number;
}

interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  universityId: number;
}

interface Toast {
  message: string;
  type: "success" | "error" | "info";
}

type DashboardTheme = "light" | "dark";

interface CandidateRecord {
  id: number;
  electionId: number;
  candidateName: string;
  partyName: string;
  candidatePhoto: string;
  partyLogo: string;
  position: string;
  manifesto: string;
  votesCount: number;
  createdAt: string;
}

type CandidateFormState = {
  electionId: number;
  candidateName: string;
  partyName: string;
  candidatePhoto: string;
  partyLogo: string;
  position: string;
  manifesto: string;
};

interface ApiUniversity {
  id: number;
  name: string;
  code: string;
  abbreviation: string;
  description?: string;
  location?: string;
  website?: string;
  contact_email?: string;
  is_active: boolean;
}

interface ApiAdmin {
  id: number;
  email: string;
  full_name: string;
  university_id?: number | null;
}

const normalizeElectionStatus = (status: string): Election["status"] => {
  if (status === "active" || status === "completed") return status;
  return "pending";
};

const formatDatePart = (value: string): string => value.slice(0, 10);
const formatTimePart = (value: string): string => value.slice(11, 16);

const mapElectionFromApi = (election: ApiElection): Election => ({
  id: election.id,
  title: election.title,
  universityId: election.university_id ?? 0,
  status: normalizeElectionStatus(election.status),
  startDate: formatDatePart(election.start_date),
  endDate: formatDatePart(election.end_date),
  startTime: formatTimePart(election.start_date),
  endTime: formatTimePart(election.end_date),
  description: election.description,
  votes: 0,
});

const mapCandidateFromApi = (candidate: ApiCandidate): CandidateRecord => ({
  id: candidate.id,
  electionId: candidate.election_id,
  candidateName: candidate.candidate_name,
  partyName: candidate.party_name?.trim() || "Independent",
  candidatePhoto: candidate.candidate_photo || "",
  partyLogo: candidate.party_logo || "",
  position: candidate.position,
  manifesto: candidate.manifesto,
  votesCount: candidate.votes_count,
  createdAt: candidate.created_at,
});

const mapUniversityFromApi = (university: ApiUniversity): University => ({
  id: university.id,
  name: university.name,
  code: university.code,
  abbreviation: university.abbreviation,
  description: university.description,
  location: university.location,
  website: university.website,
  contact_email: university.contact_email,
  isActive: university.is_active,
});

const mapAdminFromApi = (admin: ApiAdmin): AdminUser => ({
  id: admin.id,
  email: admin.email,
  fullName: admin.full_name,
  universityId: admin.university_id || 0,
});

const buildElectionDateTime = (date: string, time: string | undefined): string =>
  `${date}T${(time || "00:00").padEnd(5, "0")}:00`;

const getApiErrorMessage = (error: unknown, fallbackMessage: string): string => {
  const detail = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
  if (typeof detail === "string" && detail.trim().length > 0) return detail;
  return fallbackMessage;
};

const THEME_STORAGE_KEY = "thuto-admin-apple-theme";
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

const readImageAsDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Failed to read image"));
    reader.readAsDataURL(file);
  });

const getInitials = (value: string): string =>
  value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "SA";

const getInitialTheme = (): DashboardTheme => {
  if (typeof window === "undefined") return "dark";
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
  return "dark";
};

const formatDashboardDate = (value: string): string => {
  if (!value) return "--";
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value.slice(0, 10);
  return parsedDate.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const toElectionDateTime = (date: string, time: string | undefined, fallback: "start" | "end"): Date => {
  if (!date) return new Date(Number.NaN);
  const normalizedTime = (time && /^\d{2}:\d{2}$/.test(time)) ? time : fallback === "end" ? "23:59" : "00:00";
  return new Date(`${date}T${normalizedTime}:00`);
};

const formatDigitalClock = (value: Date): string => {
  const hh = String(value.getHours()).padStart(2, "0");
  const mm = String(value.getMinutes()).padStart(2, "0");
  const ss = String(value.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
};

const formatDigitalDate = (value: Date): string =>
  value.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" });

const formatCountdown = (milliseconds: number): string => {
  const safeSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(safeSeconds / 86400);
  const hours = Math.floor((safeSeconds % 86400) / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  const pad = (v: number): string => String(v).padStart(2, "0");
  return days > 0 ? `${days}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

// ════════════════════════════════════════ STYLES ════════════════════════════════════════

const ADMIN_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after {
    margin: 0; padding: 0; box-sizing: border-box;
  }

  :root {
    --font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Helvetica Neue", "Segoe UI", sans-serif;
    --sidebar-w: 260px;
    --topbar-h: 56px;
    --radius-sm: 8px;
    --radius-md: 12px;
    --radius-lg: 16px;
    --radius-xl: 20px;
  }

  /* ── LIGHT THEME ── */
  .dash-root[data-theme="light"] {
    --bg:          #f5f5f7;
    --bg-2:        #ffffff;
    --bg-3:        #f0f0f2;
    --sidebar:     #1c1c1e;
    --sidebar-2:   #2c2c2e;
    --sidebar-3:   #3a3a3c;
    --border:      rgba(0,0,0,0.08);
    --border-s:    rgba(255,255,255,0.08);
    --txt-primary: #1d1d1f;
    --txt-2:       #3d3d3f;
    --txt-3:       #6e6e73;
    --txt-inv:     #f5f5f7;
    --accent:      #0a84ff;
    --accent-2:    #0071e3;
    --green:       #30d158;
    --amber:       #ffd60a;
    --red:         #ff453a;
    --tag-active:  rgba(48,209,88,0.12);
    --tag-active-c:#30d158;
    --tag-pending: rgba(255,214,10,0.12);
    --tag-pending-c:#b8860b;
    --tag-done:    rgba(110,110,115,0.12);
    --tag-done-c:  #6e6e73;
    --sh-card:     0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
    --sh-float:    0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
    --sh-modal:    0 32px 80px rgba(0,0,0,0.18);
  }

  /* ── DARK THEME (default) ── */
  .dash-root[data-theme="dark"] {
    --bg:          #000000;
    --bg-2:        #1c1c1e;
    --bg-3:        #2c2c2e;
    --sidebar:     #111113;
    --sidebar-2:   #1c1c1e;
    --sidebar-3:   #2c2c2e;
    --border:      rgba(255,255,255,0.08);
    --border-s:    rgba(255,255,255,0.08);
    --txt-primary: #f5f5f7;
    --txt-2:       #aeaeb2;
    --txt-3:       #636366;
    --txt-inv:     #1d1d1f;
    --accent:      #0a84ff;
    --accent-2:    #409cff;
    --green:       #30d158;
    --amber:       #ffd60a;
    --red:         #ff453a;
    --tag-active:  rgba(48,209,88,0.15);
    --tag-active-c:#30d158;
    --tag-pending: rgba(255,214,10,0.15);
    --tag-pending-c:#ffd60a;
    --tag-done:    rgba(110,110,115,0.15);
    --tag-done-c:  #aeaeb2;
    --sh-card:     0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3);
    --sh-float:    0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);
    --sh-modal:    0 32px 80px rgba(0,0,0,0.7);
  }

  .dash-root {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    font-family: var(--font);
    font-size: 13px;
    line-height: 1.5;
    color: var(--txt-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ═══════════════ SCROLLBAR ═══════════════ */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  /* ═══════════════ SIDEBAR ═══════════════ */
  .sidebar {
    width: var(--sidebar-w);
    height: 100vh;
    position: fixed;
    left: 0; top: 0;
    background: var(--sidebar);
    border-right: 1px solid var(--border-s);
    display: flex;
    flex-direction: column;
    z-index: 200;
    overflow-y: auto;
    overflow-x: hidden;
    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
  }
  .sidebar.closed { transform: translateX(-100%); }

  .sidebar-brand {
    padding: 20px 18px 16px;
    display: flex;
    align-items: center;
    gap: 11px;
    border-bottom: 1px solid var(--border-s);
  }
  .sidebar-brand-icon {
    width: 34px; height: 34px;
    background: var(--accent);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .sidebar-brand-icon svg { color: #fff; }
  .sidebar-brand-text { font-size: 14px; font-weight: 700; color: var(--txt-inv); letter-spacing: -0.02em; }
  .dash-root[data-theme="dark"] .sidebar-brand-text { color: var(--txt-primary); }
  .sidebar-brand-sub { font-size: 10px; color: var(--txt-3); margin-top: 1px; }

  .sidebar-profile {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border-s);
  }
  .sidebar-profile-row {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 10px;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: background 0.15s;
  }
  .sidebar-profile-row:hover { background: var(--sidebar-3); }
  .sidebar-avatar {
    width: 38px; height: 38px;
    border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700;
    color: #fff;
    flex-shrink: 0;
    overflow: hidden;
    position: relative;
  }
  .sidebar-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .sidebar-avatar-edit {
    position: absolute; bottom: 0; right: 0;
    width: 16px; height: 16px;
    background: rgba(0,0,0,0.7);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .sidebar-profile-info { min-width: 0; flex: 1; }
  .sidebar-profile-name {
    font-size: 12px; font-weight: 600;
    color: var(--txt-primary);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .dash-root[data-theme="light"] .sidebar-profile-name { color: #f5f5f7; }
  .sidebar-profile-role {
    font-size: 10px; color: var(--accent);
    font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase;
  }

  .sidebar-submenu {
    display: flex; flex-direction: column; gap: 2px;
    padding: 6px 10px 0;
  }
  .sidebar-subitem {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    background: transparent;
    border: none;
    color: var(--txt-3);
    font-size: 11px; font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    font-family: var(--font);
    width: 100%;
    text-align: left;
  }
  .sidebar-subitem:hover { background: var(--sidebar-3); color: var(--txt-primary); }
  .dash-root[data-theme="light"] .sidebar-subitem { color: rgba(255,255,255,0.5); }
  .dash-root[data-theme="light"] .sidebar-subitem:hover { color: #fff; }

  .sidebar-nav { padding: 12px 10px; flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .sidebar-nav-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--txt-3);
    padding: 6px 8px 4px;
    margin-top: 4px;
  }
  .nav-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px;
    border-radius: var(--radius-md);
    background: transparent; border: none;
    color: var(--txt-3);
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    width: 100%; text-align: left;
    transition: all 0.15s;
    font-family: var(--font);
  }
  .nav-btn:hover { background: var(--sidebar-3); color: var(--txt-primary); }
  .nav-btn.active {
    background: var(--accent);
    color: #fff;
    font-weight: 600;
  }
  .dash-root[data-theme="light"] .nav-btn { color: rgba(255,255,255,0.55); }
  .dash-root[data-theme="light"] .nav-btn:hover { background: var(--sidebar-3); color: #fff; }
  .nav-btn-icon { width: 18px; height: 18px; flex-shrink: 0; display: flex; align-items: center; }
  .nav-btn-icon svg { width: 16px; height: 16px; }

  /* ═══════════════ MAIN ═══════════════ */
  .dash-main {
    display: flex; flex-direction: column;
    flex: 1; min-width: 0;
  }

  /* ═══════════════ TOPBAR ═══════════════ */
  .top-nav-shell {
    position: sticky;
    top: 0;
    z-index: 140;
    border-bottom: 1px solid var(--border);
    background: var(--bg-2);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }
  .topbar {
    min-height: var(--topbar-h);
    background: transparent;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center;
    padding: 10px 20px;
    gap: 14px;
  }
  .topbar:last-child { border-bottom: none; }

  .topbar-primary {}
  .topbar-secondary {
    min-height: 56px;
    align-items: center;
    gap: 12px;
    justify-content: center;
  }
  .topbar-secondary::before {
    content: "";
    width: 38px;
    height: 38px;
    flex-shrink: 0;
  }

  .topbar-brand {
    display: flex; align-items: center; justify-content: center;
    gap: 10px;
    flex-shrink: 0;
  }
  .topbar-brand-icon {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    color: #fff;
  }
  .topbar-brand-title { font-size: 14px; font-weight: 700; letter-spacing: -0.02em; color: var(--txt-primary); line-height: 1.1; }
  .topbar-brand-sub { font-size: 10px; color: var(--txt-3); line-height: 1.1; margin-top: 2px; }

  .topbar-search-wrap {
    flex: 1;
    display: flex;
    justify-content: center;
    min-width: 0;
  }
  .topbar-search {
    width: min(100%, 560px);
    position: relative;
  }
  .topbar-search-icon {
    position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
    color: var(--txt-3);
  }
  .topbar-search-icon svg { width: 14px; height: 14px; }
  .topbar-search input {
    width: 100%;
    padding: 7px 12px 7px 32px;
    background: var(--bg-3);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 13px; color: var(--txt-primary);
    font-family: var(--font);
    outline: none; transition: all 0.15s;
  }
  .topbar-search input::placeholder { color: var(--txt-3); }
  .topbar-search input:focus {
    border-color: var(--accent);
    background: var(--bg-2);
    box-shadow: 0 0 0 3px rgba(10,132,255,0.12);
  }

  .topbar-actions { display: flex; align-items: center; gap: 8px; }
  .topbar-icon-btn {
    width: 32px; height: 32px;
    background: var(--bg-3); border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--txt-2);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; position: relative;
    transition: all 0.15s;
  }
  .topbar-icon-btn:hover { border-color: var(--accent); color: var(--accent); }
  .topbar-icon-btn svg { width: 15px; height: 15px; }
  .notif-dot {
    position: absolute; top: -2px; right: -2px;
    width: 8px; height: 8px;
    background: var(--red); border-radius: 50%;
    border: 2px solid var(--bg-2);
  }

  .topbar-pill {
    display: flex; align-items: center; gap: 6px;
    padding: 0 12px; height: 32px;
    background: var(--bg-3); border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--txt-2); font-size: 12px; font-weight: 500;
    cursor: pointer; transition: all 0.15s;
    font-family: var(--font);
  }
  .topbar-pill:hover { border-color: var(--accent); color: var(--accent); }
  .topbar-pill svg { width: 14px; height: 14px; }

  .topbar-logout {
    display: flex; align-items: center; gap: 6px;
    padding: 0 14px; height: 32px;
    background: var(--bg-3); border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--txt-2); font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all 0.15s;
    font-family: var(--font);
  }
  .topbar-logout:hover { background: var(--red); border-color: var(--red); color: #fff; }
  .topbar-logout svg { width: 14px; height: 14px; }

  .topnav-watch {
    width: 100%;
    min-height: 172px;
    border-radius: 22px;
    border: 1px solid var(--border);
    background: linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03));
    box-shadow: var(--sh-card);
    padding: 14px;
    display: grid;
    grid-template-columns: 168px 1fr;
    align-items: center;
    gap: 16px;
    color: var(--txt-primary);
  }
  .dash-root[data-theme="light"] .topnav-watch {
    background: linear-gradient(160deg, #ffffff 0%, #f2f2f4 100%);
    border-color: rgba(0,0,0,0.12);
  }
  .dash-root[data-theme="dark"] .topnav-watch {
    background: linear-gradient(160deg, #2a2a2e 0%, #1a1a1e 100%);
    border-color: rgba(255,255,255,0.16);
  }

  .analog-dial-wrap {
    width: 168px;
    height: 168px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .analog-svg { width: 100%; height: 100%; }
  .analog-ring {
    fill: none;
    stroke: rgba(255,255,255,0.32);
    stroke-width: 4;
  }
  .dash-root[data-theme="light"] .analog-ring { stroke: rgba(0,0,0,0.18); }
  .analog-face {
    fill: #f7f7f9;
  }
  .dash-root[data-theme="dark"] .analog-face { fill: #f2f2f5; }
  .analog-tick {
    stroke: #6e6e73;
    stroke-width: 1.5;
    stroke-linecap: round;
  }
  .analog-tick.major {
    stroke: #1d1d1f;
    stroke-width: 2.4;
  }
  .analog-hand {
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }
  .analog-hand.hour { stroke: #1d1d1f; stroke-width: 6.2; }
  .analog-hand.minute { stroke: #2c2c2e; stroke-width: 4.2; }
  .analog-hand.second { stroke: #ff453a; stroke-width: 2.1; }
  .analog-center {
    fill: #1d1d1f;
    stroke: #ffffff;
    stroke-width: 1.6;
  }

  .analog-meta {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .analog-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--txt-3);
  }
  .analog-time {
    font-family: "SF Mono", "Menlo", "Consolas", monospace;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: 0.02em;
    color: var(--txt-primary);
    line-height: 1;
  }
  .analog-date {
    font-size: 12px;
    color: var(--txt-2);
  }
  .analog-election {
    font-size: 11px;
    font-weight: 700;
    color: var(--txt-primary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
  }
  .analog-timer {
    font-family: "SF Mono", "Menlo", "Consolas", monospace;
    font-size: 14px;
    font-weight: 700;
    color: #30d158;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .analog-timer.pending { color: #ffd60a; }
  .analog-timer.idle { color: var(--txt-2); }

  .watch-head-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .page-head-watch {
    width: min(620px, 56vw);
    min-width: 360px;
  }

  .topnav-profile-slot {
    display: flex;
    justify-content: flex-end;
  }

  .topnav-profile-menu {
    position: relative;
    flex-shrink: 0;
    width: 38px;
    height: 38px;
  }
  .topnav-avatar-btn {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--bg-3);
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
  }
  .topnav-avatar-btn:hover,
  .topnav-avatar-btn.active {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(10,132,255,0.14);
  }
  .topnav-avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 12px; font-weight: 700;
    overflow: hidden; flex-shrink: 0;
  }
  .topnav-avatar img { width: 100%; height: 100%; object-fit: cover; }

  .topnav-dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 170px;
    padding: 6px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-2);
    box-shadow: var(--sh-float);
    z-index: 220;
  }
  .topnav-dropdown-item {
    width: 100%;
    height: 32px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--txt-2);
    font-size: 12px;
    font-weight: 600;
    font-family: var(--font);
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 0 10px;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
  }
  .topnav-dropdown-item:hover {
    background: var(--bg-3);
    color: var(--accent);
  }
  .topnav-dropdown-item svg { width: 13px; height: 13px; }

  .topnav-menu-wrap {
    flex: 1;
    min-width: 0;
    display: flex;
    justify-content: center;
  }
  .topnav-menu {
    display: flex;
    align-items: center;
    gap: 8px;
    overflow-x: auto;
    max-width: 100%;
    margin: 0 auto;
  }
  .topnav-btn {
    height: 32px;
    padding: 0 12px;
    border-radius: var(--radius-md);
    border: 1px solid var(--border);
    background: var(--bg-3);
    color: var(--txt-2);
    font-size: 12px;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.15s;
    font-family: var(--font);
  }
  .topnav-btn:hover { border-color: var(--accent); color: var(--accent); }
  .topnav-btn.active {
    background: var(--accent);
    border-color: var(--accent);
    color: #fff;
  }
  .topnav-btn svg { width: 14px; height: 14px; }

  /* ═══════════════ PAGE CONTENT ═══════════════ */
  .page-content { flex: 1; padding: 24px; overflow-y: auto; }
  .page-content.workspace-content {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
  }

  /* Cleaner layout for second-nav pages (all tabs except overview) */
  .page-content.workspace-content .content-grid {
    grid-template-columns: minmax(380px, 460px) minmax(0, 1fr);
    gap: 18px;
    align-items: start;
  }
  .page-content.workspace-content .card {
    box-shadow: none;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }
  .page-content.workspace-content .card-head {
    padding: 14px 16px;
    background: var(--bg-3);
  }
  .page-content.workspace-content .card-head-title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .page-content.workspace-content .card-body { padding: 18px; }

  .page-content.workspace-content .form-group { margin-bottom: 15px; }
  .page-content.workspace-content .f-label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
    text-transform: none;
    color: var(--txt-2);
    margin-bottom: 6px;
  }
  .page-content.workspace-content .f-input,
  .page-content.workspace-content .f-select,
  .page-content.workspace-content .f-textarea {
    padding: 10px 12px;
    background: var(--bg-2);
    border: 1.5px solid rgba(110, 110, 115, 0.45);
    border-radius: 10px;
    box-shadow: none;
  }
  .page-content.workspace-content .f-input:focus,
  .page-content.workspace-content .f-select:focus,
  .page-content.workspace-content .f-textarea:focus {
    border-color: rgba(110, 110, 115, 0.8);
    background: var(--bg-2);
    box-shadow: none;
  }
  .page-content.workspace-content .f-input::placeholder,
  .page-content.workspace-content .f-textarea::placeholder {
    color: var(--txt-3);
    -webkit-text-fill-color: var(--txt-3);
  }
  .page-content.workspace-content .f-hint {
    background: var(--bg-2);
    border: 1px solid rgba(110, 110, 115, 0.45);
  }

  .page-content.workspace-content .media-picker {
    background: var(--bg-2);
    border: 1.5px solid rgba(110, 110, 115, 0.45);
  }
  .page-content.workspace-content .media-upload-btn {
    background: var(--bg-2);
    border: 1px solid rgba(110, 110, 115, 0.45);
  }

  .page-content.workspace-content .btn-primary:hover:not(:disabled),
  .page-content.workspace-content .btn-success:hover:not(:disabled) {
    transform: none;
    box-shadow: none;
    filter: none;
  }

  .page-head {
    margin-bottom: 24px;
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 16px;
  }
  .page-head-left {}
  .page-breadcrumb {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: var(--txt-3); margin-bottom: 6px;
  }
  .page-breadcrumb svg { width: 12px; height: 12px; }
  .page-title { font-size: 22px; font-weight: 700; letter-spacing: -0.03em; color: var(--txt-primary); }
  .page-subtitle { font-size: 12px; color: var(--txt-3); margin-top: 3px; }

  /* ═══════════════ KPI GRID ═══════════════ */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
  .kpi-card {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 16px;
    box-shadow: var(--sh-card);
    transition: transform 0.18s, box-shadow 0.18s;
    position: relative;
    overflow: hidden;
  }
  .kpi-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--kpi-accent,var(--accent)) 50%, transparent);
    opacity: 0.6;
  }
  .kpi-card:hover { transform: translateY(-2px); box-shadow: var(--sh-float); }
  .kpi-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .kpi-icon {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: var(--bg-3);
    display: flex; align-items: center; justify-content: center;
    color: var(--kpi-accent, var(--accent));
  }
  .kpi-icon svg { width: 16px; height: 16px; }
  .kpi-trend {
    display: flex; align-items: center; gap: 3px;
    font-size: 11px; font-weight: 600;
    color: var(--green);
    background: rgba(48,209,88,0.12);
    padding: 3px 7px; border-radius: 99px;
  }
  .kpi-trend.down { color: var(--red); background: rgba(255,69,58,0.12); }
  .kpi-trend svg { width: 12px; height: 12px; }
  .kpi-value { font-size: 28px; font-weight: 700; letter-spacing: -0.04em; color: var(--txt-primary); line-height: 1; }
  .kpi-label { font-size: 11px; color: var(--txt-3); margin-top: 5px; }

  /* ═══════════════ OVERVIEW LAYOUT ═══════════════ */
  .overview-grid {
    display: grid;
    grid-template-columns: 240px 1fr 280px;
    gap: 16px;
    align-items: start;
  }
  .overview-col { display: grid; gap: 14px; }

  /* ═══════════════ CARDS ═══════════════ */
  .card {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    box-shadow: var(--sh-card);
    overflow: hidden;
  }
  .card-head {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px;
  }
  .card-head-title { font-size: 13px; font-weight: 600; color: var(--txt-primary); }
  .card-body { padding: 16px; }
  .card-body.no-pad { padding: 0; }

  /* ═══════════════ PROFILE CARD ═══════════════ */
  .profile-card {
    background: linear-gradient(145deg, #0d1117 0%, #1a1f2e 50%, #0d1117 100%);
    border: 1px solid rgba(10,132,255,0.2);
    border-radius: var(--radius-xl);
    padding: 18px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.4);
    color: #fff;
  }
  .dash-root[data-theme="light"] .profile-card {
    background: linear-gradient(145deg, #0a1628, #0d2240 50%, #0a1628);
    border-color: rgba(10,132,255,0.3);
  }
  .profile-card-top {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 14px;
  }
  .profile-card-role {
    font-size: 10px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--accent);
  }
  .profile-card-badge {
    padding: 3px 8px; border-radius: 99px;
    border: 1px solid rgba(10,132,255,0.3);
    background: rgba(10,132,255,0.12);
    font-size: 10px; font-weight: 600; color: var(--accent);
  }
  .profile-card-name { font-size: 18px; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 3px; }
  .profile-card-email { font-size: 11px; color: rgba(255,255,255,0.5); margin-bottom: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .profile-card-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .profile-stat {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: var(--radius-md);
    padding: 10px;
  }
  .profile-stat-label { font-size: 10px; color: rgba(255,255,255,0.5); margin-bottom: 4px; }
  .profile-stat-value { font-size: 20px; font-weight: 700; letter-spacing: -0.03em; }

  /* ═══════════════ QUICK ACTIONS ═══════════════ */
  .qa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .qa-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 9px 10px;
    background: var(--bg-3); border: 1px solid var(--border);
    border-radius: var(--radius-md);
    color: var(--txt-2); font-size: 11px; font-weight: 500;
    cursor: pointer; transition: all 0.15s;
    font-family: var(--font);
  }
  .qa-btn:hover { border-color: var(--accent); color: var(--accent); background: rgba(10,132,255,0.06); }
  .qa-btn svg { width: 13px; height: 13px; flex-shrink: 0; }

  /* ═══════════════ HEALTH BARS ═══════════════ */
  .health-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
  .health-label { font-size: 11px; color: var(--txt-3); width: 66px; text-transform: capitalize; }
  .health-track { flex: 1; height: 5px; border-radius: 99px; background: var(--bg-3); overflow: hidden; }
  .health-fill { height: 100%; border-radius: 99px; background: var(--accent); transition: width 0.6s cubic-bezier(0.4,0,0.2,1); }
  .health-fill.active { background: var(--green); }
  .health-fill.pending { background: var(--amber); }
  .health-fill.completed { background: var(--txt-3); }
  .health-count { font-size: 11px; font-weight: 700; color: var(--txt-primary); width: 20px; text-align: right; }

  /* ═══════════════ BAR CHART ═══════════════ */
  .bar-chart {
    display: flex; align-items: flex-end; gap: 6px;
    height: 100px; padding: 0 2px;
  }
  .bar-col { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
  .bar-track { width: 100%; flex: 1; border-radius: 4px 4px 0 0; background: var(--bg-3); display: flex; flex-direction: column; justify-content: flex-end; overflow: hidden; }
  .bar-fill { width: 100%; border-radius: 4px 4px 0 0; background: var(--accent); min-height: 4px; transition: height 0.5s cubic-bezier(0.4,0,0.2,1); }
  .bar-val { font-size: 9px; font-weight: 700; color: var(--txt-3); }
  .bar-lbl { font-size: 9px; color: var(--txt-3); }

  /* ═══════════════ DONUT ═══════════════ */
  .donut-wrap { display: flex; justify-content: center; margin-bottom: 14px; }
  .donut { width: 130px; height: 130px; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center; }
  .donut-inner {
    width: 82px; height: 82px; border-radius: 50%;
    background: var(--bg-2); border: 1px solid var(--border);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: absolute;
  }
  .donut-value { font-size: 22px; font-weight: 700; letter-spacing: -0.04em; color: var(--txt-primary); line-height: 1; }
  .donut-sublabel { font-size: 9px; color: var(--txt-3); margin-top: 2px; }
  .stat-legend { display: grid; gap: 7px; }
  .stat-legend-row { display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--txt-2); }
  .stat-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .stat-dot.active { background: var(--green); }
  .stat-dot.pending { background: var(--amber); }
  .stat-dot.completed { background: var(--txt-3); }
  .stat-count { margin-left: auto; font-weight: 700; color: var(--txt-primary); }

  /* ═══════════════ TABLE ═══════════════ */
  .t-wrap { overflow-x: auto; }
  .t { width: 100%; border-collapse: collapse; font-size: 12px; }
  .t th {
    padding: 9px 12px; text-align: left;
    font-size: 10px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase;
    color: var(--txt-3); border-bottom: 1px solid var(--border);
    background: var(--bg-3);
  }
  .t td { padding: 11px 12px; border-bottom: 1px solid var(--border); color: var(--txt-primary); vertical-align: middle; }
  .t tbody tr:last-child td { border-bottom: none; }
  .t tbody tr { transition: background 0.12s; }
  .t tbody tr:hover { background: var(--bg-3); }
  .t-title { font-weight: 600; font-size: 12px; }
  .t-sub { font-size: 10px; color: var(--txt-3); margin-top: 1px; }

  /* ═══════════════ BADGES ═══════════════ */
  .badge {
    display: inline-flex; align-items: center;
    padding: 3px 8px; border-radius: 99px;
    font-size: 10px; font-weight: 600; letter-spacing: 0.02em;
  }
  .badge-active { background: var(--tag-active); color: var(--tag-active-c); }
  .badge-pending { background: var(--tag-pending); color: var(--tag-pending-c); }
  .badge-completed { background: var(--tag-done); color: var(--tag-done-c); }
  .badge-info { background: rgba(10,132,255,0.12); color: var(--accent); }

  /* ═══════════════ ACTIVITY FEED ═══════════════ */
  .activity-item { display: flex; gap: 10px; align-items: flex-start; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .activity-item:last-child { border-bottom: none; }
  .activity-icon {
    width: 26px; height: 26px; flex-shrink: 0;
    border-radius: 50%; background: var(--bg-3); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--txt-3);
  }
  .activity-icon svg { width: 12px; height: 12px; }
  .activity-copy strong { display: block; font-size: 11px; font-weight: 500; color: var(--txt-primary); line-height: 1.4; }
  .activity-copy span { font-size: 10px; color: var(--txt-3); }

  /* ═══════════════ FORMS ═══════════════ */
  .form-group { margin-bottom: 14px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .f-label { display: block; font-size: 10px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--txt-3); margin-bottom: 5px; }
  .f-input, .f-select, .f-textarea {
    width: 100%; padding: 8px 11px;
    background: var(--bg-3); border: 1px solid var(--border);
    border-radius: var(--radius-md);
    font-size: 13px; font-family: var(--font); color: var(--txt-primary);
    outline: none; transition: all 0.15s;
    -webkit-text-fill-color: var(--txt-primary);
    caret-color: var(--txt-primary);
  }
  .f-input::placeholder, .f-textarea::placeholder { color: var(--txt-3); -webkit-text-fill-color: var(--txt-3); }
  .f-input:focus, .f-select:focus, .f-textarea:focus {
    border-color: var(--accent);
    background: var(--bg-2);
    box-shadow: 0 0 0 3px rgba(10,132,255,0.12);
  }
  .f-input:disabled, .f-select:disabled { opacity: 0.5; cursor: not-allowed; }
  .f-textarea { resize: vertical; min-height: 80px; }
  .f-select { cursor: pointer; }
  .f-select option { background: var(--bg-2); color: var(--txt-primary); }
  .f-input:-webkit-autofill, .f-input:-webkit-autofill:focus {
    -webkit-text-fill-color: var(--txt-primary) !important;
    box-shadow: 0 0 0 1000px var(--bg-3) inset !important;
    transition: background-color 9999s ease-in-out 0s;
  }
  .f-hint { font-size: 11px; color: var(--txt-3); margin-top: 8px; padding: 8px 10px; background: var(--bg-3); border-radius: var(--radius-sm); border: 1px solid var(--border); }

  /* ═══════════════ BUTTONS ═══════════════ */
  .btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 6px;
    padding: 8px 16px; border-radius: var(--radius-md);
    font-size: 13px; font-weight: 600; font-family: var(--font);
    border: none; cursor: pointer; transition: all 0.15s;
  }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn svg { width: 14px; height: 14px; }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover:not(:disabled) { background: var(--accent-2); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(10,132,255,0.35); }
  .btn-success { background: var(--green); color: #000; }
  .btn-success:hover:not(:disabled) { filter: brightness(0.9); transform: translateY(-1px); }
  .btn-ghost { background: var(--bg-3); border: 1px solid var(--border); color: var(--txt-2); }
  .btn-ghost:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); }
  .btn-danger { background: var(--red); color: #fff; }
  .btn-danger:hover:not(:disabled) { filter: brightness(0.9); }
  .btn-block { width: 100%; }

  /* ═══════════════ LIST ITEMS ═══════════════ */
  .list-item {
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    background: var(--bg-3);
    margin-bottom: 8px;
    transition: all 0.15s;
  }
  .list-item:last-child { margin-bottom: 0; }
  .list-item:hover { border-color: rgba(10,132,255,0.3); }
  .list-item-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 5px; }
  .list-item-title { font-size: 13px; font-weight: 600; color: var(--txt-primary); }
  .list-item-meta { font-size: 11px; color: var(--txt-3); line-height: 1.5; }
  .list-item-meta + .list-item-meta { margin-top: 3px; }

  /* ═══════════════ CANDIDATE ROW ═══════════════ */
  .cand-row { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0; }
  .cand-logo {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--bg-2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--txt-3); overflow: hidden; flex-shrink: 0;
  }
  .cand-logo img { width: 100%; height: 100%; object-fit: cover; }
  .cand-photo {
    width: 36px; height: 36px; border-radius: 50%;
    background: var(--accent); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff;
    overflow: hidden; flex-shrink: 0;
  }
  .cand-photo img { width: 100%; height: 100%; object-fit: cover; }

  /* ═══════════════ MEDIA PICKER ═══════════════ */
  .media-picker {
    display: flex; align-items: center; gap: 12px;
    padding: 10px; border: 1px solid var(--border);
    border-radius: var(--radius-md); background: var(--bg-3);
  }
  .media-preview {
    width: 56px; height: 56px;
    border-radius: 10px; overflow: hidden;
    background: var(--bg-2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--txt-3); flex-shrink: 0;
  }
  .media-preview.round { border-radius: 50%; }
  .media-preview img { width: 100%; height: 100%; object-fit: cover; }
  .media-preview svg { width: 18px; height: 18px; }
  .media-actions { display: flex; flex-direction: column; gap: 6px; }
  .media-upload-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 5px 10px;
    background: var(--bg-2); border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--txt-2); font-size: 11px; font-weight: 600;
    cursor: pointer; font-family: var(--font); transition: all 0.15s;
  }
  .media-upload-btn:hover { border-color: var(--accent); color: var(--accent); }
  .media-upload-btn input { display: none; }
  .media-upload-btn svg { width: 12px; height: 12px; }
  .media-clear-btn {
    background: none; border: none; padding: 0;
    font-size: 10px; font-weight: 600; color: var(--txt-3);
    cursor: pointer; text-align: left; font-family: var(--font);
    transition: color 0.12s;
  }
  .media-clear-btn:hover { color: var(--red); }
  .media-clear-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ═══════════════ EMPTY STATE ═══════════════ */
  .empty-state { padding: 40px 20px; text-align: center; }
  .empty-icon { width: 48px; height: 48px; margin: 0 auto 12px; opacity: 0.15; }
  .empty-icon svg { width: 100%; height: 100%; color: var(--txt-2); }
  .empty-text { font-size: 12px; color: var(--txt-3); }

  /* ═══════════════ SPINNER ═══════════════ */
  .spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.6s linear infinite; display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ═══════════════ TOAST ═══════════════ */
  .toast {
    position: fixed; bottom: 20px; right: 20px;
    display: flex; align-items: center; gap: 10px;
    padding: 12px 16px;
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: var(--sh-float);
    z-index: 9999;
    min-width: 280px; max-width: 380px;
    animation: toastIn 0.25s cubic-bezier(0.22,0.68,0,1.2);
  }
  @keyframes toastIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .toast-stripe { width: 3px; height: 28px; border-radius: 99px; flex-shrink: 0; }
  .toast.success .toast-stripe { background: var(--green); }
  .toast.error .toast-stripe { background: var(--red); }
  .toast.info .toast-stripe { background: var(--accent); }
  .toast-icon svg { width: 16px; height: 16px; }
  .toast.success .toast-icon { color: var(--green); }
  .toast.error .toast-icon { color: var(--red); }
  .toast.info .toast-icon { color: var(--accent); }
  .toast-msg { flex: 1; font-size: 12px; font-weight: 500; color: var(--txt-primary); }

  /* ═══════════════ MODAL ═══════════════ */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.6);
    display: flex; align-items: center; justify-content: center;
    z-index: 9998;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: var(--bg-2);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    padding: 28px;
    width: 90%; max-width: 380px;
    box-shadow: var(--sh-modal);
    animation: modalUp 0.28s cubic-bezier(0.22,0.68,0,1.2);
  }
  @keyframes modalUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-title { font-size: 16px; font-weight: 700; color: var(--txt-primary); margin-bottom: 4px; }
  .modal-sub { font-size: 12px; color: var(--txt-3); margin-bottom: 20px; }
  .upload-preview {
    width: 80px; height: 80px; border-radius: 50%;
    margin: 0 auto 16px;
    background: var(--bg-3); border: 2px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
  }
  .upload-preview img { width: 100%; height: 100%; object-fit: cover; }
  .upload-preview svg { color: var(--txt-3); width: 28px; height: 28px; }
  .upload-zone {
    border: 1.5px dashed var(--accent);
    border-radius: var(--radius-md);
    padding: 20px; text-align: center;
    background: rgba(10,132,255,0.04);
    cursor: pointer; transition: all 0.15s; margin-bottom: 16px;
  }
  .upload-zone:hover { background: rgba(10,132,255,0.08); }
  .upload-zone-icon { width: 36px; height: 36px; margin: 0 auto 6px; background: var(--bg-3); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; color: var(--accent); }
  .upload-zone-icon svg { width: 18px; height: 18px; }
  .upload-zone-text { font-size: 12px; font-weight: 500; color: var(--txt-2); }
  .upload-zone-hint { font-size: 10px; color: var(--txt-3); margin-top: 2px; }
  .modal-actions { display: flex; gap: 8px; }
  .modal-actions .btn { flex: 1; }

  /* ═══════════════ CONTENT GRID ═══════════════ */
  .content-grid { display: grid; grid-template-columns: 320px 1fr; gap: 16px; }

  /* ═══════════════ RESPONSIVE ═══════════════ */
  @media (max-width: 1280px) {
    .overview-grid { grid-template-columns: 1fr; }
    .kpi-grid { grid-template-columns: repeat(2, 1fr); }
    .content-grid { grid-template-columns: 1fr; }
    .page-content.workspace-content .content-grid { grid-template-columns: 1fr; }
    .page-head-watch {
      width: min(520px, 58vw);
      min-width: 320px;
    }
    .topnav-watch {
      grid-template-columns: 148px 1fr;
      min-height: 156px;
    }
    .analog-dial-wrap {
      width: 148px;
      height: 148px;
    }
    .analog-time { font-size: 24px; }
  }
  @media (max-width: 768px) {
    .kpi-grid { grid-template-columns: 1fr 1fr; }
    .page-content { padding: 16px; }
    .topbar { padding: 10px 14px; }
    .topbar-primary { flex-wrap: wrap; gap: 10px; }
    .topbar-search-wrap { order: 3; width: 100%; flex-basis: 100%; }
    .topbar-search { width: 100%; }
    .topbar-secondary { display: flex; gap: 10px; }
    .topbar-secondary::before { display: none; }
    .page-head-watch { width: 100%; min-width: 0; }
    .topnav-watch {
      min-height: 132px;
      padding: 10px;
      gap: 10px;
      grid-template-columns: 114px 1fr;
      border-radius: 16px;
    }
    .analog-dial-wrap {
      width: 114px;
      height: 114px;
    }
    .analog-time { font-size: 20px; }
    .analog-timer { font-size: 12px; }
    .topnav-menu-wrap { justify-content: flex-start; }
    .topnav-profile-slot { margin-left: auto; }
    .topnav-profile-menu { margin-left: 2px; }
    .topnav-dropdown { right: 0; min-width: 158px; }
  }
`;

// ════════════════════════════════════════ ICON HELPERS ════════════════════════════════════════

type IconProps = { size?: number; className?: string };
const mkIcon = (I: LucideIcon) => ({ size = 16, className }: IconProps) => <I size={size} strokeWidth={1.75} className={className} />;

const Icons = {
  Building: mkIcon(Building2),
  Vote: mkIcon(Vote),
  Users: mkIcon(Users),
  Chart: mkIcon(BarChart3),
  Search: mkIcon(Search),
  Bell: mkIcon(Bell),
  Theme: mkIcon(Palette),
  SignOut: mkIcon(Power),
  TrendUp: mkIcon(TrendingUp),
  TrendDown: mkIcon(TrendingDown),
  Check: mkIcon(CircleCheckBig),
  X: mkIcon(CircleX),
  Info: mkIcon(CircleAlert),
  Trash: mkIcon(Trash2),
  Empty: mkIcon(Inbox),
  Crown: mkIcon(Crown),
  News: mkIcon(Megaphone),
  Activity: mkIcon(Activity),
  Camera: mkIcon(Camera),
  Image: mkIcon(ImagePlus),
  ChevronRight: mkIcon(ChevronRight),
};

// ════════════════════════════════════════ TOAST ════════════════════════════════════════

const ToastNotif: React.FC<{ toast: Toast | null }> = ({ toast }) => {
  if (!toast) return null;
  const Icon = toast.type === "success" ? Icons.Check : toast.type === "error" ? Icons.X : Icons.Info;
  return (
    <div className={`toast ${toast.type}`}>
      <div className="toast-stripe" />
      <div className="toast-icon"><Icon size={16} /></div>
      <div className="toast-msg">{toast.message}</div>
    </div>
  );
};

// ════════════════════════════════════════ DATA TABLE ════════════════════════════════════════

const DataTable: React.FC<{
  columns: { key: string; label: string }[];
  data: any[];
  onDelete?: (id: number) => void;
}> = ({ columns, data, onDelete }) => (
  <div className="t-wrap">
    <table className="t">
      <thead>
        <tr>
          {columns.map(c => <th key={c.key}>{c.label}</th>)}
          {onDelete && <th>Action</th>}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr><td colSpan={columns.length + (onDelete ? 1 : 0)}>
            <div className="empty-state">
              <div className="empty-icon"><Icons.Empty size={48} /></div>
              <div className="empty-text">No data available</div>
            </div>
          </td></tr>
        ) : data.map((row, i) => (
          <tr key={row.id || i}>
            {columns.map(c => <td key={c.key}>{row[c.key]}</td>)}
            {onDelete && (
              <td>
                <button onClick={() => onDelete(row.id)} className="btn btn-ghost" style={{ padding: "4px 8px" }}>
                  <Icons.Trash size={13} />
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// ════════════════════════════════════════ MAIN COMPONENT ════════════════════════════════════════

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user, loginWithUser } = useAuth();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const profileMenuRef = React.useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState("overview");
  const [theme, setTheme] = useState<DashboardTheme>(getInitialTheme);
  const [toast, setToast] = useState<Toast | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingCoreData, setFetchingCoreData] = useState(true);
  const [savingElection, setSavingElection] = useState(false);
  const [savingCandidate, setSavingCandidate] = useState(false);
  const [deletingCandidateId, setDeletingCandidateId] = useState<number | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploadingProfile, setUploadingProfile] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const [universities, setUniversities] = useState<University[]>([]);
  const [universityForm, setUniversityForm] = useState<Partial<University>>({ name: "", code: "", abbreviation: "", description: "", location: "", website: "", contact_email: "" });
  const [elections, setElections] = useState<Election[]>([]);
  const [electionForm, setElectionForm] = useState<Partial<Election>>({ title: "", universityId: 0, description: "", startDate: "", endDate: "", startTime: "08:00", endTime: "16:00" });
  const [candidates, setCandidates] = useState<CandidateRecord[]>([]);
  const [candidateForm, setCandidateForm] = useState<CandidateFormState>({ electionId: 0, candidateName: "", partyName: "", candidatePhoto: "", partyLogo: "", position: "", manifesto: "" });
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [adminForm, setAdminForm] = useState({ email: "", fullName: "", password: "", universityId: 0 });

  const adminName = user?.full_name || "Admin User";
  const adminEmail = user?.email || "";
  const adminInitials = getInitials(adminName);
  const isSuperAdmin = user?.role === "super_admin";
  const isUniversityAdmin = user?.role === "admin";
  const assignedUniversityId = user?.university_id ?? 0;

  const showToast = useCallback((message: string, type: Toast["type"] = "success") => {
    setToast({ message, type });
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, []);

  const fetchElections = useCallback(async () => {
    const res = await electionService.listElections();
    const mapped = (res.data as ApiElection[]).map(mapElectionFromApi);
    const scoped = isUniversityAdmin && assignedUniversityId > 0 ? mapped.filter(e => e.universityId === assignedUniversityId) : mapped;
    setElections(scoped); return scoped;
  }, [assignedUniversityId, isUniversityAdmin]);

  const fetchCandidates = useCallback(async () => {
    const res = await candidateService.listCandidates();
    const mapped = (res.data as ApiCandidate[]).map(mapCandidateFromApi);
    setCandidates(mapped); return mapped;
  }, []);

  const fetchUniversities = useCallback(async () => {
    const res = await superAdminService.listUniversities();
    const data = ((res.data?.universities ?? []) as ApiUniversity[]).map(mapUniversityFromApi);
    const scoped = isUniversityAdmin && assignedUniversityId > 0 ? data.filter(u => u.id === assignedUniversityId) : data;
    setUniversities(scoped); return scoped;
  }, [assignedUniversityId, isUniversityAdmin]);

  const fetchAdmins = useCallback(async () => {
    if (!isSuperAdmin) { setAdmins([]); return []; }
    const res = await superAdminService.listAdmins();
    const data = ((res.data?.admins ?? []) as ApiAdmin[]).map(mapAdminFromApi);
    setAdmins(data); return data;
  }, [isSuperAdmin]);

  useEffect(() => { window.localStorage.setItem(THEME_STORAGE_KEY, theme); }, [theme]);
  useEffect(() => { setProfilePhoto(user?.profile_picture || null); }, [user?.profile_picture]);
  useEffect(() => {
    if (user?.role === "student") {
      navigate("/elections", { replace: true });
      return;
    }

    if (user?.role === "admin" && window.location.pathname === "/super-admin") {
      navigate("/admin", { replace: true });
    }
  }, [navigate, user?.role]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 100);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!profileMenuRef.current) return;
      if (profileMenuRef.current.contains(event.target as Node)) return;
      setShowProfileMenu(false);
    };
    window.addEventListener("mousedown", handleOutsideClick);
    return () => window.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleImageSelection = useCallback(async (files: FileList | null, onSuccess: (d: string) => void, msg: string) => {
    const file = files?.[0];
    if (!file) { onSuccess(""); return; }
    if (!file.type.startsWith("image/")) { showToast("Please choose an image file", "error"); return; }
    if (file.size > MAX_IMAGE_SIZE_BYTES) { showToast("Image must be 5MB or smaller", "error"); return; }
    try { const d = await readImageAsDataUrl(file); onSuccess(d); showToast(msg, "success"); }
    catch { showToast("Unable to read the selected image", "error"); }
  }, [showToast]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setFetchingCoreData(true);
      try {
        const [unis, elecs, cands] = await Promise.all([fetchUniversities(), fetchElections(), fetchCandidates()]);
        if (isSuperAdmin) await fetchAdmins();
        if (!mounted) return;
        const defUni = unis[0]?.id || 0;
        setElectionForm(c => ({ ...c, universityId: unis.some(u => u.id === c.universityId) ? c.universityId : defUni }));
        setAdminForm(c => ({ ...c, universityId: unis.some(u => u.id === c.universityId) ? c.universityId : defUni }));
        if (elecs.length > 0) setCandidateForm(c => ({ ...c, electionId: elecs.some(e => e.id === c.electionId) ? c.electionId : elecs[0].id }));
        setElections(cur => cur.map(e => ({ ...e, votes: cands.filter(c => c.electionId === e.id).reduce((s, c) => s + c.votesCount, 0) })));
      } catch (err) { if (mounted) showToast(getApiErrorMessage(err, "Unable to load dashboard data"), "error"); }
      finally { if (mounted) setFetchingCoreData(false); }
    })();
    return () => { mounted = false; };
  }, [isSuperAdmin, fetchAdmins, fetchCandidates, fetchElections, fetchUniversities, showToast]);

  const handleCreateUniversity = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!universityForm.name?.trim()) { showToast("University name is required", "error"); return; }
    if (!universityForm.code?.trim()) { showToast("Code is required", "error"); return; }
    if (!universityForm.abbreviation?.trim()) { showToast("Abbreviation is required", "error"); return; }
    setLoading(true);
    try {
      const res = await superAdminService.createUniversity({ name: universityForm.name.trim(), code: universityForm.code.trim(), abbreviation: universityForm.abbreviation.trim(), description: universityForm.description?.trim() || "", location: universityForm.location?.trim() || "", website: universityForm.website?.trim() || "", contact_email: universityForm.contact_email?.trim() || "" });
      const unis = await fetchUniversities();
      const id = typeof res.data?.id === "number" ? res.data.id : unis[0]?.id || 0;
      setElectionForm(c => ({ ...c, universityId: c.universityId || id }));
      setAdminForm(c => ({ ...c, universityId: c.universityId || id }));
      setUniversityForm({ name: "", code: "", abbreviation: "", description: "", location: "", website: "", contact_email: "" });
      showToast("University created", "success");
    } catch (err) { showToast(getApiErrorMessage(err, "Failed to create university"), "error"); }
    finally { setLoading(false); }
  }, [fetchUniversities, showToast, universityForm]);

  const handleDeleteUniversity = useCallback(async (id: number) => {
    setLoading(true);
    try {
      await superAdminService.deleteUniversity(id);
      const unis = await fetchUniversities();
      const fb = unis[0]?.id || 0;
      setElectionForm(c => ({ ...c, universityId: c.universityId === id ? fb : c.universityId }));
      setAdminForm(c => ({ ...c, universityId: c.universityId === id ? fb : c.universityId }));
      showToast("University deleted", "success");
    } catch (err) { showToast(getApiErrorMessage(err, "Failed to delete university"), "error"); }
    finally { setLoading(false); }
  }, [fetchUniversities, showToast]);

  const handleCreateElection = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (universities.length === 0) { showToast("Create a university first", "error"); return; }
    if (!electionForm.title?.trim()) { showToast("Election title is required", "error"); return; }
    const uId = isUniversityAdmin ? assignedUniversityId : electionForm.universityId;
    if (!uId) { showToast("Select a university", "error"); return; }
    if (!electionForm.startDate || !electionForm.endDate) { showToast("Start and end dates are required", "error"); return; }
    setSavingElection(true);
    try {
      const res = await electionService.createElection({ title: electionForm.title, description: electionForm.description || "", university_id: uId, start_date: buildElectionDateTime(electionForm.startDate, electionForm.startTime), end_date: buildElectionDateTime(electionForm.endDate, electionForm.endTime) });
      const elecs = await fetchElections();
      const id = typeof res.data?.election_id === "number" ? res.data.election_id : elecs[elecs.length - 1]?.id || 0;
      setCandidateForm(c => ({ ...c, electionId: c.electionId || id }));
      setElectionForm({ title: "", universityId: isUniversityAdmin ? assignedUniversityId : universities[0]?.id || 0, description: "", startDate: "", endDate: "", startTime: "08:00", endTime: "16:00" });
      showToast("Election created", "success");
    } catch { showToast("Failed to create election", "error"); }
    finally { setSavingElection(false); }
  }, [assignedUniversityId, electionForm, fetchElections, isUniversityAdmin, showToast, universities]);

  const handleCreateCandidate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateForm.electionId) { showToast("Select an election", "error"); return; }
    if (!candidateForm.partyName.trim()) { showToast("Party name is required", "error"); return; }
    if (!candidateForm.candidateName.trim()) { showToast("Candidate name is required", "error"); return; }
    if (!candidateForm.position.trim()) { showToast("Position is required", "error"); return; }
    if (!candidateForm.manifesto.trim()) { showToast("Manifesto is required", "error"); return; }
    setSavingCandidate(true);
    try {
      await candidateService.createCandidate({ election_id: candidateForm.electionId, candidate_name: candidateForm.candidateName.trim(), party_name: candidateForm.partyName.trim(), candidate_photo: candidateForm.candidatePhoto || null, party_logo: candidateForm.partyLogo || null, position: candidateForm.position.trim(), manifesto: candidateForm.manifesto.trim() });
      await fetchCandidates();
      setCandidateForm(c => ({ ...c, candidateName: "", partyName: "", candidatePhoto: "", partyLogo: "", position: "", manifesto: "" }));
      showToast("Candidate added", "success");
    } catch { showToast("Failed to add candidate", "error"); }
    finally { setSavingCandidate(false); }
  }, [candidateForm, fetchCandidates, showToast]);

  const handleDeleteCandidate = useCallback(async (id: number) => {
    setDeletingCandidateId(id);
    try { await candidateService.deleteCandidate(id); await fetchCandidates(); showToast("Candidate removed", "success"); }
    catch { showToast("Failed to remove candidate", "error"); }
    finally { setDeletingCandidateId(null); }
  }, [fetchCandidates, showToast]);

  const handleSaveProfilePhoto = useCallback(async () => {
    if (!profilePhoto) { showToast("Select a photo first", "error"); return; }
    if (!user?.id) { showToast("Session missing, sign in again", "error"); return; }
    setUploadingProfile(true);
    try {
      const res = await userService.updateUser(user.id, { profile_picture: profilePhoto });
      loginWithUser(res.data); showToast("Profile photo updated", "success"); setShowUploadModal(false);
    } catch { showToast("Failed to update photo", "error"); }
    finally { setUploadingProfile(false); }
  }, [loginWithUser, profilePhoto, showToast, user?.id]);

  const handleCreateAdmin = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.email?.trim() || !adminForm.fullName?.trim() || !adminForm.password?.trim()) { showToast("All fields are required", "error"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminForm.email)) { showToast("Invalid email format", "error"); return; }
    if (!adminForm.universityId) { showToast("Select a university", "error"); return; }
    setLoading(true);
    try {
      await superAdminService.createAdmin({ email: adminForm.email.trim(), full_name: adminForm.fullName.trim(), password: adminForm.password, university_id: adminForm.universityId });
      await fetchAdmins();
      setAdminForm({ email: "", fullName: "", password: "", universityId: universities[0]?.id || 0 });
      showToast("Admin created", "success");
    } catch (err) { showToast(getApiErrorMessage(err, "Failed to create admin"), "error"); }
    finally { setLoading(false); }
  }, [adminForm, fetchAdmins, showToast, universities]);

  const handleDeleteAdmin = useCallback(async (id: number) => {
    setLoading(true);
    try { await superAdminService.deleteAdmin(id); await fetchAdmins(); showToast("Admin removed", "success"); }
    catch (err) { showToast(getApiErrorMessage(err, "Failed to remove admin"), "error"); }
    finally { setLoading(false); }
  }, [fetchAdmins, showToast]);

  const handleLogout = useCallback(() => { logout(); navigate("/"); }, [logout, navigate]);
  const toggleTheme = useCallback(() => setTheme(t => t === "light" ? "dark" : "light"), []);

  // ── Computed ──
  const electionsWithTotals = useMemo(() =>
    elections.map(e => ({ ...e, votes: candidates.filter(c => c.electionId === e.id).reduce((s, c) => s + c.votesCount, 0) })),
    [candidates, elections]);

  const totalVotes = useMemo(() => electionsWithTotals.reduce((s, e) => s + (e.votes || 0), 0), [electionsWithTotals]);

  const trendData = useMemo(() => {
    const sorted = [...electionsWithTotals].sort((a, b) => a.startDate.localeCompare(b.startDate)).slice(-6);
    while (sorted.length < 6) sorted.unshift({ startDate: "--", votes: 0 } as any);
    return sorted.map(e => ({ label: e.startDate !== "--" ? e.startDate.slice(5) : "--", value: e.votes || 0 }));
  }, [electionsWithTotals]);

  const maxTrend = useMemo(() => Math.max(...trendData.map(d => d.value), 1), [trendData]);

  const statusBreakdown = useMemo(() => {
    const counts = { active: 0, pending: 0, completed: 0 };
    elections.forEach(e => { counts[e.status]++; });
    const total = Math.max(elections.length, 1);
    return (["active", "pending", "completed"] as const).map(s => ({ status: s, count: counts[s], pct: Math.round((counts[s] / total) * 100) }));
  }, [elections]);

  const statusCounts = useMemo(() => statusBreakdown.reduce((a, i) => { a[i.status] = i.count; return a; }, { active: 0, pending: 0, completed: 0 } as Record<string, number>), [statusBreakdown]);

  const donutBg = useMemo(() => {
    const total = Math.max(elections.length, 1);
    const ad = (statusCounts.active / total) * 360;
    const pd = (statusCounts.pending / total) * 360;
    return `conic-gradient(#30d158 0deg ${ad}deg, #ffd60a ${ad}deg ${ad + pd}deg, #3a3a3c ${ad + pd}deg 360deg)`;
  }, [elections.length, statusCounts]);

  const watchData = useMemo(() => {
    const sortedActive = [...elections]
      .filter(e => e.status === "active")
      .sort((a, b) => toElectionDateTime(a.endDate, a.endTime, "end").getTime() - toElectionDateTime(b.endDate, b.endTime, "end").getTime());
    const sortedPending = [...elections]
      .filter(e => e.status === "pending")
      .sort((a, b) => toElectionDateTime(a.startDate, a.startTime, "start").getTime() - toElectionDateTime(b.startDate, b.startTime, "start").getTime());

    const base = {
      clock: formatDigitalClock(now),
      date: formatDigitalDate(now),
    };

    if (sortedActive.length > 0) {
      const election = sortedActive[0];
      const remainingMs = toElectionDateTime(election.endDate, election.endTime, "end").getTime() - now.getTime();
      return {
        ...base,
        title: election.title || "Current Election",
        timerLabel: "Ends In",
        timerValue: formatCountdown(remainingMs),
        tone: "active" as const,
      };
    }

    if (sortedPending.length > 0) {
      const election = sortedPending[0];
      const remainingMs = toElectionDateTime(election.startDate, election.startTime, "start").getTime() - now.getTime();
      return {
        ...base,
        title: election.title || "Upcoming Election",
        timerLabel: "Starts In",
        timerValue: formatCountdown(remainingMs),
        tone: "pending" as const,
      };
    }

    return {
      ...base,
      title: "No Scheduled Election",
      timerLabel: "Next Election",
      timerValue: "--:--:--",
      tone: "idle" as const,
    };
  }, [elections, now]);

  const analogHands = useMemo(() => {
    const millis = now.getMilliseconds();
    const secondFraction = now.getSeconds() + millis / 1000;
    const minuteFraction = now.getMinutes() + secondFraction / 60;
    const hourFraction = (now.getHours() % 12) + minuteFraction / 60;
    return {
      hour: hourFraction * 30,
      minute: minuteFraction * 6,
      second: secondFraction * 6,
    };
  }, [now]);

  const navItems = useMemo<Array<{ id: string; icon: keyof typeof Icons; label: string }>>(() => {
    const items: Array<{ id: string; icon: keyof typeof Icons; label: string }> = [{ id: "overview", icon: "Chart", label: "Dashboard" }];
    if (isSuperAdmin) items.push({ id: "universities", icon: "Building", label: "Universities" });
    items.push(
      { id: "elections", icon: "Vote", label: "Elections" },
      { id: "candidates", icon: "Crown", label: "Candidates" },
      { id: "votersroll", icon: "Users", label: "Voters Roll" },
      { id: "news", icon: "News", label: "News & Articles" },
      { id: "activity", icon: "Activity", label: "Activity Logs" },
    );
    if (isSuperAdmin) items.push({ id: "admins", icon: "Users", label: "Administrators" });
    return items;
  }, [isSuperAdmin]);

  const activeLabel = navItems.find(n => n.id === activeTab)?.label ?? "Dashboard";

  const overviewElections = useMemo(() => [...electionsWithTotals].sort((a, b) => b.startDate.localeCompare(a.startDate)).slice(0, 6), [electionsWithTotals]);

  const activityFeed = useMemo(() => {
    const items: { id: string; title: string; meta: string }[] = [];
    [...candidates].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 2).forEach(c => items.push({ id: `c-${c.id}`, title: `${c.candidateName} added for ${c.position}`, meta: `${c.partyName} · ${formatDashboardDate(c.createdAt)}` }));
    overviewElections.slice(0, 2).forEach(e => items.push({ id: `e-${e.id}`, title: `${e.title} is ${e.status}`, meta: `${formatDashboardDate(e.startDate)} → ${formatDashboardDate(e.endDate)}` }));
    if (isSuperAdmin) items.push({ id: "scope", title: `${admins.length} admin accounts managed`, meta: `${universities.length} universities in scope` });
    items.push({ id: "votes", title: `${totalVotes.toLocaleString()} votes tracked`, meta: "Live dashboard totals" });
    return items.slice(0, 6);
  }, [admins.length, candidates, isSuperAdmin, overviewElections, totalVotes, universities.length]);

  const quickActions = useMemo<Array<{ tab: string; label: string; icon: keyof typeof Icons }>>(() => {
    const a: Array<{ tab: string; label: string; icon: keyof typeof Icons }> = [
      { tab: "elections", label: "Elections", icon: "Vote" },
      { tab: "candidates", label: "Candidates", icon: "Crown" },
      { tab: "votersroll", label: "Voters Roll", icon: "Users" },
      { tab: "news", label: "News", icon: "News" },
    ];
    if (isSuperAdmin) a.unshift({ tab: "universities", label: "Universities", icon: "Building" });
    return a.slice(0, 4);
  }, [isSuperAdmin]);

  // ── Render ──
  return (
    <>
      <style>{ADMIN_STYLES}</style>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => { handleImageSelection(e.target.files, d => setProfilePhoto(d || null), "Profile photo selected"); e.target.value = ""; }} />

      <div className="dash-root" data-theme={theme}>
        <main className="dash-main">
          <div className="top-nav-shell">
            <div className="topbar topbar-primary">
              <div className="topbar-brand">
                <div className="topbar-brand-icon"><Icons.Vote size={18} /></div>
                <div>
                  <div className="topbar-brand-title">BAC VOTING</div>
                  <div className="topbar-brand-sub">{isSuperAdmin ? "Super Admin" : "University Admin"}</div>
                </div>
              </div>
              <div className="topbar-search-wrap">
                <div className="topbar-search">
                  <span className="topbar-search-icon"><Icons.Search size={14} /></span>
                  <input placeholder="Search universities, elections, candidates…" />
                </div>
              </div>
              <div className="topbar-actions">
                <button className="topbar-icon-btn"><Icons.Bell size={15} /><span className="notif-dot" /></button>
                <button className="topbar-pill" onClick={toggleTheme}><Icons.Theme size={13} />{theme === "dark" ? "Light" : "Dark"}</button>
                <button className="topbar-logout" onClick={handleLogout}><Icons.SignOut size={13} />Sign out</button>
              </div>
            </div>

            <div className="topbar topbar-secondary">
              <div className="topnav-menu-wrap">
                <nav className="topnav-menu">
                  {navItems.map(item => {
                    const Ic = Icons[item.icon];
                    return (
                      <button key={item.id} className={`topnav-btn${activeTab === item.id ? " active" : ""}`} onClick={() => setActiveTab(item.id)}>
                        <Ic size={14} />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
              <div className="topnav-profile-slot">
                <div className="topnav-profile-menu" ref={profileMenuRef}>
                  <button
                    type="button"
                    className={`topnav-avatar-btn${showProfileMenu ? " active" : ""}`}
                    aria-label="Open profile menu"
                    aria-expanded={showProfileMenu}
                    aria-haspopup="menu"
                    onClick={() => setShowProfileMenu(v => !v)}
                  >
                    <div className="topnav-avatar">{profilePhoto ? <img src={profilePhoto} alt={adminName} /> : adminInitials}</div>
                  </button>
                  {showProfileMenu && (
                    <div className="topnav-dropdown" role="menu">
                      <button type="button" className="topnav-dropdown-item" onClick={() => { setShowProfileMenu(false); setShowUploadModal(true); }}><Icons.Camera size={13} />Update photo</button>
                      <button type="button" className="topnav-dropdown-item" onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }}><Icons.Users size={13} />Profile</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className={`page-content${activeTab !== "overview" ? " workspace-content" : ""}`}>
            {/* Page Header */}
            <div className="page-head">
              <div className="page-head-left">
                <div className="page-breadcrumb">
                  <span>Home</span>
                  <Icons.ChevronRight size={12} />
                  <span>{activeLabel}</span>
                </div>
                <h1 className="page-title">{activeLabel}</h1>
                <p className="page-subtitle">Manage your platform from one unified control room.</p>
              </div>
              <div className="page-head-watch">
                <div className="topnav-watch">
                  <div className="analog-dial-wrap">
                    <svg className="analog-svg" viewBox="0 0 200 200" aria-label={`Current time ${watchData.clock}`}>
                      <circle className="analog-ring" cx="100" cy="100" r="96" />
                      <circle className="analog-face" cx="100" cy="100" r="86" />
                      {Array.from({ length: 60 }, (_, i) => {
                        const major = i % 5 === 0;
                        return (
                          <line
                            key={`tick-${i}`}
                            className={`analog-tick${major ? " major" : ""}`}
                            x1="100"
                            y1={major ? "17" : "20"}
                            x2="100"
                            y2={major ? "30" : "26"}
                            transform={`rotate(${i * 6} 100 100)`}
                          />
                        );
                      })}
                      <line className="analog-hand hour" x1="100" y1="100" x2="100" y2="66" transform={`rotate(${analogHands.hour} 100 100)`} />
                      <line className="analog-hand minute" x1="100" y1="100" x2="100" y2="50" transform={`rotate(${analogHands.minute} 100 100)`} />
                      <line className="analog-hand second" x1="100" y1="100" x2="100" y2="36" transform={`rotate(${analogHands.second} 100 100)`} />
                      <circle className="analog-center" cx="100" cy="100" r="5" />
                    </svg>
                  </div>
                  <div className="analog-meta">
                    <div className="watch-head-row">
                      <span className="analog-label">Analog Watch</span>
                      <span className="analog-date">{watchData.date}</span>
                    </div>
                    <div className="analog-time">{watchData.clock}</div>
                    <div className="analog-election">{watchData.title}</div>
                    <div className={`analog-timer ${watchData.tone}`}>{watchData.timerLabel}: {watchData.timerValue}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (<>
              {/* Overview 3-col */}
              <div className="overview-grid">
                {/* LEFT */}
                <div className="overview-col">
                  <div className="profile-card">
                    <div className="profile-card-top">
                      <span className="profile-card-role">{isSuperAdmin ? "Super Admin" : "Admin"}</span>
                      <span className="profile-card-badge">{universities.length} unis</span>
                    </div>
                    <div className="profile-card-name">{adminName}</div>
                    <div className="profile-card-email">{adminEmail}</div>
                    <div className="profile-card-stats">
                      <div className="profile-stat">
                        <div className="profile-stat-label">Total Votes</div>
                        <div className="profile-stat-value">{totalVotes.toLocaleString()}</div>
                      </div>
                      <div className="profile-stat">
                        <div className="profile-stat-label">Candidates</div>
                        <div className="profile-stat-value">{candidates.length}</div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-head"><span className="card-head-title">Quick Actions</span></div>
                    <div className="card-body">
                      <div className="qa-grid">
                        {quickActions.map(a => { const Ic = Icons[a.icon]; return (
                          <button key={a.tab} className="qa-btn" onClick={() => setActiveTab(a.tab)}><Ic size={13} />{a.label}</button>
                        ); })}
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-head"><span className="card-head-title">Election Health</span></div>
                    <div className="card-body">
                      {statusBreakdown.map(s => (
                        <div className="health-row" key={s.status}>
                          <span className="health-label">{s.status}</span>
                          <div className="health-track"><div className={`health-fill ${s.status}`} style={{ width: `${Math.max(s.pct, s.count > 0 ? 8 : 2)}%` }} /></div>
                          <span className="health-count">{s.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CENTER */}
                <div className="overview-col">
                  <div className="card">
                    <div className="card-head">
                      <span className="card-head-title">Vote Distribution</span>
                      <span className="badge badge-info">Last 6 elections</span>
                    </div>
                    <div className="card-body">
                      <div style={{ marginBottom: 6, fontSize: 11, color: "var(--txt-3)" }}>Total votes tracked</div>
                      <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.04em", color: "var(--txt-primary)", marginBottom: 14 }}>{totalVotes.toLocaleString()}</div>
                      <div className="bar-chart">
                        {trendData.map((d, i) => (
                          <div className="bar-col" key={i}>
                            <div className="bar-val">{d.value > 0 ? d.value : ""}</div>
                            <div className="bar-track">
                              <div className="bar-fill" style={{ height: `${Math.max((d.value / maxTrend) * 100, d.value > 0 ? 8 : 2)}%` }} />
                            </div>
                            <div className="bar-lbl">{d.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-head">
                      <span className="card-head-title">Recent Elections</span>
                      <span className="badge badge-info">{overviewElections.length} records</span>
                    </div>
                    <div className="card-body no-pad">
                      {fetchingCoreData ? (
                        <div className="empty-state"><div className="empty-text">Loading…</div></div>
                      ) : overviewElections.length === 0 ? (
                        <div className="empty-state"><div className="empty-icon"><Icons.Empty size={48} /></div><div className="empty-text">No elections yet</div></div>
                      ) : (
                        <div className="t-wrap">
                          <table className="t">
                            <thead><tr><th>Election</th><th>Status</th><th>Date</th><th style={{ textAlign: "right" }}>Votes</th></tr></thead>
                            <tbody>
                              {overviewElections.map(e => (
                                <tr key={e.id}>
                                  <td>
                                    <div className="t-title">{e.title}</div>
                                    <div className="t-sub">University #{e.universityId}</div>
                                  </td>
                                  <td><span className={`badge badge-${e.status}`}>{e.status}</span></td>
                                  <td style={{ fontSize: 11, color: "var(--txt-3)" }}>{formatDashboardDate(e.startDate)}</td>
                                  <td style={{ textAlign: "right", fontWeight: 700, fontSize: 12 }}>{(e.votes || 0).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="overview-col">
                  <div className="card">
                    <div className="card-head">
                      <span className="card-head-title">Statistics</span>
                      <span className="badge badge-info">This month</span>
                    </div>
                    <div className="card-body">
                      <div className="donut-wrap">
                        <div className="donut" style={{ background: donutBg }}>
                          <div className="donut-inner">
                            <div className="donut-value">{elections.length}</div>
                            <div className="donut-sublabel">elections</div>
                          </div>
                        </div>
                      </div>
                      <div className="stat-legend">
                        <div className="stat-legend-row"><span className="stat-dot active" />Active<span className="stat-count">{statusCounts.active}</span></div>
                        <div className="stat-legend-row"><span className="stat-dot pending" />Pending<span className="stat-count">{statusCounts.pending}</span></div>
                        <div className="stat-legend-row"><span className="stat-dot completed" />Completed<span className="stat-count">{statusCounts.completed}</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-head">
                      <span className="card-head-title">Activity</span>
                      <span className="badge badge-info">Live</span>
                    </div>
                    <div className="card-body">
                      {activityFeed.map((item, i) => (
                        <div className="activity-item" key={item.id}>
                          <div className="activity-icon">{i % 2 === 0 ? <Icons.Activity size={12} /> : <Icons.Bell size={12} />}</div>
                          <div className="activity-copy">
                            <strong>{item.title}</strong>
                            <span>{item.meta}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>)}

            {/* ── UNIVERSITIES TAB ── */}
            {activeTab === "universities" && (
              <div className="content-grid">
                <div className="card">
                  <div className="card-head"><span className="card-head-title">Add University</span></div>
                  <div className="card-body">
                    <form onSubmit={handleCreateUniversity}>
                      {[
                        { label: "University Name", key: "name", placeholder: "Enter name", required: true },
                        { label: "Code", key: "code", placeholder: "e.g. BUST", required: true },
                        { label: "Abbreviation", key: "abbreviation", placeholder: "e.g. BUST", required: true },
                        { label: "Location", key: "location", placeholder: "e.g. Gaborone" },
                        { label: "Contact Email", key: "contact_email", placeholder: "contact@university.ac.bw" },
                      ].map(f => (
                        <div className="form-group" key={f.key}>
                          <label className="f-label">{f.label}{f.required ? " *" : ""}</label>
                          <input className="f-input" placeholder={f.placeholder} value={(universityForm as any)[f.key] || ""} onChange={e => setUniversityForm({ ...universityForm, [f.key]: e.target.value })} />
                        </div>
                      ))}
                      <div className="form-group">
                        <label className="f-label">Description</label>
                        <textarea className="f-textarea" placeholder="Brief description" value={universityForm.description || ""} onChange={e => setUniversityForm({ ...universityForm, description: e.target.value })} />
                      </div>
                      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading && <span className="spinner" />}Create University</button>
                    </form>
                  </div>
                </div>
                <div className="card">
                  <div className="card-head"><span className="card-head-title">Universities ({universities.length})</span></div>
                  <div className="card-body no-pad">
                    <DataTable columns={[{ key: "name", label: "Name" }, { key: "code", label: "Code" }, { key: "location", label: "Location" }]} data={universities} onDelete={handleDeleteUniversity} />
                  </div>
                </div>
              </div>
            )}

            {/* ── ELECTIONS TAB ── */}
            {activeTab === "elections" && (
              <div className="content-grid">
                <div className="card">
                  <div className="card-head"><span className="card-head-title">Create Election</span></div>
                  <div className="card-body">
                    <form onSubmit={handleCreateElection}>
                      <div className="form-group">
                        <label className="f-label">Title *</label>
                        <input className="f-input" placeholder="Election title" value={electionForm.title || ""} onChange={e => setElectionForm({ ...electionForm, title: e.target.value })} required />
                      </div>
                      {isSuperAdmin ? (
                        <div className="form-group">
                          <label className="f-label">University *</label>
                          <select className="f-select" value={electionForm.universityId || ""} onChange={e => setElectionForm({ ...electionForm, universityId: parseInt(e.target.value, 10) || 0 })} disabled={universities.length === 0}>
                            <option value="">Select university</option>
                            {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                          </select>
                        </div>
                      ) : (
                        <div className="form-group">
                          <label className="f-label">University</label>
                          <input className="f-input" value={universities[0]?.name || "No university assigned"} disabled />
                        </div>
                      )}
                      <div className="form-row">
                        <div className="form-group">
                          <label className="f-label">Start Date *</label>
                          <input className="f-input" type="date" value={electionForm.startDate || ""} onChange={e => setElectionForm({ ...electionForm, startDate: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label className="f-label">Start Time</label>
                          <input className="f-input" type="time" value={electionForm.startTime || "08:00"} onChange={e => setElectionForm({ ...electionForm, startTime: e.target.value })} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="f-label">End Date *</label>
                          <input className="f-input" type="date" value={electionForm.endDate || ""} onChange={e => setElectionForm({ ...electionForm, endDate: e.target.value })} required />
                        </div>
                        <div className="form-group">
                          <label className="f-label">End Time</label>
                          <input className="f-input" type="time" value={electionForm.endTime || "16:00"} onChange={e => setElectionForm({ ...electionForm, endTime: e.target.value })} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="f-label">Description</label>
                        <textarea className="f-textarea" placeholder="Election description" value={electionForm.description || ""} onChange={e => setElectionForm({ ...electionForm, description: e.target.value })} />
                      </div>
                      <button type="submit" className="btn btn-success btn-block" disabled={savingElection || universities.length === 0}>{savingElection && <span className="spinner" />}Create Election</button>
                      {universities.length === 0 && <div className="f-hint">Create a university first.</div>}
                    </form>
                  </div>
                </div>
                <div className="card">
                  <div className="card-head"><span className="card-head-title">Elections ({electionsWithTotals.length})</span></div>
                  <div className="card-body">
                    {fetchingCoreData ? <div className="empty-state"><div className="empty-text">Loading…</div></div>
                      : electionsWithTotals.length === 0 ? <div className="empty-state"><div className="empty-icon"><Icons.Empty size={48} /></div><div className="empty-text">No elections yet</div></div>
                      : electionsWithTotals.map(e => {
                        const uni = universities.find(u => u.id === e.universityId);
                        return (
                          <div className="list-item" key={e.id}>
                            <div className="list-item-head">
                              <div className="list-item-title">{e.title}</div>
                              <span className={`badge badge-${e.status}`}>{e.status}</span>
                            </div>
                            <div className="list-item-meta">{uni?.name || "All campuses"} · {e.startDate} {e.startTime} – {e.endDate} {e.endTime}</div>
                            <div className="list-item-meta">{candidates.filter(c => c.electionId === e.id).length} candidates · {e.votes || 0} votes</div>
                            {e.description && <div className="list-item-meta">{e.description}</div>}
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            )}

            {/* ── CANDIDATES TAB ── */}
            {activeTab === "candidates" && (
              <div className="content-grid">
                <div className="card">
                  <div className="card-head"><span className="card-head-title">Add Candidate</span></div>
                  <div className="card-body">
                    <form onSubmit={handleCreateCandidate}>
                      <div className="form-group">
                        <label className="f-label">Election *</label>
                        <select className="f-select" value={candidateForm.electionId || ""} onChange={e => setCandidateForm({ ...candidateForm, electionId: parseInt(e.target.value, 10) || 0 })} disabled={elections.length === 0}>
                          <option value="">Select election</option>
                          {elections.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="f-label">Party / Movement *</label>
                        <input className="f-input" placeholder="e.g. Revolutionary Students Leadership" value={candidateForm.partyName} onChange={e => setCandidateForm({ ...candidateForm, partyName: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="f-label">Candidate Name *</label>
                        <input className="f-input" placeholder="Full name" value={candidateForm.candidateName} onChange={e => setCandidateForm({ ...candidateForm, candidateName: e.target.value })} required />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="f-label">Candidate Photo</label>
                          <div className="media-picker">
                            <div className="media-preview round">
                              {candidateForm.candidatePhoto ? <img src={candidateForm.candidatePhoto} alt="photo" /> : <Icons.Camera size={16} />}
                            </div>
                            <div className="media-actions">
                              <label className="media-upload-btn"><Icons.Image size={12} />Photo<input type="file" accept="image/*" onChange={e => { handleImageSelection(e.target.files, d => setCandidateForm(c => ({ ...c, candidatePhoto: d })), "Photo selected"); e.target.value = ""; }} /></label>
                              <button type="button" className="media-clear-btn" disabled={!candidateForm.candidatePhoto} onClick={() => setCandidateForm(c => ({ ...c, candidatePhoto: "" }))}>Clear</button>
                            </div>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="f-label">Party Logo</label>
                          <div className="media-picker">
                            <div className="media-preview">
                              {candidateForm.partyLogo ? <img src={candidateForm.partyLogo} alt="logo" /> : <Icons.Building size={16} />}
                            </div>
                            <div className="media-actions">
                              <label className="media-upload-btn"><Icons.Image size={12} />Logo<input type="file" accept="image/*" onChange={e => { handleImageSelection(e.target.files, d => setCandidateForm(c => ({ ...c, partyLogo: d })), "Logo selected"); e.target.value = ""; }} /></label>
                              <button type="button" className="media-clear-btn" disabled={!candidateForm.partyLogo} onClick={() => setCandidateForm(c => ({ ...c, partyLogo: "" }))}>Clear</button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="f-label">Position *</label>
                        <input className="f-input" placeholder="e.g. President, Secretary General" value={candidateForm.position} onChange={e => setCandidateForm({ ...candidateForm, position: e.target.value })} required />
                      </div>
                      <div className="form-group">
                        <label className="f-label">Manifesto *</label>
                        <textarea className="f-textarea" placeholder="Campaign priorities and goals" value={candidateForm.manifesto} onChange={e => setCandidateForm({ ...candidateForm, manifesto: e.target.value })} rows={4} required />
                      </div>
                      <button type="submit" className="btn btn-success btn-block" disabled={savingCandidate || elections.length === 0}>{savingCandidate && <span className="spinner" />}Add Candidate</button>
                      {elections.length === 0 && <div className="f-hint">Create an election first.</div>}
                    </form>
                  </div>
                </div>

                <div className="card">
                  <div className="card-head"><span className="card-head-title">Candidates ({candidates.length})</span></div>
                  <div className="card-body">
                    {fetchingCoreData ? <div className="empty-state"><div className="empty-text">Loading…</div></div>
                      : candidates.length === 0 ? <div className="empty-state"><div className="empty-icon"><Icons.Empty size={48} /></div><div className="empty-text">No candidates yet</div></div>
                      : candidates.map(c => {
                        const elec = elections.find(e => e.id === c.electionId);
                        return (
                          <div className="list-item" key={c.id}>
                            <div className="list-item-head">
                              <div className="cand-row">
                                <div className="cand-logo">{c.partyLogo ? <img src={c.partyLogo} alt={c.partyName} /> : <Icons.Building size={14} />}</div>
                                <div className="cand-photo">{c.candidatePhoto ? <img src={c.candidatePhoto} alt={c.candidateName} /> : <span>{getInitials(c.candidateName)}</span>}</div>
                                <div>
                                  <div className="list-item-title">{c.candidateName}</div>
                                  <div className="list-item-meta">{c.partyName} · {c.position}</div>
                                </div>
                              </div>
                              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => handleDeleteCandidate(c.id)} disabled={deletingCandidateId === c.id}><Icons.Trash size={13} /></button>
                            </div>
                            <div className="list-item-meta">{elec?.title || "Election unavailable"}</div>
                            <div className="list-item-meta" style={{ marginTop: 4, lineHeight: 1.6 }}>{c.manifesto}</div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            )}

            {/* ── ADMINS TAB ── */}
            {activeTab === "admins" && (
              <div className="content-grid">
                <div className="card">
                  <div className="card-head"><span className="card-head-title">Create Administrator</span></div>
                  <div className="card-body">
                    <form onSubmit={handleCreateAdmin}>
                      {[
                        { label: "Email", key: "email", type: "email", placeholder: "admin@university.ac.bw" },
                        { label: "Full Name", key: "fullName", type: "text", placeholder: "Full name" },
                        { label: "Password", key: "password", type: "password", placeholder: "Secure password" },
                      ].map(f => (
                        <div className="form-group" key={f.key}>
                          <label className="f-label">{f.label} *</label>
                          <input className="f-input" type={f.type} placeholder={f.placeholder} value={(adminForm as any)[f.key]} onChange={e => setAdminForm({ ...adminForm, [f.key]: e.target.value })} required />
                        </div>
                      ))}
                      <div className="form-group">
                        <label className="f-label">University *</label>
                        <select className="f-select" value={adminForm.universityId || ""} onChange={e => setAdminForm({ ...adminForm, universityId: parseInt(e.target.value, 10) || 0 })} disabled={universities.length === 0}>
                          <option value="">Select university</option>
                          {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                      </div>
                      <button type="submit" className="btn btn-primary btn-block" disabled={loading || universities.length === 0}>{loading && <span className="spinner" />}Create Admin</button>
                      {universities.length === 0 && <div className="f-hint">Create a university first.</div>}
                    </form>
                  </div>
                </div>
                <div className="card">
                  <div className="card-head"><span className="card-head-title">Administrators ({admins.length})</span></div>
                  <div className="card-body">
                    {admins.length === 0 ? <div className="empty-state"><div className="empty-icon"><Icons.Empty size={48} /></div><div className="empty-text">No admins yet</div></div>
                      : admins.map(a => {
                        const uni = universities.find(u => u.id === a.universityId);
                        return (
                          <div className="list-item" key={a.id}>
                            <div className="list-item-head">
                              <div>
                                <div className="list-item-title">{a.fullName}</div>
                                <div className="list-item-meta">{a.email}</div>
                              </div>
                              <button className="btn btn-ghost" style={{ padding: "4px 8px" }} onClick={() => handleDeleteAdmin(a.id)}><Icons.Trash size={13} /></button>
                            </div>
                            <div className="list-item-meta">{uni?.name || "Unassigned"}</div>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            )}

            {/* ── VOTERS ROLL TAB ── */}
            {activeTab === "votersroll" && (
              <div className="content-grid">
                <div className="card">
                  <div className="card-head"><span className="card-head-title">Upload Voters Roll</span></div>
                  <div className="card-body">
                    <form>
                      <div className="form-group">
                        <label className="f-label">University *</label>
                        <select className="f-select" disabled={universities.length === 0}>
                          <option value="">Select university</option>
                          {universities.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="f-label">Spreadsheet File *</label>
                        <input
                          type="file"
                          accept=".csv,.tsv,.xlsx,.xls,.ods,.gsheet,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.oasis.opendocument.spreadsheet,text/csv,text/tab-separated-values"
                          className="f-input"
                        />
                      </div>
                      <div className="f-hint" style={{ marginBottom: 14 }}>Accepted: CSV, Excel (.xlsx/.xls), and Google Sheets exports (CSV/XLSX). Required columns: email, student_id, full_name, course</div>
                      <button type="submit" className="btn btn-success btn-block">Upload Voters Roll</button>
                    </form>
                  </div>
                </div>
                <div className="card">
                  <div className="card-head"><span className="card-head-title">Voters Roll by University</span></div>
                  <div className="card-body">
                    {universities.length === 0 ? <div className="empty-state"><div className="empty-icon"><Icons.Empty size={48} /></div><div className="empty-text">No universities yet</div></div>
                      : universities.map(u => (
                        <div className="list-item" key={u.id}>
                          <div className="list-item-head">
                            <div className="list-item-title">{u.name}</div>
                            <span className="badge badge-info">0 voters</span>
                          </div>
                          <div className="list-item-meta">No voters roll uploaded</div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            )}

            {/* ── NEWS TAB ── */}
            {activeTab === "news" && (
              <div className="content-grid">
                <div className="card">
                  <div className="card-head"><span className="card-head-title">Create Article</span></div>
                  <div className="card-body">
                    <form>
                      <div className="form-group">
                        <label className="f-label">Title *</label>
                        <input className="f-input" placeholder="News headline" required />
                      </div>
                      <div className="form-group">
                        <label className="f-label">Category</label>
                        <select className="f-select">
                          <option>Election Updates</option>
                          <option>General News</option>
                          <option>Announcements</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="f-label">Content *</label>
                        <textarea className="f-textarea" placeholder="Article content" rows={5} required />
                      </div>
                      <button type="submit" className="btn btn-success btn-block">Publish Article</button>
                    </form>
                  </div>
                </div>
                <div className="card">
                  <div className="card-head"><span className="card-head-title">Published Articles</span></div>
                  <div className="card-body">
                    <div className="empty-state"><div className="empty-icon"><Icons.Empty size={48} /></div><div className="empty-text">No articles published yet</div></div>
                  </div>
                </div>
              </div>
            )}

            {/* ── ACTIVITY TAB ── */}
            {activeTab === "activity" && (
              <div className="card" style={{ gridColumn: "1 / -1" }}>
                <div className="card-head"><span className="card-head-title">Activity Logs</span></div>
                <div className="card-body">
                  <div className="empty-state"><div className="empty-icon"><Icons.Empty size={48} /></div><div className="empty-text">No activity logs recorded</div></div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ─── PROFILE MODAL ─── */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Admin Profile</div>
            <div className="modal-sub">Your account information</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px", background: "var(--bg-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#fff", flexShrink: 0, overflow: "hidden" }}>
                {profilePhoto ? <img src={profilePhoto} alt={adminName} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : adminInitials}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>{isSuperAdmin ? "Super Admin" : "Admin"}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "var(--txt-primary)", marginBottom: 2 }}>{adminName}</div>
                <div style={{ fontSize: 11, color: "var(--txt-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{adminEmail}</div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => { setShowProfileModal(false); setShowUploadModal(true); }}><Icons.Camera size={13} />Update Photo</button>
              <button className="btn btn-primary" onClick={() => setShowProfileModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── UPLOAD MODAL ─── */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Update Profile Photo</div>
            <div className="modal-sub">Choose a new photo for your profile</div>
            <div className="upload-preview">
              {profilePhoto ? <img src={profilePhoto} alt="Preview" /> : <Icons.Camera size={28} />}
            </div>
            <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
              <div className="upload-zone-icon"><Icons.Image size={18} /></div>
              <div className="upload-zone-text">Click to select image</div>
              <div className="upload-zone-hint">JPG, PNG or GIF · max 5MB</div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button className="btn btn-primary" disabled={!profilePhoto || uploadingProfile} onClick={() => { void handleSaveProfilePhoto(); }}>{uploadingProfile ? <><span className="spinner" />Uploading</> : "Save Photo"}</button>
            </div>
          </div>
        </div>
      )}

      <ToastNotif toast={toast} />
    </>
  );
};
