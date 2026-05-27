import { motion } from "framer-motion";

function TimelineCard({ year, title, description, index = 0 }) {
  const MotionArticle = motion.article;

  return (
    <MotionArticle
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.08 }}
      className="relative rounded-[26px] border border-[#d6bc6a]/18 bg-white/[0.04] p-6 pr-10 backdrop-blur-sm"
    >
      <span className="absolute right-[-0.7rem] top-8 h-5 w-5 rounded-full border-4 border-[#0a1930] bg-[#d6bc6a] shadow-[0_0_0_8px_rgba(214,188,106,0.08)]" />
      <p className="text-sm font-semibold tracking-[0.3em] text-[#d6bc6a]">{year}</p>
      <h3 className="mt-3 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
    </MotionArticle>
  );
}

export default TimelineCard;
