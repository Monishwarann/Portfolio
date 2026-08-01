import { useEffect } from "react";

const pageModules = {
  home: () => import("../pages/HomePage"),
  about: () => import("../pages/AboutPage"),
  projects: () => import("../pages/ProjectsPage"),
  certifications: () => import("../pages/CertificationsPage"),
  events: () => import("../pages/EventsPage"),
  contact: () => import("../pages/ContactPage"),
};

/**
 * Prefetch all pages during browser idle time for instant navigation
 */
export const usePrefetch = () => {
  useEffect(() => {
    // Use requestIdleCallback for prefetching during idle time
    const prefetchPages = () => {
      if ("requestIdleCallback" in window) {
        const idleCallbackIds: number[] = [];

        Object.values(pageModules).forEach((importFn) => {
          const id = requestIdleCallback(
            () => {
              importFn().catch(() => {});
            },
            { timeout: 2000 }
          );
          idleCallbackIds.push(id);
        });

        return () => {
          idleCallbackIds.forEach((id) => cancelIdleCallback(id));
        };
      } else {
        // Fallback for browsers without requestIdleCallback
        const timeoutId = setTimeout(() => {
          Object.values(pageModules).forEach((importFn) => {
            importFn().catch(() => {});
          });
        }, 1000);

        return () => clearTimeout(timeoutId);
      }
    };

    const cleanup = prefetchPages();
    return cleanup;
  }, []);
};
