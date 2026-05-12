import { Icons } from "@/components/Icons/Icons";

export default function OrgDrawer({ org, onClose }) {
  return (
    <>
      <div className="or-drawer-scrim" onClick={onClose} />
      <div className="or-drawer" role="dialog" aria-label={org.name}>
        <div className="or-drawer-head">
          <div style={{ flex: 1 }}>
            <div className="crumb">L0 · Organization · {org.code}</div>
            <h2>{org.name}</h2>
            <p className="desc">{org.notes}</p>
            <div className="meta">
              <span
                className={`or-pill ${org.role === "Purchaser" ? "role-senior" : "role-head"}`}
              >
                {org.role}
              </span>
              <span className="or-pill">{org.type}</span>
              {org.accreditation.map((a) => (
                <span key={a} className="or-pill acc">
                  {a}
                </span>
              ))}
            </div>
          </div>
          <button className="or-drawer-x" onClick={onClose} aria-label="Close">
            {Icons.close}
          </button>
        </div>
        <div className="or-drawer-body">
          <div className="or-section">
            <h3>Headline</h3>
            <div className="or-stats">
              <div>
                <div className="num">{org.contractsActive}</div>
                <div className="lbl">Active contracts</div>
              </div>
              <div>
                <div className="num">{org.contractsDraft}</div>
                <div className="lbl">Draft contracts</div>
              </div>
              <div>
                <div className="num">
                  {(org.livesAttributed / 1000).toFixed(0)}k
                </div>
                <div className="lbl">Patients</div>
              </div>
              <div>
                <div className="num">{org.onboarded}</div>
                <div className="lbl">Onboarded</div>
              </div>
            </div>
          </div>
          <div className="or-section">
            <h3>Identification</h3>
            <div className="or-meta-grid">
              <div className="item">
                <b>Org ID</b>
                <p>
                  {org.id} · {org.code}
                </p>
              </div>
              <div className="item">
                <b>Legal entity</b>
                <p>{org.legal}</p>
              </div>
              <div className="item">
                <b>Type</b>
                <p>{org.type}</p>
              </div>
              <div className="item">
                <b>Address</b>
                <p>{org.address}</p>
              </div>
              <div className="item">
                <b>Region</b>
                <p>
                  {org.region} ({org.governorate})
                </p>
              </div>
              <div className="item">
                <b>Parent</b>
                <p>{org.parent || "—"}</p>
              </div>
            </div>
          </div>
          <div className="or-section">
            <h3>Point of contact</h3>
            <div className="or-meta-grid">
              <div className="item">
                <b>Name</b>
                <p>{org.pocName}</p>
              </div>
              <div className="item">
                <b>Role</b>
                <p>{org.pocRole}</p>
              </div>
              <div className="item">
                <b>Email</b>
                <p>{org.pocEmail}</p>
              </div>
              <div className="item">
                <b>Phone</b>
                <p>{org.pocPhone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
