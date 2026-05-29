const { useEffect, useRef, useState } = React;

const API_BASE_URL = window.ZEPTRIX_API_BASE_URL || "http://localhost:8000";
const API_URL = `${API_BASE_URL}/api/v1/contact`;

const routes = {
  "/": "home",
  "/index.html": "home",
  "/services.html": "services",
  "/about.html": "about",
  "/contact.html": "contact",
};

const navItems = [
  ["Home", "index.html", "home"],
  ["Services", "services.html", "services"],
  ["About", "about.html", "about"],
  ["Contact", "contact.html", "contact"],
];

const backendServices = [
  ["web_development", "Web Development"],
  ["ai_powered_websites", "AI Powered Websites"],
  ["ai_chatbot_development", "AI Chatbot Development"],
  ["workflow_automation", "Workflow Automation"],
  ["ai_customer_support", "AI Customer Care Systems"],
  ["custom_business_dashboards", "Custom Business Dashboards"],
  ["ai_voice_assistants", "AI Voice Assistants"],
  ["internal_ai_tools", "Internal AI Tools"],
  ["graphic_design", "Graphic Design"],
];

const serviceCards = [
  ["fa-globe", "Web Platforms", "Responsive React websites, landing systems, dashboards, and SEO-ready digital experiences."],
  ["fa-brain", "AI Applications", "LLM-powered assistants, internal AI tools, LangChain flows, and workflow automation."],
  ["fa-database", "Backend Systems", "FastAPI services, PostgreSQL storage, secure contact pipelines, and API integrations."],
  ["fa-diagram-project", "RAG Systems", "Retrieval augmented generation architecture for knowledge bases, research workflows, and company data."],
  ["fa-pen-nib", "Brand Interfaces", "Premium visual systems, graphic design, conversion sections, and campaign-ready assets."],
  ["fa-rocket", "Launch Growth", "SEO, prompt engineering, deployment guidance, analytics readiness, and post-launch refinement."],
];

const techStack = [
  ["PostgreSQL", "Structured database layer for saved enquiries, dashboards, and production data."],
  ["FastAPI", "High-performance Python backend for APIs, validation, and contact form submission."],
  ["ReactJS", "Component-based frontend interfaces with responsive, interactive user flows."],
  ["CSS", "Custom responsive styling, motion, glass UI, and polished visual systems."],
  ["Golang", "Fast backend services and systems programming where performance matters."],
  ["LangChain", "Composable AI workflows, tool calling, chains, and application orchestration."],
  ["LangGraph", "Stateful AI agents and graph-based flows for more controlled automation."],
  ["LLM", "Large language model integrations for assistants, content, automation, and analysis."],
  ["RAG Implementation", "Search and retrieval systems that ground AI responses in real business data."],
  ["SEO", "Search-ready structure, metadata thinking, performance, and content clarity."],
  ["Prompt Engineering", "Reusable prompt systems that make AI outputs sharper and more reliable."],
];

function App() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onPop = () => setRoute(getRoute());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    const titles = {
      home: "ZEPTRIX Tech Labs | AI Digital Innovation",
      services: "Services | ZEPTRIX Tech Labs",
      about: "About | ZEPTRIX Tech Labs",
      contact: "Contact | ZEPTRIX Tech Labs",
    };
    document.title = titles[route];
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [route]);

  function navigate(event, href) {
    event.preventDefault();
    window.history.pushState({}, "", href);
    setRoute(getRoute());
  }

  return (
    <>
      <NeuralScene />
      <div className="noise-layer" aria-hidden="true" />
      <a className="whatsapp-fab" href="https://wa.me/9715018359" target="_blank" aria-label="Contact ZEPTRIX on WhatsApp">
        <i className="fa-brands fa-whatsapp"></i><span>Contact</span>
      </a>
      <Header route={route} navigate={navigate} />
      <main className="page-shell">
        {route === "home" && <Home navigate={navigate} />}
        {route === "services" && <Services navigate={navigate} />}
        {route === "about" && <About />}
        {route === "contact" && <Contact />}
      </main>
      <Footer navigate={navigate} />
    </>
  );
}

