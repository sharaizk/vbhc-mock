import React, { useMemo } from "react";

export default function OverlapMatrix({ sets, onOpen }) {
  // Build PROMs × Set matrix using all unique PROMs in this filtered set
  const uniqueProms = useMemo(() => {
    const all = new Set();
    sets.forEach((s) => s.proms.forEach((p) => all.add(p)));
    // Sort by frequency
    const counts = {};
    sets.forEach((s) =>
      s.proms.forEach((p) => {
        counts[p] = (counts[p] || 0) + 1;
      }),
    );
    return [...all].sort((a, b) => counts[b] - counts[a]);
  }, [sets]);

  return (
    <div className="overlap-wrap">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <h3
            style={{
              font: "500 18px/1 var(--font-sans)",
              margin: 0,
              color: "var(--fg-primary)",
            }}
          >
            PROMs × Set overlap
          </h3>
          <p
            style={{
              font: "400 12px/16px var(--font-sans)",
              color: "var(--fg-secondary)",
              margin: "6px 0 0",
              maxWidth: 520,
            }}
          >
            Where PROMs instruments are reused across Sets. Reuse is the
            foundation for the Eleanor Rossi cross-Set pattern — one patient
            touching multiple Sets at once.
          </p>
        </div>
        <span className="coming-soon">
          {uniqueProms.length} instruments · {sets.length} sets
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `120px repeat(${sets.length}, 32px)`,
          paddingTop: 80,
        }}
      >
        <div></div>
        {sets.map((s) => (
          <div key={s.id} className="overlap-col-label" title={s.name}>
            {s.code}
          </div>
        ))}
        {uniqueProms.map((prom) => (
          <React.Fragment key={prom}>
            <div className="overlap-row-label">{prom}</div>
            {sets.map((s) => {
              const has = s.proms.includes(prom);
              return (
                <div
                  key={s.id + prom}
                  className={"overlap-cell " + (has ? "" : "empty")}
                  title={has ? `${prom} → ${s.name}` : ""}
                  onClick={() => has && onOpen(s)}
                >
                  <span className="dot" />
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
