import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { Button } from "@/infrastructure/shared/ui/button";
import type { HeroSlide } from "@/infrastructure/shared/data/landing";
import { useHeroTimeline } from "../hooks/useHeroTimeline";

interface HeroSectionProps {
  slides: HeroSlide[];
}

export const HeroSection = ({ slides }: HeroSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  useHeroTimeline(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="overview"
      className="relative flex min-h-[90vh] flex-col justify-end overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#0b1120] via-[#111a30] to-[#1b2751] text-white shadow-2xl"
    >
      <div className="absolute inset-0">
        <Swiper
          className="h-full"
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          slidesPerView={1}
          loop
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="flex h-full items-center justify-center bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.media})` }}
              >
                <div className="absolute inset-0 bg-black/55" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-24 pt-32 md:flex-row md:items-end md:justify-between md:px-10">
        <div className="max-w-3xl space-y-6">
          <span
            data-hero-badge
            className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium uppercase tracking-wide backdrop-blur"
          >
            {slides[activeSlide]?.badge}
          </span>
          <h1
            data-hero-title
            className="text-4xl font-extrabold leading-tight text-white drop-shadow-lg md:text-6xl"
          >
            {slides[activeSlide]?.title}
          </h1>
          <p data-hero-text className="text-lg text-white/80 md:text-xl">
            {slides[activeSlide]?.description}
          </p>
          <div data-hero-actions className="flex flex-wrap gap-4">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              البدء الآن
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20"
              asChild
            >
              <a
                href={slides[activeSlide]?.ctaVideo}
                data-fancybox
                data-caption={slides[activeSlide]?.title}
              >
                {slides[activeSlide]?.ctaLabel}
              </a>
            </Button>
          </div>
        </div>

        <div className="hidden max-w-xs space-y-4 rounded-3xl bg-white/10 p-6 backdrop-blur-lg md:block">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`rounded-2xl border p-4 transition ${
                index === activeSlide
                  ? "border-blue-400/60 bg-blue-500/10"
                  : "border-white/10 bg-black/40"
              }`}
            >
              <p className="text-sm text-white/70">{slide.badge}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">
                {slide.title}
              </h3>
              <p className="text-sm text-white/60">{slide.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