function getRoute() {
  const fileName = window.location.pathname.split("/").pop() || "index.html";
  return routes[`/${fileName}`] || routes[window.location.pathname] || "home";
}

function Header({ route, navigate }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Primary navigation">
        <a className="brand" href="index.html" onClick={(event) => navigate(event, "index.html")} aria-label="ZEPTRIX home">
          <LogoLockup compact />
        </a>
        <button className={`menu-toggle ${open ? "is-open" : ""}`} type="button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span></span><span></span><span></span>
        </button>
        <ul className={`nav-links ${open ? "is-open" : ""}`}>
          {navItems.map(([label, href, key]) => (
            <li key={key}>
              <a className={route === key ? "active" : ""} href={href} onClick={(event) => { setOpen(false); navigate(event, href); }}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

function Home({ navigate }) {
  return (
    <>
      <section className="section hero">
        <div className="section-inner hero-grid">
          <div className="reveal is-visible">
            <LogoLockup hero />
            <div className="eyebrow">AI-powered digital systems</div>
            <h1 className="hero-title">Engineering the Future with <span className="gradient-text">AI & Digital Innovation</span></h1>
            <p className="hero-copy">ZEPTRIX Tech Labs builds fast React websites, intelligent software, automation systems, and premium brand experiences for teams ready to move beyond ordinary digital presence.</p>
            <div className="button-row">
              <a className="btn btn-primary" href="services.html" onClick={(event) => navigate(event, "services.html")}><i className="fa-solid fa-layer-group"></i>Explore Services</a>
              <a className="btn" href="contact.html" onClick={(event) => navigate(event, "contact.html")}><i className="fa-solid fa-arrow-right"></i>Start a Project</a>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>
      <section className="section">
        <div className="section-inner">
          <SectionHeading eyebrow="Core systems" title="Premium interfaces with practical AI engineering." text="Every build combines visual impact with real backend connections, database flow, and production-minded frontend architecture." />
          <CardGrid items={serviceCards.slice(0, 3)} />
        </div>
      </section>
      <Stats />
      <section className="section">
        <div className="section-inner split">
          <VisualCore />
          <div className="glass-panel reveal is-visible">
            <div className="eyebrow">Why ZEPTRIX</div>
            <h2>React frontend, FastAPI backend, AI workflows, and launch polish.</h2>
            <p className="lead">We design the layer users remember and engineer the layer businesses rely on: clean UI, strong performance, connected forms, useful automation, and clear delivery.</p>
            <div className="button-row">
              <a className="btn btn-primary" href="about.html" onClick={(event) => navigate(event, "about.html")}><i className="fa-solid fa-circle-info"></i>About the Lab</a>
              <a className="btn" href="contact.html" onClick={(event) => navigate(event, "contact.html")}><i className="fa-solid fa-paper-plane"></i>Send Brief</a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Services({ navigate }) {
  return (
    <>
      <section className="section hero">
        <div className="section-inner hero-grid">
          <div className="reveal is-visible">
            <div className="eyebrow">Service architecture</div>
            <h1 className="page-title">Digital systems that look unreal and work in the real world.</h1>
            <p className="hero-copy">Choose a focused service or combine multiple layers into a complete launch system: React interface, FastAPI backend, PostgreSQL data, AI workflows, and growth systems.</p>
            <div className="button-row">
              <a className="btn btn-primary" href="contact.html" onClick={(event) => navigate(event, "contact.html")}><i className="fa-solid fa-bolt"></i>Start a Project</a>
              <a className="btn" href="#tech-stack"><i className="fa-solid fa-code"></i>View Tech Stack</a>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>
      <section className="section">
        <div className="section-inner">
          <SectionHeading eyebrow="Capabilities" title="Holographic service cards, production deliverables." text="Every engagement is scoped around the outcome: credibility, automation, leads, internal speed, or a stronger operational product." />
          <CardGrid items={serviceCards} />
        </div>
      </section>
      <section className="section" id="tech-stack">
        <div className="section-inner">
          <SectionHeading eyebrow="Tech stack" title="The tools we use to build modern AI products." text="Our stack spans frontend, backend, database, AI orchestration, retrieval, search visibility, and prompt systems." />
          <div className="tech-stack-grid">
            {techStack.map(([name, text]) => (
              <article className="tech-pill reveal is-visible" key={name}>
                <strong>{name}</strong>
                <span>{text}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function About() {
  return (
    <>
      <section className="section hero">
        <div className="section-inner split">
          <div className="reveal is-visible">
            <div className="eyebrow">Inside the lab</div>
            <h1 className="page-title">A compact tech team building cinematic digital leverage.</h1>
            <p className="hero-copy">ZEPTRIX Tech Labs helps businesses, founders, and students turn ideas into sharp websites, intelligent tools, and deployable systems without losing momentum.</p>
          </div>
          <VisualCore />
        </div>
      </section>
      <Stats />
      <section className="section">
        <div className="section-inner split">
          <div className="glass-panel reveal is-visible">
            <div className="eyebrow">Operating principles</div>
            <h2>Make it premium. Make it useful. Make it ship.</h2>
            <p className="lead">We combine visual polish with practical engineering: responsive React, FastAPI endpoints, PostgreSQL storage, maintainable code, AI workflows, and business logic that keeps working after launch.</p>
          </div>
          <div className="timeline reveal is-visible">
            {[
              ["01 Scan", "Understand the signal", "We clarify audience, offer, workflow, deadline, and outcome before designing anything."],
              ["02 Shape", "Prototype the interface", "We design screens, interactions, and content structure around the goal."],
              ["03 Build", "Engineer the system", "Frontend, backend, forms, data, AI workflows, and integrations are connected with care."],
              ["04 Launch", "Deploy and refine", "We test responsiveness, polish motion, connect channels, and prepare the project for real users."],
            ].map(([step, title, text]) => (
              <div className="timeline-item" key={step}><strong>{step}</strong><div><h3>{title}</h3><p>{text}</p></div></div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", description: "", currency: "INR", budget: "" });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    let alive = true;
    fetch(`${API_BASE_URL}/health`)
      .then((response) => {
        if (alive) setApiStatus(response.ok ? "connected" : "offline");
      })
      .catch(() => {
        if (alive) setApiStatus("offline");
      });
    return () => {
      alive = false;
    };
  }, []);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function validate() {
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
  }

  async function submit(event) {
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
  }

  return (
    <section className="section">
      <div className="section-inner">
        <SectionHeading eyebrow="AI command center" title="Transmit your project brief." text="The React contact form posts directly to the FastAPI backend and stores submissions in PostgreSQL." h1 />
        
        <div className="contact-layout">
          <aside className="contact-visual glass-panel reveal is-visible">
            <VisualCore />
            <div className="contact-list">
              <a className="contact-line" href="tel:+919715018359"><i className="fa-solid fa-phone"></i><span><strong>Primary</strong>+91 97150 18359</span></a>
              <a className="contact-line" href="tel:+919361977522"><i className="fa-solid fa-signal"></i><span><strong>Studio</strong>+91 93619 77522</span></a>
              <a className="contact-line" href="https://www.instagram.com/zeptrixinfo" target="_blank"><i className="fa-brands fa-instagram"></i><span><strong>Instagram</strong>@zeptrixinfo</span></a>
              <a className="contact-line" href="https://www.linkedin.com/company/zeptrix-tech-labs" target="_blank"><i className="fa-brands fa-linkedin-in"></i><span><strong>LinkedIn</strong>ZEPTRIX Tech Labs</span></a>
              <a className="contact-line" href="mailto:zeptrixinfo@gmail.com"><i className="fa-solid fa-envelope"></i><span><strong>Email</strong>zeptrixinfo@gmail.com</span></a>
            </div>
          </aside>
          <section className="glass-panel reveal is-visible">
            <SectionHeading eyebrow="Project intake" title="Start the build sequence." text="Share the essentials and we will respond with the next practical step." />
            {success ? (
              <div className="form-success">
                <div className="success-icon"><i className="fa-solid fa-check"></i></div>
                <h3>Message received</h3>
                <p className="lead">Your details are stored and the ZEPTRIX team will reach out soon.</p>
                <button className="btn" type="button" onClick={() => { setSuccess(false); setForm({ name: "", email: "", phone: "", service: "", description: "", currency: "INR", budget: "" }); }}><i className="fa-solid fa-rotate-right"></i>Send another message</button>
              </div>
            ) : (
              <form className="form-grid" onSubmit={submit} noValidate>
                <Field icon="fa-user" label="Full name" id="name" value={form.name} error={errors.name} onChange={update} placeholder="Your name" />
                <Field icon="fa-envelope" label="Email address" id="email" type="email" value={form.email} error={errors.email} onChange={update} placeholder="you@example.com" />
                <Field icon="fa-phone" label="Phone number" id="phone" type="tel" value={form.phone} error={errors.phone} onChange={update} placeholder="+91 98765 43210" />
                <div className="field-group">
                  <label htmlFor="service">Service required</label>
                  <div className={`input-wrap ${errors.service ? "has-error" : ""}`}>
                    <i className="fa-solid fa-layer-group"></i>
                    <select id="service" value={form.service} onChange={(event) => update("service", event.target.value)} required>
                      <option value="">Select a service</option>
                      {backendServices.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                    </select>
                  </div>
                  <span className="field-error">{errors.service}</span>
                </div>
                <div className="field-group full">
                  <label htmlFor="description">Project details</label>
                  <div className={`input-wrap ${errors.description ? "has-error" : ""}`}>
                    <i className="fa-solid fa-message"></i>
                    <textarea id="description" value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Describe your goal, timeline, and any AI or web features you need." maxLength="2000" required />
                  </div>
                  <div className="char-count">{form.description.length} / 2000</div>
                  <span className="field-error">{errors.description}</span>
                </div>
                <div className="field-group full">
                  <label htmlFor="budget">Estimated budget</label>
                  <div className="budget-row">
                    <div className="input-wrap"><select id="currency" value={form.currency} onChange={(event) => update("currency", event.target.value)}><option value="INR">INR</option><option value="USD">USD</option></select></div>
                    <div className={`input-wrap ${errors.budget ? "has-error" : ""}`}><i className="fa-solid fa-wallet"></i><input id="budget" type="number" min="1" value={form.budget} onChange={(event) => update("budget", event.target.value)} placeholder="50000" required /></div>
                  </div>
                  <span className="field-error">{errors.budget}</span>
                </div>
                {globalError && <div className="form-error-global"><i className="fa-solid fa-circle-info"></i><span>{globalError}</span></div>}
                <button className="btn btn-primary field-group full" type="submit" disabled={loading}>
                  {loading ? <span><i className="fa-solid fa-circle-notch fa-spin"></i> Sending</span> : <span><i className="fa-solid fa-paper-plane"></i> Submit Transmission</span>}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

function Field({ icon, label, id, value, error, onChange, placeholder, type = "text" }) {
  return (
    <div className="field-group">
      <label htmlFor={id}>{label}</label>
      <div className={`input-wrap ${error ? "has-error" : ""}`}>
        <i className={`fa-solid ${icon}`}></i>
        <input id={id} type={type} value={value} onChange={(event) => onChange(id, event.target.value)} placeholder={placeholder} required />
      </div>
      <span className="field-error">{error}</span>
    </div>
  );
}

function SectionHeading({ eyebrow, title, text, h1 = false }) {
  return (
    <div className="section-heading reveal is-visible">
      <div className="eyebrow">{eyebrow}</div>
      {h1 ? <h1 className="page-title">{title}</h1> : <h2>{title}</h2>}
      {text && <p>{text}</p>}
    </div>
  );
}

function CardGrid({ items }) {
  return (
    <div className="grid-3">
      {items.map(([icon, title, text]) => (
        <article className="holo-card reveal is-visible" data-tilt key={title}>
          <span className="icon-chip"><i className={`fa-solid ${icon}`}></i></span>
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </div>
  );
}

function Stats() {
  return (
    <section className="section">
      <div className="section-inner stats-grid reveal is-visible">
        <div className="stat-panel"><strong>50+</strong><span>Projects delivered</span></div>
        <div className="stat-panel"><strong>24h</strong><span>Response target</span></div>
        <div className="stat-panel"><strong>11</strong><span>Core technologies</span></div>
        <div className="stat-panel"><strong>98%</strong><span>Client satisfaction focus</span></div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="hero-visual reveal is-visible" aria-hidden="true">
      <div className="holo-ring"></div><div className="holo-ring"></div><div className="holo-ring"></div><div className="holo-core"></div>
      <div className="interface-card card-a"><strong>React Experience Layer</strong><span>Reusable components, responsive layouts, and cinematic interactions.</span></div>
      <div className="interface-card card-b"><strong>AI Workflow Layer</strong><span>LangChain, LangGraph, LLM, RAG, and prompt systems for real use cases.</span></div>
      <div className="interface-card card-c"><strong>Backend Data Layer</strong><span>FastAPI and PostgreSQL connected to real business workflows.</span></div>
    </div>
  );
}

function VisualCore() {
  return (
    <div className="visual-core reveal is-visible" aria-hidden="true">
      <div className="holo-ring"></div><div className="holo-ring"></div><div className="holo-core"></div>
    </div>
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
    const amber = new THREE.Color("#f5c76b");
    const coral = new THREE.Color("#ff5c7a");
    scene.add(new THREE.AmbientLight(amber, 0.9));
    const point = new THREE.PointLight(coral, 16, 18);
    point.position.set(3, 4, 4);
    scene.add(point);
    const group = new THREE.Group();
    scene.add(group);
    group.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.35, 4), new THREE.MeshStandardMaterial({ color: "#060607", emissive: "#f5c76b", emissiveIntensity: 0.18, metalness: 0.9, roughness: 0.18, wireframe: true })));
    const ringGeometry = new THREE.TorusGeometry(2.05, 0.008, 12, 160);
    const rings = [0, 1, 2].map((index) => {
      const ring = new THREE.Mesh(ringGeometry, new THREE.MeshBasicMaterial({ color: amber, transparent: true, opacity: 0.42 }));
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

function Footer({ navigate }) {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <span>Copyright 2026 ZEPTRIX Tech Labs. All rights reserved.</span>
        <div className="footer-links">
          <a href="services.html" onClick={(event) => navigate(event, "services.html")}>Services</a>
          <a href="about.html" onClick={(event) => navigate(event, "about.html")}>About</a>
          <a href="contact.html" onClick={(event) => navigate(event, "contact.html")}>Contact</a>
          <a href="https://www.instagram.com/zeptrixinfo" target="_blank">Instagram</a>
          <a href="https://www.linkedin.com/company/zeptrix-tech-labs" target="_blank">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

function LogoLockup({ compact = false, hero = false }) {
  return (
    <span className={`zept-logo ${compact ? "zept-logo-compact" : ""} ${hero ? "zept-logo-hero" : ""}`}>
      <span className="robot-mark" aria-hidden="true">
        <span className="robot-antenna"></span>
        <span className="robot-head">
          <span className="robot-eye"></span>
          <span className="robot-eye"></span>
        </span>
        <span className="robot-arm robot-arm-left"></span>
        <span className="robot-arm robot-arm-right"></span>
      </span>
      <span className="zept-word-wrap">
        <span className="zept-word">Z<span className="zept-e">E</span>PTRIX</span>
        <span className="zept-tagline">AI SOLUTIONS. REAL IMPACT.</span>
      </span>
    </span>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
