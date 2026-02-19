import React, { useState } from "react";
import { generateClinicalReport } from "../api";
import "./ExportModal.css";

const FORMATS = [
  {
    id: "pdf",
    label: "PDF Report",
    desc: "Clinical report for medical records",
    icon: "📄",
    color: "var(--risk-toxic)",
  },
  {
    id: "json",
    label: "JSON Data",
    desc: "Raw structured data for integration",
    icon: "📊",
    color: "var(--teal)",
  },
];

function ExportModal({ onClose, onDownloadPDF, results }) {
  const [downloading, setDownloading] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleExport = async (format) => {
    setDownloading(format);
    setSuccess(null);

    try {
      if (format === "pdf") {
        await onDownloadPDF();
        setSuccess("pdf");
      } else if (format === "json") {
        const blob = new Blob([JSON.stringify(results, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "pharmaguard_results.json";
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        setSuccess("json");
      }

      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Export failed", err);
      setDownloading(null);
      alert("Export failed. Please try again.");
    }
  };

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal-header">
          <h2 className="export-modal-title">Export Results</h2>
          <button
            className="export-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="export-modal-content">
          <p className="export-modal-desc">
            Choose a format to download your analysis results.
          </p>

          <div className="export-formats">
            {FORMATS.map((fmt) => {
              const isDownloading = downloading === fmt.id;
              const isSuccess = success === fmt.id;

              return (
                <button
                  key={fmt.id}
                  className={`export-format-card ${isDownloading ? "downloading" : ""} ${isSuccess ? "success" : ""}`}
                  onClick={() => handleExport(fmt.id)}
                  disabled={downloading !== null}
                  style={{
                    borderColor: fmt.color + "40",
                  }}
                >
                  <div className="export-format-icon">{fmt.icon}</div>
                  <div className="export-format-content">
                    <div className="export-format-label">{fmt.label}</div>
                    <div className="export-format-desc">{fmt.desc}</div>
                  </div>
                  {isDownloading && (
                    <div className="export-format-spinner" />
                  )}
                  {isSuccess && (
                    <div className="export-format-check">✓</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
