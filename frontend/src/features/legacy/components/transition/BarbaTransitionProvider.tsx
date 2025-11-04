import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { useLanguage } from "@/infrastructure/shared/contexts/LanguageContext";

export const BarbaTransitionProvider = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const { direction } = useLanguage();
  const prefersReducedMotion = useRef(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      prefersReducedMotion.current = mediaQuery.matches;
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const container = document.querySelector<HTMLElement>(
      "[data-barba='container']",
    );
    if (!container) {
      return;
    }

    if (prefersReducedMotion.current) {
      gsap.set(container, { opacity: 1, x: 0, y: 0, clearProps: "filter" });
      isFirstRender.current = false;
      return;
    }

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const horizontalOffset = isMobile ? 0 : direction === "rtl" ? 32 : -32;
    const verticalOffset = isMobile ? 28 : 12;

    const fromVars = {
      opacity: isFirstRender.current ? 0.7 : 0,
      x: horizontalOffset,
      y: verticalOffset,
      filter: "blur(14px)",
    };

    const toVars: gsap.TweenVars = {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      ease: "power3.out",
      duration: isFirstRender.current ? 0.36 : 0.48,
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(container, fromVars, toVars);
    }, container);

    isFirstRender.current = false;

    return () => ctx.revert();
  }, [location.pathname, location.search, direction]);

  return <div data-barba="wrapper">{children}</div>;
};
