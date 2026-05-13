import { DIFF_SECTIONS } from "@/mock/transformation";
import React from "react";

// Session 7 — CT5Diff.jsx — Step 5: Enhanced Side-by-Side Diff
const { useState: ct5UseState } = React;

const PATH_BADGE = {
  C: {
    label: "C",
    bg: "oklch(0.95 0.05 145)",
    color: "oklch(0.40 0.16 145)",
    title: "Conservative path",
  },
  M: {
    label: "M",
    bg: "oklch(0.96 0.04 60)",
    color: "oklch(0.42 0.14 60)",
    title: "Moderate path",
  },
  A: {
    label: "A",
    bg: "oklch(0.95 0.05 25)",
    color: "oklch(0.45 0.18 25)",
    title: "Aggressive path",
  },
};
const CHANGE_STYLE = {
  added: {
    bg: "oklch(0.96 0.04 145)",
    border: "oklch(0.82 0.10 145)",
    label: "Added",
    dot: "oklch(0.40 0.16 145)",
  },
  modified: {
    bg: "oklch(0.96 0.04 60)",
    border: "oklch(0.82 0.08 60)",
    label: "Modified",
    dot: "oklch(0.42 0.14 60)",
  },
  removed: {
    bg: "oklch(0.96 0.04 25)",
    border: "oklch(0.82 0.10 25)",
    label: "Removed",
    dot: "oklch(0.45 0.18 25)",
  },
};

function PathBadge({ path, isActive }) {
  const b = PATH_BADGE[path] || PATH_BADGE.M;
  return (
    <span
      title={b.title}
      className="ct5-path-badge"
      style={{
        background: isActive ? b.bg : "var(--bg-elevated)",
        color: isActive ? b.color : "var(--fg-tertiary)",
        opacity: isActive ? 1 : 0.45,
      }}
    >
      {b.label}
    </span>
  );
}

function ChangeRow({ change, selectedPath }) {
  const s = CHANGE_STYLE[change.type] || CHANGE_STYLE.added;
  const isActive =
    !selectedPath || selectedPath === "moderate"
      ? change.path !== "A"
      : selectedPath === "conservative"
        ? change.path === "C"
        : true;
  const greyedOut = selectedPath && !isActive;

  return (
    <div
      className={"ct5-change-row" + (greyedOut ? " greyed" : "")}
      style={{ borderLeft: `3px solid ${s.dot}` }}
    >
      <div className="ct5-cr-left">
        <span
          className="ct5-change-type"
          style={{ background: s.bg, color: s.dot }}
        >
          {s.label}
        </span>
        <span className="ct5-field-name">{change.field}</span>
        {greyedOut && (
          <span
            style={{
              font: "400 10px/1 var(--font-sans)",
              color: "var(--fg-tertiary)",
              marginLeft: 6,
              fontStyle: "italic",
            }}
          >
            Aggressive path only
          </span>
        )}
      </div>
      <div style={{ marginLeft: "auto" }}>
        <PathBadge path={change.path} isActive={isActive} />
      </div>
    </div>
  );
}

