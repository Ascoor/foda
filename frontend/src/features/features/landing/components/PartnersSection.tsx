import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Partner } from "@/infrastructure/shared/data/landing";
import { usePartnersAnimation } from "../hooks/usePartnersAnimation";

interface PartnersSectionProps {
  partners: Partner[];
}

export const PartnersSection = ({ partners }: PartnersSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  usePartnersAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="partners"
      className="bg-[#050b16] px-4 pb-16 pt-12 text-white/80"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10">
        <div className="text-center">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-blue-200">
            شركاء النجاح
          </span>
          <p className="mt-4 text-sm text-white/60">
            منصات تحليلية ومؤسسات مراقبة انتخابية تثق في حلولنا.
          </p>
        </div>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop
          slidesPerView={2}
          spaceBetween={24}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 },
          }}
          className="w-full"
        >
          {partners.map((partner) => (
            <SwiperSlide key={partner.id} className="flex justify-center">
              <div
                data-partner-logo
                className="flex h-24 w-36 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
