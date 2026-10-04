"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const letters = "assentin".split("");

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

      gsap.set(".preloader-letter-fill", { clipPath: "inset(0 100% 0 0)" });

      if (reducedMotion) {
        timeline
          .set(".preloader-letter-fill", { clipPath: "inset(0 0% 0 0)" })
          .call(signalReady, [], 0.04)
          .to(root.current, { opacity: 0, duration: 0.2, delay: 0.12, ease: "none" });
        return;
      }

      const glyphs = gsap.utils.toArray<HTMLElement>(".preloader-glyph");

      timeline
        .from(
          ".preloader-guide-horizontal",
          { scaleX: 0, duration: 0.48, stagger: 0.04, ease: "power3.out" },
          0.04,
        )
        .from(
          ".preloader-tick",
          { scaleY: 0, opacity: 0, duration: 0.32, stagger: 0.028, ease: "power2.out" },
          0.1,
        )
        .from(
          ".preloader-letter-outline",
          { opacity: 0, duration: 0.3, stagger: 0.025, ease: "none" },
          0.24,
        );

      glyphs.forEach((glyph, index) => {
        const fill = glyph.querySelector(".preloader-letter-fill");
        const start = 0.56 + index * 0.145;

        timeline.to(
          fill,
          { clipPath: "inset(0 0% 0 0)", duration: 0.27, ease: "power2.inOut" },
          start,
        );
      });

      timeline
        .to(".preloader-letter-outline", { opacity: 0.09, duration: 0.2 }, 1.86)
        .to(".preloader-construction", { scale: 1.012, duration: 0.34, ease: "power1.inOut" }, 1.88)
        .call(signalReady, [], 1.94)
        .to(root.current, { yPercent: -100, duration: 0.66, ease: "power4.inOut" }, 2.06);
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

          <div className="preloader-wordmark">
            {letters.map((letter, index) => (
              <span className="preloader-glyph" key={`${letter}-${index}`}>
                <span className="preloader-letter preloader-letter-outline">{letter}</span>
                <span className="preloader-letter preloader-letter-fill">{letter}</span>
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
