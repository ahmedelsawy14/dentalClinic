import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Award,
  BadgeCheck,
  CalendarHeart,
  Clock3,
  Gem,
  Microscope,
  ShieldCheck,
  SmilePlus,
  Sparkles,
  Stethoscope,
  Syringe,
  Trophy,
  Users,
} from "lucide-react";
import Seo from "../Components/Seo";
import FeatureCard from "../Components/about/FeatureCard";
import SectionHeading from "../Components/about/SectionHeading";
import StatCard from "../Components/about/StatCard";
import TimelineCard from "../Components/about/TimelineCard";
import doctorImage from "../assets/hazem3.webp";
import { siteConfig } from "../config/site";
import { buildWhatsAppUrl } from "../utils/whatsapp";

const MotionDiv = motion.div;

const profileHighlights = [
  { label: "سنوات الخبرة", value: "10+" },
  { label: "التخصص", value: "زراعة وتجميل الأسنان" },
  { label: "الاعتمادات", value: "محلية ودولية" },
];

const achievementStats = [
  {
    icon: Trophy,
    value: "+5000",
    label: "حالة ناجحة",
    detail:
      "خبرة عملية ممتدة في العلاج التحفظي، التجميل، وخطط العلاج الدقيقة المناسبة لكل حالة.",
  },
  {
    icon: Clock3,
    value: "10+",
    label: "سنوات خبرة",
    detail:
      "10 سنوات خبرة في طب الأسنان التحفظي مع اهتمام واضح بالدقة والراحة والنتائج الطبيعية.",
  },
  {
    icon: Award,
    value: "3",
    label: "اعتمادات أكاديمية",
    detail:
      "عضويات وشهادات مهنية من مؤسسات أكاديمية في أيرلندا وإيطاليا وجامعة المنصورة.",
  },
  {
    icon: Microscope,
    value: "Modern",
    label: "تقنيات حديثة",
    detail:
      "اعتماد على تقنيات علاجية حديثة تمنح تشخيصًا أوضح وتجربة أكثر راحة للمريض.",
  },
];

const qualifications = [
  {
    year: "MFD",
    title: "Membership of Royal College in Dublin - Ireland",
    description:
      "اعتماد مهني يعكس مستوى أكاديمي متقدم واهتمامًا مستمرًا بأعلى المعايير الطبية الحديثة.",
  },
  {
    year: "Italy",
    title: "Membership of Genova University in Cosmetic Dentistry",
    description:
      "عضوية متخصصة تدعم الخبرة في تجميل الأسنان وتصميم الابتسامة بنتائج طبيعية ومتوازنة.",
  },
  {
    year: "Mansoura",
    title: "Master of Conservative Dentistry - Mansoura University, Egypt",
    description:
      "تخصص أكاديمي متقدم في طب الأسنان التحفظي مع تركيز على الدقة العلاجية والحفاظ على الأسنان الطبيعية.",
  },
];

const whyChooseUs = [
  {
    icon: Microscope,
    title: "أحدث الأجهزة الطبية",
    description:
      "تقنيات تشخيص وعلاج حديثة تمنحنا دقة أعلى وتجربة أكثر راحة للمريض.",
  },
  {
    icon: Syringe,
    title: "علاج بأقل ألم ممكن",
    description:
      "نهتم بالتفاصيل التي تجعل الجلسة هادئة ومطمئنة من البداية وحتى نهاية العلاج.",
  },
  {
    icon: ShieldCheck,
    title: "تعقيم كامل",
    description:
      "معايير صارمة في التعقيم والسلامة للحفاظ على بيئة علاجية موثوقة وآمنة.",
  },
  {
    icon: SmilePlus,
    title: "نتائج طبيعية",
    description:
      "نصمم الابتسامة بما ينسجم مع ملامح الوجه ليبدو الشكل راقيًا وطبيعيًا.",
  },
  {
    icon: Users,
    title: "فريق محترف",
    description:
      "تنسيق متكامل بين الخبرة الطبية والاهتمام الحقيقي بالمريض في كل خطوة.",
  },
];

