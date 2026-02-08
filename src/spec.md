# Specification

## Summary
**Goal:** Improve free-text restaurant/menu meal logging so multi-word items parse correctly and nutrition can be fetched via an optional web-search fallback with clear source labeling.

**Planned changes:**
- Update free-text meal parsing to keep full multi-word restaurant/menu item names (e.g., “kfc veg zinger burger”) as one item, and interpret leading quantities like “2” as pieces when no unit is provided.
- Improve portion estimation defaults for burger-like items so per-piece grams are more realistic than generic small-piece estimates.
- Add an optional Google Custom Search JSON API lookup step when Open Food Facts has no match, configured via environment variables and gracefully skipped when unconfigured or failing.
- Extract nutrition numbers (at minimum calories; protein/sugar when available) from web-search result text using unit-aware heuristics, scale to parsed quantity/portion, and fall back to existing providers when confidence is low.
- Update Quick Log (Description) results UI to show an English source badge distinguishing Open Food Facts vs Web Search vs AI vs local estimation, without changing gym/cardio flows.

**User-visible outcome:** Users can enter free-text meals like “2 kfc veg zinger burger” and get a correctly parsed item with sensible portions, with nutrition fetched from Open Food Facts or (when needed) an optional web search fallback, and the UI clearly shows where the nutrition came from.
