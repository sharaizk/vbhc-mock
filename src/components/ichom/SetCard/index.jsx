import { familyOf, statusLabel } from "@/utils/helpers";

export default function SetCard({ set, onOpen }) {
  const fam = familyOf(set.family);
  return (
    <article
      className="set-card"
      onClick={() => onOpen(set)}
      style={{ "--card-accent": fam.accent }}
    >
      <span className="accent-bar" />
      <div className="set-head">
        <div>
          <div className="set-id">
            {set.id} · {set.code}
          </div>
          <h3 className="set-name">{set.name}</h3>
        </div>
        <span className={"set-family-pill tint-" + fam.tint}>{fam.label}</span>
      </div>
      <div className="set-meta">
        <div className="col">
          <span className="num">{set.outcomeVars}</span>
          <span className="lbl">Outcomes</span>
        </div>
        <div className="col">
          <span className="num">{set.caseMixVars}</span>
          <span className="lbl">Case-mix</span>
        </div>
        <div className="col">
          <span className="num">{set.timepoints.length}</span>
          <span className="lbl">Timepoints</span>
        </div>
      </div>
      <div className="set-proms">
        {set.proms.slice(0, 4).map((p) => (
          <span key={p} className="prom-pill">
            {p}
          </span>
        ))}
        {set.proms.length > 4 && (
          <span className="prom-pill">+{set.proms.length - 4}</span>
        )}
      </div>
      <div className="set-foot">
        <span className={"set-status " + set.status}>
          {statusLabel(set.status)}
          {set.contracts > 0 ? ` · ${set.contracts}` : ""}
        </span>
      </div>
    </article>
  );
}
