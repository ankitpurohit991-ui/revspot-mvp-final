# AI Prompt — Optimization Recommendations

## What it produces

3-5 specific, actionable recommendations that the user can apply to improve campaign performance. Each has a type, a message, a CTA label, and optionally a target module.

**Example output:**
```json
[
  {
    "type": "budget",
    "text": "Shift 20% budget from 'Broad Bangalore' to 'Whitefield HNI' — Whitefield HNI has 35% lower CPL and 2x conversion rate.",
    "cta": "Adjust Budget"
  },
  {
    "type": "creative",
    "text": "Pause 'Godrej Air Floor Plan Static' creative — CTR dropped 40% in the last 7 days. Replace with a testimonial or walkthrough video.",
    "cta": "Update Creative",
    "cta_module": "creatives"
  }
]
```

---

## Data payload sent to the LLM

Includes the full campaign data (same as the diagnosis prompt) plus creative-level data and the diagnosis output:

```json
{
  "campaign": {
    "name": "Godrej Air Phase 3",
    "status": "active",
    "platform": "Meta",
    "created_at": "2025-11-20",
    "duration_days": 30,
    "days_elapsed": 22,
    "days_remaining": 8
  },
  "targets": {
    "total_budget": 240000,
    "daily_budget": 8000,
    "target_type": "leads",
    "target_value": 200,
    "target_cost_per_lead": 1200
  },
  "actuals": {
    "total_spend": 220000,
    "leads": 186,
    "verified_leads": 42,
    "qualified_leads": 22,
    "cpl": 1183,
    "cpvl": 5238,
    "cpql": 10000
  },
  "pacing": {
    "expected_spend_by_now": 176000,
    "expected_leads_by_now": 147,
    "spend_ratio": 1.25,
    "lead_delivery_ratio": 1.27,
    "cost_efficiency_ratio": 1.01,
    "health_score": 0.88,
    "health_status": "on-track"
  },
  "trend": {
    "cpl_7_day_trend": [1250, 1190, 1210, 1183],
    "cpl_trend_direction": "improving",
    "cpl_7_day_change_pct": -5.4
  },
  "ad_sets": [
    {
      "name": "Whitefield HNI — 30-45",
      "spend": 95000,
      "leads": 72,
      "qualified_leads": 14,
      "cpl": 920,
      "ctr": 2.4,
      "diagnosis": "on-track"
    },
    {
      "name": "Sarjapur IT Corridor",
      "spend": 62000,
      "leads": 58,
      "qualified_leads": 8,
      "cpl": 1069,
      "ctr": 1.9,
      "diagnosis": "on-track"
    },
    {
      "name": "Broad Bangalore — 25-55",
      "spend": 63000,
      "leads": 56,
      "qualified_leads": 0,
      "cpl": 1680,
      "ctr": 0.9,
      "diagnosis": "pause-candidate"
    }
  ],
  "health_indicators": {
    "ctr": "2.1%",
    "cpm": "₹245",
    "frequency": 2.4,
    "budget_pacing": "97.5%"
  },
  "creatives_by_ad_set": {
    "Whitefield HNI — 30-45": [
      { "name": "Godrej Air 3BHK Carousel v2", "format": "Carousel", "ctr": 2.8, "status": "active" },
      { "name": "Godrej Air Lifestyle Video", "format": "Video", "ctr": 3.4, "status": "active" },
      { "name": "Godrej Air Floor Plan Static", "format": "Image", "ctr": 0.8, "status": "paused" }
    ],
    "Sarjapur IT Corridor": [
      { "name": "Godrej Air Amenities Carousel", "format": "Carousel", "ctr": 2.1, "status": "active" },
      { "name": "Godrej Air NRI Investment Static", "format": "Image", "ctr": 1.9, "status": "active" }
    ],
    "Broad Bangalore — 25-55": [
      { "name": "Godrej Air Family Lifestyle", "format": "Video", "ctr": 1.2, "status": "active" },
      { "name": "Godrej Air 3BHK Carousel v2", "format": "Carousel", "ctr": 0.9, "status": "active" }
    ]
  },
  "diagnosis": {
    "status": "near-target",
    "summary": "Campaign is NEAR TARGET — CPL ₹1,183 is 1.4% below target ₹1,200. Improving trend visible in second half.",
    "reasons": [
      "CPL started high at ₹1,450 and has steadily decreased over 4 weeks",
      "Whitefield HNI adset is the top performer with ₹920 CPL",
      "Broad Bangalore adset is dragging overall CPL up at ₹1,680",
      "Creative fatigue detected on Lifestyle Video (CTR dropped 22%)"
    ]
  }
}
```

