import type { RefObject } from "react";
import { useEffect } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/infrastructure/shared/lib/gsap";

export const useFeatureTreeAnimation = (sectionRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element.querySelectorAll("[data-tree-node]"),
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: element,
            start: "top 70%",
          },
        },
      );

      gsap.fromTo(
        element.querySelectorAll("[data-tree-link]"),
        { strokeDasharray: 260, strokeDashoffset: 260 },
        {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: element,
            start: "top 70%",
          },
        },
      );
    }, element);

    return () => ctx.revert();
  }, [sectionRef]);
};
