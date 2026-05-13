import { S9_COHORT, S9_EXCLUSION_SENSITIVITY, S9_EXCLUSIONS, S9_HISTORICAL, S9_SEASONAL_DATA, S9_STRATIFICATION_AGE, S9_STRATIFICATION_GENDER, S9_VENN } from "@/mock/performance";
import React from "react";
import { GroupedBarErrors, VennDiagram } from "./Charts2";
import { Icons } from "../Icons/Icons";
const {
  useState: useS9State,
  useMemo: useS9Memo,
  useEffect: useS9Effect,
} = React;

/* shared full-screen overlay (re-implement for standalone session-9) */
function S9Overlay({ open, onClose, crumb, title, children, headerRight }) {
  useS9Effect(() => {
    function k(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 120,
        background: "var(--bg-canvas)",
        backgroundImage: "radial-gradient(rgba(0,0,0,.07) 1px,transparent 1px)",
        backgroundSize: "16px 16px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 52,
          borderBottom: ".5px solid var(--border-default)",
          background: "var(--bg-surface)",
          display: "flex",
          alignItems: "center",
          padding: "0 28px",
          gap: 12,
          flexShrink: 0,
          boxShadow: "var(--shadow-pill)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            width: 30,
            height: 30,
            borderRadius: "50%",
            border: ".5px solid var(--border-default)",
            background: "var(--bg-elevated)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: "var(--fg-secondary)",
            flexShrink: 0,
          }}
        >
          {Icons.close}
        </button>
        {crumb.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <span style={{ color: "var(--fg-tertiary)", fontSize: 11 }}>
                ›
              </span>
            )}
            <span
              style={{
                font:
                  i === crumb.length - 1
                    ? "500 12px var(--font-sans)"
                    : "400 12px var(--font-sans)",
                color:
                  i === crumb.length - 1
                    ? "var(--fg-primary)"
                    : "var(--fg-tertiary)",
              }}
            >
              {c}
            </span>
          </React.Fragment>
        ))}
        <div style={{ flex: 1 }} />
        {headerRight}
      </div>
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L3-A  Exclusion & Denominator Audit
   ══════════════════════════════════════════════════════════════════════════ */
