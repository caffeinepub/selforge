# Specification

## Summary
**Goal:** Update the Dashboard header greeting to show “Hello, <name>” with an icon, and relocate weekly/monthly countdown indicators into the same greeting area while removing duplicates.

**Planned changes:**
- Change the Dashboard header name display to “Hello, <name>” using the stored onboarding name, and render a small adjacent icon on the same line.
- Move the weekly and monthly countdown indicators into the greeting section (next to/under the greeting) and remove the existing countdown block shown below the app name.
- Ensure the greeting appears only once on the Dashboard by removing/avoiding any duplicate greeting (e.g., within the LiveCalendarWidget), while keeping time/date display intact.

**User-visible outcome:** The Dashboard shows a single “Hello, <name>” greeting with a small icon, with weekly and monthly countdown indicators shown in that same header area instead of below the app name.
