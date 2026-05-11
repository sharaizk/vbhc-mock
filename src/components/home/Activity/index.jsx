import { Icons } from "@/components/Icons/Icons";
import "./activity.css";
function Activity({ items }) {
  return (
    <section className="act-strip">
      <div className="act-strip-head">
        <div className="crumb">Audit trail · last 5 days</div>
        <h2>Recent Activity</h2>
        <button className="act-all">View full log {Icons.arrowR}</button>
      </div>
      <ol className="act-track">
        {items.map((it, i) => (
          <li key={i} className="act-chip">
            <span className="act-chip-time">{it.t}</span>
            <span className="act-chip-rule" />
            <span className="act-chip-text">
              {it.text}
              <em>{it.em}</em>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default Activity;
