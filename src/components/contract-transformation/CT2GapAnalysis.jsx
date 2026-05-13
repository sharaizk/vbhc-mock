import { GAP_DIMENSIONS, OVERALL_MATURITY } from "@/mock/transformation";
import React from "react";
const { useState: ct2UseState } = React;

/* ── SVG Radar Chart ─────────────────────────────────────────────────────── */
function RadarChart8({ dims, size = 480 }) {
  const n = 8;
  const cx = size / 2,
    cy = size / 2;
  const r = size * 0.34;
  const angle = (i) => (i / n) * 2 * Math.PI - Math.PI / 2;
  const pt = (score, i) => ({
    x: cx + (score / 100) * r * Math.cos(angle(i)),
    y: cy + (score / 100) * r * Math.sin(angle(i)),
  });

  const benchPts = dims.map((d, i) => pt(d.benchmark, i));
  const currPts = dims.map((d, i) => pt(d.score, i));
  const gridLevels = [20, 40, 60, 80, 100];

  const polyStr = (pts) => pts.map((p) => `${p.x},${p.y}`).join(" ");

  // label offset (beyond axis tip)
  const labelPt = (i) => {
    const a = angle(i);
    return { x: cx + (r + 36) * Math.cos(a), y: cy + (r + 36) * Math.sin(a) };
  };

  const SEV_COLOR = {
    critical: "oklch(0.50 0.18 25)",
    high: "oklch(0.55 0.14 60)",
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible", display: "block", margin: "0 auto" }}
    >
      <defs>
        <radialGradient id="bench-fill" cx="50%" cy="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.06" />
        </radialGradient>
        <radialGradient id="curr-fill" cx="50%" cy="50%">
          <stop
            offset="0%"
            stopColor="oklch(0.50 0.18 25)"
            stopOpacity="0.45"
          />
          <stop
            offset="100%"
            stopColor="oklch(0.50 0.18 25)"
            stopOpacity="0.1"
          />
        </radialGradient>
      </defs>

      {/* Grid rings */}
      {gridLevels.map((lv) => {
        const pts = Array.from({ length: n }, (_, i) => pt(lv, i));
        return (
          <polygon
            key={lv}
            points={polyStr(pts)}
            fill="none"
            stroke="var(--border-default)"
            strokeWidth=".5"
          />
        );
      })}
      {/* Grid labels */}
      {[20, 40, 60, 80, 100].map((lv) => (
        <text
          key={lv}
          x={cx + 2}
          y={cy - (lv / 100) * r + 4}
          textAnchor="start"
          fontSize="8"
          fill="var(--fg-tertiary)"
          fontFamily="var(--font-mono)"
        >
          {lv}
        </text>
      ))}

      {/* Axes */}
      {dims.map((_, i) => (
        <line
          key={i}
          x1={cx}
          y1={cy}
          x2={pt(100, i).x}
          y2={pt(100, i).y}
          stroke="var(--border-default)"
          strokeWidth=".7"
        />
      ))}

      {/* Benchmark polygon */}
      <polygon
        points={polyStr(benchPts)}
        fill="url(#bench-fill)"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeOpacity="0.9"
      />

      {/* Current contract polygon */}
      <polygon
        points={polyStr(currPts)}
        fill="url(#curr-fill)"
        stroke="oklch(0.50 0.18 25)"
        strokeWidth="2.5"
      />

      {/* Score dots — current */}
      {dims.map((d, i) => {
        const p = pt(d.score, i);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={d.score > 3 ? 4 : 3}
            fill="oklch(0.50 0.18 25)"
            stroke="var(--bg-surface)"
            strokeWidth="1.5"
          />
        );
      })}

      {/* Axis labels */}
      {dims.map((d, i) => {
        const lp = labelPt(i);
        return (
          <g key={i}>
            <text
              x={lp.x}
              y={lp.y - 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fill="var(--fg-primary)"
              fontFamily="var(--font-mono)"
              fontWeight="700"
            >
              {d.code}
            </text>
            <text
              x={lp.x}
              y={lp.y + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill={SEV_COLOR[d.severity] || "var(--fg-tertiary)"}
              fontFamily="var(--font-sans)"
            >
              {d.score}/100
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Gap card ────────────────────────────────────────────────────────────── */
function GapCard({ dim, onExpand, isExpanded }) {
  const sevStyle = {
    critical: {
      bg: "oklch(0.95 0.05 25)",
      border: "oklch(0.75 0.12 25)",
      color: "oklch(0.45 0.18 25)",
      label: "Critical",
    },
    high: {
      bg: "oklch(0.96 0.04 60)",
      border: "oklch(0.75 0.10 60)",
      color: "oklch(0.42 0.14 60)",
      label: "High",
    },
  }[dim.severity] || {
    bg: "var(--bg-elevated)",
    border: "var(--border-default)",
    color: "var(--fg-tertiary)",
    label: dim.severity,
  };

  const scoreColor =
    dim.score < 15
      ? "oklch(0.50 0.18 25)"
      : dim.score < 40
        ? "oklch(0.55 0.14 60)"
        : "oklch(0.40 0.16 145)";

  return (
    <div
      className={"ct2-gap-card" + (isExpanded ? " expanded" : "")}
      style={{
        "--sev-bg": sevStyle.bg,
        "--sev-border": sevStyle.border,
        "--sev-color": sevStyle.color,
      }}
      onClick={onExpand}
    >
      <div className="ct2-gc-head">
        <div className="ct2-gc-left">
          <span className="ct2-gc-code">{dim.code}</span>
          <span className="ct2-gc-name">{dim.name}</span>
          <span className="ct2-sev-badge">{sevStyle.label}</span>
        </div>
        <div className="ct2-gc-right">
          <div className="ct2-score-bar">
            <div
              style={{
                width: `${dim.score}%`,
                height: "100%",
                background: scoreColor,
                borderRadius: 9999,
                transition: "width .4s",
              }}
            />
          </div>
          <span className="ct2-score-val" style={{ color: scoreColor }}>
            {dim.score}
          </span>
          <span
            style={{
              color: "var(--fg-tertiary)",
              transform: isExpanded ? "rotate(180deg)" : "",
              transition: "transform .15s",
            }}
          >
            ▾
          </span>
        </div>
      </div>
      <div className="ct2-gc-finding">{dim.finding}</div>

      {isExpanded && (
        <div className="ct2-gc-detail" onClick={(e) => e.stopPropagation()}>
          {dim.contractClauses?.length > 0 && (
            <div className="ct2-clauses">
              <div className="ct2-cl-head">Contract clauses analysed</div>
              {dim.contractClauses.map((c, i) => (
                <div key={i} className="ct2-clause-row">
                  <span className="ref">{c.ref}</span>
                  <blockquote className="quote">{c.quote}</blockquote>
                  <div className="issue">Issue: {c.issue}</div>
                </div>
              ))}
            </div>
          )}
          {dim.methodology && (
            <div className="ct2-methodology">
              <div className="ct2-cl-head">Scoring methodology</div>
              <p>{dim.methodology}</p>
            </div>
          )}
          {dim.recommendations?.length > 0 && (
            <div className="ct2-recs">
              <div className="ct2-cl-head">Transformation recommendations</div>
              <ul>
                {dim.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CT2GapAnalysis({ onComplete }) {
  const dims = GAP_DIMENSIONS || [];
  const overall = OVERALL_MATURITY || {};
  const [expanded, setExpanded] = ct2UseState(null);

  const toggle = (id) => setExpanded((e) => (e === id ? null : id));

  const critCount = dims.filter((d) => d.severity === "critical").length;
  const highCount = dims.filter((d) => d.severity === "high").length;
  const avgScore = Math.round(
    dims.reduce((a, d) => a + d.score, 0) / dims.length,
  );

  return (
    <div className="ct2-page">
      <div className="ct2-page-head">
        <div>
          <div className="rs-crumb">Step 2 · Gap Analysis</div>
          <h2 className="rs-title">8-Dimension Contract Maturity Assessment</h2>
          <p
            style={{
              font: "400 13px/18px var(--font-sans)",
              color: "var(--fg-secondary)",
              marginTop: 4,
              maxWidth: 620,
            }}
          >
            AiQL has assessed the uploaded contract across 8 maturity
            dimensions. The radar chart shows the gap between the current
            contract (red) and the industry benchmark (teal). The larger the
            gap, the greater the transformation opportunity.
          </p>
        </div>
        <div className="ct2-overall-score">
          <div className="ct2-os-num" style={{ color: "oklch(0.50 0.18 25)" }}>
            {overall.score}
          </div>
          <div className="ct2-os-label">Contract Maturity Score</div>
          <div className="ct2-os-detail">{overall.label}</div>
        </div>
      </div>

      {/* Radar + summary stats */}
      <div className="ct2-radar-layout">
        <div className="ct2-radar-wrap">
          <RadarChart8 dims={dims} size={440} />
          <div className="ct2-radar-legend">
            <div className="ct2-rl-item">
              <span
                style={{
                  width: 16,
                  height: 3,
                  background: "var(--accent)",
                  display: "inline-block",
                  borderRadius: 9999,
                }}
              />{" "}
              Industry benchmark (avg{" "}
              {Math.round(
                dims.reduce((a, d) => a + d.benchmark, 0) / dims.length,
              )}
              /100)
            </div>
            <div className="ct2-rl-item">
              <span
                style={{
                  width: 16,
                  height: 3,
                  background: "oklch(0.50 0.18 25)",
                  display: "inline-block",
                  borderRadius: 9999,
                }}
              />{" "}
              This contract (avg {avgScore}/100)
            </div>
          </div>
        </div>

        <div className="ct2-radar-stats">
          <div className="ct2-maturity-banner">
            <div className="ct2-mb-title">
              Contract Maturity Score: {overall.score}/100
            </div>
            <div className="ct2-mb-gauge">
              <div
                style={{
                  width: `${overall.score}%`,
                  height: "100%",
                  background: "oklch(0.50 0.18 25)",
                  borderRadius: 9999,
                }}
              />
            </div>
            <p className="ct2-mb-detail">{overall.detail}</p>
          </div>
          <div className="ct2-sev-summary">
            <div className="ct2-ss-item crit">
              <div className="n">{critCount}</div>
              <div className="l">Critical gaps</div>
            </div>
            <div className="ct2-ss-item high">
              <div className="n">{highCount}</div>
              <div className="l">High gaps</div>
            </div>
            <div className="ct2-ss-item">
              <div className="n">{dims.length}</div>
              <div className="l">Dims assessed</div>
            </div>
          </div>
          <div className="ct2-dim-scores">
            {dims.map((d) => {
              const c =
                d.score < 15
                  ? "oklch(0.50 0.18 25)"
                  : d.score < 40
                    ? "oklch(0.55 0.14 60)"
                    : "var(--accent)";
              return (
                <div
                  key={d.id}
                  className="ct2-dim-score-row"
                  onClick={() => toggle(d.id)}
                >
                  <span className="code">{d.code}</span>
                  <div className="bar-track">
                    <div
                      style={{
                        width: `${d.score}%`,
                        height: "100%",
                        background: c,
                        borderRadius: 9999,
                      }}
                    />
                  </div>
                  <span className="score" style={{ color: c }}>
                    {d.score}
                  </span>
                  <span className="bench">vs {d.benchmark}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Gap cards */}
      <div className="ct2-cards-section">
        <div className="ct2-cs-head">
          <h3 className="rs-h3" style={{ margin: 0 }}>
            Detailed findings · click any card to expand
          </h3>
        </div>
        <div className="ct2-cards-grid">
          {dims.map((d) => (
            <GapCard
              key={d.id}
              dim={d}
              isExpanded={expanded === d.id}
              onExpand={() => toggle(d.id)}
            />
          ))}
        </div>
      </div>

      <div className="rs-panel-foot" style={{ padding: "16px 0" }}>
        <button className="cd-btn primary" onClick={() => onComplete(2)}>
          Proceed to Transformation Options →
        </button>
      </div>
    </div>
  );
}
export default CT2GapAnalysis;
