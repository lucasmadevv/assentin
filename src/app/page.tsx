"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ImageIcon,
  Menu,
  MonitorUp,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { BrandPreloader } from "@/components/brand-preloader";

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
  const [sent, setSent] = useState(false);
  const [introReady, setIntroReady] = useState(false);

  const handlePreloaderComplete = useCallback(() => setIntroReady(true), []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useGSAP(
    () => {
      if (!introReady) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduceMotion) {
        const intro = gsap.timeline({ defaults: { ease: "none" } });
        intro
          .from(".nav-shell", { opacity: 0, duration: 0.24 })
          .from(".hero-kicker", { opacity: 0, duration: 0.2 }, "-=0.1")
          .from(".hero-line > span", { opacity: 0, duration: 0.24, stagger: 0.06 }, "-=0.08")
          .from(".hero-copy", { opacity: 0, duration: 0.2 }, "-=0.1")
          .from(".hero-actions", { opacity: 0, duration: 0.2 }, "-=0.1")
          .from(".hero-visual", { opacity: 0, duration: 0.28 }, "-=0.12")
          .from(".hero-index", { opacity: 0, duration: 0.2 }, "-=0.1");
      } else {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
        intro
          .from(".nav-shell", { y: -24, opacity: 0, duration: 0.7 })
          .from(".hero-kicker", { y: 20, opacity: 0, duration: 0.55 }, "-=0.2")
          .from(".hero-line > span", { yPercent: 110, duration: 0.9, stagger: 0.08 }, "-=0.25")
          .from(".hero-copy", { y: 24, opacity: 0, duration: 0.65 }, "-=0.4")
          .from(".hero-actions", { y: 18, opacity: 0, duration: 0.55 }, "-=0.4")
          .from(".hero-visual", { clipPath: "inset(14% 10% 14% 10%)", scale: 1.08, opacity: 0, duration: 1.1 }, "-=0.85")
          .from(".hero-index", { x: 18, opacity: 0, duration: 0.6 }, "-=0.45");
      }

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: reduceMotion ? 0 : 44,
          opacity: 0,
          duration: reduceMotion ? 0.32 : 0.85,
          ease: reduceMotion ? "none" : "power3.out",
          scrollTrigger: { trigger: element, start: "top 84%", once: true },
        });
      });

      if (reduceMotion) {
        gsap.from(".ascent-progress", {
          opacity: 0,
          duration: 0.32,
          ease: "none",
          scrollTrigger: {
            trigger: ".journey-grid",
            start: "top 76%",
            once: true,
          },
        });
      } else {
        gsap.fromTo(".ascent-progress", {
          scaleY: 0,
        }, {
          scaleY: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".journey-grid",
            start: "top 76%",
            once: true,
          },
        });
      }

      return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    },
    { scope: root, dependencies: [introReady], revertOnUpdate: true },
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <main ref={root} aria-busy={!introReady}>
      <BrandPreloader onComplete={handlePreloaderComplete} />
      <header className="nav-shell" aria-label="Navegação principal">
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
              <a className="button button-primary" href="#contato">Fale com um especialista <ArrowUpRight size={18} /></a>
              <a className="text-link" href="#solucoes">Conheça as soluções <ArrowDown size={16} /></a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="media-placeholder hero-media-placeholder" role="img" aria-label="Espaço reservado para a imagem principal da Assentin">
              <div className="placeholder-grid" aria-hidden="true" />
              <div className="placeholder-copy">
                <span className="placeholder-icon"><ImageIcon size={20} strokeWidth={1.5} /></span>
                <div><small>Imagem principal</small><strong>Placeholder da hero</strong><p>Formato recomendado: horizontal, 1920 × 1280 px</p></div>
              </div>
              <span className="placeholder-code">IMG / 01</span>
            </div>
            <div className="hero-monogram" aria-hidden="true"><i /><i /><i /></div>
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
