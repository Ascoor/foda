import type { RefObject } from "react";
import { useEffect } from "react";
import { gsap, registerGsap, ScrollTrigger } from "@/infrastructure/shared/lib/gsap";

export const useTestimonialsAnimation = (
  sectionRef: RefObject<HTMLElement>,
) => {
  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    registerGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element.querySelectorAll("[data-testimonial]"),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.12,
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
