import Link from "next/link";
import { getAllPosts, getCategoryHref, getTagHref } from "@/content/posts";
import { getPlaylistTracks } from "@/content/playlist";
import { ShufflePlaylist } from "@/components/shuffle-playlist";

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

const editorNotes = [
  "A great club page should feel like a flyer, a booth monitor, and a late-night diary at the same time.",
  "Shuffle works when every track still shares the same darkness level, even if the order breaks the rules.",
  "The visual mood should feel humid, neon-lit, and slightly dangerous instead of tidy and editorial-safe."
] as const;

export default function HomePage() {
  const posts = getAllPosts();
  const playlistTracks = getPlaylistTracks();
  const featuredPost = posts[0]!;
  const latestPosts = posts.slice(1, 5);
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
          <Link href="/playlist">Playlist</Link>
          <Link href="/posts">Archive</Link>
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
            <span className="story-badge">{featuredPost.issue}</span>
            <Link className="story-issue" href={getCategoryHref(featuredPost.category)}>
              {featuredPost.category}
            </Link>
          </div>

          <p className="section-kicker">Cover story</p>
          <h1>{featuredPost.title}</h1>
          <p className="story-dek">{featuredPost.deck ?? tagline}</p>

          <p className="story-meta">
            By {featuredPost.author}
            <span aria-hidden="true"> / </span>
            {featuredPost.dateline}
            <span aria-hidden="true"> / </span>
            {featuredPost.readLabel}
          </p>

          <div className="tag-row" aria-label="Music tags">
            {featuredPost.tags.map((tag) => (
              <Link className="tag-chip" href={getTagHref(tag)} key={tag}>
                {tag}
              </Link>
            ))}
          </div>

          <div className="story-link-row">
            <Link className="story-link" href={`/posts/${featuredPost.slug}`}>
              Read cover story
            </Link>
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

            <div className="story-link-row">
              <Link className="story-link" href="/playlist">
                Step into the full playlist
              </Link>
            </div>
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
                <Link className="post-topline post-topline-link" href={getCategoryHref(post.category)}>
                  {post.category}
                </Link>

                <Link className="post-card-link" href={`/posts/${post.slug}`}>
                  <h3>{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <p className="post-footer">{post.cardLabel}</p>
                </Link>
              </article>
            ))}
          </div>

          <div className="latest-footer">
            <Link className="story-link" href="/posts">
              Browse full archive
            </Link>
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
