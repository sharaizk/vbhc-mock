import React from "react";
import ShallowMessage from "../ShallowMessage";

export default function OutcomesTab({ set, deep }) {
  if (!deep)
    return <ShallowMessage count={set.outcomeVars} kind="outcome variables" />;
  const byDomain = {};
  deep.outcomeVariables.forEach((v) => {
    (byDomain[v.domain] = byDomain[v.domain] || []).push(v);
  });
  return (
    <>
      {Object.entries(byDomain).map(([dom, vars]) => (
        <React.Fragment key={dom}>
          <div className="section-title">
            {dom} ({vars.length})
          </div>
          <table className="vt">
            <thead>
              <tr>
                <th style={{ width: 120 }}>Code</th>
                <th>Variable</th>
                <th style={{ width: 140 }}>Unit</th>
                <th style={{ width: 160 }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {vars.map((v) => (
                <tr key={v.code}>
                  <td>
                    <code>{v.code}</code>
                  </td>
                  <td>{v.name}</td>
                  <td
                    style={{
                      font: "500 12px/1 var(--font-mono)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {v.unit}
                  </td>
                  <td style={{ color: "var(--fg-secondary)" }}>{v.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </React.Fragment>
      ))}
    </>
  );
}
