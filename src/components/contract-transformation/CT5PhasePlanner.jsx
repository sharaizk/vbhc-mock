import { PHASES } from "@/mock/transformation";
import React from "react";

// Session 7 — CT6PhasePlanner.jsx — Step 6: Phased Transition Planner
const { useState: ct6UseState, useCallback: ct6UseCallback } = React;

const RISK_LEVEL_COLOR = {
  None: "oklch(0.40 0.16 145)",
  "Low (upside only)": "oklch(0.55 0.14 200)",
  Moderate: "oklch(0.55 0.14 60)",
  High: "oklch(0.50 0.18 25)",
};

const STATUS_STYLE = {
  met: {
    bg: "oklch(0.95 0.05 145)",
    color: "oklch(0.40 0.16 145)",
    label: "Met",
  },
  not_met: {
    bg: "var(--bg-elevated)",
    color: "var(--fg-tertiary)",
    label: "Not yet met",
  },
  at_risk: {
    bg: "oklch(0.96 0.04 60)",
    color: "oklch(0.42 0.14 60)",
    label: "At risk",
  },
};

function PhaseBlock({
  phase,
  isActive,
  isCurrent,
  isExpanded,
  onToggle,
  onMilestoneToggle,
  onCriteriaToggle,
}) {
  const riskColor = RISK_LEVEL_COLOR[phase.riskLevel] || "var(--fg-tertiary)";
  const doneMs = phase.milestones.filter((m) => m.done).length;
  const critMet = phase.readinessCriteria.filter(
    (rc) => rc.status === "met",
  ).length;

  return (
    <div
      className={
        "ct6-phase-block" +
        (isCurrent ? " current" : "") +
        (isActive ? " active" : "")
      }
    >
      {/* Phase header */}
      <div className="ct6-pb-head" onClick={onToggle}>
        <div className="ct6-pb-num">Phase {phase.num}</div>
        <div className="ct6-pb-info">
          <div className="ct6-pb-label">{phase.label}</div>
          <div className="ct6-pb-months">
            Months {phase.months[0]}–{phase.months[1]}
          </div>
          <div className="ct6-pb-lan">{phase.lanCat}</div>
        </div>
        <div className="ct6-pb-right">
          <div className="ct6-pb-risk" style={{ color: riskColor }}>
            {phase.riskLevel}
          </div>
          <div className="ct6-pb-ms">
            {doneMs}/{phase.milestones.length} milestones
          </div>
          <span
            style={{
              color: "var(--fg-tertiary)",
              transform: isExpanded ? "rotate(180deg)" : "",
              transition: "transform .15s",
            }}
          >
            ▾
          </span>
        </div>
      </div>

      {/* Glow bar at bottom of current phase */}
      {isCurrent && <div className="ct6-pb-glow" />}

      {isExpanded && (
        <div className="ct6-pb-body">
          <div className="ct6-pb-desc">{phase.description}</div>
          <div className="ct6-pb-impact">
            <span
              style={{
                font: "500 10px/1 var(--font-mono)",
                color: "var(--fg-tertiary)",
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              Est. provider impact
            </span>
            <span
              style={{
                font: "600 13px/1 var(--font-mono)",
                color: phase.providerImpact.startsWith("+")
                  ? "oklch(0.40 0.16 145)"
                  : "var(--fg-primary)",
                marginLeft: 8,
              }}
            >
              {phase.providerImpact}
            </span>
          </div>

          {/* Milestones */}
          <div className="ct6-milestones">
            <div className="ct6-sub-head">Milestones</div>
            {phase.milestones.map((m) => (
              <label key={m.id} className="ct6-ms-row">
                <input
                  type="checkbox"
                  checked={m.done}
                  onChange={() => onMilestoneToggle(phase.id, m.id)}
                />
                <span className={m.done ? "ct6-ms-done" : ""}>{m.text}</span>
              </label>
            ))}
          </div>

          {/* Readiness criteria */}
          <div className="ct6-readiness">
            <div className="ct6-sub-head">
              Readiness criteria for next phase
            </div>
            {phase.readinessCriteria.map((rc) => {
              const ss = STATUS_STYLE[rc.status] || STATUS_STYLE.not_met;
              return (
                <div key={rc.id} className="ct6-rc-row">
                  <span className="ct6-rc-text">{rc.text}</span>
                  <select
                    className="ct6-rc-select"
                    value={rc.status}
                    onChange={(e) =>
                      onCriteriaToggle(phase.id, rc.id, e.target.value)
                    }
                  >
                    <option value="not_met">Not yet met</option>
                    <option value="met">Met</option>
                    <option value="at_risk">At risk</option>
                  </select>
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
        </div>
      )}
    </div>
  );
}

function CT6PhasePlanner({ onComplete }) {
  const initPhases = PHASES || [];
  const [phases, setPhases] = ct6UseState(initPhases);
  const [expanded, setExpanded] = ct6UseState(new Set([0]));
  const [gateResult, setGateResult] = ct6UseState(null);

  const toggleExpand = ct6UseCallback((id) => {
    setExpanded((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const toggleMilestone = ct6UseCallback((phaseId, msId) => {
    setPhases((ps) =>
      ps.map((p) =>
        p.id !== phaseId
          ? p
          : {
              ...p,
              milestones: p.milestones.map((m) =>
                m.id !== msId ? m : { ...m, done: !m.done },
              ),
            },
      ),
    );
  }, []);

  const toggleCriteria = ct6UseCallback((phaseId, rcId, status) => {
    setPhases((ps) =>
      ps.map((p) =>
        p.id !== phaseId
          ? p
          : {
              ...p,
              readinessCriteria: p.readinessCriteria.map((rc) =>
                rc.id !== rcId ? rc : { ...rc, status },
              ),
            },
      ),
    );
  }, []);

  const phaseGateReview = (phaseIdx) => {
    const phase = phases[phaseIdx];
    const allMet = phase.readinessCriteria.every((rc) => rc.status === "met");
    const donePct = Math.round(
      (phase.milestones.filter((m) => m.done).length /
        phase.milestones.length) *
        100,
    );
    const gaps = phase.readinessCriteria
      .filter((rc) => rc.status !== "met")
      .map((rc) => rc.text);
    setGateResult({
      phaseLabel: phase.label,
      ready: allMet && donePct === 100,
      donePct,
      gaps,
    });
  };

  const COLS = [
    "Phase",
    "Duration",
    "Payment model",
    "Risk level",
    "Est. provider impact",
    "Milestones",
  ];

  return (
    <div className="ct6-page">
      <div className="ct6-page-head">
        <div>
          <div className="rs-crumb">Step 6 · Transition Plan</div>
          <h2 className="rs-title">Phased Transition Planner</h2>
          <p
            style={{
              font: "400 13px/18px var(--font-sans)",
              color: "var(--fg-secondary)",
              marginTop: 4,
              maxWidth: 640,
            }}
          >
            A structured multi-year journey from the current FFS contract to
            population-based payment. Each phase has clear milestones, readiness
            criteria, and a gate review before advancing. Check milestones as
            they are completed.
          </p>
        </div>
      </div>

      {/* Horizontal timeline */}
      <div className="ct6-timeline">
        {phases.map((p, i) => (
          <React.Fragment key={p.id}>
            {i > 0 && <div className="ct6-tl-connector" />}
            <div
              className={"ct6-tl-block" + (i === 0 ? " current" : "")}
              onClick={() => toggleExpand(p.id)}
            >
              <div className="ct6-tlb-num">Phase {p.num}</div>
              <div className="ct6-tlb-label">{p.label}</div>
              <div className="ct6-tlb-months">
                M{p.months[0]}–M{p.months[1]}
              </div>
              <div className="ct6-tlb-ms">
                {p.milestones.filter((m) => m.done).length}/
                {p.milestones.length}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Phase blocks */}
      <div className="ct6-phase-blocks">
        {phases.map((p, i) => (
          <div key={p.id}>
            <PhaseBlock
              phase={p}
              isActive={true}
              isCurrent={i === 0}
              isExpanded={expanded.has(p.id)}
              onToggle={() => toggleExpand(p.id)}
              onMilestoneToggle={toggleMilestone}
              onCriteriaToggle={toggleCriteria}
            />
            {expanded.has(p.id) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  padding: "6px 0",
                }}
              >
                <button className="cd-btn" onClick={() => phaseGateReview(i)}>
                  Phase gate review →
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary table */}
      <h3 className="rs-h3" style={{ marginTop: 24 }}>
        Transformation summary
      </h3>
      <div className="ct6-summary-table">
        <div className="ct6-st-row head">
          {COLS.map((c) => (
            <span key={c}>{c}</span>
          ))}
        </div>
        {phases.map((p) => {
          const rc = RISK_LEVEL_COLOR[p.riskLevel] || "var(--fg-tertiary)";
          const done = p.milestones.filter((m) => m.done).length;
          return (
            <div key={p.id} className="ct6-st-row body">
              <span>
                <strong>Phase {p.num}</strong> — {p.label}
              </span>
              <span className="mono">
                {p.months[1] - p.months[0] + 1} months
              </span>
              <span
                style={{
                  font: "400 11px/14px var(--font-sans)",
                  color: "var(--fg-secondary)",
                }}
              >
                {p.lanCat}
              </span>
              <span style={{ color: rc, font: "600 11px/1 var(--font-mono)" }}>
                {p.riskLevel}
              </span>
              <span
                style={{
                  font: "600 12px/1 var(--font-mono)",
                  color: p.providerImpact.startsWith("+")
                    ? "oklch(0.40 0.16 145)"
                    : "var(--fg-primary)",
                }}
              >
                {p.providerImpact}
              </span>
              <span>
                {done}/{p.milestones.length} done
              </span>
            </div>
          );
        })}
      </div>

      <div className="rs-panel-foot" style={{ padding: "16px 0" }}>
        <button className="cd-btn primary" onClick={() => onComplete(6)}>
          Complete transformation plan ✓
        </button>
      </div>

      {/* Gate review modal */}
      {gateResult && (
        <div className="co-modal-overlay" onClick={() => setGateResult(null)}>
          <div className="co-modal" onClick={(e) => e.stopPropagation()}>
            <div className="co-modal-head">
              Phase Gate Review — {gateResult.phaseLabel}
            </div>
            <div
              className={
                "ct6-gate-result " + (gateResult.ready ? "ready" : "not-ready")
              }
            >
              {gateResult.ready ? (
                <>
                  <div className="ct6-gr-icon">✓</div>
                  <div>
                    Ready to advance to next phase. All criteria met and{" "}
                    {gateResult.donePct}% of milestones completed.
                  </div>
                </>
              ) : (
                <>
                  <div className="ct6-gr-icon warn">⚠</div>
                  <div>
                    Not ready to advance. {gateResult.donePct}% of milestones
                    done. {gateResult.gaps.length} criteria not yet met:
                  </div>
                </>
              )}
            </div>
            {gateResult.gaps.length > 0 && (
              <ul
                style={{
                  margin: "12px 0 0",
                  paddingLeft: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {gateResult.gaps.map((g, i) => (
                  <li
                    key={i}
                    style={{
                      font: "400 12px/16px var(--font-sans)",
                      color: "var(--fg-primary)",
                    }}
                  >
                    {g}
                  </li>
                ))}
              </ul>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              <button className="cd-btn" onClick={() => setGateResult(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default CT6PhasePlanner;
