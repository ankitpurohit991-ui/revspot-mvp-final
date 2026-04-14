# AI Prompt — Campaign Diagnosis Insight

## What it produces

A single-paragraph narrative that tells the user how their campaign is doing in plain language. Includes the diagnosis status (On Target / Near Target / Off Target), the key number driving that status, and a forward-looking observation.

**Example output:**
> Campaign is NEAR TARGET — CPL ₹1,183 is 1.4% below target ₹1,200. Improving trend visible in second half of the flight.

---

## Data payload sent to the LLM

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
  }
}
```

---

## Prompt

```
You are the analytics engine for Revspot, a performance marketing platform for real estate developers in India.

Analyze this campaign's performance and generate a diagnosis.

## CAMPAIGN DATA
{campaign_data_json}

## TASK
Generate a campaign diagnosis with the following structure:

1. **status**: One of "on-target", "near-target", or "off-target"
   - "on-target": health_score >= 0.85 AND no critical issues
   - "near-target": health_score 0.60-0.84 OR one metric drifting but recoverable
   - "off-target": health_score < 0.60 OR budget exhausted early OR zero target leads after significant spend

2. **summary**: A single sentence (max 120 chars) that states:
   - The diagnosis status
   - The primary metric driving it (e.g., CPL vs target, lead delivery rate)
   - One forward-looking observation (improving/declining trend, days remaining context)
   Format: "Campaign is {STATUS} — {primary metric comparison}. {forward observation}."

3. **reasons**: Array of 3-5 short observations (each max 100 chars) explaining WHY the campaign is in this state. Focus on:
   - Cost metrics vs targets (CPL/CPVL/CPQL trend)
   - Best and worst performing ad sets (name them)
   - Creative performance issues (CTR drops, fatigue signals)
   - Budget pacing (over/under-spending)
   - Lead quality signals (verification rate, qualification rate)

## RULES
- Use ₹ for Indian Rupees. Format large numbers as ₹1.2L (lakhs) or ₹1.2Cr (crores).
- Always name specific ad sets and creatives when referencing them.
- Be data-driven — every claim must reference a number from the data.
- The summary must be scannable at a glance. No jargon. No filler.
- Reasons should be ordered by impact — most important first.
- If CPL is within 5% of target, the campaign is "near-target" not "off-target".
- If lead delivery is ahead of pace but CPL is high, flag the cost concern but keep status positive.
- Consider days_remaining when judging severity — a problem with 2 days left is less actionable than one with 15 days left.

## OUTPUT FORMAT
Return valid JSON only:
{
  "status": "on-target" | "near-target" | "off-target",
  "summary": "string",
  "reasons": ["string", "string", ...]
}
```

---

## When to regenerate

| Trigger | Regenerate? |
|---------|-------------|
| Campaign data refreshes (daily sync from ad platform) | Yes |
| Campaign status changes (active → paused) | Yes |
| New ad set or creative added | Yes |
| Manually triggered by user ("Refresh analysis") | Yes |
| User applies/dismisses a recommendation | No |

---

## Fallback behavior

If the LLM returns invalid JSON or errors:
- Show the last successfully generated diagnosis
- Display a subtle "Last updated X hours ago" timestamp
- Never show a blank diagnosis — fall back to a rule-based calculation using the health score formula from `docs/campaign-health-and-nudges.md`

If campaign has insufficient data (< 3 days, < 10 leads):
- Status: "on-track" (benefit of the doubt)
- Summary: "Campaign is ramping up — not enough data for a full diagnosis yet. Check back in {N} days."
- Reasons: empty array
