"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const wordmarkSlices = [
  { letter: "a", start: 0, end: 14.4 },
  { letter: "s", start: 14.2, end: 27 },
  { letter: "s", start: 26.9, end: 38.65 },
  { letter: "e", start: 38.6, end: 53.9 },
  { letter: "n", start: 53.8, end: 67.5 },
  { letter: "t", start: 67.25, end: 76.8 },
  { letter: "i", start: 76.75, end: 80.8 },
  { letter: "n", start: 80.75, end: 98.5 },
] as const;

type BrandPreloaderProps = {
  onComplete: () => void;
};

export function BrandPreloader({ onComplete }: BrandPreloaderProps) {
  const root = useRef<HTMLDivElement>(null);
  const readySignaled = useRef(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [visible]);

  useGSAP(
    () => {
      if (!root.current) return;

      const signalReady = () => {
        if (readySignaled.current) return;
        readySignaled.current = true;
        onComplete();
      };

      const finish = () => setVisible(false);

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const timeline = gsap.timeline({ onComplete: finish });

      const slices = gsap.utils.toArray<HTMLElement>(".preloader-wordmark-slice");

      const revealSlice = (slice: HTMLElement) => {
        const start = Number(slice.dataset.start);
        const end = Number(slice.dataset.end);
        return `inset(0 ${100 - end}% 0 ${start}%)`;
      };

      if (reducedMotion) {
        slices.forEach((slice) => gsap.set(slice, { clipPath: revealSlice(slice) }));
        timeline
          .call(signalReady, [], 0.04)
          .to(root.current, { opacity: 0, duration: 0.2, delay: 0.12, ease: "none" });
        return;
      }

      timeline
        .to(
          ".preloader-guide-horizontal",
          { scaleX: 1, duration: 0.52, stagger: 0.05, ease: "power3.out" },
          0.04,
        )
        .to(
          ".preloader-tick",
          { scaleY: 1, opacity: 1, duration: 0.36, stagger: 0.035, ease: "power2.out" },
          0.12,
        );

      slices.forEach((slice, index) => {
        const start = 0.48 + index * 0.23;

        timeline.to(
          slice,
          { clipPath: revealSlice(slice), duration: 0.38, ease: "power2.inOut" },
          start,
        );
      });

      timeline
        .to(".preloader-construction", { scale: 1.012, duration: 0.36, ease: "power1.inOut" }, 2.48)
        .call(signalReady, [], 2.7)
        .to(root.current, { yPercent: -100, duration: 0.68, ease: "power4.inOut" }, 2.84);
    },
    { scope: root },
  );

  if (!visible) return null;

  return (
    <div className="brand-preloader" ref={root} role="status" aria-live="polite" aria-label="Carregando experiência Assentin">
      <span className="sr-only">Preparando a experiência Assentin.</span>

      <div className="preloader-blueprint" aria-hidden="true">
        <div className="preloader-construction">
          <div className="preloader-guide-horizontal preloader-guide-top" />
          <div className="preloader-guide-horizontal preloader-guide-middle" />
          <div className="preloader-guide-horizontal preloader-guide-bottom" />

          <div className="preloader-official-wordmark">
            {wordmarkSlices.map(({ letter, start, end }, index) => (
              <span
                className="preloader-wordmark-slice"
                data-start={start}
                data-end={end}
                key={`${letter}-${index}`}
                style={{ clipPath: `inset(0 ${100 - start}% 0 ${start}%)` }}
              >
                <Image
                  className="preloader-wordmark-artwork"
                  src="/brand/logo-transparent.png"
                  alt=""
                  width={1200}
                  height={337}
                  priority={index === 0}
                  draggable={false}
                />
              </span>
            ))}
          </div>

          <div className="preloader-ticks">
            {Array.from({ length: 9 }, (_, index) => <i className="preloader-tick" key={index} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
