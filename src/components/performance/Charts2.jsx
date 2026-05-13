import React from "react";

/* ── BoxWhisker Plot ────────────────────────────────────────────────────── */
function BoxWhiskerPlot({
  values,
  target,
  targetDir,
  unit,
  width = 340,
  height = 80,
}) {
  if (!values || values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const q1 = sorted[Math.floor(n * 0.25)];
  const median = sorted[Math.floor(n * 0.5)];
  const q3 = sorted[Math.floor(n * 0.75)];
  const p5 = sorted[Math.floor(n * 0.05)];
  const p95 = sorted[Math.floor(n * 0.95)];
  const mean = sorted.reduce((a, b) => a + b, 0) / n;
  const outliers = sorted.filter((v) => v < p5 || v > p95);

  const minV = Math.min(...sorted) * 0.9;
  const maxV = Math.max(...sorted) * 1.1;
  const range = maxV - minV;
  const pad = { l: 40, r: 40, t: 16, b: 24 };
  const cw = width - pad.l - pad.r;
  const cy = pad.t + (height - pad.t - pad.b) / 2;
  const bh = 18;

  function sx(v) {
    return pad.l + ((v - minV) / range) * cw;
  }

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* Axis */}
      <line
        x1={pad.l}
        y1={cy + bh}
        x2={pad.l + cw}
        y2={cy + bh}
        stroke="var(--border-default)"
        strokeWidth="0.5"
      />
      {/* Whiskers */}
      <line
        x1={sx(p5)}
        y1={cy}
        x2={sx(p5)}
        y2={cy + bh}
        stroke="var(--fg-tertiary)"
        strokeWidth="1.5"
      />
      <line
        x1={sx(p95)}
        y1={cy}
        x2={sx(p95)}
        y2={cy + bh}
        stroke="var(--fg-tertiary)"
        strokeWidth="1.5"
      />
      <line
        x1={sx(p5)}
        y1={cy + bh / 2}
        x2={sx(q1)}
        y2={cy + bh / 2}
        stroke="var(--fg-tertiary)"
        strokeWidth="1.5"
      />
      <line
        x1={sx(q3)}
        y1={cy + bh / 2}
        x2={sx(p95)}
        y2={cy + bh / 2}
        stroke="var(--fg-tertiary)"
        strokeWidth="1.5"
      />
      {/* Box Q1–Q3 */}
      <rect
        x={sx(q1)}
        y={cy}
        width={sx(q3) - sx(q1)}
        height={bh}
        fill="var(--accent-soft)"
        stroke="var(--accent)"
        strokeWidth="1"
        rx="2"
      />
      {/* Median */}
      <line
        x1={sx(median)}
        y1={cy}
        x2={sx(median)}
        y2={cy + bh}
        stroke="var(--accent)"
        strokeWidth="2"
      />
      {/* Mean dot */}
      <circle
        cx={sx(mean)}
        cy={cy + bh / 2}
        r="3.5"
        fill="var(--fg-primary)"
        stroke="white"
        strokeWidth="1"
      />
      {/* Target line */}
      {target != null && (
        <g>
          <line
            x1={sx(target)}
            y1={pad.t - 4}
            x2={sx(target)}
            y2={cy + bh + 8}
            stroke="var(--perf-target)"
            strokeWidth="1.5"
            strokeDasharray="4,3"
          />
          <text
            x={sx(target)}
            y={pad.t - 6}
            textAnchor="middle"
            fill="var(--perf-target)"
            style={{ font: "500 8px var(--font-mono)" }}
          >
            Target {target}
            {unit}
          </text>
        </g>
      )}
      {/* Labels */}
      {[p5, q1, median, q3, p95].map((v, i) => (
        <text
          key={i}
          x={sx(v)}
          y={cy + bh + 14}
          textAnchor="middle"
          fill="var(--fg-tertiary)"
          style={{ font: "500 7px var(--font-mono)" }}
        >
          {v.toFixed(1)}
        </text>
      ))}
      {/* Legend */}
      <text
        x={pad.l}
        y={height - 2}
        fill="var(--fg-tertiary)"
        style={{ font: "400 8px var(--font-mono)" }}
      >
        p5 │ Q1 │ Median │ Q3 │ p95 •=mean
      </text>
    </svg>
  );
}

