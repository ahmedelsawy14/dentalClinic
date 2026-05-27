import { memo, useEffect, useRef, useState } from "react";
import { MoveHorizontal } from "lucide-react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.src = src;

    if (image.decode) {
      image.decode().then(() => resolve(src)).catch(() => resolve(src));
    }

    image.onload = () => resolve(src);
    image.onerror = reject;
  });
}

function BeforeAfterCard({
  before,
  after,
  title,
  beforeLabel = "قبل",
  afterLabel = "بعد",
  aspectRatio = "1 / 1",
  initialPosition = 50,
  className = "",
}) {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const draggingRef = useRef(false);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsReady(false);
    setHasError(false);

    Promise.allSettled([preloadImage(before), preloadImage(after)]).then((results) => {
      if (cancelled) return;

      const failed = results.some((result) => result.status === "rejected");
      setHasError(failed);
      setIsReady(!failed);
    });

    return () => {
      cancelled = true;
    };
  }, [after, before]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const updatePosition = (clientX) => {
    const element = containerRef.current;
    if (!element) return;

    const bounds = element.getBoundingClientRect();
    const nextPosition = clamp(((clientX - bounds.left) / bounds.width) * 100, 0, 100);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      setPosition(nextPosition);
    });
  };

  const startDragging = (event) => {
    draggingRef.current = true;
    setIsDragging(true);
    updatePosition(event.clientX);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const stopDragging = (event) => {
    draggingRef.current = false;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!draggingRef.current) return;
    updatePosition(event.clientX);
  };

  const handleKeyDown = (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowLeft" ? -5 : 5;
    setPosition((current) => clamp(current + direction, 0, 100));
  };

  return (
    <article
      className={`group h-full rounded-[1.6rem] border border-white/10 bg-[#0f2744]/62 p-2.5 shadow-[0_16px_36px_rgba(6,16,29,0.18)] ${className}`}
    >
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-[1.3rem] bg-[#0a1d33]"
        style={{ aspectRatio, touchAction: "none" }}
      >
        {!hasError ? (
          <>
            <img
              src={after}
              alt={`${title} ${afterLabel}`}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              width="800"
              height="800"
              sizes="(max-width: 768px) 100vw, 25vw"
            />

            <div
              className="absolute inset-0 will-change-[clip-path] transition-[clip-path] duration-200 ease-out"
              style={{
                clipPath: `inset(0 ${100 - position}% 0 0)`,
                transitionDuration: isDragging ? "0ms" : "180ms",
              }}
            >
              <img
                src={before}
                alt={`${title} ${beforeLabel}`}
                className="h-full w-full object-cover"
                loading="lazy"
                decoding="async"
                width="800"
                height="800"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>

            {!isReady ? (
              <div className="absolute inset-0 z-10 overflow-hidden rounded-[1.15rem] bg-[linear-gradient(110deg,rgba(255,255,255,0.05),rgba(255,255,255,0.14),rgba(255,255,255,0.05))] bg-[length:200%_100%] animate-[shimmer_1.8s_linear_infinite]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(183,154,68,0.2),transparent_45%)]" />
              </div>
            ) : null}

            <div
              className="pointer-events-none absolute inset-y-0 z-20 w-px bg-white/80 shadow-[0_0_0_1px_rgba(183,154,68,0.3)]"
              style={{ left: `${position}%` }}
            />

            <button
              type="button"
              aria-label={`مقارنة قبل وبعد ${title}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(position)}
              aria-valuetext={`${Math.round(position)}%`}
              role="slider"
              tabIndex={0}
              className="absolute left-0 top-0 z-30 h-full w-full cursor-ew-resize focus:outline-none"
              onPointerDown={startDragging}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
              onKeyDown={handleKeyDown}
            >
              <span
                className={`pointer-events-none absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#10233d] shadow-[0_10px_24px_rgba(4,13,24,0.24)] transition-transform ${
                  isDragging ? "scale-110" : "scale-100"
                }`}
                style={{ left: `${position}%` }}
              >
                <span className="absolute inset-1 rounded-full border border-[#d8c897]/70" />
                <MoveHorizontal size={14} className="relative z-10 text-[#b79a44]" />
              </span>
            </button>

            <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-slate-950/55 px-2.5 py-1 text-[11px] font-semibold text-white">
              {beforeLabel}
            </div>
            <div className="pointer-events-none absolute right-3 top-3 z-20 rounded-full bg-slate-950/55 px-2.5 py-1 text-[11px] font-semibold text-white">
              {afterLabel}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#10233d] p-6 text-center text-sm text-slate-200">
            تعذر تحميل صور المقارنة حاليًا.
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#071323] via-[#071323]/78 to-transparent px-4 pb-4 pt-10 text-center">
          <h3 className="text-sm font-semibold text-white sm:text-[0.95rem]">{title}</h3>
        </div>
      </div>
    </article>
  );
}

export default memo(BeforeAfterCard);
