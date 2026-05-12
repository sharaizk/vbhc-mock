import { DIMS } from "@/mock/framework";
import { driverIcon, measuresFor } from "@/utils/helpers";
import { useMemo } from "react";

export default function CardsView({ onSelect, search, counts }) {
  const filtered = useMemo(() => {
    if (!search) return DIMS;
    const q = search.toLowerCase();
    return DIMS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.short.toLowerCase().includes(q) ||
        measuresFor(d.id).some((m) => m.name.toLowerCase().includes(q)),
    );
  }, [search]);

  return (
    <div className="vf-cards-grid">
      {filtered.map((d) => {
        const ms = measuresFor(d.id);
        const matchedMeasures = search
          ? ms.filter((m) =>
              m.name.toLowerCase().includes(search.toLowerCase()),
            )
          : [];
        return (
          <article
            key={d.id}
            className="dim-card"
            style={{ "--dim-color": d.color, "--dim-soft": d.color_soft }}
            onClick={() => onSelect(d.id)}
          >
            <header className="dim-card-head">
              <div>
                <div className="dim-card-id">{d.id}</div>
                <h3 className="dim-card-name">{d.name}</h3>
              </div>
              <span
                className={
                  "dim-driver-pill driver-" +
                  d.driverType.toLowerCase().replace(/[^a-z]/g, "")
                }
              >
                {driverIcon(d.driverType)}
              </span>
            </header>
            <p className="dim-card-def">{d.definition}</p>
            <div className="dim-card-meta">
              <div className="col">
                <span className="num">
                  {counts[d.id] || (d.driverType === "ICHOM" ? "—" : 0)}
                </span>
                <span className="lbl">Measures</span>
              </div>
              <div className="col">
                <span className="num">{d.weight}%</span>
                <span className="lbl">Weight</span>
              </div>
              <div className="col">
                <span className="num">{d.dataSources.length}</span>
                <span className="lbl">Sources</span>
              </div>
            </div>
            {matchedMeasures.length > 0 && (
              <div className="dim-card-matches">
                <div className="lbl">Matches search</div>
                {matchedMeasures.slice(0, 3).map((m) => (
                  <div key={m.id} className="match">
                    {m.name}
                  </div>
                ))}
                {matchedMeasures.length > 3 && (
                  <div className="match more">
                    +{matchedMeasures.length - 3} more
                  </div>
                )}
              </div>
            )}
            <footer className="dim-card-foot">
              {d.dataSources.slice(0, 3).map((s) => (
                <span key={s} className="src-pill">
                  {s}
                </span>
              ))}
              {d.dataSources.length > 3 && (
                <span className="src-pill">+{d.dataSources.length - 3}</span>
              )}
            </footer>
          </article>
        );
      })}
    </div>
  );
}
