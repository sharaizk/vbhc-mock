/* ============================================================================
   Session 5 — Contract Designer Part 1
   Synthetic catalogue for the design wizard:
   • Contract types (5)
   • Performance-period cadences
   • Risk-adjustment models (referenced lightly here, fully wired in Part 2)
   • Initial draft contract (CT-DRAFT) the wizard starts editing
   • Five archetype templates the user can clone as a starting point
   ============================================================================ */

const CONTRACT_TYPES = [
  {
    id: "ffs",
    code: "FFS",
    name: "Fee-for-service + quality bonus",
    blurb:
      "Traditional volume payment with a small performance bonus on top. A common stepping-stone away from pure FFS.",
    weights: { D5: 30, D3: 25, D4: 15, D6: 15, D8: 15 },
  },
  {
    id: "shared",
    code: "SHARED",
    name: "Shared savings",
    blurb:
      "Provider keeps a percentage of total-cost-of-care savings if quality thresholds are met. Two-sided variants share losses too.",
    weights: { D1: 22, D2: 12, D5: 18, D3: 10, D4: 8, D7: 22, D8: 8 },
  },
  {
    id: "bundle",
    code: "BUNDLE",
    name: "Bundled / episode payment",
    blurb:
      "Single price covers a full episode (e.g. hip arthroplasty index admission + 90-day follow-up). Provider absorbs variation.",
    weights: { D1: 30, D2: 15, D3: 15, D5: 15, D7: 25 },
  },
  {
    id: "cap",
    code: "CAP",
    name: "Capitation (PMPM)",
    blurb:
      "Fixed per-member-per-month payment for the attributed panel. Strong incentive for prevention and access.",
    weights: { D1: 18, D2: 12, D5: 18, D6: 10, D7: 20, D8: 17, D9: 5 },
  },
  {
    id: "global",
    code: "GLOBAL",
    name: "Global budget",
    blurb:
      "Network-level annual budget for the attributed population. Highest-trust mechanic; usually paired with multi-year horizons.",
    weights: {
      D1: 18,
      D2: 10,
      D5: 14,
      D3: 8,
      D4: 8,
      D7: 22,
      D8: 12,
      D9: 4,
      D10: 4,
    },
  },
];

const PERIOD_CADENCES = [
  {
    id: "quarterly",
    label: "Quarterly",
    desc: "4 evaluation windows per year — fast feedback but high settlement overhead.",
  },
  {
    id: "semiannual",
    label: "Semi-annual",
    desc: "2 windows per year — common for shared-savings contracts.",
  },
  {
    id: "annual",
    label: "Annual",
    desc: "1 window per year — appropriate for outcome-heavy mechanics.",
  },
  {
    id: "rolling12",
    label: "Rolling 12-month",
    desc: "Continuously updated 12-month look-back; settlements declared annually.",
  },
];

const RISK_MODELS = [
  {
    id: "rac-mod-2024",
    code: "RAC-MOD-2024",
    name: "MOD Risk-Adjusted Cohort 2024",
    blurb:
      "Age × condition × utiliser-tier cohort cells. Network-default for purchaser-level adherence.",
  },
  {
    id: "hcc-cms-v28",
    code: "HCC-CMS-v28",
    name: "CMS-HCC v28 (calibrated to MOD panel)",
    blurb:
      "Standard CMS hierarchical condition categories, recalibrated quarterly to the MOD attributed population.",
  },
  {
    id: "ichom-casemix",
    code: "ICHOM-CASEMIX",
    name: "ICHOM case-mix",
    blurb:
      "Per-Set case-mix variables drive per-outcome adjustment. Recommended for outcome-heavy contracts (D1).",
  },
];

