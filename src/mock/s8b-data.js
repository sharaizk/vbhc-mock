/* ============================================================================
   ValueOS — Session 8B: Score Operations & Reasoning Trace Explorer — Data
   ============================================================================ */

/* ── Statistical Methodology ─────────────────────────────────────────────── */
const S8B_METHODOLOGY = {
  id: "D1-001",
  name: "HbA1c Control Rate",
  steward: "ADA / AiQL",
  nqfId: "NQF #0059",
  evidenceBase:
    "Strong evidence from UKPDS and ACCORD trials demonstrates that sustained HbA1c control below 7.0% reduces risk of microvascular complications by 25–35% over 10 years. ADA Standards of Care (2024) designate HbA1c <7.0% as the primary glycaemic target for most non-pregnant adults with T2DM. ICHOM Type 2 Diabetes Standard Set v3.2 includes HbA1c control rate as a core outcome variable (OV.GLY.01).",
  intendedPopulation:
    "Adults aged 18–75 with confirmed Type 2 Diabetes Mellitus (ICD-10-AM E11.x) who have been attributed to the reporting provider for a minimum of 12 months prior to the measurement period end date, with at least one face-to-face or telehealth encounter during the measurement period.",
  numeratorDef:
    "Patients with a most recent HbA1c laboratory result documented in the measurement period (January 1 – December 31, 2025) with a value strictly less than 7.0%. Where multiple results exist within the period, only the chronologically most recent result is used. HbA1c must be expressed as a percentage (UCUM unit: %).",
  denominatorDef:
    "Patients with an active ICD-10-AM E11.x diagnosis (Type 2 Diabetes Mellitus) recorded by the attributed provider, with at least one qualifying encounter (outpatient, ambulatory, or telehealth) during the measurement period, and with continuous attribution for ≥12 months. Attribution follows the primary care assignment model (CNHI Registry).",
  exclusions: [
    {
      n: 1,
      text: "Gestational diabetes (ICD-10-AM O24.x) — patient excluded from denominator at encounter level.",
      logic: "EXCLUDE WHERE dx_code LIKE 'O24%'",
    },
    {
      n: 2,
      text: "Hospice or palliative care enrolment — patient excluded from denominator.",
      logic: "EXCLUDE WHERE hospice_flag = TRUE OR palliative_flag = TRUE",
    },
    {
      n: 3,
      text: "<90 days continuous enrolment in measurement period — patient excluded.",
      logic: "EXCLUDE WHERE attribution_days < 90",
    },
    {
      n: 4,
      text: "Type 1 Diabetes Mellitus (E10.x) — patient excluded from denominator.",
      logic: "EXCLUDE WHERE dx_code LIKE 'E10%'",
    },
    {
      n: 5,
      text: "Age < 18 or > 75 at end of measurement period — excluded per intended population.",
      logic: "EXCLUDE WHERE age_at_period_end < 18 OR age_at_period_end > 75",
    },
  ],
  dataElements: [
    {
      name: "HbA1c laboratory result",
      source: "EMR — Epic Clarity",
      format: "Numeric (%)",
      range: "3.0 – 20.0",
    },
    {
      name: "HbA1c result date",
      source: "EMR — Epic Clarity",
      format: "Date (ISO 8601)",
      range: "Within period",
    },
    {
      name: "T2DM diagnosis code",
      source: "EMR — Epic Clarity",
      format: "ICD-10-AM E11.x",
      range: "Active diagnosis",
    },
    {
      name: "Encounter record",
      source: "Claims — NPHIES",
      format: "Encounter type",
      range: "Outpatient/Ambulatory",
    },
    {
      name: "Attribution start date",
      source: "CNHI Registry",
      format: "Date (ISO 8601)",
      range: "≥90d before period end",
    },
    {
      name: "Patient age",
      source: "Civil Registry",
      format: "Integer (years)",
      range: "18 – 75",
    },
    {
      name: "Hospice/palliative flag",
      source: "EMR — Epic Clarity",
      format: "Boolean",
      range: "TRUE / FALSE",
    },
    {
      name: "Gestational diabetes flag",
      source: "EMR — Epic Clarity",
      format: "ICD-10-AM O24.x",
      range: "Present/Absent",
    },
  ],
  riskAdjModel: {
    type: "Logistic regression (provider-level, shrinkage-adjusted)",
    cStatistic: 0.74,
    hlPValue: 0.38,
    calibrationSlope: 0.97,
    coefficients: [
      {
        covariate: "Age (per year)",
        coeff: 0.023,
        or: 1.02,
        ci95: "[0.96, 1.08]",
      },
      {
        covariate: "Gender (male)",
        coeff: -0.15,
        or: 0.86,
        ci95: "[0.74, 1.00]",
      },
      {
        covariate: "Charlson Comorbidity Index",
        coeff: 0.31,
        or: 1.36,
        ci95: "[1.18, 1.57]",
      },
      {
        covariate: "BMI (per unit)",
        coeff: 0.08,
        or: 1.08,
        ci95: "[1.03, 1.14]",
      },
      {
        covariate: "Depression comorbidity",
        coeff: 0.42,
        or: 1.52,
        ci95: "[1.21, 1.91]",
      },
      {
        covariate: "Low socioeconomic status",
        coeff: 0.19,
        or: 1.21,
        ci95: "[1.02, 1.43]",
      },
    ],
  },
  minDenominator: 30,
  providerDenominators: [
    { id: "P01", name: "Dr. Fatima Al-Khalil", den: 340, below: false },
    { id: "P02", name: "Dr. Omar Al-Rashidi", den: 287, below: false },
    { id: "P03", name: "Dr. Nour Al-Zahrani", den: 312, below: false },
    { id: "P04", name: "Dr. Khalid Al-Mutairi", den: 28, below: true },
    { id: "P05", name: "Dr. Sarah Al-Dosari", den: 198, below: false },
    { id: "P06", name: "Dr. Mohammed Al-Harbi", den: 44, below: false },
    { id: "P07", name: "Dr. Layla Al-Qahtani", den: 33, below: false },
    { id: "P08", name: "Dr. Ahmed Al-Shehri", den: 142, below: false },
    { id: "P09", name: "Dr. Hanan Al-Otaibi", den: 267, below: false },
    { id: "P10", name: "Dr. Youssef Al-Ghamdi", den: 249, below: false },
  ],
  ci: {
    method: "Wilson score interval for proportions",
    pointEstimate: 78.1,
    ciLow: 73.2,
    ciHigh: 82.8,
    target: 65,
    overlapsTarget: false,
    significance:
      "CI does not overlap target threshold — score difference is statistically significant at 95% level",
    networkMean: { est: 72.4, lo: 70.1, hi: 74.7 },
    peerMean: { est: 74.2, lo: 71.8, hi: 76.6 },
  },
  truncation: {
    p5value: 52.4,
    p95value: 91.2,
    currentScore: 78.1,
    affected: false,
    original: null,
    truncated: null,
    networkScores: [
      52, 55, 58, 60, 62, 63, 65, 66, 68, 70, 71, 72, 73, 74, 75, 76, 77, 78,
      80, 82, 83, 85, 87, 88, 90, 91, 92,
    ],
  },
  versionHistory: [
    {
      version: "v1.0",
      date: "01 Jan 2023",
      summary:
        "Initial specification. Denominator defined as T2DM patients with ≥1 encounter.",
      changedBy: "ICHOM Technical Committee",
      impact: "Baseline — no prior version for comparison.",
    },
    {
      version: "v1.1",
      date: "01 Jul 2023",
      summary:
        "Added hospice and palliative care exclusion criterion. Previously, hospice patients were included in denominator, artificially suppressing scores.",
      changedBy: "AiQL Clinical Advisory Board",
      impact:
        "Adding hospice exclusion removed ~12 patients from denominators network-wide, increasing average scores by 0.8pp.",
    },
    {
      version: "v2.0",
      date: "01 Jan 2025",
      summary:
        "Denominator updated to require ≥12 months attribution (previously ≥90 days). Numerator restricted to most recent HbA1c only (previously any result in period). Risk adjustment model upgraded from linear to logistic regression.",
      changedBy: "AiQL / ADA Joint Review",
      impact:
        "Denominator requirement change reduced average denominator by ~18%. Numerator restriction increased score variance. Model upgrade improved C-statistic from 0.68 to 0.74.",
    },
  ],
};

