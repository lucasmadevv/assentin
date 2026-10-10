"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  Menu,
  MonitorUp,
  Sparkles,
  UserRound,
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
    title: "Entender",
    text: "Uma leitura precisa do seu momento, das suas prioridades e das decisões que pedem atenção.",
  },
  {
    number: "02",
    title: "Estruturar",
    text: "Um plano claro conecta objetivos, organiza recursos e transforma complexidade em próximos passos.",
  },
  {
    number: "03",
    title: "Evoluir",
    text: "Acompanhamento recorrente para ajustar a rota e sustentar decisões melhores ao longo do tempo.",
  },
];

export default function Home() {
  const root = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerSolid, setHeaderSolid] = useState(false);
  const [sent, setSent] = useState(false);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setIntroReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const updateHeader = () => setHeaderSolid(window.scrollY > 24);

    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  useGSAP(
    () => {
      if (!introReady) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        const introTargets = gsap.utils.toArray<HTMLElement>(
          ".nav-shell, .hero-kicker, .hero-line > span, .hero-copy, .hero-actions, .hero-visual",
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
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".nav-shell", { y: -24, opacity: 0, duration: 0.5 })
          .from(".hero-kicker", { y: 18, opacity: 0, duration: 0.4 }, "-=0.25")
          .from(".hero-line > span", { yPercent: 110, duration: 0.72, stagger: 0.07 }, "-=0.28")
          .from(".hero-copy", { y: 22, opacity: 0, duration: 0.5 }, "-=0.48")
          .from(".hero-actions", { y: 16, opacity: 0, duration: 0.45 }, "-=0.35")
          .from(".hero-visual", { clipPath: "inset(14% 10% 14% 10%)", scale: 1.06, opacity: 0, duration: 0.8 }, "-=0.7")
          .set(
            ".nav-shell, .hero-kicker, .hero-line > span, .hero-copy, .hero-actions, .hero-visual",
            { clearProps: "transform,opacity,clipPath" },
          );
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.fromTo(
          element,
          { y: reduceMotion ? 0 : 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: reduceMotion ? 0.32 : 0.85,
            ease: reduceMotion ? "none" : "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: element, start: "top 84%", once: true },
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
          scaleY: 0,
        }, {
          scaleY: 1,
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
      <header className={`nav-shell ${headerSolid || menuOpen ? "is-solid" : ""}`} aria-label="Navegação principal">
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
            <rect width="1600" height="900" fill="url(#hero-light)" />
            <rect x="610" width="990" height="900" fill="url(#hero-grid)" opacity="0.52" />

            <g className="hero-skyline" fill="none" stroke="#7ba5d3" strokeOpacity="0.2">
              <path d="M1030 0V296L1120 244V0" />
              <path d="M1280 0V292L1392 230V0" />
              <path d="M1478 0V182" />
              <path d="M904 0V365" />
            </g>

            <g className="hero-structure">
              <path d="M438 900L1088 304L1257 398L1257 900Z" fill="url(#hero-face-left)" />
              <path d="M1088 304L1257 398L1600 206V900H1257V398Z" fill="url(#hero-face-front)" />
              <path d="M739 900L1257 398L1600 589V900Z" fill="url(#hero-face-right)" fillOpacity="0.98" />

              <g fill="none" stroke="#83addb" strokeOpacity="0.2" strokeWidth="1.25">
                <path d="M594 900L1088 304" />
                <path d="M758 900L1088 304" />
                <path d="M920 900L1088 304" />
                <path d="M1088 304V900" />
                <path d="M1172 351V900" />
                <path d="M1257 398V900" />
                <path d="M1343 350V900" />
                <path d="M1430 301V900" />
                <path d="M1516 253V900" />
                <path d="M827 814L1257 398" />
                <path d="M919 900L1257 573" />
                <path d="M1257 565L1600 756" />
              </g>

              <path className="hero-edge-glow" d="M438 900L1088 304L1257 398L1600 206" fill="none" stroke="#a7c9ed" strokeWidth="3" filter="url(#hero-glow)" />
              <path className="hero-edge-runner" d="M438 900L1088 304L1257 398L1600 206" fill="none" stroke="#d4e7fb" strokeWidth="1.3" />
            </g>

            <g className="hero-orbit" fill="none" stroke="#8cb4df" strokeOpacity="0.22">
              <circle cx="1088" cy="304" r="22" />
              <circle cx="1088" cy="304" r="42" strokeDasharray="2 12" />
            </g>
          </svg>
          <div className="hero-visual-shade" />
        </div>

        <div className="hero-grid page-shell">
          <div className="hero-content">
            <p className="eyebrow hero-kicker"><span className="eyebrow-dot" /> Consultoria financeira para pessoas e empresas</p>
            <h1 className="hero-title" aria-label="Inteligência financeira para transformar decisões em patrimônio">
              <span className="hero-line"><span>Inteligência financeira</span></span>
              <span className="hero-line"><span>para transformar</span></span>
              <span className="hero-line accent-line"><span>decisões em patrimônio.</span></span>
            </h1>
            <p className="hero-copy">Planejamento, estratégia e acompanhamento para construir um futuro financeiro com mais clareza, segurança e liberdade.</p>
            <div className="hero-actions">
              <a className="text-link hero-cta-link" href="#contato">Fale com um especialista <ArrowUpRight size={18} /></a>
            </div>
          </div>
        </div>
        <div className="principles" aria-label="Princípios Assentin">
          <div className="principles-track">
            <span>Confiança</span><i />
            <span>Experiência</span><i />
            <span>Suporte</span><i />
            <span>Estratégia</span><i />
            <span>Evolução</span><i />
          </div>
        </div>
      </section>

      <section className="solutions section-light" id="solucoes">
        <div className="page-shell">
          <div className="section-heading" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" /> Soluções por perfil</p>
            <h2>Estratégia financeira feita para a sua realidade.</h2>
            <p>Necessidades diferentes pedem leituras diferentes. A mesma clareza para conduzir a vida financeira ou apoiar as decisões de um negócio.</p>
          </div>

          <div className="solution-grid">
            <article className="solution-card solution-personal" data-reveal>
              <div className="card-topline"><span>01 / PESSOAS</span><UserRound size={22} strokeWidth={1.5} /></div>
              <div>
                <h3>Para você</h3>
                <p>Organize escolhas, prioridades e objetivos com um plano que acompanha a sua vida.</p>
              </div>
              <ul>
                <li><Check size={15} /> Organização e diagnóstico financeiro</li>
                <li><Check size={15} /> Planejamento de objetivos e prioridades</li>
                <li><Check size={15} /> Acompanhamento recorrente da evolução</li>
              </ul>
              <a href="#contato">Entenda a solução <ArrowUpRight size={18} /></a>
            </article>

            <article className="solution-card solution-business" data-reveal>
              <div className="card-topline"><span>02 / EMPRESAS</span><Building2 size={22} strokeWidth={1.5} /></div>
              <div>
                <h3>Para empresas</h3>
                <p>Transforme dados financeiros em uma base mais segura para gerir, decidir e crescer.</p>
              </div>
              <ul>
                <li><Check size={15} /> Gestão financeira e fluxo de caixa</li>
                <li><Check size={15} /> DRE e indicadores gerenciais</li>
                <li><Check size={15} /> Apoio estratégico à tomada de decisão</li>
              </ul>
              <a href="#contato">Conheça a frente empresarial <ArrowUpRight size={18} /></a>
            </article>
          </div>
        </div>
      </section>

      <section className="method section-dark" id="metodo">
        <div className="page-shell method-layout">
          <div className="method-intro" data-reveal>
            <p className="eyebrow eyebrow-on-dark"><span className="eyebrow-dot" /> O jeito Assentin</p>
            <h2>Clareza para decidir.<br />Consistência para evoluir.</h2>
            <p>O futuro financeiro é construído em movimento. Nosso trabalho conecta leitura, estrutura e acompanhamento em uma jornada contínua.</p>
          </div>

          <div className="journey-grid">
            <div className="ascent-rail" aria-hidden="true"><span className="ascent-progress" /></div>
            {journey.map((item) => (
              <article className="journey-step" key={item.number} data-reveal>
                <span>{item.number}</span>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
                <ArrowUpRight size={24} strokeWidth={1.35} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="technology" id="tecnologia">
        <div className="page-shell tech-layout">
          <div className="tech-copy" data-reveal>
            <p className="eyebrow"><span className="eyebrow-dot" /> Tecnologia Assentin</p>
            <h2>Visão integrada para acompanhar o que importa.</h2>
            <p>A tecnologia faz parte da experiência: informação organizada, acompanhamento mais próximo e decisões com contexto.</p>
            <div className="tech-note"><Sparkles size={18} /><span>Um ecossistema pensado para unir inteligência humana e recursos digitais.</span></div>
            <a className="text-link dark-link" href="#contato">Conheça o ecossistema <ArrowRight size={17} /></a>
          </div>

          <div className="integrated-visual" data-reveal>
            <div className="media-placeholder integrated-placeholder" role="img" aria-label="Espaço reservado para a imagem da visão integrada Assentin">
              <div className="placeholder-grid" aria-hidden="true" />
              <div className="placeholder-copy">
                <span className="placeholder-icon"><MonitorUp size={21} strokeWidth={1.5} /></span>
                <div><small>Tecnologia Assentin</small><strong>Placeholder da visão integrada</strong><p>Formato recomendado: interface ou mockup horizontal, 1600 × 1100 px</p></div>
              </div>
              <span className="placeholder-code">IMG / 02</span>
            </div>
          </div>
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
            <h2>Seu futuro financeiro começa com uma boa conversa.</h2>
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
          <div className="footer-links"><div><span>Navegação</span>{navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div><div><span>Soluções</span><a href="#solucoes">Para você</a><a href="#solucoes">Para empresas</a><a href="#tecnologia">Tecnologia</a></div></div>
        </div>
        <div className="page-shell footer-bottom"><span>© 2026 Assentin. Todos os direitos reservados.</span><div><a href="#">Privacidade</a><a href="#">Termos de uso</a></div></div>
      </footer>
    </main>
  );
}
