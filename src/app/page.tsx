import Link from "next/link";
import {
  getAllPosts,
  getCategories,
  getCategoryHref,
  getTagHref,
  getTags
} from "@/content/posts";
import { getPlaylistMoments, getPlaylistTracks } from "@/content/playlist";
import { ShufflePlaylist } from "@/components/shuffle-playlist";

const editorNotes = [
  "Lead with discoverability: every story should feel one click away from a deeper queue.",
  "Treat categories like editorial playlists, not filing cabinets. Each lane should feel playable.",
  "Keep the energy dark, curated, and conversational so the page reads like a listener's nightly home screen."
] as const;

export default function HomePage() {
  const posts = getAllPosts();
  const categories = getCategories();
  const topSignals = getTags().slice(0, 6);
  const playlistTracks = getPlaylistTracks();
  const playlistMoments = getPlaylistMoments().slice(0, 3);
  const featuredPost = posts[0]!;
  const latestPosts = posts.slice(1, 5);
  const spotlightCategories = categories.slice(0, 4);
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Old School Shuffle";
  const tagline =
    process.env.NEXT_PUBLIC_TAGLINE ??
    "Playlist-led music writing, after-hours recommendations, and an editorial queue built to be explored like a stream.";
  const pulseItems = [
    {
      label: "In rotation",
      value: `${playlistTracks.length} tracks`
    },
    {
      label: "Fresh reads",
      value: `${posts.length} stories`
    },
    {
      label: "Live signals",
      value: `${topSignals.length} tags`
    }
  ] as const;

  return (
    <main className="blog-shell">
      <header className="masthead fade-up">
        <div className="brand-block">
          <p className="eyebrow">Playlist-led music writing and after-hours recommendations</p>
          <a className="brand-mark" href="/">
            {siteName}
          </a>
        </div>

        <nav aria-label="Primary" className="top-nav">
          <a href="#latest">Feed</a>
          <Link href="/playlist">Listening room</Link>
          <Link href="/posts">Library</Link>
        </nav>
      </header>

      <section aria-label="Feed signals" className="signal-strip fade-up">
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

          <p className="section-kicker">Featured release note</p>
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
              Read feature
            </Link>
            <Link className="story-link" href="/posts">
              Open library
            </Link>
          </div>
        </article>

        <div className="playlist-column">
          <ShufflePlaylist tracks={playlistTracks} />

          <aside className="quote-card fade-up">
            <p className="section-kicker">Listening room</p>
            <h2>This week&apos;s editorial queue.</h2>
            <p>
              The stories, tags, and tracks should feel as easy to move through as a
              favorite streaming app, but with sharper taste and better writing.
            </p>

            <div className="archive-chip-row" aria-label="Trending music signals">
              {topSignals.map((tag) => (
                <Link className="tag-chip" href={getTagHref(tag.title)} key={tag.slug}>
                  {tag.title}
                </Link>
              ))}
            </div>

            <div className="story-link-row">
              <Link className="story-link" href="/playlist">
                Open listening room
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="content-grid fade-up">
        <section className="latest-stack" id="latest">
          <div className="section-heading">
            <p className="section-kicker">Latest posts</p>
            <h2>Fresh from the feed</h2>
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
              Browse full library
            </Link>
          </div>
        </section>

        <aside className="sidebar-stack" id="notes">
          <section className="sidebar-card">
            <p className="section-kicker">Editor&apos;s notes</p>
            <h2>A music blog that moves like a stream.</h2>

            <ul className="notes-list">
              {editorNotes.map((note) => (
                <li className="note-item" key={note}>
                  {note}
                </li>
              ))}
            </ul>
          </section>

          <section className="sidebar-card dark-card">
            <p className="section-kicker">Popular lanes</p>
            <h2>Made for after-hours.</h2>

            <div className="article-link-list">
              {spotlightCategories.slice(0, 3).map((category) => (
                <Link
                  className="article-link-card"
                  href={getCategoryHref(category.title)}
                  key={category.slug}
                >
                  <span>{category.posts.length} stories</span>
                  <strong>{category.title}</strong>
                  <p>{category.description}</p>
                </Link>
              ))}
            </div>

            <div className="story-link-row">
              <Link className="story-link" href="/posts">
                Browse every lane
              </Link>
            </div>
          </section>
        </aside>
      </section>

      <section className="playlist-route fade-up">
        <div className="section-heading">
          <p className="section-kicker">Editor&apos;s mixes</p>
          <h2>Three ways into tonight&apos;s queue.</h2>
        </div>

        <div className="playlist-route-grid">
          {playlistMoments.map((moment) => (
            <article className="route-card" key={moment.slug}>
              <p className="section-kicker">{moment.archiveTag}</p>
              <h3>{moment.title}</h3>
              <p>{moment.description}</p>

              <div className="route-chip-row">
                {moment.tracks.slice(0, 2).map((track) => (
                  <span className="route-track" key={track.title}>
                    {track.title}
                  </span>
                ))}
              </div>

              <div className="story-link-row">
                <Link className="story-link" href={getTagHref(moment.archiveTag)}>
                  Follow this signal
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="playlist-reading fade-up">
        <div className="section-heading">
          <p className="section-kicker">Made for after-hours</p>
          <h2>Lanes that read like playlists.</h2>
        </div>

        <div className="playlist-reading-grid">
          {spotlightCategories.map((category) => (
            <Link
              className="article-link-card"
              href={getCategoryHref(category.title)}
              key={category.slug}
            >
              <span>{category.posts.length} stories</span>
              <strong>{category.title}</strong>
              <p>{category.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
