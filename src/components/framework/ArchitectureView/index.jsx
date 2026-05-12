import { Icons } from "@/components/Icons/Icons";
import { dimById, measuresFor } from "@/utils/helpers";

export default function ArchitectureView({
  onSelect,
  search,
  hoverId,
  setHoverId,
  counts,
}) {
  const matches = (d) =>
    !search ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.id.toLowerCase().includes(search.toLowerCase()) ||
    measuresFor(d.id).some((m) =>
      m.name.toLowerCase().includes(search.toLowerCase()),
    );
  const pillarDims = ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8"];
  const equity = dimById("D9");
  const foundation = dimById("D10");

  const renderRow = (d, kind) => {
    const dimmed = search && !matches(d);
    const isHover = hoverId === d.id;
    const ms = measuresFor(d.id);
    return (
      <button
        className={
          "vf-arch-row " +
          kind +
          (isHover ? " hot" : "") +
          (dimmed ? " dim" : "")
        }
        style={{ "--row-color": d.color, "--row-soft": d.color_soft }}
        onClick={() => onSelect(d.id)}
        onMouseEnter={() => setHoverId(d.id)}
        onMouseLeave={() => setHoverId(null)}
        aria-label={d.name}
      >
        <div className="vf-arch-row-meta">
          <div className="row-tag">
            {d.id} · {d.driverType.toUpperCase()}
          </div>
          <h3>{d.name}</h3>
          <p>
            {kind === "equity"
              ? "Cross-cutting. Stratifies every dimension below by SES, nationality, gender, geography. Disparity ratios feed back into the composite."
              : "Foundational. Workforce adequacy, EHR maturity, data quality. Acts as a multiplier (≤ 1.0) on the composite — weak D10 invalidates everything above."}
          </p>
        </div>
        <div className="vf-arch-row-stack" aria-hidden="true">
          {ms.map((m) => (
            <span
              key={m.id}
              className={"mini-tile status-" + m.status}
              title={m.name}
            />
          ))}
        </div>
        <div className="vf-arch-row-stat">
          <div className="num">{ms.length}</div>
          <div className="lbl">
            {kind === "equity" ? "stratifier measures" : "capability measures"}
          </div>
          <div className="weight">
            {kind === "equity" ? `weight ${d.weight}%` : `multiplier ≤1.0`}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="vf-arch-wrap">
      <div className="vf-arch-canvas">
        {/* D9 cross-cutting ribbon */}
        {renderRow(equity, "equity")}

        {/* Connector showing D9 stratifies all pillars */}
        <div className="vf-arch-connector top" aria-hidden="true">
          {pillarDims.map((_, i) => (
            <span key={i} className="cnx-line" />
          ))}
        </div>

        {/* 8 domain pillars */}
        <div className="vf-arch-pillars">
          {pillarDims.map((id) => {
            const d = dimById(id);
            const ms = measuresFor(id);
            const isICHOM = d.driverType === "ICHOM";
            const isHover = hoverId === id;
            const dimmed = search && !matches(d);
            return (
              <button
                key={id}
                className={
                  "vf-pillar" +
                  (isHover ? " hot" : "") +
                  (dimmed ? " dim" : "") +
                  (isICHOM ? " ichom" : "")
                }
                style={{ "--pil-color": d.color, "--pil-soft": d.color_soft }}
                onClick={() => onSelect(id)}
                onMouseEnter={() => setHoverId(id)}
                onMouseLeave={() => setHoverId(null)}
                aria-label={d.name}
              >
                <header className="pillar-head">
                  <span className="pillar-code">{id}</span>
                  <span className="pillar-weight">{d.weight}%</span>
                </header>
                <h4 className="pillar-name">{d.short}</h4>
                <div className="pillar-stack">
                  {isICHOM ? (
                    <div className="ichom-stack">
                      <span className="ichom-icon">{Icons.ichom}</span>
                      <span>
                        Inherits
                        <br />
                        from ICHOM Sets
                      </span>
                    </div>
                  ) : (
                    ms.map((m) => (
                      <span
                        key={m.id}
                        className={
                          "m-tile status-" + m.status + (m.risk ? " ra" : "")
                        }
                        title={`${m.id} — ${m.name}${m.risk ? " · risk-adjusted" : ""}`}
                      />
                    ))
                  )}
                </div>
                <footer className="pillar-foot">
                  <span className="pillar-count">
                    {isICHOM ? "—" : ms.length}
                  </span>
                  <span className="pillar-foot-lbl">
                    {isICHOM ? "ICHOM-driven" : "measures"}
                  </span>
                </footer>
              </button>
            );
          })}
        </div>

        {/* Connector to foundation */}
        <div className="vf-arch-connector bottom" aria-hidden="true">
          {pillarDims.map((_, i) => (
            <span key={i} className="cnx-line" />
          ))}
        </div>

        {/* D10 foundation slab */}
        {renderRow(foundation, "foundation")}

        {/* Composite output */}
        <div className="vf-arch-composite">
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            className="composite-arrow"
          >
            <path
              d="M12 4v16M5 13l7 7 7-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="composite-badge">
            <span className="composite-badge-tag">VALUE COMPOSITE</span>
            <code>
              Σ weight(Dᵢ) · score(Dᵢ) · equity_adj(D9) · capability_mult(D10)
            </code>
          </div>
        </div>
      </div>

      <aside className="vf-arch-legend">
        <h4>Reading the framework</h4>
        <ol>
          <li>
            <b>Top ribbon — D9 Equity.</b> Cross-cutting stratifier. Splits
            every measure in every pillar by SES, nationality, gender,
            geography. Disparity ratios feed back into the composite.
          </li>
          <li>
            <b>Eight pillars — D1 to D8.</b> The domain measures. Each tile in a
            pillar is one measure; pillar height = catalogue depth. D1 &amp; D2
            inherit measures from contracted ICHOM Sets rather than owning a
            catalogue here.
          </li>
          <li>
            <b>Foundation slab — D10 Capability.</b> Workforce, EHR maturity,
            data quality. Acts as a multiplier (≤ 1.0) — weak D10 invalidates
            everything above.
          </li>
        </ol>
        <div className="legend-tile-key">
          <div className="row">
            <span className="m-tile status-active" />
            <span>Active measure</span>
          </div>
          <div className="row">
            <span className="m-tile status-pilot" />
            <span>Pilot measure</span>
          </div>
          <div className="row">
            <span className="m-tile status-active ra" />
            <span>Risk-adjusted</span>
          </div>
        </div>
        <p className="vf-tip">
          Click any element to open its catalogue. Hover to highlight; the
          dependency view shows how influence flows between pillars.
        </p>
      </aside>
    </div>
  );
}