/* ── Data Lineage ─────────────────────────────────────────────────────────── */
const S8B_LINEAGE = {
  elements: [
    {
      name: "HbA1c lab result",
      source: "EMR — Epic Clarity",
      ts: "2025-12-15 03:22:41 UTC",
      status: "pass",
      refresh: "2025-12-15",
      records: 4832,
    },
    {
      name: "Encounter record",
      source: "Claims — NPHIES",
      ts: "2025-12-15 03:45:12 UTC",
      status: "pass",
      refresh: "2025-12-15",
      records: 1247,
    },
    {
      name: "T2DM diagnosis code",
      source: "EMR — Epic Clarity",
      ts: "2025-12-15 03:22:41 UTC",
      status: "pass",
      refresh: "2025-12-15",
      records: 8920,
    },
    {
      name: "Attribution record",
      source: "CNHI Registry",
      ts: "2025-12-14 22:00:00 UTC",
      status: "warn",
      refresh: "2025-12-14",
      records: 340,
    },
    {
      name: "Patient age",
      source: "Civil Registry",
      ts: "2025-12-13 08:00:00 UTC",
      status: "pass",
      refresh: "2025-12-13",
      records: 340,
    },
    {
      name: "Hospice flag",
      source: "EMR — Epic Clarity",
      ts: "2025-12-15 03:22:41 UTC",
      status: "pass",
      refresh: "2025-12-15",
      records: 12,
    },
    {
      name: "Gestational DM flag",
      source: "EMR — Epic Clarity",
      ts: "2025-12-15 03:22:41 UTC",
      status: "pass",
      refresh: "2025-12-15",
      records: 3,
    },
    {
      name: "Ordering provider link",
      source: "Claims — NPHIES",
      ts: "2025-12-15 03:45:12 UTC",
      status: "warn",
      refresh: "2025-12-15",
      records: 4829,
    },
    {
      name: "SES proxy (postal code)",
      source: "CNHI Registry",
      ts: "2025-11-01 00:00:00 UTC",
      status: "fail",
      refresh: "2025-11-01",
      records: 318,
    },
    {
      name: "Charlson index",
      source: "AiQL Derived",
      ts: "2025-12-15 04:00:00 UTC",
      status: "pass",
      refresh: "2025-12-15",
      records: 340,
    },
  ],
  quality: {
    "HbA1c lab result": {
      completeness: 99.2,
      conformance: 98.7,
      plausibility: 99.1,
      timeliness: "Current — 0 days",
    },
    "Encounter record": {
      completeness: 97.4,
      conformance: 99.2,
      plausibility: 98.8,
      timeliness: "Current — 0 days",
    },
    "T2DM diagnosis code": {
      completeness: 100,
      conformance: 99.8,
      plausibility: 99.5,
      timeliness: "Current — 0 days",
    },
    "Attribution record": {
      completeness: 94.1,
      conformance: 96.3,
      plausibility: 98.2,
      timeliness: "Current — 1 day",
    },
    "Patient age": {
      completeness: 100,
      conformance: 100,
      plausibility: 99.7,
      timeliness: "Current — 2 days",
    },
    "Hospice flag": {
      completeness: 98.8,
      conformance: 100,
      plausibility: 100,
      timeliness: "Current — 0 days",
    },
    "Gestational DM flag": {
      completeness: 100,
      conformance: 100,
      plausibility: 100,
      timeliness: "Current — 0 days",
    },
    "Ordering provider link": {
      completeness: 99.9,
      conformance: 87.4,
      plausibility: 95.1,
      timeliness: "Current — 0 days",
    },
    "SES proxy (postal code)": {
      completeness: 93.5,
      conformance: 82.1,
      plausibility: 91.0,
      timeliness: "STALE — 44 days",
    },
    "Charlson index": {
      completeness: 100,
      conformance: 98.9,
      plausibility: 99.4,
      timeliness: "Current — 0 days",
    },
  },
  chain: [
    {
      id: "n1",
      title: "Raw Data Sources",
      value: "EMR · Claims · Registry",
      status: "success",
      x: 0,
      detail: {
        inputs: [],
        logic:
          "AiQL pipeline connects to 4 source systems via HL7 FHIR R4 APIs and NPHIES claims feed. Data pulled nightly via scheduled extraction jobs.",
        output:
          "4 source system connections active. Last full sync: 2025-12-15 03:00 UTC.",
        assumptions: [],
        alternatives: [],
      },
    },
    {
      id: "n2",
      title: "Data Extraction",
      value: "4,832 lab · 1,247 enc · 340 pts",
      status: "success",
      x: 1,
      detail: {
        inputs: [
          {
            name: "EMR (Epic Clarity)",
            src: "Source Systems",
            count: "8,920 diagnoses, 4,832 HbA1c results",
          },
          {
            name: "Claims (NPHIES)",
            src: "Source Systems",
            count: "1,247 encounter records",
          },
          {
            name: "CNHI Registry",
            src: "Source Systems",
            count: "340 attributed patients",
          },
        ],
        logic:
          "Extract all records for attributed patients (CNHI provider ID: PSMMC-01842) for the measurement period 2025-01-01 to 2025-12-31. Apply date filters at source.",
        output:
          "4,832 HbA1c lab records extracted. 1,247 encounter records. 340 patient records. 0 extraction failures.",
        assumptions: [],
        alternatives: [],
      },
    },
    {
      id: "n3",
      title: "Validation & Cleaning",
      value: "4,801 passed · 31 flagged",
      status: "assumption",
      x: 2,
      detail: {
        inputs: [
          { name: "Raw HbA1c results", src: "Extraction", count: "4,832" },
          { name: "Encounter records", src: "Extraction", count: "1,247" },
        ],
        logic:
          "Validate HbA1c values (3.0–20.0%), remove duplicates (same patient, same date, same lab value), flag out-of-range, exclude records with missing patient IDs.",
        output:
          "4,801 valid records. 31 flagged: 18 out-of-range winsorized to 20.0%, 8 duplicate records removed, 5 missing patient IDs excluded.",
        assumptions: [
          {
            sev: "warn",
            text: "18 HbA1c results above 20.0% winsorized to 20.0% per AiQL winsorization policy. These likely represent data entry errors.",
          },
          {
            sev: "info",
            text: "8 exact duplicate records (same patient/date/value) removed. Likely caused by dual-feed from EMR and claims.",
          },
        ],
        alternatives: [],
      },
    },
    {
      id: "n4",
      title: "Graph Node Creation",
      value: "340 Patient · 4,796 Lab · 1,203 Enc",
      status: "success",
      x: 3,
      detail: {
        inputs: [
          { name: "Validated lab records", src: "Validation", count: "4,801" },
          { name: "Validated encounters", src: "Validation", count: "1,247" },
          { name: "Patient attribution", src: "Extraction", count: "340" },
        ],
        logic:
          "Create Patient, LabResult, and Encounter nodes in AiQL knowledge graph. Link LabResult → Patient, Encounter → Patient, LabResult → OrderingProvider via graph edges.",
        output:
          "340 Patient nodes, 4,796 LabResult nodes, 1,203 Encounter nodes, 18,442 edges created.",
        assumptions: [
          {
            sev: "warn",
            text: "3 HbA1c results had no matching encounter record. Linked to attributed provider based on ordering provider match — assumed ordered by Dr. Al-Khalil.",
          },
        ],
        alternatives: [],
      },
    },
    {
      id: "n5",
      title: "Measure Logic",
      value: "Den: 340 · Excl: 47 · Num: 252",
      status: "success",
      x: 4,
      detail: {
        inputs: [
          { name: "Patient nodes", src: "Graph Population", count: "340" },
          {
            name: "Most recent HbA1c per patient",
            src: "Graph Population",
            count: "340",
          },
          { name: "Exclusion flags", src: "Graph Population", count: "47" },
        ],
        logic:
          "For each patient: (1) Apply exclusion criteria — remove hospice (7), gestational DM (3), age violations (2), <90d enrolment (35). (2) Denominator = 340 - 0 (exclusions already pre-filtered in attribution) wait — apply inline: denominator = patients passing all exclusion criteria. (3) Numerator = denominator patients with most recent HbA1c < 7.0%.",
        output:
          "Denominator: 340 patients (47 excluded from initial pool). Numerator: 252 patients with HbA1c < 7.0%. Exclusions: 18 hospice, 5 gestational DM, 24 <90d enrollment.",
        assumptions: [
          {
            sev: "info",
            text: "12 patients had multiple HbA1c results in period. Most recent result used per measure specification.",
          },
        ],
        alternatives: [
          {
            scenario: "Exclude zero-encounter patients",
            raw: "69.2%",
            adj: "73.5%",
            tier: "At Target",
          },
          {
            scenario: "Any HbA1c in period (not most recent)",
            raw: "71.5%",
            adj: "75.4%",
            tier: "At Target",
          },
        ],
      },
    },
    {
      id: "n6",
      title: "Raw Score",
      value: "252 ÷ 340 = 74.1%",
      status: "success",
      x: 5,
      detail: {
        inputs: [
          { name: "Numerator", src: "Measure Logic", count: "252" },
          { name: "Denominator", src: "Measure Logic", count: "340" },
        ],
        logic:
          "raw_rate = numerator / denominator = 252 / 340 = 0.7412. Expressed as percentage: 74.1%. Wilson score 95% CI: [69.1%, 78.6%].",
        output:
          "Raw rate: 74.1%. 95% CI: [69.1%, 78.6%]. No truncation applied (score within p5–p95 range).",
        assumptions: [],
        alternatives: [],
      },
    },
    {
      id: "n7",
      title: "Risk Adjustment",
      value: "Factor 1.054 → 78.1%",
      status: "assumption",
      x: 6,
      detail: {
        inputs: [
          { name: "Raw rate", src: "Raw Score", count: "74.1%" },
          {
            name: "Provider case-mix profile",
            src: "Graph Population",
            count: "6 variables",
          },
        ],
        logic:
          "Apply AiQL Case-Mix Model v2.1 (logistic regression). Predict expected rate given panel demographics. O/E ratio = 74.1% / 70.3% expected = 1.054. Adjusted rate = raw × O/E = 74.1% × 1.054 = 78.1%.",
        output:
          "Risk adjustment factor: 1.054. Adjusted rate: 78.1%. Adjustment adds +4.0pp. Provider's panel is harder than average (Charlson 2.8 vs 2.3, mean age 54.2 vs 51.7).",
        assumptions: [
          {
            sev: "warn",
            text: "SES proxy (postal code) data was stale (44 days). SES coefficient applied using last known values. If refreshed, adjustment factor may change by ±0.01.",
          },
          {
            sev: "info",
            text: "Model applies provider-level shrinkage to reduce regression-to-mean bias for providers with smaller panels.",
          },
        ],
        alternatives: [
          {
            scenario: "ICHOM standard case-mix",
            raw: "74.1%",
            adj: "76.8%",
            tier: "At Target",
          },
          {
            scenario: "No risk adjustment",
            raw: "74.1%",
            adj: "74.1%",
            tier: "At Target",
          },
        ],
      },
    },
    {
      id: "n8",
      title: "Threshold Evaluation",
      value: "78.1% vs Target 65% — EXCEEDS",
      status: "success",
      x: 7,
      detail: {
        inputs: [
          { name: "Adjusted rate", src: "Risk Adjustment", count: "78.1%" },
          {
            name: "Thresholds",
            src: "Contract C1",
            count: "Floor:50%, Target:65%, Stretch:80%",
          },
        ],
        logic:
          "Compare adjusted rate against contract thresholds: adjusted ≥ stretch (80%) → Exceeds; adjusted ≥ target (65%) → At Target; adjusted ≥ floor (50%) → Below Target; else → Below Floor.",
        output:
          "78.1% ≥ 65% (target) but 78.1% < 80% (stretch) → Status: AT TARGET. Distance to stretch: 1.9pp. Distance above target: 13.1pp.",
        assumptions: [],
        alternatives: [],
      },
    },
    {
      id: "n9",
      title: "Composite Contribution",
      value: "D1 score 95 × 30% = +28.5 pts",
      status: "success",
      x: 8,
      detail: {
        inputs: [
          {
            name: "D1 dimension score",
            src: "Multiple measures",
            count: "95 (weighted avg of D1 measures)",
          },
          { name: "D1 contract weight", src: "Contract C1", count: "30%" },
        ],
        logic:
          "D1 dimension score = weighted average of all 6 D1 measures' normalized scores = 95. Composite contribution = 95 × 0.30 = 28.5 points toward the 100-point composite.",
        output:
          "D1 contributes 28.5 points to the composite score of 92. This is the largest single dimension contribution.",
        assumptions: [],
        alternatives: [],
      },
    },
  ],
};

