"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navMain = [
  { href: "/dashboard",   label: "홈",      icon: "🏠" },
  { href: "/alerts",      label: "알림",    icon: "🔔", chevron: true },
  { href: "/analytics",   label: "분석",    icon: "📊" },
  { href: "/devices",     label: "장치",    icon: "🖥", chevron: true },
  { href: "/groups",      label: "그룹",    icon: "⊞" },
  { href: "/restore",     label: "복원",    icon: "↩", chevron: true },
  { href: "/pulse",       label: "펄스",    icon: "〜" },
  { href: "/lab",         label: "실험실",  icon: "⚗" },
  { href: "/addons",      label: "추가 기능", icon: "🧩" },
];

const navBottom = [
  { href: "/integrations", label: "통합", icon: "🔗" },
  { href: "/account",      label: "계정", icon: "👤" },
  { href: "/settings",     label: "설정", icon: "⚙" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      {/* Tenant */}
      <div className="sidebar-tenant">
        <div className="sidebar-tenant-icon">🏢</div>
        <span className="sidebar-tenant-name">SINSUNGCNS CO LTD</span>
        <span className="sidebar-tenant-arrow">⌄</span>
      </div>

      <nav className="sidebar-nav">
        {navMain.map(({ href, label, icon, chevron }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} className={`nav-item${active ? " active" : ""}`}>
              <span className="nav-item-icon">{icon}</span>
              <span>{label}</span>
              {chevron && <span className="nav-item-chevron">⌄</span>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-divider" />
      <div className="sidebar-bottom">
        {navBottom.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href} className={`nav-item${active ? " active" : ""}`}>
              <span className="nav-item-icon">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
