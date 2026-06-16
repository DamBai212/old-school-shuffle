import Link from "next/link";
import type { Metadata } from "next";
import { ShufflePlaylist } from "@/components/shuffle-playlist";
import { getPlaylistTracks } from "@/content/playlist";
import { getPostBySlug } from "@/content/posts";

export const metadata: Metadata = {
  title: "Playlist | Old School Shuffle",
  description:
    "Shuffle through the booth queue: late-night club cuts, bridge records, and track notes linked back to the archive."
};

const routeNotes = [
  "Open with murky percussion and enough empty air to make the room lean toward the speakers.",
  "Keep one bridge record nearby whenever the order jumps from romance into pressure.",
  "Let the final third glow a little. Even the darkest nights need one human moment."
] as const;

export default function PlaylistPage() {
  const tracks = getPlaylistTracks();
  const relatedReads = tracks
    .map((track) => {
      const post = getPostBySlug(track.linkedPostSlug);

      if (!post) {
        return undefined;
      }

      return { track, post };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <main className="blog-shell playlist-shell">
      <header className="masthead fade-up">
        <div className="brand-block">
          <p className="eyebrow">Independent after-hours dispatches and shuffle-led booth notes</p>
          <Link className="brand-mark" href="/">
            Old School Shuffle
          </Link>
        </div>

        <nav aria-label="Primary" className="top-nav">
          <Link href="/">Front page</Link>
          <Link href="/posts">Archive</Link>
          <Link href="/playlist">Playlist</Link>
        </nav>
      </header>

      <section className="archive-hero fade-up">
        <div className="archive-hero-copy">
          <p className="section-kicker">Shuffle playlist</p>
          <h1>The booth queue, not the polite version.</h1>
          <p className="archive-dek">
            A dedicated room for the tracks that shape the site&apos;s mood: murky warm-up
            cuts, bridge records, and one or two heartbreakers for the lights-up moment.
          </p>
        </div>

        <div className="archive-chip-row" aria-label="Playlist lane markers">
          {tracks.slice(0, 5).map((track) => (
            <span className="tag-chip" key={track.title}>
              {track.lane}
            </span>
          ))}
        </div>
      </section>

      <section aria-label="Playlist stats" className="signal-strip fade-up">
        <article className="signal-pill">
          <span className="signal-label">Cuts</span>
          <strong className="signal-value">{tracks.length}</strong>
        </article>

        <article className="signal-pill">
          <span className="signal-label">Tempo lane</span>
          <strong className="signal-value">119-128 BPM</strong>
        </article>

        <article className="signal-pill">
          <span className="signal-label">Mode</span>
          <strong className="signal-value">No-skip pressure</strong>
        </article>
      </section>

      <section className="lead-grid fade-up">
        <div className="playlist-column">
          <ShufflePlaylist tracks={tracks} />

          <div className="story-link-row">
            <Link className="story-link" href="/posts">
              Read the archive beside it
            </Link>
          </div>
        </div>

        <div className="sidebar-stack">
          <section className="sidebar-card">
            <p className="section-kicker">Selector&apos;s note</p>
            <h2>The order changes. The temperature should not.</h2>
            <p className="article-sidecopy">
              Shuffle only works when every track still belongs to the same night.
              These cuts trade in pressure, haze, and one precise flash of emotion.
            </p>
          </section>

          <section className="sidebar-card dark-card">
            <p className="section-kicker">Tonight&apos;s route</p>
            <h2>How the set should move.</h2>

            <ul className="mood-list">
              {routeNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      <section className="playlist-board fade-up">
        <div className="section-heading">
          <p className="section-kicker">Full queue</p>
          <h2>Every cut in tonight&apos;s rotation.</h2>
        </div>

        <div className="track-board">
          {tracks.map((track, index) => {
            const linkedPost = getPostBySlug(track.linkedPostSlug);

            return (
              <article className="track-card" key={`${track.title}-${track.artist}`}>
                <p className="track-index">{`${index + 1}`.padStart(2, "0")}</p>

                <div className="track-meta-row">
                  <span>{track.lane}</span>
                  <span>{track.length}</span>
                  <span>{track.bpm}</span>
                </div>

                <h3>{track.title}</h3>
                <p className="playlist-artist">{track.artist}</p>
                <p className="track-note">{track.note}</p>

                {linkedPost ? (
                  <Link className="track-read-link" href={`/posts/${linkedPost.slug}`}>
                    Read alongside: {linkedPost.title}
                  </Link>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="playlist-reading fade-up">
        <div className="section-heading">
          <p className="section-kicker">Reading companion</p>
          <h2>Track notes that point back into the magazine.</h2>
        </div>

        <div className="playlist-reading-grid">
          {relatedReads.slice(0, 4).map(({ track, post }) => (
            <Link className="article-link-card" href={`/posts/${post.slug}`} key={track.title}>
              <span>{track.title}</span>
              <strong>{post.title}</strong>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
