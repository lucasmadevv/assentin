"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const letters = "assentin".split("");

const palette = [
  {
    name: "Patrimônio",
    code: "#072044",
    description: "Azul profundo que transmite solidez, confiança e segurança.",
    rgb: "07, 32, 68",
    cmyk: "100, 88, 44, 48",
  },
  {
    name: "Estratégia",
    code: "#071C30",
    description: "Azul quase preto, associado a profundidade, precisão e decisões conscientes.",
    rgb: "07, 28, 48",
    cmyk: "100, 84, 50, 65",
  },
  {
    name: "Ascensão",
    code: "#376499",
    description: "Azul mais aberto que representa movimento, crescimento e evolução.",
    rgb: "55, 100, 153",
    cmyk: "84, 58, 17, 03",
  },
  {
    name: "Equilíbrio",
    code: "#EDF1F4",
    description: "Tom claro e neutro que traz leveza, clareza e estabilidade.",
    rgb: "237, 241, 244",
    cmyk: "09, 04, 04, 00",
  },
];

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
          .set(".preloader-palette", { autoAlpha: 0 })
          .set(".preloader-blueprint", { opacity: 1 })
          .set(".preloader-letter-fill", { clipPath: "inset(0 0% 0 0)" })
          .set(".preloader-measure, .preloader-axis", { autoAlpha: 0 })
          .call(signalReady, [], 0.08)
          .to(root.current, { opacity: 0, duration: 0.2, delay: 0.18, ease: "none" });
        return;
      }

      const glyphs = gsap.utils.toArray<HTMLElement>(".preloader-glyph");

      timeline
        .to(
          ".preloader-palette-panel",
          {
            yPercent: (index) => (index % 2 === 0 ? -102 : 102),
            duration: 0.42,
            stagger: 0.035,
            ease: "power3.inOut",
          },
          0.12,
        )
        .set(".preloader-palette", { autoAlpha: 0 })
        .to(".preloader-blueprint", { opacity: 1, duration: 0.28, ease: "power2.out" }, 0.35)
        .from(
          ".preloader-guide-horizontal",
          { scaleX: 0, duration: 0.46, stagger: 0.035, ease: "power3.out" },
          0.39,
        )
        .from(
          ".preloader-tick",
          { scaleY: 0, opacity: 0, duration: 0.24, stagger: 0.022, ease: "power2.out" },
          0.5,
        )
        .from(
          ".preloader-letter-outline",
          { opacity: 0, duration: 0.22, stagger: 0.035, ease: "none" },
          0.48,
        )
        .from(
          ".preloader-axis",
          { opacity: 0, scaleY: 0.55, duration: 0.24, ease: "power2.out" },
          0.62,
        );

      glyphs.forEach((glyph, index) => {
        const fill = glyph.querySelector(".preloader-letter-fill");
        const measure = glyph.querySelector(".preloader-measure");
        const marker = glyph.querySelector(".preloader-marker");
        const start = 0.72 + index * 0.145;

        timeline
          .fromTo(
            measure,
            { opacity: 0, scaleX: 0.3 },
            { opacity: 1, scaleX: 1, duration: 0.12, ease: "power2.out" },
            start,
          )
          .fromTo(
            marker,
            { xPercent: -30, opacity: 0 },
            { xPercent: 70, opacity: 1, duration: 0.18, ease: "power1.inOut" },
            start + 0.02,
          )
          .to(
            fill,
            { clipPath: "inset(0 0% 0 0)", duration: 0.19, ease: "power2.inOut" },
            start,
          )
          .to(measure, { opacity: 0, duration: 0.1 }, start + 0.2)
          .to(marker, { opacity: 0, duration: 0.08 }, start + 0.2);
      });

      timeline
        .to(".preloader-letter-outline", { opacity: 0.12, duration: 0.22 }, 1.92)
        .to(".preloader-signature", { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, 1.92)
        .to(".preloader-blueprint", { scale: 1.015, duration: 0.42, ease: "power1.inOut" }, 1.96)
        .call(signalReady, [], 2.02)
        .to(root.current, { yPercent: -100, duration: 0.68, ease: "power4.inOut" }, 2.16);
    },
    { scope: root },
  );

  if (!visible) return null;

  return (
    <div className="brand-preloader" ref={root} role="status" aria-live="polite" aria-label="Carregando experiência Assentin">
      <span className="sr-only">Preparando a experiência Assentin.</span>

      <div className="preloader-palette" aria-hidden="true">
        {palette.map((color) => (
          <div className="preloader-palette-panel" key={color.name}>
            <span className="preloader-palette-name">{color.name}</span>
            <p className="preloader-palette-description">{color.description}</p>
            <div className="preloader-palette-meta">
              <span>HEX {color.code}</span>
              <span>RGB {color.rgb}</span>
              <span>CMYK {color.cmyk}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="preloader-blueprint" aria-hidden="true">
        <div className="preloader-axis">
          <i className="preloader-axis-line" />
          <i className="preloader-axis-cap preloader-axis-cap-top" />
          <i className="preloader-axis-cap preloader-axis-cap-bottom" />
          <span className="preloader-axis-label">x-height</span>
        </div>
        <div className="preloader-guide-horizontal preloader-guide-top" />
        <div className="preloader-guide-horizontal preloader-guide-middle" />
        <div className="preloader-guide-horizontal preloader-guide-bottom" />

        <div className="preloader-wordmark">
          {letters.map((letter, index) => (
            <span className="preloader-glyph" key={`${letter}-${index}`}>
              <span className="preloader-letter preloader-letter-outline">{letter}</span>
              <span className="preloader-letter preloader-letter-fill">{letter}</span>
              <span className="preloader-measure">
                <i className="preloader-measure-line" />
                <i className="preloader-measure-cap preloader-measure-cap-start" />
                <i className="preloader-measure-cap preloader-measure-cap-end" />
                <small>{String(index + 1).padStart(2, "0")}</small>
              </span>
              <i className="preloader-marker" />
            </span>
          ))}
        </div>

        <div className="preloader-ticks" aria-hidden="true">
          {Array.from({ length: 17 }, (_, index) => <i className="preloader-tick" key={index} />)}
        </div>
        <span className="preloader-signature">consultoria financeira</span>
      </div>
    </div>
  );
}
