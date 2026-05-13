"use client";
import { TRANSFORM_PROJECTS } from "@/mock/transformation";
import React from "react";
import CT1Upload from "./CT1Upload";
import CT2GapAnalysis from "./CT2GapAnalysis";
import CT3Transformation from "./CT3Transformation";
import CT4FinancialImpact from "./CT4FinancialImpact";
import CT5Diff from "./CT5Diff";
import CT6PhasePlanner from "./CT5PhasePlanner";
// Session 7 — ContractTransformation.jsx — main router + list view
const { useState, useCallback } = React;

const CT_STEPS = [
  { id: 1, key: "upload", label: "Upload & Parse", sub: "Contract ingestion" },
  { id: 2, key: "gap", label: "Gap Analysis", sub: "8-dimension maturity" },
  {
    id: 3,
    key: "paths",
    label: "Transformation Paths",
    sub: "Three ambition levels",
  },
  {
    id: 4,
    key: "financial",
    label: "Financial Impact",
    sub: "Cost-benefit modelling",
  },
  {
    id: 5,
    key: "diff",
    label: "Side-by-Side Diff",
    sub: "Original vs transformed",
  },
  {
    id: 6,
    key: "plan",
    label: "Transition Plan",
    sub: "Phased implementation",
  },
];

function TxfmStepper({ steps, current, completed, onStep }) {
  return (
    <div className="txfm-stepper">
      {steps.map((s, i) => {
        const done = completed.includes(s.id);
        const active = s.id === current;
        const locked = !done && !active && s.id > Math.max(...completed, 0) + 1;
        return (
          <React.Fragment key={s.id}>
            {i > 0 && (
              <div
                className={"txfm-step-line" + (done || active ? " done" : "")}
              />
            )}
            <div
              className={
                "txfm-step-node" +
                (active ? " active" : "") +
                (done ? " done" : "") +
                (locked ? " locked" : "")
              }
              onClick={() => !locked && onStep(s.id)}
            >
              <div className="txfm-step-circle">
                {done ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="12"
                    height="12"
                  >
                    <polyline points="5 12 10 17 19 8" />
                  </svg>
                ) : (
                  <span>{s.id}</span>
                )}
              </div>
              <div className="txfm-step-label">
                <div className="title">{s.label}</div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

function TxfmProjectList({ projects, onSelect, onNew }) {
  const statusStyle = {
    uploaded: {
      label: "Uploaded",
      bg: "var(--bg-elevated)",
      color: "var(--fg-tertiary)",
    },
    analysed: {
      label: "Analysed",
      bg: "color-mix(in oklch,var(--accent),white 86%)",
      color: "var(--accent)",
    },
    path_selected: {
      label: "Path Selected",
      bg: "oklch(0.95 0.05 145)",
      color: "oklch(0.40 0.16 145)",
    },
    planned: {
      label: "Plan Ready",
      bg: "oklch(0.95 0.05 145)",
      color: "oklch(0.35 0.18 145)",
    },
  };
  const sarFmt = (n) =>
    "SAR " +
    (n >= 1e9
      ? (n / 1e9).toFixed(2) + "B"
      : n >= 1e6
        ? (n / 1e6).toFixed(0) + "M"
        : n.toLocaleString());

  return (
    <div className="txfm-list-page">
      <div className="txfm-list-head">
        <div>
          <h1 className="co-h1">Contract Transformation</h1>
          <p
            style={{
              font: "400 13px/1 var(--font-sans)",
              color: "var(--fg-secondary)",
              marginTop: 4,
            }}
          >
            Convert traditional FFS contracts into intelligent, ICHOM-aligned,
            performance-based agreements.
          </p>
        </div>
        <button className="cd-btn primary" onClick={onNew}>
          + New Transformation
        </button>
      </div>

      <div className="txfm-project-grid">
        {projects.map((p) => {
          const ss = statusStyle[p.status] || statusStyle.uploaded;
          return (
            <div
              key={p.id}
              className="txfm-project-card"
              onClick={() => onSelect(p)}
            >
              <div className="tpc-head">
                <span className="tpc-id">{p.id}</span>
                <span
                  className="recon-badge"
                  style={{ background: ss.bg, color: ss.color }}
                >
                  {ss.label}
                </span>
              </div>
              <div className="tpc-name">{p.contractName}</div>
              <div className="tpc-meta">
                <span>{p.provider}</span>
                <span>·</span>
                <span>{sarFmt(p.annualValue)}/yr</span>
                <span>·</span>
                <span>{(p.lives || 0).toLocaleString()} lives</span>
              </div>
              {p.maturityScore != null && (
                <div className="tpc-maturity">
                  <div className="tpc-mat-bar">
                    <div
                      style={{
                        width: `${p.maturityScore}%`,
                        height: "100%",
                        background: "oklch(0.50 0.18 25)",
                        borderRadius: 9999,
                      }}
                    />
                  </div>
                  <span
                    className="tpc-mat-score"
                    style={{ color: "oklch(0.50 0.18 25)" }}
                  >
                    {p.maturityScore}/100 maturity
                  </span>
                </div>
              )}
              <div className="tpc-progress">
                <div
                  style={{
                    font: "500 9px/1 var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    letterSpacing: ".06em",
                    marginBottom: 6,
                  }}
                >
                  STEP PROGRESS
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {CT_STEPS.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 9999,
                        background:
                          p.currentStep >= s.id
                            ? "var(--accent)"
                            : "var(--bg-elevated)",
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    font: "400 10px/1 var(--font-sans)",
                    color: "var(--fg-tertiary)",
                    marginTop: 5,
                  }}
                >
                  Step {p.currentStep} of {CT_STEPS.length} —{" "}
                  {CT_STEPS.find((s) => s.id === p.currentStep)?.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero message */}
      <div className="txfm-hero-card">
        <div className="txfm-hero-left">
          <div className="txfm-hero-eyebrow">
            The most powerful demo moment in the VBHC platform
          </div>
          <div className="txfm-hero-title">
            From a dumb contract to a smart contract
          </div>
          <div className="txfm-hero-desc">
            Upload any traditional fee-for-service contract. AiQL analyses it
            across 8 maturity dimensions, exposes every gap in outcome
            orientation, financial alignment, attribution, and measurement
            rigour — then generates a fully specified transformation plan with
            three ambition levels, clause-by-clause recommendations, and a
            phased implementation roadmap.
          </div>
          <button
            className="cd-btn primary"
            style={{ marginTop: 16 }}
            onClick={onNew}
          >
            Start a new transformation →
          </button>
        </div>
        <div className="txfm-hero-right">
          {/* Mini radar preview */}
          <svg viewBox="0 0 200 200" width="200" height="200">
            <defs>
              <radialGradient id="bench-grad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
                <stop
                  offset="100%"
                  stopColor="var(--accent)"
                  stopOpacity="0.05"
                />
              </radialGradient>
              <radialGradient id="curr-grad" cx="50%" cy="50%">
                <stop
                  offset="0%"
                  stopColor="oklch(0.50 0.18 25)"
                  stopOpacity="0.4"
                />
                <stop
                  offset="100%"
                  stopColor="oklch(0.50 0.18 25)"
                  stopOpacity="0.1"
                />
              </radialGradient>
            </defs>
            {/* Grid circles */}
            {[20, 40, 60, 80, 100].map((r) => (
              <circle
                key={r}
                cx="100"
                cy="100"
                r={r * 0.7}
                fill="none"
                stroke="var(--border-default)"
                strokeWidth=".5"
              />
            ))}
            {/* Axes */}
            {Array.from({ length: 8 }, (_, i) => {
              const a = (i / 8) * 2 * Math.PI - Math.PI / 2;
              return (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2={100 + 70 * Math.cos(a)}
                  y2={100 + 70 * Math.sin(a)}
                  stroke="var(--border-default)"
                  strokeWidth=".5"
                />
              );
            })}
            {/* Benchmark polygon */}
            {(() => {
              const scores = [82, 78, 75, 72, 80, 68, 70, 65];
              const pts = scores
                .map((s, i) => {
                  const a = (i / 8) * 2 * Math.PI - Math.PI / 2;
                  return `${100 + (s / 100) * 70 * Math.cos(a)},${100 + (s / 100) * 70 * Math.sin(a)}`;
                })
                .join(" ");
              return (
                <polygon
                  points={pts}
                  fill="url(#bench-grad)"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                />
              );
            })()}
            {/* Current contract polygon */}
            {(() => {
              const scores = [8, 12, 5, 15, 3, 0, 10, 18];
              const pts = scores
                .map((s, i) => {
                  const a = (i / 8) * 2 * Math.PI - Math.PI / 2;
                  return `${100 + (s / 100) * 70 * Math.cos(a)},${100 + (s / 100) * 70 * Math.sin(a)}`;
                })
                .join(" ");
              return (
                <polygon
                  points={pts}
                  fill="url(#curr-grad)"
                  stroke="oklch(0.50 0.18 25)"
                  strokeWidth="1.5"
                />
              );
            })()}
            {/* Labels */}
            {["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8"].map((l, i) => {
              const a = (i / 8) * 2 * Math.PI - Math.PI / 2;
              return (
                <text
                  key={l}
                  x={100 + 80 * Math.cos(a)}
                  y={100 + 80 * Math.sin(a)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="var(--fg-tertiary)"
                  fontFamily="var(--font-mono)"
                >
                  {l}
                </text>
              );
            })}
          </svg>
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                font: "400 10px/1 var(--font-sans)",
                color: "var(--fg-secondary)",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "inline-block",
                }}
              />{" "}
              Industry benchmark
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                font: "400 10px/1 var(--font-sans)",
                color: "var(--fg-secondary)",
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "oklch(0.50 0.18 25)",
                  display: "inline-block",
                }}
              />{" "}
              Traditional FFS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContractTransformation() {
  const projects = TRANSFORM_PROJECTS || [];
  const [view, setView] = useState("list");
  const [project, setProject] = useState(null);
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState([]);
  const [selPath, setSelPath] = useState(null);
  const [parsedContract, setParsed] = useState(null);

  const handleSelect = (p) => {
    setProject(p);
    setStep(p.currentStep || 1);
    if (p.status === "analysed") setCompleted([1]);
    setView("stepper");
  };
  const handleNew = () => {
    setProject(null);
    setStep(1);
    setCompleted([]);
    setSelPath(null);
    setParsed(null);
    setView("stepper");
  };
  const complete = useCallback((stepId, extra = {}) => {
    setCompleted((c) => [...new Set([...c, stepId])]);
    setStep((s) => Math.min(s + 1, 6));
    if (extra.parsedContract) setParsed(extra.parsedContract);
    if (extra.selectedPath) setSelPath(extra.selectedPath);
  }, []);

  const COMPS = {
    1: CT1Upload,
    2: CT2GapAnalysis,
    3: CT3Transformation,
    4: CT4FinancialImpact,
    5: CT5Diff,
    6: CT6PhasePlanner,
  };

  if (view === "list")
    return (
      <TxfmProjectList
        projects={projects}
        onSelect={handleSelect}
        onNew={handleNew}
      />
    );

  const Comp = COMPS[step];
  return (
    <div className="txfm-stepper-page">
      <div className="co-breadcrumb">
        <button className="cd-btn ghost" onClick={() => setView("list")}>
          ← Transformations
        </button>
        <span>/</span>
        <span>
          Step {step} of 6 — {CT_STEPS.find((s) => s.id === step)?.label}
        </span>
      </div>
      <div className="txfm-stepper-wrap">
        <TxfmStepper
          steps={CT_STEPS}
          current={step}
          completed={completed}
          onStep={(s) => {
            if (completed.includes(s) || s <= step) setStep(s);
          }}
        />
      </div>
      <div className="txfm-step-panel">
        {Comp && (
          <Comp
            onComplete={complete}
            selectedPath={selPath}
            parsedContract={parsedContract}
          />
        )}
      </div>
    </div>
  );
}
export default ContractTransformation;
