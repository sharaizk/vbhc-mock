"use client";
import React from "react";
import { Icons } from "../Icons/Icons";
import {
  ATTRIBUTION_METHODS,
  BENCHMARK_METHODS,
  DRAFT_FINANCE,
  HCP_LAN,
  RISK_ADJ_MODELS,
} from "@/mock/contract-designer";
import CSMarketPop from "./CSMarketPop";
import CSProviderGroup from "./CSProviderGroup";
import CSValueProfile from "./CSValueProfile";
import CFAttribution from "./CFAttribution";
import CFFinancial from "./CFFinancial";
import CFScenario from "./CFScenario";
import CFRiskAdj from "./CFRIskAdj";
import CFReview from "./CFReview";
import { SectionType } from "./ContractSetup";

const { useState, useCallback: cfUseCallback } = React;

const CF_STEPS = [
  {
    id: "type",
    num: "a",
    title: "Contract Type",
    sub: "HCP-LAN archetype",
    group: "setup",
  },
  {
    id: "market",
    num: "b",
    title: "Market & Population",
    sub: "Business line, geography",
    group: "setup",
  },
  {
    id: "network",
    num: "c",
    title: "Provider Group",
    sub: "Network & hierarchy",
    group: "setup",
  },
  {
    id: "value",
    num: "d",
    title: "Value Profile",
    sub: "Dimensions & measures",
    group: "setup",
  },
  {
    id: "attr",
    num: "e",
    title: "Attribution",
    sub: "Patient attribution engine",
    group: "finance",
  },
  {
    id: "finance",
    num: "f",
    title: "Financial Model",
    sub: "Benchmark · Mechanics · Corridors",
    group: "finance",
  },
  {
    id: "scenario",
    num: "g",
    title: "Scenario Modelling",
    sub: "Projections & custom builder",
    group: "finance",
  },
  {
    id: "risk",
    num: "h",
    title: "Risk Adjustment",
    sub: "Case-mix model configuration",
    group: "finance",
  },
  {
    id: "review",
    num: "i",
    title: "Review & Submit",
    sub: "Complete contract summary",
    group: "review",
  },
];

const GROUP_LABELS = {
  setup: "Contract Setup",
  finance: "Finance & Attribution",
  review: "Review",
};
const GROUP_COLORS = {
  setup: "var(--accent)",
  finance: "oklch(0.62 0.14 60)",
  review: "oklch(0.40 0.16 145)",
};

function sar(n, opts = {}) {
  const abs = Math.abs(n || 0);
  const fmt =
    abs >= 1e9
      ? (abs / 1e9).toFixed(2) + "B"
      : abs >= 1e6
        ? (abs / 1e6).toFixed(1) + "M"
        : abs.toLocaleString();
  const sign = n < 0 ? "−" : opts.plus && n > 0 ? "+" : "";
  return sign + "SAR " + fmt;
}
export const sarFmt = sar;

