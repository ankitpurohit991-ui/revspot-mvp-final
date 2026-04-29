/**
 * Shared types and mock data helpers for the creative generation workspace.
 * Used by Phase A (setup), Phase B (concept editor), and Phase C (resize editor).
 */

/* ------------------------------------------------------------------ */
/*  Output type — emitted to the parent (step3-creatives.tsx)         */
/* ------------------------------------------------------------------ */

export interface GeneratedCreative {
  id: string;
  size: string;
  label: string;
  postText: string;
  headline: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/*  Phase / workspace types                                            */
/* ------------------------------------------------------------------ */

export type CreativePhase = "setup" | "concept" | "resize";

/** A single message in the concept chat. */
export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  /** When AI replies with a new version, link the version it produced. */
  version_id?: string;
  /** While the AI is "thinking", we add a placeholder message with this set. */
  pending?: boolean;
  created_at: number;
}

/** A single creative version. Lives in either concept_versions (Phase B) or per-size versions (Phase C). */
export interface ConceptVersion {
  id: string;
  /** Parent version (for branching). null = root. */
  parent_id: string | null;
  /** Variant style id, drives the AdMockup variant prop (1-4). */
  variant: 1 | 2 | 3 | 4;
  primary_text: string;
  headline: string;
  description: string;
  /** Short label shown on the timeline thumbnail (e.g., "v1", "Bold"). */
  label: string;
  created_at: number;
}

/** The whole modal's state, threaded through the orchestrator. */
export interface CreativeWorkspace {
  // Phase A inputs
  prompt: string;
  style_reference: { name: string } | null;
  product_image: { name: string } | null;

  // Phase B (concept editor — chat + version history)
  concept_messages: ChatMessage[];
  concept_versions: ConceptVersion[];
  active_concept_version_id: string | null;

  // Phase C (resize editor — single current version per size, no chat)
  selected_sizes: string[];
  size_versions: Record<string, ConceptVersion>;
}

/* ------------------------------------------------------------------ */
/*  Size catalog                                                       */
/* ------------------------------------------------------------------ */

export interface SizeOption {
  id: string;
  dimensions: string;
  label: string;
  aspectW: number;
  aspectH: number;
}

export const SIZE_OPTIONS: SizeOption[] = [
  { id: "sq-feed", dimensions: "1080×1080", label: "Square — Feed", aspectW: 1, aspectH: 1 },
  { id: "story", dimensions: "1080×1920", label: "Story / Reel", aspectW: 9, aspectH: 16 },
  { id: "landscape", dimensions: "1200×628", label: "Landscape — Feed", aspectW: 1200, aspectH: 628 },
  { id: "portrait", dimensions: "1080×1350", label: "Portrait — Feed", aspectW: 4, aspectH: 5 },
  { id: "sq-carousel", dimensions: "1080×1080", label: "Square — Carousel", aspectW: 1, aspectH: 1 },
];

export function getSize(sizeId: string): SizeOption | undefined {
  return SIZE_OPTIONS.find((s) => s.id === sizeId);
}

/** Convert a size id to a CSS aspect-ratio value for preview boxes. */
export function aspectRatioFor(sizeId: string): string {
  const s = getSize(sizeId);
  if (!s) return "1 / 1";
  if (s.id === "story") return "9 / 16";
  if (s.id === "landscape") return "1200 / 628";
  if (s.id === "portrait") return "4 / 5";
  return "1 / 1";
}

/* ------------------------------------------------------------------ */
/*  Mock concept pool — used by the mock AI to "generate" new versions */
/* ------------------------------------------------------------------ */

interface ConceptCopy {
  variant: 1 | 2 | 3 | 4;
  primary_text: string;
  headline: string;
  description: string;
  label: string;
}

