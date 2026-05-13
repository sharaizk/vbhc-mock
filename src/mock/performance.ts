/* ============================================================================
   ValueOS — Session 8: Provider Performance Dashboard — Synthetic Data
   All numbers internally consistent; composite = Σ(dim_score × weight)
   ============================================================================ */

const DIMENSIONS = {
  D1: { name: "Clinical Outcomes", short: "Clinical", color: "#3E91DB" },
  D2: { name: "Patient-Reported Outcomes", short: "PROMs", color: "#7B68EE" },
  D3: { name: "Patient Experience", short: "Experience", color: "#D34F8E" },
  D4: { name: "Safety & Harm", short: "Safety", color: "#BF3A39" },
  D5: { name: "Process Quality", short: "Process", color: "#C28F2C" },
  D6: { name: "Access & Timeliness", short: "Access", color: "#4C8C4D" },
  D7: { name: "Cost & Utilization", short: "Cost", color: "#228BA0" },
  D8: { name: "Care Coordination", short: "Coordination", color: "#8B6FF0" },
  D9: { name: "Health Equity", short: "Equity", color: "#9B7B3A" },
  D10: { name: "Data Quality", short: "Data Quality", color: "#6B8CA8" },
};

const PROVIDERS = [
  {
    id: "P01",
    name: "Dr. Fatima Al-Khalil",
    specialty: "Endocrinology",
    facility: "PSMMC Riyadh",
    tier: 1,
    composite: 92,
    panel: 340,
    cred: "Active",
    contracts: ["C1", "C4", "C5"],
  },
  {
    id: "P02",
    name: "Dr. Omar Al-Rashidi",
    specialty: "Internal Medicine",
    facility: "PSMMC Riyadh",
    tier: 1,
    composite: 84,
    panel: 520,
    cred: "Active",
    contracts: ["C1", "C5"],
  },
  {
    id: "P03",
    name: "Dr. Nour Al-Zahrani",
    specialty: "Family Medicine",
    facility: "KFAFH Jeddah",
    tier: 2,
    composite: 78,
    panel: 480,
    cred: "Active",
    contracts: ["C1"],
  },
  {
    id: "P04",
    name: "Dr. Khalid Al-Mutairi",
    specialty: "Cardiology",
    facility: "PSMMC Riyadh",
    tier: 2,
    composite: 76,
    panel: 290,
    cred: "Active",
    contracts: ["C4"],
  },
  {
    id: "P05",
    name: "Dr. Sarah Al-Dosari",
    specialty: "Psychiatry",
    facility: "AFHO Dhahran",
    tier: 2,
    composite: 74,
    panel: 310,
    cred: "Active",
    contracts: ["C1"],
  },
  {
    id: "P06",
    name: "Dr. Mohammed Al-Harbi",
    specialty: "Orthopedics",
    facility: "KFAFH Jeddah",
    tier: 2,
    composite: 71,
    panel: 260,
    cred: "Active",
    contracts: ["C2"],
  },
  {
    id: "P07",
    name: "Dr. Layla Al-Qahtani",
    specialty: "OB/GYN",
    facility: "Al-Hada Taif",
    tier: 2,
    composite: 70,
    panel: 195,
    cred: "Active",
    contracts: ["C3"],
  },
  {
    id: "P08",
    name: "Dr. Ahmed Al-Shehri",
    specialty: "General Surgery",
    facility: "AFHSR Khamis Mushait",
    tier: 3,
    composite: 65,
    panel: 230,
    cred: "Active",
    contracts: ["C2"],
  },
  {
    id: "P09",
    name: "Dr. Hanan Al-Otaibi",
    specialty: "Family Medicine",
    facility: "AFHO Dhahran",
    tier: 3,
    composite: 62,
    panel: 410,
    cred: "Probation",
    contracts: ["C1"],
  },
  {
    id: "P10",
    name: "Dr. Youssef Al-Ghamdi",
    specialty: "Internal Medicine",
    facility: "AFHSR Khamis Mushait",
    tier: 3,
    composite: 55,
    panel: 380,
    cred: "Probation",
    contracts: ["C1", "C5"],
  },
];

const CONTRACTS = [
  {
    id: "C1",
    name: "Primary Care Performance Contract",
    sub: "Diabetes + Depression — ICHOM Sets",
    dims: { D1: 30, D2: 20, D3: 10, D5: 15, D7: 15, D9: 10 },
    settle: "Apr 15 2025",
  },
  {
    id: "C2",
    name: "Surgical Excellence Contract",
    sub: "Hip & Knee OA — ICHOM Set",
    dims: { D1: 25, D2: 20, D4: 20, D5: 15, D7: 15, D10: 5 },
    settle: "Jun 30 2025",
  },
  {
    id: "C3",
    name: "Maternal Health Contract",
    sub: "Pregnancy & Childbirth — ICHOM Set",
    dims: { D1: 25, D2: 15, D4: 20, D5: 15, D6: 10, D8: 15 },
    settle: "Jun 30 2025",
  },
  {
    id: "C4",
    name: "Cardiac Outcomes Contract",
    sub: "Coronary Artery Disease — ICHOM Set",
    dims: { D1: 30, D2: 15, D4: 15, D5: 20, D7: 15, D10: 5 },
    settle: "Jun 30 2025",
  },
  {
    id: "C5",
    name: "Integrated Care Contract",
    sub: "Diabetes + Depression + CAD",
    dims: { D1: 25, D2: 15, D3: 10, D5: 15, D7: 15, D8: 10, D9: 10 },
    settle: "Jun 30 2025",
  },
];

const PERIODS = ["Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025"];

