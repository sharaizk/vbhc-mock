import React from "react";
import { Icons } from "../Icons/Icons";
import {
  S11_VERSIONS,
  S11_GRACE_PERIODS,
  S11_CONFLICTS,
} from "@/mock/guideline-adherence";
import { gradeColor, gradeSoft } from "@/utils/helpers";
const { useState: useS11L3State } = React;

function S11Overlay({ open, onClose, crumb, children, headerRight }) {
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
   L3-A  Guideline Version Management
   ══════════════════════════════════════════════════════════════════════════ */
function L3AVersionManagement({ open, onClose }) {
  const [expandedReq, setExpandedReq] = useS11L3State(null);
  const reqMappings = [
    {
      id: "ADA-2024-007",
      name: "Annual Depression Screening (PHQ-9)",
      original:
        "Providers should assess patients with diabetes for symptoms of depression using a validated questionnaire annually.",
      logic:
        "DENOMINATOR: T2DM patients with ≥1 encounter in period (n=340). NUMERATOR: Patients with documented PHQ-9 score within the measurement year (n=197). Compliance: 57.8%.",
      reasoning:
        "AiQL interpreted 'annually' as once within the 12-month measurement period. 'Validated questionnaire' operationalized as PHQ-9, which is mandated by ICHOM T2DM Set. AiQL cannot detect verbal depression screening — only documented PHQ-9 scores count.",
      capStatus: "Reviewed and approved — March 2025",
      limitations:
        "Documentation-dependent. Verbal screening at encounters not captured. Providers who screen verbally but don't document PHQ-9 score will appear non-compliant.",
    },
    {
      id: "ADA-2024-013",
      name: "Medication Intensification After Above-Target HbA1c",
      original:
        "If the individualized A1C target is not achieved after approximately 3 months of metformin monotherapy, treatment should be intensified with additional glucose-lowering agents.",
      logic:
        "DENOMINATOR: T2DM patients on metformin monotherapy with HbA1c > target for ≥90 days, no documented contraindication (n=148). NUMERATOR: New glucose-lowering agent prescribed within 90 days OR documented SDM note declining intensification (n=84). Compliance: 56.8%.",
      reasoning:
        "'Approximately 3 months' operationalized as exactly 90 days. SDM notes declining intensification count as compliant — this aligns with patient autonomy principles and was reviewed by the Clinical Advisory Panel.",
      capStatus: "Reviewed and approved — March 2025",
      limitations:
        "Cannot detect informal patient discussions not documented as SDM notes. Providers who discuss but don't document may appear non-compliant.",
    },
    {
      id: "ADA-2024-017",
      name: "Referral to Structured Weight Management Program",
      original:
        "For patients with BMI ≥30, referral to or participation in a structured weight management program is recommended.",
      logic:
        "DENOMINATOR: T2DM patients with most recent BMI ≥30 AND ≥1 encounter in period (n=196). NUMERATOR: Documented referral order to a structured weight management program (n=64). Compliance: 32.4%.",
      reasoning:
        "AiQL operationalizes 'referral' as a documented referral order in the EMR. Verbal recommendations or self-directed programs are not counted. 'Structured program' requires an external referral — in-clinic dietary counseling alone does not satisfy this requirement.",
      capStatus:
        "Pending clinical advisory review — operationalization may change",
      limitations:
        "Narrow operationalization. Many providers counsel patients informally or recommend community programs without creating a formal referral order. True compliance likely higher than 32.4%.",
    },
  ];

  return (
    <S11Overlay
      open={open}
      onClose={onClose}
      crumb={[
        "Dashboard",
        "Dr. Fatima Al-Khalil",
        "Guideline Adherence",
        "Version Management",
      ]}
    >
      <div
        style={{ padding: "28px 48px 48px", maxWidth: 1000, margin: "0 auto" }}
      >
        {/* Section 1 — Version timeline */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 1 — ADA Guideline Version History
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
            {S11_VERSIONS.map((v, i) => (
              <div
                key={v.version}
                style={{ position: "relative", marginBottom: 24 }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -20,
                    top: 6,
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background:
                      v.status === "active"
                        ? "var(--accent)"
                        : "var(--bg-elevated)",
                    border: "2px solid var(--accent)",
                  }}
                />
                <div
                  className="l2-card"
                  style={{
                    borderColor:
                      v.status === "active" ? "var(--accent)" : undefined,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <span
                        style={{
                          font: "600 13px var(--font-sans)",
                          color: "var(--fg-primary)",
                        }}
                      >
                        {v.version}
                      </span>
                      <span
                        style={{
                          font: "400 10px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                          marginLeft: 10,
                        }}
                      >
                        Ingested: {v.ingested}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span className="tag" style={{ fontSize: 9 }}>
                        {v.reqs} requirements
                      </span>
                      <span
                        style={{
                          font: "600 9px var(--font-mono)",
                          padding: "2px 8px",
                          borderRadius: 9999,
                          background:
                            v.status === "active"
                              ? "var(--accent-soft)"
                              : "var(--bg-elevated)",
                          color:
                            v.status === "active"
                              ? "var(--accent)"
                              : "var(--fg-tertiary)",
                          border: `.5px solid ${v.status === "active" ? "var(--accent)" : "var(--border-default)"}`,
                        }}
                      >
                        {v.status === "active" ? "● Active" : "Retired"}
                      </span>
                    </div>
                  </div>
                  {v.nextUpdate && (
                    <div
                      style={{
                        font: "400 10px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                        marginBottom: 10,
                      }}
                    >
                      Next expected update: {v.nextUpdate}
                    </div>
                  )}
                  {v.diff && (
                    <div>
                      <div
                        style={{
                          font: "500 9px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                          textTransform: "uppercase",
                          letterSpacing: ".06em",
                          marginBottom: 8,
                        }}
                      >
                        Changes from prior version:
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}
                      >
                        {v.diff.map((d) => {
                          const typeMap = {
                            added: [
                              "var(--perf-target)",
                              "var(--perf-target-soft)",
                              "ADDED",
                            ],
                            modified: [
                              "var(--accent)",
                              "var(--accent-soft)",
                              "MODIFIED",
                            ],
                            retired: [
                              "var(--perf-floor)",
                              "var(--perf-floor-soft)",
                              "RETIRED",
                            ],
                          };
                          const [c, cs, label] = typeMap[d.type] || [
                            "var(--fg-tertiary)",
                            "var(--bg-elevated)",
                            "CHANGED",
                          ];
                          return (
                            <div
                              key={d.id}
                              style={{
                                display: "flex",
                                gap: 10,
                                padding: "8px 10px",
                                background: cs,
                                borderRadius: 6,
                                border: `.5px solid ${c}`,
                              }}
                            >
                              <span
                                style={{
                                  font: "600 9px var(--font-mono)",
                                  color: c,
                                  width: 60,
                                  flexShrink: 0,
                                }}
                              >
                                {label}
                              </span>
                              <span
                                className="mono"
                                style={{
                                  color: c,
                                  fontSize: 9,
                                  width: 100,
                                  flexShrink: 0,
                                }}
                              >
                                {d.id}
                              </span>
                              {d.grade && (
                                <span
                                  style={{
                                    font: "700 9px var(--font-mono)",
                                    color: gradeColor(d.grade),
                                    background: gradeSoft(d.grade),
                                    padding: "1px 5px",
                                    borderRadius: 3,
                                    flexShrink: 0,
                                  }}
                                >
                                  {d.grade}
                                </span>
                              )}
                              <span
                                style={{
                                  font: "400 11px var(--font-sans)",
                                  color: "var(--fg-secondary)",
                                }}
                              >
                                {d.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 — Grace period */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 2 — Grace Period Configuration & Status
          </div>
          <div className="l2-card" style={{ marginBottom: 14 }}>
            {[
              [
                "New requirements (ADDED)",
                "6 months",
                "Not included in D5 composite score until grace period expires",
              ],
              [
                "Modified requirements (MODIFIED)",
                "3 months",
                "Old operationalization used until grace period expires",
              ],
              [
                "Retired requirements (RETIRED)",
                "None",
                "Removed from scoring immediately; historical scores preserved",
              ],
            ].map(([type, period, rule]) => (
              <div
                key={type}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "8px 0",
                  borderBottom: ".5px solid var(--border-default)",
                }}
              >
                <span
                  style={{
                    font: "600 11px var(--font-mono)",
                    color: "var(--fg-primary)",
                    width: 160,
                    flexShrink: 0,
                  }}
                >
                  {type}
                </span>
                <span
                  style={{
                    font: "600 11px var(--font-mono)",
                    color: "var(--accent)",
                    width: 80,
                    flexShrink: 0,
                  }}
                >
                  {period}
                </span>
                <span
                  style={{
                    font: "400 11px var(--font-sans)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {rule}
                </span>
              </div>
            ))}
          </div>
          <table className="l2-table">
            <thead>
              <tr>
                <th>Requirement</th>
                <th>Added</th>
                <th>Grace Expired</th>
                <th>Scoring Status</th>
              </tr>
            </thead>
            <tbody>
              {S11_GRACE_PERIODS.map((gp) => (
                <tr
                  key={gp.id}
                  style={{ background: "var(--perf-target-soft)" }}
                >
                  <td>
                    <span className="mono" style={{ fontSize: 10 }}>
                      {gp.id}
                    </span>{" "}
                    — {gp.name}
                  </td>
                  <td
                    style={{
                      font: "400 10px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                    }}
                  >
                    {gp.added}
                  </td>
                  <td
                    style={{
                      font: "400 10px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                    }}
                  >
                    {gp.expired}
                  </td>
                  <td
                    style={{
                      font: "600 11px var(--font-mono)",
                      color: "var(--perf-target)",
                    }}
                  >
                    ✓ Active — included in composite
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3 — Requirement mapping audit */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 3 — Requirement Mapping Audit (3 Key Requirements)
          </div>
          {reqMappings.map((req) => (
            <div key={req.id} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 16px",
                  background: "var(--bg-elevated)",
                  border: ".5px solid var(--border-default)",
                  borderRadius:
                    expandedReq === req.id ? "10px 10px 0 0" : "10px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  setExpandedReq(expandedReq === req.id ? null : req.id)
                }
              >
                <span className="mono" style={{ fontSize: 10 }}>
                  {req.id}
                </span>
                <span
                  style={{
                    font: "500 12px var(--font-sans)",
                    color: "var(--fg-primary)",
                    flex: 1,
                  }}
                >
                  {req.name}
                </span>
                <span
                  style={{
                    font: "500 9px var(--font-mono)",
                    color: req.capStatus.includes("Pending")
                      ? "var(--perf-below)"
                      : "var(--perf-target)",
                    padding: "2px 8px",
                    borderRadius: 9999,
                    border: `.5px solid currentColor`,
                  }}
                >
                  {req.capStatus.includes("Pending")
                    ? "⚠ Pending Review"
                    : "✓ CAP Approved"}
                </span>
                <span
                  style={{
                    color: "var(--fg-tertiary)",
                    fontSize: 11,
                    transform:
                      expandedReq === req.id ? "rotate(180deg)" : "none",
                    transition: "transform .2s",
                  }}
                >
                  ▼
                </span>
              </div>
              {expandedReq === req.id && (
                <div
                  style={{
                    border: ".5px solid var(--border-default)",
                    borderTop: 0,
                    borderRadius: "0 0 10px 10px",
                    padding: "14px 18px",
                    background: "var(--bg-surface)",
                  }}
                >
                  {[
                    ["Guideline Text", req.original, null],
                    ["AiQL Logic", req.logic, "var(--accent-soft)"],
                    ["Reasoning", req.reasoning, null],
                    [
                      "CAP Review",
                      req.capStatus,
                      req.capStatus.includes("Pending")
                        ? "var(--perf-below-soft)"
                        : "var(--perf-target-soft)",
                    ],
                    [
                      "Known Limitations",
                      req.limitations,
                      "oklch(97% .025 82)",
                    ],
                  ].map(([label, text, bg]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        gap: 14,
                        padding: "8px 0",
                        borderBottom: ".5px solid var(--border-default)",
                      }}
                    >
                      <span
                        style={{
                          font: "500 10px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                          textTransform: "uppercase",
                          letterSpacing: ".06em",
                          width: 110,
                          flexShrink: 0,
                        }}
                      >
                        {label}
                      </span>
                      <p
                        style={{
                          font: "400 11px/16px var(--font-sans)",
                          color: "var(--fg-secondary)",
                          margin: 0,
                          flex: 1,
                          background: bg,
                          padding: bg ? "6px 10px" : "0",
                          borderRadius: bg ? 6 : 0,
                        }}
                      >
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </S11Overlay>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L3-B  Cross-Guideline Conflict Detection
   ══════════════════════════════════════════════════════════════════════════ */
function L3BConflicts({ open, onClose, role }) {
  const [overrideOpen, setOverrideOpen] = useS11L3State(null);
  const conflicts = S11_CONFLICTS;
  const sevColor = (s) =>
    s === "high"
      ? "var(--perf-floor)"
      : s === "medium"
        ? "var(--perf-below)"
        : "oklch(62% .12 82)";
  const sevSoft = (s) =>
    s === "high"
      ? "var(--perf-floor-soft)"
      : s === "medium"
        ? "var(--perf-below-soft)"
        : "var(--accent-soft)";

  return (
    <S11Overlay
      open={open}
      onClose={onClose}
      crumb={[
        "Dashboard",
        "Dr. Fatima Al-Khalil",
        "Guideline Adherence",
        "Cross-Guideline Conflicts",
      ]}
      headerRight={
        <span
          style={{
            font: "500 10px var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".06em",
            background: "var(--bg-elevated)",
            padding: "4px 10px",
            borderRadius: 9999,
            border: ".5px solid var(--border-default)",
          }}
        >
          3 conflicts · 0 high · 2 medium · 1 low
        </span>
      }
    >
      <div
        style={{ padding: "28px 48px 48px", maxWidth: 1000, margin: "0 auto" }}
      >
        {/* Summary */}
        <div
          style={{
            padding: "12px 18px",
            background: "var(--bg-surface)",
            borderRadius: 10,
            border: ".5px solid var(--border-default)",
            marginBottom: 20,
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              font: "400 12px var(--font-sans)",
              color: "var(--fg-secondary)",
            }}
          >
            3 cross-guideline conflicts detected · 0 high severity · 2 medium ·
            1 low · All have active AiQL resolutions · No manual overrides
            applied
          </span>
        </div>

        {conflicts.map((cf) => (
          <div
            key={cf.id}
            className="card"
            style={{
              marginBottom: 16,
              padding: 0,
              overflow: "hidden",
              borderLeft: `4px solid ${sevColor(cf.severity)}`,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "14px 18px 12px",
                borderBottom: ".5px solid var(--border-default)",
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <span
                  style={{
                    font: "600 12px var(--font-sans)",
                    color: "var(--fg-primary)",
                  }}
                >
                  {cf.id} — Cross-Guideline Conflict
                </span>
                <span
                  style={{
                    font: "600 10px var(--font-mono)",
                    marginLeft: 12,
                    padding: "2px 8px",
                    borderRadius: 9999,
                    background: sevSoft(cf.severity),
                    color: sevColor(cf.severity),
                    border: `.5px solid ${sevColor(cf.severity)}`,
                  }}
                >
                  {cf.severity.toUpperCase()} SEVERITY
                </span>
              </div>
              {(role === "manager" || role === "compliance") && (
                <button
                  className="btn secondary"
                  style={{ fontSize: 10, padding: "4px 12px" }}
                  onClick={() => setOverrideOpen(cf.id)}
                >
                  Override Resolution
                </button>
              )}
            </div>

            <div style={{ padding: "14px 18px" }}>
              {/* Conflicting requirements */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  gap: 14,
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <div
                  className="l2-card"
                  style={{
                    borderColor: "var(--accent)",
                    background: "var(--accent-soft)",
                  }}
                >
                  <div
                    style={{
                      font: "500 9px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      marginBottom: 4,
                    }}
                  >
                    {cf.req1.source}
                  </div>
                  <span
                    className="mono"
                    style={{
                      color: "var(--accent)",
                      fontSize: 9,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    {cf.req1.id}
                  </span>
                  <p
                    style={{
                      font: "400 11px/16px var(--font-sans)",
                      color: "var(--fg-primary)",
                      margin: 0,
                    }}
                  >
                    {cf.req1.desc}
                  </p>
                </div>
                <div style={{ textAlign: "center" }}>
                  {/* Venn-style overlap indicator */}
                  <svg width={64} height={64} style={{ overflow: "visible" }}>
                    <circle
                      cx={22}
                      cy={32}
                      r={18}
                      fill="var(--accent)"
                      fillOpacity="0.2"
                      stroke="var(--accent)"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={42}
                      cy={32}
                      r={18}
                      fill="var(--perf-below)"
                      fillOpacity="0.2"
                      stroke="var(--perf-below)"
                      strokeWidth="1.5"
                    />
                    <text
                      x={32}
                      y={32}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="var(--fg-primary)"
                      style={{ font: "600 9px var(--font-sans)" }}
                    >
                      {cf.affected}
                    </text>
                    <text
                      x={32}
                      y={42}
                      textAnchor="middle"
                      fill="var(--fg-tertiary)"
                      style={{ font: "400 7px var(--font-mono)" }}
                    >
                      patients
                    </text>
                  </svg>
                  <div
                    style={{
                      font: "500 10px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      marginTop: 2,
                    }}
                  >
                    OVERLAP
                  </div>
                </div>
                <div
                  className="l2-card"
                  style={{
                    borderColor: "var(--perf-below)",
                    background: "var(--perf-below-soft)",
                  }}
                >
                  <div
                    style={{
                      font: "500 9px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      marginBottom: 4,
                    }}
                  >
                    {cf.req2.source}
                  </div>
                  <span
                    className="mono"
                    style={{
                      color: "var(--perf-below)",
                      fontSize: 9,
                      display: "block",
                      marginBottom: 4,
                    }}
                  >
                    {cf.req2.id}
                  </span>
                  <p
                    style={{
                      font: "400 11px/16px var(--font-sans)",
                      color: "var(--fg-primary)",
                      margin: 0,
                    }}
                  >
                    {cf.req2.desc}
                  </p>
                </div>
              </div>

              {/* Conflict description */}
              <div className="l2-section-title">Conflict</div>
              <div
                className="l2-card"
                style={{
                  marginBottom: 12,
                  borderColor: sevColor(cf.severity),
                  background: sevSoft(cf.severity),
                }}
              >
                <p
                  style={{
                    font: "400 12px/18px var(--font-sans)",
                    color: "var(--fg-primary)",
                    margin: 0,
                  }}
                >
                  {cf.conflict}
                </p>
              </div>

              {/* AiQL resolution */}
              <div className="l2-section-title">AiQL Resolution</div>
              <div
                className="l2-card"
                style={{
                  marginBottom: 8,
                  borderColor: "var(--perf-target)",
                  background: "var(--perf-target-soft)",
                }}
              >
                <p
                  style={{
                    font: "400 12px/18px var(--font-sans)",
                    color: "var(--fg-primary)",
                    margin: "0 0 8px",
                  }}
                >
                  {cf.resolution}
                </p>
                <p
                  style={{
                    font: "400 11px/16px var(--font-sans)",
                    color: "var(--fg-secondary)",
                    margin: 0,
                    fontStyle: "italic",
                  }}
                >
                  {cf.reasoning}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Override modal */}
        {overrideOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.4)",
              zIndex: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "var(--bg-surface)",
                borderRadius: 16,
                padding: 28,
                maxWidth: 480,
                width: "100%",
                boxShadow: "var(--shadow-popover)",
                border: ".5px solid var(--border-default)",
              }}
            >
              <h3
                style={{
                  font: "600 16px var(--font-sans)",
                  margin: "0 0 12px",
                }}
              >
                Override Conflict Resolution
              </h3>
              <p
                style={{
                  font: "400 12px/18px var(--font-sans)",
                  color: "var(--fg-secondary)",
                  margin: "0 0 16px",
                }}
              >
                You are overriding the AiQL resolution for conflict{" "}
                {overrideOpen}. This action is logged and cannot be undone
                without filing a new override. Mandatory justification required.
              </p>
              <textarea
                rows={4}
                placeholder="Provide mandatory justification for overriding the AiQL resolution (minimum 50 characters)…"
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: ".5px solid var(--border-default)",
                  background: "var(--bg-elevated)",
                  font: "400 12px var(--font-sans)",
                  color: "var(--fg-primary)",
                  resize: "vertical",
                }}
              />
              <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                <button
                  className="btn primary"
                  onClick={() => {
                    setOverrideOpen(null);
                    window.__toast &&
                      window.__toast(
                        "Override submitted — logged to audit trail.",
                      );
                  }}
                >
                  Submit Override
                </button>
                <button
                  className="btn secondary"
                  onClick={() => setOverrideOpen(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </S11Overlay>
  );
}

export { L3AVersionManagement, L3BConflicts };
