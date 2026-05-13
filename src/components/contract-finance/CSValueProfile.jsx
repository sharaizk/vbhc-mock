import { DIMS, MEASURES } from "@/mock/framework";
import { Icons } from "../Icons/Icons";
import "@/css/contract_designer.css";

// Session 5 — CSValueProfile.jsx — Section 4: Value Profile Configuration
import React from "react";

const { useState: cvpUseState } = React;

const FREQ_OPTIONS = ["Monthly", "Quarterly", "Semi-annual", "Annual"];
const METHOD_OPTIONS = [
  "EMR/EHR",
  "Claims",
  "Registry",
  "Survey / PROM",
  "Combined",
];
const BENCH_TYPES = [
  { id: "national", label: "National", desc: "MOD network national median" },
  { id: "regional", label: "Regional", desc: "GCC / MENA regional benchmark" },
  { id: "peer", label: "Peer group", desc: "Matched peer network cohort" },
  {
    id: "historical",
    label: "Historical",
    desc: "Prior contract period performance",
  },
  { id: "custom", label: "Custom", desc: "Manually entered reference value" },
];

function CSValueProfile({ setup, set }) {
  const dims = DIMS || [];
  const measures = MEASURES || [];
  const icons = Icons;
  const [collapsed, setCollapsed] = cvpUseState({});

  const dw = setup.dimWeights || {};
  const gates = setup.gates || {};
  const mc_all = setup.measureConfig || {};
  const actDims = dims.filter((d) => dw[d.id] != null);
  const weightSum = actDims.reduce((a, d) => a + (dw[d.id] || 0), 0);

  /* dimension helpers */
  const toggleDim = (id) => {
    const w = { ...dw };
    if (w[id] != null) {
      delete w[id];
    } else {
      w[id] = 10;
    }
    set({ dimWeights: w });
  };
  const setWeight = (id, val) => {
    set({
      dimWeights: { ...dw, [id]: Math.max(0, Math.min(80, Math.round(+val))) },
    });
  };
  const normalize = () => {
    const total = actDims.reduce((a, d) => a + (dw[d.id] || 0), 0);
    if (!total) return;
    const w = {};
    actDims.forEach((d) => {
      w[d.id] = Math.round((dw[d.id] / total) * 100);
    });
    const after = Object.values(w).reduce((a, b) => a + b, 0);
    if (after !== 100 && actDims.length) w[actDims[0].id] += 100 - after;
    set({ dimWeights: w });
  };
  const toggleGate = (id) => set({ gates: { ...gates, [id]: !gates[id] } });

  /* measure helpers */
  const getMC = (mid) =>
    mc_all[mid] || {
      active: false,
      floor: "",
      target: "",
      stretch: "",
      minDenom: 30,
      method: "EMR/EHR",
      freq: "Quarterly",
      mode: "attainment",
    };
  const setMC = (mid, patch) =>
    set({ measureConfig: { ...mc_all, [mid]: { ...getMC(mid), ...patch } } });
  const toggleM = (mid) => setMC(mid, { active: !getMC(mid).active });

  return (
    <div data-screen-label="CS4 Value Profile">
      {/* Step 1: dimension toggles */}
      <h3 className="cs-h2">1 · Activate dimensions</h3>
      <p className="cd-help" style={{ marginBottom: 12 }}>
        Click to activate or deactivate. D1 and D2 are ICHOM-driven (measures
        flow from contracted ICHOM Sets). D3–D10 use the AiQL catalogue below.
        Gates dimensions must pass before weighted composite is calculated.
      </p>
      <div className="cd-dim-toggle-grid">
        {dims.map((d) => {
          const on = dw[d.id] != null;
          const gated = !!gates[d.id];
          return (
            <div
              key={d.id}
              className={"cd-dim-toggle " + (on ? "on" : "off")}
              style={{ "--dim-color": d.color }}
              onClick={() => toggleDim(d.id)}
            >
              <div className="top">
                <span className="code">{d.code}</span>
                <span className="driver">{d.driverType}</span>
              </div>
              <div className="nm">{d.short}</div>
              <div className="wt">
                {on ? (
                  gated ? (
                    <span
                      style={{
                        fontSize: 9,
                        letterSpacing: ".06em",
                        color: "var(--fg-tertiary)",
                      }}
                    >
                      GATE
                    </span>
                  ) : (
                    dw[d.id]
                  )
                ) : (
                  "—"
                )}
                {on && !gated && <span>%</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 2: weight allocation */}
      <h3 className="cs-h2 spaced">2 · Allocate weights &amp; set gates</h3>
      <div className="cd-stack">
        {actDims.map((d) => {
          const pct = weightSum ? ((dw[d.id] || 0) / weightSum) * 100 : 0;
          if (pct < 0.1) return null;
          return (
            <div
              key={d.id}
              className="seg"
              style={{ width: `${pct}%`, background: d.color }}
              title={`${d.code} ${d.short} · ${dw[d.id]}%`}
            >
              <span className="lbl">
                {pct >= 7 ? `${d.code} ${dw[d.id]}%` : pct >= 4 ? d.code : ""}
              </span>
            </div>
          );
        })}
      </div>
      <div className="cd-sumbar">
        <span>Weight sum</span>
        <span className={"num " + (weightSum === 100 ? "ok" : "bad")}>
          {weightSum} / 100%
        </span>
        <div className="actions">
          <button onClick={normalize} disabled={!actDims.length}>
            Normalize to 100
          </button>
          {weightSum !== 100 && actDims.length > 0 && (
            <span className="cd-val bad">
              <span className="dot" />
              Σ≠100
            </span>
          )}
          {weightSum === 100 && (
            <span className="cd-val ok">
              <span className="dot" />
              Balanced
            </span>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginTop: 12,
        }}
      >
        {actDims.map((d) => {
          const gated = !!gates[d.id];
          return (
            <div key={d.id} className="cs-wt-row">
              <div className="name">
                <span
                  className="code-pill"
                  style={{
                    background: `color-mix(in oklch,${d.color},white 75%)`,
                    color: `color-mix(in oklch,${d.color},black 20%)`,
                  }}
                >
                  {d.code}
                </span>
                <span>{d.short}</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={dw[d.id] || 0}
                disabled={gated}
                onChange={(e) => setWeight(d.id, e.target.value)}
                style={{ accentColor: d.color, flex: 1 }}
              />
              <input
                type="number"
                min="0"
                max="80"
                value={dw[d.id] || 0}
                disabled={gated}
                onChange={(e) => setWeight(d.id, e.target.value)}
                className="cs-pct-inp"
              />
              <label
                className="cs-gate-lbl"
                title="Gate: this dimension must pass independently before it counts toward the weighted composite"
              >
                <input
                  type="checkbox"
                  checked={gated}
                  onChange={() => toggleGate(d.id)}
                />
                <span>Gate</span>
              </label>
              <button
                className="ico-btn"
                onClick={() => toggleDim(d.id)}
                title="Remove dimension"
              >
                {icons.trash}
              </button>
            </div>
          );
        })}
        {!actDims.length && (
          <div className="cs-empty-panel">
            No dimensions activated — toggle one above to begin.
          </div>
        )}
      </div>

      {/* Step 3: measures */}
      <h3 className="cs-h2 spaced">3 · Configure measures &amp; thresholds</h3>
      <div className="cs-bench-row">
        <span className="cs-bench-lbl">Benchmark overlay:</span>
        <div className="cs-bench-tabs">
          {BENCH_TYPES.map((b) => (
            <span
              key={b.id}
              className={
                "cs-bench-tab" + (setup.benchmarkType === b.id ? " on" : "")
              }
              title={b.desc}
              onClick={() => set({ benchmarkType: b.id })}
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="cd-dim-panels">
        {actDims.map((d) => {
          const dimMs = measures.filter((m) => m.dim === d.id);
          const activeMs = dimMs.filter((m) => getMC(m.id).active);
          const isCollap = !!collapsed[d.id];
          const gated = !!gates[d.id];
          const bench = BENCH_TYPES.find((b) => b.id === setup.benchmarkType);
          return (
            <div
              key={d.id}
              className={"cd-dim-panel" + (isCollap ? " collapsed" : "")}
              style={{ "--dim-color": d.color }}
            >
              <div
                className="cd-dim-panel-head"
                onClick={() =>
                  setCollapsed({ ...collapsed, [d.id]: !isCollap })
                }
              >
                <div className="left">
                  <span
                    className="code-pill"
                    style={{
                      background: `color-mix(in oklch,${d.color},white 75%)`,
                      color: `color-mix(in oklch,${d.color},black 20%)`,
                    }}
                  >
                    {d.code}
                  </span>
                  <span className="nm">{d.name}</span>
                  {gated && (
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily: "var(--font-mono)",
                        padding: "2px 7px",
                        borderRadius: 4,
                        background: "oklch(0.96 0.05 70)",
                        color: "oklch(0.42 0.14 60)",
                        letterSpacing: ".06em",
                      }}
                    >
                      GATE
                    </span>
                  )}
                  <span className="driver">{d.driverType}</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="ct">
                    {d.driverType === "ICHOM"
                      ? `ICHOM-driven · weight ${dw[d.id]}%`
                      : `${activeMs.length}/${dimMs.length} measures · weight ${dw[d.id]}%`}
                  </span>
                  <span className="chev">{icons.chev}</span>
                </div>
              </div>

              <div className="cd-dim-panel-body">
                {d.driverType === "ICHOM" ? (
                  <div className="cs-ichom-note">
                    {icons.spark}
                    <div>
                      <strong>ICHOM-driven dimension.</strong> Outcome variables
                      and PROMs instruments auto-populate from the contracted
                      ICHOM Sets selected in the Contract Designer. The
                      dimension weight ({dw[d.id]}%) is distributed across Sets
                      at scoring time, weighted by attributed patient volume per
                      Set. No per-measure threshold configuration is required
                      here.
                    </div>
                  </div>
                ) : (
                  <div className="cs-meas-tbl">
                    <div className="row hd">
                      <span></span>
                      <span>Measure</span>
                      <span>Floor</span>
                      <span>Target</span>
                      <span>Stretch</span>
                      <span>Min N</span>
                      <span>Method</span>
                      <span>Freq</span>
                      <span>Mode</span>
                    </div>
                    {dimMs.map((m) => {
                      const mc = getMC(m.id);
                      const on = mc.active;
                      return (
                        <div
                          key={m.id}
                          className={"row bd" + (on ? "" : " off")}
                        >
                          <span
                            className={"cs-cb" + (on ? " on" : "")}
                            onClick={() => toggleM(m.id)}
                          >
                            {icons.check}
                          </span>
                          <div className="meas-nm">
                            <div className="t">{m.name}</div>
                            <div className="id">
                              {m.id} · <em>{m.unit}</em> ·{" "}
                              {m.dir === "higher"
                                ? "↑ higher"
                                : "m.dir" === "lower"
                                  ? "↓ lower"
                                  : "≈ range"}
                            </div>
                            {on && bench && m.benchmark && (
                              <div className="bench-ref">
                                <span>{bench.label} ref:</span>{" "}
                                <strong>{m.benchmark}</strong>
                              </div>
                            )}
                          </div>
                          <input
                            type="number"
                            disabled={!on}
                            value={mc.floor ?? ""}
                            placeholder="—"
                            onChange={(e) =>
                              setMC(m.id, {
                                floor:
                                  e.target.value === "" ? "" : +e.target.value,
                              })
                            }
                          />
                          <input
                            type="number"
                            disabled={!on}
                            value={mc.target ?? ""}
                            placeholder="—"
                            onChange={(e) =>
                              setMC(m.id, {
                                target:
                                  e.target.value === "" ? "" : +e.target.value,
                              })
                            }
                          />
                          <input
                            type="number"
                            disabled={!on}
                            value={mc.stretch ?? ""}
                            placeholder="—"
                            onChange={(e) =>
                              setMC(m.id, {
                                stretch:
                                  e.target.value === "" ? "" : +e.target.value,
                              })
                            }
                          />
                          <input
                            type="number"
                            disabled={!on}
                            value={mc.minDenom || 30}
                            min={1}
                            onChange={(e) =>
                              setMC(m.id, { minDenom: +e.target.value })
                            }
                          />
                          <select
                            disabled={!on}
                            value={mc.method || "EMR/EHR"}
                            onChange={(e) =>
                              setMC(m.id, { method: e.target.value })
                            }
                          >
                            {METHOD_OPTIONS.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                          <select
                            disabled={!on}
                            value={mc.freq || "Quarterly"}
                            onChange={(e) =>
                              setMC(m.id, { freq: e.target.value })
                            }
                          >
                            {FREQ_OPTIONS.map((f) => (
                              <option key={f} value={f}>
                                {f}
                              </option>
                            ))}
                          </select>
                          <div className="mode-tog">
                            <span
                              className={
                                "mo" + (mc.mode === "attainment" ? " on" : "")
                              }
                              onClick={() =>
                                on && setMC(m.id, { mode: "attainment" })
                              }
                            >
                              Att
                            </span>
                            <span
                              className={
                                "mo" + (mc.mode === "improvement" ? " on" : "")
                              }
                              onClick={() =>
                                on && setMC(m.id, { mode: "improvement" })
                              }
                            >
                              Imp
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {!dimMs.length && (
                      <div
                        style={{
                          padding: "14px 12px",
                          color: "var(--fg-tertiary)",
                          font: "400 12px/1 var(--font-sans)",
                        }}
                      >
                        No measures defined for this dimension.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {!actDims.length && (
          <div className="cs-empty-panel">
            Activate dimensions above to configure their measures and
            thresholds.
          </div>
        )}
      </div>

      {/* Step 4: risk corridor */}
      <h3 className="cs-h2 spaced">4 · Risk corridor configuration</h3>
      <p className="cd-help" style={{ marginBottom: 14 }}>
        Risk corridors cap the maximum bonus or penalty payment exposure at the
        contract level. Applied across all providers for each settlement period.
      </p>
      <div className="cs-corridor-wrap">
        <div className="cs-field" style={{ flexShrink: 0 }}>
          <label>Enable risk corridor</label>
          <label className="cs-switch">
            <div
              className={"cs-toggle" + (setup.riskCorridorEnabled ? " on" : "")}
              onClick={() =>
                set({ riskCorridorEnabled: !setup.riskCorridorEnabled })
              }
            >
              <span className="knob" />
            </div>
            <span>
              {setup.riskCorridorEnabled
                ? "Active — corridor caps applied"
                : "Inactive — uncapped risk"}
            </span>
          </label>
        </div>
        {setup.riskCorridorEnabled && (
          <>
            <div className="cs-field">
              <label>Maximum upside (bonus cap)</label>
              <div className="cs-num-input">
                <input
                  type="number"
                  value={setup.riskCorridorCeiling || 10}
                  min={0}
                  max={50}
                  onChange={(e) =>
                    set({ riskCorridorCeiling: +e.target.value })
                  }
                />
                <span className="sfx">% of base</span>
              </div>
              <p className="cd-help">
                Maximum bonus as % of contracted base payment.
              </p>
            </div>
            <div className="cs-field">
              <label>Maximum downside (penalty cap)</label>
              <div className="cs-num-input">
                <input
                  type="number"
                  value={setup.riskCorridorFloor || 10}
                  min={0}
                  max={50}
                  onChange={(e) => set({ riskCorridorFloor: +e.target.value })}
                />
                <span className="sfx">% of base</span>
              </div>
              <p className="cd-help">
                Maximum penalty as % of contracted base payment.
              </p>
            </div>
          </>
        )}
      </div>
      {setup.riskCorridorEnabled && (
        <div className="cs-corridor-vis">
          <div className="down" style={{ flex: setup.riskCorridorFloor || 10 }}>
            −{setup.riskCorridorFloor || 10}%
          </div>
          <div className="base">Base payment</div>
          <div className="up" style={{ flex: setup.riskCorridorCeiling || 10 }}>
            +{setup.riskCorridorCeiling || 10}%
          </div>
        </div>
      )}
    </div>
  );
}

export default CSValueProfile;
