import React from "react";
import { useNavigate } from "react-router-dom";
import EnhancedBackgroundPaths from "../components/EnhancedBackgroundPaths";
import "./LandingPage.css";

const FEATURES = [
  {
    icon: "🧬",
    title: "VCF Upload",
    desc: "Drag & drop patient VCF files. Secure, local-first analysis.",
  },
  {
    icon: "💊",
    title: "Drug–Gene Matching",
    desc: "CPIC-aligned pharmacogenomic risk classification.",
  },
  {
    icon: "🤖",
    title: "AI Explanation",
    desc: "Clinical narrative powered by LLM for mechanism and evidence.",
  },
];

const WORKFLOW = [
  { step: 1, label: "Upload VCF", sub: "Select patient genomic data" },
  { step: 2, label: "Choose Drug", sub: "Single or multi-drug analysis" },
  { step: 3, label: "AI Analysis", sub: "Variant parsing & risk engine" },
  { step: 4, label: "Clinical Report", sub: "Recommendations & export" },
];

const GUIDELINES = ["CPIC", "PharmGKB", "Clinical Pharmacogenetics Implementation Consortium"];

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      {/* Animated hero with geometric/neural/flow/spiral paths + Getting Started */}
      <EnhancedBackgroundPaths />

      {/* Content below hero */}
      <div className="landing-content">
      <section className="landing-features">
        {FEATURES.map((f, i) => (
          <div
            key={f.title}
            className="landing-feature-card"
            style={{ animationDelay: `${0.15 * i}s` }}
          >
            <div className="landing-feature-icon">{f.icon}</div>
            <h3 className="landing-feature-title">{f.title}</h3>
            <p className="landing-feature-desc">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Workflow storytelling */}
      <section className="landing-workflow">
        <h2 className="landing-section-title">How It Works</h2>
        <div className="landing-workflow-steps">
          {WORKFLOW.map((w, i) => (
            <div key={w.step} className="landing-workflow-step">
              <div className="landing-workflow-num">{w.step}</div>
              <div className="landing-workflow-content">
                <span className="landing-workflow-label">{w.label}</span>
                <span className="landing-workflow-sub">{w.sub}</span>
              </div>
              {i < WORKFLOW.length - 1 && (
                <div className="landing-workflow-connector" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Credibility */}
      <section className="landing-credibility">
        <div className="landing-credibility-inner">
          <span className="landing-credibility-label">Aligned with</span>
          <div className="landing-credibility-badges">
            {GUIDELINES.map((g) => (
              <span key={g} className="landing-credibility-badge">{g}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Sample report preview */}
      <section className="landing-preview">
        <div className="landing-preview-card">
          <div className="landing-preview-header">
            <span className="landing-preview-badge">Sample Output</span>
          </div>
          <div className="landing-preview-mock">
            <div className="landing-preview-mock-row">
              <span className="landing-preview-mock-key">Drug</span>
              <span className="landing-preview-mock-value">WARFARIN</span>
            </div>
            <div className="landing-preview-mock-row">
              <span className="landing-preview-mock-key">Risk</span>
              <span className="landing-preview-mock-risk">Adjust Dosage</span>
            </div>
            <div className="landing-preview-mock-row">
              <span className="landing-preview-mock-key">Gene</span>
              <span className="landing-preview-mock-value">CYP2C9</span>
            </div>
          </div>
          <button
            className="landing-preview-cta"
            onClick={() => navigate("/analyze")}
          >
            Try It Now
          </button>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-pill">
          <span>🧬</span>
          PharmaGuard AI · Clinical decision support only
        </div>
      </footer>
      </div>
    </div>
  );
}

export default LandingPage;
