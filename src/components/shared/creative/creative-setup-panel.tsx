"use client";

import { ArrowRight, Sparkles, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import type { CreativeWorkspace } from "./types";
import { describeSetupMode } from "./types";
import { UploadTile } from "./upload-tile";

interface CreativeSetupPanelProps {
  workspace: CreativeWorkspace;
  onPromptChange: (text: string) => void;
  onUploadStyleRef: (file: { name: string } | null) => void;
  onUploadProductImage: (file: { name: string } | null) => void;
  onGenerate: () => void;
  /** Suggested context — used to seed the prompt input with a contextual placeholder. */
  contextHint?: string;
  /** When true, generate is in flight. */
  isGenerating: boolean;
}

const EXAMPLE_PROMPTS = [
  "Premium 3BHK in Whitefield with zen-garden lifestyle",
  "Family-friendly luxury — emphasize amenities & community",
  "Investment angle for NRI buyers — highlight RERA + rental yield",
];

export function CreativeSetupPanel({
  workspace,
  onPromptChange,
  onUploadStyleRef,
  onUploadProductImage,
  onGenerate,
  contextHint,
  isGenerating,
}: CreativeSetupPanelProps) {
  const promptOk = workspace.prompt.trim().length > 0;
  const helperText = describeSetupMode(workspace);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-2 gap-6 p-6"
    >
      {/* Left: Prompt + examples */}
      <div className="space-y-4">
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary mb-1">
            Describe what you want
          </h3>
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Tell the AI what to create. Be specific about audience, tone, and key message.
            Uploads on the right are optional — add them anytime.
          </p>
        </div>

        <textarea
          value={workspace.prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder={
            contextHint ||
            "e.g., Generate a Meta ad for HNI families looking for premium 3BHK in Whitefield, emphasising the zen-garden amenities and ₹1.8Cr starting price."
          }
          rows={6}
          className="w-full px-3 py-2.5 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none leading-relaxed"
        />

        {/* Example prompts */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb size={12} strokeWidth={1.5} className="text-text-tertiary" />
            <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.5px]">
              Try one of these
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLE_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPromptChange(p)}
                className="text-[11px] text-text-secondary bg-white border border-border hover:bg-surface-page hover:text-text-primary px-2.5 py-1.5 rounded-button transition-colors duration-150"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Inputs + helper + generate */}
      <div className="space-y-4">
        <div>
          <h3 className="text-[15px] font-semibold text-text-primary mb-1">
            Inputs (optional)
          </h3>
          <p className="text-[12px] text-text-secondary leading-relaxed">
            Drop a style reference, a product photo, both, or neither. You can swap these
            in and out at any time before generating.
          </p>
        </div>

        <div className="space-y-3">
          <UploadTile
            title="Style reference"
            helper="A competitor ad or moodboard whose visual style you want to match."
            fileName={workspace.style_reference?.name ?? null}
            onUpload={() => onUploadStyleRef({ name: "reference_ad.jpg" })}
            onRemove={() => onUploadStyleRef(null)}
            tone="blue"
          />
          <UploadTile
            title="Product image"
            helper="Hero photo of your property (façade, amenities, interior)."
            fileName={workspace.product_image?.name ?? null}
            onUpload={() => onUploadProductImage({ name: "godrej_air_hero.jpg" })}
            onRemove={() => onUploadProductImage(null)}
            tone="amber"
          />
        </div>

        {/* Mode helper */}
        <div className="bg-surface-page border border-border-subtle rounded-card px-3 py-2.5">
          <div className="flex items-start gap-2">
            <Sparkles size={12} strokeWidth={1.5} className="text-text-tertiary mt-0.5 shrink-0" />
            <p className="text-[11px] text-text-secondary leading-relaxed">{helperText}</p>
          </div>
        </div>

        {/* Generate button */}
        <button
          type="button"
          onClick={onGenerate}
          disabled={!promptOk || isGenerating}
          className="w-full inline-flex items-center justify-center gap-2 h-10 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <span className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating concept…
            </>
          ) : (
            <>
              <Sparkles size={14} strokeWidth={1.5} /> Generate concept
              <ArrowRight size={14} strokeWidth={1.5} />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
