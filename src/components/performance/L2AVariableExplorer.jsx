import React from "react";
import { Icons } from "../Icons/Icons";
import {
  S9_FUNNEL_DROPOUT,
  S9_PROMS_FUNNEL,
  S9_DIMENSIONS,
  S9_TRAJECTORIES,
  VBHC_fmtScore,
  VBHC_fmtThreshold,
  S9_ADA_GUIDELINES,
} from "@/mock/performance";
import {
  BoxWhiskerPlot,
  CollectionFunnel,
  CostWaterfall,
  DataHistogram,
  GroupedBarErrors,
  ProportionBar,
  SeverityBar,
  SpaghettiPlot,
} from "./Charts2";
const { useState: useS9L2State, useMemo: useS9L2Memo } = React;

/* Shared slide-over pattern (same as session 8) */
function S9SlidePanel({
  open,
  onClose,
  crumb,
  title,
  subtitle,
  children,
  tabs,
  activeTab,
  onTab,
}) {
  React.useEffect(() => {
    function k(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  return (
    <>
      <div className={"l2-scrim" + (open ? " open" : "")} onClick={onClose} />
      <aside className={"l2-panel" + (open ? " open" : "")} role="dialog">
        <div className="l2-head">
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="l2-crumb">{crumb}</div>
            <h2>{title}</h2>
            {subtitle && (
              <p
                style={{
                  font: "400 12px/18px var(--font-sans)",
                  color: "var(--fg-secondary)",
                  margin: "6px 0 0",
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          <button className="l2-close" onClick={onClose}>
            {Icons.close}
          </button>
        </div>
        {tabs && (
          <div className="l2-tabs">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={"l2-tab" + (activeTab === t.id ? " active" : "")}
                onClick={() => onTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
        <div className="l2-body">{children}</div>
      </aside>
    </>
  );
}

/* ── Patient mini table ─────────────────────────────────────────────────── */
function PatientMiniTable({ variable }) {
  const router = useRouter();
  const patients = Array.from({ length: 20 }, (_, i) => {
    const seed = i * 7 + 100;
    const age = 40 + Math.floor(s9rand(seed, 1) * 35);
    const isFemale = s9rand(seed, 2) > 0.58;
    const baseVal = variable.mean + (s9rand(seed, 3) - 0.5) * variable.sd * 2;
    const val = Math.round(baseVal * 10) / 10;
    const met =
      variable.type === "continuous"
        ? variable.targetDir === "lower"
          ? val <= variable.target
          : val >= variable.target
        : s9rand(seed, 4) < (variable.rate || 70) / 100;
    return {
      id: `PT-${String(i + 1).padStart(3, "0")}`,
      age,
      sex: isFemale ? "F" : "M",
      val:
        variable.type === "continuous"
          ? `${val} ${variable.unit}`
          : met
            ? "Yes"
            : "No",
      met,
      date: `${12 - (i % 3)} Dec 2024`,
    };
  });
  return (
    <div>
      <table className="l2-table">
        <thead>
          <tr>
            <th>Patient ID</th>
            <th>Age</th>
            <th>Sex</th>
            <th>Value</th>
            <th>Status</th>
            <th>Last Measurement</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr
              key={p.id}
              onClick={() =>
                router.push(`/performance/patient-details/${p.id}`)
              }
            >
              <td>
                <span className="mono">{p.id}</span>
              </td>
              <td>{p.age}</td>
              <td>{p.sex}</td>
              <td>
                <span
                  style={{
                    font: "600 11px var(--font-mono)",
                    color: "var(--fg-primary)",
                  }}
                >
                  {p.val}
                </span>
              </td>
              <td>
                <span
                  style={{
                    font: "500 9px var(--font-mono)",
                    padding: "2px 7px",
                    borderRadius: 4,
                    border: ".5px solid currentColor",
                    background: p.met
                      ? "var(--perf-target-soft)"
                      : "var(--perf-floor-soft)",
                    color: p.met ? "var(--perf-target)" : "var(--perf-floor)",
                  }}
                >
                  {p.met ? "Met" : "Not Met"}
                </span>
              </td>
              <td
                style={{
                  color: "var(--fg-tertiary)",
                  font: "400 11px var(--font-sans)",
                }}
              >
                {p.date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Variable Accordion Row ─────────────────────────────────────────────── */
function VariableRow({ variable, idx }) {
  const [expanded, setExpanded] = useS9L2State(false);
  const [showPatients, setShowPatients] = useS9L2State(false);

  const statusColor =
    variable.type === "categorical"
      ? variable.targetDir === "lower"
        ? variable.rate <= variable.target
          ? "var(--perf-target)"
          : "var(--perf-below)"
        : variable.rate >= variable.target
          ? "var(--perf-target)"
          : "var(--perf-below)"
      : variable.target == null
        ? "var(--fg-tertiary)"
        : variable.targetDir === "lower"
          ? variable.mean <= variable.target
            ? "var(--perf-target)"
            : "var(--perf-below)"
          : variable.mean >= variable.target
            ? "var(--perf-target)"
            : "var(--perf-below)";

  const displayVal =
    variable.type === "categorical"
      ? `${variable.rate}%`
      : variable.type === "proms"
        ? `Mean ${variable.mean} pts`
        : `Mean ${variable.mean} ${variable.unit}`;

  return (
    <div
      style={{
        border: ".5px solid var(--border-default)",
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      {/* Collapsed row */}
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "11px 16px",
          cursor: "pointer",
          background: expanded ? "var(--bg-elevated)" : "var(--bg-surface)",
          transition: "background .1s",
        }}
      >
        <span
          style={{
            width: 18,
            font: "600 11px var(--font-mono)",
            color: "var(--fg-tertiary)",
            flexShrink: 0,
          }}
        >
          {String(idx + 1).padStart(2, "0")}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              font: "500 13px var(--font-sans)",
              color: "var(--fg-primary)",
            }}
          >
            {variable.name}
          </div>
          <div
            style={{
              font: "400 10px var(--font-mono)",
              color: "var(--fg-tertiary)",
              marginTop: 2,
            }}
          >
            {variable.code}
          </div>
        </div>
        <span
          style={{
            font: "400 10px var(--font-sans)",
            color: "var(--fg-tertiary)",
            flexShrink: 0,
          }}
        >
          n={variable.n}
        </span>
        <span
          style={{
            font: "700 12px var(--font-mono)",
            color: statusColor,
            flexShrink: 0,
          }}
        >
          {displayVal}
        </span>
        {variable.target != null && (
          <span
            style={{
              font: "400 10px var(--font-mono)",
              color: "var(--fg-tertiary)",
              flexShrink: 0,
            }}
          >
            Target: {variable.targetDir === "lower" ? "<" : ">"}
            {variable.target}
            {variable.unit}
          </span>
        )}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: statusColor,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            color: "var(--fg-tertiary)",
            fontSize: 11,
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform .2s",
          }}
        >
          ▼
        </span>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div
          style={{
            padding: "16px 18px",
            borderTop: ".5px solid var(--border-default)",
            background: "var(--bg-surface)",
          }}
        >
          {/* Continuous variable */}
          {variable.type === "continuous" && variable.values && (
            <div>
              {/* Summary stats */}
              <div className="metric-row" style={{ marginBottom: 14 }}>
                {[
                  { label: "Mean", val: variable.mean + " " + variable.unit },
                  { label: "Std Dev", val: "±" + variable.sd },
                  {
                    label: "Min",
                    val: Math.min(...variable.values).toFixed(1),
                  },
                  {
                    label: "Max",
                    val: Math.max(...variable.values).toFixed(1),
                  },
                ].map((x) => (
                  <div
                    key={x.label}
                    className="metric-box"
                    style={{ padding: "10px 12px" }}
                  >
                    <div className="m-label">{x.label}</div>
                    <div
                      style={{
                        font: "600 15px var(--font-sans)",
                        color: "var(--fg-primary)",
                        marginTop: 4,
                      }}
                    >
                      {x.val}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
                <div>
                  <div className="l2-section-title">
                    Box & Whisker Distribution
                  </div>
                  <BoxWhiskerPlot
                    values={variable.values}
                    target={variable.target}
                    targetDir={variable.targetDir}
                    unit={variable.unit}
                    width={320}
                    height={80}
                  />
                </div>
                <div>
                  <div className="l2-section-title">
                    Patient Distribution Histogram
                  </div>
                  <DataHistogram
                    values={variable.values}
                    target={variable.target}
                    targetDir={variable.targetDir}
                    unit={variable.unit}
                    width={300}
                    height={100}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PROMs variable */}
          {variable.type === "proms" && variable.values && (
            <div>
              <div className="metric-row" style={{ marginBottom: 14 }}>
                {[
                  { label: "Mean Score", val: variable.mean + " pts" },
                  { label: "Std Dev", val: "±" + variable.sd },
                  {
                    label: "Target",
                    val:
                      (variable.targetDir === "lower" ? "<" : ">") +
                      variable.target +
                      " pts",
                  },
                ].map((x) => (
                  <div
                    key={x.label}
                    className="metric-box"
                    style={{ padding: "10px 12px" }}
                  >
                    <div className="m-label">{x.label}</div>
                    <div
                      style={{
                        font: "600 15px var(--font-sans)",
                        color: "var(--fg-primary)",
                        marginTop: 4,
                      }}
                    >
                      {x.val}
                    </div>
                  </div>
                ))}
              </div>
              {variable.severity && (
                <div>
                  <div className="l2-section-title">
                    Severity Category Breakdown
                  </div>
                  <SeverityBar segments={variable.severity} width={380} />
                </div>
              )}
              <div style={{ marginTop: 14 }}>
                <div className="l2-section-title">Score Distribution</div>
                <DataHistogram
                  values={variable.values}
                  target={variable.target}
                  targetDir={variable.targetDir}
                  unit="pts"
                  width={340}
                  height={100}
                />
              </div>
            </div>
          )}

          {/* Categorical variable */}
          {variable.type === "categorical" && (
            <div>
              <div className="metric-row" style={{ marginBottom: 14 }}>
                {[
                  { label: "Rate", val: variable.rate + "%" },
                  {
                    label: "95% CI",
                    val: `[${variable.ci[0]}% – ${variable.ci[1]}%]`,
                  },
                  {
                    label: "Target",
                    val:
                      (variable.targetDir === "lower" ? "<" : "") +
                      variable.target +
                      "%",
                  },
                  { label: "n", val: variable.n },
                ].map((x) => (
                  <div
                    key={x.label}
                    className="metric-box"
                    style={{ padding: "10px 12px" }}
                  >
                    <div className="m-label">{x.label}</div>
                    <div
                      style={{
                        font: "600 15px var(--font-sans)",
                        color: "var(--fg-primary)",
                        marginTop: 4,
                      }}
                    >
                      {x.val}
                    </div>
                  </div>
                ))}
              </div>
              <div className="l2-section-title">
                Proportion with Confidence Interval
              </div>
              <ProportionBar
                rate={variable.rate}
                ciLo={variable.ci[0]}
                ciHi={variable.ci[1]}
                target={variable.target}
                targetDir={variable.targetDir}
                width={340}
                height={36}
              />
            </div>
          )}

          {/* View patients link */}
          <div style={{ marginTop: 14, display: "flex", gap: 12 }}>
            <button
              className="btn secondary"
              style={{ fontSize: 11, padding: "4px 12px" }}
              onClick={() => setShowPatients((v) => !v)}
            >
              {showPatients ? "Hide" : "View"} Patients (first 20)
            </button>
            <button
              className="btn ghost"
              style={{
                fontSize: 11,
                padding: "4px 12px",
                color: "var(--accent)",
              }}
              onClick={() => window.__openL3A && window.__openL3A()}
            >
              Audit Exclusions (L3-A)
            </button>
            <button
              className="btn ghost"
              style={{
                fontSize: 11,
                padding: "4px 12px",
                color: "var(--fg-secondary)",
              }}
              onClick={() => window.__openL3B && window.__openL3B()}
            >
              Stratify by Demographics (L3-B)
            </button>
          </div>
          {showPatients && (
            <div style={{ marginTop: 12 }}>
              <PatientMiniTable variable={variable} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L2-A  ICHOM Variable Explorer
   ══════════════════════════════════════════════════════════════════════════ */
function L2AVariableExplorer({ open, onClose, set, onOpenL3A, onOpenL3B }) {
  React.useEffect(() => {
    window.__openL3A = onOpenL3A;
    window.__openL3B = onOpenL3B;
  }, [onOpenL3A, onOpenL3B]);

  if (!set)
    return (
      <S9SlidePanel
        open={open}
        onClose={onClose}
        crumb="L2-A"
        title="Variable Explorer"
      >
        {null}
      </S9SlidePanel>
    );

  return (
    <S9SlidePanel
      open={open}
      onClose={onClose}
      crumb={"L2-A · " + set.id + " · Variable Explorer"}
      title={set.name + " — Outcome Variables"}
      subtitle={`${set.outcomeVars} outcome variables tracked in this ICHOM Set. Expand any variable for full distribution details, patient list, and audit options.`}
    >
      <div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[
            {
              l: "Set Score",
              v: set.score.toFixed(1) + "/100",
              c: "var(--accent)",
            },
            { l: "Completeness", v: set.completeness + "%" },
            {
              l: "Trend",
              v:
                (set.trend >= 0 ? "▲" : "▼") +
                " " +
                Math.abs(set.trend).toFixed(1) +
                "pp",
              c: set.trend >= 0 ? "var(--perf-target)" : "var(--perf-floor)",
            },
          ].map((x) => (
            <div key={x.l} className="metric-box" style={{ flex: 1 }}>
              <div className="m-label">{x.l}</div>
              <div
                className="m-val"
                style={{ color: x.c || "var(--fg-primary)", fontSize: 16 }}
              >
                {x.v}
              </div>
            </div>
          ))}
        </div>
        {(set.variables || []).map((v, i) => (
          <VariableRow key={v.id} variable={v} idx={i} />
        ))}
      </div>
    </S9SlidePanel>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L2-B  PROMs Trajectory Analysis
   ══════════════════════════════════════════════════════════════════════════ */
function L2BPromsTrajectory({ open, onClose, set }) {
  const [tab, setTab] = useS9L2State("funnel");
  const tabs = [
    { id: "funnel", label: "Collection Funnel" },
    { id: "spaghetti", label: "Score Trajectories" },
    { id: "responder", label: "Responder Analysis" },
    { id: "profile", label: "Non-Responder Profile" },
  ];

  const nImproved = S9_TRAJECTORIES.filter(
    (t) => t.status === "improved",
  ).length;
  const nStable = S9_TRAJECTORIES.filter((t) => t.status === "stable").length;
  const nWorsened = S9_TRAJECTORIES.filter(
    (t) => t.status === "worsened",
  ).length;
  const mcid = 5;
  const responderRate = ((nImproved / S9_TRAJECTORIES.length) * 100).toFixed(1);

  return (
    <S9SlidePanel
      open={open}
      onClose={onClose}
      crumb={"L2-B · PROMs Trajectory Analysis · " + (set?.name || "D2")}
      title="PROMs Trajectory Analysis"
      subtitle="Collection funnel, individual patient trajectories, responder analysis, and non-responder profile for Patient-Reported Outcomes."
      tabs={tabs}
      activeTab={tab}
      onTab={setTab}
    >
      {/* Section 1 — Collection Funnel */}
      {tab === "funnel" && (
        <div>
          <div className="l2-section-title">
            PROMs Collection Funnel — {set?.name || "All Sets"}
          </div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            <CollectionFunnel steps={S9_PROMS_FUNNEL} width={380} />
          </div>
          <div className="l2-section-title" style={{ marginTop: 18 }}>
            Dropout Analysis — Characteristics at Each Stage
          </div>
          <table className="l2-table">
            <thead>
              <tr>
                <th>Stage</th>
                <th>n Lost</th>
                <th>Mean Age</th>
                <th>% Male</th>
                <th>Charlson</th>
                <th>Baseline PHQ-9</th>
              </tr>
            </thead>
            <tbody>
              {S9_FUNNEL_DROPOUT.map((row) => (
                <tr
                  key={row.stage}
                  style={{
                    background:
                      row.stage === "Completers"
                        ? "var(--accent-soft)"
                        : "transparent",
                  }}
                >
                  <td
                    style={{
                      font:
                        row.stage === "Completers"
                          ? "600 12px var(--font-sans)"
                          : "400 12px var(--font-sans)",
                    }}
                  >
                    {row.stage}
                  </td>
                  <td style={{ font: "600 11px var(--font-mono)" }}>{row.n}</td>
                  <td
                    style={{
                      font: "500 11px var(--font-mono)",
                      color:
                        row.age > 55
                          ? "var(--perf-floor)"
                          : "var(--fg-secondary)",
                    }}
                  >
                    {row.age}
                  </td>
                  <td style={{ font: "500 11px var(--font-mono)" }}>
                    {row.malePct}%
                  </td>
                  <td
                    style={{
                      font: "500 11px var(--font-mono)",
                      color:
                        row.charlson > 3
                          ? "var(--perf-floor)"
                          : "var(--fg-secondary)",
                    }}
                  >
                    {row.charlson}
                  </td>
                  <td
                    style={{
                      font: "500 11px var(--font-mono)",
                      color:
                        row.baselinePHQ > 14
                          ? "var(--perf-floor)"
                          : "var(--fg-secondary)",
                    }}
                  >
                    {row.baselinePHQ}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              marginTop: 10,
              padding: "10px 14px",
              background: "var(--perf-below-soft)",
              borderRadius: 8,
              border: ".5px solid var(--perf-below)",
            }}
          >
            <p
              style={{
                font: "400 11px/16px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: 0,
              }}
            >
              Dropout patients had higher baseline PHQ-9 scores (14.2–15.1)
              compared to completers (11.4), suggesting systematic bias.
              Improving trajectories may be partially an artifact of sicker
              patients failing to complete follow-up assessments.
            </p>
          </div>
        </div>
      )}

      {/* Section 2 — Spaghetti Plot */}
      {tab === "spaghetti" && (
        <div>
          <div className="metric-row" style={{ marginBottom: 14 }}>
            {[
              {
                label: "Improved (MCID ≥5)",
                val: nImproved,
                color: "var(--perf-target)",
              },
              {
                label: "Stable (±MCID)",
                val: nStable,
                color: "var(--fg-tertiary)",
              },
              {
                label: "Worsened (MCID ≥5)",
                val: nWorsened,
                color: "var(--perf-floor)",
              },
            ].map((x) => (
              <div
                key={x.label}
                className="metric-box"
                style={{ borderColor: x.color }}
              >
                <div className="m-label">{x.label}</div>
                <div className="m-val" style={{ color: x.color }}>
                  {x.val}
                </div>
                <div className="m-sub">
                  {((x.val / S9_TRAJECTORIES.length) * 100).toFixed(0)}% of
                  cohort
                </div>
              </div>
            ))}
          </div>
          <div className="l2-section-title">
            PHQ-9 Score Trajectories — Individual Patient Lines + Cohort Mean
          </div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            <SpaghettiPlot
              trajectories={S9_TRAJECTORIES}
              xLabels={["Baseline", "3 Months", "6 Months", "12 Months"]}
              yMin={0}
              yMax={27}
              yLabel="PHQ-9"
              width={500}
              height={240}
            />
          </div>
          <p
            style={{
              font: "400 11px/16px var(--font-mono)",
              color: "var(--fg-tertiary)",
              margin: "10px 0 0",
            }}
          >
            Thick line = cohort mean with labeled values. Individual lines
            color-coded by 12-month outcome. MCID = {mcid} points. Bold numbers
            = mean PHQ-9 at each timepoint.
          </p>
        </div>
      )}

      {/* Section 3 — Responder Analysis */}
      {tab === "responder" && (
        <div>
          <div className="metric-row" style={{ marginBottom: 14 }}>
            {[
              {
                label: "MCID Threshold (PHQ-9)",
                val: mcid + " points",
                sub: "Minimum Clinically Important Difference",
              },
              {
                label: "Responder Rate",
                val: responderRate + "%",
                sub: "of completers achieved MCID",
              },
              {
                label: "NNT Equivalent",
                val: "1.8 patients",
                sub: "per meaningful improvement",
              },
            ].map((x) => (
              <div key={x.label} className="metric-box">
                <div className="m-label">{x.label}</div>
                <div className="m-val" style={{ fontSize: 15 }}>
                  {x.val}
                </div>
                {x.sub && <div className="m-sub">{x.sub}</div>}
              </div>
            ))}
          </div>
          <div className="l2-section-title">
            Response Rate by Baseline Severity
          </div>
          <div className="l2-card">
            {[
              { severity: "Mild (PHQ-9 5–9)", respRate: 71, n: 45 },
              { severity: "Moderate (10–14)", respRate: 62, n: 78 },
              { severity: "Mod-Severe (15–19)", respRate: 54, n: 36 },
              { severity: "Severe (20–27)", respRate: 48, n: 21 },
            ].map((row) => (
              <div
                key={row.severity}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    width: 160,
                    font: "400 11px var(--font-sans)",
                    color: "var(--fg-secondary)",
                    flexShrink: 0,
                  }}
                >
                  {row.severity}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 20,
                    background: "var(--bg-elevated)",
                    borderRadius: 4,
                    overflow: "hidden",
                    border: ".5px solid var(--border-default)",
                  }}
                >
                  <div
                    style={{
                      width: row.respRate + "%",
                      height: "100%",
                      background: "var(--perf-target)",
                      opacity: 0.8,
                    }}
                  />
                </div>
                <span
                  style={{
                    font: "600 12px var(--font-mono)",
                    color: "var(--perf-target)",
                    width: 48,
                    flexShrink: 0,
                  }}
                >
                  {row.respRate}%
                </span>
                <span
                  style={{
                    font: "400 10px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    width: 40,
                    flexShrink: 0,
                  }}
                >
                  n={row.n}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 4 — Non-Responder Profile */}
      {tab === "profile" && (
        <div>
          <div className="l2-section-title">
            Responders vs Non-Responders — Case-Mix Comparison
          </div>
          <table className="l2-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Responders</th>
                <th>Non-Responders</th>
                <th>p-value</th>
                <th>Significant?</th>
              </tr>
            </thead>
            <tbody>
              {S9_RESPONDER_PROFILE.map((row) => (
                <tr
                  key={row.variable}
                  style={{
                    background: row.significant
                      ? "var(--perf-below-soft)"
                      : "transparent",
                  }}
                >
                  <td style={{ font: "500 12px var(--font-sans)" }}>
                    {row.variable}
                  </td>
                  <td
                    style={{
                      font: "600 11px var(--font-mono)",
                      color: "var(--accent)",
                    }}
                  >
                    {row.responders}
                  </td>
                  <td
                    style={{
                      font: "600 11px var(--font-mono)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {row.nonResponders}
                  </td>
                  <td
                    style={{
                      font: "500 11px var(--font-mono)",
                      color: row.significant
                        ? "var(--perf-floor)"
                        : "var(--fg-tertiary)",
                    }}
                  >
                    p={row.pValue}
                  </td>
                  <td>
                    {row.significant ? (
                      <span
                        style={{
                          color: "var(--perf-floor)",
                          font: "600 11px var(--font-sans)",
                        }}
                      >
                        ★ Yes
                      </span>
                    ) : (
                      <span
                        style={{
                          color: "var(--fg-tertiary)",
                          font: "400 11px var(--font-sans)",
                        }}
                      >
                        No
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div
            style={{
              marginTop: 14,
              padding: "12px 16px",
              background: "var(--perf-below-soft)",
              borderRadius: 8,
              border: ".5px solid var(--perf-below)",
            }}
          >
            <p
              style={{
                font: "400 12px/18px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: 0,
              }}
            >
              Non-responders cluster in older patients with higher comorbidity
              burden and diabetes comorbidity. This may indicate that the
              depression treatment approach needs modification for patients with
              complex multi-morbidity. Linked to D9 (Health Equity) for
              disparity monitoring.
            </p>
          </div>
        </div>
      )}
    </S9SlidePanel>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L2-C  Measure Deep-Dive
   ══════════════════════════════════════════════════════════════════════════ */
function L2CMeasureDeepDive({
  open,
  onClose,
  measure,
  dimId,
  onOpenL3A,
  onOpenL3B,
  onOpenL3C,
}) {
  const [tab, setTab] = useS9L2State("spec");
  const tabs = [
    { id: "spec", label: "Specification" },
    { id: "compute", label: "Computation" },
    { id: "trend", label: "Trend" },
    { id: "peers", label: "Peer Comparison" },
    { id: "context", label: "Dimension Context" },
  ];

  if (!measure)
    return (
      <S9SlidePanel
        open={open}
        onClose={onClose}
        crumb="L2-C"
        title="Measure Deep-Dive"
      >
        {null}
      </S9SlidePanel>
    );

  const dimColor = (S9_DIMENSIONS[dimId] || {}).color || "#888";
  const adjScore = measure.adj || measure.target;
  const status = measure.status || { key: "target", label: "At Target" };
  const sc = {
    exceeds: "var(--perf-exceeds)",
    target: "var(--perf-target)",
    below: "var(--perf-below)",
    floor: "var(--perf-floor)",
  }[status.key];

  const trendData = [
    adjScore * 0.93,
    adjScore * 0.96,
    adjScore * 0.98,
    adjScore,
  ];

  // D5 context
  const D5Context = () => (
    <div>
      <div className="l2-section-title">
        Guideline Requirements Feeding This Measure
      </div>
      <table className="l2-table">
        <thead>
          <tr>
            <th>Requirement ID</th>
            <th>Description</th>
            <th style={{ textAlign: "right" }}>Compliance</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {S9_ADA_GUIDELINES.map((g) => {
            const met = g.pct >= g.target;
            return (
              <tr key={g.id}>
                <td>
                  <span className="m-id">{g.id}</span>
                </td>
                <td
                  style={{
                    font: "400 11px var(--font-sans)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {g.req}
                </td>
                <td
                  style={{
                    textAlign: "right",
                    font: "600 11px var(--font-mono)",
                    color: met ? "var(--perf-target)" : "var(--perf-below)",
                  }}
                >
                  {g.pct}%
                </td>
                <td>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: met
                        ? "var(--perf-target)"
                        : "var(--perf-below)",
                      display: "inline-block",
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // D7 context
  const D7Context = () => (
    <div>
      <div className="l2-section-title">
        Cost Decomposition — Total Cost of Care
      </div>
      <div className="metric-row" style={{ marginBottom: 14 }}>
        <div className="metric-box">
          <div className="m-label">Provider Mean</div>
          <div className="m-val" style={{ color: "var(--perf-target)" }}>
            SAR 42,800
          </div>
        </div>
        <div className="metric-box">
          <div className="m-label">Network Mean</div>
          <div className="m-val">SAR 46,200</div>
        </div>
        <div
          className="metric-box"
          style={{
            borderColor: "var(--perf-target)",
            background: "var(--perf-target-soft)",
          }}
        >
          <div className="m-label">Below Network By</div>
          <div className="m-val" style={{ color: "var(--perf-target)" }}>
            SAR 3,400
          </div>
        </div>
      </div>
      <CostWaterfall
        items={S9_COST_DATA.breakdown}
        total={S9_COST_DATA.providerMean}
        networkTotal={S9_COST_DATA.networkMean}
        width={460}
        height={170}
      />
    </div>
  );

  return (
    <S9SlidePanel
      open={open}
      onClose={onClose}
      crumb={"L2-C · " + (measure.id || dimId) + " · Deep-Dive"}
      title={measure.name || measure.shortName}
      subtitle={
        "Dimension " + dimId + " — " + (S9_DIMENSIONS[dimId] || {}).name
      }
      tabs={tabs}
      activeTab={tab}
      onTab={setTab}
    >
      {tab === "spec" && (
        <div>
          <div className="metric-row">
            <div
              className="metric-box"
              style={{ borderLeft: `3px solid ${dimColor}` }}
            >
              <div className="m-label">Status</div>
              <div className="m-val" style={{ color: sc, fontSize: 15 }}>
                {status.label}
              </div>
            </div>
            <div className="metric-box">
              <div className="m-label">Score</div>
              <div className="m-val" style={{ color: sc }}>
                {VBHC_fmtScore(adjScore, measure.unit)}
              </div>
            </div>
            <div className="metric-box">
              <div className="m-label">Target / Floor / Stretch</div>
              <div
                style={{
                  font: "500 11px/18px var(--font-mono)",
                  color: "var(--fg-primary)",
                  marginTop: 4,
                }}
              >
                {VBHC_fmtThreshold(
                  measure.target,
                  measure.unit,
                  measure.lowerBetter,
                )}{" "}
                /{" "}
                {VBHC_fmtThreshold(
                  measure.floor,
                  measure.unit,
                  measure.lowerBetter,
                )}{" "}
                /{" "}
                {VBHC_fmtThreshold(
                  measure.stretch,
                  measure.unit,
                  measure.lowerBetter,
                )}
              </div>
            </div>
          </div>
          <div className="l2-section-title" style={{ marginTop: 14 }}>
            Numerator
          </div>
          <div className="l2-card">
            <p
              style={{
                font: "400 12px/18px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: 0,
              }}
            >
              {measure.num}
            </p>
          </div>
          <div className="l2-section-title" style={{ marginTop: 10 }}>
            Denominator
          </div>
          <div className="l2-card">
            <p
              style={{
                font: "400 12px/18px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: 0,
              }}
            >
              {measure.den}
            </p>
          </div>
          <div className="l2-section-title" style={{ marginTop: 10 }}>
            Exclusions
          </div>
          <div className="l2-card">
            <p
              style={{
                font: "400 12px/18px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: 0,
              }}
            >
              {measure.excl}
            </p>
          </div>
          <div
            style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}
          >
            <button
              className="btn secondary"
              style={{ fontSize: 11 }}
              onClick={() => onOpenL3A && onOpenL3A()}
            >
              Audit Exclusions (L3-A)
            </button>
            <button
              className="btn secondary"
              style={{ fontSize: 11 }}
              onClick={() => onOpenL3B && onOpenL3B()}
            >
              Stratify by Demographics (L3-B)
            </button>
            <button
              className="btn secondary"
              style={{ fontSize: 11 }}
              onClick={() => onOpenL3C && onOpenL3C()}
            >
              Cohort Tracking (L3-C)
            </button>
          </div>
        </div>
      )}

      {tab === "compute" && (
        <div>
          <div className="metric-row">
            {[
              { label: "Denominator", val: "340" },
              { label: "Numerator", val: "252" },
              { label: "Exclusions", val: "47" },
              {
                label: "Raw Rate",
                val: VBHC_fmtScore(adjScore * 0.95, measure.unit),
              },
              { label: "Risk Factor", val: "1.054" },
              { label: "Adj Rate", val: VBHC_fmtScore(adjScore, measure.unit) },
            ].map((x) => (
              <div
                key={x.label}
                className="metric-box"
                style={{ flex: "1 1 100px" }}
              >
                <div className="m-label">{x.label}</div>
                <div className="m-val" style={{ fontSize: 15 }}>
                  {x.val}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "trend" && (
        <div>
          <div className="l2-section-title">Score Trend — 4 Periods</div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            {/* Simple inline trend chart */}
            <svg width={480} height={140} style={{ overflow: "visible" }}>
              {(() => {
                const pd = { l: 40, r: 40, t: 20, b: 28 };
                const cw = 400,
                  ch = 92;
                const min = Math.min(...trendData) * 0.9;
                const max = Math.max(...trendData) * 1.05;
                const r = max - min;
                const sx = (i) => pd.l + (i / 3) * cw;
                const sy = (v) => pd.t + ch - ((v - min) / r) * ch;
                const pts = trendData
                  .map((v, i) => `${sx(i).toFixed(1)},${sy(v).toFixed(1)}`)
                  .join(" ");
                const targetY = sy(measure.target);
                return (
                  <g>
                    <line
                      x1={pd.l}
                      y1={targetY}
                      x2={pd.l + cw}
                      y2={targetY}
                      stroke="var(--perf-target)"
                      strokeWidth="1"
                      strokeDasharray="4,3"
                    />
                    <text
                      x={pd.l + cw + 4}
                      y={targetY}
                      dominantBaseline="central"
                      fill="var(--perf-target)"
                      style={{ font: "500 8px var(--font-mono)" }}
                    >
                      Target
                    </text>
                    <polyline
                      points={pts}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {trendData.map((v, i) => (
                      <g key={i}>
                        <circle
                          cx={sx(i)}
                          cy={sy(v)}
                          r="4"
                          fill="var(--accent)"
                          stroke="white"
                          strokeWidth="1.5"
                        />
                        <text
                          x={sx(i)}
                          y={sy(v) - 10}
                          textAnchor="middle"
                          fill="var(--fg-primary)"
                          style={{ font: "600 10px var(--font-sans)" }}
                        >
                          {VBHC_fmtScore(v, measure.unit)}
                        </text>
                        <text
                          x={sx(i)}
                          y={pd.t + ch + 16}
                          textAnchor="middle"
                          fill="var(--fg-tertiary)"
                          style={{ font: "500 8px var(--font-mono)" }}
                        >
                          Q{i + 1} 2025
                        </text>
                      </g>
                    ))}
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>
      )}

      {tab === "peers" && (
        <div>
          <div className="l2-section-title">
            Peer Comparison — Network (48 providers)
          </div>
          <div className="l2-card">
            <GroupedBarErrors
              data={[
                {
                  group: "This Provider",
                  score: adjScore,
                  ciLo: adjScore * 0.94,
                  ciHi: adjScore * 1.06,
                  sig: false,
                },
                {
                  group: "Network Mean",
                  score: adjScore * 0.97,
                  ciLo: adjScore * 0.92,
                  ciHi: adjScore * 1.02,
                  sig: false,
                },
                {
                  group: "p75",
                  score: adjScore * 1.05,
                  ciLo: adjScore * 1.0,
                  ciHi: adjScore * 1.1,
                  sig: false,
                },
                {
                  group: "p25",
                  score: adjScore * 0.88,
                  ciLo: adjScore * 0.84,
                  ciHi: adjScore * 0.92,
                  sig: false,
                },
              ]}
              overall={adjScore * 0.97}
              target={measure.target}
              width={400}
              height={160}
            />
          </div>
        </div>
      )}

      {tab === "context" && (
        <div>
          <div className="l2-section-title">
            Dimension Context — {(S9_DIMENSIONS[dimId] || {}).name}
          </div>
          {dimId === "D5" && <D5Context />}
          {dimId === "D7" && <D7Context />}
          {dimId !== "D5" && dimId !== "D7" && (
            <div className="l2-card">
              <p
                style={{
                  font: "400 12px/18px var(--font-sans)",
                  color: "var(--fg-secondary)",
                  margin: 0,
                }}
              >
                Dimension-specific context for{" "}
                {(S9_DIMENSIONS[dimId] || {}).name} is shown in the Layer 1
                context panel below the measure table.
              </p>
            </div>
          )}
        </div>
      )}
    </S9SlidePanel>
  );
}
export { L2AVariableExplorer, L2BPromsTrajectory, L2CMeasureDeepDive };
