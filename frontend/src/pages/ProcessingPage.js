import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { analyzeVCF } from "../api";
import "../theme.css";
import "./ProcessingPage.css";

const STEPS = [
  { id: "parse", label: "Parsing VCF variants" },
  { id: "match", label: "Matching drug–gene interactions" },
  { id: "analyze", label: "Running pharmacogenomic analysis" },
  { id: "explain", label: "Generating clinical narrative" },
];

const HINTS = [
  "Analyzing variants...",
  "Matching pharmacogenes...",
  "Computing phenotype...",
  "Preparing recommendation...",
];

function ProcessingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { file, drugs } = location.state || {};
  const [step, setStep] = useState(0);
  const [hint, setHint] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!file || !drugs?.length) {
      navigate("/analyze", { replace: true });
      return;
    }

    // Step progression (perceived)
    const stepInterval = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 2500);

    const hintInterval = setInterval(() => {
      setHint((h) => (h + 1) % HINTS.length);
    }, 1800);

    // Run actual analysis
    analyzeVCF(file, drugs)
      .then((data) => {
        const normalized = Array.isArray(data) ? data : [data];
        setStep(STEPS.length - 1);
        navigate("/results", { state: { results: normalized }, replace: true });
      })
      .catch((err) => {
        const detail = err?.response?.data?.detail;
        let msg = err?.message || "Analysis failed.";
        if (detail) {
          msg = Array.isArray(detail)
            ? detail.map((d) => d?.msg || d?.message || JSON.stringify(d)).join(". ")
            : String(detail);
        } else if (err?.code === "ERR_NETWORK" || err?.message?.includes("Network")) {
          msg = "Cannot reach the backend. Ensure the server is running on http://localhost:8000";
        }
        setError(msg);
      })
      .finally(() => {
        clearInterval(stepInterval);
        clearInterval(hintInterval);
      });

    return () => {
      clearInterval(stepInterval);
      clearInterval(hintInterval);
    };
  }, [file, drugs, navigate]);

  if (error) {
    return (
      <div className="processing-page">
        <div className="processing-bg" />
        <div className="processing-content">
          <div className="processing-error">
            <span className="processing-error-icon">⚠</span>
            <h2>Analysis Failed</h2>
            <p>{error}</p>
            <button
              className="processing-retry"
              onClick={() => navigate("/analyze", { replace: true })}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="processing-page">
      <div className="processing-bg" aria-hidden="true">
        <div className="processing-bg-gradient" />
        <div className="processing-bg-grid" />
      </div>

      <div className="processing-dna">
        <div className="dna-helix">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="dna-node"
              style={{
                animationDelay: `${i * 0.12}s`,
                left: `${15 + (i % 2) * 4}px`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="processing-content">
        <h1 className="processing-title">Analyzing Your Genome</h1>
        <p className="processing-hint">{HINTS[hint]}</p>

        <div className="processing-steps">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`processing-step ${i <= step ? "active" : ""} ${i < step ? "done" : ""}`}
            >
              <div className="processing-step-dot">
                {i < step ? "✓" : i + 1}
              </div>
              <span className="processing-step-label">{s.label}</span>
            </div>
          ))}
        </div>

        <p className="processing-reassurance">
          This usually takes a few seconds. Your data is processed securely.
        </p>
      </div>
    </div>
  );
}

export default ProcessingPage;
