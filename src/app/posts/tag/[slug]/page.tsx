import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getArchiveHref,
  getCategories,
  getCategoryByName,
  getCategoryHref,
  getRelatedTags,
  getTagBySlug,
  getTagHref,
  getTags
} from "@/content/posts";

type TagPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return getTags().map((tag) => ({
    slug: tag.slug
  }));
}

export function generateMetadata({ params }: TagPageProps): Metadata {
  const tag = getTagBySlug(params.slug);

  if (!tag) {
    return {
      title: "Topic not found | Old School Shuffle"
    };
  }

  return {
    title: `${tag.title} | Old School Shuffle`,
    description: tag.description
  };
}

export default function TagPage({ params }: TagPageProps) {
  const tag = getTagBySlug(params.slug);

  if (!tag) {
    notFound();
  }

  const featuredPost = tag.posts[0];
  const touchedCategories = Array.from(new Set(tag.posts.map((post) => post.category)))
    .map((categoryName) => getCategoryByName(categoryName))
    .filter((category): category is NonNullable<typeof category> => Boolean(category));
  const relatedTags = getRelatedTags(tag.title);
  const leadTrackCue = featuredPost.trackCue;
  const topicRouteNotes = [
    `Start with ${featuredPost.title} if you want the cleanest entry point into this topic.`,
    touchedCategories.length === 1
      ? `This signal stays rooted in ${touchedCategories[0]!.title.toLowerCase()}.`
      : `This signal crosses ${touchedCategories.length} archive lanes without losing its temperature.`,
    `The strongest cue here is ${leadTrackCue.title} by ${leadTrackCue.artist}.`
  ] as const;
  const adjacentCategories = getCategories().filter((category) =>
    touchedCategories.some((touchedCategory) => touchedCategory.slug === category.slug)
  );

  return (
    <main className="blog-shell category-shell tag-shell">
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
          <p className="section-kicker">Topic signal</p>
          <h1>{tag.title}</h1>
          <p className="archive-dek">{tag.description}</p>
        </div>

        <div className="archive-chip-row" aria-label={`${tag.title} lanes`}>
          {touchedCategories.map((category) => (
            <Link className="tag-chip" href={getCategoryHref(category.title)} key={category.slug}>
              {category.title}
            </Link>
          ))}
        </div>
      </section>

      <section aria-label={`${tag.title} stats`} className="signal-strip fade-up">
        <article className="signal-pill">
          <span className="signal-label">Issues</span>
          <strong className="signal-value">{tag.posts.length}</strong>
        </article>

        <article className="signal-pill">
          <span className="signal-label">Lanes touched</span>
          <strong className="signal-value">{touchedCategories.length}</strong>
        </article>

        <article className="signal-pill">
          <span className="signal-label">Lead cue</span>
          <strong className="signal-value">{leadTrackCue.title}</strong>
        </article>
      </section>

      <section className="archive-lead-grid fade-up">
        <article className="paper-card archive-feature">
          <div className="story-badges">
            <span className="story-badge">{featuredPost.issue}</span>
            <Link className="story-issue" href={getCategoryHref(featuredPost.category)}>
              {featuredPost.category}
            </Link>
          </div>

          <p className="section-kicker">Lead issue</p>
          <h2>{featuredPost.title}</h2>
          <p className="archive-feature-copy">{featuredPost.deck}</p>

          <p className="story-meta">
            By {featuredPost.author}
            <span aria-hidden="true"> / </span>
            {featuredPost.dateline}
            <span aria-hidden="true"> / </span>
            {featuredPost.readLabel}
          </p>

          <div className="story-link-row">
            <Link className="story-link" href={`/posts/${featuredPost.slug}`}>
              Read this issue
            </Link>
          </div>
        </article>

        <div className="sidebar-stack">
          <section className="sidebar-card">
            <p className="section-kicker">Topic note</p>
            <h2>{tag.noteTitle}</h2>
            <p className="article-sidecopy">{tag.note}</p>
          </section>

          <section className="sidebar-card dark-card">
            <p className="section-kicker">How it moves</p>
            <h2>{leadTrackCue.title}</h2>

            <ul className="mood-list">
              {topicRouteNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>

            <div className="story-link-row">
              <Link className="story-link" href="/playlist">
                Pair it with the playlist
              </Link>
            </div>
          </section>
        </div>
      </section>

      <section className="category-section fade-up">
        <div className="section-heading">
          <p className="section-kicker">Matching issues</p>
          <h2>{tag.posts.length === 1 ? "Current issue" : "Every issue carrying this signal."}</h2>
        </div>

        <div className="archive-grid category-grid">
          {tag.posts.map((post) => (
            <article className="post-card archive-card" key={post.slug}>
              <Link className="post-topline post-topline-link" href={getCategoryHref(post.category)}>
                {post.category}
              </Link>

              <Link className="post-card-link" href={`/posts/${post.slug}`}>
                <h3>{post.title}</h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <p className="post-footer">
                  {post.cardLabel}
                  <span aria-hidden="true"> / </span>
                  {post.readLabel}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="category-section fade-up">
        <div className="section-heading">
          <p className="section-kicker">Lanes touched</p>
          <h2>Where this topic shows up in the archive.</h2>
        </div>

        <div className="playlist-reading-grid">
          {adjacentCategories.map((category) => (
            <Link
              className="article-link-card"
              href={getCategoryHref(category.title)}
              key={category.slug}
            >
              <span>{category.posts.length} issue{category.posts.length === 1 ? "" : "s"}</span>
              <strong>{category.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      {relatedTags.length > 0 ? (
        <section className="category-section fade-up">
          <div className="section-heading">
            <p className="section-kicker">Nearby signals</p>
            <h2>Other topics moving in the same air.</h2>
          </div>

          <div className="archive-chip-row" aria-label={`${tag.title} related tags`}>
            {relatedTags.map((relatedTag) => (
              <Link className="tag-chip" href={getTagHref(relatedTag.title)} key={relatedTag.slug}>
                {relatedTag.title}
              </Link>
            ))}
          </div>

          <div className="story-link-row">
            <Link className="story-link" href={getArchiveHref({ tag: tag.title })}>
              Open this signal in the archive explorer
            </Link>
          </div>
        </section>
      ) : null}
    </main>
  );
}