/* ── Score Approval Audit Log ────────────────────────────────────────────── */
const S8B_AUDIT_LOG = [
  {
    ts: "16 Jan 2026 09:14",
    user: "Fatima Al-Rashid",
    role: "Compliance Officer",
    action: "Bulk Approved",
    measure: "14 Auto-Validated measures",
    prevVal: null,
    newVal: null,
    reason: null,
    justification:
      "All 14 measures passed automated validation checks. Denominator above minimum. No outlier flags.",
  },
  {
    ts: "16 Jan 2026 09:16",
    user: "Fatima Al-Rashid",
    role: "Compliance Officer",
    action: "Flagged for Review",
    measure: "D1-005, D3-003, D7-003",
    prevVal: null,
    newVal: null,
    reason: null,
    justification:
      "3 measures flagged: D1-005 denominator near minimum (34), D3-003 below target (2nd consecutive period), D7-003 attribution dispute pending.",
  },
  {
    ts: "16 Jan 2026 14:02",
    user: "Mohammed Al-Qahtani",
    role: "Analyst",
    action: "Approved",
    measure: "D1-005: Depression Remission Rate",
    prevVal: null,
    newVal: null,
    reason: null,
    justification:
      "Reviewed denominator — 34 patients is above minimum of 30. Score variance acceptable given small panel. Approved.",
  },
  {
    ts: "16 Jan 2026 14:48",
    user: "Mohammed Al-Qahtani",
    role: "Analyst",
    action: "Approved",
    measure: "D3-003: Care Coordination Experience",
    prevVal: null,
    newVal: null,
    reason: null,
    justification:
      "Below-target status confirmed. No data quality issue — reflects genuine care coordination gap. Approved for settlement with flag for provider improvement plan.",
  },
  {
    ts: "17 Jan 2026 11:23",
    user: "Mohammed Al-Qahtani",
    role: "Analyst",
    action: "Overridden",
    measure: "D7-003: 30-Day Readmission Rate",
    prevVal: "14.2%",
    newVal: "11.8%",
    reason: "Attribution dispute resolved — patient removed",
    justification:
      "Attribution dispute DR-2025-047 resolved. 3 patients removed from denominator: 2 attributed to AFHSR facility (out-of-area), 1 readmission for unrelated surgical complication. Denominator adjusted from 87 to 84, numerator from 12 to 10.",
  },
  {
    ts: "18 Jan 2026 10:05",
    user: "Nora Al-Rashidi",
    role: "Contract Manager",
    action: "Approved",
    measure: "D7-003: 30-Day Readmission Rate (Override)",
    prevVal: null,
    newVal: null,
    reason: null,
    justification:
      "Reviewed dispute resolution DR-2025-047. Override documented and approved. Adjusted rate 11.8% confirmed.",
  },
  {
    ts: "18 Jan 2026 10:08",
    user: "Nora Al-Rashidi",
    role: "Contract Manager",
    action: "Locked",
    measure: "All 25 measures — Q4 2025",
    prevVal: null,
    newVal: null,
    reason: null,
    justification:
      "All 25 measures approved or overridden. Composite score 92 locked for Q4 2025 settlement. Payment computation triggered.",
  },
  {
    ts: "18 Jan 2026 10:09",
    user: "AiQL System",
    role: "System",
    action: "Payment Triggered",
    measure: "Composite 92 — Exceeds Stretch",
    prevVal: null,
    newVal: null,
    reason: null,
    justification:
      "Composite score 92 (Exceeds Stretch tier) triggers full performance bonus. Estimated payment: SAR 1,840,000. Settlement date: 15 Apr 2026.",
  },
];

