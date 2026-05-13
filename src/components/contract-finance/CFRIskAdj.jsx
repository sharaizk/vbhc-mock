import { RISK_ADJ_MODELS } from "@/mock/contract-designer";
import { Icons } from "../Icons/Icons";
import React from "react";
// Session 5B — CFRiskAdj.jsx — Step H: Risk Adjustment Model Configuration
const { useState: craUseState } = React;

function CFRiskAdj({ state, set }) {
  const icons = Icons;
  const models = RISK_ADJ_MODELS || [];
  const sel = models.find((m) => m.id === state.riskAdjModel);

  const CALC_MODES = [
    {
      id: "prospective",
      label: "Prospective",
      desc: "Risk score calculated from prior period data to predict current period costs/outcomes",
    },
    {
      id: "concurrent",
      label: "Concurrent",
      desc: "Risk score calculated from current period data (requires run-out lag before settlement)",
    },
  ];

  // Synthetic patient example — Mohammed
  const syntheticRisk = (sel?.syntheticScore || 1.3).toFixed(2);
  const baselinePMPM = state.baselinePMPM || 3112;
  const adjustedPMPM = Math.round(baselinePMPM * (sel?.syntheticScore || 1.3));

  return (
    <div data-screen-label="CF-H Risk Adjustment">
      <h3 className="cs-h2">Risk adjustment model</h3>
      <p className="cd-help" style={{ marginBottom: 16 }}>
        Select the case-mix model used to risk-adjust cost benchmarks and/or
        clinical outcome scores. For contracts with both cost and clinical
        outcome dimensions, you can apply different models to each.
      </p>

      <div className="cf-ram-grid">
        {models.map((m) => {
          const on = state.riskAdjModel === m.id;
          return (
            <div
              key={m.id}
              className={"cf-ram-card" + (on ? " on" : "")}
              onClick={() => set({ riskAdjModel: m.id })}
            >
              <div className="rm-head">
                <span className="code">{m.code}</span>
                {on && <span className="chk">{icons.check}</span>}
              </div>
              <div className="rm-name">{m.name}</div>
              <div className="rm-meth">{m.methodology}</div>
              <div className="rm-app">
                <span>Application:</span> {m.application}
              </div>
            </div>
          );
        })}
      </div>

      {sel && (
        <>
          <h3 className="cs-h2 spaced">Model configuration</h3>
          <div className="cf-config-panel">
            <div className="cs-grid-2" style={{ marginBottom: 18 }}>
              <div className="cs-field">
                <label>Calculation mode</label>
                <div className="cf-calc-cards">
                  {CALC_MODES.map((c) => {
                    const on = state.riskCalcMode === c.id;
                    return (
                      <div
                        key={c.id}
                        className={"cf-calc-card" + (on ? " on" : "")}
                        onClick={() => set({ riskCalcMode: c.id })}
                      >
                        <div className="top">
                          <span>{c.label}</span>
                          {on && <span className="dot">{icons.check}</span>}
                        </div>
                        <div className="desc">{c.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                <div className="cs-field">
                  <label>Risk score normalisation</label>
                  <label className="cs-switch">
                    <div
                      className={
                        "cs-toggle" + (state.riskNormEnabled ? " on" : "")
                      }
                      onClick={() =>
                        set({ riskNormEnabled: !state.riskNormEnabled })
                      }
                    >
                      <span className="knob" />
                    </div>
                    <span>
                      {state.riskNormEnabled
                        ? "Active — scores normalised to 1.0 network mean"
                        : "Disabled — raw scores used"}
                    </span>
                  </label>
                  {state.riskNormEnabled && (
                    <p className="cd-help" style={{ marginTop: 4 }}>
                      Formula: Adjusted PMPM = Benchmark PMPM × (Patient Risk
                      Score / Network Mean Risk Score). Prevents windfall gains
                      or penalties from panel-level risk differences vs the
                      reference population.
                    </p>
                  )}
                </div>
                <div className="cs-field">
                  <label>Audit trail</label>
                  <label className="cs-switch">
                    <div
                      className={"cs-toggle" + (state.auditTrail ? " on" : "")}
                      onClick={() => set({ auditTrail: !state.auditTrail })}
                    >
                      <span className="knob" />
                    </div>
                    <span>
                      {state.auditTrail
                        ? "Enabled — full risk score provenance logged"
                        : "Disabled"}
                    </span>
                  </label>
                  <p className="cd-help" style={{ marginTop: 4 }}>
                    When enabled, each risk score stores the contributing
                    conditions, coefficients, and data sources in the AiQL graph
                    for dispute resolution.
                  </p>
                </div>
              </div>
            </div>

            {/* Separate cost vs quality models */}
            <div className="cf-field-card">
              <div className="cf-fc-head">
                <div>
                  <div className="nm">
                    Separate risk models for cost vs. quality
                  </div>
                  <div className="sub">
                    Apply different risk adjustment models to cost benchmarking
                    (D7) and clinical outcome scoring (D1, D2)
                  </div>
                </div>
                <label className="cs-switch">
                  <div
                    className={
                      "cs-toggle" + (state.separateCostQuality ? " on" : "")
                    }
                    onClick={() =>
                      set({ separateCostQuality: !state.separateCostQuality })
                    }
                  >
                    <span className="knob" />
                  </div>
                  <span>
                    {state.separateCostQuality ? "Active" : "Disabled"}
                  </span>
                </label>
              </div>
              {state.separateCostQuality && (
                <div className="cf-fc-body">
                  <div className="cs-grid-2">
                    <div className="cs-field">
                      <label>Cost risk model (D7, benchmark)</label>
                      <select
                        className="cd-select"
                        value={state.costRiskModel || "hcc"}
                        onChange={(e) => set({ costRiskModel: e.target.value })}
                      >
                        {models.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.code} — {m.name.split(" ")[0]}
                          </option>
                        ))}
                      </select>
                      <p className="cd-help">
                        Risk-adjusts the cost benchmark and total cost of care
                        measures.
                      </p>
                    </div>
                    <div className="cs-field">
                      <label>Outcome risk model (D1, D2)</label>
                      <select
                        className="cd-select"
                        value={state.qualityRiskModel || "ichom"}
                        onChange={(e) =>
                          set({ qualityRiskModel: e.target.value })
                        }
                      >
                        {models.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.code} — {m.name.split(" ")[0]}
                          </option>
                        ))}
                      </select>
                      <p className="cd-help">
                        Risk-adjusts ICHOM outcome scores and PROMs results for
                        case-mix differences.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Synthetic patient example */}
            <h3 className="cs-h2 spaced">Example risk score computation</h3>
            <div className="cf-patient-card">
              <div className="cf-patient-avi">M</div>
              <div className="cf-patient-info">
                <div className="nm">
                  Mohammed A., age 58 · Active duty officer
                </div>
                <div className="dx">
                  Diagnoses: Type 2 Diabetes (HbA1c 7.8%), Hypertension,
                  Hyperlipidaemia · BMI 31.2
                </div>
              </div>
              <div className="cf-patient-score">
                <div
                  className="score-val"
                  style={{ color: "oklch(0.42 0.14 60)" }}
                >
                  {syntheticRisk}
                </div>
                <div className="score-lbl">
                  Risk score
                  <br />
                  (network mean = 1.00)
                </div>
              </div>
            </div>
            <div className="cf-risk-calc">
              <div className="rc-step">
                <span className="lbl">Baseline PMPM (unadjusted)</span>
                <span className="val">SAR {baselinePMPM.toLocaleString()}</span>
              </div>
              <div className="rc-op">×</div>
              <div className="rc-step">
                <span className="lbl">{sel.code} risk score</span>
                <span className="val">{syntheticRisk}</span>
              </div>
              <div className="rc-op">=</div>
              <div className="rc-step risk">
                <span className="lbl">Risk-adjusted PMPM for Mohammed</span>
                <span className="val">SAR {adjustedPMPM.toLocaleString()}</span>
              </div>
            </div>
            <p className="cd-help" style={{ marginTop: 8 }}>
              Under {sel.name}, Mohammed's elevated HbA1c, hypertension, and
              hyperlipidaemia generate a risk score of {syntheticRisk}, meaning
              his expected cost is {Math.round((+syntheticRisk - 1) * 100)}%
              above the network mean. The benchmark is adjusted upward
              accordingly — the provider is not penalised for his higher-acuity
              panel.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
export default CFRiskAdj;
