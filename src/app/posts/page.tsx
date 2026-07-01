import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts, getCategories, getCategoryHref } from "@/content/posts";
import { ArchiveExplorer } from "@/components/archive-explorer";

export const metadata: Metadata = {
  title: "Archive | Old School Shuffle",
  description:
    "Browse the Old School Shuffle archive: nightlife essays, booth notes, scene reports, and after-hours music writing."
};

export default function PostsArchivePage() {
  const posts = getAllPosts();
  const featuredPost = posts[0]!;
  const categories = getCategories();

  return (
    <main className="blog-shell archive-shell">
      <header className="masthead fade-up">
        <div className="brand-block">
          <p className="eyebrow">Independent after-hours dispatches and shuffle-led booth notes</p>
          <Link className="brand-mark" href="/">
            Old School Shuffle
          </Link>
        </div>

        <nav aria-label="Primary" className="top-nav">
          <Link href="/">Front page</Link>
          <Link href="/playlist">Playlist</Link>
          <Link href="/posts">Archive</Link>
        </nav>
      </header>

      <section className="archive-hero fade-up">
        <div className="archive-hero-copy">
          <p className="section-kicker">Archive</p>
          <h1>Browse the room after the lights come up.</h1>
          <p className="archive-dek">
            Scene reports, booth notes, and after-hours essays collected into one
            running archive. Less landing page, more actual publication.
          </p>
        </div>

        <div className="archive-chip-row" aria-label="Archive categories">
          {categories.map((category) => (
            <Link className="tag-chip" href={getCategoryHref(category.title)} key={category.slug}>
              {category.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="archive-lead-grid fade-up">
        <article className="paper-card archive-feature">
          <div className="story-badges">
            <span className="story-badge">{featuredPost.issue}</span>
            <Link className="story-issue" href={getCategoryHref(featuredPost.category)}>
              {featuredPost.category}
            </Link>
          </div>

          <p className="section-kicker">Latest issue</p>
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
              Read the latest issue
            </Link>
          </div>
        </article>

        <aside className="sidebar-card archive-note">
          <p className="section-kicker">How to browse</p>
          <h2>Start with the mood, not the chronology.</h2>
          <p className="article-sidecopy">
            Each category is its own lane through the archive: floor reports,
            scene notes, booth strategy, and essays filed after the room emptied.
          </p>

          <div className="story-link-row">
            <Link className="story-link" href="/playlist">
              Pair it with the playlist
            </Link>
          </div>
        </aside>
      </section>

      <ArchiveExplorer posts={posts} />
    </main>
  );
}
