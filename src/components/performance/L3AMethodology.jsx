import { S8B_METHODOLOGY } from "@/mock/s8b-data";
import React from "react";
import { FullOverlay } from "./FullOverlay";
const { useState: useL3aState, useMemo: useL3aMemo } = React;

function L3AMethodology({ open, onClose, measure }) {
  const [tab, setTab] = useL3aState("spec");
  const m = S8B_METHODOLOGY;

  const tabs = [
    { id: "spec", label: "Measure Specification" },
    { id: "denom", label: "Min. Denominator" },
    { id: "ci", label: "Confidence Intervals" },
    { id: "trunc", label: "Truncation & Winsorization" },
    { id: "history", label: "Version History" },
  ];

  if (!open) return null;

  return (
    <FullOverlay
      open={open}
      onClose={onClose}
      crumb={[
        "Dashboard",
        "Statistical Methodology",
        measure ? measure.name : "D1-001",
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
          L3-A · {m.id}
        </span>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: ".5px solid var(--border-default)",
            background: "var(--bg-surface)",
            padding: "0 28px",
            flexShrink: 0,
            overflowX: "auto",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              className={"l2-tab" + (tab === t.id ? " active" : "")}
              onClick={() => setTab(t.id)}
              style={{ whiteSpace: "nowrap" }}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Tab body */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "28px 48px 48px",
            maxWidth: 960,
            width: "100%",
          }}
        >
          {/* ── Tab 1: Measure Specification ── */}
          {tab === "spec" && (
            <div>
              <div style={{ marginBottom: 28 }}>
                <div
                  style={{
                    font: "500 10px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    letterSpacing: ".08em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Measure Identity
                </div>
                <h2
                  style={{
                    font: "600 22px/28px var(--font-sans)",
                    margin: "0 0 6px",
                    letterSpacing: "-.01em",
                  }}
                >
                  {m.id} — {m.name}
                </h2>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <span className="tag">{m.steward}</span>
                  <span className="tag">{m.nqfId}</span>
                  <span className="tag">v2.0 · Effective Jan 2025</span>
                </div>
              </div>

              <div className="l2-section">
                <div className="l2-section-title">Evidence Base</div>
                <div className="l2-card">
                  <p
                    style={{
                      font: "400 13px/22px var(--font-sans)",
                      color: "var(--fg-primary)",
                      margin: 0,
                    }}
                  >
                    {m.evidenceBase}
                  </p>
                </div>
              </div>

              <div className="l2-section">
                <div className="l2-section-title">Intended Population</div>
                <div className="l2-card">
                  <p
                    style={{
                      font: "400 13px/22px var(--font-sans)",
                      color: "var(--fg-primary)",
                      margin: 0,
                    }}
                  >
                    {m.intendedPopulation}
                  </p>
                </div>
              </div>

              <div className="l2-section">
                <div className="l2-section-title">Numerator Definition</div>
                <div
                  className="l2-card"
                  style={{ borderLeft: "3px solid var(--perf-target)" }}
                >
                  <p
                    style={{
                      font: "400 13px/22px var(--font-sans)",
                      color: "var(--fg-primary)",
                      margin: 0,
                    }}
                  >
                    {m.numeratorDef}
                  </p>
                </div>
              </div>

              <div className="l2-section">
                <div className="l2-section-title">Denominator Definition</div>
                <div
                  className="l2-card"
                  style={{ borderLeft: "3px solid var(--accent)" }}
                >
                  <p
                    style={{
                      font: "400 13px/22px var(--font-sans)",
                      color: "var(--fg-primary)",
                      margin: 0,
                    }}
                  >
                    {m.denominatorDef}
                  </p>
                </div>
              </div>

              <div className="l2-section">
                <div className="l2-section-title">Exclusion Criteria</div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {m.exclusions.map((ex) => (
                    <div
                      key={ex.n}
                      className="l2-card"
                      style={{ display: "flex", gap: 14 }}
                    >
                      <span
                        style={{
                          font: "700 13px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {ex.n}.
                      </span>
                      <div>
                        <p
                          style={{
                            font: "400 13px/20px var(--font-sans)",
                            color: "var(--fg-primary)",
                            margin: "0 0 4px",
                          }}
                        >
                          {ex.text}
                        </p>
                        <code
                          style={{
                            font: "500 11px var(--font-mono)",
                            color: "var(--accent)",
                            background: "var(--accent-soft)",
                            padding: "2px 8px",
                            borderRadius: 4,
                          }}
                        >
                          {ex.logic}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="l2-section">
                <div className="l2-section-title">
                  Data Element Requirements
                </div>
                <table className="l2-table">
                  <thead>
                    <tr>
                      <th>Data Element</th>
                      <th>Source System</th>
                      <th>Required Format</th>
                      <th>Acceptable Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.dataElements.map((d) => (
                      <tr key={d.name}>
                        <td style={{ font: "500 12px var(--font-sans)" }}>
                          {d.name}
                        </td>
                        <td>
                          <span className="mono">{d.source}</span>
                        </td>
                        <td>
                          <span className="mono">{d.format}</span>
                        </td>
                        <td>
                          <span className="mono">{d.range}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="l2-section">
                <div className="l2-section-title">
                  Risk Adjustment Methodology
                </div>
                <div className="metric-row" style={{ marginBottom: 14 }}>
                  {[
                    { label: "Model Type", val: m.riskAdjModel.type },
                    { label: "C-Statistic", val: m.riskAdjModel.cStatistic },
                    { label: "H-L p-value", val: m.riskAdjModel.hlPValue },
                    {
                      label: "Calibration Slope",
                      val: m.riskAdjModel.calibrationSlope,
                    },
                  ].map((x) => (
                    <div key={x.label} className="metric-box">
                      <div className="m-label">{x.label}</div>
                      <div className="m-val" style={{ fontSize: 15 }}>
                        {x.val}
                      </div>
                    </div>
                  ))}
                </div>
                <table className="l2-table">
                  <thead>
                    <tr>
                      <th>Covariate</th>
                      <th>Coefficient</th>
                      <th>Odds Ratio</th>
                      <th>95% CI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.riskAdjModel.coefficients.map((c) => (
                      <tr key={c.covariate}>
                        <td style={{ font: "500 12px var(--font-sans)" }}>
                          {c.covariate}
                        </td>
                        <td>
                          <span
                            style={{
                              font: "600 11px var(--font-mono)",
                              color:
                                c.coeff > 0
                                  ? "var(--perf-floor)"
                                  : "var(--perf-target)",
                            }}
                          >
                            {c.coeff > 0 ? "+" : ""}
                            {c.coeff}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              font: "600 11px var(--font-mono)",
                              color: "var(--fg-primary)",
                            }}
                          >
                            {c.or}
                          </span>
                        </td>
                        <td>
                          <span className="mono">{c.ci95}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Tab 2: Min. Denominator ── */}
          {tab === "denom" && (
            <div>
              <div className="metric-row" style={{ marginBottom: 24 }}>
                <div className="metric-box">
                  <div className="m-label">Minimum Required</div>
                  <div className="m-val">{m.minDenominator}</div>
                  <div className="m-sub">
                    patients for statistical reliability
                  </div>
                </div>
                <div
                  className="metric-box"
                  style={{
                    borderColor: "var(--perf-target)",
                    background: "var(--perf-target-soft)",
                  }}
                >
                  <div className="m-label">Current (Dr. Al-Khalil)</div>
                  <div
                    className="m-val"
                    style={{ color: "var(--perf-target)" }}
                  >
                    340
                  </div>
                  <div className="m-sub">Well above minimum</div>
                </div>
                <div className="metric-box">
                  <div className="m-label">Reliability Coefficient</div>
                  <div className="m-val">0.93</div>
                  <div className="m-sub">Signal-to-noise ratio ≥ 0.70 ✓</div>
                </div>
              </div>

              <div className="l2-section">
                <div className="l2-section-title">Reliability Calculation</div>
                <div className="l2-card">
                  <p
                    style={{
                      font: "400 12px/20px var(--font-sans)",
                      color: "var(--fg-secondary)",
                      margin: "0 0 10px",
                    }}
                  >
                    Reliability = σ²_between / (σ²_between + σ²_within / n),
                    where n = denominator size. Scores with reliability &lt;
                    0.70 are flagged and excluded from composite calculation.
                    Dr. Al-Khalil's denominator of 340 yields reliability
                    coefficient 0.93 — well above the 0.70 threshold.
                  </p>
                </div>
              </div>

              <div className="l2-section">
                <div className="l2-section-title">
                  All Providers — Denominator for {m.id}
                </div>
                <table className="l2-table">
                  <thead>
                    <tr>
                      <th>Provider</th>
                      <th>Denominator</th>
                      <th>Minimum Met?</th>
                      <th>Reliability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.providerDenominators.map((p) => (
                      <tr
                        key={p.id}
                        style={{
                          background: p.below
                            ? "var(--perf-floor-soft)"
                            : "transparent",
                        }}
                      >
                        <td style={{ font: "500 12px var(--font-sans)" }}>
                          {p.name}
                        </td>
                        <td
                          style={{
                            font: "600 12px var(--font-mono)",
                            color: p.below
                              ? "var(--perf-floor)"
                              : "var(--fg-primary)",
                          }}
                        >
                          {p.den}
                        </td>
                        <td>
                          {p.below ? (
                            <span
                              style={{
                                font: "500 10px var(--font-mono)",
                                color: "var(--perf-floor)",
                                background: "var(--perf-floor-soft)",
                                padding: "2px 8px",
                                borderRadius: 4,
                                border: ".5px solid var(--perf-floor)",
                              }}
                            >
                              BELOW MINIMUM
                            </span>
                          ) : (
                            <span
                              style={{
                                font: "500 10px var(--font-mono)",
                                color: "var(--perf-target)",
                              }}
                            >
                              ✓ Met
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            font: "500 11px var(--font-mono)",
                            color: p.below
                              ? "var(--perf-floor)"
                              : "var(--fg-secondary)",
                          }}
                        >
                          {p.below
                            ? "N/A — excluded"
                            : (0.6 + Math.min(0.39, p.den / 1000)).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div
                  style={{
                    marginTop: 12,
                    padding: "10px 14px",
                    background: "var(--perf-below-soft)",
                    borderRadius: 8,
                    border: ".5px solid var(--perf-below)",
                  }}
                >
                  <p
                    style={{
                      font: "500 12px var(--font-sans)",
                      color: "var(--perf-below)",
                      margin: 0,
                    }}
                  >
                    ⚠ Dr. Khalid Al-Mutairi (P04): denominator 28 is below
                    minimum of 30. Score excluded from composite and flagged in
                    settlement report.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 3: Confidence Intervals ── */}
          {tab === "ci" && (
            <div>
              <div className="l2-section">
                <div className="l2-section-title">Method</div>
                <div className="l2-card">
                  <p
                    style={{
                      font: "600 13px var(--font-sans)",
                      color: "var(--fg-primary)",
                      margin: "0 0 4px",
                    }}
                  >
                    {m.ci.method}
                  </p>
                  <p
                    style={{
                      font: "400 12px/18px var(--font-sans)",
                      color: "var(--fg-secondary)",
                      margin: 0,
                    }}
                  >
                    Applied to proportions. Preferred over Wald interval for
                    bounded data; maintains nominal coverage even for extreme
                    proportions near 0 or 1.
                  </p>
                </div>
              </div>

              <div className="metric-row">
                <div className="metric-box">
                  <div className="m-label">Point Estimate</div>
                  <div className="m-val" style={{ color: "var(--accent)" }}>
                    {m.ci.pointEstimate}%
                  </div>
                </div>
                <div className="metric-box">
                  <div className="m-label">95% CI Lower</div>
                  <div className="m-val">{m.ci.ciLow}%</div>
                </div>
                <div className="metric-box">
                  <div className="m-label">95% CI Upper</div>
                  <div className="m-val">{m.ci.ciHigh}%</div>
                </div>
                <div
                  className="metric-box"
                  style={{
                    borderColor: "var(--perf-target)",
                    background: "var(--perf-target-soft)",
                  }}
                >
                  <div className="m-label">Contract Target</div>
                  <div
                    className="m-val"
                    style={{ color: "var(--perf-target)" }}
                  >
                    {m.ci.target}%
                  </div>
                </div>
              </div>

              <div className="l2-section" style={{ marginTop: 20 }}>
                <div className="l2-section-title">
                  CI Visualization — Provider vs Network vs Peer Group
                </div>
                <div className="l2-card">
                  <p
                    style={{
                      font: "400 11px/16px var(--font-sans)",
                      color: "var(--fg-secondary)",
                      margin: "0 0 18px",
                    }}
                  >
                    {m.ci.significance}
                  </p>
                  {[
                    {
                      label: "This Provider",
                      lo: m.ci.ciLow,
                      hi: m.ci.ciHigh,
                      pt: m.ci.pointEstimate,
                      color: "var(--accent)",
                    },
                    {
                      label: "Network Mean",
                      lo: m.ci.networkMean.lo,
                      hi: m.ci.networkMean.hi,
                      pt: m.ci.networkMean.est,
                      color: "var(--fg-secondary)",
                    },
                    {
                      label: "Peer Group Mean",
                      lo: m.ci.peerMean.lo,
                      hi: m.ci.peerMean.hi,
                      pt: m.ci.peerMean.est,
                      color: "var(--perf-target)",
                    },
                  ].map((row, i) => {
                    const minVal = 55,
                      maxVal = 90,
                      range = maxVal - minVal;
                    const pctLo = ((row.lo - minVal) / range) * 100;
                    const pctHi = ((row.hi - minVal) / range) * 100;
                    const pctPt = ((row.pt - minVal) / range) * 100;
                    const pctTgt = ((m.ci.target - minVal) / range) * 100;
                    return (
                      <div key={i} style={{ marginBottom: 18 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              font: "500 11px var(--font-sans)",
                              color: row.color,
                              width: 120,
                            }}
                          >
                            {row.label}
                          </span>
                          <span
                            style={{
                              font: "600 12px var(--font-mono)",
                              color: "var(--fg-primary)",
                              width: 60,
                            }}
                          >
                            {row.pt}%
                          </span>
                          <span
                            style={{
                              font: "400 11px var(--font-mono)",
                              color: "var(--fg-tertiary)",
                            }}
                          >
                            [{row.lo}% – {row.hi}%]
                          </span>
                        </div>
                        <div
                          style={{
                            position: "relative",
                            height: 14,
                            background: "var(--bg-elevated)",
                            borderRadius: 7,
                            border: ".5px solid var(--border-default)",
                          }}
                        >
                          {/* CI band */}
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              bottom: 0,
                              left: pctLo + "%",
                              width: pctHi - pctLo + "%",
                              background: row.color,
                              opacity: 0.25,
                              borderRadius: 7,
                            }}
                          />
                          {/* Point estimate */}
                          <div
                            style={{
                              position: "absolute",
                              top: -3,
                              bottom: -3,
                              left: `calc(${pctPt}% - 2px)`,
                              width: 4,
                              background: row.color,
                              borderRadius: 2,
                            }}
                          />
                          {/* Target line */}
                          <div
                            style={{
                              position: "absolute",
                              top: -4,
                              bottom: -4,
                              left: `calc(${pctTgt}% - 1px)`,
                              width: 2,
                              background: "var(--perf-target)",
                              borderRadius: 1,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 3,
                          background: "var(--perf-target)",
                          borderRadius: 1,
                        }}
                      />
                      <span
                        style={{
                          font: "500 10px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                        }}
                      >
                        Target: {m.ci.target}%
                      </span>
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 10,
                          background: "var(--accent)",
                          opacity: 0.25,
                          borderRadius: 2,
                        }}
                      />
                      <span
                        style={{
                          font: "500 10px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                        }}
                      >
                        95% Confidence Band
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 4: Truncation & Winsorization ── */}
          {tab === "trunc" && (
            <div>
              <div className="l2-section">
                <div className="l2-section-title">Current Rules</div>
                <div className="l2-card">
                  <p
                    style={{
                      font: "400 13px/20px var(--font-sans)",
                      color: "var(--fg-primary)",
                      margin: "0 0 8px",
                    }}
                  >
                    Scores below the{" "}
                    <strong>
                      5th percentile (p5 = {m.truncation.p5value}%)
                    </strong>{" "}
                    are winsorized to the p5 value. Scores above the{" "}
                    <strong>
                      95th percentile (p95 = {m.truncation.p95value}%)
                    </strong>{" "}
                    are capped at the actual value — no upper truncation
                    applied. Winsorization prevents extreme low performers from
                    distorting network means while preserving upper-end genuine
                    performance signals.
                  </p>
                </div>
              </div>
              <div className="l2-section">
                <div className="l2-section-title">Impact on This Provider</div>
                <div
                  className="l2-card"
                  style={{
                    borderColor: "var(--perf-target)",
                    background: "var(--perf-target-soft)",
                  }}
                >
                  <p
                    style={{
                      font: "500 12px var(--font-sans)",
                      color: "var(--perf-target)",
                      margin: 0,
                    }}
                  >
                    ✓ Not affected. Dr. Al-Khalil's score{" "}
                    {m.truncation.currentScore}% is within the p5–p95 range [
                    {m.truncation.p5value}%–{m.truncation.p95value}%]. No
                    truncation or winsorization applied.
                  </p>
                </div>
              </div>
              <div className="l2-section">
                <div className="l2-section-title">
                  Network Score Distribution for {m.id}
                </div>
                <div className="l2-card" style={{ overflowX: "auto" }}>
                  <NetworkDistChart
                    scores={m.truncation.networkScores}
                    p5={m.truncation.p5value}
                    p95={m.truncation.p95value}
                    current={m.truncation.currentScore}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Tab 5: Version History ── */}
          {tab === "history" && (
            <div>
              <div className="l2-section">
                <div className="l2-section-title">
                  Specification Version Timeline
                </div>
                <div style={{ position: "relative", paddingLeft: 28 }}>
                  <div
                    style={{
                      position: "absolute",
                      left: 10,
                      top: 0,
                      bottom: 0,
                      width: 1,
                      background: "var(--border-default)",
                    }}
                  />
                  {m.versionHistory.map((v, i) => (
                    <div
                      key={v.version}
                      style={{
                        position: "relative",
                        marginBottom: 28,
                        paddingLeft: 8,
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: -24,
                          top: 4,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background:
                            i === m.versionHistory.length - 1
                              ? "var(--accent)"
                              : "var(--bg-elevated)",
                          border: "2px solid var(--accent)",
                        }}
                      />
                      <div className="l2-card">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            gap: 12,
                            marginBottom: 8,
                          }}
                        >
                          <div>
                            <span
                              style={{
                                font: "600 13px var(--font-mono)",
                                color: "var(--fg-primary)",
                              }}
                            >
                              {v.version}
                            </span>
                            <span
                              style={{
                                font: "400 11px var(--font-sans)",
                                color: "var(--fg-tertiary)",
                                marginLeft: 10,
                              }}
                            >
                              {v.date}
                            </span>
                          </div>
                          <span
                            style={{
                              font: "500 10px var(--font-mono)",
                              color: "var(--fg-tertiary)",
                              background: "var(--bg-elevated)",
                              padding: "3px 9px",
                              borderRadius: 9999,
                              border: ".5px solid var(--border-default)",
                              flexShrink: 0,
                            }}
                          >
                            by {v.changedBy}
                          </span>
                        </div>
                        <p
                          style={{
                            font: "400 12px/18px var(--font-sans)",
                            color: "var(--fg-primary)",
                            margin: "0 0 8px",
                          }}
                        >
                          {v.summary}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            alignItems: "center",
                          }}
                        >
                          <span
                            style={{
                              font: "500 10px var(--font-mono)",
                              color: "var(--fg-tertiary)",
                              textTransform: "uppercase",
                              letterSpacing: ".05em",
                            }}
                          >
                            Impact:
                          </span>
                          <span
                            style={{
                              font: "400 11px var(--font-sans)",
                              color: "var(--fg-secondary)",
                            }}
                          >
                            {v.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </FullOverlay>
  );
}

/* ── Mini network distribution chart (Tab 4) ─────────────────────────────── */
function NetworkDistChart({ scores, p5, p95, current }) {
  const bins = [];
  for (let s = 50; s <= 95; s += 5) {
    bins.push({
      lo: s,
      hi: s + 4,
      count: scores.filter((x) => x >= s && x < s + 5).length,
    });
  }
  const maxCount = Math.max(...bins.map((b) => b.count), 1);
  const W = 500,
    H = 100,
    padL = 8,
    padB = 20;
  const bw = (W - padL) / bins.length - 2;

  return (
    <svg width={W + 60} height={H + padB + 10} style={{ overflow: "visible" }}>
      <defs>
        <marker
          id="nh-arrow"
          viewBox="0 0 8 6"
          refX="7"
          refY="3"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M0,0 L8,3 L0,6Z" fill="var(--accent)" />
        </marker>
      </defs>
      {bins.map((b, i) => {
        const x = padL + i * ((W - padL) / bins.length);
        const bh = (b.count / maxCount) * H;
        const by = H - bh;
        const inP5 = b.lo < p5;
        const inP95 = b.hi > p95;
        const isCurrent = current >= b.lo && current <= b.hi + 1;
        return (
          <g key={b.lo}>
            <rect
              x={x}
              y={by}
              width={Math.max(bw, 2)}
              height={bh}
              rx="2"
              fill={
                isCurrent
                  ? "var(--accent)"
                  : inP5
                    ? "var(--perf-floor)"
                    : "var(--bg-muted)"
              }
              stroke="var(--border-default)"
              strokeWidth="0.5"
              fillOpacity={inP5 || inP95 ? 0.5 : 1}
            />
            <text
              x={x + bw / 2}
              y={H + padB}
              textAnchor="middle"
              fill="var(--fg-tertiary)"
              style={{ font: "500 7px var(--font-mono)" }}
            >
              {b.lo}
            </text>
          </g>
        );
      })}
      {/* p5 line */}
      {[
        { val: p5, label: `p5: ${p5}%`, color: "var(--perf-floor)" },
        { val: p95, label: `p95: ${p95}%`, color: "var(--perf-target)" },
      ].map((l) => {
        const x = padL + ((l.val - 50) / 50) * (W - padL);
        return (
          <g key={l.label}>
            <line
              x1={x}
              y1={0}
              x2={x}
              y2={H}
              stroke={l.color}
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            <text
              x={x + 3}
              y={12}
              fill={l.color}
              style={{ font: "500 8px var(--font-mono)" }}
            >
              {l.label}
            </text>
          </g>
        );
      })}
      {/* Current provider marker */}
      {(() => {
        const cx = padL + ((current - 50) / 50) * (W - padL);
        return (
          <g>
            <line
              x1={cx}
              y1={-10}
              x2={cx}
              y2={H}
              stroke="var(--accent)"
              strokeWidth="2"
              markerEnd="url(#nh-arrow)"
            />
            <text
              x={cx + 4}
              y={-2}
              fill="var(--accent)"
              style={{ font: "600 9px var(--font-mono)" }}
            >
              {current}%
            </text>
          </g>
        );
      })()}
    </svg>
  );
}

export default L3AMethodology;
