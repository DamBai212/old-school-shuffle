import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPlaylistHref,
  getPlaylistMomentHref,
  getPlaylistMomentTitle,
  getPlaylistTrackByCue
} from "@/content/playlist";
import {
  getAdjacentPosts,
  getAllPosts,
  getCategoryHref,
  getPostBySlug,
  getRelatedPosts,
  getTagHref
} from "@/content/posts";

type PostPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug
  }));
}

export function generateMetadata({ params }: PostPageProps): Metadata {
  const post = getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post not found | Old School Shuffle"
    };
  }

  return {
    title: `${post.title} | Old School Shuffle`,
    description: post.excerpt
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const { previousPost, nextPost } = getAdjacentPosts(post.slug);
  const categoryHref = getCategoryHref(post.category);
  const relatedPosts = getRelatedPosts(post.slug, 3);
  const cueTrack = getPlaylistTrackByCue(post.trackCue.title, post.trackCue.artist);
  const cueTurnTitle = cueTrack ? getPlaylistMomentTitle(cueTrack.moment) : undefined;
  const queueHref = cueTrack
    ? getPlaylistHref({
        query: cueTrack.title,
        turn: cueTrack.moment
      })
    : "/playlist";

  return (
    <main className="blog-shell article-shell">
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

      <article className="article-layout fade-up">
        <div className="paper-card article-main">
          <Link className="article-back" href="/posts">
            Back to the archive
          </Link>

          <div className="story-badges">
            <span className="story-badge">{post.issue}</span>
            <Link className="story-issue" href={categoryHref}>
              {post.category}
            </Link>
          </div>

          <p className="section-kicker">{post.category}</p>
          <h1 className="article-title">{post.title}</h1>
          <p className="article-dek">{post.deck}</p>

          <p className="story-meta">
            By {post.author}
            <span aria-hidden="true"> / </span>
            {post.dateline}
            <span aria-hidden="true"> / </span>
            {post.readLabel}
          </p>

          <div className="tag-row" aria-label="Post tags">
            {post.tags.map((tag) => (
              <Link className="tag-chip" href={getTagHref(tag)} key={tag}>
                {tag}
              </Link>
            ))}
          </div>

          <blockquote className="article-quote">{post.quote}</blockquote>

          <div className="article-body">
            {post.sections.map((section) => (
              <section className="article-section" key={section.heading}>
                <h2>{section.heading}</h2>

                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          <section className="article-pager" aria-label="Adjacent posts">
            {previousPost ? (
              <Link className="article-nav-card" href={`/posts/${previousPost.slug}`}>
                <span>Previous post</span>
                <strong>{previousPost.title}</strong>
              </Link>
            ) : (
              <div className="article-nav-card article-nav-card-muted">
                <span>Previous post</span>
                <strong>You&apos;re at the first issue in this sequence.</strong>
              </div>
            )}

            {nextPost ? (
              <Link className="article-nav-card" href={`/posts/${nextPost.slug}`}>
                <span>Next post</span>
                <strong>{nextPost.title}</strong>
              </Link>
            ) : (
              <div className="article-nav-card article-nav-card-muted">
                <span>Next post</span>
                <strong>You&apos;ve reached the latest issue in this sequence.</strong>
              </div>
            )}
          </section>
        </div>

        <aside className="article-sidebar">
          <section className="sidebar-card">
            <p className="section-kicker">Track cue</p>
            <h2>{post.trackCue.title}</h2>
            <p className="playlist-artist">{post.trackCue.artist}</p>
            <p className="article-sidecopy">{post.trackCue.note}</p>

            {cueTrack ? (
              <div className="now-stats">
                <span>{cueTurnTitle}</span>
                <span>{cueTrack.length}</span>
                <span>{cueTrack.bpm}</span>
              </div>
            ) : null}

            <div className="story-link-row">
              <Link className="story-link" href={queueHref}>
                {cueTrack ? "Open lead cue in queue" : "Hear the full queue"}
              </Link>

              {cueTrack ? (
                <Link className="article-back" href={getPlaylistMomentHref(cueTrack.moment)}>
                  Open {cueTurnTitle} mix
                </Link>
              ) : null}
            </div>
          </section>

          <section className="sidebar-card dark-card">
            <p className="section-kicker">Filed from</p>
            <h2>{post.dateline}</h2>

            <ul className="mood-list">
              <li>{post.readLabel}</li>
              <li>{post.issue}</li>
              <li>{post.category}</li>
            </ul>

            <div className="story-link-row">
              <Link className="story-link" href={categoryHref}>
                Explore this lane
              </Link>
            </div>
          </section>

          <section className="sidebar-card">
            <p className="section-kicker">Continue the signal</p>

            <div className="article-link-list">
              <Link className="article-link-card" href={categoryHref}>
                <span>Archive lane</span>
                <strong>{post.category}</strong>
              </Link>

              {relatedPosts.map((relatedPost) => (
                <Link
                  className="article-link-card"
                  href={`/posts/${relatedPost.post.slug}`}
                  key={relatedPost.post.slug}
                >
                  <span>
                    {relatedPost.sharedTags.length > 0
                      ? relatedPost.sharedTags.slice(0, 2).join(" / ")
                      : relatedPost.sharesCategory
                        ? "Same lane"
                        : "Nearby in sequence"}
                  </span>
                  <strong>{relatedPost.post.title}</strong>
                </Link>
              ))}
            </div>

            <div className="story-link-row">
              <Link className="story-link" href="/posts">
                Browse full archive
              </Link>
            </div>
          </section>
        </aside>
      </article>
    </main>
  );
}
