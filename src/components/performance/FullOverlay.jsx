// Session 8B — s8b-dag.jsx — Shared node-diagram SVG component

import React from "react";
import { Icons } from "../Icons/Icons";
const { useState: useDagState } = React;

/* ── Shared full-screen overlay wrapper ─────────────────────────────────── */
function FullOverlay({ open, onClose, crumb, title, children, headerRight }) {
  React.useEffect(() => {
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
      {/* Top bar */}
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
        <div style={{ display: "flex", alignItems: "center", gap: 6, flex: 1 }}>
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
                  cursor: i < crumb.length - 1 ? "pointer" : "default",
                }}
                onClick={i < crumb.length - 1 ? onClose : undefined}
              >
                {c}
              </span>
            </React.Fragment>
          ))}
        </div>
        {headerRight}
      </div>
      {/* Content */}
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

/* ── Node Diagram (DAG) SVG ─────────────────────────────────────────────── */
function NodeDiagram({ nodes, onNodeClick, activeNodeId }) {
  const NODE_W = 178;
  const NODE_H = 88;
  const H_GAP = 56;
  const PAD_V = 28;
  const svgW = nodes.length * NODE_W + (nodes.length - 1) * H_GAP + 24;
  const svgH = NODE_H + PAD_V * 2;

  const statusStyles = {
    success: {
      bg: "oklch(52% .11 200 / .12)",
      border: "oklch(52% .11 200)",
      text: "oklch(52% .11 200)",
    },
    assumption: {
      bg: "oklch(62% .12 82 / .14)",
      border: "oklch(62% .12 82)",
      text: "oklch(62% .12 82)",
    },
    error: {
      bg: "oklch(50% .18 25 / .12)",
      border: "oklch(50% .18 25)",
      text: "oklch(50% .18 25)",
    },
  };

  function nodeX(i) {
    return 12 + i * (NODE_W + H_GAP);
  }
  const nodeY = PAD_V;

  return (
    <div style={{ overflowX: "auto", overflowY: "visible", padding: "8px 0" }}>
      <svg
        width={svgW}
        height={svgH + 8}
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          <marker
            id="dag-arrow"
            viewBox="0 0 10 8"
            refX="9"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
          >
            <path
              d="M0,0 L10,4 L0,8 Z"
              fill="var(--fg-tertiary)"
              opacity="0.55"
            />
          </marker>
        </defs>

        {/* Curved connection paths */}
        {nodes.slice(0, -1).map((n, i) => {
          const x1 = nodeX(i) + NODE_W;
          const x2 = nodeX(i + 1);
          const y = nodeY + NODE_H / 2;
          const mx = (x1 + x2) / 2;
          return (
            <path
              key={n.id}
              d={`M ${x1} ${y} C ${mx} ${y} ${mx} ${y} ${x2} ${y}`}
              fill="none"
              stroke="var(--fg-tertiary)"
              strokeWidth="1.5"
              strokeOpacity="0.4"
              markerEnd="url(#dag-arrow)"
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((n, i) => {
          const st = statusStyles[n.status] || statusStyles.success;
          const x = nodeX(i);
          const isActive = activeNodeId === n.id;
          return (
            <g
              key={n.id}
              style={{ cursor: "pointer" }}
              onClick={() => onNodeClick && onNodeClick(n)}
            >
              {/* Active glow */}
              {isActive && (
                <rect
                  x={x - 3}
                  y={nodeY - 3}
                  width={NODE_W + 6}
                  height={NODE_H + 6}
                  rx="13"
                  fill="none"
                  stroke={st.border}
                  strokeWidth="2"
                  opacity="0.5"
                />
              )}
              {/* Node body */}
              <rect
                x={x}
                y={nodeY}
                width={NODE_W}
                height={NODE_H}
                rx="10"
                fill={st.bg}
                stroke={isActive ? st.border : st.border}
                strokeWidth={isActive ? "1.5" : "0.8"}
              />
              {/* Node number */}
              <text
                x={x + 10}
                y={nodeY + 14}
                fill={st.text}
                style={{
                  font: "600 9px var(--font-mono)",
                  letterSpacing: ".04em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </text>
              {/* Status dot */}
              <circle
                cx={x + NODE_W - 10}
                cy={nodeY + 10}
                r="4"
                fill={st.border}
                opacity="0.8"
              />
              {/* Title */}
              <text
                x={x + 10}
                y={nodeY + 30}
                fill="var(--fg-primary)"
                style={{ font: "600 11px var(--font-sans)" }}
              >
                {n.title.length > 20 ? n.title.slice(0, 19) + "…" : n.title}
              </text>
              {/* Value (wrapped into 2 lines) */}
              {n.value
                .split(" · ")
                .slice(0, 2)
                .map((line, li) => (
                  <text
                    key={li}
                    x={x + 10}
                    y={nodeY + 48 + li * 15}
                    fill={st.text}
                    style={{
                      font: "500 9px var(--font-mono)",
                      letterSpacing: ".02em",
                    }}
                  >
                    {line.length > 22 ? line.slice(0, 21) + "…" : line}
                  </text>
                ))}
              {/* Click hint */}
              <text
                x={x + NODE_W / 2}
                y={nodeY + NODE_H - 8}
                textAnchor="middle"
                fill="var(--fg-tertiary)"
                style={{
                  font: "500 8px var(--font-mono)",
                  letterSpacing: ".04em",
                }}
              >
                CLICK TO INSPECT
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ── Node Inspector (inline expanding panel below DAG) ──────────────────── */
function NodeInspector({ node, onClose }) {
  const [tab, setTab] = useDagState("inputs");
  if (!node) return null;

  const tabs = [
    { id: "inputs", label: "Inputs" },
    { id: "logic", label: "Logic Applied" },
    { id: "output", label: "Output" },
    { id: "assume", label: "Assumptions" },
    { id: "alts", label: "Alternative Scenarios" },
  ];

  const statusColors = {
    success: "var(--accent)",
    assumption: "var(--gold)",
    error: "var(--perf-floor)",
  };
  const borderColor = statusColors[node.status] || "var(--accent)";
  const detail = node.detail || {};

  return (
    <div
      style={{
        marginTop: 14,
        borderRadius: 14,
        overflow: "hidden",
        border: `.5px solid ${borderColor}`,
        background: "var(--bg-surface)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Inspector header */}
      <div
        style={{
          padding: "12px 20px",
          background: "var(--bg-elevated)",
          borderBottom: ".5px solid var(--border-default)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <span
            style={{
              font: "500 9px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".07em",
              textTransform: "uppercase",
            }}
          >
            Node Inspector
          </span>
          <div
            style={{
              font: "600 14px var(--font-sans)",
              color: "var(--fg-primary)",
              marginTop: 2,
            }}
          >
            {node.title}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: ".5px solid var(--border-default)",
            background: "var(--bg-surface)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: "var(--fg-secondary)",
          }}
        >
          {Icons.close}
        </button>
      </div>
      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: ".5px solid var(--border-default)",
          background: "var(--bg-elevated)",
          overflowX: "auto",
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            style={{
              padding: "10px 16px",
              border: 0,
              background: "transparent",
              cursor: "pointer",
              font: "500 11px var(--font-sans)",
              color: tab === t.id ? "var(--fg-primary)" : "var(--fg-tertiary)",
              borderBottom:
                tab === t.id
                  ? `2px solid ${borderColor}`
                  : "2px solid transparent",
              marginBottom: -0.5,
              whiteSpace: "nowrap",
            }}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {/* Tab content */}
      <div style={{ padding: "18px 20px 22px" }}>
        {tab === "inputs" && (
          <div>
            {(detail.inputs || []).length === 0 ? (
              <p
                style={{
                  color: "var(--fg-tertiary)",
                  font: "400 12px var(--font-sans)",
                  margin: 0,
                }}
              >
                This is the root node — no upstream inputs.
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-elevated)" }}>
                    {["Input", "Source Node", "Count / Value"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "8px 12px",
                          font: "500 9px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                          letterSpacing: ".07em",
                          textTransform: "uppercase",
                          textAlign: "left",
                          borderBottom: ".5px solid var(--border-default)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detail.inputs.map((inp, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom: ".5px solid var(--border-default)",
                      }}
                    >
                      <td
                        style={{
                          padding: "9px 12px",
                          font: "500 12px var(--font-sans)",
                          color: "var(--fg-primary)",
                        }}
                      >
                        {inp.name}
                      </td>
                      <td
                        style={{
                          padding: "9px 12px",
                          font: "400 11px var(--font-mono)",
                          color: "var(--fg-secondary)",
                        }}
                      >
                        {inp.src}
                      </td>
                      <td
                        style={{
                          padding: "9px 12px",
                          font: "600 11px var(--font-mono)",
                          color: "var(--fg-primary)",
                        }}
                      >
                        {inp.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {tab === "logic" && (
          <div>
            <p
              style={{
                font: "400 13px/20px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: "0 0 12px",
              }}
            >
              {detail.logic}
            </p>
            {detail.pseudocode && (
              <pre
                style={{
                  font: "500 11px/18px var(--font-mono)",
                  color: "var(--fg-secondary)",
                  background: "var(--bg-elevated)",
                  padding: "12px 14px",
                  borderRadius: 8,
                  overflow: "auto",
                  border: ".5px solid var(--border-default)",
                }}
              >
                {detail.pseudocode}
              </pre>
            )}
          </div>
        )}
        {tab === "output" && (
          <div>
            <div
              style={{
                background: "var(--accent-soft)",
                border: `.5px solid ${borderColor}`,
                borderRadius: 10,
                padding: "14px 16px",
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  font: "500 9px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                }}
              >
                Node Output
              </span>
              <div
                style={{
                  font: "600 16px/24px var(--font-sans)",
                  color: "var(--fg-primary)",
                  marginTop: 4,
                }}
              >
                {node.value}
              </div>
            </div>
            <p
              style={{
                font: "400 12px/18px var(--font-sans)",
                color: "var(--fg-secondary)",
                margin: 0,
              }}
            >
              {detail.output}
            </p>
          </div>
        )}
        {tab === "assume" && (
          <div>
            {(detail.assumptions || []).length === 0 ? (
              <p
                style={{
                  color: "var(--perf-target)",
                  font: "400 12px var(--font-sans)",
                  margin: 0,
                }}
              >
                No assumptions applied at this node. All computations used
                direct data.
              </p>
            ) : (
              (detail.assumptions || []).map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "10px 14px",
                    borderRadius: 8,
                    background:
                      a.sev === "warn"
                        ? "var(--perf-below-soft)"
                        : "var(--accent-soft)",
                    border: `.5px solid ${a.sev === "warn" ? "var(--perf-below)" : "var(--accent)"}`,
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      color:
                        a.sev === "warn"
                          ? "var(--perf-below)"
                          : "var(--accent)",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {a.sev === "warn" ? Icons.warning : Icons.info}
                  </span>
                  <p
                    style={{
                      font: "400 12px/18px var(--font-sans)",
                      color: "var(--fg-primary)",
                      margin: 0,
                    }}
                  >
                    {a.text}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
        {tab === "alts" && (
          <div>
            {(detail.alternatives || []).length === 0 ? (
              <p
                style={{
                  color: "var(--fg-tertiary)",
                  font: "400 12px var(--font-sans)",
                  margin: 0,
                }}
              >
                No alternative scenarios defined for this node.
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg-elevated)" }}>
                    {[
                      "Scenario",
                      "Raw Score",
                      "Adj Score",
                      "Tier",
                      "Δ from Official",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "8px 12px",
                          font: "500 9px var(--font-mono)",
                          color: "var(--fg-tertiary)",
                          letterSpacing: ".07em",
                          textTransform: "uppercase",
                          textAlign: "left",
                          borderBottom: ".5px solid var(--border-default)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      scenario: "Official methodology",
                      raw: "74.1%",
                      adj: "78.1%",
                      tier: "At Target",
                      delta: "—",
                    },
                    ...(detail.alternatives || []).map((a) => ({
                      scenario: a.scenario,
                      raw: a.raw,
                      adj: a.adj,
                      tier: a.tier,
                      delta: (parseFloat(a.adj) - 78.1).toFixed(1) + "pp",
                    })),
                  ].map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        background:
                          i === 0 ? "var(--accent-soft)" : "transparent",
                        borderBottom: ".5px solid var(--border-default)",
                      }}
                    >
                      <td
                        style={{
                          padding: "9px 12px",
                          font:
                            i === 0
                              ? "600 12px var(--font-sans)"
                              : "400 12px var(--font-sans)",
                          color: "var(--fg-primary)",
                        }}
                      >
                        {row.scenario}
                      </td>
                      <td
                        style={{
                          padding: "9px 12px",
                          font: "500 11px var(--font-mono)",
                          color: "var(--fg-secondary)",
                        }}
                      >
                        {row.raw}
                      </td>
                      <td
                        style={{
                          padding: "9px 12px",
                          font: "600 11px var(--font-mono)",
                          color: "var(--fg-primary)",
                        }}
                      >
                        {row.adj}
                      </td>
                      <td
                        style={{
                          padding: "9px 12px",
                          font: "500 11px var(--font-mono)",
                          color:
                            row.tier === "At Target"
                              ? "var(--perf-target)"
                              : "var(--perf-below)",
                        }}
                      >
                        {row.tier}
                      </td>
                      <td
                        style={{
                          padding: "9px 12px",
                          font: "500 11px var(--font-mono)",
                          color:
                            i === 0
                              ? "var(--fg-tertiary)"
                              : parseFloat(row.delta) >= 0
                                ? "var(--perf-target)"
                                : "var(--perf-floor)",
                        }}
                      >
                        {row.delta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export { FullOverlay, NodeDiagram, NodeInspector };
