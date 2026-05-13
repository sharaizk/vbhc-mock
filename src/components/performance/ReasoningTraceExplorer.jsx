import {
  VBHC_PROVIDERS,
  VBHC_CONTRACTS,
  VBHC_MEASURES_C1,
  VBHC_getMeasureRow,
} from "@/mock/performance";
import React from "react";
import { Icons } from "../Icons/Icons";
const {
  useState: useTrState,
  useMemo: useTrMemo,
  useEffect: useTrEffect,
} = React;

function ReasoningTraceExplorer({
  open,
  onClose,
  defaultProvider,
  defaultContract,
  defaultPeriod,
  defaultMeasure,
}) {
  const [provId, setProvId] = useTrState(defaultProvider || "P01");
  const [contId, setContId] = useTrState(defaultContract || "C1");
  const [dimId, setDimId] = useTrState(defaultMeasure?.dim || "D1");
  const [measId, setMeasId] = useTrState(defaultMeasure?.id || "D1-001");
  const [perIdx, setPerIdx] = useTrState(
    defaultPeriod !== undefined ? defaultPeriod : 3,
  );
  const [activeNode, setActiveNode] = useTrState(null);
  const [showExport, setShowExport] = useTrState(false);
  const [showSensitivity, setShowSensitivity] = useTrState(false);
  const [exportToast, setExportToast] = useTrState(null);

  useTrEffect(() => {
    if (defaultProvider) setProvId(defaultProvider);
    if (defaultContract) setContId(defaultContract);
    if (defaultMeasure) {
      setDimId(defaultMeasure.dim);
      setMeasId(defaultMeasure.id);
    }
    if (defaultPeriod !== undefined) setPerIdx(defaultPeriod);
  }, [defaultProvider, defaultContract, defaultPeriod, defaultMeasure]);

  const provider =
    VBHC_PROVIDERS.find((p) => p.id === provId) || VBHC_PROVIDERS[0];
  const contract =
    VBHC_CONTRACTS.find((c) => c.id === contId) || VBHC_CONTRACTS[0];
  const availDims = Object.keys(contract.dims);
  const activeDim = availDims.includes(dimId) ? dimId : availDims[0];
  const dimsForContract = availDims;
  const measuresForDim = VBHC_MEASURES_C1.filter((m) => m.dim === activeDim);
  const currentMeasure =
    VBHC_MEASURES_C1.find((m) => m.id === measId) || measuresForDim[0];

  const measureData = useTrMemo(
    () =>
      currentMeasure
        ? VBHC_getMeasureRow(provider, contract, perIdx, currentMeasure)
        : null,
    [provider, contract, perIdx, currentMeasure],
  );

  if (!open) return null;

  function exportAction(format) {
    setShowExport(false);
    setExportToast(
      `${format} generation initiated — download will begin in 10 seconds`,
    );
    setTimeout(() => setExportToast(null), 4000);
  }

  return (
    <FullOverlay
      open={open}
      onClose={onClose}
      crumb={[
        "Dashboard",
        "Reasoning Trace Explorer",
        activeNode ? activeNode.title : "DAG Overview",
      ]}
      headerRight={
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn secondary"
            style={{ padding: "5px 14px", fontSize: 11 }}
            onClick={() => setShowSensitivity((v) => !v)}
          >
            Sensitivity Analysis
          </button>
          <button
            className="btn primary"
            style={{ padding: "5px 14px", fontSize: 11 }}
            onClick={() => setShowExport(true)}
          >
            Export Audit Package
          </button>
        </div>
      }
    >
      <div
        style={{
          flex: 1,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── L1: Score Selector Bar ── */}
        <div
          style={{
            padding: "14px 40px",
            background: "var(--bg-surface)",
            borderBottom: ".5px solid var(--border-default)",
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          {[
            {
              label: "Provider",
              value: provId,
              options: VBHC_PROVIDERS.map((p) => ({
                val: p.id,
                label: p.name,
              })),
              onChange: (v) => {
                setProvId(v);
                const prov = VBHC_PROVIDERS.find((x) => x.id === v);
                if (prov && !prov.contracts.includes(contId))
                  setContId(prov.contracts[0]);
              },
            },
            {
              label: "Contract",
              value: contId,
              options: VBHC_CONTRACTS.filter((c) =>
                provider.contracts.includes(c.id),
              ).map((c) => ({ val: c.id, label: c.name })),
              onChange: (v) => setContId(v),
            },
            {
              label: "Dimension",
              value: activeDim,
              options: dimsForContract.map((d) => ({
                val: d,
                label: `${d} — ${(VBHC_DIMENSIONS[d] || {}).short}`,
              })),
              onChange: (v) => {
                setDimId(v);
                setMeasId(VBHC_MEASURES_C1.find((m) => m.dim === v)?.id || "");
              },
            },
            {
              label: "Measure",
              value: measId,
              options: measuresForDim.map((m) => ({
                val: m.id,
                label: `${m.id} — ${m.shortName}`,
              })),
              onChange: (v) => setMeasId(v),
            },
            {
              label: "Period",
              value: perIdx,
              options: VBHC_PERIODS.map((p, i) => ({ val: i, label: p })),
              onChange: (v) => setPerIdx(parseInt(v)),
            },
          ].map((sel, i) => (
            <div
              key={i}
              style={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <span
                style={{
                  font: "500 9px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                }}
              >
                {sel.label}
              </span>
              <select
                className="sel-btn"
                value={sel.value}
                onChange={(e) => sel.onChange(e.target.value)}
                style={{ minWidth: 180, maxWidth: 240, fontWeight: 500 }}
              >
                {sel.options.map((o) => (
                  <option key={o.val} value={o.val}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          {currentMeasure && measureData && (
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    font: "500 9px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                  }}
                >
                  Adj Score
                </div>
                <div
                  style={{
                    font: "700 20px var(--font-sans)",
                    color: "var(--accent)",
                  }}
                >
                  {VBHC_fmtScore(measureData.adj, currentMeasure.unit)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    font: "500 9px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                  }}
                >
                  Status
                </div>
                <div
                  style={{
                    font: "600 12px var(--font-sans)",
                    color: {
                      exceeds: "var(--perf-exceeds)",
                      target: "var(--perf-target)",
                      below: "var(--perf-below)",
                      floor: "var(--perf-floor)",
                    }[VBHC_getStatus(measureData.adj, currentMeasure).key],
                  }}
                >
                  {VBHC_getStatus(measureData.adj, currentMeasure).label}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── L1: DAG Visualization ── */}
        <div style={{ padding: "20px 40px 0", flexShrink: 0 }}>
          <div
            style={{
              font: "500 10px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".07em",
              textTransform: "uppercase",
              marginBottom: 10,
            }}
          >
            Reasoning Chain — {currentMeasure?.name || "Select a measure"} ·{" "}
            {VBHC_PERIODS[perIdx]}
          </div>
          <div
            style={{
              background: "var(--bg-surface)",
              border: ".5px solid var(--border-default)",
              borderRadius: 14,
              padding: "16px 20px",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <NodeDiagram
              nodes={S8B_DAG_NODES}
              onNodeClick={(n) =>
                setActiveNode((prev) => (prev?.id === n.id ? null : n))
              }
              activeNodeId={activeNode?.id}
            />
            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 10,
                borderTop: ".5px solid var(--border-default)",
                paddingTop: 10,
              }}
            >
              {[
                [
                  "var(--accent)",
                  "oklch(52% .11 200 / .12)",
                  "Success — computed from data",
                ],
                [
                  "var(--gold)",
                  "oklch(62% .12 82 / .14)",
                  "Assumption or imputation applied",
                ],
                [
                  "var(--perf-floor)",
                  "oklch(50% .18 25 / .12)",
                  "Data quality issue",
                ],
              ].map(([c, bg, l]) => (
                <div
                  key={l}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <div
                    style={{
                      width: 14,
                      height: 14,
                      background: bg,
                      border: `.5px solid ${c}`,
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
              <span
                style={{
                  font: "400 10px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  marginLeft: "auto",
                }}
              >
                Click any node to inspect
              </span>
            </div>
          </div>
        </div>

        {/* ── L2-A: Node Inspector ── */}
        {activeNode && (
          <div style={{ padding: "0 40px", marginTop: 16, flexShrink: 0 }}>
            <NodeInspector
              node={
                S8B_LINEAGE.chain.find((n) => n.id === activeNode.id) || {
                  ...activeNode,
                  detail: {
                    inputs: [],
                    logic: activeNode.value,
                    output: activeNode.value,
                    assumptions: [],
                    alternatives: [],
                  },
                }
              }
              onClose={() => setActiveNode(null)}
            />
          </div>
        )}

        {/* ── L3-B: Sensitivity Dashboard ── */}
        {showSensitivity && (
          <div
            style={{
              margin: "16px 40px 0",
              background: "var(--bg-surface)",
              border: ".5px solid var(--border-default)",
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "var(--shadow-card)",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: "14px 20px",
                borderBottom: ".5px solid var(--border-default)",
                background: "var(--bg-elevated)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  font: "600 13px var(--font-sans)",
                  color: "var(--fg-primary)",
                }}
              >
                Assumption Sensitivity Dashboard
              </span>
              <button
                onClick={() => setShowSensitivity(false)}
                style={{
                  width: 28,
                  height: 28,
                  border: ".5px solid var(--border-default)",
                  borderRadius: "50%",
                  background: "var(--bg-surface)",
                  cursor: "pointer",
                  color: "var(--fg-secondary)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {Icons.close}
              </button>
            </div>
            <SensitivityDashboard />
          </div>
        )}

        {/* Spacer */}
        <div style={{ height: 48, flexShrink: 0 }} />
      </div>

      {/* ── L3-A: Export Modal ── */}
      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          onExport={exportAction}
          measure={currentMeasure}
          provider={provider}
          contract={contract}
          period={VBHC_PERIODS[perIdx]}
        />
      )}

      {/* Toast */}
      {exportToast && <div className="toast show">{exportToast}</div>}
    </FullOverlay>
  );
}

/* ── Export Modal ─────────────────────────────────────────────────────────── */
function ExportModal({
  onClose,
  onExport,
  measure,
  provider,
  contract,
  period,
}) {
  const auditId =
    "AQL-" + Math.random().toString(36).substring(2, 10).toUpperCase();
  const now = new Date().toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
  });

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.45)",
        zIndex: 160,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          borderRadius: 18,
          padding: 32,
          width: 580,
          boxShadow: "var(--shadow-popover)",
          border: ".5px solid var(--border-default)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h3 style={{ font: "600 18px var(--font-sans)", margin: 0 }}>
            Export Audit Package
          </h3>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              border: ".5px solid var(--border-default)",
              borderRadius: "50%",
              background: "var(--bg-elevated)",
              cursor: "pointer",
              color: "var(--fg-secondary)",
              display: "grid",
              placeItems: "center",
            }}
          >
            {Icons.close}
          </button>
        </div>

        {[
          {
            icon: "📄",
            label: "PDF Report",
            sub: "Complete Reasoning Trace Report",
            desc: `Full reasoning chain for ${measure?.name || "D1-001"} · ${provider?.name} · ${contract?.name} · ${period}. Includes all data sources, computations, assumptions, and alternative scenarios.`,
            format: "PDF",
          },
          {
            icon: "📊",
            label: "Excel Workbook",
            sub: "Patient-Level Data Package",
            desc: "All patient-level data behind this score: denominator list, numerator list, exclusions, individual values, case-mix variables, and risk adjustment calculations.",
            format: "Excel",
          },
          {
            icon: "⚙",
            label: "JSON",
            sub: "Machine-Readable Reasoning Trace",
            desc: "Complete reasoning trace in JSON format for regulatory submission, external audit, or integration with third-party audit systems. Includes digital signature and timestamp.",
            format: "JSON",
          },
        ].map((opt) => (
          <div
            key={opt.format}
            style={{
              display: "flex",
              gap: 14,
              padding: "14px 0",
              borderBottom: ".5px solid var(--border-default)",
            }}
          >
            <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>
              {opt.icon}
            </span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  font: "600 13px var(--font-sans)",
                  color: "var(--fg-primary)",
                }}
              >
                {opt.label}
              </div>
              <div
                style={{
                  font: "500 11px var(--font-mono)",
                  color: "var(--accent)",
                  marginBottom: 4,
                }}
              >
                {opt.sub}
              </div>
              <p
                style={{
                  font: "400 11px/16px var(--font-sans)",
                  color: "var(--fg-secondary)",
                  margin: "0 0 8px",
                }}
              >
                {opt.desc}
              </p>
              <button
                className="btn secondary"
                style={{ padding: "4px 12px", fontSize: 11 }}
                onClick={() => onExport(opt.label)}
              >
                Generate {opt.format}
              </button>
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: 16,
            padding: "12px 14px",
            background: "var(--bg-elevated)",
            borderRadius: 8,
            border: ".5px solid var(--border-default)",
          }}
        >
          {[
            ["Audit Package ID", auditId],
            ["Generation Timestamp", now],
            [
              "Digital Signature",
              "Will be signed with AiQL Platform Certificate v2",
            ],
            ["Data Freshness", "All data current as of 2025-12-15 04:00 UTC"],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", gap: 12, marginBottom: 4 }}>
              <span
                style={{
                  font: "500 10px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".05em",
                  width: 160,
                  flexShrink: 0,
                  textTransform: "uppercase",
                }}
              >
                {k}
              </span>
              <span
                style={{
                  font: "400 11px var(--font-mono)",
                  color: "var(--fg-secondary)",
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Sensitivity Dashboard ─────────────────────────────────────────────────── */
function SensitivityDashboard() {
  const s = S8B_SENSITIVITY;
  const [exclusions, setExclusions] = useTrState(
    Object.fromEntries(s.exclusions.map((e) => [e.id, e.active])),
  );
  const [riskModel, setRiskModel] = useTrState(0);
  const [attribution, setAttribution] = useTrState(0);
  const [missingData, setMissingData] = useTrState(0);

  const currentScore = useTrMemo(() => {
    let score = s.baseScore;
    score += missingData === 1 ? 0.7 : missingData === 2 ? -1.9 : 0;
    score += riskModel === 1 ? -1.3 : riskModel === 2 ? -4.0 : 0;
    score +=
      attribution === 1
        ? 0.3
        : attribution === 2
          ? -2.4
          : attribution === 3
            ? -9.9
            : 0;
    Object.entries(exclusions).forEach(([id, on]) => {
      const ex = s.exclusions.find((e) => e.id === id);
      if (!on && ex) score += (ex.adj - s.baseScore) * 0.3;
    });
    return parseFloat(score.toFixed(1));
  }, [missingData, riskModel, attribution, exclusions]);

  const currentTier =
    currentScore >= 90
      ? "Exceeds Stretch"
      : currentScore >= 75
        ? "At Target"
        : currentScore >= 60
          ? "Below Target"
          : "Below Floor";
  const tierChanged = currentTier !== s.baseTier;

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Panel 1 — Missing Data */}
        <div className="l2-card">
          <div className="l2-section-title">Missing Data Handling</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {s.missingData.map((opt, i) => (
              <label
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="missingData"
                  checked={missingData === i}
                  onChange={() => setMissingData(i)}
                  style={{ accentColor: "var(--accent)" }}
                />
                <span
                  style={{
                    font: "400 12px var(--font-sans)",
                    color: opt.current
                      ? "var(--fg-primary)"
                      : "var(--fg-secondary)",
                  }}
                >
                  {opt.label}
                  {opt.current ? " (current)" : ""}
                </span>
                <span
                  style={{
                    font: "600 11px var(--font-mono)",
                    color: "var(--accent)",
                    marginLeft: "auto",
                  }}
                >
                  {opt.adj}%
                </span>
              </label>
            ))}
          </div>
          <SensBarChart
            items={s.missingData.map((o) => ({
              label: o.label.split(" ")[0],
              val: o.adj,
            }))}
            base={s.baseScore}
          />
        </div>

        {/* Panel 2 — Exclusion Criteria */}
        <div className="l2-card">
          <div className="l2-section-title">Exclusion Criteria Toggles</div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {s.exclusions.map((ex) => (
              <label
                key={ex.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 18,
                    borderRadius: 9,
                    background: exclusions[ex.id]
                      ? "var(--accent)"
                      : "var(--bg-muted)",
                    border: ".5px solid var(--border-default)",
                    position: "relative",
                    transition: "background .15s",
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                  onClick={() =>
                    setExclusions((prev) => ({
                      ...prev,
                      [ex.id]: !prev[ex.id],
                    }))
                  }
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 2,
                      left: exclusions[ex.id] ? 16 : 2,
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "white",
                      transition: "left .15s",
                      boxShadow: "0 1px 3px rgba(0,0,0,.2)",
                    }}
                  />
                </div>
                <span
                  style={{
                    font: "400 11px var(--font-sans)",
                    color: "var(--fg-secondary)",
                    flex: 1,
                  }}
                >
                  {ex.label}
                </span>
              </label>
            ))}
          </div>
          <div
            style={{
              padding: "8px 12px",
              background: "var(--bg-elevated)",
              borderRadius: 8,
              border: ".5px solid var(--border-default)",
            }}
          >
            <span
              style={{
                font: "500 10px var(--font-mono)",
                color: "var(--fg-tertiary)",
              }}
            >
              Live score:{" "}
            </span>
            <span
              style={{
                font: "700 14px var(--font-sans)",
                color: "var(--accent)",
              }}
            >
              {currentScore}%
            </span>
          </div>
        </div>

        {/* Panel 3 — Risk Adjustment Model */}
        <div className="l2-card">
          <div className="l2-section-title">Risk Adjustment Model</div>
          <select
            value={riskModel}
            onChange={(e) => setRiskModel(parseInt(e.target.value))}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: ".5px solid var(--border-default)",
              background: "var(--bg-elevated)",
              font: "400 12px var(--font-sans)",
              marginBottom: 12,
            }}
          >
            {s.riskModels.map((m, i) => (
              <option key={i} value={i}>
                {m.label}
              </option>
            ))}
          </select>
          <SensBarChart
            items={s.riskModels.map((m) => ({
              label: m.label.split(" ")[0],
              val: m.adj,
            }))}
            base={s.baseScore}
          />
          <div
            style={{
              marginTop: 8,
              font: "400 11px var(--font-sans)",
              color: "var(--fg-secondary)",
            }}
          >
            Current:{" "}
            <strong style={{ color: "var(--fg-primary)" }}>
              {s.riskModels[riskModel].adj}%
            </strong>{" "}
            · Tier:{" "}
            <strong
              style={{
                color:
                  s.riskModels[riskModel].tier === "At Target"
                    ? "var(--perf-target)"
                    : "var(--perf-below)",
              }}
            >
              {s.riskModels[riskModel].tier}
            </strong>
          </div>
        </div>

        {/* Panel 4 — Attribution Method */}
        <div className="l2-card">
          <div className="l2-section-title">Attribution Method</div>
          <select
            value={attribution}
            onChange={(e) => setAttribution(parseInt(e.target.value))}
            style={{
              width: "100%",
              padding: "8px 10px",
              borderRadius: 8,
              border: ".5px solid var(--border-default)",
              background: "var(--bg-elevated)",
              font: "400 12px var(--font-sans)",
              marginBottom: 12,
            }}
          >
            {s.attribution.map((m, i) => (
              <option key={i} value={i}>
                {m.label}
              </option>
            ))}
          </select>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}
          >
            <thead>
              <tr>
                {["Method", "Den", "Num", "Raw", "Adj", "Tier"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "4px 8px",
                      font: "500 8px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: ".05em",
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
              {s.attribution.map((a, i) => (
                <tr
                  key={i}
                  style={{
                    background:
                      i === attribution ? "var(--accent-soft)" : "transparent",
                  }}
                >
                  <td
                    style={{
                      padding: "5px 8px",
                      font:
                        i === attribution
                          ? "600 10px var(--font-sans)"
                          : "400 10px var(--font-sans)",
                      color: "var(--fg-primary)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {a.label.split(" ")[0]}
                  </td>
                  <td
                    style={{
                      padding: "5px 8px",
                      font: "500 10px var(--font-mono)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {a.den}
                  </td>
                  <td
                    style={{
                      padding: "5px 8px",
                      font: "500 10px var(--font-mono)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {a.num}
                  </td>
                  <td
                    style={{
                      padding: "5px 8px",
                      font: "500 10px var(--font-mono)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {a.raw}%
                  </td>
                  <td
                    style={{
                      padding: "5px 8px",
                      font: "600 10px var(--font-mono)",
                      color:
                        i === attribution
                          ? "var(--accent)"
                          : "var(--fg-primary)",
                    }}
                  >
                    {a.adj}%
                  </td>
                  <td
                    style={{
                      padding: "5px 8px",
                      font: "500 10px var(--font-mono)",
                      color:
                        a.tier === "At Target"
                          ? "var(--perf-target)"
                          : "var(--perf-below)",
                    }}
                  >
                    {a.tier.split(" ")[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary row */}
      <div
        style={{
          padding: "14px 20px",
          borderRadius: 10,
          border: `.5px solid ${tierChanged ? "var(--perf-below)" : "var(--perf-target)"}`,
          background: tierChanged
            ? "var(--perf-below-soft)"
            : "var(--perf-target-soft)",
          display: "flex",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <span
            style={{
              font: "500 10px var(--font-mono)",
              color: "var(--fg-tertiary)",
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Official Score:{" "}
          </span>
          <span
            style={{
              font: "700 16px var(--font-sans)",
              color: "var(--fg-primary)",
            }}
          >
            {s.baseScore}% ({s.baseTier})
          </span>
        </div>
        <div>
          <span
            style={{
              font: "500 10px var(--font-mono)",
              color: "var(--fg-tertiary)",
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Sensitivity Range:{" "}
          </span>
          <span
            style={{
              font: "600 13px var(--font-sans)",
              color: "var(--fg-primary)",
            }}
          >
            {s.sensitivityRange[0]}% – {s.sensitivityRange[1]}%
          </span>
        </div>
        <div
          style={{
            flex: 1,
            font: "500 12px var(--font-sans)",
            color: tierChanged ? "var(--perf-below)" : "var(--perf-target)",
          }}
        >
          {tierChanged
            ? `⚠ Performance tier changes under current scenario — review recommended. ${s.tierChanges} of 12 total scenarios show tier change.`
            : `✓ Performance tier stable across all ${12 - s.tierChanges} of 12 scenarios tested.`}
        </div>
        <div>
          <span
            style={{
              font: "500 10px var(--font-mono)",
              color: "var(--fg-tertiary)",
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Live Score:{" "}
          </span>
          <span
            style={{
              font: "700 18px var(--font-sans)",
              color: tierChanged ? "var(--perf-below)" : "var(--accent)",
            }}
          >
            {currentScore}%
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Sensitivity bar chart (mini) ─────────────────────────────────────────── */
function SensBarChart({ items, base }) {
  const max = Math.max(...items.map((i) => i.val), base) * 1.1;
  return (
    <div
      style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 44 }}
    >
      {items.map((it, i) => {
        const h = (it.val / max) * 40;
        const isBase = Math.abs(it.val - base) < 0.2;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <span
              style={{
                font: "600 9px var(--font-mono)",
                color: isBase ? "var(--accent)" : "var(--fg-tertiary)",
              }}
            >
              {it.val}
            </span>
            <div
              style={{
                width: "100%",
                height: h,
                background: isBase ? "var(--accent)" : "var(--bg-muted)",
                borderRadius: "3px 3px 0 0",
                border: `.5px solid ${isBase ? "var(--accent)" : "var(--border-default)"}`,
                opacity: isBase ? 1 : 0.7,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default ReasoningTraceExplorer;
