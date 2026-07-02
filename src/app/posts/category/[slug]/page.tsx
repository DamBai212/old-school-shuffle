import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getArchiveHref,
  getCategories,
  getCategoryBySlug,
  getRelatedCategories,
  getTagHref
} from "@/content/posts";

type CategoryPageProps = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return getCategories().map((category) => ({
    slug: category.slug
  }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    return {
      title: "Category not found | Old School Shuffle"
    };
  }

  return {
    title: `${category.title} | Old School Shuffle`,
    description: category.description
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  const featuredPost = category.posts[0];
  const laneTags = Array.from(
    new Set(category.posts.flatMap((post) => post.tags))
  ).slice(0, 5);
  const otherCategories = getRelatedCategories(category.slug, 4);

  return (
    <main className="blog-shell category-shell">
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
          <p className="section-kicker">Archive lane</p>
          <h1>{category.title}</h1>
          <p className="archive-dek">{category.description}</p>
        </div>

        <div className="archive-chip-row" aria-label={`${category.title} tags`}>
          {laneTags.map((tag) => (
            <Link className="tag-chip" href={getTagHref(tag)} key={tag}>
              {tag}
            </Link>
          ))}
        </div>
      </section>

      <section aria-label={`${category.title} stats`} className="signal-strip fade-up">
        <article className="signal-pill">
          <span className="signal-label">Issues</span>
          <strong className="signal-value">{category.posts.length}</strong>
        </article>

        <article className="signal-pill">
          <span className="signal-label">Lead cue</span>
          <strong className="signal-value">{featuredPost.trackCue.title}</strong>
        </article>

        <article className="signal-pill">
          <span className="signal-label">Filed from</span>
          <strong className="signal-value">{featuredPost.dateline}</strong>
        </article>
      </section>

      <section className="archive-lead-grid fade-up">
        <article className="paper-card archive-feature">
          <div className="story-badges">
            <span className="story-badge">{featuredPost.issue}</span>
            <Link className="story-issue" href={`/posts/category/${category.slug}`}>
              {category.title}
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
            <p className="section-kicker">Lane note</p>
            <h2>{category.noteTitle}</h2>
            <p className="article-sidecopy">{category.note}</p>
          </section>

          <section className="sidebar-card dark-card">
            <p className="section-kicker">Best entered through</p>
            <h2>{featuredPost.trackCue.title}</h2>

            <ul className="mood-list">
              {category.routeNotes.map((note) => (
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
          <p className="section-kicker">In this lane</p>
          <h2>{category.posts.length === 1 ? "Current issue" : "Issues in this lane"}</h2>
        </div>

        <div className="archive-grid category-grid">
          {category.posts.map((post) => (
            <article className="post-card archive-card" key={post.slug}>
              <p className="post-topline">{post.category}</p>

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
          <p className="section-kicker">Crossroads</p>
          <h2>Nearby lanes in the archive.</h2>
        </div>

        <div className="playlist-reading-grid">
          {otherCategories.map((otherCategory) => (
            <Link
              className="article-link-card"
              href={`/posts/category/${otherCategory.category.slug}`}
              key={otherCategory.category.slug}
            >
              <span>
                {otherCategory.sharedTags.length > 0
                  ? otherCategory.sharedTags.slice(0, 2).join(" / ")
                  : `${otherCategory.category.posts.length} issue${otherCategory.category.posts.length === 1 ? "" : "s"}`}
              </span>
              <strong>{otherCategory.category.title}</strong>
            </Link>
          ))}
        </div>

        <div className="story-link-row">
          <Link className="story-link" href={getArchiveHref({ category: category.title })}>
            Open this lane in the archive explorer
          </Link>
        </div>
      </section>
    </main>
  );
}
