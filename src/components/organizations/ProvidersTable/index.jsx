import { FACILITIES } from "@/mock/organization";
import { rolePill } from "@/utils/helpers";
import Score from "../Score";

export default function ProvidersTable({ providers, onOpen }) {
  return (
    <div className="or-tbl">
      <div className="row head prv-row">
        <div>ID</div>
        <div>Provider</div>
        <div>Specialty</div>
        <div>Facility</div>
        <div>Role</div>
        <div>Status</div>
        <div>Contracts</div>
        <div>Score</div>
      </div>
      {providers.map((p) => {
        const fac = FACILITIES.find((f) => f.id === p.facilityId);
        return (
          <div
            key={p.id}
            className="row body prv-row"
            onClick={() => onOpen(p)}
          >
            <div className="or-cell-id">{p.id}</div>
            <div className="or-prov-name">
              <div className={`or-avi ${p.gender === "F" ? "f" : "m"}`}>
                {p.initials}
              </div>
              <div>
                <div className="nm">{p.name}</div>
                <div className="sub">{p.npi}</div>
              </div>
            </div>
            <div className="or-cell-name">
              <div
                className="nm"
                style={{ font: "500 13px/16px var(--font-sans)" }}
              >
                {p.specialty}
              </div>
              <div className="sub">
                {p.specCode} · {p.yearsExperience}y · panel{" "}
                {p.panelSize.toLocaleString()}
              </div>
            </div>
            <div className="or-cell-name">
              <div
                className="nm"
                style={{ font: "500 13px/16px var(--font-sans)" }}
              >
                {fac.code}
              </div>
              <div className="sub">{p.department}</div>
            </div>
            <div>
              <span className={`or-pill ${rolePill(p.role)}`}>{p.role}</span>
            </div>
            <div>
              <span className={`or-pill status-${p.status.toLowerCase()}`}>
                {p.status}
              </span>
            </div>
            <div className="or-contracts">
              {p.contracts.length === 0 ? (
                <span className="or-ct-pill empty">none</span>
              ) : (
                p.contracts.slice(0, 3).map((c) => (
                  <span key={c} className="or-ct-pill">
                    {c}
                  </span>
                ))
              )}
            </div>
            <div>
              <Score n={p.composite} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
