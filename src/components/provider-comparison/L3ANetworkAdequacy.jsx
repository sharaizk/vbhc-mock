import {
  S12_PROVIDERS,
  S12_NETWORK_ADEQUACY,
  S12_BENEFIT_DESIGN
} from "@/mock/provider-comparison";
import React from "react";
import { SteerageDonut } from "./Charts";
import { Icons } from "../Icons/Icons";
const { useState: useS12TL3State } = React;

function S12TOverlay({ open, onClose, crumb, children, headerRight }) {
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
   L3-A  Network Adequacy Analysis
   ══════════════════════════════════════════════════════════════════════════ */
function L3ANetworkAdequacy({ open, onClose }) {
  const [removeProvider, setRemoveProvider] = useS12TL3State("P09");

  const statusColor = (s) =>
    s === "ok"
      ? "var(--perf-target)"
      : s === "marginal"
        ? "var(--perf-below)"
        : "var(--perf-floor)";
  const statusSoft = (s) =>
    s === "ok"
      ? "var(--perf-target-soft)"
      : s === "marginal"
        ? "var(--perf-below-soft)"
        : "var(--perf-floor-soft)";
  const statusLabel = (s) =>
    s === "ok"
      ? "✓ Within Standard"
      : s === "marginal"
        ? "⚠ Marginal"
        : "🔴 Critical";

  const removeSim = S12_PROVIDERS.find((p) => p.id === removeProvider);
  const removeSims = {
    P09: {
      impact:
        "AFHO Dhahran loses its only Family Medicine provider. 410 attributed members would need reassignment to PSMMC Riyadh (+80km) or KFAFH Jeddah (+1,200km). Network adequacy standard would be violated for this region.",
      rec: "Do not remove. Initiate CAP/PIP to improve performance before considering network action.",
    },
    P10: {
      impact:
        "AFHSR Khamis Mushait retains Dr. Ahmed (also Tier 3). 380 members would be redistributed. Facility remains below adequacy with only 1 provider for ~470 combined members.",
      rec: "Removal would further weaken an already critical facility. Recruit an additional provider before any network action.",
    },
    P01: {
      impact:
        "PSMMC Riyadh loses its Tier 1 Endocrinology provider. 340 attributed diabetic patients would need reassignment. Tier 1 representation at PSMMC Riyadh would drop from 2 to 1 provider.",
      rec: "Tier 1 provider removal would significantly impact network quality metrics. Not recommended.",
    },
  };
  const currentSim = removeSims[removeProvider] || {
    impact: "Impact analysis not available for this provider.",
    rec: "Assess case-by-case.",
  };

  return (
    <S12TOverlay
      open={open}
      onClose={onClose}
      crumb={["Network Tiering", "Network Adequacy Analysis"]}
    >
      <div
        style={{ padding: "28px 48px 48px", maxWidth: 1100, margin: "0 auto" }}
      >
        {/* Section 1 */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 1 — Provider-to-Member Ratios by Specialty & Geography
          </div>
          <div style={{ overflowX: "auto" }}>
            <table className="l2-table">
              <thead>
                <tr>
                  <th>Specialty</th>
                  <th>Facility / Region</th>
                  <th style={{ textAlign: "center" }}>T1 Providers</th>
                  <th style={{ textAlign: "center" }}>T2+ Providers</th>
                  <th style={{ textAlign: "center" }}>Total</th>
                  <th style={{ textAlign: "right" }}>Members</th>
                  <th style={{ textAlign: "center" }}>Ratio</th>
                  <th style={{ textAlign: "center" }}>Standard</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {S12_NETWORK_ADEQUACY.map((row, i) => {
                  const sc = statusColor(row.status);
                  const ss = statusSoft(row.status);
                  return (
                    <tr
                      key={i}
                      style={{
                        background: row.status !== "ok" ? ss : "transparent",
                      }}
                    >
                      <td style={{ font: "500 12px var(--font-sans)" }}>
                        {row.specialty}
                      </td>
                      <td
                        style={{
                          font: "400 11px var(--font-sans)",
                          color: "var(--fg-secondary)",
                        }}
                      >
                        {row.facility}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          font: "600 12px var(--font-mono)",
                          color: "var(--accent)",
                        }}
                      >
                        {row.t1}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          font: "600 12px var(--font-mono)",
                          color: "var(--perf-target)",
                        }}
                      >
                        {row.t2plus}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          font: "600 12px var(--font-mono)",
                        }}
                      >
                        {row.total}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          font: "500 11px var(--font-mono)",
                          color: "var(--fg-secondary)",
                        }}
                      >
                        {row.members.toLocaleString()}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          font: "700 11px var(--font-mono)",
                          color: sc,
                        }}
                      >
                        {row.ratio}
                      </td>
                      <td
                        style={{
                          textAlign: "center",
                          font: "400 10px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                        }}
                      >
                        {row.standard}
                      </td>
                      <td>
                        <span
                          style={{
                            font: "500 9px var(--font-mono)",
                            color: sc,
                            background: ss,
                            padding: "2px 8px",
                            borderRadius: 9999,
                            border: `.5px solid ${sc}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {statusLabel(row.status)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2 */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 2 — Removal Impact Modelling
          </div>
          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                font: "500 10px var(--font-mono)",
                color: "var(--fg-tertiary)",
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Simulate removing:
            </span>
            <select
              value={removeProvider}
              onChange={(e) => setRemoveProvider(e.target.value)}
              style={{
                padding: "7px 12px",
                borderRadius: 9999,
                border: ".5px solid var(--border-default)",
                background: "var(--bg-elevated)",
                font: "400 13px var(--font-sans)",
                color: "var(--fg-primary)",
              }}
            >
              {S12_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Tier {p.tier}, {p.facility})
                </option>
              ))}
            </select>
          </div>
          {removeSim && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
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
                    letterSpacing: ".06em",
                    marginBottom: 6,
                  }}
                >
                  Impact Assessment
                </div>
                <p
                  style={{
                    font: "400 12px/18px var(--font-sans)",
                    color: "var(--fg-primary)",
                    margin: 0,
                  }}
                >
                  {currentSim.impact}
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
                    font: "500 10px var(--font-mono)",
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    marginBottom: 6,
                  }}
                >
                  Recommendation
                </div>
                <p
                  style={{
                    font: "400 12px/18px var(--font-sans)",
                    color: "var(--fg-primary)",
                    margin: 0,
                  }}
                >
                  {currentSim.rec}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Section 3 */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 3 — Recruitment Targets
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                facility: "AFHSR Khamis Mushait",
                sev: "critical",
                note: "CRITICAL — recruit 1 Tier 1 or Tier 2 provider (any primary care specialty). Both current providers are Tier 3.",
              },
              {
                facility: "KFAFH Jeddah",
                sev: "moderate",
                note: "MODERATE — no Tier 1 providers. Target: develop existing Tier 2 providers toward Tier 1 eligibility, or recruit 1 experienced Tier 1 provider.",
              },
              {
                facility: "AFHO Dhahran",
                sev: "moderate",
                note: "MODERATE — Tier 3 Family Medicine provider. CAP/PIP pathway preferred over recruitment.",
              },
            ].map((t) => {
              const c =
                t.sev === "critical"
                  ? "var(--perf-floor)"
                  : "var(--perf-below)";
              const cs =
                t.sev === "critical"
                  ? "var(--perf-floor-soft)"
                  : "var(--perf-below-soft)";
              return (
                <div
                  key={t.facility}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "12px 16px",
                    borderRadius: 8,
                    background: cs,
                    border: `.5px solid ${c}`,
                  }}
                >
                  <span
                    style={{
                      font: "600 11px var(--font-sans)",
                      color: c,
                      width: 180,
                      flexShrink: 0,
                    }}
                  >
                    {t.facility}
                  </span>
                  <span
                    style={{
                      font: "400 12px/18px var(--font-sans)",
                      color: "var(--fg-primary)",
                    }}
                  >
                    {t.note}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </S12TOverlay>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L3-B  Benefit Design Integration
   ══════════════════════════════════════════════════════════════════════════ */
function L3BBenefitDesign({ open, onClose }) {
  const tierColors = [
    "var(--accent)",
    "var(--perf-target)",
    "var(--perf-below)",
    "var(--fg-tertiary)",
  ];

  return (
    <S12TOverlay
      open={open}
      onClose={onClose}
      crumb={["Network Tiering", "Benefit Design Integration"]}
    >
      <div
        style={{ padding: "28px 48px 48px", maxWidth: 960, margin: "0 auto" }}
      >
        {/* Section 1 */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 1 — Copay & Coinsurance by Tier
          </div>
          <table className="l2-table">
            <thead>
              <tr>
                <th>Tier</th>
                <th style={{ textAlign: "right" }}>Copay (SAR)</th>
                <th style={{ textAlign: "right" }}>Coinsurance</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {S12_BENEFIT_DESIGN.map((bd, i) => (
                <tr key={bd.tier}>
                  <td>
                    <span
                      style={{
                        font: "600 11px var(--font-mono)",
                        color: tierColors[i],
                        background: tierColors[i] + "18",
                        padding: "2px 9px",
                        borderRadius: 9999,
                        border: `.5px solid ${tierColors[i]}`,
                      }}
                    >
                      {bd.tier}
                    </span>
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      font: "700 13px var(--font-mono)",
                      color: tierColors[i],
                    }}
                  >
                    SAR {bd.copay}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      font: "600 12px var(--font-mono)",
                    }}
                  >
                    {bd.coinsurance}%
                  </td>
                  <td
                    style={{
                      font: "400 11px var(--font-sans)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {bd.tier === "Tier 1"
                      ? "Preferred access — highest quality, lowest member cost"
                      : bd.tier === "Tier 2"
                        ? "Standard access — meets expectations"
                        : bd.tier === "Tier 3"
                          ? "Non-preferred — below expectations, higher member cost"
                          : "Out-of-network coverage only in exceptional circumstances"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2 */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 2 — Member Steerage Analysis
          </div>
          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <SteerageDonut data={S12_BENEFIT_DESIGN} size={180} />
            <div style={{ flex: 1, minWidth: 240 }}>
              {S12_BENEFIT_DESIGN.filter((d) => d.memberPct > 0).map(
                (bd, i) => (
                  <div
                    key={bd.tier}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        background: tierColors[i],
                        opacity: 0.8,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{ font: "500 11px var(--font-sans)", flex: 1 }}
                    >
                      {bd.tier}
                    </span>
                    <span
                      style={{
                        font: "600 11px var(--font-mono)",
                        color: tierColors[i],
                      }}
                    >
                      {bd.memberPct}%
                    </span>
                    <span
                      style={{
                        font: "400 10px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                        width: 80,
                        textAlign: "right",
                      }}
                    >
                      SAR {(bd.cost / 1000000).toFixed(1)}M
                    </span>
                  </div>
                ),
              )}
              <div
                style={{
                  marginTop: 12,
                  padding: "10px 14px",
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
                  <strong>Steerage effectiveness: 80.5%</strong> of members are
                  seeing Tier 1 or Tier 2 providers. Target: 85%.
                </p>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div className="l2-section-title">Per-Member Cost Comparison</div>
              {S12_BENEFIT_DESIGN.filter((d) => d.memberPct > 0).map(
                (bd, i) => (
                  <div
                    key={bd.tier}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        font: "500 10px var(--font-sans)",
                        color: tierColors[i],
                        width: 50,
                        flexShrink: 0,
                      }}
                    >
                      {bd.tier.split(" ").pop()}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: 18,
                        background: "var(--bg-elevated)",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: (bd.costPerMember / 30000) * 100 + "%",
                          height: "100%",
                          background: tierColors[i],
                          opacity: 0.75,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        font: "600 11px var(--font-mono)",
                        color: tierColors[i],
                        width: 56,
                      }}
                    >
                      SAR {(bd.costPerMember / 1000).toFixed(0)}k
                    </span>
                  </div>
                ),
              )}
              <p
                style={{
                  font: "400 10px/14px var(--font-sans)",
                  color: "var(--fg-secondary)",
                  margin: "8px 0 0",
                }}
              >
                Members seeing Tier 1 providers cost 26% less per member than
                those seeing Tier 3 providers.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 3 — Projected Financial Impact of Tier Changes
          </div>
          <div
            className="l2-card"
            style={{
              borderColor: "var(--perf-target)",
              background: "var(--perf-target-soft)",
            }}
          >
            <div
              style={{
                font: "600 13px var(--font-sans)",
                color: "var(--fg-primary)",
                marginBottom: 12,
              }}
            >
              Impact of Dr. Khalid Al-Mutairi Tier 3 → Tier 2 Upgrade
            </div>
            <div className="metric-row">
              {[
                {
                  label: "Members Affected",
                  val: "290",
                  sub: "now at Tier 2 copay (SAR 100 vs SAR 200)",
                },
                {
                  label: "Member Savings",
                  val: "−SAR 145,000",
                  sub: "annually (members pay less)",
                  c: "var(--perf-target)",
                },
                {
                  label: "Plan Cost Increase",
                  val: "+SAR 87,000",
                  sub: "plan absorbs more cost",
                  c: "var(--perf-below)",
                },
                {
                  label: "Net Value",
                  val: "Positive",
                  sub: "Better outcomes at lower total cost",
                  c: "var(--accent)",
                },
              ].map((x) => (
                <div key={x.label} className="metric-box" style={{ flex: 1 }}>
                  <div className="m-label">{x.label}</div>
                  <div
                    className="m-val"
                    style={{ color: x.c || "var(--fg-primary)", fontSize: 14 }}
                  >
                    {x.val}
                  </div>
                  <div className="m-sub">{x.sub}</div>
                </div>
              ))}
            </div>
            <p
              style={{
                font: "400 11px/16px var(--font-sans)",
                color: "var(--fg-secondary)",
                margin: "12px 0 0",
              }}
            >
              Tier 2 providers deliver better outcomes at lower total cost. The
              increased plan expense is offset by reduced complications and
              readmissions — Tier 2 composite score of 76 vs Tier 3 average of
              61 represents meaningful quality improvement.
            </p>
          </div>
        </div>
      </div>
    </S12TOverlay>
  );
}

export { L3ANetworkAdequacy, L3BBenefitDesign };
