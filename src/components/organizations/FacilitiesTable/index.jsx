import { FACILITY_PROVIDER_COUNTS } from "@/mock/organization";
import { typePill } from "@/utils/helpers";
import Score from "../Score";

export default function FacilitiesTable({ facilities, onOpen }) {
  return (
    <div className="or-tbl">
      <div className="row head fac-row">
        <div>ID</div>
        <div>Facility</div>
        <div>Type</div>
        <div>Beds</div>
        <div>Providers</div>
        <div>Active Sets</div>
        <div>EHR</div>
        <div>Score</div>
      </div>
      {facilities.map((f) => {
        const counts = FACILITY_PROVIDER_COUNTS[f.id];
        const sets = f.activeSets.length;
        return (
          <div
            key={f.id}
            className="row body fac-row"
            onClick={() => onOpen(f)}
          >
            <div className="or-cell-id">{f.code}</div>
            <div className="or-cell-name">
              <div className="nm">{f.name}</div>
              <div className="sub">
                {f.governorate} · {f.address}
              </div>
            </div>
            <div>
              <span className={`or-pill ${typePill(f.type)}`}>{f.type}</span>
            </div>
            <div className="or-cell-mono">{f.beds}</div>
            <div className="or-cell-mono">{counts}</div>
            <div className="or-cell-mono">{sets} Sets</div>
            <div>
              <div className="or-mini-bar" title={`HIMSS EMRAM ${f.ehrStage}`}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <span
                    key={i}
                    className={"seg" + (i < f.ehrStage ? " on" : "")}
                  />
                ))}
              </div>
            </div>
            <div>
              <Score n={f.composite} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