const experiencePillars = [
  {
    icon: Gem,
    title: "بيئة مريحة وهادئة",
    description:
      "تصميم داخلي منظم واستقبال سلس يمنح المريض شعورًا بالخصوصية والطمأنينة.",
  },
  {
    icon: Sparkles,
    title: "عناية شخصية دقيقة",
    description:
      "كل خطة علاجية تُبنى وفق حالة المريض واحتياجه الحقيقي دون حلول عامة جاهزة.",
  },
  {
    icon: CalendarHeart,
    title: "متابعة بعد العلاج",
    description:
      "اهتمام مستمر بالنتيجة النهائية والتأكد من ثبات الراحة والجمال على المدى الطويل.",
  },
];

function About() {
  const whatsappUrl = buildWhatsAppUrl({
    phone: siteConfig.phoneDigits,
    serviceTitle: "استشارة عن خدمات العيادة",
    message: "أرغب في حجز موعد والاستفسار عن أفضل خطة علاجية مناسبة لي.",
  });

  return (
    <>
      <Seo
        title={`من نحن | ${siteConfig.siteName}`}
        description="تعرّف على د. حازم سلطان وخبراته واعتماداته في زراعة وتجميل الأسنان داخل تجربة طبية راقية وآمنة."
        keywords={[
          "من نحن",
          "دكتور حازم سلطان",
          "زراعة الأسنان",
          "تجميل الأسنان",
          "طب الأسنان التحفظي",
        ]}
      />

      <main className="overflow-hidden bg-[#07111f] text-white">
        <section className="about-hero relative isolate flex items-center border-b border-white/10 px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,188,106,0.18),transparent_28%),radial-gradient(circle_at_left_center,rgba(30,64,111,0.35),transparent_34%),linear-gradient(180deg,#07111f_0%,#091729_52%,#0b1d33_100%)]" />
          <div className="absolute right-[8%] top-28 h-44 w-44 rounded-full bg-[#d6bc6a]/12 blur-3xl" />
          <div className="absolute left-[6%] top-40 h-56 w-56 rounded-full bg-[#23456c]/25 blur-3xl" />

          <div className="about-hero-grid relative mx-auto grid w-full max-w-7xl items-stretch">
            <div className="about-hero-media relative h-full">
              <div className="absolute -left-6 top-10 hidden h-24 w-24 rounded-full border border-[#d6bc6a]/30 bg-[#d6bc6a]/10 blur-sm md:block" />
              <div className="absolute -right-6 bottom-10 hidden h-32 w-32 rounded-full border border-[#d6bc6a]/20 bg-[#183457]/50 blur-2xl md:block" />

              <div className="about-hero-media-shell relative h-full overflow-hidden rounded-[32px] border border-[#d6bc6a]/22 bg-white/[0.035] p-2.5 shadow-[0_30px_90px_rgba(0,0,0,0.32)] backdrop-blur-sm md:rounded-[36px]">
                <img
                  src={doctorImage}
                  alt="الدكتور حازم سلطان"
                  width="900"
                  height="1080"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  className="about-hero-image block w-full rounded-[26px] object-cover object-top md:rounded-[30px]"
                />

                <div className="about-hero-media-caption absolute inset-x-3 bottom-3 rounded-[20px] border border-white/10 bg-[#07111f]/40 p-3 backdrop-blur-md md:inset-x-4 md:bottom-4 md:rounded-[22px] md:p-3.5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="text-right">
                      <p className="text-sm text-[#d6bc6a]">رعاية راقية بتفاصيل دقيقة</p>
                      <p className="mt-1.5 text-base font-semibold text-white">
                        رسالتنا أن تشعر بالأمان قبل العلاج وبعده
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d6bc6a]/30 bg-[#d6bc6a]/12 text-[#f3df9b]">
                      <BadgeCheck size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-hero-content flex h-full flex-col justify-center overflow-hidden rounded-[34px] border border-[#d6bc6a]/18 bg-white/[0.04] text-right shadow-[0_30px_90px_rgba(0,0,0,0.24)] backdrop-blur-sm">
              <p className="text-xs font-semibold tracking-[0.35em] text-[#d6bc6a] md:text-sm">
                DOCTOR PROFILE
              </p>
              <h1 className="mt-2 text-[1.9rem] font-bold leading-[1.04] text-white md:text-[2.35rem] lg:text-[2.45rem] xl:text-[2.65rem]">
                د. حازم سلطان
              </h1>
              <p className="mt-1.5 text-[0.94rem] font-medium text-[#f1da97] md:text-[0.98rem] lg:text-[1rem]">
                استشاري زراعة وتجميل الأسنان
              </p>
              <p className="about-hero-lead mt-3 text-sm leading-6.5 text-slate-300 md:text-[14px] md:leading-7 lg:text-[15px] lg:leading-7.5">
                يقدم د. حازم رؤية علاجية متوازنة تجمع بين الدقة الطبية واللمسة الجمالية
                الهادئة، مع اهتمام واضح براحة المريض وشرح الخطة العلاجية بشفافية في كل
                مرحلة.
              </p>

              <div className="about-hero-highlights mt-3.5 grid gap-2 sm:grid-cols-3">
                {profileHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex min-h-[4.15rem] flex-col justify-center rounded-[16px] border border-[#d6bc6a]/15 bg-[#0e213d]/95 p-2.5"
                  >
                    <p className="text-xs text-slate-400 md:text-sm">{item.label}</p>
                    <p className="mt-1 text-sm font-semibold text-white md:text-base">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="about-hero-details mt-3.5 grid gap-2 md:grid-cols-2">
                <div className="flex h-full flex-col rounded-[16px] border border-[#d6bc6a]/15 bg-[#0c1c33]/96 p-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-white">التخصص</h3>
                    <Stethoscope className="text-[#d6bc6a]" size={18} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    زراعة الأسنان، التجميل، التركيبات التجميلية، وخطط علاجية مخصصة للحالات
                    المختلفة.
                  </p>
                </div>

                <div className="flex h-full flex-col rounded-[16px] border border-[#d6bc6a]/15 bg-[#0c1c33]/96 p-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-base font-semibold text-white">الاعتمادات</h3>
                    <Award className="text-[#d6bc6a]" size={18} />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    عضويات وشهادات مهنية محلية ودولية مع خبرة 10 سنوات في طب الأسنان التحفظي.
                  </p>
                </div>
              </div>

              <div className="about-hero-actions mt-3.5 flex flex-wrap justify-center gap-2">
                <Link
                  to="/reservation"
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d6bc6a] px-7 text-sm font-semibold text-[#091729] shadow-[0_12px_30px_rgba(214,188,106,0.22)] transition hover:-translate-y-0.5 hover:bg-[#e7cf83]"
                >
                  احجز الآن
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#d6bc6a]/28 bg-white/[0.045] px-7 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-[#d6bc6a] hover:bg-white/[0.09]"
                >
                  تواصل عبر الواتساب
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#081423] px-6 py-16 md:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="ACHIEVEMENTS"
              title="أرقام وخبرات تعكس مستوى الرعاية"
              description="خبرة أكاديمية وعملية تدعم تقديم علاج دقيق وراقٍ ومصمم بعناية لراحة المريض ونتيجته النهائية."
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {achievementStats.map((item, index) => (
                <StatCard key={item.label} {...item} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr]">
            <SectionHeading
              eyebrow="QUALIFICATIONS"
              title="المؤهلات والشهادات المهنية"
              description="اعتمادات أكاديمية ومهنية تعكس التزامًا مستمرًا بالتطوير العلمي وتقديم رعاية علاجية على مستوى متقدم."
            />

            <div className="relative space-y-5 before:absolute before:right-[0.15rem] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-[#d6bc6a]/10 before:via-[#d6bc6a]/50 before:to-transparent">
              {qualifications.map((item, index) => (
                <TimelineCard key={`${item.year}-${item.title}`} {...item} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/8 bg-[#091728] px-6 py-16 md:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="WHY CHOOSE US"
              title="لماذا يختارنا المرضى؟"
              description="لأن التجربة الطبية هنا لا تعتمد فقط على العلاج، بل على التفاصيل التي تجعل المريض مطمئنًا وواثقًا في كل زيارة."
              align="center"
            />

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {whyChooseUs.map((item, index) => (
                <FeatureCard key={item.title} {...item} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 md:px-10 lg:px-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-stretch">
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.65 }}
            >
              <SectionHeading
                eyebrow="CLINIC EXPERIENCE"
                title="تجربة عيادية مصممة للراحة والثقة"
                description="من أجواء الاستقبال وحتى المتابعة بعد العلاج، نهتم بأن تكون رحلتك سلسة وراقية وتعكس مستوى الخدمة الذي تبحث عنه."
              />

              <div className="mt-8 grid gap-4">
                {experiencePillars.map((item, index) => (
                  <FeatureCard key={item.title} {...item} index={index} />
                ))}
              </div>
            </MotionDiv>

            <MotionDiv
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: 0.08 }}
              className="relative h-full"
            >
              <div className="relative mx-auto h-full w-full max-w-[27rem] overflow-hidden rounded-[32px] border border-[#d6bc6a]/20 bg-[#0b1d33] p-2.5 shadow-[0_32px_90px_rgba(0,0,0,0.3)] lg:max-w-none">
                <img
                  src={doctorImage}
                  alt="بيئة العيادة"
                  width="900"
                  height="1080"
                  loading="lazy"
                  decoding="async"
                  className="block h-[29rem] w-full rounded-[26px] object-cover object-top md:h-[32rem] lg:h-full"
                />
                <div className="absolute inset-0 rounded-[26px] bg-gradient-to-t from-[#07111f]/92 via-[#07111f]/18 to-transparent" />

                <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-white/10 bg-[#07111f]/78 p-4 backdrop-blur-md">
                    <p className="text-sm text-[#d6bc6a]">تقنيات متطورة</p>
                    <p className="mt-2 text-sm leading-7 text-slate-200">
                      حلول حديثة تساعد على تشخيص أدق وتنفيذ أكثر سلاسة للحالات التجميلية
                      والعلاجية.
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-[#07111f]/78 p-4 backdrop-blur-md">
                    <p className="text-sm text-[#d6bc6a]">رعاية مخصصة</p>
                    <p className="mt-2 text-sm leading-7 text-slate-200">
                      نهتم بتصميم الخطة وفق احتياجك الحقيقي لضمان نتيجة مناسبة وطبيعية.
                    </p>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </section>

        <section className="px-6 pb-20 md:px-10 lg:px-16 lg:pb-24">
          <MotionDiv
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65 }}
            className="mx-auto max-w-7xl overflow-hidden rounded-[38px] border border-[#d6bc6a]/22 bg-[linear-gradient(135deg,#0c1d34_0%,#102846_55%,#0a1728_100%)] p-8 shadow-[0_35px_100px_rgba(0,0,0,0.28)] md:p-12"
          >
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="text-right">
                <p className="text-sm font-semibold tracking-[0.35em] text-[#d6bc6a]">
                  BOOK YOUR VISIT
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-5xl">
                  ابدأ رحلتك نحو ابتسامة أفضل اليوم
                </h2>
                <p className="mt-5 max-w-3xl text-base leading-8 text-slate-300 md:text-lg">
                  احجز استشارتك الآن ودعنا نضع لك خطة علاجية تناسب احتياجك الجمالي والطبي
                  داخل تجربة راقية ومطمئنة.
                </p>
              </div>

              <div className="flex flex-wrap justify-end gap-4 lg:flex-col">
                <Link
                  to="/reservation"
                  className="rounded-full bg-[#d6bc6a] px-8 py-3.5 text-center text-sm font-semibold text-[#091729] transition hover:-translate-y-0.5 hover:bg-[#e8d18b]"
                >
                  احجز الآن
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-[#d6bc6a]/35 bg-white/5 px-8 py-3.5 text-center text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-[#d6bc6a] hover:bg-white/10"
                >
                  واتساب
                </a>
              </div>
            </div>
          </MotionDiv>
        </section>
      </main>
    </>
  );
}

export default About;
