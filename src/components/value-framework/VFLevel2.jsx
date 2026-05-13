// vf-level2.jsx — Dimension Deep-Dive (5 tabs + navigation rail)
import React from "react";
import { IchomBadge, MeasLevelChain, RoleBadge } from "./VFViewer2";
import { VF_ROLE_COLORS } from "@/mock/value-framework";
const { useState: useL2State, useMemo: useL2Memo } = React;

/* ── Shared tiny helpers ──────────────────────────────────────────── */
const methColors = {
  outcome: "#228BA0",
  "patient-reported": "#6366F1",
  process: "#C28F2C",
  structural: "#4C8C4D",
  composite: "#D97706",
};
const methLabel = {
  outcome: "Outcome",
  "patient-reported": "Patient-Reported",
  process: "Process",
  structural: "Structural",
  composite: "Composite",
};

function MethBadge({ m }) {
  const c = methColors[m] || "#888";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "2px 7px",
        borderRadius: 9999,
        fontSize: "9px",
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        background: `${c}18`,
        color: c,
        border: `1px solid ${c}30`,
        whiteSpace: "nowrap",
      }}
    >
      {methLabel[m] || m}
    </span>
  );
}
function DirBadge({ dir }) {
  return dir === 1 ? (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        color: "#228BA0",
        fontSize: "11px",
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
      }}
    >
      ↑ Higher
    </span>
  ) : (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        color: "#D44C47",
        fontSize: "11px",
        fontFamily: "var(--font-mono)",
        fontWeight: 600,
      }}
    >
      ↓ Lower
    </span>
  );
}

