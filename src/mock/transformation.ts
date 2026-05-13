/* Session 7 — Contract Transformation data
   Synthetic contract: CNHI-PSMMC block contract + all transformation data */

/* ── Synthetic traditional contract (pre-VBHC) ─────────────────────────── */
const SYNTHETIC_CONTRACT = {
  id: "CT-TRAD-2024-PSMMC",
  fileName: "CNHI_PSMMC_ServiceAgreement_2024.docx",
  cards: [
    {
      id: "parties",
      title: "Parties & References",
      confidence: "high",
      fields: [
        {
          label: "Purchaser",
          value:
            "CNHI — Council of National Health Insurance, Ministry of Defense",
        },
        {
          label: "Provider",
          value: "Prince Sultan Military Medical City (PSMMC), Riyadh",
        },
        { label: "Contract ref.", value: "CNHI-SA-2024-0142" },
        { label: "Execution date", value: "15 March 2024" },
        { label: "Governing law", value: "Kingdom of Saudi Arabia" },
      ],
    },
    {
      id: "term",
      title: "Term & Scope",
      confidence: "high",
      fields: [
        { label: "Effective date", value: "1 April 2024" },
        { label: "Expiry date", value: "31 March 2027 (3-year term)" },
        {
          label: "Auto-renewal",
          value: "Yes — 1 year automatic unless 90-day notice given",
        },
        {
          label: "Covered services",
          value:
            "Comprehensive inpatient, outpatient, emergency, pharmaceutical, diagnostic, rehabilitation, and preventive healthcare services",
        },
        {
          label: "Geographic scope",
          value:
            "PSMMC Riyadh campus and designated specialist referral facilities",
        },
      ],
    },
    {
      id: "financial",
      title: "Financial Terms",
      confidence: "high",
      flags: [
        {
          text: "Pure fee-for-service block contract — zero performance linkage",
          severity: "critical",
        },
      ],
      fields: [
        {
          label: "Payment model",
          value: "Annual block payment — Fee-for-Service (FFS)",
        },
        {
          label: "Annual value",
          value: "SAR 176,000,000 (Year 1); CPI adjustment annually",
        },
        {
          label: "Payment frequency",
          value: "Monthly — SAR 14,667,000 per month",
        },
        {
          label: "Volume commitment",
          value: "No minimum volume guarantee; no maximum cap",
        },
        {
          label: "Adjustments",
          value: "Annual CPI uplift only; no quality-linked adjustment",
        },
        {
          label: "Performance link",
          value: "None — 0% of contract value at risk",
        },
      ],
    },
    {
      id: "quality",
      title: "Quality Provisions",
      confidence: "medium",
      flags: [
        {
          text: "Quality language found: vague and non-measurable — 'acceptable standards of care'",
          severity: "critical",
        },
      ],
      fields: [
        {
          label: "Quality language",
          value:
            '"The Provider shall deliver healthcare services in accordance with applicable standards of care."',
        },
        {
          label: "Quality measures",
          value: "None specified. No metrics, no targets, no methodology.",
        },
        {
          label: "Reporting req.",
          value:
            "Quarterly utilisation statistics: admissions, ED visits, outpatient encounters.",
        },
        {
          label: "Accreditation ref.",
          value:
            "JCI accreditation referenced as a qualification requirement only.",
        },
        { label: "PROMs", value: "Not referenced." },
        { label: "Outcome measures", value: "None." },
      ],
    },
    {
      id: "population",
      title: "Population & Eligibility",
      confidence: "medium",
      flags: [
        {
          text: "No formal attribution methodology — population defined geographically only",
          severity: "high",
        },
      ],
      fields: [
        {
          label: "Covered population",
          value: "MOD beneficiaries assigned to PSMMC catchment area",
        },
        {
          label: "Eligibility",
          value:
            "Active duty military, dependents, and retirees as defined by MOD Human Resources",
        },
        {
          label: "Estimated lives",
          value: "~47,000 beneficiaries (as of contract date)",
        },
        {
          label: "Attribution method",
          value:
            "Geographic assignment — no formal attribution methodology specified",
        },
        { label: "Mid-period changes", value: "Not addressed" },
      ],
    },
    {
      id: "data",
      title: "Data & Reporting",
      confidence: "low",
      flags: [
        {
          text: "No FHIR/NPHIES requirements; no data quality standards; no PROMs infrastructure",
          severity: "high",
        },
      ],
      fields: [
        {
          label: "Claims submission",
          value: "Monthly claims submission to NPHIES (basic compliance)",
        },
        {
          label: "Reports required",
          value:
            "Quarterly utilisation report (admissions, ED, outpatient only)",
        },
        {
          label: "Interoperability",
          value: "No FHIR or HL7 requirements specified",
        },
        {
          label: "Data quality",
          value: "No data quality standards referenced",
        },
        { label: "Real-time sharing", value: "Not required" },
        { label: "Platform access", value: "Not referenced" },
      ],
    },
    {
      id: "governance",
      title: "Governance & Dispute Resolution",
      confidence: "high",
      fields: [
        {
          label: "Dispute resolution",
          value:
            "Commercial arbitration under SAGIA rules — no performance-specific dispute process",
        },
        {
          label: "Amendment process",
          value: "Written agreement signed by both parties",
        },
        {
          label: "Termination",
          value:
            "90-day notice by either party; immediate termination for material breach",
        },
        {
          label: "Force majeure",
          value: "Standard commercial force majeure clause",
        },
        {
          label: "Perf. disputes",
          value: "No specific mechanism for quality data disputes",
        },
      ],
    },
  ],
};