/* ----- Five archetype templates the wizard can clone --------------------- */
const TEMPLATES = [
  {
    id: "T-1",
    name: "Diabetes & Depression — primary care",
    type: "shared",
    purchaser: "ORG-001",
    providers: ["PRV-1008", "PRV-1009", "PRV-1010", "PRV-1101", "PRV-1401"],
    facilities: ["FAC-101", "FAC-102", "FAC-105"],
    sets: ["ICHOM-006", "ICHOM-017"],
    weights: { D1: 22, D2: 14, D5: 20, D7: 18, D3: 8, D4: 8, D8: 10 },
    thresholds: { "M-D05-004": { floor: 50, target: 65, stretch: 75 } },
    cadence: "semiannual",
    risk: "ichom-casemix",
    summary:
      "Endocrine + mental-health bundle for the active-duty primary-care panel; PHQ-9 driven cross-Set reasoning.",
  },
  {
    id: "T-2",
    name: "Hip & Knee OA — surgical bundle",
    type: "bundle",
    purchaser: "ORG-001",
    providers: ["PRV-1018", "PRV-1019", "PRV-1104", "PRV-1204"],
    facilities: ["FAC-101", "FAC-102", "FAC-103"],
    sets: ["ICHOM-021"],
    weights: { D1: 30, D2: 15, D3: 15, D5: 15, D7: 25 },
    thresholds: {},
    cadence: "quarterly",
    risk: "rac-mod-2024",
    summary:
      "90-day episode bundle covering primary THA/TKA. PROM-heavy (Oxford/KOOS-PS) with safety guard rail.",
  },
  {
    id: "T-3",
    name: "Maternal — pregnancy & newborn",
    type: "bundle",
    purchaser: "ORG-001",
    providers: [],
    facilities: ["FAC-101", "FAC-102"],
    sets: ["ICHOM-040"],
    weights: { D1: 28, D2: 14, D3: 18, D5: 18, D7: 12, D9: 10 },
    thresholds: {},
    cadence: "annual",
    risk: "ichom-casemix",
    summary:
      "Pregnancy + postnatal bundle. Equity stratification on geography is binding (D9 ≥ 10%).",
  },
  {
    id: "T-4",
    name: "Cardiac — coronary artery disease",
    type: "shared",
    purchaser: "ORG-001",
    providers: ["PRV-1001", "PRV-1002", "PRV-1003", "PRV-1404", "PRV-1405"],
    facilities: ["FAC-101", "FAC-105"],
    sets: ["ICHOM-001", "ICHOM-002"],
    weights: { D1: 25, D2: 12, D5: 22, D3: 10, D4: 8, D7: 18, D8: 5 },
    thresholds: {},
    cadence: "quarterly",
    risk: "hcc-cms-v28",
    summary:
      "CAD + heart failure shared-savings. Door-to-balloon and β-blocker compliance are floor measures.",
  },
  {
    id: "T-5",
    name: "Multi-condition — capitated network",
    type: "cap",
    purchaser: "ORG-001",
    providers: [],
    facilities: ["FAC-101", "FAC-102", "FAC-103", "FAC-104", "FAC-105"],
    sets: ["ICHOM-006", "ICHOM-021", "ICHOM-001", "ICHOM-017", "ICHOM-033"],
    weights: { D1: 18, D2: 12, D5: 18, D6: 10, D7: 20, D8: 17, D9: 5 },
    thresholds: {},
    cadence: "annual",
    risk: "rac-mod-2024",
    summary:
      "Multi-Set capitation — a stress test of the value framework. Five Sets, full population-health weighting.",
  },
];

