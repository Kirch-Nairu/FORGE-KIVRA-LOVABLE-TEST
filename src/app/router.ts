import { useState, useEffect, useCallback } from 'react';

export const VALID_ROUTES = [
  '/today',
  '/plan',
  '/money',
  '/goals',
  '/patterns',
  '/ledger',
  '/search',
  '/you',
  '/health',
  '/exports',
  '/onboarding',
] as const;

export type AppRoute = (typeof VALID_ROUTES)[number];

function normalizePath(pathname: string): AppRoute {
  const clean = pathname.toLowerCase().replace(/\/+$/, '') || '/today';
  if (VALID_ROUTES.includes(clean as AppRoute)) {
    return clean as AppRoute;
  }
  return '/today';
}

export function useRouter() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() =>
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/today'
  );

  useEffect(() => {
    const onPopState = () => {
      setCurrentRoute(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((routeOrPath: string) => {
    const target = routeOrPath.startsWith('/') ? routeOrPath : `/${routeOrPath}`;
    const nextRoute = normalizePath(target);
    if (window.location.pathname !== nextRoute) {
      window.history.pushState(null, '', nextRoute);
    }
    setCurrentRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return { currentRoute, navigate };
}