/* ── Gap analysis — 8 dimensions ────────────────────────────────────────── */
const GAP_DIMENSIONS = [
  {
    id: "G1",
    code: "G1",
    name: "Outcome Orientation",
    score: 8,
    severity: "critical",
    target: 100,
    benchmark: 82,
    finding:
      "No patient outcome measures referenced. No clinical quality metrics. No PROMs. Payment is entirely volume-based with no link to health outcomes. The contract references 'acceptable standards of care' but defines no measurable standard.",
    contractClauses: [
      {
        ref: "Clause 7.1",
        quote:
          '"The Provider shall deliver healthcare services in accordance with applicable standards of care."',
        issue:
          "No definition of 'standards of care'. No measurable outcome referenced.",
      },
      {
        ref: "Clause 8.3",
        quote:
          '"Provider shall submit quarterly utilisation reports including admissions, ED visits, and outpatient encounters."',
        issue: "Volume metrics only — no outcome metrics.",
      },
    ],
    methodology:
      "G1 scored on: presence of clinical outcome measures (0/30), ICHOM Set integration (0/25), PROMs requirement (0/25), outcome-to-payment link (0/20). Score: 8/100 — minimal credit for generic quality reference.",
    recommendations: [
      "Add ICHOM Diabetes Standard Set outcomes (HbA1c, complications, PROMs)",
      "Add PHQ-9 and GAD-7 for Depression & Anxiety Set",
      "Specify outcome measurement timepoints aligned with ICHOM",
      "Link at least 20% of contract value to clinical outcome attainment",
    ],
  },
  {
    id: "G2",
    code: "G2",
    name: "Value Dimension Coverage",
    score: 12,
    severity: "critical",
    target: 100,
    benchmark: 78,
    finding:
      "Of the 10 value dimensions, only D7 (Cost) is implicitly addressed through the block payment amount. D4 (Safety) is referenced only through a generic indemnity clause. D1, D2, D3, D5, D6, D8, D9, D10 are entirely absent.",
    contractClauses: [
      {
        ref: "Clause 5.4",
        quote:
          '"Annual block payment of SAR 176M covers all contracted services."',
        issue: "D7 implicit but no cost-efficiency incentive.",
      },
      {
        ref: "Clause 9.1",
        quote:
          '"Provider maintains indemnity insurance for clinical negligence claims."',
        issue: "D4 addressed only via indemnity, not quality measurement.",
      },
    ],
    methodology:
      "G2 scored on: each of 10 dimensions addressed (0-10pts each). D7: 10pts (implicit). D4: 2pts (generic reference). All others: 0pts. Total: 12/100.",
    recommendations: [
      "Activate all 10 value dimensions with explicit measures",
      "Weight dimensions per clinical priorities of MOD population",
      "Include D1 (clinical outcomes) and D2 (PROMs) as primary dimensions",
      "Add D9 (equity) stratification from contract inception",
    ],
  },
  {
    id: "G3",
    code: "G3",
    name: "Financial Alignment",
    score: 5,
    severity: "critical",
    target: 100,
    benchmark: 75,
    finding:
      "Pure fee-for-service with annual block adjustment. No payment is linked to performance. No shared savings, no quality bonus, no withhold mechanism. HCP-LAN Category 1 — FFS with no quality link. Zero percent of contract value is at risk.",
    contractClauses: [
      {
        ref: "Clause 5.1-5.6",
        quote:
          '"Annual payment of SAR 176M adjusted by CPI. Monthly installments of SAR 14.67M."',
        issue: "0% of contract value linked to performance. Pure FFS.",
      },
    ],
    methodology:
      "G3 scored on: % at risk (0/30), payment-quality link (0/30), shared savings (0/20), incentive structure sophistication (0/20). Score 5/100 — minimal credit for CPI adjustment mechanism.",
    recommendations: [
      "Introduce shared savings model (HCP-LAN 3A or 3B)",
      "Add quality bonus pool (5% of contract value)",
      "Implement withhold mechanism (10-15%) with performance-gated release",
      "Design risk corridors appropriate to provider's capability",
    ],
  },
  {
    id: "G4",
    code: "G4",
    name: "Attribution Clarity",
    score: 15,
    severity: "high",
    target: 100,
    benchmark: 72,
    finding:
      "Covered population is defined as 'MOD beneficiaries assigned to PSMMC catchment area' but no formal attribution methodology is specified. No rules for patients seeking care outside PSMMC. No member list reconciliation process. No handling of mid-period changes.",
    contractClauses: [
      {
        ref: "Clause 3.1",
        quote:
          '"Services to be provided to MOD beneficiaries assigned to PSMMC catchment area as determined by MOD HR."',
        issue:
          "Geographic attribution only — no methodology for changes, transfers, or out-of-network use.",
      },
    ],
    methodology:
      "G4 scored on: attribution methodology specificity (5/25), member reconciliation (0/25), mid-period rules (0/25), leakage handling (10/25). Score: 15/100.",
    recommendations: [
      "Define formal attribution methodology (recommend voluntary alignment)",
      "Specify lookback period and minimum visit threshold",
      "Add quarterly member list reconciliation process",
      "Define leakage threshold and action when exceeded",
    ],
  },
  {
    id: "G5",
    code: "G5",
    name: "Measurement Rigour",
    score: 3,
    severity: "critical",
    target: 100,
    benchmark: 80,
    finding:
      "No quality measures are specified. No denominators, no exclusions, no data sources, no measurement methodology. The phrase 'provider shall report on service quality' appears once with no definition of what constitutes quality or how it is measured.",
    contractClauses: [
      {
        ref: "Clause 8.3",
        quote:
          '"Provider shall report on service quality as part of the quarterly utilisation submission."',
        issue: "No definition of quality, no measures, no methodology.",
      },
    ],
    methodology:
      "G5 scored on: measure specificity (0/25), denominator/exclusion definition (0/25), data source specification (0/25), risk adjustment methodology (0/25). Score: 3/100 — minimal credit for quality language.",
    recommendations: [
      "Specify each quality measure with full ICHOM methodology",
      "Define numerator, denominator, and exclusions for each measure",
      "Specify data sources and extraction methodology",
      "Define credibility thresholds (minimum denominator size)",
    ],
  },
  {
    id: "G6",
    code: "G6",
    name: "Risk Adjustment",
    score: 0,
    severity: "critical",
    target: 100,
    benchmark: 68,
    finding:
      "No risk adjustment of any kind. The block payment is not adjusted for population acuity changes. A provider treating an increasingly complex population receives the same payment as one treating a healthier cohort. No case-mix adjustment for quality comparison.",
    contractClauses: [],
    methodology:
      "G6 scored on: cost risk adjustment (0/35), quality risk adjustment (0/35), normalisation methodology (0/20), audit trail (0/10). Score: 0/100 — completely absent.",
    recommendations: [
      "Implement HCC-based risk adjustment for cost benchmark",
      "Implement ICHOM case-mix adjustment for clinical outcome scores",
      "Define prospective vs concurrent adjustment model",
      "Require full audit trail and transparency of risk calculations",
    ],
  },
  {
    id: "G7",
    code: "G7",
    name: "Reconciliation Process",
    score: 10,
    severity: "high",
    target: 100,
    benchmark: 70,
    finding:
      "Annual financial reconciliation referenced but not defined. No claims run-out period specified. No attribution reconciliation. No quality-adjusted settlement. No dispute resolution process specific to performance data. Generic commercial dispute clause only.",
    contractClauses: [
      {
        ref: "Clause 11.2",
        quote:
          '"Parties shall conduct an annual financial reconciliation within 90 days of contract year end."',
        issue:
          "Not defined. No process. No data requirements. No quality adjustment.",
      },
      {
        ref: "Clause 14.1",
        quote:
          '"Disputes shall be resolved by commercial arbitration under SAGIA rules."',
        issue: "No performance-specific dispute process.",
      },
    ],
    methodology:
      "G7 scored on: reconciliation workflow (5/25), claims run-out (0/20), attribution reconciliation (0/20), quality settlement (0/25), dispute SLA (5/10). Score: 10/100.",
    recommendations: [
      "Define 8-step reconciliation workflow",
      "Specify 120-150 day claims run-out period",
      "Add attribution reconciliation before cost calculation",
      "Define quality-adjusted settlement with multiplier mechanism",
    ],
  },
  {
    id: "G8",
    code: "G8",
    name: "Data Infrastructure",
    score: 18,
    severity: "high",
    target: 100,
    benchmark: 65,
    finding:
      "Monthly claims submission required. Basic utilisation reports specified. No FHIR or NPHIES interoperability requirements. No PROMs collection infrastructure. No data quality standards. No real-time data sharing.",
    contractClauses: [
      {
        ref: "Clause 8.1",
        quote:
          '"Provider shall submit monthly claims via NPHIES within 30 days of service delivery."',
        issue:
          "Basic claims submission only — no clinical data, no PROMs, no quality data.",
      },
      {
        ref: "Clause 8.2",
        quote:
          '"Quarterly utilisation reports: admissions, ED visits, outpatient encounters."',
        issue: "Volume metrics only.",
      },
    ],
    methodology:
      "G8 scored on: claims submission (18/20 — NPHIES partial credit), clinical data integration (0/20), PROMs infrastructure (0/20), data quality standards (0/20), real-time access (0/20). Score: 18/100.",
    recommendations: [
      "Add FHIR R4 API requirement for clinical data exchange",
      "Specify PROMs collection infrastructure for contracted ICHOM Sets",
      "Define data quality standards (completeness, timeliness, accuracy)",
      "Require real-time ADT feeds and monthly quality dashboards",
    ],
  },
];