/* ----- Initial draft state the wizard opens with -------------------------- */
const DRAFT = {
  id: "CT-DRAFT-026",
  name: "Diabetes & Depression — primary care 2026",
  description:
    "Performance-based contract for the active-duty and dependent primary-care panel covering Type 2 Diabetes and comorbid Depression & Anxiety. Cross-Set reasoning across PHQ-9 anchors the value profile.",
  type: "shared",
  purchaserId: "ORG-001",
  start: "2026-07-01",
  end: "2028-06-30",
  cadence: "semiannual",
  facilityIds: ["FAC-101", "FAC-105"],
  providerIds: [
    "PRV-1008",
    "PRV-1009",
    "PRV-1010",
    "PRV-1011",
    "PRV-1401",
    "PRV-1402",
    "PRV-1403",
  ],
  setIds: ["ICHOM-006", "ICHOM-017"],
  // value profile — dimension weights (only included dims appear here)
  weights: { D1: 22, D2: 14, D5: 20, D7: 18, D3: 8, D4: 8, D8: 10 },
  // selected measures per dim and their thresholds
  measureIds: [
    "M-D03-001",
    "M-D03-007",
    "M-D04-002",
    "M-D04-003",
    "M-D05-002",
    "M-D05-003",
    "M-D05-004",
    "M-D05-010",
    "M-D07-001",
    "M-D07-005",
    "M-D08-001",
    "M-D08-002",
    "M-D08-010",
  ],
  thresholds: {
    "M-D03-001": { floor: 6.0, target: 4.0, stretch: 2.5 },
    "M-D03-007": { floor: 8.0, target: 5.5, stretch: 3.5 },
    "M-D04-002": { floor: 60, target: 75, stretch: 85 },
    "M-D04-003": { floor: 88, target: 95, stretch: 98 },
    "M-D05-002": { floor: 70, target: 80, stretch: 90 },
    "M-D05-003": { floor: 65, target: 75, stretch: 85 },
    "M-D05-004": { floor: 50, target: 60, stretch: 70 },
    "M-D05-010": { floor: 70, target: 80, stretch: 90 },
    "M-D07-001": { floor: 105, target: 100, stretch: 92 },
    "M-D07-005": { floor: 16, target: 13, stretch: 10 },
    "M-D08-001": { floor: 65, target: 75, stretch: 85 },
    "M-D08-002": { floor: 60, target: 70, stretch: 80 },
    "M-D08-010": { floor: 60, target: 70, stretch: 82 },
  },
};

/* ============================================================================
   ContractSetup — additional data: HCP-LAN, KSA geography, population
   segments, provider group types, and the initial setup draft state.
   ============================================================================ */

const HCP_LAN = [
  {
    id: "cat1",
    code: "1",
    riskLevel: 0,
    name: "Fee-for-Service, No Link to Value",
    modelType: "Volume-based FFS",
    mechanism:
      "Standard claims reimbursement; payment per service unit regardless of quality or outcome",
    riskDir:
      "Purchaser bears all risk · Provider bears no financial risk · No incentive to improve value",
    example:
      "Standard MOD FFS claims for all clinical encounters; no incentive withholds or quality adjustments",
  },
  {
    id: "cat2a",
    code: "2A",
    riskLevel: 1,
    name: "FFS + Foundation Payments for Infrastructure",
    modelType: "FFS + Care Management Supplement",
    mechanism:
      "Per-patient infrastructure payments on top of FFS base; rewards capacity-building, not performance",
    riskDir:
      "Minimal · Purchaser holds clinical risk; provider earns supplement for infrastructure investment",
    example:
      "SAR 120/month care management fee per complex T2DM patient at PSMMC Riyadh to fund diabetes care navigator",
  },
  {
    id: "cat2b",
    code: "2B",
    riskLevel: 2,
    name: "FFS + Quality / Efficiency Bonuses & Penalties",
    modelType: "Pay-for-Performance",
    mechanism:
      "FFS with a quality withhold (3–5%) returned on metric attainment; bonuses for exceeding stretch goals",
    riskDir:
      "Low–moderate · Downside via pay-at-risk withhold; upside via quality bonus above FFS base",
    example:
      "3% quality withhold across MOD network claims — returned on HbA1c ≤7% and PHQ-9 remission targets",
  },
  {
    id: "cat3a",
    code: "3A",
    riskLevel: 3,
    name: "APM Built on FFS — Shared Savings (Upside Only)",
    modelType: "One-Sided Shared Savings",
    mechanism:
      "FFS claims baseline + provider retains a percentage of total-cost savings if quality thresholds met",
    riskDir:
      "Moderate upside · No financial downside · Quality gates mandatory for savings eligibility",
    example:
      "T2DM / Depression shared savings: MOD Network earns 40% of savings above 2% minimum savings rate",
  },
  {
    id: "cat3b",
    code: "3B",
    riskLevel: 4,
    name: "APM Built on FFS — Shared Savings + Risk (Two-Sided)",
    modelType: "Two-Sided Risk / Bundled Payment",
    mechanism:
      "FFS + provider shares savings AND losses; episode-based bundles with fixed prices and risk corridors",
    riskDir:
      "Two-sided · Provider earns upside and absorbs downside within corridor caps",
    example:
      "Hip & Knee OA 90-day surgical bundle at KFMC / NRH: ±10% corridor, two-sided risk activates Year 2",
  },
  {
    id: "cat4",
    code: "4",
    riskLevel: 5,
    name: "Population-Based Payment",
    modelType: "Capitation / Global Budget",
    mechanism:
      "Annual PMPM rate or network-level global budget; FFS billing eliminated or minimized",
    riskDir:
      "High · Provider bears utilisation and cost risk for the full attributed population",
    example:
      "Annual SAR 2.4B global budget for all 5 MOD facilities — 184,500 attributed lives, full risk transfer",
  },
];

