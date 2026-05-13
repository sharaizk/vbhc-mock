import {
  ATTRIBUTION_METHODS,
  FINANCE_BASELINE_DATA,
} from "@/mock/contract-designer";
import { Icons } from "../Icons/Icons";
import React from "react";
// Session 5B — CFAttribution.jsx — Step E: Attribution Engine Configuration
const { useState: caUseState } = React;

const REFRESH_CYCLES = [
  { id: "monthly", label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
  { id: "annually", label: "Annually" },
  { id: "locked", label: "Locked (no in-period changes)" },
];
const RECONCILE_RULES = [
  {
    id: "changes_prospective",
    label: "Changes apply prospectively from next settlement period",
  },
  {
    id: "changes_immediate",
    label: "Changes apply immediately — retroactive attribution update",
  },
  {
    id: "locked_period",
    label: "Attribution locked for the entire performance period",
  },
  {
    id: "dispute_review",
    label: "Changes trigger dispute review before applying",
  },
];

function CFAttribution({ state, set }) {
  const icons = Icons;
  const methods = ATTRIBUTION_METHODS || [];
  const baseline = FINANCE_BASELINE_DATA || {};
  const [showConfig, setShowConfig] = caUseState(true);

  const sel = methods.find((m) => m.id === state.attributionMethod);
  const isVA = state.attributionMethod === "voluntary";

  // Estimated attributed lives based on method
  const livesEstimates = {
    voluntary: Math.round((state.eligibleMembers || 47000) * 0.82),
    prospective: Math.round((state.eligibleMembers || 47000) * 0.91),
    retrospective: Math.round((state.eligibleMembers || 47000) * 0.88),
    episode: Math.round((state.eligibleMembers || 47000) * 0.61),
    geographic: Math.round((state.eligibleMembers || 47000) * 0.96),
    hybrid: Math.round((state.eligibleMembers || 47000) * 0.86),
  };
  const estLives = livesEstimates[state.attributionMethod] || 0;

  const BADGE_STYLE = {
    Recommended: "oklch(0.40 0.16 145)",
    Standard: "oklch(0.42 0.14 60)",
    Common: "var(--accent)",
    "Condition-specific": "oklch(0.62 0.14 200)",
    Military: "oklch(0.62 0.14 60)",
    Advanced: "oklch(0.62 0.18 305)",
  };

  return (
    <div data-screen-label="CF-E Attribution">
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h3 className="cs-h2" style={{ margin: 0 }}>
            Attribution method
          </h3>
          <p className="cd-help" style={{ marginTop: 6 }}>
            Select the algorithm that assigns MOD beneficiaries to this provider
            group for performance accountability. The method determines the
            attributed panel size and composition.
          </p>
        </div>
        <div className="cf-lives-pill">
          <span className="n">{estLives.toLocaleString()}</span>
          <span className="lbl">est. attributed lives</span>
        </div>
      </div>

      <div className="cf-attr-grid">
        {methods.map((m) => {
          const on = state.attributionMethod === m.id;
          const badgeColor = BADGE_STYLE[m.badge] || "var(--fg-tertiary)";
          return (
            <div
              key={m.id}
              className={"cf-attr-card" + (on ? " on" : "")}
              onClick={() => set({ attributionMethod: m.id })}
            >
              <div className="ac-head">
                <span className="code">{m.code}</span>
                <span
                  className="badge"
                  style={{
                    background: `color-mix(in oklch,${badgeColor},white 82%)`,
                    color: badgeColor,
                  }}
                >
                  {m.badge}
                </span>
                {on && <span className="chk">{icons.check}</span>}
              </div>
              <div className="ac-name">{m.name}</div>
              <div className="ac-logic">{m.logic}</div>
              <div className="ac-bestfor">
                <span>Best for:</span> {m.bestFor}
              </div>
            </div>
          );
        })}
      </div>

      {isVA && (
        <div className="cs-info-banner" style={{ marginBottom: 18 }}>
          {icons.info}
          <div>
            <strong>Voluntary Alignment recommended for MOD / CNHI.</strong>{" "}
            MOD's patient portal supports nomination workflows. Active duty
            personnel are defaulted to their garrison-assigned provider but can
            voluntarily align to a different in-network provider. This approach
            maximises shared accountability while respecting patient choice.
          </div>
        </div>
      )}

      {/* Method-specific configuration */}
      {sel && (
        <>
          <h3 className="cs-h2 spaced">Method configuration</h3>
          <div className="cf-config-panel">
            <div className="cs-grid-2" style={{ marginBottom: 18 }}>
              <div className="cs-field">
                <label>Lookback period</label>
                <div className="cf-seg-row">
                  {[6, 12, 24].map((mo) => (
                    <span
                      key={mo}
                      className={
                        "cf-seg" + (state.lookbackPeriod === mo ? " on" : "")
                      }
                      onClick={() => set({ lookbackPeriod: mo })}
                    >
                      {mo} months
                    </span>
                  ))}
                </div>
                <p className="cd-help">
                  Period over which prior encounters are evaluated for
                  attribution. Longer lookback increases stability but may lag
                  recent care patterns.
                </p>
              </div>
              <div className="cs-field">
                <label>Minimum visit threshold</label>
                <div className="cs-num-input" style={{ maxWidth: 180 }}>
                  <input
                    type="number"
                    value={state.minVisitThreshold || 2}
                    min={1}
                    max={10}
                    onChange={(e) =>
                      set({ minVisitThreshold: +e.target.value })
                    }
                  />
                  <span className="sfx">visits</span>
                </div>
                <p className="cd-help">
                  Minimum qualifying visits to a provider required for
                  attribution. Prevents attribution based on a single incidental
                  encounter.
                </p>
              </div>
              <div className="cs-field">
                <label>Attribution refresh cycle</label>
                <select
                  className="cd-select"
                  value={state.attributionRefreshCycle || "quarterly"}
                  onChange={(e) =>
                    set({ attributionRefreshCycle: e.target.value })
                  }
                >
                  {REFRESH_CYCLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <p className="cd-help">
                  How often the attributed panel is recalculated. More frequent
                  updates improve accuracy but increase administrative overhead.
                </p>
              </div>
              <div className="cs-field">
                <label>Reconciliation rule</label>
                <select
                  className="cd-select"
                  value={state.reconciliationRule || "changes_prospective"}
                  onChange={(e) => set({ reconciliationRule: e.target.value })}
                >
                  {RECONCILE_RULES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <p className="cd-help">
                  How mid-period attribution changes (transfers, opt-outs) are
                  handled at financial settlement.
                </p>
              </div>
            </div>

            {/* Opt-in / opt-out */}
            <div className="cf-field-card">
              <div className="cf-fc-head">
                <div>
                  <div className="nm">Opt-in / opt-out rules</div>
                  <div className="sub">
                    Allow members to accept or decline attribution to this
                    provider group
                  </div>
                </div>
                <label className="cs-switch">
                  <div
                    className={"cs-toggle" + (state.optInEnabled ? " on" : "")}
                    onClick={() => set({ optInEnabled: !state.optInEnabled })}
                  >
                    <span className="knob" />
                  </div>
                  <span>{state.optInEnabled ? "Active" : "Disabled"}</span>
                </label>
              </div>
              {state.optInEnabled && (
                <div className="cf-fc-body">
                  <label
                    style={{
                      font: "500 10px/1 var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    Opt-in rule text
                  </label>
                  <textarea
                    className="cd-textarea"
                    value={state.optInRule || ""}
                    onChange={(e) => set({ optInRule: e.target.value })}
                    style={{ minHeight: 70, fontSize: 12, lineHeight: 1.5 }}
                  />
                  <p className="cd-help" style={{ marginTop: 4 }}>
                    Displayed to patients in the MOD portal during nomination
                    workflow.
                  </p>
                </div>
              )}
            </div>

            {/* Lives counter */}
            <div className="cf-attr-lives">
              <div className="al-left">
                <div className="nm">Estimated attributed panel</div>
                <div className="sub">
                  {sel.name} · {state.lookbackPeriod || 12}-month lookback · min{" "}
                  {state.minVisitThreshold || 2} visits
                </div>
              </div>
              <div className="al-nums">
                <div className="num">{estLives.toLocaleString()}</div>
                <div className="den">
                  of {(state.eligibleMembers || 47000).toLocaleString()}{" "}
                  eligible
                </div>
                <div className="pct">
                  {Math.round(
                    (estLives / (state.eligibleMembers || 47000)) * 100,
                  )}
                  %
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default CFAttribution;
