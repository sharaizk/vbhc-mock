import { familyOf, fmtBeneficiaries, statusLabel } from "@/utils/helpers";

export default function SetRow({ set, onOpen }) {
  const fam = familyOf(set.family);
  return (
    <div className="row body set-row" onClick={() => onOpen(set)}>
      <span
        style={{
          font: "500 11px/1 var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".04em",
        }}
      >
        {set.id}
      </span>
      <div>
        <div
          style={{
            font: "500 14px/18px var(--font-sans)",
            color: "var(--fg-primary)",
          }}
        >
          {set.name}
        </div>
        <div
          style={{
            font: "400 12px/16px var(--font-sans)",
            color: "var(--fg-secondary)",
            marginTop: 3,
          }}
        >
          {set.code} · v{set.version} · {set.year}
        </div>
      </div>
      <span
        className={"set-family-pill tint-" + fam.tint}
        style={{ fontSize: 9, padding: "3px 8px" }}
      >
        {fam.label}
      </span>
      <span
        style={{
          font: "500 13px/1 var(--font-mono)",
          color: "var(--fg-primary)",
          textAlign: "center",
        }}
      >
        {set.outcomeVars}
      </span>
      <span
        style={{
          font: "500 13px/1 var(--font-mono)",
          color: "var(--fg-primary)",
          textAlign: "center",
        }}
      >
        {set.caseMixVars}
      </span>
      <div style={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {set.proms.slice(0, 3).map((p) => (
          <span key={p} className="prom-pill" style={{ fontSize: 9 }}>
            {p}
          </span>
        ))}
        {set.proms.length > 3 && (
          <span className="prom-pill" style={{ fontSize: 9 }}>
            +{set.proms.length - 3}
          </span>
        )}
      </div>
      <span className={"set-status " + set.status}>
        {statusLabel(set.status)}
      </span>
      <span
        style={{
          font: "500 12px/1 var(--font-mono)",
          color: "var(--fg-secondary)",
          textAlign: "right",
        }}
      >
        {set.beneficiaries > 0 ? fmtBeneficiaries(set.beneficiaries) : "—"}
      </span>
    </div>
  );
}