function DiffSection({ section, selectedPath }) {
  const [open, setOpen] = ct5UseState(true);
  return (
    <div className="ct5-section">
      <div className="ct5-section-head" onClick={() => setOpen((o) => !o)}>
        <span className="ct5-sh-num">{section.id}</span>
        <span className="ct5-sh-title">{section.title}</span>
        <span className="ct5-sh-changes">
          {section.changes?.length || 0} changes
        </span>
        <span
          style={{
            color: "var(--fg-tertiary)",
            transform: open ? "" : "rotate(-90deg)",
            transition: "transform .15s",
          }}
        >
          ▾
        </span>
      </div>
      {open && (
        <div className="ct5-section-body">
          <div className="ct5-three-cols">
            {/* Original */}
            <div className="ct5-col original">
              <div className="ct5-col-head">Original Contract</div>
              <div className="ct5-col-content">
                <div className="ct5-original-text">{section.original}</div>
              </div>
            </div>
            {/* Reasoning */}
            <div className="ct5-col reasoning">
              <div className="ct5-col-head">AiQL Reasoning</div>
              <div className="ct5-col-content">
                <div className="ct5-reasoning-text">
                  <div className="ct5-gap-refs">
                    {section.reasoning.match(/G\d/g)?.map((g, i) => (
                      <span key={i} className="ct5-gap-ref-badge">
                        {g}
                      </span>
                    ))}
                  </div>
                  {section.reasoning.replace(/G\d[,\s]*/g, "").trim()}
                </div>
                <div className="ct5-changes-list">
                  {(section.changes || []).map((c, i) => (
                    <ChangeRow key={i} change={c} selectedPath={selectedPath} />
                  ))}
                </div>
              </div>
            </div>
            {/* Transformed */}
            <div className="ct5-col transformed">
              <div className="ct5-col-head">Transformed Contract</div>
              <div className="ct5-col-content">
                <div className="ct5-transformed-text">
                  {section.transformed}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CT5Diff({ onComplete, selectedPath }) {
  const sections = DIFF_SECTIONS || [];
  const [copiedMsg, setCopiedMsg] = ct5UseState(false);
  const pathId = selectedPath?.id || "moderate";

  const addCount = sections
    .flatMap((s) => s.changes || [])
    .filter((c) => c.type === "added").length;
  const modCount = sections
    .flatMap((s) => s.changes || [])
    .filter((c) => c.type === "modified").length;
  const remCount = sections
    .flatMap((s) => s.changes || [])
    .filter((c) => c.type === "removed").length;

  const copyAll = () => {
    const text = sections
      .map(
        (s) =>
          `=== ${s.id} ${s.title} ===\n\nORIGINAL:\n${s.original}\n\nTRANSFORMED:\n${s.transformed}`,
      )
      .join("\n\n");
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  return (
    <div className="ct5-page">
      <div className="ct5-page-head">
        <div>
          <div className="rs-crumb">Step 5 · Side-by-Side Diff</div>
          <h2 className="rs-title">Original vs Transformed Contract</h2>
          <p
            style={{
              font: "400 13px/18px var(--font-sans)",
              color: "var(--fg-secondary)",
              marginTop: 4,
              maxWidth: 620,
            }}
          >
            Seven contract sections shown side-by-side. Green additions fill the
            gaps identified in the maturity assessment. Changes tagged with path
            badges — greyed tags require a more advanced path.
          </p>
        </div>
        <button className="cd-btn" onClick={copyAll}>
          {copiedMsg ? "✓ Copied!" : "Copy transformed contract"}
        </button>
      </div>

      {/* Legend & summary */}
      <div className="ct5-legend-bar">
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[
            ["added", "Added", addCount],
            ["modified", "Modified", modCount],
            ["removed", "Removed", remCount],
          ].map(([type, label, cnt]) => {
            const s = CHANGE_STYLE[type];
            return (
              <div
                key={type}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  font: "500 11px/1 var(--font-sans)",
                  color: s.dot,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: s.dot,
                    display: "inline-block",
                  }}
                />
                {label}: {cnt}
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            font: "400 11px/1 var(--font-sans)",
            color: "var(--fg-secondary)",
          }}
        >
          Path filter:
          {["C", "M", "A"].map((p) => (
            <PathBadge
              key={p}
              path={p}
              isActive={
                p === "C" || p === "M" || (pathId === "aggressive" && p === "A")
              }
            />
          ))}
          <span style={{ color: "var(--fg-tertiary)" }}>
            · greyed = not in selected path
          </span>
        </div>
      </div>

      <div className="ct5-sections">
        {sections.map((s) => (
          <DiffSection key={s.id} section={s} selectedPath={pathId} />
        ))}
      </div>

      <div className="rs-panel-foot" style={{ padding: "16px 0" }}>
        <button className="cd-btn primary" onClick={() => onComplete(5)}>
          Proceed to Transition Plan →
        </button>
      </div>
    </div>
  );
}
export default CT5Diff;
