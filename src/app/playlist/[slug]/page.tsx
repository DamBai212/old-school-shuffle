import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EditorialPreviewButton } from "@/components/editorial-preview-button";
import {
  getPlaylistMomentBySlug,
  getPlaylistMomentHref,
  getPlaylistMoments
} from "@/content/playlist";
import {
  getArchiveHref,
  getCategoryHref,
  getPostBySlug,
  getTagByName,
  getTagHref
} from "@/content/posts";

type PlaylistMomentPageProps = {
  params: {
    slug: string;
  };
};

function getTempoRange(bpms: readonly string[]) {
  const numericBpms = bpms
    .map((bpm) => Number.parseInt(bpm, 10))
    .filter((value) => Number.isFinite(value));

  if (numericBpms.length === 0) {
    return "Tempo varies";
  }

  const minBpm = Math.min(...numericBpms);
  const maxBpm = Math.max(...numericBpms);

  return minBpm === maxBpm ? `${minBpm} BPM` : `${minBpm}-${maxBpm} BPM`;
}

export function generateStaticParams() {
  return getPlaylistMoments().map((moment) => ({
    slug: moment.slug
  }));
}

export function generateMetadata({ params }: PlaylistMomentPageProps): Metadata {
  const moment = getPlaylistMomentBySlug(params.slug);

  if (!moment) {
    return {
      title: "Mix not found | Old School Shuffle"
    };
  }

  return {
    title: `${moment.title} mix | Old School Shuffle`,
    description: `${moment.description} ${moment.routeNote}`
  };
}

