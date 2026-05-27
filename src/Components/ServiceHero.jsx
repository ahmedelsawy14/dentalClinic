import { CheckCircle2, Mail, PhoneCall } from "lucide-react";
import OptimizedImage from "./OptimizedImage";
import ServiceForm from "./ServiceForm";
import { makeSrcSet } from "./imageSrcSet";

function ServiceHero({ service }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#d8c897]/20 bg-[linear-gradient(135deg,#081526_0%,#10233d_54%,#15365b_100%)] text-white shadow-[0_28px_80px_rgba(9,24,45,0.18)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(183,154,68,0.3),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_26%)]" />

      <div className="relative grid gap-6 p-5 md:p-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-center xl:gap-8 xl:p-8">
        <div className="order-2 space-y-5 xl:order-1">
          <div className="inline-flex rounded-full border border-[#d8c897]/20 bg-white/[0.08] px-4 py-2 text-sm font-semibold text-[#f1e0a6] backdrop-blur">
            {service.hero.badge}
          </div>

          <div className="space-y-4 text-right">
            <p className="text-sm font-semibold tracking-[0.2em] text-[#f1d784]">
              {service.hero.eyebrow}
            </p>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl xl:text-[3rem]">
              {service.title}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-slate-100 md:text-base">
              {service.summary}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {(service.highlights || []).map((item) => (
              <div
                key={item}
                className="rounded-[1.35rem] border border-[#d8c897]/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-4 py-3.5 text-right text-sm leading-6 text-slate-100 backdrop-blur"
              >
                <div className="mb-2 flex justify-end text-[#d8c897]">
                  <CheckCircle2 size={17} />
                </div>
                {item}
              </div>
            ))}
          </div>

          <div className="grid gap-4 rounded-[1.5rem] border border-[#d8c897]/15 bg-[linear-gradient(180deg,rgba(183,154,68,0.1),rgba(255,255,255,0.03))] p-4 md:grid-cols-[1fr_auto] md:items-center">
            <div className="text-right">
              <p className="text-sm text-slate-200">
                نراجع الحالة، نوضح الخطة، ونرتب التواصل مباشرة عبر واتساب.
              </p>
              <div className="mt-4 flex flex-wrap justify-end gap-4 text-sm text-slate-100">
                <span className="inline-flex items-center gap-2">
                  <PhoneCall size={16} className="text-[#d8c897]" />
                  {service.contact.phone}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Mail size={16} className="text-[#d8c897]" />
                  {service.contact.email}
                </span>
              </div>
            </div>

            <div className="relative hidden overflow-hidden rounded-[1.35rem] border border-white/10 bg-slate-900/30 xl:block">
              <OptimizedImage
                src={service.heroImage}
                alt={service.title}
                width={1000}
                height={760}
                srcSet={makeSrcSet(service.heroImage, [640, 900, 1200, 1400])}
                sizes="(max-width: 1279px) 100vw, 28vw"
                priority
                loading="eager"
                placeholderColor="#0f2744"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="order-1 xl:order-2">
          <ServiceForm service={service} />
        </div>
      </div>
    </section>
  );
}

export default ServiceHero;
