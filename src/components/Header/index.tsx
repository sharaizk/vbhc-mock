"use client";

import { Icons } from "@/components/Icons/Icons";
import Image from "next/image";
import "./styles.css";
type HeaderProps = {
  user: {
    initials: string;
    name: string;
    role: string;
    org: string;
    period: string;
    periodEnds: string;
  };
  theme: string;
  onTheme: () => void;
};

export default function Header({ user, theme, onTheme }: HeaderProps) {
  return (
    <header className="hdr">
      <div className="hdr-brand">
        <Image
          src="/images/logo-shape-gradient.svg"
          alt="Logo"
          width={40}
          height={40}
        />
      </div>

      <div className="hdr-actions">
        <div className="hdr-period">
          <span className="lbl">Period</span>
          <span className="val">{user.period}</span>
          <span className="ends">· {user.periodEnds}</span>
        </div>
        <div className="hdr-search">
          <span className="glyph">{Icons.search}</span>
          <input placeholder="Search contracts, providers, patients, measures…" />
          <span className="kbd">⌘K</span>
        </div>

        <button className="icon-btn" onClick={onTheme} title="Toggle theme">
          {theme === "dark" ? Icons.sun : Icons.moon}
        </button>

        <button className="icon-btn has-dot" title="Notifications">
          {Icons.bell}
          <span className="dot" />
        </button>

        <div className="avatar-pill">
          <div className="avi">{user.initials}</div>
          <div>
            <div className="name">{user.name}</div>
            <div className="role">
              {user.role.toUpperCase()} · {user.org.split("·")[0].trim()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
