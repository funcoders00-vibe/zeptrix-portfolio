import React, { useEffect, useRef, useState } from "react";



const API_BASE_URL = window.ZEPTRIX_API_BASE_URL || "https://zeptrix-portfolio.onrender.com";
const API_URL = `${API_BASE_URL}/api/v1/contact`;

const routes = {
  "/": "home",
  "/index.html": "home",
  "/services.html": "services",
  "/about.html": "about",
  "/contact.html": "contact",
};

const backendServices = [
  ["web_development", "Web Development"],
  ["ai_powered_websites", "AI Powered Websites"],
  ["ai_chatbot_development", "AI Chatbot Development"],
  ["ai_customer_support", "AI Customer Care Systems"],
  ["custom_business_dashboards", "Custom Business Dashboards"],
  ["ai_voice_assistants", "AI Voice Assistants"],
  ["internal_ai_tools", "Internal AI Tools"],
  
];

function App() {
  const [route, setRoute] = useState(getRoute());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onPop = () => setRoute(getRoute());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const titles = {
      home: "ZEPTRIX | Engineering the Future Through AI",
      services: "Services | ZEPTRIX ",
      about: "About | ZEPTRIX ",
      contact: "Contact | ZEPTRIX",
    };
    document.title = titles[route] || "ZEPTRIX | Engineering the Future Through AI";

    const targetSection = {
      home: "hero",
      services: "services",
      about: "discovery",
      contact: "contact"
    }[route];

    if (targetSection) {
      const el = document.getElementById(targetSection);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [route]);

  useEffect(() => {
    const glow = document.getElementById("mouse-glow");
    if (!glow) return;
    const onPointerMove = (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.style.opacity = "1";
    };
    window.addEventListener("pointermove", onPointerMove);
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const targets = document.querySelectorAll(".reveal");
    targets.forEach((t) => observer.observe(t));

    return () => {
      targets.forEach((t) => observer.unobserve(t));
    };
  }, [route]);

  const navigate = (event, href, routeKey) => {
    event.preventDefault();
    window.history.pushState({}, "", href);
    setRoute(routeKey);
    setMenuOpen(false);
  };

  return (
    <>
      <NeuralScene />
      <div className="noise" aria-hidden="true" />
      <div className="mouse-glow" id="mouse-glow" aria-hidden="true" />

      <a className="whatsapp-fab" href="https://wa.me/918778785566" target="_blank" aria-label="WhatsApp">
        <i className="fab fa-whatsapp"></i><span className="fab-text">Contact Us</span>
      </a>

      <Header route={route} navigate={navigate} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <main className="page-shell">
        <Hero />
        <Discovery />
        <Technologies />
        <Services />
        <Why />
        <Process />
        <Portfolio />
        <Contact />
      </main>

      <Footer navigate={navigate} />
    </>
  );
}

function getRoute() {
  const fileName = window.location.pathname.split("/").pop() || "index.html";
  return routes[`/${fileName}`] || routes[window.location.pathname] || "home";
}

