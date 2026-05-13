import React from "react";
import { Icons } from "../Icons/Icons";
import {
  S10_ATTRIBUTION,
  S10_ATTRIBUTION_HISTORY,
  S10_SOURCE_DATA,
} from "@/mock/patient-details";
const { useState } = React;

function S10Overlay({ open, onClose, crumb, children, headerRight }) {
  React.useEffect(() => {
    function k(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        background: "var(--bg-canvas)",
        backgroundImage: "radial-gradient(rgba(0,0,0,.07) 1px,transparent 1px)",
        backgroundSize: "16px 16px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 52,
          borderBottom: ".5px solid var(--border-default)",
          background: "var(--bg-surface)",
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          gap: 12,
          flexShrink: 0,
          boxShadow: "var(--shadow-pill)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: ".5px solid var(--border-default)",
            background: "var(--bg-elevated)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: "var(--fg-secondary)",
            flexShrink: 0,
          }}
        >
          {Icons.close}
        </button>
        {crumb.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <span style={{ color: "var(--fg-tertiary)", fontSize: 11 }}>
                ›
              </span>
            )}
            <span
              style={{
                font:
                  i === crumb.length - 1
                    ? "500 12px var(--font-sans)"
                    : "400 12px var(--font-sans)",
                color:
                  i === crumb.length - 1
                    ? "var(--fg-primary)"
                    : "var(--fg-tertiary)",
              }}
            >
              {c}
            </span>
          </React.Fragment>
        ))}
        <div style={{ flex: 1 }} />
        {headerRight}
      </div>
      <div style={{ flex: 1, overflow: "auto" }}>{children}</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L3-A  Attribution Audit Trail
   ══════════════════════════════════════════════════════════════════════════ */