/* ── Tab 1 — Scope & Boundaries ──────────────────────────────────── */
function ScopeTab({ dim, allDims, onDimSwitch }) {
  const dimById = Object.fromEntries(allDims.map((d) => [d.id, d]));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* INCLUDED */}
      <div>
        <div
          style={{
            font: "500 11px/1 var(--font-mono)",
            color: "#228BA0",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: "#228BA0",
              display: "inline-block",
            }}
          ></span>
          INCLUDED
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {dim.scope.included.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 10,
                background: "var(--bg-elevated)",
                border: ".5px solid var(--border-default)",
              }}
            >
              <span
                style={{
                  color: "#228BA0",
                  font: "600 13px/1 var(--font-sans)",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                ✓
              </span>
              <span
                style={{
                  font: "400 13px/19px var(--font-sans)",
                  color: "var(--fg-primary)",
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* EXCLUDED */}
      <div>
        <div
          style={{
            font: "500 11px/1 var(--font-mono)",
            color: "#D44C47",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: "#D44C47",
              display: "inline-block",
            }}
          ></span>
          EXCLUDED
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {dim.scope.excluded.map((exc, i) => {
            const relDim = dimById[exc.dim];
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "var(--bg-elevated)",
                  border: ".5px solid var(--border-default)",
                }}
              >
                <span
                  style={{
                    color: "#D44C47",
                    font: "600 13px/1 var(--font-sans)",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  ✗
                </span>
                <div style={{ flex: 1 }}>
                  <span
                    style={{
                      font: "400 13px/19px var(--font-sans)",
                      color: "var(--fg-primary)",
                    }}
                  >
                    {exc.item}
                  </span>
                  {exc.dim && relDim && (
                    <button
                      onClick={() => onDimSwitch(relDim)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        marginLeft: 8,
                        padding: "1px 7px",
                        borderRadius: 9999,
                        background: `${relDim.color}15`,
                        border: `1px solid ${relDim.color}30`,
                        color: relDim.color,
                        fontSize: "10px",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: ".04em",
                      }}
                    >
                      → {exc.dim}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Boundary clarifications */}
        {dim.scope.boundaries && dim.scope.boundaries.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                font: "500 11px/1 var(--font-mono)",
                color: "var(--fg-tertiary)",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 9999,
                  background: "var(--fg-tertiary)",
                  display: "inline-block",
                }}
              ></span>
              BOUNDARY CLARIFICATIONS
            </div>
            {dim.scope.boundaries.map((b, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "var(--bg-surface)",
                  border: `.5px solid ${dim.color}30`,
                  borderLeft: `3px solid ${dim.color}`,
                  marginBottom: 10,
                }}
              >
                <p
                  style={{
                    margin: "0 0 8px",
                    font: "400 13px/20px var(--font-sans)",
                    color: "var(--fg-primary)",
                  }}
                >
                  {b.text}
                </p>
                {b.related &&
                  b.related.map((rid) => {
                    const rd = dimById[rid];
                    return rd ? (
                      <button
                        key={rid}
                        onClick={() => onDimSwitch(rd)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "2px 8px",
                          borderRadius: 9999,
                          background: `${rd.color}15`,
                          border: `1px solid ${rd.color}30`,
                          color: rd.color,
                          fontSize: "10px",
                          fontFamily: "var(--font-mono)",
                          fontWeight: 600,
                          cursor: "pointer",
                          marginRight: 6,
                          letterSpacing: ".04em",
                        }}
                      >
                        See {rid} →
                      </button>
                    ) : null;
                  })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Tab 2 — Payment Logic ───────────────────────────────────────── */
function HCPLANMatrix({ types }) {
  const cats = ["1", "2A", "2B", "3A", "3B", "4"];
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {cats.map((c) => (
        <div
          key={c}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: types[c] ? "var(--accent)" : "var(--bg-muted)",
              border: `.5px solid var(--border-default)`,
              display: "grid",
              placeItems: "center",
              color: types[c] ? "white" : "var(--fg-tertiary)",
            }}
          >
            {types[c] ? (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <span
                style={{ fontSize: "11px", fontFamily: "var(--font-mono)" }}
              >
                –
              </span>
            )}
          </div>
          <span
            style={{
              font: "500 9px/1 var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".04em",
            }}
          >
            {c}
          </span>
        </div>
      ))}
    </div>
  );
}

function PaymentTab({ dim, allDims, onDimSwitch }) {
  const dimById = Object.fromEntries(allDims.map((d) => [d.id, d]));
  const pl = dim.paymentLogic;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* A: Equation position mini-diagram */}
      <div
        style={{
          padding: "16px 20px",
          borderRadius: 14,
          background: "var(--bg-elevated)",
          border: ".5px solid var(--border-default)",
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
          Payment Equation Position
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          {["D1+D2", "D6", "D3·D4·D5", "D8", "D10"].map((seg, i) => {
            const ids = seg.split(/[+·]/);
            const isActive = ids.some((id) => id.trim() === dim.id);
            const ops = ["÷", "×", "+", "| gate"];
            return (
              <React.Fragment key={seg}>
                {i > 0 && (
                  <span
                    style={{
                      font: "500 16px/1 var(--font-mono)",
                      color: "var(--fg-tertiary)",
                    }}
                  >
                    {ops[i - 1]}
                  </span>
                )}
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: isActive
                      ? `${dim.color}20`
                      : "var(--bg-surface)",
                    border: isActive
                      ? `1.5px solid ${dim.color}`
                      : ".5px solid var(--border-default)",
                    font: "500 12px/1 var(--font-mono)",
                    color: isActive ? dim.color : "var(--fg-tertiary)",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: ".03em",
                    boxShadow: isActive ? `0 0 12px ${dim.color}30` : "none",
                  }}
                >
                  {seg}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* B: Mechanics */}
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
          Payment Mechanics
        </div>
        <div
          style={{
            padding: "16px 20px",
            borderRadius: 14,
            background: "var(--bg-surface)",
            border: `.5px solid ${dim.color}30`,
            borderLeft: `3px solid ${dim.color}`,
          }}
        >
          <p
            style={{
              margin: 0,
              font: "400 14px/22px var(--font-sans)",
              color: "var(--fg-primary)",
            }}
          >
            {pl.mechanics}
          </p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* C: Episode applicability */}
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
            Episode Applicability
          </div>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "var(--bg-elevated)",
              border: ".5px solid var(--border-default)",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                font: "600 13px/1 var(--font-sans)",
                color: pl.episodeApplicable ? "#228BA0" : "#D44C47",
              }}
            >
              {pl.episodeApplicable
                ? "✓ Yes — measurable per patient/episode"
                : "✗ No — population-level only"}
            </span>
          </div>
          {pl.episodeExamples &&
            pl.episodeExamples.map((ex, i) => (
              <div
                key={i}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "var(--bg-surface)",
                  border: ".5px solid var(--border-default)",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    font: "600 11px/1 var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    marginBottom: 5,
                    letterSpacing: ".04em",
                  }}
                >
                  {ex.patient}
                </div>
                <div
                  style={{
                    font: "400 13px/19px var(--font-sans)",
                    color: "var(--fg-primary)",
                  }}
                >
                  {ex.example}
                </div>
              </div>
            ))}
        </div>

        {/* D: Contract type matrix */}
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
            HCP-LAN Contract Categories
          </div>
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              background: "var(--bg-elevated)",
              border: ".5px solid var(--border-default)",
              marginBottom: 10,
            }}
          >
            <HCPLANMatrix types={pl.contractTypes} />
          </div>
          <div
            style={{
              font: "400 12px/18px var(--font-sans)",
              color: "var(--fg-tertiary)",
            }}
          >
            Categories 1–4 per HCP Learning Action Network. Teal = applicable;
            grey = not applicable for this dimension.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Tab 3 — Measure Catalogue ───────────────────────────────────── */
