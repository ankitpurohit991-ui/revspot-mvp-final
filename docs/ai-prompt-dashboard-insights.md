# AI Prompt — Dashboard Insights (Yesterday & Last 7 Days)

## Context

The dashboard `Insights` component shows a period-selectable list of AI-generated observations about the user's campaigns, leads, and agent activity. Two views: **Yesterday** and **Last 7 days**. Each insight is a one-to-two sentence narrative with an emoji icon and bolded key metrics.

Only **Meta Ads** is connected today — no Google, no LinkedIn. The payload and prompt reflect this (single channel, so channel comparisons are out; campaign comparisons are in).

**Key design decision:** Both payloads include a **day-by-day breakdown** (not just period totals). This lets the LLM spot micro-trends like "CPL improved for 3 consecutive days" or "qualified leads spiked on Wednesday" — observations that would be invisible from aggregates alone.

---

## 1. What the prompt produces

An array of 4-6 `InsightItem` objects matching the existing interface:

```typescript
interface InsightItem {
  id: string;           // stable ID, e.g., "yi-1" or "wi-1"
  icon: string;         // single emoji: 📊 💰 📞 🔻 ✅ 📈
  text: string;         // 1-2 sentence narrative (max 180 chars)
  highlights: string[]; // exact substrings of text to bold
}
```

Two separate calls produce two arrays:
- `yesterdayInsights` — daily snapshot (id prefix: `yi-`)
- `weeklyInsights` — 7-day trend view (id prefix: `wi-`)

---

## 2. Data payload sent to the LLM

### 2a. Yesterday payload

Yesterday's payload includes **yesterday's totals + the prior 7 days as a daily breakdown** so the LLM can contextualize yesterday against recent history.

```json
{
  "period": "yesterday",
  "as_of_date": "2026-04-15",
  "yesterday_date": "2026-04-14",

  "yesterday_totals": {
    "enquiries": 32,
    "verified_leads": 6,
    "qualified_leads": 8,
    "spend": 14200,
    "cpl": 444,
    "cpvl": 2367,
    "cpql": 1775
  },

  "prior_7_days_daily": [
    { "date": "2026-04-07", "enquiries": 25, "verified_leads": 4, "qualified_leads": 5, "spend": 12500, "cpl": 500, "calls_made": 20, "calls_connected": 15, "calls_qualified": 5 },
    { "date": "2026-04-08", "enquiries": 28, "verified_leads": 5, "qualified_leads": 6, "spend": 13000, "cpl": 464, "calls_made": 22, "calls_connected": 17, "calls_qualified": 6 },
    { "date": "2026-04-09", "enquiries": 27, "verified_leads": 4, "qualified_leads": 5, "spend": 13200, "cpl": 489, "calls_made": 21, "calls_connected": 16, "calls_qualified": 5 },
    { "date": "2026-04-10", "enquiries": 29, "verified_leads": 6, "qualified_leads": 7, "spend": 13800, "cpl": 476, "calls_made": 24, "calls_connected": 19, "calls_qualified": 7 },
    { "date": "2026-04-11", "enquiries": 26, "verified_leads": 5, "qualified_leads": 6, "spend": 13500, "cpl": 519, "calls_made": 22, "calls_connected": 17, "calls_qualified": 6 },
    { "date": "2026-04-12", "enquiries": 30, "verified_leads": 5, "qualified_leads": 7, "spend": 14000, "cpl": 467, "calls_made": 25, "calls_connected": 20, "calls_qualified": 7 },
    { "date": "2026-04-13", "enquiries": 28, "verified_leads": 6, "qualified_leads": 7, "spend": 13700, "cpl": 489, "calls_made": 23, "calls_connected": 18, "calls_qualified": 7 }
  ],

  "baselines_30d": {
    "enquiries_daily_avg": 27,
    "cpl_avg": 1020,
    "qualification_rate": 0.28,
    "verification_rate": 0.19
  },

  "by_campaign_yesterday": [
    { "name": "Godrej Air Phase 3",           "spend": 9500, "leads": 18, "qualified": 5, "cpl": 528, "health": "on-track" },
    { "name": "Godrej Reflections — NRI",     "spend": 3500, "leads":  9, "qualified": 2, "cpl": 389, "health": "on-track" },
    { "name": "Godrej Habitat — Brand",       "spend": 1200, "leads":  5, "qualified": 1, "cpl": 240, "health": "needs-attention" }
  ],

  "voice_agent_yesterday": {
    "calls_made": 23,
    "calls_connected": 18,
    "calls_qualified": 8,
    "connected_rate": 0.783,
    "qualification_rate": 0.444,
    "avg_duration_min": 3.2,
    "top_disqualification_reasons": [
      { "reason": "Budget below threshold", "count": 4 },
      { "reason": "Timeline >12 months",    "count": 3 },
      { "reason": "Not decision maker",     "count": 2 }
    ]
  },

  "crm_events_yesterday": {
    "moved_to_site_visit": 3,
    "moved_to_negotiation": 1,
    "moved_to_won": 0,
    "moved_to_lost": 2
  }
}
```

