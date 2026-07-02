import { EditorialPreviewButton } from "@/components/editorial-preview-button";
import Link from "next/link";
import { SpotifySpotlight } from "@/components/spotify-spotlight";
import {
  getAllPosts,
  getCategories,
  getCategoryHref,
  getTagHref,
  getTags
} from "@/content/posts";
import {
  getPlaylistMomentHref,
  getPlaylistMoments,
  getPlaylistMomentTitle,
  getPlaylistTrackByCue,
  getPlaylistTracks
} from "@/content/playlist";
import { ShufflePlaylist } from "@/components/shuffle-playlist";
import { getSpotifyEditorialPlaylist } from "@/lib/spotify";

const editorNotes = [
  "Lead with discoverability: every story should feel one click away from a deeper queue.",
  "Treat categories like editorial playlists, not filing cabinets. Each lane should feel playable.",
  "Keep the energy dark, curated, and conversational so the page reads like a listener's nightly home screen."
] as const;

export default async function HomePage() {
  const posts = getAllPosts();
  const categories = getCategories();
  const topSignals = getTags().slice(0, 6);
  const playlistTracks = getPlaylistTracks();
  const playlistMoments = getPlaylistMoments().slice(0, 3);
  const featuredPost = posts[0]!;
  const featuredCueTrack = getPlaylistTrackByCue(
    featuredPost.trackCue.title,
    featuredPost.trackCue.artist
  );
  const latestPosts = posts.slice(1, 5);
  const listeningPairs = posts
    .map((post) => ({
      post,
      cueTrack: getPlaylistTrackByCue(post.trackCue.title, post.trackCue.artist)
    }))
    .filter(
      (pair): pair is {
        post: (typeof posts)[number];
        cueTrack: NonNullable<ReturnType<typeof getPlaylistTrackByCue>>;
      } => Boolean(pair.cueTrack)
    )
    .slice(0, 4);
  const spotlightCategories = categories.slice(0, 4);
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "Old School Shuffle";
  const tagline =
    process.env.NEXT_PUBLIC_TAGLINE ??
    "Playlist-led music writing, after-hours recommendations, and an editorial queue built to be explored like a stream.";
  const spotifySpotlight = await getSpotifyEditorialPlaylist();
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

          {featuredCueTrack ? (
            <div className="featured-pairing">
              <p className="featured-pairing-label">Posted with this sound</p>

              <div className="featured-pairing-copy">
                <strong>{featuredCueTrack.title}</strong>
                <span>
                  {featuredCueTrack.artist}
                  <span aria-hidden="true"> / </span>
                  {getPlaylistMomentTitle(featuredCueTrack.moment)}
                  <span aria-hidden="true"> / </span>
                  {featuredCueTrack.bpm}
                </span>
              </div>

              <EditorialPreviewButton compact track={featuredCueTrack} />

              <Link
                className="article-back"
                href={getPlaylistMomentHref(featuredCueTrack.moment)}
              >
                Open {getPlaylistMomentTitle(featuredCueTrack.moment)} mix
              </Link>
            </div>
          ) : null}

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

          <SpotifySpotlight fallbackTracks={playlistTracks} spotlight={spotifySpotlight} />
        </div>
      </section>

      <section className="content-grid fade-up">
        <section className="latest-stack" id="latest">
          <div className="section-heading">
            <p className="section-kicker">Latest posts</p>
            <h2>Fresh from the feed</h2>
          </div>

          <div className="post-grid">
            {latestPosts.map((post) => {
              const cueTrack = getPlaylistTrackByCue(post.trackCue.title, post.trackCue.artist);

              return (
                <article className="post-card" key={post.title}>
                  <Link
                    className="post-topline post-topline-link"
                    href={getCategoryHref(post.category)}
                  >
                    {post.category}
                  </Link>

                  <Link className="post-card-link" href={`/posts/${post.slug}`}>
                    <h3>{post.title}</h3>
                    <p className="post-excerpt">{post.excerpt}</p>

                    <div className="post-pairing">
                      <span className="post-pairing-label">Posted with</span>
                      <strong>{post.trackCue.title}</strong>
                      <span>
                        {cueTrack
                          ? `${cueTrack.artist} / ${getPlaylistMomentTitle(cueTrack.moment)}`
                          : post.trackCue.artist}
                      </span>
                    </div>

                    <p className="post-footer">{post.cardLabel}</p>
                  </Link>
                </article>
              );
            })}
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

      <section className="pairings-section fade-up">
        <div className="section-heading">
          <p className="section-kicker">Posted with this sound</p>
          <h2>The old-school blogger version of a listening queue.</h2>
        </div>

        <div className="pairings-grid">
          {listeningPairs.map(({ post, cueTrack }) => (
            <article className="pair-card" key={post.slug}>
              <div className="story-badges">
                <span className="story-badge">{post.issue}</span>
                <Link className="story-issue" href={getCategoryHref(post.category)}>
                  {post.category}
                </Link>
              </div>

              <p className="section-kicker">Posted with</p>
              <h3>{post.title}</h3>
              <p className="post-excerpt">{post.excerpt}</p>

              <div className="pair-soundtrack">
                <span className="pair-track-label">{getPlaylistMomentTitle(cueTrack.moment)}</span>
                <strong>{cueTrack.title}</strong>
                <p>{cueTrack.artist}</p>
              </div>

              <EditorialPreviewButton compact track={cueTrack} />

              <div className="story-link-row">
                <Link className="story-link" href={`/posts/${post.slug}`}>
                  Read post
                </Link>

                <Link className="article-back" href={getPlaylistMomentHref(cueTrack.moment)}>
                  Open mix
                </Link>
              </div>
            </article>
          ))}
        </div>
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
                <Link className="story-link" href={getPlaylistMomentHref(moment.slug)}>
                  Open mix
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
