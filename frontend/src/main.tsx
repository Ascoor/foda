import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import "./index.css";
import { ErrorBoundary } from "@legacy/components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);

if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swUrl = new URL("./shared/workers/service-worker.ts", import.meta.url);
    navigator.serviceWorker
      .register(swUrl, { type: "module" })
      .catch((error) => console.error("Service worker registration failed", error));
  });
}
