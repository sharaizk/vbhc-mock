import {
  S12_PROVIDERS,
  S12_TIER_MOVEMENTS,
  S12_TIER_HISTORY,
  S12_FACILITIES,
} from "@/mock/provider-comparison";
import React from "react";
const { useState: useS12TState, useMemo: useS12TMemo } = React;

/* ── Tier color helpers ───────────────────────────────────────────────────── */
const tc = (t) =>
  t === 1
    ? "var(--accent)"
    : t === 2
      ? "var(--perf-target)"
      : t === 3
        ? "var(--perf-below)"
        : "var(--fg-tertiary)";
const tcs = (t) =>
  t === 1
    ? "var(--accent-soft)"
    : t === 2
      ? "var(--perf-target-soft)"
      : t === 3
        ? "var(--perf-below-soft)"
        : "var(--bg-elevated)";

/* ── Tier Distribution Bar ───────────────────────────────────────────────── */
function TierDistBar({ providers }) {
  const byTier = {
    1: providers.filter((p) => p.tier === 1),
    2: providers.filter((p) => p.tier === 2),
    3: providers.filter((p) => p.tier === 3),
  };
  const n = providers.length;
  return (
    <div>
      <div
        style={{
          display: "flex",
          height: 40,
          borderRadius: 8,
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        {[1, 2, 3].map((tier) => {
          const pct = (byTier[tier].length / n) * 100;
          return (
            <div
              key={tier}
              style={{
                flex: byTier[tier].length,
                background: tc(tier),
                opacity: 0.8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 40,
              }}
            >
              <span
                style={{ font: "700 11px var(--font-sans)", color: "white" }}
              >
                T{tier}: {byTier[tier].length}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        {[1, 2, 3].map((tier) => (
          <div
            key={tier}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: tc(tier),
                opacity: 0.8,
              }}
            />
            <span
              style={{
                font: "500 10px var(--font-mono)",
                color: "var(--fg-secondary)",
              }}
            >
              Tier {tier}: {byTier[tier].length} (
              {((byTier[tier].length / n) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Specialty × Tier Heatmap ────────────────────────────────────────────── */
function SpecialtyTierHeatmap({ providers }) {
  const specs = [...new Set(providers.map((p) => p.specialty))];
  function count(spec, tier) {
    return providers.filter((p) => p.specialty === spec && p.tier === tier)
      .length;
  }
  return (
    <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 11 }}>
      <thead>
        <tr>
          <th
            style={{
              padding: "6px 10px",
              textAlign: "left",
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Specialty
          </th>
          {[1, 2, 3].map((t) => (
            <th
              key={t}
              style={{
                padding: "6px 14px",
                textAlign: "center",
                font: "500 9px var(--font-mono)",
                color: tc(t),
                textTransform: "uppercase",
                letterSpacing: ".06em",
                minWidth: 60,
              }}
            >
              Tier {t}
            </th>
          ))}
          <th
            style={{
              padding: "6px 10px",
              textAlign: "center",
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Alert
          </th>
        </tr>
      </thead>
      <tbody>
        {specs.map((spec) => {
          const t1 = count(spec, 1),
            t2 = count(spec, 2),
            t3 = count(spec, 3);
          const noTier1 = t1 === 0;
          return (
            <tr
              key={spec}
              style={{
                borderBottom: ".5px solid var(--border-default)",
                background:
                  noTier1 && t2 + t3 > 1
                    ? "var(--perf-below-soft)"
                    : "transparent",
              }}
            >
              <td
                style={{
                  padding: "7px 10px",
                  font: "400 12px var(--font-sans)",
                  color: "var(--fg-secondary)",
                }}
              >
                {spec}
              </td>
              {[t1, t2, t3].map((c, i) => (
                <td
                  key={i}
                  style={{ textAlign: "center", padding: "7px 10px" }}
                >
                  {c > 0 ? (
                    <span
                      style={{
                        display: "inline-flex",
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: tc(i + 1),
                        color: "white",
                        alignItems: "center",
                        justifyContent: "center",
                        font: "700 11px var(--font-sans)",
                        opacity: 0.8,
                      }}
                    >
                      {c}
                    </span>
                  ) : (
                    <span
                      style={{
                        color: "var(--fg-tertiary)",
                        font: "400 11px var(--font-mono)",
                      }}
                    >
                      —
                    </span>
                  )}
                </td>
              ))}
              <td style={{ textAlign: "center", padding: "4px 10px" }}>
                {noTier1 && t2 + t3 >= 1 && (
                  <span
                    style={{
                      font: "500 9px var(--font-mono)",
                      color: "var(--perf-below)",
                      background: "var(--perf-below-soft)",
                      padding: "2px 7px",
                      borderRadius: 9999,
                      border: ".5px solid var(--perf-below)",
                    }}
                  >
                    No T1
                  </span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/* ── Facility Cards ──────────────────────────────────────────────────────── */
function FacilityCards({ providers, onSelectProvider }) {
  const statusColor = (s) =>
    s === "strong"
      ? "var(--perf-target)"
      : s === "amber"
        ? "var(--perf-below)"
        : "var(--perf-floor)";
  const statusLabel = (s) =>
    s === "strong" ? "✓ Strong" : s === "amber" ? "⚠ No Tier 1" : "🔴 Critical";
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {S12_FACILITIES.map((fac) => {
        const facProvs = providers.filter((p) => fac.providers.includes(p.id));
        const tierCounts = {
          1: facProvs.filter((p) => p.tier === 1).length,
          2: facProvs.filter((p) => p.tier === 2).length,
          3: facProvs.filter((p) => p.tier === 3).length,
        };
        const sc = statusColor(fac.status);
        return (
          <div
            key={fac.name}
            className="card"
            style={{
              flex: "1 1 180px",
              padding: "14px 16px",
              borderLeft: `4px solid ${sc}`,
              minWidth: 160,
            }}
          >
            <div
              style={{
                font: "600 11px var(--font-sans)",
                color: "var(--fg-primary)",
                marginBottom: 4,
              }}
            >
              {fac.name}
            </div>
            <div
              style={{
                font: "400 10px var(--font-mono)",
                color: "var(--fg-tertiary)",
                marginBottom: 8,
              }}
            >
              {fac.region}
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              {facProvs.map((p) => (
                <span
                  key={p.id}
                  title={p.name}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: tc(p.tier),
                    display: "grid",
                    placeItems: "center",
                    font: "700 9px var(--font-sans)",
                    color: "white",
                    cursor: "pointer",
                    opacity: 0.8,
                  }}
                  onClick={() => onSelectProvider(p)}
                >
                  {p.tier}
                </span>
              ))}
            </div>
            <span
              style={{
                font: "600 10px var(--font-mono)",
                color: sc,
                background: sc + "18",
                padding: "3px 8px",
                borderRadius: 9999,
                border: `.5px solid ${sc}`,
              }}
            >
              {statusLabel(fac.status)}
            </span>
            {fac.status === "critical" && (
              <p
                style={{
                  font: "400 9px var(--font-sans)",
                  color: "var(--perf-floor)",
                  margin: "6px 0 0",
                }}
              >
                CRITICAL: All providers Tier 3. No high-performing provider
                available.
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Tier Movement Summary ───────────────────────────────────────────────── */
function TierMovementSummary() {
  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        {[
          { label: "Upgrades", val: 1, c: "var(--perf-target)" },
          { label: "Downgrades", val: 0, c: "var(--perf-floor)" },
          { label: "Maintained", val: 9, c: "var(--fg-tertiary)" },
        ].map((x) => (
          <div key={x.label} className="metric-box" style={{ flex: 1 }}>
            <div className="m-label">{x.label}</div>
            <div className="m-val" style={{ color: x.c }}>
              {x.val}
            </div>
          </div>
        ))}
      </div>
      {S12_TIER_MOVEMENTS.map((m) => (
        <div
          key={m.pid}
          style={{
            padding: "10px 14px",
            background: "var(--perf-target-soft)",
            borderRadius: 8,
            border: ".5px solid var(--perf-target)",
            marginBottom: 8,
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span
              style={{
                font: "500 12px var(--font-sans)",
                color: "var(--fg-primary)",
                flex: 1,
              }}
            >
              {m.name}
            </span>
            <span
              style={{
                font: "600 10px var(--font-mono)",
                color: "var(--perf-below)",
                background: "var(--perf-below-soft)",
                padding: "2px 8px",
                borderRadius: 9999,
              }}
            >
              {m.from}
            </span>
            <span style={{ color: "var(--perf-target)" }}>→</span>
            <span
              style={{
                font: "600 10px var(--font-mono)",
                color: "var(--perf-target)",
                background: "var(--perf-target-soft)",
                padding: "2px 8px",
                borderRadius: 9999,
              }}
            >
              {m.to}
            </span>
            <span
              style={{
                font: "400 10px var(--font-mono)",
                color: "var(--fg-tertiary)",
              }}
            >
              {m.period}
            </span>
          </div>
          <div
            style={{
              font: "400 10px var(--font-sans)",
              color: "var(--fg-secondary)",
              marginTop: 4,
            }}
          >
            {m.reason}
          </div>
        </div>
      ))}
      {/* Historical area chart */}
      <div className="l2-section-title" style={{ marginTop: 12 }}>
        Historical Tier Distribution (4 Periods)
      </div>
      <div style={{ overflowX: "auto" }}>
        <svg width={360} height={80} style={{ overflow: "visible" }}>
          {S12_TIER_HISTORY.map((h, i) => {
            const x = 40 + i * 80,
              total = h.t1 + h.t2 + h.t3;
            const h1 = (h.t1 / total) * 60,
              h2 = (h.t2 / total) * 60,
              h3 = (h.t3 / total) * 60;
            let y = 10;
            return (
              <g key={h.period}>
                {[
                  { h: h1, c: "var(--accent)" },
                  { h: h2, c: "var(--perf-target)" },
                  { h: h3, c: "var(--perf-below)" },
                ].map((seg, si) => (
                  <rect
                    key={si}
                    x={x - 20}
                    y={y + (si === 0 ? 0 : si === 1 ? h1 : h1 + h2)}
                    width={40}
                    height={seg.h}
                    fill={seg.c}
                    opacity={0.7}
                  />
                ))}
                <text
                  x={x}
                  y={76}
                  textAnchor="middle"
                  fill="var(--fg-tertiary)"
                  style={{ font: "500 8px var(--font-mono)" }}
                >
                  {h.period.replace(" 2025", "")}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/* ── L2-A: Tier Assignment Engine ────────────────────────────────────────── */
function L2ATierEngine({ visible }) {
  const [tier1Threshold, setTier1Threshold] = useS12TState(85);
  const [tier2Lower, setTier2Lower] = useS12TState(70);
  const [confirmOpen, setConfirmOpen] = useS12TState(false);

  const simulated = useS12TMemo(() => {
    const t1 = S12_PROVIDERS.filter((p) => p.composite >= tier1Threshold);
    const t2 = S12_PROVIDERS.filter(
      (p) => p.composite >= tier2Lower && p.composite < tier1Threshold,
    );
    const t3 = S12_PROVIDERS.filter((p) => p.composite < tier2Lower);
    const changes = S12_PROVIDERS.filter((p) => {
      const simTier =
        p.composite >= tier1Threshold ? 1 : p.composite >= tier2Lower ? 2 : 3;
      return simTier !== p.tier;
    });
    return { t1, t2, t3, changes };
  }, [tier1Threshold, tier2Lower]);

  if (!visible) return null;

  return (
    <div className="card" style={{ padding: 20, marginTop: 12 }}>
      <div
        style={{
          font: "600 14px var(--font-sans)",
          color: "var(--fg-primary)",
          marginBottom: 16,
        }}
      >
        L2-A: Tier Assignment Engine
      </div>

      {/* Criteria bar */}
      <div className="l2-section-title">
        Primary Criterion — Composite Score Thresholds
      </div>
      <div style={{ marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            height: 32,
            borderRadius: 8,
            overflow: "hidden",
            width: "100%",
            marginBottom: 6,
          }}
        >
          {[
            {
              label: "Tier 3 (<" + tier2Lower + ")",
              flex: tier2Lower,
              c: "var(--perf-below)",
            },
            {
              label: "Tier 2 (" + tier2Lower + "–" + tier1Threshold + ")",
              flex: tier1Threshold - tier2Lower,
              c: "var(--perf-target)",
            },
            {
              label: "Tier 1 (≥" + tier1Threshold + ")",
              flex: 100 - tier1Threshold,
              c: "var(--accent)",
            },
          ].map((seg) => (
            <div
              key={seg.label}
              style={{
                flex: seg.flex,
                background: seg.c,
                opacity: 0.8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  font: "500 9px var(--font-sans)",
                  color: "white",
                  textAlign: "center",
                }}
              >
                {seg.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mandatory criteria */}
      <div className="l2-section-title">Mandatory Criteria</div>
      <div className="l2-card" style={{ marginBottom: 14 }}>
        {[
          [
            "Tier 1 eligibility",
            "Zero never events in measurement period",
            "var(--perf-target)",
          ],
          [
            "Tier 1 eligibility",
            "PROMs collection completeness ≥70%",
            "var(--perf-target)",
          ],
          [
            "Tier 1 eligibility",
            "No active unresolved CAP/PIP",
            "var(--perf-target)",
          ],
          [
            "Tier 1 eligibility",
            "Data quality score ≥80%",
            "var(--perf-target)",
          ],
          ["Tier 2 minimum", "Zero never events", "var(--perf-target)"],
          [
            "Tier 2 minimum",
            "PROMs collection completeness ≥50%",
            "var(--perf-target)",
          ],
        ].map(([tier, crit, c]) => (
          <div
            key={crit}
            style={{
              display: "flex",
              gap: 10,
              padding: "5px 0",
              borderBottom: ".5px solid var(--border-default)",
            }}
          >
            <span
              style={{
                font: "500 9px var(--font-mono)",
                color: c,
                width: 110,
                flexShrink: 0,
              }}
            >
              {tier}
            </span>
            <span
              style={{
                font: "400 11px var(--font-sans)",
                color: "var(--fg-primary)",
              }}
            >
              {crit}
            </span>
            <span
              style={{
                marginLeft: "auto",
                font: "600 10px var(--font-mono)",
                color: "var(--perf-target)",
              }}
            >
              ✓ Met by eligible providers
            </span>
          </div>
        ))}
      </div>

      {/* Simulation mode */}
      <div className="l2-section-title">Simulation Mode</div>
      <div className="l2-card">
        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 14,
          }}
        >
          {[
            ["Tier 1 Threshold", tier1Threshold, 75, 95, setTier1Threshold],
            ["Tier 2 Lower Bound", tier2Lower, 55, 80, setTier2Lower],
          ].map(([label, val, min, max, setter]) => (
            <div key={label} style={{ flex: "1 1 200px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
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
                  {label}
                </span>
                <span
                  style={{
                    font: "700 14px var(--font-sans)",
                    color: "var(--accent)",
                  }}
                >
                  {val}
                </span>
              </div>
              <input
                type="range"
                min={min}
                max={max}
                value={val}
                onChange={(e) => setter(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "var(--accent)" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  font: "400 8px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                }}
              >
                <span>{min}</span>
                <span>{max}</span>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 12,
          }}
        >
          {[
            { label: "Current", dist: { T1: 2, T2: 5, T3: 3 } },
            {
              label: "Simulated",
              dist: {
                T1: simulated.t1.length,
                T2: simulated.t2.length,
                T3: simulated.t3.length,
              },
            },
          ].map((row) => (
            <div key={row.label}>
              <div
                style={{
                  font: "500 10px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                  marginBottom: 6,
                }}
              >
                {row.label} Distribution
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {Object.entries(row.dist).map(([k, v]) => (
                  <div
                    key={k}
                    className="metric-box"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      padding: "8px",
                      borderColor:
                        k === "T1"
                          ? "var(--accent)"
                          : k === "T2"
                            ? "var(--perf-target)"
                            : "var(--perf-below)",
                    }}
                  >
                    <div className="m-label">{k}</div>
                    <div
                      className="m-val"
                      style={{
                        color:
                          k === "T1"
                            ? "var(--accent)"
                            : k === "T2"
                              ? "var(--perf-target)"
                              : "var(--perf-below)",
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {simulated.changes.length > 0 && (
          <div>
            <div
              style={{
                font: "500 10px var(--font-mono)",
                color: "var(--fg-tertiary)",
                textTransform: "uppercase",
                letterSpacing: ".06em",
                marginBottom: 6,
              }}
            >
              Providers Who Would Change Tier
            </div>
            {simulated.changes.map((p) => {
              const simTier =
                p.composite >= tier1Threshold
                  ? 1
                  : p.composite >= tier2Lower
                    ? 2
                    : 3;
              return (
                <div
                  key={p.id}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "6px 10px",
                    background: "var(--perf-below-soft)",
                    borderRadius: 6,
                    marginBottom: 4,
                    border: ".5px solid var(--perf-below)",
                  }}
                >
                  <span
                    style={{
                      font: "500 11px var(--font-sans)",
                      color: S12_COLORS[p.id],
                      flex: 1,
                    }}
                  >
                    {p.name}
                  </span>
                  <span
                    style={{
                      font: "600 10px var(--font-mono)",
                      color: tc(p.tier),
                    }}
                  >
                    Current T{p.tier}
                  </span>
                  <span>→</span>
                  <span
                    style={{
                      font: "600 10px var(--font-mono)",
                      color: tc(simTier),
                    }}
                  >
                    Simulated T{simTier}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {simulated.changes.length === 0 && (
          <div
            style={{
              font: "400 11px var(--font-sans)",
              color: "var(--fg-tertiary)",
            }}
          >
            No tier changes with current thresholds.
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
          <button
            className="btn secondary"
            style={{ fontSize: 11 }}
            onClick={() => {
              setTier1Threshold(85);
              setTier2Lower(70);
            }}
          >
            Reset to Default
          </button>
          <button
            className="btn primary"
            style={{ fontSize: 11 }}
            onClick={() => setConfirmOpen(true)}
          >
            Apply Changes
          </button>
        </div>
        {confirmOpen && (
          <div
            style={{
              marginTop: 12,
              padding: "12px 16px",
              background: "var(--perf-below-soft)",
              borderRadius: 8,
              border: ".5px solid var(--perf-below)",
            }}
          >
            <p
              style={{
                font: "400 12px/18px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: "0 0 10px",
              }}
            >
              Changing tier thresholds will trigger re-evaluation of all
              providers. This action requires Compliance approval. Proceed?
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn primary"
                style={{ fontSize: 11 }}
                onClick={() => {
                  setConfirmOpen(false);
                  window.__toast &&
                    window.__toast(
                      "Threshold change submitted for Compliance approval.",
                    );
                }}
              >
                Confirm
              </button>
              <button
                className="btn secondary"
                style={{ fontSize: 11 }}
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── L2-B: Provider Tier Profile ─────────────────────────────────────────── */
function L2BTierProfile({ visible, provider }) {
  if (!visible || !provider) return null;
  const prov = provider;
  const compositeQ = [68, 71, 74, 76]; // Dr. Khalid example
  const tierHistory = [
    { period: "Q1 2025", tier: 3, score: 68, note: "Initial assignment" },
    {
      period: "Q2 2025",
      tier: 3,
      score: 71,
      note: "Above threshold but grace period — PROMs 48% < 50% minimum",
    },
    {
      period: "Q3 2025",
      tier: 3,
      score: 74,
      note: "PROMs improved to 56% — now eligible for Tier 2",
    },
    {
      period: "Q4 2025",
      tier: 2,
      score: 76,
      note: "UPGRADED — all Tier 2 criteria met",
    },
  ];

  return (
    <div className="card" style={{ padding: 20, marginTop: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            font: "600 14px var(--font-sans)",
            color: "var(--fg-primary)",
            flex: 1,
          }}
        >
          L2-B: Tier Profile — {prov.name}
        </div>
        <span
          style={{
            font: "600 12px var(--font-mono)",
            color: tc(prov.tier),
            background: tcs(prov.tier),
            padding: "4px 12px",
            borderRadius: 9999,
            border: `.5px solid ${tc(prov.tier)}`,
          }}
        >
          Tier {prov.tier}
        </span>
      </div>

      {/* Current status */}
      <div className="metric-row" style={{ marginBottom: 14 }}>
        {[
          ["Composite Score", prov.composite, "var(--accent)"],
          ["Tier Assignment", "Oct 1 2025", "var(--perf-target)"],
          ["Next Evaluation", "Jan 1 2026", "var(--fg-tertiary)"],
          ["Periods in Tier", "1 (just upgraded)", "var(--fg-tertiary)"],
        ].map(([l, v, c]) => (
          <div key={l} className="metric-box">
            <div className="m-label">{l}</div>
            <div className="m-val" style={{ color: c, fontSize: 15 }}>
              {v}
            </div>
          </div>
        ))}
      </div>

      {/* Eligibility checklist */}
      <div className="l2-section-title">Tier Eligibility Checklist</div>
      <div className="l2-card" style={{ marginBottom: 12 }}>
        {[
          {
            label: "Composite score falls in Tier 2 range (70–84)",
            met: true,
            val: "76 — in range ✓",
          },
          {
            label: "Above Tier 3 threshold (70)",
            met: true,
            val: "Yes, by 6 points ✓",
          },
          {
            label: "Below Tier 1 threshold (85)",
            met: false,
            val: "Yes, by 9 points — need +9 for T1",
          },
          { label: "Zero never events", met: true, val: "0 events ✓" },
          {
            label: "PROMs completeness ≥50% (Tier 2 minimum)",
            met: true,
            val: "64% ✓",
          },
          {
            label: "PROMs completeness ≥70% (Tier 1 requirement)",
            met: false,
            val: "64% — need +6% for T1 ✗",
          },
          { label: "No active CAP/PIP", met: true, val: "None ✓" },
          { label: "Data quality ≥80%", met: true, val: "86% ✓" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              gap: 10,
              padding: "6px 0",
              borderBottom: ".5px solid var(--border-default)",
            }}
          >
            <span
              style={{
                color: item.met ? "var(--perf-target)" : "var(--perf-floor)",
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {item.met ? "✓" : "✗"}
            </span>
            <span
              style={{
                font: "400 12px var(--font-sans)",
                color: "var(--fg-primary)",
                flex: 1,
              }}
            >
              {item.label}
            </span>
            <span
              style={{
                font: "500 10px var(--font-mono)",
                color: item.met ? "var(--perf-target)" : "var(--perf-floor)",
              }}
            >
              {item.val}
            </span>
          </div>
        ))}
        <p
          style={{
            font: "400 11px/16px var(--font-sans)",
            color: "var(--fg-secondary)",
            margin: "10px 0 0",
          }}
        >
          Meets all Tier 2 requirements. Does not meet Tier 1 due to composite
          score (need +9) and PROMs collection (need +6%).
        </p>
      </div>

      {/* Tier history timeline */}
      <div className="l2-section-title">Tier History Timeline</div>
      <div style={{ display: "flex", gap: 0 }}>
        {tierHistory.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              position: "relative",
            }}
          >
            {i < tierHistory.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: "50%",
                  right: "-50%",
                  height: 2,
                  background: "var(--border-default)",
                }}
              />
            )}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: tc(h.tier),
                display: "grid",
                placeItems: "center",
                font: "700 11px var(--font-sans)",
                color: "white",
                zIndex: 1,
                border: "2px solid var(--bg-surface)",
              }}
            >
              T{h.tier}
            </div>
            <div
              style={{
                font: "600 10px var(--font-mono)",
                color: "var(--fg-primary)",
                textAlign: "center",
              }}
            >
              {h.period}
            </div>
            <div
              style={{ font: "700 12px var(--font-sans)", color: tc(h.tier) }}
            >
              {h.score}
            </div>
            <div
              style={{
                font: "400 9px var(--font-sans)",
                color: "var(--fg-tertiary)",
                textAlign: "center",
                maxWidth: 90,
              }}
            >
              {h.note}
            </div>
          </div>
        ))}
      </div>

      {/* Distance to Tier 1 */}
      <div className="l2-section-title" style={{ marginTop: 16 }}>
        Distance to Tier 1
      </div>
      <table className="l2-table">
        <thead>
          <tr>
            <th>Gap</th>
            <th>Current</th>
            <th>Target</th>
            <th>Deficit</th>
            <th>Achievability</th>
          </tr>
        </thead>
        <tbody>
          {[
            {
              gap: "Composite Score",
              cur: "76",
              tgt: "≥85",
              def: "+9 pts",
              note: "At +2.7/qtr rate, achievable in ~3 quarters (Q3 2026)",
            },
            {
              gap: "PROMs Collection",
              cur: "64%",
              tgt: "≥70%",
              def: "+6%",
              note: "Achievable with dedicated patient outreach",
            },
            {
              gap: "Zero Never Events",
              cur: "0",
              tgt: "0",
              def: "✓ Met",
              note: "Maintain",
            },
            {
              gap: "No Active CAP",
              cur: "None",
              tgt: "None",
              def: "✓ Met",
              note: "Maintain",
            },
            {
              gap: "Data Quality",
              cur: "86%",
              tgt: "≥80%",
              def: "✓ Met",
              note: "Maintain",
            },
          ].map((row) => (
            <tr
              key={row.gap}
              style={{
                background: row.def.includes("✓")
                  ? "transparent"
                  : "var(--accent-soft)",
              }}
            >
              <td style={{ font: "500 11px var(--font-sans)" }}>{row.gap}</td>
              <td
                style={{
                  font: "600 11px var(--font-mono)",
                  color: "var(--fg-primary)",
                }}
              >
                {row.cur}
              </td>
              <td
                style={{
                  font: "500 11px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                }}
              >
                {row.tgt}
              </td>
              <td
                style={{
                  font: "600 11px var(--font-mono)",
                  color: row.def.includes("✓")
                    ? "var(--perf-target)"
                    : "var(--accent)",
                }}
              >
                {row.def}
              </td>
              <td
                style={{
                  font: "400 11px var(--font-sans)",
                  color: "var(--fg-secondary)",
                }}
              >
                {row.note}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main ProviderTiering screen ──────────────────────────────────────────── */
function ProviderTiering({
  onOpenNetworkAdequacy,
  onOpenBenefitDesign,
  onSwitchToComparison,
}) {
  const [showL2A, setShowL2A] = useS12TState(false);
  const [showL2B, setShowL2B] = useS12TState(false);
  const [selectedProvider, setSelectedProvider] = useS12TState(null);

  function handleProviderClick(prov) {
    setSelectedProvider(prov);
    setShowL2B(true);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div>
          <div
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".07em",
              textTransform: "uppercase",
            }}
          >
            Provider Performance
          </div>
          <h1
            style={{
              font: "600 22px var(--font-sans)",
              margin: "4px 0 0",
              letterSpacing: "-.01em",
            }}
          >
            Provider Tiering & Network Intelligence
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn secondary"
            style={{ fontSize: 11 }}
            onClick={() => setShowL2A((v) => !v)}
          >
            Configure Tiering
          </button>
          <button
            className="btn secondary"
            style={{ fontSize: 11 }}
            onClick={onOpenNetworkAdequacy}
          >
            Network Adequacy
          </button>
          <button
            className="btn secondary"
            style={{ fontSize: 11 }}
            onClick={onOpenBenefitDesign}
          >
            Benefit Impact
          </button>
          <button
            className="btn primary"
            style={{ fontSize: 11 }}
            onClick={onSwitchToComparison}
          >
            ← Compare Providers
          </button>
        </div>
      </div>

      {/* 4 panels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginBottom: 0,
        }}
      >
        <div className="card" style={{ padding: 18 }}>
          <div className="l2-section-title">
            Tier Distribution — {S12_PROVIDERS.length} Providers
          </div>
          <TierDistBar providers={S12_PROVIDERS} />
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="l2-section-title">Tier Movement — Q3 → Q4 2025</div>
          <TierMovementSummary />
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="l2-section-title">Tier Distribution by Specialty</div>
          <SpecialtyTierHeatmap providers={S12_PROVIDERS} />
        </div>
        <div className="card" style={{ padding: 18 }}>
          <div className="l2-section-title">Geographic Facility Coverage</div>
          <FacilityCards
            providers={S12_PROVIDERS}
            onSelectProvider={handleProviderClick}
          />
        </div>
      </div>

      {/* L2 panels */}
      <L2ATierEngine visible={showL2A} />
      <L2BTierProfile
        visible={showL2B}
        provider={selectedProvider || S12_PROVIDERS.find((p) => p.id === "P04")}
      />
    </div>
  );
}

export default ProviderTiering;
