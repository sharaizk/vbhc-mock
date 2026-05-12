import { Icons } from "@/components/Icons/Icons";
import { DEEP, SETS } from "@/mock/ichom";
import { familyOf, fmtBeneficiaries, statusLabel } from "@/utils/helpers";
import { useMemo, useState } from "react";
import Overview from "../Overview";
import OutcomesTab from "../OutcomesTab";
import CaseMixTab from "../CaseMixTab";
import PromsTab from "../PromsTab";
import TimepointsTab from "../TimepointsTab";
import OverlapsTab from "../OverlapsTab";

export default function SetDetail({ set, onClose }) {
  if (!set) return <div className="drawer-scrim" />;
  const [tab, setTab] = useState("overview");
  const fam = familyOf(set.family);
  const deep = set.deep ? DEEP[set.deep] : null;

  // Cross-Set overlaps based on shared PROMs
  const overlaps = useMemo(() => {
    return SETS.filter((s) => s.id !== set.id)
      .map((s) => ({
        set: s,
        shared: s.proms.filter((p) => set.proms.includes(p)),
      }))
      .filter((o) => o.shared.length > 0)
      .sort((a, b) => b.shared.length - a.shared.length)
      .slice(0, 12);
  }, [set]);

  // Domain tally for outcome variables (only for deep sets)
  const domainTally = useMemo(() => {
    if (!deep) return null;
    const map = {};
    deep.outcomeVariables.forEach((v) => {
      map[v.domain] = (map[v.domain] || 0) + 1;
    });
    return Object.entries(map);
  }, [deep]);

  const tabs = [
    { id: "overview", label: "Overview" },
    {
      id: "outcomes",
      label: "Outcome variables",
      count: deep ? deep.outcomeVariables.length : set.outcomeVars,
    },
    {
      id: "casemix",
      label: "Case-mix",
      count: deep ? deep.caseMixVariables.length : set.caseMixVars,
    },
    { id: "proms", label: "PROMs", count: set.proms.length },
    { id: "timepoints", label: "Timepoints", count: set.timepoints.length },
    { id: "overlaps", label: "Cross-Set", count: overlaps.length },
  ];

  return (
    <>
      <div
        className={"drawer-scrim " + (set ? "open" : "")}
        onClick={onClose}
      />
      <aside className={"drawer " + (set ? "open" : "")}>
        <div className="drawer-head">
          <div>
            <div className="crumb">
              {set.id} · {set.code} · v{set.version}
            </div>
            <h2>{set.name}</h2>
            <p className="desc">
              {deep
                ? deep.summary
                : `ICHOM Standard Set for ${set.name.toLowerCase()}. Tracks ${set.outcomeVars} outcome variables and ${set.caseMixVars} case-mix factors across ${set.timepoints.length} timepoints. Pipeline-managed; metadata read-only.`}
            </p>
            <div className="meta">
              <span className={"set-family-pill tint-" + fam.tint}>
                {fam.label}
              </span>
              <span className={"set-status " + set.status}>
                {statusLabel(set.status)}
                {set.contracts > 0
                  ? ` · ${set.contracts} contract${set.contracts > 1 ? "s" : ""}`
                  : ""}
              </span>
              {set.beneficiaries > 0 && (
                <span
                  className="set-version"
                  style={{
                    padding: "4px 10px",
                    border: ".5px solid var(--border-default)",
                    borderRadius: 9999,
                  }}
                >
                  {fmtBeneficiaries(set.beneficiaries)} beneficiaries
                </span>
              )}
              {!deep && (
                <span className="coming-soon">
                  Metadata only · full detail in pipeline
                </span>
              )}
            </div>
          </div>
          <button className="drawer-close" onClick={onClose}>
            {Icons.close}
          </button>
        </div>

        <div className="drawer-tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={"dtab " + (tab === t.id ? "active" : "")}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.count != null && <span className="ctr">{t.count}</span>}
            </button>
          ))}
        </div>

        <div className="drawer-body">
          {tab === "overview" && (
            <Overview set={set} deep={deep} domainTally={domainTally} />
          )}
          {tab === "outcomes" && <OutcomesTab set={set} deep={deep} />}
          {tab === "casemix" && <CaseMixTab set={set} deep={deep} />}
          {tab === "proms" && <PromsTab set={set} />}
          {tab === "timepoints" && <TimepointsTab set={set} />}
          {tab === "overlaps" && <OverlapsTab set={set} overlaps={overlaps} />}
        </div>
      </aside>
    </>
  );
}
