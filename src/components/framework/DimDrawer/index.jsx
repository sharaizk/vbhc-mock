import { Icons } from "@/components/Icons/Icons";
import { DEPS } from "@/mock/framework";
import { dimById, driverIcon, measuresFor } from "@/utils/helpers";
import React, { useEffect, useState } from "react";

export default function DimDrawer({ dimId, onClose }) {
  const [tab, setTab] = useState("measures");
  const [openMeasure, setOpenMeasure] = useState(null);
  useEffect(() => {
    setTab("measures");
    setOpenMeasure(null);
  }, [dimId]);
  if (!dimId) return null;
  const d = dimById(dimId);
  const ms = measuresFor(dimId);
  const inEdges = DEPS.filter((e) => e.to === dimId).map((e) => ({
    ...e,
    peer: dimById(e.from),
  }));
  const outEdges = DEPS.filter((e) => e.from === dimId).map((e) => ({
    ...e,
    peer: dimById(e.to),
  }));

  return (
    <>
      <div className="vf-drawer-scrim" onClick={onClose} />
      <aside
        className="vf-drawer"
        style={{ "--dim-color": d.color, "--dim-soft": d.color_soft }}
      >
        <header className="vf-drawer-head">
          <div className="vf-drawer-tag">VALUE FRAMEWORK · {d.id}</div>
          <h2>{d.name}</h2>
          <p>{d.definition}</p>
          <div className="vf-drawer-stats">
            <div className="stat">
              <span className="num">
                {ms.length || (d.driverType === "ICHOM" ? "—" : 0)}
              </span>
              <span className="lbl">Measures</span>
            </div>
            <div className="stat">
              <span className="num">{d.weight}%</span>
              <span className="lbl">Weight</span>
            </div>
            <div className="stat">
              <span className="num">{d.dataSources.length}</span>
              <span className="lbl">Sources</span>
            </div>
            <div className="stat">
              <span className="num">{inEdges.length + outEdges.length}</span>
              <span className="lbl">Edges</span>
            </div>
            <span
              className={
                "dim-driver-pill driver-" +
                d.driverType.toLowerCase().replace(/[^a-z]/g, "")
              }
            >
              {driverIcon(d.driverType)}
            </span>
          </div>
          <button className="vf-drawer-x" onClick={onClose} aria-label="Close">
            {Icons.close}
          </button>
        </header>

        <nav className="vf-drawer-tabs">
          <button
            className={tab === "measures" ? "on" : ""}
            onClick={() => setTab("measures")}
          >
            Measures {ms.length > 0 && <span className="cnt">{ms.length}</span>}
          </button>
          <button
            className={tab === "deps" ? "on" : ""}
            onClick={() => setTab("deps")}
          >
            Dependencies{" "}
            <span className="cnt">{inEdges.length + outEdges.length}</span>
          </button>
          <button
            className={tab === "sources" ? "on" : ""}
            onClick={() => setTab("sources")}
          >
            Data sources <span className="cnt">{d.dataSources.length}</span>
          </button>
          <button
            className={tab === "notes" ? "on" : ""}
            onClick={() => setTab("notes")}
          >
            Notes
          </button>
        </nav>

        <div className="vf-drawer-body">
          {tab === "measures" &&
            (ms.length === 0 ? (
              <div className="vf-drawer-empty">
                <p>
                  <b>{d.id} is driven by ICHOM Sets.</b>
                </p>
                <p>
                  This dimension does not own a measure catalogue. Its measures
                  are inherited from each contracted ICHOM Set's outcome
                  variables &amp; PROMs. Manage them via Session 2 → ICHOM Set
                  Browser.
                </p>
                <button className="btn primary">
                  Open ICHOM Set Browser →
                </button>
              </div>
            ) : (
              <div className="vf-measure-list">
                <div className="row head">
                  <span>ID</span>
                  <span>Measure</span>
                  <span>Unit</span>
                  <span>Direction</span>
                  <span>Cadence</span>
                  <span>Status</span>
                </div>
                {ms.map((m) => (
                  <React.Fragment key={m.id}>
                    <div
                      className={
                        "row body" + (openMeasure === m.id ? " open" : "")
                      }
                      onClick={() =>
                        setOpenMeasure(openMeasure === m.id ? null : m.id)
                      }
                    >
                      <span className="m-id">{m.id}</span>
                      <div>
                        <div className="m-name">{m.name}</div>
                        <div className="m-def">{m.def}</div>
                      </div>
                      <span className="m-unit">{m.unit}</span>
                      <span className={"m-dir dir-" + m.dir}>
                        {m.dir === "higher"
                          ? "↑ better"
                          : m.dir === "lower"
                            ? "↓ better"
                            : "↔ range"}
                      </span>
                      <span className="m-freq">{m.freq}</span>
                      <span className={"m-status status-" + m.status}>
                        {m.status}
                      </span>
                    </div>
                    {openMeasure === m.id && (
                      <div className="row detail">
                        <div className="grid">
                          <div>
                            <b>Methodology</b>
                            <p>{m.method}</p>
                          </div>
                          <div>
                            <b>Risk-adjusted</b>
                            <p>{m.risk ? "Yes — model below" : "No"}</p>
                          </div>
                          <div>
                            <b>Benchmark</b>
                            <p>{m.benchmark}</p>
                          </div>
                          <div>
                            <b>Data sources</b>
                            <p>{m.sources.join(" · ")}</p>
                          </div>
                        </div>
                        <div className="actions">
                          <button className="btn ghost-sm">
                            Edit definition
                          </button>
                          <button className="btn ghost-sm">
                            Edit methodology
                          </button>
                          <button className="btn ghost-sm danger">
                            Retire measure
                          </button>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}
                <button className="btn ghost vf-add-measure">
                  + Add measure to {d.id}
                </button>
              </div>
            ))}

          {tab === "deps" && (
            <div className="vf-deps-list">
              <section>
                <h4>
                  Informs <span className="cnt">{outEdges.length}</span>
                </h4>
                {outEdges.length === 0 ? (
                  <p className="empty">
                    This dimension has no downstream edges.
                  </p>
                ) : (
                  outEdges.map((e, i) => (
                    <div
                      key={i}
                      className="dep-row"
                      style={{ "--peer-color": e.peer.color }}
                    >
                      <span className="peer-pill">
                        {e.peer.id} · {e.peer.short}
                      </span>
                      <div>
                        <div className="dep-label">
                          {e.label ||
                            (e.kind === "strat"
                              ? "Stratifies"
                              : e.kind === "foundation"
                                ? "Underpins"
                                : "Causal influence")}
                        </div>
                        <div className="dep-meter">
                          <span
                            style={{
                              width: e.strength * 100 + "%",
                              background: d.color,
                            }}
                          />
                        </div>
                      </div>
                      <span className="dep-strength">
                        {(e.strength * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))
                )}
              </section>
              <section>
                <h4>
                  Informed by <span className="cnt">{inEdges.length}</span>
                </h4>
                {inEdges.length === 0 ? (
                  <p className="empty">No upstream dimensions inform {d.id}.</p>
                ) : (
                  inEdges.map((e, i) => (
                    <div
                      key={i}
                      className="dep-row"
                      style={{ "--peer-color": e.peer.color }}
                    >
                      <span className="peer-pill">
                        {e.peer.id} · {e.peer.short}
                      </span>
                      <div>
                        <div className="dep-label">
                          {e.label ||
                            (e.kind === "strat"
                              ? "Stratified by"
                              : e.kind === "foundation"
                                ? "Underpinned by"
                                : "Causal influence")}
                        </div>
                        <div className="dep-meter">
                          <span
                            style={{
                              width: e.strength * 100 + "%",
                              background: e.peer.color,
                            }}
                          />
                        </div>
                      </div>
                      <span className="dep-strength">
                        {(e.strength * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))
                )}
              </section>
            </div>
          )}

          {tab === "sources" && (
            <ul className="vf-sources-list">
              {d.dataSources.map((s, i) => (
                <li key={i}>
                  <span className="src-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="src-name">{s}</span>
                  <span className="src-status connected">connected</span>
                </li>
              ))}
            </ul>
          )}

          {tab === "notes" && (
            <div className="vf-notes">
              <p>{d.notes || "No additional notes for this dimension."}</p>
              <div className="vf-meta-grid">
                <div>
                  <b>Driver type</b>
                  <p>{driverIcon(d.driverType)}</p>
                </div>
                <div>
                  <b>Composite weight</b>
                  <p>{d.weight}%</p>
                </div>
                <div>
                  <b>Owns catalogue</b>
                  <p>{d.driverType === "Catalogue" ? "Yes" : "No"}</p>
                </div>
                <div>
                  <b>Measure count</b>
                  <p>
                    {ms.length ||
                      (d.driverType === "ICHOM" ? "Inherited from Sets" : "0")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
