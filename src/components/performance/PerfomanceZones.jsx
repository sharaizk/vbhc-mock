// Session 8 — perf-zones.jsx — Dashboard Zones A–E
import {
  VBHC_PERIODS,
  VBHC_PROVIDERS,
  VBHC_CONTRACTS,
  VBHC_NETWORK_C1,
  VBHC_DIMENSIONS,
  VBHC_getStatus,
  VBHC_fmtScore,
  VBHC_fmtThreshold,
  VBHC_getMeasureRow,
  VBHC_getAlerts,
} from "@/mock/performance";
import React from "react";
import { RadarChart, Sparkline } from "./Charts";
import { Icons } from "../Icons/Icons";
const { useState: useZoneState, useMemo: useZoneMemo } = React;

/* ── Zone A — Provider Identity Bar ──────────────────────────────────────── */
function ZoneA({
  provider,
  contract,
  periodIdx,
  onProvider,
  onContract,
  onPeriod,
}) {
  const credClass = {
    Active: "cred-active",
    Probation: "cred-probation",
    Suspended: "cred-suspended",
  };
  const tierClass = { 1: "tier-1", 2: "tier-2", 3: "tier-3" };
  const periods = VBHC_PERIODS;

  return (
    <div className="zone-a">
      {/* Provider selector */}
      <select
        className="sel-btn"
        value={provider.id}
        onChange={(e) => onProvider(e.target.value)}
        style={{ maxWidth: 220, fontWeight: 500 }}
      >
        {VBHC_PROVIDERS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <div className="za-divider" />

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          className="za-meta"
          style={{
            fontSize: 10,
            color: "var(--fg-tertiary)",
            fontFamily: "var(--font-mono)",
            letterSpacing: ".04em",
            textTransform: "uppercase",
          }}
        >
          {provider.specialty}
        </span>
        <span className="za-meta">{provider.facility}</span>
      </div>

      <div className="za-divider" />

      <span
        className={"cred-badge " + (credClass[provider.cred] || "cred-active")}
      >
        {provider.cred}
      </span>

      <span className={"tier-badge " + (tierClass[provider.tier] || "tier-2")}>
        Tier {provider.tier}
      </span>

      <div className="panel-pill">
        <span className="num">{provider.panel.toLocaleString()}</span>
        <span
          style={{
            font: "500 10px var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".04em",
            textTransform: "uppercase",
          }}
        >
          Attributed Lives
        </span>
      </div>

      <div className="za-divider" />

      {/* Contract selector */}
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
          value={contract.id}
          onChange={(e) => onContract(e.target.value)}
          style={{ maxWidth: 240 }}
        >
          {VBHC_CONTRACTS.filter((c) => provider.contracts.includes(c.id)).map(
            (c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="za-divider" />

      {/* Period selector */}
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
          onChange={(e) => onPeriod(parseInt(e.target.value))}
        >
          {periods.map((p, i) => (
            <option key={i} value={i}>
              {p}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/* ── Zone B — Composite Score Card ───────────────────────────────────────── */
function ZoneB({ composites, periodIdx, onPeriod, onClick }) {
  const score = composites[periodIdx];
  const prevScore = periodIdx > 0 ? composites[periodIdx - 1] : null;
  const delta = prevScore != null ? score - prevScore : null;
  const deltaSign = delta > 0 ? "▲" : delta < 0 ? "▼" : "—";
  const deltaPct = prevScore
    ? ((Math.abs(delta) / prevScore) * 100).toFixed(1)
    : null;

  function tierInfo(s) {
    if (s >= 90)
      return {
        cls: "score-tier-exceeds",
        label: "Exceeds Stretch",
        dot: "var(--perf-exceeds)",
      };
    if (s >= 75)
      return {
        cls: "score-tier-target",
        label: "At Target",
        dot: "var(--perf-target)",
      };
    if (s >= 60)
      return {
        cls: "score-tier-below",
        label: "Below Target",
        dot: "var(--perf-below)",
      };
    return {
      cls: "score-tier-floor",
      label: "Below Floor",
      dot: "var(--perf-floor)",
    };
  }

  const tier = tierInfo(score);
  const network = VBHC_NETWORK_C1;
  // Compute percentile: how many bins are below this score
  let below = 0,
    total = 0;
  network.histogram.forEach((b) => {
    const binStart = parseInt(b.bin);
    total += b.count;
    if (binStart + 4 < score) below += b.count;
  });
  const pctile = Math.round((below / total) * 100);

  return (
    <div
      className="zone-b"
      onClick={onClick}
      title="Click to open Composite Score Breakdown"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
        }}
      >
        <span
          style={{
            font: "500 9px var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}
        >
          Composite Score
        </span>
        <span
          style={{
            font: "500 9px var(--font-mono)",
            color: "var(--fg-tertiary)",
            background: "var(--bg-elevated)",
            padding: "2px 6px",
            borderRadius: 4,
            border: ".5px solid var(--border-default)",
          }}
        >
          Click to drill in →
        </span>
      </div>

      <div className={"score-giant " + tier.cls}>{score}</div>

      <div
        style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: tier.dot,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        <span style={{ font: "500 11px var(--font-sans)", color: tier.dot }}>
          {tier.label}
        </span>
      </div>

      {delta != null && (
        <div
          className="score-delta"
          style={{
            marginTop: 6,
            color:
              delta > 0
                ? "var(--perf-target)"
                : delta < 0
                  ? "var(--perf-floor)"
                  : "var(--fg-tertiary)",
          }}
        >
          <span style={{ fontSize: 14 }}>{deltaSign}</span>
          <span>
            {Math.abs(delta)} from {VBHC_PERIODS[periodIdx - 1]}
          </span>
          {deltaPct && (
            <span style={{ color: "var(--fg-tertiary)", fontWeight: 400 }}>
              ({deltaPct}%)
            </span>
          )}
        </div>
      )}

      <div className="score-percentile" style={{ marginTop: 4 }}>
        {pctile > 0 ? `${pctile}th percentile` : "Top 5%"} · {network.n}{" "}
        providers
      </div>

      <div className="period-dots" style={{ marginTop: 12 }}>
        {composites.map((s, i) => (
          <div
            key={i}
            className={"period-dot" + (i === periodIdx ? " active" : "")}
            onClick={(e) => {
              e.stopPropagation();
              onPeriod(i);
            }}
          >
            <span className="v">{s}</span>
            {VBHC_PERIODS[i].replace(" 2025", "")}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Zone C — Radar Chart ────────────────────────────────────────────────── */
function ZoneC({ dimScores, contract, onAxisClick }) {
  const dims = Object.keys(contract.dims);
  const axes = dims.map((d) => VBHC_DIMENSIONS[d]);
  const provScores = dims.map((d) => dimScores[d] || 0);
  // Target = 75 for all dimensions (normalized)
  const targetScores = dims.map(() => 75);

  return (
    <div className="zone-c">
      <div className="radar-legend">
        <div className="radar-legend-item">
          <div
            className="radar-legend-line"
            style={{ background: "var(--accent)" }}
          />
          Provider Score
        </div>
        <div className="radar-legend-item">
          <div
            className="radar-legend-line"
            style={{
              background: "none",
              borderTop: "1.5px dashed var(--accent)",
              opacity: 0.7,
            }}
          />
          Contract Target
        </div>
      </div>
      <RadarChart
        axes={axes}
        providerScores={provScores}
        targetScores={targetScores}
        onAxisClick={(ax) => onAxisClick(ax)}
        size={210}
      />
    </div>
  );
}

/* ── Zone D — Measure Scorecard Table ────────────────────────────────────── */
function ZoneD({
  measures,
  provider,
  contract,
  periodIdx,
  onRowClick,
  onAdjClick,
}) {
  const [sortCol, setSortCol] = useZoneState("status");
  const [sortDir, setSortDir] = useZoneState("asc");

  const getStatus = VBHC_getStatus;
  const fmtScore = VBHC_fmtScore;
  const fmtThresh = VBHC_fmtThreshold;
  const getMeasureRow = VBHC_getMeasureRow;

  const rows = useZoneMemo(() => {
    return measures.map((m) => {
      const d = getMeasureRow(provider, contract, periodIdx, m);
      const status = getStatus(d.adj, m);
      return { ...m, ...d, status };
    });
  }, [measures, provider.id, contract.id, periodIdx]);

  const sorted = useZoneMemo(() => {
    return [...rows].sort((a, b) => {
      let va, vb;
      if (sortCol === "status") {
        va = a.status.rank;
        vb = b.status.rank;
      } else if (sortCol === "dim") {
        va = a.dim;
        vb = b.dim;
      } else if (sortCol === "name") {
        va = a.name;
        vb = b.name;
      } else if (sortCol === "raw") {
        va = a.lowerBetter ? -a.raw : a.raw;
        vb = a.lowerBetter ? -b.raw : b.raw;
      } else if (sortCol === "adj") {
        va = a.lowerBetter ? -a.adj : a.adj;
        vb = a.lowerBetter ? -b.adj : b.adj;
      } else if (sortCol === "cmp") {
        va = a.cmp;
        vb = b.cmp;
      } else {
        va = a.status.rank;
        vb = b.status.rank;
      }
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [rows, sortCol, sortDir]);

  function toggleSort(col) {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir("asc");
    }
  }
  function sortIndicator(col) {
    if (sortCol !== col) return " ↕";
    return sortDir === "asc" ? " ↑" : " ↓";
  }

  const dimColor = (d) => (VBHC_DIMENSIONS[d] || {}).color || "#888";
  const statusColor = {
    exceeds: "var(--perf-exceeds)",
    target: "var(--perf-target)",
    below: "var(--perf-below)",
    floor: "var(--perf-floor)",
  };

  return (
    <div className="zone-d">
      <div className="zone-d-head">
        <span
          style={{
            font: "500 11px var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
          }}
        >
          Measure Scorecard — {measures.length} measures ·{" "}
          {Object.keys(contract.dims)
            .map((d) => `${d} ${contract.dims[d]}%`)
            .join(" · ")}
        </span>
        <span
          style={{
            font: "400 11px var(--font-sans)",
            color: "var(--fg-tertiary)",
          }}
        >
          Click any row to drill in · Click Adj to see risk adjustment
        </span>
      </div>
      <div className="zone-d-scroll">
        <table className="measure-tbl">
          <thead>
            <tr>
              <th onClick={() => toggleSort("dim")} style={{ width: 72 }}>
                Dim{sortIndicator("dim")}
              </th>
              <th style={{ width: 64 }}>ID</th>
              <th onClick={() => toggleSort("name")} style={{ minWidth: 160 }}>
                Measure{sortIndicator("name")}
              </th>
              <th onClick={() => toggleSort("raw")} style={{ width: 80 }}>
                Raw{sortIndicator("raw")}
              </th>
              <th style={{ width: 84 }}>Adj ↗</th>
              <th style={{ width: 72 }}>Target</th>
              <th style={{ width: 68 }}>Floor</th>
              <th style={{ width: 72 }}>Stretch</th>
              <th onClick={() => toggleSort("status")} style={{ width: 100 }}>
                Status{sortIndicator("status")}
              </th>
              <th style={{ width: 72 }}>Trend</th>
              <th onClick={() => toggleSort("cmp")} style={{ width: 76 }}>
                Compl.{sortIndicator("cmp")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => {
              const dc = dimColor(row.dim);
              const sc = statusColor[row.status.key] || "var(--fg-secondary)";
              const trendVals = row.trend || [row.adj];
              return (
                <tr
                  key={row.id}
                  className={"status-row-" + row.status.key}
                  onClick={() => onRowClick(row)}
                >
                  <td>
                    <span
                      className="dim-badge"
                      style={{
                        background: dc + "18",
                        color: dc,
                        border: `.5px solid ${dc}44`,
                      }}
                    >
                      {row.dim}
                    </span>
                  </td>
                  <td>
                    <span className="m-id">{row.id}</span>
                  </td>
                  <td>
                    <span className="m-name" title={row.name}>
                      {row.shortName}
                    </span>
                    {row.lowerBetter && (
                      <span
                        style={{
                          font: "500 9px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                          marginLeft: 4,
                        }}
                      >
                        ▼
                      </span>
                    )}
                  </td>
                  <td>
                    <span className="m-score">
                      {VBHC_fmtScore(row.raw, row.unit)}
                    </span>
                  </td>
                  <td
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdjClick(row);
                    }}
                  >
                    <span className="m-score m-adj" style={{ color: sc }}>
                      {VBHC_fmtScore(row.adj, row.unit)}
                    </span>
                  </td>
                  <td>
                    <span className="mono">
                      {fmtThresh(row.target, row.unit, row.lowerBetter)}
                    </span>
                  </td>
                  <td>
                    <span className="mono">
                      {fmtThresh(row.floor, row.unit, row.lowerBetter)}
                    </span>
                  </td>
                  <td>
                    <span className="mono">
                      {fmtThresh(row.stretch, row.unit, row.lowerBetter)}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span className="status-dot" style={{ background: sc }} />
                      <span
                        style={{ font: "500 10px var(--font-sans)", color: sc }}
                      >
                        {row.status.label}
                      </span>
                    </div>
                  </td>
                  <td>
                    <Sparkline
                      values={trendVals}
                      color={sc}
                      width={60}
                      height={20}
                    />
                  </td>
                  <td>
                    <div>
                      <span
                        style={{
                          font: "500 11px var(--font-mono)",
                          color: "var(--fg-primary)",
                        }}
                      >
                        {row.cmp}%
                      </span>
                      <div className="completeness-bar">
                        <div
                          className="completeness-fill"
                          style={{ width: row.cmp + "%" }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Zone E — Alert & Action Strip ──────────────────────────────────────── */
function ZoneE({ provider, onAlertClick }) {
  const alerts = VBHC_getAlerts(provider);
  const iconMap = {
    critical: Icons.critical,
    warning: Icons.warning,
    info: Icons.info,
    cap: Icons.cap,
    clock: Icons.clock,
  };
  const sevIcon = (a) =>
    iconMap[
      a.sev === "critical"
        ? "critical"
        : a.sev === "warning"
          ? "warning"
          : "info"
    ];

  return (
    <div className="zone-e">
      <span
        style={{
          font: "500 9px var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".07em",
          textTransform: "uppercase",
          flexShrink: 0,
        }}
      >
        Alerts
      </span>
      {alerts.length === 0 && (
        <span
          style={{
            font: "400 12px var(--font-sans)",
            color: "var(--fg-tertiary)",
          }}
        >
          No active alerts for this provider.
        </span>
      )}
      {alerts.map((a) => (
        <div
          key={a.id}
          className={"alert-card alert-" + a.sev}
          onClick={() => onAlertClick(a)}
        >
          <span className="alert-icon">{sevIcon(a)}</span>
          <div>
            <div className="alert-title">{a.title}</div>
            <div className="alert-desc">{a.desc}</div>
            <span className="alert-sev" style={{ background: "currentColor" }}>
              <span style={{ color: "white", mixBlendMode: "normal" }}>
                {a.sev.toUpperCase()}
              </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
export { ZoneA, ZoneB, ZoneC, ZoneD, ZoneE };
