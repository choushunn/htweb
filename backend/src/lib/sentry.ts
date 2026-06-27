import * as Sentry from "@sentry/node";

const SENTRY_DSN = process.env.SENTRY_DSN || "";

export function initSentry() {
  if (!SENTRY_DSN) {
    console.log("Sentry DSN 未配置，跳过 Sentry 初始化");
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || "0.1"),
    integrations: [Sentry.expressIntegration()],
  });

  console.log("Sentry 已初始化");
}

export function setupSentryErrorHandler(app: import("express").Application) {
  if (!SENTRY_DSN) return;
  Sentry.setupExpressErrorHandler(app);
}

export { Sentry };
