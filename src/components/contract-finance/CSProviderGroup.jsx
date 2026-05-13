import React from "react";
import { Icons } from "../Icons/Icons";
import { PROV_GROUP_TYPES } from "@/mock/contract-designer";
import { FACILITIES, PROVIDERS } from "@/mock/organization";
const { useState: cpgUseState } = React;

const HIERARCHY_LEVELS = [
  { id: "network", label: "Network (all facilities)" },
  { id: "facility", label: "Facility" },
  { id: "department", label: "Department" },
  { id: "individual", label: "Individual provider" },
];

const LEAKAGE_ACTIONS = [
  { id: "flag", label: "Flag for care manager review" },
  { id: "alert", label: "Auto-alert care manager" },
  { id: "adjust", label: "Apply cost adjustment at settlement" },
  { id: "cap", label: "Cap reimbursement at contracted rate" },
];

function CSProviderGroup({ setup, set }) {
  const [netTab, setNetTab] = cpgUseState("facilities");
  const icons = Icons;
  const groupTypes = PROV_GROUP_TYPES || [];
  const facilities = FACILITIES || [];
  const providers = PROVIDERS || [];
  const inNetFacs = setup.networkFacilities || [];

  const pcps = providers.filter(
    (p) =>
      inNetFacs.includes(p.facilityId) &&
      ["Family Medicine", "Internal Medicine", "General Practice"].some(
        (s) =>
          (p.specialty || "").includes(s) || (p.department || "").includes(s),
      ),
  );
  const specs = providers.filter(
    (p) =>
      inNetFacs.includes(p.facilityId) &&
      !["Family Medicine", "Internal Medicine", "General Practice"].some(
        (s) =>
          (p.specialty || "").includes(s) || (p.department || "").includes(s),
      ),
  );

  const toggleFac = (id) => {
    const has = inNetFacs.includes(id);
    set({
      networkFacilities: has
        ? inNetFacs.filter((x) => x !== id)
        : [...inNetFacs, id],
    });
  };

  const TABS = [
    { id: "facilities", label: "Facilities", count: inNetFacs.length },
    { id: "pcps", label: "PCPs", count: pcps.length },
    { id: "specialists", label: "Specialists", count: specs.length },
    {
      id: "ancillaries",
      label: "Ancillaries",
      count: (setup.networkAncillaries || []).length,
    },
  ];

  const sStatus = (s) =>
    s === "Active" ? "active" : s === "On leave" ? "leave" : "onboarding";

  return (
    <div data-screen-label="CS3 Provider Group">
      {/* 3.1 Provider group type */}
      <h3 className="cs-h2">Provider group type</h3>
      <div className="cs-prov-type-grid">
        {groupTypes.map((g) => {
          const on = setup.provGroupType === g.id;
          return (
            <div
              key={g.id}
              className={"cs-prov-type" + (on ? " on" : "")}
              onClick={() => set({ provGroupType: g.id })}
            >
              <div className="pt-head">
                <span className="code">{g.code}</span>
                {on && <span className="chk">{icons.check}</span>}
              </div>
              <div className="pt-name">{g.name}</div>
              <div className="pt-desc">{g.desc}</div>
            </div>
          );
        })}
      </div>

      {/* 3.2 Network composition */}
      <h3 className="cs-h2 spaced">Network composition</h3>
      <p className="cd-help" style={{ marginBottom: 12 }}>
        Define which facilities, primary care providers, specialists, and
        ancillary services are in-network under this contract. Providers are
        scoped to selected facilities.
      </p>
      <div className="cs-net-tabs">
        {TABS.map((t) => (
          <span
            key={t.id}
            className={"cs-net-tab" + (netTab === t.id ? " on" : "")}
            onClick={() => setNetTab(t.id)}
          >
            {t.label}
            <span className="ct">{t.count}</span>
          </span>
        ))}
      </div>

      {/* Facilities */}
      {netTab === "facilities" && (
        <>
          <div className="cs-scope-bar">
            <span className="cs-hint">
              {inNetFacs.length} of {facilities.length} facilities in-network ·
              click row to toggle
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="cd-btn ghost"
                onClick={() =>
                  set({ networkFacilities: facilities.map((f) => f.id) })
                }
              >
                Select all
              </button>
              <button
                className="cd-btn ghost"
                onClick={() => set({ networkFacilities: [] })}
              >
                Clear
              </button>
            </div>
          </div>
          <div className="cs-net-table">
            <div className="row hd">
              <span></span>
              <span>Facility</span>
              <span>Type</span>
              <span>Region</span>
              <span>Beds</span>
              <span>Network status</span>
            </div>
            {facilities.map((f) => {
              const on = inNetFacs.includes(f.id);
              return (
                <div
                  key={f.id}
                  className={"row bd" + (on ? " on" : "")}
                  onClick={() => toggleFac(f.id)}
                >
                  <span className={"cs-cb" + (on ? " on" : "")}>
                    {icons.check}
                  </span>
                  <div>
                    <div className="nm">{f.name}</div>
                    <div className="sub">
                      {f.code} · {f.level}
                    </div>
                  </div>
                  <span className="tag">{f.type}</span>
                  <span className="mono">{f.governorate}</span>
                  <span className="mono">{f.beds}</span>
                  <span
                    className={
                      "or-pill " + (on ? "status-active" : "status-leave")
                    }
                  >
                    {on ? "In-network" : "Out-of-network"}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* PCPs */}
      {netTab === "pcps" && (
        <>
          <div className="cs-scope-bar">
            <span className="cs-hint">
              {pcps.length} primary care providers from {inNetFacs.length}{" "}
              in-network {inNetFacs.length === 1 ? "facility" : "facilities"}
            </span>
          </div>
          {!inNetFacs.length && (
            <div className="cs-empty-panel">
              Select at least one facility first — PCPs are scoped to in-network
              facilities.
            </div>
          )}
          {!!inNetFacs.length && (
            <div className="cs-prov-table">
              <div className="row hd">
                <span>Provider</span>
                <span>Facility</span>
                <span>Panel size</span>
                <span>Status</span>
                <span>Designation</span>
              </div>
              {!pcps.length && (
                <div
                  style={{
                    padding: "16px",
                    color: "var(--fg-tertiary)",
                    font: "400 12px/1 var(--font-sans)",
                  }}
                >
                  No PCPs found at selected facilities.
                </div>
              )}
              {pcps.map((p) => {
                const fac = facilities.find((f) => f.id === p.facilityId);
                return (
                  <div key={p.id} className="row bd">
                    <div>
                      <div className="nm">{p.name}</div>
                      <div className="sub">
                        {p.id} · {p.specialty}
                      </div>
                    </div>
                    <span className="mono">{fac?.code}</span>
                    <span className="mono">
                      {(p.panelSize || 0).toLocaleString()}
                    </span>
                    <span className={"or-pill status-" + sStatus(p.status)}>
                      {p.status}
                    </span>
                    <span className="or-pill status-active">In-network</span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Specialists */}
      {netTab === "specialists" && (
        <>
          <div className="cs-scope-bar">
            <span className="cs-hint">
              {specs.length} specialist providers · in-network / referral
              designation applies
            </span>
          </div>
          {!inNetFacs.length && (
            <div className="cs-empty-panel">
              Select at least one facility first — specialists are scoped to
              in-network facilities.
            </div>
          )}
          {!!inNetFacs.length && (
            <div className="cs-spec-table">
              <div className="row hd">
                <span>Provider</span>
                <span>Specialty</span>
                <span>Facility</span>
                <span>Status</span>
                <span>Referral type</span>
              </div>
              {!specs.length && (
                <div
                  style={{
                    padding: "16px",
                    color: "var(--fg-tertiary)",
                    font: "400 12px/1 var(--font-sans)",
                  }}
                >
                  No specialists found at selected facilities.
                </div>
              )}
              {specs.map((p) => {
                const fac = facilities.find((f) => f.id === p.facilityId);
                return (
                  <div key={p.id} className="row bd">
                    <div>
                      <div className="nm">{p.name}</div>
                      <div className="sub">{p.id}</div>
                    </div>
                    <span>{p.specialty}</span>
                    <span className="mono">{fac?.code}</span>
                    <span className={"or-pill status-" + sStatus(p.status)}>
                      {p.status}
                    </span>
                    <span className="or-pill">In-network direct</span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Ancillaries */}
      {netTab === "ancillaries" && (
        <div className="cs-anc-placeholder">
          <div className="icon">⚗</div>
          <div className="msg">No ancillary providers configured</div>
          <p className="sub">
            Add lab, imaging, pharmacy, and rehabilitation providers to define
            their in-network / referral designation under this contract.
          </p>
          <button className="cd-btn" style={{ marginTop: 12 }}>
            {icons.plus} Add ancillary provider
          </button>
        </div>
      )}

      {/* 3.3 Sub-group hierarchy */}
      <h3 className="cs-h2 spaced">Sub-group hierarchy configuration</h3>
      <p className="cd-help" style={{ marginBottom: 14 }}>
        Configure the granularity at which performance is measured independently
        vs. at which financial settlement is aggregated and applied.
      </p>
      <div className="cs-hier-grid">
        {[
          [
            "subgroupMeasurementLevel",
            "Measurement level",
            "Performance scores computed at this granularity",
          ],
          [
            "subgroupSettlementLevel",
            "Settlement level",
            "Financial settlement aggregated and applied at this level",
          ],
        ].map(([key, label, hint]) => (
          <div key={key} className="cs-hier-row">
            <div className="hl">
              <span className="hn">{label}</span>
              <span className="hh">{hint}</span>
            </div>
            <select
              className="cd-select"
              style={{ minWidth: 200 }}
              value={setup[key] || "facility"}
              onChange={(e) => set({ [key]: e.target.value })}
            >
              {HIERARCHY_LEVELS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="cs-hier-vis">
        {HIERARCHY_LEVELS.map((h) => {
          const isMeas = setup.subgroupMeasurementLevel === h.id;
          const isSetl = setup.subgroupSettlementLevel === h.id;
          return (
            <div
              key={h.id}
              className={"cs-hlv" + (isMeas || isSetl ? " active" : "")}
            >
              <span className="lbl">{h.label}</span>
              <div className="tags">
                {isMeas && <span className="cs-htag meas">Measurement</span>}
                {isSetl && <span className="cs-htag setl">Settlement</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3.4 Leakage management */}
      <h3 className="cs-h2 spaced">Leakage management rules</h3>
      <p className="cd-help" style={{ marginBottom: 14 }}>
        Define how out-of-network care utilisation is tracked and what automated
        action triggers when the threshold is breached.
      </p>
      <div className="cs-leak-grid">
        <div className="cs-field">
          <label>Leakage threshold</label>
          <div className="cs-num-input">
            <input
              type="number"
              value={setup.leakageThreshold || 15}
              min={0}
              max={100}
              onChange={(e) => set({ leakageThreshold: +e.target.value })}
            />
            <span className="sfx">% of total care</span>
          </div>
          <p className="cd-help">
            Trigger action when out-of-network allowed costs exceed this % of
            total costs in the settlement period.
          </p>
        </div>
        <div className="cs-field">
          <label>Action on threshold breach</label>
          <select
            className="cd-select"
            value={setup.leakageAction || "flag"}
            onChange={(e) => set({ leakageAction: e.target.value })}
          >
            {LEAKAGE_ACTIONS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
          <p className="cd-help">
            Automated response applied when the leakage rate exceeds the
            threshold in any settlement period.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CSProviderGroup;
