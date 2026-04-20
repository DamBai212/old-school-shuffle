import {
  ShufflePlaylist,
  type PlaylistTrack
} from "@/components/shuffle-playlist";

const sceneTags = [
  "Basement house",
  "Neon dub",
  "Peak-time pressure",
  "After-hours soul"
] as const;

const pulseItems = [
  {
    label: "Doors",
    value: "11:47 PM"
  },
  {
    label: "Room",
    value: "Basement A"
  },
  {
    label: "Mood",
    value: "Strobe haze"
  }
] as const;

const playlistTracks: readonly PlaylistTrack[] = [
  {
    title: "Midnight Strobe",
    artist: "Velvet Transit",
    length: "5:21",
    bpm: "124 BPM",
    vibe: "Cold synth shimmer, pressure-built bass, and a kick that lands like a light cue."
  },
  {
    title: "Red Exit Sign",
    artist: "June Arcade",
    length: "4:48",
    bpm: "120 BPM",
    vibe: "Smoked-out chords and a patient groove for the first ten minutes after midnight."
  },
  {
    title: "Chrome Hearts Dub",
    artist: "Night Service",
    length: "6:03",
    bpm: "126 BPM",
    vibe: "Dub delay, metallic percussion, and a bassline built for concrete walls."
  },
  {
    title: "Blue Laser Static",
    artist: "Saint Monroe",
    length: "3:57",
    bpm: "122 BPM",
    vibe: "A romantic hook hiding inside a track that still belongs in the darkest room."
  },
  {
    title: "Studio 3AM",
    artist: "Luna Static",
    length: "5:09",
    bpm: "128 BPM",
    vibe: "Peak-time lift with enough restraint to keep the floor hungry for one more blend."
  }
] as const;

const latestPosts = [
  {
    category: "Scene report",
    title: "Why the best 2AM records sound like they were found in the dark.",
    excerpt:
      "The tension lives in the negative space: the clipped vocal, the delayed snare, the bassline you feel before you place it.",
    meta: "7 min read"
  },
  {
    category: "Floor notes",
    title: "Basement sets are getting murkier, slower, and better because of it.",
    excerpt:
      "A dispatch from rooms that trust tension more than volume, and let atmosphere do half the work.",
    meta: "London 01:40"
  },
  {
    category: "Booth notes",
    title: "Five tracks that let a shuffled set still feel like one long inhale.",
    excerpt:
      "Bridge cuts, pressure builders, and small left turns that keep the room curious instead of confused.",
    meta: "Selectors' picks"
  },
  {
    category: "After-hours essay",
    title: "How to write about the club without flattening it into lifestyle wallpaper.",
    excerpt:
      "Write about sweat, pacing, light, release, and bodies moving together. The technology is only half the story.",
    meta: "Filed at 3:12 AM"
  }
] as const;

const editorNotes = [
  "A great club page should feel like a flyer, a booth monitor, and a late-night diary at the same time.",
  "Shuffle works when every track still shares the same darkness level, even if the order breaks the rules.",
  "The visual mood should feel humid, neon-lit, and slightly dangerous instead of tidy and editorial-safe."
] as const;

export default function HomePage() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Old School Shuffle";
  const tagline =
    process.env.NEXT_PUBLIC_TAGLINE ??
    "After-hours dispatches, floor reports, and a playlist that moves like the room does.";

  return (
    <main className="blog-shell">
      <header className="masthead fade-up">
        <div className="brand-block">
          <p className="eyebrow">Independent after-hours dispatches and shuffle-led booth notes</p>
          <a className="brand-mark" href="/">
            {siteName}
          </a>
        </div>

        <nav aria-label="Primary" className="top-nav">
          <a href="#latest">Latest</a>
          <a href="#playlist">Playlist</a>
          <a href="#notes">Notes</a>
        </nav>
      </header>

      <section aria-label="Night signals" className="signal-strip fade-up">
        {pulseItems.map((item) => (
          <article className="signal-pill" key={item.label}>
            <span className="signal-label">{item.label}</span>
            <strong className="signal-value">{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="lead-grid fade-up">
        <article className="paper-card featured-story">
          <div className="story-badges">
            <span className="story-badge">Night issue</span>
            <span className="story-issue">After-hours 04</span>
          </div>

          <p className="section-kicker">Cover story</p>
          <h1>From the blog to the booth, the page should feel like 2AM.</h1>
          <p className="story-dek">{tagline}</p>

          <p className="story-meta">
            By Mara Ellis
            <span aria-hidden="true"> / </span>
            Filed from the basement
            <span aria-hidden="true"> / </span>
            2:13 AM
          </p>

          <div className="tag-row" aria-label="Music tags">
            {sceneTags.map((tag) => (
              <span className="tag-chip" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </article>

        <div className="playlist-column">
          <ShufflePlaylist tracks={playlistTracks} />

          <aside className="quote-card fade-up">
            <p className="section-kicker">Booth memo</p>
            <p>
              The best shuffle order still sounds inevitable, like the lights changed
              exactly when the room needed them to.
            </p>
          </aside>
        </div>
      </section>

      <section className="content-grid fade-up">
        <section className="latest-stack" id="latest">
          <div className="section-heading">
            <p className="section-kicker">Latest posts</p>
            <h2>Fresh from the archive</h2>
          </div>

          <div className="post-grid">
            {latestPosts.map((post) => (
              <article className="post-card" key={post.title}>
                <p className="post-topline">{post.category}</p>
                <h3>{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <p className="post-footer">{post.meta}</p>
              </article>
            ))}
          </div>
        </section>

        <aside className="sidebar-stack" id="notes">
          <section className="sidebar-card">
            <p className="section-kicker">Editor&apos;s notes</p>
            <h2>How the room should feel</h2>

            <ul className="notes-list">
              {editorNotes.map((note) => (
                <li className="note-item" key={note}>
                  {note}
                </li>
              ))}
            </ul>
          </section>

          <section className="sidebar-card dark-card">
            <p className="section-kicker">Night lanes</p>
            <h2>Three moods for the shuffle</h2>

            <ul className="mood-list">
              <li>Foggy openers with sodium-orange pads and half-hidden vocals</li>
              <li>Basement rollers that keep the floor locked without showing off</li>
              <li>Closing-time heartbreakers with enough glow to feel unreal</li>
            </ul>
          </section>
        </aside>
      </section>
    </main>
  );
}
