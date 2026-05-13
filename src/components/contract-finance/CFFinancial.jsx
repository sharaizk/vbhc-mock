import { BENCHMARK_METHODS } from "@/mock/contract-designer";
import { Icons } from "../Icons/Icons";
import React from "react";
// Session 5B — CFFinancial.jsx — Step F: Financial Model (Benchmark · Mechanics · Corridors)
const { useState: cfmUseState } = React;

const sar = (n) => {
  const abs = Math.abs(n || 0);
  return (
    (n < 0 ? "−" : "") +
    "SAR " +
    (abs >= 1e9
      ? (abs / 1e9).toFixed(2) + "B"
      : abs >= 1e6
        ? (abs / 1e6).toFixed(1) + "M"
        : abs.toLocaleString())
  );
};

/* helpers */
const FUNDING_SOURCES = [
  "withhold",
  "global_budget",
  "above_ffs",
  "purchaser_funded",
];
const DIST_FORMULAS = [
  "proportional",
  "equal_share",
  "tiered_performance",
  "composite_weighted",
];
const CALC_METHODS = [
  "composite_score",
  "dimension_weighted",
  "threshold_gates",
  "hybrid",
];
const CARVE_OUT_OPTIONS = [
  "pharmacy",
  "behavioral_health",
  "oncology",
  "rare_disease",
  "long_term_care",
  "dental",
  "vision",
];
const COVERED_CATS = [
  "inpatient",
  "outpatient",
  "ed",
  "pharmacy",
  "ancillary",
  "telehealth",
  "preventive",
];