const KSA_REGIONS = [
  { id: "national", name: "National — all regions", cities: [] },
  {
    id: "riyadh",
    name: "Riyadh Region",
    cities: [
      "Riyadh (Capital)",
      "Al Kharj",
      "Diriyah",
      "Al-Dawadmi",
      "Majmaah",
      "Zulfi",
      "Afif",
    ],
  },
  {
    id: "makkah",
    name: "Makkah Region",
    cities: ["Jeddah", "Makkah", "Taif", "Rabigh", "Al Qunfudhah", "Ranyah"],
  },
  {
    id: "madinah",
    name: "Madinah Region",
    cities: ["Madinah", "Yanbu", "Al Ula", "Badr", "Al-Henakiyah"],
  },
  {
    id: "eastern",
    name: "Eastern Province",
    cities: [
      "Dammam",
      "Al Khobar",
      "Dhahran",
      "Jubail",
      "Al-Ahsa",
      "Hafar Al-Batin",
      "Abqaiq",
    ],
  },
  {
    id: "asir",
    name: "Asir Region",
    cities: ["Abha", "Khamis Mushait", "Bisha", "Al Namas", "Sarat Abidah"],
  },
  {
    id: "tabuk",
    name: "Tabuk Region",
    cities: ["Tabuk", "Umluj", "Tayma", "Haql", "Duba"],
  },
  {
    id: "hail",
    name: "Hail Region",
    cities: ["Hail", "Al-Ghazalah", "Al-Shinan"],
  },
  {
    id: "najran",
    name: "Najran Region",
    cities: ["Najran", "Sharurah", "Yadamah"],
  },
  {
    id: "jizan",
    name: "Jizan Region",
    cities: ["Jizan", "Sabya", "Abu Arish", "Samtah"],
  },
  {
    id: "aljouf",
    name: "Al-Jouf Region",
    cities: ["Sakaka", "Doumah Al-Jandal", "Al-Qurayyat"],
  },
  {
    id: "baha",
    name: "Al-Baha Region",
    cities: ["Al Baha", "Al Mikhwah", "Baljurashi"],
  },
  {
    id: "qassim",
    name: "Al-Qassim Region",
    cities: ["Buraydah", "Unaizah", "Al-Rass"],
  },
  {
    id: "borders",
    name: "Northern Borders",
    cities: ["Arar", "Rafha", "Turaif", "Al-Uwayqilah"],
  },
];

const POP_SEGMENTS = [
  { id: "officers", label: "Officers (active duty)" },
  { id: "enlisted", label: "Enlisted personnel (active duty)" },
  { id: "dep_spouse", label: "Dependents — Spouse" },
  { id: "dep_child", label: "Dependents — Children (<26 y)" },
  { id: "retirees", label: "Retirees" },
  { id: "ret_dep", label: "Retiree dependents" },
  { id: "civilian", label: "MOD civilian employees" },
  { id: "gcc_exch", label: "GCC nationals (exchange programme)" },
];

