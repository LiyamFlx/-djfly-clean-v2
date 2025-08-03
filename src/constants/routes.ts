export const ROUTES = {
  HOME: '/',
  STUDIO: '/studio',
  STUDIO_SET: '/studio/set',
  STUDIO_MATCH: '/studio/match',
  PLAYER: '/player',
  PRODUCER: '/producer',
  PROFILE: '/profile',
  LIBRARY: '/library',
  DOCS: '/docs',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];