---

## Prompt

```
You are the optimization engine for Revspot, a performance marketing platform for real estate developers in India.

Based on this campaign's current performance and diagnosis, generate specific optimization recommendations.

## CAMPAIGN DATA
{campaign_data_json}

## TASK
Generate 3-5 optimization recommendations. Each recommendation must be:

1. **Specific** — Name the exact ad set, creative, or audience. Never say "some ad sets" — say "Broad Bangalore".
2. **Quantified** — Include the number that justifies the action. "CPL ₹1,680" not "high CPL".
3. **Actionable** — The user should be able to do it immediately. Not "consider optimizing" but "shift 20% budget from X to Y".
4. **Typed** — Categorize each as: "budget", "creative", "targeting", or "general".

## RECOMMENDATION CATEGORIES

### Budget recommendations ("budget")
Look for:
- Ad sets where CPL differs by >30% — recommend shifting budget from expensive to cheap
- Ad sets spending budget but generating 0 qualified leads — recommend reducing allocation
- Top-performing ad sets that are budget-constrained — recommend increasing allocation
- Overall campaign overspending/underspending vs pacing

### Creative recommendations ("creative")
Look for:
- Creatives with CTR below 1.0% — recommend pausing or replacing
- CTR declining >20% over recent period — flag creative fatigue
- Ad sets with only 1 active creative — recommend adding variety
- High-performing creative formats (e.g., Video > Static) — recommend doubling down

### Targeting recommendations ("targeting")
Look for:
- Ad sets with high leads but low qualification rate — audience may be too broad
- Geographic or demographic pockets performing well — recommend isolating as new ad sets
- Frequency above 3.0 — audience may be saturated, recommend expanding or refreshing

### General recommendations ("general")
Look for:
- Missing voice agent connection (if agentConnected = false) — recommend connecting for lead qualification
- Lead quality signals from distribution data (e.g., most leads from low-budget segment)
- Opportunities to create new ad sets from data patterns

## PRIORITY ORDER
1. First: Anything that stops money waste (pause underperformers, shift from expensive ad sets)
2. Second: Anything that improves cost efficiency (creative refresh, targeting refinement)
3. Third: Growth opportunities (scale winners, add new ad sets)

## RULES
- Max 5 recommendations. Quality over quantity.
- Use ₹ for Indian Rupees. Format as ₹1,680 or ₹1.2L.
- Never recommend something already reflected in the data (e.g., don't say "pause" an already-paused creative).
- Each recommendation text should be 1-2 sentences max.
- CTA labels should be 2-3 words: "Adjust Budget", "Pause Creative", "Add Ad Set", "Update Targeting".
- If campaign is "on-target" with health_score > 0.9, focus recommendations on growth and scaling rather than fixing problems.
- If campaign is "off-target", focus on damage control — pause wasteful spend, protect budget.

## OUTPUT FORMAT
Return valid JSON array only:
[
  {
    "type": "budget" | "creative" | "targeting" | "general",
    "text": "string (1-2 sentences, specific and quantified)",
    "cta": "string (2-3 word action label)",
    "cta_module": "string (optional: 'creatives' | 'audiences' | null)"
  }
]
```

---

## When to regenerate

| Trigger | Regenerate? |
|---------|-------------|
| Campaign data refreshes (daily sync from ad platform) | Yes |
| User applies a recommendation | Yes (remove applied, may generate new ones) |
| New ad set or creative added | Yes |
| Manually triggered by user ("Refresh analysis") | Yes |
| User dismisses a recommendation | No (just hide it) |
| Campaign status changes (active → paused) | No |

---

## Fallback behavior

If the LLM returns invalid JSON or errors:
- Show the last successfully generated recommendations
- Display a subtle "Last updated X hours ago" timestamp

If campaign has insufficient data (< 3 days, < 10 leads):
- Recommendations: empty array
- Show: "Recommendations will appear once we have enough performance data."
