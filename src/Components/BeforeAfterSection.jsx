import { memo } from "react";
import { useNavigate } from "react-router-dom";
import BeforeAfterCard from "./BeforeAfterCard";
import Reveal from "./Reveal";

import B6 from "../assets/B&A/B6.webp";
import A6 from "../assets/B&A/A6.webp";
import B4 from "../assets/B&A/B4.webp";
import A4 from "../assets/B&A/A4.webp";
import B5 from "../assets/B&A/B5.webp";
import A5 from "../assets/B&A/A5.webp";
import B7 from "../assets/B&A/B7.webp";
import A7 from "../assets/B&A/A7.webp";

const cases = [
  { before: B6, after: A6, title: "تبييض الأسنان" },
  { before: B4, after: A4, title: "زراعة الأسنان" },
  { before: B5, after: A5, title: "هوليوود سمايل" },
  { before: B7, after: A7, title: "الحشوات التجميلية" },
];

function BeforeAfterSection() {
  const navigate = useNavigate();

  return (
    <section dir="rtl" className="section-shell bg-[#07111f]">
      <div className="section-container">
        <Reveal
          className="glass-card mb-12 rounded-[2.15rem] p-6 text-right text-white shadow-[0_22px_58px_rgba(0,0,0,0.18)] md:p-8 lg:p-10"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <span className="theme-pill rounded-full px-4 py-2 text-sm font-semibold">
                نتائج حقيقية من حالات داخل العيادة
              </span>
              <h2 className="mt-5 max-w-2xl text-3xl font-bold leading-tight text-white md:text-4xl">
                مقارنة قبل وبعد العلاج لتوضيح الفرق بشكل سريع وواضح
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-300 md:text-base">
                سحب بسيط على الصورة يكشف النتيجة مباشرة بدون تعقيد، وهو أسلوب مناسب لعرض
                حالات التجميل والزراعة والتبييض.
              </p>
            </div>

            <button
              onClick={() => navigate("/gallery")}
              className="theme-button-primary self-start rounded-full px-7 py-3 text-sm font-semibold"
            >
              مشاهدة المزيد من الحالات
            </button>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cases.map((item) => (
            <Reveal key={`${item.before}-${item.after}`} disabled className="w-full">
              <BeforeAfterCard
                before={item.before}
                after={item.after}
                title={item.title}
                className="mx-auto w-full max-w-[18rem] xl:max-w-[16.2rem]"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(BeforeAfterSection);
