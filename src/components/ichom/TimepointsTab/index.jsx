import React from "react";
export default function TimepointsTab({ set }) {
  return (
    <>
      <div className="section-title">Collection schedule</div>
      <div className="tp-rail">
        {set.timepoints.map((t, i) => (
          <React.Fragment key={t}>
            <div className="tp-node">
              <span className="pip" />
              <span className="tp-label">{t}</span>
              <span className="tp-sub">T{i}</span>
            </div>
            {i < set.timepoints.length - 1 && <div className="tp-line" />}
          </React.Fragment>
        ))}
      </div>
      <div
        style={{
          font: "400 13px/20px var(--font-sans)",
          color: "var(--fg-secondary)",
          marginTop: 16,
          maxWidth: 580,
        }}
      >
        Each timepoint defines when the full Set's outcome variables and PROMs
        are collected. The AiQL pipeline triggers automated PROM dispatch and
        chases data quality at every step.
      </div>
    </>
  );
}
