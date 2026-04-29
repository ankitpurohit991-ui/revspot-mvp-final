"use client";

import { Upload, Check, X } from "lucide-react";

interface UploadTileProps {
  title: string;
  helper: string;
  /** When provided, the tile shows the "uploaded" state with this filename. */
  fileName: string | null;
  /** Mock upload action — sets a flag in parent state. */
  onUpload: () => void;
  /** Remove the upload — sets the parent state back to null. */
  onRemove: () => void;
  /** Visual identity for the tile (icon background tint). */
  tone?: "blue" | "amber";
}

export function UploadTile({ title, helper, fileName, onUpload, onRemove, tone = "blue" }: UploadTileProps) {
  const toneCls =
    tone === "blue"
      ? "bg-[#EFF6FF] text-[#1E40AF]"
      : "bg-[#FFFBEB] text-[#92400E]";

  if (fileName) {
    return (
      <div className="relative w-full bg-white border border-border rounded-card p-4">
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2.5 right-2.5 p-1 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-button transition-colors duration-150"
          aria-label="Remove upload"
        >
          <X size={13} strokeWidth={1.5} />
        </button>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-[8px] ${toneCls} flex items-center justify-center shrink-0`}>
            <Check size={16} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-text-primary leading-snug truncate">
              {fileName}
            </div>
            <div className="text-[11px] text-text-tertiary mt-0.5 leading-relaxed">
              {title} — uploaded. Click X to swap.
            </div>
            <button
              type="button"
              onClick={onUpload}
              className="mt-2 text-[11px] font-medium text-text-secondary hover:text-text-primary underline-offset-2 hover:underline transition-colors"
            >
              Replace
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onUpload}
      className="w-full text-left bg-white border-2 border-dashed border-border hover:border-border-hover hover:bg-surface-page/50 rounded-card p-4 transition-all duration-150 group"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-[8px] bg-surface-secondary flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
          <Upload size={16} strokeWidth={1.5} className="text-text-tertiary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-text-primary leading-snug">
            {title}
            <span className="text-text-tertiary font-normal ml-1.5">(optional)</span>
          </div>
          <div className="text-[11px] text-text-tertiary mt-0.5 leading-relaxed">{helper}</div>
        </div>
      </div>
    </button>
  );
}
