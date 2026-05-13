import {
  ATTRIBUTION_METHODS,
  BENCHMARK_METHODS,
  HCP_LAN,
  KSA_REGIONS,
  PROV_GROUP_TYPES,
  RISK_ADJ_MODELS,
} from "@/mock/contract-designer";
import { Icons } from "../Icons/Icons";
import { sarFmt } from "./ContractFinance";
import { DIMS } from "@/mock/framework";
import { FACILITIES } from "@/mock/organization";
import React from "react";
// Session 5B — CFReview.jsx — Step I: Review & Submit
function CFReview({ state, set, onStep }) {
  const icons = Icons;
  const sar = sarFmt || ((n) => "SAR " + Math.abs(n || 0).toLocaleString());

  const lanCats = (state.lanCategories || [])
    .map((id) => (HCP_LAN || []).find((c) => c.id === id))
    .filter(Boolean);
  const attrMeth = (ATTRIBUTION_METHODS || []).find(
    (m) => m.id === state.attributionMethod,
  );
  const benchMeth = (BENCHMARK_METHODS || []).find(
    (m) => m.id === state.benchmarkMethodology,
  );
  const riskMod = (RISK_ADJ_MODELS || []).find(
    (m) => m.id === state.riskAdjModel,
  );
  const dims = DIMS || [];
  const dw = state.dimWeights || {};
  const actDims = dims.filter((d) => dw[d.id] != null);
  const weightSum = actDims.reduce((a, d) => a + (dw[d.id] || 0), 0);
  const AB =
    (state.eligibleMembers || 47000) * (state.baselinePMPM || 3112) * 12;
  const QBP = Math.round(AB * 0.03);
  const facs = (FACILITIES || []).filter((f) =>
    (state.networkFacilities || []).includes(f.id),
  );

  const Section = ({ title, step, children }) => (
    <div className="cf-review-section">
      <div className="cf-rs-hd">
        <h3>{title}</h3>
        <button
          className="cd-btn ghost"
          style={{ fontSize: 11, padding: "5px 10px" }}
          onClick={() => onStep(step)}
        >
          Edit
        </button>
      </div>
      <div className="cf-rs-body">{children}</div>
    </div>
  );

  const Row = ({ label, value, mono, warn }) => (
    <div className="cf-rv-row">
      <span className="lbl">{label}</span>
      <span className={"val" + (mono ? " mono" : "") + (warn ? " warn" : "")}>
        {value}
      </span>
    </div>
  );

  return (
    <div data-screen-label="CF-I Review & Submit">
      <div className="cf-review-header">
        <div>
          <h2>Contract review</h2>
          <p>
            Full configuration summary for {state.id}. Review each section
            before submitting for approval.
          </p>
        </div>
        <div className="cf-review-status">
          <span
            className="or-pill status-onboarding"
            style={{ fontSize: 11, padding: "5px 12px" }}
          >
            Draft
          </span>
        </div>
      </div>

      <div className="cf-review-grid">
        {/* Contract type */}
        <Section title="Contract Type (Step a)" step="type">
          <Row
            label="HCP-LAN categories"
            value={
              lanCats.length
                ? lanCats
                    .map((c) => `Category ${c.code} — ${c.name}`)
                    .join(", ")
                : "Not set"
            }
            warn={!lanCats.length}
          />
          <Row label="Hybrid model" value={state.hybridMode ? "Yes" : "No"} />
        </Section>

        {/* Market */}
        <Section title="Market & Population (Step b)" step="market">
          <Row
            label="Business line"
            value={
              {
                military_mod: "Military MOD",
                commercial: "Commercial",
                medicare: "Medicare",
                medicaid: "Medicaid",
                gcc_gov: "Govt Employee GCC",
              }[state.businessLine] || "—"
            }
          />
          <Row
            label="Geographic scope"
            value={
              (KSA_REGIONS || []).find((r) => r.id === state.geoScopeRegion)
                ?.name || "—"
            }
          />
          <Row
            label="Eligible members"
            value={(state.eligibleMembers || 0).toLocaleString() + " lives"}
          />
          <Row
            label="Population segments"
            value={(state.popSegments || []).length + " selected"}
          />
          <Row
            label="Copay / Coinsurance / Deductible"
            value={`SAR ${state.copay || 0} / ${state.coinsurance || 0}% / SAR ${(state.deductible || 0).toLocaleString()}`}
            mono
          />
        </Section>

        {/* Provider group */}
        <Section title="Provider Group (Step c)" step="network">
          <Row
            label="Group type"
            value={
              (PROV_GROUP_TYPES || []).find((t) => t.id === state.provGroupType)
                ?.name || "—"
            }
          />
          <Row
            label="In-network facilities"
            value={facs.map((f) => f.code).join(", ") || "None"}
          />
          <Row
            label="Measurement level"
            value={state.subgroupMeasurementLevel || "—"}
          />
          <Row
            label="Settlement level"
            value={state.subgroupSettlementLevel || "—"}
          />
          <Row
            label="Leakage threshold"
            value={
              (state.leakageThreshold || 15) +
              "% — " +
              (state.leakageAction || "flag")
            }
          />
        </Section>

        {/* Value profile */}
        <Section title="Value Profile (Step d)" step="value">
          <Row
            label="Active dimensions"
            value={actDims.length + " of 10"}
            warn={!actDims.length}
          />
          <Row
            label="Weight sum"
            value={weightSum + "%"}
            warn={weightSum !== 100 && actDims.length > 0}
          />
          {actDims.map((d) => (
            <Row
              key={d.id}
              label={`  ${d.code} — ${d.short}`}
              value={dw[d.id] + "%" + (state.gates?.[d.id] ? " (gate)" : "")}
              mono
            />
          ))}
          <Row label="Benchmark overlay" value={state.benchmarkType || "—"} />
          <Row
            label="Risk corridor"
            value={
              state.riskCorridorEnabled
                ? `±${state.riskCorridorFloor || 10}% / +${state.riskCorridorCeiling || 10}%`
                : "Disabled"
            }
          />
        </Section>

        {/* Attribution */}
        <Section title="Attribution Engine (Step e)" step="attr">
          <Row
            label="Method"
            value={attrMeth?.name || "Not set"}
            warn={!attrMeth}
          />
          <Row
            label="Lookback period"
            value={(state.lookbackPeriod || 12) + " months"}
            mono
          />
          <Row
            label="Min visit threshold"
            value={(state.minVisitThreshold || 2) + " visits"}
            mono
          />
          <Row
            label="Refresh cycle"
            value={state.attributionRefreshCycle || "—"}
          />
          <Row
            label="Opt-in/out rules"
            value={state.optInEnabled ? "Active" : "Disabled"}
          />
          <Row label="Reconciliation" value={state.reconciliationRule || "—"} />
        </Section>

        {/* Financial model */}
        <Section title="Financial Model (Step f)" step="finance">
          <Row
            label="Benchmark method"
            value={benchMeth?.name || "—"}
            warn={!benchMeth}
          />
          <Row
            label="Baseline period"
            value={`${state.baselineStart || "—"} → ${state.baselineEnd || "—"}`}
            mono
          />
          <Row
            label="Medical trend (unit + util)"
            value={`${state.medicalUnitCostTrend || 6.2}% + ${state.medicalUtilTrend || 1.8}%`}
            mono
          />
          <Row
            label="Pharmacy trend (unit + util)"
            value={`${state.pharmacyUnitCostTrend || 8.1}% + ${state.pharmacyUtilTrend || 2.4}%`}
            mono
          />
          <Row
            label="Minimum savings rate"
            value={(state.minimumSavingsRate || 2.0) + "%"}
            mono
          />
          <Row
            label="Shared savings tiers"
            value={
              (state.sharedSavingsTiers || [])
                .map((t) => `${t.from}–${t.to || "∞"}%: ${t.providerPct}%`)
                .join(" · ") || "—"
            }
            mono
          />
          <Row label="Quality bonus pool (3%)" value={sar(QBP)} mono />
          <Row label="Withhold" value={(state.withholdPct || 3) + "%"} mono />
          <Row
            label="Stop-loss"
            value={sar(state.stopLossSAR || 70000000)}
            mono
          />
          <Row
            label="Corridor bands"
            value={(state.corridorBands || []).length + " configured"}
          />
        </Section>

        {/* Risk adjustment */}
        <Section title="Risk Adjustment (Step h)" step="risk">
          <Row
            label="Model"
            value={riskMod?.name || "Not set"}
            warn={!riskMod}
          />
          <Row label="Calculation mode" value={state.riskCalcMode || "—"} />
          <Row
            label="Risk score normalisation"
            value={state.riskNormEnabled ? "Active" : "Disabled"}
          />
          <Row
            label="Audit trail"
            value={state.auditTrail ? "Enabled" : "Disabled"}
          />
          {state.separateCostQuality && (
            <>
              <Row
                label="Cost risk model"
                value={
                  (RISK_ADJ_MODELS || []).find(
                    (m) => m.id === state.costRiskModel,
                  )?.code || "—"
                }
                mono
              />
              <Row
                label="Outcome risk model"
                value={
                  (RISK_ADJ_MODELS || []).find(
                    (m) => m.id === state.qualityRiskModel,
                  )?.code || "—"
                }
                mono
              />
            </>
          )}
        </Section>
      </div>

      {/* Submit actions */}
      <div className="cf-submit-bar">
        <div className="left">
          <div className="cf-sb-note">
            {[
              !lanCats.length && "contract type not set",
              weightSum !== 100 &&
                actDims.length &&
                "weights don't sum to 100%",
              !attrMeth && "attribution method not set",
            ].filter(Boolean).length === 0 ? (
              <span style={{ color: "oklch(0.40 0.16 145)" }}>
                ✓ Contract ready for review
              </span>
            ) : (
              <span style={{ color: "oklch(0.45 0.18 25)" }}>
                ⚠{" "}
                {[
                  !lanCats.length && "contract type not set",
                  weightSum !== 100 &&
                    actDims.length &&
                    "weights don't sum to 100%",
                  !attrMeth && "attribution method not set",
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            )}
          </div>
        </div>
        <div className="right">
          <button className="cd-btn">Save as draft</button>
          <button
            className="cd-btn"
            style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
          >
            Export PDF summary
          </button>
          <button
            className="cd-btn primary"
            style={{
              background: "oklch(0.40 0.16 145)",
              borderColor: "oklch(0.40 0.16 145)",
            }}
          >
            Submit for approval {icons.arrow}
          </button>
        </div>
      </div>
    </div>
  );
}
export default CFReview;
