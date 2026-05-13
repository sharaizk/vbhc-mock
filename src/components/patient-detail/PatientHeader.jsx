import React from "react";
const { useState } = React;

/* ── Set color helpers ──────────────────────────────────────────────────── */
const SET_COLORS = {
  T2DM: {
    color: "var(--accent)",
    soft: "var(--accent-soft)",
    label: "Type 2 Diabetes",
  },
  DEPA: {
    color: "oklch(62% .12 82)",
    soft: "oklch(97% .025 82)",
    label: "Depression & Anxiety",
  },
  PREG: {
    color: "var(--perf-target)",
    soft: "var(--perf-target-soft)",
    label: "Pregnancy & Childbirth",
  },
  CAD: {
    color: "var(--perf-floor)",
    soft: "var(--perf-floor-soft)",
    label: "Coronary Artery Disease",
  },
  HKOA: {
    color: "oklch(62% .08 60)",
    soft: "oklch(97% .02 60)",
    label: "Hip & Knee OA",
  },
};

function setColor(setId) {
  return (
    SET_COLORS[setId] || {
      color: "var(--fg-tertiary)",
      soft: "var(--bg-elevated)",
      label: setId,
    }
  );
}

/* ── Patient Identity Header ─────────────────────────────────────────────── */
function PatientHeader({
  patient,
  allPatients,
  onSelectPatient,
  onOpenCostProfile,
  onOpenAudit,
  role,
}) {
  const [open, setOpen] = useState(false);
  const complexityLabel =
    patient.sets.length >= 3
      ? `Multi-Morbid: ${patient.sets.length} ICHOM Sets Active`
      : patient.sets.length === 2
        ? `Multi-Morbid: 2 ICHOM Sets Active`
        : null;
  const costDir = patient.costDeltaDir === "up" ? "▲" : "▼";
  const costColor =
    patient.costDeltaDir === "up" ? "var(--perf-floor)" : "var(--perf-target)";

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: ".5px solid var(--border-default)",
        borderRadius: 14,
        boxShadow: "var(--shadow-card)",
        marginBottom: 12,
        overflow: "hidden",
      }}
    >
      {/* Row 1 — Demographics */}
      <div
        style={{
          padding: "16px 20px 12px",
          borderBottom: ".5px solid var(--border-default)",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "var(--accent-soft)",
            border: "2px solid var(--accent)",
            display: "grid",
            placeItems: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              font: "600 12px var(--font-mono)",
              color: "var(--accent)",
            }}
          >
            {patient.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </span>
        </div>
        {/* ID + name */}
        <div>
          <div
            style={{
              font: "600 15px var(--font-sans)",
              color: "var(--fg-primary)",
            }}
          >
            {patient.name}
          </div>
          <div
            style={{
              font: "500 11px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".04em",
              marginTop: 2,
            }}
          >
            {patient.id}
          </div>
        </div>
        <div className="za-divider" />
        <div
          style={{
            font: "400 12px var(--font-sans)",
            color: "var(--fg-secondary)",
          }}
        >
          {patient.age} yrs · {patient.sex}
        </div>
        <div className="za-divider" />
        <div
          style={{
            font: "400 12px var(--font-sans)",
            color: "var(--fg-secondary)",
          }}
        >
          {patient.facility}
        </div>
        <div className="za-divider" />
        <div
          style={{
            font: "400 11px var(--font-sans)",
            color: "var(--fg-secondary)",
          }}
        >
          {patient.military}
        </div>
        <div className="za-divider" />

        {/* Attributed providers */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {patient.providers.map((prov) => (
            <span
              key={prov.name}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "3px 10px",
                borderRadius: 9999,
                font: "500 10px var(--font-sans)",
                background: prov.primary
                  ? "var(--accent-soft)"
                  : "var(--bg-elevated)",
                color: prov.primary ? "var(--accent)" : "var(--fg-secondary)",
                border: `.5px solid ${prov.primary ? "var(--accent)" : "var(--border-default)"}`,
              }}
            >
              {prov.primary && (
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    flexShrink: 0,
                  }}
                />
              )}
              {prov.name} ({prov.specialty})
            </span>
          ))}
        </div>
        <div className="za-divider" />

        {/* Contracts */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {patient.contracts.map((c) => (
            <span key={c} className="tag" style={{ fontSize: 9 }}>
              {c}
            </span>
          ))}
        </div>

        {/* Patient selector */}
        <div style={{ marginLeft: "auto", position: "relative" }}>
          <select
            value={patient.id}
            onChange={(e) => onSelectPatient(e.target.value)}
            className="sel-btn"
            style={{ maxWidth: 200 }}
          >
            {allPatients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Row 2 — Clinical Summary */}
      <div
        style={{
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        {/* ICHOM Set badges */}
        {patient.sets.map((setId) => {
          const s = setColor(setId);
          return (
            <span
              key={setId}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "4px 10px",
                borderRadius: 9999,
                font: "500 10px var(--font-mono)",
                letterSpacing: ".04em",
                background: s.soft,
                color: s.color,
                border: `.5px solid ${s.color}`,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: s.color,
                }}
              />
              {s.label}
            </span>
          );
        })}

        {/* Complexity flag */}
        {complexityLabel && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "4px 10px",
              borderRadius: 9999,
              font: "600 10px var(--font-mono)",
              letterSpacing: ".04em",
              background: "var(--perf-below-soft)",
              color: "var(--perf-below)",
              border: ".5px solid var(--perf-below)",
            }}
          >
            ⚠ {complexityLabel}
          </span>
        )}

        <div className="za-divider" />

        {/* HCC/RAF */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            HCC/RAF Score
          </span>
          <span
            style={{
              font: "600 14px var(--font-sans)",
              color:
                patient.rafScore > 1.5
                  ? "var(--perf-below)"
                  : "var(--fg-primary)",
            }}
          >
            {patient.rafScore}
          </span>
        </div>

        <div className="za-divider" />

        {/* Total cost */}
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <span
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            Total Cost of Care
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                font: "600 14px var(--font-sans)",
                color: "var(--fg-primary)",
              }}
            >
              SAR {patient.totalCost.toLocaleString()}
            </span>
            <span
              style={{ font: "600 10px var(--font-mono)", color: costColor }}
            >
              {costDir} {Math.abs(patient.costDelta).toFixed(1)}% vs prior
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            className="btn secondary"
            style={{ fontSize: 11 }}
            onClick={onOpenCostProfile}
          >
            View Cost Profile
          </button>
          {(role === "manager" ||
            role === "analyst" ||
            role === "compliance") && (
            <button
              className="btn secondary"
              style={{ fontSize: 11 }}
              onClick={onOpenAudit}
            >
              Audit Attribution
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Cross-Set Summary Panel ─────────────────────────────────────────────── */
function CrossSetSummary({ crossSets, onOpenSetDetail }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          font: "500 9px var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".07em",
          textTransform: "uppercase",
          marginBottom: 8,
        }}
      >
        Cross-Set Summary — Click any card to view full Set detail
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
        {crossSets.map((cs) => {
          const sc = setColor(cs.setId);
          return (
            <div
              key={cs.setId}
              className="card"
              onClick={() => onOpenSetDetail(cs)}
              style={{
                flex: "0 0 280px",
                padding: 18,
                cursor: "pointer",
                borderLeft: `4px solid ${sc.color}`,
                background: "var(--bg-surface)",
                transition: "box-shadow .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "var(--shadow-popover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "var(--shadow-card)")
              }
            >
              {/* Set name */}
              <div
                style={{
                  font: "600 12px var(--font-sans)",
                  color: sc.color,
                  marginBottom: 10,
                }}
              >
                {cs.name}
              </div>

              {/* Key outcome */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginBottom: 5,
                }}
              >
                <span
                  style={{
                    font: "500 9px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    width: 55,
                  }}
                >
                  {cs.keyOutcome.label}
                </span>
                <span
                  style={{ font: "700 20px var(--font-sans)", color: sc.color }}
                >
                  {cs.keyOutcome.value}
                </span>
                <span
                  style={{
                    font: "400 9px var(--font-sans)",
                    color: "var(--fg-tertiary)",
                    textDecoration: "line-through",
                  }}
                >
                  {cs.keyOutcome.baseline}
                </span>
                <span
                  style={{
                    font: "500 10px var(--font-sans)",
                    color: "var(--perf-target)",
                  }}
                >
                  ↑ Improving
                </span>
              </div>

              {/* Secondary */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 5,
                }}
              >
                <span
                  style={{
                    font: "500 9px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    width: 55,
                  }}
                >
                  {cs.secOutcome.label}
                </span>
                <span
                  style={{
                    font: "600 13px var(--font-sans)",
                    color: "var(--fg-primary)",
                  }}
                >
                  {cs.secOutcome.value}
                </span>
                {cs.secOutcome.baseline && (
                  <span
                    style={{
                      font: "400 9px var(--font-sans)",
                      color: "var(--fg-tertiary)",
                      textDecoration: "line-through",
                    }}
                  >
                    {cs.secOutcome.baseline}
                  </span>
                )}
                {cs.secOutcome.status && (
                  <span
                    className="tag"
                    style={{ fontSize: 9, color: "var(--perf-target)" }}
                  >
                    {cs.secOutcome.status}
                  </span>
                )}
              </div>

              {/* PROMs score */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    font: "500 9px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    width: 55,
                  }}
                >
                  {cs.promsScore.label}
                </span>
                <span
                  style={{
                    font: "600 13px var(--font-sans)",
                    color: "var(--fg-primary)",
                  }}
                >
                  {cs.promsScore.value}
                </span>
                {cs.promsScore.shared && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      font: "500 8px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      background: "var(--bg-elevated)",
                      padding: "2px 6px",
                      borderRadius: 4,
                      border: ".5px solid var(--border-default)",
                    }}
                  >
                    🔗 Shared · {cs.promsScore.sharedWith}
                  </span>
                )}
              </div>

              {/* Collection compliance */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  background:
                    cs.timepointsMet === cs.timepoints
                      ? "var(--perf-target-soft)"
                      : "var(--perf-below-soft)",
                  borderRadius: 6,
                  border: `.5px solid ${cs.timepointsMet === cs.timepoints ? "var(--perf-target)" : "var(--perf-below)"}`,
                }}
              >
                <span
                  style={{
                    font: "600 10px var(--font-sans)",
                    color:
                      cs.timepointsMet === cs.timepoints
                        ? "var(--perf-target)"
                        : "var(--perf-below)",
                  }}
                >
                  {cs.timepointsMet === cs.timepoints ? "✓" : "⚠"}{" "}
                  {cs.timepointsMet} of {cs.timepoints} ICHOM timepoints
                  completed
                </span>
              </div>

              <div
                style={{
                  marginTop: 10,
                  font: "500 9px var(--font-sans)",
                  color: "var(--accent)",
                }}
              >
                Click to view Set detail →
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { PatientHeader, CrossSetSummary, setColor };