const CONCEPT_POOL: ConceptCopy[] = [
  {
    variant: 1,
    primary_text:
      "🏡 Your dream home is closer than you think.\n\nPremium 3BHK apartments in Whitefield, starting at ₹1.8Cr. Smart homes with world-class amenities, just 2 mins from the IT corridor.\n\n📍 Book your free site visit this weekend.",
    headline: "Premium 3BHK in Whitefield — Starting ₹1.8Cr",
    description: "RERA registered. Smart home ready. 3-acre zen gardens.",
    label: "Bold lifestyle",
  },
  {
    variant: 2,
    primary_text:
      "₹1.8 Cr.\nThat's all it takes to own a Godrej home in Whitefield.\n\n3BHK | Smart Home Ready | RERA Registered\n\nLimited units in Phase 3. Don't wait.\n\n👉 Get the brochure now.",
    headline: "₹1.8Cr — Own a Godrej Home in Whitefield",
    description: "Limited Phase 3 units. 3BHK smart homes with zen gardens.",
    label: "Price anchor",
  },
  {
    variant: 3,
    primary_text:
      "\"We moved into Godrej Air 6 months ago and it changed our lives.\"\n— Rajesh & Priya, 3BHK owners\n\n1200+ families already call Godrej Air home. Phase 3 is now open.\n\n🏠 See what they're talking about →",
    headline: "1200+ Families Chose Godrej Air — Phase 3 Now Open",
    description: "Join India's most loved residential community in Whitefield.",
    label: "Social proof",
  },
  {
    variant: 4,
    primary_text:
      "Luxury isn't just a word. It's an address.\n\nGodrej Air, Phase 3 — Where Japanese-inspired architecture meets Bangalore's most coveted location.\n\nStarting ₹1.8Cr | 3 & 4 BHK\n\n✨ Experience the walkthrough →",
    headline: "Godrej Air Phase 3 — Luxury Redefined",
    description: "Japanese-inspired architecture. Starting ₹1.8Cr.",
    label: "Premium dark",
  },
  {
    variant: 1,
    primary_text:
      "This could be your morning view. ☀️\n\nWake up to 3 acres of landscaped gardens at Godrej Air, Whitefield. Phase 3 now open for bookings.\n\nStarting ₹1.8Cr.\n\n👉 Book a site visit",
    headline: "Wake Up to 3 Acres of Gardens — Godrej Air",
    description: "Phase 3 now open. Starting ₹1.8Cr in Whitefield.",
    label: "Garden vibe",
  },
  {
    variant: 2,
    primary_text:
      "Rent: ₹45K/month. Zero ownership.\nEMI: ₹1.1L/month. 100% yours.\n\nThe math is simple. Make the switch to Godrej Air.\n\n3BHK in Whitefield | RERA Approved\n\n🏡 Get started →",
    headline: "Rent vs Own — The Math is Simple",
    description: "3BHK in Whitefield. RERA Approved. EMI from ₹1.1L/month.",
    label: "Rent-vs-own",
  },
  {
    variant: 3,
    primary_text:
      "Stop scrolling. Start living.\n\nGodrej Air Phase 3 brings you 3BHK homes designed for modern families. Zen gardens, infinity pool, and a location that puts everything within reach.\n\n📞 Talk to our team today.",
    headline: "Stop Scrolling. Start Living — Godrej Air",
    description: "3BHK homes for modern families. Zen gardens & infinity pool.",
    label: "Urgent CTA",
  },
  {
    variant: 4,
    primary_text:
      "Home is where your story begins.\n\nAt Godrej Air, every detail is designed to make life beautiful — from the zen-inspired gardens to the smartly crafted living spaces.\n\nPhase 3 | Starting ₹1.8Cr\n\n💫 Explore now",
    headline: "Home Is Where Your Story Begins",
    description: "Zen-inspired gardens. Smartly crafted living spaces.",
    label: "Soft luxury",
  },
];

/* ------------------------------------------------------------------ */
/*  Mock helpers                                                       */
/* ------------------------------------------------------------------ */

let _idCounter = 0;
export function mkId(prefix = "id"): string {
  _idCounter += 1;
  return `${prefix}-${Date.now()}-${_idCounter}`;
}

