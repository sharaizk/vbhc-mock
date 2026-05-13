"use client";
import { VF_DIMENSIONS, VF_ROLE_COLORS } from "@/mock/value-framework";
// vf-viewer.jsx — Level 1 Framework Overview + navigation shell
import React from "react";
import VFLevel2 from "./VFLevel2";
import VFLevel3 from "./VFLevel3";
const {
  useState,
  useEffect: useVEffect,
  useCallback: useVCallback,
  useMemo: useVMemo,
} = React;

/* ── Shared Badge Components ─────────────────────────────────────── */
function RoleBadge({ role, small }) {
  const c = VF_ROLE_COLORS[role] || "#888";
  const fs = small ? "9px" : "10px";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: small ? "2px 7px" : "3px 9px",
        borderRadius: 9999,
        fontSize: fs,
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        letterSpacing: ".05em",
        textTransform: "uppercase",
        background: `${c}20`,
        color: c,
        border: `1px solid ${c}40`,
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      {role}
    </span>
  );
}

function IchomBadge({ rel, small }) {
  const colors = {
    Primary: "#228BA0",
    Indirect: "#6B7DA8",
    Supportive: "#3E91DB",
    Enabling: "#6366F1",
  };
  const c = colors[rel] || "#888";
  const fs = small ? "9px" : "10px";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: small ? "2px 7px" : "3px 9px",
        borderRadius: 9999,
        fontSize: fs,
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        background: `${c}15`,
        color: c,
        border: `1px solid ${c}35`,
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      ICHOM {rel}
    </span>
  );
}

