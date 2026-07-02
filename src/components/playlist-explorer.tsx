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
  getTagHref,
  slugifyCategory,
  type Post
} from "@/content/posts";
import {
  getPlaylistMomentTitle,
  type PlaylistMomentSlug,
  type PlaylistTrack
} from "@/content/playlist";

type PlaylistExplorerEntry = {
  track: PlaylistTrack;
  post: Post;
};

type PlaylistExplorerProps = {
  entries: readonly PlaylistExplorerEntry[];
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

type PlaylistExplorerContentProps = PlaylistExplorerProps & {
  pathname: string;
  router: RouterState;
  searchParams: SearchParamsState;
};

const allTurnsLabel = "All turns";
const allLanesLabel = "All lanes";

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

function getTurnOptions(entries: readonly PlaylistExplorerEntry[]) {
  const counts = new Map<PlaylistMomentSlug, number>();

  entries.forEach(({ track }) => {
    counts.set(track.moment, (counts.get(track.moment) ?? 0) + 1);
  });

  return [...counts.entries()].map(([slug, count]) => ({
    label: getPlaylistMomentTitle(slug),
    slug,
    count
  })) satisfies FilterOption[];
}

function getLaneOptions(entries: readonly PlaylistExplorerEntry[]) {
  const counts = new Map<string, number>();

  entries.forEach(({ post }) => {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  });

  return [...counts.entries()]
    .map(([label, count]) => ({
      label,
      slug: slugifyCategory(label),
      count
    }))
    .sort((leftOption, rightOption) => {
      if (rightOption.count !== leftOption.count) {
        return rightOption.count - leftOption.count;
      }

      return leftOption.label.localeCompare(rightOption.label);
    }) satisfies FilterOption[];
}

function PlaylistExplorerContent({
  entries,
  pathname,
  router,
  searchParams
}: PlaylistExplorerContentProps) {
  const [turnOptions] = useState<readonly FilterOption[]>(() => getTurnOptions(entries));
  const [laneOptions] = useState<readonly FilterOption[]>(() => getLaneOptions(entries));
  const [query, setQuery] = useState(() => searchParams?.get("q") ?? "");
  const [selectedTurn, setSelectedTurn] = useState(() =>
    getFilterLabel(turnOptions, searchParams?.get("turn") ?? null, allTurnsLabel)
  );
  const [selectedLane, setSelectedLane] = useState(() =>
    getFilterLabel(laneOptions, searchParams?.get("lane") ?? null, allLanesLabel)
  );
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeValue(deferredQuery);
  const isTurnFiltered = selectedTurn !== allTurnsLabel;
  const isLaneFiltered = selectedLane !== allLanesLabel;
  const queryString = searchParams?.toString() ?? "";

  useEffect(() => {
    if (!searchParams) {
      return;
    }

    const nextQuery = searchParams.get("q") ?? "";
    const nextTurn = getFilterLabel(turnOptions, searchParams.get("turn"), allTurnsLabel);
    const nextLane = getFilterLabel(laneOptions, searchParams.get("lane"), allLanesLabel);

    setQuery((currentQuery) =>
      currentQuery === nextQuery ? currentQuery : nextQuery
    );
    setSelectedTurn((currentTurn) =>
      currentTurn === nextTurn ? currentTurn : nextTurn
    );
    setSelectedLane((currentLane) =>
      currentLane === nextLane ? currentLane : nextLane
    );
  }, [laneOptions, queryString, searchParams, turnOptions]);

  useEffect(() => {
    if (!router || !searchParams) {
      return;
    }

    const nextSearchParams = new URLSearchParams();
    const trimmedQuery = deferredQuery.trim();
    const turnSlug = isTurnFiltered
      ? getFilterSlug(turnOptions, selectedTurn)
      : undefined;
    const laneSlug = isLaneFiltered
      ? getFilterSlug(laneOptions, selectedLane)
      : undefined;

    if (trimmedQuery) {
      nextSearchParams.set("q", trimmedQuery);
    }

    if (turnSlug) {
      nextSearchParams.set("turn", turnSlug);
    }

    if (laneSlug) {
      nextSearchParams.set("lane", laneSlug);
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
    deferredQuery,
    isLaneFiltered,
    isTurnFiltered,
    laneOptions,
    pathname,
    queryString,
    router,
    searchParams,
    selectedLane,
    selectedTurn,
    turnOptions
  ]);

  const filteredEntries = entries.filter(({ track, post }) => {
    if (isTurnFiltered && getPlaylistMomentTitle(track.moment) !== selectedTurn) {
      return false;
    }

    if (isLaneFiltered && post.category !== selectedLane) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchHaystack = [
      track.title,
      track.artist,
      track.lane,
      track.bpm,
      track.vibe,
      track.note,
      getPlaylistMomentTitle(track.moment),
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

  const filteredPosts = Array.from(
    new Map(filteredEntries.map(({ post }) => [post.slug, post])).values()
  );
  const hasActiveFilters =
    isTurnFiltered || isLaneFiltered || normalizedQuery.length > 0;
  const activeFilterLabels = [
    isTurnFiltered ? `Turn: ${selectedTurn}` : undefined,
    isLaneFiltered ? `Lane: ${selectedLane}` : undefined,
    normalizedQuery ? `Search: "${deferredQuery.trim()}"` : undefined
  ].filter((label): label is string => Boolean(label));

  function handleReset() {
    startTransition(() => {
      setQuery("");
      setSelectedTurn(allTurnsLabel);
      setSelectedLane(allLanesLabel);
    });
  }

  return (
    <section className="archive-explorer fade-up">
      <div className="paper-card archive-explorer-shell">
        <div className="archive-explorer-head">
          <div className="section-heading">
            <p className="section-kicker">Listening room explorer</p>
            <h2>Search the queue by turn, lane, artist, or linked story.</h2>
          </div>

          <p className="archive-summary">
            Showing {filteredEntries.length} of {entries.length} cuts
            {activeFilterLabels.length > 0 ? ` / ${activeFilterLabels.join(" / ")}` : null}
          </p>
        </div>

        <div className="archive-filter-bar">
          <label className="archive-search">
            <span className="archive-search-label">Search queue</span>
            <input
              aria-label="Search queue"
              name="playlist-search"
              onChange={(event) => {
                const nextValue = event.target.value;
                startTransition(() => {
                  setQuery(nextValue);
                });
              }}
              placeholder="Search tracks, artists, lanes, or atmosphere..."
              type="search"
              value={query}
            />
          </label>

          <button className="archive-reset" onClick={handleReset} type="button">
            Clear filters
          </button>
        </div>

        <div className="archive-chip-set" aria-label="Listening room turn filters" role="group">
          <button
            className={`filter-chip${selectedTurn === allTurnsLabel ? " filter-chip-active" : ""}`}
            onClick={() => {
              startTransition(() => {
                setSelectedTurn(allTurnsLabel);
              });
            }}
            type="button"
          >
            {allTurnsLabel}
          </button>

          {turnOptions.map((turn) => (
            <button
              className={`filter-chip${selectedTurn === turn.label ? " filter-chip-active" : ""}`}
              key={turn.slug}
              onClick={() => {
                startTransition(() => {
                  setSelectedTurn(turn.label);
                });
              }}
              type="button"
            >
              {turn.label}
            </button>
          ))}
        </div>

        <div className="archive-chip-set" aria-label="Listening room lane filters" role="group">
          <button
            className={`filter-chip${selectedLane === allLanesLabel ? " filter-chip-active" : ""}`}
            onClick={() => {
              startTransition(() => {
                setSelectedLane(allLanesLabel);
              });
            }}
            type="button"
          >
            {allLanesLabel}
          </button>

          {laneOptions.map((lane) => (
            <button
              className={`filter-chip${selectedLane === lane.label ? " filter-chip-active" : ""}`}
              key={lane.slug}
              onClick={() => {
                startTransition(() => {
                  setSelectedLane(lane.label);
                });
              }}
              type="button"
            >
              {lane.label}
            </button>
          ))}
        </div>

        {filteredEntries.length > 0 ? (
          <div className="playlist-explorer-stack">
            <div className="track-board">
              {filteredEntries.map(({ track, post }, index) => (
                <article className="track-card" key={`${track.title}-${track.artist}`}>
                  <p className="track-index">{`${index + 1}`.padStart(2, "0")}</p>

                  <div className="track-meta-row">
                    <span>{track.lane}</span>
                    <span>{track.length}</span>
                    <span>{track.bpm}</span>
                  </div>

                  <p className="track-kicker">{getPlaylistMomentTitle(track.moment)}</p>
                  <h3>{track.title}</h3>
                  <p className="playlist-artist">{track.artist}</p>
                  <p className="track-note">{track.note}</p>

                  <div className="track-chip-row" aria-label={`${track.title} archive links`}>
                    <Link className="tag-chip" href={getCategoryHref(post.category)}>
                      {post.category}
                    </Link>

                    {post.tags.slice(0, 2).map((tag) => (
                      <Link className="tag-chip" href={getTagHref(tag)} key={tag}>
                        {tag}
                      </Link>
                    ))}
                  </div>

                  <Link className="track-read-link" href={`/posts/${post.slug}`}>
                    Read alongside: {post.title}
                  </Link>
                </article>
              ))}
            </div>

            <section className="archive-group">
              <div className="archive-group-heading">
                <div className="section-heading">
                  <p className="section-kicker">
                    {hasActiveFilters ? "Matching reads" : "Reading companion"}
                  </p>
                  <h2>Stories linked back into the queue.</h2>
                </div>
              </div>

              <div className="playlist-reading-grid">
                {filteredPosts.map((post) => (
                  <Link className="article-link-card" href={`/posts/${post.slug}`} key={post.slug}>
                    <span>{post.category}</span>
                    <strong>{post.title}</strong>
                    <p>{post.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="archive-empty">
            <p className="section-kicker">No matches</p>
            <h2>Nothing in the queue matches that search right now.</h2>
            <p>
              Try a different turn, lane, or search phrase, or clear the filters to
              bring the full listening room back into view.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function PlaylistExplorerConnected(props: PlaylistExplorerProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <PlaylistExplorerContent
      {...props}
      pathname={pathname}
      router={router}
      searchParams={searchParams}
    />
  );
}

export function PlaylistExplorer(props: PlaylistExplorerProps) {
  return (
    <Suspense
      fallback={
        <PlaylistExplorerContent
          {...props}
          pathname="/playlist"
          router={null}
          searchParams={null}
        />
      }
    >
      <PlaylistExplorerConnected {...props} />
    </Suspense>
  );
}
