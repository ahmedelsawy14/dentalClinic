function SectionHeading({ eyebrow, title, description, align = "right" }) {
  const alignment = align === "center" ? "mx-auto max-w-3xl text-center" : "text-right";

  return (
    <div className={alignment}>
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#d6bc6a]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-4 text-3xl font-bold leading-tight text-white md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-slate-300 md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export default SectionHeading;
