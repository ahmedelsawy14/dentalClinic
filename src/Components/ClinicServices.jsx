import { memo } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ResponsiveImage from "./ResponsiveImage";
import { makeSrcSet } from "./imageSrcSet";
import Reveal from "./Reveal";
import services from "../data/services";

const highlights = [
  "خطة علاج واضحة من أول زيارة",
  "أجهزة حديثة وتعقيم دقيق",
  "نتيجة جمالية ووظيفية معًا",
];

function ClinicServices() {
  return (
    <section
      dir="rtl"
      className="section-shell border-y border-white/8 bg-[#081423]"
    >
      <div className="section-container">
        <Reveal
          className="glass-card overflow-hidden rounded-[2.15rem] px-6 py-10 text-white shadow-[0_24px_62px_rgba(0,0,0,0.2)] md:px-10 md:py-11 lg:px-14 lg:py-12"
        >
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div className="text-right">
              <span className="theme-pill rounded-full px-4 py-2 text-sm">
                خدمات متكاملة داخل العيادة
              </span>
              <h2 className="mt-5 max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl">
                خدمات مصممة لتمنحك راحة وثقة من أول زيارة
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 md:text-base">
                هنا ستجد الخدمات الأساسية والتجميلية داخل تجربة مرتبة وواضحة، بحيث يكون
                الوصول للخدمة والحجز أسهل وأسرع.
              </p>
            </div>

            <div className="premium-grid gap-3">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.4rem] border border-[#d6bc6a]/18 bg-[#10233d]/74 px-4 py-4 text-right text-sm leading-7 text-slate-200 shadow-[0_10px_30px_rgba(3,10,19,0.12)] transition duration-300 hover:-translate-y-1 hover:border-[#d6bc6a]/34 hover:bg-[#122b49]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="premium-grid mt-12 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 55}>
              <article className="glass-card glass-card-hover group overflow-hidden rounded-[2rem] shadow-[0_18px_46px_rgba(0,0,0,0.18)]">
                <Link to={`/services/${service.slug}`} className="flex h-full flex-col">
                  <div className="relative overflow-hidden">
                    <ResponsiveImage
                      src={service.cardImage || service.heroImage}
                      alt={service.title}
                      width={1200}
                      height={800}
                      srcSet={makeSrcSet(service.cardImage || service.heroImage, [400, 600, 900])}
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      priority={index < 3}
                      loading={index < 3 ? "eager" : "lazy"}
                      className="scale-100 transition duration-500 group-hover:scale-[1.02]"
                      wrapperClassName="min-h-[17.5rem]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/92 via-[#10233d]/22 to-transparent" />

                    <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                      <span className="rounded-full border border-[#d6bc6a]/25 bg-[#d6bc6a]/12 px-3 py-1 text-xs font-semibold text-[#f3df9b]">
                        {service.label}
                      </span>
                      <span className="rounded-full border border-[#d6bc6a]/25 bg-white/8 px-3 py-1 text-xs text-[#f8efc7]">
                        0{index + 1}
                      </span>
                    </div>

                    <div className="absolute inset-x-5 bottom-5 text-right text-white">
                      <h3 className="text-2xl font-bold leading-tight">{service.title}</h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6 text-right md:p-7">
                    <p className="text-sm leading-7.5 text-slate-300">{service.desc}</p>

                    <div className="mt-7 flex items-center justify-between gap-4 border-t border-white/10 pt-4.5">
                      <span className="text-xs font-medium text-[#d6bc6a]">استشارة وحجز بسهولة</span>

                      <span className="inline-flex items-center gap-2 rounded-full border border-[#d6bc6a]/22 bg-[#d6bc6a]/10 px-4 py-2.5 text-sm font-medium text-[#f8efc7] transition group-hover:border-[#d6bc6a]/35 group-hover:bg-[#d6bc6a]/16">
                        احجز الآن
                        <ArrowLeft size={16} className="rtl-rotate" />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(ClinicServices);
