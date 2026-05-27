function RouteSkeleton({ compact = false }) {
  return (
    <div
      className={`premium-page min-h-screen premium-ambient px-6 pb-16 ${
        compact ? "pt-8 md:px-8 md:pt-10 lg:px-10" : "pt-28 md:px-10 md:pt-32 lg:px-16"
      }`}
      aria-live="polite"
      aria-busy="true"
    >
      <div className={`mx-auto space-y-6 ${compact ? "max-w-[1680px]" : "max-w-7xl"}`}>
        <div className="glass-card overflow-hidden rounded-[2rem] p-6 md:p-8">
          <div className="h-8 w-36 animate-pulse rounded-full bg-white/10" />
          <div className="mt-6 h-14 max-w-2xl animate-pulse rounded-[1.5rem] bg-white/10" />
          <div className="mt-4 h-24 animate-pulse rounded-[1.5rem] bg-white/8" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="glass-card overflow-hidden rounded-[2rem] p-4"
            >
              <div className="aspect-[4/3] animate-pulse rounded-[1.5rem] bg-white/10" />
              <div className="mt-4 h-6 animate-pulse rounded-full bg-white/10" />
              <div className="mt-3 h-20 animate-pulse rounded-[1.25rem] bg-white/8" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RouteSkeleton;
