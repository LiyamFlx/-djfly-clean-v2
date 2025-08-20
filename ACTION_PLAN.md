# DJfly: 100-Fix Action Plan

This document outlines a prioritized list of fixes, improvements, and refactors to enhance the quality, stability, and security of the DJfly platform.

---

## Part 1: Critical & High-Priority Fixes

### Category: Security

**1. Add Security Headers (Priority: High)**

- **File:** `vercel.json`
- **Issue:** The application is missing crucial security headers like `Content-Security-Policy` (CSP), `X-Frame-Options`, `X-Content-Type-Options`, and `Strict-Transport-Security`.
- **Action:** Add a `headers` section to `vercel.json` with a strict CSP that allows scripts and styles only from trusted sources, and include other standard security headers to protect against common web vulnerabilities.

### Category: Architecture & Refactoring

**2. Centralize Global State in Zustand (Priority: High)**

- **Files:** `src/pages/MagicSetPage.tsx`, `src/pages/MagicMatchPage.tsx`, `src/store/index.ts`
- **Issue:** The Studio pages use a legacy, non-reactive global `appState` object to manage the player queue. This can lead to state synchronization issues.
- **Action:** Create a new `playerSlice` or `queueSlice` in the main Zustand store. Refactor the Studio pages and the Player page to use this centralized store for managing the track queue, ensuring reactivity and consistent state.

**3. Improve Service Error Handling (Priority: High)**

- **Files:** `src/services/spotify.ts`, `src/services/supabaseClient.ts`, etc.
- **Issue:** Many service functions catch errors but return default empty values (`[]`, `{}`), which prevents the UI from knowing that an error occurred.
- **Action:** Modify the `catch` blocks in these services. Instead of returning a default value, re-throw a custom error or return a structured object like `{ data: null, error: new Error(...) }`. This will allow the UI layer to catch the error and display an appropriate message to the user.

### Category: Performance

**4. Fix `useAudioPlayer` Re-render Loop (Priority: High)**

- **File:** `src/hooks/useAudioPlayer.ts`
- **Issue:** The main `useEffect` in the hook depends on the entire `options` object, which will trigger the effect on every render if the parent does not memoize it.
- **Action:** Destructure the primitive values needed from the `options` object (`volume`, `loop`, `fadeInDuration`, etc.) directly inside the `useEffect` dependency array. This ensures the effect only re-runs when a specific option actually changes.

### Category: Resilience

**5. Add API Timeouts and Retries (Priority: Medium)**

- **Files:** All service files in `src/services/`.
- **Issue:** `fetch` calls to external APIs have no timeout or retry logic, making them brittle if a network connection is slow or temporarily unavailable.
- **Action:** Create a wrapper function around `fetch` that implements a timeout (e.g., using `AbortController` and `setTimeout`) and a simple exponential backoff retry mechanism for transient network errors. Refactor all services to use this new robust fetch utility.

---

### Category: Bug Fix

**6. Implement Missing Player Controls (Priority: High)**

- **File:** `src/pages/PlayerPage.tsx`
- **Issue:** The primary player controls for `Shuffle`, `SkipBack`, `SkipForward`, and `Repeat` are present in the UI but are not functional as they are missing `onClick` handlers.
- **Action:** Implement the underlying logic for these actions in the Zustand store and `MagicPlayer.ts` service. Connect this logic to the respective buttons in the `PlayerPage` component.

### Category: Refactoring

**7. Extract `formatTime` Utility Function (Priority: Low)**

- **File:** `src/pages/PlayerPage.tsx`
- **Issue:** The `formatTime` helper function is defined locally within the component, but it is a generic utility.
- **Action:** Create a new file, `src/utils/time.ts`, move the `formatTime` function there, and import it back into `PlayerPage.tsx` to improve code reuse and separation of concerns.

**8. Move Inline Styles to a CSS File (Priority: Medium)**

- **File:** `src/pages/PlayerPage.tsx`
- **Issue:** The component uses an inline `<style>` tag for custom slider styles, which is bad practice for maintainability and may violate Content Security Policy (CSP) rules.
- **Action:** Move the styles for the `.slider` class into the global `src/index.css` stylesheet to centralize styling.

### Category: Accessibility

**9. Add ARIA Labels to Icon-Only Buttons (Priority: Medium)**

- **File:** `src/pages/PlayerPage.tsx`
- **Issue:** The player control buttons (`Shuffle`, `Repeat`, etc.) use icons but lack textual descriptions, making them inaccessible to screen reader users.
- **Action:** Add a descriptive `aria-label` attribute to each of the icon-only buttons (e.g., `<button aria-label="Shuffle playlist">`).

### Category: Bug Fix

**10. Implement `generateSet` Store Action (Priority: High)**

- **File:** `src/store/index.ts`
- **Issue:** The `generateSet` action in the main Zustand store is a placeholder and does not actually call the AI service to generate a playlist.
- **Action:** Refactor the `generateSet` function to call `aiMusicEngine.generateIntelligentPlaylist(prompt)`. The resulting tracks should be used to update both `state.ai.generatedTracks` and `state.audio.queue`.

### Category: Feature

**11. Persist Application State to LocalStorage (Priority: Medium)**

- **File:** `src/store/index.ts`
- **Issue:** The Zustand store is not persisted. This means the user's queue, settings, and other state are lost on page refresh.
- **Action:** Use the `persist` middleware from `zustand/middleware` to save the `audio` and `ui` slices of the store to `localStorage`, so the user's session feels continuous.

### Category: Refactoring

**12. Consolidate Zustand Stores (Priority: Low)**

- **Files:** `src/store/index.ts`, `src/store/authStore.ts`
- **Issue:** The application uses two separate Zustand stores, which can complicate state management.
- **Action:** Consider merging the `authStore` into the main `useDJflyStore` as a new `auth` slice to create a single source of truth for global state.

_(This is the initial set of high-priority fixes. I will continue to analyze the repository to generate the full list of 100 items.)_