export default function PlaylistMomentPage({ params }: PlaylistMomentPageProps) {
  const moment = getPlaylistMomentBySlug(params.slug);

  if (!moment) {
    notFound();
  }

  const tracks = moment.tracks;
  const leadTrack = tracks[0]!;
  const leadPost = getPostBySlug(leadTrack.linkedPostSlug);
  const relatedTag = getTagByName(moment.archiveTag);
  const relatedPosts = Array.from(
    new Map(
      tracks
        .map((track) => getPostBySlug(track.linkedPostSlug))
        .filter((post): post is NonNullable<typeof post> => Boolean(post))
        .map((post) => [post.slug, post])
    ).values()
  );
  const linkedCategories = Array.from(
    new Set(relatedPosts.map((post) => post.category))
  );
  const otherMoments = getPlaylistMoments().filter(
    (candidateMoment) => candidateMoment.slug !== moment.slug
  );
  const bpmRange = getTempoRange(tracks.map((track) => track.bpm));

  return (
    <main className="blog-shell playlist-shell mix-shell">
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
          <p className="section-kicker">Editorial mix</p>
          <h1>{moment.title} mix</h1>
          <p className="archive-dek">
            {moment.description} {moment.routeNote}
          </p>
        </div>

        <div className="archive-chip-row" aria-label={`${moment.title} mix markers`}>
          <Link className="tag-chip" href={getTagHref(moment.archiveTag)}>
            {moment.archiveTag}
          </Link>

          {linkedCategories.map((category) => (
            <Link className="tag-chip" href={getCategoryHref(category)} key={category}>
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section aria-label={`${moment.title} mix stats`} className="signal-strip fade-up">
        <article className="signal-pill">
          <span className="signal-label">Cuts</span>
          <strong className="signal-value">{tracks.length}</strong>
        </article>

        <article className="signal-pill">
          <span className="signal-label">Reading queue</span>
          <strong className="signal-value">{relatedPosts.length} stories</strong>
        </article>

        <article className="signal-pill">
          <span className="signal-label">Tempo range</span>
          <strong className="signal-value">{bpmRange}</strong>
        </article>
      </section>

      <section className="archive-lead-grid fade-up">
        <article className="paper-card archive-feature">
          <div className="story-badges">
            <span className="story-badge">Lead cut</span>
            <Link className="story-issue" href={getTagHref(moment.archiveTag)}>
              {moment.archiveTag}
            </Link>
          </div>

          <p className="section-kicker">{moment.title}</p>
          <h2>{leadTrack.title}</h2>
          <p className="archive-feature-copy">{leadTrack.note}</p>

          <p className="story-meta">
            {leadTrack.artist}
            <span aria-hidden="true"> / </span>
            {leadTrack.length}
            <span aria-hidden="true"> / </span>
            {leadTrack.bpm}
          </p>

          <EditorialPreviewButton track={leadTrack} />

          {leadPost ? (
            <div className="track-chip-row" aria-label={`${leadTrack.title} archive links`}>
              <Link className="tag-chip" href={getCategoryHref(leadPost.category)}>
                {leadPost.category}
              </Link>

              {leadPost.tags.slice(0, 2).map((tag) => (
                <Link className="tag-chip" href={getTagHref(tag)} key={tag}>
                  {tag}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="story-link-row">
            {leadPost ? (
              <Link className="story-link" href={`/posts/${leadPost.slug}`}>
                Read alongside this cut
              </Link>
            ) : null}

            <Link className="story-link" href="/playlist">
              Return to the full queue
            </Link>
          </div>
        </article>

        <div className="sidebar-stack">
          <section className="sidebar-card">
            <p className="section-kicker">Mix note</p>
            <h2>{relatedTag?.noteTitle ?? `${moment.title} signal`}</h2>
            <p className="article-sidecopy">
              {relatedTag?.note ??
                "Each editorial mix should feel like a route through the site: a cluster of tracks, moods, and stories that belong to the same late-night session."}
            </p>
          </section>

          <section className="sidebar-card dark-card">
            <p className="section-kicker">Where it lands</p>
            <h2>{moment.archiveTag}</h2>

            <ul className="mood-list">
              <li>{moment.routeNote}</li>
              <li>{relatedPosts.length} related read{relatedPosts.length === 1 ? "" : "s"} in the queue.</li>
              <li>{linkedCategories.length} lanes feeding this mix.</li>
            </ul>

            <div className="story-link-row">
              <Link className="story-link" href={getArchiveHref({ tag: moment.archiveTag })}>
                Open matching archive signal
              </Link>
            </div>
          </section>
        </div>
      </section>

      <section className="category-section fade-up">
        <div className="section-heading">
          <p className="section-kicker">In this mix</p>
          <h2>Every cut in the {moment.title.toLowerCase()} sequence.</h2>
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

                <p className="track-kicker">{moment.title}</p>
                <h3>{track.title}</h3>
                <p className="playlist-artist">{track.artist}</p>
                <p className="track-note">{track.note}</p>

                <EditorialPreviewButton track={track} />

                {linkedPost ? (
                  <>
                    <div className="track-chip-row" aria-label={`${track.title} archive links`}>
                      <Link className="tag-chip" href={getCategoryHref(linkedPost.category)}>
                        {linkedPost.category}
                      </Link>

                      {linkedPost.tags.slice(0, 2).map((tag) => (
                        <Link className="tag-chip" href={getTagHref(tag)} key={tag}>
                          {tag}
                        </Link>
                      ))}
                    </div>

                    <Link className="track-read-link" href={`/posts/${linkedPost.slug}`}>
                      Read alongside: {linkedPost.title}
                    </Link>
                  </>
                ) : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="category-section fade-up">
        <div className="section-heading">
          <p className="section-kicker">Reading queue</p>
          <h2>Stories that share this temperature.</h2>
        </div>

        <div className="playlist-reading-grid">
          {relatedPosts.map((post) => (
            <Link className="article-link-card" href={`/posts/${post.slug}`} key={post.slug}>
              <span>{post.category}</span>
              <strong>{post.title}</strong>
              <p>{post.deck}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="category-section fade-up">
        <div className="section-heading">
          <p className="section-kicker">Keep listening</p>
          <h2>More editorial mixes from the listening room.</h2>
        </div>

        <div className="playlist-route-grid">
          {otherMoments.map((otherMoment) => (
            <article className="route-card" key={otherMoment.slug}>
              <p className="section-kicker">{otherMoment.archiveTag}</p>
              <h3>{otherMoment.title}</h3>
              <p>{otherMoment.description}</p>

              <div className="route-chip-row">
                {otherMoment.tracks.slice(0, 2).map((track) => (
                  <span className="route-track" key={track.title}>
                    {track.title}
                  </span>
                ))}
              </div>

              <div className="story-link-row">
                <Link className="story-link" href={getPlaylistMomentHref(otherMoment.slug)}>
                  Open mix
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
