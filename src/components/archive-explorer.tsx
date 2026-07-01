"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams
} from "next/navigation";
import {
  Suspense,
  startTransition,
  useDeferredValue,
  useEffect,
  useState
} from "react";
import {
  getCategoryHref,
  slugifyCategory,
  slugifyTag,
  type Post
} from "@/content/posts";

type ArchiveExplorerProps = {
  posts: readonly Post[];
};

type FilterOption = {
  label: string;
  slug: string;
  count: number;
};

type SearchParamsState = Pick<URLSearchParams, "get" | "toString"> | null;

type RouterState = {
  replace: (href: string, options?: { scroll?: boolean }) => void;
} | null;

type ArchiveExplorerContentProps = ArchiveExplorerProps & {
  pathname: string;
  router: RouterState;
  searchParams: SearchParamsState;
};

const allLanesLabel = "All lanes";
const allSignalsLabel = "All signals";

function normalizeValue(value: string) {
  return value.trim().toLowerCase();
}

function getFilterLabel(
  options: readonly FilterOption[],
  slug: string | null,
  fallbackLabel: string
) {
  if (!slug) {
    return fallbackLabel;
  }

  return options.find((option) => option.slug === slug)?.label ?? fallbackLabel;
}

function getFilterSlug(options: readonly FilterOption[], label: string) {
  return options.find((option) => option.label === label)?.slug;
}

function getCategoryOptions(posts: readonly Post[]) {
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  });

  return [...counts.entries()].map(([label, count]) => ({
    label,
    slug: slugifyCategory(label),
    count
  })) satisfies FilterOption[];
}

function getTagOptions(posts: readonly Post[]) {
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .map(([label, count]) => ({
      label,
      slug: slugifyTag(label),
      count
    }))
    .sort((leftOption, rightOption) => {
      if (rightOption.count !== leftOption.count) {
        return rightOption.count - leftOption.count;
      }

      return leftOption.label.localeCompare(rightOption.label);
    }) satisfies FilterOption[];
}

