
import * as Sentry from '@sentry/react';

export const initSentry = () => {
  Sentry.init({
    dsn: "https://27c6e7bffef52cc502ca5178ff3ff6df@o4505599359451136.ingest.us.sentry.io/4509141821095936",
    integrations: [
      new Sentry.BrowserTracing({
        // Set sampling rate for performance monitoring
        tracePropagationTargets: ["localhost", "felem.puayhiang.com"],
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.2, // Capture 20% of transactions for performance monitoring
    // Session Replay
    replaysSessionSampleRate: 0.1, // Sample rate for session replays
    replaysOnErrorSampleRate: 1.0, // Sample rate for errors
    environment: import.meta.env.MODE, // Set environment from Vite's mode
  });
};

// Export Sentry utilities for easier use in components
export { Sentry };
