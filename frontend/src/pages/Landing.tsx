import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import { heroSlides, testimonials, partners, featureTree } from "@/data/landing";
import { HeroSection } from "@/modules/landing/components/HeroSection";
import { LoginCtaSection } from "@/modules/landing/components/LoginCtaSection";
import { FeatureTreeSection } from "@/modules/landing/components/FeatureTreeSection";
import { TestimonialsSection } from "@/modules/landing/components/TestimonialsSection";
import { PartnersSection } from "@/modules/landing/components/PartnersSection";
import { useFancybox } from "@/hooks/useFancybox";

export default function LandingPage() {
  useFancybox();

  return (
    <div
      data-barba="container"
      data-barba-namespace="landing"
      className="min-h-screen bg-gradient-to-b from-[#040812] via-[#050a16] to-[#020410] text-white"
    >
      <HeroSection slides={heroSlides} />
      <LoginCtaSection />
      <FeatureTreeSection tree={featureTree} />
      <TestimonialsSection testimonials={testimonials} />
      <PartnersSection partners={partners} />

      <footer className="border-t border-white/10 bg-[#030711] py-6 text-center text-sm text-white/60">
        © {new Date().getFullYear()} منصة إدارة الانتخابات. جميع الحقوق محفوظة.
      </footer>
    </div>
  );
}
