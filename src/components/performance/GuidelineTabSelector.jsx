import {
  S11_GUIDELINES,
  S11_HEATMAP,
  S11_ADA_REQS,
} from "@/mock/guideline-adherence";
import {
  complianceColor,
  complianceSoft,
  gradeSoft,
  gradeColor,
} from "@/utils/helpers";
import React from "react";
const { useState: useS11L1State, useMemo: useS11L1Memo } = React;

function TinySparkline({ values, color, w = 52, h = 18 }) {
  if (!values || values.length < 2) return null;
  const min = Math.min(...values) - 2,
    max = Math.max(...values) + 2;
  const r = max - min || 1;
  const pts = values
    .map(
      (v, i) =>
        `${((i / (values.length - 1)) * w).toFixed(1)},${(h - ((v - min) / r) * h).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Guideline Tab Selector ──────────────────────────────────────────────── */
function GuidelineTabSelector({
  activeId,
  onSelect,
  onVersionHistory,
  onPathway,
  onConflicts,
}) {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: ".5px solid var(--border-default)",
        borderRadius: 14,
        padding: "14px 20px",
        marginBottom: 14,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            font: "500 10px var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".07em",
            textTransform: "uppercase",
          }}
        >
          Active Guidelines — Contract 1: Primary Care Performance
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn secondary"
            style={{ padding: "4px 12px", fontSize: 10 }}
            onClick={onPathway}
          >
            View Care Pathway
          </button>
          <button
            className="btn secondary"
            style={{ padding: "4px 12px", fontSize: 10 }}
            onClick={onVersionHistory}
          >
            Version History
          </button>
          <button
            className="btn secondary"
            style={{ padding: "4px 12px", fontSize: 10 }}
            onClick={onConflicts}
          >
            Detect Conflicts
          </button>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {S11_GUIDELINES.map((g) => {
          const isActive = g.id === activeId;
          const c = complianceColor(g.compliance);
          const cs = complianceSoft(g.compliance);
          return (
            <button
              key={g.id}
              onClick={() => onSelect(g.id)}
              style={{
                flex: "1 1 220px",
                padding: "14px 18px",
                borderRadius: 12,
                cursor: "pointer",
                background: isActive ? cs : "var(--bg-elevated)",
                border: isActive
                  ? `.5px solid ${c}`
                  : ".5px solid var(--border-default)",
                textAlign: "left",
                transition: "all .12s",
              }}
            >
              <div
                style={{
                  font: "500 9px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {g.body}
              </div>
              <div
                style={{
                  font: "600 13px var(--font-sans)",
                  color: isActive ? c : "var(--fg-primary)",
                  marginBottom: 6,
                }}
              >
                {g.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ font: "700 20px var(--font-sans)", color: c }}>
                  {g.compliance}%
                </span>
                <span
                  style={{
                    font: "500 10px var(--font-mono)",
                    color:
                      g.trend > 0 ? "var(--perf-target)" : "var(--fg-tertiary)",
                  }}
                >
                  {g.trend > 0 ? "↑" : g.trend < 0 ? "↓" : "→"}{" "}
                  {Math.abs(g.trend).toFixed(1)}pp
                </span>
                <span
                  style={{
                    font: "400 10px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    marginLeft: "auto",
                  }}
                >
                  {g.reqs} requirements
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Compliance Heatmap ──────────────────────────────────────────────────── */
function ComplianceHeatmap({ guidelineId, onCellClick, activeFilter }) {
  const hd = S11_HEATMAP[guidelineId.toLowerCase()];
  if (!hd) return null;
  const { chapters, periods } = hd;
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: ".5px solid var(--border-default)",
        borderRadius: 14,
        padding: "18px 20px",
        marginBottom: 14,
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            font: "500 10px var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".07em",
            textTransform: "uppercase",
          }}
        >
          Compliance Heatmap — Click any cell to filter requirements below
        </span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {[
            ["≥80%", "var(--perf-target)"],
            ["60–79%", "oklch(56% .13 75)"],
            ["<60%", "var(--perf-floor)"],
          ].map(([l, c]) => (
            <div
              key={l}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: c,
                  opacity: 0.8,
                }}
              />
              <span
                style={{
                  font: "500 9px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                }}
              >
                {l}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th
                style={{
                  padding: "8px 16px",
                  textAlign: "left",
                  font: "500 9px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                  width: 260,
                }}
              >
                Chapter / Section
              </th>
              {periods.map((p) => (
                <th
                  key={p}
                  style={{
                    padding: "8px 20px",
                    textAlign: "center",
                    font: "500 9px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                    minWidth: 100,
                  }}
                >
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chapters.map((ch) => (
              <tr key={ch.id}>
                <td
                  style={{
                    padding: "8px 16px",
                    font: "400 12px var(--font-sans)",
                    color: "var(--fg-secondary)",
                    borderTop: ".5px solid var(--border-default)",
                  }}
                >
                  {ch.label}
                </td>
                {ch.data.map((val, pi) => {
                  const isActive =
                    activeFilter &&
                    activeFilter.ch === ch.id &&
                    activeFilter.pi === pi;
                  const c = complianceColor(val);
                  const cs = complianceSoft(val);
                  return (
                    <td
                      key={pi}
                      style={{
                        padding: "6px 8px",
                        textAlign: "center",
                        borderTop: ".5px solid var(--border-default)",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        onCellClick({
                          ch: ch.id,
                          pi,
                          label: ch.label,
                          period: periods[pi],
                        })
                      }
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 72,
                          height: 36,
                          borderRadius: 8,
                          background: isActive ? c : cs,
                          border: isActive
                            ? `.5px solid ${c}`
                            : ".5px solid transparent",
                          font: isActive
                            ? "700 13px var(--font-sans)"
                            : "600 13px var(--font-sans)",
                          color: isActive ? "white" : c,
                          transition: "all .12s",
                        }}
                      >
                        {val}%
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Requirement Summary Table ───────────────────────────────────────────── */
function RequirementTable({ guidelineId, heatmapFilter, onRowClick }) {
  const [sortCol, setSortCol] = useS11L1State("compliance");
  const [sortDir, setSortDir] = useS11L1State("asc");
  const [search, setSearch] = useS11L1State("");
  const [catFilter, setCatFilter] = useS11L1State("All");

  const allReqs = useS11L1Memo(() => {
    if (guidelineId === "ADA") return S11_ADA_REQS;
    if (guidelineId === "APA") return S11_APA_REQS;
    return S11_AACE_REQS;
  }, [guidelineId]);

  const heatmapChapterMap = {
    ADA: {
      Ch2: ["ADA-2024-001", "ADA-2024-011"],
      Ch4: [
        "ADA-2024-005",
        "ADA-2024-007",
        "ADA-2024-008",
        "ADA-2024-009",
        "ADA-2024-010",
        "ADA-2024-018",
        "ADA-2024-020",
        "ADA-2024-024",
        "ADA-2024-025",
      ],
      Ch6: ["ADA-2024-001", "ADA-2024-011", "ADA-2024-021"],
      Ch8: ["ADA-2024-016", "ADA-2024-017"],
      Ch9: ["ADA-2024-012", "ADA-2024-013", "ADA-2024-022"],
      Ch10: ["ADA-2024-004", "ADA-2024-014", "ADA-2024-015", "ADA-2024-023"],
      Ch11: ["ADA-2024-002", "ADA-2024-003", "ADA-2024-006", "ADA-2024-019"],
    },
  };

  const cats = useS11L1Memo(
    () => ["All", ...new Set(allReqs.map((r) => r.cat))],
    [allReqs],
  );

  const filtered = useS11L1Memo(() => {
    let rows = [...allReqs];
    if (heatmapFilter && heatmapChapterMap[guidelineId]) {
      const ids = heatmapChapterMap[guidelineId][heatmapFilter.ch] || [];
      if (ids.length > 0) rows = rows.filter((r) => ids.includes(r.id));
    }
    if (search)
      rows = rows.filter(
        (r) =>
          r.id.toLowerCase().includes(search.toLowerCase()) ||
          r.desc.toLowerCase().includes(search.toLowerCase()),
      );
    if (catFilter !== "All") rows = rows.filter((r) => r.cat === catFilter);
    return rows.sort((a, b) => {
      let va, vb;
      if (sortCol === "compliance") {
        va = a.compliance;
        vb = b.compliance;
      } else if (sortCol === "grade") {
        va = ["A", "B", "C", "E"].indexOf(a.grade);
        vb = ["A", "B", "C", "E"].indexOf(b.grade);
      } else if (sortCol === "eligible") {
        va = a.eligible;
        vb = b.eligible;
      } else {
        va = a[sortCol] || 0;
        vb = b[sortCol] || 0;
      }
      return sortDir === "asc" ? (va < vb ? -1 : 1) : va > vb ? -1 : 1;
    });
  }, [
    allReqs,
    heatmapFilter,
    search,
    catFilter,
    sortCol,
    sortDir,
    guidelineId,
  ]);

  function toggleSort(col) {
    if (sortCol === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortCol(col);
      setSortDir("asc");
    }
  }
  const si = (col) =>
    sortCol === col ? (sortDir === "asc" ? " ↑" : " ↓") : " ↕";

  const gl = S11_GUIDELINES.find((g) => g.id === guidelineId);

  return (
    <div
      className="zone-d"
      style={{ flex: "none", height: "auto", maxHeight: 480 }}
    >
      <div className="zone-d-head" style={{ flexWrap: "wrap", gap: 10 }}>
        <span
          style={{
            font: "500 10px var(--font-mono)",
            color: "var(--fg-tertiary)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
          }}
        >
          {gl?.name} · {filtered.length} of {allReqs.length} requirements
          {heatmapFilter && (
            <span style={{ color: "var(--accent)", marginLeft: 8 }}>
              · Filtered: {heatmapFilter.label} ({heatmapFilter.period})
            </span>
          )}
        </span>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requirements…"
            style={{
              padding: "5px 12px",
              borderRadius: 9999,
              border: ".5px solid var(--border-default)",
              background: "var(--bg-elevated)",
              font: "400 12px var(--font-sans)",
              color: "var(--fg-primary)",
              width: 200,
            }}
          />
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            style={{
              padding: "5px 10px",
              borderRadius: 9999,
              border: ".5px solid var(--border-default)",
              background: "var(--bg-elevated)",
              font: "400 12px var(--font-sans)",
              color: "var(--fg-primary)",
            }}
          >
            {cats.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {heatmapFilter && (
            <button
              className="btn ghost"
              style={{ fontSize: 10 }}
              onClick={() => {}}
            >
              Clear filter ×
            </button>
          )}
        </div>
      </div>
      <div className="zone-d-scroll">
        <table className="measure-tbl">
          <thead>
            <tr>
              <th style={{ width: 110 }} onClick={() => toggleSort("id")}>
                Req. ID{si("id")}
              </th>
              <th style={{ width: 64 }}>Ch.</th>
              <th style={{ width: 80 }}>Category</th>
              <th>Requirement{si("compliance")}</th>
              <th style={{ width: 50 }}>Grade</th>
              <th
                onClick={() => toggleSort("compliance")}
                style={{ width: 90 }}
              >
                Compliance{si("compliance")}
              </th>
              <th onClick={() => toggleSort("eligible")} style={{ width: 68 }}>
                Eligible{si("eligible")}
              </th>
              <th style={{ width: 68 }}>Compliant</th>
              <th style={{ width: 60 }}>Trend</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const c = complianceColor(row.compliance);
              const cs = complianceSoft(row.compliance);
              const gc = gradeColor(row.grade);
              const gcs = gradeSoft(row.grade);
              return (
                <tr
                  key={row.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => onRowClick(row)}
                >
                  <td>
                    <span className="m-id" style={{ fontSize: 9 }}>
                      {row.id}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        font: "500 9px var(--font-mono)",
                        color: "var(--fg-tertiary)",
                        letterSpacing: ".03em",
                      }}
                    >
                      {row.chLabel}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        font: "500 9px var(--font-mono)",
                        color: "var(--fg-secondary)",
                        background: "var(--bg-elevated)",
                        padding: "2px 6px",
                        borderRadius: 4,
                        border: ".5px solid var(--border-default)",
                      }}
                    >
                      {row.cat}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        font: "400 11px/16px var(--font-sans)",
                        color: "var(--fg-primary)",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                      title={row.desc}
                    >
                      {row.desc}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        font: "700 11px var(--font-mono)",
                        background: gcs,
                        color: gc,
                        border: `.5px solid ${gc}`,
                      }}
                    >
                      {row.grade}
                    </span>
                  </td>
                  <td>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <span
                        style={{ font: "600 12px var(--font-mono)", color: c }}
                      >
                        {row.compliance}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 3,
                        background: "var(--bg-elevated)",
                        borderRadius: 9999,
                        marginTop: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: row.compliance + "%",
                          height: "100%",
                          background: c,
                          borderRadius: 9999,
                        }}
                      />
                    </div>
                  </td>
                  <td
                    style={{
                      font: "500 11px var(--font-mono)",
                      color: "var(--fg-secondary)",
                      textAlign: "right",
                    }}
                  >
                    {row.eligible.toLocaleString()}
                  </td>
                  <td
                    style={{
                      font: "500 11px var(--font-mono)",
                      color: c,
                      textAlign: "right",
                    }}
                  >
                    {row.compliant.toLocaleString()}
                  </td>
                  <td>
                    <TinySparkline values={row.trend} color={c} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export {
  GuidelineTabSelector,
  ComplianceHeatmap,
  RequirementTable,
  TinySparkline,
};