const OVERALL_MATURITY = {
  score: 9,
  label: "Minimal — comprehensive transformation required",
  detail:
    "This contract has minimal value-based provisions. It establishes a payment arrangement but creates no accountability for health outcomes, no measurement framework, no financial incentives for quality improvement, and no infrastructure for performance-based contracting. The contract must be comprehensively transformed to support modern VBHC.",
};

/* ── Transformation paths (A–E detail for Moderate) ─────────────────────── */
const TRANSFORM_PATHS = [
  {
    id: "conservative",
    label: "Conservative",
    lanFrom: "Cat. 1 — FFS",
    lanTo: "Cat. 2A — FFS + Quality Reporting",
    borderColor: "oklch(0.40 0.16 145)",
    accentColor: "oklch(0.40 0.16 145)",
    bgColor: "oklch(0.96 0.04 145)",
    headline:
      "Add measurement and upside incentives without changing the payment foundation.",
    timeline: "6–12 months",
    risk: "None (upside only)",
    measures: 8,
    providerInvestment: "SAR 200K–500K",
    estimatedFinancial: "+SAR 1.8M annual quality bonus at target",
    maxUpside: "SAR 1.8M",
    maxDownside: "None",
    changes: [
      "5–8 quality measures from D1, D2, D4, D5",
      "Quality bonus pool 3–5% of contract value (CNHI-funded)",
      "Annual quality reporting, semi-annual interim",
      "Voluntary alignment attribution (locked at period start)",
      "No downside risk",
      "2 ICHOM Sets: T2DM + Depression & Anxiety",
    ],
    clauses: [
      {
        num: "4.1",
        title: "Clinical Quality Measures",
        gaps: ["G1", "G5"],
        priority: "must",
        text: "Provider shall measure and report clinical quality using the measures specified in Schedule C (Quality Appendix). Measures are defined with explicit numerators, denominators, exclusions, risk adjustment methodology, data sources, and reporting frequency. Failure to report within specified timelines shall result in a reporting penalty of SAR 50,000 per quarter.",
      },
      {
        num: "4.2",
        title: "ICHOM Standard Set Integration",
        gaps: ["G1", "G2"],
        priority: "must",
        text: "Provider shall implement ICHOM Standard Set measurement for Type 2 Diabetes (ICHOM-006) and Depression & Anxiety (ICHOM-017). Patient-reported outcome measures (PROMs) shall be collected at baseline and 12-month timepoints for all attributed beneficiaries with active diagnoses in these conditions, targeting a minimum 65% collection rate by Year 2.",
      },
      {
        num: "5.3",
        title: "Quality Bonus Pool",
        gaps: ["G3"],
        priority: "must",
        text: "CNHI shall fund a Quality Bonus Pool equal to 3.5% of the annual base contract value (SAR 6,160,000). Distribution shall be proportional to composite quality score attainment. Provider shall receive the full bonus pool if composite score ≥80; proportional distribution for scores 60–79; no distribution for scores <60.",
      },
      {
        num: "8.4",
        title: "Attribution Methodology",
        gaps: ["G4"],
        priority: "must",
        text: "Attributed population shall be determined by Voluntary Alignment: beneficiaries who nominate PSMMC as their primary care provider via the MOD patient portal or in-person registration. Attribution shall be locked at the start of each performance period and refreshed annually. Starting population for Year 1: 47,000 beneficiaries.",
      },
    ],
    measures_array: [
      {
        id: "M-C01",
        name: "HbA1c control <7.0%",
        dim: "D1",
        ichom: "ICHOM-006",
        floor: 55,
        target: 65,
        stretch: 75,
        source: "Lab/EHR",
        freq: "Annual",
        riskAdj: "Age, baseline HbA1c, comorbidities",
      },
      {
        id: "M-C02",
        name: "PHQ-9 response ≥50% reduction",
        dim: "D1",
        ichom: "ICHOM-017",
        floor: 55,
        target: 70,
        stretch: 82,
        source: "PROMs",
        freq: "6-monthly",
        riskAdj: "Baseline severity",
      },
      {
        id: "M-C03",
        name: "PROMs completion rate",
        dim: "D2",
        ichom: "Both",
        floor: 55,
        target: 65,
        stretch: 80,
        source: "PROMs platform",
        freq: "Annual",
        riskAdj: "None",
      },
      {
        id: "M-C04",
        name: "HAI rate (per 1,000 days)",
        dim: "D3",
        ichom: "None",
        floor: 1.5,
        target: 1.0,
        stretch: 0.6,
        source: "Infection surveillance",
        freq: "Monthly",
        riskAdj: "None",
        dir: "lower",
      },
      {
        id: "M-C05",
        name: "7-day post-discharge follow-up",
        dim: "D4",
        ichom: "None",
        floor: 65,
        target: 75,
        stretch: 88,
        source: "Scheduling/ADT",
        freq: "Monthly",
        riskAdj: "Case-mix",
      },
      {
        id: "M-C06",
        name: "Diabetic eye screening rate",
        dim: "D5",
        ichom: "ICHOM-006",
        floor: 65,
        target: 75,
        stretch: 88,
        source: "Imaging RIS",
        freq: "Annual",
        riskAdj: "None",
      },
      {
        id: "M-C07",
        name: "β-blocker post-MI prescription",
        dim: "D5",
        ichom: "None",
        floor: 90,
        target: 95,
        stretch: 99,
        source: "Pharmacy",
        freq: "Quarterly",
        riskAdj: "None",
      },
      {
        id: "M-C08",
        name: "Mental health screening coverage",
        dim: "D5",
        ichom: "ICHOM-017",
        floor: 55,
        target: 68,
        stretch: 80,
        source: "EHR PHQ",
        freq: "Quarterly",
        riskAdj: "None",
      },
    ],
    financialParams: {
      benchmarkMethod: "Historical cost trend (3yr average)",
      msr: "None (upside only)",
      sharingPct: "N/A",
      withhold: "None",
      qbpFunding: "CNHI-funded (3.5% base)",
      settlementFreq: "Annual",
      riskAdj: "None in Year 1",
      corridors: "None",
    },
    roadmap: [
      { label: "Contract negotiation", w: [1, 8], dep: [] },
      {
        label: "PROMs platform setup",
        w: [4, 16],
        dep: ["Contract negotiation"],
      },
      {
        label: "ICHOM Set onboarding",
        w: [8, 20],
        dep: ["PROMs platform setup"],
      },
      { label: "Staff training", w: [12, 20], dep: ["ICHOM Set onboarding"] },
      {
        label: "Shadow quality reporting",
        w: [20, 28],
        dep: ["Staff training"],
      },
      { label: "Go-live", w: [28, 52], dep: ["Shadow quality reporting"] },
    ],
    readiness: [
      { item: "NPHIES claims submission", status: "ready" },
      { item: "PROMs collection — T2DM Set", status: "not_started" },
      { item: "PROMs collection — Depression Set", status: "not_started" },
      { item: "Quality measure computation", status: "not_started" },
    ],
  },
  {
    id: "moderate",
    label: "Moderate",
    lanFrom: "Cat. 1 — FFS",
    lanTo: "Cat. 2B — Shared Savings + Withhold",
    borderColor: "oklch(0.55 0.14 60)",
    accentColor: "oklch(0.55 0.14 60)",
    bgColor: "oklch(0.96 0.04 60)",
    headline:
      "Link payment to outcomes and cost efficiency with balanced risk sharing.",
    timeline: "12–18 months",
    risk: "Moderate — symmetric savings/loss to 5% stop-loss",
    measures: 16,
    providerInvestment: "SAR 2M–5M",
    estimatedFinancial: "+SAR 2.1M net at baseline performance",
    maxUpside: "SAR 7.8M",
    maxDownside: "SAR 3.2M",
    changes: [
      "15–18 quality measures across D1, D2, D4, D5, D7, D9",
      "Shared savings 60/40 split with ±5% stop-loss",
      "12% withhold, quarterly partial release",
      "ICHOM case-mix + HCC risk adjustment",
      "6 ICHOM Sets activated",
      "Semi-annual reconciliation, annual settlement",
      "Attribution: plurality-based, 12-month lookback, quarterly refresh",
    ],
    clauses: [
      {
        num: "4.1",
        title: "Clinical Quality Measures",
        gaps: ["G1", "G5"],
        priority: "must",
        text: "Provider shall achieve the quality measures specified in Schedule C across 5 active value dimensions (D1 Clinical Outcomes, D2 Patient-Reported Outcomes, D4 Care Coordination, D5 Clinical Effectiveness, D7 Cost & Resource Utilisation). Each measure is defined with explicit numerator, denominator, exclusions, risk adjustment methodology per Schedule D, data sources, and minimum credibility threshold (minimum denominator n=30).",
      },
      {
        num: "4.2",
        title: "ICHOM Standard Set Integration",
        gaps: ["G1", "G2"],
        priority: "must",
        text: "Provider shall implement ICHOM measurement for Type 2 Diabetes (ICHOM-006), Depression & Anxiety (ICHOM-017), Coronary Artery Disease (ICHOM-001), Hip & Knee Osteoarthritis (ICHOM-021), Pregnancy & Childbirth (ICHOM-037), and Chronic Kidney Disease (ICHOM-033). PROMs shall be collected at ICHOM-specified timepoints targeting ≥65% response rate by Year 1 and ≥75% by Year 2.",
      },
      {
        num: "5.3",
        title: "Shared Savings Mechanism",
        gaps: ["G3"],
        priority: "must",
        text: "If actual total cost of care falls below the risk-adjusted benchmark, savings shall be shared: Provider 60%, CNHI 40%. A minimum savings rate (MSR) of 2.0% applies. Savings below the MSR are retained by CNHI. Shared losses apply symmetrically if actual costs exceed benchmark. Stop-loss: maximum provider financial exposure limited to 5% of annual base payment (SAR 8.8M). Risk corridors apply per Schedule E.",
      },
      {
        num: "5.4",
        title: "Quality Withhold Mechanism",
        gaps: ["G3"],
        priority: "must",
        text: "CNHI shall withhold 12% of quarterly base payment installments (SAR 5.3M annually). Withhold shall be released quarterly based on interim quality performance: 80% release if composite score ≥70; 60% release if score 60–69; 40% release if score 50–59; 0% release if score <50 or quality gate failed. Annual year-end reconciliation releases remaining withheld amounts based on final composite score.",
      },
      {
        num: "5.5",
        title: "Quality Multiplier",
        gaps: ["G3", "G1"],
        priority: "must",
        text: "Provider's share of gross savings shall be multiplied by a quality multiplier based on composite score: score ≥80 → 1.00×; score 70–79 → 0.90–0.99 (linear); score 60–69 → 0.75–0.89 (linear); score <60 → 0.00× (no shared savings regardless of cost performance).",
      },
      {
        num: "6.1",
        title: "Attribution Methodology",
        gaps: ["G4"],
        priority: "must",
        text: "Attributed population determined by plurality-based retrospective attribution: beneficiaries are attributed to the provider responsible for the plurality of primary-care E&M visits during the 12-month lookback period. Attribution refreshed quarterly. Minimum 2 qualifying visits required. Opt-out process available for beneficiaries via MOD patient portal. Attribution reconciliation conducted per Schedule F (Reconciliation Protocol).",
      },
      {
        num: "7.1",
        title: "Risk Adjustment Framework",
        gaps: ["G6"],
        priority: "must",
        text: "Cost benchmark risk-adjusted using CMS-HCC v28 calibrated to MOD panel. Clinical outcome scores risk-adjusted using ICHOM case-mix variables specified per Set in Schedule D. Risk scores computed prospectively from prior period diagnosis data. Network mean normalisation applied. Full audit trail maintained in AiQL platform. Either party may request risk adjustment review within 30 days of score publication.",
      },
      {
        num: "11.1",
        title: "Reconciliation Protocol",
        gaps: ["G7"],
        priority: "must",
        text: "Settlement follows 8-step reconciliation: (1) Claims run-out monitoring (150-day run-out, 90% completeness threshold); (2) Attribution reconciliation; (3) Risk score update; (4) Net cost calculation; (5) Quality score calculation; (6) Settlement computation with quality multiplier; (7) Dispute management (30-day response SLA); (8) Final settlement and archive. Full reconciliation completed within 120 days of period end.",
      },
    ],
    measures_array_2: [
      {
        id: "M-M01",
        name: "HbA1c control <7.0%",
        dim: "D1",
        ichom: "ICHOM-006",
        floor: 55,
        target: 65,
        stretch: 78,
        source: "Lab/EHR",
        freq: "Annual",
        riskAdj: "Age, baseline HbA1c, comorbidities, duration",
      },
      {
        id: "M-M02",
        name: "PHQ-9 response ≥50% reduction",
        dim: "D1",
        ichom: "ICHOM-017",
        floor: 55,
        target: 72,
        stretch: 84,
        source: "PROMs",
        freq: "6-monthly",
        riskAdj: "Baseline PHQ-9 score, prior episodes",
      },
      {
        id: "M-M03",
        name: "PHQ-9 remission (score <5)",
        dim: "D1",
        ichom: "ICHOM-017",
        floor: 35,
        target: 48,
        stretch: 62,
        source: "PROMs",
        freq: "6-monthly",
        riskAdj: "Baseline severity",
      },
      {
        id: "M-M04",
        name: "MACE-free survival at 12m",
        dim: "D1",
        ichom: "ICHOM-001",
        floor: 84,
        target: 89,
        stretch: 94,
        source: "EMR/Claims",
        freq: "Annual",
        riskAdj: "GRACE score, EF, prior events",
      },
      {
        id: "M-M05",
        name: "PROMs completion rate (all Sets)",
        dim: "D2",
        ichom: "Multiple",
        floor: 55,
        target: 65,
        stretch: 80,
        source: "PROMs platform",
        freq: "Quarterly",
        riskAdj: "None",
      },
      {
        id: "M-M06",
        name: "EQ-5D-5L utility improvement ≥0.05",
        dim: "D2",
        ichom: "Multiple",
        floor: 45,
        target: 60,
        stretch: 75,
        source: "PROMs",
        freq: "Annual",
        riskAdj: "Baseline utility",
      },
      {
        id: "M-M07",
        name: "7-day post-discharge follow-up",
        dim: "D4",
        ichom: "None",
        floor: 65,
        target: 76,
        stretch: 88,
        source: "Scheduling",
        freq: "Monthly",
        riskAdj: "Case-mix",
      },
      {
        id: "M-M08",
        name: "Medication reconciliation ≥95%",
        dim: "D4",
        ichom: "None",
        floor: 88,
        target: 95,
        stretch: 98,
        source: "EHR",
        freq: "Monthly",
        riskAdj: "None",
      },
      {
        id: "M-M09",
        name: "Diabetic eye screening rate",
        dim: "D5",
        ichom: "ICHOM-006",
        floor: 65,
        target: 78,
        stretch: 90,
        source: "Imaging RIS",
        freq: "Annual",
        riskAdj: "None",
      },
      {
        id: "M-M10",
        name: "Statin prescription rate (ASCVD)",
        dim: "D5",
        ichom: "None",
        floor: 75,
        target: 85,
        stretch: 93,
        source: "Pharmacy",
        freq: "Quarterly",
        riskAdj: "Contraindications",
      },
      {
        id: "M-M11",
        name: "Antimicrobial stewardship adher.",
        dim: "D5",
        ichom: "None",
        floor: 72,
        target: 82,
        stretch: 92,
        source: "Pharmacy/CDS",
        freq: "Monthly",
        riskAdj: "None",
      },
      {
        id: "M-M12",
        name: "Mental health screening coverage",
        dim: "D5",
        ichom: "ICHOM-017",
        floor: 55,
        target: 70,
        stretch: 82,
        source: "EHR PHQ",
        freq: "Quarterly",
        riskAdj: "None",
      },
      {
        id: "M-M13",
        name: "30-day readmission rate",
        dim: "D7",
        ichom: "None",
        floor: 14,
        target: 10,
        stretch: 7,
        source: "ADT/Claims",
        freq: "Monthly",
        riskAdj: "DRG, case-mix",
        dir: "lower",
      },
      {
        id: "M-M14",
        name: "ED utilisation (per 1,000 lives)",
        dim: "D7",
        ichom: "None",
        floor: 250,
        target: 200,
        stretch: 155,
        source: "ED tracking",
        freq: "Monthly",
        riskAdj: "Age/sex/SES",
        dir: "lower",
      },
      {
        id: "M-M15",
        name: "Outcome variation by SES (Theil)",
        dim: "D9",
        ichom: "None",
        floor: 0.08,
        target: 0.05,
        stretch: 0.02,
        source: "All dim + demographics",
        freq: "Annual",
        riskAdj: "N/A",
        dir: "lower",
      },
    ],
    financialParams: {
      benchmarkMethod: "Blended: 70% historical trend + 30% regional index",
      baselineStart: "Jan 2024",
      baselineEnd: "Dec 2024",
      medicalTrend: "6.2% unit cost + 1.8% utilisation",
      pharmacyTrend: "8.1% unit + 2.4% utilisation",
      msr: "2.0%",
      sharingPct: "60% provider / 40% CNHI",
      corridorCap: "5% stop-loss",
      withhold: "12% quarterly",
      qbpFunding: "Withhold-funded",
      qbpCalcMethod: "Composite score × proportional distribution",
      settlementFreq: "Semi-annual reconciliation, annual settlement",
      riskAdj: "HCC-v28 for cost; ICHOM case-mix for quality",
      cMgmtFee: "SAR 120 PMPM (SAR 5.6M annually)",
    },
    roadmap: [
      { label: "Contract negotiation", w: [1, 8], dep: [] },
      {
        label: "FHIR/NPHIES integration",
        w: [4, 20],
        dep: ["Contract negotiation"],
      },
      {
        label: "Data warehouse setup",
        w: [4, 20],
        dep: ["Contract negotiation"],
      },
      {
        label: "PROMs infrastructure (6 Sets)",
        w: [8, 24],
        dep: ["FHIR/NPHIES integration"],
      },
      {
        label: "Risk score engine build",
        w: [10, 22],
        dep: ["Data warehouse setup"],
      },
      {
        label: "Provider training",
        w: [16, 24],
        dep: ["PROMs infrastructure (6 Sets)"],
      },
      {
        label: "Shadow reporting period",
        w: [24, 36],
        dep: ["Provider training"],
      },
      { label: "Go-live", w: [36, 52], dep: ["Shadow reporting period"] },
      { label: "First interim reconciliation", w: [48, 52], dep: ["Go-live"] },
      {
        label: "First annual settlement",
        w: [88, 92],
        dep: ["First interim reconciliation"],
      },
    ],
    readiness: [
      { item: "NPHIES claims submission", status: "ready" },
      { item: "FHIR R4 API — clinical data", status: "not_started" },
      { item: "PROMs collection — T2DM Set", status: "not_started" },
      { item: "PROMs collection — Depression Set", status: "not_started" },
      {
        item: "PROMs collection — CAD, HKOA, PREG, CKD",
        status: "not_started",
      },
      { item: "Data quality monitoring", status: "not_started" },
      { item: "Risk score computation (HCC)", status: "not_started" },
      { item: "Quality measure computation engine", status: "not_started" },
      { item: "Reconciliation data warehouse", status: "not_started" },
    ],
  },
  {
    id: "aggressive",
    label: "Aggressive",
    lanFrom: "Cat. 1 — FFS",
    lanTo: "Cat. 3B — Population-Based Payment",
    borderColor: "oklch(0.50 0.18 25)",
    accentColor: "oklch(0.50 0.18 25)",
    bgColor: "oklch(0.96 0.04 25)",
    headline:
      "Full accountability for population health outcomes and total cost of care.",
    timeline: "18–24 months",
    risk: "High — full risk from first dollar, 8% stop-loss",
    measures: 28,
    providerInvestment: "SAR 8M–15M",
    estimatedFinancial: "+SAR 4.7M net at baseline performance",
    maxUpside: "SAR 22M",
    maxDownside: "SAR 12M",
    changes: [
      "Full partial capitation (PMPM for primary + specialist; inpatient carved out initially)",
      "All 10 dimensions active, 6 ICHOM Sets, 28+ measures",
      "Full blended HCC + ICHOM case-mix risk adjustment",
      "Global budget — symmetric savings/losses, no corridor, 8% stop-loss",
      "18% withhold, performance-gated release",
      "Prospective attribution, annual reconciliation",
      "Real-time AiQL reasoning dashboards",
      "Dedicated care management programme required",
    ],
    clauses: [],
    financialParams: {},
    roadmap: [],
    readiness: [
      { item: "NPHIES claims submission", status: "ready" },
      { item: "FHIR R4 API — clinical data", status: "not_started" },
      { item: "Full 6-Set PROMs infrastructure", status: "not_started" },
      { item: "Population health registry", status: "not_started" },
      { item: "SDOH data capture", status: "not_started" },
      { item: "Real-time ADT feeds", status: "not_started" },
      { item: "Care management team (20+ FTE)", status: "not_started" },
      { item: "Population health analytics platform", status: "not_started" },
    ],
  },
];