/* ── Measures for Contract 1 ──────────────────────────────────────────────── */
const MEASURES_C1 = [
  // D1 Clinical Outcomes (30%)
  {
    id: "D1-001",
    dim: "D1",
    name: "HbA1c Control Rate",
    shortName: "HbA1c Control",
    num: "Patients with HbA1c < 7.0% at annual assessment",
    den: "Attributed T2DM patients with ≥1 HbA1c measurement in period",
    excl: "T1DM, age <18, <6 months attribution, hospice",
    source: "EMR / Lab",
    method: "AiQL pipeline extraction",
    steward: "ADA / AiQL",
    target: 65,
    floor: 50,
    stretch: 80,
    unit: "%",
    lowerBetter: false,
  },
  {
    id: "D1-002",
    dim: "D1",
    name: "LDL Control Rate",
    shortName: "LDL Control",
    num: "Patients with LDL < 100 mg/dL at most recent lab",
    den: "Attributed T2DM patients with ≥1 LDL result",
    excl: "Familial hypercholesterolaemia, age <18",
    source: "Lab system",
    method: "Direct lab extraction",
    steward: "ADA",
    target: 60,
    floor: 45,
    stretch: 75,
    unit: "%",
    lowerBetter: false,
  },
  {
    id: "D1-003",
    dim: "D1",
    name: "Blood Pressure Control Rate",
    shortName: "BP Control",
    num: "Patients with BP < 140/90 mmHg at last reading",
    den: "Attributed patients with ≥1 BP reading",
    excl: "ESRD, age <18",
    source: "EMR",
    method: "EMR extraction, most recent reading",
    steward: "ADA / JNC8",
    target: 70,
    floor: 55,
    stretch: 85,
    unit: "%",
    lowerBetter: false,
  },
  {
    id: "D1-004",
    dim: "D1",
    name: "Retinopathy Screening Rate",
    shortName: "Retinopathy Screen",
    num: "Patients with retinal exam by ophthalmology or optometry",
    den: "Attributed T2DM patients with ≥12 months attribution",
    excl: "Prior total vision loss, age <18",
    source: "EMR / Referral system",
    method: "Referral completion tracking",
    steward: "ADA",
    target: 75,
    floor: 60,
    stretch: 90,
    unit: "%",
    lowerBetter: false,
  },
  {
    id: "D1-005",
    dim: "D1",
    name: "Depression Remission Rate",
    shortName: "Depression Remission",
    num: "Patients with PHQ-9 <5 at 12mo (baseline PHQ-9 ≥10)",
    den: "Patients with PHQ-9 ≥10 at baseline with 12mo follow-up",
    excl: "Psychosis, bipolar I, active suicidality requiring inpatient",
    source: "EMR / PHQ-9 platform",
    method: "PHQ-9 platform + EMR",
    steward: "ICHOM / APA",
    target: 35,
    floor: 20,
    stretch: 50,
    unit: "%",
    lowerBetter: false,
  },
  {
    id: "D1-006",
    dim: "D1",
    name: "Diabetes Complication Rate",
    shortName: "Complication Rate",
    num: "Patients with ≥1 major complication (DKA, hyperglycaemic hosp., new ESRD, amputation)",
    den: "All attributed T2DM patients active in period",
    excl: "Pre-existing ESRD, T1DM",
    source: "EMR / Claims",
    method: "ICD-10 extraction + claims linkage",
    steward: "AiQL / CMS",
    target: 8,
    floor: 15,
    stretch: 5,
    unit: "%",
    lowerBetter: true,
  },
  // D2 PROMs (20%)
  {
    id: "D2-001",
    dim: "D2",
    name: "EQ-5D Mean Score Improvement",
    shortName: "EQ-5D Improvement",
    num: "Sum of EQ-5D utility improvements (12mo – baseline)",
    den: "Patients with baseline and 12mo EQ-5D assessments",
    excl: "<6 months attribution, missing baseline",
    source: "EQ-5D platform / AiQL PROMs portal",
    method: "PROM dispatch + digital collection",
    steward: "EuroQol / ICHOM",
    target: 0.05,
    floor: 0.02,
    stretch: 0.08,
    unit: "index pts",
    lowerBetter: false,
  },
  {
    id: "D2-002",
    dim: "D2",
    name: "PHQ-9 Mean Score Reduction",
    shortName: "PHQ-9 Reduction",
    num: "Sum of PHQ-9 score reductions (baseline – 12mo), PHQ-9 ≥5 at baseline",
    den: "Patients with baseline PHQ-9 ≥5 and 12mo follow-up",
    excl: "Missing baseline, <3 months on treatment",
    source: "PHQ-9 platform",
    method: "Digital PHQ-9 dispatch T0 and T12",
    steward: "ICHOM / APA",
    target: 3.0,
    floor: 1.5,
    stretch: 5.0,
    unit: "points",
    lowerBetter: false,
  },
  {
    id: "D2-003",
    dim: "D2",
    name: "PROMs Collection Completeness",
    shortName: "PROMs Completeness",
    num: "Patients with completed PROM sets at baseline AND 12mo timepoints",
    den: "All eligible attributed patients in period",
    excl: "Deceased before 12mo, cognitively impaired without proxy",
    source: "AiQL PROMs portal",
    method: "Automated completeness tracking",
    steward: "AiQL",
    target: 70,
    floor: 50,
    stretch: 85,
    unit: "%",
    lowerBetter: false,
  },
  {
    id: "D2-004",
    dim: "D2",
    name: "Functional Status Improvement",
    shortName: "Functional Status",
    num: "Patients with ≥1 point improvement in PROMIS-29 Physical Function T-score",
    den: "Patients with baseline and 12mo PROMIS-29 assessments",
    excl: "Baseline Physical Function T-score ≥55 (ceiling effect)",
    source: "PROMIS-29 platform",
    method: "Digital PROM dispatch",
    steward: "PROMIS / ICHOM",
    target: 60,
    floor: 45,
    stretch: 75,
    unit: "%",
    lowerBetter: false,
  },
  // D3 Patient Experience (10%)
  {
    id: "D3-001",
    dim: "D3",
    name: "Overall Patient Satisfaction",
    shortName: "Overall Satisfaction",
    num: "Patients rating experience ≥4/5 on annual care experience survey",
    den: "Attributed patients with completed annual survey",
    excl: "<3 months attribution",
    source: "Care experience platform",
    method: "Annual digital survey dispatch",
    steward: "AiQL / CAHPS",
    target: 80,
    floor: 65,
    stretch: 90,
    unit: "%",
    lowerBetter: false,
  },
  {
    id: "D3-002",
    dim: "D3",
    name: "Shared Decision-Making Score",
    shortName: "Shared Decision-Making",
    num: "Patients reporting 'definitely yes' to SDM item",
    den: "Patients completing survey with ≥1 decision-relevant encounter",
    excl: "Cognitive impairment without proxy",
    source: "Care experience survey",
    method: "SDM subscale",
    steward: "AiQL / CAHPS",
    target: 75,
    floor: 60,
    stretch: 85,
    unit: "%",
    lowerBetter: false,
  },
  {
    id: "D3-003",
    dim: "D3",
    name: "Care Coordination Experience",
    shortName: "Care Coordination",
    num: "Patients rating care coordination ≥3/5 on coordination subscale",
    den: "Patients with ≥1 specialist referral and completed survey",
    excl: "No specialist referrals in period",
    source: "Care experience survey",
    method: "Coordination subscale extraction",
    steward: "AiQL",
    target: 70,
    floor: 55,
    stretch: 80,
    unit: "%",
    lowerBetter: false,
  },
  // D5 Process Quality (15%)
  {
    id: "D5-001",
    dim: "D5",
    name: "ADA Guideline Adherence Rate",
    shortName: "ADA Adherence",
    num: "Sum of individual guideline elements met across T2DM patients",
    den: "All attributed T2DM patients × applicable guideline elements",
    excl: "Contraindicated elements excluded from denominator",
    source: "EMR / AiQL guideline engine",
    method: "AiQL automated guideline engine (SNOMED/ICD)",
    steward: "ADA / AiQL",
    target: 75,
    floor: 60,
    stretch: 90,
    unit: "%",
    lowerBetter: false,
  },
  {
    id: "D5-002",
    dim: "D5",
    name: "APA Depression Guideline Adherence",
    shortName: "APA Adherence",
    num: "Sum of APA guideline elements met across depression patients",
    den: "Patients with depression diagnosis × applicable guideline elements",
    excl: "Contraindications to standard first-line treatments",
    source: "EMR / AiQL guideline engine",
    method: "AiQL automated guideline engine",
    steward: "APA / AiQL",
    target: 70,
    floor: 55,
    stretch: 85,
    unit: "%",
    lowerBetter: false,
  },
  {
    id: "D5-003",
    dim: "D5",
    name: "Medication Reconciliation Rate",
    shortName: "Med Reconciliation",
    num: "Patients with documented medication reconciliation at all care transitions",
    den: "Patients with ≥1 care transition in period",
    excl: "Patients with no care transitions (no denominator entry)",
    source: "EMR",
    method: "Care transition flag + medication reconciliation extraction",
    steward: "NCQA / AiQL",
    target: 85,
    floor: 70,
    stretch: 95,
    unit: "%",
    lowerBetter: false,
  },
  {
    id: "D5-004",
    dim: "D5",
    name: "Annual Diabetic Foot Exam Rate",
    shortName: "Foot Exam Rate",
    num: "Patients with documented comprehensive foot exam in period",
    den: "Attributed T2DM patients with ≥12 months attribution",
    excl: "Bilateral below-knee amputation",
    source: "EMR",
    method: "EMR extraction of foot exam codes",
    steward: "ADA / NCQA",
    target: 80,
    floor: 65,
    stretch: 90,
    unit: "%",
    lowerBetter: false,
  },
  {
    id: "D5-005",
    dim: "D5",
    name: "Follow-up Visit Within 30 Days",
    shortName: "30-Day Follow-up",
    num: "Discharged patients with outpatient follow-up within 30 days",
    den: "Attributed patients with ≥1 inpatient discharge or ED visit",
    excl: "Deaths within 30 days of discharge, elective procedures",
    source: "Claims / EMR",
    method: "Claims linkage + EMR appointment data",
    steward: "NCQA / CMS",
    target: 75,
    floor: 60,
    stretch: 90,
    unit: "%",
    lowerBetter: false,
  },
  // D7 Cost & Utilization (15%)
  {
    id: "D7-001",
    dim: "D7",
    name: "Total Cost of Care per Patient",
    shortName: "Total Cost",
    num: "Total payer-adjudicated cost for all attributed patients",
    den: "Total attributed patients in period",
    excl: "Transplant and oncology costs (carve-outs)",
    source: "Claims",
    method: "Total payer-adjudicated cost extraction",
    steward: "AiQL",
    target: 45000,
    floor: 55000,
    stretch: 38000,
    unit: "SAR",
    lowerBetter: true,
  },
  {
    id: "D7-002",
    dim: "D7",
    name: "ED Utilization Rate",
    shortName: "ED Utilization",
    num: "ED visits for attributed patients (excl. injury/trauma)",
    den: "Total attributed patients × 1,000",
    excl: "Trauma, obstetric emergency, post-procedure visits within 30d",
    source: "Claims",
    method: "Claims extraction with ICD-10 filtering",
    steward: "AHRQ / AiQL",
    target: 250,
    floor: 350,
    stretch: 180,
    unit: "/1k pts",
    lowerBetter: true,
  },
  {
    id: "D7-003",
    dim: "D7",
    name: "30-Day Readmission Rate",
    shortName: "Readmission Rate",
    num: "Patients with ≥1 unplanned readmission within 30d of index discharge",
    den: "Attributed patients with ≥1 inpatient discharge",
    excl: "Planned readmissions, LTACH discharges",
    source: "Claims",
    method: "CMS READMIT algorithm (KSA-adapted)",
    steward: "CMS / AiQL",
    target: 12,
    floor: 18,
    stretch: 8,
    unit: "%",
    lowerBetter: true,
  },
  {
    id: "D7-004",
    dim: "D7",
    name: "Generic Prescribing Rate",
    shortName: "Generic Prescribing",
    num: "Generic prescriptions for attributed patients",
    den: "All prescriptions where generic equivalent exists",
    excl: "Biologics, narrow-therapeutic-index, no-substitute",
    source: "Pharmacy / EMR",
    method: "Pharmacy claims extraction",
    steward: "AiQL / MOH",
    target: 80,
    floor: 65,
    stretch: 90,
    unit: "%",
    lowerBetter: false,
  },
  // D9 Health Equity (10%)
  {
    id: "D9-001",
    dim: "D9",
    name: "Outcome Equity Index",
    shortName: "Outcome Equity",
    num: "Std deviation of D1 scores across 6 demographic subgroups",
    den: "D1 scores stratified by age, gender, nationality",
    excl: "Subgroups with <10 patients",
    source: "Derived",
    method: "AiQL equity analysis engine",
    steward: "AiQL",
    target: 0.1,
    floor: 0.2,
    stretch: 0.05,
    unit: "index",
    lowerBetter: true,
  },
  {
    id: "D9-002",
    dim: "D9",
    name: "Access Equity Index",
    shortName: "Access Equity",
    num: "Std deviation of access metrics across geographic zones",
    den: "Access metrics stratified by urban/suburban/rural/remote zones",
    excl: "Zones with <5 patients",
    source: "Derived",
    method: "AiQL equity analysis engine",
    steward: "AiQL",
    target: 0.15,
    floor: 0.25,
    stretch: 0.08,
    unit: "index",
    lowerBetter: true,
  },
  {
    id: "D9-003",
    dim: "D9",
    name: "PROMs Completion Equity",
    shortName: "PROMs Equity",
    num: "Std deviation of PROMs collection rates across demographic groups",
    den: "Collection rates stratified by age, gender, education",
    excl: "Subgroups with <10 eligible patients",
    source: "AiQL PROMs portal",
    method: "Completeness analysis stratified by demographics",
    steward: "AiQL",
    target: 0.1,
    floor: 0.2,
    stretch: 0.05,
    unit: "index",
    lowerBetter: true,
  },
];

