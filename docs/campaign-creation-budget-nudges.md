# Campaign Creation — Budget Nudges (Step 1)

## Context

When a user sets their campaign targets in Step 1 of the campaign launcher, they enter:
- **Target type**: Leads, Verified Leads, or Qualified Leads
- **Target count**: e.g., 500
- **Duration**: e.g., 30 days
- **Budget**: e.g., ₹5,00,000

From these, we derive the **implied cost per target lead** and **daily budget**, then evaluate whether the targets are realistic based on industry benchmarks.

The nudge appears in real-time as the user fills in these fields — it's a pre-launch sanity check, not a post-launch alert.

---

## 1. Derived Metrics

```
implied_cost_per_target = budget / target_count
daily_budget            = budget / duration_days
daily_target            = target_count / duration_days
```

The cost label adapts to the target type:
- Leads → **CPL** (Cost Per Lead)
- Verified Leads → **CPVL** (Cost Per Verified Lead)
- Qualified Leads → **CPQL** (Cost Per Qualified Lead)

---

## 2. Benchmark Ranges by Target Type

Benchmarks are for **Indian Real Estate** on **Meta Ads**. These will vary by market, property type, and city — but these are reasonable starting ranges for Tier 1 cities.

| Target Type | Unrealistic | Aggressive | Realistic | Comfortable |
|-------------|-------------|------------|-----------|-------------|
| **Leads (CPL)** | < ₹200 | ₹200 – ₹500 | ₹500 – ₹2,000 | > ₹2,000 |
| **Verified Leads (CPVL)** | < ₹800 | ₹800 – ₹2,000 | ₹2,000 – ₹6,000 | > ₹6,000 |
| **Qualified Leads (CPQL)** | < ₹2,000 | ₹2,000 – ₹5,000 | ₹5,000 – ₹15,000 | > ₹15,000 |

### Daily Budget Minimum

Regardless of target type, Meta needs a minimum daily budget to deliver effectively:

| Daily Budget | Status |
|-------------|--------|
| < ₹1,000/day | Unrealistic — Meta won't exit learning phase |
| ₹1,000 – ₹3,000/day | Aggressive — limited delivery, slow learning |
| ₹3,000 – ₹5,000/day | Minimum viable — will deliver but learning may be slow |
| ₹5,000+/day | Good — sufficient for stable delivery |

---

## 3. Nudge Status Logic

```
function evaluateBudget(targetType, targetCount, durationDays, budget):

    impliedCost = budget / targetCount
    dailyBudget = budget / durationDays

    // Step 1: Check daily budget minimum
    if dailyBudget < 1000:
        return "unrealistic" with reason "daily budget too low"

    if dailyBudget < 3000:
        dailyBudgetWarning = true  // will downgrade status by one level

    // Step 2: Check implied cost against target-type benchmarks
    benchmarks = BENCHMARKS[targetType]

    if impliedCost < benchmarks.unrealistic_ceiling:
        status = "unrealistic"
    else if impliedCost < benchmarks.aggressive_ceiling:
        status = "aggressive"
    else if impliedCost <= benchmarks.realistic_ceiling:
        status = "realistic"
    else:
        status = "comfortable"

    // Step 3: Downgrade if daily budget is too low
    if dailyBudgetWarning and status == "realistic":
        status = "aggressive"  // can't be realistic with < ₹3K/day

    return status
```

---

## 4. Nudge Messages

### Unrealistic

**Appearance:** Red background, ⛔ icon

**Messages (varies by reason):**

When implied cost is too low:
> "A {cost_label} of ₹{implied_cost} is below market rates for real estate in India. At this budget, you'd need ₹{realistic_min_budget} to realistically achieve {target_count} {target_type}. Consider increasing your budget or reducing your target."

When daily budget is too low:
> "A daily budget of ₹{daily_budget} is too low for Meta to deliver effectively. Meta recommends at least ₹1,000/day to exit the learning phase. Consider increasing your budget or extending the duration."

### Aggressive

**Appearance:** Amber background, ⚠️ icon

> "Implied {cost_label} of ₹{implied_cost} is ambitious for this market. You'll need to optimize aggressively — expect tight targeting and creative refresh every 5-7 days. A more comfortable budget would be ₹{suggested_budget} for {target_count} {target_type}."