/* ── Financial impact data ───────────────────────────────────────────────── */
const FINANCIAL_IMPACT = {
  basePMPM: 3112,
  lives: 47000,
  baseAnnual: 176000000,
  purchaserCost: {
    current: 176000000,
    optimistic: 168000000,
    baseline: 173000000,
    pessimistic: 179000000,
    netSavingsRange: { min: 3000000, max: 8000000 },
  },
  providerRevenue: {
    current: 176000000,
    optimistic: 183000000,
    baseline: 178000000,
    pessimistic: 172000000,
    breakEvenScore: 62,
    breakEvenSavingsPct: 1.2,
  },
  qualityTrajectory: [
    {
      year: 0,
      label: "Current (est.)",
      score: 55,
      note: "Unmeasured — estimated from national benchmarks",
    },
    {
      year: 1,
      label: "Year 1",
      score: 68,
      note: "First-year improvement with incentives active",
    },
    {
      year: 2,
      label: "Year 2",
      score: 74,
      note: "Sustained improvement, care management maturing",
    },
    {
      year: 3,
      label: "Year 3",
      score: 79,
      note: "Approaching top-quartile performance",
    },
  ],
  literatureRef:
    "CMS MSSP data shows 2–4% quality improvement in first performance year; NHS P4P evidence shows 3–8pp improvement over 3 years (Campbell 2009, Ryan 2015).",
};

