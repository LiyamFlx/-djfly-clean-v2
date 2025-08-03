interface ImportMetaEnv {
  readonly VITE_OPENAI_API_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SPOTIFY_CLIENT_ID: string;
  readonly VITE_SPOTIFY_CLIENT_SECRET: string;
  readonly VITE_SPOTIFY_REDIRECT_URI: string;
  readonly VITE_APP_ENVIRONMENT: string;
  readonly VITE_MAGIC_MATCH_ENABLED: string;
  readonly VITE_MAGIC_SET_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
