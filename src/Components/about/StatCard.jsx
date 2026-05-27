import { motion } from "framer-motion";

function StatCard({ icon: Icon, value, label, detail, index = 0 }) {
  const MotionArticle = motion.article;
  const IconComponent = Icon;

  return (
    <MotionArticle
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      className="group relative overflow-hidden rounded-[26px] border border-[#d6bc6a]/20 bg-[#0f2340]/90 p-6 shadow-[0_18px_60px_rgba(2,8,18,0.28)] transition duration-300 hover:-translate-y-1.5 hover:border-[#d6bc6a]/45 hover:shadow-[0_26px_80px_rgba(12,22,40,0.38)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(214,188,106,0.12),transparent_35%)] opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-3xl font-bold text-white md:text-4xl">{value}</p>
          <h3 className="mt-3 text-lg font-semibold text-[#f6e4aa]">{label}</h3>
          <p className="mt-2 text-sm leading-7 text-slate-300">{detail}</p>
        </div>
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#d6bc6a]/25 bg-[#d6bc6a]/10 text-[#f4de97]">
          <IconComponent size={24} strokeWidth={1.8} />
        </div>
      </div>
    </MotionArticle>
  );
}

export default StatCard;
