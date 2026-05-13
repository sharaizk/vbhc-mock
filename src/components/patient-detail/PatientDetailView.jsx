"use client";
import {
  S10_CROSS_SETS,
  S10_PATIENTS,
  S10_TIMELINE,
  S10_ICHOM_TIMEPOINTS,
  S10_ENCOUNTER_DEFAULT
} from "@/mock/patient-details";
import React from "react";
import { CrossSetSummary, PatientHeader, setColor } from "./PatientHeader";
import { ClinicalTimeline, TimelineLegend } from "./TimelineLegend";
import { L2ASetDetail, L2BEncounter, L2CCostProfile } from "./L2ASetDetail";
import { L3AAttribution, L3BRecordAbstraction } from "./L3AAttribution";
const { useState, useMemo, useEffect } = React;

function PatientDetailView() {
  const [patientId, setPatientId] = useState("PT-2025-0847");
  const [zoom, setZoom] = useState("full");
  const [l2, setL2] = useState(null); // {type:"A"|"B"|"C", set?, event?}
  const [l3, setL3] = useState(null); // {type:"attr"|"records"}
  const [toast, setToast] = useState({ msg: "", visible: false });

  const patient = useMemo(
    () => S10_PATIENTS.find((p) => p.id === patientId) || S10_PATIENTS[0],
    [patientId],
  );

  useEffect(() => {
    window.__toast = (msg) => {
      setToast({ msg, visible: true });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
    };
  }, []);

  // Role (for demo — inherits from session 8's concept)
  const role = "manager";

  function handleEventClick(ev) {
    setL2({ type: "B", event: ev });
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 12,
          font: "400 12px var(--font-sans)",
          color: "var(--fg-tertiary)",
        }}
      >
        <a
          href="../session-8/index.html"
          style={{ color: "var(--accent)", textDecoration: "none" }}
        >
          ← Dashboard
        </a>
        <span>›</span>
        <span style={{ color: "var(--fg-secondary)" }}>
          Dr. Fatima Al-Khalil
        </span>
        <span>›</span>
        <span style={{ color: "var(--fg-secondary)" }}>
          D1-001 HbA1c Control
        </span>
        <span>›</span>
        <span style={{ color: "var(--fg-primary)", fontWeight: 500 }}>
          Patient {patient.id}
        </span>
      </div>

      {/* Patient Identity Header */}
      <PatientHeader
        patient={patient}
        allPatients={S10_PATIENTS}
        onSelectPatient={setPatientId}
        onOpenCostProfile={() => setL2({ type: "C" })}
        onOpenAudit={() => setL3({ type: "attr" })}
        role={role}
      />

      {/* Cross-Set Summary Panel */}
      {patient.id === "PT-2025-0847" && (
        <CrossSetSummary
          crossSets={S10_CROSS_SETS}
          onOpenSetDetail={(cs) => setL2({ type: "A", set: cs })}
        />
      )}
      {patient.id !== "PT-2025-0847" && (
        <div
          className="card"
          style={{
            padding: 16,
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {patient.sets.map((s) => {
            const sc = setColor(s);
            return (
              <span
                key={s}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 9999,
                  font: "500 10px var(--font-mono)",
                  background: sc.soft,
                  color: sc.color,
                  border: `.5px solid ${sc.color}`,
                }}
              >
                {sc.label}
              </span>
            );
          })}
          <span
            style={{
              font: "400 12px var(--font-sans)",
              color: "var(--fg-secondary)",
            }}
          >
            {patient.name} · {patient.age} yrs · {patient.facility} ·{" "}
            {patient.military}
          </span>
          <span
            style={{
              marginLeft: "auto",
              font: "500 11px var(--font-sans)",
              color: "var(--fg-tertiary)",
            }}
          >
            SAR {patient.totalCost.toLocaleString()} total cost · HCC{" "}
            {patient.rafScore}
          </span>
        </div>
      )}

      {/* Clinical Timeline */}
      <div className="card" style={{ padding: "14px 18px", marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              font: "500 10px var(--font-mono)",
              color: "var(--fg-tertiary)",
              letterSpacing: ".07em",
              textTransform: "uppercase",
            }}
          >
            Clinical Timeline — {patient.name} ·{" "}
            {zoom === "full" ? "24-Month View" : "Last 6 Months"}
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {["full", "recent"].map((z) => (
              <button
                key={z}
                className={"btn" + (zoom === z ? " primary" : " secondary")}
                style={{ padding: "4px 12px", fontSize: 10 }}
                onClick={() => setZoom(z)}
              >
                {z === "full" ? "Full 24 Months" : "Last 6 Months"}
              </button>
            ))}
            <button
              className="btn secondary"
              style={{ padding: "4px 12px", fontSize: 10 }}
              onClick={() => setL3({ type: "records" })}
            >
              Audit Source Data
            </button>
          </div>
        </div>
        <TimelineLegend />
        <ClinicalTimeline
          events={patient.id === "PT-2025-0847" ? S10_TIMELINE : []}
          timepoints={S10_ICHOM_TIMEPOINTS}
          onEventClick={handleEventClick}
          zoom={zoom}
        />
        {patient.id !== "PT-2025-0847" && (
          <div
            style={{
              padding: "20px",
              textAlign: "center",
              color: "var(--fg-tertiary)",
              font: "400 12px var(--font-sans)",
            }}
          >
            Full timeline data available for default patient (Mohammed
            Al-Rashidi). Select PT-2025-0847 to view the detailed timeline.
          </div>
        )}
      </div>

      {/* L2 Panels */}
      <L2ASetDetail
        open={l2?.type === "A"}
        onClose={() => setL2(null)}
        set={l2?.set}
      />

      <L2BEncounter
        open={l2?.type === "B"}
        onClose={() => setL2(null)}
        encounter={l2?.event ? S10_ENCOUNTER_DEFAULT : S10_ENCOUNTER_DEFAULT}
      />

      <L2CCostProfile open={l2?.type === "C"} onClose={() => setL2(null)} />

      {/* L3 Overlays */}
      <L3AAttribution open={l3?.type === "attr"} onClose={() => setL3(null)} />

      <L3BRecordAbstraction
        open={l3?.type === "records"}
        onClose={() => setL3(null)}
      />

      {/* Toast */}
      <div className={"toast" + (toast.visible ? " show" : "")}>
        {toast.msg}
      </div>
    </div>
  );
}

export default PatientDetailView;
