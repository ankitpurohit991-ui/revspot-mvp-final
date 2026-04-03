"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  ArrowLeft,
  ArrowRight,
  Upload,
  Check,
  RefreshCw,
  Download,
  Image as ImageIcon,
  Pencil,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface GeneratedCreative {
  id: string;
  size: string;
  label: string;
  postText: string;
}

interface CreativeGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (creatives: GeneratedCreative[]) => void;
  angleName: string;
  personaName: string;
  hook: string;
  cta: string;
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface OptionData {
  style: string;
  postText: string;
}

const OPTION_DATA: OptionData[] = [
  { style: "Bold typography with lifestyle imagery", postText: "🏡 Your dream home is closer than you think.\n\nPremium 3BHK apartments in Whitefield, starting at ₹1.8Cr. Smart homes with world-class amenities, just 2 mins from the IT corridor.\n\n📍 Book your free site visit this weekend.\n\n#GodrejAir #Whitefield #LuxuryLiving" },
  { style: "Minimalist with price anchor", postText: "₹1.8 Cr.\nThat's all it takes to own a Godrej home in Whitefield.\n\n3BHK | Smart Home Ready | RERA Registered\n\nLimited units in Phase 3. Don't wait.\n\n👉 Get the brochure now." },
  { style: "Testimonial-style with social proof", postText: "\"We moved into Godrej Air 6 months ago and it changed our lives.\"\n— Rajesh & Priya, 3BHK owners\n\n1200+ families already call Godrej Air home. Phase 3 is now open.\n\n🏠 See what they're talking about →" },
  { style: "Premium dark theme with gold accents", postText: "Luxury isn't just a word. It's an address.\n\nGodrej Air, Phase 3 — Where Japanese-inspired architecture meets Bangalore's most coveted location.\n\nStarting ₹1.8Cr | 3 & 4 BHK\n\n✨ Experience the walkthrough →" },
];

const ALT_OPTION_DATA: OptionData[] = [
  { style: "Clean layout with gradient background", postText: "Stop scrolling. Start living.\n\nGodrej Air Phase 3 brings you 3BHK homes designed for modern families. Zen gardens, infinity pool, and a location that puts everything within reach.\n\n📞 Talk to our team today." },
  { style: "Photo-centric with text overlay", postText: "This could be your morning view. ☀️\n\nWake up to 3 acres of landscaped gardens at Godrej Air, Whitefield. Phase 3 now open for bookings.\n\nStarting ₹1.8Cr.\n\n👉 Book a site visit" },
  { style: "Split-screen comparison style", postText: "Rent: ₹45K/month. Zero ownership.\nEMI: ₹1.1L/month. 100% yours.\n\nThe math is simple. Make the switch to Godrej Air.\n\n3BHK in Whitefield | RERA Approved\n\n🏡 Get started →" },
  { style: "Aspirational lifestyle with soft tones", postText: "Home is where your story begins.\n\nAt Godrej Air, every detail is designed to make life beautiful — from the zen-inspired gardens to the smartly crafted living spaces.\n\nPhase 3 | Starting ₹1.8Cr\n\n💫 Explore now" },
];

interface SizeOption {
  id: string;
  dimensions: string;
  label: string;
  aspectW: number;
  aspectH: number;
}

const SIZE_OPTIONS: SizeOption[] = [
  { id: "sq-feed", dimensions: "1080\u00d71080", label: "Square \u2014 Feed", aspectW: 1, aspectH: 1 },
  { id: "story", dimensions: "1080\u00d71920", label: "Story / Reel", aspectW: 9, aspectH: 16 },
  { id: "landscape", dimensions: "1200\u00d7628", label: "Landscape \u2014 Feed", aspectW: 1200, aspectH: 628 },
  { id: "portrait", dimensions: "1080\u00d71350", label: "Portrait \u2014 Feed", aspectW: 4, aspectH: 5 },
  { id: "sq-carousel", dimensions: "1080\u00d71080", label: "Square \u2014 Carousel", aspectW: 1, aspectH: 1 },
];