function CFRail({ state, step, onStep }) {
  const curIdx = CF_STEPS.findIndex((s) => s.id === step);
  const dw = state.dimWeights || {};
  const weightSum = Object.values(dw).reduce((a, b) => a + b, 0);
  const issues = [];
  if (!(state.lanCategories || []).length) issues.push("type");
  if (!(state.popSegments || []).length) issues.push("population");
  if (!state.attributionMethod) issues.push("attribution");
  if (Object.keys(dw).length && weightSum !== 100) issues.push("weights");

  return (
    <aside className="cs-rail" style={{ top: 80 }}>
      <div className="cs-rail-top">
        <span className="draft-pill">Draft</span>
        <span className="id-mono" suppressHydrationWarning>
          {state.id}
        </span>
      </div>

      <div className="cf-rail-summary">
        <div className="cf-rs-row">
          <span>Contract</span>
          <span suppressHydrationWarning>{state.id}</span>
        </div>
        <div className="cf-rs-row" suppressHydrationWarning>
          <span>LAN type</span>
          <span suppressHydrationWarning>
            {(state.lanCategories || [])
              .map((id) => {
                const c = (HCP_LAN || []).find((x) => x.id === id);
                return c ? `Cat. ${c.code}` : id;
              })
              .join("+") || "—"}
          </span>
        </div>
        <div className="cf-rs-row">
          <span>Population</span>
          <span suppressHydrationWarning>{(state.eligibleMembers || 0).toLocaleString()} lives</span>
        </div>
        <div className="cf-rs-row">
          <span>Attribution</span>
          <span suppressHydrationWarning>
            {(ATTRIBUTION_METHODS || []).find(
              (m) => m.id === state.attributionMethod,
            )?.code || "—"}
          </span>
        </div>
        <div className="cf-rs-row">
          <span>Benchmark</span>
          <span suppressHydrationWarning>
            {(BENCHMARK_METHODS || [])
              .find((m) => m.id === state.benchmarkMethodology)
              ?.name?.split(" ")[0] || "—"}
          </span>
        </div>
        <div className="cf-rs-row">
          <span>Baseline PMPM</span>
          <span suppressHydrationWarning>SAR {(state.baselinePMPM || 3112).toLocaleString()}</span>
        </div>
        <div className="cf-rs-row">
          <span>Risk model</span>
          <span suppressHydrationWarning>
            {(RISK_ADJ_MODELS || []).find((m) => m.id === state.riskAdjModel)
              ?.code || "—"}
          </span>
        </div>
        <div className={"cf-rs-row " + (issues.length ? "warn" : "ok")} suppressHydrationWarning>
          <span>Issues</span>
          <span >{issues.length ? `${issues.length} open` : "Ready"}</span>
        </div>
      </div>

      <div className="cf-step-groups">
        {["setup", "finance", "review"].map((g) => {
          const gSteps = CF_STEPS.filter((s) => s.group === g);
          return (
            <div key={g} className="cf-step-group">
              <div className="cf-sg-label" style={{ color: GROUP_COLORS[g] }}>
                {GROUP_LABELS[g]}
              </div>
              {gSteps.map((s) => {
                const i = CF_STEPS.indexOf(s);
                const done = i < curIdx;
                const active = s.id === step;
                return (
                  <div
                    key={s.id}
                    className={
                      "cs-step" + (active ? " on" : "") + (done ? " done" : "")
                    }
                    onClick={() => onStep(s.id)}
                  >
                    <span className="num">
                      {done ? (
                        <span
                          style={{
                            display: "grid",
                            placeItems: "center",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          {Icons?.check}
                        </span>
                      ) : (
                        s.num
                      )}
                    </span>
                    <div>
                      <div className="lbl">{s.title}</div>
                      <div className="sub">{s.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

/* ── ContractFinance root ───────────────────────────────────────────────── */
export default function ContractFinance() {
  const [state, setState] = useState(() => ({
    id: "CF-DRAFT-001",
    baselinePMPM: 3112,
    ...(DRAFT_FINANCE || {}),
    // ensure we start at step e if coming from Session 5
  }));
  const [step, setStep] = useState("attr");
  const set = cfUseCallback(
    (patch) => setState((s) => ({ ...s, ...patch })),
    [],
  );

  const idx = CF_STEPS.findIndex((s) => s.id === step);
  const cur = CF_STEPS[idx];
  const prev = idx > 0 ? CF_STEPS[idx - 1] : null;
  const next = idx < CF_STEPS.length - 1 ? CF_STEPS[idx + 1] : null;

  // Resolve sub-components
  const MarketComp = CSMarketPop || null;
  const NetworkComp = CSProviderGroup || null;
  const ValueComp = CSValueProfile || null;
  const TypeComp = SectionType || null;
  const AttrComp = CFAttribution || null;
  const FinComp = CFFinancial || null;
  const ScenComp = CFScenario || null;
  const RiskComp = CFRiskAdj || null;
  const ReviewComp = CFReview || null;

  return (
    <div className="cs-page" data-screen-label="5B Contract Finance">
      <CFRail state={state} step={step} onStep={setStep} />
      <section className="cs-canvas">
        <header className="cs-canvas-head">
          <div>
            <div className="crumb">
              Contract Management · Finance Configuration · Step {cur.num} of{" "}
              {CF_STEPS.length}
            </div>
            <h1>{cur.title}</h1>
            <p className="desc">{cur.sub}</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 6,
            }}
          >
            <div className="step-counter">
              {idx + 1} / {CF_STEPS.length}
            </div>
            <div
              style={{
                font: "500 9px/1 var(--font-mono)",
                padding: "3px 8px",
                borderRadius: 9999,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                background: `color-mix(in oklch,${GROUP_COLORS[cur.group]},white 82%)`,
                color: GROUP_COLORS[cur.group],
              }}
            >
              {GROUP_LABELS[cur.group]}
            </div>
          </div>
        </header>

        <div className="cs-canvas-body">
          {step === "type" && TypeComp && <TypeComp setup={state} set={set} />}
          {step === "market" && MarketComp && (
            <MarketComp setup={state} set={set} />
          )}
          {step === "network" && NetworkComp && (
            <NetworkComp setup={state} set={set} />
          )}
          {step === "value" && ValueComp && (
            <ValueComp setup={state} set={set} />
          )}
          {step === "attr" && AttrComp && <AttrComp state={state} set={set} />}
          {step === "finance" && FinComp && <FinComp state={state} set={set} />}
          {step === "scenario" && ScenComp && (
            <ScenComp state={state} set={set} />
          )}
          {step === "risk" && RiskComp && <RiskComp state={state} set={set} />}
          {step === "review" && ReviewComp && (
            <ReviewComp state={state} set={set} onStep={setStep} />
          )}
        </div>

        <footer className="cs-canvas-foot">
          <div className="left">
            <span
              style={{
                font: "500 11px/1 var(--font-mono)",
                color: "var(--fg-tertiary)",
                letterSpacing: ".04em",
              }}
            >
              Auto-saved · {state.id}
            </span>
          </div>
          <div className="right">
            {prev ? (
              <button className="cd-btn" onClick={() => setStep(prev.id)}>
                {Icons?.arrowL} {prev.title}
              </button>
            ) : (
              <button className="cd-btn" disabled>
                {Icons?.arrowL} Back
              </button>
            )}
            <button className="cd-btn">Save draft</button>
            {next ? (
              <button
                className="cd-btn primary"
                onClick={() => setStep(next.id)}
              >
                Next · {next.title} {Icons?.arrow}
              </button>
            ) : (
              <button
                className="cd-btn primary"
                style={{
                  background: "oklch(0.40 0.16 145)",
                  borderColor: "oklch(0.40 0.16 145)",
                }}
              >
                Submit for review {Icons?.arrow}
              </button>
            )}
          </div>
        </footer>
      </section>
    </div>
  );
}
