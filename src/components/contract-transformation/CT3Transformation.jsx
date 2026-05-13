import { TRANSFORM_PATHS } from "@/mock/transformation";
import React from "react";
// Session 7 — CT3Transformation.jsx — Step 3: Three Ambition Levels
const { useState: ct3UseState } = React;

/* Tab panel within expanded path */
function PathDetail({ path }) {
  const [tab, setTab] = ct3UseState("clauses");
  const TABS = [
    { id: "clauses", label: "A · Contract Clauses" },
    { id: "measures", label: "B · Quality Measures" },
    { id: "financial", label: "C · Financial Parameters" },
    { id: "roadmap", label: "D · Implementation Roadmap" },
    { id: "readiness", label: "E · Data Readiness" },
  ];

  const statusStyle = {
    ready: {
      bg: "oklch(0.95 0.05 145)",
      color: "oklch(0.40 0.16 145)",
      label: "Ready",
    },
    in_progress: {
      bg: "color-mix(in oklch,var(--accent),white 84%)",
      color: "var(--accent)",
      label: "In progress",
    },
    not_started: {
      bg: "var(--bg-elevated)",
      color: "var(--fg-tertiary)",
      label: "Not started",
    },
  };

  /* Gantt-style roadmap */
  const totalWeeks = Math.max(...(path.roadmap || []).map((m) => m.w[1]), 0);

  return (
    <div className="ct3-path-detail">
      <div className="ct3-pd-tabs">
        {TABS.map((t) => (
          <span
            key={t.id}
            className={"ct3-pd-tab" + (tab === t.id ? " on" : "")}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </span>
        ))}
      </div>

      {tab === "clauses" && (
        <div className="ct3-clauses-list">
          {(path.clauses || []).map((c) => (
            <div key={c.num} className="ct3-clause-card">
              <div className="ct3-cc-head">
                <span className="ct3-cl-num">Clause {c.num}</span>
                <span className="ct3-cl-title">{c.title}</span>
                <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
                  {c.gaps.map((g) => (
                    <span key={g} className="ct3-gap-ref">
                      {g}
                    </span>
                  ))}
                  <span
                    className={
                      "ct3-priority-badge" +
                      (c.priority === "must" ? " must" : "")
                    }
                  >
                    {c.priority}
                  </span>
                </div>
              </div>
              <div className="ct3-cl-text">"{c.text}"</div>
            </div>
          ))}
          {!(path.clauses || []).length && (
            <div
              style={{
                padding: 24,
                textAlign: "center",
                color: "var(--fg-tertiary)",
                font: "400 13px/1 var(--font-sans)",
              }}
            >
              Full clause detail available for the Moderate path. Select
              Moderate to view all recommended contract language.
            </div>
          )}
        </div>
      )}

      {tab === "measures" && (
        <div className="ct3-meas-wrap">
          <div className="ct3-meas-table">
            <div className="ct3-mt-row head">
              <span>ID</span>
              <span>Measure</span>
              <span>Dim</span>
              <span>ICHOM</span>
              <span>Floor</span>
              <span>Target</span>
              <span>Stretch</span>
              <span>Source</span>
              <span>Risk Adj.</span>
            </div>
            {(path.measures_array || []).map((m) => (
              <div key={m.id} className="ct3-mt-row body">
                <span className="mono" style={{ fontSize: 10 }}>
                  {m.id}
                </span>
                <span
                  style={{
                    font: "500 12px/15px var(--font-sans)",
                    color: "var(--fg-primary)",
                  }}
                >
                  {m.name}
                </span>
                <span className="ct3-dim-tag">{m.dim}</span>
                <span
                  style={{
                    font: "400 10px/1 var(--font-mono)",
                    color: "var(--fg-tertiary)",
                  }}
                >
                  {m.ichom}
                </span>
                <span className="mono">{m.floor}</span>
                <span className="mono">{m.target}</span>
                <span className="mono">{m.stretch}</span>
                <span
                  style={{
                    font: "400 11px/1 var(--font-sans)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {m.source}
                </span>
                <span
                  style={{
                    font: "400 10px/13px var(--font-sans)",
                    color: "var(--fg-tertiary)",
                  }}
                >
                  {m.riskAdj}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "financial" && (
        <div className="ct3-fin-params">
          {Object.entries(path.financialParams || {}).map(([k, v]) => (
            <div key={k} className="ct3-fp-row">
              <span className="k">
                {k
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (s) => s.toUpperCase())}
              </span>
              <span className="v">{v}</span>
            </div>
          ))}
        </div>
      )}

      {tab === "roadmap" && (
        <div className="ct3-roadmap">
          {totalWeeks > 0 && (
            <div className="ct3-gantt">
              <div className="ct3-gantt-head">
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
                  .filter((w) => w <= totalWeeks)
                  .map((w) => (
                    <span
                      key={w}
                      style={{
                        position: "absolute",
                        left: `${(w / totalWeeks) * 100}%`,
                        transform: "translateX(-50%)",
                        font: "500 9px/1 var(--font-mono)",
                        color: "var(--fg-tertiary)",
                      }}
                    >
                      w{w}
                    </span>
                  ))}
              </div>
              <div className="ct3-gantt-body">
                {(path.roadmap || []).map((m, i) => (
                  <div key={i} className="ct3-gantt-row">
                    <span className="lbl">{m.label}</span>
                    <div className="track">
                      <div
                        className="bar"
                        style={{
                          left: `${(m.w[0] / totalWeeks) * 100}%`,
                          width: `${((m.w[1] - m.w[0]) / totalWeeks) * 100}%`,
                          background:
                            i === 0
                              ? "var(--accent)"
                              : i % 2 === 0
                                ? "oklch(0.55 0.14 200)"
                                : "oklch(0.55 0.14 60)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {!totalWeeks && (
            <div
              style={{
                padding: 20,
                textAlign: "center",
                color: "var(--fg-tertiary)",
              }}
            >
              Roadmap detail available in the Moderate path.
            </div>
          )}
        </div>
      )}

      {tab === "readiness" && (
        <div className="ct3-readiness">
          {(path.readiness || []).map((r) => {
            const ss = statusStyle[r.status] || statusStyle.not_started;
            return (
              <div key={r.item} className="ct3-ready-row">
                <span className="item">{r.item}</span>
                <span
                  className="recon-badge"
                  style={{ background: ss.bg, color: ss.color }}
                >
                  {ss.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* Path card */
function PathCard({ path, isSelected, onSelect }) {
  const sarFmt = (n) => (n >= 1e6 ? "+SAR " + (n / 1e6).toFixed(1) + "M" : n);
  return (
    <div
      className={"ct3-path-card" + (isSelected ? " selected" : "")}
      style={{ "--path-color": path.accentColor, "--path-bg": path.bgColor }}
    >
      <div className="ct3-pc-head">
        <div
          className="ct3-pc-label"
          style={{ color: path.accentColor, background: path.bgColor }}
        >
          {path.label}
        </div>
        <div className="ct3-pc-lan">
          <span className="from">{path.lanFrom}</span>
          <span className="arrow">→</span>
          <span className="to" style={{ color: path.accentColor }}>
            {path.lanTo}
          </span>
        </div>
      </div>
      <div className="ct3-pc-headline">{path.headline}</div>
      <div className="ct3-pc-stats">
        <div className="ct3-pcs-item">
          <div className="v">{path.timeline}</div>
          <div className="l">Timeline</div>
        </div>
        <div className="ct3-pcs-item">
          <div className="v">{path.measures}</div>
          <div className="l">Measures</div>
        </div>
        <div className="ct3-pcs-item">
          <div className="v" style={{ color: path.accentColor }}>
            {path.maxUpside}
          </div>
          <div className="l">Max upside</div>
        </div>
        <div className="ct3-pcs-item">
          <div className="v" style={{ color: "oklch(0.50 0.18 25)" }}>
            {path.maxDownside}
          </div>
          <div className="l">Max downside</div>
        </div>
      </div>
      <ul className="ct3-pc-changes">
        {(path.changes || []).slice(0, 4).map((c, i) => (
          <li key={i}>{c}</li>
        ))}
        {path.changes?.length > 4 && (
          <li style={{ color: "var(--fg-tertiary)" }}>
            +{path.changes.length - 4} more…
          </li>
        )}
      </ul>
      <div className="ct3-pc-estimate">
        <span className="ct3-estimate-label">Estimated financial impact</span>
        <span className="ct3-estimate-val" style={{ color: path.accentColor }}>
          {path.estimatedFinancial}
        </span>
      </div>
      <div className="ct3-pc-invest">
        Provider investment: {path.providerInvestment}
      </div>
      {!isSelected ? (
        <button
          className="cd-btn primary"
          style={{
            width: "100%",
            justifyContent: "center",
            background: path.accentColor,
            borderColor: path.accentColor,
            marginTop: 12,
          }}
          onClick={onSelect}
        >
          Select this path →
        </button>
      ) : (
        <div
          style={{
            textAlign: "center",
            margin: "12px 0 0",
            font: "600 11px/1 var(--font-mono)",
            color: path.accentColor,
            letterSpacing: ".06em",
          }}
        >
          ✓ Selected
        </div>
      )}
    </div>
  );
}

function CT3Transformation({ onComplete, selectedPath: initPath }) {
  const paths = TRANSFORM_PATHS || [];
  const [selId, setSelId] = ct3UseState(initPath?.id || null);
  const sel = paths.find((p) => p.id === selId);

  return (
    <div className="ct3-page">
      <div className="ct3-page-head">
        <div className="rs-crumb">Step 3 · Transformation Paths</div>
        <h2 className="rs-title">Three Ambition Levels</h2>
        <p
          style={{
            font: "400 13px/18px var(--font-sans)",
            color: "var(--fg-secondary)",
            marginTop: 4,
            maxWidth: 680,
          }}
        >
          Choose the transformation path that matches your readiness, risk
          appetite, and strategic ambition. Each path is a complete, specified
          transformation — not a vague direction. Select one to see the full
          implementation plan.
        </p>
      </div>

      {/* Path cards */}
      <div className="ct3-paths-row">
        {paths.map((p) => (
          <PathCard
            key={p.id}
            path={p}
            isSelected={selId === p.id}
            onSelect={() => setSelId(p.id)}
          />
        ))}
      </div>

      {/* Expanded detail */}
      {sel && (
        <div
          className="ct3-detail-panel"
          style={{ borderColor: sel.accentColor }}
        >
          <div className="ct3-dp-head" style={{ background: sel.bgColor }}>
            <span
              style={{
                color: sel.accentColor,
                font: "700 13px/1 var(--font-mono)",
                letterSpacing: ".06em",
              }}
            >
              {sel.label} path — Implementation plan
            </span>
            <span
              style={{
                font: "400 12px/1 var(--font-sans)",
                color: "var(--fg-secondary)",
              }}
            >
              {sel.headline}
            </span>
          </div>
          <PathDetail path={sel} />
        </div>
      )}

      <div className="rs-panel-foot" style={{ padding: "16px 0" }}>
        <button
          className="cd-btn primary"
          disabled={!selId}
          onClick={() => onComplete(3, { selectedPath: sel })}
        >
          {selId
            ? `Proceed with ${sel?.label} path → Financial Impact`
            : "Select a path to continue"}
        </button>
      </div>
    </div>
  );
}
export default CT3Transformation;
