"use client";
import {
  VBHC_CONTRACTS,
  VBHC_getProviderComposites,
  VBHC_getProviderDimScores,
  VBHC_MEASURES_C1,
  VBHC_PROVIDERS,
} from "@/mock/performance";
import React, { useState } from "react";
import { ZoneA, ZoneB, ZoneC, ZoneD, ZoneE } from "./PerfomanceZones";
import { PanelL2A, PanelL2B, PanelL2C } from "./PerfL2";
import L3AMethodology from "./L3AMethodology";
import { L3BLineage, L3CApproval } from "./L3BLineage";
import ReasoningTraceExplorer from "./ReasoningTraceExplorer";
import { useRouter } from "next/navigation";
const { useEffect, useMemo } = React;

function Toast({ message, visible }) {
  return <div className={"toast" + (visible ? " show" : "")}>{message}</div>;
}

function RoleToggle({ role, onChange }) {
  const roles = [
    { id: "manager", label: "Contract Mgr" },
    { id: "analyst", label: "Analyst" },
    { id: "provider", label: "Provider" },
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "3px",
        background: "var(--bg-elevated)",
        border: ".5px solid var(--border-default)",
        borderRadius: 9999,
        boxShadow: "var(--shadow-pill)",
      }}
    >
      <span
        style={{
          font: "500 9px var(--font-mono)",
          color: "var(--fg-tertiary)",
          letterSpacing: ".06em",
          textTransform: "uppercase",
          padding: "0 6px",
        }}
      >
        Role
      </span>
      {roles.map((r) => (
        <button
          key={r.id}
          onClick={() => onChange(r.id)}
          style={{
            padding: "4px 10px",
            borderRadius: 9999,
            border: 0,
            cursor: "pointer",
            font: "500 11px var(--font-sans)",
            background: role === r.id ? "var(--accent)" : "transparent",
            color:
              role === r.id ? "var(--fg-on-accent)" : "var(--fg-secondary)",
            transition: "all .12s",
          }}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

function ProviderDashboard({ role }) {
  const [providerId, setProviderId] = useState("P01");
  const [contractId, setContractId] = useState("C1");
  const [periodIdx, setPeriodIdx] = useState(3);
  const [l2, setL2] = useState(null);
  const [l3, setL3] = useState(null); // {type:"methodology"|"lineage"|"approval"|"trace", measure?}
  const [toast, setToast] = useState({ msg: "", visible: false });
  const router = useRouter();

  const provider = useMemo(
    () => VBHC_PROVIDERS.find((p) => p.id === providerId) || VBHC_PROVIDERS[0],
    [providerId],
  );
  const contract = useMemo(
    () => VBHC_CONTRACTS.find((c) => c.id === contractId) || VBHC_CONTRACTS[0],
    [contractId],
  );

  useEffect(() => {
    if (!provider.contracts.includes(contractId))
      setContractId(provider.contracts[0]);
  }, [providerId]);

  useEffect(() => {
    window.__toast = (msg) => {
      setToast({ msg, visible: true });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
    };
    // Wire "View Full Trace" globally
    window.__openTrace = (measure) => setL3({ type: "trace", measure });
    window.__openMethodology = (measure) =>
      setL3({ type: "methodology", measure });
    window.__openLineage = (measure) => setL3({ type: "lineage", measure });
  }, []);

  function showToast(msg) {
    setToast({ msg, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  }

  const composites = useMemo(
    () => VBHC_getProviderComposites(provider, contract),
    [provider, contract],
  );
  const dimScores = useMemo(
    () => VBHC_getProviderDimScores(provider, contract, periodIdx),
    [provider, contract, periodIdx],
  );
  const measures = VBHC_MEASURES_C1;

  // L2 helpers
  function openL2A() {
    setL2({ type: "A" });
  }
  function openL2B(measure) {
    setL2({ type: "B", measure });
  }
  function openL2C() {
    setL2({ type: "C" });
  }
  function closeL2() {
    setL2(null);
  }

  function handleAlertClick(alert) {
    if (alert.measureId) {
      const m = measures.find((x) => x.id === alert.measureId);
      if (m) openL2B(m);
    } else {
      showToast("Navigates to CAP Management (Session 11)");
    }
  }
  function handleAxisClick(ax) {
    router.push(`/performance/${ax.short?.toLowerCase()}`);
  }
  function handleWaterfallDimClick(dimKey) {
    if (dimKey === "risk") {
      openL2C();
      return;
    }
    showToast(
      "Navigates to Dimension Deep-Dive (Session 9): " +
        (VBHC_DIMENSIONS[dimKey] || {}).name,
    );
  }

  const canApprove = role === "manager" || role === "analyst";

  return (
    <div className="dash-layout">
      <ZoneA
        provider={provider}
        contract={contract}
        periodIdx={periodIdx}
        onProvider={(id) => setProviderId(id)}
        onContract={(id) => setContractId(id)}
        onPeriod={(i) => setPeriodIdx(i)}
      />

      <div className="zone-mid">
        <ZoneB
          composites={composites}
          periodIdx={periodIdx}
          onPeriod={setPeriodIdx}
          onClick={openL2A}
        />
        <ZoneC
          dimScores={dimScores}
          contract={contract}
          onAxisClick={handleAxisClick}
        />
      </div>

      <ZoneD
        measures={measures}
        provider={provider}
        contract={contract}
        periodIdx={periodIdx}
        onRowClick={openL2B}
        onAdjClick={() => openL2C()}
      />

      <ZoneE provider={provider} onAlertClick={handleAlertClick} />

      {/* L2 panels */}
      <PanelL2A
        open={l2?.type === "A"}
        onClose={closeL2}
        provider={provider}
        contract={contract}
        periodIdx={periodIdx}
        dimScores={dimScores}
        composites={composites}
        onDimClick={handleWaterfallDimClick}
        onApprove={canApprove ? () => setL3({ type: "approval" }) : null}
      />

      <PanelL2B
        open={l2?.type === "B"}
        onClose={closeL2}
        measure={l2?.measure || null}
        provider={provider}
        contract={contract}
        periodIdx={periodIdx}
        onOpenL2C={openL2C}
        onOpenMethodology={() =>
          setL3({ type: "methodology", measure: l2?.measure })
        }
        onOpenLineage={() => setL3({ type: "lineage", measure: l2?.measure })}
        onOpenTrace={() => setL3({ type: "trace", measure: l2?.measure })}
      />

      <PanelL2C
        open={l2?.type === "C"}
        onClose={closeL2}
        provider={provider}
        contract={contract}
        periodIdx={periodIdx}
      />

      {/* Session 8B overlays */}
      <L3AMethodology
        open={l3?.type === "methodology"}
        onClose={() => setL3(null)}
        measure={l3?.measure}
      />

      <L3BLineage
        open={l3?.type === "lineage"}
        onClose={() => setL3(null)}
        measure={l3?.measure}
      />

      <L3CApproval
        open={l3?.type === "approval"}
        onClose={() => setL3(null)}
        provider={provider}
        contract={contract}
        periodIdx={periodIdx}
        role={role}
      />

      <ReasoningTraceExplorer
        open={l3?.type === "trace"}
        onClose={() => setL3(null)}
        defaultProvider={providerId}
        defaultContract={contractId}
        defaultPeriod={periodIdx}
        defaultMeasure={l3?.measure}
      />

      <Toast message={toast.msg} visible={toast.visible} />
    </div>
  );
}

export default ProviderDashboard;
// export { Toast, RoleToggle };
