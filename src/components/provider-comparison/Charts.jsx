import { funnelLimits, S12_COLORS, S12_HISTORY } from "@/mock/provider-comparison";
import React from "react";

/* ── Multi-provider Radar Overlay ────────────────────────────────────────── */
function MultiRadar({
  providers,
  dimScores,
  dims,
  dimLabels,
  targetScore = 75,
  size = 280,
}) {
  const n = dims.length;
  if (n < 3) return null;
  const cx = size / 2,
    cy = size / 2,
    R = size * 0.36,
    labelR = R + 26;
  const [hovAxis, setHovAxis] = React.useState(null);

  function pt(score, i) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (Math.max(0, Math.min(100, score)) / 100) * R;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }
  function lp(i) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + labelR * Math.cos(angle),
      y: cy + labelR * Math.sin(angle),
    };
  }
  function ptStr(score, i) {
    const p = pt(score, i);
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }

  const rings = [25, 50, 75, 100];
  const targetPts = dims.map((_, i) => ptStr(targetScore, i)).join(" ");

  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {rings.map((r) => (
        <polygon
          key={r}
          points={dims.map((_, i) => ptStr(r, i)).join(" ")}
          fill="none"
          stroke="var(--border-default)"
          strokeWidth={r === 100 ? 0.8 : 0.4}
        />
      ))}
      {dims.map((_, i) => {
        const p = pt(100, i);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x.toFixed(1)}
            y2={p.y.toFixed(1)}
            stroke="var(--border-default)"
            strokeWidth="0.4"
          />
        );
      })}
      {/* Target polygon */}
      <polygon
        points={targetPts}
        fill="var(--accent-soft)"
        fillOpacity="0.3"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="5,3"
      />
      {/* Provider polygons */}
      {providers.map((prov, pi) => {
        const scores = dims.map((d) => dimScores[prov.id]?.[d] || 0);
        const pts = scores.map((s, i) => ptStr(s, i)).join(" ");
        const color = S12_COLORS[prov.id] || "var(--fg-tertiary)";
        return (
          <g key={prov.id}>
            <polygon
              points={pts}
              fill={color}
              fillOpacity="0.08"
              stroke={color}
              strokeWidth="2"
            />
            {scores.map((s, i) => {
              const p = pt(s, i);
              return (
                <circle
                  key={i}
                  cx={p.x.toFixed(1)}
                  cy={p.y.toFixed(1)}
                  r="3.5"
                  fill={color}
                  stroke="white"
                  strokeWidth="1.2"
                />
              );
            })}
          </g>
        );
      })}
      {/* Axis labels with hover tooltip */}
      {dims.map((d, i) => {
        const p = lp(i);
        const anchor =
          Math.abs(Math.cos((Math.PI * 2 * i) / n - Math.PI / 2)) < 0.1
            ? "middle"
            : Math.cos((Math.PI * 2 * i) / n - Math.PI / 2) > 0
              ? "start"
              : "end";
        const isHov = hovAxis === i;
        return (
          <g
            key={d}
            style={{ cursor: "pointer" }}
            onMouseEnter={() => setHovAxis(i)}
            onMouseLeave={() => setHovAxis(null)}
          >
            <text
              x={p.x.toFixed(1)}
              y={p.y.toFixed(1)}
              textAnchor={anchor}
              dominantBaseline="central"
              fill={isHov ? "var(--accent)" : "var(--fg-secondary)"}
              style={{
                font: "600 9px var(--font-mono)",
                letterSpacing: ".04em",
                textTransform: "uppercase",
              }}
            >
              {dimLabels[d] || d}
            </text>
            {isHov && (
              <g>
                <rect
                  x={cx - 90}
                  y={cy + R + 8}
                  width={180}
                  height={providers.length * 16 + 12}
                  rx="6"
                  fill="var(--fg-primary)"
                  opacity="0.92"
                />
                {providers.map((prov, pi) => {
                  const color = S12_COLORS[prov.id] || "var(--fg-tertiary)";
                  const score = dimScores[prov.id]?.[d] || 0;
                  return (
                    <text
                      key={prov.id}
                      x={cx - 82}
                      y={cy + R + 20 + pi * 16}
                      fill={color}
                      style={{ font: "500 9px var(--font-sans)" }}
                    >
                      {prov.name.split(" ").slice(-1)}: {score}
                    </text>
                  );
                })}
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Funnel Plot ─────────────────────────────────────────────────────────── */
function FunnelPlot({
  providers,
  networkMean = 72,
  width = 480,
  height = 280,
}) {
  const pad = { l: 48, r: 16, t: 20, b: 32 };
  const cw = width - pad.l - pad.r,
    ch = height - pad.t - pad.b;
  const minN = 150,
    maxN = 550;
  const minScore = 45,
    maxScore = 100;

  function sx(n) {
    return pad.l + ((n - minN) / (maxN - minN)) * cw;
  }
  function sy(s) {
    return pad.t + ch - ((s - minScore) / (maxScore - minScore)) * ch;
  }

  // Compute funnel curve points
  const nPoints = Array.from(
    { length: 40 },
    (_, i) => minN + (i * (maxN - minN)) / 39,
  );
  function curve(mult) {
    return nPoints.map((n) => {
      const lim = funnelLimits(n, networkMean, mult);
      return lim;
    });
  }
  const c95 = curve(1.96);
  const c997 = curve(3.0);

  const uc95Pts = nPoints
    .map((n, i) => `${sx(n).toFixed(1)},${sy(c95[i].hi).toFixed(1)}`)
    .join(" ");
  const lc95Pts = nPoints
    .map((n, i) => `${sx(n).toFixed(1)},${sy(c95[i].lo).toFixed(1)}`)
    .join(" ");
  const uc997Pts = nPoints
    .map((n, i) => `${sx(n).toFixed(1)},${sy(c997[i].hi).toFixed(1)}`)
    .join(" ");
  const lc997Pts = nPoints
    .map((n, i) => `${sx(n).toFixed(1)},${sy(c997[i].lo).toFixed(1)}`)
    .join(" ");

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* Y grid */}
      {[50, 60, 70, 80, 90, 100].map((v) => (
        <g key={v}>
          <line
            x1={pad.l}
            y1={sy(v)}
            x2={pad.l + cw}
            y2={sy(v)}
            stroke="var(--border-default)"
            strokeWidth="0.5"
          />
          <text
            x={pad.l - 4}
            y={sy(v)}
            textAnchor="end"
            dominantBaseline="central"
            fill="var(--fg-tertiary)"
            style={{ font: "500 8px var(--font-mono)" }}
          >
            {v}
          </text>
        </g>
      ))}
      {/* Network mean line */}
      <line
        x1={pad.l}
        y1={sy(networkMean)}
        x2={pad.l + cw}
        y2={sy(networkMean)}
        stroke="var(--fg-secondary)"
        strokeWidth="1.5"
      />
      <text
        x={pad.l + cw + 4}
        y={sy(networkMean)}
        dominantBaseline="central"
        fill="var(--fg-secondary)"
        style={{ font: "500 8px var(--font-mono)" }}
      >
        μ={networkMean}
      </text>

      {/* 99.7% limits (solid) */}
      <polyline
        points={uc997Pts}
        fill="none"
        stroke="var(--fg-tertiary)"
        strokeWidth="1"
      />
      <polyline
        points={lc997Pts}
        fill="none"
        stroke="var(--fg-tertiary)"
        strokeWidth="1"
      />
      {/* 95% limits (dashed) */}
      <polyline
        points={uc95Pts}
        fill="none"
        stroke="var(--fg-tertiary)"
        strokeWidth="1"
        strokeDasharray="5,3"
      />
      <polyline
        points={lc95Pts}
        fill="none"
        stroke="var(--fg-tertiary)"
        strokeWidth="1"
        strokeDasharray="5,3"
      />

      {/* Provider dots */}
      {providers.map((prov) => {
        const score = prov.composite;
        const n = prov.panel;
        const lim997 = funnelLimits(n, networkMean, 3.0);
        const outside = score > lim997.hi || score < lim997.lo;
        const color = S12_COLORS[prov.id] || "var(--fg-tertiary)";
        const dotColor = outside ? color : "var(--fg-tertiary)";
        const r = outside ? 6 : 4;
        return (
          <g key={prov.id}>
            <circle
              cx={sx(n).toFixed(1)}
              cy={sy(score).toFixed(1)}
              r={r}
              fill={dotColor}
              stroke="white"
              strokeWidth="1.2"
              fillOpacity={outside ? 1 : 0.6}
            />
            {outside && (
              <text
                x={(sx(n) + 8).toFixed(1)}
                y={sy(score).toFixed(1)}
                dominantBaseline="central"
                fill={dotColor}
                style={{ font: "500 8px var(--font-sans)", fontWeight: 600 }}
              >
                {prov.name.split(" ").slice(-1)}
              </text>
            )}
          </g>
        );
      })}

      {/* X axis labels */}
      {[200, 300, 400, 500].map((n) => (
        <text
          key={n}
          x={sx(n)}
          y={height - 8}
          textAnchor="middle"
          fill="var(--fg-tertiary)"
          style={{ font: "500 8px var(--font-mono)" }}
        >
          {n}
        </text>
      ))}
      <text
        x={pad.l + cw / 2}
        y={height}
        textAnchor="middle"
        fill="var(--fg-tertiary)"
        style={{ font: "400 8px var(--font-mono)" }}
      >
        Panel Size
      </text>

      {/* Legend */}
      {[
        ["solid", "var(--fg-tertiary)", "99.7% control limits"],
        ["dashed", "var(--fg-tertiary)", "95% control limits"],
      ].map(([d, c, l], i) => (
        <g key={l} transform={`translate(${pad.l + i * 160}, ${pad.t})`}>
          <line
            x1={0}
            y1={4}
            x2={16}
            y2={4}
            stroke={c}
            strokeWidth="1.2"
            strokeDasharray={d === "dashed" ? "4,3" : undefined}
          />
          <text
            x={20}
            y={8}
            fill="var(--fg-tertiary)"
            style={{ font: "400 8px var(--font-mono)" }}
          >
            {l}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ── Performance × Velocity Scatter ─────────────────────────────────────── */
function QuadrantScatter({
  allProviders,
  selectedIds,
  width = 400,
  height = 280,
}) {
  const pad = { l: 48, r: 16, t: 20, b: 32 };
  const cw = width - pad.l - pad.r,
    ch = height - pad.t - pad.b;
  const medX = 72,
    medY = 1.0; // median performance, median velocity

  function sx(score) {
    return pad.l + ((score - 45) / 55) * cw;
  }
  function sy(vel) {
    return pad.t + ch - ((vel + 2) / 6) * ch;
  }

  function getVelocity(pid) {
    const h = S12_HISTORY[pid];
    if (!h) return 0;
    return (h[h.length - 1] - h[0]) / (h.length - 1);
  }

  const qLabel = (x, y) => {
    if (x >= medX && y >= medY) return "High & Improving";
    if (x < medX && y >= medY) return "Low & Improving";
    if (x >= medX && y < medY) return "High & Declining";
    return "Low & Stagnating";
  };

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* Quadrant backgrounds */}
      {[
        {
          x: sx(45),
          y: sy(4),
          w: sx(medX) - sx(45),
          h: sy(medY) - sy(4),
          label: "Low & Improving",
          c: "oklch(45% .14 155)",
        },
        {
          x: sx(medX),
          y: sy(4),
          w: sx(100) - sx(medX),
          h: sy(medY) - sy(4),
          label: "High & Improving",
          c: "var(--accent)",
        },
        {
          x: sx(45),
          y: sy(medY),
          w: sx(medX) - sx(45),
          h: sy(-2) - sy(medY),
          label: "Low & Stagnating",
          c: "var(--perf-floor)",
        },
        {
          x: sx(medX),
          y: sy(medY),
          w: sx(100) - sx(medX),
          h: sy(-2) - sy(medY),
          label: "High & Declining",
          c: "oklch(62% .12 82)",
        },
      ].map((q) => (
        <g key={q.label}>
          <rect
            x={q.x}
            y={q.y}
            width={Math.max(0, q.w)}
            height={Math.max(0, q.h)}
            fill={q.c}
            fillOpacity="0.05"
          />
          <text
            x={(q.x + q.x + q.w) / 2}
            y={(q.y + q.y + q.h) / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill={q.c}
            fillOpacity="0.5"
            style={{ font: "500 9px var(--font-sans)" }}
          >
            {q.label}
          </text>
        </g>
      ))}
      {/* Median lines */}
      <line
        x1={sx(medX)}
        y1={pad.t}
        x2={sx(medX)}
        y2={pad.t + ch}
        stroke="var(--border-default)"
        strokeWidth="1"
        strokeDasharray="4,3"
      />
      <line
        x1={pad.l}
        y1={sy(medY)}
        x2={pad.l + cw}
        y2={sy(medY)}
        stroke="var(--border-default)"
        strokeWidth="1"
        strokeDasharray="4,3"
      />
      {/* Y zero line */}
      <line
        x1={pad.l}
        y1={sy(0)}
        x2={pad.l + cw}
        y2={sy(0)}
        stroke="var(--fg-tertiary)"
        strokeWidth="0.5"
      />

      {/* Provider dots */}
      {allProviders.map((prov) => {
        const x = prov.composite;
        const y = getVelocity(prov.id);
        const isSelected = selectedIds.includes(prov.id);
        const color = isSelected ? S12_COLORS[prov.id] : "var(--fg-tertiary)";
        return (
          <g key={prov.id}>
            <circle
              cx={sx(x).toFixed(1)}
              cy={sy(y).toFixed(1)}
              r={isSelected ? 7 : 4}
              fill={color}
              stroke="white"
              strokeWidth="1.2"
              fillOpacity={isSelected ? 0.9 : 0.35}
            />
            {isSelected && (
              <text
                x={(sx(x) + 10).toFixed(1)}
                y={sy(y).toFixed(1)}
                dominantBaseline="central"
                fill={color}
                style={{ font: "600 9px var(--font-sans)" }}
              >
                {prov.name.split(" ")[2] || prov.name.split(" ")[1]}
              </text>
            )}
          </g>
        );
      })}

      {/* Axes */}
      {[50, 60, 70, 80, 90].map((v) => (
        <text
          key={v}
          x={sx(v)}
          y={pad.t + ch + 14}
          textAnchor="middle"
          fill="var(--fg-tertiary)"
          style={{ font: "500 7px var(--font-mono)" }}
        >
          {v}
        </text>
      ))}
      {[-1, 0, 1, 2, 3].map((v) => (
        <text
          key={v}
          x={pad.l - 4}
          y={sy(v)}
          textAnchor="end"
          dominantBaseline="central"
          fill="var(--fg-tertiary)"
          style={{ font: "500 7px var(--font-mono)" }}
        >
          {v > 0 ? "+" : ""}
          {v}
        </text>
      ))}
      <text
        x={pad.l + cw / 2}
        y={height}
        textAnchor="middle"
        fill="var(--fg-tertiary)"
        style={{ font: "400 8px var(--font-mono)" }}
      >
        Current Score (Q4 2025)
      </text>
    </svg>
  );
}

/* ── O/E Ratio Bar Chart ─────────────────────────────────────────────────── */
function OERatioChart({ data, width = 380, height = 120 }) {
  const pad = { l: 120, r: 56, t: 12, b: 20 };
  const cw = width - pad.l - pad.r,
    ch = height - pad.t - pad.b;
  const rowH = ch / data.length - 4;
  const refX = pad.l + cw * 0.5; // 1.0 reference in middle
  const scale = (cw * 0.5) / 0.3; // 0.3 range on each side

  function barX(oe) {
    if (oe >= 1) return refX;
    return pad.l + ((oe - 0.7) / 0.6) * cw;
  }
  function barW(oe) {
    return Math.abs(oe - 1) * scale;
  }

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <line
        x1={refX}
        y1={pad.t - 4}
        x2={refX}
        y2={pad.t + ch}
        stroke="var(--fg-secondary)"
        strokeWidth="1.5"
      />
      <text
        x={refX}
        y={pad.t - 6}
        textAnchor="middle"
        fill="var(--fg-secondary)"
        style={{ font: "600 9px var(--font-mono)" }}
      >
        O/E = 1.0
      </text>

      {data.map((d, i) => {
        const y = pad.t + i * (rowH + 4);
        const isOver = d.oe >= 1;
        const color = isOver ? "var(--accent)" : "var(--perf-below)";
        const bx = isOver ? refX : barX(d.oe);
        const bw = barW(d.oe);
        const provColor = S12_COLORS[d.pid] || color;
        return (
          <g key={d.pid}>
            <text
              x={pad.l - 6}
              y={y + rowH / 2}
              textAnchor="end"
              dominantBaseline="central"
              fill={provColor}
              style={{ font: "500 10px var(--font-sans)" }}
            >
              {d.name.split(" ")[2] || d.name.split(" ")[1]}
            </text>
            <rect
              x={bx}
              y={y}
              width={bw}
              height={rowH}
              rx="2"
              fill={color}
              fillOpacity="0.75"
            />
            <text
              x={(isOver ? refX + bw + 4 : refX - bw - 4).toFixed(1)}
              y={y + rowH / 2}
              dominantBaseline="central"
              textAnchor={isOver ? "start" : "end"}
              fill={color}
              style={{ font: "600 10px var(--font-mono)" }}
            >
              {d.oe.toFixed(2)}
            </text>
          </g>
        );
      })}
      {[0.7, 0.8, 0.9, 1.1, 1.2, 1.3].map((v) => (
        <text
          key={v}
          x={pad.l + ((v - 0.7) / 0.6) * cw}
          y={height - 4}
          textAnchor="middle"
          fill="var(--fg-tertiary)"
          style={{ font: "500 7px var(--font-mono)" }}
        >
          {v}
        </text>
      ))}
    </svg>
  );
}

/* ── Multi-line Trajectory Chart ─────────────────────────────────────────── */
function MultiLineChart({ velocityData, periods, width = 460, height = 160 }) {
  const pad = { l: 36, r: 48, t: 16, b: 28 };
  const cw = width - pad.l - pad.r,
    ch = height - pad.t - pad.b;
  const n = periods.length + 1; // +1 for projection
  const allVals = velocityData.flatMap((d) => d.periods);
  const minV = Math.min(...allVals) * 0.95,
    maxV = Math.max(...allVals) * 1.03;
  const r = maxV - minV;

  function sx(i) {
    return pad.l + (i / (n - 1)) * cw;
  }
  function sy(v) {
    return pad.t + ch - ((v - minV) / r) * ch;
  }

  function projectNext(periods) {
    const n = periods.length;
    const slope = (periods[n - 1] - periods[0]) / (n - 1);
    return Math.min(100, Math.round((periods[n - 1] + slope) * 10) / 10);
  }

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* Grid lines */}
      {[65, 70, 75, 80, 85, 90]
        .filter((v) => v >= minV && v <= maxV)
        .map((v) => (
          <g key={v}>
            <line
              x1={pad.l}
              y1={sy(v)}
              x2={pad.l + cw}
              y2={sy(v)}
              stroke="var(--border-default)"
              strokeWidth="0.5"
            />
            <text
              x={pad.l - 4}
              y={sy(v)}
              textAnchor="end"
              dominantBaseline="central"
              fill="var(--fg-tertiary)"
              style={{ font: "500 8px var(--font-mono)" }}
            >
              {v}
            </text>
          </g>
        ))}
      {/* Tier thresholds */}
      {[
        { v: 85, l: "Tier 1" },
        { v: 70, l: "Tier 2" },
      ].map((t) => (
        <g key={t.l}>
          <line
            x1={pad.l}
            y1={sy(t.v)}
            x2={pad.l + cw}
            y2={sy(t.v)}
            stroke="var(--fg-tertiary)"
            strokeWidth="0.8"
            strokeDasharray="4,3"
          />
          <text
            x={pad.l + cw + 4}
            y={sy(t.v)}
            dominantBaseline="central"
            fill="var(--fg-tertiary)"
            style={{ font: "500 7px var(--font-mono)" }}
          >
            {t.l}
          </text>
        </g>
      ))}

      {velocityData.map((d) => {
        const color = S12_COLORS[d.pid] || "var(--fg-tertiary)";
        const pts = d.periods
          .map((v, i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`)
          .join(" ");
        const proj = projectNext(d.periods);
        const lastX = sx(d.periods.length - 1);
        const lastY = sy(d.periods[d.periods.length - 1]);
        const projX = sx(n - 1);
        const projY = sy(proj);
        return (
          <g key={d.pid}>
            <polyline
              points={pts}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line
              x1={lastX.toFixed(1)}
              y1={lastY.toFixed(1)}
              x2={projX.toFixed(1)}
              y2={projY.toFixed(1)}
              stroke={color}
              strokeWidth="1.5"
              strokeDasharray="5,4"
            />
            {d.periods.map((v, i) => (
              <circle
                key={i}
                cx={sx(i).toFixed(1)}
                cy={sy(v).toFixed(1)}
                r="3.5"
                fill={color}
                stroke="white"
                strokeWidth="1.2"
              />
            ))}
            <circle
              cx={projX.toFixed(1)}
              cy={projY.toFixed(1)}
              r="4"
              fill="none"
              stroke={color}
              strokeWidth="1.5"
            />
            <text
              x={(projX + 5).toFixed(1)}
              y={projY.toFixed(1)}
              dominantBaseline="central"
              fill={color}
              style={{ font: "600 9px var(--font-sans)" }}
            >
              ~{proj}
            </text>
          </g>
        );
      })}
      {[...periods, "Proj."].map((p, i) => (
        <text
          key={i}
          x={sx(i)}
          y={height - 8}
          textAnchor="middle"
          fill="var(--fg-tertiary)"
          style={{ font: "500 8px var(--font-mono)" }}
        >
          {p.replace(" 2025", "")}
        </text>
      ))}
    </svg>
  );
}

/* ── Steerage Donut Chart ────────────────────────────────────────────────── */
function SteerageDonut({ data, size = 160 }) {
  const r = size * 0.38,
    cx = size / 2,
    cy = size / 2,
    innerR = r * 0.55;
  const totalPct = data.reduce((s, d) => s + d.memberPct, 0);
  let angle = -90;
  function pol(rad, deg) {
    const a = (deg * Math.PI) / 180;
    return { x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) };
  }
  const colors = ["var(--accent)", "var(--perf-target)", "var(--perf-below)"];
  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      {data
        .filter((d) => d.memberPct > 0)
        .map((d, i) => {
          const sweep = (d.memberPct / totalPct) * 360;
          const start = pol(r, angle);
          const end = pol(r, angle + sweep - 0.5);
          const iStart = pol(innerR, angle);
          const iEnd = pol(innerR, angle + sweep - 0.5);
          const large = sweep > 180 ? 1 : 0;
          const path = `M${start.x.toFixed(1)},${start.y.toFixed(1)} A${r},${r} 0 ${large} 1 ${end.x.toFixed(1)},${end.y.toFixed(1)} L${iEnd.x.toFixed(1)},${iEnd.y.toFixed(1)} A${innerR},${innerR} 0 ${large} 0 ${iStart.x.toFixed(1)},${iStart.y.toFixed(1)}Z`;
          angle += sweep;
          return (
            <path
              key={d.tier}
              d={path}
              fill={colors[i] || "var(--fg-tertiary)"}
              fillOpacity="0.85"
              stroke="var(--bg-surface)"
              strokeWidth="1.5"
            />
          );
        })}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        fill="var(--fg-primary)"
        style={{ font: "600 13px var(--font-sans)" }}
      >
        3,000
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fill="var(--fg-tertiary)"
        style={{ font: "400 8px var(--font-mono)" }}
      >
        members
      </text>
    </svg>
  );
}

// window.MultiRadar      = MultiRadar;
// window.FunnelPlot      = FunnelPlot;
// window.QuadrantScatter = QuadrantScatter;
// window.OERatioChart    = OERatioChart;
// window.MultiLineChart  = MultiLineChart;
// window.SteerageDonut   = SteerageDonut;

export {
  MultiRadar,
  FunnelPlot,
  QuadrantScatter,
  OERatioChart,
  MultiLineChart,
  SteerageDonut,
};
