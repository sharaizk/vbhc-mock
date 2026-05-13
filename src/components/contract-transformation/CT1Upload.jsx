// Session 7 — CT1Upload.jsx — Step 1: Contract Upload & Parse
import React from "react";
const {
  useState: ct1UseState,
  useEffect: ct1UseEffect,
  useRef: ct1UseRef,
} = React;

function ConfidenceBadge({ level }) {
  const c = {
    high: {
      bg: "oklch(0.95 0.05 145)",
      color: "oklch(0.40 0.16 145)",
      label: "High confidence",
    },
    medium: {
      bg: "oklch(0.96 0.04 60)",
      color: "oklch(0.42 0.14 60)",
      label: "Medium confidence",
    },
    low: {
      bg: "oklch(0.95 0.04 200)",
      color: "oklch(0.40 0.12 200)",
      label: "Low confidence",
    },
  }[level] || {
    bg: "var(--bg-elevated)",
    color: "var(--fg-tertiary)",
    label: level,
  };
  return (
    <span
      style={{
        font: "600 9px/1 var(--font-mono)",
        padding: "2px 7px",
        borderRadius: 4,
        background: c.bg,
        color: c.color,
        letterSpacing: ".06em",
        textTransform: "uppercase",
      }}
    >
      {c.label}
    </span>
  );
}

function ParsedCard({ card, onEdit }) {
  const [editing, setEditing] = ct1UseState(false);
  const severityColor = {
    critical: "oklch(0.50 0.18 25)",
    high: "oklch(0.55 0.14 60)",
    medium: "oklch(0.55 0.14 200)",
  };
  return (
    <div className="ct1-card">
      <div className="ct1-card-head">
        <span className="ct1-card-title">{card.title}</span>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <ConfidenceBadge level={card.confidence} />
          <button
            className="ct1-edit-btn"
            onClick={() => setEditing((e) => !e)}
            title="Edit"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="13"
              height="13"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>
      </div>
      {(card.flags || []).map((f, i) => (
        <div
          key={i}
          className="ct1-flag"
          style={{
            background:
              f.severity === "critical"
                ? "oklch(0.95 0.05 25)"
                : "oklch(0.96 0.04 60)",
            borderColor:
              f.severity === "critical"
                ? "oklch(0.75 0.12 25)"
                : "oklch(0.75 0.10 60)",
            color:
              f.severity === "critical"
                ? "oklch(0.45 0.18 25)"
                : "oklch(0.42 0.14 60)",
          }}
        >
          ⚑ {f.text}
        </div>
      ))}
      <div className="ct1-card-body">
        {card.fields.map((f) => (
          <div key={f.label} className="ct1-field-row">
            <span className="lbl">{f.label}</span>
            {editing ? (
              <input
                className="cd-input"
                defaultValue={f.value}
                style={{
                  flex: 1,
                  padding: "5px 8px",
                  fontSize: 12,
                  fontFamily: "var(--font-sans)",
                }}
              />
            ) : (
              <span className="val">{f.value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProcessingAnimation() {
  return (
    <div className="ct1-processing">
      <div className="ct1-pulse-rings">
        <div className="ring r1" />
        <div className="ring r2" />
        <div className="ring r3" />
        <img
          src="../../assets/logo-shape-gradient.svg"
          alt=""
          className="ct1-logo"
        />
      </div>
      <div className="ct1-proc-title">
        AiQL is analysing the contract structure…
      </div>
      <div className="ct1-proc-steps">
        <div className="ct1-proc-step done">Parsing document structure</div>
        <div className="ct1-proc-step done">
          Extracting party and term information
        </div>
        <div className="ct1-proc-step active">
          Identifying financial terms and payment model
        </div>
        <div className="ct1-proc-step">Analysing quality provisions</div>
        <div className="ct1-proc-step">
          Assessing data and reporting requirements
        </div>
        <div className="ct1-proc-step">Evaluating governance provisions</div>
      </div>
    </div>
  );
}

function CT1Upload({ onComplete }) {
  const [phase, setPhase] = ct1UseState("upload"); // upload | processing | parsed
  const [dragOver, setDragOver] = ct1UseState(false);
  const [procStep, setProcStep] = ct1UseState(0);
  const contract = window.SYNTHETIC_CONTRACT;

  const startProcessing = () => {
    setPhase("processing");
    let s = 0;
    const iv = setInterval(() => {
      s++;
      setProcStep(s);
      if (s >= 5) {
        clearInterval(iv);
        setTimeout(() => setPhase("parsed"), 400);
      }
    }, 500);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    startProcessing();
  };

  return (
    <div className="ct1-page">
      {phase === "upload" && (
        <>
          <div className="ct1-upload-header">
            <div className="rs-crumb">Step 1 · Contract Upload & Parse</div>
            <h2 className="rs-title">Upload Traditional Contract</h2>
            <p
              style={{
                font: "400 13px/18px var(--font-sans)",
                color: "var(--fg-secondary)",
                maxWidth: 600,
                marginTop: 6,
              }}
            >
              Upload a PDF or Word contract document. AiQL will parse the
              document structure, extract all relevant provisions, and assess
              the contract across 7 analytical dimensions before gap analysis.
            </p>
          </div>

          <div
            className={"ct1-dropzone" + (dragOver ? " drag-over" : "")}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={startProcessing}
          >
            <div className="ct1-dz-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="48"
                height="48"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="ct1-dz-title">Drop your contract here</div>
            <div className="ct1-dz-sub">
              PDF or Word (.docx) · or{" "}
              <span className="ct1-browse">browse files</span>
            </div>
            <div className="ct1-dz-formats">Accepts: .pdf · .docx · .doc</div>
          </div>

          <div className="ct1-demo-row">
            <div className="ct1-demo-divider">
              <span>or</span>
            </div>
            <div className="ct1-demo-card" onClick={startProcessing}>
              <div className="ct1-dc-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  width="20"
                  height="20"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div>
                <div
                  style={{
                    font: "500 13px/1 var(--font-sans)",
                    color: "var(--fg-primary)",
                  }}
                >
                  Use demo contract
                </div>
                <div
                  style={{
                    font: "400 11px/14px var(--font-sans)",
                    color: "var(--fg-secondary)",
                    marginTop: 3,
                  }}
                >
                  CNHI-PSMMC Comprehensive Services Agreement 2024 · SAR 176M ·
                  47,000 beneficiaries
                </div>
              </div>
              <button
                className="cd-btn"
                style={{ marginLeft: "auto", flex: "none" }}
              >
                Load →
              </button>
            </div>
          </div>
        </>
      )}

      {phase === "processing" && <ProcessingAnimation />}

      {phase === "parsed" && (
        <>
          <div className="ct1-upload-header">
            <div className="rs-crumb">Step 1 · Contract Upload & Parse</div>
            <h2 className="rs-title">Parsed Contract Summary</h2>
            <div className="ct1-file-badge">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                width="14"
                height="14"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {contract.fileName}
              <span className="ct1-parsed-ok">
                ✓ Parsed successfully · 7 sections extracted
              </span>
            </div>
          </div>

          <div className="ct1-cards-grid">
            {contract.cards.map((card) => (
              <ParsedCard key={card.id} card={card} />
            ))}
          </div>

          <div className="ct1-proceed-bar">
            <div className="ct1-proceed-note">
              Review the extracted information above. Click any Edit icon to
              correct parsing errors before proceeding.
            </div>
            <button
              className="cd-btn primary"
              onClick={() => onComplete(1, { parsedContract: contract })}
            >
              Confirm & proceed to Gap Analysis →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
export default CT1Upload;
