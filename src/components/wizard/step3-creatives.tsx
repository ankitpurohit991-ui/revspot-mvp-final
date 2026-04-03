"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { angleData } from "@/lib/wizard-data";

interface Step3Props {
  onNext: () => void;
  onBack: () => void;
}

interface AngleEntry {
  id: string;
  personaId: string;
  personaName: string;
  painPoint: string;
  usp: string;
  hook: string;
  cta: string;
  angleName: string;
}

interface CreativeEntry {
  type: "generated" | "uploaded";
  name: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" as const },
  }),
};

const placeholderThumbs = [
  { id: "ref-1", label: "Lifestyle A" },
  { id: "ref-2", label: "Interior B" },
  { id: "ref-3", label: "Aerial C" },
  { id: "ref-4", label: "Amenity D" },
];

export function Step3Creatives({ onNext, onBack }: Step3Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [angles, setAngles] = useState<AngleEntry[]>([]);
  const [generatedCreatives, setGeneratedCreatives] = useState<
    Record<string, CreativeEntry>
  >({});
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [refModalAngleId, setRefModalAngleId] = useState<string | null>(null);
  const [refSelections, setRefSelections] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAngles(angleData as AngleEntry[]);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const updateAngle = (id: string, field: keyof AngleEntry, value: string) => {
    setAngles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, [field]: value } : a))
    );
  };

  const handleGenerateStatic = (angleId: string) => {
    setGeneratingId(angleId);
    setTimeout(() => {
      const angle = angles.find((a) => a.id === angleId);
      setGeneratedCreatives((prev) => ({
        ...prev,
        [angleId]: {
          type: "generated",
          name: `${angle?.angleName ?? "Creative"} — 1080x1080`,
        },
      }));
      setGeneratingId(null);
    }, 2000);
  };

  const handleUploadOwn = (angleId: string) => {
    const angle = angles.find((a) => a.id === angleId);
    setGeneratedCreatives((prev) => ({
      ...prev,
      [angleId]: {
        type: "uploaded",
        name: `${angle?.angleName?.toLowerCase().replace(/\s+/g, "-") ?? "creative"}-uploaded.jpg`,
      },
    }));
  };

  const handleRefSelect = (angleId: string, refId: string) => {
    setRefSelections((prev) => ({ ...prev, [angleId]: refId }));
    setRefModalAngleId(null);
  };

  const handleRefUpload = (angleId: string) => {
    setRefSelections((prev) => ({ ...prev, [angleId]: "custom-upload" }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles size={16} strokeWidth={1.5} className="text-accent" />
        <h3 className="text-[16px] font-semibold text-text-primary">
          Creative Strategy
        </h3>
        {isLoading && (
          <span className="inline-block h-2 w-2 rounded-full bg-accent animate-pulse" />
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="bg-white border border-border rounded-card p-5">
            <div className="flex items-center gap-3">
              <div className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-[13px] text-text-secondary">
                Generating creative strategy based on your personas...
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-white border border-border rounded-card p-5 space-y-3"
              >
                <div className="h-5 w-3/4 bg-surface-secondary rounded-[8px] animate-pulse" />
                <div className="h-3 w-full bg-surface-secondary rounded-[8px] animate-pulse" />
                <div className="space-y-2 pt-1">
                  <div className="h-3 w-full bg-surface-secondary rounded-[8px] animate-pulse" />
                  <div className="h-3 w-5/6 bg-surface-secondary rounded-[8px] animate-pulse" />
                  <div className="h-3 w-4/5 bg-surface-secondary rounded-[8px] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {angles.map((angle, i) => (
            <motion.div
              key={angle.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="bg-white border border-border rounded-card p-6"
            >
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-[14px] font-semibold text-text-primary">
                  {angle.personaName}
                </h4>
                <span className="inline-flex items-center text-[11px] font-medium px-2.5 py-1 rounded-badge bg-surface-page text-text-secondary border border-border">
                  Angle: {angle.angleName}
                </span>
              </div>

              {/* Editable fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
                    Pain Point
                  </label>
                  <textarea
                    rows={2}
                    value={angle.painPoint}
                    onChange={(e) =>
                      updateAngle(angle.id, "painPoint", e.target.value)
                    }
                    className="w-full px-3 py-2 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
                    USP
                  </label>
                  <textarea
                    rows={2}
                    value={angle.usp}
                    onChange={(e) =>
                      updateAngle(angle.id, "usp", e.target.value)
                    }
                    className="w-full px-3 py-2 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
                      Hook
                    </label>
                    <input
                      type="text"
                      value={angle.hook}
                      onChange={(e) =>
                        updateAngle(angle.id, "hook", e.target.value)
                      }
                      className="w-full h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">
                      CTA
                    </label>
                    <input
                      type="text"
                      value={angle.cta}
                      onChange={(e) =>
                        updateAngle(angle.id, "cta", e.target.value)
                      }
                      className="w-full h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border mt-5 pt-5">
                <span className="block text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-3">
                  Creative
                </span>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mb-4">
                  <button
                    onClick={() => handleGenerateStatic(angle.id)}
                    disabled={generatingId === angle.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-accent border border-accent/30 rounded-button hover:bg-accent/5 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Sparkles size={13} strokeWidth={1.5} />
                    Generate Static
                  </button>
                  <button
                    onClick={() => handleUploadOwn(angle.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-button hover:bg-surface-page transition-colors duration-150"
                  >
                    <Upload size={13} strokeWidth={1.5} />
                    Upload Own
                  </button>
                </div>

                {/* Reference image row */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[12px] text-text-tertiary shrink-0">
                    Reference Image:
                  </span>
                  <button
                    onClick={() => setRefModalAngleId(angle.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-button hover:bg-surface-page transition-colors duration-150"
                  >
                    <ImageIcon size={13} strokeWidth={1.5} />
                    {refSelections[angle.id]
                      ? refSelections[angle.id] === "custom-upload"
                        ? "ref-uploaded.jpg"
                        : placeholderThumbs.find(
                            (t) => t.id === refSelections[angle.id]
                          )?.label ?? "Selected"
                      : "Select from library"}
                  </button>
                  <button
                    onClick={() => handleRefUpload(angle.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-text-secondary border border-border rounded-button hover:bg-surface-page transition-colors duration-150"
                  >
                    <Upload size={13} strokeWidth={1.5} />
                    Upload
                  </button>
                  {refSelections[angle.id] && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-green-600">
                      <Check size={12} strokeWidth={2} /> Selected
                    </span>
                  )}
                </div>

                {/* Preview area */}
                {generatingId === angle.id && (
                  <div className="flex items-center justify-center h-[180px] bg-surface-page border border-border rounded-card">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2
                        size={20}
                        strokeWidth={1.5}
                        className="text-accent animate-spin"
                      />
                      <span className="text-[12px] text-text-tertiary">
                        Generating creative...
                      </span>
                    </div>
                  </div>
                )}

                {generatedCreatives[angle.id] &&
                  generatingId !== angle.id && (
                    <div className="flex items-center justify-center h-[180px] bg-surface-page border border-border rounded-card relative">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="h-10 w-10 rounded-full bg-surface-secondary flex items-center justify-center">
                          {generatedCreatives[angle.id].type === "generated" ? (
                            <ImageIcon
                              size={18}
                              strokeWidth={1.5}
                              className="text-text-tertiary"
                            />
                          ) : (
                            <Upload
                              size={18}
                              strokeWidth={1.5}
                              className="text-text-tertiary"
                            />
                          )}
                        </div>
                        <span className="text-[13px] font-medium text-text-primary">
                          {angle.angleName}
                        </span>
                        <span className="text-[11px] text-text-tertiary">
                          {generatedCreatives[angle.id].type === "generated"
                            ? "1080 x 1080"
                            : generatedCreatives[angle.id].name}
                        </span>
                      </div>
                      {generatedCreatives[angle.id].type === "generated" && (
                        <span className="absolute top-3 right-3 text-[10px] font-medium text-text-tertiary bg-white px-2 py-0.5 rounded-badge border border-border">
                          1080x1080
                        </span>
                      )}
                    </div>
                  )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reference Image Library Modal */}
      <AnimatePresence>
        {refModalAngleId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/20"
              onClick={() => setRefModalAngleId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="relative bg-white border border-border rounded-card p-5 shadow-xl w-[400px]"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[14px] font-semibold text-text-primary">
                  Select Reference Image
                </h4>
                <button
                  onClick={() => setRefModalAngleId(null)}
                  className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-button transition-colors"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {placeholderThumbs.map((thumb) => (
                  <button
                    key={thumb.id}
                    onClick={() => handleRefSelect(refModalAngleId, thumb.id)}
                    className="flex flex-col items-center justify-center h-[100px] bg-surface-page border border-border rounded-card hover:border-accent hover:bg-accent/5 transition-colors duration-150 cursor-pointer"
                  >
                    <ImageIcon
                      size={24}
                      strokeWidth={1}
                      className="text-text-tertiary mb-1.5"
                    />
                    <span className="text-[11px] font-medium text-text-secondary">
                      {thumb.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150"
        >
          <ArrowLeft size={15} strokeWidth={1.5} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={isLoading}
          className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Forms <ArrowRight size={15} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
