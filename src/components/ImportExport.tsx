"use client";

import { useRef, useState } from "react";
import type { SequencerConfig } from "@/types";
import { downloadConfigFile, readConfigFile } from "@/lib/configIO";

interface ImportExportProps {
  config: SequencerConfig;
  onImport: (config: SequencerConfig) => void;
}

export function ImportExport({ config, onImport }: ImportExportProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleExport() {
    downloadConfigFile(config);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccess(false);
    try {
      const imported = await readConfigFile(file);
      onImport(imported);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <h3 className="text-[0.8rem] font-semibold text-[#94a3b8] uppercase tracking-[0.07em] m-0">
        Configuration
      </h3>
      <div className="flex gap-3 flex-wrap">
        <button
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-[10px] border-[1.5px] border-[#334155] bg-[#0f172a] text-[#cbd5e1] text-[0.875rem] font-semibold cursor-pointer transition-all duration-200 ease hover:border-[#22c55e] hover:text-[#4ade80] hover:shadow-[0_0_12px_rgba(34,197,94,0.2)]"
          onClick={handleExport}
          data-testid="export-btn"
        >
          <DownloadIcon />
          Export JSON
        </button>

        <button
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-[10px] border-[1.5px] border-[#334155] bg-[#0f172a] text-[#cbd5e1] text-[0.875rem] font-semibold cursor-pointer transition-all duration-200 ease hover:border-[#3b82f6] hover:text-[#60a5fa] hover:shadow-[0_0_12px_rgba(59,130,246,0.2)]"
          onClick={() => fileInputRef.current?.click()}
          data-testid="import-btn"
        >
          <UploadIcon />
          Import JSON
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          style={{ display: "none" }}
          aria-hidden="true"
          data-testid="file-input"
          onChange={handleImport}
        />
      </div>

      {error && (
        <p
          className="text-[0.8rem] text-[#f87171] bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] rounded-lg py-2 px-3 m-0"
          role="alert"
          data-testid="import-error"
        >
          ⚠ {error}
        </p>
      )}
      {success && (
        <p
          className="text-[0.8rem] text-[#4ade80] bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.25)] rounded-lg py-2 px-3 m-0"
          role="status"
          data-testid="import-success"
        >
          ✓ Configuration imported successfully
        </p>
      )}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
