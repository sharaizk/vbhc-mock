import {
  S8B_LINEAGE,
  S8B_APPROVAL_STATES,
  
} from "@/mock/s8b-data";
import React from "react";
import { FullOverlay, NodeDiagram, NodeInspector } from "./FullOverlay";
const {
  useState: useL3bcState,
  useMemo: useL3bcMemo,
  useEffect: useL3bcEffect,
} = React;

/* ════════════════════════════════════════════════════════════════════════════
   L3-B  Data Lineage & Source Verification
   ══════════════════════════════════════════════════════════════════════════ */
function L3BLineage({ open, onClose, measure }) {
  const [activeChainNode, setActiveChainNode] = useL3bcState(null);
  const lin = S8B_LINEAGE;

  if (!open) return null;

  const statusIcon = (s) =>
    ({
      pass: (
        <span style={{ color: "var(--perf-target)", fontSize: 14 }}>✓</span>
      ),
      warn: <span style={{ color: "var(--perf-below)", fontSize: 14 }}>⚠</span>,
      fail: <span style={{ color: "var(--perf-floor)", fontSize: 14 }}>✕</span>,
    })[s] || null;

  const qCell = (val) => {
    const color =
      val === "STALE" || (typeof val === "number" && val < 80)
        ? "var(--perf-floor-soft)"
        : typeof val === "number" && val < 95
          ? "var(--perf-below-soft)"
          : "var(--perf-target-soft)";
    const textColor =
      val === "STALE" || (typeof val === "number" && val < 80)
        ? "var(--perf-floor)"
        : typeof val === "number" && val < 95
          ? "var(--perf-below)"
          : "var(--perf-target)";
    return { bg: color, fg: textColor };
  };

  return (
    <FullOverlay
      open={open}
      onClose={onClose}
      crumb={["Dashboard", "Measure Detail", "Data Lineage"]}
      headerRight={
        <span
          style={{
            font: "500 10px var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".06em",
            background: "var(--bg-elevated)",
            padding: "4px 10px",
            borderRadius: 9999,
            border: ".5px solid var(--border-default)",
          }}
        >
          L3-B · {measure ? measure.id : "D1-001"} · Q4 2025
        </span>
      }
    >
      <div style={{ flex: 1, overflow: "auto", padding: "28px 40px 48px" }}>
        {/* Section 1 — Data Element Inventory */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 1 — Data Element Inventory
          </div>
          <table className="l2-table">
            <thead>
              <tr>
                <th>Data Element</th>
                <th>Source System</th>
                <th>Extracted</th>
                <th style={{ textAlign: "center" }}>Validation</th>
                <th>Last Refresh</th>
                <th style={{ textAlign: "right" }}>Records</th>
              </tr>
            </thead>
            <tbody>
              {lin.elements.map((el) => (
                <tr key={el.name}>
                  <td style={{ font: "500 12px var(--font-sans)" }}>
                    {el.name}
                  </td>
                  <td>
                    <span className="mono">{el.source}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        font: "400 10px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                      }}
                    >
                      {el.ts}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {statusIcon(el.status)}
                  </td>
                  <td>
                    <span
                      style={{
                        font: "500 11px var(--font-mono)",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      {el.refresh}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <span
                      style={{
                        font: "600 11px var(--font-mono)",
                        color: "var(--fg-primary)",
                      }}
                    >
                      {el.records.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: "flex", gap: 14, marginTop: 10 }}>
            {[
              ["pass", "var(--perf-target)", "7 Passed"],
              ["warn", "var(--perf-below)", "2 Warning"],
              ["fail", "var(--perf-floor)", "1 Failed"],
            ].map(([s, c, l]) => (
              <div
                key={s}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                {statusIcon(s)}
                <span style={{ font: "500 11px var(--font-sans)", color: c }}>
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2 — Data Quality Heatmap */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 2 — Data Quality Scores (Kahn Framework)
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "8px 12px",
                      font: "500 9px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: ".07em",
                      textAlign: "left",
                      width: 160,
                      borderBottom: ".5px solid var(--border-default)",
                    }}
                  >
                    Data Element
                  </th>
                  {[
                    "Completeness",
                    "Conformance",
                    "Plausibility",
                    "Timeliness",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 12px",
                        font: "500 9px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                        textTransform: "uppercase",
                        letterSpacing: ".07em",
                        textAlign: "center",
                        minWidth: 100,
                        borderBottom: ".5px solid var(--border-default)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lin.elements.map((el) => {
                  const q = lin.quality[el.name] || {};
                  const dims = [
                    q.completeness,
                    q.conformance,
                    q.plausibility,
                    q.timeliness,
                  ];
                  return (
                    <tr key={el.name}>
                      <td
                        style={{
                          padding: "7px 12px",
                          font: "400 11px var(--font-sans)",
                          color: "var(--fg-secondary)",
                          borderBottom: ".5px solid var(--border-default)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {el.name}
                      </td>
                      {dims.map((val, di) => {
                        const isTimeliness = di === 3;
                        const stale =
                          isTimeliness &&
                          typeof val === "string" &&
                          val.includes("STALE");
                        const numVal = isTimeliness ? null : val;
                        const { bg, fg } = qCell(stale ? "STALE" : numVal);
                        return (
                          <td
                            key={di}
                            style={{
                              padding: "7px 12px",
                              textAlign: "center",
                              background: bg,
                              borderBottom: ".5px solid var(--border-default)",
                              borderLeft: ".5px solid var(--border-default)",
                            }}
                          >
                            <span
                              style={{
                                font: "600 11px var(--font-mono)",
                                color: fg,
                              }}
                            >
                              {isTimeliness
                                ? stale
                                  ? "STALE"
                                  : "✓ Current"
                                : `${val}%`}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
            {[
              [
                "var(--perf-target-soft)",
                "var(--perf-target)",
                ">95% / Current",
              ],
              ["var(--perf-below-soft)", "var(--perf-below)", "80–95%"],
              ["var(--perf-floor-soft)", "var(--perf-floor)", "<80% / STALE"],
            ].map(([bg, fg, l]) => (
              <div
                key={l}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    background: bg,
                    border: `.5px solid ${fg}`,
                    borderRadius: 3,
                  }}
                />
                <span
                  style={{
                    font: "500 10px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                  }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3 — Source-to-Score Chain */}
        <div className="l2-section">
          <div className="l2-section-title">
            Section 3 — Source-to-Score Chain
          </div>
          <div className="l2-card" style={{ padding: "18px 16px" }}>
            <NodeDiagram
              nodes={S8B_LINEAGE.chain}
              onNodeClick={(n) =>
                setActiveChainNode(activeChainNode?.id === n.id ? null : n)
              }
              activeNodeId={activeChainNode?.id}
            />
          </div>
          {activeChainNode && (
            <NodeInspector
              node={activeChainNode}
              onClose={() => setActiveChainNode(null)}
            />
          )}
        </div>
      </div>
    </FullOverlay>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L3-C  Score Approval & Lock Workflow
   ══════════════════════════════════════════════════════════════════════════ */
function L3CApproval({ open, onClose, provider, contract, periodIdx, role }) {
  const [tab, setTab] = useL3bcState("checklist");
  const [approvalStates, setApprovalStates] = useL3bcState(() => ({
    ...S8B_APPROVAL_STATES,
  }));
  const [overrideMeasure, setOverrideMeasure] = useL3bcState(null);
  const [overrideForm, setOverrideForm] = useL3bcState({
    score: "",
    reason: "",
    justification: "",
  });
  const [confirmOpen, setConfirmOpen] = useL3bcState(null);
  const [selected, setSelected] = useL3bcState(new Set());

  if (!open) return null;
  const canApprove = role === "manager" || role === "analyst";

  const measures = VBHC_MEASURES_C1;
  const getMeasureRow = VBHC_getMeasureRow;

  const rows = useL3bcMemo(
    () =>
      measures.map((m) => {
        const d = getMeasureRow(provider, contract, periodIdx, m);
        const status = VBHC_getStatus(d.adj, m);
        const as = approvalStates[m.id] || {
          valStatus: "auto",
          approvalStatus: "pending",
        };
        return {
          ...m,
          adj: d.adj,
          status,
          valStatus: as.valStatus,
          approvalStatus: as.approvalStatus,
        };
      }),
    [measures, approvalStates, provider.id, contract.id, periodIdx],
  );

  const counts = useL3bcMemo(
    () => ({
      auto: rows.filter((r) => r.valStatus === "auto").length,
      review: rows.filter((r) => r.valStatus === "review").length,
      override: rows.filter((r) => r.valStatus === "override").length,
      locked: rows.filter((r) => r.approvalStatus === "locked").length,
    }),
    [rows],
  );

  const valIcon = (vs) =>
    ({
      auto: (
        <span
          title="Auto-Validated"
          style={{ color: "var(--perf-target)", fontSize: 14 }}
        >
          🛡
        </span>
      ),
      review: (
        <span
          title="Requires Review"
          style={{ color: "var(--perf-below)", fontSize: 14 }}
        >
          ⚠
        </span>
      ),
      override: (
        <span
          title="Manually Overridden"
          style={{ color: "var(--accent)", fontSize: 14 }}
        >
          ✏
        </span>
      ),
      locked: (
        <span
          title="Locked"
          style={{ color: "var(--fg-tertiary)", fontSize: 14 }}
        >
          🔒
        </span>
      ),
    })[vs] || null;

  function approve(measureId) {
    if (!canApprove) return;
    setConfirmOpen({ measureId, action: "approve" });
  }
  function doApprove(measureId) {
    setApprovalStates((prev) => ({
      ...prev,
      [measureId]: { ...prev[measureId], approvalStatus: "locked" },
    }));
    setConfirmOpen(null);
  }
  function bulkApproveAuto() {
    if (!canApprove) return;
    setConfirmOpen({ action: "bulk" });
  }
  function doBulkApprove() {
    const updates = {};
    rows
      .filter((r) => r.valStatus === "auto" && r.approvalStatus !== "locked")
      .forEach((r) => {
        updates[r.id] = { valStatus: "auto", approvalStatus: "locked" };
      });
    setApprovalStates((prev) => ({ ...prev, ...updates }));
    setConfirmOpen(null);
  }
  function openOverride(measure) {
    setOverrideMeasure(measure);
    setOverrideForm({ score: measure.adj, reason: "", justification: "" });
    setTab("override");
  }

  const overrideReasons = [
    "Data quality issue — source data incomplete",
    "Data quality issue — source data incorrect",
    "Coding error identified and confirmed",
    "Attribution dispute resolved — patient removed",
    "Exclusion criteria applied retroactively",
    "Risk adjustment model error identified",
    "External audit finding — score adjustment required",
    "Other — see justification",
  ];

  function computeImpact(newScore) {
    if (!overrideMeasure || isNaN(newScore)) return null;
    const oldAdj = overrideMeasure.adj;
    const delta = newScore - oldAdj;
    const newDimScore = Math.round(
      (overrideMeasure._dimScore || 95) + delta * 0.5,
    );
    const newComposite = Math.round(
      92 + ((delta * (contract.dims[overrideMeasure.dim] || 0)) / 100) * 0.5,
    );
    const tier =
      newComposite >= 90
        ? "Exceeds Stretch"
        : newComposite >= 75
          ? "At Target"
          : newComposite >= 60
            ? "Below Target"
            : "Below Floor";
    const payDelta = Math.round(delta * 20000);
    return { delta, newDimScore, newComposite, tier, payDelta };
  }

  const impact = computeImpact(parseFloat(overrideForm.score));

  const sc = {
    exceeds: "var(--perf-exceeds)",
    target: "var(--perf-target)",
    below: "var(--perf-below)",
    floor: "var(--perf-floor)",
  };

  return (
    <FullOverlay
      open={open}
      onClose={onClose}
      crumb={["Dashboard", "Score Approval", VBHC_PERIODS[periodIdx]]}
      headerRight={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              font: "500 10px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".05em",
              textTransform: "uppercase",
            }}
          >
            Role:{" "}
          </span>
          <span
            style={{
              font: "600 11px var(--font-sans)",
              color: role === "manager" ? "var(--accent)" : "var(--fg-primary)",
              background: "var(--accent-soft)",
              padding: "3px 10px",
              borderRadius: 9999,
              border: ".5px solid var(--accent)",
            }}
          >
            {role === "manager"
              ? "Contract Manager"
              : role === "analyst"
                ? "Analyst"
                : "Provider Liaison"}
          </span>
        </div>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: ".5px solid var(--border-default)",
            background: "var(--bg-surface)",
            padding: "0 28px",
            flexShrink: 0,
          }}
        >
          {[
            ["checklist", "Score Checklist"],
            ["override", "Override Panel"],
            ["auditlog", "Audit Log"],
          ].map(([id, label]) => (
            <button
              key={id}
              className={"l2-tab" + (tab === id ? " active" : "")}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: "24px 40px 48px" }}>
          {/* ── Tab 1: Score Checklist ── */}
          {tab === "checklist" && (
            <div>
              {/* Summary bar */}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 16,
                  flexWrap: "wrap",
                }}
              >
                {[
                  {
                    n: counts.auto,
                    label: "auto-validated",
                    color: "var(--perf-target)",
                  },
                  {
                    n: counts.review,
                    label: "require review",
                    color: "var(--perf-below)",
                  },
                  {
                    n: rows.filter((r) => r.valStatus === "override").length,
                    label: "manually overridden",
                    color: "var(--accent)",
                  },
                  {
                    n: counts.locked,
                    label: "locked",
                    color: "var(--fg-tertiary)",
                  },
                ].map((x) => (
                  <span
                    key={x.label}
                    style={{
                      font: "500 12px var(--font-sans)",
                      color: x.color,
                      background: "var(--bg-elevated)",
                      padding: "5px 12px",
                      borderRadius: 9999,
                      border: `.5px solid ${x.color}`,
                    }}
                  >
                    <strong>{x.n}</strong> of {measures.length} {x.label}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              {canApprove && (
                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  <button className="btn primary" onClick={bulkApproveAuto}>
                    Approve All Auto-Validated (
                    {counts.auto -
                      rows.filter(
                        (r) =>
                          r.valStatus === "auto" &&
                          r.approvalStatus === "locked",
                      ).length}{" "}
                    pending)
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => {
                      if (selected.size > 0)
                        setConfirmOpen({
                          action: "selected",
                          ids: [...selected],
                        });
                    }}
                  >
                    Approve Selected ({selected.size})
                  </button>
                </div>
              )}

              {/* Table */}
              <table className="l2-table">
                <thead>
                  <tr>
                    <th style={{ width: 32 }}>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          setSelected(
                            e.target.checked
                              ? new Set(measures.map((m) => m.id))
                              : new Set(),
                          )
                        }
                      />
                    </th>
                    <th style={{ width: 70 }}>ID</th>
                    <th>Measure</th>
                    <th style={{ width: 80 }}>Score</th>
                    <th style={{ width: 48, textAlign: "center" }}>Val</th>
                    <th style={{ width: 90 }}>Status</th>
                    {canApprove && <th style={{ width: 130 }}>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      style={{
                        opacity: row.approvalStatus === "locked" ? 0.65 : 1,
                      }}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.has(row.id)}
                          onChange={(e) =>
                            setSelected((prev) => {
                              const s = new Set(prev);
                              e.target.checked
                                ? s.add(row.id)
                                : s.delete(row.id);
                              return s;
                            })
                          }
                        />
                      </td>
                      <td>
                        <span className="m-id">{row.id}</span>
                      </td>
                      <td
                        style={{
                          font: "400 12px var(--font-sans)",
                          color: "var(--fg-primary)",
                        }}
                      >
                        {row.shortName}
                      </td>
                      <td>
                        <span
                          style={{
                            font: "600 12px var(--font-mono)",
                            color: sc[row.status.key],
                          }}
                        >
                          {VBHC_fmtScore(row.adj, row.unit)}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {valIcon(
                          row.approvalStatus === "locked"
                            ? "locked"
                            : row.valStatus,
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            font: "500 10px var(--font-mono)",
                            color:
                              row.approvalStatus === "locked"
                                ? "var(--fg-tertiary)"
                                : "var(--perf-below)",
                            padding: "2px 7px",
                            borderRadius: 4,
                            background:
                              row.approvalStatus === "locked"
                                ? "var(--bg-elevated)"
                                : "var(--perf-below-soft)",
                            border: ".5px solid currentColor",
                          }}
                        >
                          {row.approvalStatus === "locked"
                            ? "Locked"
                            : "Pending"}
                        </span>
                      </td>
                      {canApprove && (
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            {row.approvalStatus !== "locked" && (
                              <button
                                className="btn secondary"
                                style={{ padding: "3px 10px", fontSize: 10 }}
                                onClick={() => approve(row.id)}
                              >
                                Approve
                              </button>
                            )}
                            {row.approvalStatus !== "locked" && (
                              <button
                                className="btn ghost"
                                style={{
                                  padding: "3px 10px",
                                  fontSize: 10,
                                  color: "var(--accent)",
                                }}
                                onClick={() => openOverride(row)}
                              >
                                Override
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Tab 2: Override Panel ── */}
          {tab === "override" && (
            <div style={{ maxWidth: 640 }}>
              {!overrideMeasure ? (
                <p
                  style={{
                    color: "var(--fg-tertiary)",
                    font: "400 13px var(--font-sans)",
                  }}
                >
                  No measure selected. Click "Override" on any measure in the
                  Score Checklist to open this panel.
                </p>
              ) : (
                <div>
                  <div className="metric-row" style={{ marginBottom: 20 }}>
                    <div className="metric-box">
                      <div className="m-label">Measure</div>
                      <div className="m-val" style={{ fontSize: 14 }}>
                        {overrideMeasure.id}
                      </div>
                      <div className="m-sub">{overrideMeasure.shortName}</div>
                    </div>
                    <div className="metric-box">
                      <div className="m-label">Current (System) Score</div>
                      <div
                        className="m-val"
                        style={{ color: "var(--fg-secondary)" }}
                      >
                        {VBHC_fmtScore(
                          overrideMeasure.adj,
                          overrideMeasure.unit,
                        )}
                      </div>
                      <div className="m-sub">Read-only</div>
                    </div>
                    <div
                      className="metric-box"
                      style={{
                        borderColor: "var(--accent)",
                        background: "var(--accent-soft)",
                      }}
                    >
                      <div className="m-label">Overridden Score</div>
                      <input
                        type="number"
                        value={overrideForm.score}
                        onChange={(e) =>
                          setOverrideForm((f) => ({
                            ...f,
                            score: e.target.value,
                          }))
                        }
                        style={{
                          font: "600 20px var(--font-sans)",
                          color: "var(--accent)",
                          border: 0,
                          background: "transparent",
                          outline: "none",
                          width: "100%",
                          padding: "2px 0",
                        }}
                      />
                      <div className="m-sub">{overrideMeasure.unit}</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        font: "500 10px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                        letterSpacing: ".07em",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Reason Code *
                    </label>
                    <select
                      value={overrideForm.reason}
                      onChange={(e) =>
                        setOverrideForm((f) => ({
                          ...f,
                          reason: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 8,
                        border: ".5px solid var(--border-default)",
                        background: "var(--bg-elevated)",
                        font: "400 13px var(--font-sans)",
                        color: "var(--fg-primary)",
                      }}
                    >
                      <option value="">— Select reason code —</option>
                      {overrideReasons.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label
                      style={{
                        font: "500 10px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                        letterSpacing: ".07em",
                        textTransform: "uppercase",
                        display: "block",
                        marginBottom: 6,
                      }}
                    >
                      Justification * (min. 50 characters)
                    </label>
                    <textarea
                      value={overrideForm.justification}
                      rows={4}
                      onChange={(e) =>
                        setOverrideForm((f) => ({
                          ...f,
                          justification: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "9px 12px",
                        borderRadius: 8,
                        border: ".5px solid var(--border-default)",
                        background: "var(--bg-elevated)",
                        font: "400 13px var(--font-sans)",
                        color: "var(--fg-primary)",
                        resize: "vertical",
                      }}
                      placeholder="Provide detailed justification for the score override. Minimum 50 characters required."
                    />
                    <div
                      style={{
                        font: "400 10px var(--font-mono)",
                        color:
                          overrideForm.justification.length < 50
                            ? "var(--perf-floor)"
                            : "var(--perf-target)",
                        marginTop: 4,
                      }}
                    >
                      {overrideForm.justification.length} / 50 characters
                      minimum
                    </div>
                  </div>

                  {impact && (
                    <div
                      className="l2-card"
                      style={{ marginBottom: 16, borderColor: "var(--accent)" }}
                    >
                      <div className="l2-section-title">Impact Preview</div>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr 1fr 1fr",
                          gap: 12,
                        }}
                      >
                        {[
                          {
                            label: "Score Δ",
                            val: `${impact.delta >= 0 ? "+" : ""}${impact.delta.toFixed(1)} ${overrideMeasure.unit}`,
                            color:
                              impact.delta >= 0
                                ? "var(--perf-target)"
                                : "var(--perf-floor)",
                          },
                          {
                            label: "New Composite",
                            val: impact.newComposite,
                            color: "var(--fg-primary)",
                          },
                          {
                            label: "Perf. Tier",
                            val: impact.tier,
                            color: "var(--accent)",
                          },
                          {
                            label: "Payment Impact",
                            val: `${impact.payDelta >= 0 ? "+" : ""}SAR ${Math.abs(impact.payDelta).toLocaleString()}`,
                            color:
                              impact.payDelta >= 0
                                ? "var(--perf-target)"
                                : "var(--perf-floor)",
                          },
                        ].map((x) => (
                          <div key={x.label}>
                            <div
                              style={{
                                font: "500 9px var(--font-mono)",
                                color: "var(--fg-tertiary)",
                                letterSpacing: ".06em",
                                textTransform: "uppercase",
                                marginBottom: 4,
                              }}
                            >
                              {x.label}
                            </div>
                            <div
                              style={{
                                font: "600 15px var(--font-sans)",
                                color: x.color,
                              }}
                            >
                              {x.val}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      className="btn primary"
                      disabled={
                        !overrideForm.reason ||
                        overrideForm.justification.length < 50
                      }
                      onClick={() => {
                        setApprovalStates((prev) => ({
                          ...prev,
                          [overrideMeasure.id]: {
                            valStatus: "override",
                            approvalStatus: "pending",
                          },
                        }));
                        setTab("checklist");
                        window__toast &&
                          window.__toast(
                            "Override submitted — pending Contract Manager approval.",
                          );
                      }}
                    >
                      Submit Override
                    </button>
                    <button
                      className="btn secondary"
                      onClick={() => {
                        setOverrideMeasure(null);
                        setTab("checklist");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Tab 3: Audit Log ── */}
          {tab === "auditlog" && (
            <div>
              <table className="l2-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Role</th>
                    <th>Action</th>
                    <th>Measure</th>
                    <th>Prev Value</th>
                    <th>New Value</th>
                    <th>Justification</th>
                  </tr>
                </thead>
                <tbody>
                  {S8B_AUDIT_LOG.map((e, i) => (
                    <tr key={i}>
                      <td>
                        <span
                          style={{
                            font: "400 10px var(--font-mono)",
                            color: "var(--fg-tertiary)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {e.ts}
                        </span>
                      </td>
                      <td
                        style={{
                          font: "500 11px var(--font-sans)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {e.user}
                      </td>
                      <td>
                        <span className="tag">{e.role}</span>
                      </td>
                      <td>
                        <span
                          style={{
                            font: "600 10px var(--font-mono)",
                            padding: "2px 7px",
                            borderRadius: 4,
                            background:
                              e.action === "Overridden"
                                ? "var(--accent-soft)"
                                : e.action === "Locked"
                                  ? "var(--bg-elevated)"
                                  : "var(--perf-target-soft)",
                            color:
                              e.action === "Overridden"
                                ? "var(--accent)"
                                : e.action === "Locked"
                                  ? "var(--fg-tertiary)"
                                  : "var(--perf-target)",
                            border: ".5px solid currentColor",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {e.action}
                        </span>
                      </td>
                      <td
                        style={{
                          font: "400 11px var(--font-sans)",
                          color: "var(--fg-secondary)",
                          maxWidth: 140,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {e.measure}
                      </td>
                      <td
                        style={{
                          font: "500 11px var(--font-mono)",
                          color: "var(--perf-floor)",
                        }}
                      >
                        {e.prevVal || "—"}
                      </td>
                      <td
                        style={{
                          font: "500 11px var(--font-mono)",
                          color: "var(--perf-target)",
                        }}
                      >
                        {e.newVal || "—"}
                      </td>
                      <td
                        style={{
                          font: "400 11px var(--font-sans)",
                          color: "var(--fg-secondary)",
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={e.justification}
                      >
                        {e.justification
                          ? e.justification.slice(0, 80) +
                            (e.justification.length > 80 ? "…" : "")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        {confirmOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              zIndex: 200,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                background: "var(--bg-surface)",
                borderRadius: 16,
                padding: 28,
                maxWidth: 400,
                width: "100%",
                boxShadow: "var(--shadow-popover)",
                border: ".5px solid var(--border-default)",
              }}
            >
              <h3
                style={{ font: "600 16px var(--font-sans)", margin: "0 0 8px" }}
              >
                Confirm Approval
              </h3>
              <p
                style={{
                  font: "400 13px/20px var(--font-sans)",
                  color: "var(--fg-secondary)",
                  margin: "0 0 16px",
                }}
              >
                This action is permanent and cannot be undone. Approved scores
                are locked for settlement computation.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  className="btn primary"
                  onClick={() => {
                    if (confirmOpen.action === "bulk") doBulkApprove();
                    else if (confirmOpen.action === "approve")
                      doApprove(confirmOpen.measureId);
                    else if (confirmOpen.action === "selected") {
                      confirmOpen.ids.forEach((id) => doApprove(id));
                    }
                  }}
                >
                  Confirm Approval
                </button>
                <button
                  className="btn secondary"
                  onClick={() => setConfirmOpen(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </FullOverlay>
  );
}
export { L3BLineage, L3CApproval };