/* ── Dr. Fatima Al-Khalil (P01) — Contract 1 — All Periods ───────────────── */
/* raw[i] and adj[i] = Q1..Q4 actual score values in natural units            */
/* Composite math (C1 weights D1:30 D2:20 D3:10 D5:15 D7:15 D9:10):
   Q4: 95×.30+90×.20+88×.10+91×.15+94×.15+90×.10 = 28.5+18+8.8+13.65+14.1+9 = 92.05→92 ✓
   Q3: 94×.30+89×.20+86×.10+91×.15+93×.15+89×.10 = 28.2+17.8+8.6+13.65+13.95+8.9=91.1→91 ✓
   Q2: 93×.30+88×.20+84×.10+90×.15+92×.15+88×.10 = 27.9+17.6+8.4+13.5+13.8+8.8=90.0→90 ✓
   Q1: 91×.30+87×.20+82×.10+88×.15+91×.15+87×.10 = 27.3+17.4+8.2+13.2+13.65+8.7=88.45→88 ✓ */
const P01_DIM: any = {
  Q1: { D1: 91, D2: 87, D3: 82, D5: 88, D7: 91, D9: 87 },
  Q2: { D1: 93, D2: 88, D3: 84, D5: 90, D7: 92, D9: 88 },
  Q3: { D1: 94, D2: 89, D3: 86, D5: 91, D7: 93, D9: 89 },
  Q4: { D1: 95, D2: 90, D3: 88, D5: 91, D7: 94, D9: 90 },
};
const P01_COMPOSITE = [88, 90, 91, 92];

const P01_SCORE: any = {
  "D1-001": {
    raw: [68, 71, 73, 74],
    adj: [72, 75, 77, 78],
    cmp: [91, 93, 95, 96],
  },
  "D1-002": {
    raw: [67, 70, 72, 72],
    adj: [71, 73, 75, 75],
    cmp: [89, 91, 93, 94],
  },
  "D1-003": {
    raw: [74, 76, 78, 79],
    adj: [78, 80, 81, 82],
    cmp: [92, 93, 94, 95],
  },
  "D1-004": {
    raw: [80, 83, 85, 85],
    adj: [82, 85, 87, 87],
    cmp: [88, 90, 92, 93],
  },
  "D1-005": {
    raw: [36, 38, 39, 40],
    adj: [40, 42, 43, 44],
    cmp: [74, 77, 79, 81],
  },
  "D1-006": {
    raw: [6.2, 5.8, 5.4, 5.2],
    adj: [5.8, 5.4, 5.0, 4.8],
    cmp: [95, 96, 97, 97],
  },
  "D2-001": {
    raw: [0.055, 0.062, 0.066, 0.07],
    adj: [0.058, 0.065, 0.069, 0.072],
    cmp: [68, 71, 74, 77],
  },
  "D2-002": {
    raw: [3.2, 3.5, 3.7, 3.8],
    adj: [3.4, 3.7, 3.9, 4.0],
    cmp: [70, 72, 74, 76],
  },
  "D2-003": {
    raw: [72, 74, 76, 78],
    adj: [72, 74, 76, 78],
    cmp: [100, 100, 100, 100],
  },
  "D2-004": {
    raw: [62, 65, 67, 68],
    adj: [64, 67, 69, 70],
    cmp: [69, 71, 73, 75],
  },
  "D3-001": {
    raw: [79, 80, 81, 82],
    adj: [81, 82, 83, 84],
    cmp: [82, 84, 86, 88],
  },
  "D3-002": {
    raw: [74, 76, 77, 78],
    adj: [76, 78, 79, 80],
    cmp: [80, 82, 84, 85],
  },
  "D3-003": {
    raw: [60, 61, 62, 64],
    adj: [62, 63, 64, 66],
    cmp: [78, 79, 80, 82],
  },
  "D5-001": {
    raw: [80, 82, 83, 84],
    adj: [82, 84, 85, 86],
    cmp: [90, 91, 92, 93],
  },
  "D5-002": {
    raw: [74, 75, 77, 78],
    adj: [76, 77, 79, 80],
    cmp: [86, 87, 88, 89],
  },
  "D5-003": {
    raw: [88, 89, 90, 91],
    adj: [89, 90, 91, 92],
    cmp: [94, 95, 95, 96],
  },
  "D5-004": {
    raw: [80, 81, 82, 83],
    adj: [82, 83, 84, 85],
    cmp: [92, 93, 94, 94],
  },
  "D5-005": {
    raw: [68, 70, 71, 72],
    adj: [70, 72, 73, 74],
    cmp: [87, 88, 89, 90],
  },
  "D7-001": {
    raw: [44100, 43200, 42100, 41200],
    adj: [42500, 41800, 40900, 39800],
    cmp: [98, 98, 99, 99],
  },
  "D7-002": {
    raw: [228, 220, 215, 210],
    adj: [215, 208, 202, 195],
    cmp: [97, 97, 98, 98],
  },
  "D7-003": {
    raw: [10.2, 9.8, 9.5, 9.2],
    adj: [9.6, 9.2, 8.9, 8.5],
    cmp: [96, 97, 97, 98],
  },
  "D7-004": {
    raw: [83, 84, 85, 86],
    adj: [84, 85, 86, 87],
    cmp: [99, 99, 99, 100],
  },
  "D9-001": {
    raw: [0.095, 0.09, 0.085, 0.08],
    adj: [0.09, 0.085, 0.08, 0.075],
    cmp: [88, 89, 90, 91],
  },
  "D9-002": {
    raw: [0.14, 0.135, 0.128, 0.12],
    adj: [0.135, 0.13, 0.122, 0.115],
    cmp: [86, 87, 88, 89],
  },
  "D9-003": {
    raw: [0.095, 0.092, 0.09, 0.09],
    adj: [0.09, 0.088, 0.086, 0.085],
    cmp: [85, 86, 87, 88],
  },
};