function Header({ route, navigate, menuOpen, setMenuOpen }) {
  return (
    <header className="site-header">
      <nav className="navbar" id="navbar">
        <a className="brand" href="index.html" onClick={(e) => navigate(e, "index.html", "home")} aria-label="ZEPTRIX home">
          <span className="logo-text">ZEP<span>TRIX</span></span>
        </a>
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          id="menu-toggle"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span><span></span><span></span>
        </button>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`} id="nav-links">
          <li>
            <a className={route === "about" ? "active" : ""} href="about.html" onClick={(e) => navigate(e, "about.html", "about")}>Discover</a>
          </li>
          <li>
            <a href="#technologies" onClick={(e) => { e.preventDefault(); setMenuOpen(false); document.getElementById("technologies").scrollIntoView({ behavior: "smooth" }); }}>Tech</a>
          </li>
          <li>
            <a className={route === "services" ? "active" : ""} href="services.html" onClick={(e) => navigate(e, "services.html", "services")}>Services</a>
          </li>
          <li>
            <a href="#process" onClick={(e) => { e.preventDefault(); setMenuOpen(false); document.getElementById("process").scrollIntoView({ behavior: "smooth" }); }}>Process</a>
          </li>
          <li>
            <a href="#portfolio" onClick={(e) => { e.preventDefault(); setMenuOpen(false); document.getElementById("portfolio").scrollIntoView({ behavior: "smooth" }); }}>Work</a>
          </li>
        </ul>
        <button className="nav-cta" onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}>
          Start Project
        </button>
      </nav>
    </header>
  );
}

function Hero() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resize();
    window.addEventListener("resize", resize);
    
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }
      
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.alpha})`;
        ctx.fill();
      }
    }
    
    for (let i = 0; i < 45; i++) {
      particles.push(new Particle());
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      ctx.strokeStyle = "rgba(59, 130, 246, 0.04)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="hero" id="hero">
      <canvas ref={canvasRef} id="particles-canvas" aria-hidden="true" style={{ width: "100%", height: "100%" }}></canvas>
      <div className="hero-inner">
        <div className="hero-eyebrow">
          <i className="fas fa-circle-dot" style={{ fontSize: "8px" }}></i>
          Welcome to ZEPTRIX
        </div>
        <h1 className="hero-title">
          Engineering the<br />
          <span className="blue">Future Through AI</span>
        </h1>
        <p className="hero-sub">
          ZEPTRIX builds AI-powered web platforms, intelligent software, and futuristic digital experiences that drive real business growth.
        </p>
        <div className="hero-btns">
          <button className="btn-primary" onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}>
            <i className="fas fa-rocket"></i> Start a Project
          </button>
          <button className="btn-ghost" onClick={() => document.getElementById("discovery").scrollIntoView({ behavior: "smooth" })}>
            <i className="fas fa-play"></i> Explore Services
          </button>
        </div>
      </div>
      <div className="scroll-indicator" onClick={() => document.getElementById("discovery").scrollIntoView({ behavior: "smooth" })}>
        <span>Enter the System</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
}

