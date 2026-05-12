import { NETWORK_STATS } from "@/mock/organization";

export default function NetworkSummary() {
  const s = NETWORK_STATS;
  const fmt = (n) => n.toLocaleString("en-US");
  return (
    <div className="or-summary">
      <div>
        <div className="lbl">Facilities</div>
        <div className="num">{s.facilities}</div>
      </div>
      <div>
        <div className="lbl">Providers</div>
        <div className="num">{s.providers}</div>
      </div>
      <div>
        <div className="lbl">Patients</div>
        <div className="num">{fmt(s.livesAttributed)}</div>
      </div>
      <div>
        <div className="lbl">Active Contracts</div>
        <div className="num">{s.contractsActive}</div>
      </div>
    </div>
  );
}
