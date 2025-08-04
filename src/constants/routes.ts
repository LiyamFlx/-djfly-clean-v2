export const ROUTES = {
  // Main navigation
  HOME: '/',
  STUDIO: '/studio',
  STUDIO_SET: '/studio/set',
  STUDIO_MATCH: '/studio/match',
  PLAYER: '/player',
  LIBRARY: '/library',
  
  // Auth
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];