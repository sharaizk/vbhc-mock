"use client";

import { Icons } from "@/components/Icons/Icons";
import { useState } from "react";
import "./attention.css";
function Attention({ alerts }) {
  const [filter, setFilter] = useState("all");
  const counts = { all: alerts.length, crit: 0, warn: 0, info: 0 };
  alerts.forEach((a) => counts[a.tier]++);
  const visible = alerts.filter((a) => filter === "all" || a.tier === filter);
  return (
    <section className="att-card">
      <div className="att-head">
        <div>
          <div className="crumb">Section 3</div>
          <h2>Attention Required</h2>
        </div>
        <div className="att-tabs">
          {[
            { id: "all", lbl: "All", n: counts.all },
            { id: "crit", lbl: "Critical", n: counts.crit },
            { id: "warn", lbl: "Warning", n: counts.warn },
            { id: "info", lbl: "Info", n: counts.info },
          ].map((t) => (
            <button
              key={t.id}
              className={"att-tab tab-" + t.id + (filter === t.id ? " on" : "")}
              onClick={() => setFilter(t.id)}
            >
              {t.lbl} <span className="cnt">{t.n}</span>
            </button>
          ))}
        </div>
      </div>
      <ul className="att-list">
        {visible.map((a, i) => (
          <li key={i} className={"att-item tier-" + a.tier}>
            <div className="att-rail" />
            <div className="att-body">
              <div className="att-line">
                <span className={"att-tag tier-" + a.tier}>
                  {a.tier === "crit"
                    ? "Critical"
                    : a.tier === "warn"
                      ? "Warning"
                      : "Info"}
                </span>
                <code className="att-ctr">{a.contract}</code>
                <span className="att-time">{a.time}</span>
              </div>
              <div className="att-title">{a.title}</div>
              <p className="att-detail">{a.detail}</p>
              <button className="att-link">
                {a.link} {Icons.arrowR}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
export default Attention;