/* ── Side-by-side diff sections ─────────────────────────────────────────── */
const DIFF_SECTIONS = [
  {
    id: "S1",
    title: "Parties & Term",
    original:
      "Parties: CNHI and PSMMC. Term: 3 years (2024–2027) with CPI-linked annual adjustment. No performance obligations on either party beyond service delivery.",
    reasoning:
      "G7, G8 — Original contract lacks data infrastructure commitments, performance obligations, and reconciliation provisions. Parties must commit to data sharing and AiQL platform access.",
    transformed:
      "Parties: CNHI and PSMMC. Term: 3 years with annual performance period review. PSMMC commits to: (1) AiQL platform integration and real-time data access for CNHI, (2) PROMs collection for contracted ICHOM Sets, (3) clinical data extraction per Schedule H (FHIR specifications). CNHI commits to: (1) quality measure methodology sign-off within 30 days, (2) risk adjustment review within 30 days of publication, (3) data sharing with PSMMC via AiQL platform.",
    changes: [
      { field: "Performance obligations", type: "added", path: "M" },
      { field: "AiQL platform access", type: "added", path: "M" },
      { field: "Data sharing commitments", type: "added", path: "M" },
      { field: "Annual performance review", type: "added", path: "C" },
    ],
  },
  {
    id: "S2",
    title: "Covered Population & Attribution",
    original:
      "Covered population: MOD beneficiaries assigned to PSMMC catchment area as determined by MOD HR. No further specification. No attribution methodology. No handling of mid-period transfers or out-of-network utilisation.",
    reasoning:
      "G4 — Original has no formal attribution methodology. Without precise attribution, provider financial accountability is undefined and settlement calculation is impossible.",
    transformed:
      "Attributed population determined by plurality-based retrospective attribution (12-month lookback, minimum 2 qualifying visits, quarterly refresh). Attribution locked at period start with quarterly reconciliation. Opt-out available via MOD portal. Leakage threshold: 15% out-of-network (flagged), 25% (financial adjustment applied). Mid-period transfers handled per Schedule F. Starting attributed panel: 47,000 beneficiaries at contract execution. Attribution reconciliation is Step 2 of the 8-step settlement process (Schedule F).",
    changes: [
      { field: "Attribution methodology", type: "added", path: "M" },
      { field: "Lookback period", type: "added", path: "M" },
      { field: "Quarterly refresh", type: "added", path: "M" },
      { field: "Opt-out process", type: "added", path: "C" },
      { field: "Leakage threshold", type: "added", path: "M" },
      { field: "Mid-period transfer rules", type: "added", path: "M" },
    ],
  },
  {
    id: "S3",
    title: "Payment Terms",
    original:
      "Annual block payment: SAR 176,000,000. Monthly installments of SAR 14,667,000. CPI adjustment annually. 0% of contract value linked to performance. No shared savings, no quality bonus, no withhold.",
    reasoning:
      "G3 — Original has zero payment-performance linkage. HCP-LAN Category 1 — the lowest tier. Full transformation to Category 2B introduces shared savings, withhold, and quality bonus.",
    transformed:
      "Base payment: SAR 176M (risk-adjusted annually). Quality withhold: 12% (SAR 21.1M) withheld quarterly, released based on quality performance. Shared savings: 60/40 (provider/purchaser) on savings above 2% MSR, symmetric losses with 5% stop-loss. Quality bonus pool: 5% of base (SAR 8.8M) funded by CNHI, distributed by composite score. Care management fee: SAR 120 PMPM (SAR 5.6M annually). Quality multiplier applied to shared savings: score ≥80 → 1.00×; score 70–79 → 0.90–0.99×; score <60 → 0.00×. Settlement: semi-annual reconciliation, annual final settlement per Schedule G.",
    changes: [
      { field: "Block payment (base)", type: "modified", path: "C" },
      { field: "Quality withhold 12%", type: "added", path: "M" },
      { field: "Shared savings 60/40", type: "added", path: "M" },
      { field: "Quality bonus pool 5%", type: "added", path: "C" },
      { field: "Quality multiplier", type: "added", path: "M" },
      { field: "Care management fee", type: "added", path: "M" },
      { field: "CPI adjustment only", type: "removed", path: "M" },
    ],
  },
  {
    id: "S4",
    title: "Quality Framework",
    original:
      '"The Provider shall deliver healthcare services in accordance with applicable standards of care." Quarterly utilisation statistics only (admissions, ED visits, outpatient encounters). No outcome measures. No PROMs. No value framework.',
    reasoning:
      "G1, G2, G5 — Original has no outcome measures, no 10-dimension value framework, and no measurement methodology. This single vague sentence must be replaced by a comprehensive quality appendix.",
    transformed:
      "Schedule C (Quality Appendix) specifies 16 quality measures across 5 active value dimensions (D1, D2, D4, D5, D7) with weights per the contract value profile. D1/D2 driven by ICHOM Standard Sets (T2DM, Depression, CAD, HKOA, Pregnancy, CKD). Each measure: numerator, denominator, exclusions, risk adjustment per Schedule D, data source, credibility threshold (n≥30), floor/target/stretch. D3 (Safety) gate: composite score = 0 if D3 score <60. Quarterly interim quality reports; annual final quality report. Both parties access live quality dashboard via AiQL platform.",
    changes: [
      { field: "Generic quality language", type: "removed", path: "C" },
      { field: "D1 clinical outcome measures", type: "added", path: "C" },
      { field: "D2 PROMs measures", type: "added", path: "C" },
      { field: "D4 coordination measures", type: "added", path: "M" },
      { field: "D5 effectiveness measures", type: "added", path: "M" },
      { field: "D7 cost efficiency measures", type: "added", path: "M" },
      { field: "D9 equity measures", type: "added", path: "M" },
      { field: "ICHOM Set integration", type: "added", path: "C" },
      { field: "Quality gate (D3)", type: "added", path: "M" },
    ],
  },
  {
    id: "S5",
    title: "Risk Adjustment",
    original:
      "Not referenced. Block payment unchanged regardless of population acuity. No case-mix adjustment for quality comparisons. A provider treating more complex patients receives identical payment to one treating healthier cohorts.",
    reasoning:
      "G6 — Original has no risk adjustment of any kind. Without risk adjustment, providers are discouraged from treating high-acuity populations and quality comparisons are unfair.",
    transformed:
      "Cost benchmark risk-adjusted using CMS-HCC v28 (calibrated to MOD panel quarterly). Clinical outcome scores risk-adjusted using ICHOM case-mix variables per condition (specified in Schedule D per Set). Risk scores computed prospectively from prior period data. Network mean normalisation applied annually. Risk score audit trail maintained in AiQL graph. Either party may request risk adjustment review within 30 days. Disputed adjustments handled per Step 7 of the reconciliation process (Schedule G).",
    changes: [
      { field: "HCC cost risk adjustment", type: "added", path: "M" },
      { field: "ICHOM case-mix adjustment", type: "added", path: "M" },
      { field: "Network normalisation", type: "added", path: "M" },
      { field: "Audit trail requirement", type: "added", path: "M" },
      { field: "Dispute SLA (30 days)", type: "added", path: "M" },
    ],
  },
  {
    id: "S6",
    title: "Reconciliation & Settlement",
    original:
      '"Parties shall conduct an annual financial reconciliation within 90 days of contract year end." No process defined. No claims run-out period. No attribution reconciliation. No quality-adjusted settlement. Generic commercial dispute clause only.',
    reasoning:
      "G7 — Original has no defined reconciliation process. The 8-step reconciliation workflow from Session 6B must be contractually embedded.",
    transformed:
      "8-step reconciliation protocol (Schedule G): Step 1 Claims run-out (150 days, 90% threshold); Step 2 Attribution reconciliation; Step 3 Risk score update; Step 4 Net cost calculation; Step 5 Quality score calculation; Step 6 Settlement computation with quality multiplier; Step 7 Dispute management (30-day SLA; arbitration after 60 days unresolved); Step 8 Final settlement and archive. Performance-specific dispute resolution: written submission, designated reviewer, reasoning trace access via AiQL platform. Settlement within 120 days of period end.",
    changes: [
      {
        field: "Annual reconciliation (undefined)",
        type: "removed",
        path: "C",
      },
      { field: "8-step reconciliation protocol", type: "added", path: "M" },
      { field: "Claims run-out (150 days)", type: "added", path: "M" },
      { field: "Attribution reconciliation", type: "added", path: "M" },
      { field: "Quality-adjusted settlement", type: "added", path: "M" },
      { field: "30-day dispute SLA", type: "added", path: "M" },
      { field: "AiQL reasoning trace access", type: "added", path: "M" },
    ],
  },
  {
    id: "S7",
    title: "Data & Reporting",
    original:
      "Monthly claims submission via NPHIES. Quarterly utilisation reports (admissions, ED visits, outpatient). No FHIR requirements. No PROMs infrastructure. No data quality standards. No real-time sharing.",
    reasoning:
      "G8 — Original has minimal data infrastructure. Performance-based contracting requires clinical data integration, PROMs collection, and real-time performance visibility.",
    transformed:
      "FHIR R4 API: clinical data extraction per Schedule H (HL7 FHIR specifications). PROMs: collection for all 6 contracted ICHOM Sets at specified timepoints, minimum 65% response rate. Data quality: completeness ≥95%, timeliness within 30 days of service, plausibility per OHDSI framework. Real-time feeds: monthly ADT, daily claims. Reporting cadence: monthly interim dashboard (AiQL platform), quarterly quality report, annual performance report. Both parties access AiQL platform for live score visibility. CNHI receives automated alerts for dimensions trending below floor threshold.",
    changes: [
      { field: "Basic claims (NPHIES)", type: "modified", path: "C" },
      { field: "FHIR R4 API requirement", type: "added", path: "M" },
      { field: "PROMs infrastructure (6 Sets)", type: "added", path: "M" },
      { field: "Data quality standards", type: "added", path: "M" },
      { field: "Real-time ADT feeds", type: "added", path: "A" },
      { field: "Monthly interim dashboard", type: "added", path: "M" },
      { field: "AiQL platform access", type: "added", path: "C" },
      { field: "Automated alert system", type: "added", path: "M" },
    ],
  },
];

