import { useState } from "react";
import ProviderComparison from "./ProviderComparison";
import { L3APeerGroup, L3BStats } from "./L3APeerGroup";
import { L3ANetworkAdequacy, L3BBenefitDesign } from "./L3ANetworkAdequacy";
import ProviderTiering from "./Tiering";
import Link from "next/link";

export default function ComparisonView() {
  const [screen, setScreen] = useState("comparison");
  const [theme, setTheme] = useState("light");
  const [l3, setL3] = useState(null); // {type:"peergroup"|"stats"|"adequacy"|"benefit"}
  const [toast, setToast] = useState({ msg: "", visible: false });

  return (
    <>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 14,
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
          Provider Performance
        </span>
        <span>›</span>
        <span style={{ color: "var(--fg-primary)", fontWeight: 500 }}>
          {screen === "comparison"
            ? "Comparison & Benchmarking"
            : "Tiering & Network Intelligence"}
        </span>
      </div>

      {screen === "comparison" && (
        <ProviderComparison
          onOpenPeerGroup={() => setL3({ type: "peergroup" })}
          onOpenStats={() => setL3({ type: "stats" })}
          onSwitchToTiering={() => setScreen("tiering")}
        />
      )}

      {screen === "tiering" && (
        <ProviderTiering
          onOpenNetworkAdequacy={() => setL3({ type: "adequacy" })}
          onOpenBenefitDesign={() => setL3({ type: "benefit" })}
          onSwitchToComparison={() => setScreen("comparison")}
        />
      )}

      <L3APeerGroup
        open={l3?.type === "peergroup"}
        onClose={() => setL3(null)}
      />
      <L3BStats open={l3?.type === "stats"} onClose={() => setL3(null)} />
      <L3ANetworkAdequacy
        open={l3?.type === "adequacy"}
        onClose={() => setL3(null)}
      />
      <L3BBenefitDesign
        open={l3?.type === "benefit"}
        onClose={() => setL3(null)}
      />

      {/* Toast */}
      <div className={"toast" + (toast.visible ? " show" : "")}>
        {toast.msg}
      </div>
    </>
  );
}
