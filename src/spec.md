# Specification

## Summary
**Goal:** Remove the “No data yet” fallback text from the Dashboard header’s Weekly/Monthly measurements and avoid empty spacing when both have no data.

**Planned changes:**
- Update the Dashboard header measurements UI to not render the “No data yet” text under the “Weekly” label when weekly measurements have no values > 0.
- Update the Dashboard header measurements UI to not render the “No data yet” text under the “Monthly” label when monthly measurements have no values > 0.
- When both Weekly and Monthly have no data, collapse the measurements row/area so it does not leave an empty placeholder gap below the header.

**User-visible outcome:** On the Dashboard, Weekly/Monthly sections no longer show “No data yet” when empty, and if both are empty the header area won’t leave blank space before the next section.