function L3AAttribution({ open, onClose }) {
  return (
    <S10Overlay
      open={open}
      onClose={onClose}
      crumb={[
        "Dashboard",
        "Provider Performance",
        "PT-2025-0847",
        "Attribution Audit",
      ]}
    >
      <div
        style={{ padding: "28px 48px 48px", maxWidth: 960, margin: "0 auto" }}
      >
        {/* Section 1 — Current Attribution */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 1 — Current Attribution
          </div>
          <p
            style={{
              font: "400 12px/18px var(--font-sans)",
              color: "var(--fg-secondary)",
              marginBottom: 16,
            }}
          >
            Patient PT-2025-0847 is currently attributed to the following
            providers for performance scoring purposes:
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {S10_ATTRIBUTION.map((a, i) => (
              <div
                key={i}
                className="card"
                style={{
                  flex: "1 1 380px",
                  padding: 20,
                  borderLeft: "4px solid var(--accent)",
                }}
              >
                <div
                  style={{
                    font: "600 14px var(--font-sans)",
                    color: "var(--fg-primary)",
                    marginBottom: 8,
                  }}
                >
                  {a.provider}
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 7 }}
                >
                  {[
                    ["Contract", a.contract],
                    ["Attribution Method", a.method],
                    ["Date", a.date],
                    ["Status", a.status],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: "flex", gap: 10 }}>
                      <span
                        style={{
                          font: "500 10px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                          textTransform: "uppercase",
                          letterSpacing: ".06em",
                          width: 130,
                          flexShrink: 0,
                        }}
                      >
                        {k}
                      </span>
                      <span
                        style={{
                          font: "400 12px var(--font-sans)",
                          color: "var(--fg-primary)",
                        }}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                  <div>
                    <span
                      style={{
                        font: "500 10px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                      }}
                    >
                      Triggering Data
                    </span>
                    <p
                      style={{
                        font: "400 11px/16px var(--font-sans)",
                        color: "var(--fg-secondary)",
                        margin: "4px 0 0",
                      }}
                    >
                      {a.triggeringData}
                    </p>
                  </div>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      font: "500 10px var(--font-mono)",
                      color: "var(--perf-target)",
                      background: "var(--perf-target-soft)",
                      padding: "3px 9px",
                      borderRadius: 9999,
                      border: ".5px solid var(--perf-target)",
                      width: "fit-content",
                    }}
                  >
                    ✓ {a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 — Attribution History */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 2 — Attribution History
          </div>
          <div style={{ position: "relative", paddingLeft: 24 }}>
            <div
              style={{
                position: "absolute",
                left: 8,
                top: 0,
                bottom: 0,
                width: 1,
                background: "var(--border-default)",
              }}
            />
            {S10_ATTRIBUTION_HISTORY.map((h, i) => (
              <div key={i} style={{ position: "relative", marginBottom: 18 }}>
                <div
                  style={{
                    position: "absolute",
                    left: -20,
                    top: 4,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background:
                      i === S10_ATTRIBUTION_HISTORY.length - 1
                        ? "var(--fg-tertiary)"
                        : "var(--accent)",
                    border: "2px solid var(--accent)",
                  }}
                />
                <div className="l2-card" style={{ padding: "10px 14px" }}>
                  <div
                    style={{
                      font: "600 11px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      marginBottom: 4,
                    }}
                  >
                    {h.date}
                  </div>
                  <div
                    style={{
                      font: "400 12px/18px var(--font-sans)",
                      color: "var(--fg-primary)",
                    }}
                  >
                    {h.event}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 4,
              padding: "8px 14px",
              background: "var(--accent-soft)",
              borderRadius: 8,
              border: ".5px solid var(--accent)",
            }}
          >
            <p
              style={{
                font: "400 11px/16px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: 0,
              }}
            >
              <strong>Note:</strong> This patient has been stably attributed for
              the entire measurement period. No re-attributions, disputes, or
              reconciliation changes recorded.
            </p>
          </div>
        </div>

        {/* Section 3 — Multi-attribution diagram */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 3 — Multi-Attribution View & Double-Counting Assessment
          </div>
          <div
            className="l2-card"
            style={{ overflowX: "auto", marginBottom: 14 }}
          >
            <svg width={680} height={160} style={{ overflow: "visible" }}>
              {/* Patient */}
              <rect
                x={10}
                y={60}
                width={120}
                height={40}
                rx="8"
                fill="var(--accent-soft)"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <text
                x={70}
                y={76}
                textAnchor="middle"
                fill="var(--accent)"
                style={{ font: "600 10px var(--font-sans)" }}
              >
                PT-2025-0847
              </text>
              <text
                x={70}
                y={90}
                textAnchor="middle"
                fill="var(--fg-tertiary)"
                style={{ font: "400 8px var(--font-mono)" }}
              >
                Mohammed Al-Rashidi
              </text>
              {/* Branch 1: Dr. Al-Khalil */}
              <line
                x1={130}
                y1={70}
                x2={210}
                y2={40}
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <rect
                x={210}
                y={20}
                width={150}
                height={38}
                rx="6"
                fill="var(--bg-elevated)"
                stroke="var(--accent)"
                strokeWidth="1"
              />
              <text
                x={285}
                y={35}
                textAnchor="middle"
                fill="var(--fg-primary)"
                style={{ font: "500 9px var(--font-sans)" }}
              >
                Dr. Fatima Al-Khalil
              </text>
              <text
                x={285}
                y={50}
                textAnchor="middle"
                fill="var(--fg-tertiary)"
                style={{ font: "400 8px var(--font-mono)" }}
              >
                Contract 1 · D1-D9 (25 measures)
              </text>
              <line
                x1={360}
                y1={39}
                x2={430}
                y2={39}
                stroke="var(--border-default)"
                strokeWidth="1"
              />
              <rect
                x={430}
                y={22}
                width={130}
                height={34}
                rx="6"
                fill="var(--bg-elevated)"
                stroke="var(--border-default)"
                strokeWidth="0.5"
              />
              <text
                x={495}
                y={37}
                textAnchor="middle"
                fill="var(--fg-secondary)"
                style={{ font: "400 9px var(--font-sans)" }}
              >
                Primary Care Perf.
              </text>
              <text
                x={495}
                y={50}
                textAnchor="middle"
                fill="var(--fg-tertiary)"
                style={{ font: "500 8px var(--font-mono)" }}
              >
                Contract 1
              </text>
              {/* Branch 2: Dr. Al-Dosari */}
              <line
                x1={130}
                y1={90}
                x2={210}
                y2={120}
                stroke="oklch(62% .12 82)"
                strokeWidth="1.5"
              />
              <rect
                x={210}
                y={100}
                width={150}
                height={38}
                rx="6"
                fill="var(--bg-elevated)"
                stroke="oklch(62% .12 82)"
                strokeWidth="1"
              />
              <text
                x={285}
                y={115}
                textAnchor="middle"
                fill="var(--fg-primary)"
                style={{ font: "500 9px var(--font-sans)" }}
              >
                Dr. Sarah Al-Dosari
              </text>
              <text
                x={285}
                y={130}
                textAnchor="middle"
                fill="var(--fg-tertiary)"
                style={{ font: "400 8px var(--font-mono)" }}
              >
                Contract 5 · Integrated Care
              </text>
              <line
                x1={360}
                y1={119}
                x2={430}
                y2={119}
                stroke="var(--border-default)"
                strokeWidth="1"
              />
              <rect
                x={430}
                y={102}
                width={130}
                height={34}
                rx="6"
                fill="var(--bg-elevated)"
                stroke="var(--border-default)"
                strokeWidth="0.5"
              />
              <text
                x={495}
                y={117}
                textAnchor="middle"
                fill="var(--fg-secondary)"
                style={{ font: "400 9px var(--font-sans)" }}
              >
                Integrated Care
              </text>
              <text
                x={495}
                y={130}
                textAnchor="middle"
                fill="var(--fg-tertiary)"
                style={{ font: "500 8px var(--font-mono)" }}
              >
                Contract 5
              </text>
            </svg>
          </div>
          <div
            className="l2-card"
            style={{
              borderColor: "var(--perf-target)",
              background: "var(--perf-target-soft)",
            }}
          >
            <p
              style={{
                font: "400 12px/18px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: 0,
              }}
            >
              <strong>Double-counting risk assessment:</strong> This patient's
              outcomes contribute to scores for both providers. Under Contract
              1, Dr. Al-Khalil is accountable for diabetes outcomes. Under
              Contract 5, Dr. Al-Dosari is accountable for depression outcomes.
              ICHOM Set variables are correctly partitioned — no double-counting
              of the same measure.
            </p>
          </div>
        </div>

        {/* Section 4 — Dispute */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 4 — Attribution Dispute
          </div>
          <div
            className="l2-card"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <span
              style={{
                font: "400 12px var(--font-sans)",
                color: "var(--perf-target)",
              }}
            >
              ✓ No active disputes for this patient.
            </span>
            <button
              className="btn secondary"
              disabled
              title="Provider liaison role required to file dispute"
              style={{ fontSize: 11, opacity: 0.5 }}
            >
              File Dispute
            </button>
          </div>
        </div>
      </div>
    </S10Overlay>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L3-B  Clinical Record Abstraction
   ══════════════════════════════════════════════════════════════════════════ */
function L3BRecordAbstraction({ open, onClose }) {
  const [measure, setMeasure] = useState("D1-001");
  const measures = [
    { id: "D1-001", name: "HbA1c Control Rate" },
    { id: "D1-002", name: "LDL Control Rate" },
    { id: "D1-003", name: "Blood Pressure Control" },
    { id: "D5-001", name: "ADA Guideline Adherence" },
  ];

  const denomIn = "INCLUDED";
  const numIn = measure === "D1-001" ? "NOT INCLUDED" : "INCLUDED";
  const numNote =
    measure === "D1-001"
      ? "HbA1c 7.3% ≥ 7.0% threshold. Counts against provider's score on this measure."
      : "Criterion met for this measure.";

  return (
    <S10Overlay
      open={open}
      onClose={onClose}
      crumb={["Dashboard", "PT-2025-0847", "Clinical Record Abstraction"]}
    >
      <div
        style={{ padding: "28px 48px 48px", maxWidth: 1100, margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                font: "500 10px var(--font-mono)",
                color: "var(--fg-tertiary)",
                letterSpacing: ".07em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Measure
            </div>
            <select
              value={measure}
              onChange={(e) => setMeasure(e.target.value)}
              style={{
                padding: "9px 14px",
                borderRadius: 9999,
                border: ".5px solid var(--border-default)",
                background: "var(--bg-elevated)",
                font: "400 13px var(--font-sans)",
                color: "var(--fg-primary)",
                minWidth: 280,
              }}
            >
              {measures.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.id} — {m.name}
                </option>
              ))}
            </select>
          </div>
          <span
            style={{
              font: "500 10px var(--font-mono)",
              color: "var(--fg-tertiary)",
              background: "var(--bg-elevated)",
              padding: "4px 10px",
              borderRadius: 9999,
              border: ".5px solid var(--border-default)",
            }}
          >
            L3-B · Compliance · PT-2025-0847 · Q4 2025
          </span>
        </div>

        {/* Source data table */}
        <div className="l2-section">
          <div className="l2-section-title">
            Source Data Elements for {measure}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="l2-table">
              <thead>
                <tr>
                  <th>Data Element</th>
                  <th>Source System</th>
                  <th>Record ID</th>
                  <th>Field Name</th>
                  <th>Extracted Value</th>
                  <th>Timestamp</th>
                  <th>Transformation</th>
                  <th style={{ textAlign: "center" }}>Valid</th>
                </tr>
              </thead>
              <tbody>
                {S10_SOURCE_DATA.map((row) => (
                  <tr key={row.element}>
                    <td
                      style={{
                        font: "500 11px var(--font-sans)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {row.element}
                    </td>
                    <td>
                      <span className="mono" style={{ fontSize: 9 }}>
                        {row.source}
                      </span>
                    </td>
                    <td>
                      <span className="mono" style={{ fontSize: 9 }}>
                        {row.recordId}
                      </span>
                    </td>
                    <td>
                      <span
                        className="mono"
                        style={{ fontSize: 9, color: "var(--accent)" }}
                      >
                        {row.field}
                      </span>
                    </td>
                    <td
                      style={{
                        font: "600 11px var(--font-mono)",
                        color: "var(--fg-primary)",
                      }}
                    >
                      {row.value}
                    </td>
                    <td>
                      <span
                        className="mono"
                        style={{ fontSize: 9, color: "var(--fg-tertiary)" }}
                      >
                        {row.ts}
                      </span>
                    </td>
                    <td
                      style={{
                        font: "400 10px var(--font-sans)",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      {row.transform}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        font: "600 12px var(--font-sans)",
                        color: row.valid
                          ? "var(--perf-target)"
                          : "var(--perf-floor)",
                      }}
                    >
                      {row.valid ? "✓" : "✗"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Score contribution summary */}
        <div className="l2-section">
          <div className="l2-section-title">Score Contribution Summary</div>
          <div
            className="l2-card"
            style={{
              borderColor:
                numIn === "INCLUDED"
                  ? "var(--perf-target)"
                  : "var(--perf-floor)",
              background:
                numIn === "INCLUDED"
                  ? "var(--perf-target-soft)"
                  : "var(--perf-floor-soft)",
            }}
          >
            <div
              style={{
                font: "600 13px var(--font-sans)",
                color: "var(--fg-primary)",
                marginBottom: 10,
              }}
            >
              Score contribution for patient PT-2025-0847 on measure {measure}:
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <span
                  style={{
                    font: "500 10px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    width: 100,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    flexShrink: 0,
                  }}
                >
                  Denominator
                </span>
                <span
                  style={{
                    font: "600 12px var(--font-mono)",
                    color: "var(--perf-target)",
                  }}
                >
                  INCLUDED
                </span>
                <span
                  style={{
                    font: "400 11px var(--font-sans)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  Has T2DM diagnosis + encounter in period + no exclusions
                  triggered
                </span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <span
                  style={{
                    font: "500 10px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    width: 100,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    flexShrink: 0,
                  }}
                >
                  Numerator
                </span>
                <span
                  style={{
                    font: "600 12px var(--font-mono)",
                    color:
                      numIn === "INCLUDED"
                        ? "var(--perf-target)"
                        : "var(--perf-floor)",
                  }}
                >
                  {numIn}
                </span>
                <span
                  style={{
                    font: "400 11px var(--font-sans)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {numNote}
                </span>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <span
                  style={{
                    font: "500 10px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    width: 100,
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    flexShrink: 0,
                  }}
                >
                  Net Impact
                </span>
                <span
                  style={{
                    font: "600 12px var(--font-mono)",
                    color:
                      numIn === "INCLUDED"
                        ? "var(--perf-target)"
                        : "var(--perf-below)",
                  }}
                >
                  {numIn === "INCLUDED"
                    ? "Positive — helps provider score"
                    : "Negative — counts against provider score"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Source discrepancy detection */}
        <div className="l2-section">
          <div className="l2-section-title">Cross-Source Validation</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              [
                "EMR diagnosis (E11.65)",
                "Claims diagnosis (E11.65)",
                "Consistent ✓",
                true,
              ],
              [
                "EMR encounter date (Oct 14)",
                "Claims service date (Oct 14)",
                "Consistent ✓",
                true,
              ],
              [
                "Lab HbA1c value (7.3%)",
                "EMR result note (7.3%)",
                "Consistent ✓",
                true,
              ],
            ].map(([a, b, result, ok]) => (
              <div
                key={a}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 14px",
                  borderRadius: 8,
                  background: ok
                    ? "var(--perf-target-soft)"
                    : "var(--perf-floor-soft)",
                  border: `.5px solid ${ok ? "var(--perf-target)" : "var(--perf-floor)"}`,
                }}
              >
                <span
                  style={{
                    font: "500 11px var(--font-mono)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {a}
                </span>
                <span style={{ color: "var(--fg-tertiary)" }}>matches</span>
                <span
                  style={{
                    font: "500 11px var(--font-mono)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {b}
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    font: "600 11px var(--font-mono)",
                    color: ok ? "var(--perf-target)" : "var(--perf-floor)",
                  }}
                >
                  {result}
                </span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              padding: "8px 14px",
              background: "var(--perf-target-soft)",
              borderRadius: 8,
              border: ".5px solid var(--perf-target)",
            }}
          >
            <span
              style={{
                font: "400 11px var(--font-sans)",
                color: "var(--perf-target)",
              }}
            >
              ✓ No discrepancies detected for this patient on measure {measure}.
            </span>
          </div>
        </div>
      </div>
    </S10Overlay>
  );
}

export { L3AAttribution, L3BRecordAbstraction };
