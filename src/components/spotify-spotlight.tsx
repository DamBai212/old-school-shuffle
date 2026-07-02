import Image from "next/image";
import Link from "next/link";
import { SpotifyPreviewQueue } from "@/components/spotify-preview-queue";
import type { PlaylistTrack } from "@/content/playlist";
import type { SpotifyEditorialPlaylistState } from "@/lib/spotify";

type SpotifySpotlightProps = {
  fallbackTracks: readonly PlaylistTrack[];
  spotlight: SpotifyEditorialPlaylistState;
  showEmbed?: boolean;
};

export function SpotifySpotlight({
  fallbackTracks,
  spotlight,
  showEmbed = false
}: SpotifySpotlightProps) {
  const previewTracks = fallbackTracks.slice(0, 4);

  if (!spotlight.playlist) {
    const setupCopy =
      spotlight.status === "error"
        ? "Spotify is configured, but the live playlist could not be loaded right now. The local queue still keeps the room moving while you check credentials, quota, or the selected playlist."
        : "Add Spotify Client Credentials and an editorial playlist ID to turn this card into a live public playlist feed.";

    return (
      <section className="spotify-card fade-up">
        <div className="spotify-header">
          <div>
            <p className="section-kicker">Spotify sync</p>
            <h2>Wire in the live booth feed.</h2>
          </div>

          <span className="spotify-state-pill">Setup-ready</span>
        </div>

        <p className="spotify-description">{setupCopy}</p>

        <p className="spotify-hint">
          Use <code>SPOTIFY_CLIENT_ID</code>, <code>SPOTIFY_CLIENT_SECRET</code>, and{" "}
          <code>SPOTIFY_EDITORIAL_PLAYLIST_ID</code>.
        </p>

        <ol className="spotify-preview-list">
          {previewTracks.map((track, index) => (
            <li className="spotify-preview-row" key={`${track.title}-${track.artist}`}>
              <span className="spotify-preview-index">{`${index + 1}`.padStart(2, "0")}</span>

              <div className="spotify-preview-link spotify-preview-link-static">
                <div className="spotify-preview-copy">
                  <strong>{track.title}</strong>
                  <span>{track.artist}</span>
                </div>

                <span className="spotify-preview-meta">{track.bpm}</span>
              </div>
            </li>
          ))}
        </ol>

        <div className="story-link-row">
          <Link className="story-link" href="/playlist">
            Open local queue
          </Link>
        </div>
      </section>
    );
  }

  const { playlist } = spotlight;

  return (
    <section className="spotify-card fade-up">
      <div className="spotify-header">
        <div>
          <p className="section-kicker">Spotify sync</p>
          <h2>{playlist.name}</h2>
        </div>

        <span className="spotify-state-pill">Live public playlist</span>
      </div>

      <div className="spotify-hero">
        <div className="spotify-cover-shell">
          {playlist.imageUrl ? (
            <Image
              className="spotify-cover"
              src={playlist.imageUrl}
              alt={`${playlist.name} playlist cover art`}
              width={320}
              height={320}
            />
          ) : (
            <div className="spotify-cover spotify-cover-placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="spotify-summary">
          <p className="spotify-description">{playlist.description}</p>

          <div className="now-stats">
            <span>{playlist.trackCount} tracks</span>
            <span>By {playlist.ownerName}</span>
            <span>Spotify live</span>
          </div>

          <div className="story-link-row">
            <a
              className="story-link"
              href={playlist.externalUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open in Spotify
            </a>

            <Link className="article-back" href="/playlist">
              Open site queue
            </Link>
          </div>
        </div>
      </div>

      <div className="spotify-preview">
        <p className="playlist-meta">Preview queue</p>

        <SpotifyPreviewQueue tracks={playlist.tracks} />
      </div>

      {showEmbed ? (
        <div className="spotify-embed-shell">
          <iframe
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="spotify-embed"
            loading="lazy"
            src={playlist.embedUrl}
            title={`${playlist.name} Spotify embed`}
          />
        </div>
      ) : null}
    </section>
  );
}