### 2b. Last 7 days payload

The weekly payload includes **day-by-day for the last 7 days** plus the **preceding 7 days as totals** for week-over-week context.

```json
{
  "period": "last_7_days",
  "as_of_date": "2026-04-15",
  "range": { "start": "2026-04-08", "end": "2026-04-14" },

  "period_totals": {
    "enquiries": 198,
    "verified_leads": 37,
    "qualified_leads": 46,
    "spend": 95200,
    "cpl": 481,
    "cpvl": 2573,
    "cpql": 2070
  },

  "daily_breakdown": [
    { "date": "2026-04-08", "enquiries": 28, "verified_leads": 5, "qualified_leads": 6, "spend": 13000, "cpl": 464, "calls_made": 22, "calls_connected": 17, "calls_qualified": 6 },
    { "date": "2026-04-09", "enquiries": 27, "verified_leads": 4, "qualified_leads": 5, "spend": 13200, "cpl": 489, "calls_made": 21, "calls_connected": 16, "calls_qualified": 5 },
    { "date": "2026-04-10", "enquiries": 29, "verified_leads": 6, "qualified_leads": 7, "spend": 13800, "cpl": 476, "calls_made": 24, "calls_connected": 19, "calls_qualified": 7 },
    { "date": "2026-04-11", "enquiries": 26, "verified_leads": 5, "qualified_leads": 6, "spend": 13500, "cpl": 519, "calls_made": 22, "calls_connected": 17, "calls_qualified": 6 },
    { "date": "2026-04-12", "enquiries": 30, "verified_leads": 5, "qualified_leads": 7, "spend": 14000, "cpl": 467, "calls_made": 25, "calls_connected": 20, "calls_qualified": 7 },
    { "date": "2026-04-13", "enquiries": 28, "verified_leads": 6, "qualified_leads": 7, "spend": 13700, "cpl": 489, "calls_made": 23, "calls_connected": 18, "calls_qualified": 7 },
    { "date": "2026-04-14", "enquiries": 32, "verified_leads": 6, "qualified_leads": 8, "spend": 14200, "cpl": 444, "calls_made": 23, "calls_connected": 18, "calls_qualified": 8 }
  ],

  "previous_7_days_totals": {
    "enquiries": 177,
    "verified_leads": 32,
    "qualified_leads": 41,
    "spend": 88000,
    "cpl": 497,
    "cpvl": 2750,
    "cpql": 2146,
    "qualification_rate": 0.232
  },

  "by_campaign_period": [
    { "name": "Godrej Air Phase 3",         "spend": 66000, "leads": 125, "qualified": 32, "cpl": 528, "health": "on-track",        "trend": "improving" },
    { "name": "Godrej Reflections — NRI",   "spend": 22000, "leads":  55, "qualified": 11, "cpl": 400, "health": "on-track",        "trend": "stable"    },
    { "name": "Godrej Habitat — Brand",     "spend":  7200, "leads":  18, "qualified":  3, "cpl": 400, "health": "needs-attention", "trend": "declining" }
  ],

  "voice_agent_period": {
    "calls_made": 160,
    "calls_connected": 125,
    "calls_qualified": 46,
    "connected_rate": 0.781,
    "qualification_rate": 0.288,
    "avg_duration_min": 3.2,
    "top_disqualification_reasons": [
      { "reason": "Budget below threshold", "count": 28, "pct": 41.0 },
      { "reason": "Timeline >12 months",    "count": 20, "pct": 30.0 },
      { "reason": "Not decision maker",     "count": 12, "pct": 17.0 }
    ]
  },

  "crm_events_period": {
    "moved_to_site_visit": 14,
    "moved_to_negotiation": 4,
    "moved_to_won": 1,
    "moved_to_lost": 9
  }
}
```

