# System Map: DJfly Platform

This document outlines the architecture, components, and data flows of the DJfly application.

## 1. Application Entry & Core Structure

- **Entry Point:** The application is a standard Vite + React app. The entry point is `src/main.tsx`, which renders the main `<App />` component from `src/App.tsx`.
- **Core Component (`App.tsx`):** This component is responsible for setting up the main application context, including the React Router and top-level components like the `ApiStatusIndicator`.
- **Build Process:** The application is built using Vite (`vite build`), which is configured in `vite.config.ts`.

## 2. Routing

Routing is centralized in `src/components/AppRouter.tsx` and uses `react-router-dom`.

### Page Components (`src/pages/`):

- **Main Pages:**
  - `HomePage.tsx`: Landing page.
  - `StudioPage.tsx`: Layout for the Magic Studio features.
  - `MagicSetPage.tsx`: UI for generating playlists from a text prompt.
  - `MagicMatchPage.tsx`: UI for analyzing audio and generating matching playlists.
  - `PlayerPage.tsx`: The main DJ player interface.
  - `ProducerPage.tsx`: Analytics dashboard.
  - `PlannerPage.tsx`: (Placeholder) For gig and schedule planning.
  - `DancerPage.tsx`: (Placeholder) For real-time mood analysis.
  - `ProfilePage.tsx`: User profile and settings.
  - `LibraryPage.tsx`: User's music library.
- **Auth Pages (`src/pages/auth/`):**
  - `LoginPage.tsx`, `SignupPage.tsx`, `ForgotPasswordPage.tsx`, `ResetPasswordPage.tsx`.
- **Static & Legal Pages:**
  - `DocsPage.tsx`, `PrivacyPage.tsx`, `TermsPage.tsx`, `ContactPage.tsx`, `HelpPage.tsx`.
- **Error Pages:**
  - `NotFoundPage.tsx` for 404 errors.

## 3. Core Services (`src/services/`)

This directory contains the business logic and API clients for the application.

- `apiConfig.ts`: Centralized configuration for all external APIs. Reads from `.env` files.
- `spotify.ts`: Handles all interactions with the Spotify API (authentication, search, track data). Includes a demo mode fallback.
- `openai.ts`: Handles interactions with the OpenAI API for playlist generation. Includes a demo mode fallback. (Now refactored to use `apiConfig`).
- `supabaseClient.ts`: Manages connection and data operations with the Supabase backend (user data, sessions). Includes a `localStorage` fallback.
- `aiMusicEngine.ts`: The core AI logic. It orchestrates calls to the OpenAI and Spotify services to generate intelligent playlists. Contains its own fallback logic if the OpenAI call fails.
- `auth.ts`: Manages user authentication, including mock login, OAuth flows, and guest sessions.
- `apiHealth.ts`: (New) Provides functions to test the connection status of all external services.
- `cache.ts`: A simple in-memory cache utility used by various services.
- **Audio Services:**
  - `audioEngine.ts`, `advancedAudio.ts`, `audioAnalysis.ts`, `audioEffects.ts`: A suite of services for handling the Web Audio API, playback, and effects in the Player.

## 4. State Management

- **Zustand Store (`src/store/`):** The primary global state management solution.
  - `index.ts`: Defines the main store and its slices.
  - `authStore.ts`: A dedicated slice for managing all authentication and guest mode state (`isAuthenticated`, `isGuestMode`, user info, etc.).
- **Local Component State:** Standard React `useState` and `useReducer` are used for component-level state.
- **Global `appState` (Legacy):** A simple global object was found in `App.tsx` and moved to the Studio pages. This should be refactored into the Zustand store.

## 5. Key Event Flows

### Authentication Flow:

1.  User interacts with `LoginPage.tsx` or `GuestMode.tsx`.
2.  An action is dispatched to `authService.ts` (e.g., `mockLogin`, `supabaseOAuthLogin`).
3.  `authService` performs the authentication logic.
4.  Upon success/failure, it calls actions in the `authStore` (`loginSuccess`, `loginFailure`, `enableGuestMode`).
5.  The `authStore` updates its state (`isAuthenticated`, `user`, `isGuestMode`).
6.  UI components subscribed to the store (via hooks like `useAuth`) re-render to reflect the new auth state.

### Magic Studio (Magic Set) Flow:

1.  User types a prompt into the `textarea` in `MagicSetPage.tsx`.
2.  User clicks "Generate Playlist".
3.  The `generatePlaylist` function in `MagicSetPage.tsx` is called.
4.  It calls `aiMusicEngine.generateIntelligentPlaylist()` with the prompt.
5.  `aiMusicEngine` determines if it has a real OpenAI key from `apiConfig`.
    - **If yes (Happy Path):** It calls the OpenAI API. The response (a list of track names) is then used to search for real tracks using `spotifyService.searchTracks()`.
    - **If no (Fallback Path):** It calls its internal `generateFallbackPlaylist()` method, which uses a local `MUSIC_LIBRARY`.
6.  The final list of `Track` objects is returned to `MagicSetPage.tsx`.
7.  The page updates its state, displaying the generated tracks. The tracks are also pushed to the global queue (currently `appState`, to be moved to Zustand).
8.  The user can then navigate to the `/player` to play the queue.