/* ── Network stats (C1, Q4 2025) ─────────────────────────────────────────── */
const NETWORK_C1 = {
  n: 48,
  mean: 75.2,
  median: 76.8,
  p25: 66.4,
  p75: 83.1,
  histogram: [
    { bin: "50–54", count: 2 },
    { bin: "55–59", count: 3 },
    { bin: "60–64", count: 5 },
    { bin: "65–69", count: 7 },
    { bin: "70–74", count: 9 },
    { bin: "75–79", count: 10 },
    { bin: "80–84", count: 6 },
    { bin: "85–89", count: 4 },
    { bin: "90–94", count: 2 },
  ],
};

/* ── Alerts ──────────────────────────────────────────────────────────────── */
const ALERTS: any = {
  P01: [
    {
      id: "A01-1",
      sev: "info",
      title: "PROMs completeness above target",
      desc: "D2-003 at 78% — 8pp above minimum. Maintain collection cadence for settlement.",
      measureId: "D2-003",
    },
    {
      id: "A01-2",
      sev: "info",
      title: "D3-003 Care Coordination below target",
      desc: "Score 66% vs 70% target. 2nd consecutive period. Monitor for corrective action threshold.",
      measureId: "D3-003",
    },
  ],
  P10: [
    {
      id: "A10-1",
      sev: "critical",
      title: "D1-001 HbA1c — Below Floor",
      desc: "42% vs 50% floor. 2nd consecutive period. Breach penalty clause triggered.",
      measureId: "D1-001",
    },
    {
      id: "A10-2",
      sev: "critical",
      title: "D2-003 PROMs Completeness — Below Floor",
      desc: "38% vs 50% floor. Data quality flag raised. Network median imputed per clause 14.3.",
      measureId: "D2-003",
    },
    {
      id: "A10-3",
      sev: "warning",
      title: "D5-001 ADA Adherence — Approaching Floor",
      desc: "58% vs 60% floor. 2pp above breach threshold. Immediate intervention required.",
      measureId: "D5-001",
    },
    {
      id: "A10-4",
      sev: "critical",
      title: "Active CAP — 45 Days In",
      desc: "Corrective Action Plan initiated. 3 of 8 milestones completed. Next milestone due in 7 days.",
      measureId: null,
    },
    {
      id: "A10-5",
      sev: "warning",
      title: "Settlement Review Due in 18 Days",
      desc: "Q4 2025 settlement review scheduled. Composite 55 triggers penalty clause per §8.4.",
      measureId: null,
    },
  ],
};

/* ── Case-mix data (P01 / C1) ────────────────────────────────────────────── */
const CASEMIX_P01 = {
  model: "AiQL Case-Mix Model v2.1 — ICHOM-derived variables",
  oeRatio: 1.14,
  oeInterp:
    "Outperforming expectations. O/E > 1.0 means Dr. Al-Khalil is delivering better outcomes than predicted given her panel complexity. Risk adjustment adds +4.0pp to reflect the harder case mix.",
  rawComposite: 88,
  adjComposite: 92,
  adjDelta: +4,
  variables: [
    {
      name: "Mean Age",
      prov: 54.2,
      net: 51.7,
      diff: "+2.5 yrs",
      harder: true,
      rawEffect: -1.8,
    },
    {
      name: "Charlson Index",
      prov: 2.8,
      net: 2.3,
      diff: "+0.5",
      harder: true,
      rawEffect: -2.3,
    },
    {
      name: "Mean BMI",
      prov: 31.4,
      net: 29.8,
      diff: "+1.6 kg/m²",
      harder: true,
      rawEffect: -0.9,
    },
    {
      name: "% with Depression",
      prov: 28,
      net: 22,
      diff: "+6%",
      harder: true,
      rawEffect: -1.4,
    },
    {
      name: "% Low SES",
      prov: 15,
      net: 12,
      diff: "+3%",
      harder: true,
      rawEffect: -0.7,
    },
    {
      name: "% Male",
      prov: 62,
      net: 58,
      diff: "+4%",
      harder: false,
      rawEffect: -0.3,
    },
  ],
};

/* ── D1-001 computation detail (P01, C1, Q4 2025) ────────────────────────── */
const COMPUTATION_D1_001 = {
  numerator: 252,
  denominator: 340,
  exclusions: 18,
  rawRate: 74.1,
  riskFactor: 1.054,
  adjRate: 78.1,
  ci95: [73.2, 82.8],
  reasoning: [
    "Score computed from 340 attributed T2DM patients in Q4 2025.",
    "252 patients achieved HbA1c < 7.0% at most recent assessment. 70 patients exceeded the threshold. 18 excluded: 13 T1DM, 4 age <18 years, 1 <6 months attribution.",
    "Raw rate: 252 ÷ 340 = 74.1%. Risk adjustment factor 1.054 applied — above-average comorbidity burden (Charlson 2.8 vs network mean 2.3) and older mean age (54.2 vs 51.7 years).",
    "Adjusted rate 78.1% — risk adjustment benefited this provider by +4.0pp, confirming genuine quality above network expectations for this case mix.",
  ],
};

/* ── Denominator patients (D1-001, P01, Q4 2025) ─────────────────────────── */
const DENOM_PATIENTS = [
  {
    id: "PT-001",
    age: 58,
    sex: "M",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "14 Nov 2024",
    value: "6.4%",
  },
  {
    id: "PT-002",
    age: 62,
    sex: "F",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "28 Oct 2024",
    value: "6.8%",
  },
  {
    id: "PT-003",
    age: 47,
    sex: "M",
    facility: "PSMMC Riyadh",
    status: "Not Met",
    date: "2 Dec 2024",
    value: "7.4%",
  },
  {
    id: "PT-004",
    age: 71,
    sex: "F",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "20 Nov 2024",
    value: "6.6%",
  },
  {
    id: "PT-005",
    age: 55,
    sex: "M",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "15 Oct 2024",
    value: "5.9%",
  },
  {
    id: "PT-006",
    age: 63,
    sex: "M",
    facility: "PSMMC Riyadh",
    status: "Not Met",
    date: "30 Nov 2024",
    value: "8.1%",
  },
  {
    id: "PT-007",
    age: 49,
    sex: "F",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "22 Oct 2024",
    value: "6.2%",
  },
  {
    id: "PT-008",
    age: 67,
    sex: "M",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "8 Dec 2024",
    value: "6.9%",
  },
  {
    id: "PT-009",
    age: 52,
    sex: "F",
    facility: "PSMMC Riyadh",
    status: "Not Met",
    date: "5 Nov 2024",
    value: "7.6%",
  },
  {
    id: "PT-010",
    age: 60,
    sex: "M",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "18 Nov 2024",
    value: "6.5%",
  },
  {
    id: "PT-011",
    age: 44,
    sex: "F",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "31 Oct 2024",
    value: "6.1%",
  },
  {
    id: "PT-012",
    age: 58,
    sex: "M",
    facility: "PSMMC Riyadh",
    status: "Not Met",
    date: "1 Dec 2024",
    value: "7.9%",
  },
  {
    id: "PT-013",
    age: 75,
    sex: "F",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "10 Nov 2024",
    value: "6.7%",
  },
  {
    id: "PT-014",
    age: 51,
    sex: "M",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "25 Oct 2024",
    value: "6.3%",
  },
  {
    id: "PT-015",
    age: 66,
    sex: "F",
    facility: "PSMMC Riyadh",
    status: "Not Met",
    date: "15 Dec 2024",
    value: "8.4%",
  },
  {
    id: "PT-016",
    age: 59,
    sex: "M",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "22 Nov 2024",
    value: "6.6%",
  },
  {
    id: "PT-017",
    age: 41,
    sex: "F",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "18 Oct 2024",
    value: "5.8%",
  },
  {
    id: "PT-018",
    age: 70,
    sex: "M",
    facility: "PSMMC Riyadh",
    status: "Not Met",
    date: "28 Nov 2024",
    value: "9.2%",
  },
  {
    id: "PT-019",
    age: 53,
    sex: "F",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "5 Dec 2024",
    value: "6.8%",
  },
  {
    id: "PT-020",
    age: 64,
    sex: "M",
    facility: "PSMMC Riyadh",
    status: "Met",
    date: "15 Nov 2024",
    value: "6.4%",
  },
];

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function seededRand(a: any, b: any, c = 0) {
  const x = Math.sin(a * 127.1 + b * 311.7 + c * 74.3) * 43758.5453123;
  return x - Math.floor(x);
}

