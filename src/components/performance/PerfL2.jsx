// Session 8 — perf-l2.jsx — L2 Slide-Over Panels (A, B, C)
import {
  VBHC_PERIODS,
  VBHC_DIMENSIONS,
  VBHC_CASEMIX_P01,
  VBHC_NETWORK_C1,
  VBHC_getMeasureRow,
  VBHC_getStatus,
  VBHC_fmtScore,
  VBHC_fmtThreshold,
  VBHC_DENOM_PATIENTS,
} from "@/mock/performance";
import React from "react";
import {
  WaterfallChart,
  LineChart,
  Histogram,
  ImpactBarChart,
  HorizBarChart,
} from "./Charts";
import { Icons } from "../Icons/Icons";
import { useRouter } from "next/navigation";
const { useState, useEffect, useMemo } = React;

/* ── Shared SlidePanel wrapper ──────────────────────────────────────────── */
function SlidePanel({
  open,
  onClose,
  crumb,
  title,
  subtitle,
  children,
  tabs,
  activeTab,
  onTab,
  headerExtra,
}) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={"l2-scrim" + (open ? " open" : "")} onClick={onClose} />
      <aside
        className={"l2-panel" + (open ? " open" : "")}
        role="dialog"
        aria-modal="true"
      >
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
                  maxWidth: 520,
                }}
              >
                {subtitle}
              </p>
            )}
          </div>
          {headerExtra && <div style={{ flexShrink: 0 }}>{headerExtra}</div>}
          <button className="l2-close" onClick={onClose} aria-label="Close">
            {Icons.close}
          </button>
        </div>
        {tabs && tabs.length > 0 && (
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

/* ════════════════════════════════════════════════════════════════════════════
   L2-A  Composite Score Breakdown
   ══════════════════════════════════════════════════════════════════════════ */
function PanelL2A({
  open,
  onClose,
  provider,
  contract,
  periodIdx,
  dimScores,
  composites,
  onDimClick,
  onApprove,
}) {
  const composite = composites[periodIdx];
  const period = VBHC_PERIODS[periodIdx];
  const dims = Object.keys(contract.dims);

  const waterfallItems = useMemo(() => {
    return dims.map((d) => {
      const w = contract.dims[d];
      const score = dimScores[d] || 0;
      const contribution = score * (w / 100);
      return {
        label: VBHC_DIMENSIONS[d].short,
        dim: d,
        weight: w,
        score,
        contribution,
        target: 75,
        color: VBHC_DIMENSIONS[d].color,
      };
    });
  }, [dims, dimScores, contract]);

  const casemix = VBHC_CASEMIX_P01;
  const raw =
    provider.id === "P01" ? casemix.rawComposite : Math.round(composite * 0.96);
  const adj = composite;
  const delta = adj - raw;

  const historical = composites;
  const projectedScore = Math.min(
    100,
    Math.round(
      composite + (composites[composites.length - 1] - composites[0]) / 3,
    ),
  );

  const thresholds = [
    { value: 90, label: "Stretch", color: "var(--perf-exceeds)", dashed: true },
    { value: 75, label: "Target", color: "var(--perf-target)", dashed: true },
    { value: 60, label: "Floor", color: "var(--perf-floor)", dashed: true },
  ];

  const network = VBHC_NETWORK_C1;
  let below = 0,
    total = 0;
  network.histogram.forEach((b) => {
    const bs = parseInt(b.bin);
    total += b.count;
    if (bs + 4 < composite) below += b.count;
  });
  const pctile = Math.round((below / total) * 100);

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      crumb={"L2-A · " + period + " · " + contract.name}
      title="Composite Score Breakdown"
      subtitle={
        "Decomposition of the " +
        composite +
        "-point composite score by dimension contribution, with historical trend and network position."
      }
      headerExtra={
        onApprove && (
          <button
            className="btn primary"
            style={{ padding: "5px 14px", fontSize: 11 }}
            onClick={onApprove}
          >
            Approve Scores →
          </button>
        )
      }
    >
      {/* Waterfall */}
      <div className="l2-section">
        <div className="l2-section-title">
          Dimension Contributions → Composite {composite}
        </div>
        <div className="l2-card" style={{ overflowX: "auto" }}>
          <p
            style={{
              font: "400 11px/16px var(--font-sans)",
              color: "var(--fg-secondary)",
              margin: "0 0 14px",
            }}
          >
            Each bar shows a dimension's weighted contribution (score ×
            weight%). Bars stack to form the composite total. Click any segment
            to navigate to the Dimension Deep-Dive.
          </p>
          <WaterfallChart
            items={waterfallItems}
            total={composite}
            onItemClick={(it) => onDimClick && onDimClick(it.dim)}
          />
        </div>
      </div>

      {/* Raw vs Adjusted */}
      <div className="l2-section">
        <div className="l2-section-title">Raw vs Risk-Adjusted Composite</div>
        <div className="metric-row">
          <div className="metric-box">
            <div className="m-label">Raw Composite</div>
            <div className="m-val">{raw}</div>
            <div className="m-sub">Before risk adjustment</div>
          </div>
          <div
            className="metric-box"
            style={{
              borderColor: "var(--accent)",
              background: "var(--accent-soft)",
            }}
          >
            <div className="m-label">Adjusted Composite</div>
            <div className="m-val" style={{ color: "var(--accent)" }}>
              {adj}
            </div>
            <div className="m-sub">After case-mix adjustment</div>
          </div>
          <div className="metric-box">
            <div className="m-label">Adjustment Δ</div>
            <div
              className="m-val"
              style={{
                color: delta >= 0 ? "var(--perf-target)" : "var(--perf-floor)",
              }}
            >
              {delta >= 0 ? "+" : ""}
              {delta} pts
            </div>
            <div className="m-sub">
              {delta >= 0
                ? "Risk adj. benefited this provider"
                : "Risk adj. reduced this provider's score"}
            </div>
          </div>
        </div>
        <div className="l2-card" style={{ marginTop: 10 }}>
          <p
            style={{
              font: "400 12px/18px var(--font-sans)",
              color: "var(--fg-secondary)",
              margin: 0,
            }}
          >
            {provider.id === "P01"
              ? "Risk adjustment adds +4.0pp. Dr. Al-Khalil's panel has above-average comorbidity burden (Charlson 2.8 vs network 2.3) and older mean age (54.2 vs 51.7). The adjustment correctly accounts for harder case mix. Click the adjusted score in the Measure Scorecard to see variable-level detail."
              : `Risk adjustment ${delta >= 0 ? "benefits" : "reduces"} this provider by ${Math.abs(delta)} points based on panel demographics and comorbidity profile.`}
          </p>
          <button
            className="btn secondary"
            style={{ marginTop: 10 }}
            onClick={() => onDimClick && onDimClick("risk")}
          >
            View Risk Adjustment Detail →
          </button>
        </div>
      </div>

      {/* Historical trend */}
      <div className="l2-section">
        <div className="l2-section-title">
          Historical Composite — All Periods
        </div>
        <div className="l2-card" style={{ overflowX: "auto" }}>
          <LineChart
            data={historical}
            periods={VBHC_PERIODS}
            thresholds={thresholds}
            projected={{ value: projectedScore }}
            width={520}
            height={150}
          />
          <p
            style={{
              font: "400 10px/14px var(--font-mono)",
              color: "var(--fg-tertiary)",
              margin: "10px 0 0",
              letterSpacing: ".02em",
            }}
          >
            Dashed point = projected next-period estimate based on observed
            trend. Confidence band omitted at this summary level — see
            measure-level detail for CIs.
          </p>
        </div>
      </div>

      {/* Network distribution */}
      <div className="l2-section">
        <div className="l2-section-title">
          Network Position — {network.n} Providers in Contract
        </div>
        <div className="l2-card" style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 20, marginBottom: 12 }}>
            <div>
              <div
                style={{
                  font: "500 9px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Network Mean
              </div>
              <div
                style={{
                  font: "600 18px/1 var(--font-sans)",
                  color: "var(--fg-primary)",
                }}
              >
                {network.mean}
              </div>
            </div>
            <div>
              <div
                style={{
                  font: "500 9px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Median
              </div>
              <div
                style={{
                  font: "600 18px/1 var(--font-sans)",
                  color: "var(--fg-primary)",
                }}
              >
                {network.median}
              </div>
            </div>
            <div>
              <div
                style={{
                  font: "500 9px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                This Provider
              </div>
              <div
                style={{
                  font: "700 18px/1 var(--font-sans)",
                  color: "var(--accent)",
                }}
              >
                {composite}
              </div>
            </div>
            <div>
              <div
                style={{
                  font: "500 9px var(--font-mono)",
                  color: "var(--fg-tertiary)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Percentile
              </div>
              <div
                style={{
                  font: "600 18px/1 var(--font-sans)",
                  color: "var(--perf-target)",
                }}
              >
                {pctile > 0 ? pctile + "th" : "Top 5%"}
              </div>
            </div>
          </div>
          <Histogram
            bins={network.histogram}
            providerScore={composite}
            mean={network.mean}
            median={network.median}
            width={500}
            height={120}
          />
          <p
            style={{
              font: "400 10px/14px var(--font-mono)",
              color: "var(--fg-tertiary)",
              margin: "10px 0 0",
              letterSpacing: ".02em",
            }}
          >
            ▲ marker = this provider's score. Solid bar = provider's score bin.
            μ = network mean. Dashed line = median.
          </p>
        </div>
      </div>
    </SlidePanel>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L2-B  Measure Detail Panel
   ══════════════════════════════════════════════════════════════════════════ */
function PanelL2B({
  open,
  onClose,
  measure,
  provider,
  contract,
  periodIdx,
  onOpenL2C,
  onOpenMethodology,
  onOpenLineage,
  onOpenTrace,
}) {
  const router = useRouter();
  const [tab, setTab] = useState("spec");
  const tabs = [
    { id: "spec", label: "Specification" },
    { id: "compute", label: "Computation" },
    { id: "denom", label: "Denominator" },
    { id: "trend", label: "Trend" },
    { id: "peers", label: "Peer Comparison" },
    { id: "trace", label: "Reasoning Trace" },
  ];

  if (!measure)
    return (
      <SlidePanel
        open={open}
        onClose={onClose}
        crumb="L2-B"
        title="Measure Detail"
      >
        {null}
      </SlidePanel>
    );

  const getMeasureRow = VBHC_getMeasureRow;
  const data = getMeasureRow(provider, contract, periodIdx, measure);
  const status = VBHC_getStatus(data.adj, measure);
  const sc = {
    exceeds: "var(--perf-exceeds)",
    target: "var(--perf-target)",
    below: "var(--perf-below)",
    floor: "var(--perf-floor)",
  }[status.key];
  const isP01D1001 = provider.id === "P01" && measure.id === "D1-001";
  const comp = isP01D1001
    ? VBHC_COMPUTATION_D1_001
    : genComputation(provider, measure, data);

  function genComputation(prov, m, d) {
    const panelN = prov.panel;
    const pct = Math.min(0.98, Math.max(0.1, d.adj / 100));
    const num = Math.round(panelN * pct);
    const excl = Math.round(panelN * 0.05);
    const den = panelN - excl;
    const rawRate = ((num / den) * 100).toFixed(1);
    const adjFactor = 1 + ((d.adj - d.raw) / (d.raw || 1)) * 0.5;
    return {
      numerator: num,
      denominator: den,
      exclusions: excl,
      rawRate: parseFloat(rawRate),
      riskFactor: Math.max(0.85, Math.min(1.3, adjFactor)).toFixed(3),
      adjRate: parseFloat(d.adj),
      ci95: [
        parseFloat((d.adj * 0.95).toFixed(1)),
        parseFloat((d.adj * 1.05).toFixed(1)),
      ],
      reasoning: [
        `Score computed from ${den} eligible patients in ${VBHC_PERIODS[periodIdx]}.`,
        `${num} patients met the numerator criterion. ${excl} exclusions applied per measure specification.`,
        `Raw rate: ${num} ÷ ${den} = ${rawRate}${m.unit === "%" ? "%" : ""}.`,
        `Risk adjustment factor ${Math.max(0.85, Math.min(1.3, adjFactor)).toFixed(3)} applied. Adjusted rate: ${VBHC_fmtScore(d.adj, m.unit)}.`,
      ],
    };
  }

  // Trend chart data
  const trendData = data.trend || [data.adj];
  const thresholds = [
    {
      value: measure.target,
      label: "Target",
      color: "var(--perf-target)",
      dashed: true,
    },
    {
      value: measure.floor,
      label: "Floor",
      color: "var(--perf-floor)",
      dashed: true,
    },
    {
      value: measure.stretch,
      label: "Stretch",
      color: "var(--perf-exceeds)",
      dashed: true,
    },
  ].filter((t) => !isNaN(t.value));

  // Peer comparison
  const network = VBHC_NETWORK_C1;
  const peerItems = [
    {
      label: "This Provider",
      value: data.adj,
      color: "var(--accent)",
      bold: true,
      displayVal: VBHC_fmtScore(data.adj, measure.unit),
    },
    {
      label: "75th Pctile",
      value: measure.target * 1.1,
      color: "var(--perf-target)",
      bold: false,
      displayVal: VBHC_fmtScore(measure.target * 1.1, measure.unit),
    },
    {
      label: "Network Mean",
      value: measure.target * 0.97,
      color: "var(--fg-secondary)",
      bold: false,
      displayVal: VBHC_fmtScore(measure.target * 0.97, measure.unit),
      band: [measure.floor, measure.target * 1.2],
    },
    {
      label: "25th Pctile",
      value: measure.floor * 1.1,
      color: "var(--perf-below)",
      bold: false,
      displayVal: VBHC_fmtScore(measure.floor * 1.1, measure.unit),
    },
  ];
  const maxPeer = Math.max(...peerItems.map((p) => p.value)) * 1.2;

  const dimColor = (VBHC_DIMENSIONS[measure.dim] || {}).color || "#888";

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      crumb={"L2-B · " + measure.id + " · " + VBHC_PERIODS[periodIdx]}
      title={measure.name}
      subtitle={
        "Dimension " +
        measure.dim +
        " — " +
        (VBHC_DIMENSIONS[measure.dim] || {}).name +
        " · Weight " +
        (contract.dims[measure.dim] || "—") +
        "%"
      }
      tabs={tabs}
      activeTab={tab}
      onTab={setTab}
    >
      {/* Specification tab */}
      {tab === "spec" && (
        <div>
          <div className="metric-row" style={{ marginBottom: 16 }}>
            <div
              className="metric-box"
              style={{ borderLeft: `3px solid ${dimColor}` }}
            >
              <div className="m-label">Status</div>
              <div className="m-val" style={{ color: sc, fontSize: 16 }}>
                {status.label}
              </div>
            </div>
            <div className="metric-box">
              <div className="m-label">Adj Score</div>
              <div className="m-val" style={{ color: sc }}>
                {VBHC_fmtScore(data.adj, measure.unit)}
              </div>
            </div>
            <div className="metric-box">
              <div className="m-label">Target / Floor / Stretch</div>
              <div
                style={{
                  font: "500 12px/20px var(--font-mono)",
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
          <div className="l2-section-title">Measure Definition</div>
          <div className="l2-card" style={{ marginBottom: 14 }}>
            <p
              style={{
                font: "400 13px/20px var(--font-sans)",
                color: "var(--fg-primary)",
                margin: 0,
              }}
            >
              {measure.id} — {measure.name}
            </p>
          </div>
          <table className="l2-table" style={{ marginBottom: 14 }}>
            <tbody>
              <tr>
                <td
                  style={{
                    width: 140,
                    color: "var(--fg-tertiary)",
                    font: "500 10px var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  Numerator
                </td>
                <td>{measure.num}</td>
              </tr>
              <tr>
                <td
                  style={{
                    color: "var(--fg-tertiary)",
                    font: "500 10px var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  Denominator
                </td>
                <td>{measure.den}</td>
              </tr>
              <tr>
                <td
                  style={{
                    color: "var(--fg-tertiary)",
                    font: "500 10px var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  Exclusions
                </td>
                <td>{measure.excl}</td>
              </tr>
              <tr>
                <td
                  style={{
                    color: "var(--fg-tertiary)",
                    font: "500 10px var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  Data Source
                </td>
                <td>{measure.source}</td>
              </tr>
              <tr>
                <td
                  style={{
                    color: "var(--fg-tertiary)",
                    font: "500 10px var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  Methodology
                </td>
                <td>{measure.method}</td>
              </tr>
              <tr>
                <td
                  style={{
                    color: "var(--fg-tertiary)",
                    font: "500 10px var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  Measure Steward
                </td>
                <td>{measure.steward}</td>
              </tr>
              <tr>
                <td
                  style={{
                    color: "var(--fg-tertiary)",
                    font: "500 10px var(--font-mono)",
                    textTransform: "uppercase",
                    letterSpacing: ".06em",
                  }}
                >
                  Direction
                </td>
                <td>
                  {measure.lowerBetter
                    ? "Lower is better ▼"
                    : "Higher is better ▲"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Computation tab */}
      {tab === "compute" && (
        <div>
          <div className="metric-row" style={{ flexWrap: "wrap", gap: 10 }}>
            {[
              {
                label: "Numerator",
                val: comp.numerator.toLocaleString(),
                sub: measure.num.substring(0, 50) + "…",
              },
              {
                label: "Denominator",
                val: comp.denominator.toLocaleString(),
                sub: "Eligible patients",
              },
              {
                label: "Exclusions Applied",
                val: comp.exclusions.toLocaleString(),
                sub: "Per specification",
              },
              {
                label: "Raw Rate",
                val: VBHC_fmtScore(comp.rawRate, measure.unit),
                sub: `${comp.numerator}÷${comp.denominator}`,
              },
              {
                label: "Risk Adj. Factor",
                val: comp.riskFactor,
                sub: "AiQL Case-Mix v2.1",
              },
              {
                label: "Adjusted Rate",
                val: VBHC_fmtScore(comp.adjRate, measure.unit),
                sub: `95% CI: ${comp.ci95[0]}–${comp.ci95[1]}${measure.unit === "%" ? "%" : ""}`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="metric-box"
                style={{ flex: "1 1 140px" }}
              >
                <div className="m-label">{item.label}</div>
                <div className="m-val" style={{ fontSize: 17 }}>
                  {item.val}
                </div>
                <div className="m-sub">{item.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <div className="l2-section-title">95% Confidence Interval</div>
            <div className="l2-card">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    font: "500 12px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                  }}
                >
                  {comp.ci95[0]}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    background: "var(--bg-muted)",
                    borderRadius: 4,
                    position: "relative",
                    border: ".5px solid var(--border-default)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: "15%",
                      right: "15%",
                      background: "var(--accent)",
                      opacity: 0.25,
                      borderRadius: 4,
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%,-50%)",
                      width: 2,
                      height: 16,
                      background: "var(--accent)",
                    }}
                  />
                </div>
                <span
                  style={{
                    font: "500 12px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                  }}
                >
                  {comp.ci95[1]}
                </span>
              </div>
              <p
                style={{
                  font: "400 11px/16px var(--font-sans)",
                  color: "var(--fg-secondary)",
                  margin: "8px 0 0",
                }}
              >
                Adjusted rate {VBHC_fmtScore(comp.adjRate, measure.unit)} (95%
                CI {comp.ci95[0]}–{comp.ci95[1]}
                {measure.unit === "%" ? "%" : ""}). Computed using binomial
                proportion with continuity correction.
              </p>
            </div>
          </div>
          <div
            style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            <button
              className="btn secondary"
              onClick={() => onOpenL2C && onOpenL2C()}
            >
              View Risk Adjustment Detail →
            </button>
            <button
              className="btn secondary"
              onClick={() => onOpenMethodology && onOpenMethodology()}
            >
              View Methodology (L3-A) →
            </button>
            <button
              className="btn secondary"
              onClick={() => onOpenLineage && onOpenLineage()}
            >
              View Data Sources (L3-B) →
            </button>
          </div>
        </div>
      )}

      {/* Denominator tab */}
      {tab === "denom" && (
        <div>
          <p
            style={{
              font: "400 12px/18px var(--font-sans)",
              color: "var(--fg-secondary)",
              margin: "0 0 14px",
            }}
          >
            First 20 patients in the denominator for {measure.shortName},{" "}
            {VBHC_PERIODS[periodIdx]}. Patient IDs anonymised. Click any row to
            navigate to Patient Detail (Session 10).
          </p>
          <table className="l2-table">
            <thead>
              <tr>
                <th>Patient ID</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Facility</th>
                <th>Status</th>
                <th>Evidence Date</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {VBHC_DENOM_PATIENTS.map((p) => (
                <tr
                  key={p.id}
                  onClick={() =>
                    router.push(`/performance/patient-details/${p.id}`)
                  }
                >
                  <td>
                    <span
                      style={{
                        font: "500 11px var(--font-mono)",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      {p.id}
                    </span>
                  </td>
                  <td>{p.age}</td>
                  <td>{p.sex}</td>
                  <td
                    style={{
                      font: "400 11px var(--font-sans)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {p.facility}
                  </td>
                  <td>
                    <span
                      style={{
                        font: "500 10px var(--font-mono)",
                        padding: "2px 7px",
                        borderRadius: 4,
                        background:
                          p.status === "Met"
                            ? "var(--perf-target-soft)"
                            : "var(--perf-floor-soft)",
                        color:
                          p.status === "Met"
                            ? "var(--perf-target)"
                            : "var(--perf-floor)",
                        border: ".5px solid currentColor",
                      }}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td
                    style={{
                      font: "400 11px var(--font-sans)",
                      color: "var(--fg-secondary)",
                    }}
                  >
                    {p.date}
                  </td>
                  <td>
                    <span
                      style={{
                        font: "600 11px var(--font-mono)",
                        color: "var(--fg-primary)",
                      }}
                    >
                      {p.value}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Trend tab */}
      {tab === "trend" && (
        <div>
          <div className="l2-section-title">
            Score Across All Periods — with Threshold Reference Lines
          </div>
          <div className="l2-card" style={{ overflowX: "auto" }}>
            <LineChart
              data={trendData}
              periods={VBHC_PERIODS}
              thresholds={thresholds}
              width={520}
              height={180}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            {thresholds.map((t) => (
              <div
                key={t.label}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <div
                  style={{
                    width: 18,
                    height: 1.5,
                    borderTop: `1.5px dashed ${t.color}`,
                  }}
                />
                <span
                  style={{
                    font: "500 10px var(--font-mono)",
                    color: "var(--fg-tertiary)",
                    letterSpacing: ".03em",
                  }}
                >
                  {t.label}:{" "}
                  {VBHC_fmtThreshold(
                    t.value,
                    measure.unit,
                    measure.lowerBetter,
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Peers tab */}
      {tab === "peers" && (
        <div>
          <div className="l2-section-title">
            Peer Comparison — Contract Network ({VBHC_NETWORK_C1.n} Providers)
          </div>
          <div className="l2-card">
            <p
              style={{
                font: "400 11px/16px var(--font-sans)",
                color: "var(--fg-secondary)",
                margin: "0 0 14px",
              }}
            >
              This provider's adjusted score relative to the network quartile
              distribution. Grey band = interquartile range (p25–p75).
            </p>
            <HorizBarChart
              items={peerItems}
              width={400}
              height={26}
              maxVal={maxPeer}
            />
          </div>
        </div>
      )}

      {/* Reasoning trace tab */}
      {tab === "trace" && (
        <div>
          <div className="l2-section-title">AiQL Reasoning Trace Summary</div>
          <div className="reasoning-trace">
            {(isP01D1001
              ? VBHC_COMPUTATION_D1_001.reasoning
              : comp.reasoning
            ).map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <span
              className="trace-link"
              onClick={() =>
                onOpenTrace
                  ? onOpenTrace()
                  : window.__toast &&
                    window.__toast(
                      "Navigates to Reasoning Trace Explorer (Session 8B)",
                    )
              }
            >
              View Full Trace in AiQL Reasoning Explorer →
            </span>
          </div>
          <div style={{ marginTop: 20 }}>
            <div className="l2-section-title">Model Provenance</div>
            <table className="l2-table">
              <tbody>
                <tr>
                  <td
                    style={{
                      width: 140,
                      color: "var(--fg-tertiary)",
                      font: "500 10px var(--font-mono)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                    }}
                  >
                    Model
                  </td>
                  <td>AiQL Case-Mix Model v2.1</td>
                </tr>
                <tr>
                  <td
                    style={{
                      color: "var(--fg-tertiary)",
                      font: "500 10px var(--font-mono)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                    }}
                  >
                    Variables
                  </td>
                  <td>ICHOM-derived case-mix variables (6 active)</td>
                </tr>
                <tr>
                  <td
                    style={{
                      color: "var(--fg-tertiary)",
                      font: "500 10px var(--font-mono)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                    }}
                  >
                    Last Updated
                  </td>
                  <td>Q4 2025 contract period</td>
                </tr>
                <tr>
                  <td
                    style={{
                      color: "var(--fg-tertiary)",
                      font: "500 10px var(--font-mono)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                    }}
                  >
                    Steward
                  </td>
                  <td>{measure.steward}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </SlidePanel>
  );
}

/* ════════════════════════════════════════════════════════════════════════════
   L2-C  Risk Adjustment Detail
   ══════════════════════════════════════════════════════════════════════════ */
function PanelL2C({ open, onClose, provider, contract, periodIdx }) {
  const casemix =
    provider.id === "P01" ? VBHC_CASEMIX_P01 : genCasemix(provider);
  const period = VBHC_PERIODS[periodIdx];

  function genCasemix(prov) {
    const pn = parseInt(prov.id.slice(1));
    const oe = 0.9 + prov.composite / 500;
    return {
      model: "AiQL Case-Mix Model v2.1 — ICHOM-derived variables",
      oeRatio: parseFloat(oe.toFixed(2)),
      oeInterp:
        oe >= 1
          ? "Outperforming expectations given case mix."
          : "Underperforming expectations given case mix.",
      rawComposite: Math.round(prov.composite * 0.96),
      adjComposite: prov.composite,
      adjDelta: Math.round(prov.composite * 0.04),
      variables: [
        {
          name: "Mean Age",
          prov: 50 + pn * 0.4,
          net: 51.7,
          diff: "+0.5 yrs",
          harder: false,
          rawEffect: -0.5,
        },
        {
          name: "Charlson Index",
          prov: 2.0 + pn * 0.08,
          net: 2.3,
          diff: "-0.3",
          harder: false,
          rawEffect: +0.8,
        },
        {
          name: "Mean BMI",
          prov: 29 + pn * 0.2,
          net: 29.8,
          diff: "+0.2",
          harder: false,
          rawEffect: -0.2,
        },
        {
          name: "% with Depression",
          prov: 20 + pn,
          net: 22,
          diff: "-2%",
          harder: false,
          rawEffect: +0.6,
        },
        {
          name: "% Low SES",
          prov: 10 + pn * 0.4,
          net: 12,
          diff: "-2%",
          harder: false,
          rawEffect: +0.4,
        },
        {
          name: "% Male",
          prov: 55 + pn * 0.5,
          net: 58,
          diff: "-3%",
          harder: false,
          rawEffect: +0.2,
        },
      ],
    };
  }

  const peerBarItems = casemix.variables
    .map((v) => [
      {
        label: v.name + " (Provider)",
        value: parseFloat(v.prov),
        color: "var(--accent)",
        bold: true,
        displayVal: v.prov.toFixed(1),
      },
      {
        label: v.name + " (Network)",
        value: parseFloat(v.net),
        color: "var(--bg-muted)",
        bold: false,
        displayVal: v.net.toFixed(1),
      },
    ])
    .flat();

  const maxPeer2 =
    Math.max(...casemix.variables.map((v) => Math.max(v.prov, v.net))) * 1.2;

  const impactItems = [...casemix.variables]
    .sort((a, b) => Math.abs(b.rawEffect) - Math.abs(a.rawEffect))
    .map((v) => ({ label: v.name, value: v.rawEffect }));

  return (
    <SlidePanel
      open={open}
      onClose={onClose}
      crumb={"L2-C · " + period + " · " + contract.name}
      title="Risk Adjustment Detail"
      subtitle="Case-mix model inputs, observed/expected ratio, and per-variable impact on the composite score."
    >
      {/* Model info */}
      <div className="l2-section">
        <div className="l2-section-title">Model</div>
        <div className="l2-card">
          <p
            style={{
              font: "600 13px/1 var(--font-sans)",
              color: "var(--fg-primary)",
              margin: "0 0 6px",
            }}
          >
            {casemix.model}
          </p>
          <p
            style={{
              font: "400 12px/18px var(--font-sans)",
              color: "var(--fg-secondary)",
              margin: 0,
            }}
          >
            Applies hierarchical linear adjustment using 6 case-mix variables
            derived from ICHOM Standard Sets. Variables are extracted quarterly
            via the AiQL ingestion pipeline and validated against civil registry
            and EMR data.
          </p>
        </div>
      </div>

      {/* O/E Ratio */}
      <div className="l2-section">
        <div className="l2-section-title">Observed / Expected Ratio</div>
        <div className="metric-row">
          <div className="metric-box">
            <div className="m-label">Raw Composite</div>
            <div className="m-val">{casemix.rawComposite}</div>
            <div className="m-sub">Observed (unadjusted)</div>
          </div>
          <div
            className="metric-box"
            style={{
              borderColor: "var(--accent)",
              background: "var(--accent-soft)",
            }}
          >
            <div className="m-label">O/E Ratio</div>
            <div
              className="m-val"
              style={{
                color:
                  casemix.oeRatio >= 1
                    ? "var(--perf-target)"
                    : "var(--perf-floor)",
              }}
            >
              {casemix.oeRatio.toFixed(2)}
            </div>
            <div className="m-sub">
              {casemix.oeRatio >= 1
                ? "Outperforming expectations"
                : "Underperforming expectations"}
            </div>
          </div>
          <div className="metric-box">
            <div className="m-label">Adj Composite</div>
            <div className="m-val" style={{ color: "var(--accent)" }}>
              {casemix.adjComposite}
            </div>
            <div className="m-sub">
              Δ {casemix.adjDelta >= 0 ? "+" : ""}
              {casemix.adjDelta} pts
            </div>
          </div>
        </div>
        <div className="l2-card" style={{ marginTop: 10 }}>
          <p
            style={{
              font: "400 12px/18px var(--font-sans)",
              color: "var(--fg-secondary)",
              margin: 0,
            }}
          >
            {casemix.oeInterp} An O/E ratio &gt; 1.0 means the provider is
            delivering better outcomes than predicted for their panel. O/E &lt;
            1.0 means underperforming relative to expected performance for this
            case mix.
          </p>
        </div>
      </div>

      {/* Case-mix variable table */}
      <div className="l2-section">
        <div className="l2-section-title">Case-Mix Variables</div>
        <table className="l2-table">
          <thead>
            <tr>
              <th>Variable</th>
              <th>This Provider</th>
              <th>Network Mean</th>
              <th>Difference</th>
              <th>Direction</th>
            </tr>
          </thead>
          <tbody>
            {casemix.variables.map((v) => (
              <tr key={v.name}>
                <td
                  style={{
                    font: "500 12px var(--font-sans)",
                    color: "var(--fg-primary)",
                  }}
                >
                  {v.name}
                </td>
                <td
                  style={{
                    font: "600 12px var(--font-mono)",
                    color: "var(--fg-primary)",
                  }}
                >
                  {typeof v.prov === "number" ? v.prov.toFixed(1) : v.prov}
                </td>
                <td
                  style={{
                    font: "400 12px var(--font-mono)",
                    color: "var(--fg-secondary)",
                  }}
                >
                  {typeof v.net === "number" ? v.net.toFixed(1) : v.net}
                </td>
                <td
                  style={{
                    font: "500 12px var(--font-mono)",
                    color: v.harder
                      ? "var(--perf-floor)"
                      : "var(--perf-target)",
                  }}
                >
                  {v.diff}
                </td>
                <td>
                  <span
                    style={{
                      font: "500 10px var(--font-mono)",
                      padding: "2px 7px",
                      borderRadius: 4,
                      letterSpacing: ".03em",
                      background: v.harder
                        ? "var(--perf-floor-soft)"
                        : "var(--perf-target-soft)",
                      color: v.harder
                        ? "var(--perf-floor)"
                        : "var(--perf-target)",
                      border: ".5px solid currentColor",
                    }}
                  >
                    {v.harder ? "Harder case mix" : "Easier case mix"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Panel comparison */}
      <div className="l2-section">
        <div className="l2-section-title">
          Panel vs Network — Variable Comparison
        </div>
        <div className="l2-card" style={{ overflowX: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {casemix.variables.map((v) => {
              const mx = Math.max(v.prov, v.net) * 1.25;
              return (
                <div key={v.name}>
                  <div
                    style={{
                      font: "500 10px var(--font-mono)",
                      color: "var(--fg-tertiary)",
                      letterSpacing: ".04em",
                      marginBottom: 4,
                      textTransform: "uppercase",
                    }}
                  >
                    {v.name}
                  </div>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 3 }}
                  >
                    {[
                      {
                        label: "Provider",
                        val: v.prov,
                        color: "var(--accent)",
                      },
                      {
                        label: "Network",
                        val: v.net,
                        color: "var(--bg-muted)",
                      },
                    ].map((bar) => (
                      <div
                        key={bar.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            width: 52,
                            font: "400 10px var(--font-mono)",
                            color: "var(--fg-tertiary)",
                            textAlign: "right",
                          }}
                        >
                          {bar.label}
                        </span>
                        <div
                          style={{
                            flex: 1,
                            height: 12,
                            background: "var(--bg-elevated)",
                            borderRadius: 3,
                            overflow: "hidden",
                            border: ".5px solid var(--border-default)",
                          }}
                        >
                          <div
                            style={{
                              width: (bar.val / mx) * 100 + "%",
                              height: "100%",
                              background: bar.color,
                              opacity:
                                bar.color === "var(--bg-muted)" ? 0.5 : 0.85,
                            }}
                          />
                        </div>
                        <span
                          style={{
                            width: 36,
                            font: "600 10px var(--font-mono)",
                            color: "var(--fg-primary)",
                          }}
                        >
                          {bar.val.toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Impact quantification */}
      <div className="l2-section">
        <div className="l2-section-title">
          Per-Variable Score Impact (Raw → Adjusted)
        </div>
        <div className="l2-card">
          <p
            style={{
              font: "400 11px/16px var(--font-sans)",
              color: "var(--fg-secondary)",
              margin: "0 0 14px",
            }}
          >
            Ranked by absolute impact. Green = variable shifted score upward;
            red = downward.
          </p>
          <ImpactBarChart items={impactItems} />
        </div>
      </div>
    </SlidePanel>
  );
}
export { SlidePanel, PanelL2A, PanelL2B, PanelL2C };
