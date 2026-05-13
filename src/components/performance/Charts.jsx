// Session 8 — perf-charts.jsx — SVG chart components

/* ── Sparkline ──────────────────────────────────────────────────────────── */
function Sparkline({
  values,
  color = "var(--accent)",
  width = 64,
  height = 22,
}) {
  if (!values || values.length < 2)
    return <span style={{ width, height, display: "inline-block" }} />;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const pad = 2;
  const pts = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (width - pad * 2);
      const y = pad + (1 - (v - min) / range) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const last = values[values.length - 1];
  const lx = pad + (width - pad * 2);
  const ly = pad + (1 - (last - min) / range) * (height - pad * 2);
  return (
    <svg
      width={width}
      height={height}
      style={{ display: "block", overflow: "visible" }}
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lx} cy={ly} r="2.5" fill={color} />
    </svg>
  );
}

/* ── Radar / Spider Chart ───────────────────────────────────────────────── */
function RadarChart({
  axes,
  providerScores,
  targetScores,
  onAxisClick,
  size = 220,
}) {
  const n = axes.length;
  if (n < 3) return null;
  const cx = size / 2,
    cy = size / 2;
  const R = size * 0.38;
  const labelR = R + 24;

  function pt(score, i) {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (Math.max(0, Math.min(100, score)) / 100) * R;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  }
  function labelPt(i) {
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

  const provPts = axes.map((_, i) => ptStr(providerScores[i], i)).join(" ");
  const targPts = axes.map((_, i) => ptStr(targetScores[i], i)).join(" ");

  // Grid rings at 25, 50, 75, 100
  const rings = [25, 50, 75, 100];

  return (
    <svg width={size} height={size} style={{ overflow: "visible" }}>
      {/* Grid rings */}
      {rings.map((r) => {
        const ringPts = axes.map((_, i) => ptStr(r, i)).join(" ");
        return (
          <polygon
            key={r}
            points={ringPts}
            fill="none"
            stroke="var(--border-default)"
            strokeWidth={r === 100 ? 1 : 0.5}
          />
        );
      })}
      {/* Axis lines */}
      {axes.map((_, i) => {
        const p = pt(100, i);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x.toFixed(1)}
            y2={p.y.toFixed(1)}
            stroke="var(--border-default)"
            strokeWidth="0.5"
          />
        );
      })}
      {/* Target polygon */}
      <polygon
        points={targPts}
        fill="var(--accent-soft)"
        fillOpacity="0.4"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="5,3"
      />
      {/* Provider polygon */}
      <polygon
        points={provPts}
        fill="var(--accent)"
        fillOpacity="0.18"
        stroke="var(--accent)"
        strokeWidth="2"
      />
      {/* Provider score dots */}
      {axes.map((_, i) => {
        const p = pt(providerScores[i], i);
        const score = providerScores[i];
        const tgt = targetScores[i];
        const dotColor =
          score >= tgt
            ? "var(--perf-target)"
            : score >= tgt * 0.9
              ? "var(--perf-below)"
              : "var(--perf-floor)";
        return (
          <circle
            key={i}
            cx={p.x.toFixed(1)}
            cy={p.y.toFixed(1)}
            r="4"
            fill={dotColor}
            stroke="var(--bg-surface)"
            strokeWidth="1.5"
          />
        );
      })}
      {/* Axis labels */}
      {axes.map((ax, i) => {
        const lp = labelPt(i);
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const anchor =
          Math.abs(Math.cos(angle)) < 0.1
            ? "middle"
            : Math.cos(angle) > 0
              ? "start"
              : "end";
        const score = providerScores[i];
        const tgt = targetScores[i];
        const labelColor =
          score < tgt * 0.9
            ? "var(--perf-floor)"
            : score < tgt
              ? "var(--perf-below)"
              : "var(--fg-secondary)";
        return (
          <g
            key={i}
            style={{ cursor: "pointer" }}
            onClick={() => onAxisClick && onAxisClick(ax)}
          >
            <text
              x={lp.x.toFixed(1)}
              y={lp.y.toFixed(1)}
              textAnchor={anchor}
              dominantBaseline="central"
              fill={labelColor}
              style={{
                font: "500 9px var(--font-mono)",
                letterSpacing: ".03em",
                textTransform: "uppercase",
              }}
            >
              {ax.short}
            </text>
            <text
              x={lp.x.toFixed(1)}
              y={(lp.y + 11).toFixed(1)}
              textAnchor={anchor}
              dominantBaseline="central"
              fill="var(--fg-tertiary)"
              style={{ font: "600 10px var(--font-sans)" }}
            >
              {providerScores[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Waterfall Chart (dimension contributions to composite) ─────────────── */
function WaterfallChart({ items, total, height = 260 }) {
  // items: [{label, weight, score, contribution, color}]
  const maxVal = 100;
  const barH = 28;
  const gap = 8;
  const labelW = 120;
  const numW = 56;
  const chartW = 320;
  const svgH = items.length * (barH + gap) + 40;
  let running = 0;

  return (
    <svg
      width={labelW + chartW + numW + 20}
      height={svgH}
      style={{ overflow: "visible" }}
    >
      {/* axis line */}
      <line
        x1={labelW}
        y1={0}
        x2={labelW}
        y2={svgH - 30}
        stroke="var(--border-default)"
        strokeWidth="0.5"
      />
      {/* total reference line */}
      <line
        x1={labelW + (total / maxVal) * chartW}
        y1={0}
        x2={labelW + (total / maxVal) * chartW}
        y2={svgH - 30}
        stroke="var(--fg-tertiary)"
        strokeWidth="0.5"
        strokeDasharray="4,3"
      />

      {items.map((it, i) => {
        const x = labelW + (running / maxVal) * chartW;
        const w = (it.contribution / maxVal) * chartW;
        const y = i * (barH + gap);
        running += it.contribution;
        const isAbove = it.score >= it.target;
        const barColor = isAbove ? it.color : "var(--perf-below)";
        return (
          <g key={it.label} style={{ cursor: "pointer" }}>
            {/* label */}
            <text
              x={labelW - 8}
              y={y + barH / 2}
              textAnchor="end"
              dominantBaseline="central"
              fill="var(--fg-secondary)"
              style={{
                font: "500 9px var(--font-mono)",
                letterSpacing: ".04em",
                textTransform: "uppercase",
              }}
            >
              {it.label}
            </text>
            {/* bar */}
            <rect
              x={x.toFixed(1)}
              y={y}
              width={Math.max(2, w.toFixed(1))}
              height={barH}
              rx="3"
              fill={barColor}
              fillOpacity="0.85"
            />
            {/* weight label inside bar if room */}
            {w > 32 && (
              <text
                x={(x + 6).toFixed(1)}
                y={y + barH / 2}
                dominantBaseline="central"
                fill="white"
                style={{ font: "500 9px var(--font-sans)" }}
              >
                {it.weight}%
              </text>
            )}
            {/* contribution label */}
            <text
              x={(x + w + 6).toFixed(1)}
              y={y + barH / 2}
              dominantBaseline="central"
              fill="var(--fg-primary)"
              style={{ font: "600 11px var(--font-sans)" }}
            >
              +{it.contribution.toFixed(1)}
            </text>
            <text
              x={(x + w + 6).toFixed(1)}
              y={y + barH / 2 + 12}
              dominantBaseline="central"
              fill="var(--fg-tertiary)"
              style={{ font: "400 9px var(--font-mono)" }}
            >
              {it.score} × {it.weight}%
            </text>
          </g>
        );
      })}
      {/* total bar */}
      <g>
        <text
          x={labelW - 8}
          y={items.length * (barH + gap) + barH / 2}
          textAnchor="end"
          dominantBaseline="central"
          fill="var(--fg-primary)"
          style={{
            font: "600 9px var(--font-mono)",
            letterSpacing: ".04em",
            textTransform: "uppercase",
          }}
        >
          COMPOSITE
        </text>
        <rect
          x={labelW}
          y={items.length * (barH + gap)}
          width={(total / maxVal) * chartW}
          height={barH}
          rx="3"
          fill="var(--accent)"
          fillOpacity="0.9"
        />
        <text
          x={labelW + (total / maxVal) * chartW + 6}
          y={items.length * (barH + gap) + barH / 2}
          dominantBaseline="central"
          fill="var(--accent)"
          style={{ font: "700 14px var(--font-sans)" }}
        >
          {total}
        </text>
      </g>
    </svg>
  );
}

/* ── Line Chart with threshold lines ───────────────────────────────────── */
function LineChart({
  data,
  periods,
  thresholds,
  height = 140,
  width = 480,
  projected,
}) {
  // data: number[], thresholds: [{value, label, color, dashed}]
  if (!data || data.length === 0) return null;
  const allVals = [...data, ...thresholds.map((t) => t.value)];
  if (projected) allVals.push(projected.value);
  const minV = Math.min(...allVals) * 0.9;
  const maxV = Math.max(...allVals) * 1.05;
  const range = maxV - minV;
  const padL = 36,
    padR = 48,
    padT = 12,
    padB = 28;
  const cw = width - padL - padR;
  const ch = height - padT - padB;

  function scaleX(i) {
    return padL + (i / (data.length - (projected ? 0 : 1))) * cw;
  }
  function scaleY(v) {
    return padT + ch - ((v - minV) / range) * ch;
  }

  const pts = data
    .map((v, i) => `${scaleX(i).toFixed(1)},${scaleY(v).toFixed(1)}`)
    .join(" ");
  const projX = scaleX(data.length);
  const projY = projected ? scaleY(projected.value) : 0;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* Threshold lines */}
      {thresholds.map((t) => {
        const ty = scaleY(t.value);
        return (
          <g key={t.label}>
            <line
              x1={padL}
              y1={ty.toFixed(1)}
              x2={padL + cw}
              y2={ty.toFixed(1)}
              stroke={t.color}
              strokeWidth="1"
              strokeDasharray={t.dashed ? "5,4" : "none"}
              strokeOpacity="0.7"
            />
            <text
              x={padL + cw + 4}
              y={ty}
              dominantBaseline="central"
              fill={t.color}
              style={{
                font: "500 8px var(--font-mono)",
                letterSpacing: ".03em",
              }}
            >
              {t.label}
            </text>
          </g>
        );
      })}
      {/* Main line */}
      <polyline
        points={pts}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Projected dashed segment */}
      {projected && (
        <>
          <line
            x1={scaleX(data.length - 1).toFixed(1)}
            y1={scaleY(data[data.length - 1]).toFixed(1)}
            x2={projX.toFixed(1)}
            y2={projY.toFixed(1)}
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeDasharray="6,4"
            strokeOpacity="0.6"
          />
          <circle
            cx={projX.toFixed(1)}
            cy={projY.toFixed(1)}
            r="4"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.5"
            strokeDasharray="3,2"
          />
          <text
            x={(projX + 6).toFixed(1)}
            y={projY}
            dominantBaseline="central"
            fill="var(--accent)"
            style={{ font: "500 10px var(--font-sans)" }}
          >
            ~{projected.value}
          </text>
        </>
      )}
      {/* Data points */}
      {data.map((v, i) => (
        <g key={i}>
          <circle
            cx={scaleX(i).toFixed(1)}
            cy={scaleY(v).toFixed(1)}
            r="4"
            fill="var(--accent)"
            stroke="var(--bg-surface)"
            strokeWidth="1.5"
          />
          <text
            x={scaleX(i).toFixed(1)}
            y={(scaleY(v) - 8).toFixed(1)}
            textAnchor="middle"
            fill="var(--fg-primary)"
            style={{ font: "600 10px var(--font-sans)" }}
          >
            {v}
          </text>
        </g>
      ))}
      {/* X axis labels */}
      {periods &&
        periods.map((p, i) => (
          <text
            key={i}
            x={scaleX(i).toFixed(1)}
            y={height - 4}
            textAnchor="middle"
            fill="var(--fg-tertiary)"
            style={{ font: "500 8px var(--font-mono)", letterSpacing: ".03em" }}
          >
            {p}
          </text>
        ))}
    </svg>
  );
}

/* ── Histogram with provider marker ────────────────────────────────────── */
function Histogram({
  bins,
  providerScore,
  mean,
  median,
  height = 120,
  width = 400,
}) {
  const maxCount = Math.max(...bins.map((b) => b.count));
  const padL = 8,
    padR = 8,
    padT = 12,
    padB = 24;
  const cw = width - padL - padR;
  const ch = height - padT - padB;
  const barW = cw / bins.length - 2;
  const minScore = parseInt(bins[0].bin);
  const maxScore = parseInt(bins[bins.length - 1].bin) + 4;
  const scoreRange = maxScore - minScore;

  function scoreToX(s) {
    return padL + ((s - minScore) / scoreRange) * cw;
  }

  const provX = scoreToX(providerScore);
  const meanX = scoreToX(mean);
  const medX = scoreToX(median);

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {/* Bars */}
      {bins.map((b, i) => {
        const x = padL + i * (cw / bins.length) + 1;
        const bh = (b.count / maxCount) * ch;
        const by = padT + ch - bh;
        const binStart = parseInt(b.bin);
        const isCurrent =
          providerScore >= binStart && providerScore < binStart + 5;
        return (
          <g key={b.bin}>
            <rect
              x={x.toFixed(1)}
              y={by.toFixed(1)}
              width={barW.toFixed(1)}
              height={bh.toFixed(1)}
              rx="2"
              fill={isCurrent ? "var(--accent)" : "var(--bg-muted)"}
              stroke={isCurrent ? "var(--accent)" : "var(--border-default)"}
              strokeWidth="0.5"
            />
            {bh > 16 && (
              <text
                x={(x + barW / 2).toFixed(1)}
                y={(by + bh / 2).toFixed(1)}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isCurrent ? "white" : "var(--fg-tertiary)"}
                style={{ font: "500 9px var(--font-sans)" }}
              >
                {b.count}
              </text>
            )}
          </g>
        );
      })}
      {/* Mean line */}
      <line
        x1={meanX.toFixed(1)}
        y1={padT}
        x2={meanX.toFixed(1)}
        y2={padT + ch}
        stroke="var(--fg-secondary)"
        strokeWidth="1.5"
      />
      {/* Median line */}
      <line
        x1={medX.toFixed(1)}
        y1={padT}
        x2={medX.toFixed(1)}
        y2={padT + ch}
        stroke="var(--fg-secondary)"
        strokeWidth="1"
        strokeDasharray="4,3"
      />
      {/* Provider line */}
      <line
        x1={provX.toFixed(1)}
        y1={padT - 8}
        x2={provX.toFixed(1)}
        y2={padT + ch}
        stroke="var(--accent)"
        strokeWidth="2"
      />
      <polygon
        points={`${provX},${padT - 8} ${provX - 5},${padT - 2} ${provX + 5},${padT - 2}`}
        fill="var(--accent)"
      />
      {/* X labels */}
      {bins
        .filter((_, i) => i % 2 === 0)
        .map((b, i) => {
          const x = padL + bins.indexOf(b) * (cw / bins.length) + barW / 2 + 1;
          return (
            <text
              key={b.bin}
              x={x.toFixed(1)}
              y={height - 4}
              textAnchor="middle"
              fill="var(--fg-tertiary)"
              style={{ font: "500 8px var(--font-mono)" }}
            >
              {b.bin}
            </text>
          );
        })}
      {/* Legend */}
      <text
        x={meanX.toFixed(1)}
        y={(padT - 12).toFixed(1)}
        textAnchor="middle"
        fill="var(--fg-secondary)"
        style={{ font: "500 8px var(--font-mono)" }}
      >
        μ {mean}
      </text>
    </svg>
  );
}

/* ── Horizontal Bar Chart (peer comparison) ─────────────────────────────── */
function HorizBarChart({ items, width = 380, height = 28, maxVal = 100 }) {
  // items: [{label, value, color, bold}]
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((it, i) => {
        const pct = Math.max(0, Math.min(100, (it.value / maxVal) * 100));
        return (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <span
              style={{
                width: 110,
                font: it.bold
                  ? "600 11px var(--font-sans)"
                  : "400 11px var(--font-sans)",
                color: it.bold ? "var(--fg-primary)" : "var(--fg-secondary)",
                flexShrink: 0,
                textAlign: "right",
              }}
            >
              {it.label}
            </span>
            <div
              style={{
                flex: 1,
                height: height,
                background: "var(--bg-elevated)",
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
                border: ".5px solid var(--border-default)",
              }}
            >
              <div
                style={{
                  width: pct + "%",
                  height: "100%",
                  background: it.color,
                  borderRadius: 4,
                  opacity: it.bold ? 1 : 0.55,
                  transition: "width .4s ease",
                }}
              />
              {it.band && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: (it.band[0] / maxVal) * 100 + "%",
                    width: ((it.band[1] - it.band[0]) / maxVal) * 100 + "%",
                    background: "var(--fg-primary)",
                    opacity: 0.08,
                  }}
                />
              )}
            </div>
            <span
              style={{
                width: 48,
                font: "600 11px var(--font-mono)",
                color: it.color,
                flexShrink: 0,
              }}
            >
              {it.displayVal}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ── Grouped / Impact Bar Chart ─────────────────────────────────────────── */
function ImpactBarChart({ items, width = 360, height = 22 }) {
  // items: [{label, value (can be negative), color}]
  const maxAbs = Math.max(...items.map((it) => Math.abs(it.value)));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {items.map((it, i) => {
        const pct = (Math.abs(it.value) / maxAbs) * 100;
        const isPos = it.value > 0;
        return (
          <div
            key={i}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <span
              style={{
                width: 140,
                font: "400 11px var(--font-sans)",
                color: "var(--fg-secondary)",
                flexShrink: 0,
                textAlign: "right",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              {it.label}
            </span>
            <div
              style={{
                flex: 1,
                height,
                background: "var(--bg-elevated)",
                borderRadius: 4,
                overflow: "hidden",
                border: ".5px solid var(--border-default)",
              }}
            >
              <div
                style={{
                  width: pct + "%",
                  height: "100%",
                  background: isPos
                    ? "var(--perf-target)"
                    : "var(--perf-floor)",
                  opacity: 0.8,
                  borderRadius: 4,
                  transition: "width .4s ease",
                }}
              />
            </div>
            <span
              style={{
                width: 44,
                font: "600 11px var(--font-mono)",
                color: isPos ? "var(--perf-target)" : "var(--perf-floor)",
                flexShrink: 0,
              }}
            >
              {isPos ? "+" : ""}
              {it.value.toFixed(1)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export {
  Sparkline,
  RadarChart,
  WaterfallChart,
  LineChart,
  Histogram,
  HorizBarChart,
  ImpactBarChart,
};
// window.Sparkline = Sparkline;
// window.RadarChart = RadarChart;
// window.WaterfallChart = WaterfallChart;
// window.LineChart = LineChart;
// window.Histogram = Histogram;
// window.HorizBarChart = HorizBarChart;
// window.ImpactBarChart = ImpactBarChart;
