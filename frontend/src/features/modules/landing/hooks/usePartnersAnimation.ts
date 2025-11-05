import type { RefObject } from "react";
import { useEffect } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/infrastructure/shared/lib/gsap";

export const usePartnersAnimation = (sectionRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element.querySelectorAll("[data-partner-logo]"),
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
          },
        },
      );
    }, element);

    return () => ctx.revert();
  }, [sectionRef]);
};
