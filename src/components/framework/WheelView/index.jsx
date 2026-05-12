export function WheelView({ onSelect, search, hoverId, setHoverId, counts }) {
  const cx = 400,
    cy = 320;
  const rInner = 92,
    rOuterWedge = 232;
  const rRingIn = 250,
    rRingOut = 286;
  const sliceArc = 360 / POLAR_DIMS.length;
  const matches = (d) =>
    !search ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase()) ||
    measuresFor(d.id).some((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()),
    );

  return (
    <div className="vf-wheel-wrap">
      <svg
        viewBox="0 0 800 720"
        className="vf-wheel"
        role="img"
        aria-label="Value framework wheel"
      >
        <defs>
          <filter id="vf-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* === D10 foundation — drawn first so wheel overlays it cleanly === */}
        <g
          className={
            "vf-foundation" +
            (hoverId === FOUNDATION_DIM ? " hot" : "") +
            (search && !matches(dimById(FOUNDATION_DIM)) ? " dim" : "")
          }
          onClick={() => onSelect(FOUNDATION_DIM)}
          onMouseEnter={() => setHoverId(FOUNDATION_DIM)}
          onMouseLeave={() => setHoverId(null)}
        >
          <rect
            x="120"
            y="582"
            width="560"
            height="78"
            rx="16"
            fill={dimById(FOUNDATION_DIM).color_soft}
            stroke={dimById(FOUNDATION_DIM).color}
            strokeWidth="1.5"
          />
          <text
            x="400"
            y="615"
            textAnchor="middle"
            className="vf-foundation-code"
          >
            D10 · FOUNDATIONAL
          </text>
          <text
            x="400"
            y="640"
            textAnchor="middle"
            className="vf-foundation-name"
          >
            Operational Capability
          </text>
          <text
            x="688"
            y="617"
            textAnchor="end"
            className="vf-foundation-count"
          >
            {counts.D10}
          </text>
          <text
            x="688"
            y="638"
            textAnchor="end"
            className="vf-foundation-count-lbl"
          >
            measures
          </text>
        </g>

        {/* === D9 cross-cutting halo ring === */}
        <g
          className={
            "vf-ring" +
            (hoverId === RING_DIM ? " hot" : "") +
            (search && !matches(dimById(RING_DIM)) ? " dim" : "")
          }
          onClick={() => onSelect(RING_DIM)}
          onMouseEnter={() => setHoverId(RING_DIM)}
          onMouseLeave={() => setHoverId(null)}
        >
          <circle
            cx={cx}
            cy={cy}
            r={(rRingIn + rRingOut) / 2}
            fill="none"
            stroke={dimById(RING_DIM).color_soft}
            strokeWidth={rRingOut - rRingIn}
          />
          <circle
            cx={cx}
            cy={cy}
            r={rRingOut}
            fill="none"
            stroke={dimById(RING_DIM).color}
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          <circle
            cx={cx}
            cy={cy}
            r={rRingIn}
            fill="none"
            stroke={dimById(RING_DIM).color}
            strokeOpacity="0.5"
            strokeWidth="1"
          />
          {/* Ring label arc */}
          <defs>
            <path
              id="ring-text-path"
              d={`M ${cx - rRingOut + 10} ${cy} A ${rRingOut - 10} ${rRingOut - 10} 0 1 1 ${cx + rRingOut - 10} ${cy}`}
            />
          </defs>
          <text className="vf-ring-label" fill={dimById(RING_DIM).color}>
            <textPath
              href="#ring-text-path"
              startOffset="50%"
              textAnchor="middle"
            >
              D9 · CROSS-CUTTING · HEALTH EQUITY · STRATIFIES D1–D8
            </textPath>
          </text>
        </g>

        {/* === 8 wedges D1-D8 === */}
        {POLAR_DIMS.map((id, i) => {
          const dim = dimById(id);
          const a1 = i * sliceArc;
          const a2 = (i + 1) * sliceArc;
          const mid = (a1 + a2) / 2;
          const [lx, ly] = polar(cx, cy, (rInner + rOuterWedge) / 2, mid);
          const [cxBadge, cyBadge] = polar(cx, cy, rOuterWedge - 22, mid);
          const isHover = hoverId === id;
          const dimmed = search && !matches(dim);
          return (
            <g
              key={id}
              className={
                "vf-wedge" + (isHover ? " hot" : "") + (dimmed ? " dim" : "")
              }
              onClick={() => onSelect(id)}
              onMouseEnter={() => setHoverId(id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <path
                d={wedgePath(cx, cy, rInner, rOuterWedge, a1, a2)}
                fill={dim.color_soft}
                stroke={dim.color}
                strokeWidth={isHover ? 2.5 : 1}
              />
              <text
                x={lx}
                y={ly - 6}
                textAnchor="middle"
                className="vf-wedge-code"
                fill={dim.color}
              >
                {id}
              </text>
              <text
                x={lx}
                y={ly + 11}
                textAnchor="middle"
                className="vf-wedge-name"
              >
                {dim.short.toUpperCase()}
              </text>
              <circle
                cx={cxBadge}
                cy={cyBadge}
                r="14"
                fill="var(--bg-surface)"
                stroke={dim.color}
                strokeWidth="1.5"
              />
              <text
                x={cxBadge}
                y={cyBadge + 4}
                textAnchor="middle"
                className="vf-wedge-badge"
                fill={dim.color}
              >
                {counts[id] || (dim.driverType === "ICHOM" ? "ICHOM" : 0)}
              </text>
            </g>
          );
        })}

        {/* === Center disk: composite === */}
        <g className="vf-center">
          <circle
            cx={cx}
            cy={cy}
            r={rInner - 2}
            fill="var(--bg-surface)"
            stroke="var(--border-default)"
            strokeWidth="1"
          />
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            className="vf-center-eyebrow"
          >
            VALUE
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            className="vf-center-title"
          >
            COMPOSITE
          </text>
          <text
            x={cx}
            y={cy + 30}
            textAnchor="middle"
            className="vf-center-sub"
          >
            10 dims · {MEASURES.length} measures
          </text>
        </g>
      </svg>

      {/* Side legend explaining dimension types */}
      <aside className="vf-wheel-legend">
        <h4>Reading the wheel</h4>
        <ul>
          <li>
            <span
              className="dot"
              style={{ background: "oklch(0.62 0.18 25)" }}
            />
            <div>
              <b>D1–D8</b> — domain pillars (8 wedges). D1 &amp; D2 inherit
              measures from contracted ICHOM Sets; D3–D8 each own a measure
              catalogue.
            </div>
          </li>
          <li>
            <span className="dot" style={{ background: dimById("D9").color }} />
            <div>
              <b>D9 Equity</b> — cross-cutting ring. Stratifies every other
              dimension; never a stand-alone score.
            </div>
          </li>
          <li>
            <span
              className="dot"
              style={{ background: dimById("D10").color }}
            />
            <div>
              <b>D10 Capability</b> — foundational base. Acts as a multiplier on
              the composite — weak D10 invalidates the rest.
            </div>
          </li>
          <li>
            <span className="dot" style={{ background: "var(--accent)" }} />
            <div>
              <b>Composite</b> — weighted sum of D1–D8, stratified by D9,
              multiplied by D10.
            </div>
          </li>
        </ul>
        <p className="vf-tip">Click any region to open its catalogue.</p>
      </aside>
    </div>
  );
}
