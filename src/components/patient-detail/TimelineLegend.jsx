import React from "react";
const { useState } = React;

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const TOTAL_MONTHS = 24; // Jan 2024 – Dec 2025
const LANE_H = 44;
const PAD_L = 92;
const PAD_R = 32;
const PAD_T = 36;
const MONTH_W = 74;
const SVG_W = PAD_L + TOTAL_MONTHS * MONTH_W + PAD_R;
const LANES = [
  { id:"encounter", label:"Encounters",  y:0,   color:"var(--accent)" },
  { id:"lab",       label:"Labs",        y:1,   color:"oklch(62% .12 82)" },
  { id:"proms",     label:"PROMs",       y:2,   color:"var(--perf-below)" },
  { id:"med",       label:"Medications", y:3,   color:"var(--perf-target)" },
  { id:"safety",    label:"Safety",      y:4,   color:"var(--perf-floor)" },
  { id:"cost",      label:"Cost Events", y:5,   color:"oklch(46% .08 75)" },
];
const SVG_H = PAD_T + LANES.length * LANE_H + 20;

/* Color maps */
const EVENT_COLORS = {
  encounter: { pc:"var(--accent)", endo:"oklch(52% .11 200)", psych:"var(--perf-below)" },
  lab:       { hba1c:"oklch(62% .12 82)", lipid:"var(--accent)", egfr:"var(--perf-target)", other:"var(--fg-tertiary)" },
  proms:     { phq9:"var(--perf-below)", eq5d:"var(--accent)", gad7:"oklch(62% .12 82)" },
  med:       { start:"var(--perf-target)", change:"oklch(62% .12 82)" },
  safety:    { interaction:"var(--perf-floor)" },
  cost:      { inpatient:"var(--perf-floor)" },
};

function getEventColor(ev) {
  return (EVENT_COLORS[ev.type] || {})[ev.sub] || "var(--fg-tertiary)";
}

function eventX(month, day = 15) {
  return PAD_L + month * MONTH_W + (day / 30) * MONTH_W;
}

function laneY(type) {
  const l = LANES.find(l => l.id === type);
  return l ? PAD_T + l.y * LANE_H + LANE_H / 2 : PAD_T;
}

/* ── Event icon path (SVG d= attribute) ─────────────────────────────────── */
function EventIcon({ type, sub, x, y, r = 8, color, active }) {
  const strokeW = active ? 2.5 : 1.5;
  const fill = color;
  const strokeColor = active ? "var(--fg-primary)" : "var(--bg-surface)";
  if (type === "safety") {
    const pts = `${x},${y-r} ${x+r*0.87},${y+r*0.5} ${x-r*0.87},${y+r*0.5}`;
    return <polygon points={pts} fill={fill} stroke={strokeColor} strokeWidth={strokeW} />;
  }
  if (type === "cost") {
    return <rect x={x-r} y={y-r} width={r*2} height={r*2} rx="3" fill={fill} stroke={strokeColor} strokeWidth={strokeW} />;
  }
  if (type === "med") {
    return <ellipse cx={x} cy={y} rx={r*1.1} ry={r*0.7} fill={fill} stroke={strokeColor} strokeWidth={strokeW} />;
  }
  return <circle cx={x} cy={y} r={r} fill={fill} stroke={strokeColor} strokeWidth={strokeW} fillOpacity="0.9" />;
}

/* ── Tooltip ─────────────────────────────────────────────────────────────── */
function Tooltip({ event, x, y, svgWidth }) {
  if (!event) return null;
  const maxX = svgWidth - 220;
  const tx = Math.min(x + 12, maxX);
  const ty = y - 60;
  const color = getEventColor(event);
  return (
    <g>
      <rect x={tx - 6} y={ty - 4} width={216} height={56} rx="6"
        fill="var(--fg-primary)" opacity="0.95" />
      <text x={tx} y={ty + 10} fill="var(--bg-surface)" style={{ font:"600 10px var(--font-sans)" }}>{event.title}</text>
      <text x={tx} y={ty + 24} fill="var(--bg-elevated)" style={{ font:"400 9px var(--font-sans)" }}>
        {MONTHS[event.month % 12]} {event.month < 12 ? 2024 : 2025}  ·  {event.provider || ""}
      </text>
      <text x={tx} y={ty + 38} fill="var(--bg-elevated)" style={{ font:"400 9px var(--font-sans)" }}>
        {event.summary?.slice(0, 44)}{event.summary?.length > 44 ? "…" : ""}
      </text>
      {event.sets?.length > 0 && (
        <text x={tx} y={ty + 50} fill={color} style={{ font:"500 8px var(--font-mono)", letterSpacing:".03em" }}>
          {event.sets.join(" · ")}
        </text>
      )}
    </g>
  );
}

