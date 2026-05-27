import { memo } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, ShieldCheck, Smile, Target } from "lucide-react";
import FeatureCard from "./about/FeatureCard";
import SectionHeading from "./about/SectionHeading";

const MotionDiv = motion.div;

const features = [
  {
    icon: Target,
    title: "دقة متناهية في التشخيص والعلاج",
    description:
      "لمسات جمالية مدروسة وخبرة عملية تمنح المريض قرارًا أوضح ونتيجة أكثر ثقة.",
  },
  {
    icon: ShieldCheck,
    title: "تعقيم فائق",
    description:
      "نلتزم بأعلى معايير السلامة والجودة داخل العيادة للحفاظ على بيئة علاجية آمنة.",
  },
  {
    icon: Smile,
    title: "تجربة مريحة للمريض",
    description:
      "نستخدم تقنيات حديثة ونهجًا هادئًا يجعل رحلة العلاج أكثر راحة واطمئنانًا.",
  },
  {
    icon: ClipboardCheck,
    title: "خطط علاجية مخصصة",
    description:
      "كل حالة تُدرس بعناية لاختيار الحل الأنسب والأكثر استدامة حسب الاحتياج الحقيقي.",
  },
];

function WhyUs() {
  return (
    <section dir="rtl" className="border-y border-white/8 bg-[#091728] px-6 py-16 md:px-10 lg:px-16 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <MotionDiv
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
        >
          <SectionHeading
            eyebrow="لماذا يثق المرضى بالعيادة؟"
            title="عناصر الثقة التي تدعم قرار الحجز"
            description="هذا القسم يترجم جودة التجربة الطبية إلى رسائل واضحة للمريض: أمان، راحة، تنظيم، ونتيجة محسوبة."
            align="center"
          />
        </MotionDiv>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((item, index) => (
            <FeatureCard key={item.title} {...item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default memo(WhyUs);
