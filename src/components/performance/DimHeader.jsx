import {
  S9_DIMENSIONS,
  S9_ICHOM_SETS_D1,
  S9_ICHOM_SETS_D2,
  VBHC_fmtScore,
  VBHC_fmtThreshold,
  S9_COST_DATA,
  S9_ADA_GUIDELINES,
  S9_D9_EQUITY,
} from "@/mock/performance";
import React from "react";
import { Icons } from "../Icons/Icons";
import { Sparkline } from "./Charts";
import { CostWaterfall } from "./Charts2";
const { useState: useL1State, useMemo: useL1Memo } = React;

/* ── Dimension scores for Dr. Fatima, Contract 1, Q4 2025 ──────────────── */
const DIM_SCORES_C1 = { D1: 95, D2: 90, D3: 88, D5: 91, D7: 94, D9: 90 };
const DIM_COMPOSITES = { composite: 92, period: "Q4 2025", prevComposite: 91 };
const CONTRACT1_DIMS = { D1: 30, D2: 20, D3: 10, D5: 15, D7: 15, D9: 10 };

/* ── Dimension header strip ─────────────────────────────────────────────── */
function DimHeader({ dimId, score, weight, contract }) {
  const dim = S9_DIMENSIONS[dimId];
  if (!dim) return null;
  const contribution = ((score * weight) / 100).toFixed(1);
  const prevScore = Math.max(0, score - 2 + Math.floor(Math.random() * 3));
  const delta = score - prevScore;

  const tierColor =
    score >= 90
      ? "var(--perf-exceeds)"
      : score >= 75
        ? "var(--perf-target)"
        : score >= 60
          ? "var(--perf-below)"
          : "var(--perf-floor)";
  const tierLabel =
    score >= 90
      ? "Exceeds Stretch"
      : score >= 75
        ? "At Target"
        : score >= 60
          ? "Below Target"
          : "Below Floor";

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: ".5px solid var(--border-default)",
        borderRadius: 14,
        padding: "18px 24px",
        marginBottom: 14,
        boxShadow: "var(--shadow-card)",
        borderLeft: `4px solid ${dim.color}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              flexShrink: 0,
              background: dim.color + "20",
              border: `.5px solid ${dim.color}`,
              display: "grid",
              placeItems: "center",
            }}
          >
            <span
              style={{
                font: "700 14px var(--font-mono)",
                color: dim.color,
                letterSpacing: ".04em",
              }}
            >
              {dimId}
            </span>
          </div>
          <div>
            <h1
              style={{
                font: "600 22px/28px var(--font-sans)",
                margin: "0 0 4px",
                letterSpacing: "-.01em",
                color: "var(--fg-primary)",
              }}
            >
              {dim.name}
            </h1>
            <p
              style={{
                font: "400 13px/18px var(--font-sans)",
                color: "var(--fg-secondary)",
                margin: "0 0 8px",
              }}
            >
              {dim.def}
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span
                style={{
                  font: "500 10px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  background: "var(--bg-elevated)",
                  padding: "3px 9px",
                  borderRadius: 9999,
                  border: ".5px solid var(--border-default)",
                }}
              >
                Weight in contract: {weight}%
              </span>
              <span
                style={{
                  font: "500 10px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  background: "var(--bg-elevated)",
                  padding: "3px 9px",
                  borderRadius: 9999,
                  border: ".5px solid var(--border-default)",
                }}
              >
                Contributes {contribution} pts to composite{" "}
                {DIM_COMPOSITES.composite}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexShrink: 0,
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                font: "500 9px var(--font-mono)",
                color: "var(--fg-tertiary)",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Dimension Score
            </div>
            <div
              style={{
                font: "700 44px/1 var(--font-sans)",
                color: tierColor,
                letterSpacing: "-.02em",
              }}
            >
              {score}
            </div>
            <div
              style={{
                font: "500 10px var(--font-sans)",
                color: tierColor,
                marginTop: 2,
              }}
            >
              {tierLabel}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                font: "500 9px var(--font-mono)",
                color: "var(--fg-tertiary)",
                letterSpacing: ".06em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              vs Previous
            </div>
            <div
              style={{
                font: "600 20px/1 var(--font-sans)",
                color: delta >= 0 ? "var(--perf-target)" : "var(--perf-floor)",
              }}
            >
              {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}
            </div>
            <div
              style={{
                font: "400 10px var(--font-mono)",
                color: "var(--fg-tertiary)",
                marginTop: 2,
              }}
            >
              from Q3 2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Dimension tab selector ─────────────────────────────────────────────── */
function DimTabSelector({ activeDim, activeDims, onSelect }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        padding: "6px",
        background: "var(--bg-surface)",
        border: ".5px solid var(--border-default)",
        borderRadius: 14,
        boxShadow: "var(--shadow-card)",
        marginBottom: 14,
        overflowX: "auto",
      }}
    >
      {Object.entries(S9_DIMENSIONS).map(([id, dim]) => {
        const isActive = activeDims.includes(id);
        const isSelected = id === activeDim;
        return (
          <button
            key={id}
            disabled={!isActive}
            onClick={() => isActive && onSelect(id)}
            style={{
              padding: "6px 12px",
              borderRadius: 9999,
              border: 0,
              cursor: isActive ? "pointer" : "not-allowed",
              font: "500 12px var(--font-sans)",
              background: isSelected ? dim.color : "transparent",
              color: isSelected
                ? "white"
                : isActive
                  ? "var(--fg-secondary)"
                  : "var(--fg-tertiary)",
              opacity: isActive ? 1 : 0.4,
              transition: "all .12s",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ font: "600 10px var(--font-mono)", marginRight: 5 }}>
              {id}
            </span>
            {dim.short}
          </button>
        );
      })}
    </div>
  );
}

/* ── ICHOM Set Card (D1/D2) ─────────────────────────────────────────────── */
function IchomSetCard({ set, dimId, onClick }) {
  const statusColor =
    set.score >= 90
      ? "var(--perf-exceeds)"
      : set.score >= 75
        ? "var(--perf-target)"
        : set.score >= 60
          ? "var(--perf-below)"
          : "var(--perf-floor)";
  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        padding: 20,
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow .15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-popover)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-card)")
      }
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: set.familyColor,
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div>
          <div
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".07em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            {set.id} · {set.code}
          </div>
          <h3
            style={{
              font: "600 16px/20px var(--font-sans)",
              margin: 0,
              color: "var(--fg-primary)",
            }}
          >
            {set.name}
          </h3>
          <span
            style={{
              font: "500 10px var(--font-mono)",
              color: set.familyColor,
              background: set.familyColor + "18",
              padding: "2px 8px",
              borderRadius: 9999,
              display: "inline-block",
              marginTop: 4,
            }}
          >
            {set.family}
          </span>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{ font: "700 28px/1 var(--font-sans)", color: statusColor }}
          >
            {set.score.toFixed(1)}
          </div>
          <div
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
            }}
          >
            /100 · {set.period}
          </div>
          <div
            style={{
              font: "500 10px var(--font-sans)",
              color:
                set.trend >= 0 ? "var(--perf-target)" : "var(--perf-floor)",
              marginTop: 2,
            }}
          >
            {set.trend >= 0 ? "▲" : "▼"} {Math.abs(set.trend).toFixed(1)}pp
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: dimId === "D2" ? 12 : 0,
        }}
      >
        <span
          style={{
            font: "500 10px var(--font-mono)",
            color: "var(--fg-tertiary)",
          }}
        >
          {set.outcomeVars} outcome variables
        </span>
        <span style={{ color: "var(--border-default)" }}>·</span>
        <span
          style={{
            font: "500 10px var(--font-mono)",
            color: "var(--fg-secondary)",
          }}
        >
          Data completeness {set.completeness}%
        </span>
      </div>
      {/* Completeness bar */}
      <div
        style={{
          height: 4,
          background: "var(--bg-elevated)",
          borderRadius: 9999,
          overflow: "hidden",
          marginBottom: dimId === "D2" ? 12 : 0,
        }}
      >
        <div
          style={{
            width: set.completeness + "%",
            height: "100%",
            background:
              set.completeness >= 80
                ? "var(--perf-target)"
                : "var(--perf-below)",
            borderRadius: 9999,
          }}
        />
      </div>
      {/* D2: PROMs completion by timepoint */}
      {dimId === "D2" && set.collectionByTimepoint && (
        <div style={{ marginTop: 4 }}>
          <div
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            PROMs Collection Rate by Timepoint
          </div>
          {set.collectionByTimepoint.map((tp, i) => {
            const opacity = 0.85 - i * 0.15;
            return (
              <div
                key={tp.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    font: "400 10px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    width: 70,
                    flexShrink: 0,
                  }}
                >
                  {tp.label}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 12,
                    background: "var(--bg-elevated)",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: tp.pct + "%",
                      height: "100%",
                      background: "var(--accent)",
                      opacity,
                      borderRadius: 6,
                    }}
                  />
                </div>
                <span
                  style={{
                    font: "600 10px var(--font-mono)",
                    color: "var(--accent)",
                    width: 32,
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {tp.pct}%
                </span>
              </div>
            );
          })}
        </div>
      )}
      <div
        style={{
          marginTop: 12,
          font: "500 10px var(--font-sans)",
          color: "var(--accent)",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        Click to explore variables →
      </div>
    </div>
  );
}

/* ── D1/D2 Layout ───────────────────────────────────────────────────────── */
function IchomLayout({ dimId, onOpenL2A, onOpenL2B }) {
  const sets = dimId === "D1" ? S9_ICHOM_SETS_D1 : S9_ICHOM_SETS_D2;
  return (
    <div>
      <div
        style={{
          font: "500 10px var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".07em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        ICHOM Standard Sets active in this dimension — Contract 1
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))",
          gap: 14,
        }}
      >
        {sets.map((set) => (
          <IchomSetCard
            key={set.id}
            set={set}
            dimId={dimId}
            onClick={() => (dimId === "D2" ? onOpenL2B(set) : onOpenL2A(set))}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Dimension Composition Bar ──────────────────────────────────────────── */
function DimCompositionBar({ measures, scores }) {
  const statuses = measures.map((m) => {
    const s = scores[m.id] || {};
    if (!s.status) return "target";
    return s.status.key;
  });
  const met = statuses.filter((s) => s === "target" || s === "exceeds").length;
  const below = statuses.filter((s) => s === "below").length;
  const floor = statuses.filter((s) => s === "floor").length;
  const total = measures.length;
  const metPct = Math.round((met / total) * 100);
  const belowPct = Math.round((below / total) * 100);
  const floorPct = 100 - metPct - belowPct;
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          font: "500 9px var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".07em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        Dimension Composition
      </div>
      <div
        style={{
          display: "flex",
          height: 24,
          borderRadius: 6,
          overflow: "hidden",
          gap: 1,
        }}
      >
        {metPct > 0 && (
          <div
            style={{
              flex: metPct,
              background: "var(--perf-target)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ font: "600 10px var(--font-sans)", color: "white" }}>
              {met} met
            </span>
          </div>
        )}
        {belowPct > 0 && (
          <div
            style={{
              flex: belowPct,
              background: "var(--perf-below)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ font: "600 10px var(--font-sans)", color: "white" }}>
              {below} approaching
            </span>
          </div>
        )}
        {floorPct > 0 && floor > 0 && (
          <div
            style={{
              flex: floorPct,
              background: "var(--perf-floor)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ font: "600 10px var(--font-sans)", color: "white" }}>
              {floor} missed
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── D3–D10 Measure Table ───────────────────────────────────────────────── */
function AiqlMeasureTable({
  dimId,
  measures,
  provider,
  contract,
  periodIdx,
  onRowClick,
}) {
  const [sortCol, setSortCol] = useL1State("status");
  const [sortDir, setSortDir] = useL1State("asc");

  const rows = useL1Memo(
    () =>
      measures.map((m) => {
        const seed = parseInt(m.id.slice(-3));
        const adj = m.target * (0.9 + (seed % 20) / 100);
        const status = {
          key:
            adj >= m.stretch
              ? "exceeds"
              : adj >= m.target
                ? "target"
                : adj >= m.floor
                  ? "below"
                  : "floor",
          label:
            adj >= m.stretch
              ? "Exceeds"
              : adj >= m.target
                ? "At Target"
                : adj >= m.floor
                  ? "Below Target"
                  : "Below Floor",
          rank:
            adj >= m.stretch ? 3 : adj >= m.target ? 2 : adj >= m.floor ? 1 : 0,
        };
        const trend = [adj * 0.95, adj * 0.97, adj * 0.99, adj];
        const withinDimWeight = Math.round(100 / measures.length);
        return { ...m, adj, status, trend, withinDimWeight };
      }),
    [measures],
  );

  const sorted = useL1Memo(
    () =>
      [...rows].sort((a, b) => {
        const va =
          sortCol === "status"
            ? a.status.rank
            : sortCol === "name"
              ? a.name
              : a.adj;
        const vb =
          sortCol === "status"
            ? b.status.rank
            : sortCol === "name"
              ? b.name
              : b.adj;
        return sortDir === "asc" ? (va < vb ? -1 : 1) : va > vb ? -1 : 1;
      }),
    [rows, sortCol, sortDir],
  );

  const sc = {
    exceeds: "var(--perf-exceeds)",
    target: "var(--perf-target)",
    below: "var(--perf-below)",
    floor: "var(--perf-floor)",
  };
  const scoreLookup = Object.fromEntries(rows.map((r) => [r.id, r]));

  return (
    <div
      className="zone-d"
      style={{ flex: "none", maxHeight: 340, height: "auto" }}
    >
      <div className="zone-d-head">
        <span
          style={{
            font: "500 10px var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
          }}
        >
          {dimId} Measures — {measures.length} active
        </span>
        <DimCompositionBar measures={measures} scores={scoreLookup} />
      </div>
      <div className="zone-d-scroll">
        <table className="measure-tbl">
          <thead>
            <tr>
              <th style={{ width: 72 }}>ID</th>
              <th
                onClick={() => {
                  setSortCol("name");
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                }}
              >
                Measure ↕
              </th>
              <th
                onClick={() => {
                  setSortCol("adj");
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                }}
                style={{ width: 80 }}
              >
                Score ↕
              </th>
              <th style={{ width: 72 }}>Target</th>
              <th
                onClick={() => {
                  setSortCol("status");
                  setSortDir((d) => (d === "asc" ? "desc" : "asc"));
                }}
                style={{ width: 110 }}
              >
                Status ↕
              </th>
              <th style={{ width: 68 }}>Trend</th>
              <th style={{ width: 68 }}>Dim Wt.</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row) => (
              <tr
                key={row.id}
                className={"status-row-" + row.status.key}
                onClick={() => onRowClick(row)}
              >
                <td>
                  <span className="m-id">{row.id}</span>
                </td>
                <td>
                  <span className="m-name" title={row.name}>
                    {row.shortName}
                  </span>
                </td>
                <td>
                  <span
                    className="m-score"
                    style={{ color: sc[row.status.key] }}
                  >
                    {VBHC_fmtScore(row.adj, row.unit)}
                  </span>
                </td>
                <td>
                  <span className="mono">
                    {VBHC_fmtThreshold(row.target, row.unit, row.lowerBetter)}
                  </span>
                </td>
                <td>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 5 }}
                  >
                    <span
                      className="status-dot"
                      style={{ background: sc[row.status.key] }}
                    />
                    <span
                      style={{
                        font: "500 10px var(--font-sans)",
                        color: sc[row.status.key],
                      }}
                    >
                      {row.status.label}
                    </span>
                  </div>
                </td>
                <td>
                  <Sparkline
                    values={row.trend}
                    color={sc[row.status.key]}
                    width={56}
                    height={18}
                  />
                </td>
                <td>
                  <span className="mono">{row.withinDimWeight}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Dimension-specific context panels ──────────────────────────────────── */
function DimContextPanel({ dimId }) {
  const card = (title, content) => (
    <div className="card" style={{ padding: 18, marginTop: 14 }}>
      <div
        style={{
          font: "500 10px var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".07em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {title}
      </div>
      {content}
    </div>
  );

  if (dimId === "D3")
    return card(
      "Latest Survey Cycle — Patient Experience",
      <div>
        <div className="metric-row" style={{ marginBottom: 12 }}>
          {[
            ["Response Rate", "72.4%"],
            ["Mean Satisfaction", "4.1 / 5"],
            ["Survey Period", "Q4 2025"],
          ].map(([l, v]) => (
            <div key={l} className="metric-box">
              <div className="m-label">{l}</div>
              <div className="m-val">{v}</div>
            </div>
          ))}
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          {[
            {
              title: "Top Strengths",
              items: S9_D3_SURVEY.strengths,
              color: "var(--perf-target)",
            },
            {
              title: "Areas for Improvement",
              items: S9_D3_SURVEY.improvements,
              color: "var(--perf-below)",
            },
          ].map((section) => (
            <div key={section.title}>
              <div
                style={{
                  font: "500 10px var(--font-mono)",
                  color: section.color,
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                  marginBottom: 6,
                }}
              >
                {section.title}
              </div>
              {section.items.map((item, i) => (
                <div
                  key={i}
                  style={{ display: "flex", gap: 8, marginBottom: 5 }}
                >
                  <span
                    style={{
                      color: section.color,
                      flexShrink: 0,
                      fontSize: 12,
                      marginTop: 1,
                    }}
                  >
                    •
                  </span>
                  <span
                    style={{
                      font: "400 11px/16px var(--font-sans)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>,
    );

  if (dimId === "D5")
    return card(
      "Guideline Coverage — Process Quality",
      <div>
        <p
          style={{
            font: "400 12px/18px var(--font-sans)",
            color: "var(--fg-secondary)",
            margin: "0 0 12px",
          }}
        >
          D5 measures are derived from ADA 2024 Standards of Care and APA
          Clinical Practice Guidelines. Overall composite adherence for this
          provider:{" "}
          <strong style={{ color: "var(--perf-target)" }}>80.2%</strong>.
        </p>
        <table className="l2-table">
          <thead>
            <tr>
              <th>Guideline Req.</th>
              <th>Description</th>
              <th style={{ textAlign: "right" }}>Compliance</th>
            </tr>
          </thead>
          <tbody>
            {S9_ADA_GUIDELINES.slice(0, 4).map((g) => {
              const met = g.pct >= g.target;
              return (
                <tr key={g.id}>
                  <td>
                    <span className="m-id">{g.id}</span>
                  </td>
                  <td
                    style={{
                      font: "400 11px var(--font-sans)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {g.req}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span
                      style={{
                        font: "600 11px var(--font-mono)",
                        color: met ? "var(--perf-target)" : "var(--perf-below)",
                      }}
                    >
                      {g.pct}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          className="btn ghost"
          style={{ marginTop: 8, color: "var(--accent)", fontSize: 11 }}
          onClick={() =>
            window.__toast &&
            window.__toast(
              "Navigates to Guideline Adherence Detail (Session 11 — Screen 3.4)",
            )
          }
        >
          View Full Guideline Adherence → Screen 3.4 (Session 11)
        </button>
      </div>,
    );

  if (dimId === "D7")
    return card(
      "Cost Summary — Total Cost of Care",
      <div>
        <div className="metric-row" style={{ marginBottom: 12 }}>
          {[
            {
              label: "Mean Cost / Patient",
              val: "SAR 42,800",
              sub: "vs SAR 46,200 network avg",
              color: "var(--perf-target)",
            },
            {
              label: "Savings vs Network",
              val: "SAR 3,400",
              sub: "per patient, per period",
            },
            {
              label: "Total Panel Cost",
              val: "SAR 14.6M",
              sub: "Q4 2025 period",
            },
          ].map((x) => (
            <div
              key={x.label}
              className="metric-box"
              style={{ borderColor: x.color }}
            >
              <div className="m-label">{x.label}</div>
              <div
                className="m-val"
                style={{ color: x.color || "var(--fg-primary)", fontSize: 16 }}
              >
                {x.val}
              </div>
              {x.sub && <div className="m-sub">{x.sub}</div>}
            </div>
          ))}
        </div>
        <div
          style={{
            font: "500 9px var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Cost Breakdown vs Network Average
        </div>
        <CostWaterfall
          items={S9_COST_DATA.breakdown}
          total={S9_COST_DATA.providerMean}
          networkTotal={S9_COST_DATA.networkMean}
          width={420}
          height={160}
        />
      </div>,
    );

  if (dimId === "D9")
    return card(
      "Equity Alert Summary — Health Equity",
      <div>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div
            className="metric-box"
            style={{
              borderColor: "var(--perf-below)",
              background: "var(--perf-below-soft)",
            }}
          >
            <div className="m-label">Significant Disparities</div>
            <div className="m-val" style={{ color: "var(--perf-below)" }}>
              {S9_D9_EQUITY.significantDisparities}
            </div>
            <div className="m-sub">Across D1–D8 metrics</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {S9_D9_EQUITY.findings.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 8,
                background: "var(--perf-below-soft)",
                border: ".5px solid var(--perf-below)",
              }}
            >
              <span
                style={{
                  color: "var(--perf-below)",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {Icons.warning}
              </span>
              <span
                style={{
                  font: "400 12px/18px var(--font-sans)",
                  color: "var(--fg-primary)",
                }}
              >
                {f}
              </span>
            </div>
          ))}
        </div>
      </div>,
    );

  return null;
}

/* ── D3–D10 Layout ──────────────────────────────────────────────────────── */
function AiqlLayout({ dimId, measures, onMeasureClick }) {
  if (!measures || measures.length === 0) {
    return (
      <div className="empty">
        <div className="big">No active measures</div>This dimension has no
        measures in the current contract.
      </div>
    );
  }
  return (
    <div>
      <AiqlMeasureTable
        dimId={dimId}
        measures={measures}
        provider={{ id: "P01" }}
        contract={{ dims: CONTRACT1_DIMS }}
        periodIdx={3}
        onRowClick={onMeasureClick}
      />
      <DimContextPanel dimId={dimId} />
    </div>
  );
}

export { DimHeader, DimTabSelector, IchomLayout, AiqlLayout };