const PROV_GROUP_TYPES = [
  {
    id: "mod_net",
    code: "MOD-NET",
    name: "MOD Military Network",
    desc: "Multi-facility military command health network — current operational context",
  },
  {
    id: "ipa",
    code: "IPA",
    name: "Independent Practice Association",
    desc: "Contracted individual physicians sharing administrative and contracting services",
  },
  {
    id: "pho",
    code: "PHO",
    name: "Physician-Hospital Organization",
    desc: "Joint venture between a hospital and affiliated medical staff for shared contracting",
  },
  {
    id: "aco",
    code: "ACO",
    name: "Accountable Care Organization",
    desc: "Collaborative provider group jointly accountable for total cost and quality",
  },
  {
    id: "idfs",
    code: "IDFS",
    name: "Integrated Delivery & Finance System",
    desc: "Single entity owning both insurance functions and care delivery infrastructure",
  },
  {
    id: "hosp_sys",
    code: "HOSP-SYS",
    name: "Hospital System",
    desc: "Multi-facility hospital network contracting as a single provider group",
  },
];

const DRAFT_SETUP = {
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
};
// window.CONTRACT_TYPES = CONTRACT_TYPES;
// window.PERIOD_CADENCES = PERIOD_CADENCES;
// window.RISK_MODELS = RISK_MODELS;
// window.CONTRACT_TEMPLATES = TEMPLATES;
// window.DRAFT_CONTRACT = DRAFT;

// window.SETS = window.ICHOM_SETS || [];
// window.FAMILIES = window.ICHOM_FAMILIES || [];

/* Session 5B — finance-data.js
   Synthetic data: PSMMC Riyadh primary care — Diabetes T2 + Depression & Anxiety
   47,000 MOD beneficiaries | Baseline PMPM SAR 3,112 */

const ATTRIBUTION_METHODS = [
  {
    id: "voluntary",
    code: "VA",
    name: "Voluntary Alignment",
    logic:
      "Patient explicitly nominates a provider or provider group as their accountable care team via the MOD patient portal or in-person registration.",
    bestFor:
      "High-engagement populations and ACO-like settings. MOD recommended — supports shared accountability with documented patient consent.",
    badge: "Recommended",
  },
  {
    id: "prospective",
    code: "PP",
    name: "Prospective Panel Assignment",
    logic:
      "Patients assigned to a provider based on their designated PCP registration at the start of the performance period. Attribution locked prospectively.",
    bestFor:
      "Military settings with roster-based enrollment; clear provider accountability; minimal attribution churn during the period.",
    badge: "Standard",
  },
  {
    id: "retrospective",
    code: "RP",
    name: "Retrospective Plurality",
    logic:
      "Attribution determined by the provider who delivered the plurality of primary-care E&M visits during the lookback period. No pre-assignment required.",
    bestFor:
      "Open-access settings without formal PCP registration; commonly used in CMS ACO and MSSP programmes.",
    badge: "Common",
  },
  {
    id: "episode",
    code: "EB",
    name: "Episode-Based Attribution",
    logic:
      "Patients attributed to the initiating provider for a defined care episode (e.g., DM management cycle, hip OA bundle). Attribution is condition-specific.",
    bestFor:
      "Bundled payment contracts; condition-specific programmes with clear episode start and end events. Strong alignment to ICHOM Sets.",
    badge: "Condition-specific",
  },
  {
    id: "geographic",
    code: "GEO",
    name: "Geographic / Garrison Assignment",
    logic:
      "Attribution based on patients' registered military garrison or geographic health zone. Facility serves as the accountable unit.",
    bestFor:
      "MOD settings with defined garrison populations; contracts covering geographically bounded beneficiary groups.",
    badge: "Military",
  },
  {
    id: "hybrid",
    code: "HYB",
    name: "Hybrid Multi-Signal",
    logic:
      "Combines voluntary alignment (primary signal), retrospective plurality (tie-breaker), and geographic assignment (fallback) with configurable signal weights.",
    bestFor:
      "Complex networks with mixed enrollment types. Highest attribution accuracy but requires IT sophistication and clean data infrastructure.",
    badge: "Advanced",
  },
];

