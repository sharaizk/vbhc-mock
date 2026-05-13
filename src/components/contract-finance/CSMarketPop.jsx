// Session 5 — CSMarketPop.jsx — Section 2: Market & Population Definition
import React from "react";
import { Icons } from "../Icons/Icons";
import { KSA_REGIONS, POP_SEGMENTS } from "@/mock/contract-designer";

const BIZ_LINES = [
  { id: "military_mod", label: "Military MOD" },
  { id: "commercial", label: "Commercial" },
  { id: "medicare", label: "Medicare" },
  { id: "medicaid", label: "Medicaid" },
  { id: "gcc_gov", label: "Government Employee GCC" },
];

export default function CSMarketPop({ setup, set }) {
  const regions = KSA_REGIONS || [];
  const segments = POP_SEGMENTS || [];
  const icons = Icons;
  const selRegion = regions.find((r) => r.id === setup.geoScopeRegion);

  const toggleSeg = (id) => {
    const cur = setup.popSegments || [];
    set({
      popSegments: cur.includes(id)
        ? cur.filter((x) => x !== id)
        : [...cur, id],
    });
  };

  return (
    <div data-screen-label="CS2 Market & Population">
      {/* 2.1 Business line */}
      <h3 className="cs-h2">Business line</h3>
      <div className="cs-grid-2">
        <div className="cs-field">
          <label>Business line</label>
          <select
            className="cd-select"
            value={setup.businessLine || "military_mod"}
            onChange={(e) => set({ businessLine: e.target.value })}
          >
            {BIZ_LINES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
          <p className="cd-help">
            Defines the regulatory and benefit design context for this contract.
          </p>
        </div>
        <div className="cs-field">
          <label>Market segment code</label>
          <input
            className="cd-input"
            value={`${(setup.businessLine || "military_mod").toUpperCase().replace(/_/g, "-")}-MOD-2026`}
            disabled
            style={{ fontFamily: "var(--font-mono)", letterSpacing: ".04em" }}
          />
          <p className="cd-help">
            Auto-generated from business line and contract year. Locked at
            creation.
          </p>
        </div>
      </div>

      {/* 2.2 Geographic scope */}
      <h3 className="cs-h2 spaced">Geographic scope</h3>
      <div className="cs-grid-3">
        <div className="cs-field">
          <label>Region</label>
          <select
            className="cd-select"
            value={setup.geoScopeRegion || "national"}
            onChange={(e) =>
              set({ geoScopeRegion: e.target.value, geoScopeCity: "" })
            }
          >
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="cs-field">
          <label>City / District</label>
          <select
            className="cd-select"
            value={setup.geoScopeCity || ""}
            onChange={(e) => set({ geoScopeCity: e.target.value })}
            disabled={!selRegion?.cities?.length}
          >
            <option value="">
              {selRegion?.cities?.length
                ? "All cities in region"
                : "National scope"}
            </option>
            {(selRegion?.cities || []).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <p className="cd-help">
            Narrow to a specific city within the selected region.
          </p>
        </div>
        <div className="cs-field">
          <label>Eligible member count</label>
          <div className="cs-num-wrap">
            <input
              type="number"
              className="cd-input"
              value={setup.eligibleMembers || 0}
              onChange={(e) => set({ eligibleMembers: +e.target.value })}
              style={{ fontFamily: "var(--font-mono)", flex: 1 }}
            />
            <span className="cs-num-suf">lives</span>
          </div>
          <p className="cd-help">Total attributed lives in geographic scope.</p>
        </div>
      </div>

      {/* 2.3 Population segments */}
      <h3 className="cs-h2 spaced">Population segment</h3>
      <p className="cd-help" style={{ marginBottom: 12 }}>
        Select one or more population cohorts covered by this contract.
        Multi-select is supported.
      </p>
      <div className="cs-seg-grid">
        {segments.map((s) => {
          const on = (setup.popSegments || []).includes(s.id);
          return (
            <div
              key={s.id}
              className={"cs-seg-chip" + (on ? " on" : "")}
              onClick={() => toggleSeg(s.id)}
            >
              <span className="cc">{icons.check}</span>
              {s.label}
            </div>
          );
        })}
      </div>
      {(setup.popSegments || []).length > 0 && (
        <p className="cs-seg-summary">
          {(setup.popSegments || []).length} segment
          {(setup.popSegments || []).length > 1 ? "s" : ""} selected ·{" "}
          {(setup.popSegments || [])
            .map((id) => segments.find((s) => s.id === id)?.label)
            .filter(Boolean)
            .join(", ")}
        </p>
      )}

      {/* 2.4 Benefit design */}
      <h3 className="cs-h2 spaced">Benefit design</h3>
      <p className="cd-help" style={{ marginBottom: 14 }}>
        Structured cost-sharing parameters applied to this enrolled population
        under the contract.
      </p>
      <div className="cs-benefit-grid">
        <div className="cs-field">
          <label>Copay per visit</label>
          <div className="cs-num-input">
            <span className="pfx">SAR</span>
            <input
              type="number"
              value={setup.copay ?? 0}
              min={0}
              onChange={(e) => set({ copay: +e.target.value })}
            />
          </div>
          <p className="cd-help">
            Fixed amount per outpatient encounter, after deductible is met.
          </p>
        </div>
        <div className="cs-field">
          <label>Coinsurance</label>
          <div className="cs-num-input">
            <input
              type="number"
              value={setup.coinsurance ?? 10}
              min={0}
              max={100}
              onChange={(e) => set({ coinsurance: +e.target.value })}
            />
            <span className="sfx">%</span>
          </div>
          <p className="cd-help">
            Member cost-share as % of allowed amount after deductible.
          </p>
        </div>
        <div className="cs-field">
          <label>Annual deductible</label>
          <div className="cs-num-input">
            <span className="pfx">SAR</span>
            <input
              type="number"
              value={setup.deductible ?? 0}
              min={0}
              onChange={(e) => set({ deductible: +e.target.value })}
            />
          </div>
          <p className="cd-help">
            Individual annual deductible before plan benefits apply.
          </p>
        </div>
        <div className="cs-field">
          <label>Annual OOP maximum</label>
          <div className="cs-num-input">
            <span className="pfx">SAR</span>
            <input
              type="number"
              value={setup.annualOopMax ?? 5000}
              min={0}
              onChange={(e) => set({ annualOopMax: +e.target.value })}
            />
          </div>
          <p className="cd-help">
            Cap on each member's annual out-of-pocket cost exposure.
          </p>
        </div>
      </div>

      <div className="cs-benefit-summary">
        {[
          ["Copay", `SAR ${setup.copay || 0} per visit`],
          ["Coinsurance", `${setup.coinsurance ?? 10}%`],
          ["Deductible", `SAR ${(setup.deductible || 0).toLocaleString()}`],
          ["OOP max", `SAR ${(setup.annualOopMax || 5000).toLocaleString()}`],
        ].map(([k, v]) => (
          <div key={k} className="bs-row">
            <span>{k}</span>
            <strong>{v}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
