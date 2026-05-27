import { motion } from "framer-motion";

function FeatureCard({ icon: Icon, title, description, index = 0 }) {
  const MotionArticle = motion.article;
  const IconComponent = Icon;

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="group relative overflow-hidden rounded-[28px] border border-[#d6bc6a]/20 bg-white/[0.04] p-6 shadow-[0_18px_60px_rgba(3,10,22,0.25)] backdrop-blur-sm transition duration-300 hover:-translate-y-1.5 hover:border-[#d6bc6a]/45 hover:bg-[#11284a]/95"
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-[#d6bc6a] to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d6bc6a]/30 bg-[#d6bc6a]/10 text-[#f2db94] shadow-[0_10px_30px_rgba(214,188,106,0.12)]">
        <IconComponent size={24} strokeWidth={1.8} />
      </div>
      <h3 className="mt-6 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </MotionArticle>
  );
}

export default FeatureCard;
