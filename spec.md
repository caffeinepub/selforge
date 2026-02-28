# Specification

## Summary
**Goal:** Fix the hold-to-terminate bug, expand onboarding with age/gender, add a Settings screen with profile editing and streak history, and remove branding text from the Dashboard.

**Planned changes:**
- Fix hold-to-terminate in `ProtocolMode.tsx` from 180 seconds to 3 seconds (3000ms)
- Expand `OnboardingGate.tsx` to collect name, age (numeric), and gender (Male / Female / Other / Prefer not to say) before allowing app access
- Update Zustand store (`store.ts`) to add persisted `age` and `gender` fields and a `streakHistory` array (with start date, end date, streak length), plus corresponding actions
- Add a Settings screen accessible via a gear icon in the Dashboard header or bottom nav, containing:
  - Editable profile section (name, age, gender) with save action
  - Read-only streak history list showing past streaks with date range and length
  - Existing preferences (accent color, OLED mode, etc.)
- Remove all "Made from Caffeine.ai" or similar attribution text from the Dashboard and any other screen

**User-visible outcome:** Users are prompted for name, age, and gender on first launch; they can edit these and view their streak history in a new Settings screen; the terminate hold gesture correctly fires after 3 seconds; and the Caffeine.ai branding is gone from the Dashboard.
