# Specification

## Summary
**Goal:** Improve free-text meal logging so multi-item prompts are parsed with portion-aware quantities, enriched with public online nutrition data when available, and shown in a Chrome-like itemized breakdown with totals.

**Planned changes:**
- Update meal prompt parsing to extract multiple food items from one input and interpret portion-based units (e.g., slices, packets, tablespoons, grams) without defaulting to 100g when a different unit is implied.
- Add an online nutrition lookup step using free/public endpoints (e.g., Open Food Facts) to fetch calories/protein/sugar before falling back to the existing local/DeepSeek enrichment logic, while tracking the source of the values.
- Revise the Quick Log (Description) results UI to display an English, Chrome-like per-item breakdown (quantity + calories/protein/sugar when available) and show summed totals for the full meal.
- Update enrichment/saving flow to handle enriching multiple items per prompt, produce a human-style English summary (itemized + totals), and keep saved entries consistent with the enriched values shown in the UI.

**User-visible outcome:** Users can type prompts like “2 maggie 2 cheese slice 10 gram mayonnaise” and see each recognized item with an interpreted quantity, nutrition values sourced from the web when possible (with fallback when not), and a clear total calories/protein (and sugar when available) summary in English.
