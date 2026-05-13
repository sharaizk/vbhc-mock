"use client";
import { DEPS, DIMS, MEASURES } from "@/mock/framework";
import React from "react";
import "@/css/framework.css";
import { Icons } from "@/components/Icons/Icons";
import ArchitectureView from "@/components/framework/ArchitectureView";
import CardsView from "@/components/framework/CardsView";
import DepsView from "@/components/framework/DepsView";
import DimDrawer from "@/components/framework/DimDrawer";
const {
  useState: useFwState,
  useMemo: useFwMemo,
  useEffect: useFwEffect,
} = React;

export default function Framework() {
  const [view, setView] = useFwState("arch");
  const [selectedDim, setSelectedDim] = useFwState(null);
  const [search, setSearch] = useFwState("");
  const [hoverId, setHoverId] = useFwState(null);

  const counts = useFwMemo(() => {
    const c: any = {};
    DIMS.forEach(
      (d) => (c[d.id] = MEASURES.filter((m) => m.dim === d.id).length),
    );
    return c;
  }, []);
  const totalCatalogue = MEASURES.length;
  const ownedCount = DIMS.filter((d) => d.driverType === "Catalogue").length;

  return (
    <>
      <header className="page-head">
        <div>
          <div className="crumb">Value Framework</div>
          <h1>The 10 dimensions of value</h1>
          <p className="desc">
            The framework is the same for every contract. Eight domain pillars
            (D1–D8), one cross-cutting equity dimension (D9), one foundational
            capability dimension (D10). D1 &amp; D2 inherit measures from each
            contracted ICHOM Set; D3–D10 own their own catalogues — managed
            here.
          </p>
          <div className="stats">
            <span className="stat-pill">
              <span className="num">10</span>
              <span className="lbl">Dimensions</span>
            </span>
            <span className="stat-pill">
              <span className="num">{totalCatalogue}</span>
              <span className="lbl">Catalogue measures</span>
            </span>
            <span className="stat-pill">
              <span className="num">{ownedCount}</span>
              <span className="lbl">With catalogue</span>
            </span>
            <span className="stat-pill">
              <span className="num">2</span>
              <span className="lbl">ICHOM-driven</span>
            </span>
            <span className="stat-pill">
              <span className="num">{DEPS.length}</span>
              <span className="lbl">Dependency edges</span>
            </span>
          </div>
        </div>
        <div className="vf-toolbar">
          <div className="hdr-search vf-search">
            <span className="glyph">{Icons.search}</span>
            <input
              placeholder="Search dimensions or measures…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="vf-view-toggle" role="tablist">
            <button
              className={view === "arch" ? "on" : ""}
              onClick={() => setView("arch")}
            >
              Stack
            </button>
            <button
              className={view === "cards" ? "on" : ""}
              onClick={() => setView("cards")}
            >
              Cards
            </button>
            <button
              className={view === "deps" ? "on" : ""}
              onClick={() => setView("deps")}
            >
              Dependencies
            </button>
          </div>
          <div className="vf-version-pill">
            <span className="dot live" />
            <div>
              <div className="ver">Framework v3.2</div>
              <div className="effective">
                Effective 2025-Q1 · approved 2024-12-18
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="vf-canvas">
        {view === "arch" && (
          <ArchitectureView
            onSelect={setSelectedDim}
            search={search}
            hoverId={hoverId}
            setHoverId={setHoverId}
            counts={counts}
          />
        )}
        {view === "cards" && (
          <CardsView
            onSelect={setSelectedDim}
            search={search}
            counts={counts}
          />
        )}
        {view === "deps" && (
          <DepsView
            onSelect={setSelectedDim}
            hoverId={hoverId}
            setHoverId={setHoverId}
          />
        )}
      </section>

      <DimDrawer dimId={selectedDim} onClose={() => setSelectedDim(null)} />
    </>
  );
}