/* ── Data Histogram with threshold line ─────────────────────────────────── */
function DataHistogram({
  values,
  target,
  targetDir,
  unit,
  bins = 10,
  width = 340,
  height = 100,
  label,
}) {
  if (!values || values.length === 0) return null;
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const binW = (maxV - minV) / bins;
  const buckets = Array.from({ length: bins }, (_, i) => ({
    lo: minV + i * binW,
    hi: minV + (i + 1) * binW,
    count: 0,
  }));
  values.forEach((v) => {
    const idx = Math.min(bins - 1, Math.floor((v - minV) / binW));
    buckets[idx].count++;
  });
  const maxCount = Math.max(...buckets.map((b) => b.count));
  const pad = { l: 8, r: 8, t: 12, b: 20 };
  const cw = width - pad.l - pad.r;
  const ch = height - pad.t - pad.b;
  const bw = cw / bins;

  function sx(v) {
    return pad.l + ((v - minV) / (maxV - minV)) * cw;
  }

  const targetX = target != null ? sx(target) : null;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {buckets.map((b, i) => {
        const bh = (b.count / maxCount) * ch;
        const by = pad.t + ch - bh;
        const x = pad.l + i * bw;
        const isGood =
          target != null
            ? targetDir === "lower"
              ? b.hi <= target
              : b.lo >= target
            : false;
        const isBad =
          target != null
            ? targetDir === "lower"
              ? b.lo > target
              : b.hi < target
            : false;
        const fill = isGood
          ? "var(--perf-target)"
          : isBad
            ? "var(--perf-floor)"
            : "var(--accent)";
        return (
          <g key={i}>
            <rect
              x={x}
              y={by}
              width={bw - 1}
              height={Math.max(1, bh)}
              rx="1.5"
              fill={fill}
              fillOpacity="0.75"
              stroke="var(--bg-surface)"
              strokeWidth="0.5"
            />
            {b.count > 0 && bh > 14 && (
              <text
                x={x + bw / 2}
                y={by + bh / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill="white"
                style={{ font: "500 8px var(--font-sans)" }}
              >
                {b.count}
              </text>
            )}
          </g>
        );
      })}
      {targetX != null && (
        <g>
          <line
            x1={targetX}
            y1={pad.t - 4}
            x2={targetX}
            y2={pad.t + ch}
            stroke="var(--perf-target)"
            strokeWidth="2"
            strokeDasharray="5,3"
          />
          <text
            x={targetX}
            y={pad.t - 6}
            textAnchor="middle"
            fill="var(--perf-target)"
            style={{ font: "600 8px var(--font-mono)" }}
          >
            {target}
            {unit}
          </text>
        </g>
      )}
      {/* X axis labels */}
      {[0, bins / 2, bins].map((i) => {
        const v = minV + (i / bins) * (maxV - minV);
        return (
          <text
            key={i}
            x={pad.l + (i / bins) * cw}
            y={height - 4}
            textAnchor="middle"
            fill="var(--fg-tertiary)"
            style={{ font: "500 7px var(--font-mono)" }}
          >
            {v.toFixed(1)}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Proportion Bar with CI ──────────────────────────────────────────────── */
function ProportionBar({
  rate,
  ciLo,
  ciHi,
  target,
  targetDir,
  unit = "%",
  width = 320,
  height = 32,
}) {
  const max = 100;
  const pad = { l: 8, r: 40, t: 4, b: 20 };
  const cw = width - pad.l - pad.r;

  function sx(v) {
    return pad.l + (v / max) * cw;
  }

  const isGood = targetDir === "lower" ? rate <= target : rate >= target;
  const barColor = isGood ? "var(--perf-target)" : "var(--perf-below)";

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* Background */}
      <rect
        x={pad.l}
        y={pad.t}
        width={cw}
        height={height - pad.t - pad.b}
        fill="var(--bg-elevated)"
        rx="3"
      />
      {/* Rate bar */}
      <rect
        x={pad.l}
        y={pad.t}
        width={(rate / max) * cw}
        height={height - pad.t - pad.b}
        fill={barColor}
        fillOpacity="0.75"
        rx="3"
      />
      {/* CI band */}
      <rect
        x={sx(ciLo)}
        y={pad.t + 2}
        width={sx(ciHi) - sx(ciLo)}
        height={height - pad.t - pad.b - 4}
        fill={barColor}
        fillOpacity="0.2"
      />
      {/* CI lines */}
      <line
        x1={sx(ciLo)}
        y1={pad.t}
        x2={sx(ciLo)}
        y2={height - pad.b}
        stroke={barColor}
        strokeWidth="1.5"
      />
      <line
        x1={sx(ciHi)}
        y1={pad.t}
        x2={sx(ciHi)}
        y2={height - pad.b}
        stroke={barColor}
        strokeWidth="1.5"
      />
      {/* Target line */}
      {target != null && (
        <line
          x1={sx(target)}
          y1={pad.t - 2}
          x2={sx(target)}
          y2={height - pad.b + 2}
          stroke="var(--perf-target)"
          strokeWidth="1.5"
          strokeDasharray="3,2"
        />
      )}
      {/* Rate label */}
      <text
        x={sx(rate) + 4}
        y={pad.t + (height - pad.t - pad.b) / 2}
        dominantBaseline="central"
        fill="var(--fg-primary)"
        style={{ font: "600 10px var(--font-mono)" }}
      >
        {rate}
        {unit}
      </text>
      {/* X labels */}
      {[0, 25, 50, 75, 100].map((v) => (
        <text
          key={v}
          x={sx(v)}
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

/* ── Severity Stacked Bar (PROMs) ─────────────────────────────────────────── */
function SeverityBar({ segments, width = 340, height = 28 }) {
  let offset = 0;
  return (
    <div style={{ width }}>
      <svg width={width} height={height} style={{ display: "block" }}>
        {segments.map((seg, i) => {
          const w = (seg.pct / 100) * width;
          const x = offset;
          offset += w;
          return (
            <g key={i}>
              <rect
                x={x}
                y={0}
                width={w}
                height={height}
                fill={seg.color}
                fillOpacity="0.85"
              />
              {w > 24 && (
                <text
                  x={x + w / 2}
                  y={height / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="white"
                  style={{ font: "600 9px var(--font-sans)" }}
                >
                  {seg.pct}%
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
        {segments.map((seg, i) => (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 4 }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: seg.color,
                opacity: 0.85,
              }}
            />
            <span
              style={{
                font: "400 10px var(--font-mono)",
                color: "var(--fg-secondary)",
              }}
            >
              {seg.label}: {seg.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Spaghetti Plot (PROMs trajectories) ─────────────────────────────────── */
function SpaghettiPlot({
  trajectories,
  xLabels,
  yMin = 0,
  yMax = 27,
  yLabel = "PHQ-9 Score",
  width = 480,
  height = 220,
}) {
  const pad = { l: 36, r: 16, t: 16, b: 28 };
  const cw = width - pad.l - pad.r;
  const ch = height - pad.t - pad.b;
  const n = xLabels.length;

  function sx(i) {
    return pad.l + (i / (n - 1)) * cw;
  }
  function sy(v) {
    return pad.t + ch - ((v - yMin) / (yMax - yMin)) * ch;
  }

  const colors = {
    improved: "oklch(52% .14 155 / .55)",
    worsened: "oklch(50% .18 25 / .55)",
    stable: "rgba(120,120,130,.25)",
  };

  // Compute mean at each timepoint from trajectories with data
  const means = xLabels.map((_, ti) => {
    const vals = trajectories.map((t) => t.values[ti]).filter((v) => v != null);
    return vals.length > 0
      ? vals.reduce((a, b) => a + b, 0) / vals.length
      : null;
  });

  const meanPts = means
    .map((m, i) =>
      m != null ? `${sx(i).toFixed(1)},${sy(m).toFixed(1)}` : null,
    )
    .filter(Boolean)
    .join(" ");

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* Y axis lines */}
      {[0, 7, 14, 21].map((v) => (
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

      {/* Patient trajectories */}
      {trajectories.map((t) => {
        const pts = t.values.map((v, i) =>
          v != null ? `${sx(i).toFixed(1)},${sy(v).toFixed(1)}` : null,
        );
        const segments = [];
        let seg = [];
        pts.forEach((p, i) => {
          if (p) {
            seg.push(p);
          } else if (seg.length > 0) {
            segments.push([...seg]);
            seg = [];
          }
        });
        if (seg.length > 0) segments.push(seg);
        return segments.map((s, si) => (
          <polyline
            key={t.id + "-" + si}
            points={s.join(" ")}
            fill="none"
            stroke={colors[t.status]}
            strokeWidth="1"
          />
        ));
      })}

      {/* Cohort mean line */}
      {meanPts && (
        <polyline
          points={meanPts}
          fill="none"
          stroke="var(--fg-primary)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {/* Mean points */}
      {means.map(
        (m, i) =>
          m != null && (
            <circle
              key={i}
              cx={sx(i)}
              cy={sy(m)}
              r="5"
              fill="var(--fg-primary)"
              stroke="white"
              strokeWidth="1.5"
            />
          ),
      )}
      {/* Mean labels */}
      {means.map(
        (m, i) =>
          m != null && (
            <text
              key={i}
              x={sx(i)}
              y={sy(m) - 10}
              textAnchor="middle"
              fill="var(--fg-primary)"
              style={{ font: "600 10px var(--font-sans)" }}
            >
              {m.toFixed(1)}
            </text>
          ),
      )}

      {/* X labels */}
      {xLabels.map((l, i) => (
        <text
          key={i}
          x={sx(i)}
          y={height - 6}
          textAnchor="middle"
          fill="var(--fg-tertiary)"
          style={{ font: "500 9px var(--font-mono)" }}
        >
          {l}
        </text>
      ))}
      {/* Y label */}
      <text
        x={8}
        y={pad.t + ch / 2}
        textAnchor="middle"
        dominantBaseline="central"
        transform={`rotate(-90, 8, ${pad.t + ch / 2})`}
        fill="var(--fg-tertiary)"
        style={{ font: "500 8px var(--font-mono)" }}
      >
        {yLabel}
      </text>

      {/* Legend */}
      {[
        ["improved", "Improved (MCID ≥5)"],
        ["stable", "Stable (±MCID)"],
        ["worsened", "Worsened (MCID ≥5)"],
      ].map(([k, l], i) => (
        <g key={k} transform={`translate(${pad.l + i * 130}, ${height - 2})`}>
          <line
            x1={0}
            y1={-3}
            x2={16}
            y2={-3}
            stroke={colors[k].replace(" / .55", "").replace("/ .55", "")}
            strokeWidth="2"
          />
          <text
            x={20}
            y={0}
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

/* ── Collection Funnel ───────────────────────────────────────────────────── */
function CollectionFunnel({ steps, width = 360 }) {
  const maxN = steps[0].n;
  const rowH = 36;
  const svgH = steps.length * rowH + 20;
  return (
    <svg width={width} height={svgH} style={{ overflow: "visible" }}>
      {steps.map((step, i) => {
        const barW = (step.n / maxN) * (width - 120);
        const x = 60 + (width - 120 - barW) / 2;
        const y = i * rowH + 4;
        const isLow = step.pct < 70;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={rowH - 6}
              rx="4"
              fill={isLow ? "var(--perf-below-soft)" : "var(--accent-soft)"}
              stroke={isLow ? "var(--perf-below)" : "var(--accent)"}
              strokeWidth="0.5"
            />
            <text
              x={x + barW / 2}
              y={y + (rowH - 6) / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--fg-primary)"
              style={{ font: "600 11px var(--font-sans)" }}
            >
              {step.n}
            </text>
            <text
              x={width - 50}
              y={y + (rowH - 6) / 2}
              textAnchor="start"
              dominantBaseline="central"
              fill={isLow ? "var(--perf-below)" : "var(--fg-secondary)"}
              style={{ font: "600 10px var(--font-mono)" }}
            >
              {step.pct}%
            </text>
            <text
              x={4}
              y={y + (rowH - 6) / 2}
              textAnchor="start"
              dominantBaseline="central"
              fill="var(--fg-tertiary)"
              style={{
                font: "400 8px var(--font-mono)",
                textTransform: "uppercase",
                letterSpacing: ".03em",
              }}
            >
              {step.label.split(" ")[0]}
            </text>
            {i < steps.length - 1 && (
              <text
                x={width / 2}
                y={y + rowH - 1}
                textAnchor="middle"
                fill="var(--fg-tertiary)"
                style={{ font: "400 8px var(--font-sans)" }}
              >
                ▼ {step.note}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ── Venn Diagram ─────────────────────────────────────────────────────────── */
function VennDiagram({ data, width = 360, height = 200 }) {
  const cx = width / 2,
    cy = height / 2;
  const r = 70;
  const offX = 38,
    offY = 22;
  const c = [
    { x: cx - offX, y: cy - offY, label: "EX-003\n(12)" },
    { x: cx + offX, y: cy - offY, label: "EX-005\n(24)" },
    { x: cx, y: cy + offY, label: "EX-001\n(8)" },
  ];
  const colors = ["var(--accent)", "var(--perf-below)", "var(--perf-target)"];
  const labels = [
    {
      x: cx - offX - r * 0.45,
      y: cy - offY - r * 0.45,
      text: data.only003,
      sub: "only EX-003",
    },
    {
      x: cx + offX + r * 0.45,
      y: cy - offY - r * 0.45,
      text: data.only005,
      sub: "only EX-005",
    },
    { x: cx, y: cy + offY + r * 0.55, text: data.only001, sub: "only EX-001" },
    { x: cx, y: cy - offY - r * 0.05, text: data.both_003_005, sub: "003∩005" },
    {
      x: cx + offX * 0.5,
      y: cy + offY * 0.4,
      text: data.both_005_001,
      sub: "005∩001",
    },
    {
      x: cx - offX * 0.5,
      y: cy + offY * 0.4,
      text: data.both_003_001,
      sub: "003∩001",
    },
    { x: cx, y: cy, text: data.all_three, sub: "all 3" },
  ];

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {c.map((circle, i) => (
        <circle
          key={i}
          cx={circle.x}
          cy={circle.y}
          r={r}
          fill={colors[i]}
          fillOpacity="0.12"
          stroke={colors[i]}
          strokeWidth="1.5"
        />
      ))}
      {c.map((circle, i) => (
        <text
          key={i}
          x={circle.x + (i === 0 ? -r * 0.6 : i === 1 ? r * 0.6 : 0)}
          y={circle.y + (i === 2 ? r * 0.75 : -r * 0.75)}
          textAnchor="middle"
          fill={colors[i]}
          style={{ font: "600 10px var(--font-mono)", whiteSpace: "pre" }}
        >
          {circle.label.split("\n")[0]}
        </text>
      ))}
      {labels.map((l, i) => (
        <g key={i}>
          <text
            x={l.x}
            y={l.y}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--fg-primary)"
            style={{ font: "700 13px var(--font-sans)" }}
          >
            {l.text}
          </text>
          <text
            x={l.x}
            y={l.y + 12}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--fg-tertiary)"
            style={{ font: "400 8px var(--font-mono)" }}
          >
            {l.sub}
          </text>
        </g>
      ))}
    </svg>
  );
}

/* ── Grouped Bar Chart with Error Bars ───────────────────────────────────── */
function GroupedBarErrors({
  data,
  overall,
  target,
  width = 440,
  height = 160,
}) {
  const maxVal = Math.max(...data.map((d) => d.ciHi), target || 0) * 1.15;
  const pad = { l: 44, r: 12, t: 20, b: 32 };
  const cw = width - pad.l - pad.r;
  const ch = height - pad.t - pad.b;
  const barW = (cw / data.length) * 0.55;
  const gap = cw / data.length;

  function sy(v) {
    return pad.t + ch - (v / maxVal) * ch;
  }
  function sx(i) {
    return pad.l + i * gap + gap / 2 - barW / 2;
  }

  const overallY = overall != null ? sy(overall) : null;
  const targetY = target != null ? sy(target) : null;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* Y grid */}
      {[0, 25, 50, 75, 100]
        .filter((v) => v <= maxVal)
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
      {/* Overall reference */}
      {overallY && (
        <line
          x1={pad.l}
          y1={overallY}
          x2={pad.l + cw}
          y2={overallY}
          stroke="var(--fg-secondary)"
          strokeWidth="1.5"
          strokeDasharray="6,4"
        />
      )}
      {/* Target */}
      {targetY && (
        <line
          x1={pad.l}
          y1={targetY}
          x2={pad.l + cw}
          y2={targetY}
          stroke="var(--perf-target)"
          strokeWidth="1.5"
          strokeDasharray="3,2"
        />
      )}
      {/* Bars */}
      {data.map((d, i) => {
        const x = sx(i);
        const barH = Math.max(2, ch - (d.score / maxVal) * ch);
        const by = sy(d.score);
        const barColor = d.sig ? "var(--perf-floor)" : "var(--accent)";
        const errTop = sy(d.ciHi);
        const errBot = sy(d.ciLo);
        const midX = x + barW / 2;
        return (
          <g key={i}>
            <rect
              x={x}
              y={by}
              width={barW}
              height={pad.t + ch - by}
              fill={barColor}
              fillOpacity={d.sig ? 0.85 : 0.7}
              rx="2"
            />
            {/* Error bar */}
            <line
              x1={midX}
              y1={errTop}
              x2={midX}
              y2={errBot}
              stroke="var(--fg-primary)"
              strokeWidth="1.5"
            />
            <line
              x1={midX - 5}
              y1={errTop}
              x2={midX + 5}
              y2={errTop}
              stroke="var(--fg-primary)"
              strokeWidth="1.5"
            />
            <line
              x1={midX - 5}
              y1={errBot}
              x2={midX + 5}
              y2={errBot}
              stroke="var(--fg-primary)"
              strokeWidth="1.5"
            />
            {/* Score label */}
            <text
              x={midX}
              y={by - 6}
              textAnchor="middle"
              fill={barColor}
              style={{ font: "600 10px var(--font-sans)" }}
            >
              {d.score}%{d.sig ? " ★" : ""}
            </text>
            {/* X label */}
            <text
              x={midX}
              y={height - 6}
              textAnchor="middle"
              fill="var(--fg-tertiary)"
              style={{ font: "500 9px var(--font-mono)" }}
            >
              {d.group}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Cost Waterfall ──────────────────────────────────────────────────────── */
function CostWaterfall({
  items,
  total,
  networkTotal,
  width = 420,
  height = 180,
}) {
  const maxAmt = Math.max(...items.map((i) => i.amount)) * 1.2;
  const pad = { l: 80, r: 12, t: 16, b: 28 };
  const cw = width - pad.l - pad.r;
  const ch = height - pad.t - pad.b;
  const barH = ch / items.length - 6;

  function sw(v) {
    return (v / maxAmt) * cw;
  }
  function sy(i) {
    return pad.t + i * (barH + 6);
  }

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {items.map((item, i) => {
        const provW = sw(item.amount);
        const netW = sw(item.networkAmt);
        const isLower = item.amount < item.networkAmt;
        return (
          <g key={i}>
            {/* Label */}
            <text
              x={pad.l - 4}
              y={sy(i) + barH / 2}
              textAnchor="end"
              dominantBaseline="central"
              fill="var(--fg-secondary)"
              style={{ font: "400 10px var(--font-sans)" }}
            >
              {item.label}
            </text>
            {/* Provider bar */}
            <rect
              x={pad.l}
              y={sy(i)}
              width={provW}
              height={barH / 2 - 1}
              rx="2"
              fill="var(--accent)"
              fillOpacity="0.8"
            />
            {/* Network bar */}
            <rect
              x={pad.l}
              y={sy(i) + barH / 2 + 1}
              width={netW}
              height={barH / 2 - 1}
              rx="2"
              fill="var(--bg-muted)"
              stroke="var(--border-default)"
              strokeWidth="0.5"
            />
            {/* Delta arrow */}
            <text
              x={pad.l + Math.max(provW, netW) + 6}
              y={sy(i) + barH / 2}
              dominantBaseline="central"
              fill={isLower ? "var(--perf-target)" : "var(--perf-floor)"}
              style={{ font: "600 9px var(--font-mono)" }}
            >
              {isLower ? "▼" : "▲"} SAR{" "}
              {Math.abs(item.amount - item.networkAmt).toLocaleString()}
            </text>
          </g>
        );
      })}
      {/* Legend */}
      {[
        ["var(--accent)", "This Provider"],
        ["var(--bg-muted)", "Network Avg"],
      ].map(([c, l], i) => (
        <g key={l} transform={`translate(${pad.l + i * 130}, ${height - 4})`}>
          <rect
            x={0}
            y={-8}
            width={12}
            height={8}
            rx="1"
            fill={c}
            stroke={c === "var(--bg-muted)" ? "var(--border-default)" : "none"}
            strokeWidth="0.5"
          />
          <text
            x={16}
            y={0}
            fill="var(--fg-tertiary)"
            style={{ font: "400 9px var(--font-mono)" }}
          >
            {l}
          </text>
        </g>
      ))}
    </svg>
  );
}

export {
  BoxWhiskerPlot,
  DataHistogram,
  ProportionBar,
  SeverityBar,
  SpaghettiPlot,
  VennDiagram,
  GroupedBarErrors,
  CostWaterfall,
  CollectionFunnel,
};