function L3AExclusionAudit({ open, onClose, measureName }) {
  const [selectedEx, setSelectedEx] = useS9State(null);
  const [showPatients, setShowPatients] = useS9State(false);

  const genPatients = (ex) =>
    Array.from({ length: 5 }, (_, i) => {
      const seed = i * 13 + ex.id.charCodeAt(3) * 7;
      const age = 28 + Math.floor(s9rand(seed, 1) * 50);
      return {
        id: `PT-EX-${ex.id}-${String(i + 1).padStart(2, "0")}`,
        age,
        sex: s9rand(seed, 2) > 0.55 ? "M" : "F",
        reason: ex.desc,
        trigger:
          ex.id === "EX-001"
            ? "ICD-10 O24.1 in active problem list"
            : ex.id === "EX-002"
              ? "Hospice enrolment flag = TRUE in CNHI registry"
              : ex.id === "EX-003"
                ? `Attribution start ${Math.floor(s9rand(seed, 3) * 60) + 1} days before period end`
                : ex.id === "EX-005"
                  ? "0 qualifying encounters in 2025"
                  : "Age < 18 at 31 Dec 2025",
        since: `${Math.floor(s9rand(seed, 4) * 12) + 1} Jan 2025`,
      };
    });

  return (
    <S9Overlay
      open={open}
      onClose={onClose}
      crumb={["Dashboard", "Dr. Fatima Al-Khalil", "D1", "Exclusion Audit"]}
      title="L3-A: Exclusion & Denominator Audit"
    >
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "28px 48px 48px",
          maxWidth: 1000,
          width: "100%",
        }}
      >
        <div
          style={{
            font: "400 13px/20px var(--font-sans)",
            color: "var(--fg-secondary)",
            marginBottom: 20,
            maxWidth: 700,
          }}
        >
          All exclusion criteria applied to{" "}
          <strong style={{ color: "var(--fg-primary)" }}>
            {measureName || "D1-001: HbA1c Control Rate"}
          </strong>
          , Q4 2025. Total excluded: 47 patients from initial eligible pool of
          387. Final denominator: 340.
        </div>

        {/* Section 1 — Inventory */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 1 — Exclusion Criteria Inventory
          </div>
          <table className="l2-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Description</th>
                <th style={{ textAlign: "right" }}>n Excluded</th>
                <th style={{ textAlign: "right" }}>% of Pool</th>
                <th>Required?</th>
              </tr>
            </thead>
            <tbody>
              {S9_EXCLUSIONS.map((ex) => (
                <tr
                  key={ex.id}
                  style={{
                    cursor: "pointer",
                    background:
                      selectedEx?.id === ex.id
                        ? "var(--accent-soft)"
                        : "transparent",
                  }}
                  onClick={() => {
                    setSelectedEx(ex);
                    setShowPatients(false);
                  }}
                >
                  <td>
                    <span className="m-id">{ex.id}</span>
                  </td>
                  <td style={{ font: "400 12px var(--font-sans)" }}>
                    {ex.desc}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      font: "600 12px var(--font-mono)",
                      color:
                        ex.n > 10 ? "var(--perf-below)" : "var(--fg-primary)",
                    }}
                  >
                    {ex.n}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      font: "500 11px var(--font-mono)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {ex.pct}%
                  </td>
                  <td>
                    <span
                      style={{
                        font: "500 9px var(--font-mono)",
                        padding: "2px 7px",
                        borderRadius: 4,
                        background: ex.required
                          ? "var(--perf-target-soft)"
                          : "var(--perf-below-soft)",
                        color: ex.required
                          ? "var(--perf-target)"
                          : "var(--perf-below)",
                        border: ".5px solid currentColor",
                      }}
                    >
                      {ex.required ? "Required" : "Optional"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedEx && (
            <div style={{ marginTop: 10 }}>
              <button
                className="btn secondary"
                style={{ fontSize: 11, padding: "4px 12px" }}
                onClick={() => setShowPatients((v) => !v)}
              >
                {showPatients ? "Hide" : "View"} Patients Excluded by{" "}
                {selectedEx.id}
              </button>
              {showPatients && (
                <table className="l2-table" style={{ marginTop: 10 }}>
                  <thead>
                    <tr>
                      <th>Patient ID</th>
                      <th>Age</th>
                      <th>Sex</th>
                      <th>Exclusion Reason</th>
                      <th>Data Element Triggered</th>
                      <th>Excluded Since</th>
                    </tr>
                  </thead>
                  <tbody>
                    {genPatients(selectedEx).map((p) => (
                      <tr key={p.id}>
                        <td>
                          <span className="mono">{p.id}</span>
                        </td>
                        <td>{p.age}</td>
                        <td>{p.sex}</td>
                        <td
                          style={{
                            font: "400 11px var(--font-sans)",
                            color: "var(--fg-secondary)",
                          }}
                        >
                          {p.reason.slice(0, 60)}
                        </td>
                        <td>
                          <span className="mono" style={{ fontSize: 10 }}>
                            {p.trigger}
                          </span>
                        </td>
                        <td
                          style={{
                            font: "400 11px var(--font-sans)",
                            color: "var(--fg-tertiary)",
                          }}
                        >
                          {p.since}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Section 2 — Venn Diagram */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 2 — Exclusion Overlap (Top 3 Criteria)
          </div>
          <div
            className="l2-card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              flexWrap: "wrap",
            }}
          >
            <VennDiagram data={S9_VENN} width={360} height={200} />
            <div>
              <p
                style={{
                  font: "400 12px/18px var(--font-sans)",
                  color: "var(--fg-secondary)",
                  maxWidth: 240,
                  margin: 0,
                }}
              >
                Overlap between EX-003 (short enrolment), EX-005 (no encounter),
                and EX-001 (gestational DM). 1 patient excluded by all three
                criteria.
              </p>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                {[
                  ["EX-003", "var(--accent)"],
                  ["EX-005", "var(--perf-below)"],
                  ["EX-001", "var(--perf-target)"],
                ].map(([id, c]) => (
                  <div
                    key={id}
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 3,
                        background: c,
                        opacity: 0.85,
                      }}
                    />
                    <span
                      style={{
                        font: "500 10px var(--font-mono)",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      {id}:{" "}
                      {S9_EXCLUSIONS.find((e) => e.id === id)?.desc.slice(
                        0,
                        40,
                      )}
                      …
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 — Sensitivity */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 3 — Exclusion Impact Sensitivity
          </div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            <table className="l2-table" style={{ marginBottom: 16 }}>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th style={{ textAlign: "right" }}>Score</th>
                  <th style={{ textAlign: "right" }}>Denominator</th>
                  <th style={{ textAlign: "right" }}>Δ from Current</th>
                </tr>
              </thead>
              <tbody>
                {S9_EXCLUSION_SENSITIVITY.map((row, i) => (
                  <tr
                    key={row.label}
                    style={{
                      background:
                        i === 0 ? "var(--accent-soft)" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        font:
                          i === 0
                            ? "600 12px var(--font-sans)"
                            : "400 12px var(--font-sans)",
                      }}
                    >
                      {row.label}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        font: "600 11px var(--font-mono)",
                        color:
                          row.score >= 65
                            ? "var(--perf-target)"
                            : "var(--perf-below)",
                      }}
                    >
                      {row.score}%
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        font: "500 11px var(--font-mono)",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      {row.den}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        font: "500 11px var(--font-mono)",
                        color:
                          row.delta < 0
                            ? "var(--perf-floor)"
                            : "var(--perf-target)",
                      }}
                    >
                      {row.delta === 0
                        ? "—"
                        : (row.delta > 0 ? "+" : "") + row.delta + "pp"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Bar chart */}
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              {S9_EXCLUSION_SENSITIVITY.map((row, i) => {
                const w = (row.score / 100) * 380;
                const targetX = (65 / 100) * 380;
                return (
                  <div
                    key={row.label}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <span
                      style={{
                        width: 180,
                        font: "400 10px var(--font-sans)",
                        color: "var(--fg-secondary)",
                        flexShrink: 0,
                        textAlign: "right",
                      }}
                    >
                      {row.label}
                    </span>
                    <div
                      style={{
                        position: "relative",
                        width: 380,
                        height: 18,
                        background: "var(--bg-elevated)",
                        borderRadius: 4,
                        border: ".5px solid var(--border-default)",
                      }}
                    >
                      <div
                        style={{
                          width: w,
                          height: "100%",
                          background:
                            i === 0
                              ? "var(--accent)"
                              : row.score < 65
                                ? "var(--perf-below)"
                                : "var(--accent)",
                          opacity: i === 0 ? 0.9 : 0.55,
                          borderRadius: 4,
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: targetX,
                          width: 2,
                          background: "var(--perf-target)",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        width: 40,
                        font: "600 10px var(--font-mono)",
                        color:
                          row.score >= 65
                            ? "var(--perf-target)"
                            : "var(--perf-below)",
                        flexShrink: 0,
                      }}
                    >
                      {row.score}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </S9Overlay>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L3-B  Case-Mix Stratification
   ══════════════════════════════════════════════════════════════════════════ */
function L3BStratification({ open, onClose }) {
  const [strat, setStrat] = useS9State("age");
  const stratOptions = [
    { id: "age", label: "Age Band (18–44, 45–54, 55–64, 65+)" },
    { id: "gender", label: "Gender (Male/Female)" },
    { id: "comorbidity", label: "Comorbidity Count (0–1, 2–3, 4+)" },
    { id: "bmi", label: "BMI Category (Normal/Overweight/Obese)" },
    { id: "ses", label: "Socioeconomic Proxy (Low/Medium/High)" },
    { id: "facility", label: "Facility (PSMMC/KFAFH/AFHO/AFHSR/Al-Hada)" },
  ];
  const data =
    strat === "age" ? S9_STRATIFICATION_AGE : S9_STRATIFICATION_GENDER;
  const overall = 67.9;
  const hasSig = data.some((d) => d.sig);

  return (
    <S9Overlay
      open={open}
      onClose={onClose}
      crumb={["Dashboard", "Dr. Fatima Al-Khalil", "D1", "Stratification"]}
    >
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "28px 48px 48px",
          maxWidth: 960,
          width: "100%",
        }}
      >
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              font: "500 10px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".07em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Stratification Variable
          </div>
          <select
            value={strat}
            onChange={(e) => setStrat(e.target.value)}
            style={{
              padding: "9px 14px",
              borderRadius: 9999,
              border: ".5px solid var(--border-default)",
              background: "var(--bg-elevated)",
              font: "400 13px var(--font-sans)",
              color: "var(--fg-primary)",
              minWidth: 320,
            }}
          >
            {stratOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {hasSig && (
          <div
            style={{
              padding: "12px 16px",
              background: "var(--perf-below-soft)",
              borderRadius: 10,
              border: ".5px solid var(--perf-below)",
              marginBottom: 20,
            }}
          >
            <div
              style={{
                font: "600 13px var(--font-sans)",
                color: "var(--perf-below)",
                marginBottom: 4,
              }}
            >
              ⚠ Equity Alert — Statistically Significant Disparity Detected
            </div>
            {strat === "age" && (
              <p
                style={{
                  font: "400 12px/18px var(--font-sans)",
                  color: "var(--fg-primary)",
                  margin: 0,
                }}
              >
                Patients aged 65+ have a 9.1 percentage point lower HbA1c
                control rate (p=0.04). Consider targeted intervention for
                elderly diabetic patients with complex comorbidities. This
                finding is linked to D9 (Health Equity) monitoring.
              </p>
            )}
          </div>
        )}

        <div className="l2-section">
          <div className="l2-section-title">
            D1-001 HbA1c Control Rate — Stratified by{" "}
            {stratOptions.find((o) => o.id === strat)?.label}
          </div>
          <table className="l2-table" style={{ marginBottom: 20 }}>
            <thead>
              <tr>
                <th>Subgroup</th>
                <th style={{ textAlign: "right" }}>n</th>
                <th style={{ textAlign: "right" }}>Score</th>
                <th>95% CI</th>
                <th style={{ textAlign: "right" }}>vs Overall</th>
                <th>p-value</th>
                <th>Significant?</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.group}
                  style={{
                    background: row.sig
                      ? "var(--perf-below-soft)"
                      : "transparent",
                  }}
                >
                  <td style={{ font: "500 12px var(--font-sans)" }}>
                    {row.group}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      font: "500 11px var(--font-mono)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {row.n}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      font: "700 12px var(--font-mono)",
                      color: row.sig
                        ? "var(--perf-floor)"
                        : "var(--fg-primary)",
                    }}
                  >
                    {row.score}%
                  </td>
                  <td>
                    <span className="mono" style={{ fontSize: 10 }}>
                      [{row.ciLo}–{row.ciHi}%]
                    </span>
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      font: "500 11px var(--font-mono)",
                      color:
                        row.delta >= 0
                          ? "var(--perf-target)"
                          : "var(--perf-below)",
                    }}
                  >
                    {row.delta >= 0 ? "+" : ""}
                    {row.delta}pp
                  </td>
                  <td
                    style={{
                      font: "500 11px var(--font-mono)",
                      color:
                        row.pValue <= 0.05
                          ? "var(--perf-floor)"
                          : "var(--fg-tertiary)",
                    }}
                  >
                    p={row.pValue}
                  </td>
                  <td>
                    {row.sig ? (
                      <span
                        style={{
                          color: "var(--perf-floor)",
                          font: "600 11px var(--font-sans)",
                        }}
                      >
                        ★ Yes
                      </span>
                    ) : (
                      <span style={{ color: "var(--fg-tertiary)" }}>No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="l2-section-title">Subgroup Chart with Error Bars</div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            <GroupedBarErrors
              data={data}
              overall={overall}
              target={65}
              width={460}
              height={170}
            />
            <p
              style={{
                font: "400 10px var(--font-mono)",
                color: "var(--fg-tertiary)",
                margin: "8px 0 0",
              }}
            >
              ★ = statistically significant disparity (p ≤ 0.05). Dashed line =
              network target. Reference line = overall score.
            </p>
          </div>
        </div>
      </div>
    </S9Overlay>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L3-C  Temporal Cohort Analysis
   ══════════════════════════════════════════════════════════════════════════ */
function L3CTemporal({ open, onClose }) {
  return (
    <S9Overlay
      open={open}
      onClose={onClose}
      crumb={[
        "Dashboard",
        "Dr. Fatima Al-Khalil",
        "D1",
        "Temporal Cohort Analysis",
      ]}
    >
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "28px 48px 48px",
          maxWidth: 1000,
          width: "100%",
        }}
      >
        {/* Section 1 — Inception Cohort */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 1 — Inception Cohort Tracking (Q1 2025 Baseline)
          </div>
          <table className="l2-table">
            <thead>
              <tr>
                <th>Timepoint</th>
                <th style={{ textAlign: "right" }}>n</th>
                <th style={{ textAlign: "right" }}>Retained</th>
                <th style={{ textAlign: "right" }}>Completers: Mean HbA1c</th>
                <th style={{ textAlign: "right" }}>
                  Non-Completers: Last Known
                </th>
              </tr>
            </thead>
            <tbody>
              {S9_COHORT.map((row) => (
                <tr key={row.tp}>
                  <td style={{ font: "500 12px var(--font-sans)" }}>
                    {row.tp}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      font: "600 11px var(--font-mono)",
                    }}
                  >
                    {row.n}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      font: "500 11px var(--font-mono)",
                      color:
                        row.retained < 70
                          ? "var(--perf-below)"
                          : "var(--fg-secondary)",
                    }}
                  >
                    {row.retained}%
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      font: "600 11px var(--font-mono)",
                      color: "var(--accent)",
                    }}
                  >
                    {row.completerMean}%
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      font: "500 11px var(--font-mono)",
                      color: row.noncompleterMean
                        ? "var(--perf-below)"
                        : "var(--fg-tertiary)",
                    }}
                  >
                    {row.noncompleterMean ? row.noncompleterMean + "%" : "—"}
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
              Non-completers had consistently higher (worse) HbA1c at last
              measurement (9.1–9.6%) vs completers (8.0–7.2%). The improving
              trend partly reflects systematic dropout of sicker patients.
              Adjust trend interpretation accordingly.
            </p>
          </div>
        </div>

        {/* Section 2 — Joinpoint Regression */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 2 — Joinpoint Regression (8 Periods)
          </div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            <JoinpointChart data={S9_HISTORICAL} width={520} height={160} />
          </div>
        </div>

        {/* Section 3 — Seasonality */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 3 — Seasonality Detection
          </div>
          <div className="l2-card">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 12,
              }}
            >
              {Object.entries(S9_SEASONAL_DATA).map(([q, vals]) => {
                const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
                const isLow = q === "Q1";
                return (
                  <div
                    key={q}
                    style={{
                      background: isLow
                        ? "var(--perf-below-soft)"
                        : "var(--bg-elevated)",
                      borderRadius: 8,
                      padding: "12px 14px",
                      border: `.5px solid ${isLow ? "var(--perf-below)" : "var(--border-default)"}`,
                    }}
                  >
                    <div
                      style={{
                        font: "600 13px var(--font-mono)",
                        color: isLow
                          ? "var(--perf-below)"
                          : "var(--fg-primary)",
                        marginBottom: 4,
                      }}
                    >
                      {q}
                    </div>
                    {vals.map((v, i) => (
                      <div
                        key={i}
                        style={{
                          font: "500 11px var(--font-mono)",
                          color: "var(--fg-secondary)",
                        }}
                      >
                        {2024 + i}: {v}%
                      </div>
                    ))}
                    <div
                      style={{
                        font: "600 11px var(--font-mono)",
                        color: isLow
                          ? "var(--perf-below)"
                          : "var(--fg-primary)",
                        marginTop: 6,
                      }}
                    >
                      Avg: {avg.toFixed(1)}%
                    </div>
                    {isLow && (
                      <div
                        style={{
                          font: "500 9px var(--font-mono)",
                          color: "var(--perf-below)",
                          marginTop: 3,
                        }}
                      >
                        ▼ Seasonal dip
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div
              style={{
                marginTop: 14,
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
                Seasonal pattern detected: Q1 scores average 4.2 percentage
                points lower than other quarters (p=0.02). Consistent across
                both 2024 and 2025. Likely reflects reduced clinic attendance in
                winter months. Consider adjusting for seasonality in trend
                interpretation.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4 — Forecast */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 4 — Projection with Uncertainty Band
          </div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            <ForecastChart
              data={S9_HISTORICAL}
              projected={{ period: "Q1 2026", score: 72.8, lo: 68.4, hi: 77.2 }}
              width={520}
              height={160}
            />
            <div
              style={{
                marginTop: 12,
                padding: "10px 14px",
                background: "var(--accent-soft)",
                borderRadius: 8,
                border: ".5px solid var(--accent)",
              }}
            >
              <p
                style={{
                  font: "400 12px/18px var(--font-sans)",
                  color: "var(--fg-primary)",
                  margin: 0,
                }}
              >
                <strong>Projected Q1 2026 score: 72.8%</strong> [68.4% – 77.2%
                at 80% confidence]. If the current trend continues, this
                provider is projected to remain <strong>At Target</strong>{" "}
                (target: 65%). Note seasonal adjustment applied — Q1
                historically runs 4.2pp below trend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </S9Overlay>
  );
}

/* ── Joinpoint chart ─────────────────────────────────────────────────────── */
function JoinpointChart({ data, width = 520, height = 160 }) {
  const pad = { l: 44, r: 40, t: 20, b: 28 };
  const cw = width - pad.l - pad.r;
  const ch = height - pad.t - pad.b;
  const minV = Math.min(...data.map((d) => d.score)) * 0.92;
  const maxV = Math.max(...data.map((d) => d.score)) * 1.06;
  const r = maxV - minV;
  const sx = (i) => pad.l + (i / (data.length - 1)) * cw;
  const sy = (v) => pad.t + ch - ((v - minV) / r) * ch;
  const pts = data
    .map((d, i) => `${sx(i).toFixed(1)},${sy(d.score).toFixed(1)}`)
    .join(" ");
  const joinpointIdx = 5; // Q2 2025 = index 5

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {[65, 70, 75].map((v) => (
        <g key={v}>
          <line
            x1={pad.l}
            y1={sy(v)}
            x2={pad.l + cw}
            y2={sy(v)}
            stroke="var(--border-default)"
            strokeWidth="0.5"
          />
          <text
            x={pad.l - 4}
            y={sy(v)}
            textAnchor="end"
            dominantBaseline="central"
            fill="var(--fg-tertiary)"
            style={{ font: "500 8px var(--font-mono)" }}
          >
            {v}
          </text>
        </g>
      ))}
      {/* Target line */}
      <line
        x1={pad.l}
        y1={sy(65)}
        x2={pad.l + cw}
        y2={sy(65)}
        stroke="var(--perf-target)"
        strokeWidth="1"
        strokeDasharray="4,3"
      />
      {/* Trend line segment 1 (Q1 2024 – Q2 2025, steep improvement) */}
      <line
        x1={sx(0)}
        y1={sy(data[0].score)}
        x2={sx(joinpointIdx)}
        y2={sy(data[joinpointIdx].score)}
        stroke="var(--fg-tertiary)"
        strokeWidth="1"
        strokeDasharray="3,2"
      />
      {/* Trend line segment 2 (Q3 2025 – Q4 2025, flattening) */}
      <line
        x1={sx(joinpointIdx)}
        y1={sy(data[joinpointIdx].score)}
        x2={sx(data.length - 1)}
        y2={sy(data[data.length - 1].score)}
        stroke="var(--perf-below)"
        strokeWidth="1"
        strokeDasharray="3,2"
      />
      {/* Main data line */}
      <polyline
        points={pts}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={sx(i)}
          cy={sy(d.score)}
          r="4"
          fill="var(--accent)"
          stroke="white"
          strokeWidth="1.5"
        />
      ))}
      {/* Joinpoint marker */}
      <line
        x1={sx(joinpointIdx)}
        y1={pad.t}
        x2={sx(joinpointIdx)}
        y2={pad.t + ch}
        stroke="var(--perf-below)"
        strokeWidth="1.5"
        strokeDasharray="4,3"
      />
      <text
        x={sx(joinpointIdx)}
        y={pad.t - 6}
        textAnchor="middle"
        fill="var(--perf-below)"
        style={{ font: "500 8px var(--font-mono)" }}
      >
        Joinpoint Q2 2025
      </text>
      {/* Labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={sx(i)}
          y={height - 4}
          textAnchor="middle"
          fill="var(--fg-tertiary)"
          style={{ font: "500 7px var(--font-mono)" }}
        >
          {d.period.replace(" 20", "'")}
        </text>
      ))}
      {/* Slope annotations */}
      <text
        x={(sx(0) + sx(joinpointIdx)) / 2}
        y={sy((data[0].score + data[joinpointIdx].score) / 2) - 10}
        textAnchor="middle"
        fill="var(--fg-tertiary)"
        style={{ font: "500 8px var(--font-mono)" }}
      >
        slope −1.2/qtr p=0.003
      </text>
      <text
        x={(sx(joinpointIdx) + sx(data.length - 1)) / 2}
        y={
          sy((data[joinpointIdx].score + data[data.length - 1].score) / 2) - 10
        }
        textAnchor="middle"
        fill="var(--perf-below)"
        style={{ font: "500 8px var(--font-mono)" }}
      >
        slope −0.3/qtr p=0.41
      </text>
    </svg>
  );
}

/* ── Forecast chart ──────────────────────────────────────────────────────── */
function ForecastChart({ data, projected, width = 520, height = 160 }) {
  const pad = { l: 44, r: 56, t: 20, b: 28 };
  const cw = width - pad.l - pad.r;
  const ch = height - pad.t - pad.b;
  const allVals = [...data.map((d) => d.score), projected.lo, projected.hi];
  const minV = Math.min(...allVals) * 0.93;
  const maxV = Math.max(...allVals) * 1.06;
  const r = maxV - minV;
  const totalPts = data.length + 1;
  const sx = (i) => pad.l + (i / (totalPts - 1)) * cw;
  const sy = (v) => pad.t + ch - ((v - minV) / r) * ch;
  const pts = data
    .map((d, i) => `${sx(i).toFixed(1)},${sy(d.score).toFixed(1)}`)
    .join(" ");
  const projX = sx(data.length);

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {[65, 70, 75].map((v) => (
        <g key={v}>
          <line
            x1={pad.l}
            y1={sy(v)}
            x2={pad.l + cw}
            y2={sy(v)}
            stroke="var(--border-default)"
            strokeWidth="0.5"
          />
          <text
            x={pad.l - 4}
            y={sy(v)}
            textAnchor="end"
            dominantBaseline="central"
            fill="var(--fg-tertiary)"
            style={{ font: "500 8px var(--font-mono)" }}
          >
            {v}
          </text>
        </g>
      ))}
      {/* Prediction band */}
      <rect
        x={projX - 10}
        y={sy(projected.hi)}
        width={cw - (projX - pad.l) + 10}
        height={sy(projected.lo) - sy(projected.hi)}
        fill="var(--accent)"
        fillOpacity="0.1"
      />
      {/* Projected dashed segment */}
      <line
        x1={sx(data.length - 1)}
        y1={sy(data[data.length - 1].score)}
        x2={projX}
        y2={sy(projected.score)}
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="6,4"
      />
      {/* Main line */}
      <polyline
        points={pts}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => (
        <circle
          key={i}
          cx={sx(i)}
          cy={sy(d.score)}
          r="4"
          fill="var(--accent)"
          stroke="white"
          strokeWidth="1.5"
        />
      ))}
      {/* Projected point */}
      <circle
        cx={projX}
        cy={sy(projected.score)}
        r="5"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeDasharray="3,2"
      />
      <text
        x={projX + 8}
        y={sy(projected.score)}
        dominantBaseline="central"
        fill="var(--accent)"
        style={{ font: "600 10px var(--font-sans)" }}
      >
        ~{projected.score}%
      </text>
      <text
        x={projX + 8}
        y={sy(projected.score) + 12}
        dominantBaseline="central"
        fill="var(--fg-tertiary)"
        style={{ font: "400 8px var(--font-mono)" }}
      >
        [{projected.lo}–{projected.hi}]
      </text>
      {/* X labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={sx(i)}
          y={height - 4}
          textAnchor="middle"
          fill="var(--fg-tertiary)"
          style={{ font: "500 7px var(--font-mono)" }}
        >
          {d.period.replace(" 20", "'")}
        </text>
      ))}
      <text
        x={projX}
        y={height - 4}
        textAnchor="middle"
        fill="var(--accent)"
        style={{ font: "500 7px var(--font-mono)" }}
      >
        Q1 '26
      </text>
    </svg>
  );
}

export {
  L3AExclusionAudit,
  L3BStratification,
  L3CTemporal,
  JoinpointChart,
  ForecastChart,
};