/* ------------------------------------------------------------------ */
/*  Steps config                                                       */
/* ------------------------------------------------------------------ */

const STEP_LABELS = ["Reference", "Options", "Sizes", "Preview"] as const;

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" as const } },
  exit: { opacity: 0, scale: 0.96, transition: { duration: 0.15 } },
};

const fadeVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function CreativeGeneratorModal({
  open,
  onClose,
  onComplete,
  angleName,
  personaName,
  hook,
  cta,
}: CreativeGeneratorModalProps) {
  const [modalStep, setModalStep] = useState(1);
  const [refUploaded, setRefUploaded] = useState(false);
  const [baseUploaded, setBaseUploaded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([
    SIZE_OPTIONS[0].id,
    SIZE_OPTIONS[1].id,
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCreatives, setGeneratedCreatives] = useState<GeneratedCreative[]>([]);
  const [optionData, setOptionData] = useState(OPTION_DATA);
  const [editingPostText, setEditingPostText] = useState<number | null>(null);

  /* Reset when modal opens */
  useEffect(() => {
    if (open) {
      setModalStep(1);
      setRefUploaded(false);
      setBaseUploaded(false);
      setSelectedOption(null);
      setFeedback("");
      setSelectedSizes([SIZE_OPTIONS[0].id, SIZE_OPTIONS[1].id]);
      setIsGenerating(false);
      setGeneratedCreatives([]);
      setOptionData(OPTION_DATA);
      setStep2Loaded(false);
      setEditingPostText(null);
    }
  }, [open]);

  /* Track if step 2 has loaded options at least once */
  const [step2Loaded, setStep2Loaded] = useState(false);

  /* Trigger loading states for step 2 and 4 */
  useEffect(() => {
    if (modalStep === 2 && !step2Loaded) {
      setIsGenerating(true);
      const t = setTimeout(() => { setIsGenerating(false); setStep2Loaded(true); }, 2000);
      return () => clearTimeout(t);
    }
    if (modalStep === 4 && generatedCreatives.length === 0) {
      setIsGenerating(true);
      const t = setTimeout(() => {
        const creatives: GeneratedCreative[] = selectedSizes.map((sId) => {
          const so = SIZE_OPTIONS.find((s) => s.id === sId)!;
          return {
            id: `creative-${sId}-${Date.now()}`,
            size: so.dimensions,
            label: so.label,
            postText: selectedOption ? optionData[selectedOption - 1].postText : `${hook}\n\n${cta}`,
          };
        });
        setGeneratedCreatives(creatives);
        setIsGenerating(false);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [modalStep, selectedOption, generatedCreatives.length, selectedSizes, hook, cta]);

  const toggleSize = useCallback((id: string) => {
    setSelectedSizes((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }, []);

  const handleRegenerate = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      if (selectedOption) {
        // Only tweak the selected option — others stay unchanged
        const idx = selectedOption - 1;
        const feedbackSuffix = feedback.trim() ? ` (${feedback.trim()})` : "";
        setOptionData((prev) =>
          prev.map((opt, i) =>
            i === idx
              ? {
                  style: `${ALT_OPTION_DATA[idx]?.style || opt.style}${feedbackSuffix}`,
                  postText: ALT_OPTION_DATA[idx]?.postText || opt.postText,
                }
              : opt
          )
        );
      } else {
        // No option selected — regenerate all
        setOptionData((prev) => (prev === OPTION_DATA ? ALT_OPTION_DATA : OPTION_DATA));
        setSelectedOption(null);
      }
      setEditingPostText(null);
      setIsGenerating(false);
    }, 2000);
  }, [selectedOption, feedback]);

  const canContinue = (): boolean => {
    if (modalStep === 2) return selectedOption !== null;
    if (modalStep === 3) return selectedSizes.length > 0;
    return true;
  };

  const handleNext = () => {
    if (modalStep < 4) {
      setModalStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (modalStep > 1) {
      if (modalStep === 4) setGeneratedCreatives([]);
      setModalStep((s) => s - 1);
    }
  };

  const handleConfirm = () => {
    onComplete(generatedCreatives);
    onClose();
  };

  /* ---------------------------------------------------------------- */
  /*  Sub-renders                                                      */
  /* ---------------------------------------------------------------- */

  const renderUploadArea = (
    label: string,
    uploaded: boolean,
    fileName: string,
    onUpload: () => void
  ) => (
    <button
      type="button"
      onClick={onUpload}
      className="w-full border-2 border-dashed border-border rounded-card p-6 flex flex-col items-center justify-center gap-2 hover:border-accent/40 hover:bg-accent/[0.02] transition-colors duration-150 cursor-pointer"
    >
      {uploaded ? (
        <>
          <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center">
            <Check size={16} strokeWidth={2} className="text-green-600" />
          </div>
          <span className="text-[13px] font-medium text-text-primary">{fileName}</span>
          <span className="text-[11px] text-text-tertiary">Click to replace</span>
        </>
      ) : (
        <>
          <Upload size={20} strokeWidth={1.5} className="text-text-tertiary" />
          <span className="text-[13px] font-medium text-text-secondary">{label}</span>
          <span className="text-[11px] text-text-tertiary">Click or drag & drop</span>
        </>
      )}
    </button>
  );

  const renderStep1 = () => (
    <motion.div key="step1" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        {renderUploadArea(
          "Reference ad (style inspiration)",
          refUploaded,
          "reference_ad.jpg",
          () => setRefUploaded(true)
        )}
        {renderUploadArea(
          "Product/base image",
          baseUploaded,
          "godrej_air_hero.jpg",
          () => setBaseUploaded(true)
        )}
      </div>
      <p className="text-[11px] text-text-tertiary">Both uploads are optional but recommended.</p>
      <div className="bg-surface-page border border-border-subtle rounded-card px-4 py-3">
        <span className="text-[11px] font-medium text-text-tertiary uppercase tracking-[0.4px]">Generating for</span>
        <p className="text-[13px] text-text-primary font-medium mt-0.5">
          {personaName} &mdash; {angleName}
        </p>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div key="step2" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
      {isGenerating ? (
        <>
          <p className="text-[13px] text-text-secondary flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            Generating 4 creative options...
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-border rounded-card p-4 space-y-3">
                <div className="aspect-square bg-surface-secondary rounded-[8px] animate-pulse" />
                <div className="h-3 w-3/4 bg-surface-secondary rounded-[8px] animate-pulse" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Feedback + action — always visible at top */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={selectedOption ? `Suggest changes to Option ${selectedOption}...` : "Select an option first, then suggest changes..."}
              className="flex-1 h-9 px-3 text-[13px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 placeholder:text-text-tertiary"
            />
            <button
              type="button"
              onClick={handleRegenerate}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-[12px] font-medium text-accent border border-accent/30 rounded-button hover:bg-accent/5 transition-colors duration-150 shrink-0"
            >
              <RefreshCw size={13} strokeWidth={1.5} />
              {selectedOption ? `Tweak Option ${selectedOption}` : "Regenerate All"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((n) => {
              const selected = selectedOption === n;
              const opt = optionData[n - 1];
              const isEditingThis = editingPostText === n;
              return (
                <div
                  key={n}
                  onClick={() => setSelectedOption(selected ? null : n)}
                  className={`text-left bg-white border rounded-card p-4 transition-all duration-150 cursor-pointer ${
                    selected
                      ? "border-accent ring-2 ring-accent/20"
                      : "border-border hover:border-accent/40"
                  }`}
                >
                  {/* Image placeholder */}
                  <div className="aspect-[4/3] bg-surface-secondary rounded-[8px] flex items-center justify-center mb-3">
                    <span className="text-[12px] font-medium text-text-tertiary">Option {n}</span>
                  </div>
                  {/* Style description */}
                  <p className="text-[11px] text-text-tertiary mb-2">{opt.style}</p>
                  {/* Post text with edit */}
                  <div className="relative">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[10px] font-medium text-text-tertiary uppercase tracking-[0.3px]">Post Text</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setEditingPostText(isEditingThis ? null : n); }}
                        className="p-0.5 text-text-tertiary hover:text-accent transition-colors"
                        title="Edit post text"
                      >
                        <Pencil size={10} strokeWidth={1.5} />
                      </button>
                    </div>
                    {isEditingThis ? (
                      <textarea
                        value={opt.postText}
                        onChange={(e) => {
                          const val = e.target.value;
                          setOptionData((prev) => prev.map((o, i) => i === n - 1 ? { ...o, postText: val } : o));
                        }}
                        onClick={(e) => e.stopPropagation()}
                        rows={4}
                        className="w-full mt-1 px-2 py-1.5 text-[11px] border border-accent/30 rounded-input bg-white text-text-primary focus:outline-none focus:border-accent transition-colors duration-150 resize-none leading-relaxed"
                      />
                    ) : (
                      <p className="text-[11px] text-text-secondary leading-relaxed mt-1 line-clamp-4 whitespace-pre-line">{opt.postText}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );

  const allSelected = SIZE_OPTIONS.every((opt) => selectedSizes.includes(opt.id));
  const toggleAll = () => {
    if (allSelected) {
      setSelectedSizes([]);
    } else {
      setSelectedSizes(SIZE_OPTIONS.map((opt) => opt.id));
    }
  };

  const renderStep3 = () => (
    <motion.div key="step3" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-text-primary">Select form factors</h3>
        <button onClick={toggleAll} className="text-[12px] font-medium text-accent hover:text-accent-hover transition-colors">
          {allSelected ? "Deselect all" : "Select all"}
        </button>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {SIZE_OPTIONS.map((opt) => {
          const selected = selectedSizes.includes(opt.id);
          // Calculate visual shape height relative to width
          const maxH = 120;
          const w = 80;
          const ratio = opt.aspectH / opt.aspectW;
          const shapeH = Math.min(Math.round(w * ratio), maxH);
          const shapeW = ratio > 1 ? Math.round(shapeH / ratio) : w;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleSize(opt.id)}
              className={`flex flex-col items-center gap-2 p-3 border rounded-card transition-all duration-150 ${
                selected
                  ? "border-accent bg-accent/5 ring-1 ring-accent/20"
                  : "border-border bg-white hover:border-accent/40"
              }`}
            >
              {/* Visual shape */}
              <div className="flex items-center justify-center" style={{ height: `${maxH}px` }}>
                <div
                  className={`rounded-[4px] flex items-center justify-center transition-colors ${
                    selected ? "bg-accent/15 border border-accent/30" : "bg-surface-secondary border border-border"
                  }`}
                  style={{ width: `${shapeW}px`, height: `${shapeH}px` }}
                >
                  <span className="text-[9px] font-mono text-text-tertiary">{opt.dimensions}</span>
                </div>
              </div>
              {/* Label */}
              <div className="text-center">
                <div className="text-[11px] font-medium text-text-primary leading-tight">{opt.label.split(" — ")[0]}</div>
                {opt.label.includes(" — ") && (
                  <div className="text-[10px] text-text-tertiary">{opt.label.split(" — ")[1]}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-text-tertiary">AI will also generate post text for each size.</p>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div key="step4" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-5">
      {isGenerating ? (
        <>
          <p className="text-[13px] text-text-secondary flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            Adapting creative to {selectedSizes.length} sizes...
          </p>
          <div className="grid grid-cols-2 gap-4">
            {selectedSizes.map((sId) => (
              <div key={sId} className="bg-white border border-border rounded-card p-4 space-y-3">
                <div className="h-4 w-1/2 bg-surface-secondary rounded-[8px] animate-pulse" />
                <div className="aspect-square bg-surface-secondary rounded-[8px] animate-pulse" />
                <div className="h-3 w-full bg-surface-secondary rounded-[8px] animate-pulse" />
                <div className="h-3 w-3/4 bg-surface-secondary rounded-[8px] animate-pulse" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {generatedCreatives.map((creative) => {
              const sizeOpt = SIZE_OPTIONS.find(
                (s) => s.id === selectedSizes.find((sid) => SIZE_OPTIONS.find((so) => so.id === sid)?.dimensions === creative.size && SIZE_OPTIONS.find((so) => so.id === sid)?.label === creative.label)
              );
              const aspect = sizeOpt
                ? `${sizeOpt.aspectW}/${sizeOpt.aspectH}`
                : "1/1";
              return (
                <div key={creative.id} className="bg-white border border-border rounded-card overflow-hidden">
                  {/* Size label */}
                  <div className="px-4 py-2 border-b border-border-subtle bg-surface-page">
                    <span className="text-[12px] font-medium text-text-primary">
                      {creative.size} &mdash; {creative.label}
                    </span>
                  </div>
                  {/* Meta ad frame */}
                  <div className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-surface-secondary flex items-center justify-center">
                        <ImageIcon size={14} className="text-text-tertiary" />
                      </div>
                      <div>
                        <p className="text-[12px] font-medium text-text-primary leading-none">Godrej Properties</p>
                        <p className="text-[10px] text-text-tertiary mt-0.5">Sponsored</p>
                      </div>
                    </div>
                    {/* Image placeholder */}
                    <div
                      className="bg-surface-secondary rounded-[8px] flex items-center justify-center"
                      style={{ aspectRatio: aspect }}
                    >
                      <ImageIcon size={24} className="text-text-tertiary" />
                    </div>
                    {/* Post text */}
                    <p className="text-[12px] text-text-secondary leading-relaxed whitespace-pre-line">
                      {creative.postText}
                    </p>
                    {/* CTA */}
                    <div className="flex items-center justify-between border-t border-border-subtle pt-2">
                      <span className="text-[11px] text-text-tertiary">godrejproperties.com</span>
                      <span className="text-[11px] font-medium text-accent">Learn More</span>
                    </div>
                  </div>
                  {/* Download */}
                  <div className="px-4 py-2 border-t border-border-subtle">
                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-text-secondary hover:text-accent transition-colors duration-150"
                    >
                      <Download size={12} strokeWidth={1.5} />
                      Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </motion.div>
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
        >
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={onClose} />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-[720px] max-h-[85vh] overflow-y-auto bg-white rounded-card border border-border shadow-xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-semibold text-text-primary">Generate Creative</h2>
                  <span className="text-[12px] text-text-tertiary">Step {modalStep} of 4</span>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-button transition-colors"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-6 mt-3">
                {STEP_LABELS.map((label, i) => {
                  const stepNum = i + 1;
                  const isActive = stepNum === modalStep;
                  const isDone = stepNum < modalStep;
                  return (
                    <div key={label} className="flex items-center gap-1.5">
                      <div
                        className={`h-2 w-2 rounded-full transition-colors duration-150 ${
                          isActive
                            ? "bg-accent"
                            : isDone
                            ? "bg-accent/40"
                            : "bg-border"
                        }`}
                      />
                      <span
                        className={`text-[11px] font-medium transition-colors duration-150 ${
                          isActive ? "text-accent" : isDone ? "text-text-secondary" : "text-text-tertiary"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <AnimatePresence mode="wait">
                {modalStep === 1 && renderStep1()}
                {modalStep === 2 && renderStep2()}
                {modalStep === 3 && renderStep3()}
                {modalStep === 4 && renderStep4()}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-border px-6 py-3 flex items-center justify-between">
              {modalStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 h-10 px-4 text-[13px] font-medium text-text-secondary border border-border rounded-button bg-white hover:bg-surface-page transition-colors duration-150"
                >
                  <ArrowLeft size={15} strokeWidth={1.5} />
                  Back
                </button>
              ) : (
                <div />
              )}

              {modalStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canContinue() || isGenerating}
                  className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight size={15} strokeWidth={2} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isGenerating || generatedCreatives.length === 0}
                  className="inline-flex items-center gap-2 h-10 px-6 bg-accent text-white text-[13px] font-medium rounded-button hover:bg-accent-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm & Add to Campaign
                  <Check size={15} strokeWidth={2} />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
