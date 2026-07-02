import Link from "next/link";
import type { Metadata } from "next";
import { PlaylistExplorer } from "@/components/playlist-explorer";
import { SpotifySpotlight } from "@/components/spotify-spotlight";
import { ShufflePlaylist } from "@/components/shuffle-playlist";
import {
  getPlaylistMomentHref,
  getPlaylistMoments,
  getPlaylistTracks
} from "@/content/playlist";
import {
  getArchiveHref,
  getPostBySlug,
  getTagHref
} from "@/content/posts";
import { getSpotifyEditorialPlaylist } from "@/lib/spotify";

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

export default async function PlaylistPage() {
  const tracks = getPlaylistTracks();
  const playlistMoments = getPlaylistMoments();
  const spotifySpotlight = await getSpotifyEditorialPlaylist();
  const playlistEntries = tracks
    .map((track) => {
      const post = getPostBySlug(track.linkedPostSlug);

      if (!post) {
        return undefined;
      }

      return { track, post };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const playlistSignals = Array.from(
    new Set(playlistEntries.flatMap(({ post }) => post.tags))
  ).slice(0, 6);

  return (
    <main className="blog-shell playlist-shell">
      <header className="masthead fade-up">
        <div className="brand-block">
          <p className="eyebrow">Playlist-led music writing and after-hours recommendations</p>
          <Link className="brand-mark" href="/">
            Old School Shuffle
          </Link>
        </div>

        <nav aria-label="Primary" className="top-nav">
          <Link href="/">Feed</Link>
          <Link href="/posts">Library</Link>
          <Link href="/playlist">Listening room</Link>
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

        <div className="archive-chip-row" aria-label="Playlist topic signals">
          {playlistSignals.map((tag) => (
            <Link className="tag-chip" href={getArchiveHref({ tag })} key={tag}>
              {tag}
            </Link>
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

          <SpotifySpotlight
            fallbackTracks={tracks}
            showEmbed
            spotlight={spotifySpotlight}
          />
        </div>
      </section>

      <section className="playlist-route fade-up">
        <div className="section-heading">
          <p className="section-kicker">Route map</p>
          <h2>Four turns through the night.</h2>
        </div>

        <div className="playlist-route-grid">
          {playlistMoments.map((moment) => (
            <article className="route-card" key={moment.slug}>
              <p className="section-kicker">{moment.title}</p>
              <h3>{moment.description}</h3>
              <p>{moment.routeNote}</p>

              <div className="route-chip-row">
                <Link className="tag-chip" href={getTagHref(moment.archiveTag)}>
                  {moment.archiveTag}
                </Link>

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

      <PlaylistExplorer entries={playlistEntries} />
    </main>
  );
}
