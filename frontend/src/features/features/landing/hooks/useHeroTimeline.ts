import type { RefObject } from "react";
import { useEffect } from "react";
import { gsap, registerGsap } from "@/infrastructure/shared/lib/gsap";

export const useHeroTimeline = (sectionRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    registerGsap();

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { duration: 0.9, ease: "power3.out" },
      });

      timeline.fromTo(
        "[data-hero-badge]",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1 },
      );

      timeline.fromTo(
        "[data-hero-title]",
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.6",
      );

      timeline.fromTo(
        "[data-hero-text]",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.7",
      );

      timeline.fromTo(
        "[data-hero-actions]",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1 },
        "-=0.5",
      );
    }, element);

    return () => ctx.revert();
  }, [sectionRef]);
};
