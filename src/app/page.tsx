"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Check,
  Menu,
  RefreshCw,
  Search,
  Settings,
  Smartphone,
  Users,
  X,
} from "lucide-react";
gsap.registerPlugin(ScrollTrigger, useGSAP);

const navigation = [
  ["Soluções", "#solucoes"],
  ["Como funciona", "#metodo"],
  ["Tecnologia", "#tecnologia"],
  ["A Assentin", "#assentin"],
];

const journey = [
  {
    number: "01",
    title: "Diagnóstico",
    text: "Entendemos sua realidade financeira, seus objetivos e os pontos que mais pedem atenção.",
    icon: Search,
  },
  {
    number: "02",
    title: "Planejamento",
    text: "Definimos prioridades, estratégias e metas claras para o seu momento de vida ou de negócio.",
    icon: BarChart3,
  },
  {
    number: "03",
    title: "Implementação",
    text: "Transformamos o plano em ações práticas, com organização, estrutura e decisões bem orientadas.",
    icon: Settings,
  },
  {
    number: "04",
    title: "Acompanhamento",
    text: "Revisamos resultados, ajustamos a rota e seguimos ao seu lado para sustentar a evolução.",
    icon: RefreshCw,
  },
];

const technologyFeatures = [
  {
    title: "Visão completa",
    text: "Informações organizadas de forma clara para acompanhar sua evolução.",
    icon: BarChart3,
  },
  {
    title: "Acesso em qualquer lugar",
    text: "Uma experiência digital simples, disponível sempre que você precisar.",
    icon: Smartphone,
  },
  {
    title: "Integração com o consultor",
    text: "Tecnologia e acompanhamento humano trabalhando no mesmo contexto.",
    icon: Users,
  },
];

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroReady(true), 120);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const desktopWheel = window.matchMedia("(min-width: 901px) and (hover: hover) and (pointer: fine)");
    if (!desktopWheel.matches) return;

    let pendingDelta = 0;
    let frame = 0;

    const flushWheel = () => {
      window.scrollBy({ top: pendingDelta, left: 0, behavior: "auto" });
      pendingDelta = 0;
      frame = 0;
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey || event.shiftKey) return;

      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("textarea, select, [data-native-scroll]")) return;

      const unit = event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? window.innerHeight
          : 1;

      event.preventDefault();
      pendingDelta += event.deltaY * unit * 0.68;

      if (!frame) frame = window.requestAnimationFrame(flushWheel);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useGSAP(
    () => {
      if (!introReady) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compactViewport = window.matchMedia("(max-width: 620px)").matches;

      if (reduceMotion) {
        const introTargets = gsap.utils.toArray<HTMLElement>(
          ".nav-shell, .hero-content, .hero-line > span, .hero-copy, .hero-actions, .hero-visual",
        );

        gsap.fromTo(
          introTargets,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.2,
            stagger: 0.035,
            ease: "none",
            clearProps: "opacity,visibility",
          },
        );
      } else {
        const architectureLines = gsap.utils.toArray<SVGPathElement>(
          ".hero-skyline path, .hero-frame-lines path",
        );

        architectureLines.forEach((line) => {
          const length = line.getTotalLength();
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        });

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".hero-visual", { opacity: 0, scale: 1.045, duration: 1.25, ease: "power2.out" }, 0)
          .from(".hero-ambient-light", { x: -120, opacity: 0, duration: 1.4, ease: "power2.out" }, 0.08)
          .from(".hero-plane", { x: 34, y: 72, opacity: 0, duration: 1.12, stagger: 0.1 }, 0.12)
          .to(architectureLines, { strokeDashoffset: 0, duration: 1.04, stagger: 0.035, ease: "power2.inOut" }, 0.18)
          .fromTo(".hero-content", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.88 }, 0.2)
          .from(".hero-edge-glow", { opacity: 0, duration: 0.9, ease: "power2.out" }, 0.42)
          .from(".nav-shell", { y: -34, opacity: 0, duration: 0.58 }, 0.16)
          .from(".hero-line > span", { yPercent: 115, rotateX: -12, opacity: 0, duration: 0.84, stagger: 0.1 }, 0.5)
          .from(".hero-copy", { y: 26, opacity: 0, duration: 0.58 }, 1)
          .from(".hero-actions", { y: 20, opacity: 0, duration: 0.5 }, 1.12)
          .set(
            ".nav-shell, .hero-content, .hero-line > span, .hero-copy, .hero-actions, .hero-visual, .hero-ambient-light, .hero-plane, .hero-edge-glow",
            { clearProps: "transform,opacity" },
          )
          .set(architectureLines, { clearProps: "strokeDasharray,strokeDashoffset" });
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: reduceMotion ? 0 : compactViewport ? 24 : 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: reduceMotion ? 0.32 : compactViewport ? 0.62 : 0.76,
            ease: reduceMotion ? "none" : "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, start: compactViewport ? "top 91%" : "top 88%", once: true },
          },
        );
      });

      if (reduceMotion) {
        gsap.fromTo(
          ".ascent-progress",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.32,
            ease: "none",
            clearProps: "opacity",
            scrollTrigger: {
              trigger: ".journey-grid",
              start: "top 76%",
              once: true,
            },
          },
        );
      } else {
        gsap.fromTo(".ascent-progress", {
          scaleX: 0,
        }, {
          scaleX: 1,
          duration: 1.2,
          ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: ".journey-grid",
            start: "top 76%",
            once: true,
          },
        });
      }

      gsap.delayedCall(reduceMotion ? 0.4 : 0.9, () => ScrollTrigger.refresh());
    },
    { scope: root, dependencies: [introReady], revertOnUpdate: true },
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main ref={root} className={`home-page ${introReady ? "intro-ready" : ""}`}>
      <header className={`nav-shell ${menuOpen ? "is-solid" : ""}`} aria-label="Navegação principal">
        <a className="brand" href="#inicio" aria-label="Assentin, início">
          <Image src="/brand/logo-transparent.png" alt="Assentin Consultoria Financeira" width={1200} height={337} priority />
        </a>

        <nav className="desktop-nav">
          {navigation.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>

        <a className="nav-cta" href="#contato">
          Fale com um especialista <ArrowUpRight size={16} strokeWidth={1.8} />
        </a>

        <button className="menu-toggle" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>

        <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
          {navigation.map(([label, href], index) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              <span>0{index + 1}</span>{label}
            </a>
          ))}
          <a className="mobile-cta" href="#contato" onClick={() => setMenuOpen(false)}>Fale com um especialista <ArrowUpRight /></a>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-visual" aria-hidden="true">
          <svg className="hero-architecture" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="hero-sky" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#071a31" />
                <stop offset="0.48" stopColor="#0a2a51" />
                <stop offset="1" stopColor="#041326" />
              </linearGradient>
              <radialGradient id="hero-light" cx="66%" cy="21%" r="64%">
                <stop offset="0" stopColor="#2e67a9" stopOpacity="0.72" />
                <stop offset="0.42" stopColor="#174478" stopOpacity="0.24" />
                <stop offset="1" stopColor="#061a31" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="hero-face-left" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#174b82" stopOpacity="0.82" />
                <stop offset="0.58" stopColor="#0a284b" stopOpacity="0.94" />
                <stop offset="1" stopColor="#04182e" />
              </linearGradient>
              <linearGradient id="hero-face-front" x1="0" y1="0" x2="0.96" y2="1">
                <stop offset="0" stopColor="#0f3d70" />
                <stop offset="1" stopColor="#031326" />
              </linearGradient>
              <linearGradient id="hero-face-right" x1="0" y1="0" x2="1" y2="0.7">
                <stop offset="0" stopColor="#082949" />
                <stop offset="1" stopColor="#020d1b" />
              </linearGradient>
              <pattern id="hero-grid" width="76" height="76" patternUnits="userSpaceOnUse">
                <path d="M 76 0 L 0 0 0 76" fill="none" stroke="#7ea8d8" strokeOpacity="0.09" strokeWidth="1" />
              </pattern>
              <filter id="hero-glow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <rect width="1600" height="900" fill="url(#hero-sky)" />
            <rect className="hero-ambient-light" width="1600" height="900" fill="url(#hero-light)" />
            <rect className="hero-grid-pattern" x="610" width="990" height="900" fill="url(#hero-grid)" />

            <g className="hero-skyline" fill="none" stroke="#7ba5d3" strokeOpacity="0.2">
              <path d="M1030 0V296L1120 244V0" />
              <path d="M1280 0V292L1392 230V0" />
            </g>

            <g className="hero-structure">
              <path className="hero-plane" d="M438 900L1088 304L1257 398L1257 900Z" fill="url(#hero-face-left)" />
              <path className="hero-plane" d="M1088 304L1257 398L1600 206V900H1257V398Z" fill="url(#hero-face-front)" />
              <path className="hero-plane" d="M739 900L1257 398L1600 589V900Z" fill="url(#hero-face-right)" fillOpacity="0.98" />

              <g className="hero-frame-lines" fill="none" stroke="#83addb" strokeOpacity="0.2" strokeWidth="1.25">
                <path d="M758 900L1088 304" />
                <path d="M920 900L1088 304" />
                <path d="M1088 304V900" />
                <path d="M1257 398V900" />
                <path d="M1430 301V900" />
                <path d="M827 814L1257 398" />
                <path d="M1257 565L1600 756" />
              </g>

              <path className="hero-edge-glow" d="M438 900L1088 304L1257 398L1600 206" fill="none" stroke="#a7c9ed" strokeWidth="3" filter="url(#hero-glow)" />
              <path className="hero-edge-runner" d="M438 900L1088 304L1257 398L1600 206" fill="none" stroke="#d4e7fb" strokeWidth="1.3" />
              <path className="hero-edge-sweep" pathLength="100" d="M438 900L1088 304L1257 398L1600 206" fill="none" stroke="#f0f7ff" strokeWidth="2.4" strokeLinecap="round" filter="url(#hero-glow)" />
            </g>

          </svg>
          <div className="hero-visual-shade" />
        </div>

        <div className="hero-grid page-shell">
          <div className="hero-content">
            <h1 className="hero-title" aria-label="A consultoria financeira para impulsionar o seu futuro.">
              <span className="hero-line"><span>A consultoria financeira</span></span>
              <span className="hero-line accent-line"><span>para impulsionar o seu futuro.</span></span>
            </h1>
            <p className="hero-copy">Para suas conquistas pessoais ou os próximos passos do seu negócio, unimos planejamento, tecnologia e estratégia para transformar objetivos em resultados.</p>
            <div className="hero-actions">
              <a className="text-link hero-cta-link" href="#solucoes">Conheça nossas soluções <ArrowRight size={18} /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="solutions section-light" id="solucoes">
        <div className="page-shell">
          <div className="solutions-heading" data-reveal>
            <div>
              <p className="eyebrow"><span className="eyebrow-dot" /> Nossas soluções</p>
              <h2>Consultoria financeira <span>para cada momento</span> da sua jornada.</h2>
            </div>
            <p>Soluções personalizadas para pessoas, profissionais liberais e empresas, com método, acompanhamento e tecnologia.</p>
          </div>

          <div className="solution-stories">
            <article className="solution-story" data-reveal>
              <div className="solution-story-copy">
                <div className="solution-number"><span>01</span><i /></div>
                <p className="solution-audience">Para você</p>
                <h3>Consultoria Financeira <span>Pessoal</span></h3>
                <p>Organize sua vida financeira, planeje seus objetivos e construa patrimônio com acompanhamento contínuo e personalizado.</p>
                <div className="solution-tags"><span>Organização</span><span>Acompanhamento</span><span>Resultados</span></div>
                <a className="text-link dark-link" href="#contato">Conheça a solução <ArrowRight size={17} /></a>
              </div>
              <div className="solution-story-image">
                <Image src="/images/assentin-personal-planning.png" alt="Pessoa organizando seu planejamento financeiro em casa" fill sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
            </article>

            <article className="solution-story solution-story-reverse" data-reveal>
              <div className="solution-story-copy">
                <div className="solution-number"><span>02</span><i /></div>
                <p className="solution-audience">Para profissionais liberais</p>
                <h3>Consultoria para <span>Profissionais Liberais</span></h3>
                <p>Conecte finanças pessoais e profissionais com mais clareza sobre renda, pró-labore, impostos e planejamento de futuro.</p>
                <div className="solution-tags"><span>Separação PF/PJ</span><span>Pró-labore</span><span>Planejamento</span></div>
                <a className="text-link dark-link" href="#contato">Conheça a solução <ArrowRight size={17} /></a>
              </div>
              <div className="solution-story-image">
                <Image src="/images/assentin-technology.webp" alt="Notebook em ambiente profissional contemporâneo" fill sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
            </article>

            <article className="solution-story" data-reveal>
              <div className="solution-story-copy">
                <div className="solution-number"><span>03</span><i /></div>
                <p className="solution-audience">Para empresas</p>
                <h3>Consultoria Financeira <span>Empresarial</span></h3>
                <p>Tenha mais controle sobre as finanças da sua empresa, tome decisões com segurança e conte com acompanhamento estratégico para crescer de forma sustentável.</p>
                <div className="solution-tags"><span>Gestão</span><span>Estratégia</span><span>Crescimento</span></div>
                <a className="text-link dark-link" href="#contato">Conheça a solução <ArrowRight size={17} /></a>
              </div>
              <div className="solution-story-image">
                <Image src="/images/assentin-boardroom.webp" alt="Sala de reunião com vista para a cidade ao entardecer" fill sizes="(max-width: 900px) 100vw, 50vw" />
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="method section-dark" id="metodo">
        <Image className="method-background" src="/images/assentin-boardroom.webp" alt="" fill sizes="100vw" aria-hidden="true" />
        <div className="method-overlay" aria-hidden="true" />
        <div className="page-shell method-layout">
          <div className="method-intro" data-reveal>
            <p className="eyebrow eyebrow-on-dark"><span className="eyebrow-dot" /> Como funciona a consultoria</p>
            <h2>Conheça o caminho por trás <span>de cada conquista.</span></h2>
            <p>Um processo estruturado, contínuo e personalizado para transformar sua vida financeira ou a gestão da sua empresa.</p>
          </div>

          <div className="journey-grid">
            <div className="ascent-progress" aria-hidden="true" />
            {journey.map((item) => (
              <article className="journey-step" key={item.number} data-reveal>
                <div className="journey-number"><span>{item.number}</span><i /></div>
                <span className="journey-icon"><item.icon size={24} strokeWidth={1.45} /></span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <a className="text-link method-link" href="#contato">Conheça a consultoria <ArrowRight size={17} /></a>
        </div>
      </section>

      <section className="technology" id="tecnologia">
        <div className="tech-layout">
          <div className="tech-copy" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" /> Tecnologia Assentin</p>
            <h2>Uma plataforma <span>para simplificar</span> suas decisões.</h2>
            <p>Organize suas finanças, acompanhe sua evolução e tenha informações claras em um só lugar.</p>
            <div className="tech-features">
              {technologyFeatures.map((feature) => (
                <div className="tech-feature" key={feature.title}>
                  <span><feature.icon size={22} strokeWidth={1.5} /></span>
                  <div><strong>{feature.title}</strong><p>{feature.text}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="integrated-visual" data-reveal>
            <Image src="/images/assentin-technology.webp" alt="Tecnologia integrada ao acompanhamento financeiro" fill sizes="(max-width: 900px) 100vw, 50vw" />
            <div className="tech-visual-label"><span>Experiência digital</span><strong>Clareza para acompanhar. Contexto para decidir.</strong></div>
          </div>
        </div>
      </section>

      <section className="results section-light" aria-labelledby="resultados-titulo">
        <div className="results-media" data-reveal>
          <Image src="/images/assentin-personal-dusk.webp" alt="Ambiente de planejamento com vista para a cidade" fill sizes="100vw" />
          <div className="results-gradient" aria-hidden="true" />
        </div>
        <div className="page-shell results-content">
          <div className="results-copy" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" /> Resultados na prática</p>
            <h2 id="resultados-titulo">Mais clareza para organizar, decidir e evoluir.</h2>
            <p>O resultado aparece quando planejamento deixa de ser uma intenção e passa a orientar escolhas reais, com acompanhamento ao longo do caminho.</p>
            <div className="outcome-list">
              <span>Organização financeira</span>
              <span>Visão de patrimônio</span>
              <span>Decisões com contexto</span>
            </div>
          </div>
          <aside className="results-card" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" /> O que muda</p>
            <blockquote>“Cada recomendação considera o momento, as prioridades e o futuro que a pessoa ou a empresa deseja construir.”</blockquote>
            <div><span>Assentin</span><small>Consultoria Financeira</small></div>
          </aside>
        </div>
      </section>

      <section className="institutional section-light" id="assentin">
        <div className="page-shell institutional-grid">
          <div className="brand-image" data-reveal>
            <Image src="/brand/brand-kit.jpg" alt="Kit institucional da Assentin" fill sizes="(max-width: 900px) 100vw, 48vw" loading="eager" />
            <span>Identidade que traduz confiança, experiência e suporte.</span>
          </div>
          <div className="institutional-copy" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" /> A Assentin</p>
            <h2>Uma empresa financeira preparada para crescer com você.</h2>
            <p>A Assentin nasce para transformar planejamento em possibilidades e decisões em segurança. Uma atuação estruturada, próxima e orientada ao futuro.</p>
            <div className="brand-principles"><span>Confiança</span><span>Experiência</span><span>Suporte</span></div>
            <a className="text-link dark-link" href="#contato">Conheça nossa visão <ArrowRight size={17} /></a>
          </div>
        </div>
      </section>

      <section className="contact section-dark" id="contato">
        <div className="contact-mark" aria-hidden="true"><i /><i /></div>
        <div className="page-shell contact-grid">
          <div className="contact-copy" data-reveal>
            <p className="eyebrow eyebrow-on-dark"><span className="eyebrow-dot" /> Próximo passo</p>
            <h2>Seu próximo passo começa aqui.</h2>
            <p>Conte brevemente o que você busca. Um especialista Assentin ajuda a identificar o melhor caminho para o seu momento.</p>
          </div>

          {sent ? (
            <div className="success-card" role="status" data-reveal>
              <span><Check /></span>
              <h3>Interesse registrado.</h3>
              <p>Este protótipo demonstra a jornada de conversão. O envio será conectado ao canal comercial na etapa de integração.</p>
              <button type="button" onClick={() => setSent(false)}>Voltar ao formulário</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} data-reveal>
              <div className="field-row">
                <label><span>Nome</span><input name="name" type="text" placeholder="Como podemos chamar você?" required /></label>
                <label><span>E-mail</span><input name="email" type="email" placeholder="seu@email.com" required /></label>
              </div>
              <label><span>Estou buscando</span><select name="profile" defaultValue="" required><option value="" disabled>Selecione uma opção</option><option>Planejamento para mim</option><option>Soluções para minha empresa</option><option>Conhecer o ecossistema Assentin</option></select></label>
              <label><span>Mensagem <small>(opcional)</small></span><textarea name="message" rows={3} placeholder="Conte um pouco sobre o seu momento." /></label>
              <div className="form-footer"><p>Ao continuar, você concorda com o uso dos dados para retorno do contato.</p><button className="button button-light" type="submit">Quero conversar <ArrowUpRight size={18} /></button></div>
            </form>
          )}
        </div>
      </section>

      <footer>
        <div className="page-shell footer-main">
          <div className="footer-brand"><Image src="/brand/logo-transparent.png" alt="Assentin Consultoria Financeira" width={1200} height={337} /><p>Inteligência financeira para transformar decisões em patrimônio.</p></div>
          <div className="footer-links"><div><span>Navegação</span>{navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div><div><span>Soluções</span><a href="#solucoes">Para você</a><a href="#solucoes">Profissionais liberais</a><a href="#solucoes">Para empresas</a><a href="#tecnologia">Tecnologia</a></div></div>
        </div>
        <div className="page-shell footer-bottom"><span>© 2026 Assentin. Todos os direitos reservados.</span><div><a href="#">Privacidade</a><a href="#">Termos de uso</a></div></div>
      </footer>
    </main>
  );
}
