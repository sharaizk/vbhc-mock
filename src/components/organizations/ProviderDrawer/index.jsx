import { FACILITIES } from "@/mock/organization";
import { rolePill } from "@/utils/helpers";
import Score from "../Score";
import { Icons } from "@/components/Icons/Icons";

export default function ProviderDrawer({ prv, onClose }) {
  const fac = FACILITIES.find((f) => f.id === prv.facilityId);
  return (
    <>
      <div className="or-drawer-scrim" onClick={onClose} />
      <div className="or-drawer" role="dialog" aria-label={prv.name}>
        <div className="or-drawer-head">
          <div style={{ flex: 1 }}>
            <div className="crumb">Provider · {prv.id}</div>
            <div className="or-prv-hero">
              <div className={`or-avi ${prv.gender === "F" ? "f" : "m"}`}>
                {prv.initials}
              </div>
              <div>
                <div className="nm">{prv.name}</div>
                <div className="sub">
                  {prv.specialty} · {prv.role} · {prv.npi}
                </div>
              </div>
            </div>
            <div className="meta" style={{ marginTop: 14 }}>
              <span className={`or-pill ${rolePill(prv.role)}`}>
                {prv.role}
              </span>
              <span className={`or-pill status-${prv.status.toLowerCase()}`}>
                {prv.status}
              </span>
              {prv.board && (
                <span className="or-pill acc">Board-certified</span>
              )}
              <span className="or-pill">{fac.code}</span>
              <span className="or-pill">{prv.department}</span>
            </div>
          </div>
          <Score n={prv.composite} lg />
          <button className="or-drawer-x" onClick={onClose} aria-label="Close">
            {Icons.close}
          </button>
        </div>
        <div className="or-drawer-body">
          <div className="or-section">
            <h3>Headline</h3>
            <div className="or-stats">
              <div>
                <div className="num">{prv.composite}</div>
                <div className="lbl">Composite</div>
              </div>
              <div>
                <div className="num">{prv.panelSize.toLocaleString()}</div>
                <div className="lbl">Panel size</div>
              </div>
              <div>
                <div className="num">{prv.promsRate}%</div>
                <div className="lbl">PROMs response</div>
              </div>
              <div>
                <div className="num">{prv.ehrCompleteness}%</div>
                <div className="lbl">EHR completeness</div>
              </div>
            </div>
          </div>
          <div className="or-section">
            <h3>Identification</h3>
            <div className="or-meta-grid">
              <div className="item">
                <b>Provider ID</b>
                <p>{prv.id}</p>
              </div>
              <div className="item">
                <b>National licence</b>
                <p>{prv.npi}</p>
              </div>
              <div className="item">
                <b>Facility</b>
                <p>
                  {fac.code} — {fac.name}
                </p>
              </div>
              <div className="item">
                <b>Department</b>
                <p>{prv.department}</p>
              </div>
              <div className="item">
                <b>Specialty</b>
                <p>
                  {prv.specialty} ({prv.specCode})
                </p>
              </div>
              <div className="item">
                <b>Years of experience</b>
                <p>{prv.yearsExperience} years</p>
              </div>
              <div className="item">
                <b>Start date</b>
                <p>{prv.startDate}</p>
              </div>
              <div className="item">
                <b>Languages</b>
                <p>{prv.languages.join(", ")}</p>
              </div>
              <div className="item">
                <b>Email</b>
                <p>{prv.email}</p>
              </div>
              <div className="item">
                <b>Board status</b>
                <p>{prv.board ? "Board-certified" : "Not board-certified"}</p>
              </div>
            </div>
          </div>
          <div className="or-section">
            <h3>
              Active contracts{" "}
              <span
                style={{
                  color: "var(--fg-tertiary)",
                  fontWeight: 400,
                  marginLeft: 6,
                }}
              >
                {prv.contracts.length}
              </span>
            </h3>
            {prv.contracts.length === 0 ? (
              <p
                style={{
                  font: "400 13px/19px var(--font-sans)",
                  color: "var(--fg-tertiary)",
                }}
              >
                Not currently included in any performance contract.
              </p>
            ) : (
              <div className="or-list">
                {prv.contracts.map((c) => (
                  <div key={c} className="or-list-row compact">
                    <div
                      className="or-avi"
                      style={{
                        background: "oklch(0.94 0.06 250)",
                        color: "oklch(0.42 0.14 250)",
                      }}
                    >
                      CT
                    </div>
                    <div>
                      <div className="nm">{c}</div>
                      <div className="sub">
                        Performance contract · MOD Health Services Authority
                      </div>
                    </div>
                    <span className="or-pill acc">Active</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
