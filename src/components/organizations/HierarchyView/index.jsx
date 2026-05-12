import {
  DEPARTMENTS,
  FACILITIES,
  FACILITY_PROVIDER_COUNTS,
  NETWORK_STATS,
  ORGS,
  PROVIDERS,
} from "@/mock/organization";
import Score from "../Score";

export default function HierarchyView({ onOpenOrg, onOpenFacility }) {
  const purchaser = ORGS.find((o) => o.role === "Purchaser");
  const provider = ORGS.find((o) => o.role === "Provider");
  const facilities = FACILITIES;
  const counts = FACILITY_PROVIDER_COUNTS;

  // Group departments into 5 columns by facility for the bottom tier.
  return (
    <div className="or-hier">
      <div className="or-hier-tier">
        <div className="or-hier-tier-label">
          <span className="lvl">L0 · Organizations</span>
          <span className="ttl">Purchaser &amp; Provider</span>
          <span className="desc">
            The two parties to every VBHC contract. The Authority pays; the
            Network delivers.
          </span>
          <span className="count">2 organizations</span>
        </div>
        <div className="or-org-row">
          <div className="or-org-card" onClick={() => onOpenOrg(purchaser)}>
            <div className="head">
              <span className="badge purchaser">Purchaser</span>
              <span className="id">{purchaser.code}</span>
            </div>
            <div>
              <h4 className="name">{purchaser.name}</h4>
              <p className="legal">{purchaser.legal}</p>
            </div>
            <div className="grid">
              <div className="col">
                <div className="num">{purchaser.contractsActive}</div>
                <div className="lbl">Active</div>
              </div>
              <div className="col">
                <div className="num">{purchaser.contractsDraft}</div>
                <div className="lbl">Draft</div>
              </div>
              <div className="col">
                <div className="num">
                  {(purchaser.livesAttributed / 1000).toFixed(0)}k
                </div>
                <div className="lbl">Patients</div>
              </div>
            </div>
          </div>
          <div className="or-org-card" onClick={() => onOpenOrg(provider)}>
            <div className="head">
              <span className="badge provider">Provider Org</span>
              <span className="id">{provider.code}</span>
            </div>
            <div>
              <h4 className="name">{provider.name}</h4>
              <p className="legal">{provider.legal}</p>
            </div>
            <div className="grid">
              <div className="col">
                <div className="num">{facilities.length}</div>
                <div className="lbl">Facilities</div>
              </div>
              <div className="col">
                <div className="num">{PROVIDERS.length}</div>
                <div className="lbl">Providers</div>
              </div>
              <div className="col">
                <div className="num">
                  {(provider.livesAttributed / 1000).toFixed(0)}k
                </div>
                <div className="lbl">Patients</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 2 — Facilities */}
      <div className="or-hier-tier">
        <div className="or-hier-tier-label">
          <span className="lvl">L1 · Facilities</span>
          <span className="ttl">Sites of care</span>
          <span className="desc">
            Five facilities under MOD-NET — one tertiary anchor, three regional
            referrals, one specialist polyclinic.
          </span>
          <span className="count">
            {facilities.length} facilities ·{" "}
            {NETWORK_STATS.beds.toLocaleString()} beds
          </span>
        </div>
        <div className="or-fac-row">
          {facilities.map((f) => (
            <div
              key={f.id}
              className="or-fac-chip"
              onClick={() => onOpenFacility(f)}
            >
              <div className="top">
                <span className="code">{f.code}</span>
                <Score n={f.composite} />
              </div>
              <div>
                <h4 className="nm">{f.name}</h4>
                <span
                  className="or-pill"
                  style={{ marginTop: 8, display: "inline-flex" }}
                >
                  {f.governorate}
                </span>
              </div>
              <div className="meta">
                <span>{f.beds} beds</span>
                <span>{counts[f.id]} providers</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tier 3 — Departments per facility */}
      <div className="or-hier-tier">
        <div className="or-hier-tier-label">
          <span className="lvl">L2 · Departments</span>
          <span className="ttl">Service lines</span>
          <span className="desc">
            Each facility runs a set of clinical departments. Department heads
            own their service-line scorecards.
          </span>
          <span className="count">{DEPARTMENTS.length} departments</span>
        </div>
        <div className="or-dept-grid">
          {facilities.map((f) => {
            const depts = DEPARTMENTS.filter((d) => d.facilityId === f.id);
            return (
              <div key={f.id} className="or-dept-col">
                <div className="head">
                  {f.code} · {depts.length}
                </div>
                {depts.map((d) => {
                  const ct = PROVIDERS.filter(
                    (p) => p.facilityId === f.id && p.department === d.name,
                  ).length;
                  return (
                    <div key={d.id} className="or-dept">
                      <span>{d.name}</span>
                      <span className="ct">{ct}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
