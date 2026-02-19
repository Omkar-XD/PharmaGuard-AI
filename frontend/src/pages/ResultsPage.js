import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { generateClinicalReport } from "../api";
import JsonViewer from "../components/JsonViewer";
import DecisionTraceCard from "../components/DecisionTraceCard";
import RiskSeverityMeter from "../components/RiskSeverityMeter";
import ExportModal from "../components/ExportModal";
import "../theme.css";
import "./ResultsPage.css";

const phenotypeMeta = (ph) => {
  const map = {
    PM: { label: "Poor Metabolizer", color: "var(--risk-toxic)", icon: "⚠" },
    IM: { label: "Intermediate", color: "var(--risk-caution)", icon: "⚡" },
    NM: { label: "Normal Metabolizer", color: "var(--risk-safe)", icon: "✓" },
    RM: { label: "Rapid Metabolizer", color: "var(--teal)", icon: "→" },
    UM: { label: "Ultra-Rapid", color: "var(--purple-ai)", icon: "↑↑" },
    Unknown: { label: "Unknown", color: "var(--text-muted)", icon: "?" },
  };
  return map[ph] || map["Unknown"];
};

const riskMeta = (risk) => {
  if (!risk) return { color: "var(--text-muted)", glow: "none" };
  if (risk === "Safe") return { color: "var(--risk-safe)", glow: "var(--risk-safe-dim)" };
  if (risk === "Adjust Dosage") return { color: "var(--risk-caution)", glow: "var(--risk-caution-dim)" };
  if (risk === "Toxic" || risk === "Ineffective") return { color: "var(--risk-toxic)", glow: "var(--risk-toxic-dim)" };
  return { color: "var(--text-muted)", glow: "none" };
};

function ResultsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { results } = location.state || {};
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [showExport, setShowExport] = useState(false);
  const [showJson, setShowJson] = useState(false);

  const stats = useMemo(() => {
    const list = results || [];
    const safe = list.filter((r) => r.risk_assessment?.risk_label === "Safe").length;
    const adjust = list.filter((r) => r.risk_assessment?.risk_label === "Adjust Dosage").length;
    const toxic = list.filter((r) =>
      ["Toxic", "Ineffective"].includes(r.risk_assessment?.risk_label)
    ).length;
    return { total: list.length, safe, adjust, toxic };
  }, [results]);

  if (!results || results.length === 0) {
    return (
      <div className="results-page">
        <div className="results-empty">
          <span className="results-empty-icon">🧬</span>
          <h2>No Results</h2>
          <p>Please start a new analysis.</p>
          <button
            className="results-empty-btn"
            onClick={() => navigate("/analyze")}
          >
            New Analysis
          </button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    try {
      const blob = await generateClinicalReport(results);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "clinical_report.pdf";
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate clinical report");
    }
  };

  return (
    <div className="results-page">
      <div className="results-bg" aria-hidden="true">
        <div className="results-bg-gradient" />
        <div className="results-bg-grid" />
      </div>

      <header className="results-header">
        <button
          className="results-back"
          onClick={() => navigate("/")}
          aria-label="Back to home"
        >
          ← Home
        </button>
        <h1 className="results-title">Analysis Results</h1>
        <div className="results-actions">
          <button
            className="results-action-btn"
            onClick={() => setShowExport(true)}
          >
            Export
          </button>
          <button
            className="results-action-btn"
            onClick={() => setShowJson(!showJson)}
          >
            {showJson ? "Hide" : "Show"} JSON
          </button>
        </div>
      </header>

      {/* Stats bar */}
      <div className="results-stats">
        <div className="results-stat">
          <div className="results-stat-num">{stats.total}</div>
          <div className="results-stat-label">Analyzed</div>
        </div>
        <div className="results-stat results-stat-safe">
          <div className="results-stat-num">{stats.safe}</div>
          <div className="results-stat-label">Safe</div>
        </div>
        <div className="results-stat results-stat-caution">
          <div className="results-stat-num">{stats.adjust}</div>
          <div className="results-stat-label">Adjust Dose</div>
        </div>
        <div className="results-stat results-stat-toxic">
          <div className="results-stat-num">{stats.toxic}</div>
          <div className="results-stat-label">High Risk</div>
        </div>
      </div>

      {/* Results list */}
      <div className="results-list">
        {results.map((r, i) => {
          const risk = r.risk_assessment?.risk_label;
          const phenotype = r.pharmacogenomic_profile?.phenotype;
          const phMeta = phenotypeMeta(phenotype);
          const rkMeta = riskMeta(risk);
          const isExpanded = expandedIndex === i;

          return (
            <div
              key={i}
              className="results-item"
              style={{
                borderLeft: `3px solid ${rkMeta.color}`,
                boxShadow: isExpanded ? `0 0 30px ${rkMeta.glow}` : "none",
              }}
            >
              {/* Risk severity card */}
              <div
                className="results-risk-card"
                style={{
                  background: rkMeta.glow,
                  borderColor: rkMeta.color,
                }}
              >
                <div className="results-risk-label">Risk Assessment</div>
                <div className="results-risk-value" style={{ color: rkMeta.color }}>
                  {risk || "Unknown"}
                </div>
              </div>

              {/* Header */}
              <button
                className="results-item-header"
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                type="button"
              >
                <div className="results-item-left">
                  <div className="results-item-drug">💊 {r.drug}</div>
                  <div className="results-item-meta">
                    {r.patient_id && <span>{r.patient_id}</span>}
                    {r.timestamp && (
                      <>
                        {r.patient_id && <span className="results-meta-sep" />}
                        <span>{new Date(r.timestamp).toLocaleString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="results-item-right">
                  <span
                    className="results-badge"
                    style={{
                      background: phMeta.color + "20",
                      borderColor: phMeta.color + "40",
                      color: phMeta.color,
                    }}
                  >
                    {phMeta.icon} {phenotype || "Unknown"}
                  </span>
                  <span className="results-chevron">{isExpanded ? "▲" : "▼"}</span>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="results-item-body">
                  <div className="results-grid">
                    {/* Left column */}
                    <div className="results-col">
                      {/* Gene & Diplotype */}
                      <div className="results-section">
                        <div className="results-section-label">Pharmacogenomic Profile</div>
                        <div className="results-kv-grid">
                          <div className="results-kv">
                            <div className="results-kv-key">Primary Gene</div>
                            <div className="results-kv-value">
                              {r.pharmacogenomic_profile?.primary_gene || "—"}
                            </div>
                          </div>
                          <div className="results-kv">
                            <div className="results-kv-key">Diplotype</div>
                            <div className="results-kv-value">
                              {r.pharmacogenomic_profile?.diplotype || "—"}
                            </div>
                          </div>
                          <div className="results-kv">
                            <div className="results-kv-key">Activity Score</div>
                            <div className="results-kv-value">
                              {r.pharmacogenomic_profile?.activity_score ?? "—"}
                            </div>
                          </div>
                          <div className="results-kv" style={{ gridColumn: "1 / -1" }}>
                            <div className="results-kv-key">Phenotype</div>
                            <div className="results-kv-value" style={{ marginTop: 8 }}>
                              <span
                                className="results-badge"
                                style={{
                                  background: phMeta.color + "20",
                                  borderColor: phMeta.color + "40",
                                  color: phMeta.color,
                                }}
                              >
                                {phMeta.icon} {phenotype || "Unknown"} — {phMeta.label}
                              </span>
                            </div>
                          </div>
                        </div>
                        <DecisionTraceCard trace={r.pharmacogenomic_profile?.decision_trace} />
                      </div>

                      {/* Clinical Recommendation */}
                      <div className="results-section">
                        <div className="results-section-label">Clinical Recommendation</div>
                        <div className="results-rec-box">
                          {r.clinical_recommendation?.text || "No recommendation available."}
                        </div>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="results-col">
                      {/* AI Explanation */}
                      <div className="results-section">
                        <div className="results-section-label">AI Explanation</div>
                        <div className="results-llm-box">
                          <p className="results-llm-summary">
                            {r.llm_generated_explanation?.summary || "No summary available."}
                          </p>
                          <details className="results-llm-details">
                            <summary>▶ Mechanism, Evidence & Citations</summary>
                            <pre>{JSON.stringify(r.llm_generated_explanation || {}, null, 2)}</pre>
                          </details>
                        </div>
                      </div>

                      {/* Risk Severity */}
                      <div className="results-section">
                        <div className="results-section-label">Risk Severity</div>
                        <RiskSeverityMeter severity={r.risk_assessment?.severity} />
                      </div>

                      {/* Interpretation */}
                      <div className="results-section">
                        <div className="results-section-label">Clinical Interpretation</div>
                        <div className="results-interpretation">
                          {r.drug_level_interpretation || "No interpretation available."}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* JSON panel */}
                  <div className="results-section">
                    <div className="results-section-label">Raw Data</div>
                    <JsonViewer data={r} inlineButtons />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* JSON viewer */}
      {showJson && (
        <div className="results-json-wrapper">
          <JsonViewer data={results} />
        </div>
      )}

      {/* Export Modal */}
      {showExport && (
        <ExportModal
          onClose={() => setShowExport(false)}
          onDownloadPDF={handleDownloadPDF}
          results={results}
        />
      )}
    </div>
  );
}

export default ResultsPage;
