import { useEffect, useState } from 'react';
import { AGENTS, AgentTile, Icon } from './components';
import type { AgentColor, AgentId, IconName } from './components';
import { DemoFlow } from './DemoFlow';
import sc01 from './assets/sc01.png';
import sc03 from './assets/sc03.png';
import sc04 from './assets/sc04.png';

// === THEME TOGGLE ===
type Theme = 'dark' | 'light';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'),
  );
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      try {
        localStorage.setItem('topsc-theme', 'light');
      } catch {}
    } else {
      document.documentElement.removeAttribute('data-theme');
      try {
        localStorage.removeItem('topsc-theme');
      } catch {}
    }
  }, [theme]);
  const next: Theme = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(next)}
      title={`Switch to ${next} mode`}
      aria-label="Toggle theme"
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
    </button>
  );
};

// === NAV ===
const Nav = () => (
  <nav className="nav">
    <div className="nav-inner">
      <a href="#" className="brand">
        <div className="brand-mark" />
        <div>
          <div className="brand-name">TopSC</div>
          <div className="brand-tag">GTM · OWNERSHIP READINESS</div>
        </div>
      </a>
      <div className="nav-links">
        <a href="#agents">Agents</a>
        <a href="#workspace">Workspace</a>
        <a href="#brand">Brand Dashboard</a>
        <a href="#sc01">SC01 Case</a>
        <a href="#service">Warranty</a>
      </div>
      <div className="nav-cta">
        <ThemeToggle />
        <a href="#" className="btn btn-ghost btn-sm">
          Sign in
        </a>
        <a href="#demo" className="btn btn-primary btn-sm">
          Hire TopSC <span className="arrow">→</span>
        </a>
      </div>
    </div>
  </nav>
);

// === HERO ===
const Hero = () => (
  <header className="hero">
    <div className="shell hero-grid">
      <div className="hero-text">
        <span className="eyebrow">SC01 · buyer welcome</span>
        <h1 style={{ marginTop: 24 }}>
          Congratulations.<br />
          You just bought a <strong>serious performance EV.</strong>
        </h1>

        <div className="order-card">
          <div className="order-card-head">
            <span className="status-pill">
              <span className="status-dot" />
              ORDER LOCKED · IN PRODUCTION
            </span>
            <span className="order-card-line">L. Vogel · Milano</span>
          </div>
          <div className="order-card-body">
            <div>
              <div className="label">Order</div>
              <div className="order-card-v mono">SC01-EU-0247</div>
            </div>
            <div>
              <div className="label">Factory dispatch</div>
              <div className="order-card-v mono">Jul 22, 2026</div>
            </div>
            <div>
              <div className="label">Color</div>
              <div className="order-card-v">
                <span className="color-swatch" />
                <span className="mono">Solar Orange</span>
              </div>
            </div>
          </div>
          <div className="order-card-foot">
            <div className="order-card-foot-left">
              <span className="order-card-foot-icon">
                <Icon name="shield" size={13} />
              </span>
              <div>
                <div className="order-card-foot-title">
                  Unlocked by <strong>TopSC Concierge</strong>
                </div>
                <div className="order-card-foot-sub">
                  Parking permit · home charger install · paperwork · EU service network
                </div>
              </div>
            </div>
            <div className="order-card-foot-right">
              <span className="order-card-foot-amount mono">€1,000</span>
              <span className="order-card-foot-paid">PAID</span>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 17, marginTop: 24, color: 'var(--text-1)', lineHeight: 1.55, maxWidth: 540 }}>
          There's still a bit of setup between you and the keys — parking, home charging, paperwork, service network. None of it is yours to figure
          out. We've put together a serious concierge service that handles the whole thing for you.
        </p>

        <div className="offer-strip">
          <div className="offer-strip-price">
            <span className="offer-currency">€</span>
            <span className="offer-amount-sm">1,000</span>
          </div>
          <div className="offer-strip-divider" />
          <div className="offer-strip-text">
            The whole onboarding — reservation to delivery. Simple, calm, actually enjoyable.
          </div>
          <a className="btn btn-blue offer-strip-cta" href="#demo">
            Hire TopSC <span className="arrow">→</span>
          </a>
        </div>
      </div>

      <div className="hero-photo">
        <img src={sc01} alt="SC01 sports car arriving at port" />
        <div className="hero-photo-tag">
          <span className="mono">YOUR SC01 · EU PORT ARRIVAL</span>
        </div>
      </div>
    </div>
  </header>
);

