import { fmtSAR } from "@/utils/helpers";
import PulseCard from "./PulseCard";

function PortfolioPulse({ p }) {
  const compDelta = (p.composite - p.compositePrior).toFixed(1);
  const beneDelta = p.beneficiaries - p.beneficiariesHistory[2];
  const promsDelta = p.promsRate - p.promsPrior;
  return (
    <section className="pulse-row" aria-label="Portfolio pulse">
      <PulseCard
        title="Active Contracts"
        value={p.active}
        sub="2 in draft · 0 expiring"
        history={[3, 4, 4, 5]}
        accent="var(--fg-secondary)"
      />
      <PulseCard
        title="Portfolio Composite"
        value={p.composite.toFixed(1)}
        unit="/ 100"
        deltaText={`+${compDelta} vs Q4`}
        deltaTier="up"
        sub="Weighted across 5 contracts"
        history={p.compositeHistory}
        accent="oklch(0.55 0.16 145)"
      />
      <PulseCard
        title="Beneficiary Population"
        value={p.beneficiaries.toLocaleString()}
        deltaText={`+${beneDelta.toLocaleString()} vs Q4`}
        deltaTier="up"
        sub="Attributed across all contracts"
        history={p.beneficiariesHistory}
        accent="var(--accent)"
      />
      <PulseCard
        alert
        title="Contracts at Risk"
        value={p.atRisk}
        deltaText="+1 vs Q4"
        deltaTier="down"
        sub="AFHSR · Al-Hada"
        history={p.atRiskHistory}
        accent="oklch(0.62 0.18 25)"
      />
      <PulseCard
        title="Pending Settlements"
        value={p.settlementsCount}
        sub={fmtSAR(p.settlementsValue) + " total"}
        history={p.settlementsHistory}
        accent="oklch(0.60 0.14 50)"
      />
      <PulseCard
        title="PROMs Collection Rate"
        value={p.promsRate}
        unit="%"
        deltaText={`+${promsDelta} pp vs Q4`}
        deltaTier="up"
        sub="Network minimum 70%"
        history={p.promsHistory}
        accent="oklch(0.55 0.16 305)"
      />
    </section>
  );
}

export default PortfolioPulse;
