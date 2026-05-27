import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, ImageOff, ImagePlus, Sparkles } from "lucide-react";
import BeforeAfterCard from "../Components/BeforeAfterCard";
import ErrorBoundary from "../Components/ErrorBoundary";
import Seo from "../Components/Seo";
import SectionHeading from "../Components/about/SectionHeading";
import { siteConfig } from "../config/site";
import { getCases } from "../services/casesService";

const MotionArticle = motion.article;
const MotionDiv = motion.div;

const galleryHighlights = [
  {
    icon: BadgeCheck,
    title: "نتائج واضحة وموثقة",
    description: "حالات حقيقية توضح الفرق بشكل مباشر، مع عرض مرتب يساعد على قراءة النتيجة بسهولة.",
  },
  {
    icon: ImagePlus,
    title: "مقارنة سريعة ومريحة",
    description: "تنسيق بصري هادئ يجعل ملاحظة التغير أسهل، بدون ازدحام أو تشتيت داخل الصفحة.",
  },
  {
    icon: Sparkles,
    title: "عرض متناسق مع الهوية",
    description: "نفس الأسلوب الهادئ للموقع حتى تبقى التجربة متوازنة وواضحة في كل التفاصيل.",
  },
];

function Gallery() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    getCases()
      .then((data) => setCases(data))
      .catch(() => setCases([]));
  }, []);

  return (
    <>
      <Seo
        title={`الحالات السابقة | ${siteConfig.siteName}`}
        description="شاهد حالات قبل وبعد من عيادة د. حازم سلطان مع عرض واضح ومرتب للنتائج."
        url={typeof window !== "undefined" ? `${window.location.origin}/gallery` : "/gallery"}
      />
      <main dir="rtl" className="overflow-hidden bg-[#07111f] text-white">
        <section className="relative isolate border-b border-white/10 px-6 pb-14 pt-30 md:px-10 lg:px-16 lg:pb-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,188,106,0.16),transparent_28%),radial-gradient(circle_at_left_center,rgba(30,64,111,0.35),transparent_34%),linear-gradient(180deg,#07111f_0%,#091729_52%,#0b1d33_100%)]" />
          <div className="absolute right-[8%] top-24 h-44 w-44 rounded-full bg-[#d6bc6a]/10 blur-3xl" />
          <div className="absolute left-[6%] top-36 h-56 w-56 rounded-full bg-[#23456c]/18 blur-3xl" />

          <div className="relative mx-auto max-w-7xl">
            <div className="glass-card rounded-[2.2rem] p-7 md:p-10">
              <MotionDiv
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.5 }}
              >
                <SectionHeading
                  eyebrow="BEFORE & AFTER"
                  title="نتائج قبل وبعد توضح الفرق بوضوح"
                  description="مجموعة من الحالات التي تعرض التغير بشكل مباشر ومرتب، حتى تكون المقارنة أسهل والانطباع أكثر ثقة وراحة."
                />
              </MotionDiv>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {galleryHighlights.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <MotionArticle
                      key={item.title}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.25 }}
                      transition={{ duration: 0.5, delay: index * 0.06 }}
                      className="group relative overflow-hidden rounded-[1.7rem] border border-[#d6bc6a]/20 bg-white/[0.04] p-5 text-right shadow-[0_18px_46px_rgba(3,10,22,0.2)] transition duration-300 hover:-translate-y-1.5 hover:border-[#d6bc6a]/45 hover:bg-[#11284a]/95"
                    >
                      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-[#d6bc6a] to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                      <span className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-[#d6bc6a]/24 bg-[#d6bc6a]/10 text-[#e6d08a]">
                        <Icon size={18} />
                      </span>
                      <h3 className="mt-4 text-base font-bold text-white">{item.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-slate-300">{item.description}</p>
                    </MotionArticle>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#081423] px-6 py-16 md:px-10 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-right">
              <SectionHeading
                eyebrow="CASE GALLERY"
                title="حالات قبل وبعد"
                description="اكتشف كيف تصنع التفاصيل الدقيقة فرقًا واضحًا في الابتسامة، من خلال حالات قبل وبعد تعرض النتيجة بشكل جذاب وواثق."
              />
            </div>

            {cases.length ? (
              <ErrorBoundary
                compact
                fallbackTitle="تعذر عرض الحالات"
                fallbackDescription="حدثت مشكلة أثناء قراءة الحالات المحفوظة. يمكنك تحديث الصفحة أو إعادة المحاولة لاحقًا."
              >
                <div className="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {cases.map((caseItem) => (
                    <div key={caseItem.id} className="w-full">
                      <div className="mx-auto w-full max-w-[22rem] xl:max-w-[21rem] 2xl:max-w-[18.5rem]">
                        <BeforeAfterCard
                          before={caseItem.beforeImage}
                          after={caseItem.afterImage}
                          title={caseItem.title}
                          aspectRatio="5 / 4"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ErrorBoundary>
            ) : (
              <div className="glass-card rounded-[2rem] p-8 text-center text-white md:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-[#d6bc6a]/20 bg-[#d6bc6a]/10 text-[#eedda3]">
                  <ImageOff size={26} />
                </div>
                <h3 className="mt-5 text-2xl font-bold">لا توجد حالات معروضة الآن</h3>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                  أضف الحالات من لوحة التحكم، وستظهر هنا مباشرة بشكل تلقائي.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

export default Gallery;