function getStatus(adj: any, measure: any) {
  const { target, floor, stretch, lowerBetter } = measure;
  if (lowerBetter) {
    if (adj <= stretch)
      return { key: "exceeds", label: "Exceeds Stretch", rank: 3 };
    if (adj <= target) return { key: "target", label: "At Target", rank: 2 };
    if (adj <= floor) return { key: "below", label: "Below Target", rank: 1 };
    return { key: "floor", label: "Below Floor", rank: 0 };
  } else {
    if (adj >= stretch)
      return { key: "exceeds", label: "Exceeds Stretch", rank: 3 };
    if (adj >= target) return { key: "target", label: "At Target", rank: 2 };
    if (adj >= floor) return { key: "below", label: "Below Target", rank: 1 };
    return { key: "floor", label: "Below Floor", rank: 0 };
  }
}

function fmtScore(v: any, unit: any) {
  if (v == null) return "—";
  if (unit === "%") return v.toFixed(1) + "%";
  if (unit === "SAR") return "SAR " + Math.round(v).toLocaleString();
  if (unit === "/1k pts") return Math.round(v) + "";
  if (unit === "index pts") return v.toFixed(3);
  if (unit === "points") return v.toFixed(1) + " pts";
  if (unit === "index") return v.toFixed(3);
  return v.toString();
}

function fmtThreshold(v: any, unit: any, lowerBetter: any) {
  const prefix = lowerBetter ? "<" : "";
  if (unit === "%") return prefix + v + "%";
  if (unit === "SAR") return prefix + "SAR " + v.toLocaleString();
  if (unit === "/1k pts") return prefix + v;
  if (unit === "index pts") return prefix + v;
  if (unit === "points") return prefix + v;
  if (unit === "index") return prefix + v;
  return prefix + v;
}

/* Generate synthetic scores for non-P01 providers */
function genProviderScores(
  provider: any,
  contract: any,
  periodIdx: any,
  measureId: any,
) {
  const pn = parseInt(provider.id.slice(1));
  const mn = parseInt(measureId.split("-")[1]);
  const measure = MEASURES_C1.find((m) => m.id === measureId);
  if (!measure) return { raw: null, adj: null, cmp: 88 };
  const { target, floor, stretch, lowerBetter, unit } = measure;
  const targetComp = provider.composite - (3 - periodIdx) * 1.2;
  // Produce a "normalized" 0-100 performance score based on composite
  const variation = (seededRand(pn, mn, periodIdx) - 0.5) * 16;
  const normScore = Math.max(30, Math.min(100, targetComp + variation));
  // Convert normalized score back to natural units
  // 0=floor, 50≈target, 100=stretch for higher-better
  function denorm(ns: any) {
    if (lowerBetter) {
      // ns=100 → stretch, ns=0 → floor (values inverted)
      return floor - (floor - stretch) * (ns / 100);
    } else {
      return floor + (stretch - floor) * (ns / 100);
    }
  }
  const adj = denorm(normScore);
  const rawVariation = (seededRand(pn * 3, mn, periodIdx * 5) - 0.4) * 8;
  const rawNorm = Math.max(20, Math.min(99, normScore + rawVariation));
  const raw = denorm(rawNorm);
  return {
    raw,
    adj,
    cmp: Math.round(72 + seededRand(pn, mn + 1, periodIdx) * 22),
  };
}

function genDimScores(provider: any, contract: any, periodIdx: any) {
  const pn = parseInt(provider.id.slice(1));
  const base = provider.composite - (3 - periodIdx) * 1.2;
  const result: any = {};
  Object.keys(contract.dims).forEach((d, i) => {
    const dn = parseInt(d.slice(1));
    const v = (seededRand(pn, dn, periodIdx) - 0.5) * 14;
    result[d] = Math.round(Math.max(35, Math.min(99, base + v)));
  });
  return result;
}

function computeComposite(dimScores: any, contract: any) {
  let total = 0;
  Object.entries(contract.dims).forEach(([d, w]) => {
    if (dimScores[d] != null) total += dimScores[d] * ((w as any) / 100);
  });
  return Math.round(total);
}

function getProviderComposites(provider: any, contract: any) {
  return PERIODS.map((_, i) => {
    if (provider.id === "P01" && contract.id === "C1") return P01_COMPOSITE[i];
    const dims = genDimScores(provider, contract, i);
    return computeComposite(dims, contract);
  });
}

function getProviderDimScores(provider: any, contract: any, periodIdx: any) {
  if (provider.id === "P01" && contract.id === "C1") {
    const keys: any = ["Q1", "Q2", "Q3", "Q4"];
    return P01_DIM[keys[periodIdx]];
  }
  return genDimScores(provider, contract, periodIdx);
}

function getMeasureRow(
  provider: any,
  contract: any,
  periodIdx: any,
  measure: any,
) {
  if (provider.id === "P01" && contract.id === "C1" && P01_SCORE[measure.id]) {
    const s = P01_SCORE[measure.id];
    return {
      raw: s.raw[periodIdx],
      adj: s.adj[periodIdx],
      cmp: s.cmp[periodIdx],
      trend: s.adj,
    };
  }
  const scores = PERIODS.map((_, i) =>
    genProviderScores(provider, contract, i, measure.id),
  );
  const curr = scores[periodIdx];
  return {
    raw: curr.raw,
    adj: curr.adj,
    cmp: curr.cmp,
    trend: scores.map((s) => s.adj),
  };
}

function getAlerts(provider: any) {
  const a = ALERTS[provider.id];
  if (a) return a;
  // Generate generic alerts for mid-tier providers
  const pn = parseInt(provider.id.slice(1));
  if (provider.composite < 70) {
    return [
      {
        id: "gen-1",
        sev: "warning",
        title: "2+ measures approaching floor",
        desc: "Review D1 and D5 performance trending toward floor threshold.",
        measureId: null,
      },
    ];
  }
  return [
    {
      id: "gen-2",
      sev: "info",
      title: "PROMs collection on track",
      desc: "Collection completeness meeting minimum threshold for settlement.",
      measureId: null,
    },
  ];
}

/* ============================================================================
   ValueOS — Session 9: Dimension Deep-Dive — Synthetic Data
   ============================================================================ */

/* ── Seeded helpers ──────────────────────────────────────────────────────── */
function s9rand(a: any, b: any) {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
}
function s9gaussian(mean: any, sd: any, seed: any) {
  const u1 = Math.max(1e-6, s9rand(seed, seed + 1));
  const u2 = s9rand(seed + 2, seed + 3);
  return mean + sd * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}
function s9genContinuous(
  mean: any,
  sd: any,
  n: any,
  seed: any,
  minVal: any,
  maxVal: any,
) {
  return Array.from(
    { length: n },
    (_, i) =>
      Math.round(
        Math.max(minVal, Math.min(maxVal, s9gaussian(mean, sd, seed + i))) * 10,
      ) / 10,
  );
}