function Discovery() {
  return (
    <section className="section discovery" id="discovery">
      <div className="grid-bg" aria-hidden="true"></div>
      <div className="container">
        <div className="discovery-grid">
          <div>
            <div className="section-label reveal">Intelligence & Innovation</div>
            <h2 className="section-title reveal reveal-delay-1">We Build Intelligent Digital Systems</h2>
            <p className="section-sub reveal reveal-delay-2">
              AI-powered platforms, modern interfaces, and scalable technology designed for the next generation of business.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="reveal reveal-delay-3">
              <div className="why-point" style={{ padding: "20px", background: "var(--glass)", borderColor: "var(--glass-border)", border: "1px solid var(--glass-border)", borderRadius: "16px" }}>
                <div className="wp-icon"><i className="fas fa-brain"></i></div>
                <div>
                  <div className="wp-title">AI-First Architecture</div>
                  <div className="wp-desc">Every system we build is designed with AI capabilities at its core, not as an afterthought.</div>
                </div>
              </div>
              <div className="why-point" style={{ padding: "20px", background: "var(--glass)", borderColor: "var(--glass-border)", border: "1px solid var(--glass-border)", borderRadius: "16px" }}>
                <div className="wp-icon"><i className="fas fa-shield-halved"></i></div>
                <div>
                  <div className="wp-title">Production-Grade Engineering</div>
                  <div className="wp-desc">From MVP to scale — we deliver robust, maintainable code with full-stack precision.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="discovery-visual reveal reveal-delay-2">
            <div className="holo-orb">
              <div className="orb-ring"></div>
              <div className="orb-ring"></div>
              <div className="orb-ring"></div>
              <div className="orb-core"></div>
            </div>
            <div className="float-card fc-1">
              <strong>React Experience Layer</strong>
              <span>Reusable components, responsive layouts, cinematic interactions.</span>
            </div>
            <div className="float-card fc-2">
              <strong>AI Workflow Layer</strong>
              <span>LangChain, LLM, RAG systems for real-world automation.</span>
            </div>
            <div className="float-card fc-3">
              <strong>Backend Data Layer</strong>
              <span>FastAPI + PostgreSQL for production-ready pipelines.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const techStack = [
  ["ReactJS", "fab fa-react", "Component-based UI with interactive, responsive flows"],
  ["FastAPI", "fas fa-bolt", "High-performance Python backend for APIs & validation"],
  ["PostgreSQL", "fas fa-database", "Structured database layer for production data"],
  ["MongoDB", "fas fa-database", "Flexible document database for unstructured application data"],
  ["Supabase", "fas fa-server", "Open-source backend-as-a-service providing auth, database, and APIs"],
  ["LangChain", "fas fa-link", "Composable AI workflows & application orchestration"],
  ["RAG Systems", "fas fa-magnifying-glass", "AI responses grounded in real business data"],
  ["GitHub", "fab fa-github", "Version control, collaborative development, and automated CI/CD pipelines"],
  ["Vercel", "fas fa-cloud", "Serverless deployment platform for high-performance frontend interfaces"],
  ["Render", "fas fa-network-wired", "Modern cloud hosting for backend services, databases, and static sites"]
];

function Technologies() {
  return (
    <section className="section tech-section" id="technologies">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 64px" }}>
          <div className="section-label reveal" style={{ justifyContent: "center" }}>ZEPTRIX Control Center</div>
          <h2 className="section-title reveal reveal-delay-1">The Stack That Powers the Future</h2>
          <p className="section-sub reveal reveal-delay-2" style={{ marginLeft: "auto", marginRight: "auto" }}>
            Entering the ZEPTRIX technology core — a carefully selected arsenal of modern tools built for AI-era production systems.
          </p>
        </div>
        <div className="tech-grid">
          {techStack.map(([name, icon, desc], index) => (
            <div key={name} className={`tech-card reveal reveal-delay-${(index % 3) + 1}`}>
              <div className="tech-icon"><i className={icon}></i></div>
              <div className="tech-name">{name}</div>
              <div className="tech-desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const serviceCards = [
  ["fas fa-globe", "AI Web Applications", "Intelligent, responsive platforms powered by LLMs and modern React architecture. Every interface is designed to convert and engage.", "React + FastAPI"],
  ["fas fa-layer-group", "SaaS Development", "Full-stack SaaS platforms from idea to launch. Multi-tenant architecture, authentication, billing, and dashboards included.", "Full Stack"],
  ["fas fa-comments", "AI Chatbots", "Context-aware, LangChain-powered chatbots that handle support, sales, and internal Q&A with precision and personality.", "LangChain + LLM"],
  ["fas fa-gears", "Workflow Automation", "Replace repetitive manual tasks with intelligent AI agents. From data pipelines to customer journeys — automated end-to-end.", "AI Agents"],
  ["fas fa-chart-line", "Dashboard Systems", "Real-time analytics dashboards that visualize your most critical KPIs. Beautiful, fast, and connected to live data sources.", "Data + UI"],
  ["fas fa-server", "Backend APIs", "Scalable FastAPI services with PostgreSQL, authentication, rate limiting, webhooks, and complete API documentation.", "FastAPI + PostgreSQL"]
];

function Services() {
  return (
    <section className="section" id="services" style={{ background: "var(--bg)" }}>
      <div className="grid-bg" aria-hidden="true"></div>
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
          <div className="section-label reveal" style={{ justifyContent: "center" }}>AI Laboratory</div>
          <h2 className="section-title reveal reveal-delay-1">What We Build</h2>
          <p className="section-sub reveal reveal-delay-2" style={{ marginLeft: "auto", marginRight: "auto" }}>
            From intelligent web apps to autonomous automation pipelines — these are the digital systems we engineer for visionary companies.
          </p>
        </div>
        <div className="services-grid">
          {serviceCards.map(([icon, title, desc, tag], index) => (
            <div key={title} className={`service-card reveal reveal-delay-${(index % 3) + 1}`}>
              <div className="s-icon"><i className={icon}></i></div>
              <div className="s-title">{title}</div>
              <div className="s-desc">{desc}</div>
              <div className="s-tag">{tag}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const whyPoints = [
  ["fas fa-expand-arrows-alt", "Scalable Architecture", "Built from day one to grow with your business — no rewrites, no technical debt nightmares."],
  ["fas fa-gem", "Premium UI Design", "Interfaces that feel expensive and build instant trust with every user who lands on your platform."],
  ["fas fa-microchip", "AI-First Thinking", "We don't bolt on AI — we design intelligence into every layer of the system from the start."],
  ["fas fa-shipping-fast", "Fast Delivery", "Momentum matters. We move quickly without cutting corners, delivering quality on clear timelines."]
];

function Why() {
  return (
    <section className="section why-section" id="why">
      <div className="container">
        <div className="why-grid">
          <div>
            <div className="section-label reveal">Why Choose Us</div>
            <h2 className="section-title reveal reveal-delay-1">Built for Visionaries.<br />Engineered for Growth.</h2>
            <p className="section-sub reveal reveal-delay-2">
              We combine cinematic design with practical AI engineering. Every project is built to last, scale, and deliver measurable business outcomes.
            </p>
            <div className="why-points">
              {whyPoints.map(([icon, title, desc], index) => (
                <div key={title} className={`why-point reveal reveal-delay-${(index % 2) + 2}`}>
                  <div className="wp-icon"><i className={icon}></i></div>
                  <div>
                    <div className="wp-title">{title}</div>
                    <div className="wp-desc">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="stats-grid reveal reveal-delay-2">
            <StatCard targetCount={3} suffix="+" label="Projects Delivered" />
            <StatCard targetCount={4} suffix="" label="Core Technologies" />
            <StatCard targetCount={4} suffix="+" label="AI Solutions Built" />
            <StatCard targetCount={98} suffix="%" label="Client Satisfaction" />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ targetCount, suffix, label }) {
  const [count, setCount] = useState(0);
  const cardRef = useRef(null);

  useEffect(() => {
    let observer;
    let frameId;
    
    if (cardRef.current) {
      observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = targetCount;
          const duration = 2000;
          const startTime = performance.now();
          
          const update = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const easeProgress = progress * (2 - progress);
            const current = Math.floor(easeProgress * end);
            setCount(current);
            
            if (progress < 1) {
              frameId = requestAnimationFrame(update);
            }
          };
          
          frameId = requestAnimationFrame(update);
          observer.disconnect();
        }
      }, { threshold: 0.1 });
      
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (observer) observer.disconnect();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [targetCount]);

  return (
    <div className="stat-card" ref={cardRef}>
      <span className="stat-num">{count}{suffix}</span>
      <div className="stat-lbl">{label}</div>
    </div>
  );
}

const processSteps = [
  ["01", "Discover", "We map your audience, goals, workflow, and technical requirements before a single pixel is placed."],
  ["02", "Design", "Screens, interactions, and content structure are prototyped around the outcome — conversion, trust, speed."],
  ["03", "Build", "Frontend, backend, AI workflows, and data layers are engineered with precision and connected with care."],
  ["04", "Launch", "We test, polish, deploy, and prepare the system for real users — then support your growth beyond launch."]
];

function Process() {
  return (
    <section className="section process-section" id="process">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto" }}>
          <div className="section-label reveal" style={{ justifyContent: "center" }}>Mission Sequence</div>
          <h2 className="section-title reveal reveal-delay-1">The Build Journey</h2>
          <p className="section-sub reveal reveal-delay-2" style={{ marginLeft: "auto", marginRight: "auto" }}>
            Every engagement follows a clear mission path — from signal to launch, every phase is designed for clarity and momentum.
          </p>
        </div>
        <div className="process-flow">
          {processSteps.map(([num, title, desc], index) => (
            <div key={title} className={`process-step reveal reveal-delay-${index + 1}`}>
              <div className="step-num">{num}</div>
              <div className="step-title">{title}</div>
              <div className="step-desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const portfolioItems = [
  {
    tag: "AI Chatbot",
    title: "Intelligent Support Bot",
    desc: "Context-aware AI customer support system with RAG-powered knowledge retrieval.",
    emoji: "🤖",
    bg: "linear-gradient(135deg,#0B1023 0%,#1a2545 100%)",
    tags: ["LangChain", "FastAPI"]
  },
  {
    tag: "SaaS Dashboard",
    title: "Analytics Platform",
    desc: "Real-time KPI dashboard with AI-powered anomaly detection and automated reporting.",
    emoji: "📊",
    bg: "linear-gradient(135deg,#060d20 0%,#0d2040 100%)",
    tags: ["React", "PostgreSQL"]
  },
  {
    tag: "Automation",
    title: "Workflow Engine",
    desc: "End-to-end business process automation with AI agents replacing 40+ manual tasks daily.",
    emoji: "⚡",
    bg: "linear-gradient(135deg,#080f22 0%,#132240 100%)",
    tags: ["AI Agents", "Python"]
  },
  {
    tag: "Web Platform",
    title: "AI-Powered SaaS",
    desc: "Full-stack SaaS product with LLM integrations, multi-tenant architecture, and custom branding.",
    emoji: "🌐",
    bg: "linear-gradient(135deg,#060d1e 0%,#112035 100%)",
    tags: ["Full Stack", "React"]
  },
  {
    tag: "RAG System",
    title: "Knowledge Platform",
    desc: "Company-wide AI knowledge base with retrieval-augmented generation for instant answers.",
    emoji: "🔍",
    bg: "linear-gradient(135deg,#070e20 0%,#0c1d3a 100%)",
    tags: ["RAG", "LLM"]
  }
];

function Portfolio() {
  return (
    <section className="section portfolio-section" id="portfolio">
      <div className="container">
        <div className="section-label reveal">Portfolio Universe</div>
        <h2 className="section-title reveal reveal-delay-1">Systems We've Shipped</h2>
        <p className="section-sub reveal reveal-delay-2">Scroll through the ZEPTRIX digital ecosystem — a showcase of AI platforms, intelligent tools, and premium interfaces.</p>
      </div>
      <div className="portfolio-scroll-wrap reveal reveal-delay-3" style={{ paddingLeft: "calc((100vw - 1200px)/2 + 24px)" }}>
        <div className="portfolio-track">
          {portfolioItems.map((item, index) => (
            <div key={item.title} className="portfolio-card">
              <div className="pc-bg" style={{ background: item.bg }}>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "80px", opacity: 0.12 }}>{item.emoji}</div>
                <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", height: "1px", background: "linear-gradient(90deg,transparent,rgba(59,130,246,0.4),transparent)" }}></div>
                <div style={{ position: "absolute", bottom: "60px", left: "20px", right: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {item.tags.map(t => (
                    <div key={t} style={{ padding: "6px 14px", borderRadius: "8px", background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)", fontSize: "11px", color: "var(--blue)" }}>{t}</div>
                  ))}
                </div>
              </div>
              <div className="pc-overlay"></div>
              <div className="pc-arrow"><i className="fas fa-arrow-up-right"></i></div>
              <div className="pc-content">
                <div className="pc-tag">{item.tag}</div>
                <div className="pc-title">{item.title}</div>
                <div className="pc-desc">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section contact-section" id="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <div className="section-label reveal">Transmission Portal</div>
            <h2 className="section-title reveal reveal-delay-1">Start Your Next Digital Evolution</h2>
            <p className="section-sub reveal reveal-delay-2">
              Send a signal to the ZEPTRIX lab. Share your vision and we'll respond within 24 hours with the next practical step.
            </p>
            <div className="contact-channels reveal reveal-delay-3">
              <a className="contact-channel" href="tel:+9173586 26592">
                <div className="ch-icon"><i className="fas fa-phone"></i></div>
                <div><div className="ch-label">Primary</div><div className="ch-value">+91 73586 26592</div></div>
              </a>
              <a className="contact-channel" href="tel:+918778785566">
                <div className="ch-icon"><i className="fas fa-signal"></i></div>
                <div><div className="ch-label">Studio</div><div className="ch-value">+91 8778785566</div></div>
              </a>
              <a className="contact-channel" href="mailto:visswa3104@gmail.com">
                <div className="ch-icon"><i className="fas fa-envelope"></i></div>
                <div><div className="ch-label">Email</div><div className="ch-value">viswa3104@gmail.com</div></div>
              </a>
              <a className="contact-channel" href="https://www.instagram.com/zeptrix.in" target="_blank">
                <div className="ch-icon"><i className="fab fa-instagram"></i></div>
                <div><div className="ch-label">Instagram</div><div className="ch-value">@zeptrixinfo</div></div>
              </a>
              <a className="contact-channel" href="https://www.linkedin.com/in/zeptrix-in-76b054411" target="_blank">
                <div className="ch-icon"><i className="fab fa-linkedin-in"></i></div>
                <div><div className="ch-label">LinkedIn</div><div className="ch-value">ZEPTRIX</div></div>
              </a>
            </div>
          </div>
          <div className="form-panel reveal reveal-delay-2" id="contact-form-panel">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", description: "", currency: "INR", budget: "" });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Name must be at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    const digits = form.phone.replace(/[\s\-()+]/g, "");
    if (!/^\d{7,15}$/.test(digits)) next.phone = "Phone must be 7-15 digits.";
    if (!form.service) next.service = "Please select a service.";
    if (form.description.trim().split(/\s+/).length < 3) next.description = "Please describe your project in at least 3 words.";
    if (!Number.isFinite(Number(form.budget)) || Number(form.budget) <= 0) next.budget = "Enter a valid positive budget.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (event) => {
    event.preventDefault();
    setGlobalError("");
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, budget: Number(form.budget) }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setSuccess(true);
        return;
      }
      if (response.status === 422 && Array.isArray(data.detail)) {
        setGlobalError(data.detail.map((item) => item.msg).join(" "));
      } else {
        setGlobalError(typeof data.detail === "string" ? data.detail : "Something went wrong. Please try again.");
      }
    } catch (error) {
      setGlobalError("Could not reach the backend. Start FastAPI on http://localhost:8000 and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="form-success">
        <div className="success-orb"><i className="fas fa-check"></i></div>
        <h3 style={{ fontFamily: "var(--font-head)", fontSize: "28px", marginBottom: "12px" }}>Transmission Sent</h3>
        <p style={{ color: "var(--muted)", marginBottom: "28px" }}>Your signal has been received. The ZEPTRIX team will respond within 24 hours.</p>
        <button className="submit-btn" type="button" onClick={() => { setSuccess(false); setForm({ name: "", email: "", phone: "", service: "", description: "", currency: "INR", budget: "" }); }}>
          Send Another Signal
        </button>
      </div>
    );
  }

  return (
    <form className="form-grid" onSubmit={submit} noValidate>
      <div className="field">
        <label htmlFor="name">Full Name</label>
        <input type="text" id="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Arjun Kumar" required />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>
      <div className="field">
        <label htmlFor="email">Email Address</label>
        <input type="email" id="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" required />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>
      <div className="field">
        <label htmlFor="phone">Phone Number</label>
        <input type="tel" id="phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" required />
        {errors.phone && <span className="field-error">{errors.phone}</span>}
      </div>
      <div className="field">
        <label htmlFor="service">Service Required</label>
        <select id="service" value={form.service} onChange={(e) => update("service", e.target.value)} required>
          <option value="">Select a service</option>
          {backendServices.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
        </select>
        {errors.service && <span className="field-error">{errors.service}</span>}
      </div>
      <div className="field full">
        <label htmlFor="budget">Estimated Budget</label>
        <div className="field-row">
          <select id="currency" value={form.currency} onChange={(e) => update("currency", e.target.value)} style={{ width: "120px" }}>
            <option value="INR">INR</option>
            <option value="USD">USD</option>
          </select>
          <input type="number" id="budget" value={form.budget} onChange={(e) => update("budget", e.target.value)} placeholder="e.g. 50000" required />
        </div>
        {errors.budget && <span className="field-error">{errors.budget}</span>}
      </div>
      <div className="field full">
        <label htmlFor="description">Project Details</label>
        <textarea id="description" value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe your goals, requirements, timeline, etc." required />
        {errors.description && <span className="field-error">{errors.description}</span>}
      </div>
      {globalError && <div className="field full field-error" style={{ textAlign: "center", padding: "10px", background: "rgba(248,113,113,0.1)", borderRadius: "8px" }}>{globalError}</div>}
      <button className="submit-btn field full" type="submit" disabled={loading}>
        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
        {loading ? " Transmitting..." : " Submit Transmission"}
      </button>
    </form>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo-text">ZEP<span>TRIX</span></div>
          <div className="footer-tagline">Engineering the Future Through AI</div>
        </div>
        <div className="footer-links">
          <a href="services.html" onClick={(e) => navigate(e, "services.html", "services")}>Services</a>
          <a href="about.html" onClick={(e) => navigate(e, "about.html", "about")}>About</a>
          <a href="contact.html" onClick={(e) => navigate(e, "contact.html", "contact")}>Contact</a>
        </div>
        <div className="footer-social">
          <a className="social-btn" href="https://www.instagram.com/zeptrix.in" target="_blank" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          <a className="social-btn" href="https://www.linkedin.com/in/zeptrix-in-76b054411" target="_blank" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
          <a className="social-btn" href="mailto:viswa3104@gmail.com" aria-label="Email"><i className="fas fa-envelope"></i></a>
        </div>
        <div className="footer-copy">
          © 2026 ZEPTRIX. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function NeuralScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !window.THREE || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 8);
    const cyanColor = new THREE.Color("#00e5ff");
    const blueColor = new THREE.Color("#0066ff");
    scene.add(new THREE.AmbientLight(cyanColor, 0.9));
    const point = new THREE.PointLight(blueColor, 16, 18);
    point.position.set(3, 4, 4);
    scene.add(point);
    const group = new THREE.Group();
    scene.add(group);
    group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 4), new THREE.MeshStandardMaterial({ color: "#05080c", emissive: "#00e5ff", emissiveIntensity: 0.18, metalness: 0.9, roughness: 0.18, wireframe: true })));
    const ringGeometry = new THREE.TorusGeometry(2.05, 0.008, 12, 160);
    const rings = [0, 1, 2].map((index) => {
      const ring = new THREE.Mesh(ringGeometry, new THREE.MeshBasicMaterial({ color: cyanColor, transparent: true, opacity: 0.42 }));
      ring.rotation.x = Math.PI / (index + 2);
      ring.rotation.y = index * 0.75;
      group.add(ring);
      return ring;
    });
    const pointer = { x: 0, y: 0 };
    const move = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight, false);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("resize", resize);
    resize();
    let frame = 0;
    const animate = (now) => {
      const time = now * 0.001;
      group.rotation.y = time * 0.18 + pointer.x * 0.16;
      group.rotation.x = pointer.y * 0.12;
      rings.forEach((ring, index) => { ring.rotation.z = time * (0.26 + index * 0.06); });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("resize", resize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="neural-scene" className="scene-canvas" aria-hidden="true"></canvas>;
}

export default App;