function MeasLevelChain({ levels, small }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        flexWrap: "wrap",
      }}
    >
      {levels.map((l, i) => (
        <React.Fragment key={l}>
          <span
            style={{
              fontSize: small ? "9px" : "10px",
              fontFamily: "var(--font-mono)",
              color: "var(--fg-tertiary)",
              whiteSpace: "nowrap",
            }}
          >
            {l}
          </span>
          {i < levels.length - 1 && (
            <span
              style={{
                color: "var(--fg-tertiary)",
                fontSize: "9px",
                opacity: 0.6,
              }}
            >
              →
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ── D1/D2 Navigation Modal ─────────────────────────────────────── */
function IchomChoiceModal({ dim, onFramework, onIchom, onClose }) {
  if (!dim) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10,10,12,.45)",
        backdropFilter: "blur(4px)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          border: ".5px solid var(--border-default)",
          borderRadius: 20,
          boxShadow: "var(--shadow-popover)",
          padding: 32,
          width: 400,
          maxWidth: "90vw",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            font: "500 10px/1 var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".08em",
            marginBottom: 8,
            textTransform: "uppercase",
          }}
        >
          {dim.id} · ICHOM-Defined
        </div>
        <h3
          style={{
            margin: "0 0 8px",
            font: "500 22px/28px var(--font-sans)",
            color: "var(--fg-primary)",
          }}
        >
          {dim.name}
        </h3>
        <p
          style={{
            font: "400 13px/20px var(--font-sans)",
            color: "var(--fg-secondary)",
            margin: "0 0 24px",
          }}
        >
          This dimension's measures are defined by ICHOM Standard Sets. How
          would you like to explore it?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={onFramework}
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: 12,
              background: "var(--accent)",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                font: "500 14px/1 var(--font-sans)",
                color: "white",
                marginBottom: 4,
              }}
            >
              Explore Value Framework
            </div>
            <div
              style={{
                font: "400 12px/16px var(--font-sans)",
                color: "rgba(255,255,255,.75)",
              }}
            >
              Scope, payment logic, measure catalogue, cross-dimension
              dependencies
            </div>
          </button>
          <button
            onClick={onIchom}
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: 12,
              background: "var(--bg-elevated)",
              border: ".5px solid var(--border-default)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div
              style={{
                font: "500 14px/1 var(--font-sans)",
                color: "var(--fg-primary)",
                marginBottom: 4,
              }}
            >
              Browse ICHOM Standard Sets
            </div>
            <div
              style={{
                font: "400 12px/16px var(--font-sans)",
                color: "var(--fg-secondary)",
              }}
            >
              Variable definitions, timepoints, PROMs instruments, case-mix
              adjustment
            </div>
          </button>
        </div>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: 9999,
            background: "var(--bg-muted)",
            border: "none",
            cursor: "pointer",
            color: "var(--fg-secondary)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── Equation Dim Card ───────────────────────────────────────────── */
function EqCard({ dim, onClick, compact, style }) {
  const [hov, setHov] = useState(false);
  const c = dim.color;
  return (
    <div
      onClick={() => onClick(dim)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        padding: compact ? "10px 14px" : "14px 18px",
        borderRadius: 14,
        background: "var(--bg-surface)",
        border: `.5px solid ${c}50`,
        boxShadow: hov
          ? `0 4px 20px ${c}30, var(--shadow-card)`
          : "var(--shadow-card)",
        cursor: "pointer",
        transform: hov ? "translateY(-2px)" : "none",
        transition: "all .2s ease",
        overflow: "hidden",
        borderLeft: `3px solid ${c}`,
        ...style,
      }}
    >
      {(dim.id === "D1" || dim.id === "D2") && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            background: "var(--gold)",
            color: "white",
            fontSize: "8px",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            letterSpacing: ".06em",
            padding: "2px 7px",
            borderBottomLeftRadius: 6,
            textTransform: "uppercase",
          }}
        >
          ICHOM
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <div>
          <div
            style={{
              font: "700 11px/1 var(--font-mono)",
              color: c,
              letterSpacing: ".06em",
              marginBottom: 3,
            }}
          >
            {dim.id}
          </div>
          <div
            style={{
              font: `500 ${compact ? "12px" : "13px"}/17px var(--font-sans)`,
              color: "var(--fg-primary)",
              letterSpacing: "-.005em",
            }}
          >
            {dim.name}
          </div>
        </div>
        <RoleBadge role={dim.role} small />
      </div>
      {!compact && (
        <div
          style={{
            font: "400 11px/16px var(--font-sans)",
            color: "var(--fg-secondary)",
            marginBottom: 8,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {dim.whatItAnswers}
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
        }}
      >
        <IchomBadge rel={dim.ichomRel} small />
        <MeasLevelChain levels={dim.measLevel} small />
      </div>
    </div>
  );
}

/* ── Payment Equation View ───────────────────────────────────────── */
function PaymentEquationView({ dims, onDimClick }) {
  const byId = Object.fromEntries(dims.map((d) => [d.id, d]));

  const zoneStyle = () => ({});

  const operatorStyle = {
    font: "600 28px/1 var(--font-sans)",
    color: "var(--fg-tertiary)",
    alignSelf: "center",
    padding: "0 8px",
    flexShrink: 0,
  };

  const zoneLabel = (txt, color) => (
    <div
      style={{
        font: "500 9px/1 var(--font-mono)",
        letterSpacing: ".08em",
        textTransform: "uppercase",
        color: color || "var(--fg-tertiary)",
        marginBottom: 6,
        paddingLeft: 2,
      }}
    >
      {txt}
    </div>
  );

  const sectionBox = (label, color, children, extra) => (
    <div
      style={{
        borderRadius: 16,
        border: `.5px solid ${color}30`,
        background: `${color}08`,
        padding: "16px 14px",
        ...extra,
      }}
    >
      {zoneLabel(label, color)}
      {children}
    </div>
  );

  return (
    <div style={{ padding: "0 0 32px" }}>
      {/* Formula banner */}
      <div
        style={{
          padding: "12px 20px",
          borderRadius: 12,
          background: "var(--bg-elevated)",
          border: ".5px solid var(--border-default)",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            font: "500 11px/1 var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".04em",
          }}
        >
          VALUE
        </span>
        <span style={{ color: "var(--fg-tertiary)" }}>=</span>
        <span style={{ font: "500 11px/1 var(--font-mono)", color: "#228BA0" }}>
          [D1 + D2]
        </span>
        <span style={{ color: "var(--fg-tertiary)" }}>/</span>
        <span style={{ font: "500 11px/1 var(--font-mono)", color: "#C28F2C" }}>
          [D6]
        </span>
        <span style={{ color: "var(--fg-tertiary)" }}>×</span>
        <span style={{ font: "500 11px/1 var(--font-mono)", color: "#3E91DB" }}>
          [D3 ± D4 ± D5]
        </span>
        <span style={{ color: "var(--fg-tertiary)" }}>+</span>
        <span style={{ font: "500 11px/1 var(--font-mono)", color: "#4C8C4D" }}>
          [D8]
        </span>
        <span style={{ color: "var(--fg-tertiary)", marginLeft: 8 }}>|</span>
        <span style={{ font: "500 11px/1 var(--font-mono)", color: "#D44C47" }}>
          gated by [D10]
        </span>
        <span style={{ color: "var(--fg-tertiary)" }}>|</span>
        <span style={{ font: "500 11px/1 var(--font-mono)", color: "#6B7DA8" }}>
          in context of [D7] [D9]
        </span>
      </div>

      {/* Contextual framing */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "180px 1fr 180px",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* D9 — left context */}
        <div>
          {sectionBox(
            "Contextual",
            "#D97706",
            <EqCard dim={byId.D9} onClick={onDimClick} compact />,
            { height: "100%" },
          )}
        </div>

        {/* Main equation column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* NUMERATOR + fraction + DENOMINATOR */}
          <div style={{ ...zoneStyle("num", 450) }}>
            {sectionBox(
              "Numerator · What did we achieve?",
              "#228BA0",
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <EqCard dim={byId.D1} onClick={onDimClick} />
                <EqCard dim={byId.D2} onClick={onDimClick} />
              </div>,
            )}
          </div>

          <div style={{ display: "flex", alignItems: "stretch", gap: 16 }}>
            {/* Fraction + denominator */}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              <div
                style={{
                  height: 1,
                  background: "var(--border-default)",
                  marginBottom: 12,
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    transform: "translateX(-50%) translateY(-50%)",
                    background: "var(--bg-canvas)",
                    padding: "0 8px",
                    font: "500 11px/1 var(--font-mono)",
                    color: "var(--fg-tertiary)",
                  }}
                >
                  ÷
                </span>
              </div>
              {sectionBox(
                "Denominator · Among whom?",
                "#C28F2C",
                <EqCard dim={byId.D6} onClick={onDimClick} />,
              )}
            </div>

            {/* × ADJUSTMENTS */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={operatorStyle}>×</div>
              <div style={{ ...zoneStyle("adj", 700) }}>
                {sectionBox(
                  "Adjustments · Quality modifiers",
                  "#3E91DB",
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    <EqCard dim={byId.D3} onClick={onDimClick} compact />
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{
                          font: "600 14px/1 var(--font-mono)",
                          color: "#D44C47",
                          background: "#D44C4720",
                          borderRadius: 6,
                          padding: "2px 6px",
                        }}
                      >
                        −
                      </span>
                      <EqCard
                        dim={byId.D4}
                        onClick={onDimClick}
                        compact
                        style={{ flex: 1 }}
                      />
                    </div>
                    <EqCard dim={byId.D5} onClick={onDimClick} compact />
                  </div>,
                )}
              </div>
            </div>

            {/* + SEPARATE STREAM */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={operatorStyle}>+</div>
              <div style={{ ...zoneStyle("sep", 950) }}>
                {sectionBox(
                  "Separate Stream · Cost savings",
                  "#4C8C4D",
                  <EqCard dim={byId.D8} onClick={onDimClick} />,
                  { minWidth: 180 },
                )}
              </div>
            </div>
          </div>
        </div>

        {/* D7 — right context */}
        <div>
          {sectionBox(
            "Contextual",
            "#6B7DA8",
            <EqCard dim={byId.D7} onClick={onDimClick} compact />,
            { height: "100%" },
          )}
        </div>
      </div>

      {/* GATE bar */}
      <div style={{ marginTop: 16, ...zoneStyle("gate", 0) }}>
        <div
          style={{
            borderRadius: 12,
            border: "1.5px solid #D44C4740",
            background: "#D44C4708",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "#D44C47",
              flexShrink: 0,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span
              style={{
                font: "700 11px/1 var(--font-mono)",
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              Gate · Entry Prerequisite
            </span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <EqCard dim={byId.D10} onClick={onDimClick} compact />
          </div>
          <div
            style={{
              font: "400 12px/18px var(--font-sans)",
              color: "var(--fg-secondary)",
              maxWidth: 280,
              flexShrink: 0,
            }}
          >
            Minimum readiness thresholds must be met before any performance
            measurement begins. Failing D10 = ineligible for value contracts.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Grid View ───────────────────────────────────────────────────── */
function GridView({ dims, onDimClick }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(320px,1fr))",
        gap: 16,
      }}
    >
      {dims.map((d) => (
        <div
          key={d.id}
          onClick={() => onDimClick(d)}
          style={{
            background: "var(--bg-surface)",
            border: ".5px solid var(--border-default)",
            borderRadius: 16,
            boxShadow: "var(--shadow-card)",
            padding: "20px",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            transition: "box-shadow .15s ease, transform .15s ease",
            borderLeft: `3px solid ${d.color}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-popover)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "var(--shadow-card)";
            e.currentTarget.style.transform = "none";
          }}
        >
          {(d.id === "D1" || d.id === "D2") && (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                background: "var(--gold)",
                color: "white",
                fontSize: "8px",
                fontFamily: "var(--font-mono)",
                fontWeight: 700,
                letterSpacing: ".06em",
                padding: "2px 7px",
                borderBottomLeftRadius: 6,
                textTransform: "uppercase",
              }}
            >
              ICHOM-Defined
            </div>
          )}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <div>
              <div
                style={{
                  font: "700 10px/1 var(--font-mono)",
                  color: d.color,
                  letterSpacing: ".08em",
                  marginBottom: 4,
                }}
              >
                {d.id}
              </div>
              <h3
                style={{
                  margin: 0,
                  font: "500 17px/22px var(--font-sans)",
                  color: "var(--fg-primary)",
                  letterSpacing: "-.005em",
                }}
              >
                {d.name}
              </h3>
            </div>
            <RoleBadge role={d.role} small />
          </div>
          <p
            style={{
              margin: "0 0 12px",
              font: "400 13px/19px var(--font-sans)",
              color: "var(--fg-secondary)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {d.whatItAnswers}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 6,
              borderTop: ".5px solid var(--border-default)",
              paddingTop: 10,
            }}
          >
            <IchomBadge rel={d.ichomRel} small />
            <MeasLevelChain levels={d.measLevel} small />
            <span
              style={{
                font: "500 10px/1 var(--font-mono)",
                color: "var(--fg-tertiary)",
              }}
            >
              {d.measures.length} measures
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Level 1 Landing Page ────────────────────────────────────────── */
function VFLevel1({ onDimSelect, onNavigateToIchom }) {
  const [mode, setMode] = useState("grid"); // "equation" | "grid"
  const [ichomModal, setIchomModal] = useState(null);

  const handleDimClick = useVCallback(
    (dim) => {
      if (dim.id === "D1" || dim.id === "D2") {
        setIchomModal(dim);
      } else {
        onDimSelect(dim);
      }
    },
    [onDimSelect],
  );

  return (
    <div>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 28,
          gap: 24,
        }}
      >
        <div>
          <div
            style={{
              font: "500 11px/1 var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".08em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            VALUE ARCHITECTURE
          </div>
          <h1
            style={{
              margin: "0 0 10px",
              font: "500 32px/40px var(--font-sans)",
              letterSpacing: "-.02em",
              color: "var(--fg-primary)",
            }}
          >
            Value Framework
          </h1>
          <p
            style={{
              margin: "0 0 16px",
              font: "400 14px/22px var(--font-sans)",
              color: "var(--fg-secondary)",
              maxWidth: 620,
            }}
          >
            The AiQL Value Architecture — 10 dimensions that together define how
            performance payment is computed in value-based health contracts.
            Each dimension is a computable, non-overlapping component of the
            payment formula.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { n: "10", l: "Dimensions" },
              { n: "108", l: "Measures" },
              { n: "5", l: "Active contracts" },
              { n: "3", l: "ICHOM-linked" },
            ].map((s) => (
              <span
                key={s.l}
                style={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 8,
                  padding: "8px 14px",
                  borderRadius: 9999,
                  background: "var(--bg-surface)",
                  border: ".5px solid var(--border-default)",
                  boxShadow: "var(--shadow-pill)",
                }}
              >
                <span
                  style={{
                    font: "600 16px/1 var(--font-sans)",
                    color: "var(--fg-primary)",
                  }}
                >
                  {s.n}
                </span>
                <span
                  style={{
                    font: "500 11px/1 var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    letterSpacing: ".04em",
                    textTransform: "uppercase",
                  }}
                >
                  {s.l}
                </span>
              </span>
            ))}
          </div>
        </div>
        {/* Mode toggle */}
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: 4,
            background: "var(--bg-elevated)",
            border: ".5px solid var(--border-default)",
            borderRadius: 9999,
            flexShrink: 0,
          }}
        >
          {[
            {
              id: "equation",
              label: "Equation View",
              icon: (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              ),
            },
            {
              id: "grid",
              label: "Grid View",
              icon: (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                </svg>
              ),
            },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                padding: "6px 14px",
                borderRadius: 9999,
                font: "500 13px/1 var(--font-sans)",
                color:
                  mode === m.id ? "var(--fg-primary)" : "var(--fg-secondary)",
                cursor: "pointer",
                border: 0,
                background: mode === m.id ? "var(--bg-surface)" : "transparent",
                boxShadow: mode === m.id ? "var(--shadow-pill)" : "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {mode === "equation" ? (
        <PaymentEquationView dims={VF_DIMENSIONS} onDimClick={handleDimClick} />
      ) : (
        <GridView dims={VF_DIMENSIONS} onDimClick={handleDimClick} />
      )}

      {/* ICHOM modal */}
      {ichomModal && (
        <IchomChoiceModal
          dim={ichomModal}
          onFramework={() => {
            onDimSelect(ichomModal);
            setIchomModal(null);
          }}
          onIchom={() => {
            onNavigateToIchom();
            setIchomModal(null);
          }}
          onClose={() => setIchomModal(null)}
        />
      )}
    </div>
  );
}

/* ── Main ValueFrameworkViewer ───────────────────────────────────── */
function ValueFrameworkViewer({ onNavigateToIchom }) {
  const [level, setLevel] = useState(1); // 1 | 2 | 3
  const [activeDim, setActiveDim] = useState(null);
  const [activeMeasure, setActiveMeasure] = useState(null);

  const selectDim = useVCallback((dim) => {
    setActiveDim(dim);
    setActiveMeasure(null);
    setLevel(2);
  }, []);

  const selectMeasure = useVCallback((measure) => {
    setActiveMeasure(measure);
    setLevel(3);
  }, []);

  const goToL1 = useVCallback(() => {
    setLevel(1);
    setActiveDim(null);
    setActiveMeasure(null);
  }, []);
  const goToL2 = useVCallback(() => {
    setLevel(2);
    setActiveMeasure(null);
  }, []);

  return (
    <div>
      {/* Breadcrumb */}
      {level > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 20,
            font: "500 11px/1 var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".04em",
            textTransform: "uppercase",
          }}
        >
          <button
            onClick={goToL1}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--accent)",
              font: "inherit",
              padding: 0,
            }}
          >
            Value Framework
          </button>
          {level >= 2 && activeDim && (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              {level === 2 ? (
                <span style={{ color: "var(--fg-primary)" }}>
                  {activeDim.id} · {activeDim.name}
                </span>
              ) : (
                <button
                  onClick={goToL2}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--accent)",
                    font: "inherit",
                    padding: 0,
                  }}
                >
                  {activeDim.id} · {activeDim.name}
                </button>
              )}
            </>
          )}
          {level === 3 && activeMeasure && (
            <>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span style={{ color: "var(--fg-primary)" }}>
                {activeMeasure.id} · {activeMeasure.name}
              </span>
            </>
          )}
        </div>
      )}

      {/* Level content */}
      {level === 1 && (
        <VFLevel1
          onDimSelect={selectDim}
          onNavigateToIchom={onNavigateToIchom}
        />
      )}
      {level === 2 && activeDim && (
        <VFLevel2
          dim={activeDim}
          allDims={VF_DIMENSIONS}
          onDimSwitch={selectDim}
          onMeasureSelect={selectMeasure}
          onNavigateToIchom={onNavigateToIchom}
        />
      )}
      {level === 3 && activeMeasure && activeDim && (
        <VFLevel3
          measure={activeMeasure}
          dim={activeDim}
          allDims={VF_DIMENSIONS}
          onNavigateToIchom={onNavigateToIchom}
          onMeasureSelect={selectMeasure}
        />
      )}
    </div>
  );
}

/* ── Exports ─────────────────────────────────────────────────────── */
export default ValueFrameworkViewer;
export { RoleBadge, IchomBadge, MeasLevelChain };
