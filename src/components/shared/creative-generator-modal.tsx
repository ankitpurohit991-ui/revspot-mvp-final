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
  Sparkles,
  Info,
  ChevronDown,
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
  headline: string;
  description: string;
}

interface CreativeGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (creatives: GeneratedCreative[]) => void;
  angleName: string;
  personaName: string;
  personaRole?: string;
  personaBullets?: string[];
  painPoint?: string;
  usp?: string;
  hook: string;
  cta: string;
}


/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface OptionData {
  style: string;
  primaryText: string;
  headline: string;
  description: string;
}

const OPTION_DATA: OptionData[] = [
  { style: "Bold typography with lifestyle imagery",
    primaryText: "🏡 Your dream home is closer than you think.\n\nPremium 3BHK apartments in Whitefield, starting at ₹1.8Cr. Smart homes with world-class amenities, just 2 mins from the IT corridor.\n\n📍 Book your free site visit this weekend.",
    headline: "Premium 3BHK in Whitefield — Starting ₹1.8Cr",
    description: "RERA registered. Smart home ready. 3-acre zen gardens." },
  { style: "Minimalist with price anchor",
    primaryText: "₹1.8 Cr.\nThat's all it takes to own a Godrej home in Whitefield.\n\n3BHK | Smart Home Ready | RERA Registered\n\nLimited units in Phase 3. Don't wait.\n\n👉 Get the brochure now.",
    headline: "₹1.8Cr — Own a Godrej Home in Whitefield",
    description: "Limited Phase 3 units. 3BHK smart homes with zen gardens." },
  { style: "Testimonial-style with social proof",
    primaryText: "\"We moved into Godrej Air 6 months ago and it changed our lives.\"\n— Rajesh & Priya, 3BHK owners\n\n1200+ families already call Godrej Air home. Phase 3 is now open.\n\n🏠 See what they're talking about →",
    headline: "1200+ Families Chose Godrej Air — Phase 3 Now Open",
    description: "Join India's most loved residential community in Whitefield." },
  { style: "Premium dark theme with gold accents",
    primaryText: "Luxury isn't just a word. It's an address.\n\nGodrej Air, Phase 3 — Where Japanese-inspired architecture meets Bangalore's most coveted location.\n\nStarting ₹1.8Cr | 3 & 4 BHK\n\n✨ Experience the walkthrough →",
    headline: "Godrej Air Phase 3 — Luxury Redefined",
    description: "Japanese-inspired architecture. Starting ₹1.8Cr." },
];