const BENCHMARK_METHODS = [
  {
    id: "historical",
    name: "Historical Cost Trend",
    desc: "Provider's own 3-year historical cost baseline, trended forward using actuarial factors. Best for established programmes with a clean data history and low population churn.",
  },
  {
    id: "regional",
    name: "Regional Reference Benchmark",
    desc: "GCC / MENA regional cost benchmark index derived from comparable payer and public datasets. Adjusts for local market variation. Requires external data partnership.",
  },
  {
    id: "book_of_biz",
    name: "Book-of-Business Reference",
    desc: "Purchaser's overall enrolled population used as the reference cohort. Eliminates external data dependency but susceptible to portfolio-wide adverse trends.",
  },
  {
    id: "blended",
    name: "Blended (Historical + Regional)",
    desc: "Weighted combination of the provider's historical trend (70%) and the regional index (30%). Recommended for MOD — balances own experience with external calibration.",
  },
  {
    id: "actuarial",
    name: "Actuarially-Set Benchmark",
    desc: "Independent actuarial projection developed specifically for this contract. Most rigorous; requires 60–90 day engagement with external actuarial firm. Reserve for high-stakes global budget contracts.",
  },
];

const RISK_ADJ_MODELS = [
  {
    id: "hcc",
    code: "CMS-HCC",
    name: "CMS Hierarchical Condition Categories (v28)",
    methodology:
      "ICD-10 diagnoses mapped to HCCs; hierarchical structure suppresses less-severe conditions when more-severe conditions present. Risk score = demographics × HCC multiplier product.",
    application:
      "Total cost benchmarking; strongest for cost prediction across mixed populations. Calibrated to MOD panel using 2 years of claims history.",
    syntheticScore: 1.34,
  },
  {
    id: "acg",
    code: "ACG-JH",
    name: "Adjusted Clinical Groups — Johns Hopkins",
    methodology:
      "Aggregates all diagnoses into Aggregated Diagnosis Groups → Major ADGs → Expanded Diagnosis Clusters → ACGs. Captures total care burden holistically across all conditions.",
    application:
      "Population segmentation; strong for chronic disease management programmes. Widely validated outside the US; does not require ICD to CMS crosswalk.",
    syntheticScore: 1.28,
  },
  {
    id: "ichom",
    code: "ICHOM-CM",
    name: "ICHOM Case-Mix Adjustment",
    methodology:
      "Per-Set case-mix variables (BMI, baseline HbA1c, comorbidities, duration of illness, socioeconomic factors) applied as regression coefficients to risk-adjust outcome scores.",
    application:
      "Clinical outcome risk adjustment (D1, D2). Recommended for outcome-heavy contracts. Separate from cost risk adjustment — use in combination with HCC for cost.",
    syntheticScore: 1.19,
  },
  {
    id: "rx",
    code: "RxRisk",
    name: "Pharmacy-Based Risk (RxRisk / DxGroups)",
    methodology:
      "Drug therapy classes used as proxies for diagnosed conditions; fills diagnostic-coding gaps where ICD coding is incomplete. Cross-referenced with clinical EMR data for validation.",
    application:
      "Concurrent risk adjustment; useful when EMR diagnostic coding is immature. MOD pharmacy data quality is high — strong signal for chronic disease burden.",
    syntheticScore: 1.22,
  },
  {
    id: "custom",
    code: "CUSTOM",
    name: "Custom / Blended Model",
    methodology:
      "Contract-specific combination of HCC (for cost) + ICHOM case-mix (for clinical outcomes); weights configured by the purchaser's actuarial team. Requires calibration run against 2+ years of historical data.",
    application:
      "Recommended for complex contracts with both cost and clinical outcome dimensions. Allows the most precise risk adjustment across D1–D7. MOD preferred approach.",
    syntheticScore: 1.31,
  },
];