function MeasureCatalogueTab({ dim, onMeasureSelect }) {
  const [search, setSearch] = useL2State("");
  const [methFilter, setMethFilter] = useL2State("all");
  const [sortCol, setSortCol] = useL2State("id");
  const [sortAsc, setSortAsc] = useL2State(true);

  const methoods = useL2Memo(
    () => [...new Set(dim.measures.map((m) => m.meth))],
    [dim],
  );

  const filtered = useL2Memo(() => {
    let ms = dim.measures;
    if (methFilter !== "all") ms = ms.filter((m) => m.meth === methFilter);
    if (search)
      ms = ms.filter(
        (m) =>
          m.name.toLowerCase().includes(search.toLowerCase()) ||
          m.id.toLowerCase().includes(search.toLowerCase()),
      );
    ms = [...ms].sort((a, b) => {
      const va = a[sortCol] || "";
      const vb = b[sortCol] || "";
      return sortAsc
        ? va < vb
          ? -1
          : va > vb
            ? 1
            : 0
        : va > vb
          ? -1
          : va < vb
            ? 1
            : 0;
    });
    return ms;
  }, [dim, search, methFilter, sortCol, sortAsc]);

  const toggleSort = (col) => {
    if (sortCol === col) setSortAsc((a) => !a);
    else {
      setSortCol(col);
      setSortAsc(true);
    }
  };

  const ThHdr = ({ col, label }) => (
    <th
      onClick={() => toggleSort(col)}
      style={{
        textAlign: "left",
        padding: "10px 14px",
        font: "500 9px/1 var(--font-mono)",
        color: "var(--fg-tertiary)",
        letterSpacing: ".08em",
        textTransform: "uppercase",
        background: "var(--bg-elevated)",
        cursor: "pointer",
        whiteSpace: "nowrap",
        userSelect: "none",
      }}
    >
      {label}
      {sortCol === col ? (sortAsc ? " ↑" : " ↓") : ""}
    </th>
  );

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            height: 36,
            padding: "0 12px",
            borderRadius: 9999,
            background: "var(--bg-elevated)",
            border: ".5px solid var(--border-default)",
            flex: "0 0 260px",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            opacity=".5"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search measures…"
            style={{
              border: 0,
              outline: 0,
              background: "transparent",
              font: "400 13px/1 var(--font-sans)",
              color: "var(--fg-primary)",
              flex: 1,
            }}
          />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", ...methoods].map((m) => (
            <button
              key={m}
              onClick={() => setMethFilter(m)}
              style={{
                padding: "6px 12px",
                borderRadius: 9999,
                font: "500 11px/1 var(--font-mono)",
                letterSpacing: ".04em",
                textTransform: "uppercase",
                cursor: "pointer",
                border: ".5px solid var(--border-default)",
                background:
                  methFilter === m ? "var(--fg-primary)" : "var(--bg-elevated)",
                color:
                  methFilter === m
                    ? "var(--bg-surface)"
                    : "var(--fg-secondary)",
              }}
            >
              {m === "all" ? "All" : methLabel[m] || m}
            </button>
          ))}
        </div>
        <span
          style={{
            marginLeft: "auto",
            font: "500 11px/1 var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".04em",
          }}
        >
          {filtered.length} of {dim.measures.length}
        </span>
      </div>

      {/* Table */}
      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",
          border: ".5px solid var(--border-default)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <ThHdr col="id" label="ID" />
              <ThHdr col="name" label="Measure" />
              {(dim.id === "D1" || dim.id === "D2") && (
                <ThHdr col="ichomSet" label="ICHOM Set" />
              )}
              <ThHdr col="meth" label="Method" />
              <ThHdr col="unit" label="Unit" />
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  font: "500 9px/1 var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  background: "var(--bg-elevated)",
                }}
              >
                Dir
              </th>
              <ThHdr col="src" label="Data Source" />
              <ThHdr col="bench" label="Benchmark" />
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  font: "500 9px/1 var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  background: "var(--bg-elevated)",
                }}
              >
                Risk Adj
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "10px 14px",
                  font: "500 9px/1 var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  background: "var(--bg-elevated)",
                }}
              >
                Freq
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr
                key={m.id}
                onClick={() => onMeasureSelect(m)}
                style={{
                  cursor: "pointer",
                  background:
                    i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-elevated)",
                  transition: "background .1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = `${dim.color}10`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background =
                    i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-elevated)")
                }
              >
                <td
                  style={{
                    padding: "11px 14px",
                    font: "600 11px/1 var(--font-mono)",
                    color: dim.color,
                    letterSpacing: ".04em",
                    borderBottom: ".5px solid var(--border-default)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.id}
                </td>
                <td
                  style={{
                    padding: "11px 14px",
                    font: "500 13px/18px var(--font-sans)",
                    color: "var(--fg-primary)",
                    borderBottom: ".5px solid var(--border-default)",
                    maxWidth: 260,
                  }}
                >
                  <div>{m.name}</div>
                  {(dim.id === "D1" || dim.id === "D2") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      style={{
                        marginTop: 4,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                        padding: "1px 6px",
                        borderRadius: 6,
                        background: "var(--gold-soft)",
                        border: "none",
                        color: "var(--gold)",
                        fontSize: "9px",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 600,
                        cursor: "pointer",
                        letterSpacing: ".04em",
                      }}
                    >
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      ICHOM Browser
                    </button>
                  )}
                </td>
                {(dim.id === "D1" || dim.id === "D2") && (
                  <td
                    style={{
                      padding: "11px 14px",
                      font: "400 12px/16px var(--font-sans)",
                      color: "var(--fg-secondary)",
                      borderBottom: ".5px solid var(--border-default)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {m.ichomSet}
                  </td>
                )}
                <td
                  style={{
                    padding: "11px 14px",
                    borderBottom: ".5px solid var(--border-default)",
                  }}
                >
                  <MethBadge m={m.meth} />
                </td>
                <td
                  style={{
                    padding: "11px 14px",
                    font: "400 12px/1 var(--font-mono)",
                    color: "var(--fg-secondary)",
                    borderBottom: ".5px solid var(--border-default)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m.unit}
                </td>
                <td
                  style={{
                    padding: "11px 14px",
                    borderBottom: ".5px solid var(--border-default)",
                  }}
                >
                  <DirBadge dir={m.dir} />
                </td>
                <td
                  style={{
                    padding: "11px 14px",
                    font: "400 12px/16px var(--font-sans)",
                    color: "var(--fg-secondary)",
                    borderBottom: ".5px solid var(--border-default)",
                    maxWidth: 180,
                  }}
                >
                  {m.src}
                </td>
                <td
                  style={{
                    padding: "11px 14px",
                    font: "400 12px/16px var(--font-sans)",
                    color: "var(--fg-secondary)",
                    borderBottom: ".5px solid var(--border-default)",
                    maxWidth: 160,
                  }}
                >
                  {m.bench}
                </td>
                <td
                  style={{
                    padding: "11px 14px",
                    font: "400 12px/16px var(--font-sans)",
                    color: "var(--fg-secondary)",
                    borderBottom: ".5px solid var(--border-default)",
                    maxWidth: 160,
                  }}
                >
                  {m.risk}
                </td>
                <td
                  style={{
                    padding: "11px 14px",
                    font: "500 11px/1 var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    borderBottom: ".5px solid var(--border-default)",
                    whiteSpace: "nowrap",
                    letterSpacing: ".03em",
                  }}
                >
                  {m.freq}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Tab 4 — ICHOM & PHTI Alignment ─────────────────────────────── */
function AlignmentTab({ dim, onNavigateToIchom }) {
  const relColors = {
    Primary: "#228BA0",
    Indirect: "#6B7DA8",
    Supportive: "#3E91DB",
    Enabling: "#6366F1",
  };
  const c = relColors[dim.ichomRel] || "#888";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
      {/* ICHOM */}
      <div>
        <div
          style={{
            font: "500 11px/1 var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          ICHOM Relationship
        </div>
        <div
          style={{
            padding: "16px 20px",
            borderRadius: 14,
            background: "var(--bg-surface)",
            border: `.5px solid ${c}40`,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 9999,
                background: `${c}18`,
                border: `1px solid ${c}30`,
                font: "600 12px/1 var(--font-mono)",
                color: c,
                letterSpacing: ".05em",
                textTransform: "uppercase",
              }}
            >
              {dim.ichomRel}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              font: "400 14px/22px var(--font-sans)",
              color: "var(--fg-primary)",
            }}
          >
            {dim.ichomDetail}
          </p>
        </div>
        {(dim.id === "D1" || dim.id === "D2") && (
          <button
            onClick={onNavigateToIchom}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 18px",
              borderRadius: 12,
              background: "var(--accent)",
              border: "none",
              cursor: "pointer",
              color: "white",
              font: "500 13px/1 var(--font-sans)",
              width: "100%",
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Browse ICHOM Standard Sets →
          </button>
        )}
      </div>

      {/* PHTI */}
      <div>
        <div
          style={{
            font: "500 11px/1 var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          PHTI Alignment
        </div>
        <div
          style={{
            padding: "16px 20px",
            borderRadius: 14,
            background: "var(--bg-surface)",
            border: ".5px solid var(--border-default)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                padding: "3px 10px",
                borderRadius: 9999,
                background: "var(--bg-elevated)",
                border: ".5px solid var(--border-default)",
                font: "500 11px/1 var(--font-mono)",
                color: "var(--fg-secondary)",
                letterSpacing: ".04em",
              }}
            >
              PHTI Peterson Health Technology Institute
            </span>
          </div>
          <p
            style={{
              margin: 0,
              font: "400 14px/22px var(--font-sans)",
              color: "var(--fg-primary)",
            }}
          >
            {dim.phtiAlignment}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Tab 5 — Cross-Dimension Dependencies ────────────────────────── */
function depLineStyle(type) {
  const base = { position: "absolute", zIndex: 1 };
  if (type === "depends-on")
    return { ...base, borderTop: "2px solid var(--accent)", opacity: 0.7 };
  if (type === "depended-on-by")
    return { ...base, borderTop: "2px dashed #228BA0", opacity: 0.7 };
  if (type === "payment-interaction")
    return { ...base, borderTop: "2px dotted #C28F2C", opacity: 0.7 };
  if (type === "boundary")
    return {
      ...base,
      borderTop: "1px dashed var(--fg-tertiary)",
      opacity: 0.5,
    };
  return { ...base, borderTop: "1px solid var(--border-default)" };
}
const depColors = {
  "depends-on": "#228BA0",
  "depended-on-by": "#6366F1",
  "payment-interaction": "#C28F2C",
  boundary: "#6B7DA8",
};
const depLabels = {
  "depends-on": "Depends on",
  "depended-on-by": "Required by",
  "payment-interaction": "Payment interaction",
  boundary: "Boundary adjacency",
};

function DependenciesTab({ dim, allDims, onDimSwitch }) {
  const dimById = Object.fromEntries(allDims.map((d) => [d.id, d]));
  const deps = VF_DEPENDENCIES[dim.id] || [];

  return (
    <div>
      {/* Legend */}
      <div
        style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}
      >
        {Object.entries(depLabels).map(([k, v]) => (
          <div
            key={k}
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <div
              style={{
                width: 24,
                height: 0,
                border: `2px ${k === "boundary" ? "dashed" : k === "payment-interaction" ? "dotted" : "solid"} ${depColors[k]}`,
                opacity: 0.8,
              }}
            ></div>
            <span
              style={{
                font: "500 11px/1 var(--font-mono)",
                color: "var(--fg-tertiary)",
                letterSpacing: ".03em",
              }}
            >
              {v}
            </span>
          </div>
        ))}
      </div>

      {/* Central node + spokes visual */}
      <div
        style={{
          padding: "24px",
          borderRadius: 16,
          background: "var(--bg-elevated)",
          border: ".5px solid var(--border-default)",
          marginBottom: 24,
          position: "relative",
          minHeight: 240,
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Current dim — large */}
          <div
            style={{
              padding: "14px 20px",
              borderRadius: 14,
              background: `${dim.color}18`,
              border: `2px solid ${dim.color}`,
              textAlign: "center",
              minWidth: 140,
            }}
          >
            <div
              style={{
                font: "700 14px/1 var(--font-mono)",
                color: dim.color,
                marginBottom: 4,
              }}
            >
              {dim.id}
            </div>
            <div
              style={{
                font: "500 12px/16px var(--font-sans)",
                color: "var(--fg-primary)",
              }}
            >
              {dim.name}
            </div>
          </div>

          <svg
            width="40"
            height="40"
            style={{ flexShrink: 0 }}
            viewBox="0 0 40 40"
            fill="none"
          >
            <path
              d="M8 20h24M24 12l8 8-8 8"
              stroke="var(--fg-tertiary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity=".4"
            />
          </svg>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, flex: 1 }}>
            {deps.map((dep, i) => {
              const rd = dimById[dep.to];
              if (!rd) return null;
              const c = depColors[dep.type] || "#888";
              return (
                <button
                  key={i}
                  onClick={() => onDimSwitch(rd)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    padding: "10px 14px",
                    borderRadius: 12,
                    background: "var(--bg-surface)",
                    border: `1px solid ${c}30`,
                    cursor: "pointer",
                    textAlign: "left",
                    minWidth: 120,
                    transition: "all .15s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.boxShadow = `0 4px 12px ${c}20`)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.boxShadow = "none")
                  }
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 9999,
                        background: rd.color,
                        flexShrink: 0,
                      }}
                    ></span>
                    <span
                      style={{
                        font: "600 11px/1 var(--font-mono)",
                        color: rd.color,
                        letterSpacing: ".04em",
                      }}
                    >
                      {rd.id}
                    </span>
                    <span
                      style={{
                        font: "500 9px/1 var(--font-mono)",
                        color: c,
                        letterSpacing: ".03em",
                        marginLeft: "auto",
                        padding: "1px 5px",
                        borderRadius: 4,
                        background: `${c}15`,
                      }}
                    >
                      {depLabels[dep.type]?.split(" ")[0]}
                    </span>
                  </div>
                  <div
                    style={{
                      font: "400 11px/15px var(--font-sans)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {rd.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dependency table */}
      <div
        style={{
          font: "500 11px/1 var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".08em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        All Connections ({deps.length})
      </div>
      <div
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: ".5px solid var(--border-default)",
        }}
      >
        {deps.map((dep, i) => {
          const rd = dimById[dep.to];
          if (!rd) return null;
          const c = depColors[dep.type] || "#888";
          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "80px 120px 1fr",
                gap: 16,
                alignItems: "center",
                padding: "12px 18px",
                borderBottom:
                  i < deps.length - 1
                    ? ".5px solid var(--border-default)"
                    : "none",
                background:
                  i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-elevated)",
              }}
            >
              <button
                onClick={() => onDimSwitch(rd)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 8px",
                  borderRadius: 8,
                  background: `${rd.color}15`,
                  border: `1px solid ${rd.color}30`,
                  cursor: "pointer",
                  color: rd.color,
                  font: "600 11px/1 var(--font-mono)",
                  letterSpacing: ".04em",
                }}
              >
                {rd.id} →
              </button>
              <span
                style={{
                  padding: "3px 8px",
                  borderRadius: 9999,
                  background: `${c}15`,
                  border: `1px solid ${c}25`,
                  font: "500 10px/1 var(--font-mono)",
                  color: c,
                  letterSpacing: ".03em",
                  whiteSpace: "nowrap",
                }}
              >
                {depLabels[dep.type]}
              </span>
              <span
                style={{
                  font: "400 13px/19px var(--font-sans)",
                  color: "var(--fg-secondary)",
                }}
              >
                {dep.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── VFLevel2 — Main ─────────────────────────────────────────────── */
function VFLevel2({
  dim,
  allDims,
  onDimSwitch,
  onMeasureSelect,
  onNavigateToIchom,
}) {
  const [tab, setTab] = useL2State("scope");

  const tabs = [
    { id: "scope", label: "Scope & Boundaries" },
    { id: "payment", label: "Payment Logic" },
    { id: "measures", label: "Measure Catalogue", count: dim.measures.length },
    { id: "align", label: "ICHOM & PHTI" },
    { id: "deps", label: "Cross-Dimension" },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 200px",
        gap: 24,
        alignItems: "start",
      }}
    >
      {/* Main content */}
      <div>
        {/* Dimension header */}
        <div
          style={{
            padding: "20px 24px",
            borderRadius: 16,
            background: "var(--bg-surface)",
            border: ".5px solid var(--border-default)",
            boxShadow: "var(--shadow-card)",
            marginBottom: 20,
            borderLeft: `4px solid ${dim.color}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <div
                style={{
                  font: "700 12px/1 var(--font-mono)",
                  color: dim.color,
                  letterSpacing: ".08em",
                  marginBottom: 6,
                }}
              >
                {dim.id}
              </div>
              <h2
                style={{
                  margin: "0 0 6px",
                  font: "500 26px/32px var(--font-sans)",
                  color: "var(--fg-primary)",
                  letterSpacing: "-.01em",
                }}
              >
                {dim.name}
              </h2>
              <p
                style={{
                  margin: 0,
                  font: "400 14px/21px var(--font-sans)",
                  color: "var(--fg-secondary)",
                }}
              >
                {dim.whatItAnswers}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                alignItems: "flex-end",
                flexShrink: 0,
              }}
            >
              <RoleBadge role={dim.role} />
              <IchomBadge rel={dim.ichomRel} />
            </div>
          </div>
          <MeasLevelChain levels={dim.measLevel} />
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: ".5px solid var(--border-default)",
            marginBottom: 24,
            overflowX: "auto",
          }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "12px 18px",
                font: "500 13px/1 var(--font-sans)",
                color:
                  tab === t.id ? "var(--fg-primary)" : "var(--fg-secondary)",
                cursor: "pointer",
                border: "none",
                background: "transparent",
                borderBottom:
                  tab === t.id
                    ? `2px solid ${dim.color}`
                    : "2px solid transparent",
                marginBottom: "-1px",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                transition: "color .15s ease",
              }}
            >
              {t.label}
              {t.count != null && (
                <span
                  style={{
                    font: "500 10px/1 var(--font-mono)",
                    padding: "2px 6px",
                    borderRadius: 9999,
                    background: tab === t.id ? dim.color : "var(--bg-elevated)",
                    color: tab === t.id ? "white" : "var(--fg-tertiary)",
                  }}
                >
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "scope" && (
          <ScopeTab dim={dim} allDims={allDims} onDimSwitch={onDimSwitch} />
        )}
        {tab === "payment" && (
          <PaymentTab dim={dim} allDims={allDims} onDimSwitch={onDimSwitch} />
        )}
        {tab === "measures" && (
          <MeasureCatalogueTab dim={dim} onMeasureSelect={onMeasureSelect} />
        )}
        {tab === "align" && (
          <AlignmentTab dim={dim} onNavigateToIchom={onNavigateToIchom} />
        )}
        {tab === "deps" && (
          <DependenciesTab
            dim={dim}
            allDims={allDims}
            onDimSwitch={onDimSwitch}
          />
        )}
      </div>

      {/* Navigation rail */}
      <div style={{ position: "sticky", top: 88 }}>
        <div
          style={{
            font: "500 10px/1 var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: 10,
            paddingLeft: 4,
          }}
        >
          All Dimensions
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {allDims.map((d) => {
            const isActive = d.id === dim.id;
            return (
              <button
                key={d.id}
                onClick={() => onDimSwitch(d)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 8,
                  padding: "8px 10px",
                  borderRadius: 10,
                  background: isActive ? `${d.color}12` : "transparent",
                  border: isActive
                    ? `.5px solid ${d.color}40`
                    : ".5px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all .15s ease",
                  borderLeft: isActive
                    ? `3px solid ${d.color}`
                    : "3px solid transparent",
                }}
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
                  {d.id}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      font: `${isActive ? "600" : "500"} 11px/15px var(--font-sans)`,
                      color: isActive
                        ? "var(--fg-primary)"
                        : "var(--fg-secondary)",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {d.name}
                  </div>
                  <div style={{ marginTop: 3 }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "1px 5px",
                        borderRadius: 9999,
                        background: `${VF_ROLE_COLORS[d.role]}15`,
                        color: VF_ROLE_COLORS[d.role],
                        fontSize: "8px",
                        fontFamily: "var(--font-mono)",
                        fontWeight: 600,
                        letterSpacing: ".05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {d.role}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export { MethBadge, DirBadge };
export default VFLevel2;
