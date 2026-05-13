import {
  S12_PROVIDERS,
  S12_COLORS,
  S12_HISTORY,
  S12_RISK_ADJ,
  S12_OE,
  S12_CASEMIX,
  S12_CASEMIX_NETWORK,
  S12_VELOCITY,
  S12_TIME_TO_TARGET,
} from "@/mock/provider-comparison";
import React from "react";
import {
  MultiLineChart,
  MultiRadar,
  OERatioChart,
  QuadrantScatter,
} from "./Charts";
const { useState: useS12CState, useMemo: useS12CMemo } = React;

/* ── Dimensions for Contract 1 radar ──────────────────────────────────────── */
const DIM_LABELS = {
  D1: "Clinical",
  D2: "PROMs",
  D3: "Experience",
  D5: "Process",
  D7: "Cost",
  D9: "Equity",
};
const CONTRACT1_DIMS = ["D1", "D2", "D3", "D5", "D7", "D9"];

// Generate dimension scores from composite
function dimScoresFor(pid) {
  const hist = S12_HISTORY[pid] || [70, 72, 74, 75];
  const base = hist[hist.length - 1];
  function sd(d, seed) {
    const h =
      (pid.charCodeAt(1) * 127 + d.charCodeAt(1) * 31 + seed * 7) & 0x7fffffff;
    return ((h % 100) / 100 - 0.5) * 14;
  }
  const result = {};
  CONTRACT1_DIMS.forEach((d) => {
    result[d] = Math.round(Math.max(40, Math.min(99, base + sd(d, 0))));
  });
  return result;
}