/* ── Scenario pre-calculations ──────────────────────────────────────────── */
const AB = 47000 * 3112 * 12; // SAR 1,755,168,000 annual baseline
const MSR = AB * 0.02; // 2% minimum savings rate
const QBP = Math.round(AB * 0.03); // quality bonus pool = SAR 52,655,040

const SCENARIOS = {
  optimistic: {
    label: "Optimistic",
    colorKey: "green",
    note: "Provider hits stretch targets — HbA1c <7% in 68% of panel, PHQ-9 remission 62%, TCOC 5.2% below benchmark.",
    tcoc: Math.round(AB * 0.948),
    savingsVsBench: Math.round(AB * 0.052),
    providerSavings: Math.round((AB * 0.052 - MSR) * 0.4),
    qualityBonus: Math.round(QBP * 1.0),
    withholdReleased: Math.round(AB * 0.03 * 1.0),
    netProvider: 0,
    netPurchaser: 0,
  },
  baseline: {
    label: "Baseline",
    colorKey: "amber",
    note: "Provider meets most targets — HbA1c <7% in 58%, PHQ-9 remission 48%, TCOC 2.8% below benchmark.",
    tcoc: Math.round(AB * 0.972),
    savingsVsBench: Math.round(AB * 0.028),
    providerSavings: Math.round((AB * 0.028 - MSR) * 0.4),
    qualityBonus: Math.round(QBP * 0.72),
    withholdReleased: Math.round(AB * 0.03 * 0.72),
    netProvider: 0,
    netPurchaser: 0,
  },
  pessimistic: {
    label: "Pessimistic",
    colorKey: "red",
    note: "Provider misses floor on diabetes control and care access — below MSR threshold, minimal quality bonus.",
    tcoc: Math.round(AB * 1.018),
    savingsVsBench: -Math.round(AB * 0.018), // negative = loss (one-sided: no penalty)
    providerSavings: 0,
    qualityBonus: Math.round(QBP * 0.18),
    withholdReleased: Math.round(AB * 0.03 * 0.18),
    netProvider: 0,
    netPurchaser: 0,
  },
};

// Net impacts
(function () {
  const s = SCENARIOS;
  s.optimistic.netProvider =
    s.optimistic.providerSavings + s.optimistic.qualityBonus;
  s.optimistic.netPurchaser =
    s.optimistic.savingsVsBench - s.optimistic.netProvider;
  s.baseline.netProvider = s.baseline.providerSavings + s.baseline.qualityBonus;
  s.baseline.netPurchaser = s.baseline.savingsVsBench - s.baseline.netProvider;
  s.pessimistic.netProvider = s.pessimistic.qualityBonus;
  s.pessimistic.netPurchaser =
    s.pessimistic.savingsVsBench - s.pessimistic.netProvider;
})();

/* ── PMPM age/gender bands (default capitation table) ───────────────────── */
const DEFAULT_PMPM_BANDS = [
  { band: "<5 yrs", pmpm: 950 },
  { band: "5–17 yrs", pmpm: 1100 },
  { band: "18–44 M", pmpm: 2200 },
  { band: "18–44 F", pmpm: 2850 },
  { band: "45–64 M", pmpm: 3900 },
  { band: "45–64 F", pmpm: 3600 },
  { band: "65+ M", pmpm: 5200 },
  { band: "65+ F", pmpm: 4900 },
];

/* ── Payment mechanics map by LAN category ──────────────────────────────── */
const PAYMENT_MECHANICS_BY_CAT = {
  cat1: ["quality_bonus"],
  cat2a: ["shared_savings", "quality_bonus", "care_mgmt_fee"],
  cat2b: ["withhold", "quality_bonus"],
  cat3a: ["shared_savings", "quality_bonus", "care_mgmt_fee"],
  cat3b: ["shared_savings", "shared_losses", "quality_bonus", "withhold"],
  cat4: ["capitation", "quality_bonus", "bundled", "care_mgmt_fee"],
};

