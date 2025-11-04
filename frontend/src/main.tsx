import { createRoot } from "react-dom/client";

import App from "./App";
import "./index.css";
import { ErrorBoundary } from "@/features/legacy/components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
