# Specification

## Summary
**Goal:** Add a first-run onboarding flow that collects the user’s name and only the required API credentials (DeepSeek, Nutritionix, API Ninjas), then tailor the UI to use these settings and remove all other API options.

**Planned changes:**
- Add a mandatory first-run onboarding gate (before any main navigation/pages) that collects and locally persists: Name, DeepSeek API key, Nutritionix App ID + App Key, and API Ninjas API key.
- Add required-field validation with clear English error messages and prevent proceeding until all fields are non-empty.
- Update the header to greet the user in English (e.g., “Hello, <Name>”) and display the name alongside the live time/date in the same header block.
- Remove/hide all other API provider settings and UI references (e.g., Google CSE, OpenFoodFacts, and any other non-requested API options) so only DeepSeek, Nutritionix, and API Ninjas are referenced.
- Switch nutrition lookup/logging to use Nutritionix when credentials are present, with existing local fallback behavior when credentials are missing (without exposing alternative API configuration).
- Switch gym/exercise-related external calls to use API Ninjas when the key is present, with no other gym API providers configurable.
- Update `frontend/.env.example` to include only DeepSeek, Nutritionix (App ID + App Key), and API Ninjas entries, removing examples for other providers.

**User-visible outcome:** On first launch, users must enter their name and the three supported API credentials before accessing the app; afterward, the app greets them by name next to the live time/date, and nutrition/gym features use Nutritionix and API Ninjas without showing any other API configuration options.
