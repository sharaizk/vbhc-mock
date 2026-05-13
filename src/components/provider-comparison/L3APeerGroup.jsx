import {
  S12_HOMOGENEITY,
  S12_PROVIDERS,
  S12_PEER_SCENARIOS,
  S12_COLORS,
  S12_STAT_MATRIX,
  S12_SHRINKAGE,
} from "@/mock/provider-comparison";
import React from "react";
import { FunnelPlot } from "./Charts";
import { Icons } from "../Icons/Icons";
const { useState: useS12L3CState, useMemo: useS12L3CMemo } = React;

function S12Overlay({ open, onClose, crumb, children, headerRight }) {
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
   L3-A  Peer Group Definition & Validation
   ══════════════════════════════════════════════════════════════════════════ */
function L3APeerGroup({ open, onClose }) {
  const [customFilters, setCustomFilters] = useS12L3CState({
    tier: "All",
    minPanel: 150,
    maxPanel: 550,
    specialty: "All",
  });
  const [customSelected, setCustomSelected] = useS12L3CState(
    S12_PROVIDERS.map((p) => p.id),
  );

  const customMatched = useS12L3CMemo(
    () =>
      S12_PROVIDERS.filter((p) => {
        if (
          customFilters.tier !== "All" &&
          p.tier !== parseInt(customFilters.tier)
        )
          return false;
        if (
          customFilters.specialty !== "All" &&
          p.specialty !== customFilters.specialty
        )
          return false;
        if (
          p.panel < customFilters.minPanel ||
          p.panel > customFilters.maxPanel
        )
          return false;
        return true;
      }),
    [customFilters],
  );

  const specialties = [...new Set(S12_PROVIDERS.map((p) => p.specialty))];
  const homogeneityColor = (s) =>
    s === "ok" ? "var(--perf-target)" : "var(--perf-floor)";
  const homogeneitySoft = (s) =>
    s === "ok" ? "var(--perf-target-soft)" : "var(--perf-floor-soft)";

  return (
    <S12Overlay
      open={open}
      onClose={onClose}
      crumb={["Provider Comparison", "Peer Group Validation"]}
    >
      <div
        style={{ padding: "28px 48px 48px", maxWidth: 1000, margin: "0 auto" }}
      >
        {/* Section 1 */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 1 — Current Peer Group Definition
          </div>
          <div className="l2-card" style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {[
                [
                  "Peer group type",
                  "Same contract (all providers in Contract 1)",
                ],
                ["Additional filters", "None applied"],
                ["Resulting peer group", "10 providers"],
                [
                  "Specialties",
                  "Family Medicine (3), Internal Medicine (2), Endocrinology (1), Cardiology (1), Psychiatry (1), Orthopedics (1), OB/GYN (1)",
                ],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 12 }}>
                  <span
                    style={{
                      font: "500 10px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      width: 140,
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
            </div>
          </div>
          <div
            style={{
              padding: "10px 14px",
              background: "var(--perf-below-soft)",
              borderRadius: 8,
              border: ".5px solid var(--perf-below)",
            }}
          >
            <p
              style={{
                font: "400 11px/16px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: 0,
              }}
            >
              ⚠ This peer group includes multiple specialties. Cross-specialty
              comparison introduces case-mix variability that risk adjustment
              may not fully capture. Consider defining specialty-specific peer
              groups for more precise comparison.
            </p>
          </div>
        </div>

        {/* Section 2 */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 2 — Peer Group Homogeneity Assessment
          </div>
          <table className="l2-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Min</th>
                <th>Max</th>
                <th>CV (%)</th>
                <th>Assessment</th>
              </tr>
            </thead>
            <tbody>
              {S12_HOMOGENEITY.map((h) => (
                <tr
                  key={h.variable}
                  style={{
                    background:
                      h.status === "high"
                        ? "var(--perf-floor-soft)"
                        : "transparent",
                  }}
                >
                  <td style={{ font: "500 12px var(--font-sans)" }}>
                    {h.variable}
                  </td>
                  <td style={{ font: "500 11px var(--font-mono)" }}>{h.min}</td>
                  <td style={{ font: "500 11px var(--font-mono)" }}>{h.max}</td>
                  <td
                    style={{
                      font: "700 11px var(--font-mono)",
                      color: homogeneityColor(h.status),
                    }}
                  >
                    {h.cv}%
                  </td>
                  <td>
                    <span
                      style={{
                        font: "500 10px var(--font-mono)",
                        color: homogeneityColor(h.status),
                        background: homogeneitySoft(h.status),
                        padding: "2px 8px",
                        borderRadius: 9999,
                        border: `.5px solid ${homogeneityColor(h.status)}`,
                      }}
                    >
                      {h.status === "high" ? "⚠ HIGH" : "✓ OK"}
                    </span>
                    <span
                      style={{
                        font: "400 10px var(--font-sans)",
                        color: "var(--fg-secondary)",
                        marginLeft: 8,
                      }}
                    >
                      {h.note}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3 */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 3 — Peer Group Sensitivity Analysis
          </div>
          <table className="l2-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Peer Group Size</th>
                <th>Dr. Fatima Rank</th>
                <th>Dr. Omar Rank</th>
                <th>Dr. Nour Rank</th>
                <th>Dr. Khalid Rank</th>
              </tr>
            </thead>
            <tbody>
              {S12_PEER_SCENARIOS.map((s, i) => (
                <tr
                  key={s.label}
                  style={{
                    background: i === 0 ? "var(--accent-soft)" : "transparent",
                    fontWeight: i === 0 ? 600 : 400,
                  }}
                >
                  <td
                    style={{
                      font: "400 11px var(--font-sans)",
                      color: "var(--fg-primary)",
                    }}
                  >
                    {s.label}
                  </td>
                  <td
                    style={{
                      font: "600 11px var(--font-mono)",
                      color: "var(--fg-secondary)",
                      textAlign: "center",
                    }}
                  >
                    {s.size}
                  </td>
                  {["P01", "P02", "P03", "P04"].map((pid) => (
                    <td
                      key={pid}
                      style={{
                        textAlign: "center",
                        font: "600 11px var(--font-mono)",
                        color: s.rankings[pid]
                          ? "var(--accent)"
                          : "var(--fg-tertiary)",
                      }}
                    >
                      {s.rankings[pid] ? `#${s.rankings[pid]}` : "N/A"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4 */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 4 — Custom Peer Group Builder
          </div>
          <div className="l2-card">
            <div
              style={{
                display: "flex",
                gap: 14,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
              {[
                ["Tier", "tier", ["All", "1", "2", "3"]],
                ["Specialty", "specialty", ["All", ...specialties.slice(0, 5)]],
              ].map(([label, key, opts]) => (
                <div key={key}>
                  <div
                    style={{
                      font: "500 9px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  <select
                    value={customFilters[key]}
                    onChange={(e) =>
                      setCustomFilters((f) => ({ ...f, [key]: e.target.value }))
                    }
                    style={{
                      padding: "6px 10px",
                      borderRadius: 9999,
                      border: ".5px solid var(--border-default)",
                      background: "var(--bg-elevated)",
                      font: "400 12px var(--font-sans)",
                    }}
                  >
                    {opts.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div>
                <div
                  style={{
                    font: "500 9px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                    marginBottom: 4,
                  }}
                >
                  Panel Size Range
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    type="range"
                    min={150}
                    max={550}
                    value={customFilters.minPanel}
                    onChange={(e) =>
                      setCustomFilters((f) => ({
                        ...f,
                        minPanel: parseInt(e.target.value),
                      }))
                    }
                    style={{ width: 80, accentColor: "var(--accent)" }}
                  />
                  <span
                    style={{
                      font: "500 10px var(--font-mono)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {customFilters.minPanel}–{customFilters.maxPanel}
                  </span>
                  <input
                    type="range"
                    min={150}
                    max={550}
                    value={customFilters.maxPanel}
                    onChange={(e) =>
                      setCustomFilters((f) => ({
                        ...f,
                        maxPanel: parseInt(e.target.value),
                      }))
                    }
                    style={{ width: 80, accentColor: "var(--accent)" }}
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                font: "500 10px var(--font-mono)",
                color: "var(--fg-tertiary)",
                marginBottom: 8,
              }}
            >
              {customMatched.length} providers match ·{" "}
              <span style={{ color: "var(--accent)" }}>
                {customMatched.map((p) => p.name.split(" ")[2]).join(", ")}
              </span>
            </div>
            <button
              className="btn primary"
              style={{ fontSize: 11 }}
              onClick={() =>
                window.__toast &&
                window.__toast(
                  `Custom peer group applied: ${customMatched.length} providers selected.`,
                )
              }
            >
              Apply Peer Group
            </button>
          </div>
        </div>
      </div>
    </S12Overlay>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L3-B  Statistical Significance Testing
   ══════════════════════════════════════════════════════════════════════════ */
function L3BStats({ open, onClose }) {
  const compProviders = ["P01", "P02", "P03", "P04"];
  const provNames = { P01: "Fatima", P02: "Omar", P03: "Nour", P04: "Khalid" };

  function getTest(p1, p2) {
    const t = S12_STAT_MATRIX.find(
      (x) => (x.p1 === p1 && x.p2 === p2) || (x.p1 === p2 && x.p2 === p1),
    );
    return t || null;
  }

  const effectColors = {
    large: "var(--perf-floor)",
    moderate: "var(--perf-below)",
    small: "var(--fg-tertiary)",
    negligible: "var(--fg-tertiary)",
  };

  return (
    <S12Overlay
      open={open}
      onClose={onClose}
      crumb={["Provider Comparison", "Statistical Significance Testing"]}
    >
      <div
        style={{ padding: "28px 48px 48px", maxWidth: 1000, margin: "0 auto" }}
      >
        {/* Section 1 — Pairwise matrix */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 1 — Pairwise Comparison Matrix (4 Selected Providers)
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "10px 14px",
                      font: "500 10px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      width: 80,
                    }}
                  />
                  {compProviders.map((pid) => (
                    <th
                      key={pid}
                      style={{
                        padding: "10px 14px",
                        font: "500 11px var(--font-sans)",
                        color: S12_COLORS[pid],
                        minWidth: 120,
                        textAlign: "center",
                      }}
                    >
                      Dr. {provNames[pid]}
                      <br />
                      <span style={{ font: "700 13px var(--font-sans)" }}>
                        {S12_PROVIDERS.find((p) => p.id === pid)?.composite}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compProviders.map((p1) => (
                  <tr key={p1}>
                    <td
                      style={{
                        padding: "10px 14px",
                        font: "500 11px var(--font-sans)",
                        color: S12_COLORS[p1],
                        borderRight: ".5px solid var(--border-default)",
                      }}
                    >
                      Dr. {provNames[p1]}
                      <br />
                      <span style={{ font: "700 13px var(--font-sans)" }}>
                        {S12_PROVIDERS.find((p) => p.id === p1)?.composite}
                      </span>
                    </td>
                    {compProviders.map((p2) => {
                      if (p1 === p2)
                        return (
                          <td
                            key={p2}
                            style={{
                              background: "var(--bg-elevated)",
                              borderRight: ".5px solid var(--border-default)",
                              width: 120,
                              height: 60,
                            }}
                          />
                        );
                      const test = getTest(p1, p2);
                      if (!test)
                        return (
                          <td
                            key={p2}
                            style={{
                              borderRight: ".5px solid var(--border-default)",
                            }}
                          />
                        );
                      const isSig = test.sig;
                      return (
                        <td
                          key={p2}
                          style={{
                            padding: "8px 12px",
                            textAlign: "center",
                            background: isSig
                              ? "var(--perf-target-soft)"
                              : "var(--bg-elevated)",
                            borderRight: ".5px solid var(--border-default)",
                          }}
                        >
                          <div
                            style={{
                              font: "700 13px var(--font-sans)",
                              color: isSig
                                ? "var(--perf-target)"
                                : "var(--fg-tertiary)",
                            }}
                          >
                            Δ{test.delta}
                          </div>
                          <div
                            style={{
                              font: "500 9px var(--font-mono)",
                              color: isSig
                                ? "var(--perf-target)"
                                : "var(--fg-tertiary)",
                            }}
                          >
                            p={test.p}
                          </div>
                          <div
                            style={{
                              font: "500 9px var(--font-mono)",
                              color: effectColors[test.effect],
                            }}
                          >
                            {test.effect}
                          </div>
                          <div
                            style={{
                              font: "600 9px var(--font-mono)",
                              color: isSig
                                ? "var(--perf-target)"
                                : "var(--perf-floor)",
                            }}
                          >
                            {isSig ? "✓ SIG" : "✗ NS"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "10px 14px",
              background: "var(--perf-below-soft)",
              borderRadius: 8,
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
              <strong>Key finding:</strong> The 6-point difference between Dr.
              Omar (84) and Dr. Nour (78) is NOT statistically significant
              (p=0.08). These two providers cannot be reliably distinguished on
              current data. Assigning them to different tiers based on this
              difference alone would not be defensible.
            </p>
          </div>
        </div>

        {/* Section 2 — Funnel plot */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 2 — Funnel Plot (All 20 Providers)
          </div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            <FunnelPlot providers={S12_PROVIDERS} width={520} height={280} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <div
              style={{
                flex: 1,
                padding: "10px 14px",
                background: "var(--perf-target-soft)",
                borderRadius: 8,
                border: ".5px solid var(--perf-target)",
              }}
            >
              <p
                style={{
                  font: "400 11px/16px var(--font-sans)",
                  color: "var(--fg-primary)",
                  margin: 0,
                }}
              >
                <strong>Dr. Fatima Al-Khalil</strong> (composite 92, panel 340)
                is above the upper 99.7% control limit — genuinely exceptional
                performance.
              </p>
            </div>
            <div
              style={{
                flex: 1,
                padding: "10px 14px",
                background: "var(--perf-floor-soft)",
                borderRadius: 8,
                border: ".5px solid var(--perf-floor)",
              }}
            >
              <p
                style={{
                  font: "400 11px/16px var(--font-sans)",
                  color: "var(--fg-primary)",
                  margin: 0,
                }}
              >
                <strong>Dr. Youssef Al-Ghamdi</strong> (composite 55, panel 380)
                is below the lower 99.7% limit — genuinely poor performance.{" "}
                <strong>Dr. Layla Al-Qahtani</strong> (70, panel 195) is inside
                the funnel despite below-target score — small panel,
                insufficient statistical power.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 — Shrinkage */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 3 — Small-Sample Shrinkage Estimation
          </div>
          <table className="l2-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th style={{ textAlign: "right" }}>Panel</th>
                <th style={{ textAlign: "right" }}>Raw Score</th>
                <th style={{ textAlign: "right" }}>Shrinkage-Adjusted</th>
                <th style={{ textAlign: "right" }}>Shrinkage Δ</th>
                <th>Rank Impact</th>
              </tr>
            </thead>
            <tbody>
              {S12_SHRINKAGE.map((s) => {
                const color = S12_COLORS[s.pid] || "var(--fg-tertiary)";
                const bigAdj = Math.abs(s.delta) >= 2;
                return (
                  <tr
                    key={s.pid}
                    style={{
                      background: bigAdj ? "var(--accent-soft)" : "transparent",
                    }}
                  >
                    <td style={{ font: "500 12px var(--font-sans)", color }}>
                      {s.name}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        font: "500 11px var(--font-mono)",
                        color:
                          s.panel < 300
                            ? "var(--perf-below)"
                            : "var(--fg-secondary)",
                      }}
                    >
                      {s.panel}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        font: "600 11px var(--font-mono)",
                      }}
                    >
                      {s.raw}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        font: "700 11px var(--font-mono)",
                        color: "var(--accent)",
                      }}
                    >
                      {s.shrunk}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        font: "600 11px var(--font-mono)",
                        color:
                          s.delta >= 0
                            ? "var(--perf-target)"
                            : "var(--perf-floor)",
                      }}
                    >
                      {s.delta >= 0 ? "+" : ""}
                      {s.delta}
                    </td>
                    <td
                      style={{
                        font: "500 10px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                      }}
                    >
                      {s.rankChange}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p
            style={{
              font: "400 11px/16px var(--font-sans)",
              color: "var(--fg-secondary)",
              margin: "10px 14px 0",
            }}
          >
            Shrinkage estimation pulls small-panel scores toward the network
            mean, reflecting uncertainty. For panels &gt;300, the adjustment is
            negligible (&lt;0.5pp). For Dr. Layla (195 patients), the adjustment
            adds 2.4 points.
          </p>
        </div>
      </div>
    </S12Overlay>
  );
}

export { L3APeerGroup, L3BStats };