/* ── Sensitivity Analysis ─────────────────────────────────────────────────── */
const S8B_SENSITIVITY = {
  baseScore: 78.1,
  baseTier: "At Target",
  missingData: [
    {
      label: "Non-compliant (current)",
      raw: 74.1,
      adj: 78.1,
      tier: "At Target",
      current: true,
    },
    {
      label: "Exclude from denominator",
      raw: 74.8,
      adj: 78.8,
      tier: "At Target",
      current: false,
    },
    {
      label: "Impute last known value",
      raw: 72.3,
      adj: 76.2,
      tier: "At Target",
      current: false,
    },
  ],
  exclusions: [
    { id: "ex1", label: "Gestational DM (O24.x)", active: true, adj: 78.1 },
    { id: "ex2", label: "Hospice / palliative", active: true, adj: 78.1 },
    { id: "ex3", label: "<90 days attribution", active: true, adj: 76.8 },
    { id: "ex4", label: "Age <18 or >75", active: true, adj: 78.3 },
    { id: "ex5", label: "T1DM (E10.x)", active: true, adj: 78.1 },
  ],
  riskModels: [
    {
      label: "AiQL Case-Mix v2.1 (current)",
      adj: 78.1,
      tier: "At Target",
      current: true,
    },
    {
      label: "ICHOM Standard Case-Mix",
      adj: 76.8,
      tier: "At Target",
      current: false,
    },
    {
      label: "No Risk Adjustment (raw)",
      adj: 74.1,
      tier: "At Target",
      current: false,
    },
  ],
  attribution: [
    {
      label: "Primary care assignment (current)",
      den: 340,
      num: 252,
      raw: 74.1,
      adj: 78.1,
      tier: "At Target",
      current: true,
    },
    {
      label: "Plurality of visits",
      den: 312,
      num: 232,
      raw: 74.4,
      adj: 78.4,
      tier: "At Target",
      current: false,
    },
    {
      label: "Encounter-based (any encounter)",
      den: 387,
      num: 278,
      raw: 71.8,
      adj: 75.7,
      tier: "At Target",
      current: false,
    },
    {
      label: "Geographic (facility catchment)",
      den: 295,
      num: 191,
      raw: 64.7,
      adj: 68.2,
      tier: "Below Target",
      current: false,
    },
  ],
  // The range is 64.7–78.8 across all scenarios; tier changes in 2 scenarios (attribution geographic)
  tierChanges: 2,
  sensitivityRange: [64.7, 78.8],
  stable: false,
};

