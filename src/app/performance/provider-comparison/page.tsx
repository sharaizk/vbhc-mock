"use client";
import "@/css/performance.css";
import "@/css/provider-comparison.css";
import { useState } from "react";
export default function ProviderComparison() {
  const [screen, setScreen] = useState("comparison");
  const [theme, setTheme] = useState("light");
  const [l3, setL3] = useState(null); // {type:"peergroup"|"stats"|"adequacy"|"benefit"}
  const [toast, setToast] = useState({ msg: "", visible: false });

  return (
    <main className="app-main" style={{ paddingBottom: 40 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 14,
          font: "400 12px var(--font-sans)",
          color: "var(--fg-tertiary)",
        }}
      >
        <a
          href="../session-8/index.html"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          ← Dashboard
        </a>
        <span>›</span>
        <span style={{ color: "var(--fg-secondary)" }}>
          Provider Performance
        </span>
        <span>›</span>
        <span style={{ color: "var(--fg-primary)", fontWeight: 500 }}>
          {screen === "comparison"
            ? "Comparison & Benchmarking"
            : "Tiering & Network Intelligence"}
        </span>
      </div>
    </main>
  );
}
