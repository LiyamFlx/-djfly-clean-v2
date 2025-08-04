export const ROUTES = {
  // Main navigation
  HOME: '/',
  STUDIO: '/studio',
  STUDIO_SET: '/studio/set',
  STUDIO_MATCH: '/studio/match',
  PLAYER: '/player',
  PRODUCER: '/producer',
  PROFILE: '/profile',
  LIBRARY: '/library',
  DOCS: '/docs',
  
  // Legal and support
  PRIVACY: '/privacy',
  TERMS: '/terms',
  CONTACT: '/contact',
  HELP: '/help',
  
  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];