/* ── Dimension definitions ───────────────────────────────────────────────── */
const S9_DIMENSIONS = {
  D1: {
    name: "Clinical Outcomes",
    short: "Clinical",
    color: "#3E91DB",
    def: "Disease-specific endpoints, biomarkers, complications, and survival. Defined entirely by ICHOM Standard Sets.",
  },
  D2: {
    name: "Patient-Reported Outcomes",
    short: "PROMs",
    color: "#7B68EE",
    def: "Patient-completed instruments measuring function, symptoms, and health-related quality of life (HRQoL).",
  },
  D3: {
    name: "Patient Experience",
    short: "Experience",
    color: "#D34F8E",
    def: "Patient perception of care quality, respect, shared decision-making, and care coordination.",
  },
  D4: {
    name: "Safety & Harm Prevention",
    short: "Safety",
    color: "#BF3A39",
    def: "Healthcare-associated infections, medication errors, adverse events, falls, and never events.",
  },
  D5: {
    name: "Process Quality",
    short: "Process",
    color: "#C28F2C",
    def: "Adherence to evidence-based clinical guidelines, care pathways, screening protocols, and best practices.",
  },
  D6: {
    name: "Access & Timeliness",
    short: "Access",
    color: "#4C8C4D",
    def: "Wait times, appointment availability, referral completion rates, and geographic access to care.",
  },
  D7: {
    name: "Cost & Utilization",
    short: "Cost",
    color: "#228BA0",
    def: "Total cost of care per attributed patient, ED visits, inpatient admissions, readmissions, and generic prescribing.",
  },
  D8: {
    name: "Care Coordination",
    short: "Coordination",
    color: "#8B6FF0",
    def: "Transitions of care, care plan completeness, inter-provider communication, and post-discharge follow-up.",
  },
  D9: {
    name: "Health Equity",
    short: "Equity",
    color: "#9B7B3A",
    def: "Outcome variation across demographic, geographic, and socioeconomic subgroups.",
  },
  D10: {
    name: "Data Quality",
    short: "Data Quality",
    color: "#6B8CA8",
    def: "Completeness, timeliness, conformance, and plausibility of all reported data elements.",
  },
};

/* ── ICHOM Sets active in Contract 1 D1 ─────────────────────────────────── */
const S9_ICHOM_SETS_D1 = [
  {
    id: "ICHOM-006",
    code: "T2DM",
    name: "Type 2 Diabetes",
    family: "Endocrine & Metabolic",
    familyColor: "#3E91DB",
    outcomeVars: 12,
    score: 91.2,
    target: 75,
    completeness: 94,
    trend: +2.1,
    period: "Q4 2025",
    variables: [
      {
        id: "OV1",
        code: "LOINC 4548-4",
        name: "HbA1c Level",
        type: "continuous",
        unit: "%",
        mean: 7.4,
        sd: 1.8,
        target: 7.0,
        targetDir: "lower",
        n: 340,
        values: s9genContinuous(7.4, 1.8, 50, 101, 4.5, 14.0),
      },
      {
        id: "OV2",
        code: "LOINC 2089-1",
        name: "LDL Cholesterol",
        type: "continuous",
        unit: "mg/dL",
        mean: 108,
        sd: 32,
        target: 100,
        targetDir: "lower",
        n: 328,
        values: s9genContinuous(108, 32, 50, 201, 40, 250),
      },
      {
        id: "OV3",
        code: "LOINC 8480-6",
        name: "Systolic Blood Pressure",
        type: "continuous",
        unit: "mmHg",
        mean: 136,
        sd: 18,
        target: 140,
        targetDir: "lower",
        n: 340,
        values: s9genContinuous(136, 18, 50, 301, 90, 200),
      },
      {
        id: "OV4",
        code: "SNOMED 60621009",
        name: "Body Mass Index",
        type: "continuous",
        unit: "kg/m²",
        mean: 31.4,
        sd: 5.2,
        target: null,
        targetDir: null,
        n: 340,
        values: s9genContinuous(31.4, 5.2, 50, 401, 18, 55),
      },
      {
        id: "OV5",
        code: "LOINC 48642-3",
        name: "eGFR",
        type: "continuous",
        unit: "mL/min",
        mean: 72,
        sd: 22,
        target: 60,
        targetDir: "higher",
        n: 330,
        values: s9genContinuous(72, 22, 50, 501, 15, 120),
      },
      {
        id: "OV6",
        code: "SNOMED 252779009",
        name: "Retinopathy Screening",
        type: "categorical",
        unit: "%",
        rate: 71.2,
        target: 75,
        targetDir: "higher",
        n: 340,
        ci: [66.1, 76.0],
      },
      {
        id: "OV7",
        code: "SNOMED 401191002",
        name: "Annual Foot Exam",
        type: "categorical",
        unit: "%",
        rate: 68.5,
        target: 80,
        targetDir: "higher",
        n: 340,
        ci: [63.3, 73.3],
      },
      {
        id: "OV8",
        code: "SNOMED 713378007",
        name: "Diabetes Complications",
        type: "categorical",
        unit: "%",
        rate: 6.8,
        target: 8,
        targetDir: "lower",
        n: 340,
        ci: [4.4, 9.9],
      },
      {
        id: "OV9",
        code: "SNOMED 302866003",
        name: "Hypoglycaemic Events",
        type: "categorical",
        unit: "%",
        rate: 3.2,
        target: 5,
        targetDir: "lower",
        n: 340,
        ci: [1.7, 5.5],
      },
      {
        id: "OV10",
        code: "SNOMED 16208003",
        name: "Statin Adherence",
        type: "categorical",
        unit: "%",
        rate: 78.9,
        target: 80,
        targetDir: "higher",
        n: 312,
        ci: [73.9, 83.3],
      },
      {
        id: "OV11",
        code: "SNOMED 372733002",
        name: "ACE/ARB Therapy",
        type: "categorical",
        unit: "%",
        rate: 82.3,
        target: 80,
        targetDir: "higher",
        n: 96,
        ci: [73.4, 89.1],
      },
      {
        id: "OV12",
        code: "SNOMED 225323000",
        name: "Smoking Cessation",
        type: "categorical",
        unit: "%",
        rate: 64.7,
        target: 75,
        targetDir: "higher",
        n: 51,
        ci: [50.1, 77.6],
      },
    ],
  },
  {
    id: "ICHOM-017",
    code: "DEPA",
    name: "Depression & Anxiety",
    family: "Mental Health",
    familyColor: "#9C7BD9",
    outcomeVars: 8,
    score: 72.4,
    target: 75,
    completeness: 78,
    trend: +0.8,
    period: "Q4 2025",
    variables: [
      {
        id: "DP1",
        code: "LOINC 44261-6",
        name: "PHQ-9 Score",
        type: "proms",
        unit: "pts",
        mean: 10.8,
        sd: 6.2,
        target: 10,
        targetDir: "lower",
        n: 310,
        values: s9genContinuous(10.8, 6.2, 50, 601, 0, 27),
        severity: [
          { label: "None (0–4)", pct: 22, color: "var(--perf-target)" },
          { label: "Mild (5–9)", pct: 34, color: "oklch(62% .12 82)" },
          { label: "Moderate (10–14)", pct: 28, color: "var(--perf-below)" },
          { label: "Mod-Severe (15–19)", pct: 12, color: "var(--perf-floor)" },
          { label: "Severe (20–27)", pct: 4, color: "oklch(45% .2 25)" },
        ],
      },
      {
        id: "DP2",
        code: "LOINC 69737-5",
        name: "GAD-7 Score",
        type: "proms",
        unit: "pts",
        mean: 8.4,
        sd: 5.1,
        target: 8,
        targetDir: "lower",
        n: 310,
        values: s9genContinuous(8.4, 5.1, 50, 701, 0, 21),
        severity: [
          { label: "None (0–4)", pct: 30, color: "var(--perf-target)" },
          { label: "Mild (5–9)", pct: 38, color: "oklch(62% .12 82)" },
          { label: "Moderate (10–14)", pct: 22, color: "var(--perf-below)" },
          { label: "Severe (15–21)", pct: 10, color: "var(--perf-floor)" },
        ],
      },
      {
        id: "DP3",
        code: "SNOMED 406191006",
        name: "Depression Remission",
        type: "categorical",
        unit: "%",
        rate: 32.6,
        target: 35,
        targetDir: "higher",
        n: 149,
        ci: [25.1, 40.8],
      },
      {
        id: "DP4",
        code: "SNOMED 225415001",
        name: "Depression Response",
        type: "categorical",
        unit: "%",
        rate: 48.3,
        target: 45,
        targetDir: "higher",
        n: 149,
        ci: [40.1, 56.5],
      },
      {
        id: "DP5",
        code: "SNOMED 308471009",
        name: "Treatment Initiation",
        type: "categorical",
        unit: "%",
        rate: 76.8,
        target: 80,
        targetDir: "higher",
        n: 310,
        ci: [71.6, 81.4],
      },
      {
        id: "DP6",
        code: "SNOMED 390825006",
        name: "Follow-up Within 14d",
        type: "categorical",
        unit: "%",
        rate: 62.4,
        target: 70,
        targetDir: "higher",
        n: 238,
        ci: [56.0, 68.5],
      },
      {
        id: "DP7",
        code: "SNOMED 182836005",
        name: "Medication Adherence",
        type: "categorical",
        unit: "%",
        rate: 54.8,
        target: 60,
        targetDir: "higher",
        n: 238,
        ci: [48.2, 61.3],
      },
      {
        id: "DP8",
        code: "LOINC 72133-2",
        name: "EQ-5D Functional Improvement",
        type: "continuous",
        unit: "change",
        mean: 0.04,
        sd: 0.12,
        target: 0.05,
        targetDir: "higher",
        n: 149,
        values: s9genContinuous(0.04, 0.12, 50, 801, -0.4, 0.5),
      },
    ],
  },
];