/* ── Phase planner ───────────────────────────────────────────────────────── */
const PHASES = [
  {
    id: "phase0",
    num: 0,
    label: "Preparation",
    months: [1, 6],
    lanCat: "Cat. 1 (unchanged)",
    riskLevel: "None",
    providerImpact: "−SAR 0.5M (investment)",
    milestones: [
      { id: "m0-1", text: "NPHIES FHIR integration complete", done: false },
      { id: "m0-2", text: "PROMs collection launched — T2DM Set", done: false },
      {
        id: "m0-3",
        text: "Quality measure computation validated",
        done: false,
      },
      { id: "m0-4", text: "Provider staff trained (50+ staff)", done: false },
      { id: "m0-5", text: "Data warehouse deployed and tested", done: false },
    ],
    readinessCriteria: [
      {
        id: "rc0-1",
        text: "All data readiness checklist items ready or in progress with timeline",
        status: "not_met",
      },
      {
        id: "rc0-2",
        text: "Provider care management lead appointed",
        status: "not_met",
      },
      {
        id: "rc0-3",
        text: "AiQL platform access provisioned",
        status: "not_met",
      },
    ],
    description:
      "Infrastructure build, PROMs pilot, provider training, data warehouse setup. No payment changes during this phase — both parties invest in readiness.",
  },
  {
    id: "phase1",
    num: 1,
    label: "Shadow Reporting",
    months: [7, 12],
    lanCat: "Cat. 1 (unchanged)",
    riskLevel: "None",
    providerImpact: "SAR 0 (no performance payment)",
    milestones: [
      {
        id: "m1-1",
        text: "First shadow quality report delivered",
        done: false,
      },
      {
        id: "m1-2",
        text: "Baseline performance established for all measures",
        done: false,
      },
      {
        id: "m1-3",
        text: "Both parties sign off on measurement methodology",
        done: false,
      },
      {
        id: "m1-4",
        text: "Provider care management team operational",
        done: false,
      },
    ],
    readinessCriteria: [
      {
        id: "rc1-1",
        text: "3 consecutive months of complete, validated quality reports",
        status: "not_met",
      },
      {
        id: "rc1-2",
        text: "Agreed baselines documented for all 16 measures",
        status: "not_met",
      },
      {
        id: "rc1-3",
        text: "No data quality issues unresolved >30 days",
        status: "not_met",
      },
    ],
    description:
      "All quality measures computed and reported — no payment linked. Both parties review data, validate methodology, establish baselines. This phase de-risks the transition.",
  },
  {
    id: "phase2",
    num: 2,
    label: "Upside Incentives",
    months: [13, 24],
    lanCat: "Cat. 2A — Upside only",
    riskLevel: "Low (upside only)",
    providerImpact: "+SAR 1.8M quality bonus at target",
    milestones: [
      { id: "m2-1", text: "First quality bonus distributed", done: false },
      {
        id: "m2-2",
        text: "First shared savings settlement (upside only)",
        done: false,
      },
      { id: "m2-3", text: "Lessons-learned review completed", done: false },
      {
        id: "m2-4",
        text: "Quality score ≥65 achieved and sustained",
        done: false,
      },
    ],
    readinessCriteria: [
      {
        id: "rc2-1",
        text: "Provider received positive financial outcome",
        status: "not_met",
      },
      {
        id: "rc2-2",
        text: "Validated reconciliation process — zero unresolved disputes >90 days",
        status: "not_met",
      },
      {
        id: "rc2-3",
        text: "Quality score trajectory positive for 6+ months",
        status: "not_met",
      },
    ],
    description:
      "Quality bonus pool (3–5% of base) activated. Shared savings on upside only. No downside risk. 'Safe harbour' year — provider earns incremental revenue without risking current income.",
  },
  {
    id: "phase3",
    num: 3,
    label: "Balanced Risk",
    months: [25, 36],
    lanCat: "Cat. 2B — Full shared savings",
    riskLevel: "Moderate",
    providerImpact: "+SAR 2.1M net at baseline",
    milestones: [
      {
        id: "m3-1",
        text: "First full-risk reconciliation completed",
        done: false,
      },
      {
        id: "m3-2",
        text: "First withhold release based on quality score",
        done: false,
      },
      { id: "m3-3", text: "Care management ROI demonstrated", done: false },
      { id: "m3-4", text: "Quality score sustained ≥70", done: false },
    ],
    readinessCriteria: [
      {
        id: "rc3-1",
        text: "Sustained quality improvement trend (2+ years)",
        status: "not_met",
      },
      {
        id: "rc3-2",
        text: "Provider infrastructure matured — quality data completeness ≥95%",
        status: "not_met",
      },
      {
        id: "rc3-3",
        text: "Both parties express readiness for partial capitation",
        status: "not_met",
      },
    ],
    description:
      "Full up-downside shared savings. Withhold mechanism active (12%). Quality multiplier applied to settlement. Provider fully accountable but with risk corridors and stop-loss protection.",
  },
  {
    id: "phase4",
    num: 4,
    label: "Advanced Model",
    months: [37, 48],
    lanCat: "Cat. 3A/3B — Population-based",
    riskLevel: "High",
    providerImpact: "+SAR 4.7M net at baseline",
    milestones: [
      {
        id: "m4-1",
        text: "Partial capitation rate agreed and implemented",
        done: false,
      },
      {
        id: "m4-2",
        text: "First bundled payment episode (Hip & Knee OA)",
        done: false,
      },
      {
        id: "m4-3",
        text: "Full 10-dimension value framework active",
        done: false,
      },
      { id: "m4-4", text: "All 6 ICHOM Sets fully operational", done: false },
    ],
    readinessCriteria: [
      {
        id: "rc4-1",
        text: "Capitation rate agreed with actuarial validation",
        status: "not_met",
      },
      {
        id: "rc4-2",
        text: "Full ICHOM Set coverage with ≥75% PROMs response",
        status: "not_met",
      },
      {
        id: "rc4-3",
        text: "AiQL reasoning-driven alerts operational",
        status: "not_met",
      },
    ],
    description:
      "Partial capitation for primary care and specialist services. Full population health accountability. This is the long-term target state of the transformation.",
  },
];

/* ── Transformation projects list ────────────────────────────────────────── */
const TRANSFORM_PROJECTS = [
  {
    id: "TXFM-001",
    contractName: "CNHI-PSMMC Comprehensive Services",
    provider: "PSMMC Riyadh",
    originalRef: "CNHI-SA-2024-0142",
    annualValue: 176000000,
    lives: 47000,
    currentStep: 1,
    maxStep: 6,
    status: "analysed", // uploaded > analysed > path_selected > planned
    uploadedDate: "2026-05-01",
    maturityScore: 9,
    selectedPath: null,
  },
];

export {
  SYNTHETIC_CONTRACT,
  GAP_DIMENSIONS,
  OVERALL_MATURITY,
  TRANSFORM_PATHS,
  FINANCIAL_IMPACT,
  DIFF_SECTIONS,
  PHASES,
  TRANSFORM_PROJECTS,
};
