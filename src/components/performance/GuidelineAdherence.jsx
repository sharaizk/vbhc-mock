"use client";
import { S11_GUIDELINES } from "@/mock/guideline-adherence";
import { VBHC_CONTRACTS, VBHC_PROVIDERS } from "@/mock/performance";
import { complianceColor } from "@/utils/helpers";
import React from "react"; // Session 11 — s11-app.jsx — GuidelineAdherence root + App
import {
  ComplianceHeatmap,
  GuidelineTabSelector,
  RequirementTable,
} from "./GuidelineTabSelector";
import { L2AEvidenceChain, L2BCarePathway } from "./L2AEvidence";
import { L3AVersionManagement, L3BConflicts } from "./L3AVersionManagement";
import Link from "next/link";
const { useState, useMemo, useEffect } = React;

function GuidelineAdherence() {
  const [providerId, setProviderId] = useState("P01");
  const [contractId, setContractId] = useState("C1");
  const [periodIdx, setPeriodIdx] = useState(3);
  const [guidelineId, setGuidelineId] = useState("ADA");
  const [heatmapFilter, setHeatmapFilter] = useState(null);
  const [l2, setL2] = useState(null); // {type:"A"|"B", req?}
  const [l3, setL3] = useState(null); // {type:"versions"|"conflicts"}
  const [toast, setToast] = useState({ msg: "", visible: false });

  const provider = useMemo(
    () => VBHC_PROVIDERS.find((p) => p.id === providerId) || VBHC_PROVIDERS[0],
    [providerId],
  );
  const contract = useMemo(
    () => VBHC_CONTRACTS.find((c) => c.id === contractId) || VBHC_CONTRACTS[0],
    [contractId],
  );

  useEffect(() => {
    window.__toast = (msg) => {
      setToast({ msg, visible: true });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
    };
  }, []);

  const role = "manager";
  const periods = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"];

  const gl = S11_GUIDELINES.find((g) => g.id === guidelineId);

  return (
    <div>
      {/* Breadcrumb */}
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
        <Link
          href="../performance/"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          ← Dashboard
        </Link>
        <span>›</span>
        <span style={{ color: "var(--fg-secondary)" }}>{provider.name}</span>
        <span>›</span>
        <span style={{ color: "var(--fg-primary)", fontWeight: 500 }}>
          Guideline Adherence
        </span>
      </div>

      {/* Navigation selectors */}
      <div className="zone-a" style={{ marginBottom: 14 }}>
        {/* Provider */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            Provider
          </span>
          <select
            className="sel-btn"
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            style={{ maxWidth: 220 }}
          >
            {VBHC_PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="za-divider" />
        {/* Contract */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            Contract
          </span>
          <select
            className="sel-btn"
            value={contractId}
            onChange={(e) => setContractId(e.target.value)}
            style={{ maxWidth: 240 }}
          >
            {VBHC_CONTRACTS.filter((c) =>
              provider.contracts.includes(c.id),
            ).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="za-divider" />
        {/* Period */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            Period
          </span>
          <select
            className="sel-btn"
            value={periodIdx}
            onChange={(e) => setPeriodIdx(parseInt(e.target.value))}
          >
            {periods.map((p, i) => (
              <option key={i} value={i}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="za-divider" />
        {/* Summary pills */}
        <div className="panel-pill">
          <span className="num">{gl?.reqs || 25}</span>
          <span
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".04em",
              textTransform: "uppercase",
            }}
          >
            Requirements
          </span>
        </div>
        <div className="panel-pill">
          <span
            className="num"
            style={{ color: complianceColor(gl?.compliance || 76.8) }}
          >
            {gl?.compliance || 76.8}%
          </span>
          <span
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".04em",
              textTransform: "uppercase",
            }}
          >
            Overall Compliance
          </span>
        </div>
        <div className="panel-pill">
          <span
            className="num"
            style={{
              color:
                gl?.trend > 0 ? "var(--perf-target)" : "var(--fg-tertiary)",
            }}
          >
            {gl?.trend > 0 ? "↑" : "→"} {Math.abs(gl?.trend || 0).toFixed(1)}pp
          </span>
          <span
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".04em",
              textTransform: "uppercase",
            }}
          >
            vs Prior Period
          </span>
        </div>
      </div>

      {/* Guideline tabs */}
      <GuidelineTabSelector
        activeId={guidelineId}
        onSelect={(id) => {
          setGuidelineId(id);
          setHeatmapFilter(null);
        }}
        onVersionHistory={() => setL3({ type: "versions" })}
        onPathway={() => setL2({ type: "B" })}
        onConflicts={() => setL3({ type: "conflicts" })}
      />

      {/* Compliance heatmap */}
      <ComplianceHeatmap
        guidelineId={guidelineId}
        onCellClick={(f) =>
          setHeatmapFilter((prev) =>
            prev?.ch === f.ch && prev?.pi === f.pi ? null : f,
          )
        }
        activeFilter={heatmapFilter}
      />

      {/* Requirement table */}
      <RequirementTable
        guidelineId={guidelineId}
        heatmapFilter={heatmapFilter}
        onRowClick={(req) => setL2({ type: "A", req })}
      />

      {/* L2 panels */}
      <L2AEvidenceChain
        open={l2?.type === "A"}
        onClose={() => setL2(null)}
        requirement={l2?.req || null}
      />

      <L2BCarePathway
        open={l2?.type === "B"}
        onClose={() => setL2(null)}
        onOpenRequirement={(req) => setL2({ type: "A", req })}
      />

      {/* L3 overlays */}
      <L3AVersionManagement
        open={l3?.type === "versions"}
        onClose={() => setL3(null)}
      />

      <L3BConflicts
        open={l3?.type === "conflicts"}
        onClose={() => setL3(null)}
        role={role}
      />

      {/* Toast */}
      <div className={"toast" + (toast.visible ? " show" : "")}>
        {toast.msg}
      </div>
    </div>
  );
}

export default GuidelineAdherence;
