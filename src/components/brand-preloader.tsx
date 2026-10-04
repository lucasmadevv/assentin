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
      const glyphs = gsap.utils.toArray<HTMLElement>(".preloader-glyph");

      if (reducedMotion) {
        timeline
          .set(".preloader-guide-horizontal", { scaleX: 1 }, 0)
          .set(".preloader-tick", { scaleY: 1, opacity: 1 }, 0)
          .to(
            ".preloader-letter-outline",
            { opacity: 0.45, duration: 0.12, stagger: 0.02, ease: "none" },
            0.02,
          );

        glyphs.forEach((glyph, index) => {
          const fill = glyph.querySelector(".preloader-letter-fill");
          timeline.to(
            fill,
            { clipPath: "inset(0 0% 0 0)", duration: 0.12, ease: "none" },
            0.24 + index * 0.14,
          );
        });

        timeline
          .call(signalReady, [], 1.5)
          .to(root.current, { opacity: 0, duration: 0.22, ease: "none" }, 1.56);
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
        )
        .to(
          ".preloader-letter-outline",
          { opacity: 1, duration: 0.34, stagger: 0.03, ease: "none" },
          0.34,
        );

      glyphs.forEach((glyph, index) => {
        const fill = glyph.querySelector(".preloader-letter-fill");
        const start = 0.78 + index * 0.22;

        timeline.to(
          fill,
          { clipPath: "inset(0 0% 0 0)", duration: 0.32, ease: "power2.inOut" },
          start,
        );
      });

      timeline
        .to(".preloader-letter-outline", { opacity: 0.35, duration: 0.2 }, 2.7)
        .to(".preloader-construction", { scale: 1.012, duration: 0.38, ease: "power1.inOut" }, 2.72)
        .call(signalReady, [], 2.9)
        .to(root.current, { yPercent: -100, duration: 0.68, ease: "power4.inOut" }, 3.04);
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