**Why day-by-day matters:** The LLM can now generate observations like:
- *"CPL improved every day from Monday to Thursday — from ₹519 to ₹444, a 14% drop over 4 days."*
- *"Yesterday's 8 qualified leads was the best day of the week, up from an average of 6.6."*
- *"Call qualification rate jumped from 5/22 (23%) on Tuesday to 8/23 (35%) yesterday."*

These micro-trend observations are impossible to generate from aggregates alone.

---

## 3. The Prompt

```
You are the insights engine for Revspot, a performance marketing platform for real estate developers in India. Your job is to surface the 4-6 most noteworthy observations from a period of campaign activity.

The user runs campaigns on Meta Ads only. Do not reference Google, LinkedIn, or any other ad platform.

## DATA
{payload_json}

## TASK
Generate 4-6 insights as a JSON array. Each insight is ONE observation — specific, data-backed, and actionable.

## OUTPUT FORMAT
Return valid JSON only:
[
  {
    "id": "yi-1" | "wi-1" (use prefix "yi-" for yesterday, "wi-" for last_7_days),
    "icon": "📊" | "💰" | "📞" | "🔻" | "✅" | "📈",
    "text": "string (1-2 sentences, max 180 chars)",
    "highlights": ["exact substring 1", "exact substring 2", ...]
  }
]

## ICON SEMANTICS
- 📊 Volume observations (enquiries, lead counts)
- 💰 Cost / spend observations (CPL, CPVL, CPQL, budget)
- 📞 Voice agent activity (calls, qualification, disqualification reasons)
- 🔻 Underperformance / cost spikes / things getting worse
- ✅ Wins / conversions / positive CRM movements
- 📈 Trends over time (day-over-day, week-over-week, improving/declining metrics)

## COVERAGE (aim for a mix)
Pick insights across these dimensions — don't cluster multiple insights on the same topic:
1. **Volume** — enquiry count vs baseline
2. **Day-over-day trend** — use the daily_breakdown / prior_7_days_daily arrays to spot streaks (e.g., "CPL dropped every day for 4 days")
3. **Campaign-level** — standout campaign (best or worst) by CPL, qualified leads, or health change
4. **Voice agent** — qualification rate, call outcomes, top disqualification reason
5. **CRM progression** — leads moving through the funnel (site visits, won, lost)
6. **Cost efficiency** — CPL/CPVL/CPQL changes

For "last_7_days", ALWAYS include at least one week-over-week comparison using `previous_7_days_totals`.
For "yesterday", ALWAYS include at least one insight that uses `prior_7_days_daily` to contextualize yesterday against the recent trend (e.g., "best day in a week", "continued a 3-day improvement streak").

## STYLE RULES (match existing insights exactly)
1. **Structure**: {Specific metric} + {comparison to baseline, prior day, or previous week} + {optional recommendation or cause}
2. **Length**: 1 sentence preferred, 2 sentences max. Never 3.
3. **Be specific**: Name campaigns ("Godrej Air Phase 3"), disqualification reasons ("Budget below threshold"), CRM stages ("Site Visit Scheduled"). Never say "some campaigns" or "one reason".
4. **Every number must come from the payload**. Do not invent numbers.
5. **Indian number formatting**: Use ₹ prefix. Format as ₹14,200 or ₹1.58L (lakhs) or ₹1.2Cr (crores). Use Indian digit grouping (1,58,000 not 158,000).
6. **Tone**: Neutral-to-observational. No hype. No "Amazing!" or "Great news!".
7. **Comparisons**: Use phrases like "above/below your 30-day average", "up X% from previous week", "best day this week", "third day in a row". Always ground in a baseline or prior period from the payload.
8. **Recommendations** (optional, max 1 per output): "consider pausing...", "consider reallocating budget...". Only when the data clearly warrants it (e.g., a campaign with "needs-attention" health and high CPL).

## HIGHLIGHT EXTRACTION
The `highlights` array must contain EXACT substrings of the `text` field. These are wrapped in <strong> tags on the frontend. Rules:
- Bold every numeric value (counts, ₹ amounts, percentages, rates)
- Bold every directional/trend phrase ("18% above", "down 12%", "4-day streak", "improving")
- Bold every named entity (campaign name, disqualification reason, CRM stage)
- Do NOT bold filler words like "yesterday", "this week", "average", "of", "and"
- Aim for 2-4 highlights per insight

Example:
  text: "Yesterday's CPL of ₹444 was the best day this week, continuing a 3-day improvement streak from ₹519."
  highlights: ["₹444", "best day this week", "3-day improvement streak", "₹519"]

## PRIORITIZATION
Rank insights by "would a performance marketer want to know this?". Prioritize:
1. **Multi-day trends** — streaks of improvement or decline across the daily breakdown
2. **Anomalies** — any metric that moved > 20% from its baseline
3. **CRM wins** — leads moving to high-value stages (site visit, negotiation, won)
4. **Voice agent signals** — qualification rate shifts, dominant disqualification reasons
5. **Campaign inefficiencies** — a campaign with "needs-attention" or "underperforming" health
6. **Cost movements** — CPL/CPVL/CPQL changes

Skip insights where the observation is boring (e.g., "Spend was ₹14,200" with no comparison or context).

## EDGE CASES
- If `yesterday_totals.enquiries` (or `period_totals.enquiries`) is 0: Return a single insight: "No new enquiries recorded {period}. Check that campaigns are active and forms are accessible."
- If `voice_agent_yesterday.calls_made` (or `voice_agent_period.calls_made`) is 0: Skip voice agent insights entirely.
- If period is `yesterday` and ALL key metrics are within ±5% of the 30-day baseline: Generate calmer insights like "Volume steady at {count} enquiries, in line with your {baseline} daily average."
- If only 1 campaign is active: Skip cross-campaign comparisons; focus on trend and agent insights instead.
```

