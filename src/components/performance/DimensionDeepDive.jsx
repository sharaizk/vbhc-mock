"use client";
import { CONTRACT1_DIMS, DIM_SCORES_C1, S9_DIMENSIONS, VBHC_MEASURES_C1 } from "@/mock/performance";
import React from "react";
import { AiqlLayout, DimHeader, DimTabSelector, IchomLayout } from "./DimHeader";
import { L2AVariableExplorer, L2BPromsTrajectory, L2CMeasureDeepDive } from "./L2AVariableExplorer";
import { L3AExclusionAudit, L3BStratification, L3CTemporal } from "./L3AExclusionAudit";
import Link from "next/link";
const { useState, useMemo, useEffect } = React;

/* ── Measures grouped by dimension ─────────────────────────────────────── */
const MEASURES_BY_DIM = {
  D1: [],
  D2: [],
  D3: [],
  D4: [],
  D5: VBHC_MEASURES_C1.filter((m) => m.dim === "D5"),
  D6: [],
  D7: VBHC_MEASURES_C1.filter((m) => m.dim === "D7"),
  D8: [],
  D9: VBHC_MEASURES_C1.filter((m) => m.dim === "D9"),
  D10: [],
};

function DimensionDeepDive() {
  const [dimId, setDimId] = useState("D1");
  const [l2, setL2] = useState(null); // {type:"A"|"B"|"C", set?, measure?}
  const [l3, setL3] = useState(null); // {type:"exAudit"|"strat"|"cohort"}
  const [toast, setToast] = useState({ msg: "", visible: false });

  useEffect(() => {
    window.__toast = (msg) => {
      setToast({ msg, visible: true });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
    };
  }, []);

  function showToast(msg) {
    setToast({ msg, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  }

  const activeDims = Object.keys(CONTRACT1_DIMS);
  const score = DIM_SCORES_C1[dimId] || 75;
  const weight = CONTRACT1_DIMS[dimId] || 0;
  const isIchom = dimId === "D1" || dimId === "D2";
  const measures = MEASURES_BY_DIM[dimId] || [];

  return (
    <div>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 12,
          font: "400 12px var(--font-sans)",
          color: "var(--fg-tertiary)",
        }}
      >
        <Link
          href="/performance"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          ← Dashboard
        </Link>
        <span>›</span>
        <span style={{ color: "var(--fg-secondary)" }}>
          Dr. Fatima Al-Khalil
        </span>
        <span>›</span>
        <span style={{ color: "var(--fg-primary)", fontWeight: 500 }}>
          {S9_DIMENSIONS[dimId]?.name}
        </span>
      </div>

      {/* Header strip */}
      <DimHeader
        dimId={dimId}
        score={score}
        weight={weight}
        contract={{ dims: CONTRACT1_DIMS }}
      />

      {/* Dimension tab selector */}
      <DimTabSelector
        activeDim={dimId}
        activeDims={activeDims}
        onSelect={setDimId}
      />

      {/* Layer 1 content */}
      {isIchom ? (
        <IchomLayout
          dimId={dimId}
          onOpenL2A={(set) => setL2({ type: "A", set })}
          onOpenL2B={(set) => setL2({ type: "B", set })}
        />
      ) : (
        <AiqlLayout
          dimId={dimId}
          measures={measures}
          onMeasureClick={(measure) => setL2({ type: "C", measure })}
        />
      )}

      {/* L2 panels */}
      <L2AVariableExplorer
        open={l2?.type === "A"}
        onClose={() => setL2(null)}
        set={l2?.set}
        onOpenL3A={() => setL3({ type: "exAudit" })}
        onOpenL3B={() => setL3({ type: "strat" })}
      />

      <L2BPromsTrajectory
        open={l2?.type === "B"}
        onClose={() => setL2(null)}
        set={l2?.set}
      />

      <L2CMeasureDeepDive
        open={l2?.type === "C"}
        onClose={() => setL2(null)}
        measure={l2?.measure}
        dimId={dimId}
        onOpenL3A={() => setL3({ type: "exAudit" })}
        onOpenL3B={() => setL3({ type: "strat" })}
        onOpenL3C={() => setL3({ type: "cohort" })}
      />

      {/* L3 overlays */}
      <L3AExclusionAudit
        open={l3?.type === "exAudit"}
        onClose={() => setL3(null)}
        measureName="D1-001: HbA1c Control Rate"
      />

      <L3BStratification
        open={l3?.type === "strat"}
        onClose={() => setL3(null)}
      />

      <L3CTemporal open={l3?.type === "cohort"} onClose={() => setL3(null)} />

      {/* Toast */}
      <div className={"toast" + (toast.visible ? " show" : "")}>
        {toast.msg}
      </div>
    </div>
  );
}
export default DimensionDeepDive;