/* ── Provider Selector ─────────────────────────────────────────────────────── */
function ProviderSelector({ selected, onSelected }) {
  const [search, setSearch] = useS12CState("");
  const [filterTier, setFilterTier] = useS12CState("All");

  const filtered = useS12CMemo(
    () =>
      S12_PROVIDERS.filter((p) => {
        if (
          search &&
          !p.name.toLowerCase().includes(search.toLowerCase()) &&
          !p.specialty.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (filterTier !== "All" && p.tier !== parseInt(filterTier))
          return false;
        return true;
      }),
    [search, filterTier],
  );

  const tierColors = {
    1: "var(--accent)",
    2: "var(--perf-target)",
    3: "var(--perf-below)",
  };

  function toggle(pid) {
    if (selected.includes(pid)) onSelected(selected.filter((x) => x !== pid));
    else if (selected.length < 8) onSelected([...selected, pid]);
  }

  return (
    <div className="card" style={{ padding: 16, marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search providers…"
          style={{
            padding: "6px 12px",
            borderRadius: 9999,
            border: ".5px solid var(--border-default)",
            background: "var(--bg-elevated)",
            font: "400 12px var(--font-sans)",
            flex: 1,
            minWidth: 160,
          }}
        />
        <select
          value={filterTier}
          onChange={(e) => setFilterTier(e.target.value)}
          style={{
            padding: "6px 10px",
            borderRadius: 9999,
            border: ".5px solid var(--border-default)",
            background: "var(--bg-elevated)",
            font: "400 12px var(--font-sans)",
          }}
        >
          {["All", "1", "2", "3"].map((t) => (
            <option key={t} value={t}>
              Tier {t === "All" ? "All" : t}
            </option>
          ))}
        </select>
        <button
          className="btn secondary"
          style={{ fontSize: 10, padding: "4px 12px" }}
          onClick={() => {
            const c1 = S12_PROVIDERS.filter((p) => p.id !== "P04" || true);
            onSelected(S12_PROVIDERS.slice(0, 8).map((p) => p.id));
          }}
        >
          Compare All (10)
        </button>
        <button
          className="btn secondary"
          style={{ fontSize: 10, padding: "4px 12px" }}
          onClick={() => onSelected(["P01", "P02", "P03", "P04"])}
        >
          Reset to Default
        </button>
        <span
          style={{
            font: "500 10px var(--font-mono)",
            color: "var(--fg-tertiary)",
            flexShrink: 0,
          }}
        >
          {selected.length} of 8 selected
        </span>
      </div>

      {/* Selected pills */}
      {selected.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 6,
            flexWrap: "wrap",
            marginBottom: 10,
          }}
        >
          {selected.map((pid) => {
            const prov = S12_PROVIDERS.find((p) => p.id === pid);
            if (!prov) return null;
            const color = S12_COLORS[pid] || "var(--fg-tertiary)";
            return (
              <span
                key={pid}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 10px 3px 8px",
                  borderRadius: 9999,
                  background: color + "18",
                  border: `.5px solid ${color}`,
                  font: "500 10px var(--font-sans)",
                  color,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: color,
                    flexShrink: 0,
                  }}
                />
                {prov.name.split(" ").slice(1).join(" ")}
                <span
                  style={{
                    cursor: "pointer",
                    marginLeft: 2,
                    font: "600 11px",
                    opacity: 0.7,
                  }}
                  onClick={() => toggle(pid)}
                >
                  ×
                </span>
              </span>
            );
          })}
        </div>
      )}

      {/* Provider list */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {filtered.map((prov) => {
          const isSelected = selected.includes(prov.id);
          const color = S12_COLORS[prov.id] || "var(--fg-tertiary)";
          const tc = tierColors[prov.tier] || "var(--fg-tertiary)";
          return (
            <div
              key={prov.id}
              onClick={() => toggle(prov.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 12px",
                borderRadius: 8,
                cursor: "pointer",
                transition: "all .1s",
                background: isSelected ? color + "15" : "var(--bg-elevated)",
                border: isSelected
                  ? `.5px solid ${color}`
                  : ".5px solid var(--border-default)",
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                style={{ accentColor: color, width: 12, height: 12 }}
              />
              <span
                style={{
                  font: "500 11px var(--font-sans)",
                  color: isSelected ? color : "var(--fg-primary)",
                }}
              >
                {prov.name.split(" ").slice(1, 3).join(" ")}
              </span>
              <span
                style={{
                  font: "500 9px var(--font-mono)",
                  color: tc,
                  background: tc + "18",
                  padding: "2px 6px",
                  borderRadius: 9999,
                }}
              >
                T{prov.tier}
              </span>
              <span
                style={{
                  font: "600 10px var(--font-mono)",
                  color: isSelected ? color : "var(--fg-tertiary)",
                }}
              >
                {prov.composite}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tab A: Radar Overlay ──────────────────────────────────────────────────── */
function RadarTab({ providers }) {
  const dimScoresAll = useS12CMemo(() => {
    const r = {};
    providers.forEach((p) => {
      r[p.id] = dimScoresFor(p.id);
    });
    return r;
  }, [providers]);

  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      <MultiRadar
        providers={providers}
        dimScores={dimScoresAll}
        dims={CONTRACT1_DIMS}
        dimLabels={DIM_LABELS}
        size={300}
      />
      <div style={{ flex: 1, minWidth: 200 }}>
        <div
          style={{
            font: "500 9px var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".07em",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Provider Legend
        </div>
        {providers.map((p) => {
          const color = S12_COLORS[p.id] || "var(--fg-tertiary)";
          return (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 3,
                  borderRadius: 9999,
                  background: color,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  font: "500 11px var(--font-sans)",
                  color: "var(--fg-primary)",
                  flex: 1,
                }}
              >
                {p.name}
              </span>
              <span style={{ font: "700 12px var(--font-mono)", color }}>
                {p.composite}
              </span>
              <span
                style={{
                  font: "500 9px var(--font-mono)",
                  color:
                    p.tier === 1
                      ? "var(--accent)"
                      : p.tier === 2
                        ? "var(--perf-target)"
                        : "var(--perf-below)",
                  background:
                    p.tier === 1
                      ? "var(--accent-soft)"
                      : p.tier === 2
                        ? "var(--perf-target-soft)"
                        : "var(--perf-below-soft)",
                  padding: "2px 7px",
                  borderRadius: 9999,
                }}
              >
                Tier {p.tier}
              </span>
            </div>
          );
        })}
        <div
          style={{
            marginTop: 14,
            padding: "10px 12px",
            background: "var(--bg-elevated)",
            borderRadius: 8,
            border: ".5px solid var(--border-default)",
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
            Dashed Polygon
          </div>
          <span
            style={{
              font: "400 11px var(--font-sans)",
              color: "var(--fg-secondary)",
            }}
          >
            Contract target threshold (75) for all dimensions
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Tab B: Scorecard Table ────────────────────────────────────────────────── */
function ScorecardTab({ providers }) {
  const measures = ["D1", "D2", "D3", "D5", "D7", "D9"].map((dim) => ({
    dim,
    label: DIM_LABELS[dim],
    rows: [1, 2, 3].map((n) => ({
      id: `${dim}-00${n}`,
      name: `Measure ${n}`,
      key: `m${dim}${n}`,
    })),
  }));

  function score(pid, key) {
    const base = dimScoresFor(pid);
    const dimId = key.slice(1, 3);
    const h =
      (pid.charCodeAt(1) * 127 + key.charCodeAt(key.length - 1) * 31) &
      0x7fffffff;
    return Math.round(
      Math.max(
        35,
        Math.min(99, (base[dimId] || 75) + ((h % 100) / 100 - 0.5) * 12),
      ),
    );
  }
  function cellColor(s) {
    if (s >= 90)
      return { bg: "var(--perf-exceeds)", soft: "var(--perf-exceeds-soft)" };
    if (s >= 75)
      return { bg: "var(--perf-target)", soft: "var(--perf-target-soft)" };
    if (s >= 60)
      return { bg: "var(--perf-below)", soft: "var(--perf-below-soft)" };
    return { bg: "var(--perf-floor)", soft: "var(--perf-floor-soft)" };
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ background: "var(--bg-elevated)" }}>
            <th
              style={{
                padding: "10px 14px",
                textAlign: "left",
                font: "500 10px var(--font-mono)",
                color: "var(--fg-tertiary)",
                letterSpacing: ".07em",
                textTransform: "uppercase",
                width: 200,
                position: "sticky",
                left: 0,
                background: "var(--bg-elevated)",
                zIndex: 2,
              }}
            >
              Measure
            </th>
            {providers.map((p) => {
              const color = S12_COLORS[p.id] || "var(--fg-tertiary)";
              const tc =
                p.tier === 1
                  ? "var(--accent)"
                  : p.tier === 2
                    ? "var(--perf-target)"
                    : "var(--perf-below)";
              return (
                <th
                  key={p.id}
                  style={{
                    padding: "10px 14px",
                    textAlign: "center",
                    minWidth: 100,
                    borderLeft: ".5px solid var(--border-default)",
                  }}
                >
                  <div style={{ font: "500 11px var(--font-sans)", color }}>
                    {p.name.split(" ")[2] || p.name.split(" ")[1]}
                  </div>
                  <div
                    style={{
                      font: "700 14px var(--font-sans)",
                      color,
                      marginTop: 2,
                    }}
                  >
                    {p.composite}
                  </div>
                  <span
                    style={{
                      font: "500 8px var(--font-mono)",
                      color: tc,
                      background: tc + "18",
                      padding: "1px 5px",
                      borderRadius: 9999,
                    }}
                  >
                    T{p.tier}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {measures.map((dim) => (
            <React.Fragment key={dim.dim}>
              {/* Dimension header row */}
              <tr style={{ background: "var(--bg-elevated)" }}>
                <td
                  colSpan={providers.length + 1}
                  style={{
                    padding: "6px 14px",
                    font: "600 10px var(--font-mono)",
                    color: "var(--fg-secondary)",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    position: "sticky",
                    left: 0,
                  }}
                >
                  {dim.dim} — {dim.label}
                </td>
              </tr>
              {/* Measure rows */}
              {dim.rows.map((row) => (
                <tr
                  key={row.id}
                  style={{ borderBottom: ".5px solid var(--border-default)" }}
                >
                  <td
                    style={{
                      padding: "7px 14px",
                      font: "400 11px var(--font-sans)",
                      color: "var(--fg-secondary)",
                      position: "sticky",
                      left: 0,
                      background: "var(--bg-surface)",
                      zIndex: 1,
                    }}
                  >
                    <span
                      className="m-id"
                      style={{ fontSize: 9, marginRight: 8 }}
                    >
                      {row.id}
                    </span>
                    {row.name}
                  </td>
                  {providers.map((p) => {
                    const s = score(p.id, row.key);
                    const c = cellColor(s);
                    return (
                      <td
                        key={p.id}
                        style={{
                          padding: "5px 8px",
                          textAlign: "center",
                          background: c.soft,
                          borderLeft: ".5px solid var(--border-default)",
                        }}
                      >
                        <span
                          style={{
                            font: "600 11px var(--font-mono)",
                            color: c.bg,
                          }}
                        >
                          {s}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Dimension subtotal */}
              <tr style={{ background: "var(--bg-elevated)" }}>
                <td
                  style={{
                    padding: "6px 14px",
                    font: "600 11px var(--font-sans)",
                    color: "var(--fg-primary)",
                    position: "sticky",
                    left: 0,
                    background: "var(--bg-elevated)",
                  }}
                >
                  {dim.dim} Weighted Score
                </td>
                {providers.map((p) => {
                  const ds = dimScoresFor(p.id)[dim.dim] || 0;
                  const c = cellColor(ds);
                  return (
                    <td
                      key={p.id}
                      style={{
                        padding: "6px 8px",
                        textAlign: "center",
                        borderLeft: ".5px solid var(--border-default)",
                        background: c.soft,
                      }}
                    >
                      <span
                        style={{
                          font: "700 12px var(--font-mono)",
                          color: c.bg,
                        }}
                      >
                        {ds}
                      </span>
                    </td>
                  );
                })}
              </tr>
            </React.Fragment>
          ))}
          {/* Composite row */}
          <tr
            style={{
              background: "var(--bg-elevated)",
              borderTop: "1px solid var(--border-default)",
            }}
          >
            <td
              style={{
                padding: "10px 14px",
                font: "700 12px var(--font-sans)",
                color: "var(--fg-primary)",
                position: "sticky",
                left: 0,
                background: "var(--bg-elevated)",
              }}
            >
              Composite Score
            </td>
            {providers.map((p) => {
              const c =
                p.composite >= 90
                  ? "var(--accent)"
                  : p.composite >= 75
                    ? "var(--perf-target)"
                    : p.composite >= 60
                      ? "var(--perf-below)"
                      : "var(--perf-floor)";
              return (
                <td
                  key={p.id}
                  style={{
                    padding: "10px 8px",
                    textAlign: "center",
                    borderLeft: ".5px solid var(--border-default)",
                  }}
                >
                  <span style={{ font: "700 16px var(--font-sans)", color: c }}>
                    {p.composite}
                  </span>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ── Tab C: Ranking Table ──────────────────────────────────────────────────── */
function RankingTab({ providers, allProviders }) {
  const ranked = useS12CMemo(
    () =>
      [...allProviders]
        .sort((a, b) => b.composite - a.composite)
        .map((p, i) => ({ ...p, rank: i + 1 })),
    [allProviders],
  );

  function dimRank(pid, dim) {
    const scores = allProviders
      .map((p) => ({ id: p.id, s: dimScoresFor(p.id)[dim] || 0 }))
      .sort((a, b) => b.s - a.s);
    return scores.findIndex((x) => x.id === pid) + 1;
  }

  const tierColor = (t) =>
    t === 1
      ? "var(--accent)"
      : t === 2
        ? "var(--perf-target)"
        : "var(--perf-below)";

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="l2-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Provider</th>
            <th>Facility</th>
            <th>Specialty</th>
            <th>Tier</th>
            <th style={{ textAlign: "center" }}>Score</th>
            {CONTRACT1_DIMS.map((d) => (
              <th key={d} style={{ textAlign: "center", minWidth: 56 }}>
                {d}
              </th>
            ))}
            <th style={{ textAlign: "right" }}>Panel</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((p) => {
            const isSelected = providers.find((x) => x.id === p.id);
            const tc = tierColor(p.tier);
            const color = S12_COLORS[p.id] || "var(--fg-tertiary)";
            const hist = S12_HISTORY[p.id] || [
              p.composite - 4,
              p.composite - 2,
              p.composite - 1,
              p.composite,
            ];
            const compositeRank = p.rank;
            const dimRankDiffs = CONTRACT1_DIMS.map((d) => ({
              d,
              dr: dimRank(p.id, d),
            }));
            const hasRankDivergence = dimRankDiffs.some(
              (x) => Math.abs(x.dr - compositeRank) >= 3,
            );
            return (
              <tr
                key={p.id}
                style={{
                  background: isSelected
                    ? (S12_COLORS[p.id] || "transparent") + "08"
                    : "transparent",
                  fontWeight: isSelected ? 500 : 400,
                }}
              >
                <td>
                  <span
                    style={{ font: "700 13px var(--font-mono)", color: color }}
                  >
                    {p.rank}
                  </span>
                </td>
                <td
                  style={{
                    font: "500 12px var(--font-sans)",
                    color: color,
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.name}
                </td>
                <td
                  style={{
                    font: "400 10px var(--font-sans)",
                    color: "var(--fg-tertiary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.facility.split(" ")[0]}
                </td>
                <td
                  style={{
                    font: "400 10px var(--font-sans)",
                    color: "var(--fg-secondary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.specialty.split(" ")[0]}
                </td>
                <td>
                  <span
                    style={{
                      font: "600 10px var(--font-mono)",
                      color: tc,
                      background: tc + "18",
                      padding: "2px 7px",
                      borderRadius: 9999,
                    }}
                  >
                    T{p.tier}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <span
                    style={{
                      font: "700 14px var(--font-sans)",
                      color:
                        p.composite >= 90
                          ? "var(--accent)"
                          : p.composite >= 75
                            ? "var(--perf-target)"
                            : p.composite >= 60
                              ? "var(--perf-below)"
                              : "var(--perf-floor)",
                    }}
                  >
                    {p.composite}
                  </span>
                </td>
                {CONTRACT1_DIMS.map((d) => {
                  const dr = dimRank(p.id, d);
                  const isDiverged = Math.abs(dr - compositeRank) >= 3;
                  const ds = dimScoresFor(p.id)[d] || 0;
                  return (
                    <td
                      key={d}
                      style={{
                        textAlign: "center",
                        background: isDiverged
                          ? "var(--perf-below-soft)"
                          : "transparent",
                      }}
                    >
                      <div
                        style={{
                          font: "600 10px var(--font-mono)",
                          color: isDiverged
                            ? "var(--perf-below)"
                            : "var(--fg-secondary)",
                        }}
                      >
                        #{dr}
                      </div>
                      <div
                        style={{
                          font: "400 8px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                        }}
                      >
                        {ds}
                      </div>
                    </td>
                  );
                })}
                <td
                  style={{
                    textAlign: "right",
                    font: "500 11px var(--font-mono)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {p.panel}
                </td>
                <td>
                  <svg width={48} height={16} style={{ display: "block" }}>
                    <polyline
                      points={hist
                        .map(
                          (v, i) =>
                            `${(i / (hist.length - 1)) * 48},${16 - ((v - 60) / 40) * 16}`,
                        )
                        .join(" ")}
                      fill="none"
                      stroke={color}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
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
        Highlighted cells indicate dimension ranks diverging ≥3 positions from
        composite rank. This signals a provider with specific strengths or
        weaknesses masked by their overall score.
      </p>
    </div>
  );
}

/* ── L2-A: Risk-Adjusted Comparison ───────────────────────────────────────── */
function L2ARiskAdjusted({ visible }) {
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
        L2-A: Risk-Adjusted Comparison
      </div>

      {/* Raw vs Adjusted table */}
      <div className="l2-section-title">Raw vs Risk-Adjusted Scores</div>
      <table className="l2-table" style={{ marginBottom: 18 }}>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Raw Score</th>
            <th>Adj Score</th>
            <th>Δ Adjustment</th>
            <th>Raw Rank</th>
            <th>Adj Rank</th>
            <th>Rank Change</th>
          </tr>
        </thead>
        <tbody>
          {S12_RISK_ADJ.map((d) => {
            const color = S12_COLORS[d.pid] || "var(--fg-tertiary)";
            const changed = d.rankChange !== 0;
            return (
              <tr
                key={d.pid}
                style={{
                  background: changed
                    ? "var(--perf-below-soft)"
                    : "transparent",
                }}
              >
                <td style={{ font: "500 12px var(--font-sans)", color }}>
                  {d.name}
                </td>
                <td
                  style={{
                    font: "600 12px var(--font-mono)",
                    textAlign: "center",
                  }}
                >
                  {d.raw}
                </td>
                <td
                  style={{
                    font: "700 12px var(--font-mono)",
                    color: "var(--accent)",
                    textAlign: "center",
                  }}
                >
                  {d.adj}
                </td>
                <td
                  style={{
                    font: "600 11px var(--font-mono)",
                    color:
                      d.delta > 0 ? "var(--perf-target)" : "var(--perf-floor)",
                    textAlign: "center",
                  }}
                >
                  {d.delta > 0 ? "+" : ""}
                  {d.delta}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    font: "500 11px var(--font-mono)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  #{d.rawRank}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    font: "700 11px var(--font-mono)",
                    color: "var(--accent)",
                  }}
                >
                  #{d.adjRank}
                </td>
                <td style={{ textAlign: "center" }}>
                  {d.rankChange === 0 ? (
                    <span style={{ color: "var(--fg-tertiary)" }}>—</span>
                  ) : (
                    <span
                      style={{
                        font: "600 11px var(--font-mono)",
                        color: "var(--perf-below)",
                      }}
                    >
                      {d.rankChange > 0
                        ? `↑${d.rankChange}`
                        : `↓${Math.abs(d.rankChange)}`}
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* O/E Chart */}
        <div>
          <div className="l2-section-title">O/E Ratio Comparison</div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            <OERatioChart data={S12_OE} width={340} height={120} />
          </div>
          <p
            style={{
              font: "400 10px/14px var(--font-sans)",
              color: "var(--fg-secondary)",
              margin: "8px 14px 0",
            }}
          >
            Dr. Khalid's raw score of 72 understates his true clinical
            performance — his cardiac patients are the highest-complexity panel.
            Risk adjustment adds +4pp. Dr. Nour has the easiest panel;
            adjustment removes -2pp.
          </p>
        </div>
        {/* Case-mix summary */}
        <div>
          <div className="l2-section-title">Case-Mix Profile Comparison</div>
          <div className="l2-card">
            {Object.entries({
              "Mean Age": "meanAge",
              "Charlson Index": "charlson",
              "Mean BMI": "bmi",
            }).map(([label, key]) => {
              const vals = S12_RISK_ADJ.map((d) => ({
                pid: d.pid,
                val: S12_CASEMIX[d.pid]?.[key] || 0,
              }));
              const max = Math.max(
                ...vals.map((v) => v.val),
                S12_CASEMIX_NETWORK[key],
              );
              return (
                <div key={key} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      font: "500 9px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  {vals.map((v) => {
                    const color = S12_COLORS[v.pid] || "var(--fg-tertiary)";
                    const w = (v.val / max) * 100;
                    const netW = (S12_CASEMIX_NETWORK[key] / max) * 100;
                    return (
                      <div
                        key={v.pid}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: color,
                            flexShrink: 0,
                          }}
                        />
                        <div
                          style={{
                            flex: 1,
                            height: 10,
                            background: "var(--bg-elevated)",
                            borderRadius: 4,
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: w + "%",
                              height: "100%",
                              background: color,
                              opacity: 0.7,
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              bottom: 0,
                              left: netW + "%",
                              width: 2,
                              background: "var(--fg-secondary)",
                            }}
                          />
                        </div>
                        <span
                          style={{
                            font: "600 9px var(--font-mono)",
                            color,
                            width: 32,
                            textAlign: "right",
                          }}
                        >
                          {v.val.toFixed(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── L2-B: Improvement Velocity Analysis ──────────────────────────────────── */
function L2BVelocity({ visible, allProviders, selectedIds }) {
  if (!visible) return null;
  const selectedVel = S12_VELOCITY.filter((v) => selectedIds.includes(v.pid));
  const TARGET = 75;

  function consistencyColor(c) {
    if (c.includes("↑↑↑") || c.includes("Accelerating"))
      return "var(--perf-target)";
    if (c.includes("↓")) return "var(--perf-floor)";
    return "var(--fg-tertiary)";
  }

  return (
    <div className="card" style={{ padding: 20, marginTop: 12 }}>
      <div
        style={{
          font: "600 14px var(--font-sans)",
          color: "var(--fg-primary)",
          marginBottom: 16,
        }}
      >
        L2-B: Improvement Velocity Analysis
      </div>

      {/* Delta table */}
      <div className="l2-section-title">Period-over-Period Delta</div>
      <table className="l2-table" style={{ marginBottom: 18 }}>
        <thead>
          <tr>
            <th>Provider</th>
            <th>Q1 2025</th>
            <th>Q2 2025</th>
            <th>Q3 2025</th>
            <th>Q4 2025</th>
            <th>Total Δ</th>
            <th>Avg/Quarter</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          {S12_VELOCITY.map((d) => {
            const color = S12_COLORS[d.pid] || "var(--fg-tertiary)";
            return (
              <tr key={d.pid}>
                <td style={{ font: "500 12px var(--font-sans)", color }}>
                  {d.name}
                </td>
                {d.periods.map((v, i) => (
                  <td
                    key={i}
                    style={{
                      textAlign: "center",
                      font: "600 11px var(--font-mono)",
                      color:
                        v >= 85
                          ? "var(--accent)"
                          : v >= 75
                            ? "var(--perf-target)"
                            : v >= 60
                              ? "var(--perf-below)"
                              : "var(--perf-floor)",
                    }}
                  >
                    {v}
                  </td>
                ))}
                <td
                  style={{
                    textAlign: "center",
                    font: "700 12px var(--font-mono)",
                    color:
                      d.total > 0 ? "var(--perf-target)" : "var(--perf-floor)",
                  }}
                >
                  {d.total > 0 ? "+" : ""}
                  {d.total}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    font: "600 11px var(--font-mono)",
                    color:
                      d.avgQtr > 0 ? "var(--perf-target)" : "var(--perf-floor)",
                  }}
                >
                  {d.avgQtr > 0 ? "+" : ""}
                  {d.avgQtr.toFixed(1)}/qtr
                </td>
                <td
                  style={{
                    font: "600 11px var(--font-mono)",
                    color: consistencyColor(d.consistency),
                  }}
                >
                  {d.consistency}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Multi-line chart */}
        <div>
          <div className="l2-section-title">
            Score Trajectories with Projections
          </div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            <MultiLineChart
              velocityData={S12_VELOCITY}
              periods={["Q1", "Q2", "Q3", "Q4"]}
              width={400}
              height={160}
            />
          </div>
        </div>
        {/* Quadrant scatter */}
        <div>
          <div className="l2-section-title">
            Performance × Velocity Quadrant
          </div>
          <div className="l2-card">
            <QuadrantScatter
              allProviders={allProviders}
              selectedIds={selectedIds}
              width={340}
              height={220}
            />
          </div>
        </div>
      </div>

      {/* Time to target */}
      <div className="l2-section-title" style={{ marginTop: 16 }}>
        Projected Time to Target (75)
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {S12_TIME_TO_TARGET.map((d) => {
          const prov = S12_PROVIDERS.find((p) => p.id === d.pid);
          const color = S12_COLORS[d.pid] || "var(--fg-tertiary)";
          const isUrgent = d.quartersAway > 20;
          const isCrossed = d.quartersAway === 0;
          return (
            <div
              key={d.pid}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 14px",
                borderRadius: 8,
                background: isCrossed
                  ? "var(--perf-target-soft)"
                  : isUrgent
                    ? "var(--perf-floor-soft)"
                    : "var(--perf-below-soft)",
                border: `.5px solid ${isCrossed ? "var(--perf-target)" : isUrgent ? "var(--perf-floor)" : "var(--perf-below)"}`,
              }}
            >
              <span
                style={{
                  font: "500 11px var(--font-sans)",
                  color,
                  width: 140,
                  flexShrink: 0,
                }}
              >
                {d.name}
              </span>
              <span
                style={{
                  font: "700 14px var(--font-sans)",
                  color,
                  flexShrink: 0,
                }}
              >
                {d.current}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 8,
                  background: "var(--bg-elevated)",
                  borderRadius: 9999,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: (d.current / 100) * 100 + "%",
                    height: "100%",
                    background: color,
                    opacity: 0.7,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "75%",
                    width: 2,
                    background: "var(--perf-target)",
                  }}
                />
              </div>
              <span
                style={{
                  font: "500 10px var(--font-sans)",
                  color: isCrossed
                    ? "var(--perf-target)"
                    : isUrgent
                      ? "var(--perf-floor)"
                      : "var(--perf-below)",
                  flexShrink: 0,
                  maxWidth: 240,
                  textAlign: "right",
                }}
              >
                {d.note}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main ProviderComparison screen ───────────────────────────────────────── */
function ProviderComparison({
  onOpenPeerGroup,
  onOpenStats,
  onSwitchToTiering,
}) {
  const [selectedIds, setSelectedIds] = useS12CState([
    "P01",
    "P02",
    "P03",
    "P04",
  ]);
  const [tab, setTab] = useS12CState("radar");
  const [showL2A, setShowL2A] = useS12CState(false);
  const [showL2B, setShowL2B] = useS12CState(false);

  const providers = useS12CMemo(
    () => S12_PROVIDERS.filter((p) => selectedIds.includes(p.id)),
    [selectedIds],
  );

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
            Provider Comparison & Benchmarking
          </h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn secondary"
            style={{ fontSize: 11 }}
            onClick={() => setShowL2A((v) => !v)}
          >
            Risk-Adjusted View
          </button>
          <button
            className="btn secondary"
            style={{ fontSize: 11 }}
            onClick={() => setShowL2B((v) => !v)}
          >
            Improvement Trends
          </button>
          <button
            className="btn secondary"
            style={{ fontSize: 11 }}
            onClick={onOpenPeerGroup}
          >
            Validate Peer Group
          </button>
          <button
            className="btn secondary"
            style={{ fontSize: 11 }}
            onClick={onOpenStats}
          >
            Statistical Tests
          </button>
          <button
            className="btn primary"
            style={{ fontSize: 11 }}
            onClick={onSwitchToTiering}
          >
            → Network Tiering
          </button>
        </div>
      </div>

      <ProviderSelector selected={selectedIds} onSelected={setSelectedIds} />

      {/* View tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: 4,
          background: "var(--bg-elevated)",
          border: ".5px solid var(--border-default)",
          borderRadius: 9999,
          width: "fit-content",
          marginBottom: 14,
        }}
      >
        {[
          ["radar", "Radar Overlay"],
          ["scorecard", "Scorecard Table"],
          ["ranking", "Ranking Table"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={"tab" + (tab === id ? " active" : "")}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card" style={{ padding: 20, marginBottom: 0 }}>
        {tab === "radar" && <RadarTab providers={providers} />}
        {tab === "scorecard" && <ScorecardTab providers={providers} />}
        {tab === "ranking" && (
          <RankingTab providers={providers} allProviders={S12_PROVIDERS} />
        )}
      </div>

      {/* L2 panels */}
      <L2ARiskAdjusted visible={showL2A} />
      <L2BVelocity
        visible={showL2B}
        allProviders={S12_PROVIDERS}
        selectedIds={selectedIds}
      />
    </div>
  );
}

export default ProviderComparison;