/* ── ICHOM Sets active in Contract 1 D2 (PROMs dimension) ───────────────── */
const S9_ICHOM_SETS_D2 = [
  {
    id: "D2-T2DM",
    code: "T2DM-PROMs",
    name: "Type 2 Diabetes PROMs",
    family: "Endocrine & Metabolic",
    familyColor: "#3E91DB",
    score: 87.4,
    target: 75,
    completeness: 77,
    trend: +1.4,
    period: "Q4 2025",
    promsInstruments: ["PROMIS-29", "PHQ-9", "WHO-5"],
    collectionByTimepoint: [
      { label: "Baseline", pct: 89 },
      { label: "3 months", pct: 74 },
      { label: "6 months", pct: 63 },
      { label: "12 months", pct: 52 },
    ],
  },
  {
    id: "D2-DEPA",
    code: "DEPA-PROMs",
    name: "Depression & Anxiety PROMs",
    family: "Mental Health",
    familyColor: "#9C7BD9",
    score: 72.1,
    target: 75,
    completeness: 66,
    trend: +0.6,
    period: "Q4 2025",
    promsInstruments: ["PHQ-9", "GAD-7", "WHO-5", "EQ-5D-5L"],
    collectionByTimepoint: [
      { label: "Baseline", pct: 78 },
      { label: "3 months", pct: 63 },
      { label: "6 months", pct: 52 },
      { label: "12 months", pct: 44 },
    ],
  },
];

/* ── PROMs collection funnel ────────────────────────────────────────────── */
const S9_PROMS_FUNNEL = [
  {
    label: "Eligible patients",
    n: 340,
    pct: 100,
    note: "Full attributed panel",
  },
  {
    label: "Invited to complete PROMs",
    n: 328,
    pct: 96.5,
    note: "12 opted out or language barrier",
  },
  {
    label: "Started instrument",
    n: 298,
    pct: 87.6,
    note: "30 did not start after invitation",
  },
  {
    label: "Completed at baseline",
    n: 265,
    pct: 78.0,
    note: "33 started but did not complete",
  },
  {
    label: "Completed at 3 months",
    n: 214,
    pct: 63.0,
    note: "51 attrited between baseline and 3mo",
  },
  {
    label: "Completed at 6 months",
    n: 178,
    pct: 52.4,
    note: "36 attrited between 3mo and 6mo",
  },
  {
    label: "Completed at 12 months",
    n: 149,
    pct: 43.8,
    note: "29 attrited between 6mo and 12mo",
  },
];

const S9_FUNNEL_DROPOUT = [
  {
    stage: "Baseline → 3mo",
    n: 51,
    age: 53.2,
    malePct: 64,
    charlson: 2.9,
    baselinePHQ: 13.8,
  },
  {
    stage: "3mo → 6mo",
    n: 36,
    age: 55.1,
    malePct: 69,
    charlson: 3.1,
    baselinePHQ: 14.2,
  },
  {
    stage: "6mo → 12mo",
    n: 29,
    age: 57.4,
    malePct: 71,
    charlson: 3.4,
    baselinePHQ: 15.1,
  },
  {
    stage: "Completers",
    n: 149,
    age: 48.9,
    malePct: 58,
    charlson: 2.1,
    baselinePHQ: 11.4,
  },
];

/* ── Spaghetti plot (50 PHQ-9 trajectories) ──────────────────────────────── */
const S9_TRAJECTORIES = (() => {
  const MCID = 5;
  return Array.from({ length: 50 }, (_, i) => {
    const base = Math.max(5, Math.min(27, s9gaussian(12.5, 4.5, i * 7 + 100)));
    const finalChange = (s9rand(i, 50) - 0.35) * 14; // biased toward improvement
    const final = Math.max(0, Math.min(27, base + finalChange));
    const m3 = Math.max(
      0,
      Math.min(27, base + finalChange * 0.3 + (s9rand(i, 51) - 0.5) * 2),
    );
    const m6 = Math.max(
      0,
      Math.min(27, base + finalChange * 0.65 + (s9rand(i, 52) - 0.5) * 2),
    );
    const hasM3 = s9rand(i, 53) > 0.22;
    const hasM6 = hasM3 && s9rand(i, 54) > 0.18;
    const hasM12 = hasM6 && s9rand(i, 55) > 0.16;
    const change = final - base;
    const status =
      change <= -MCID ? "improved" : change >= MCID ? "worsened" : "stable";
    return {
      id: i,
      base,
      values: [
        base,
        hasM3 ? m3 : null,
        hasM6 ? m6 : null,
        hasM12 ? final : null,
      ],
      status,
    };
  });
})();

/* ── Non-responder profile ───────────────────────────────────────────────── */
const S9_RESPONDER_PROFILE = [
  {
    variable: "Mean age (years)",
    responders: 49.3,
    nonResponders: 56.1,
    pValue: 0.003,
    significant: true,
  },
  {
    variable: "% male",
    responders: 58,
    nonResponders: 67,
    pValue: 0.09,
    significant: false,
  },
  {
    variable: "Charlson Comorbidity Index",
    responders: 2.1,
    nonResponders: 3.4,
    pValue: 0.001,
    significant: true,
  },
  {
    variable: "% with diabetes comorbidity",
    responders: 35,
    nonResponders: 62,
    pValue: 0.001,
    significant: true,
  },
  {
    variable: "Mean baseline PHQ-9",
    responders: 14.8,
    nonResponders: 11.2,
    pValue: 0.02,
    significant: true,
  },
  {
    variable: "% completing all 4 timepoints",
    responders: 72,
    nonResponders: 41,
    pValue: 0.001,
    significant: true,
  },
];

/* ── D5 ADA Guideline sub-requirements ──────────────────────────────────── */
const S9_ADA_GUIDELINES = [
  {
    id: "ADA-2024-001",
    req: "HbA1c testing every 6 months",
    pct: 88.2,
    target: 90,
  },
  {
    id: "ADA-2024-002",
    req: "Annual eye exam referral",
    pct: 71.2,
    target: 80,
  },
  { id: "ADA-2024-003", req: "Annual foot examination", pct: 68.5, target: 80 },
  {
    id: "ADA-2024-004",
    req: "Statin therapy for patients ≥40",
    pct: 78.9,
    target: 85,
  },
  {
    id: "ADA-2024-005",
    req: "Blood pressure monitoring each visit",
    pct: 94.1,
    target: 95,
  },
  {
    id: "ADA-2024-006",
    req: "eGFR/uACR annual screening",
    pct: 62.4,
    target: 75,
  },
  {
    id: "ADA-2024-007",
    req: "Depression screening (PHQ-9) annually",
    pct: 57.8,
    target: 75,
  },
  {
    id: "ADA-2024-008",
    req: "Smoking cessation counseling",
    pct: 64.7,
    target: 80,
  },
];

/* ── D7 Cost waterfall ───────────────────────────────────────────────────── */
const S9_COST_DATA = {
  providerMean: 42800,
  networkMean: 46200,
  breakdown: [
    { label: "Inpatient", amount: 23100, pct: 54, networkAmt: 25800 },
    { label: "Outpatient Visits", amount: 7200, pct: 17, networkAmt: 7900 },
    { label: "Pharmacy", amount: 6400, pct: 15, networkAmt: 6200 },
    { label: "Laboratory", amount: 2800, pct: 7, networkAmt: 3100 },
    { label: "Procedures", amount: 2100, pct: 5, networkAmt: 2400 },
    { label: "ED Visits", amount: 1200, pct: 3, networkAmt: 1800 },
  ],
};

