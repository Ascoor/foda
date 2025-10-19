import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import { Dashboard } from "@/features/dashboard";
import { Login } from "@/features/login";
import { Volunteers } from "@/features/volunteers";

export const AppRoutes = () => (
  <BrowserRouter>
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading…</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/volunteers" element={<Volunteers />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
