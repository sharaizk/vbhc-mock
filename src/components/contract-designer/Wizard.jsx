"use client";
import React from "react";
const {
  useState: useState,
  useMemo: cdUseMemo,
  useEffect: cdUseEffect,
  useCallback: cdUseCallback,
} = React;
import {
  DRAFT,
  CONTRACT_TYPES,
  PERIOD_CADENCES,
  TEMPLATES,
} from "@/mock/contract-designer";
import { ORGS, FACILITIES, PROVIDERS } from "@/mock/organization";
import { FAMILIES, SETS } from "@/mock/ichom";
import { DEPS, DIMS, MEASURES } from "@/mock/framework";

const DRAFT_CONTRACT = DRAFT;
const CONTRACT_TEMPLATES = TEMPLATES;
const STEPS = [
  {
    id: "basic",
    num: "a",
    title: "Basic information",
    sub: "Identity, type, period",
    help: "Name the contract, pick a payment archetype, and frame the performance period.",
  },
  {
    id: "scope",
    num: "b",
    title: "Providers & facilities",
    sub: "Counterparty in scope",
    help: "Choose which facilities and individual providers are bound by this contract.",
  },
  {
    id: "sets",
    num: "c",
    title: "ICHOM Sets in scope",
    sub: "Outcome instruments",
    help: "Select the Standard Sets that drive the outcome dimensions (D1, D2).",
  },
  {
    id: "value",
    num: "d",
    title: "Value profile",
    sub: "Dimensions & measures",
    help: "Allocate weights across the 10 dimensions and select measures with floor/target/stretch thresholds.",
  },
  {
    id: "_e",
    num: "e",
    title: "Risk adjustment",
    sub: "Coming in Part 2",
    disabled: true,
  },
  {
    id: "_f",
    num: "f",
    title: "Attribution rules",
    sub: "Coming in Part 2",
    disabled: true,
  },
  {
    id: "_g",
    num: "g",
    title: "Payment formula",
    sub: "Coming in Part 2",
    disabled: true,
  },
  {
    id: "_h",
    num: "h",
    title: "Review & sign",
    sub: "Coming in Part 2",
    disabled: true,
  },
];

