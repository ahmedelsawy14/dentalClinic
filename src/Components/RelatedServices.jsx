import { ArrowLeft, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import OptimizedImage from "./OptimizedImage";
import { makeSrcSet } from "./imageSrcSet";

function RelatedServices({ services = [] }) {
  return (
    <aside className="space-y-6 xl:sticky xl:top-28">
      <div className="rounded-[2rem] border border-[#ddcfaa] bg-[linear-gradient(135deg,#0c1d33_0%,#10233d_60%,#173a60_100%)] p-6 text-right text-white shadow-[0_22px_55px_rgba(16,35,61,0.14)]">
        <p className="text-sm font-semibold tracking-[0.2em] text-[#f0d98e]">خدمات مقترحة</p>
        <h2 className="mt-3 text-2xl font-bold">قد تناسبك أيضًا</h2>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          اختر خدمة مرتبطة بخطتك العلاجية أو تصفح خيارًا آخر يناسب احتياجك الحالي.
        </p>
      </div>

      {services.map((service) => (
        <article
          key={service.slug}
          className="group overflow-hidden rounded-[2rem] border border-[#d8c897]/18 bg-white/[0.05] shadow-[0_24px_70px_rgba(0,0,0,0.18)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#d8c897]/34 hover:shadow-[0_28px_70px_rgba(0,0,0,0.24)]"
        >
          <Link to={`/services/${service.slug}`} className="block">
            <div className="relative overflow-hidden">
              <OptimizedImage
                src={service.cardImage || service.heroImage}
                alt={service.title}
                width={900}
                height={640}
                srcSet={makeSrcSet(service.cardImage || service.heroImage, [480, 720, 900])}
                sizes="(max-width: 1280px) 100vw, 24vw"
                placeholderColor="#132844"
                className="transition duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#10233d]/72 via-transparent to-transparent" />
              <span className="absolute right-4 top-4 rounded-full border border-[#d8c897]/30 bg-[#b79a44]/90 px-3 py-1 text-xs font-semibold text-white">
                {service.label}
              </span>
            </div>

            <div className="space-y-4 p-5 text-right">
              <h3 className="text-xl font-bold text-white">{service.title}</h3>
              <p className="text-sm leading-7 text-slate-300">{service.description}</p>
              <div className="flex items-center justify-between border-t border-white/10 pt-4 text-sm font-semibold text-white">
                <span className="inline-flex items-center gap-2 text-[#f0d98e]">
                  <PhoneCall size={15} />
                  استشارة سريعة
                </span>
                <span className="inline-flex items-center gap-2 transition group-hover:text-[#f0d98e]">
                  عرض الخدمة
                  <ArrowLeft size={16} />
                </span>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </aside>
  );
}

export default RelatedServices;