**Additional line if daily budget is low:**
> "Daily budget of ₹{daily_budget} may limit Meta's ability to optimize. Consider ₹{suggested_daily}+/day."

### Realistic

**Appearance:** Green background, ✅ icon

> "Implied {cost_label} of ₹{implied_cost} is achievable for real estate campaigns in India. Daily budget of ₹{daily_budget} gives Meta enough room to optimize delivery."

### Comfortable

**Appearance:** Green background, ✅ icon

> "{cost_label} of ₹{implied_cost} gives you room to optimize for lead quality over volume. Consider tightening targeting to attract higher-intent buyers, or reducing budget to improve efficiency."

---

## 5. Suggested Budget Calculation

When the user's budget is unrealistic or aggressive, we suggest a realistic budget:

```
suggested_budget = target_count × benchmarks.realistic_floor
suggested_daily  = suggested_budget / duration_days
```

Example:
- Target: 200 Qualified Leads in 30 days
- User enters: ₹4,00,000 (implied CPQL = ₹2,000 — aggressive)
- Suggested: 200 × ₹5,000 = ₹10,00,000 at ₹33,333/day
- Nudge: "Implied CPQL of ₹2,000 is ambitious. A more comfortable budget would be ₹10L for 200 qualified leads."

---

## 6. Cross-field Validation

The nudge should only show when **all three fields** are filled: target count, duration, and budget.

| Fields filled | Show nudge? |
|--------------|-------------|
| Only budget | No |
| Budget + target count | No (need duration to calculate daily budget) |
| Budget + target count + duration | Yes |

---

## 7. Edge Cases

| Scenario | Behavior |
|----------|----------|
| Target count = 0 | Don't show nudge, show field validation error instead |
| Duration = 0 | Don't show nudge, show field validation error instead |
| Budget = 0 | Don't show nudge, show field validation error instead |
| Very large budget (₹1Cr+) | Show "comfortable" nudge with quality optimization suggestion |
| Very long duration (90+ days) | Show nudge normally but add note: "For campaigns longer than 60 days, consider splitting into phases for better optimization." |
| Very short duration (< 7 days) | Add note: "Short campaigns give Meta limited time to optimize. Consider extending to at least 14 days." |

---

## 8. Benchmark Config (for future extensibility)

```typescript
const BUDGET_BENCHMARKS = {
  leads: {
    unrealistic_ceiling: 200,
    aggressive_ceiling: 500,
    realistic_ceiling: 2000,
    realistic_floor: 500,       // used for suggested budget calc
    label: "CPL",
  },
  verified_leads: {
    unrealistic_ceiling: 800,
    aggressive_ceiling: 2000,
    realistic_ceiling: 6000,
    realistic_floor: 2000,
    label: "CPVL",
  },
  qualified_leads: {
    unrealistic_ceiling: 2000,
    aggressive_ceiling: 5000,
    realistic_ceiling: 15000,
    realistic_floor: 5000,
    label: "CPQL",
  },
};
```

These benchmarks should eventually be:
- Configurable per industry (when non-real-estate industries are added)
- Informed by the org's own historical campaign data (once enough campaigns have run)
- Adjusted by city tier (Tier 1 vs Tier 2 vs NRI markets)

---

## 9. Summary

```
User enters:  Target type + Target count + Duration + Budget
System derives: Implied cost per target, daily budget
System evaluates: Against target-type-specific benchmarks + daily budget minimums

Four statuses:
  🔴 Unrealistic  — below market floor, won't deliver
  🟡 Aggressive   — possible but requires heavy optimization
  🟢 Realistic    — achievable with standard best practices
  🟢 Comfortable  — room to optimize for quality

Key difference from current implementation:
  ✅ Benchmarks are target-type-aware (CPL vs CPVL vs CPQL have different ranges)
  ✅ Daily budget minimum is checked independently
  ✅ Suggested budget is calculated and shown
  ✅ Duration edge cases handled (too short / too long)
  ✅ Messages adapt label (CPL/CPVL/CPQL) based on chosen target type
```
