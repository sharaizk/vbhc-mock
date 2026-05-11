import { Icons } from "@/components/Icons/Icons";
import Sparkline from "./Sparkline";

function PulseCard({
  title,
  value,
  unit,
  sub,
  deltaText,
  deltaTier,
  history,
  accent,
  alert,
}) {
  return (
    <div className={"pulse-card" + (alert ? " is-alert" : "")}>
      <div className="pulse-head">
        <span className="lbl">{title}</span>
        {deltaText && (
          <span className={"pulse-delta tier-" + deltaTier}>
            {deltaTier === "down"
              ? Icons.arrowDn
              : deltaTier === "up"
                ? Icons.arrowUp
                : null}
            <span>{deltaText}</span>
          </span>
        )}
      </div>
      <div className="pulse-value">
        <span className="num">{value}</span>
        {unit && <span className="unit">{unit}</span>}
      </div>
      <div className="pulse-foot">
        <span className="sub">{sub}</span>
        <Sparkline data={history} color={accent || "var(--fg-secondary)"} />
      </div>
    </div>
  );
}

export default PulseCard;
