import { FINANCE_BASELINE_DATA, SCENARIOS } from "@/mock/contract-designer";
import { Icons } from "../Icons/Icons";
import { sarFmt } from "./ContractFinance";
import { DIMS } from "@/mock/framework";
import React from "react";
// Session 5B — CFScenario.jsx — Step G: Scenario Modelling
const { useState: cscUseState, useMemo: cscUseMemo } = React;

function CFScenario({ state, set }) {
  const icons = Icons;
  const scenarios = SCENARIOS || {};
  const baseline = FINANCE_BASELINE_DATA || {};
  const dims = DIMS || [];
  const dw = state.dimWeights || {};
  const actDims = dims.filter((d) => dw[d.id] != null);
  const sliders = state.customSliders || {};
  const AB = baseline.AB || 47000 * 3112 * 12;
  const QBP = baseline.QBP || Math.round(AB * 0.03);
  const MSR = baseline.MSR || Math.round(AB * 0.02);

  const sar = sarFmt || ((n) => "SAR " + Math.abs(n || 0).toLocaleString());

  // Compute custom scenario
  const customPerf = cscUseMemo(() => {
    if (!actDims.length) return 0;
    const weighted = actDims.reduce(
      (acc, d) => acc + (dw[d.id] / 100) * (sliders[d.id] || 50),
      0,
    );
    return Math.min(100, Math.max(0, weighted));
  }, [sliders, actDims, dw]);

  // Map composite performance → savings rate (empirical curve)
  const perfToSavingsRate = (p) => {
    if (p < 40) return -0.02 + (p / 40) * 0.01; // -2% to -1%
    if (p < 60) return -0.01 + ((p - 40) / 20) * 0.02; // -1% to +1%
    if (p < 75) return 0.01 + ((p - 60) / 15) * 0.02; // 1% to 3%
    if (p < 90) return 0.03 + ((p - 75) / 15) * 0.03; // 3% to 6%
    return 0.06 + ((p - 90) / 10) * 0.02; // 6% to 8%
  };

  const savRate = perfToSavingsRate(customPerf);
  const customTCOC = Math.round(AB * (1 - savRate));
  const customSav = Math.round(AB * savRate);
  const eligSav = Math.max(0, customSav - MSR);
  const custProvSav = Math.round(eligSav * 0.4);
  const custQB = Math.round(QBP * (customPerf / 100));
  const custNet = custProvSav + custQB;

  const updateSlider = (dimId, val) =>
    set({ customSliders: { ...sliders, [dimId]: +val } });

  const SCENARIO_COLORS = {
    green: {
      bg: "oklch(0.96 0.06 145)",
      border: "oklch(0.75 0.12 145)",
      text: "oklch(0.35 0.16 145)",
      badge: "oklch(0.40 0.16 145)",
    },
    amber: {
      bg: "oklch(0.96 0.06 70)",
      border: "oklch(0.75 0.12 70)",
      text: "oklch(0.38 0.14 60)",
      badge: "oklch(0.42 0.14 60)",
    },
    red: {
      bg: "oklch(0.96 0.06 25)",
      border: "oklch(0.75 0.12 25)",
      text: "oklch(0.42 0.18 25)",
      badge: "oklch(0.45 0.18 25)",
    },
  };

  const ScenCard = ({ s, label, colorKey }) => {
    const c = SCENARIO_COLORS[colorKey];
    const netPos = s.netProvider >= 0;
    return (
      <div
        className="cf-scen-card"
        style={{
          "--sc-bg": c.bg,
          "--sc-border": c.border,
          "--sc-text": c.text,
        }}
      >
        <div className="sc-head">
          <span
            className="sc-label"
            style={{ background: c.badge, color: "#fff" }}
          >
            {label}
          </span>
          <span className="sc-note">{s.note}</span>
        </div>
        <div className="sc-rows">
          {[
            ["Projected TCOC", sar(s.tcoc), false],
            [
              "vs benchmark",
              (s.savingsVsBench >= 0 ? "+" : "") +
                sar(s.savingsVsBench) +
                " (" +
                Math.abs((s.savingsVsBench / AB) * 100).toFixed(1) +
                "% " +
                (s.savingsVsBench >= 0 ? "below" : "above") +
                ")",
              s.savingsVsBench < 0,
            ],
            ["Provider savings share", sar(s.providerSavings), false],
            ["Quality bonus earned", sar(s.qualityBonus), false],
            ["Withhold released", sar(s.withholdReleased), false],
            [
              "Net to provider",
              (s.netProvider >= 0 ? "+" : "-") + sar(s.netProvider),
              s.netProvider < 0,
            ],
            [
              "Net to purchaser",
              (s.netPurchaser >= 0 ? "+" : "-") + sar(s.netPurchaser),
              false,
            ],
          ].map(([lbl, val, warn]) => (
            <div key={lbl} className="sc-row">
              <span>{lbl}</span>
              <span
                className={
                  "val" +
                  (warn ? " loss" : "") +
                  (lbl.includes("Net to provider") && !warn ? " gain" : "")
                }
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // bar chart max value for scaling
  const maxNet = Math.max(
    scenarios.optimistic?.netProvider || 0,
    scenarios.baseline?.netProvider || 0,
    Math.abs(scenarios.pessimistic?.netProvider || 0),
    Math.abs(custNet),
  );

  return (
    <div data-screen-label="CF-G Scenario Modelling">
      <div className="cf-scen-intro">
        <div>
          <h3 className="cs-h2" style={{ margin: 0 }}>
            Pre-computed scenarios
          </h3>
          <p className="cd-help" style={{ marginTop: 4 }}>
            Based on {(state.eligibleMembers || 47000).toLocaleString()} lives ×
            SAR {(state.baselinePMPM || 3112).toLocaleString()} PMPM · Annual
            baseline {sar(AB)}
          </p>
        </div>
      </div>

      <div className="cf-scen-grid">
        {[
          ["optimistic", "Optimistic", "green"],
          ["baseline", "Baseline", "amber"],
          ["pessimistic", "Pessimistic", "red"],
        ].map(([key, label, colorKey]) => (
          <ScenCard
            key={key}
            s={scenarios[key] || {}}
            label={label}
            colorKey={colorKey}
          />
        ))}
      </div>

      {/* Bar chart comparison */}
      <h3 className="cs-h2 spaced">
        Net provider impact — scenario comparison
      </h3>
      <div className="cf-bar-chart">
        {[
          {
            label: "Optimistic",
            val: scenarios.optimistic?.netProvider || 0,
            color: "oklch(0.40 0.16 145)",
          },
          {
            label: "Baseline",
            val: scenarios.baseline?.netProvider || 0,
            color: "oklch(0.60 0.14 60)",
          },
          {
            label: "Pessimistic",
            val: scenarios.pessimistic?.netProvider || 0,
            color: "oklch(0.55 0.18 25)",
          },
          { label: "Custom", val: custNet, color: "var(--accent)" },
        ].map((b) => (
          <div key={b.label} className="cf-bar-col">
            <div className="cf-bar-wrap">
              <div
                className="cf-bar"
                style={{
                  height: `${maxNet > 0 ? Math.round((Math.abs(b.val) / maxNet) * 100) : 10}%`,
                  background: b.color,
                  marginTop: "auto",
                }}
              />
            </div>
            <div className="cf-bar-label">{b.label}</div>
            <div className="cf-bar-val" style={{ color: b.color }}>
              {window.sarFmt ? window.sarFmt(b.val, "") : sar(b.val)}
            </div>
          </div>
        ))}
      </div>

      {/* Custom scenario builder */}
      <h3 className="cs-h2 spaced">Custom scenario builder</h3>
      <p className="cd-help" style={{ marginBottom: 14 }}>
        Adjust each dimension's performance level and see the real-time
        financial impact. Sliders represent % achievement from 0 (worst) to 100
        (stretch).
      </p>

      <div className="cf-custom-builder">
        <div className="cf-slider-panel">
          {actDims.length === 0 && (
            <div className="cs-empty-panel">
              No dimensions activated in the Value Profile (Step d).
            </div>
          )}
          {actDims.map((d) => {
            const val = sliders[d.id] ?? 50;
            const colorFn = (v) =>
              v >= 75
                ? "oklch(0.40 0.16 145)"
                : v >= 50
                  ? "oklch(0.60 0.14 60)"
                  : "oklch(0.55 0.18 25)";
            return (
              <div key={d.id} className="cf-dim-slider">
                <div className="ds-left">
                  <span
                    className="code-pill"
                    style={{
                      background: `color-mix(in oklch,${d.color},white 75%)`,
                      color: `color-mix(in oklch,${d.color},black 20%)`,
                      font: "600 10px/1 var(--font-mono)",
                      padding: "3px 7px",
                      borderRadius: 5,
                    }}
                  >
                    {d.code}
                  </span>
                  <span
                    style={{
                      font: "500 12px/1 var(--font-sans)",
                      color: "var(--fg-primary)",
                    }}
                  >
                    {d.short}
                  </span>
                  <span
                    style={{
                      font: "500 9px/1 var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      letterSpacing: ".04em",
                    }}
                  >
                    {dw[d.id]}% weight
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={val}
                  onChange={(e) => updateSlider(d.id, e.target.value)}
                  style={{ flex: 1, accentColor: colorFn(val) }}
                />
                <span
                  style={{
                    font: "600 13px/1 var(--font-mono)",
                    color: colorFn(val),
                    minWidth: 36,
                    textAlign: "right",
                  }}
                >
                  {val}%
                </span>
              </div>
            );
          })}
        </div>

        <div className="cf-custom-result">
          <div className="cr-head">Custom scenario result</div>
          <div className="cr-composite">
            <div className="n">{Math.round(customPerf)}%</div>
            <div className="lbl">composite performance</div>
          </div>
          {[
            ["Projected TCOC", sar(customTCOC)],
            [
              "Savings vs benchmark",
              (customSav >= 0 ? "+" : "") +
                sar(customSav) +
                " (" +
                Math.abs(savRate * 100).toFixed(1) +
                "%" +
                (savRate >= 0 ? " below" : " above") +
                ")",
            ],
            ["Above MSR", eligSav > 0 ? sar(eligSav) : "Below MSR threshold"],
            [
              "Provider savings (40%)",
              custProvSav > 0 ? sar(custProvSav) : "SAR 0",
            ],
            ["Quality bonus", sar(custQB)],
            ["Net to provider", sar(custNet)],
          ].map(([lbl, val]) => (
            <div key={lbl} className="cr-row">
              <span>{lbl}</span>
              <span className="val">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default CFScenario;
