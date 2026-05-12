import { DEPS, DIMS } from "@/mock/framework";
import { dimById, polar } from "@/utils/helpers";

export default function DepsView({ onSelect, hoverId, setHoverId }) {
  // Arrange 10 dims around a circle. Draw curved arrows from src → dst.
  const cx = 400,
    cy = 360,
    r = 250;
  // Order around the circle, clockwise from top: foundation/cross-cut at top + bottom
  const order = ["D1", "D2", "D5", "D7", "D8", "D6", "D4", "D3", "D10", "D9"]; // visually balanced
  const positions = {};
  order.forEach((id, i) => {
    const ang = (i * 360) / order.length;
    const [x, y] = polar(cx, cy, r, ang);
    positions[id] = { x, y, ang };
  });

  const filteredDeps = hoverId
    ? DEPS.filter((e) => e.from === hoverId || e.to === hoverId)
    : DEPS;

  const edgePath = (from, to) => {
    const a = positions[from];
    const b = positions[to];
    // bezier curving toward center
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const ccx = (mx + cx) / 2; // pull toward center
    const ccy = (my + cy) / 2;
    return `M ${a.x} ${a.y} Q ${ccx} ${ccy} ${b.x} ${b.y}`;
  };

  return (
    <div className="vf-deps-wrap">
      <svg viewBox="0 0 800 720" className="vf-deps">
        <defs>
          {DIMS.map((d) => (
            <marker
              key={d.id}
              id={"arrow-" + d.id}
              viewBox="0 0 12 12"
              refX="11"
              refY="6"
              markerWidth="9"
              markerHeight="9"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 12 6 L 0 12 z" fill={d.color} />
            </marker>
          ))}
        </defs>
        {/* Edges */}
        <g className="vf-deps-edges">
          {filteredDeps.map((e, i) => {
            const dimSrc = dimById(e.from);
            const isStrat = e.kind === "strat";
            const isFoundation = e.kind === "foundation";
            return (
              <path
                key={i}
                d={edgePath(e.from, e.to)}
                fill="none"
                stroke={dimSrc.color}
                strokeOpacity={
                  hoverId ? 0.85 : isStrat || isFoundation ? 0.18 : 0.4
                }
                strokeWidth={isStrat || isFoundation ? 1 : 1.6}
                strokeDasharray={isStrat ? "3 3" : isFoundation ? "1 4" : "0"}
                markerEnd={`url(#arrow-${e.from})`}
              />
            );
          })}
        </g>
        {/* Nodes */}
        <g className="vf-deps-nodes">
          {order.map((id) => {
            const d = dimById(id);
            const p = positions[id];
            const isHover = hoverId === id;
            const inEdges = DEPS.filter((e) => e.to === id).length;
            const outEdges = DEPS.filter((e) => e.from === id).length;
            return (
              <g
                key={id}
                transform={`translate(${p.x} ${p.y})`}
                className={"vf-deps-node" + (isHover ? " hot" : "")}
                onClick={() => onSelect(id)}
                onMouseEnter={() => setHoverId(id)}
                onMouseLeave={() => setHoverId(null)}
              >
                <circle
                  r={isHover ? 38 : 32}
                  fill={d.color_soft}
                  stroke={d.color}
                  strokeWidth={isHover ? 2.5 : 1.5}
                />
                <text
                  y="-3"
                  textAnchor="middle"
                  className="vf-deps-node-id"
                  fill={d.color}
                >
                  {id}
                </text>
                <text y="13" textAnchor="middle" className="vf-deps-node-flow">
                  ↓{inEdges} ↑{outEdges}
                </text>
                <text y={42} textAnchor="middle" className="vf-deps-node-label">
                  {d.short}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      <aside className="vf-deps-legend">
        <h4>Dependency types</h4>
        <ul>
          <li>
            <svg width="40" height="8">
              <line
                x1="2"
                y1="4"
                x2="38"
                y2="4"
                stroke="var(--fg-secondary)"
                strokeWidth="1.6"
              />
            </svg>
            <div>Causal — source dimension informs target</div>
          </li>
          <li>
            <svg width="40" height="8">
              <line
                x1="2"
                y1="4"
                x2="38"
                y2="4"
                stroke="var(--fg-secondary)"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            </svg>
            <div>Stratifies — D9 splits target by equity strata</div>
          </li>
          <li>
            <svg width="40" height="8">
              <line
                x1="2"
                y1="4"
                x2="38"
                y2="4"
                stroke="var(--fg-secondary)"
                strokeWidth="1"
                strokeDasharray="1 4"
              />
            </svg>
            <div>Foundational — D10 underpins target</div>
          </li>
        </ul>
        <p className="vf-tip">
          Hover a node to isolate its in/out edges. Click to open its catalogue.
        </p>
        <div className="vf-deps-summary">
          <div className="row">
            <span>Total edges</span>
            <b>{DEPS.length}</b>
          </div>
          <div className="row">
            <span>Causal</span>
            <b>{DEPS.filter((e) => !e.kind).length}</b>
          </div>
          <div className="row">
            <span>Stratifying (D9)</span>
            <b>{DEPS.filter((e) => e.kind === "strat").length}</b>
          </div>
          <div className="row">
            <span>Foundation (D10)</span>
            <b>{DEPS.filter((e) => e.kind === "foundation").length}</b>
          </div>
        </div>
      </aside>
    </div>
  );
}
