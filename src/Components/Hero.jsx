import { memo } from "react";
import { useNavigate } from "react-router-dom";
import doctorImage from "../assets/hazem2.webp";
import Reveal from "./Reveal";

const trustItems = [
  "خبرة طويلة في تجميل وزراعة الأسنان",
  "تشخيص دقيق وخطة علاج واضحة",
  "حجز سريع وتواصل مباشر مع العيادة",
];

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      dir="rtl"
      className="premium-page premium-ambient relative isolate flex h-[100svh] max-h-[100svh] items-center overflow-hidden px-4 pb-1 pt-[5.7rem] sm:px-6 md:px-8 md:pt-[5.95rem] lg:px-12 lg:pt-[6.05rem]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02),transparent_36%)]" />

      <div className="relative mx-auto h-full w-full max-w-[76rem]">
        <div className="glass-card h-[calc(100svh-6.15rem)] max-h-[calc(100svh-6.15rem)] overflow-hidden rounded-[1.7rem] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.24)] sm:h-[calc(100svh-6.5rem)] sm:max-h-[calc(100svh-6.5rem)] sm:p-2.5 md:h-[calc(100svh-6.95rem)] md:max-h-[calc(100svh-6.95rem)] md:rounded-[1.9rem] md:p-3 lg:h-[calc(100svh-7.25rem)] lg:max-h-[calc(100svh-7.25rem)]">
          <div className="grid h-full items-stretch gap-2.5 lg:grid-cols-[1.2fr_0.8fr] xl:grid-cols-[1.16fr_0.84fr]">
            <Reveal
              disabled
              className="order-2 flex h-full flex-col justify-center rounded-[1.4rem] border border-[#d6bc6a]/14 bg-[linear-gradient(180deg,rgba(12,28,51,0.96),rgba(10,23,40,0.9))] px-4 py-5 text-right md:px-5 md:py-6 lg:order-1 lg:rounded-[1.6rem] lg:px-5 lg:py-6 xl:px-6 xl:py-7"
            >
              <span className="theme-pill w-fit rounded-full px-4 py-1.5 text-sm">
                ابتسامة صحية بتفاصيل علاجية دقيقة
              </span>

              <h1 className="mt-3 pb-1 text-[1.9rem] font-bold leading-[1.24] text-white md:text-[2.28rem] lg:text-[2.52rem] xl:text-[2.82rem]">
                <span className="block">نتائج طبيعية ولمسة</span>
                <span className="mt-1 block pb-1 text-[1.02em] font-extrabold tracking-[-0.01em] bg-[linear-gradient(135deg,#f7ebbe_0%,#d6bc6a_52%,#b48f39_100%)] bg-clip-text text-transparent">
                  تجميلية تليق بك
                </span>
              </h1>

              <p className="mt-3 max-w-[29rem] text-sm leading-7 text-slate-300 md:text-[14px] lg:max-w-[27rem] lg:text-[14px] lg:leading-7">
                تجميل وزراعة الأسنان بأحدث التقنيات العالمية وبخطة علاج واضحة من أول زيارة.
                <br />
                نهتم بالراحة، والدقة، والوصول إلى نتيجة متوازنة تحافظ على صحة الأسنان وشكل
                الابتسامة.
              </p>

              <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:justify-start">
                <button
                  onClick={() => navigate("/reservation")}
                  className="theme-button-primary inline-flex min-h-10.5 items-center justify-center rounded-full px-5.5 text-sm font-semibold md:text-[14px]"
                >
                  احجز الآن
                </button>

                <button
                  onClick={() =>
                    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="theme-button-secondary inline-flex min-h-10.5 items-center justify-center rounded-full px-5.5 text-sm font-semibold md:text-[14px]"
                >
                  استكشف الخدمات
                </button>
              </div>

              <div className="premium-grid mt-4 gap-2 sm:grid-cols-3">
                {trustItems.map((item) => (
                  <div
                    key={item}
                    className="glass-card rounded-[1rem] border border-[#d6bc6a]/14 bg-[#0c1c33]/82 px-3 py-2.5 text-xs leading-5 text-slate-200 md:text-[12px] md:leading-5"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal
              disabled
              className="relative order-1 min-h-[15rem] overflow-hidden rounded-[1.4rem] border border-white/8 bg-[#0b1d33] sm:min-h-[18rem] md:min-h-[20rem] lg:order-2 lg:min-h-0 lg:rounded-[1.6rem]"
            >
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#07111f]/72 via-[#07111f]/10 to-transparent" />
              <img
                src={doctorImage}
                alt="د. حازم"
                className="h-full w-full object-cover"
                style={{ objectPosition: "center 6%" }}
                width="760"
                height="920"
                fetchPriority="high"
                loading="eager"
                decoding="sync"
              />

              <div className="absolute inset-x-3 bottom-3 z-20 rounded-[1rem] border border-white/10 bg-[#07111f]/80 p-2.5 shadow-[0_12px_26px_rgba(0,0,0,0.2)] md:inset-x-4 md:bottom-4 md:rounded-[1.1rem] md:p-3">
                <p className="text-sm text-[#d6bc6a]">رعاية دقيقة للمريض</p>
                <p className="mt-1 text-sm font-semibold leading-5 text-white md:text-[14px]">
                  تجربة منظمة ونتائج متوازنة من أول زيارة
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default memo(Hero);