// === PROBLEMS ===
const Problems = () => {
  const items: { icon: IconName; q: string; d: string }[] = [
    { icon: 'plug', q: 'Can I charge it at home?', d: 'Most buyers in EU apartments share a parking sublevel — home charging is a permission problem, not just a hardware one.' },
    { icon: 'doc', q: 'Will my building approve the charger?', d: 'Property managers, HOAs, and Eigentümergemeinschaften each have their own approval path. Buyers do not know which form to send first.' },
    { icon: 'globe', q: 'Local registration and EV incentives?', d: 'Each market has its own VIN homologation, type-approval, and grant schemes. One pothole and the order stalls.' },
    { icon: 'wrench', q: 'Who repairs the car nearby?', d: 'Without a dealer footprint, buyers do not know who will change a tire, fix bodywork, or align brakes.' },
    { icon: 'shield', q: 'Who talks to the manufacturer?', d: 'When something goes wrong, the buyer needs someone fluent in the right language, with photos, error codes, and a case file.' },
  ];
  return (
    <section className="section" id="problem">
      <div className="shell">
        <div className="section-header">
          <span className="eyebrow">The real bottleneck</span>
          <h2>Demand is not the problem. Ownership uncertainty is.</h2>
          <p style={{ fontSize: 15.5, marginTop: 6 }}>
            EU buyers are ready to buy an imported EV. What they aren't ready for is the operational gap between reservation and delivery — and
            the support void after it.
          </p>
        </div>
        <div className="problem-grid">
          {items.map((it, i) => (
            <div className="problem-card" key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="icon">
                  <Icon name={it.icon} size={18} />
                </div>
                <span className="nr">P0{i + 1}</span>
              </div>
              <h4>{it.q}</h4>
              <p>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// === FOUR AGENTS ===
type AgentCard = { id: AgentId; cls: string; purpose: string; features: string[]; boundary?: string };
const Agents = () => {
  const cards: AgentCard[] = [
    {
      id: 'parking',
      cls: '',
      purpose:
        'Checks parking conditions, generates property and landlord letters, and coordinates the production-to-delivery timeline across every party.',
      features: [
        'Parking type assessment',
        'Property / landlord letter generation',
        'Buyer readiness score',
        'Production and logistics timeline',
        'Task assignment across buyer, brand, importer, partners',
      ],
    },
    {
      id: 'charging',
      cls: 'g',
      purpose:
        'Handles home charger readiness, local approval workflow, installer matching, registration checklists, and EV incentive applications.',
      features: [
        'Charging feasibility score',
        'Local approval process (HOA / building / utility)',
        'Certified installer outreach',
        'Import & registration document checklist',
        'EV subsidy / incentive eligibility check',
      ],
    },
    {
      id: 'service',
      cls: 'a',
      purpose:
        'Finds local repair shops for non-battery issues and bridges communication with the Chinese manufacturer in the right language.',
      features: [
        'Nearby EV-friendly garage search',
        'Tire · brake · suspension · body shop matching',
        'Multi-language repair brief',
        'Chinese manufacturer communication summary',
        'Repair quote & appointment coordination',
      ],
      boundary: 'High-voltage battery work is never handled locally — it is escalated to manufacturer-authorized channels.',
    },
    {
      id: 'warranty',
      cls: 'v',
      purpose:
        'Tracks warranty cases, binds motor insurance, collects evidence, generates manufacturer summaries, and helps brands manage aftersales risk patterns.',
      features: [
        'Warranty case intake',
        'Motor insurance binding (NY FS-20 / polizza RCA)',
        'Specialty carrier routing for import VINs',
        'Evidence checklist (video · OBD · invoice)',
        'Chinese technical summary for manufacturer',
        'Case status tracking · pattern detection',
      ],
    },
  ];
  return (
    <section className="section" id="agents">
      <div className="shell">
        <div className="section-header">
          <span className="eyebrow">The four-agent system</span>
          <h2>Four AI agents that turn uncertainty into managed tasks.</h2>
          <p style={{ fontSize: 15.5, marginTop: 6 }}>
            Each agent owns one phase of the imported-EV lifecycle. They share a task graph, a contact graph, and one buyer record — so handoffs
            do not drop.
          </p>
        </div>
        <div className="agents-grid">
          {cards.map((c) => (
            <div className={`agent-card ${c.cls}`} key={c.id}>
              <div className="head">
                <AgentTile id={c.id} lg />
                <div className="meta">
                  <h3>{AGENTS[c.id].name} Agent</h3>
                  <div className="role">{AGENTS[c.id].code} · always-on</div>
                </div>
                <span className={`badge ${AGENTS[c.id].color}`}>ACTIVE</span>
              </div>
              <p className="purpose">{c.purpose}</p>
              <ul>
                {c.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              {c.boundary && (
                <div className="boundary">
                  <strong>Boundary:</strong> {c.boundary}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// === DEMO ===
const Demo = () => (
  <section className="section" id="demo">
    <div className="shell">
      <div className="h2-row">
        <div>
          <span className="eyebrow">Try it · type your address</span>
          <h2 style={{ marginTop: 14 }}>Start from where you live.<br/>The whole service unfolds from there.</h2>
          <p>
            Pick an address — a villetta in Volpiano (TO), a single-family in Massapequa NY, or a heritage palazzo in Torino centro. Every step
            uses the actual local rules: art. 1122-bis comunicazione vs Town of Hempstead permit, e-distribuzione vs PSEG Long Island, Ecobonus
            50% vs IRS §30C, NY FS-20 vs polizza RCA. Files and forms fill in on the right as you go.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <span className="badge green">LIVE · ADDRESS-DRIVEN</span>
          <span className="badge muted">EU + US</span>
        </div>
      </div>
      <DemoFlow />
    </div>
  </section>
);

// === KANBAN ===
type KanbanRisk = 'low' | 'med' | 'high';
type KanbanTask = { title: string; agent: AgentId; who: string; due: string; risk: KanbanRisk; done?: boolean };
const Kanban = () => {
  const cols: { name: string; count: number; tasks: KanbanTask[] }[] = [
    {
      name: 'Pending',
      count: 2,
      tasks: [
        { title: 'Check local charger incentive eligibility (KfW 442)', agent: 'charging', who: 'Buyer', due: 'May 19', risk: 'low' },
        { title: 'Prepare import & registration checklist', agent: 'charging', who: 'Importer', due: 'May 22', risk: 'med' },
      ],
    },
    {
      name: 'In progress',
      count: 3,
      tasks: [
        { title: 'Draft property manager letter', agent: 'parking', who: 'Agent', due: 'May 16', risk: 'low' },
        { title: 'Request installer quote · WallboxPro', agent: 'charging', who: 'Agent', due: 'May 17', risk: 'low' },
        { title: 'Contact 3 nearby EV-friendly garages', agent: 'service', who: 'Agent', due: 'May 18', risk: 'low' },
      ],
    },
    {
      name: 'Waiting · external',
      count: 2,
      tasks: [
        { title: 'Property manager approval', agent: 'parking', who: 'Schwabing-West GmbH', due: 'May 24', risk: 'med' },
        { title: 'Confirm delivery timeline with importer', agent: 'parking', who: 'EU Distributor', due: 'May 20', risk: 'high' },
      ],
    },
    {
      name: 'Done',
      count: 2,
      tasks: [
        { title: 'Create warranty profile for vehicle', agent: 'warranty', who: 'Agent', due: 'May 14', risk: 'low', done: true },
        { title: 'Generate EV readiness report', agent: 'parking', who: 'Agent', due: 'May 13', risk: 'low', done: true },
      ],
    },
  ];
  return (
    <section className="section" id="workspace">
      <div className="shell">
        <div className="section-header">
          <span className="eyebrow">Agent workspace</span>
          <h2>Every blocker becomes a task.</h2>
          <p style={{ fontSize: 15.5, marginTop: 6 }}>
            Agents do not just respond. They route — by owner, deadline, and risk — across buyer, brand, importer, installer, garage, and
            manufacturer.
          </p>
        </div>
        <div className="kanban">
          {cols.map((col) => (
            <div className="kanban-col" key={col.name}>
              <div className="kanban-col-head">
                <span className="name">{col.name}</span>
                <span className="count">{col.count}</span>
              </div>
              <div className="kanban-list">
                {col.tasks.map((t, i) => (
                  <div className="task-card" key={i}>
                    <div className="title">{t.title}</div>
                    <div className="row">
                      <div className="meta">
                        <AgentTile id={t.agent} />
                        <span>{t.who}</span>
                      </div>
                      {t.done ? <span className="badge green">DONE</span> : <span className={`risk-dot risk-${t.risk}`} />}
                    </div>
                    <div className="row">
                      <span className="due">Due · {t.due}</span>
                      <span
                        className="mono"
                        style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}
                      >
                        {t.done ? '' : `Risk ${t.risk}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// === BRAND DASHBOARD ===
const BrandDash = () => {
  const kpis = [
    { v: '1,000', k: 'European allocation', d: 'SC01 limited release' },
    { v: '238', k: 'Reservations tracked', d: '23.8% of allocation' },
    { v: '146', k: 'Delivery-ready buyers', d: '61% of pipeline' },
    { v: '52', k: 'Charging-blocked', d: 'Property mgr pending' },
    { v: '31', k: 'Property approval pending', d: 'Avg wait 11 days' },
    { v: '87', k: 'Installer matches', d: 'Across 4 markets' },
    { v: '64', k: 'Repair partners', d: 'Non-battery only' },
    { v: '12', k: 'Open warranty cases', d: 'Avg resolution 4.8d' },
    { v: '4.8d', k: 'Avg case resolution', d: 'Trending −12% wk/wk' },
  ];
  const markets: { name: string; x: number; y: number; color: AgentColor; state: string; stat: string }[] = [
    { name: 'Italy', x: 47, y: 71, color: 'green', state: 'Launch market', stat: '94 reservations' },
    { name: 'Germany', x: 51, y: 38, color: 'green', state: 'Strong charging demand', stat: '68 reservations' },
    { name: 'France', x: 36, y: 55, color: 'green', state: 'Property approval workflow', stat: '42 reservations' },
    { name: 'United Kingdom', x: 27, y: 28, color: 'green', state: 'Grant eligibility workflow', stat: '34 reservations' },
  ];
  return (
    <section className="section" id="brand">
      <div className="shell">
        <div className="section-header">
          <span className="eyebrow">Brand dashboard · operator view</span>
          <h2>Give emerging EV brands a lightweight local service layer.</h2>
          <p style={{ fontSize: 15.5, marginTop: 6 }}>
            One control surface for the brand and its importers — pipeline health, blockers, capacity, and aftersales risk across every European
            market.
          </p>
        </div>

        <div className="dash">
          <div className="card">
            <div className="card-head">
              <h4>SC01 Europe · operational KPIs</h4>
              <span className="badge green">+6.4% wk/wk</span>
            </div>
            <div style={{ padding: 18 }}>
              <div className="kpi-grid">
                {kpis.map((k) => (
                  <div className="kpi" key={k.k}>
                    <div className="v">{k.v}</div>
                    <div className="k">{k.k}</div>
                    <div className="d">{k.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <h4>Market readiness · pilot countries</h4>
              <span className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>
                4 ACTIVE
              </span>
            </div>
            <div style={{ padding: 14 }}>
              <div className="eu-map">
                <svg
                  viewBox="0 0 100 60"
                  preserveAspectRatio="none"
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}
                >
                  <path
                    d="M10 28 L18 18 L28 14 L40 12 L52 14 L62 12 L70 16 L74 22 L78 26 L82 32 L78 38 L70 42 L62 44 L52 46 L44 48 L36 50 L28 50 L20 46 L14 40 L10 34 Z"
                    fill="none"
                    stroke="var(--border-2)"
                    strokeWidth="0.4"
                  />
                  <path d="M30 32 L34 30 L40 32 L42 36 L40 38 L34 38 L30 36 Z" fill="var(--surface-2)" stroke="var(--border-2)" strokeWidth="0.3" />
                  <path d="M48 28 L54 26 L58 30 L56 36 L50 38 L46 34 Z" fill="var(--surface-2)" stroke="var(--border-2)" strokeWidth="0.3" />
                  <path d="M44 42 L50 42 L52 50 L48 56 L42 52 Z" fill="var(--surface-2)" stroke="var(--border-2)" strokeWidth="0.3" />
                  <path d="M24 20 L30 18 L32 24 L28 28 L22 26 Z" fill="var(--surface-2)" stroke="var(--border-2)" strokeWidth="0.3" />
                </svg>
                {markets.map((m) => (
                  <div key={m.name} className={`country-pin ${m.color}`} style={{ left: m.x + '%', top: m.y + '%' }} title={m.name}>
                    <span className="lbl">{m.name}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {markets.map((m) => (
                  <div
                    key={m.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      background: 'var(--bg-2)',
                      borderRadius: 8,
                      border: '1px solid var(--border-1)',
                    }}
                  >
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 8px var(--green)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: 'var(--text-0)' }}>{m.name}</div>
                      <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 2 }}>
                        {m.state}
                      </div>
                    </div>
                    <span className="mono" style={{ fontSize: 11.5, color: 'var(--text-1)' }}>
                      {m.stat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// === SC01 ===
const SC01 = () => {
  const tl: { name: string; d: string; done: boolean; current?: boolean }[] = [
    { name: 'Reservation', d: 'Apr 14', done: true },
    { name: 'Parking check', d: 'Apr 18', done: true },
    { name: 'Charging approval', d: 'May 02', done: true },
    { name: 'Installer booking', d: 'May 14', done: false, current: true },
    { name: 'Import & reg.', d: 'Jun 04', done: false },
    { name: 'Delivery', d: 'Jul 22', done: false },
    { name: 'Service partner', d: 'Jul 24', done: false },
    { name: 'Warranty profile', d: 'Jul 25', done: false },
  ];
  return (
    <section className="section" id="sc01">
      <div className="shell">
        <div className="section-header">
          <span className="eyebrow">Example case · pilot brand</span>
          <h2>Example use case: SC01 Europe.</h2>
        </div>
        <div className="sc01-card">
          <div>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--text-1)' }}>
              SC01 represents a new type of emerging EV brand: lightweight, enthusiast-driven, highly differentiated, and globally ambitious —
              but without a mature European aftersales network. TopSC makes this kind of imported ownership practical by coordinating
              the missing local infrastructure around the vehicle.
            </p>
            <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div>
                <div className="label">Allocation</div>
                <div className="mono" style={{ fontSize: 15, color: 'var(--text-0)', marginTop: 4 }}>
                  ~1,000 units
                </div>
              </div>
              <div>
                <div className="label">Assembly</div>
                <div className="mono" style={{ fontSize: 15, color: 'var(--text-0)', marginTop: 4 }}>
                  Italy (planned)
                </div>
              </div>
              <div>
                <div className="label">Launch</div>
                <div className="mono" style={{ fontSize: 15, color: 'var(--text-0)', marginTop: 4 }}>
                  2026
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="sc01-photo">
              <img src={sc03} alt="SC01 sports car studio shot" />
              <div className="sc01-photo-tags">
                <span className="mono">SC01 · PORT ARRIVAL · EU PILOT</span>
              </div>
              <div className="sc01-photo-grid">
                <div>
                  <span className="label">0–100</span>
                  <span className="mono">3.9 s</span>
                </div>
                <div>
                  <span className="label">Curb wt.</span>
                  <span className="mono">1,490 kg</span>
                </div>
                <div>
                  <span className="label">Range</span>
                  <span className="mono">405 km WLTP</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              <span className="badge muted">Lightweight roadster</span>
              <span className="badge muted">Rear-wheel drive</span>
              <span className="badge muted">Enthusiast trim</span>
            </div>
          </div>
        </div>
        <div className="sc01-timeline">
          {tl.map((s, i) => (
            <div key={i} className={`tl-step ${s.done ? 'done' : ''} ${s.current ? 'current' : ''}`}>
              <div className="n">T{String(i + 1).padStart(2, '0')}</div>
              <div className="name">{s.name}</div>
              <div
                className="mono"
                style={{ fontSize: 10.5, color: s.done || s.current ? 'var(--text-2)' : 'var(--text-3)', marginTop: 6 }}
              >
                {s.d}
              </div>
              {s.done && <span className="check">✓</span>}
              {s.current && <span className="check" style={{ color: 'var(--blue)' }}>●</span>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// === SERVICE CASE ===
const ServiceCase = () => (
  <section className="section" id="service">
    <div className="shell">
      <div className="section-header">
        <span className="eyebrow">Aftersales · case management</span>
        <h2>After delivery, the agent keeps coordinating.</h2>
        <p style={{ fontSize: 15.5, marginTop: 6 }}>
          A live warranty case for SC01 #EU-0102, opened by the owner in Lyon. The agent generates parallel briefs — one for the local garage,
          one for the manufacturer in Hangzhou.
        </p>
      </div>

      <div className="card">
        <div className="card-head">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AgentTile id="warranty" pulse />
            <div>
              <h4>Brake noise after 1,200 km · Lyon, FR</h4>
              <div className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)', marginTop: 2 }}>
                Case #WC-2026-014 · opened 11 May · VIN SC01-EU-0102
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="badge amber">GARAGE QUOTE RECEIVED</span>
            <span className="badge blue">MFR REVIEW</span>
          </div>
        </div>

        <div
          style={{
            padding: '18px 20px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 14,
            borderBottom: '1px solid var(--border-1)',
          }}
        >
          {(
            [
              ['Owner', 'M. Bernard'],
              ['Location', 'Lyon, FR'],
              ['Mileage', '1,243 km'],
              ['Symptom', 'Squeal at low speed, dry conditions'],
              ['Evidence', '2 videos · 1 audio · OBD scan'],
              ['Severity', 'Medium · non-safety'],
            ] as const
          ).map(([k, v]) => (
            <div key={k}>
              <div className="label">{k}</div>
              <div style={{ fontSize: 13, color: 'var(--text-0)', marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-1)' }}>
          <div className="label" style={{ marginBottom: 10 }}>
            Agent actions taken
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              'Collected video evidence from buyer',
              'Generated French repair brief for local garage',
              'Generated Chinese technical summary for manufacturer',
              'Contacted 3 nearby performance garages',
              'Requested part confirmation from manufacturer',
              'Updated warranty case status',
            ].map((a) => (
              <span key={a} className="badge muted" style={{ fontSize: 10.5 }}>
                <Icon name="check" size={10} /> {a}
              </span>
            ))}
          </div>
        </div>

        <div className="case-grid" style={{ padding: 20 }}>
          <div className="msg-panel">
            <div className="head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>
                  EN / FR · TO LOCAL GARAGE
                </span>
              </div>
              <span className="badge blue">DRAFT</span>
            </div>
            <div className="body">
              {`Subject: SC01 #EU-0102 — brake noise inspection (Case WC-2026-014)

Bonjour Performance Garage Lyon,

Owner reports a high-pitched squeal from the front brake assembly at low speed (≤30 km/h), present after ~1,200 km of city use. No vibration, no loss of stopping power. Audio recording and 2 dash-cam clips attached.

Requested scope:
 • Visual inspection · front pad/disc wear, glazing
 • Caliper slide-pin condition · anti-rattle clips
 • Measure pad thickness vs. spec sheet (attached)
 • Quote: clean-and-bed vs. pad replacement

Constraints:
 • Do NOT open the high-voltage / regen system — escalate to mfr.
 • Use OEM-spec friction material only (cross-ref attached).
 • Send photos before any work is started.

Thanks — TopSC on behalf of M. Bernard.`}
            </div>
          </div>
          <div className="msg-panel">
            <div className="head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="mono" style={{ fontSize: 10.5, color: 'var(--text-3)' }}>
                  中文 · 致厂家技术服务
                </span>
              </div>
              <span className="badge violet">SENT</span>
            </div>
            <div className="body zh">
              {`主题:SC01 #EU-0102 制动异响技术摘要(案件 WC-2026-014)

车辆信息
 • VIN:SC01-EU-0102 · 交付日 2026-03-18
 • 当前里程:1,243 km · 地区:法国 里昂
 • 工况:干燥路面 · 低速 ≤30 km/h

故障描述
 • 前制动总成出现高频金属异响
 • 制动力正常 · 无方向盘震动
 • 已采集:音频 1 段 · 行车记录仪 2 段 · OBD 报告

本地排查范围(已下发当地维修商)
 • 摩擦片磨损 / 釉化
 • 卡钳滑销与防抖片
 • OEM 摩擦材料核对

需厂家确认
 1. 是否存在批次性摩擦片烧结问题
 2. 是否需要更换为最新规格(P/N 待回复)
 3. 高压及能量回收系统由厂家授权渠道处理

请反馈预期处理路径与备件可得性。
— TopSC · 欧洲运营`}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// === FINAL CTA ===
const FinalCTA = () => (
  <section className="section" id="cta">
    <div className="shell">
      <div className="cta-final cta-final-photo" style={{ backgroundImage: `url(${sc04})` }}>
        <span className="eyebrow">Get started</span>
        <h2>Launch Europe without building a traditional dealer network first.</h2>
        <p>
          TopSC gives emerging EV brands a coordinated local support layer for charging, compliance, service, and warranty operations
          — built for the AFIR / EPBD era.
        </p>
        <div className="cta-row">
          <a className="btn btn-blue" href="#demo">
            Hire TopSC <span className="arrow">→</span>
          </a>
          <a className="btn btn-ghost" href="#">
            Book GTM pilot
          </a>
        </div>
      </div>
      <div className="footer">
        <div className="brand">
          <div className="brand-mark" />
          <div>
            <div className="brand-name">TopSC</div>
            <div className="brand-tag">GTM · OWNERSHIP READINESS</div>
          </div>
        </div>
        <div className="links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
          <a href="#">Contact</a>
        </div>
        <div>© 2026 TopSC</div>
      </div>
    </div>
  </section>
);

export const App = () => (
  <>
    <div className="bg-grid" />
    <div className="bg-glow" />
    <Nav />
    <main>
      <Hero />
      <Problems />
      <Agents />
      <Demo />
      <Kanban />
      <BrandDash />
      <SC01 />
      <ServiceCase />
      <FinalCTA />
    </main>
  </>
);
