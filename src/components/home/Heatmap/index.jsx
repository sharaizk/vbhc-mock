"use client";

import { HOME_DIMS } from "@/mock/home";
import "./heatmap.css";
import { useState, useMemo } from "react";
import { tier } from "@/utils/helpers";
import { Icons } from "@/components/Icons/Icons";
const tierLabel = {
  crit: "Below floor",
  warn: "Below target",
  ok: "At target",
  great: "Exceeds stretch",
  na: "Not active",
};
function Heatmap({ contracts }) {
  const [hover, setHover] = useState(null); // {ci, di}
  const stretchPairs = useMemo(() => {
    return null;
  }, []);
  return (
    <section className="hm-card">
      <div className="hm-head">
        <div>
          <div className="crumb">Section 2</div>
          <h2>Performance Heatmap</h2>
          <p>
            Q1 2026 composite scores across {contracts.length} active contracts
            and {HOME_DIMS.length} value dimensions. Click a cell for the
            dimension drill-down.
          </p>
        </div>
        <div className="hm-legend">
          <span className="lg-lbl">Threshold bands</span>
          <span className="lg-item">
            <i className="sw t-crit" />
            <b>&lt;60</b> Below floor
          </span>
          <span className="lg-item">
            <i className="sw t-warn" />
            <b>60–69</b> Below target
          </span>
          <span className="lg-item">
            <i className="sw t-ok" />
            <b>70–79</b> At target
          </span>
          <span className="lg-item">
            <i className="sw t-great" />
            <b>≥80</b> Exceeds stretch
          </span>
          <span className="lg-item">
            <i className="sw t-na" />
            <b>—</b> Not active
          </span>
        </div>
      </div>
      <div className="hm-grid-wrap">
        <table className="hm-grid">
          <thead>
            <tr>
              <th className="hm-corner">Contract</th>
              {HOME_DIMS.map((d) => (
                <th key={d.id} className="hm-col-h" title={d.short}>
                  <span className="dim-id">{d.id}</span>
                  <span className="dim-nm">{d.short}</span>
                </th>
              ))}
              <th className="hm-comp-h">
                <span className="dim-id">Σ</span>
                <span className="dim-nm">Composite</span>
              </th>
              <th className="hm-trend-h">
                <span className="dim-id">Δ</span>
                <span className="dim-nm">vs Q4</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c, ci) => {
              const delta = c.composite - c.prior;
              return (
                <tr key={c.id}>
                  <th className="hm-row-h">
                    <a className="r-name">{c.name}</a>
                    <span className="r-meta">
                      <code>{c.short}</code> · {c.provider} · {c.type}
                    </span>
                  </th>
                  {HOME_DIMS.map((d, di) => {
                    const v = c.scores[d.id];
                    const t = tier(v);
                    const isHot = hover && hover.ci === ci && hover.di === di;
                    return (
                      <td
                        key={d.id}
                        className={"hm-cell t-" + t + (isHot ? " hot" : "")}
                        onMouseEnter={() => setHover({ ci, di })}
                        onMouseLeave={() => setHover(null)}
                      >
                        <span className="cell-num">{v == null ? "—" : v}</span>
                        {v != null && v >= 80 && (
                          <span className="cell-stretch">★</span>
                        )}
                        {isHot && v != null && (
                          <div className="hm-tip">
                            <div className="tt-row">
                              <b>{d.id}</b> <span>{d.short}</span>
                            </div>
                            <div className="tt-score">
                              <span className="num">{v}</span>
                              <span className="lbl">{tierLabel[t]}</span>
                            </div>
                            <div className="tt-thr">
                              <span>Floor 60</span>
                              <span>Target 70</span>
                              <span>Stretch 80</span>
                            </div>
                            <div className="tt-foot">
                              Click to open dimension drill-down · {c.short}
                            </div>
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className={"hm-comp t-" + tier(c.composite)}>
                    <span className="cell-num">{c.composite.toFixed(1)}</span>
                  </td>
                  <td className={"hm-trend " + (delta >= 0 ? "up" : "down")}>
                    {delta >= 0 ? Icons.arrowUp : Icons.arrowDn}
                    <span>
                      {delta >= 0 ? "+" : ""}
                      {delta.toFixed(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="hm-foot">
        <span>
          Scoring period <code>Q1 2026 · Jan–Mar</code>
        </span>
        <span className="sep">·</span>
        <span>
          Source <code>Performance Score</code> entity, version v3.0
        </span>
        <span className="sep">·</span>
        <span>
          Last computed <code>2026-04-12 09:14 AST</code>
        </span>
      </div>
    </section>
  );
}

export default Heatmap;
