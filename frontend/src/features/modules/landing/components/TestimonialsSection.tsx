import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Testimonial } from "@/infrastructure/shared/data/landing";
import { useTestimonialsAnimation } from "../hooks/useTestimonialsAnimation";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection = ({
  testimonials,
}: TestimonialsSectionProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  useTestimonialsAnimation(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="mt-24 bg-[#0b1224] px-4 py-24 text-white"
    >
      <div className="mx-auto max-w-4xl text-center">
        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.3em] text-blue-200">
          ثقة القيادات
        </span>
        <h2 className="mt-6 text-3xl font-bold md:text-4xl">
          آراء الحملات التي نجحنا في خدمتها
        </h2>
      </div>

      <div className="mx-auto mt-12 max-w-5xl">
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          autoplay={{ delay: 6500, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          breakpoints={{
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
          }}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <article
                data-testimonial
                className="h-full rounded-3xl border border-white/10 bg-white/5 p-8 text-left backdrop-blur"
              >
                <p className="text-lg leading-8 text-white/85">
                  “{testimonial.quote}”
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="h-14 w-14 rounded-full border border-white/30 object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {testimonial.author}
                    </h3>
                    <p className="text-sm text-white/60">{testimonial.role}</p>
                  </div>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