/* ── DAG Nodes for Reasoning Trace Explorer (Screen 3.5) ─────────────────── */
const S8B_DAG_NODES = [
  {
    id: "ds",
    title: "Data Sources",
    value: "EMR · Claims · CNHI Registry · AiQL",
    status: "success",
  },
  {
    id: "ext",
    title: "Extraction",
    value: "4,832 lab · 1,247 enc · 340 pts",
    status: "success",
  },
  {
    id: "gph",
    title: "Graph Population",
    value: "340 Patients · 4,796 Labs · 18,442 edges",
    status: "success",
  },
  {
    id: "mls",
    title: "Measure Logic",
    value: "HbA1c < 7.0% ÷ T2DM patients with ≥1 enc",
    status: "success",
  },
  {
    id: "nd",
    title: "Num / Den",
    value: "Numerator: 252 · Denominator: 340 · Excl: 47",
    status: "success",
  },
  {
    id: "raw",
    title: "Raw Score",
    value: "252 ÷ 340 = 74.1%",
    status: "success",
  },
  {
    id: "ra",
    title: "Risk Adjustment",
    value: "Factor 1.054 → 78.1%",
    status: "assumption",
  },
  {
    id: "thr",
    title: "Threshold Evaluation",
    value: "78.1% vs Target 65% → At Target",
    status: "success",
  },
  {
    id: "cmp",
    title: "Composite Contribution",
    value: "D1 × 30% = +28.5 pts → Composite 92",
    status: "success",
  },
];