/* ── Main Timeline component ─────────────────────────────────────────────── */
function ClinicalTimeline({ events, timepoints, onEventClick, zoom }) {
  const [hovered, setHovered] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(null);

  const visibleMonths = zoom === "recent" ? 6 : TOTAL_MONTHS;
  const startMonth    = zoom === "recent" ? TOTAL_MONTHS - visibleMonths : 0;
  const W = PAD_L + visibleMonths * MONTH_W + PAD_R;

  function xOf(month, day = 15) {
    if (zoom === "recent") {
      return PAD_L + (month - startMonth) * MONTH_W + (day / 30) * MONTH_W;
    }
    return PAD_L + month * MONTH_W + (day / 30) * MONTH_W;
  }

  const visEvents = events.filter(e =>
    zoom === "recent" ? (e.month >= startMonth) : true
  );

  return (
    <div style={{ overflowX: "auto", overflowY: "visible", WebkitOverflowScrolling: "touch" }}>
      <svg width={W} height={SVG_H + 8}
        style={{ display: "block", overflow: "visible", cursor: "default" }}>

        {/* ── Set color bands (background) ── */}
        {/* Diabetes band: lanes 0,1 (encounters+labs) */}
        <rect x={PAD_L} y={PAD_T} width={W - PAD_L - PAD_R} height={LANE_H * 2}
          fill="var(--accent)" fillOpacity="0.03" rx="4" />
        {/* Depression band: lane 2 (PROMs) */}
        <rect x={PAD_L} y={PAD_T + LANE_H * 2} width={W - PAD_L - PAD_R} height={LANE_H}
          fill="oklch(62% .12 82)" fillOpacity="0.03" rx="4" />

        {/* ── Lane labels ── */}
        {LANES.map(lane => (
          <g key={lane.id}>
            <text x={PAD_L - 8} y={PAD_T + lane.y * LANE_H + LANE_H / 2}
              textAnchor="end" dominantBaseline="central"
              fill={lane.color} style={{ font:"500 9px var(--font-mono)", letterSpacing:".04em", textTransform:"uppercase" }}>
              {lane.label}
            </text>
            {/* Lane divider */}
            <line x1={PAD_L} y1={PAD_T + lane.y * LANE_H}
              x2={W - PAD_R} y2={PAD_T + lane.y * LANE_H}
              stroke="var(--border-default)" strokeWidth="0.5" />
          </g>
        ))}
        {/* Bottom lane border */}
        <line x1={PAD_L} y1={PAD_T + LANES.length * LANE_H}
          x2={W - PAD_R} y2={PAD_T + LANES.length * LANE_H}
          stroke="var(--border-default)" strokeWidth="0.5" />

        {/* ── Month labels and grid ── */}
        {Array.from({ length: visibleMonths }, (_, i) => {
          const absMonth = startMonth + i;
          const year = absMonth < 12 ? 2024 : 2025;
          const mo = absMonth % 12;
          const x = PAD_L + i * MONTH_W;
          return (
            <g key={absMonth}>
              <line x1={x} y1={PAD_T} x2={x} y2={PAD_T + LANES.length * LANE_H}
                stroke="var(--border-default)" strokeWidth="0.3" />
              <text x={x + MONTH_W / 2} y={PAD_T - 8} textAnchor="middle"
                fill="var(--fg-tertiary)" style={{ font:"500 8px var(--font-mono)" }}>
                {MONTHS[mo]}{mo === 0 || (zoom === "recent" && i === 0) ? ` ${year}` : ""}
              </text>
            </g>
          );
        })}

        {/* ── ICHOM timepoint reference lines ── */}
        {timepoints.filter(tp => zoom === "recent" ? tp.month >= startMonth : true).map(tp => {
          const x = xOf(tp.month, 1);
          const allMet = tp.phq9 && tp.eq5d && tp.hba1c !== false;
          return (
            <g key={tp.label}>
              {/* Highlight column */}
              <rect x={x - 3} y={PAD_T} width={MONTH_W * 0.6} height={LANES.length * LANE_H}
                fill={allMet ? "var(--perf-target)" : "oklch(62% .12 82)"} fillOpacity="0.06" />
              {/* Dashed vertical line */}
              <line x1={x} y1={PAD_T - 20} x2={x} y2={PAD_T + LANES.length * LANE_H + 8}
                stroke={allMet ? "var(--perf-target)" : "oklch(62% .12 82)"}
                strokeWidth="1.5" strokeDasharray="5,4" />
              {/* Label */}
              <text x={x} y={PAD_T - 22} textAnchor="middle"
                fill={allMet ? "var(--perf-target)" : "var(--perf-below)"}
                style={{ font:"600 8px var(--font-mono)", letterSpacing:".04em" }}>
                {tp.label.toUpperCase()}
              </text>
              {/* Checkmark / warning */}
              <text x={x + 12} y={PAD_T - 22} fill={allMet ? "var(--perf-target)" : "var(--perf-below)"}
                style={{ font:"bold 10px var(--font-sans)" }}>
                {allMet ? "✓" : "⚠"}
              </text>
            </g>
          );
        })}

        {/* ── Events ── */}
        {visEvents.map(ev => {
          const x = xOf(ev.month, ev.day || 15);
          const y = laneY(ev.type);
          const color = getEventColor(ev);
          const isHovered = hovered?.id === ev.id;
          const isActive = active?.id === ev.id;
          return (
            <g key={ev.id}
              onMouseEnter={() => { setHovered(ev); setHoverPos({ x, y }); }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { setActive(ev); onEventClick && onEventClick(ev); }}
              style={{ cursor:"pointer" }}>
              {/* Hover ring */}
              {isHovered && (
                <circle cx={x} cy={y} r={14} fill={color} fillOpacity="0.15" />
              )}
              <EventIcon type={ev.type} sub={ev.sub} x={x} y={y}
                color={color} active={isActive} r={isHovered ? 9 : 8} />
              {/* Value label for lab/proms */}
              {(ev.type === "lab" || ev.type === "proms") && ev.value && (
                <text x={x} y={y + 18} textAnchor="middle"
                  fill={color} style={{ font:"600 7px var(--font-mono)", letterSpacing:".01em" }}>
                  {typeof ev.value === "number" ? ev.value : ev.score}
                </text>
              )}
            </g>
          );
        })}

        {/* ── Tooltip (renders on top) ── */}
        {hovered && (
          <Tooltip event={hovered} x={hoverPos.x} y={hoverPos.y} svgWidth={W} />
        )}
      </svg>
    </div>
  );
}

