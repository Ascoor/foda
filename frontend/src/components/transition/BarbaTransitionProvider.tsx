import type { PropsWithChildren } from "react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";

type BarbaInstance = typeof import("@barba/core")["default"] | null;

export const BarbaTransitionProvider = ({ children }: PropsWithChildren) => {
  const location = useLocation();
  const barbaRef = useRef<BarbaInstance>(null);
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    let isMounted = true;

    if (typeof window === "undefined") {
      return undefined;
    }

    const setup = async () => {
      const module = await import("@barba/core");
      if (!isMounted) return;

      const barba = module.default;

      if (!barba) return;

      barba.init({
        transitions: [
          {
            name: "fade-slide",
            leave: ({ current }) =>
              gsap.to(current.container, {
                opacity: 0,
                x: -40,
                duration: 0.45,
                ease: "power2.out",
              }),
            enter: ({ next }) => {
              gsap.set(next.container, { opacity: 0, x: 40 });
              return gsap.to(next.container, {
                opacity: 1,
                x: 0,
                duration: 0.55,
                ease: "power2.out",
              });
            },
          },
        ],
      });

      barbaRef.current = barba;
      lastPathRef.current = window.location.pathname + window.location.search;
    };

    setup();

    return () => {
      isMounted = false;
      barbaRef.current?.destroy?.();
      barbaRef.current = null;
    };
  }, []);

  useEffect(() => {
    const barba = barbaRef.current;
    const path = location.pathname + location.search;

    if (!barba) {
      const container = document.querySelector<HTMLElement>("[data-barba=\"container\"]");
      if (container) {
        gsap.fromTo(
          container,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }
        );
      }
      return;
    }

    if (lastPathRef.current === path) return;

    lastPathRef.current = path;

    barba.go(path).catch(() => {
      const container = document.querySelector<HTMLElement>("[data-barba=\"container\"]");
      if (container) {
        gsap.fromTo(
          container,
          { opacity: 0, x: 40 },
          { opacity: 1, x: 0, duration: 0.45, ease: "power2.out" }
        );
      }
    });
  }, [location]);

  return <div data-barba="wrapper">{children}</div>;
};