function Tab1Benchmark({ state, set }) {
  const methods = BENCHMARK_METHODS || [];
  const sel = methods.find((m) => m.id === state.benchmarkMethodology);
  return (
    <div className="cf-tab-body">
      <h3 className="cs-h2">Benchmark methodology</h3>
      <div className="cf-bm-grid">
        {methods.map((m) => {
          const on = state.benchmarkMethodology === m.id;
          return (
            <div
              key={m.id}
              className={"cf-bm-card" + (on ? " on" : "")}
              onClick={() => set({ benchmarkMethodology: m.id })}
            >
              <div className="bm-head">
                <span className="nm">{m.name}</span>
                {on && <span className="chk">{Icons?.check}</span>}
              </div>
              <div className="bm-desc">{m.desc}</div>
            </div>
          );
        })}
      </div>

      <h3 className="cs-h2 spaced">Baseline period &amp; run-out</h3>
      <div className="cs-grid-3">
        <div className="cs-field">
          <label>Baseline start date</label>
          <input
            className="cd-input"
            type="date"
            value={state.baselineStart || "2024-01-01"}
            onChange={(e) => set({ baselineStart: e.target.value })}
          />
        </div>
        <div className="cs-field">
          <label>Baseline end date</label>
          <input
            className="cd-input"
            type="date"
            value={state.baselineEnd || "2024-12-31"}
            onChange={(e) => set({ baselineEnd: e.target.value })}
          />
        </div>
        <div className="cs-field">
          <label>Run-out period (months)</label>
          <div className="cs-num-input">
            <input
              type="number"
              value={state.runOutPeriod || 6}
              min={0}
              max={24}
              onChange={(e) => set({ runOutPeriod: +e.target.value })}
            />
            <span className="sfx">months</span>
          </div>
          <p className="cd-help">
            Claims incurred in baseline but not yet paid. Extend this window for
            inpatient-heavy panels.
          </p>
        </div>
      </div>

      <h3 className="cs-h2 spaced">Trend factors</h3>
      <p className="cd-help" style={{ marginBottom: 12 }}>
        Project baseline costs forward to the contract period. Broken out by
        service category and cost component (unit cost inflation vs. utilisation
        change).
      </p>
      <div className="cf-trend-grid">
        {[
          ["Medical — Unit cost trend", "medicalUnitCostTrend", 6.2],
          ["Medical — Utilisation trend", "medicalUtilTrend", 1.8],
          ["Pharmacy — Unit cost trend", "pharmacyUnitCostTrend", 8.1],
          ["Pharmacy — Utilisation trend", "pharmacyUtilTrend", 2.4],
        ].map(([label, key, def]) => (
          <div key={key} className="cf-trend-row">
            <span className="lbl">{label}</span>
            <div className="cs-num-input" style={{ maxWidth: 140 }}>
              <input
                type="number"
                step="0.1"
                value={state[key] ?? def}
                onChange={(e) => set({ [key]: +e.target.value })}
              />
              <span className="sfx">%</span>
            </div>
          </div>
        ))}
      </div>
      <div className="cf-trend-summary">
        <span>Blended medical trend:</span>
        <strong>
          {(
            +(state.medicalUnitCostTrend ?? 6.2) +
            +(state.medicalUtilTrend ?? 1.8)
          ).toFixed(1)}
          %
        </strong>
        <span style={{ marginLeft: 16 }}>Blended pharmacy trend:</span>
        <strong>
          {(
            +(state.pharmacyUnitCostTrend ?? 8.1) +
            +(state.pharmacyUtilTrend ?? 2.4)
          ).toFixed(1)}
          %
        </strong>
      </div>

      <h3 className="cs-h2 spaced">Risk score &amp; minimum savings rate</h3>
      <div className="cs-grid-2">
        <div className="cs-field">
          <label>Risk score normalisation</label>
          <label className="cs-switch">
            <div
              className={"cs-toggle" + (state.riskScoreNorm ? " on" : "")}
              onClick={() => set({ riskScoreNorm: !state.riskScoreNorm })}
            >
              <span className="knob" />
            </div>
            <span>
              {state.riskScoreNorm
                ? "Active — adjusted benchmark normalised to risk score 1.0"
                : "Disabled — raw benchmark applied"}
            </span>
          </label>
          <p className="cd-help" style={{ marginTop: 4 }}>
            Normalises the benchmark so the reference population risk score =
            1.0. Prevents adverse selection bias where a higher-acuity panel
            inflates measured savings.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="cs-field">
            <label>Minimum savings rate (MSR)</label>
            <div className="cs-num-input" style={{ maxWidth: 160 }}>
              <input
                type="number"
                step="0.5"
                value={state.minimumSavingsRate ?? 2.0}
                min={0}
                max={10}
                onChange={(e) => set({ minimumSavingsRate: +e.target.value })}
              />
              <span className="sfx">%</span>
            </div>
            <p className="cd-help">
              Provider must achieve savings above this rate before shared
              savings are triggered. Filters out statistical noise.
            </p>
          </div>
          <div className="cs-field">
            <label>Symmetric minimum loss rate (two-sided)</label>
            <label className="cs-switch">
              <div
                className={"cs-toggle" + (state.symmetricMSR ? " on" : "")}
                onClick={() => set({ symmetricMSR: !state.symmetricMSR })}
              >
                <span className="knob" />
              </div>
              <span>
                {state.symmetricMSR
                  ? "Active — symmetric MLR mirrors MSR threshold"
                  : "Disabled"}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function Tab2Mechanics({ state, set }) {
  const catId = (state.lanCategories || ["cat3a"])[0];
  const mechMap = PAYMENT_MECHANICS_BY_CAT || {};
  const active = mechMap[catId] || ["shared_savings", "quality_bonus"];
  const catName = (HCP_LAN || []).find((c) => c.id === catId)?.name || catId;

  const has = (id) => active.includes(id);
  const AB =
    (state.eligibleMembers || 47000) * (state.baselinePMPM || 3112) * 12;
  const QBP = Math.round(AB * 0.03);

  return (
    <div className="cf-tab-body">
      <div className="cs-info-banner" style={{ marginBottom: 18 }}>
        {Icons?.info}
        <div>
          Payment mechanics shown below are determined by the selected contract
          category: <strong>{catName}</strong>. Navigate to Step a to change the
          HCP-LAN classification.
        </div>
      </div>

      {has("shared_savings") && (
        <div className="cf-mech-block">
          <div className="cf-mech-head">
            <span className="tag">Shared Savings</span>
          </div>
          <div className="cf-mech-body">
            <div className="cf-tier-table">
              <div className="row hd">
                <span>Savings band (% of baseline)</span>
                <span>Provider share</span>
                <span>Purchaser share</span>
              </div>
              {(state.sharedSavingsTiers || []).map((t, i) => (
                <div key={i} className="row bd">
                  <span className="mono">
                    {t.from}% – {t.to != null ? t.to + "%" : "uncapped"}
                  </span>
                  <div className="cs-num-input" style={{ maxWidth: 100 }}>
                    <input
                      type="number"
                      value={t.providerPct}
                      min={0}
                      max={100}
                      onChange={(e) => {
                        const tiers = [...state.sharedSavingsTiers];
                        tiers[i] = { ...t, providerPct: +e.target.value };
                        set({ sharedSavingsTiers: tiers });
                      }}
                    />
                    <span className="sfx">%</span>
                  </div>
                  <span
                    className="mono"
                    style={{ color: "var(--fg-secondary)" }}
                  >
                    {100 - t.providerPct}%
                  </span>
                </div>
              ))}
            </div>
            <div className="cs-grid-2" style={{ marginTop: 14 }}>
              <div className="cs-field">
                <label>Quality gate required</label>
                <label className="cs-switch">
                  <div
                    className={"cs-toggle" + (state.ssQualityGate ? " on" : "")}
                    onClick={() => set({ ssQualityGate: !state.ssQualityGate })}
                  >
                    <span className="knob" />
                  </div>
                  <span>
                    {state.ssQualityGate
                      ? "Active — provider must meet quality floor to receive savings"
                      : "Disabled"}
                  </span>
                </label>
              </div>
              <div className="cs-field">
                <label>Maximum savings cap</label>
                <div className="cs-num-input">
                  <span className="pfx">SAR</span>
                  <input
                    type="number"
                    value={state.ssMaxCapSAR || 140000000}
                    onChange={(e) => set({ ssMaxCapSAR: +e.target.value })}
                  />
                </div>
                <p className="cd-help">
                  Absolute cap on shared savings payable to provider in any
                  settlement period.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {has("shared_losses") && (
        <div className="cf-mech-block">
          <div className="cf-mech-head">
            <span className="tag loss">Shared Losses</span>
          </div>
          <div className="cf-mech-body">
            <div className="cs-grid-2">
              <div className="cs-field">
                <label>Provider loss sharing %</label>
                <div className="cs-num-input" style={{ maxWidth: 160 }}>
                  <input
                    type="number"
                    value={state.lossSharing || 40}
                    min={0}
                    max={100}
                    onChange={(e) => set({ lossSharing: +e.target.value })}
                  />
                  <span className="sfx">%</span>
                </div>
              </div>
              <div className="cs-field">
                <label>Stop-loss provision</label>
                <div className="cs-num-input">
                  <span className="pfx">SAR</span>
                  <input
                    type="number"
                    value={state.stopLossSAR || 70000000}
                    onChange={(e) => set({ stopLossSAR: +e.target.value })}
                  />
                </div>
                <p className="cd-help">
                  Maximum provider loss liability per period — purchaser absorbs
                  beyond this.
                </p>
              </div>
              <div className="cs-field">
                <label>First-dollar vs corridor</label>
                <label className="cs-switch">
                  <div
                    className={
                      "cs-toggle" + (state.firstDollarLoss ? " on" : "")
                    }
                    onClick={() =>
                      set({ firstDollarLoss: !state.firstDollarLoss })
                    }
                  >
                    <span className="knob" />
                  </div>
                  <span>
                    {state.firstDollarLoss
                      ? "First-dollar sharing — losses shared from dollar one"
                      : "Corridor — losses shared only above MLR threshold"}
                  </span>
                </label>
              </div>
              <div className="cs-field">
                <label>Phase-in schedule</label>
                <select
                  className="cd-select"
                  value={state.phaseIn || "year2"}
                  onChange={(e) => set({ phaseIn: e.target.value })}
                >
                  <option value="year1">From Year 1 (immediate)</option>
                  <option value="year2">Phase in from Year 2</option>
                  <option value="year3">Phase in from Year 3</option>
                  <option value="none">No phase-in</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {has("quality_bonus") && (
        <div className="cf-mech-block">
          <div className="cf-mech-head">
            <span className="tag quality">Quality Bonus Pool</span>
            <span className="cf-mech-amt">
              {sar(QBP)} (3% of annual baseline)
            </span>
          </div>
          <div className="cf-mech-body">
            <div className="cs-grid-3">
              <div className="cs-field">
                <label>Pool funding source</label>
                <select
                  className="cd-select"
                  value={state.qbpFunding || "withhold"}
                  onChange={(e) => set({ qbpFunding: e.target.value })}
                >
                  <option value="withhold">Provider withhold</option>
                  <option value="global_budget">
                    Separate budget allocation
                  </option>
                  <option value="above_ffs">Above-FFS layer</option>
                  <option value="purchaser_funded">
                    Purchaser-funded bonus
                  </option>
                </select>
              </div>
              <div className="cs-field">
                <label>Distribution formula</label>
                <select
                  className="cd-select"
                  value={state.qbpDistribution || "proportional"}
                  onChange={(e) => set({ qbpDistribution: e.target.value })}
                >
                  <option value="proportional">
                    Proportional to performance score
                  </option>
                  <option value="equal_share">
                    Equal share (all-or-nothing)
                  </option>
                  <option value="tiered_performance">
                    Tiered (floor/target/stretch)
                  </option>
                  <option value="composite_weighted">Composite-weighted</option>
                </select>
              </div>
              <div className="cs-field">
                <label>Calculation method</label>
                <select
                  className="cd-select"
                  value={state.qbpCalcMethod || "composite"}
                  onChange={(e) => set({ qbpCalcMethod: e.target.value })}
                >
                  <option value="composite">
                    Composite score (D1–D10 weighted)
                  </option>
                  <option value="dimension_weighted">
                    Dimension-weighted individual
                  </option>
                  <option value="threshold_gates">Threshold gates only</option>
                  <option value="hybrid">Hybrid (gates + composite)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {has("withhold") && (
        <div className="cf-mech-block">
          <div className="cf-mech-head">
            <span className="tag withhold">Withhold &amp; Release</span>
            <span className="cf-mech-amt">
              {sar(Math.round((AB * (state.withholdPct || 3)) / 100))} withheld
              ({state.withholdPct || 3}%)
            </span>
          </div>
          <div className="cf-mech-body">
            <div className="cs-grid-2">
              <div className="cs-field">
                <label>Withhold percentage</label>
                <div className="cs-num-input" style={{ maxWidth: 160 }}>
                  <input
                    type="number"
                    step="0.5"
                    value={state.withholdPct || 3}
                    min={0}
                    max={15}
                    onChange={(e) => set({ withholdPct: +e.target.value })}
                  />
                  <span className="sfx">% of contracted payments</span>
                </div>
              </div>
              <div className="cs-field">
                <label>Forfeiture rule</label>
                <select
                  className="cd-select"
                  value={state.withholdForfeiture || "quality"}
                  onChange={(e) => set({ withholdForfeiture: e.target.value })}
                >
                  <option value="quality">
                    Forfeited if quality floor not met
                  </option>
                  <option value="savings">
                    Forfeited if net loss (no savings)
                  </option>
                  <option value="composite">
                    Forfeited proportional to composite score
                  </option>
                  <option value="none">
                    No forfeiture — withhold always returned
                  </option>
                </select>
              </div>
              <div className="cs-field">
                <label>Partial release schedule</label>
                <label className="cs-switch">
                  <div
                    className={
                      "cs-toggle" + (state.withholdPartialRelease ? " on" : "")
                    }
                    onClick={() =>
                      set({
                        withholdPartialRelease: !state.withholdPartialRelease,
                      })
                    }
                  >
                    <span className="knob" />
                  </div>
                  <span>
                    {state.withholdPartialRelease
                      ? "Active — partial release based on interim performance"
                      : "Full withhold — released only at year-end settlement"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {has("capitation") && (
        <div className="cf-mech-block">
          <div className="cf-mech-head">
            <span className="tag cap">Capitation (PMPM)</span>
          </div>
          <div className="cf-mech-body">
            <div className="cf-pmpm-table">
              <div className="row hd">
                <span>Age/Gender band</span>
                <span>PMPM rate (SAR)</span>
              </div>
              {(state.pmpmBands || DEFAULT_PMPM_BANDS || []).map((b, i) => (
                <div key={i} className="row bd">
                  <span>{b.band}</span>
                  <div className="cs-num-input" style={{ maxWidth: 160 }}>
                    <span className="pfx">SAR</span>
                    <input
                      type="number"
                      value={b.pmpm}
                      onChange={(e) => {
                        const bands = [
                          ...(state.pmpmBands || DEFAULT_PMPM_BANDS || []),
                        ];
                        bands[i] = { ...b, pmpm: +e.target.value };
                        set({ pmpmBands: bands });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="cs-grid-2" style={{ marginTop: 14 }}>
              <div className="cs-field">
                <label>Risk adjustment</label>
                <label className="cs-switch">
                  <div
                    className={"cs-toggle" + (state.capRiskAdj ? " on" : "")}
                    onClick={() => set({ capRiskAdj: !state.capRiskAdj })}
                  >
                    <span className="knob" />
                  </div>
                  <span>
                    {state.capRiskAdj
                      ? "PMPM rates risk-adjusted at settlement"
                      : "Fixed PMPM — no risk adjustment"}
                  </span>
                </label>
              </div>
              <div className="cs-field">
                <label>Carve-outs (excluded from capitation)</label>
                <div className="cf-carveout-row">
                  {CARVE_OUT_OPTIONS.map((c) => {
                    const on = (state.capCarveOuts || []).includes(c);
                    return (
                      <span
                        key={c}
                        className={"cf-carveout" + (on ? " on" : "")}
                        onClick={() => {
                          const cur = state.capCarveOuts || [];
                          set({
                            capCarveOuts: on
                              ? cur.filter((x) => x !== c)
                              : [...cur, c],
                          });
                        }}
                      >
                        {c.replace("_", " ")}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {has("bundled") && (
        <div className="cf-mech-block">
          <div className="cf-mech-head">
            <span className="tag bundle">Bundled Payment</span>
          </div>
          <div className="cf-mech-body">
            <div className="cs-grid-2">
              <div className="cs-field">
                <label>Episode trigger (DRG / procedure code)</label>
                <input
                  className="cd-input"
                  value={state.bundleDRG || ""}
                  placeholder="e.g. 470 — Major joint replacement"
                  onChange={(e) => set({ bundleDRG: e.target.value })}
                />
              </div>
              <div className="cs-field">
                <label>Episode window</label>
                <div className="cs-num-input" style={{ maxWidth: 160 }}>
                  <input
                    type="number"
                    value={state.bundleWindowDays || 90}
                    min={30}
                    max={365}
                    onChange={(e) => set({ bundleWindowDays: +e.target.value })}
                  />
                  <span className="sfx">days post-trigger</span>
                </div>
              </div>
              <div className="cs-field">
                <label>Target price per episode</label>
                <div className="cs-num-input">
                  <span className="pfx">SAR</span>
                  <input
                    type="number"
                    value={state.bundleTargetSAR || 45000}
                    onChange={(e) => set({ bundleTargetSAR: +e.target.value })}
                  />
                </div>
              </div>
              <div className="cs-field">
                <label>Outlier threshold (× target)</label>
                <div className="cs-num-input" style={{ maxWidth: 160 }}>
                  <input
                    type="number"
                    step="0.5"
                    value={state.bundleOutlierPct || 2.5}
                    min={1}
                    max={10}
                    onChange={(e) => set({ bundleOutlierPct: +e.target.value })}
                  />
                  <span className="sfx">× target price</span>
                </div>
                <p className="cd-help">
                  Episodes exceeding this multiple revert to FFS — excluded from
                  bundle performance.
                </p>
              </div>
              <div className="cs-field">
                <label>Provider gainsharing split</label>
                <div className="cs-num-input" style={{ maxWidth: 160 }}>
                  <input
                    type="number"
                    value={state.bundleGainshare || 60}
                    min={0}
                    max={100}
                    onChange={(e) => set({ bundleGainshare: +e.target.value })}
                  />
                  <span className="sfx">% to provider</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {has("care_mgmt_fee") && (
        <div className="cf-mech-block">
          <div className="cf-mech-head">
            <span className="tag cmf">Care Management Fee</span>
            <span className="cf-mech-amt">
              {sar((state.cMgmtPMPM || 120) * (state.eligibleMembers || 47000))}{" "}
              /yr
            </span>
          </div>
          <div className="cf-mech-body">
            <div className="cs-grid-2">
              <div className="cs-field">
                <label>PMPM amount</label>
                <div className="cs-num-input">
                  <span className="pfx">SAR</span>
                  <input
                    type="number"
                    value={state.cMgmtPMPM || 120}
                    onChange={(e) => set({ cMgmtPMPM: +e.target.value })}
                  />
                  <span className="sfx">/member/month</span>
                </div>
              </div>
              <div className="cs-field">
                <label>Time-limited</label>
                <label className="cs-switch">
                  <div
                    className={
                      "cs-toggle" + (state.cMgmtTimeLimited ? " on" : "")
                    }
                    onClick={() =>
                      set({ cMgmtTimeLimited: !state.cMgmtTimeLimited })
                    }
                  >
                    <span className="knob" />
                  </div>
                  <span>
                    {state.cMgmtTimeLimited
                      ? "Active — fee expires after set duration"
                      : "Ongoing — no expiry"}
                  </span>
                </label>
                {state.cMgmtTimeLimited && (
                  <div
                    className="cs-num-input"
                    style={{ maxWidth: 160, marginTop: 8 }}
                  >
                    <input
                      type="number"
                      value={state.cMgmtDurationMo || 24}
                      min={1}
                      onChange={(e) =>
                        set({ cMgmtDurationMo: +e.target.value })
                      }
                    />
                    <span className="sfx">months</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Tab3Corridors({ state, set }) {
  const bands = state.corridorBands || [];
  const icons = Icons;

  const updateBand = (i, patch) => {
    const b = [...bands];
    b[i] = { ...b[i], ...patch };
    set({ corridorBands: b });
  };
  const addBand = () => {
    const lastTo = bands[bands.length - 1]?.to ?? 10;
    set({
      corridorBands: [
        ...bands,
        {
          from: lastTo,
          to: lastTo + 3,
          provPct: 50,
          purchPct: 50,
          label: `Zone ${bands.length}`,
        },
      ],
    });
  };
  const removeBand = (i) =>
    set({ corridorBands: bands.filter((_, j) => j !== i) });

  return (
    <div className="cf-tab-body">
      <h3 className="cs-h2">Corridor band configuration</h3>
      <p className="cd-help" style={{ marginBottom: 16 }}>
        Define up to 4 sharing zones. Each band specifies the savings/loss range
        (as % of baseline) and how savings or losses in that range are split
        between provider and purchaser.
      </p>

      <div className="cf-corridor-bands">
        <div className="row hd">
          <span>Zone label</span>
          <span>From (%)</span>
          <span>To (%)</span>
          <span>Provider share</span>
          <span>Purchaser share</span>
          <span></span>
        </div>
        {bands.map((b, i) => (
          <div key={i} className="row bd">
            <input
              className="cd-input"
              value={b.label || ""}
              style={{ fontSize: 12 }}
              onChange={(e) => updateBand(i, { label: e.target.value })}
            />
            <div className="cs-num-input" style={{ maxWidth: 90 }}>
              <input
                type="number"
                value={b.from}
                min={0}
                onChange={(e) => updateBand(i, { from: +e.target.value })}
              />
              <span className="sfx">%</span>
            </div>
            <div className="cs-num-input" style={{ maxWidth: 90 }}>
              <input
                type="number"
                value={b.to ?? ""}
                placeholder="∞"
                onChange={(e) =>
                  updateBand(i, {
                    to: e.target.value === "" ? null : +e.target.value,
                  })
                }
              />
              <span className="sfx">%</span>
            </div>
            <div className="cs-num-input" style={{ maxWidth: 100 }}>
              <input
                type="number"
                value={b.provPct}
                min={0}
                max={100}
                onChange={(e) =>
                  updateBand(i, {
                    provPct: +e.target.value,
                    purchPct: 100 - +e.target.value,
                  })
                }
              />
              <span className="sfx">%</span>
            </div>
            <span
              className="mono"
              style={{ color: "var(--fg-secondary)", textAlign: "center" }}
            >
              {b.purchPct ?? 100 - b.provPct}%
            </span>
            <button className="ico-btn" onClick={() => removeBand(i)}>
              {icons.trash}
            </button>
          </div>
        ))}
        {bands.length < 4 && (
          <div className="row bd" style={{ cursor: "default", opacity: 0.6 }}>
            <button
              className="cd-btn ghost"
              onClick={addBand}
              style={{
                gridColumn: "1/-1",
                justifyContent: "flex-start",
                padding: "6px 0",
              }}
            >
              {icons.plus} Add zone
            </button>
          </div>
        )}
      </div>

      {/* Visual corridor diagram */}
      <h3 className="cs-h2 spaced">Corridor diagram</h3>
      <div className="cf-corridor-diagram">
        {bands.map((b, i) => (
          <div key={i} className="cd-zone">
            <div className="cd-zone-label">{b.label}</div>
            <div className="cd-zone-range">
              {b.from}%{b.to != null ? `–${b.to}%` : "+"}
            </div>
            <div className="cd-zone-bars">
              <div className="bar prov" style={{ flex: b.provPct }}>
                {b.provPct > 15 ? `${b.provPct}% provider` : ""}
              </div>
              <div className="bar purch" style={{ flex: 100 - b.provPct }}>
                {100 - b.provPct > 15 ? `${100 - b.provPct}% purchaser` : ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="cs-h2 spaced">Stop-loss threshold</h3>
      <div className="cs-grid-2">
        <div className="cs-field">
          <label>Stop-loss (% of annual baseline)</label>
          <div className="cs-num-input" style={{ maxWidth: 200 }}>
            <input
              type="number"
              step="1"
              value={state.stopLossThreshold || 15}
              min={0}
              max={50}
              onChange={(e) => set({ stopLossThreshold: +e.target.value })}
            />
            <span className="sfx">%</span>
          </div>
          <p className="cd-help">
            Beyond this savings or loss threshold, the purchaser absorbs all
            residual risk. Protects both parties from catastrophic settlement
            outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}

function CFFinancial({ state, set }) {
  const [tab, setTab] = cfmUseState("benchmark");
  const TABS = [
    { id: "benchmark", label: "1 · Benchmark & Targets" },
    { id: "mechanics", label: "2 · Payment Mechanics" },
    { id: "corridors", label: "3 · Risk Corridors" },
  ];
  return (
    <div data-screen-label="CF-F Financial Model">
      <div className="cf-fin-tabs">
        {TABS.map((t) => (
          <span
            key={t.id}
            className={"cf-fin-tab" + (tab === t.id ? " on" : "")}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </span>
        ))}
      </div>
      {tab === "benchmark" && <Tab1Benchmark state={state} set={set} />}
      {tab === "mechanics" && <Tab2Mechanics state={state} set={set} />}
      {tab === "corridors" && <Tab3Corridors state={state} set={set} />}
    </div>
  );
}
export default CFFinancial;
