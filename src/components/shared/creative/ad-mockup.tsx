/**
 * Visual mock for a generated creative. Renders one of 4 hard-coded styles
 * keyed by `variant`. The `headline` text is the only dynamic element — all
 * styling is CSS. This matches the existing modal's mock approach (no real
 * image generation).
 */

interface AdMockupProps {
  variant: number;
  headline: string;
}

export function AdMockup({ variant, headline }: AdMockupProps) {
  switch (variant) {
    case 1:
      // Bold typography with lifestyle imagery — warm gradient
      return (
        <div className="relative w-full h-full bg-gradient-to-br from-[#FED7AA] via-[#FCA5A5] to-[#F97373] flex items-end p-5 overflow-hidden">
          <div className="absolute top-4 left-4 h-6 w-6 rounded-[4px] bg-white/30 backdrop-blur-sm" />
          <div className="absolute top-10 left-4 right-4 h-[1px] bg-white/30" />
          <div className="text-white z-10">
            <div className="text-[9px] font-semibold uppercase tracking-[2px] opacity-90 mb-1.5">
              Phase 3 · Now Open
            </div>
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
            <div className="text-[9px] text-[#1A1A1A] font-semibold uppercase tracking-[1.5px]">
              Starting Price
            </div>
            <div className="text-[10px] text-[#6B6B6B] mt-0.5 line-clamp-1">
              RERA approved · Phase 3
            </div>
          </div>
          <div className="absolute top-4 right-4 text-[9px] font-bold text-[#1A1A1A] tracking-wider">
            GODREJ
          </div>
        </div>
      );
    case 3:
      // Testimonial with social proof — teal
      return (
        <div className="relative w-full h-full bg-gradient-to-br from-[#0F766E] to-[#134E4A] flex flex-col justify-center p-5 overflow-hidden">
          <div className="text-white/25 text-[56px] leading-none font-serif -mb-2">&ldquo;</div>
          <div className="text-white text-[13px] leading-snug font-medium line-clamp-2">
            Changed our lives.
          </div>
          <div className="mt-3">
            <div className="flex gap-0.5 mb-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className="text-[10px] text-[#FCD34D]">
                  &#9733;
                </span>
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
          <div className="text-[9px] text-[#D4A574] font-semibold uppercase tracking-[3px] mb-2">
            Godrej Air
          </div>
          <div className="text-white text-[14px] font-light leading-snug tracking-wide">
            Luxury
            <br />
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
          <span className="text-[11px] font-medium text-text-tertiary">Variant {variant}</span>
        </div>
      );
  }
}
