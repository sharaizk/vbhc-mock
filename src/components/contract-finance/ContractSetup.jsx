"use client";
// Session 5 — ContractSetup.jsx
// Four-section contract setup wizard: HCP-LAN → Market → Provider Group → Value Profile
import { DRAFT_SETUP, HCP_LAN, KSA_REGIONS, PROV_GROUP_TYPES } from "@/mock/contract-designer";
import React from "react";
import CSMarketPop from "./CSMarketPop";
import CSProviderGroup from "./CSProviderGroup";
import CSValueProfile from "./CSValueProfile";
const { useState, useCallback: csUseCallback } = React;

const CS_SECTIONS = [
  {
    id: "type",
    num: "1",
    title: "Contract Type",
    sub: "HCP-LAN payment archetype",
    help: "Classify the contract using the HCP-LAN Alternative Payment Model framework. The category determines available payment mechanics and downstream configuration.",
  },
  {
    id: "market",
    num: "2",
    title: "Market & Population",
    sub: "Business line · Geography · Members",
    help: "Define the market context, geographic scope, enrolled population segments, and member-facing benefit design (copay, coinsurance, deductible).",
  },
  {
    id: "network",
    num: "3",
    title: "Provider Group",
    sub: "Network · Hierarchy · Leakage",
    help: "Specify the provider group type, build the network composition (PCPs, specialists, facilities, ancillaries), configure sub-group hierarchy, and set leakage rules.",
  },
  {
    id: "value",
    num: "4",
    title: "Value Profile",
    sub: "Dimensions · Weights · Measures",
    help: "Select active value dimensions (D1–D10), allocate weights (must sum to 100%), configure gate dimensions, and set per-measure thresholds, methodology, and mode.",
  },
];

