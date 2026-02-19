import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../theme.css";
import "./AnalyzePage.css";

const MAX_BYTES = 5 * 1024 * 1024;
const SUPPORTED_DRUGS = [
  "CODEINE",
  "WARFARIN",
  "CLOPIDOGREL",
  "SIMVASTATIN",
  "AZATHIOPRINE",
  "FLUOROURACIL",
];

function AnalyzePage() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [drugs, setDrugs] = useState([]);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const addDrug = (name) => {
    const n = name.trim().toUpperCase();
    if (n && SUPPORTED_DRUGS.includes(n) && !drugs.includes(n)) {
      setDrugs([...drugs, n]);
      setError("");
    } else if (n && !SUPPORTED_DRUGS.includes(n)) {
      setError(`Supported drugs: ${SUPPORTED_DRUGS.join(", ")}`);
    }
  };

  const removeDrug = (d) => setDrugs(drugs.filter((x) => x !== d));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  };

  const handleFileSelect = (f) => {
    if (!f.name.endsWith(".vcf")) {
      setError("Only .vcf files are allowed.");
      return;
    }
    if (f.size > MAX_BYTES) {
      setError("VCF file exceeds 5 MB limit.");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    setError("");
    if (!file) {
      setError("Please upload a VCF file.");
      return;
    }
    if (!drugs.length) {
      setError("Please select at least one drug.");
      return;
    }
    navigate("/processing", { state: { file, drugs } });
  };

  const isReady = file && drugs.length > 0;

  return (
    <div className="analyze-page">
      <div className="analyze-bg" aria-hidden="true">
        <div className="analyze-bg-gradient" />
        <div className="analyze-bg-grid" />
      </div>

      <header className="analyze-header">
        <button
          className="analyze-back"
          onClick={() => navigate("/")}
          aria-label="Back to home"
        >
          ← Back
        </button>
        <h1 className="analyze-title">New Analysis</h1>
        <p className="analyze-subtitle">
          Upload your patient VCF and select drugs for pharmacogenomic analysis.
        </p>
      </header>

      <div className="analyze-card">
        {/* Upload surface */}
        <div
          className={`analyze-dropzone ${file ? "has-file" : ""} ${dragOver ? "dragover" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !file && fileRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && !file && fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".vcf"
            style={{ display: "none" }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFileSelect(f);
            }}
          />
          {file ? (
            <div className="analyze-dropzone-selected">
              <div className="analyze-file-icon">🧬</div>
              <div className="analyze-file-info">
                <div className="analyze-file-name">{file.name}</div>
                <div className="analyze-file-size">
                  {(file.size / 1024).toFixed(1)} KB · VCF
                </div>
              </div>
              <div className="analyze-file-check">✓</div>
              <button
                className="analyze-change-file"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  fileRef.current?.click();
                }}
              >
                Change file
              </button>
            </div>
          ) : (
            <>
              <span className="analyze-dropzone-icon">🧬</span>
              <div className="analyze-dropzone-title">
                Drag & drop your VCF file here
              </div>
              <div className="analyze-dropzone-sub">
                or click to browse · .vcf · Max 5 MB
              </div>
            </>
          )}
        </div>

        {/* Drug selection chips */}
        <div className="analyze-drug-section">
          <label className="analyze-label">Select Drug(s)</label>
          <p className="analyze-hint">
            Choose one or more drugs for analysis. Press or tap to select.
          </p>
          <div className="analyze-drug-chips">
            {SUPPORTED_DRUGS.map((d) => (
              <button
                key={d}
                type="button"
                className={`analyze-drug-chip ${drugs.includes(d) ? "active" : ""}`}
                onClick={() =>
                  drugs.includes(d) ? removeDrug(d) : addDrug(d)
                }
                disabled={false}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="analyze-error" role="alert">
            ⚠ {error}
          </div>
        )}

        <button
          type="button"
          className="analyze-submit"
          onClick={handleSubmit}
          disabled={!isReady}
        >
          Run Pharmacogenomic Analysis
          <span className="analyze-submit-arrow">→</span>
        </button>
      </div>
    </div>
  );
}

export default AnalyzePage;
