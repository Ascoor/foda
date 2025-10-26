import { Suspense } from "react";

import { AppRoutes } from "@app/routes";
import { AppProviders } from "@app/providers";

import "@/i18n";

export default function App() {
  return (
    <AppProviders>
      <Suspense fallback={<div className="p-6 text-center text-sm text-muted-foreground">جارٍ تحميل التطبيق...</div>}>
        <AppRoutes />
      </Suspense>
    </AppProviders>
  );
}
