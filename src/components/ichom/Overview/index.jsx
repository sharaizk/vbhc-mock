import { PROMS } from "@/mock/ichom";
import { fmtBeneficiaries } from "@/utils/helpers";

export default function Overview({ set, deep, domainTally }) {
  return (
    <>
      {deep && (
        <>
          <div className="section-title">Cohort snapshot</div>
          <div className="cohort">
            <div className="cohort-card">
              <div className="num">{fmtBeneficiaries(deep.cohort.active)}</div>
              <div className="lbl">Active patients</div>
            </div>
            <div className="cohort-card">
              <div className="num">
                {fmtBeneficiaries(deep.cohort.withProms)}
              </div>
              <div className="lbl">With PROMs</div>
            </div>
            {Object.entries(deep.cohort)
              .filter(
                ([k]) => !["active", "withProms", "lastIngestion"].includes(k),
              )
              .map(([k, v]) => (
                <div className="cohort-card" key={k}>
                  <div className="num">
                    {typeof v === "number" ? fmtBeneficiaries(v) : v}
                  </div>
                  <div className="lbl">
                    {k
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (c) => c.toUpperCase())}
                  </div>
                </div>
              ))}
            <div className="cohort-card">
              <div
                className="num"
                style={{ font: "500 14px/18px var(--font-mono)" }}
              >
                {deep.cohort.lastIngestion}
              </div>
              <div className="lbl">Last ingestion</div>
            </div>
          </div>
        </>
      )}
      <div className="section-title">Variable structure</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
        }}
      >
        <div className="cohort-card">
          <div className="num">
            {deep ? deep.outcomeVariables.length : set.outcomeVars}
          </div>
          <div className="lbl">Outcome variables</div>
        </div>
        <div className="cohort-card">
          <div className="num">
            {deep ? deep.caseMixVariables.length : set.caseMixVars}
          </div>
          <div className="lbl">Case-mix variables</div>
        </div>
      </div>
      {domainTally && (
        <>
          <div className="section-title">Outcome domains</div>
          <div className="domain-chips">
            {domainTally.map(([d, n]) => (
              <span className="domain-chip" key={d}>
                {d}
                <span className="ctr">{n}</span>
              </span>
            ))}
          </div>
        </>
      )}
      <div className="section-title">
        PROMs instruments ({set.proms.length})
      </div>
      <div>
        {set.proms.map((code) => {
          const p = PROMS[code] || { full: code, scope: "—", items: "—" };
          return (
            <div key={code} className="prom-card">
              <span className="code">{code}</span>
              <div>
                <div className="full">{p.full}</div>
                <div className="scope">{p.scope}</div>
              </div>
              <span className="items">{p.items} items</span>
            </div>
          );
        })}
      </div>
      <div className="section-title">Lineage</div>
      <div
        style={{
          font: "400 13px/20px var(--font-sans)",
          color: "var(--fg-secondary)",
        }}
      >
        Source: ICHOM Standard Set{" "}
        <code
          style={{
            font: "500 12px/1 var(--font-mono)",
            color: "var(--fg-primary)",
            background: "var(--bg-elevated)",
            padding: "3px 6px",
            borderRadius: 4,
          }}
        >
          {set.id}
        </code>
        , version{" "}
        <strong style={{ color: "var(--fg-primary)" }}>{set.version}</strong>,
        published {set.year}. Read-only; managed by the ICHOM pipeline. Activate
        / deactivate from the Admin surface.
      </div>
    </>
  );
}
