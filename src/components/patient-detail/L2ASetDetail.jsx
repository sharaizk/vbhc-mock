import React from "react";
import { Icons } from "../Icons/Icons";
import { S10_COST_BREAKDOWN, S10_DIABETES_OUTCOMES, S10_MONTHLY_COSTS } from "@/mock/patient-details";
import { setColor } from "./PatientHeader";
const { useState } = React;

/* Shared slide-over (reuse pattern) */
function S10Panel({
  open,
  onClose,
  crumb,
  title,
  subtitle,
  children,
  tabs,
  activeTab,
  onTab,
}) {
  React.useEffect(() => {
    function k(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  return (
    <>
      <div className={"l2-scrim" + (open ? " open" : "")} onClick={onClose} />
      <aside className={"l2-panel" + (open ? " open" : "")} role="dialog">
        <div className="l2-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="l2-crumb">{crumb}</div>
            <h2>{title}</h2>
            {subtitle && (
              <p
                style={{
                  font: "400 12px/18px var(--font-sans)",
                  color: "var(--fg-secondary)",
                  margin: "6px 0 0",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button className="l2-close" onClick={onClose}>
            {Icons.close}
          </button>
        </div>
        {tabs && (
          <div className="l2-tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={"l2-tab" + (activeTab === t.id ? " active" : "")}
                onClick={() => onTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        <div className="l2-body">{children}</div>
      </aside>
    </>
  );
}

/* ── EQ-5D Radar ─────────────────────────────────────────────────────────── */
function EQ5DRadar({ data, size = 160 }) {
  const axes = ["Mobility", "Self-Care", "Activity", "Pain", "Anxiety"];
  const n = 5;
  const cx = size / 2,
    cy = size / 2,
    R = size * 0.38;
  const colors = [
    "var(--accent)",
    "oklch(62% .12 82)",
    "var(--perf-target)",
    "var(--perf-below)",
  ];
  function pt(score, i) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = ((5 - score) / 4) * R; // score 1=best, 5=worst → invert
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }
  function ptStr(arr, i) {
    const p = pt(arr[i], i);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }
  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {[1, 2, 3, 4].map((r) => {
        const pts = axes.map((_, i) => ptStr([r, r, r, r, r], i)).join(" ");
        return (
          <polygon
            key={r}
            points={pts}
            fill="none"
            stroke="var(--border-default)"
            strokeWidth="0.5"
          />
        );
      })}
      {axes.map((_, i) => {
        const p = pt(1, i);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="var(--border-default)"
            strokeWidth="0.5"
          />
        );
      })}
      {data.map((tp, ti) => {
        const arr = [
          tp.mobility,
          tp.selfCare,
          tp.usualActivity,
          tp.painDiscomfort,
          tp.anxietyDepression,
        ];
        const pts = arr.map((_, i) => ptStr(arr, i)).join(" ");
        return (
          <polygon
            key={ti}
            points={pts}
            fill={colors[ti]}
            fillOpacity="0.12"
            stroke={colors[ti]}
            strokeWidth="1.5"
          />
        );
      })}
      {axes.map((ax, i) => {
        const lp = {
          x: cx + (R + 16) * Math.cos((Math.PI * 2 * i) / n - Math.PI / 2),
          y: cy + (R + 16) * Math.sin((Math.PI * 2 * i) / n - Math.PI / 2),
        };
        return (
          <text
            key={i}
            x={lp.x}
            y={lp.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--fg-tertiary)"
            style={{ font: "500 8px var(--font-mono)" }}
          >
            {ax}
          </text>
        );
      })}
    </svg>
  );
}

/* ── PHQ-9 trajectory chart ─────────────────────────────────────────────── */
function PHQ9Chart({ data, width = 340, height = 120 }) {
  const pad = { l: 24, r: 16, t: 12, b: 24 };
  const cw = width - pad.l - pad.r,
    ch = height - pad.t - pad.b;
  const bands = [
    { lo: 0, hi: 4, color: "var(--perf-target)", label: "None" },
    { lo: 5, hi: 9, color: "oklch(62% .12 82)", label: "Mild" },
    { lo: 10, hi: 14, color: "var(--perf-below)", label: "Mod" },
    { lo: 15, hi: 19, color: "var(--perf-floor)", label: "Mod-Sv" },
    { lo: 20, hi: 27, color: "oklch(45% .2 25)", label: "Severe" },
  ];
  function sy(v) {
    return pad.t + ch - (v / 27) * ch;
  }
  function sx(i) {
    return pad.l + (i / (data.length - 1)) * cw;
  }
  const pts = data
    .map((tp, i) => `${sx(i).toFixed(1)},${sy(tp.total).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {bands.map((b) => (
        <rect
          key={b.lo}
          x={pad.l}
          y={sy(b.hi)}
          width={cw}
          height={sy(b.lo) - sy(b.hi)}
          fill={b.color}
          fillOpacity="0.08"
        />
      ))}
      <polyline
        points={pts}
        fill="none"
        stroke="var(--fg-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((tp, i) => (
        <g key={i}>
          <circle
            cx={sx(i)}
            cy={sy(tp.total)}
            r="4"
            fill="var(--fg-primary)"
            stroke="white"
            strokeWidth="1.5"
          />
          <text
            x={sx(i)}
            y={sy(tp.total) - 8}
            textAnchor="middle"
            fill="var(--fg-primary)"
            style={{ font: "600 10px var(--font-sans)" }}
          >
            {tp.total}
          </text>
          <text
            x={sx(i)}
            y={height - 4}
            textAnchor="middle"
            fill="var(--fg-tertiary)"
            style={{ font: "500 7px var(--font-mono)" }}
          >
            {tp.tp.split("(")[0].trim().slice(0, 8)}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L2-A  ICHOM Set Detail
   ══════════════════════════════════════════════════════════════════════════ */
function L2ASetDetail({ open, onClose, set }) {
  const [tab, setTab] = useState("outcomes");
  const tabs = [
    { id: "outcomes", label: "Outcome Variables" },
    { id: "proms", label: "PROMs History" },
    { id: "casemix", label: "Case-Mix Profile" },
    { id: "guidelines", label: "Guideline Adherence" },
    { id: "crossset", label: "Cross-Set Linkage" },
  ];
  if (!set)
    return (
      <S10Panel
        open={open}
        onClose={onClose}
        crumb="L2-A"
        title="ICHOM Set Detail"
      >
        {null}
      </S10Panel>
    );
  const sc = setColor(set.setId);
  const isDepa = set.setId === "DEPA";

  const cellColor = (val, row) => {
    if (!row.targetDir || row.targetDir === null) return "transparent";
    if (typeof val === "string" || val === "N/A" || val === "—")
      return "transparent";
    if (row.targetDir === "lower")
      return val <= row.target
        ? "var(--perf-target-soft)"
        : val <= row.target * 1.1
          ? "var(--perf-below-soft)"
          : "var(--perf-floor-soft)";
    if (row.targetDir === "higher")
      return val >= row.target
        ? "var(--perf-target-soft)"
        : val >= row.target * 0.9
          ? "var(--perf-below-soft)"
          : "var(--perf-floor-soft)";
    return "transparent";
  };

  return (
    <S10Panel
      open={open}
      onClose={onClose}
      crumb={"L2-A · " + set.setId + " · Patient PT-2025-0847"}
      title={set.name + " — ICHOM Set Detail"}
      subtitle="Full clinical picture within this ICHOM Set for Patient PT-2025-0847."
      tabs={tabs}
      activeTab={tab}
      onTab={setTab}
    >
      {/* Tab 1 — Outcome Variables */}
      {tab === "outcomes" && (
        <div>
          <p
            style={{
              font: "400 11px/16px var(--font-sans)",
              color: "var(--fg-secondary)",
              marginBottom: 14,
            }}
          >
            All outcome variables at each ICHOM timepoint. Green = at target,
            amber = approaching, red = below. Click any value to view source
            record.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table className="l2-table">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Baseline</th>
                  <th>3-Month</th>
                  <th>6-Month</th>
                  <th>12-Month</th>
                  <th>Status</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                {S10_DIABETES_OUTCOMES.map((row) => {
                  const statusMap = {
                    target: "var(--perf-target)",
                    casemix: "var(--fg-tertiary)",
                    met: "var(--perf-target)",
                    missed: "var(--perf-floor)",
                    monitor: "var(--perf-below)",
                    na: "var(--fg-tertiary)",
                  };
                  const statusColor =
                    statusMap[row.status] || "var(--fg-secondary)";
                  return (
                    <tr key={row.name}>
                      <td
                        style={{
                          font: "500 12px var(--font-sans)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {row.name}{" "}
                        {row.unit && (
                          <span className="mono" style={{ fontSize: 9 }}>
                            {row.unit}
                          </span>
                        )}
                      </td>
                      {row.values.map((v, i) => (
                        <td
                          key={i}
                          style={{
                            background: cellColor(v, row),
                            cursor: "pointer",
                            textAlign: "center",
                            font: "500 11px var(--font-mono)",
                          }}
                          onClick={() =>
                            window.__toast &&
                            window.__toast(
                              `Source: EMR record ${row.name} value ${v} at ${["Baseline", "3mo", "6mo", "12mo"][i]}`,
                            )
                          }
                        >
                          {v != null ? v : "—"}
                        </td>
                      ))}
                      <td>
                        <span
                          style={{
                            font: "500 10px var(--font-mono)",
                            color: statusColor,
                          }}
                        >
                          {row.status === "met"
                            ? "✓ Met"
                            : row.status === "target"
                              ? "At Target"
                              : row.status === "casemix"
                                ? "Case-Mix"
                                : row.status === "monitor"
                                  ? "⚠ Monitor"
                                  : row.status}
                        </span>
                      </td>
                      <td
                        style={{
                          font: "600 12px var(--font-sans)",
                          color:
                            row.trend === "improving"
                              ? "var(--perf-target)"
                              : row.trend === "stable"
                                ? "var(--fg-tertiary)"
                                : "var(--perf-below)",
                        }}
                      >
                        {row.trend === "improving"
                          ? "↓ Impr."
                          : row.trend === "stable"
                            ? "→ Stable"
                            : row.trend === "met"
                              ? "✓"
                              : row.trend === "na"
                                ? "—"
                                : row.trend}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2 — PROMs History */}
      {tab === "proms" && (
        <div>
          <div className="l2-section-title">
            PHQ-9 Response History — Item-Level Scores
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="l2-table">
              <thead>
                <tr>
                  <th>Timepoint</th>
                  <th>Date</th>
                  {["Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9"].map(
                    (q) => (
                      <th key={q} style={{ width: 28, textAlign: "center" }}>
                        {q}
                      </th>
                    ),
                  )}
                  <th style={{ textAlign: "center" }}>Total</th>
                  <th>Severity</th>
                  <th>Δ from Baseline</th>
                </tr>
              </thead>
              <tbody>
                {S10_PHQ9_ITEMS.map((tp, ti) => (
                  <tr
                    key={ti}
                    style={{
                      background: tp.mcid
                        ? "var(--perf-target-soft)"
                        : "transparent",
                    }}
                  >
                    <td
                      style={{
                        font: "500 11px var(--font-sans)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tp.tp}
                    </td>
                    <td
                      style={{
                        font: "400 10px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tp.date}
                    </td>
                    {tp.items.map((v, i) => (
                      <td
                        key={i}
                        style={{
                          textAlign: "center",
                          font: "500 10px var(--font-mono)",
                          color:
                            v > 1
                              ? "var(--perf-floor)"
                              : v === 1
                                ? "var(--perf-below)"
                                : "var(--fg-tertiary)",
                          background:
                            v > 1 ? "var(--perf-floor-soft)" : "transparent",
                        }}
                      >
                        {v}
                      </td>
                    ))}
                    <td
                      style={{
                        textAlign: "center",
                        font: "700 12px var(--font-sans)",
                        color:
                          tp.total >= 15
                            ? "var(--perf-floor)"
                            : tp.total >= 10
                              ? "var(--perf-below)"
                              : "var(--perf-target)",
                      }}
                    >
                      {tp.total}
                    </td>
                    <td
                      style={{
                        font: "500 10px var(--font-mono)",
                        color: "var(--fg-secondary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tp.severity}
                      {tp.mcid ? " ★ MCID" : ""}
                    </td>
                    <td
                      style={{
                        font: "600 11px var(--font-mono)",
                        color: tp.delta
                          ? "var(--perf-target)"
                          : "var(--fg-tertiary)",
                      }}
                    >
                      {tp.delta ? tp.delta : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="l2-section-title" style={{ marginTop: 18 }}>
            PHQ-9 Trajectory with Severity Bands
          </div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            <PHQ9Chart data={S10_PHQ9_ITEMS} width={380} height={120} />
            <p
              style={{
                font: "400 10px var(--font-mono)",
                color: "var(--fg-tertiary)",
                margin: "8px 0 0",
              }}
            >
              ★ MCID = 5-point reduction (achieved at 6-month timepoint)
            </p>
          </div>
          <div className="l2-section-title" style={{ marginTop: 18 }}>
            EQ-5D Dimension Profile — All Timepoints
          </div>
          <div
            className="l2-card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <EQ5DRadar data={S10_EQ5D_ITEMS} size={160} />
            <div>
              <table style={{ borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "var(--bg-elevated)" }}>
                    <th
                      style={{
                        padding: "4px 10px",
                        textAlign: "left",
                        font: "500 9px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                        textTransform: "uppercase",
                      }}
                    >
                      Timepoint
                    </th>
                    {[
                      "Mobility",
                      "Self-Care",
                      "Activity",
                      "Pain",
                      "Anxiety",
                      "Index",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "4px 8px",
                          font: "500 9px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                          textTransform: "uppercase",
                          textAlign: "center",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {S10_EQ5D_ITEMS.map((tp, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: ".5px solid var(--border-default)",
                      }}
                    >
                      <td
                        style={{
                          padding: "5px 10px",
                          font: "500 10px var(--font-sans)",
                          color: "var(--fg-secondary)",
                        }}
                      >
                        {tp.tp}
                      </td>
                      {[
                        tp.mobility,
                        tp.selfCare,
                        tp.usualActivity,
                        tp.painDiscomfort,
                        tp.anxietyDepression,
                      ].map((v, j) => (
                        <td
                          key={j}
                          style={{
                            padding: "5px 8px",
                            textAlign: "center",
                            font: "600 10px var(--font-mono)",
                            color:
                              v <= 2
                                ? "var(--perf-target)"
                                : v <= 3
                                  ? "var(--perf-below)"
                                  : "var(--perf-floor)",
                            background:
                              v <= 2
                                ? "var(--perf-target-soft)"
                                : "transparent",
                          }}
                        >
                          {v}
                        </td>
                      ))}
                      <td
                        style={{
                          padding: "5px 8px",
                          textAlign: "center",
                          font: "700 10px var(--font-mono)",
                          color: "var(--accent)",
                        }}
                      >
                        {tp.index}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3 — Case-Mix Profile */}
      {tab === "casemix" && (
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              ["Age at Diagnosis", "49 years (T2DM diagnosed 3yr prior)"],
              ["Gender", "Male"],
              ["BMI at Baseline", "33.2 — Obese Class I"],
              ["Charlson Index", "3 (Moderate)"],
              ["Duration of Diabetes", "3 years"],
              ["Insulin Use", "No (oral medications only)"],
              ["Education Level", "Secondary school"],
              ["Smoking Status", "Non-smoker"],
              ["Depression Comorbidity", "Yes — PHQ-9 baseline 14 (Moderate)"],
              ["Socioeconomic Proxy", "Medium"],
            ].map(([k, v]) => (
              <div
                key={k}
                className="metric-box"
                style={{ padding: "10px 12px" }}
              >
                <div className="m-label">{k}</div>
                <div
                  style={{
                    font: "500 12px var(--font-sans)",
                    color: "var(--fg-primary)",
                    marginTop: 4,
                  }}
                >
                  {v}
                </div>
              </div>
            ))}
          </div>
          <div className="l2-section-title">Comorbidities</div>
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 14,
            }}
          >
            {[
              "Type 2 Diabetes (primary)",
              "Major Depressive Disorder",
              "Hypertension",
              "Dyslipidemia",
            ].map((c) => (
              <span key={c} className="tag" style={{ fontSize: 11 }}>
                {c}
              </span>
            ))}
          </div>
          <div
            className="l2-card"
            style={{
              borderColor: "oklch(62% .12 82)",
              background: "oklch(97% .025 82)",
            }}
          >
            <p
              style={{
                font: "400 12px/18px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: 0,
              }}
            >
              <strong>Risk Adjustment Note:</strong> This patient's comorbidity
              burden (Charlson 3) and depression comorbidity are the primary
              drivers of risk adjustment. Without adjustment, this patient's
              outcomes would pull Dr. Al-Khalil's scores down relative to
              providers with healthier panels.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4 — Guideline Adherence */}
      {tab === "guidelines" && (
        <div>
          <div
            style={{
              padding: "8px 14px",
              background: "var(--perf-target-soft)",
              borderRadius: 8,
              border: ".5px solid var(--perf-target)",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                font: "500 12px var(--font-sans)",
                color: "var(--perf-target)",
              }}
            >
              8 of 10 applicable requirements met or partially met · Overall
              adherence: 80%
            </span>
          </div>
          <table className="l2-table">
            <thead>
              <tr>
                <th style={{ width: 110 }}>Req. ID</th>
                <th>Requirement</th>
                <th style={{ width: 100 }}>Status</th>
                <th>Evidence</th>
                <th style={{ width: 80 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {S10_GUIDELINES.map((g) => {
                const statusMap = {
                  met: [
                    "✓ Met",
                    "var(--perf-target)",
                    "var(--perf-target-soft)",
                  ],
                  partial: [
                    "~ Partial",
                    "var(--perf-below)",
                    "var(--perf-below-soft)",
                  ],
                  missed: [
                    "✗ Missed",
                    "var(--perf-floor)",
                    "var(--perf-floor-soft)",
                  ],
                  na: ["N/A", "var(--fg-tertiary)", "transparent"],
                };
                const [label, color, bg] = statusMap[g.status] || statusMap.na;
                return (
                  <tr key={g.id} style={{ background: bg }}>
                    <td>
                      <span className="m-id">{g.id}</span>
                    </td>
                    <td style={{ font: "400 11px var(--font-sans)" }}>
                      {g.req}
                    </td>
                    <td>
                      <span
                        style={{ font: "600 10px var(--font-mono)", color }}
                      >
                        {label}
                      </span>
                    </td>
                    <td
                      style={{
                        font: "400 11px var(--font-sans)",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      {g.evidence}
                    </td>
                    <td>
                      <span className="mono" style={{ fontSize: 10 }}>
                        {g.date}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5 — Cross-Set Linkage */}
      {tab === "crossset" && (
        <div>
          <div className="l2-section-title">
            Shared Variables Across Active ICHOM Sets
          </div>
          <table className="l2-table" style={{ marginBottom: 14 }}>
            <thead>
              <tr>
                <th>Variable</th>
                <th>Type 2 Diabetes Set</th>
                <th>Depression & Anxiety Set</th>
                <th>Consistent?</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["PHQ-9 Score", "7 (12-month)", "7 (12-month)", true],
                ["EQ-5D Index", "0.72", "0.72", true],
                ["BMI", "31.4 kg/m²", "31.4 kg/m²", true],
                ["Smoking Status", "Non-smoker", "Non-smoker", true],
              ].map(([name, v1, v2, ok]) => (
                <tr
                  key={name}
                  style={{
                    background: ok ? "transparent" : "var(--perf-below-soft)",
                  }}
                >
                  <td style={{ font: "500 12px var(--font-sans)" }}>{name}</td>
                  <td style={{ font: "500 11px var(--font-mono)" }}>{v1}</td>
                  <td style={{ font: "500 11px var(--font-mono)" }}>{v2}</td>
                  <td
                    style={{
                      font: "600 11px var(--font-mono)",
                      color: ok ? "var(--perf-target)" : "var(--perf-below)",
                    }}
                  >
                    {ok ? "✓ Consistent" : "⚠ Discrepancy"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              padding: "8px 14px",
              background: "var(--perf-target-soft)",
              borderRadius: 8,
              border: ".5px solid var(--perf-target)",
              marginBottom: 16,
            }}
          >
            <p
              style={{
                font: "400 11px/16px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: 0,
              }}
            >
              All 4 shared variables are consistent across Sets. No data
              discrepancies detected.
            </p>
          </div>
          {/* Relationship diagram */}
          <div className="l2-section-title">
            Patient–Set–Provider Relationship
          </div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            <svg width={520} height={140} style={{ overflow: "visible" }}>
              {/* Patient node */}
              <rect
                x={10}
                y={50}
                width={120}
                height={40}
                rx="8"
                fill="var(--accent-soft)"
                stroke="var(--accent)"
                strokeWidth="1.5"
              />
              <text
                x={70}
                y={70}
                textAnchor="middle"
                dominantBaseline="central"
                fill="var(--accent)"
                style={{ font: "600 10px var(--font-sans)" }}
              >
                PT-2025-0847
              </text>
              <text
                x={70}
                y={84}
                textAnchor="middle"
                fill="var(--fg-tertiary)"
                style={{ font: "400 8px var(--font-mono)" }}
              >
                Mohammed Al-Rashidi
              </text>
              {/* Lines to sets */}
              {[
                {
                  setId: "T2DM",
                  color: "var(--accent)",
                  label: "Type 2 Diabetes Set",
                  setX: 190,
                  setY: 30,
                  provLabel: "Dr. Al-Khalil · Endocrinology",
                  contLabel: "Contract 1",
                  pX: 360,
                  pY: 30,
                },
                {
                  setId: "DEPA",
                  color: "oklch(62% .12 82)",
                  label: "Depression & Anxiety Set",
                  setX: 190,
                  setY: 90,
                  provLabel: "Dr. Al-Dosari · Psychiatry",
                  contLabel: "Contract 5",
                  pX: 360,
                  pY: 90,
                },
              ].map((branch) => (
                <g key={branch.setId}>
                  <line
                    x1={130}
                    y1={70}
                    x2={branch.setX}
                    y2={branch.setY + 18}
                    stroke={branch.color}
                    strokeWidth="1.5"
                  />
                  <rect
                    x={branch.setX}
                    y={branch.setY}
                    width={130}
                    height={36}
                    rx="6"
                    fill={branch.color + "18"}
                    stroke={branch.color}
                    strokeWidth="1"
                  />
                  <text
                    x={branch.setX + 65}
                    y={branch.setY + 12}
                    textAnchor="middle"
                    fill={branch.color}
                    style={{ font: "500 9px var(--font-sans)" }}
                  >
                    {branch.label}
                  </text>
                  <line
                    x1={branch.setX + 130}
                    y1={branch.setY + 18}
                    x2={branch.pX}
                    y2={branch.pY + 18}
                    stroke="var(--border-default)"
                    strokeWidth="1"
                  />
                  <rect
                    x={branch.pX}
                    y={branch.pY}
                    width={140}
                    height={36}
                    rx="6"
                    fill="var(--bg-elevated)"
                    stroke="var(--border-default)"
                    strokeWidth="0.5"
                  />
                  <text
                    x={branch.pX + 70}
                    y={branch.pY + 12}
                    textAnchor="middle"
                    fill="var(--fg-secondary)"
                    style={{ font: "400 8px var(--font-sans)" }}
                  >
                    {branch.provLabel}
                  </text>
                  <text
                    x={branch.pX + 70}
                    y={branch.pY + 26}
                    textAnchor="middle"
                    fill="var(--fg-tertiary)"
                    style={{ font: "500 8px var(--font-mono)" }}
                  >
                    {branch.contLabel}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}
    </S10Panel>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L2-B  Encounter Detail
   ══════════════════════════════════════════════════════════════════════════ */
function L2BEncounter({ open, onClose, encounter }) {
  const enc = encounter || S10_ENCOUNTER_DEFAULT;
  const totalCost = enc.costLines?.reduce((a, b) => a + b.cost, 0) || 0;
  return (
    <S10Panel
      open={open}
      onClose={onClose}
      crumb={"L2-B · " + enc.id}
      title={enc.type}
      subtitle={
        enc.date +
        " · " +
        enc.facility +
        " · " +
        enc.provider +
        " · " +
        enc.duration
      }
    >
      <div>
        {/* Diagnoses */}
        <div className="l2-section-title">Diagnoses</div>
        <table className="l2-table" style={{ marginBottom: 14 }}>
          <thead>
            <tr>
              <th style={{ width: 70 }}>ICD-10</th>
              <th>Description</th>
              <th style={{ width: 80 }}>Type</th>
            </tr>
          </thead>
          <tbody>
            {enc.diagnoses?.map((d) => (
              <tr key={d.code}>
                <td>
                  <span className="mono">{d.code}</span>
                </td>
                <td style={{ font: "400 12px var(--font-sans)" }}>{d.desc}</td>
                <td>
                  <span className="tag" style={{ fontSize: 9 }}>
                    {d.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Procedures */}
        <div className="l2-section-title">Procedures</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 5,
            marginBottom: 14,
          }}
        >
          {enc.procedures?.map((p) => (
            <div
              key={p.code}
              className="l2-card"
              style={{
                padding: "8px 12px",
                display: "flex",
                gap: 12,
                alignItems: "center",
              }}
            >
              <span className="mono">{p.code}</span>
              <span
                style={{
                  font: "400 12px var(--font-sans)",
                  color: "var(--fg-secondary)",
                }}
              >
                {p.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Labs & Vitals */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <div className="l2-section-title">Lab Results</div>
            <table className="l2-table">
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Result</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {enc.labs?.map((l) => (
                  <tr key={l.name}>
                    <td style={{ font: "500 11px var(--font-sans)" }}>
                      {l.name}
                    </td>
                    <td
                      style={{
                        font: "600 11px var(--font-mono)",
                        color: "var(--accent)",
                      }}
                    >
                      {l.value}
                    </td>
                    <td
                      style={{
                        font: "400 10px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                      }}
                    >
                      {l.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="l2-section-title">Vitals</div>
            <div className="l2-card">
              {enc.vitals &&
                Object.entries(enc.vitals).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 5,
                    }}
                  >
                    <span
                      style={{
                        font: "400 11px var(--font-sans)",
                        color: "var(--fg-secondary)",
                        textTransform: "capitalize",
                      }}
                    >
                      {k.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span
                      style={{
                        font: "600 11px var(--font-mono)",
                        color: "var(--fg-primary)",
                      }}
                    >
                      {v}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Medications */}
        <div className="l2-section-title">Active Medications</div>
        <table className="l2-table" style={{ marginBottom: 14 }}>
          <thead>
            <tr>
              <th>Medication</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {enc.medications?.map((m) => (
              <tr key={m.name}>
                <td style={{ font: "500 11px var(--font-sans)" }}>{m.name}</td>
                <td
                  style={{
                    font: "500 10px var(--font-mono)",
                    color:
                      m.change === "Continued"
                        ? "var(--fg-tertiary)"
                        : "var(--accent)",
                  }}
                >
                  {m.change}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Safety */}
        {enc.safetyEvents?.length === 0 && (
          <div
            className="l2-card"
            style={{ marginBottom: 14, padding: "8px 14px" }}
          >
            <span
              style={{
                font: "400 11px var(--font-sans)",
                color: "var(--perf-target)",
              }}
            >
              ✓ No safety events at this encounter
            </span>
          </div>
        )}

        {/* Cost */}
        <div className="l2-section-title">
          Cost — SAR {totalCost.toLocaleString()}
        </div>
        <table className="l2-table" style={{ marginBottom: 14 }}>
          <thead>
            <tr>
              <th>Line Item</th>
              <th style={{ textAlign: "right" }}>Amount (SAR)</th>
            </tr>
          </thead>
          <tbody>
            {enc.costLines?.map((l) => (
              <tr key={l.item}>
                <td style={{ font: "400 11px var(--font-sans)" }}>{l.item}</td>
                <td
                  style={{
                    textAlign: "right",
                    font: "600 11px var(--font-mono)",
                  }}
                >
                  {l.cost.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Measure Contributions */}
        <div className="l2-section-title">Measure Contributions</div>
        <table className="l2-table">
          <thead>
            <tr>
              <th style={{ width: 60 }}>ID</th>
              <th>Measure</th>
              <th style={{ width: 90 }}>Contribution</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {enc.measureContributions?.map((mc) => (
              <tr
                key={mc.id}
                style={{
                  background:
                    mc.positive === true
                      ? "var(--perf-target-soft)"
                      : mc.positive === false
                        ? "var(--perf-floor-soft)"
                        : "transparent",
                }}
              >
                <td>
                  <span className="m-id">{mc.id}</span>
                </td>
                <td style={{ font: "400 11px var(--font-sans)" }}>{mc.name}</td>
                <td>
                  <span
                    style={{
                      font: "600 10px var(--font-mono)",
                      color:
                        mc.positive === true
                          ? "var(--perf-target)"
                          : mc.positive === false
                            ? "var(--perf-floor)"
                            : "var(--fg-tertiary)",
                    }}
                  >
                    {mc.positive === true
                      ? "✓ POSITIVE"
                      : mc.positive === false
                        ? "✗ NEGATIVE"
                        : "→ NEUTRAL"}
                  </span>
                </td>
                <td
                  style={{
                    font: "400 10px var(--font-sans)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {mc.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </S10Panel>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L2-C  Cost Profile
   ══════════════════════════════════════════════════════════════════════════ */
function L2CCostProfile({ open, onClose }) {
  const [expanded, setExpanded] = useState(null);
  const total = 48200;
  const expectedCost = 52800;
  const oeRatio = (total / expectedCost).toFixed(2);

  /* Donut chart */
  function DonutChart({ data, size = 160 }) {
    const r = size * 0.36,
      cx = size / 2,
      cy = size / 2,
      innerR = r * 0.55;
    let angle = -90;
    const total = data.reduce((s, d) => s + d.pct, 0);
    function pol(r, deg) {
      const rad = (deg * Math.PI) / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    }
    return (
      <svg width={size} height={size} style={{ display: "block" }}>
        {data.map((d, i) => {
          const sweep = (d.pct / total) * 360;
          const start = pol(r, angle);
          const end = pol(r, angle + sweep - 0.5);
          const iStart = pol(innerR, angle);
          const iEnd = pol(innerR, angle + sweep - 0.5);
          const large = sweep > 180 ? 1 : 0;
          const path = `M ${start.x.toFixed(1)} ${start.y.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${end.x.toFixed(1)} ${end.y.toFixed(1)} L ${iEnd.x.toFixed(1)} ${iEnd.y.toFixed(1)} A ${innerR} ${innerR} 0 ${large} 0 ${iStart.x.toFixed(1)} ${iStart.y.toFixed(1)} Z`;
          angle += sweep;
          return (
            <path
              key={d.cat}
              d={path}
              fill={d.color}
              fillOpacity="0.85"
              stroke="var(--bg-surface)"
              strokeWidth="1.5"
            />
          );
        })}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          fill="var(--fg-primary)"
          style={{ font: "600 14px var(--font-sans)" }}
        >
          SAR
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="var(--fg-primary)"
          style={{ font: "600 12px var(--font-sans)" }}
        >
          48,200
        </text>
      </svg>
    );
  }

  return (
    <S10Panel
      open={open}
      onClose={onClose}
      crumb="L2-C · Cost Profile · PT-2025-0847"
      title="Patient Cost Profile"
      subtitle="Total cost of care: SAR 48,200. 24-month observation window (Jan 2024 – Dec 2025)."
    >
      {/* Section 1 — Donut */}
      <div className="l2-section">
        <div className="l2-section-title">Section 1 — Cost by Category</div>
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <DonutChart data={S10_COST_BREAKDOWN} size={170} />
          <div style={{ flex: 1 }}>
            {S10_COST_BREAKDOWN.map((cat) => (
              <div key={cat.cat}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    cursor: "pointer",
                    padding: "6px 0",
                    borderBottom: ".5px solid var(--border-default)",
                  }}
                  onClick={() =>
                    setExpanded(expanded === cat.cat ? null : cat.cat)
                  }
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: cat.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ font: "500 12px var(--font-sans)", flex: 1 }}>
                    {cat.cat}
                  </span>
                  <span
                    style={{
                      font: "600 12px var(--font-mono)",
                      color: cat.color,
                    }}
                  >
                    SAR {cat.amount.toLocaleString()}
                  </span>
                  <span
                    style={{
                      font: "400 10px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      width: 40,
                      textAlign: "right",
                    }}
                  >
                    {cat.pct}%
                  </span>
                  <span style={{ color: "var(--fg-tertiary)", fontSize: 10 }}>
                    {expanded === cat.cat ? "▲" : "▼"}
                  </span>
                </div>
                {expanded === cat.cat && (
                  <div
                    style={{
                      padding: "8px 20px",
                      background: "var(--bg-elevated)",
                    }}
                  >
                    {cat.items.map((item, i) => (
                      <div
                        key={i}
                        style={{
                          font: "400 11px var(--font-sans)",
                          color: "var(--fg-secondary)",
                          marginBottom: 3,
                        }}
                      >
                        • {item}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2 — Monthly trajectory */}
      <div className="l2-section">
        <div className="l2-section-title">
          Section 2 — Monthly Cost Trajectory
        </div>
        <div className="l2-card" style={{ overflowX: "auto" }}>
          <svg width={500} height={120} style={{ overflow: "visible" }}>
            {(() => {
              const pad = { l: 40, r: 16, t: 12, b: 28 };
              const cw = 444,
                ch = 80;
              const maxC = Math.max(...S10_MONTHLY_COSTS) * 1.1;
              const sx = (i) =>
                pad.l + (i / (S10_MONTHLY_COSTS.length - 1)) * cw;
              const sy = (v) => pad.t + ch - (v / maxC) * ch;
              const pts = S10_MONTHLY_COSTS.map(
                (v, i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`,
              ).join(" ");
              const expectedPerMonth = expectedCost / 24;
              const ey = sy(expectedPerMonth);
              return (
                <g>
                  <line
                    x1={pad.l}
                    y1={ey}
                    x2={pad.l + cw}
                    y2={ey}
                    stroke="var(--fg-tertiary)"
                    strokeWidth="1"
                    strokeDasharray="5,4"
                  />
                  <text
                    x={pad.l + cw + 4}
                    y={ey}
                    dominantBaseline="central"
                    fill="var(--fg-tertiary)"
                    style={{ font: "500 8px var(--font-mono)" }}
                  >
                    Expected
                  </text>
                  <polyline
                    points={pts}
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  {S10_MONTHLY_COSTS.map(
                    (v, i) =>
                      v > 5000 && (
                        <g key={i}>
                          <circle
                            cx={sx(i)}
                            cy={sy(v)}
                            r="5"
                            fill="var(--perf-floor)"
                            stroke="white"
                            strokeWidth="1.5"
                          />
                          <text
                            x={sx(i)}
                            y={sy(v) - 10}
                            textAnchor="middle"
                            fill="var(--perf-floor)"
                            style={{ font: "600 8px var(--font-mono)" }}
                          >
                            SAR {(v / 1000).toFixed(1)}k
                          </text>
                        </g>
                      ),
                  )}
                  {[0, 6, 12, 18].map((i) => (
                    <text
                      key={i}
                      x={sx(i)}
                      y={pad.t + ch + 16}
                      textAnchor="middle"
                      fill="var(--fg-tertiary)"
                      style={{ font: "500 7px var(--font-mono)" }}
                    >
                      {i < 12
                        ? `${["Jan", "Jul"][i / 6]} '24`
                        : `${["Jan", "Jul"][(i - 12) / 6]} '25`}
                    </text>
                  ))}
                </g>
              );
            })()}
          </svg>
        </div>
      </div>

      {/* Section 3 — Cost by ICHOM Set */}
      <div className="l2-section">
        <div className="l2-section-title">Section 3 — Cost per ICHOM Set</div>
        <div className="l2-card">
          {[
            {
              label: "Diabetes-related",
              pct: 71.8,
              amount: 34600,
              color: "var(--accent)",
            },
            {
              label: "Depression-related",
              pct: 17.0,
              amount: 8200,
              color: "oklch(62% .12 82)",
            },
            {
              label: "Shared / General",
              pct: 11.2,
              amount: 5400,
              color: "var(--fg-tertiary)",
            },
          ].map((seg) => (
            <div
              key={seg.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  width: 130,
                  font: "400 11px var(--font-sans)",
                  color: "var(--fg-secondary)",
                  flexShrink: 0,
                }}
              >
                {seg.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 22,
                  background: "var(--bg-elevated)",
                  borderRadius: 4,
                  overflow: "hidden",
                  border: ".5px solid var(--border-default)",
                }}
              >
                <div
                  style={{
                    width: seg.pct + "%",
                    height: "100%",
                    background: seg.color,
                    opacity: 0.8,
                  }}
                />
              </div>
              <span
                style={{
                  font: "600 11px var(--font-mono)",
                  color: seg.color,
                  width: 88,
                  flexShrink: 0,
                }}
              >
                SAR {seg.amount.toLocaleString()}
              </span>
              <span
                style={{
                  font: "400 10px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  width: 36,
                  flexShrink: 0,
                }}
              >
                {seg.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4 — O/E */}
      <div className="l2-section">
        <div className="l2-section-title">Section 4 — Observed vs Expected</div>
        <div className="metric-row">
          {[
            { l: "Observed", v: `SAR ${total.toLocaleString()}` },
            {
              l: "Expected (RAF 1.84)",
              v: `SAR ${expectedCost.toLocaleString()}`,
            },
            { l: "O/E Ratio", v: oeRatio, c: "var(--perf-target)" },
          ].map((x) => (
            <div key={x.l} className="metric-box">
              <div className="m-label">{x.l}</div>
              <div
                className="m-val"
                style={{ color: x.c || "var(--fg-primary)", fontSize: 15 }}
              >
                {x.v}
              </div>
            </div>
          ))}
        </div>
        <div className="l2-card" style={{ marginTop: 10 }}>
          <p
            style={{
              font: "400 12px/18px var(--font-sans)",
              color: "var(--fg-secondary)",
              margin: 0,
            }}
          >
            This patient's costs are 9% below expected given their risk profile.
            The hypoglycemic admission (SAR 12,400) is the primary cost driver.
            Without that event, O/E ratio would be 0.68 (32% below expected).
          </p>
        </div>
      </div>

      {/* Section 5 — High-cost events */}
      <div className="l2-section">
        <div className="l2-section-title">
          Section 5 — High-Cost Event Identification
        </div>
        <div
          style={{
            padding: "10px 14px",
            background: "var(--perf-floor-soft)",
            borderRadius: 8,
            border: ".5px solid var(--perf-floor)",
            marginBottom: 10,
          }}
        >
          <span
            style={{
              font: "500 11px var(--font-sans)",
              color: "var(--perf-floor)",
            }}
          >
            1 of 1 high-cost events identified · Accounts for 25.7% of total
            patient cost
          </span>
        </div>
        <table className="l2-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Month</th>
              <th style={{ textAlign: "right" }}>Cost (SAR)</th>
              <th>DRG</th>
              <th>Assessment</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: "var(--perf-floor-soft)" }}>
              <td style={{ font: "500 11px var(--font-sans)" }}>
                Inpatient — Hypoglycemic episode (2-day)
              </td>
              <td
                style={{
                  font: "400 10px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                }}
              >
                Jun 2024
              </td>
              <td
                style={{
                  textAlign: "right",
                  font: "600 11px var(--font-mono)",
                  color: "var(--perf-floor)",
                }}
              >
                12,400
              </td>
              <td>
                <span className="mono" style={{ fontSize: 9 }}>
                  E11.641
                </span>
              </td>
              <td
                style={{
                  font: "400 10px var(--font-sans)",
                  color: "var(--fg-secondary)",
                }}
              >
                Potentially preventable with closer monitoring and dose
                adjustment
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </S10Panel>
  );
}

export { L2ASetDetail, L2BEncounter, L2CCostProfile };
