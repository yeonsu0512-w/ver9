"use client";
import { useState } from "react";

export function Topbar() {
  const [dark, setDark] = useState(false);
  return (
    <header className="topbar">
      <span className="topbar-logo">SAMSUNG</span>
      <button className="topbar-collapse-btn">‹</button>
      <span className="topbar-page-title">홈</span>
      <div className="topbar-spacer" />
      <div className="topbar-actions">
        <svg className="topbar-icon" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <svg className="topbar-icon" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        <div className="topbar-avatar">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </div>
      </div>
    </header>
  );
}
