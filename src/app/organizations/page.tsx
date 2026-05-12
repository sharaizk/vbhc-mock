"use client";
import { Icons } from "@/components/Icons/Icons";
import { useTweaks } from "@/hooks/use-tweaks";
import { FACILITIES, PROVIDERS, TWEAK_DEFAULTS } from "@/mock/organization";
import React, { useMemo } from "react";
import "@/css/organizations.css";
import NetworkSummary from "@/components/organizations/NetworkSummary";
import HierarchyView from "@/components/organizations/HierarchyView";
import FacilitiesTable from "@/components/organizations/FacilitiesTable";
import ProvidersTable from "@/components/organizations/ProvidersTable";
import FacilityDrawer from "@/components/organizations/FacilityDrawer";
import ProviderDrawer from "@/components/organizations/ProviderDrawer";
import OrgDrawer from "@/components/organizations/OrgDrawer";
const { useState, useEffect: useRegEffect } = React;

export default function Ichom() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useState(t.defaultView || "hierarchy");
  const [q, setQ] = useState("");

  useRegEffect(() => {
    const root = document.documentElement;
    root.dataset.density = t.density;
    root.dataset.scoreStyle = t.scoreStyle;
    root.dataset.hideId = t.showIdColumns ? "" : "1";
    root.style.setProperty("--accent", t.accent);
  }, [t.density, t.scoreStyle, t.showIdColumns, t.accent]);

  const [facFilter, setFacFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openFac, setOpenFac] = useState(null);
  const [openPrv, setOpenPrv] = useState(null);
  const [openOrg, setOpenOrg] = useState(null);

  const filteredFacilities = useMemo(() => {
    const ql = q.toLowerCase();
    return FACILITIES.filter(
      (f) =>
        !ql ||
        f.name.toLowerCase().includes(ql) ||
        f.code.toLowerCase().includes(ql) ||
        f.governorate.toLowerCase().includes(ql) ||
        f.type.toLowerCase().includes(ql),
    );
  }, [q]);

  const filteredProviders = useMemo(() => {
    const ql = q.toLowerCase();
    return PROVIDERS.filter((p) => {
      if (facFilter !== "all" && p.facilityId !== facFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (!ql) return true;
      return (
        p.name.toLowerCase().includes(ql) ||
        p.specialty.toLowerCase().includes(ql) ||
        p.department.toLowerCase().includes(ql) ||
        p.id.toLowerCase().includes(ql) ||
        p.npi.toLowerCase().includes(ql)
      );
    });
  }, [q, facFilter, statusFilter]);

  return (
    <>
      <div className="page-head">
        <div>
          <div className="crumb">
            Module 1 · Session 4 · Organization &amp; Provider Registry
          </div>
          <h1>Organization &amp; Provider Registry</h1>
          {t.showHeaderDesc && (
            <p className="desc">
              Manage purchaser and provider organizations, their facilities and
              the clinicians who deliver care under VBHC contracts. Synthetic
              MOD network for prototyping — 1 purchaser, 1 provider org, 5
              facilities, {PROVIDERS.length} providers.
            </p>
          )}
        </div>
        <div className="or-toolbar">
          <button className="btn primary">
            {Icons.plus || "+"} Add organization
          </button>
          <button className="btn secondary">Import facility roster</button>
        </div>
      </div>

      {t.showSummary && <NetworkSummary />}

      <div className="or-views">
        <div className="or-tabs" role="tablist">
          <button
            className={view === "hierarchy" ? "on" : ""}
            onClick={() => setView("hierarchy")}
          >
            Hierarchy
          </button>
          <button
            className={view === "facilities" ? "on" : ""}
            onClick={() => setView("facilities")}
          >
            Facilities
          </button>
          <button
            className={view === "providers" ? "on" : ""}
            onClick={() => setView("providers")}
          >
            Providers
          </button>
        </div>

        <div className="or-filters">
          <div className="filter-search or-search">
            {Icons.search}
            <input
              placeholder={
                view === "providers"
                  ? "Search providers, specialty, ID…"
                  : "Search facilities, governorate…"
              }
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          {view === "providers" && (
            <>
              <select
                className="fchip"
                value={facFilter}
                onChange={(e) => setFacFilter(e.target.value)}
                style={{
                  appearance: "none",
                  paddingRight: 18,
                  cursor: "pointer",
                }}
              >
                <option value="all">All facilities</option>
                {FACILITIES.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.code} — {f.name}
                  </option>
                ))}
              </select>
              <select
                className="fchip"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  appearance: "none",
                  paddingRight: 18,
                  cursor: "pointer",
                }}
              >
                <option value="all">All statuses</option>
                <option value="Active">Active</option>
                <option value="Onboarding">Onboarding</option>
                <option value="Leave">Leave</option>
              </select>
            </>
          )}
        </div>
      </div>

      {view === "hierarchy" && (
        <HierarchyView onOpenOrg={setOpenOrg} onOpenFacility={setOpenFac} />
      )}
      {view === "facilities" && (
        <FacilitiesTable facilities={filteredFacilities} onOpen={setOpenFac} />
      )}
      {view === "providers" && (
        <ProvidersTable providers={filteredProviders} onOpen={setOpenPrv} />
      )}

      {openFac && (
        <FacilityDrawer
          fac={openFac}
          onClose={() => setOpenFac(null)}
          onOpenProvider={(p: any) => {
            setOpenFac(null);
            setOpenPrv(p);
          }}
        />
      )}
      {openPrv && (
        <ProviderDrawer prv={openPrv} onClose={() => setOpenPrv(null)} />
      )}
      {openOrg && <OrgDrawer org={openOrg} onClose={() => setOpenOrg(null)} />}
    </>
  );
}
