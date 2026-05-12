"use client";
import OverlapMatrix from "@/components/ichom/OverlapMatrix";
import SetCard from "@/components/ichom/SetCard";
import SetDetail from "@/components/ichom/SetDetail";
import SetRow from "@/components/ichom/SetRow";
import { Icons } from "@/components/Icons/Icons";
import "@/css/ichom.css";
import { FAMILIES, SETS } from "@/mock/ichom";
import { fmtBeneficiaries } from "@/utils/helpers";
import { useMemo, useState } from "react";
export default function IchomPage() {
  const [search, setSearch] = useState("");
  const [family, setFamily] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState("grid"); // grid | list | matrix
  const [openSet, setOpenSet] = useState(null);

  const filtered = useMemo(() => {
    return SETS.filter((s) => {
      if (family !== "all" && s.family !== family) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !s.name.toLowerCase().includes(q) &&
          !s.code.toLowerCase().includes(q) &&
          !s.id.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [search, family, statusFilter]);

  const familyCounts = useMemo(() => {
    const c: any = { all: SETS.length };
    FAMILIES.forEach((f) => {
      c[f.id] = SETS.filter((s) => s.family === f.id).length;
    });
    return c;
  }, []);

  const stats = useMemo(
    () => ({
      total: SETS.length,
      active: SETS.filter((s) => s.status === "active").length,
      available: SETS.filter((s) => s.status === "available").length,
      draft: SETS.filter((s) => s.status === "draft").length,
      deep: SETS.filter((s) => s.deep).length,
      beneficiaries: SETS.reduce((a, s) => a + s.beneficiaries, 0),
      contracts: SETS.reduce((a, s) => a + s.contracts, 0),
    }),
    [],
  );
  return (
    <>
      <div className="page-head">
        <div>
          <div className="crumb">MODULE 1.1 · ADMIN</div>
          <h1>ICHOM Standard Sets</h1>
          <p className="desc">
            Browse the 46 ICHOM Standard Sets in the AiQL pipeline. Each Set
            defines the outcome variables, case-mix factors, PROMs instruments,
            and timepoints for a clinical condition. Read-only; activation and
            contract scoping happen elsewhere.
          </p>
          <div className="stats">
            <span className="stat-pill">
              <span className="num">{stats.total}</span>
              <span className="lbl">Sets</span>
            </span>
            <span className="stat-pill">
              <span className="num">{stats.active}</span>
              <span className="lbl">In contract</span>
            </span>
            <span className="stat-pill">
              <span className="num">{stats.deep}</span>
              <span className="lbl">Fully detailed</span>
            </span>
            <span className="stat-pill">
              <span className="num">
                {fmtBeneficiaries(stats.beneficiaries)}
              </span>
              <span className="lbl">Beneficiaries</span>
            </span>
            <span className="stat-pill">
              <span className="num">{stats.contracts}</span>
              <span className="lbl">Active contract links</span>
            </span>
          </div>
        </div>
      </div>

      {/* Family filter rail */}
      <div className="family-rail">
        <button
          className={"fchip " + (family === "all" ? "active" : "")}
          onClick={() => setFamily("all")}
        >
          All<span className="count">{familyCounts.all}</span>
        </button>
        {FAMILIES.map((f) => (
          <button
            key={f.id}
            className={"fchip " + (family === f.id ? "active" : "")}
            onClick={() => setFamily(f.id)}
          >
            <span className="dot" style={{ background: f.accent }} />
            {f.label}
            <span className="count">{familyCounts[f.id]}</span>
          </button>
        ))}
      </div>
      <div className="filterbar">
        <div className="filter-search">
          {Icons.search}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Set name, code, or ID…"
          />
        </div>
        <div className="tabs">
          <button
            className={"tab " + (statusFilter === "all" ? "active" : "")}
            onClick={() => setStatusFilter("all")}
          >
            All · {stats.total}
          </button>
          <button
            className={"tab " + (statusFilter === "active" ? "active" : "")}
            onClick={() => setStatusFilter("active")}
          >
            In contract · {stats.active}
          </button>
          <button
            className={"tab " + (statusFilter === "available" ? "active" : "")}
            onClick={() => setStatusFilter("available")}
          >
            Ingested · {stats.available}
          </button>
          <button
            className={"tab " + (statusFilter === "draft" ? "active" : "")}
            onClick={() => setStatusFilter("draft")}
          >
            Draft · {stats.draft}
          </button>
        </div>

        <div style={{ flex: 1 }} />
        <div className="tabs">
          <button
            className={"tab " + (view === "grid" ? "active" : "")}
            onClick={() => setView("grid")}
          >
            {Icons.grid} Grid
          </button>
          <button
            className={"tab " + (view === "list" ? "active" : "")}
            onClick={() => setView("list")}
          >
            {Icons.list} Table
          </button>
          <button
            className={"tab " + (view === "matrix" ? "active" : "")}
            onClick={() => setView("matrix")}
          >
            {Icons.matrix} Overlap
          </button>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="empty">
          <div className="big">No Sets match these filters</div>
          Try clearing the search or selecting a different clinical family.
        </div>
      )}

      {filtered.length > 0 && view === "grid" && (
        <div className="set-grid">
          {filtered.map((s) => (
            <SetCard key={s.id} set={s} onOpen={setOpenSet} />
          ))}
        </div>
      )}

      {filtered.length > 0 && view === "list" && (
        <div className="tbl">
          <div className="row head set-row">
            <span>ID</span>
            <span>Set</span>
            <span>Family</span>
            <span style={{ textAlign: "center" }}>Outcomes</span>
            <span style={{ textAlign: "center" }}>Case-mix</span>
            <span>PROMs</span>
            <span>Status</span>
            <span style={{ textAlign: "right" }}>Patients</span>
          </div>
          {filtered.map((s) => (
            <SetRow key={s.id} set={s} onOpen={setOpenSet} />
          ))}
        </div>
      )}

      {filtered.length > 0 && view === "matrix" && (
        <OverlapMatrix sets={filtered} onOpen={setOpenSet} />
      )}

      <SetDetail set={openSet} onClose={() => setOpenSet(null)} />
    </>
  );
}