function ArchiveExplorerContent({
  posts,
  pathname,
  router,
  searchParams
}: ArchiveExplorerContentProps) {
  const [categoryOptions] = useState<readonly FilterOption[]>(() =>
    getCategoryOptions(posts)
  );
  const [tagOptions] = useState<readonly FilterOption[]>(() => getTagOptions(posts));
  const [query, setQuery] = useState(() => searchParams?.get("q") ?? "");
  const [selectedCategory, setSelectedCategory] = useState(() =>
    getFilterLabel(categoryOptions, searchParams?.get("lane") ?? null, allLanesLabel)
  );
  const [selectedTag, setSelectedTag] = useState(() =>
    getFilterLabel(tagOptions, searchParams?.get("tag") ?? null, allSignalsLabel)
  );
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeValue(deferredQuery);
  const isLaneFiltered = selectedCategory !== allLanesLabel;
  const isSignalFiltered = selectedTag !== allSignalsLabel;
  const queryString = searchParams?.toString() ?? "";

  useEffect(() => {
    if (!searchParams) {
      return;
    }

    const nextQuery = searchParams.get("q") ?? "";
    const nextCategory = getFilterLabel(
      categoryOptions,
      searchParams.get("lane"),
      allLanesLabel
    );
    const nextTag = getFilterLabel(
      tagOptions,
      searchParams.get("tag"),
      allSignalsLabel
    );

    setQuery((currentQuery) =>
      currentQuery === nextQuery ? currentQuery : nextQuery
    );
    setSelectedCategory((currentCategory) =>
      currentCategory === nextCategory ? currentCategory : nextCategory
    );
    setSelectedTag((currentTag) =>
      currentTag === nextTag ? currentTag : nextTag
    );
  }, [categoryOptions, queryString, searchParams, tagOptions]);

  useEffect(() => {
    if (!router || !searchParams) {
      return;
    }

    const nextSearchParams = new URLSearchParams();
    const trimmedQuery = deferredQuery.trim();
    const laneSlug = isLaneFiltered
      ? getFilterSlug(categoryOptions, selectedCategory)
      : undefined;
    const tagSlug = isSignalFiltered
      ? getFilterSlug(tagOptions, selectedTag)
      : undefined;

    if (trimmedQuery) {
      nextSearchParams.set("q", trimmedQuery);
    }

    if (laneSlug) {
      nextSearchParams.set("lane", laneSlug);
    }

    if (tagSlug) {
      nextSearchParams.set("tag", tagSlug);
    }

    const nextQueryString = nextSearchParams.toString();

    if (nextQueryString === queryString) {
      return;
    }

    startTransition(() => {
      router.replace(
        nextQueryString ? `${pathname}?${nextQueryString}` : pathname,
        { scroll: false }
      );
    });
  }, [
    categoryOptions,
    deferredQuery,
    isLaneFiltered,
    isSignalFiltered,
    pathname,
    queryString,
    router,
    searchParams,
    selectedCategory,
    selectedTag,
    tagOptions
  ]);

  const filteredPosts = posts.filter((post) => {
    if (isLaneFiltered && post.category !== selectedCategory) {
      return false;
    }

    if (isSignalFiltered && !post.tags.includes(selectedTag)) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchHaystack = [
      post.title,
      post.excerpt,
      post.deck,
      post.category,
      post.author,
      post.trackCue.title,
      ...post.tags
    ]
      .join(" ")
      .toLowerCase();

    return searchHaystack.includes(normalizedQuery);
  });

  const filteredGroups = categoryOptions
    .map((categoryOption) => ({
      category: categoryOption.label,
      posts: filteredPosts.filter((post) => post.category === categoryOption.label)
    }))
    .filter((group) => group.posts.length > 0);

  const hasActiveFilters =
    isLaneFiltered || isSignalFiltered || normalizedQuery.length > 0;
  const activeFilterLabels = [
    isLaneFiltered ? `Lane: ${selectedCategory}` : undefined,
    isSignalFiltered ? `Signal: ${selectedTag}` : undefined,
    normalizedQuery ? `Search: "${deferredQuery.trim()}"` : undefined
  ].filter((label): label is string => Boolean(label));

  function handleReset() {
    startTransition(() => {
      setQuery("");
      setSelectedCategory(allLanesLabel);
      setSelectedTag(allSignalsLabel);
    });
  }

  return (
    <section className="archive-explorer fade-up">
      <div className="paper-card archive-explorer-shell">
        <div className="archive-explorer-head">
          <div className="section-heading">
            <p className="section-kicker">Archive explorer</p>
            <h2>Search the archive by lane, title, mood, or signal.</h2>
          </div>

          <p className="archive-summary">
            Showing {filteredPosts.length} of {posts.length} issues
            {activeFilterLabels.length > 0 ? ` / ${activeFilterLabels.join(" / ")}` : null}
          </p>
        </div>

        <div className="archive-filter-bar">
          <label className="archive-search">
            <span className="archive-search-label">Search archive</span>
            <input
              aria-label="Search archive"
              name="archive-search"
              onChange={(event) => {
                const nextValue = event.target.value;
                startTransition(() => {
                  setQuery(nextValue);
                });
              }}
              placeholder="Search titles, tags, artists, or atmosphere..."
              type="search"
              value={query}
            />
          </label>

          <button className="archive-reset" onClick={handleReset} type="button">
            Clear filters
          </button>
        </div>

        <div className="archive-chip-set" aria-label="Archive lane filters" role="group">
          <button
            className={`filter-chip${selectedCategory === allLanesLabel ? " filter-chip-active" : ""}`}
            onClick={() => {
              startTransition(() => {
                setSelectedCategory(allLanesLabel);
              });
            }}
            type="button"
          >
            {allLanesLabel}
          </button>

          {categoryOptions.map((category) => (
            <button
              className={`filter-chip${selectedCategory === category.label ? " filter-chip-active" : ""}`}
              key={category.slug}
              onClick={() => {
                startTransition(() => {
                  setSelectedCategory(category.label);
                });
              }}
              type="button"
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="archive-chip-set" aria-label="Archive signal filters" role="group">
          <button
            className={`filter-chip${selectedTag === allSignalsLabel ? " filter-chip-active" : ""}`}
            onClick={() => {
              startTransition(() => {
                setSelectedTag(allSignalsLabel);
              });
            }}
            type="button"
          >
            {allSignalsLabel}
          </button>

          {tagOptions.map((tag) => (
            <button
              className={`filter-chip${selectedTag === tag.label ? " filter-chip-active" : ""}`}
              key={tag.slug}
              onClick={() => {
                startTransition(() => {
                  setSelectedTag(tag.label);
                });
              }}
              type="button"
            >
              {tag.label}
            </button>
          ))}
        </div>

        {filteredPosts.length > 0 ? (
          <>
            <div className="archive-grid archive-grid-tight">
              {filteredPosts.map((post) => (
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

            <div className="archive-groups archive-groups-tight">
              {filteredGroups.map((group) => (
                <section className="archive-group" key={group.category}>
                  <div className="archive-group-heading">
                    <div className="section-heading">
                      <p className="section-kicker">
                        {hasActiveFilters ? "Matching lane" : "Category"}
                      </p>
                      <h2>{group.category}</h2>
                    </div>

                    <Link className="story-link" href={getCategoryHref(group.category)}>
                      Open lane
                    </Link>
                  </div>

                  <div className="archive-group-list">
                    {group.posts.map((post) => (
                      <Link className="archive-line" href={`/posts/${post.slug}`} key={post.slug}>
                        <div className="archive-line-copy">
                          <strong>{post.title}</strong>
                          <p>{post.excerpt}</p>
                        </div>

                        <span>{post.readLabel}</span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        ) : (
          <div className="archive-empty">
            <p className="section-kicker">No matches</p>
            <h2>Nothing in the room matches that search yet.</h2>
            <p>
              Try a different lane, signal, or search phrase, or clear the filters to
              let the whole archive breathe again.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function ArchiveExplorerConnected(props: ArchiveExplorerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <ArchiveExplorerContent
      {...props}
      pathname={pathname}
      router={router}
      searchParams={searchParams}
    />
  );
}

export function ArchiveExplorer(props: ArchiveExplorerProps) {
  return (
    <Suspense
      fallback={
        <ArchiveExplorerContent
          {...props}
          pathname="/posts"
          router={null}
          searchParams={null}
        />
      }
    >
      <ArchiveExplorerConnected {...props} />
    </Suspense>
  );
}
