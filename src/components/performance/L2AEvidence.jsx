import React from "react";
import { Icons } from "../Icons/Icons";
import { S11_PATHWAY, S11_REQ_DETAIL } from "@/mock/guideline-adherence";
import { complianceColor, complianceSoft, gradeColor, gradeSoft } from "@/utils/helpers";
const { useState, useMemo } = React;

/* Shared slide-over */
function S11Panel({
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

/* ════════════════════════════════════════════════════════════════════════════
   L2-A  Requirement Evidence Chain
   ══════════════════════════════════════════════════════════════════════════ */
function L2AEvidenceChain({ open, onClose, requirement }) {
  const [patFilter, setPatFilter] = useState("all");
  const [tab, setTab] = useState("spec");

  const tabs = [
    { id: "spec", label: "Full Requirement" },
    { id: "ops", label: "Operationalization" },
    { id: "patients", label: "Patient Compliance" },
    { id: "gaps", label: "Gap Analysis" },
  ];

  // All hooks must come before any early returns
  const detail = requirement ? S11_REQ_DETAIL[requirement.id] : null;

  const patients = useState(() => {
    if (!requirement) return [];
    if (detail?.patients) return detail.patients;
    return Array.from({ length: 20 }, (_, i) => {
      const met = i < Math.round((requirement.compliance / 100) * 20);
      return {
        id: `PT-2025-${String(1000 + i).padStart(4, "0")}`,
        age: 40 + Math.floor(Math.sin(i * 7) * 15 + 15),
        sex: i % 3 === 0 ? "F" : "M",
        status: met ? "met" : i === 19 ? "excluded" : "not_met",
        evidence: met
          ? `${requirement.cat} criterion met — documented ${["Jan", "Apr", "Jul", "Oct"][i % 4]} 2025`
          : `${requirement.cat} criterion not met — no record found`,
        date: `${[8, 12, 15, 22][i % 4]} ${["Jan", "Apr", "Jul", "Oct", "Dec"][i % 5]} 2025`,
        daysSince: met ? null : 90 + i * 10,
      };
    });
  }, [requirement?.id, detail]);

  const filteredPats = useState(() => {
    if (patFilter === "all") return patients;
    return patients.filter((p) => p.status === patFilter);
  }, [patients, patFilter]);

  if (!requirement)
    return (
      <S11Panel
        open={open}
        onClose={onClose}
        crumb="L2-A"
        title="Requirement Evidence Chain"
      >
        {null}
      </S11Panel>
    );

  const gaps = detail?.gaps || [];
  const c = complianceColor(requirement.compliance);
  const gc = gradeColor(requirement.grade);

  return (
    <S11Panel
      open={open}
      onClose={onClose}
      crumb={"L2-A · " + requirement.id}
      title={requirement.id + " — " + requirement.chLabel}
      subtitle={requirement.desc}
      tabs={tabs}
      activeTab={tab}
      onTab={setTab}
    >
      {/* Section 1 — Full Requirement */}
      {tab === "spec" && (
        <div>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            {[
              {
                l: "Evidence Grade",
                v: requirement.grade,
                c: gc,
                cs: gradeSoft(requirement.grade),
              },
              { l: "Category", v: requirement.cat },
              {
                l: "Compliance",
                v: requirement.compliance + "%",
                c: c,
                cs: complianceSoft(requirement.compliance),
              },
              { l: "Eligible", v: requirement.eligible.toLocaleString() },
              { l: "Compliant", v: requirement.compliant.toLocaleString() },
            ].map((x) => (
              <div
                key={x.l}
                className="metric-box"
                style={{
                  flex: "1 1 90px",
                  padding: "10px 12px",
                  borderColor: x.c || undefined,
                  background: x.cs || undefined,
                }}
              >
                <div className="m-label">{x.l}</div>
                <div
                  style={{
                    font: "600 16px var(--font-sans)",
                    color: x.c || "var(--fg-primary)",
                    marginTop: 4,
                  }}
                >
                  {x.v}
                </div>
              </div>
            ))}
          </div>
          <div className="l2-section-title">Full Guideline Text</div>
          <div
            style={{
              borderLeft: `4px solid ${c}`,
              padding: "14px 18px",
              background: complianceSoft(requirement.compliance),
              borderRadius: "0 10px 10px 0",
              marginBottom: 14,
            }}
          >
            <div
              style={{
                font: "500 10px var(--font-mono)",
                color: "var(--fg-tertiary)",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {detail?.source ||
                "ADA Standards of Medical Care in Diabetes — 2024"}{" "}
              · {detail?.chapter || requirement.chLabel}
            </div>
            <p
              style={{
                font: "400 13px/22px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: 0,
                fontStyle: "italic",
              }}
            >
              "{detail?.fullText || requirement.desc}"
            </p>
          </div>
          <div className="l2-section-title">Evidence Base</div>
          <div className="l2-card">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  font: "700 14px var(--font-mono)",
                  background: gradeSoft(requirement.grade),
                  color: gradeColor(requirement.grade),
                  border: `.5px solid ${gradeColor(requirement.grade)}`,
                }}
              >
                {requirement.grade}
              </span>
              <span
                style={{
                  font: "600 12px var(--font-sans)",
                  color: "var(--fg-primary)",
                }}
              >
                {
                  {
                    A: "Grade A — Based on well-designed randomized controlled trials",
                    B: "Grade B — Supported by well-conducted cohort studies or case-control studies",
                    C: "Grade C — Based on limited data from observational studies or expert opinion",
                    E: "Grade E — Expert consensus, no clinical trial available",
                  }[requirement.grade]
                }
              </span>
            </div>
            <p
              style={{
                font: "400 11px/16px var(--font-sans)",
                color: "var(--fg-secondary)",
                margin: 0,
              }}
            >
              This requirement is derived from{" "}
              {detail?.source || "ADA Standards of Care 2024"} and
              operationalized by AiQL using computable clinical logic mapped to
              ICD-10-AM and SNOMED CT terminology.
            </p>
          </div>
        </div>
      )}

      {/* Section 2 — Operationalization */}
      {tab === "ops" && (
        <div>
          {detail?.operationalization ? (
            <div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <div
                  className="l2-card"
                  style={{
                    borderColor: "oklch(62% .12 82)",
                    background: "oklch(97% .025 82)",
                  }}
                >
                  <div
                    style={{
                      font: "600 10px var(--font-mono)",
                      color: "oklch(62% .12 82)",
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Guideline Says
                  </div>
                  <p
                    style={{
                      font: "400 12px/18px var(--font-sans)",
                      color: "var(--fg-primary)",
                      margin: 0,
                      fontStyle: "italic",
                    }}
                  >
                    "{detail.fullText}"
                  </p>
                </div>
                <div
                  className="l2-card"
                  style={{
                    borderColor: "var(--accent)",
                    background: "var(--accent-soft)",
                  }}
                >
                  <div
                    style={{
                      font: "600 10px var(--font-mono)",
                      color: "var(--accent)",
                      letterSpacing: ".06em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    AiQL Measures
                  </div>
                  <div
                    style={{
                      font: "400 11px/18px var(--font-mono)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {[
                      detail.operationalization.denom,
                      detail.operationalization.numer,
                      detail.operationalization.rate,
                    ].map((line, i) => (
                      <p key={i} style={{ margin: "0 0 8px" }}>
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              <div className="l2-section-title">Operationalization Note</div>
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
                  {detail.operationalization.note}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="l2-card">
                <div
                  style={{
                    font: "600 10px var(--font-mono)",
                    color: "var(--accent)",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    marginBottom: 8,
                  }}
                >
                  Computable Operationalization
                </div>
                <p
                  style={{
                    font: "400 12px/18px var(--font-sans)",
                    color: "var(--fg-secondary)",
                    margin: "0 0 10px",
                  }}
                >
                  <strong>DENOMINATOR:</strong> Patients meeting the clinical
                  criteria for this requirement (n=
                  {requirement.eligible.toLocaleString()}).
                </p>
                <p
                  style={{
                    font: "400 12px/18px var(--font-sans)",
                    color: "var(--fg-secondary)",
                    margin: "0 0 10px",
                  }}
                >
                  <strong>NUMERATOR:</strong> Denominator patients with
                  documented evidence of compliance (n=
                  {requirement.compliant.toLocaleString()}).
                </p>
                <p
                  style={{
                    font: "600 12px/18px var(--font-sans)",
                    color: "var(--fg-primary)",
                    margin: 0,
                  }}
                >
                  COMPLIANCE RATE: {requirement.compliant.toLocaleString()} ÷{" "}
                  {requirement.eligible.toLocaleString()} ={" "}
                  {requirement.compliance}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Section 3 — Patient Compliance */}
      {tab === "patients" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {[
              ["all", "All"],
              ["met", "Met ✓"],
              ["not_met", "Not Met ✗"],
              ["excluded", "Excluded ○"],
            ].map(([v, l]) => (
              <button
                key={v}
                className={
                  "btn" + (patFilter === v ? " primary" : " secondary")
                }
                style={{ padding: "4px 12px", fontSize: 10 }}
                onClick={() => setPatFilter(v)}
              >
                {l}
              </button>
            ))}
            <span
              style={{
                marginLeft: "auto",
                font: "400 11px var(--font-mono)",
                color: "var(--fg-tertiary)",
              }}
            >
              {patients.filter((p) => p.status === "met").length} met ·{" "}
              {patients.filter((p) => p.status === "not_met").length} not met ·{" "}
              {patients.filter((p) => p.status === "excluded").length} excluded
            </span>
          </div>
          <table className="l2-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Status</th>
                <th>Evidence</th>
                <th>Date</th>
                <th>Days Since</th>
              </tr>
            </thead>
            <tbody>
              {filteredPats.map((p) => {
                const statusStyle =
                  p.status === "met"
                    ? {
                        color: "var(--perf-target)",
                        bg: "var(--perf-target-soft)",
                        label: "✓ Met",
                      }
                    : p.status === "excluded"
                      ? {
                          color: "var(--fg-tertiary)",
                          bg: "var(--bg-elevated)",
                          label: "○ Excluded",
                        }
                      : {
                          color: "var(--perf-floor)",
                          bg: "var(--perf-floor-soft)",
                          label: "✗ Not Met",
                        };
                return (
                  <tr
                    key={p.id}
                    style={{ background: statusStyle.bg, cursor: "pointer" }}
                    onClick={() =>
                      window.__toast &&
                      window.__toast("Navigates to Patient Detail (Session 10)")
                    }
                  >
                    <td>
                      <span className="mono" style={{ fontSize: 10 }}>
                        {p.id}
                      </span>
                    </td>
                    <td style={{ font: "400 11px var(--font-sans)" }}>
                      {p.age}
                    </td>
                    <td style={{ font: "400 11px var(--font-sans)" }}>
                      {p.sex}
                    </td>
                    <td>
                      <span
                        style={{
                          font: "600 10px var(--font-mono)",
                          color: statusStyle.color,
                        }}
                      >
                        {statusStyle.label}
                      </span>
                    </td>
                    <td
                      style={{
                        font: "400 11px var(--font-sans)",
                        color: "var(--fg-secondary)",
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={p.evidence}
                    >
                      {p.evidence}
                    </td>
                    <td
                      style={{
                        font: "400 10px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.date}
                    </td>
                    <td
                      style={{
                        font: "600 10px var(--font-mono)",
                        color:
                          p.daysSince && p.daysSince > 150
                            ? "var(--perf-floor)"
                            : p.daysSince
                              ? "var(--perf-below)"
                              : "var(--fg-tertiary)",
                      }}
                    >
                      {p.daysSince ? p.daysSince + "d" : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Section 4 — Gap Analysis */}
      {tab === "gaps" && (
        <div>
          {gaps.length > 0 ? (
            <div>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 14,
                  flexWrap: "wrap",
                }}
              >
                <div
                  className="metric-box"
                  style={{
                    borderColor: "var(--perf-floor)",
                    background: "var(--perf-floor-soft)",
                  }}
                >
                  <div className="m-label">Non-Compliant</div>
                  <div className="m-val" style={{ color: "var(--perf-floor)" }}>
                    {gaps.filter((g) => !g.note.includes("APPROACHING")).length}
                  </div>
                </div>
                <div
                  className="metric-box"
                  style={{
                    borderColor: "oklch(56% .13 75)",
                    background: "var(--perf-below-soft)",
                  }}
                >
                  <div className="m-label">Approaching (next 30d)</div>
                  <div className="m-val" style={{ color: "var(--perf-below)" }}>
                    {gaps.filter((g) => g.note.includes("APPROACHING")).length}
                  </div>
                </div>
              </div>
              {gaps.map((gap, i) => {
                const isApproaching = gap.note.includes("APPROACHING");
                const urgency =
                  gap.days > 200
                    ? "var(--perf-floor)"
                    : gap.days > 120
                      ? "oklch(56% .13 75)"
                      : "var(--perf-below)";
                return (
                  <div
                    key={gap.ptId}
                    className="l2-card"
                    style={{
                      marginBottom: 10,
                      borderColor: isApproaching
                        ? "oklch(56% .13 75)"
                        : urgency,
                      borderLeft: `4px solid ${isApproaching ? "oklch(56% .13 75)" : urgency}`,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            marginBottom: 4,
                          }}
                        >
                          <span className="mono" style={{ fontSize: 10 }}>
                            {gap.ptId}
                          </span>
                          <span
                            style={{
                              font: "600 12px var(--font-mono)",
                              color: urgency,
                            }}
                          >
                            HbA1c {gap.hba1c}
                          </span>
                          <span
                            style={{
                              font: "400 10px var(--font-mono)",
                              color: "var(--fg-tertiary)",
                            }}
                          >
                            since {gap.date}
                          </span>
                        </div>
                        <p
                          style={{
                            font: "400 12px/18px var(--font-sans)",
                            color: "var(--fg-primary)",
                            margin: 0,
                          }}
                        >
                          {gap.note}
                        </p>
                      </div>
                      <span
                        style={{
                          font: "700 20px var(--font-sans)",
                          color: urgency,
                          flexShrink: 0,
                        }}
                      >
                        {gap.days}d
                      </span>
                    </div>
                  </div>
                );
              })}
              <div
                style={{
                  marginTop: 14,
                  padding: "12px 16px",
                  background: "var(--perf-below-soft)",
                  borderRadius: 10,
                  border: ".5px solid var(--perf-below)",
                }}
              >
                <p
                  style={{
                    font: "400 12px/18px var(--font-sans)",
                    color: "var(--fg-primary)",
                    margin: 0,
                  }}
                >
                  <strong>Summary:</strong>{" "}
                  {gaps.filter((g) => !g.note.includes("APPROACHING")).length}{" "}
                  patients currently non-compliant.{" "}
                  {gaps.filter((g) => g.note.includes("APPROACHING")).length}{" "}
                  patients approaching the 90-day threshold. Improving this
                  requirement from {requirement.compliance}% to 70% would
                  increase D5-001 composite from 76.8% to 79.4%.
                </p>
              </div>
            </div>
          ) : (
            <div className="l2-card">
              <p
                style={{
                  font: "400 12px var(--font-sans)",
                  color: "var(--fg-secondary)",
                  margin: 0,
                }}
              >
                Patient-level gap analysis available for ADA-2024-013. Select
                that requirement for detailed gap data.
              </p>
            </div>
          )}
        </div>
      )}
    </S11Panel>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L2-B  Care Pathway Visualization (Sankey / Funnel)
   ══════════════════════════════════════════════════════════════════════════ */
function L2BCarePathway({ open, onClose, onOpenRequirement }) {
  const [hovered, setHovered] = useState(null);
  const pathway = S11_PATHWAY;
  const total = pathway[0].entering;

  const W = 760,
    H = 380;
  const PAD_L = 180,
    PAD_R = 20,
    PAD_T = 28,
    BAR_H = 36,
    STEP_GAP = 16;
  const CW = W - PAD_L - PAD_R;
  const stepH = BAR_H + STEP_GAP;

  function barW(n) {
    return (n / total) * CW;
  }
  function barX(n) {
    return PAD_L + (CW - barW(n)) / 2;
  }
  function barY(si) {
    return PAD_T + si * stepH;
  }

  const completionRate = (
    (pathway[pathway.length - 1].compliant / total) *
    100
  ).toFixed(1);

  return (
    <S11Panel
      open={open}
      onClose={onClose}
      crumb="L2-B · Care Pathway Visualization"
      title="Diabetes Initial Management — Care Pathway"
      subtitle={
        "Patient flow through 6 sequential guideline steps. " +
        total +
        " patients entering the pathway. Cumulative completion rate: " +
        completionRate +
        "% (" +
        pathway[pathway.length - 1].compliant +
        " of " +
        total +
        " fully compliant)."
      }
    >
      <div>
        <div className="l2-section-title">Patient Flow Funnel</div>
        <div
          className="l2-card"
          style={{ overflowX: "auto", padding: "20px 16px" }}
        >
          <svg
            width={W}
            height={PAD_T + pathway.length * stepH + 60}
            style={{ overflow: "visible" }}
          >
            <defs>
              <marker
                id="path-arrow"
                viewBox="0 0 8 6"
                refX="7"
                refY="3"
                markerWidth="5"
                markerHeight="5"
                orient="auto"
              >
                <path
                  d="M0,0 L8,3 L0,6Z"
                  fill="var(--fg-tertiary)"
                  opacity="0.5"
                />
              </marker>
            </defs>
            {pathway.map((step, si) => {
              const x = barX(step.compliant);
              const w = barW(step.compliant);
              const y = barY(si);
              const entX = barX(step.entering);
              const entW = barW(step.entering);
              const dropW = entW - w;
              const isHov = hovered === si;
              const compRate = ((step.compliant / step.entering) * 100).toFixed(
                1,
              );
              const hasAction = step.needsAction != null;

              return (
                <g
                  key={si}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHovered(si)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => {
                    if (step.reqs && step.reqs.length > 0) {
                      const req = (S11_ADA_REQS || []).find(
                        (r) => r.id === step.reqs[0],
                      );
                      if (req) onOpenRequirement(req);
                    }
                  }}
                >
                  {/* Entering bar (lighter) */}
                  {si > 0 && (
                    <rect
                      x={entX}
                      y={y - 4}
                      width={entW}
                      height={4}
                      fill="var(--accent)"
                      fillOpacity="0.2"
                    />
                  )}

                  {/* Main compliant bar */}
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={BAR_H}
                    rx="4"
                    fill="var(--accent)"
                    fillOpacity={isHov ? 0.9 : 0.75}
                    stroke="var(--accent)"
                    strokeWidth={isHov ? 1.5 : 0.5}
                  />

                  {/* Dropout segment */}
                  {step.dropout > 0 && (
                    <rect
                      x={x + w}
                      y={y}
                      width={dropW}
                      height={BAR_H}
                      rx="0"
                      fill="oklch(56% .13 75)"
                      fillOpacity="0.45"
                      stroke="oklch(56% .13 75)"
                      strokeWidth="0.5"
                    />
                  )}

                  {/* Step label (left) */}
                  <text
                    x={PAD_L - 10}
                    y={y + BAR_H / 2}
                    textAnchor="end"
                    dominantBaseline="central"
                    fill="var(--fg-primary)"
                    style={{
                      font: isHov
                        ? "600 11px var(--font-sans)"
                        : "400 11px var(--font-sans)",
                    }}
                  >
                    {si + 1}.{" "}
                    {step.label.length > 22
                      ? step.label.slice(0, 21) + "…"
                      : step.label}
                  </text>

                  {/* Count inside bar */}
                  {w > 60 && (
                    <text
                      x={x + w / 2}
                      y={y + BAR_H / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      style={{ font: "600 11px var(--font-sans)" }}
                    >
                      {step.compliant.toLocaleString()}
                    </text>
                  )}

                  {/* Compliance rate */}
                  <text
                    x={x + w + (dropW || 0) + 8}
                    y={y + BAR_H / 2}
                    dominantBaseline="central"
                    fill="var(--fg-secondary)"
                    style={{ font: "500 10px var(--font-mono)" }}
                  >
                    {compRate}%
                  </text>

                  {/* Dropout label */}
                  {step.dropout > 0 && (
                    <g>
                      <text
                        x={x + w + dropW / 2}
                        y={y + BAR_H + 12}
                        textAnchor="middle"
                        fill="oklch(56% .13 75)"
                        style={{ font: "500 9px var(--font-mono)" }}
                      >
                        -{step.dropout} dropped off
                      </text>
                      <text
                        x={x + w + dropW / 2}
                        y={y + BAR_H + 22}
                        textAnchor="middle"
                        fill="var(--fg-tertiary)"
                        style={{ font: "400 8px var(--font-sans)" }}
                      >
                        {step.dropReason.slice(0, 32)}
                        {step.dropReason.length > 32 ? "…" : ""}
                      </text>
                    </g>
                  )}

                  {/* Needs action indicator */}
                  {hasAction && (
                    <text
                      x={x + 8}
                      y={y + BAR_H / 2}
                      dominantBaseline="central"
                      fill="var(--perf-below)"
                      style={{ font: "500 9px var(--font-mono)" }}
                    >
                      {step.needsAction} need action
                    </text>
                  )}

                  {/* Connecting line to next step */}
                  {si < pathway.length - 1 && (
                    <line
                      x1={x + w / 2}
                      y1={y + BAR_H}
                      x2={
                        barX(pathway[si + 1].compliant) +
                        barW(pathway[si + 1].compliant) / 2
                      }
                      y2={barY(si + 1) - 2}
                      stroke="var(--accent)"
                      strokeWidth="1"
                      strokeOpacity="0.3"
                      strokeDasharray="3,2"
                      markerEnd="url(#path-arrow)"
                    />
                  )}
                </g>
              );
            })}

            {/* Cumulative completion label */}
            <text
              x={W / 2}
              y={PAD_T + pathway.length * stepH + 30}
              textAnchor="middle"
              fill="var(--fg-secondary)"
              style={{ font: "500 11px var(--font-sans)" }}
            >
              Cumulative pathway completion:{" "}
              <tspan fill="var(--accent)" style={{ fontWeight: 700 }}>
                {pathway[pathway.length - 1].compliant} of {total} (
                {completionRate}%)
              </tspan>
            </text>

            {/* Legend */}
            {[
              ["var(--accent)", "Compliant at this step"],
              ["oklch(56% .13 75)", "Dropped off"],
            ].map(([c, l], i) => (
              <g
                key={l}
                transform={`translate(${PAD_L + i * 180}, ${PAD_T + pathway.length * stepH + 46})`}
              >
                <rect
                  x={0}
                  y={-8}
                  width={12}
                  height={8}
                  rx="2"
                  fill={c}
                  fillOpacity="0.8"
                />
                <text
                  x={16}
                  y={0}
                  fill="var(--fg-tertiary)"
                  style={{ font: "400 9px var(--font-mono)" }}
                >
                  {l}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Summary insight */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginTop: 14,
          }}
        >
          <div
            className="l2-card"
            style={{
              borderColor: "var(--perf-below)",
              background: "var(--perf-below-soft)",
            }}
          >
            <div
              style={{
                font: "500 10px var(--font-mono)",
                color: "var(--perf-below)",
                textTransform: "uppercase",
                letterSpacing: ".05em",
                marginBottom: 6,
              }}
            >
              Largest Single Drop-Off
            </div>
            <div
              style={{
                font: "600 14px var(--font-sans)",
                color: "var(--fg-primary)",
                marginBottom: 4,
              }}
            >
              Step 2: Comprehensive Evaluation
            </div>
            <p
              style={{
                font: "400 11px/16px var(--font-sans)",
                color: "var(--fg-secondary)",
                margin: 0,
              }}
            >
              71 patients (20.9%) drop off at comprehensive evaluation — missing
              baseline assessments for eye exam, foot exam, or depression
              screening.
            </p>
          </div>
          <div
            className="l2-card"
            style={{
              borderColor: "var(--perf-floor)",
              background: "var(--perf-floor-soft)",
            }}
          >
            <div
              style={{
                font: "500 10px var(--font-mono)",
                color: "var(--perf-floor)",
                textTransform: "uppercase",
                letterSpacing: ".05em",
                marginBottom: 6,
              }}
            >
              Second Largest Drop-Off
            </div>
            <div
              style={{
                font: "600 14px var(--font-sans)",
                color: "var(--fg-primary)",
                marginBottom: 4,
              }}
            >
              Step 5: Monitoring & Follow-up
            </div>
            <p
              style={{
                font: "400 11px/16px var(--font-sans)",
                color: "var(--fg-secondary)",
                margin: 0,
              }}
            >
              40 patients (18.3% of those reaching this step) miss timely HbA1c
              retesting or required follow-up visit.
            </p>
          </div>
        </div>
      </div>
    </S11Panel>
  );
}
export { L2AEvidenceChain, L2BCarePathway };