/* ── Measure approval states (for L3-C) ──────────────────────────────────── */
const S8B_APPROVAL_STATES = {
  "D1-001": { valStatus: "auto", approvalStatus: "locked" },
  "D1-002": { valStatus: "auto", approvalStatus: "locked" },
  "D1-003": { valStatus: "auto", approvalStatus: "locked" },
  "D1-004": { valStatus: "auto", approvalStatus: "locked" },
  "D1-005": { valStatus: "review", approvalStatus: "locked" },
  "D1-006": { valStatus: "auto", approvalStatus: "locked" },
  "D2-001": { valStatus: "auto", approvalStatus: "locked" },
  "D2-002": { valStatus: "auto", approvalStatus: "locked" },
  "D2-003": { valStatus: "auto", approvalStatus: "locked" },
  "D2-004": { valStatus: "auto", approvalStatus: "locked" },
  "D3-001": { valStatus: "auto", approvalStatus: "locked" },
  "D3-002": { valStatus: "auto", approvalStatus: "locked" },
  "D3-003": { valStatus: "review", approvalStatus: "locked" },
  "D5-001": { valStatus: "auto", approvalStatus: "locked" },
  "D5-002": { valStatus: "auto", approvalStatus: "locked" },
  "D5-003": { valStatus: "auto", approvalStatus: "locked" },
  "D5-004": { valStatus: "auto", approvalStatus: "locked" },
  "D5-005": { valStatus: "auto", approvalStatus: "locked" },
  "D7-001": { valStatus: "auto", approvalStatus: "locked" },
  "D7-002": { valStatus: "auto", approvalStatus: "locked" },
  "D7-003": { valStatus: "override", approvalStatus: "locked" },
  "D7-004": { valStatus: "auto", approvalStatus: "locked" },
  "D9-001": { valStatus: "auto", approvalStatus: "locked" },
  "D9-002": { valStatus: "review", approvalStatus: "locked" },
  "D9-003": { valStatus: "auto", approvalStatus: "locked" },
};

export {
  S8B_METHODOLOGY,
  S8B_LINEAGE,
  S8B_AUDIT_LOG,
  S8B_SENSITIVITY,
  S8B_DAG_NODES,
  S8B_APPROVAL_STATES,
};