/* ── Historical 8-period data for joinpoint/seasonality ─────────────────── */
const S9_HISTORICAL = [
  { period: "Q1 2024", score: 62.1, composite: 83 },
  { period: "Q2 2024", score: 64.8, composite: 85 },
  { period: "Q3 2024", score: 67.2, composite: 87 },
  { period: "Q4 2024", score: 69.5, composite: 88 },
  { period: "Q1 2025", score: 71.0, composite: 88 },
  { period: "Q2 2025", score: 73.4, composite: 90 },
  { period: "Q3 2025", score: 74.2, composite: 91 },
  { period: "Q4 2025", score: 74.1, composite: 92 },
];
// Seasonality: Q1 always ~4pp lower than avg
const S9_SEASONAL_DATA = {
  Q1: [62.1, 71.0], // 2024, 2025 — consistently lower
  Q2: [64.8, 73.4],
  Q3: [67.2, 74.2],
  Q4: [69.5, 74.1],
};

/* ── Exclusion criteria (D1-001) ─────────────────────────────────────────── */
const S9_EXCLUSIONS = [
  {
    id: "EX-001",
    desc: "Gestational diabetes (ICD-10 O24.x)",
    n: 8,
    pct: 2.1,
    required: true,
  },
  {
    id: "EX-002",
    desc: "Hospice or palliative care enrolment",
    n: 3,
    pct: 0.8,
    required: true,
  },
  {
    id: "EX-003",
    desc: "Enrolment < 90 days in measurement period",
    n: 12,
    pct: 3.1,
    required: true,
  },
  {
    id: "EX-004",
    desc: "Age < 18 years at period end",
    n: 0,
    pct: 0.0,
    required: true,
  },
  {
    id: "EX-005",
    desc: "No qualifying encounter in measurement period",
    n: 24,
    pct: 6.2,
    required: false,
  },
];
const S9_VENN = {
  // EX-003 (12), EX-005 (24), EX-001 (8)
  only003: 12,
  only005: 20,
  only001: 6,
  both_003_005: 4,
  both_005_001: 2,
  both_003_001: 2,
  all_three: 1,
};
const S9_EXCLUSION_SENSITIVITY = [
  { label: "Current (all exclusions)", score: 74.1, den: 340, delta: 0 },
  { label: "Remove EX-001", score: 73.5, den: 348, delta: -0.6 },
  { label: "Remove EX-002", score: 73.8, den: 343, delta: -0.3 },
  { label: "Remove EX-003", score: 72.4, den: 352, delta: -1.7 },
  { label: "Remove EX-005", score: 67.2, den: 364, delta: -6.9 },
  { label: "Remove ALL exclusions", score: 64.4, den: 387, delta: -9.7 },
];

/* ── Stratification data (D1-001 by age band) ────────────────────────────── */
const S9_STRATIFICATION_AGE = [
  {
    group: "18–44",
    n: 62,
    score: 74.2,
    ciLo: 62.1,
    ciHi: 83.7,
    delta: +6.3,
    pValue: 0.18,
    sig: false,
  },
  {
    group: "45–54",
    n: 98,
    score: 71.4,
    ciLo: 61.6,
    ciHi: 79.6,
    delta: +3.5,
    pValue: 0.32,
    sig: false,
  },
  {
    group: "55–64",
    n: 112,
    score: 65.2,
    ciLo: 55.8,
    ciHi: 73.6,
    delta: -2.7,
    pValue: 0.41,
    sig: false,
  },
  {
    group: "65+",
    n: 68,
    score: 58.8,
    ciLo: 46.6,
    ciHi: 70.0,
    delta: -9.1,
    pValue: 0.04,
    sig: true,
  },
];
const S9_STRATIFICATION_GENDER = [
  {
    group: "Female",
    n: 130,
    score: 70.8,
    ciLo: 62.4,
    ciHi: 78.1,
    delta: +2.9,
    pValue: 0.28,
    sig: false,
  },
  {
    group: "Male",
    n: 210,
    score: 64.8,
    ciLo: 57.9,
    ciHi: 71.2,
    delta: -3.1,
    pValue: 0.21,
    sig: false,
  },
];

/* ── Inception cohort (L3-C) ─────────────────────────────────────────────── */
const S9_COHORT = [
  {
    tp: "Baseline Q1 2025",
    n: 95,
    retained: 100,
    completerMean: 8.4,
    noncompleterMean: null,
  },
  {
    tp: "3mo Q2 2025",
    n: 82,
    retained: 86.3,
    completerMean: 8.0,
    noncompleterMean: 9.1,
  },
  {
    tp: "6mo Q3 2025",
    n: 71,
    retained: 74.7,
    completerMean: 7.6,
    noncompleterMean: 9.3,
  },
  {
    tp: "12mo Q4 2025",
    n: 58,
    retained: 61.1,
    completerMean: 7.2,
    noncompleterMean: 9.6,
  },
];

/* ── D3 Context (survey results) ─────────────────────────────────────────── */
const S9_D3_SURVEY = {
  responseRate: 72.4,
  meanSatisfaction: 4.1,
  strengths: [
    "Clear communication of diagnosis and treatment plan",
    "Provider availability and responsiveness to concerns",
    "Respectful and dignified treatment at all visits",
  ],
  improvements: [
    "Coordination between primary care and specialist referrals",
    "Wait times for urgent appointments",
    "Multilingual materials and interpreter availability",
  ],
};

/* ── D9 Context (equity) ─────────────────────────────────────────────────── */
const S9_D9_EQUITY = {
  significantDisparities: 3,
  findings: [
    "HbA1c control rate is 9.1pp lower in patients aged 65+ (p=0.04)",
    "Retinopathy screening completion is 14.2pp lower in rural facility catchment areas (p=0.01)",
    "PHQ-9 follow-up visit rate is 18.6pp lower in patients with low SES proxy (p=0.002)",
  ],
};
const DIM_SCORES_C1 = { D1: 95, D2: 90, D3: 88, D5: 91, D7: 94, D9: 90 };
const DIM_COMPOSITES = { composite: 92, period: "Q4 2025", prevComposite: 91 };
const CONTRACT1_DIMS = { D1: 30, D2: 20, D3: 10, D5: 15, D7: 15, D9: 10 };
export {
  S9_DIMENSIONS,
  S9_ICHOM_SETS_D1,
  S9_ICHOM_SETS_D2,
  S9_PROMS_FUNNEL,
  S9_FUNNEL_DROPOUT,
  S9_TRAJECTORIES,
  S9_RESPONDER_PROFILE,
  S9_ADA_GUIDELINES,
  S9_COST_DATA,
  S9_HISTORICAL,
  S9_SEASONAL_DATA,
  S9_EXCLUSIONS,
  S9_VENN,
  S9_EXCLUSION_SENSITIVITY,
  S9_STRATIFICATION_AGE,
  S9_STRATIFICATION_GENDER,
  S9_COHORT,
  S9_D3_SURVEY,
  S9_D9_EQUITY,
  DIM_SCORES_C1,
  DIM_COMPOSITES,
  CONTRACT1_DIMS,
};

export const VBHC_DIMENSIONS = DIMENSIONS;
export const VBHC_PROVIDERS = PROVIDERS;
export const VBHC_CONTRACTS = CONTRACTS;
export const VBHC_PERIODS = PERIODS;
export const VBHC_MEASURES_C1 = MEASURES_C1;
export const VBHC_P01_DIM = P01_DIM;
export const VBHC_P01_COMPOSITE = P01_COMPOSITE;
export const VBHC_P01_SCORES = P01_SCORE;
export const VBHC_NETWORK_C1 = NETWORK_C1;
export const VBHC_ALERTS = ALERTS;
export const VBHC_CASEMIX_P01 = CASEMIX_P01;
export const VBHC_COMPUTATION_D1_001 = COMPUTATION_D1_001;
export const VBHC_DENOM_PATIENTS = DENOM_PATIENTS;
export const VBHC_getStatus = getStatus;
export const VBHC_fmtScore = fmtScore;
export const VBHC_fmtThreshold = fmtThreshold;
export const VBHC_getProviderComposites = getProviderComposites;
export const VBHC_getProviderDimScores = getProviderDimScores;
export const VBHC_getMeasureRow = getMeasureRow;
export const VBHC_getAlerts = getAlerts;
export const VBHC_computeComposite = computeComposite;
export const VBHC_genDimScores = genDimScores;
