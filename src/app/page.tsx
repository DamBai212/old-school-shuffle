import Image from "next/image";

const highlights = [
  {
    title: "App Router First",
    description:
      "Start from the modern Next.js routing model without extra demo clutter."
  },
  {
    title: "TypeScript Ready",
    description:
      "Strict TypeScript settings are in place so new features have a healthy default."
  },
  {
    title: "Docker Friendly",
    description:
      "The repo includes a multi-stage Docker build and compose file for a clean deploy path."
  }
] as const;

const setupSteps = [
  "Install dependencies with npm install.",
  "Copy .env.local.example to .env.local.",
  "Start local development with npm run dev.",
  "Open http://localhost:3000 to see the starter."
] as const;

export default function HomePage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Old School Shuffle";
  const tagline =
    process.env.NEXT_PUBLIC_TAGLINE ??
    "Spin up a retro-inspired Next.js starter.";

  return (
    <main className="page-shell">
      <section className="panel hero fade-up">
        <div className="hero-copy">
          <p className="eyebrow">Next.js + TypeScript + Docker</p>
          <h1>{siteName}</h1>
          <p className="lede">{tagline}</p>

          <div className="action-row">
            <a className="button" href="#setup">
              Quick Start
            </a>
            <a className="button secondary" href="#included">
              What&apos;s Included
            </a>
          </div>

          <div className="chip-row" aria-label="Starter capabilities">
            <span className="chip">Standalone output</span>
            <span className="chip">Responsive layout</span>
            <span className="chip">Retro visual system</span>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="record-frame">
            <Image
              src="/record.svg"
              alt=""
              width={280}
              height={280}
              priority
            />
          </div>
          <div className="stat-block">
            <span className="stat-label">Starter vibe</span>
            <strong>Polished, not precious</strong>
            <p>Enough structure to build from, without locking you into a theme.</p>
          </div>
        </div>
      </section>

      <section className="metric-row fade-up">
        <article className="metric-card">
          <span className="metric-number">01</span>
          <p>Single-page starter with room to grow into routes, APIs, and features.</p>
        </article>
        <article className="metric-card">
          <span className="metric-number">20</span>
          <p>Built around the Node 20 runtime so local and container flows match.</p>
        </article>
        <article className="metric-card">
          <span className="metric-number">100%</span>
          <p>Configured to work without any framework-specific setup hidden elsewhere.</p>
        </article>
      </section>

      <section id="included" className="panel fade-up">
        <div className="section-heading">
          <p className="eyebrow">Included</p>
          <h2>What you already have</h2>
        </div>

        <div className="feature-grid">
          {highlights.map((item) => (
            <article className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="setup" className="panel fade-up">
        <div className="section-heading">
          <p className="eyebrow">Setup</p>
          <h2>Four quick steps</h2>
        </div>

        <ol className="step-list">
          {setupSteps.map((step) => (
            <li className="step-card" key={step}>
              {step}
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