/* ── Draft finance state ─────────────────────────────────────────────────── */
const DRAFT_FINANCE = {
  id: "CF-DRAFT-001",
  // Steps a–d (inherited from ContractSetup session 5)
  ...((typeof window !== "undefined" && DRAFT_SETUP) || {}),

  // Step e — Attribution
  attributionMethod: "voluntary",
  lookbackPeriod: 12,
  minVisitThreshold: 2,
  attributionRefreshCycle: "quarterly",
  optInEnabled: true,
  optInRule:
    "Patient nominates provider via MOD patient portal or in-person at facility. Active duty personnel default to garrison-assigned PCP unless voluntarily aligned to a different provider.",
  reconciliationRule: "changes_prospective",

  // Step f — Financial model
  benchmarkMethodology: "blended",
  baselineStart: "2024-01-01",
  baselineEnd: "2024-12-31",
  runOutPeriod: 6,
  medicalUnitCostTrend: 6.2,
  medicalUtilTrend: 1.8,
  pharmacyUnitCostTrend: 8.1,
  pharmacyUtilTrend: 2.4,
  riskScoreNorm: true,
  minimumSavingsRate: 2.0,
  symmetricMSR: true,

  // Shared savings
  sharedSavingsTiers: [
    { from: 2, to: 4, providerPct: 40 },
    { from: 4, to: 7, providerPct: 50 },
    { from: 7, to: null, providerPct: 60 },
  ],
  ssQualityGate: true,
  ssMaxCapSAR: 140000000,

  // Shared losses
  lossSharing: 40,
  stopLossSAR: 70000000,
  firstDollarLoss: false,
  phaseIn: "year2",

  // Quality bonus pool
  qbpFunding: "withhold",
  qbpDistribution: "proportional",
  qbpCalcMethod: "composite",

  // Withhold
  withholdPct: 3.0,
  withholdPartialRelease: true,
  withholdForfeiture: "quality",

  // Capitation
  pmpmBands: [...DEFAULT_PMPM_BANDS],
  capRiskAdj: true,
  capCarveOuts: ["pharmacy", "behavioral_health"],

  // Bundled
  bundleDRG: "470",
  bundleWindowDays: 90,
  bundleTargetSAR: 45000,
  bundleOutlierPct: 2.5,
  bundleGainshare: 60,

  // Care management fee
  cMgmtPMPM: 120,
  cMgmtTimeLimited: false,
  cMgmtDurationMo: 24,

  // Corridor bands
  corridorBands: [
    { from: 0, to: 2, provPct: 0, purchPct: 100, label: "Below MSR" },
    { from: 2, to: 4, provPct: 40, purchPct: 60, label: "Zone 1" },
    { from: 4, to: 7, provPct: 50, purchPct: 50, label: "Zone 2" },
    { from: 7, to: null, provPct: 60, purchPct: 40, label: "Zone 3" },
  ],
  stopLossThreshold: 15,

  // Step g — Custom scenario sliders
  customSliders: { D1: 65, D2: 60, D5: 70, D7: 55, D3: 75, D4: 65, D8: 60 },

  // Step h — Risk adjustment
  riskAdjModel: "custom",
  riskCalcMode: "prospective",
  riskNormEnabled: true,
  auditTrail: true,
  separateCostQuality: true,
  costRiskModel: "hcc",
  qualityRiskModel: "ichom",
};

const FINANCE_BASELINE_DATA = { AB, MSR, QBP, pmpm: 3112, lives: 47000 };

export {
  CONTRACT_TYPES,
  PERIOD_CADENCES,
  RISK_MODELS,
  TEMPLATES,
  HCP_LAN,
  KSA_REGIONS,
  POP_SEGMENTS,
  PROV_GROUP_TYPES,
  DRAFT_SETUP,
  DRAFT,
  ATTRIBUTION_METHODS,
  BENCHMARK_METHODS,
  RISK_ADJ_MODELS,
  SCENARIOS,
  FINANCE_BASELINE_DATA,
  PAYMENT_MECHANICS_BY_CAT,
  DEFAULT_PMPM_BANDS,
  DRAFT_FINANCE,
};