const ALT_OPTION_DATA: OptionData[] = [
  { style: "Clean layout with gradient background",
    primaryText: "Stop scrolling. Start living.\n\nGodrej Air Phase 3 brings you 3BHK homes designed for modern families. Zen gardens, infinity pool, and a location that puts everything within reach.\n\n📞 Talk to our team today.",
    headline: "Stop Scrolling. Start Living — Godrej Air",
    description: "3BHK homes for modern families. Zen gardens & infinity pool." },
  { style: "Photo-centric with text overlay",
    primaryText: "This could be your morning view. ☀️\n\nWake up to 3 acres of landscaped gardens at Godrej Air, Whitefield. Phase 3 now open for bookings.\n\nStarting ₹1.8Cr.\n\n👉 Book a site visit",
    headline: "Wake Up to 3 Acres of Gardens — Godrej Air",
    description: "Phase 3 now open. Starting ₹1.8Cr in Whitefield." },
  { style: "Split-screen comparison style",
    primaryText: "Rent: ₹45K/month. Zero ownership.\nEMI: ₹1.1L/month. 100% yours.\n\nThe math is simple. Make the switch to Godrej Air.\n\n3BHK in Whitefield | RERA Approved\n\n🏡 Get started →",
    headline: "Rent vs Own — The Math is Simple",
    description: "3BHK in Whitefield. RERA Approved. EMI from ₹1.1L/month." },
  { style: "Aspirational lifestyle with soft tones",
    primaryText: "Home is where your story begins.\n\nAt Godrej Air, every detail is designed to make life beautiful — from the zen-inspired gardens to the smartly crafted living spaces.\n\nPhase 3 | Starting ₹1.8Cr\n\n💫 Explore now",
    headline: "Home Is Where Your Story Begins",
    description: "Zen-inspired gardens. Smartly crafted living spaces." },
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
/*  Ad mockup — 4 distinct visual styles matching the option data      */
/* ------------------------------------------------------------------ */

function AdMockup({ variant, headline }: { variant: number; headline: string }) {
  switch (variant) {
    case 1:
      // Bold typography with lifestyle imagery — warm gradient
      return (
        <div className="relative w-full h-full bg-gradient-to-br from-[#FED7AA] via-[#FCA5A5] to-[#F97373] flex items-end p-5 overflow-hidden">
          <div className="absolute top-4 left-4 h-6 w-6 rounded-[4px] bg-white/30 backdrop-blur-sm" />
          <div className="absolute top-10 left-4 right-4 h-[1px] bg-white/30" />
          <div className="text-white z-10">
            <div className="text-[9px] font-semibold uppercase tracking-[2px] opacity-90 mb-1.5">Phase 3 · Now Open</div>
            <div className="text-[14px] font-bold leading-tight line-clamp-2">{headline}</div>
          </div>
        </div>
      );
    case 2:
      // Minimalist with price anchor
      return (
        <div className="relative w-full h-full bg-[#FAFAF7] flex flex-col justify-between p-5 overflow-hidden">
          <div className="text-[#1A1A1A] leading-none tracking-tight">
            <span className="text-[44px] font-bold">₹1.8</span>
            <span className="text-[20px] font-semibold align-top">Cr</span>
          </div>
          <div>
            <div className="h-[2px] w-8 bg-[#1A1A1A] mb-2" />
            <div className="text-[9px] text-[#1A1A1A] font-semibold uppercase tracking-[1.5px]">Starting Price</div>
            <div className="text-[10px] text-[#6B6B6B] mt-0.5 line-clamp-1">RERA approved · Phase 3</div>
          </div>
          <div className="absolute top-4 right-4 text-[9px] font-bold text-[#1A1A1A] tracking-wider">GODREJ</div>
        </div>
      );
    case 3:
      // Testimonial with social proof — teal
      return (
        <div className="relative w-full h-full bg-gradient-to-br from-[#0F766E] to-[#134E4A] flex flex-col justify-center p-5 overflow-hidden">
          <div className="text-white/25 text-[56px] leading-none font-serif -mb-2">&ldquo;</div>
          <div className="text-white text-[13px] leading-snug font-medium line-clamp-2">Changed our lives.</div>
          <div className="mt-3">
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-[10px] text-[#FCD34D]">&#9733;</span>
              ))}
            </div>
            <div className="text-white/80 text-[10px] font-medium">&mdash; Rajesh &amp; Priya</div>
            <div className="text-white/50 text-[9px]">3BHK owners &middot; 1200+ families</div>
          </div>
        </div>
      );
    case 4:
      // Premium dark theme with gold accents
      return (
        <div className="relative w-full h-full bg-[#0A0A0A] flex flex-col justify-center items-center p-5 text-center overflow-hidden">
          <div className="absolute top-5 left-0 right-0 flex justify-center">
            <div className="h-[1px] w-12 bg-[#D4A574]" />
          </div>
          <div className="text-[9px] text-[#D4A574] font-semibold uppercase tracking-[3px] mb-2">Godrej Air</div>
          <div className="text-white text-[14px] font-light leading-snug tracking-wide">
            Luxury<br />
            <span className="italic text-[#D4A574]">Redefined</span>
          </div>
          <div className="absolute bottom-5 left-0 right-0 flex justify-center">
            <div className="h-[1px] w-12 bg-[#D4A574]" />
          </div>
        </div>
      );
    default:
      return (
        <div className="w-full h-full bg-surface-secondary flex items-center justify-center">
          <span className="text-[11px] font-medium text-text-tertiary">Option {variant}</span>
        </div>
      );
  }
}

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
  personaRole,
  personaBullets,
  painPoint,
  usp,
  hook,
  cta,
}: CreativeGeneratorModalProps) {
  const [modalStep, setModalStep] = useState(1);
  const [strategyOpen, setStrategyOpen] = useState(false);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
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
      setStrategyOpen(false);
      setRefUploaded(false);
      setBaseUploaded(false);
      setSelectedOption(null);
      setPickedOption(null);
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
            postText: pickedOption ? optionData[pickedOption - 1].primaryText : `${hook}\n\n${cta}`,
            headline: pickedOption ? optionData[pickedOption - 1].headline : hook,
            description: pickedOption ? optionData[pickedOption - 1].description : cta,
          };
        });
        setGeneratedCreatives(creatives);
        setIsGenerating(false);
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [modalStep, pickedOption, generatedCreatives.length, selectedSizes, hook, cta, optionData]);

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
                  primaryText: ALT_OPTION_DATA[idx]?.primaryText || opt.primaryText,
                  headline: ALT_OPTION_DATA[idx]?.headline || opt.headline,
                  description: ALT_OPTION_DATA[idx]?.description || opt.description,
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
    if (modalStep === 2) return pickedOption !== null;
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
    title: string,
    helper: string,
    uploaded: boolean,
    fileName: string,
    onUpload: () => void
  ) => (
    <button
      type="button"
      onClick={onUpload}
      className="w-full border-2 border-dashed border-border rounded-card p-5 flex flex-col items-center justify-center gap-2 text-center hover:border-accent/40 hover:bg-accent/[0.02] transition-colors duration-150 cursor-pointer min-h-[160px]"
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
          <span className="text-[13px] font-medium text-text-primary">{title}</span>
          <span className="text-[11px] text-text-tertiary leading-relaxed max-w-[220px]">{helper}</span>
        </>
      )}
    </button>
  );

  const renderStep1 = () => (
    <motion.div key="step1" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
      <div>
        <h3 className="text-[14px] font-semibold text-text-primary">Add references for the AI</h3>
        <p className="text-[12px] text-text-secondary mt-0.5">Upload a reference ad (for style) and your product image (what we advertise).</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {renderUploadArea(
          "Inspiration ad",
          "A competitor or similar brand's ad whose style you like.",
          refUploaded,
          "reference_ad.jpg",
          () => setRefUploaded(true)
        )}
        {renderUploadArea(
          "Product image",
          "Hero photo of your property or product.",
          baseUploaded,
          "godrej_air_hero.jpg",
          () => setBaseUploaded(true)
        )}
      </div>
      <p className="text-[11px] text-text-tertiary">Both optional — skip if you want fully AI-generated visuals.</p>
    </motion.div>
  );

  /* Option card — Meta ad preview in view mode, labeled fields in edit mode */
  const renderOptionCard = (n: number) => {
    const aiEditing = selectedOption === n;
    const picked = pickedOption === n;
    const opt = optionData[n - 1];
    const isEditingText = editingPostText === n;
    const updateField = (key: "primaryText" | "headline" | "description", value: string) =>
      setOptionData((prev) => prev.map((o, i) => (i === n - 1 ? { ...o, [key]: value } : o)));

    /* Edit text mode — labeled inputs */
    if (isEditingText) {
      return (
        <div
          key={n}
          className={`bg-white border rounded-card p-4 transition-all duration-150 flex flex-col ${
            picked ? "border-accent ring-2 ring-accent/30" : aiEditing ? "border-accent/60 ring-2 ring-accent/15" : "border-border"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] font-semibold text-text-primary">Edit Option {n}</span>
            <button
              type="button"
              onClick={() => setEditingPostText(null)}
              className="inline-flex items-center gap-1 h-6 px-2.5 text-[11px] font-medium text-white bg-accent rounded-button hover:bg-accent-hover transition-colors"
            >
              <Check size={10} strokeWidth={2} />
              Done
            </button>
          </div>
          <div className="space-y-3 flex flex-col flex-1">
            <div className="flex flex-col flex-1 min-h-0">
              <label className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Primary Text</label>
              <textarea
                value={opt.primaryText}
                onChange={(e) => updateField("primaryText", e.target.value)}
                className="w-full flex-1 min-h-[280px] px-2.5 py-1.5 text-[11px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent resize-none leading-relaxed placeholder:text-text-tertiary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Headline</label>
              <input
                type="text"
                value={opt.headline}
                onChange={(e) => updateField("headline", e.target.value)}
                className="w-full h-8 px-2.5 text-[11px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Description</label>
              <input
                type="text"
                value={opt.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="w-full h-8 px-2.5 text-[11px] border border-border rounded-input bg-white text-text-primary focus:outline-none focus:border-accent placeholder:text-text-tertiary"
              />
            </div>
          </div>
        </div>
      );
    }

    /* View mode — Meta ad preview */
    return (
      <div
        key={n}
        className={`relative bg-white border rounded-card overflow-hidden transition-all duration-150 ${
          picked
            ? "border-accent ring-2 ring-accent/30"
            : aiEditing
            ? "border-accent/60 ring-2 ring-accent/15"
            : "border-border"
        }`}
      >
        {/* Picked badge */}
        {picked && (
          <div className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 h-5 px-2 text-[10px] font-semibold text-white bg-accent rounded-badge shadow-sm">
            <Check size={9} strokeWidth={2.5} />
            In use
          </div>
        )}

        {/* Brand row */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-2">
          <div className="h-7 w-7 rounded-full bg-surface-secondary shrink-0 flex items-center justify-center">
            <ImageIcon size={11} className="text-text-tertiary" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold text-text-primary leading-tight">Godrej Properties</span>
            <span className="block text-[9px] text-text-tertiary mt-0.5">Sponsored &middot; <span className="text-text-tertiary">⌾</span></span>
          </div>
          <button
            type="button"
            onClick={() => setEditingPostText(n)}
            title="Edit text manually"
            className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-button transition-colors shrink-0"
          >
            <Pencil size={12} strokeWidth={1.5} />
          </button>
        </div>

        {/* Primary text */}
        <div className="px-3 pb-2">
          <p className="text-[11px] text-text-primary leading-relaxed line-clamp-2 whitespace-pre-line">
            {opt.primaryText}
          </p>
        </div>

        {/* 1:1 image — ad mockup */}
        <div className="aspect-square">
          <AdMockup variant={n} headline={opt.headline} />
        </div>

        {/* Ad meta block (Meta feed style) */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 bg-surface-page">
          <div className="min-w-0 flex-1">
            <span className="block text-[9px] text-text-tertiary uppercase tracking-wide truncate">godrejproperties.com</span>
            <span className="block text-[12px] font-semibold text-text-primary leading-tight mt-0.5 line-clamp-1">
              {opt.headline}
            </span>
            <span className="block text-[10px] text-text-secondary leading-tight mt-0.5 line-clamp-1">
              {opt.description}
            </span>
          </div>
          <span className="inline-flex items-center text-[10px] font-medium px-2.5 py-1 rounded-button bg-surface-secondary text-text-primary shrink-0">
            Learn More
          </span>
        </div>

        {/* Footer: style + actions */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border-subtle">
          <p className="text-[10px] text-text-tertiary truncate min-w-0" title={opt.style}>{opt.style}</p>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setSelectedOption(aiEditing ? null : n)}
              className={`inline-flex items-center gap-1 h-6 px-2 text-[10px] font-medium rounded-button transition-colors duration-150 ${
                aiEditing
                  ? "text-accent border border-accent/40 bg-accent/5 hover:bg-accent/10"
                  : "text-text-secondary border border-border hover:text-text-primary hover:bg-surface-page"
              }`}
            >
              <Sparkles size={9} strokeWidth={1.5} />
              {aiEditing ? "Editing" : "Edit with AI"}
            </button>
            <button
              type="button"
              onClick={() => setPickedOption(picked ? null : n)}
              className={`inline-flex items-center gap-1 h-6 px-2.5 text-[10px] font-medium rounded-button transition-colors duration-150 ${
                picked
                  ? "text-white bg-accent hover:bg-accent-hover"
                  : "text-text-primary border border-border hover:bg-surface-page"
              }`}
            >
              {picked ? <Check size={10} strokeWidth={2.5} /> : null}
              {picked ? "Using this" : "Use this"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderStep2 = () => (
    <motion.div key="step2" variants={fadeVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
      {isGenerating && !step2Loaded ? (
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
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((n) => renderOptionCard(n))}
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
            className="relative w-full max-w-[960px] max-h-[92vh] overflow-y-auto bg-white rounded-card border border-border shadow-xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white border-b border-border px-6 py-4">
              {/* Row 1: Title + persona chip + close */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <h2 className="text-[18px] font-semibold text-text-primary shrink-0">Generate Creative</h2>

                  {/* Persona chip with dropdown */}
                  <div className="relative min-w-0">
                    <button
                      type="button"
                      onClick={() => setStrategyOpen((v) => !v)}
                      className={`inline-flex items-center gap-1.5 h-7 pl-2.5 pr-2 text-[11px] font-medium rounded-badge border transition-colors duration-150 ${
                        strategyOpen
                          ? "bg-[#EFF6FF] text-[#1D4ED8] border-[#1D4ED8]/30"
                          : "bg-[#EFF6FF] text-[#1D4ED8] border-[#1D4ED8]/20 hover:border-[#1D4ED8]/40"
                      }`}
                    >
                      <span className="truncate">
                        {personaName}
                        {personaRole && <> &middot; {personaRole.split(",")[0].trim()}</>}
                      </span>
                      <ChevronDown
                        size={11}
                        strokeWidth={2}
                        className={`shrink-0 transition-transform duration-200 ${strategyOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Strategy popover */}
                    {strategyOpen && (
                      <>
                        <div className="fixed inset-0 z-[55]" onClick={() => setStrategyOpen(false)} />
                        <div className="absolute left-0 top-full mt-2 w-[640px] max-w-[calc(100vw-4rem)] z-[60] bg-white border border-border rounded-card shadow-lg overflow-hidden">
                          <div className="px-5 py-3 border-b border-border-subtle bg-surface-page">
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex items-center gap-2 flex-wrap">
                                <span className="text-[13px] font-semibold text-text-primary">{personaName}</span>
                                {personaRole && (
                                  <span className="text-[11px] text-text-secondary">&middot; {personaRole}</span>
                                )}
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-badge bg-accent/5 text-accent border border-accent/20">
                                  {angleName}
                                </span>
                              </div>
                              <button type="button" onClick={() => setStrategyOpen(false)}
                                className="p-1 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-button transition-colors shrink-0 ml-2">
                                <X size={13} strokeWidth={1.5} />
                              </button>
                            </div>
                          </div>
                          <div className="px-5 py-4">
                            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                              {painPoint && (
                                <div>
                                  <span className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Pain Point</span>
                                  <p className="text-[12px] text-text-secondary leading-relaxed">{painPoint}</p>
                                </div>
                              )}
                              {usp && (
                                <div>
                                  <span className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">USP</span>
                                  <p className="text-[12px] text-text-secondary leading-relaxed">{usp}</p>
                                </div>
                              )}
                              <div>
                                <span className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">Hook</span>
                                <p className="text-[12px] text-text-primary font-medium leading-relaxed">{hook}</p>
                              </div>
                              <div>
                                <span className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1">CTA</span>
                                <p className="text-[12px] text-text-secondary leading-relaxed">{cta}</p>
                              </div>
                            </div>
                            {personaBullets && personaBullets.length > 0 && (
                              <div className="mt-4 pt-3 border-t border-border-subtle">
                                <span className="block text-[10px] font-medium text-text-tertiary uppercase tracking-[0.4px] mb-1.5">Persona insights</span>
                                <ul className="space-y-1.5">
                                  {personaBullets.map((b, i) => (
                                    <li key={i} className="flex gap-2 text-[12px] text-text-secondary leading-relaxed">
                                      <span className="text-text-tertiary mt-[3px] text-[8px]">&bull;</span>
                                      <span>{b}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-text-tertiary hover:text-text-primary hover:bg-surface-secondary rounded-button transition-colors shrink-0"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>

              {/* Row 3: Progress dots + step label */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-6">
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
                <span className="text-[11px] font-medium text-text-tertiary">Step {modalStep} of 4</span>
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

            {/* Sticky tweak bar — glassy, visible only on step 2 after options loaded */}
            {modalStep === 2 && step2Loaded && !isGenerating && (
              <div
                className={`sticky bottom-[60px] z-10 border-t px-6 py-3 backdrop-blur-md transition-colors duration-200 ${
                  selectedOption
                    ? "bg-accent/[0.08] border-accent/30 shadow-[0_-1px_12px_rgba(26,26,26,0.04)]"
                    : "bg-white/70 border-border-subtle"
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={
                      selectedOption
                        ? `Suggest changes to Option ${selectedOption}...`
                        : "Suggest changes for all 4 options..."
                    }
                    className={`flex-1 h-9 px-3 text-[13px] border rounded-input text-text-primary focus:outline-none transition-colors duration-150 placeholder:text-text-tertiary ${
                      selectedOption
                        ? "bg-white border-accent/40 focus:border-accent"
                        : "bg-white/80 border-border focus:border-accent"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1.5 h-9 px-3 text-[12px] font-medium rounded-button transition-colors duration-150 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed text-accent border border-accent/30 hover:bg-accent/5 bg-white/80"
                  >
                    <RefreshCw size={13} strokeWidth={1.5} />
                    {selectedOption ? `Tweak Option ${selectedOption}` : "Regenerate all 4"}
                  </button>
                </div>
              </div>
            )}

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
