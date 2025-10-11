import type { Context } from "gsap";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let isRegistered = false;

export const registerGsap = () => {
  if (typeof window === "undefined" || isRegistered) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  isRegistered = true;
};

export { gsap, ScrollTrigger };

export type GsapContext = Context;
