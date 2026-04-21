import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/content/posts";

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

  const relatedPosts = getAllPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, 2);

  return (
    <main className="blog-shell article-shell">
      <header className="masthead fade-up">
        <div className="brand-block">
          <p className="eyebrow">Independent after-hours dispatches and shuffle-led booth notes</p>
          <Link className="brand-mark" href="/">
            Old School Shuffle
          </Link>
        </div>

        <nav aria-label="Primary" className="top-nav">
          <Link href="/">Front page</Link>
          <Link href="/#latest">Latest</Link>
          <Link href="/#playlist">Playlist</Link>
        </nav>
      </header>

      <article className="article-layout fade-up">
        <div className="paper-card article-main">
          <Link className="article-back" href="/">
            Back to the front page
          </Link>

          <div className="story-badges">
            <span className="story-badge">{post.issue}</span>
            <span className="story-issue">{post.category}</span>
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
              <span className="tag-chip" key={tag}>
                {tag}
              </span>
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
        </div>

        <aside className="article-sidebar">
          <section className="sidebar-card">
            <p className="section-kicker">Track cue</p>
            <h2>{post.trackCue.title}</h2>
            <p className="playlist-artist">{post.trackCue.artist}</p>
            <p className="article-sidecopy">{post.trackCue.note}</p>
          </section>

          <section className="sidebar-card dark-card">
            <p className="section-kicker">Filed from</p>
            <h2>{post.dateline}</h2>

            <ul className="mood-list">
              <li>{post.readLabel}</li>
              <li>{post.issue}</li>
              <li>{post.category}</li>
            </ul>
          </section>

          <section className="sidebar-card">
            <p className="section-kicker">Next in the queue</p>

            <div className="article-link-list">
              {relatedPosts.map((relatedPost) => (
                <Link
                  className="article-link-card"
                  href={`/posts/${relatedPost.slug}`}
                  key={relatedPost.slug}
                >
                  <span>{relatedPost.category}</span>
                  <strong>{relatedPost.title}</strong>
                </Link>
              ))}
            </div>
          </section>
        </aside>
      </article>
    </main>
  );
}