const ICONS = {
  check: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="5 12 10 17 19 8" />
    </svg>
  ),
  search: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  chev: (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  trash: (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  ),
  arrow: (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  arrowL: (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  spark: (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3 2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
    </svg>
  ),
};

/* ---------- Reducer-style helpers --------------------------------------- */
function score(c) {
  const sum = Object.values(c.weights || {}).reduce((a, b) => a + b, 0);
  const issues = [];
  if (!c.name?.trim()) issues.push("name");
  if (!c.facilityIds?.length) issues.push("facilities");
  if (!c.setIds?.length) issues.push("sets");
  if (sum !== 100) issues.push("weights");
  return { sum, issues };
}

function fmtNum(n) {
  return n?.toLocaleString?.() ?? n;
}

/* ============================================================================
   Left rail
   ========================================================================== */
function CDRail({ contract, step, onStep }) {
  const types = CONTRACT_TYPES;
  const purchaser = ORGS.find((o) => o.id === contract.purchaserId);
  const type = types.find((t) => t.id === contract.type);
  const { sum, issues } = score(contract);
  const sumNum = sum === 100 ? "ok" : sum > 100 ? "warn" : "warn";
  const fy = (d) => d?.split("-")[0] ?? "—";
  return (
    <aside className="cd-rail">
      <div className="id-line">
        <span className="draft-pill">Draft</span>
        <span className="id-mono">{contract.id}</span>
      </div>
      <h2>{contract.name || "Untitled contract"}</h2>
      <div className="sum-grid">
        <div className="col">
          <span className="lbl">Type</span>
          <span
            className="num"
            style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}
          >
            {type?.code ?? "—"}
          </span>
        </div>
        <div className="col">
          <span className="lbl">Purchaser</span>
          <span
            className="num"
            style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}
          >
            {purchaser?.code ?? "—"}
          </span>
        </div>
        <div className="col">
          <span className="lbl">Facilities</span>
          <span className="num">{contract.facilityIds.length}</span>
        </div>
        <div className="col">
          <span className="lbl">Providers</span>
          <span className="num">{contract.providerIds.length}</span>
        </div>
        <div className="col">
          <span className="lbl">ICHOM Sets</span>
          <span className="num">{contract.setIds.length}</span>
        </div>
        <div className="col">
          <span className="lbl">Period</span>
          <span
            className="num"
            style={{ fontSize: 13, fontFamily: "var(--font-mono)" }}
          >
            {fy(contract.start)}–{fy(contract.end)?.slice(2)}
          </span>
        </div>
        <div className="col">
          <span className="lbl">Weights Σ</span>
          <span className={"num " + (sum === 100 ? "ok" : sumNum)}>{sum}%</span>
        </div>
        <div className="col">
          <span className="lbl">Validation</span>
          <span
            className="num"
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: issues.length
                ? "oklch(0.50 0.18 25)"
                : "oklch(0.40 0.16 145)",
            }}
          >
            {issues.length ? `${issues.length} open` : "ready"}
          </span>
        </div>
      </div>
      <div className="stepnav">
        {STEPS.map((s, i) => {
          const cls = s.disabled
            ? "step-row disabled"
            : s.id === step
              ? "step-row on"
              : i < STEPS.findIndex((x) => x.id === step)
                ? "step-row done"
                : "step-row";
          return (
            <div
              key={s.id}
              className={cls}
              onClick={() => !s.disabled && onStep(s.id)}
            >
              <span className="num">
                {s.id === step ? (
                  s.num
                ) : i < STEPS.findIndex((x) => x.id === step) ? (
                  <span style={{ display: "grid", placeItems: "center" }}>
                    {ICONS.check}
                  </span>
                ) : (
                  s.num
                )}
              </span>
              <div>
                <div className="lbl">{s.title}</div>
                <div className="sub">
                  Step {s.num}
                  {s.disabled ? " · later" : ""}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

/* ============================================================================
   Step a — Basic
   ========================================================================== */
function StepBasic({ contract, set, t }) {
  const types = CONTRACT_TYPES;
  const cads = PERIOD_CADENCES;
  const orgs = ORGS.filter((o) => o.role === "Purchaser");
  return (
    <div data-screen-label="05a Basic info">
      <h3 className="cd-h2">Identity</h3>
      <div className="cd-grid-2">
        <div className="cd-field" style={{ gridColumn: "1 / -1" }}>
          <label>Contract name</label>
          <input
            className="cd-input"
            value={contract.name}
            onChange={(e) => set({ name: e.target.value })}
          />
        </div>
        <div className="cd-field" style={{ gridColumn: "1 / -1" }}>
          <label>Description</label>
          <textarea
            className="cd-textarea"
            value={contract.description}
            onChange={(e) => set({ description: e.target.value })}
          />
          <p className="cd-help">
            Plain-language summary used on the contract list, in attribution
            audit trails, and at signing.
          </p>
        </div>
        <div className="cd-field">
          <label>Purchaser</label>
          <select
            className="cd-select"
            value={contract.purchaserId}
            onChange={(e) => set({ purchaserId: e.target.value })}
          >
            {orgs.map((o) => (
              <option key={o.id} value={o.id}>
                {o.code} · {o.name}
              </option>
            ))}
          </select>
          <p className="cd-help">
            The single national purchaser is the contract counterparty.
          </p>
        </div>
        <div className="cd-field">
          <label>Contract ID</label>
          <input
            className="cd-input"
            value={contract.id}
            disabled
            style={{ fontFamily: "var(--font-mono)", letterSpacing: ".04em" }}
          />
          <p className="cd-help">Auto-generated, locked at creation.</p>
        </div>
      </div>

      <h3 className="cd-h2 spaced">Payment archetype</h3>
      <div className="cd-type-grid">
        {types.map((ty) => (
          <div
            key={ty.id}
            className={"cd-type" + (contract.type === ty.id ? " on" : "")}
            onClick={() => set({ type: ty.id, weights: { ...ty.weights } })}
          >
            <div className="code">{ty.code}</div>
            <div className="nm">{ty.name}</div>
            <div className="blurb">{ty.blurb}</div>
          </div>
        ))}
      </div>
      <p className="cd-help">
        Selecting a type loads its default value-profile weights — you can
        refine them in step d.
      </p>

      <h3 className="cd-h2 spaced">Performance period</h3>
      <div className="cd-grid-3">
        <div className="cd-field">
          <label>Start date</label>
          <input
            className="cd-input"
            type="date"
            value={contract.start}
            onChange={(e) => set({ start: e.target.value })}
          />
        </div>
        <div className="cd-field">
          <label>End date</label>
          <input
            className="cd-input"
            type="date"
            value={contract.end}
            onChange={(e) => set({ end: e.target.value })}
          />
        </div>
        <div className="cd-field">
          <label>Settlement cadence</label>
          <div className="cd-cad-row">
            {cads.map((c) => (
              <span
                key={c.id}
                className={"cd-cad" + (contract.cadence === c.id ? " on" : "")}
                onClick={() => set({ cadence: c.id })}
              >
                {c.label}
              </span>
            ))}
          </div>
          <p className="cd-help">
            {cads.find((c) => c.id === contract.cadence)?.desc}
          </p>
        </div>
      </div>

      <h3 className="cd-h2 spaced">
        Start from a template{" "}
        <span
          style={{
            color: "var(--fg-tertiary)",
            textTransform: "none",
            letterSpacing: 0,
            fontWeight: 400,
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            marginLeft: 6,
          }}
        >
          — optional. Replaces draft below.
        </span>
      </h3>
      <div className="cd-tpl-row">
        {CONTRACT_TEMPLATES.map((tpl) => (
          <div key={tpl.id} className="cd-tpl" onClick={() => t(tpl)}>
            <div className="hd">
              {tpl.id} · {CONTRACT_TYPES.find((x) => x.id === tpl.type)?.code}
            </div>
            <div className="nm">{tpl.name}</div>
            <div className="summary">{tpl.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   Step b — Scope (facilities + providers)
   ========================================================================== */
function StepScope({ contract, set }) {
  const [tab, setTab] = useState("fac");
  const [q, setQ] = useState("");
  const facs = FACILITIES;
  const provs = PROVIDERS || [];

  const toggleFac = (id) => {
    const has = contract.facilityIds.includes(id);
    set({
      facilityIds: has
        ? contract.facilityIds.filter((x) => x !== id)
        : [...contract.facilityIds, id],
    });
  };
  const toggleProv = (id) => {
    const has = contract.providerIds.includes(id);
    set({
      providerIds: has
        ? contract.providerIds.filter((x) => x !== id)
        : [...contract.providerIds, id],
    });
  };

  const provsFilt = provs.filter((p) => {
    if (!contract.facilityIds.includes(p.facilityId)) return false;
    if (!q.trim()) return true;
    const ql = q.toLowerCase();
    return (p.name + " " + p.specialty + " " + p.id).toLowerCase().includes(ql);
  });

  return (
    <div data-screen-label="05b Scope">
      <div className="cd-scope-tabs">
        <span
          className={"cd-scope-tab" + (tab === "fac" ? " on" : "")}
          onClick={() => setTab("fac")}
        >
          Facilities{" "}
          <span className="ct">
            {contract.facilityIds.length}/{facs.length}
          </span>
        </span>
        <span
          className={"cd-scope-tab" + (tab === "prv" ? " on" : "")}
          onClick={() => setTab("prv")}
        >
          Providers{" "}
          <span className="ct">
            {contract.providerIds.length}/{provs.length}
          </span>
        </span>
      </div>

      {tab === "fac" && (
        <>
          <div className="cd-scope-bar">
            <div
              className="left"
              style={{
                font: "500 13px/1 var(--font-sans)",
                color: "var(--fg-secondary)",
              }}
            >
              {contract.facilityIds.length} of {facs.length} facilities selected
              · click to toggle
            </div>
            <div className="left">
              <button
                className="cd-btn ghost"
                onClick={() => set({ facilityIds: facs.map((f) => f.id) })}
              >
                Select all
              </button>
              <button
                className="cd-btn ghost"
                onClick={() => set({ facilityIds: [] })}
              >
                Clear
              </button>
            </div>
          </div>
          <div className="cd-fac-grid">
            {facs.map((f) => (
              <div
                key={f.id}
                className={
                  "cd-fac-card" +
                  (contract.facilityIds.includes(f.id) ? " on" : "")
                }
                onClick={() => toggleFac(f.id)}
              >
                <div className="hd">
                  <span className="code">{f.code}</span>
                  <span className="check">{ICONS.check}</span>
                </div>
                <div className="nm">{f.name}</div>
                <div className="meta">
                  {f.type} · {f.governorate}
                </div>
                <div className="meta">
                  {f.beds} beds · {fmtNum(f.livesAttributed)} patients
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "prv" && (
        <>
          <div className="cd-scope-bar">
            <div className="left">
              <div className="cd-scope-search">
                {ICONS.search}
                <input
                  placeholder="Search providers, specialties, IDs…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>
            </div>
            <div className="left">
              <button
                className="cd-btn ghost"
                onClick={() => set({ providerIds: provsFilt.map((p) => p.id) })}
              >
                Select shown
              </button>
              <button
                className="cd-btn ghost"
                onClick={() => set({ providerIds: [] })}
              >
                Clear
              </button>
            </div>
          </div>
          {!contract.facilityIds.length && (
            <div
              style={{
                padding: "24px",
                textAlign: "center",
                color: "var(--fg-tertiary)",
                font: "400 13px/19px var(--font-sans)",
              }}
            >
              Pick one or more facilities first — providers are scoped to
              in-scope facilities.
            </div>
          )}
          {!!contract.facilityIds.length && (
            <div className="cd-prv-tbl">
              <div className="row head">
                <span></span>
                <span>Provider</span>
                <span>Specialty / role</span>
                <span>Facility</span>
                <span>Status</span>
              </div>
              {provsFilt.length === 0 && (
                <div
                  className="row body"
                  style={{
                    color: "var(--fg-tertiary)",
                    font: "400 12px/16px var(--font-sans)",
                  }}
                >
                  <span></span>
                  <span>No providers match.</span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )}
              {provsFilt.map((p) => {
                const fac = facs.find((f) => f.id === p.facilityId);
                const on = contract.providerIds.includes(p.id);
                return (
                  <div
                    key={p.id}
                    className={"row body" + (on ? " on" : "")}
                    onClick={() => toggleProv(p.id)}
                  >
                    <span className="check">{ICONS.check}</span>
                    <div>
                      <div className="name">{p.name}</div>
                      <div className="sub">
                        {p.id} · {p.role}
                      </div>
                    </div>
                    <div className="spec">{p.specialty}</div>
                    <span className="or-cell-mono">{fac?.code ?? "—"}</span>
                    <span
                      className={
                        "or-pill status-" +
                        (p.status === "Active"
                          ? "active"
                          : p.status === "On leave"
                            ? "leave"
                            : "onboarding")
                      }
                    >
                      {p.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* ============================================================================
   Step c — ICHOM Sets in scope
   ========================================================================== */
function StepSets({ contract, set }) {
  const sets = SETS;
  const fams = FAMILIES;
  const [filter, setFilter] = useState("active");
  const [famFilter, setFamFilter] = useState("all");

  const toggle = (id) => {
    const has = contract.setIds.includes(id);
    set({
      setIds: has
        ? contract.setIds.filter((x) => x !== id)
        : [...contract.setIds, id],
    });
  };

  const filtered = sets.filter((s) => {
    if (filter === "active" && s.status !== "active") return false;
    if (filter === "available" && s.status === "draft") return false;
    if (famFilter !== "all" && s.family !== famFilter) return false;
    return true;
  });

  return (
    <div data-screen-label="05c ICHOM Sets">
      <div className="cd-scope-bar">
        <div className="left">
          <div className="cd-scope-tabs" style={{ margin: 0 }}>
            <span
              className={"cd-scope-tab" + (filter === "active" ? " on" : "")}
              onClick={() => setFilter("active")}
            >
              Active
            </span>
            <span
              className={"cd-scope-tab" + (filter === "available" ? " on" : "")}
              onClick={() => setFilter("available")}
            >
              Active + available
            </span>
            <span
              className={"cd-scope-tab" + (filter === "all" ? " on" : "")}
              onClick={() => setFilter("all")}
            >
              All
            </span>
          </div>
          <select
            className="cd-select"
            style={{
              padding: "7px 28px 7px 12px",
              fontSize: 12,
              minWidth: 160,
            }}
            value={famFilter}
            onChange={(e) => setFamFilter(e.target.value)}
          >
            <option value="all">All families</option>
            {fams.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            font: "500 12px/1 var(--font-mono)",
            color: "var(--fg-secondary)",
            letterSpacing: ".04em",
          }}
        >
          {contract.setIds.length} selected · {filtered.length} shown
        </div>
      </div>
      <div className="cd-set-grid">
        {filtered.map((s) => {
          const fam = fams.find((f) => f.id === s.family);
          const on = contract.setIds.includes(s.id);
          return (
            <div
              key={s.id}
              className={"cd-set-card" + (on ? " on" : "")}
              onClick={() => toggle(s.id)}
            >
              <div className="hd">
                <span className="code">
                  {s.code} · {s.id}
                </span>
              </div>
              <span className="check">{ICONS.check}</span>
              <div className="nm">{s.name}</div>
              <div className="meta-row">
                <span className="or-pill">{fam?.label}</span>
                <span className="or-pill">{s.outcomeVars} outcome vars</span>
                <span className="or-pill">{s.proms.length} PROMs</span>
                <span
                  className={
                    "or-pill status-" +
                    (s.status === "active"
                      ? "active"
                      : s.status === "available"
                        ? "onboarding"
                        : "leave")
                  }
                >
                  {s.status}
                </span>
                {s.contracts > 0 && (
                  <span className="or-pill">
                    in {s.contracts} contract{s.contracts > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   Step d — Value profile
   ========================================================================== */
function StepValue({ contract, set }) {
  const dims = DIMS;
  const measures = MEASURES;
  const [collapsed, setCollapsed] = useState({});

  const includedDims = dims.filter((d) => contract.weights[d.id] != null);
  const sum = includedDims.reduce(
    (a, d) => a + (contract.weights[d.id] || 0),
    0,
  );

  const toggleDim = (dimId) => {
    const w = { ...contract.weights };
    if (w[dimId] != null) {
      delete w[dimId];
      // remove measures from this dim
      const drop = new Set(
        measures.filter((m) => m.dim === dimId).map((m) => m.id),
      );
      const measureIds = contract.measureIds.filter((id) => !drop.has(id));
      const thresholds = { ...contract.thresholds };
      [...drop].forEach((id) => delete thresholds[id]);
      set({ weights: w, measureIds, thresholds });
    } else {
      w[dimId] = 10;
      set({ weights: w });
    }
  };

  const setWeight = (dimId, val) => {
    const w = {
      ...contract.weights,
      [dimId]: Math.max(0, Math.min(80, Math.round(val))),
    };
    set({ weights: w });
  };

  const normalize = () => {
    const total = includedDims.reduce(
      (a, d) => a + (contract.weights[d.id] || 0),
      0,
    );
    if (!total) return;
    const w = {};
    includedDims.forEach((d) => {
      w[d.id] = Math.round((contract.weights[d.id] / total) * 100);
    });
    // adjust rounding to hit 100
    const after = Object.values(w).reduce((a, b) => a + b, 0);
    if (after !== 100 && includedDims.length)
      w[includedDims[0].id] += 100 - after;
    set({ weights: w });
  };

  const toggleMeasure = (mid) => {
    const has = contract.measureIds.includes(mid);
    let measureIds = has
      ? contract.measureIds.filter((x) => x !== mid)
      : [...contract.measureIds, mid];
    let thresholds = { ...contract.thresholds };
    if (has) delete thresholds[mid];
    else if (!thresholds[mid])
      thresholds[mid] = { floor: "", target: "", stretch: "" };
    set({ measureIds, thresholds });
  };

  const setThreshold = (mid, key, val) => {
    const t = { ...(contract.thresholds[mid] || {}) };
    t[key] = val === "" ? "" : Number(val);
    set({ thresholds: { ...contract.thresholds, [mid]: t } });
  };

  return (
    <div data-screen-label="05d Value profile">
      <h3 className="cd-h2">1. Include dimensions</h3>
      <div className="cd-dim-toggle-grid">
        {dims.map((d) => {
          const on = contract.weights[d.id] != null;
          return (
            <div
              key={d.id}
              className={"cd-dim-toggle " + (on ? "on" : "off")}
              style={{ "--dim-color": d.color }}
              onClick={() => toggleDim(d.id)}
            >
              <div className="top">
                <span className="code">{d.code}</span>
                <span className="driver">{d.driverType}</span>
              </div>
              <div className="nm">{d.short}</div>
              <div className="wt">
                {on ? `${contract.weights[d.id]}` : "—"}
                <span>%</span>
              </div>
            </div>
          );
        })}
      </div>

      <h3 className="cd-h2 spaced">2. Allocate weights</h3>
      <div className="cd-stack">
        {includedDims.map((d) => {
          const pct = sum ? (contract.weights[d.id] / sum) * 100 : 0;
          if (pct < 0.1) return null;
          return (
            <div
              key={d.id}
              className="seg"
              style={{ width: `${pct}%`, background: d.color }}
              title={`${d.code} ${d.short} · ${contract.weights[d.id]}%`}
            >
              <span className="lbl">
                {pct >= 7
                  ? `${d.code} ${contract.weights[d.id]}%`
                  : pct >= 4
                    ? d.code
                    : ""}
              </span>
            </div>
          );
        })}
      </div>
      <div className="cd-sumbar">
        <span>Sum of weights</span>
        <span className={"num " + (sum === 100 ? "ok" : "bad")}>
          {sum} / 100%
        </span>
        <div className="actions">
          <button onClick={normalize} disabled={!includedDims.length}>
            Normalize to 100
          </button>
          {sum !== 100 && includedDims.length > 0 && (
            <span className="cd-val bad">
              <span className="dot" />Σ ≠ 100
            </span>
          )}
          {sum === 100 && (
            <span className="cd-val ok">
              <span className="dot" />
              Balanced
            </span>
          )}
        </div>
      </div>

      <div className="cd-stack-legend">
        {includedDims.map((d) => (
          <div className="it" key={d.id}>
            <span className="sw" style={{ background: d.color }} />
            <span>
              {d.code} · {d.short}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginTop: 14,
        }}
      >
        {includedDims.map((d) => (
          <div key={d.id} className="cd-wt-grid">
            <div className="name">
              <span
                className="code-pill"
                style={{
                  background: `color-mix(in oklch, ${d.color}, white 75%)`,
                  color: `color-mix(in oklch, ${d.color}, black 20%)`,
                }}
              >
                {d.code}
              </span>
              <span>{d.short}</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={contract.weights[d.id]}
              onChange={(e) => setWeight(d.id, +e.target.value)}
            />
            <input
              type="number"
              min="0"
              max="80"
              value={contract.weights[d.id]}
              onChange={(e) => setWeight(d.id, +e.target.value)}
              className="pct"
              style={{
                padding: "6px 10px",
                border: ".5px solid var(--border-default)",
                borderRadius: 6,
                background: "var(--bg-elevated)",
                fontFamily: "var(--font-mono)",
              }}
            />
            <div
              className="ico-btn"
              onClick={() => toggleDim(d.id)}
              title="Remove dimension"
            >
              {ICONS.trash}
            </div>
          </div>
        ))}
        {!includedDims.length && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              font: "400 12px/16px var(--font-sans)",
              color: "var(--fg-tertiary)",
            }}
          >
            No dimensions included yet — toggle one above to begin.
          </div>
        )}
      </div>

      <h3 className="cd-h2 spaced">3. Select measures &amp; set thresholds</h3>
      <div className="cd-dim-panels">
        {includedDims.map((d) => {
          const dimMeasures = measures.filter((m) => m.dim === d.id);
          const selectedMs = dimMeasures.filter((m) =>
            contract.measureIds.includes(m.id),
          );
          const isCollapsed = !!collapsed[d.id];
          return (
            <div
              key={d.id}
              className={"cd-dim-panel" + (isCollapsed ? " collapsed" : "")}
              style={{ "--dim-color": d.color }}
            >
              <div
                className="cd-dim-panel-head"
                onClick={() =>
                  setCollapsed({ ...collapsed, [d.id]: !isCollapsed })
                }
              >
                <div className="left">
                  <span
                    className="code-pill"
                    style={{
                      background: `color-mix(in oklch, ${d.color}, white 75%)`,
                      color: `color-mix(in oklch, ${d.color}, black 20%)`,
                    }}
                  >
                    {d.code}
                  </span>
                  <span className="nm">{d.name}</span>
                  <span className="driver">{d.driverType}</span>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <span className="ct">
                    {d.driverType === "ICHOM"
                      ? `${contract.setIds.length} Set${contract.setIds.length === 1 ? "" : "s"} drive`
                      : `${selectedMs.length}/${dimMeasures.length} measures · weight ${contract.weights[d.id]}%`}
                  </span>
                  <span className="chev">{ICONS.chev}</span>
                </div>
              </div>
              <div className="cd-dim-panel-body">
                {d.driverType === "ICHOM" && (
                  <>
                    <div className="ichom-note">
                      {ICONS.spark}
                      <div>
                        <b>Driven by ICHOM Sets.</b> Outcome variables and PROMs
                        auto-populate from the {contract.setIds.length || 0} Set
                        {contract.setIds.length === 1 ? "" : "s"} you picked in
                        step c. The dimension weight ({contract.weights[d.id]}%)
                        splits across them at scoring time, weighted by
                        attributed-patient volume per Set.
                      </div>
                    </div>
                    {!!contract.setIds.length && (
                      <div
                        style={{
                          marginTop: 10,
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fill,minmax(220px,1fr))",
                          gap: 8,
                        }}
                      >
                        {contract.setIds.map((sid) => {
                          const s = STEPS.find((x) => x.id === sid);
                          if (!s) return null;
                          return (
                            <div key={sid} className="or-list-row compact">
                              <div
                                className="or-avi"
                                style={{
                                  background: `color-mix(in oklch, ${d.color}, white 80%)`,
                                  color: `color-mix(in oklch, ${d.color}, black 20%)`,
                                }}
                              >
                                {s.code.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="nm">{s.name}</div>
                                <div className="sub">
                                  {d.id === "D1"
                                    ? `${s.outcomeVars} outcome vars`
                                    : `${s.proms.length} PROM instrument${s.proms.length === 1 ? "" : "s"}`}
                                </div>
                              </div>
                              <span className="or-cell-mono">{s.code}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}

                {d.driverType !== "ICHOM" && (
                  <div className="cd-meas-tbl">
                    <div className="row head">
                      <span></span>
                      <span>Measure</span>
                      <span>Dir.</span>
                      <span>Floor</span>
                      <span>Target</span>
                      <span>Stretch</span>
                      <span>Unit</span>
                    </div>
                    {dimMeasures.map((m) => {
                      const on = contract.measureIds.includes(m.id);
                      const thr = contract.thresholds[m.id] || {};
                      return (
                        <div
                          key={m.id}
                          className={"row body" + (on ? "" : " off")}
                        >
                          <span
                            className={"cd-cb" + (on ? " on" : "")}
                            onClick={() => toggleMeasure(m.id)}
                          >
                            {ICONS.check}
                          </span>
                          <div className="nm">
                            <div className="t">{m.name}</div>
                            <div className="id">
                              {m.id} · {m.def.slice(0, 72)}
                              {m.def.length > 72 ? "…" : ""}
                            </div>
                          </div>
                          <span className="dir-arrow">
                            {m.dir === "higher"
                              ? "↑"
                              : m.dir === "lower"
                                ? "↓"
                                : "≈"}
                          </span>
                          <input
                            type="number"
                            disabled={!on}
                            value={thr.floor ?? ""}
                            onChange={(e) =>
                              setThreshold(m.id, "floor", e.target.value)
                            }
                            placeholder="—"
                          />
                          <input
                            type="number"
                            disabled={!on}
                            value={thr.target ?? ""}
                            onChange={(e) =>
                              setThreshold(m.id, "target", e.target.value)
                            }
                            placeholder="—"
                          />
                          <input
                            type="number"
                            disabled={!on}
                            value={thr.stretch ?? ""}
                            onChange={(e) =>
                              setThreshold(m.id, "stretch", e.target.value)
                            }
                            placeholder="—"
                          />
                          <span className="unit" title={m.unit}>
                            {m.unit.length > 16
                              ? m.unit.slice(0, 16) + "…"
                              : m.unit}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {!includedDims.length && (
          <div
            style={{
              padding: "24px",
              textAlign: "center",
              font: "400 13px/19px var(--font-sans)",
              color: "var(--fg-tertiary)",
              background: "var(--bg-elevated)",
              border: ".5px dashed var(--border-default)",
              borderRadius: 14,
            }}
          >
            Include at least one dimension above to configure its measures.
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================================
   Wizard root
   ========================================================================== */
export default function ContractWizard() {
  const [contract, setContract] = useState(DRAFT_CONTRACT);
  const [step, setStep] = useState("basic");

  const set = cdUseCallback(
    (patch) => setContract((c) => ({ ...c, ...patch })),
    [],
  );
  const loadTpl = (tpl) => {
    setContract((c) => ({
      ...c,
      name: tpl.name,
      description: tpl.summary,
      type: tpl.type,
      facilityIds: [...tpl.facilities],
      providerIds: [...tpl.providers],
      setIds: [...tpl.sets],
      weights: { ...tpl.weights },
      cadence: tpl.cadence,
    }));
  };

  const idx = STEPS.findIndex((s) => s.id === step);
  const cur = STEPS[idx];
  const prev = idx > 0 ? STEPS[idx - 1] : null;
  const next = STEPS.slice(idx + 1).find((s) => !s.disabled);

  return (
    <div className="cd-page" data-screen-label="05 Contract Designer">
      <CDRail contract={contract} step={step} onStep={setStep} />
      <section className="cd-canvas">
        <header className="cd-canvas-head">
          <div>
            <div className="crumb">
              Contracts · New · Step {cur.num} of {STEPS.length}
            </div>
            <h1>{cur.title}</h1>
            <p className="desc">{cur.help}</p>
          </div>
          <div className="step-counter">
            {idx + 1} / {STEPS.length}
          </div>
        </header>
        <div className="cd-canvas-body">
          {step === "basic" && (
            <StepBasic contract={contract} set={set} t={loadTpl} />
          )}
          {step === "scope" && <StepScope contract={contract} set={set} />}
          {step === "sets" && <StepSets contract={contract} set={set} />}
          {step === "value" && <StepValue contract={contract} set={set} />}
        </div>
        <footer className="cd-canvas-foot">
          <div className="left">
            <span
              style={{
                font: "500 11px/1 var(--font-mono)",
                color: "var(--fg-tertiary)",
                letterSpacing: ".04em",
              }}
            >
              Auto-saved · {contract.id}
            </span>
          </div>
          <div className="right">
            {prev ? (
              <button className="cd-btn" onClick={() => setStep(prev.id)}>
                {ICONS.arrowL} {prev.title}
              </button>
            ) : (
              <button className="cd-btn" disabled>
                {ICONS.arrowL} Back
              </button>
            )}
            <button className="cd-btn">Save draft</button>
            {next ? (
              <button
                className="cd-btn primary"
                onClick={() => setStep(next.id)}
              >
                Continue · {next.title} {ICONS.arrow}
              </button>
            ) : (
              <button className="cd-btn primary" disabled>
                Review (Part 2) {ICONS.arrow}
              </button>
            )}
          </div>
        </footer>
      </section>
    </div>
  );
}