const CS_ICONS = {
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="5 12 10 17 19 8" />
    </svg>
  ),
  arrow: (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  arrowL: (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  info: (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  plus: (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  trash: (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  chev: (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  spark: (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
    </svg>
  ),
};

const BIZ_LINE_LABELS = {
  military_mod: "Military MOD",
  commercial: "Commercial",
  medicare: "Medicare",
  medicaid: "Medicaid",
  gcc_gov: "Govt Employee GCC",
};

/* ── Left summary rail ──────────────────────────────────────────────────── */
function CSRail({ setup, section, onSection }) {
  const cats = HCP_LAN || [];
  const selCats = (setup.lanCategories || [])
    .map((id) => cats.find((c) => c.id === id))
    .filter(Boolean);
  const dw = setup.dimWeights || {};
  const dimCount = Object.keys(dw).length;
  const weightSum = Object.values(dw).reduce((a, b) => a + b, 0);
  const curIdx = CS_SECTIONS.findIndex((s) => s.id === section);

  const issues = [];
  if (!(setup.lanCategories || []).length) issues.push("contract type");
  if (!(setup.popSegments || []).length) issues.push("population");
  if (dimCount && weightSum !== 100) issues.push("weight Σ≠100");

  const rows = [
    [
      "Type",
      selCats.length ? selCats.map((c) => `Cat. ${c.code}`).join(" + ") : "—",
      "",
    ],
    ["Business", BIZ_LINE_LABELS[setup.businessLine] || "—", ""],
    [
      "Geography",
      (
        (KSA_REGIONS || []).find((r) => r.id === setup.geoScopeRegion)
          ?.name || ""
      ).split(" — ")[0] || "—",
      "",
    ],
    ["Members", (setup.eligibleMembers || 0).toLocaleString(), ""],
    [
      "Prov. group",
      (PROV_GROUP_TYPES || []).find((t) => t.id === setup.provGroupType)
        ?.code || "—",
      "",
    ],
    ["Facilities", (setup.networkFacilities || []).length + " in-network", ""],
    ["Dimensions", dimCount + " active", ""],
    [
      "Weight Σ",
      weightSum + "%",
      weightSum === 100 ? "ok" : dimCount ? "warn" : "",
    ],
    [
      "Issues",
      issues.length ? `${issues.length} open` : "ready",
      issues.length ? "warn" : "ok",
    ],
  ];

  return (
    <aside className="cs-rail">
      <div className="cs-rail-top">
        <span className="draft-pill">Setup</span>
        <span className="id-mono">{setup.id}</span>
      </div>
      <div className="cs-rail-summary">
        {rows.map(([lbl, val, cls]) => (
          <div key={lbl} className="sr-row">
            <span className="lbl">{lbl}</span>
            <span className={"val " + (cls || "")}>{val}</span>
          </div>
        ))}
      </div>
      <div className="cs-stepnav">
        {CS_SECTIONS.map((s, i) => {
          const done = i < curIdx;
          const active = s.id === section;
          return (
            <div
              key={s.id}
              className={
                "cs-step" + (active ? " on" : "") + (done ? " done" : "")
              }
              onClick={() => onSection(s.id)}
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
                    {CS_ICONS.check}
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
    </aside>
  );
}

/* ── Section 1 — HCP-LAN Contract Type Classifier ──────────────────────── */
const RISK_COLORS = [
  "oklch(0.58 0.04 220)",
  "oklch(0.60 0.12 145)",
  "oklch(0.60 0.14 200)",
  "oklch(0.60 0.15 60)",
  "oklch(0.58 0.19 30)",
  "oklch(0.52 0.22 22)",
];

function SectionType({ setup, set }) {
  const cats = HCP_LAN || [];

  const toggle = (id) => {
    const cur = setup.lanCategories || [];
    if (setup.hybridMode) {
      set({
        lanCategories: cur.includes(id)
          ? cur.filter((x) => x !== id)
          : [...cur, id],
      });
    } else {
      set({ lanCategories: cur[0] === id ? [] : [id] });
    }
  };

  const selCats = (setup.lanCategories || [])
    .map((id) => cats.find((c) => c.id === id))
    .filter(Boolean);
  const needsAPM = (setup.lanCategories || []).some((id) =>
    ["cat3a", "cat3b", "cat4"].includes(id),
  );

  return (
    <div data-screen-label="CS1 Contract Type">
      <p className="cd-help" style={{ marginBottom: 18 }}>
        Select a payment category from the HCP-LAN Alternative Payment Model
        Framework. Your selection stores the archetype in state and drives
        downstream configuration requirements. Enable Hybrid mode to blend two
        adjacent categories.
      </p>

      <div className="cs-hybrid-row">
        <div
          className={"cs-toggle" + (setup.hybridMode ? " on" : "")}
          role="switch"
          onClick={() =>
            set({ hybridMode: !setup.hybridMode, lanCategories: [] })
          }
        >
          <span className="knob" />
        </div>
        <span className="cs-toggle-lbl">
          Hybrid model selection
          <span className="cs-toggle-hint">
            {" "}
            — blend two adjacent HCP-LAN categories for complex contracting
            arrangements
          </span>
        </span>
      </div>

      <div className="cs-lan-grid">
        {cats.map((cat, i) => {
          const on = (setup.lanCategories || []).includes(cat.id);
          const color = RISK_COLORS[i] || RISK_COLORS[0];
          return (
            <div
              key={cat.id}
              className={"cs-lan-card" + (on ? " on" : "")}
              style={{ "--lc": color }}
              onClick={() => toggle(cat.id)}
            >
              <div className="lc-head">
                <span className="lc-badge">Category {cat.code}</span>
                <div
                  className="lc-risk"
                  title={`Risk level ${cat.riskLevel} / 5`}
                >
                  {[0, 1, 2, 3, 4, 5].map((n) => (
                    <span
                      key={n}
                      className={"rb" + (n <= cat.riskLevel ? " fill" : "")}
                    />
                  ))}
                </div>
                {on && <span className="lc-check">{CS_ICONS.check}</span>}
              </div>
              <div className="lc-name">{cat.name}</div>
              <div className="lc-rows">
                <div className="lc-r">
                  <span>Model type</span>
                  <strong>{cat.modelType}</strong>
                </div>
                <div className="lc-r">
                  <span>Mechanism</span>
                  <strong>{cat.mechanism}</strong>
                </div>
                <div className="lc-r risk">
                  <span>Risk direction</span>
                  <strong>{cat.riskDir}</strong>
                </div>
                <div className="lc-r eg">
                  <span>Example</span>
                  <em>{cat.example}</em>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selCats.length > 0 && (
        <div className="cs-info-banner">
          {CS_ICONS.info}
          <div>
            <strong>
              {selCats.length > 1 ? "Hybrid model" : "Model"} selected:
            </strong>{" "}
            {selCats.map((c) => c.name).join(" + ")}.
            {needsAPM &&
              " APM categories (3A, 3B, 4) require a value profile (Section 4) with quality gate configuration and risk corridor settings."}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── ContractSetup root ─────────────────────────────────────────────────── */
function ContractSetup() {
  const [setup, setSetup] = useState(
    () =>
      DRAFT_SETUP || {
        id: "CS-DRAFT-001",
        lanCategories: ["cat3a"],
        hybridMode: false,
        businessLine: "military_mod",
        geoScopeRegion: "national",
        geoScopeCity: "",
        popSegments: ["officers", "enlisted", "dep_spouse", "dep_child"],
        eligibleMembers: 184500,
        copay: 0,
        coinsurance: 10,
        deductible: 0,
        annualOopMax: 5000,
        provGroupType: "mod_net",
        networkFacilities: ["FAC-101", "FAC-105"],
        subgroupMeasurementLevel: "facility",
        subgroupSettlementLevel: "network",
        leakageThreshold: 15,
        leakageAction: "flag",
        dimWeights: { D1: 22, D2: 14, D5: 20, D7: 18, D3: 8, D4: 8, D8: 10 },
        gates: {},
        measureConfig: {},
        benchmarkType: "national",
        riskCorridorEnabled: true,
        riskCorridorFloor: 10,
        riskCorridorCeiling: 10,
      },
  );
  const [section, setSection] = useState("type");
  const set = csUseCallback(
    (patch) => setSetup((s) => ({ ...s, ...patch })),
    [],
  );

  const idx = CS_SECTIONS.findIndex((s) => s.id === section);
  const cur = CS_SECTIONS[idx];
  const prev = idx > 0 ? CS_SECTIONS[idx - 1] : null;
  const next = idx < CS_SECTIONS.length - 1 ? CS_SECTIONS[idx + 1] : null;

  // Resolve sub-section components safely (window.X starts lowercase so must alias)
  const MarketComp = CSMarketPop || null;
  const NetworkComp = CSProviderGroup || null;
  const ValueComp = CSValueProfile || null;

  return (
    <div className="cs-page" data-screen-label="05-CS Contract Setup">
      <CSRail setup={setup} section={section} onSection={setSection} />
      <section className="cs-canvas">
        <header className="cs-canvas-head">
          <div>
            <div className="crumb">
              Contract Management · Contract Setup · Step {cur.num} of{" "}
              {CS_SECTIONS.length}
            </div>
            <h1>{cur.title}</h1>
            <p className="desc">{cur.help}</p>
          </div>
          <div className="step-counter">
            {idx + 1} / {CS_SECTIONS.length}
          </div>
        </header>

        <div className="cs-canvas-body">
          {section === "type" && <SectionType setup={setup} set={set} />}
          {section === "market" && MarketComp && (
            <MarketComp setup={setup} set={set} />
          )}
          {section === "network" && NetworkComp && (
            <NetworkComp setup={setup} set={set} />
          )}
          {section === "value" && ValueComp && (
            <ValueComp setup={setup} set={set} />
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
              Auto-saved · {setup.id}
            </span>
          </div>
          <div className="right">
            {prev ? (
              <button className="cd-btn" onClick={() => setSection(prev.id)}>
                {CS_ICONS.arrowL} {prev.title}
              </button>
            ) : (
              <button className="cd-btn" disabled>
                {CS_ICONS.arrowL} Back
              </button>
            )}
            <button className="cd-btn">Save draft</button>
            {next ? (
              <button
                className="cd-btn primary"
                onClick={() => setSection(next.id)}
              >
                Next · {next.title} {CS_ICONS.arrow}
              </button>
            ) : (
              <button className="cd-btn primary">
                Finalise setup {CS_ICONS.arrow}
              </button>
            )}
          </div>
        </footer>
      </section>
    </div>
  );
}

export default ContractSetup;
export { SectionType };
