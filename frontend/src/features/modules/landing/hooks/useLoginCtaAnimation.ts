import type { RefObject } from "react";
import { useEffect } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/infrastructure/shared/lib/gsap";

export const useLoginCtaAnimation = (sectionRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element.querySelector("[data-login-card]"),
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 75%",
          },
        },
      );
    }, element);

    return () => ctx.revert();
  }, [sectionRef]);
};
