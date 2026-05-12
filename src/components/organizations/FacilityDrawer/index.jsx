import { Icons } from "@/components/Icons/Icons";
import { DEPARTMENTS, DIM_LIST, DIM_NAMES, PROVIDERS } from "@/mock/organization";
import { scoreColor, typePill } from "@/utils/helpers";
import { useState } from "react";
import Score from "../Score";

export default function FacilityDrawer({ fac, onClose, onOpenProvider }) {
  const [tab, setTab] = useState("overview");
  const provs = PROVIDERS.filter((p) => p.facilityId === fac.id);
  const depts = DEPARTMENTS.filter((d) => d.facilityId === fac.id);

  return (
    <>
      <div className="or-drawer-scrim" onClick={onClose} />
      <div className="or-drawer" role="dialog" aria-label={fac.name}>
        <div className="or-drawer-head">
          <div style={{ flex: 1 }}>
            <div className="crumb">L1 · Facility · {fac.code}</div>
            <h2>{fac.name}</h2>
            <p className="desc">{fac.note}</p>
            <div className="meta">
              <span className={`or-pill ${typePill(fac.type)}`}>
                {fac.type}
              </span>
              <span className="or-pill gov">{fac.governorate}</span>
              <span className="or-pill ehr">EMRAM Stage {fac.ehrStage}</span>
              {fac.accreditation.map((a) => (
                <span key={a} className="or-pill acc">
                  {a}
                </span>
              ))}
            </div>
          </div>
          <Score n={fac.composite} lg />
          <button className="or-drawer-x" onClick={onClose} aria-label="Close">
            {Icons.close}
          </button>
        </div>
        <div className="or-drawer-tabs">
          <button
            className={tab === "overview" ? "on" : ""}
            onClick={() => setTab("overview")}
          >
            Overview
          </button>
          <button
            className={tab === "providers" ? "on" : ""}
            onClick={() => setTab("providers")}
          >
            Providers <span className="ct">{provs.length}</span>
          </button>
          <button
            className={tab === "depts" ? "on" : ""}
            onClick={() => setTab("depts")}
          >
            Departments <span className="ct">{depts.length}</span>
          </button>
          <button
            className={tab === "sets" ? "on" : ""}
            onClick={() => setTab("sets")}
          >
            ICHOM Sets <span className="ct">{fac.activeSets.length}</span>
          </button>
        </div>
        <div className="or-drawer-body">
          {tab === "overview" && (
            <>
              <div className="or-section">
                <h3>Capacity</h3>
                <div className="or-stats">
                  <div>
                    <div className="num">{fac.beds.toLocaleString()}</div>
                    <div className="lbl">Beds</div>
                  </div>
                  <div>
                    <div className="num">{fac.ors}</div>
                    <div className="lbl">Operating rooms</div>
                  </div>
                  <div>
                    <div className="num">{fac.clinics}</div>
                    <div className="lbl">Clinic rooms</div>
                  </div>
                  <div>
                    <div className="num">
                      {(fac.livesAttributed / 1000).toFixed(1)}k
                    </div>
                    <div className="lbl">Patients</div>
                  </div>
                </div>
              </div>
              <div className="or-section">
                <h3>Dimension performance</h3>
                <div className="or-dim-grid">
                  {DIM_LIST.map((d) => (
                    <div key={d} className="or-dim">
                      <div className="code">{d}</div>
                      <div className="nm">{DIM_NAMES[d]}</div>
                      <div className="row">
                        <div className="num">{fac.dim[d]}</div>
                        <div className="bar">
                          <span
                            style={{
                              width: `${fac.dim[d]}%`,
                              background: scoreColor(fac.dim[d]),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="or-section">
                <h3>Identification</h3>
                <div className="or-meta-grid">
                  <div className="item">
                    <b>Facility ID</b>
                    <p>
                      {fac.id} · {fac.code}
                    </p>
                  </div>
                  <div className="item">
                    <b>Level</b>
                    <p>
                      {fac.level} — {fac.type}
                    </p>
                  </div>
                  <div className="item">
                    <b>Address</b>
                    <p>{fac.address}</p>
                  </div>
                  <div className="item">
                    <b>Governorate</b>
                    <p>{fac.governorate}</p>
                  </div>
                  <div className="item">
                    <b>Director</b>
                    <p>{fac.director}</p>
                  </div>
                  <div className="item">
                    <b>Onboarded</b>
                    <p>{fac.onboarded}</p>
                  </div>
                </div>
              </div>
            </>
          )}
          {tab === "providers" && (
            <div className="or-list">
              {provs.map((p) => (
                <div
                  key={p.id}
                  className="or-list-row"
                  onClick={() => onOpenProvider(p)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={`or-avi ${p.gender === "F" ? "f" : "m"}`}>
                    {p.initials}
                  </div>
                  <div>
                    <div className="nm">{p.name}</div>
                    <div className="sub">
                      {p.specialty} · {p.role} · {p.id}
                    </div>
                  </div>
                  <span className={`or-pill ${rolePill(p.role)}`}>
                    {p.role}
                  </span>
                  <Score n={p.composite} />
                </div>
              ))}
            </div>
          )}
          {tab === "depts" && (
            <div className="or-list">
              {depts.map((d) => {
                const ct = provs.filter((p) => p.department === d.name).length;
                return (
                  <div key={d.id} className="or-list-row compact">
                    <div
                      className="or-avi"
                      style={{
                        background: "var(--bg-elevated)",
                        color: "var(--fg-secondary)",
                      }}
                    >
                      {d.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="nm">{d.name}</div>
                      <div className="sub">
                        {d.id} · {ct} provider{ct === 1 ? "" : "s"}
                      </div>
                    </div>
                    <span className="or-pill">{ct} FTE</span>
                  </div>
                );
              })}
            </div>
          )}
          {tab === "sets" && (
            <div className="or-list">
              {fac.activeSets.map((s) => (
                <div key={s} className="or-list-row compact">
                  <div
                    className="or-avi"
                    style={{
                      background: "oklch(0.94 0.06 305)",
                      color: "oklch(0.42 0.14 305)",
                    }}
                  >
                    S
                  </div>
                  <div>
                    <div className="nm">{s}</div>
                    <div className="sub">
                      ICHOM Set · contracted at {fac.code}
                    </div>
                  </div>
                  <span className="or-pill acc">Active</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
