// vf-level3.jsx — Measure Detail (5 sections)
import React from "react";
const { useState: useL3State, useMemo: useL3Memo } = React;

/* ── Section 1 — Definition & Methodology ───────────────────────── */
function SpecField({ label, value, mono, accent }) {
  if (!value) return null;
  return (
    <div
      style={{
        padding: "10px 0",
        borderBottom: ".5px solid var(--border-default)",
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        gap: 16,
        alignItems: "baseline",
      }}
    >
      <span
        style={{
          font: "500 11px/1 var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          font: mono
            ? "400 12px/18px var(--font-mono)"
            : "400 13px/20px var(--font-sans)",
          color: accent ? accent : "var(--fg-primary)",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function DefinitionSection({ measure, dim }) {
  const contracts = measure.contr || [];
  return (
    <div
      style={{
        padding: "20px 24px",
        borderRadius: 14,
        background: "var(--bg-surface)",
        border: ".5px solid var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              font: "700 10px/1 var(--font-mono)",
              color: dim.color,
              letterSpacing: ".08em",
              marginBottom: 5,
            }}
          >
            {measure.id}
          </div>
          <h3
            style={{
              margin: "0 0 8px",
              font: "500 20px/26px var(--font-sans)",
              color: "var(--fg-primary)",
              letterSpacing: "-.01em",
            }}
          >
            {measure.name}
          </h3>
          <div
            style={{
              display: "flex",
              gap: 6,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span
              style={{
                padding: "2px 8px",
                borderRadius: 9999,
                background: `${dim.color}15`,
                border: `1px solid ${dim.color}30`,
                font: "600 10px/1 var(--font-mono)",
                color: dim.color,
                letterSpacing: ".04em",
              }}
            >
              {dim.id} · {dim.name}
            </span>
            <MethBadge m={measure.meth} />
            <DirBadge dir={measure.dir} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            alignItems: "flex-end",
          }}
        >
          {(dim.id === "D1" || dim.id === "D2") && measure.ichomSet && (
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 9999,
                background: "var(--gold-soft)",
                border: ".5px solid var(--gold)",
                font: "500 10px/1 var(--font-mono)",
                color: "var(--gold)",
                letterSpacing: ".04em",
                textTransform: "uppercase",
              }}
            >
              ICHOM · {measure.ichomSet}
            </span>
          )}
        </div>
      </div>

      <div>
        <SpecField label="Definition" value={measure.def} />
        {measure.num && <SpecField label="Numerator" value={measure.num} />}
        {measure.den && <SpecField label="Denominator" value={measure.den} />}
        <SpecField label="Unit" value={measure.unit} mono />
        <SpecField
          label="Direction"
          value={measure.dir === 1 ? "↑ Higher is better" : "↓ Lower is better"}
          accent={measure.dir === 1 ? "#228BA0" : "#D44C47"}
        />
        <SpecField label="Data Source(s)" value={measure.src} />
        <SpecField label="Benchmark Source" value={measure.bench} />
        <SpecField label="Risk Adjustment" value={measure.risk} />
        <SpecField label="Reporting Frequency" value={measure.freq} />
        {contracts.length > 0 && (
          <div
            style={{
              padding: "10px 0",
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              gap: 16,
              alignItems: "baseline",
            }}
          >
            <span
              style={{
                font: "500 11px/1 var(--font-mono)",
                color: "var(--fg-tertiary)",
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              HCP-LAN Categories
            </span>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {contracts.map((c) => (
                <span
                  key={c}
                  style={{
                    padding: "2px 8px",
                    borderRadius: 9999,
                    background: "var(--accent-soft)",
                    border: ".5px solid var(--accent)",
                    font: "600 10px/1 var(--font-mono)",
                    color: "var(--accent)",
                    letterSpacing: ".04em",
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}
        {(dim.id === "D1" || dim.id === "D2") && measure.ichomSet && (
          <div
            style={{
              paddingTop: 16,
              marginTop: 8,
              borderTop: ".5px solid var(--border-default)",
            }}
          >
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 10,
                background: "var(--gold-soft)",
                border: ".5px solid var(--gold)",
                font: "500 13px/1 var(--font-sans)",
                color: "var(--gold)",
                cursor: "pointer",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View in ICHOM Browser — {measure.ichomSet}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Section 2 — Threshold Context Gauge ────────────────────────── */
function ThresholdGauge({ measure }) {
  const t = VF_THRESHOLDS[measure.id];
  if (!t) {
    return (
      <div
        style={{
          padding: "20px 24px",
          borderRadius: 14,
          background: "var(--bg-surface)",
          border: ".5px solid var(--border-default)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          style={{
            font: "500 11px/1 var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          Threshold Context
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
          }}
        >
          {[
            { label: "Floor", color: "#D44C47" },
            { label: "Target", color: "#C28F2C" },
            { label: "Stretch", color: "#228BA0" },
          ].map((tier) => (
            <div
              key={tier.label}
              style={{
                padding: "14px 16px",
                borderRadius: 10,
                background: "var(--bg-elevated)",
                border: `.5px solid ${tier.color}30`,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  font: "500 9px/1 var(--font-mono)",
                  color: tier.color,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {tier.label}
              </div>
              <div
                style={{
                  font: "600 16px/1 var(--font-sans)",
                  color: "var(--fg-tertiary)",
                }}
              >
                —
              </div>
              <div
                style={{
                  font: "400 11px/1 var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  marginTop: 4,
                }}
              >
                Condition-specific
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { floor, target, stretch, dir, benchmarks } = t;
  const vals = [floor, target, stretch, ...(benchmarks || []).map((b) => b.v)];
  const minV = Math.min(...vals) * (dir === 1 ? 0.9 : 1);
  const maxV = Math.max(...vals) * (dir === 1 ? 1.1 : 1.1);
  const toX = (v) => ((v - minV) / (maxV - minV)) * 100;

  const zones =
    dir === 1
      ? [
          { from: minV, to: floor, color: "#D44C4730", label: "Below Floor" },
          {
            from: floor,
            to: target,
            color: "#F59E0B30",
            label: "Floor → Target",
          },
          {
            from: target,
            to: stretch,
            color: "#22C55E30",
            label: "Target → Stretch",
          },
          {
            from: stretch,
            to: maxV,
            color: "#15803D30",
            label: "Above Stretch",
          },
        ]
      : [
          {
            from: minV,
            to: stretch,
            color: "#15803D30",
            label: "Above Stretch (best)",
          },
          {
            from: stretch,
            to: target,
            color: "#22C55E30",
            label: "Target → Stretch",
          },
          {
            from: target,
            to: floor,
            color: "#F59E0B30",
            label: "Floor → Target",
          },
          {
            from: floor,
            to: maxV,
            color: "#D44C4730",
            label: "Below Floor (worst)",
          },
        ];

  const tierVals =
    dir === 1
      ? [
          { label: "Floor", v: floor, c: "#D44C47" },
          { label: "Target", v: target, c: "#F59E0B" },
          { label: "Stretch", v: stretch, c: "#228BA0" },
        ]
      : [
          { label: "Stretch", v: stretch, c: "#228BA0" },
          { label: "Target", v: target, c: "#F59E0B" },
          { label: "Floor", v: floor, c: "#D44C47" },
        ];

  return (
    <div
      style={{
        padding: "20px 24px",
        borderRadius: 14,
        background: "var(--bg-surface)",
        border: ".5px solid var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          font: "500 11px/1 var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".08em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        Threshold Context · {measure.unit}
      </div>

      {/* Threshold cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          marginBottom: 20,
        }}
      >
        {tierVals.map((tier) => (
          <div
            key={tier.label}
            style={{
              padding: "14px 16px",
              borderRadius: 10,
              background: `${tier.c}12`,
              border: `.5px solid ${tier.c}40`,
              textAlign: "center",
            }}
          >
            <div
              style={{
                font: "500 9px/1 var(--font-mono)",
                color: tier.c,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              {tier.label}
            </div>
            <div style={{ font: "600 20px/1 var(--font-sans)", color: tier.c }}>
              {tier.v}
              {measure.unit.includes("%") ? "%" : ""}
            </div>
          </div>
        ))}
      </div>

      {/* Gauge bar */}
      <div style={{ position: "relative", height: 48, marginBottom: 32 }}>
        {/* Zone fills */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 0,
            right: 0,
            height: 16,
            borderRadius: 8,
            overflow: "hidden",
            display: "flex",
          }}
        >
          {zones.map((z, i) => {
            const lx = toX(Math.min(z.from, z.to));
            const rx = toX(Math.max(z.from, z.to));
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${lx}%`,
                  width: `${rx - lx}%`,
                  top: 0,
                  bottom: 0,
                  background: z.color,
                }}
              ></div>
            );
          })}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: ".5px solid var(--border-default)",
              borderRadius: 8,
            }}
          ></div>
        </div>

        {/* Threshold markers */}
        {tierVals.map((tier) => (
          <div
            key={tier.label}
            style={{
              position: "absolute",
              top: 0,
              left: `${toX(tier.v)}%`,
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                font: "600 9px/1 var(--font-mono)",
                color: tier.c,
                letterSpacing: ".04em",
                marginBottom: 2,
              }}
            >
              {tier.v}
              {measure.unit.includes("%") ? "%" : ""}
            </div>
            <div
              style={{
                width: 2,
                height: 36,
                background: tier.c,
                margin: "0 auto",
                borderRadius: 1,
              }}
            ></div>
            <div
              style={{
                font: "500 8px/1 var(--font-mono)",
                color: tier.c,
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {tier.label}
            </div>
          </div>
        ))}

        {/* Benchmark markers */}
        {(benchmarks || []).map((b) => (
          <div
            key={b.l}
            style={{
              position: "absolute",
              top: 8,
              left: `${toX(b.v)}%`,
              transform: "translateX(-50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: 1,
                height: 30,
                background: "var(--fg-tertiary)",
                margin: "0 auto",
                borderStyle: "dashed",
              }}
            ></div>
            <div
              style={{
                font: "400 8px/1 var(--font-mono)",
                color: "var(--fg-tertiary)",
                marginTop: 2,
                whiteSpace: "nowrap",
                transform: "translateX(-50%) rotate(-35deg)",
                transformOrigin: "top left",
                fontSize: "7px",
              }}
            >
              {b.l}: {b.v}
              {measure.unit.includes("%") ? "%" : ""}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}
      >
        {(benchmarks || []).map((b) => (
          <div
            key={b.l}
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 8,
              background: "var(--bg-elevated)",
              border: ".5px solid var(--border-default)",
            }}
          >
            <span
              style={{
                font: "600 13px/1 var(--font-sans)",
                color: "var(--fg-primary)",
              }}
            >
              {b.v}
              {measure.unit.includes("%") ? "%" : ""}
            </span>
            <span
              style={{
                font: "500 10px/1 var(--font-mono)",
                color: "var(--fg-tertiary)",
                letterSpacing: ".03em",
              }}
            >
              {b.l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Section 3 — Episode Example ────────────────────────────────── */
function EpisodeSection({ measure, dim }) {
  const ep = VF_EPISODES[measure.id];
  if (!ep) {
    return (
      <div
        style={{
          padding: "20px 24px",
          borderRadius: 14,
          background: "var(--bg-surface)",
          border: ".5px solid var(--border-default)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          style={{
            font: "500 11px/1 var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Episode Example
        </div>
        <div
          style={{
            padding: "20px",
            borderRadius: 10,
            background: "var(--bg-elevated)",
            border: ".5px solid var(--border-default)",
          }}
        >
          <div
            style={{
              font: "500 14px/1 var(--font-sans)",
              color: "var(--fg-secondary)",
              marginBottom: 6,
            }}
          >
            Synthetic example not pre-populated for this measure.
          </div>
          <div
            style={{
              font: "400 13px/20px var(--font-sans)",
              color: "var(--fg-tertiary)",
            }}
          >
            For a patient with {measure.unit} measured at{" "}
            {measure.freq?.toLowerCase()} intervals: calculate {measure.id} as{" "}
            {measure.num ? "numerator" : "the measure value"} compared to{" "}
            {measure.floor ? `floor threshold` : "benchmark"}. Direction:{" "}
            {measure.dir === 1
              ? "higher values indicate better performance."
              : "lower values indicate better performance."}
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    met: "#228BA0",
    "not-met": "#D44C47",
    partial: "#C28F2C",
  };
  const sc = statusColors[ep.status] || "#888";

  return (
    <div
      style={{
        padding: "20px 24px",
        borderRadius: 14,
        background: "var(--bg-surface)",
        border: ".5px solid var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          font: "500 11px/1 var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".08em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        Episode Example · {measure.id}
      </div>
      <div
        style={{
          borderRadius: 12,
          background: `${dim.color}08`,
          border: `.5px solid ${dim.color}30`,
          padding: "16px 20px",
        }}
      >
        {/* Patient header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 9999,
              background: `${dim.color}20`,
              border: `1.5px solid ${dim.color}40`,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{ font: "600 13px/1 var(--font-sans)", color: dim.color }}
            >
              {ep.patient.split(",")[0].charAt(0)}
            </span>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                font: "600 14px/1 var(--font-sans)",
                color: "var(--fg-primary)",
                marginBottom: 4,
              }}
            >
              {ep.patient}
            </div>
            <div
              style={{
                font: "400 12px/1 var(--font-sans)",
                color: "var(--fg-secondary)",
              }}
            >
              {ep.condition}
            </div>
          </div>
          <span
            style={{
              padding: "4px 10px",
              borderRadius: 9999,
              background: `${sc}18`,
              border: `1px solid ${sc}40`,
              font: "600 11px/1 var(--font-mono)",
              color: sc,
              letterSpacing: ".04em",
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            {ep.badge}
          </span>
        </div>

        {/* Data */}
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "var(--bg-surface)",
            border: ".5px solid var(--border-default)",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              font: "500 10px/1 var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Clinical Data
          </div>
          <div
            style={{
              font: "400 13px/20px var(--font-sans)",
              color: "var(--fg-primary)",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
            }}
          >
            {ep.data}
          </div>
        </div>

        {/* Calculation */}
        <div
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            background: "var(--bg-elevated)",
            border: ".5px solid var(--border-default)",
          }}
        >
          <div
            style={{
              font: "500 10px/1 var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Measure Calculation
          </div>
          <div
            style={{
              font: "400 12px/20px var(--font-mono)",
              color: "var(--fg-primary)",
            }}
          >
            {ep.calc}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section 4 — Contract Usage ─────────────────────────────────── */
function ContractUsageSection({ measure, dim }) {
  const usage = VF_MEASURE_CONTRACTS[measure.id] || [];
  const contractById = Object.fromEntries(VF_CONTRACTS.map((c) => [c.id, c]));

  const statusStyle = (s) => {
    const map = {
      "at-target": {
        bg: "#228BA020",
        border: "#228BA040",
        color: "#228BA0",
        label: "At Target",
      },
      "exceeds-stretch": {
        bg: "#15803D20",
        border: "#15803D40",
        color: "#15803D",
        label: "Exceeds Stretch",
      },
      "below-target": {
        bg: "#F59E0B20",
        border: "#F59E0B40",
        color: "#C28F2C",
        label: "Below Target",
      },
      "below-floor": {
        bg: "#D44C4720",
        border: "#D44C4740",
        color: "#D44C47",
        label: "Below Floor",
      },
    };
    return (
      map[s] || {
        bg: "var(--bg-elevated)",
        border: "var(--border-default)",
        color: "var(--fg-secondary)",
        label: s,
      }
    );
  };

  return (
    <div
      style={{
        padding: "20px 24px",
        borderRadius: 14,
        background: "var(--bg-surface)",
        border: ".5px solid var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          font: "500 11px/1 var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".08em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        Contract Usage
      </div>

      {usage.length === 0 ? (
        <div
          style={{
            padding: "20px",
            borderRadius: 10,
            background: "var(--bg-elevated)",
            border: ".5px dashed var(--border-default)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              font: "500 14px/1 var(--font-sans)",
              color: "var(--fg-secondary)",
              marginBottom: 6,
            }}
          >
            Available for contract configuration
          </div>
          <div
            style={{
              font: "400 13px/20px var(--font-sans)",
              color: "var(--fg-tertiary)",
            }}
          >
            Not currently configured in any active contract. This measure is
            ready to be added to a new or amended contract.
          </div>
        </div>
      ) : (
        <div
          style={{
            borderRadius: 12,
            overflow: "hidden",
            border: ".5px solid var(--border-default)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 80px 80px 80px 100px 120px",
              gap: 0,
              padding: "8px 16px",
              background: "var(--bg-elevated)",
              borderBottom: ".5px solid var(--border-default)",
            }}
          >
            {[
              "Contract",
              "Provider",
              "Floor",
              "Target",
              "Stretch",
              "Score",
              "Status",
            ].map((h) => (
              <span
                key={h}
                style={{
                  font: "500 9px/1 var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </span>
            ))}
          </div>
          {usage.map((u, i) => {
            const c = contractById[u.contract];
            const st = statusStyle(u.status);
            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 80px 80px 80px 100px 120px",
                  gap: 0,
                  padding: "12px 16px",
                  borderBottom:
                    i < usage.length - 1
                      ? ".5px solid var(--border-default)"
                      : "none",
                  alignItems: "center",
                  background:
                    i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-elevated)",
                }}
              >
                <span
                  style={{
                    font: "500 13px/1 var(--font-sans)",
                    color: "var(--fg-primary)",
                  }}
                >
                  {c?.name || u.contract}
                </span>
                <span
                  style={{
                    font: "400 12px/1 var(--font-sans)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {c?.provider}
                </span>
                <span
                  style={{
                    font: "500 12px/1 var(--font-mono)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {u.floor}
                </span>
                <span
                  style={{
                    font: "500 12px/1 var(--font-mono)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {u.target}
                </span>
                <span
                  style={{
                    font: "500 12px/1 var(--font-mono)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {u.stretch}
                </span>
                <span
                  style={{
                    font: "700 14px/1 var(--font-mono)",
                    color: `${dim.color}`,
                  }}
                >
                  {u.score}
                </span>
                <span
                  style={{
                    padding: "3px 8px",
                    borderRadius: 9999,
                    background: st.bg,
                    border: `1px solid ${st.border}`,
                    font: "600 9px/1 var(--font-mono)",
                    color: st.color,
                    letterSpacing: ".04em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Section 5 — Related Measures ───────────────────────────────── */
function RelatedSection({ measure, dim, allDims, onMeasureSelect }) {
  const sameDim = dim.measures.filter((m) => m.id !== measure.id);

  // Cross-dim related: simple heuristic based on shared data sources
  const crossDimRelated = [];
  const srcWords = (measure.src || "").toLowerCase().split(/[\s,+/]+/);
  allDims.forEach((d) => {
    if (d.id === dim.id) return;
    d.measures.forEach((m) => {
      if (m.id === measure.id) return;
      const mWords = (m.src || "").toLowerCase().split(/[\s,+/]+/);
      const shared = srcWords.filter((w) => w.length > 3 && mWords.includes(w));
      if (shared.length > 0)
        crossDimRelated.push({
          measure: m,
          dim: d,
          reason: `Shared data source: ${shared.slice(0, 2).join(", ")}`,
        });
    });
  });
  const uniqueCross = crossDimRelated.slice(0, 5);

  return (
    <div
      style={{
        padding: "20px 24px",
        borderRadius: 14,
        background: "var(--bg-surface)",
        border: ".5px solid var(--border-default)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          font: "500 11px/1 var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".08em",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        Related Measures
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Same dimension */}
        <div>
          <div
            style={{
              font: "500 11px/1 var(--font-mono)",
              color: dim.color,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Same Dimension · {dim.id}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {sameDim.slice(0, 6).map((m) => (
              <button
                key={m.id}
                onClick={() => onMeasureSelect(m)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 8,
                  background: "var(--bg-elevated)",
                  border: ".5px solid var(--border-default)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background .1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = `${dim.color}10`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--bg-elevated)")
                }
              >
                <span
                  style={{
                    font: "600 10px/1 var(--font-mono)",
                    color: dim.color,
                    letterSpacing: ".04em",
                    flexShrink: 0,
                  }}
                >
                  {m.id}
                </span>
                <span
                  style={{
                    font: "400 12px/17px var(--font-sans)",
                    color: "var(--fg-primary)",
                    flex: 1,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {m.name}
                </span>
                <DirBadge dir={m.dir} />
              </button>
            ))}
            {sameDim.length > 6 && (
              <span
                style={{
                  font: "400 11px/1 var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  padding: "4px 12px",
                }}
              >
                +{sameDim.length - 6} more in {dim.id}
              </span>
            )}
          </div>
        </div>

        {/* Cross-dimension */}
        <div>
          <div
            style={{
              font: "500 11px/1 var(--font-mono)",
              color: "var(--fg-secondary)",
              letterSpacing: ".06em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Cross-Dimension · Shared Sources
          </div>
          {uniqueCross.length === 0 ? (
            <div
              style={{
                font: "400 13px/20px var(--font-sans)",
                color: "var(--fg-tertiary)",
                padding: "8px 0",
              }}
            >
              No strongly-related cross-dimension measures identified for this
              data source combination.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {uniqueCross.map(({ measure: m, dim: d, reason }) => (
                <button
                  key={m.id}
                  onClick={() => onMeasureSelect(m)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 8,
                    background: "var(--bg-elevated)",
                    border: ".5px solid var(--border-default)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background .1s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = `${d.color}10`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--bg-elevated)")
                  }
                >
                  <span
                    style={{
                      font: "600 10px/1 var(--font-mono)",
                      color: d.color,
                      letterSpacing: ".04em",
                      flexShrink: 0,
                      marginTop: 2,
                    }}
                  >
                    {m.id}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        font: "400 12px/16px var(--font-sans)",
                        color: "var(--fg-primary)",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {m.name}
                    </div>
                    <div
                      style={{
                        font: "400 10px/14px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                        marginTop: 2,
                      }}
                    >
                      {reason}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* ICHOM cross-ref for D1/D2 */}
          {(dim.id === "D1" || dim.id === "D2") && measure.ichomSet && (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  font: "500 11px/1 var(--font-mono)",
                  color: "var(--gold)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                ICHOM Cross-Reference
              </div>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "var(--gold-soft)",
                  border: ".5px solid var(--gold)",
                }}
              >
                <div
                  style={{
                    font: "600 12px/1 var(--font-mono)",
                    color: "var(--gold)",
                    marginBottom: 4,
                  }}
                >
                  ICHOM Set: {measure.ichomSet}
                </div>
                <div
                  style={{
                    font: "400 12px/18px var(--font-sans)",
                    color: "var(--fg-primary)",
                  }}
                >
                  Measure variable and timepoint specification defined by ICHOM{" "}
                  {measure.ichomSet} Standard Set. AiQL pipeline ingests this
                  variable per the ICHOM collection protocol.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── VFLevel3 — Main ─────────────────────────────────────────────── */
function VFLevel3({
  measure,
  dim,
  allDims,
  onNavigateToIchom,
  onMeasureSelect,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxWidth: 1100,
      }}
    >
      <DefinitionSection measure={measure} dim={dim} />
      <ThresholdGauge measure={measure} />
      <EpisodeSection measure={measure} dim={dim} />
      <ContractUsageSection measure={measure} dim={dim} />
      <RelatedSection
        measure={measure}
        dim={dim}
        allDims={allDims}
        onMeasureSelect={onMeasureSelect}
      />
    </div>
  );
}

export default VFLevel3;