/* ── Timeline legend ─────────────────────────────────────────────────────── */
function TimelineLegend() {
  const items = [
    { color:"var(--accent)",       icon:"circle",    label:"Primary Care Visit" },
    { color:"oklch(52% .11 200)",  icon:"circle",    label:"Endocrinology Visit" },
    { color:"var(--perf-below)",   icon:"circle",    label:"Psychiatry Visit" },
    { color:"oklch(62% .12 82)",   icon:"circle",    label:"Lab Result" },
    { color:"var(--perf-below)",   icon:"circle",    label:"PROMs Submission" },
    { color:"var(--perf-target)",  icon:"ellipse",   label:"Medication Event" },
    { color:"var(--perf-floor)",   icon:"triangle",  label:"Safety Event" },
    { color:"oklch(46% .08 75)",   icon:"square",    label:"Cost Event" },
  ];
  return (
    <div style={{ display:"flex", gap:16, flexWrap:"wrap", padding:"10px 0 6px" }}>
      {items.map(item => (
        <div key={item.label} style={{ display:"flex", alignItems:"center", gap:5 }}>
          <svg width={14} height={14} style={{ flexShrink:0 }}>
            {item.icon === "triangle" && <polygon points="7,1 13,13 1,13" fill={item.color} />}
            {item.icon === "square"   && <rect x="1" y="1" width="12" height="12" rx="2" fill={item.color} />}
            {item.icon === "ellipse"  && <ellipse cx="7" cy="7" rx="6" ry="4" fill={item.color} />}
            {item.icon === "circle"   && <circle cx="7" cy="7" r="6" fill={item.color} />}
          </svg>
          <span style={{ font:"400 10px var(--font-mono)", color:"var(--fg-secondary)", whiteSpace:"nowrap" }}>{item.label}</span>
        </div>
      ))}
      <div style={{ display:"flex", alignItems:"center", gap:5 }}>
        <div style={{ width:16, height:2, borderTop:"2px dashed var(--perf-target)" }} />
        <span style={{ font:"400 10px var(--font-mono)", color:"var(--fg-secondary)" }}>ICHOM Timepoint</span>
      </div>
    </div>
  );
}

export {TimelineLegend, ClinicalTimeline}