/** Return a fresh ConceptVersion picked from the pool. */
export function makeMockVersion(opts: {
  parent_id?: string | null;
  preferVariant?: 1 | 2 | 3 | 4;
  /** Used to vary the label; e.g., "v3", "Story v2". */
  labelPrefix?: string;
  /** When generating from a refinement message, we tweak the headline. */
  refinementText?: string;
}): ConceptVersion {
  const pool = CONCEPT_POOL;
  const idx = opts.preferVariant
    ? pool.findIndex((p) => p.variant === opts.preferVariant)
    : Math.floor(Math.random() * pool.length);
  const base = pool[idx === -1 ? 0 : idx];

  // If the user asked for a refinement, prepend a hint to the headline so the
  // mocked version visibly responds to the prompt.
  let headline = base.headline;
  if (opts.refinementText) {
    const hint = summariseRefinement(opts.refinementText);
    if (hint) headline = `${headline} · ${hint}`;
  }

  return {
    id: mkId("ver"),
    parent_id: opts.parent_id ?? null,
    variant: base.variant,
    primary_text: base.primary_text,
    headline,
    description: base.description,
    label: opts.labelPrefix ?? base.label,
    created_at: Date.now(),
  };
}

/**
 * Pick a fresh variant from the pool that hasn't been used in `existingVariants`.
 * Used by "Generate new option" so each new option feels distinct visually.
 */
export function pickFreshVariant(
  existingVariants: (1 | 2 | 3 | 4)[]
): 1 | 2 | 3 | 4 {
  const used = new Set(existingVariants);
  const candidates = [1, 2, 3, 4].filter((n) => !used.has(n as 1 | 2 | 3 | 4));
  if (candidates.length === 0) {
    return ((Math.floor(Math.random() * 4) + 1) as 1 | 2 | 3 | 4);
  }
  return candidates[Math.floor(Math.random() * candidates.length)] as 1 | 2 | 3 | 4;
}

/** Compose a short AI summary line for the chat reply. */
export function makeMockReply(refinementText: string): string {
  const hint = summariseRefinement(refinementText);
  if (hint) return `Done — I tried "${hint}". Take a look on the right.`;
  return "Done — here's a fresh take. Take a look on the right.";
}

function summariseRefinement(text: string): string {
  const cleaned = text.trim().replace(/\s+/g, " ");
  if (!cleaned) return "";
  const truncated = cleaned.length > 36 ? `${cleaned.slice(0, 36).trim()}…` : cleaned;
  return truncated;
}

/* ------------------------------------------------------------------ */
/*  Workspace defaults                                                 */
/* ------------------------------------------------------------------ */

export const DEFAULT_SIZES: string[] = ["sq-feed"];

export function emptyWorkspace(): CreativeWorkspace {
  return {
    prompt: "",
    style_reference: null,
    product_image: null,
    concept_messages: [],
    concept_versions: [],
    active_concept_version_id: null,
    selected_sizes: [...DEFAULT_SIZES],
    size_versions: {},
  };
}

/* ------------------------------------------------------------------ */
/*  Setup helper — what will the AI do based on inputs?                */
/* ------------------------------------------------------------------ */

export function describeSetupMode(workspace: Pick<
  CreativeWorkspace,
  "prompt" | "style_reference" | "product_image"
>): string {
  const hasRef = !!workspace.style_reference;
  const hasProd = !!workspace.product_image;
  const promptOk = workspace.prompt.trim().length > 0;

  if (!promptOk && !hasRef && !hasProd) {
    return "Add a prompt to get started. References and a product image are both optional.";
  }
  if (hasRef && hasProd) {
    return `Will match the style of ${workspace.style_reference!.name} and feature ${workspace.product_image!.name}.`;
  }
  if (hasRef) {
    return `Will match the visual style of ${workspace.style_reference!.name}.`;
  }
  if (hasProd) {
    return `Will feature ${workspace.product_image!.name} in AI-designed layouts.`;
  }
  return "Will generate fully AI-designed visuals from your prompt.";
}
