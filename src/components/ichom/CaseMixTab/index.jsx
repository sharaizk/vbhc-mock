import ShallowMessage from "../ShallowMessage";

export default function CaseMixTab({ set, deep }) {
  if (!deep)
    return <ShallowMessage count={set.caseMixVars} kind="case-mix variables" />;
  return (
    <>
      <div className="section-title">Case-mix variables</div>
      <div
        style={{
          font: "400 13px/20px var(--font-sans)",
          color: "var(--fg-secondary)",
          marginBottom: 16,
          maxWidth: 580,
        }}
      >
        Used by the AiQL risk-adjustment engine to fairly compare provider
        outcomes. Each variable feeds the adjustment graph as a covariate;
        missing values trigger D10 data-quality flags.
      </div>
      <table className="vt">
        <thead>
          <tr>
            <th style={{ width: 120 }}>Code</th>
            <th>Variable</th>
            <th style={{ width: 120 }}>Type</th>
            <th style={{ width: 160 }}>Source</th>
          </tr>
        </thead>
        <tbody>
          {deep.caseMixVariables.map((v) => (
            <tr key={v.code}>
              <td>
                <code>{v.code}</code>
              </td>
              <td>{v.name}</td>
              <td>
                <span className="domain">{v.type}</span>
              </td>
              <td style={{ color: "var(--fg-secondary)" }}>{v.source}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
