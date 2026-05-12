export default function OverlapsTab({ set, overlaps }) {
  if (overlaps.length === 0)
    return (
      <div className="empty">
        <div className="big">No cross-Set overlap</div>This Set's PROMs are
        unique within the catalogue.
      </div>
    );
  return (
    <>
      <div className="section-title">Cross-Set overlap ({overlaps.length})</div>
      <div
        style={{
          font: "400 13px/20px var(--font-sans)",
          color: "var(--fg-secondary)",
          marginBottom: 16,
          maxWidth: 580,
        }}
      >
        Other Sets that share PROMs instruments with{" "}
        <strong style={{ color: "var(--fg-primary)" }}>{set.code}</strong>. High
        overlap means a single patient activated on multiple Sets gets one PROM
        dispatch — not duplicated burden.
      </div>
      <div className="crossset-list">
        {overlaps.map(({ set: o, shared }) => (
          <div className="crossset-item" key={o.id}>
            <div>
              <div className="id">{o.id}</div>
              <div
                style={{
                  font: "500 11px/1 var(--font-mono)",
                  color: "var(--fg-secondary)",
                  marginTop: 3,
                  letterSpacing: ".04em",
                }}
              >
                {o.code}
              </div>
            </div>
            <div>
              <div className="nm">{o.name}</div>
              <div className="shared">
                {shared.map((p) => (
                  <span
                    key={p}
                    className="prom-pill"
                    style={{
                      background: "var(--accent-soft)",
                      color: "var(--accent)",
                      border: 0,
                    }}
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <span className="ovr">{shared.length} shared</span>
          </div>
        ))}
      </div>
    </>
  );
}