---

## 4. Data Payload Assembly — Reference

### For `yesterday` payload
- Query all campaigns for `yesterday_date` (= today - 1)
- Aggregate totals across all campaigns into `yesterday_totals`
- Build `prior_7_days_daily` by looping days -8 through -2 (7 days ending the day before yesterday)
- `baselines_30d`: averages computed over days -31 through -2 (excluding yesterday to prevent self-reference)
- `by_campaign_yesterday`: per-campaign yesterday aggregates
- `voice_agent_yesterday`: per-day voice agent aggregates
- `crm_events_yesterday`: count of stage transitions that occurred yesterday

### For `last_7_days` payload
- Query all campaigns for days -7 through -1 (the rolling last 7 days ending yesterday)
- Build `daily_breakdown` as 7 objects, oldest to newest
- Aggregate into `period_totals`
- `previous_7_days_totals`: same aggregation for days -14 through -8
- `by_campaign_period`: per-campaign 7-day aggregates + health + trend (derived from daily slope)

### Critical files
- `src/components/dashboard/insights.tsx` — consumes the `InsightItem[]` output
- `src/lib/mock-data.ts` (lines 58-63) — defines the `InsightItem` interface; hardcoded arrays here would be replaced by API calls
- The prompt's output shape must match the existing interface exactly

---

## 5. Caching & Refresh Strategy

| Trigger | Action |
|---------|--------|
| User opens dashboard | Serve cached insights if < 6 hours old |
| Period toggle (Yesterday ↔ Last 7 days) | Serve cached; both are pre-computed |
| Nightly job at 6 AM local | Regenerate both insight sets for all accounts |
| User clicks "Refresh" (if added) | Force regeneration |

Never regenerate on every page load — insights are a "morning coffee" feature, not real-time.

---

## 6. Fallback Behavior

If the LLM fails or returns invalid JSON:
- Serve the last successfully generated insights (cached)
- If none exist, show a rule-based fallback: 3 insights generated by picking the top 3 deltas from the payload and formatting them into templated strings (e.g., "Enquiries were {count} {period}, {delta}% {above/below} your {baseline} daily average.")
