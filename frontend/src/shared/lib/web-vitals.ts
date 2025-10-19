export interface WebVitalMetric {
  name: string;
  id: string;
  value: number;
  delta: number;
  label: string;
  navigationType?: string;
}

type Reporter = (metric: WebVitalMetric) => void;

const generateId = (name: string) => `${name}-${Math.round(performance.now())}-${Math.random().toString(16).slice(2)}`;

export const reportWebVitals = (onReport: Reporter) => {
  if (typeof window === "undefined" || typeof performance === "undefined") {
    return;
  }

  const navigationEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const navigationType = navigationEntry?.type ?? "navigate";

  const emit = (name: string, value: number, delta?: number) => {
    const metric: WebVitalMetric = {
      name,
      id: generateId(name),
      value,
      delta: delta ?? value,
      label: "web-vital",
      navigationType,
    };

    try {
      onReport(metric);
    } catch (error) {
      console.error("Failed to report web vital", error);
    }
  };

  // First Contentful Paint
  const paintEntries = performance.getEntriesByType("paint");
  for (const entry of paintEntries) {
    if (entry.name === "first-contentful-paint") {
      emit("FCP", entry.startTime);
    }
  }

  // Largest Contentful Paint & Cumulative Layout Shift
  if ("PerformanceObserver" in window) {
    try {
      let clsValue = 0;

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            emit("LCP", (entry as any).renderTime || entry.startTime);
          }

          if (entry.entryType === "layout-shift") {
            const shift = entry as LayoutShift;
            if (!shift.hadRecentInput) {
              clsValue += shift.value;
              emit("CLS", clsValue, shift.value);
            }
          }
        }
      });

      observer.observe({ type: "largest-contentful-paint", buffered: true });
      observer.observe({ type: "layout-shift", buffered: true });

      const fidObserver = new PerformanceObserver((list) => {
        const firstInput = list.getEntries()[0] as PerformanceEventTiming;
        if (firstInput) {
          emit("FID", firstInput.processingStart - firstInput.startTime);
          fidObserver.disconnect();
        }
      });

      fidObserver.observe({ type: "first-input", buffered: true });
    } catch (error) {
      console.error("PerformanceObserver not supported", error);
    }
  }

  if (navigationEntry) {
    const ttfb = navigationEntry.responseStart;
    emit("TTFB", ttfb);
  }
};
