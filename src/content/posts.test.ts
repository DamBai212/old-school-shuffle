import { describe, expect, it } from "vitest";
import {
  getAdjacentPosts,
  getArchiveHref,
  getRelatedPosts,
  getTags,
  slugifyCategory,
  slugifyTag
} from "./posts";

describe("getRelatedPosts", () => {
  it("ranks candidates by shared tags, then shared category, then editorial proximity", () => {
    const related = getRelatedPosts(
      "how-to-build-a-listening-route-through-the-night",
      3
    );

    expect(related.map((match) => match.post.slug)).toEqual([
      "basement-sets-getting-murkier-and-better",
      "five-tracks-that-hold-a-shuffled-set-together",
      "write-about-the-club-without-flattening-it"
    ]);

    expect(related[0]!.sharedTags).toEqual(["Pacing", "Atmosphere"]);
    expect(related[0]!.score).toBeGreaterThan(related[1]!.score);
  });

  it("breaks ties between equal scores using editorial distance", () => {
    const related = getRelatedPosts(
      "how-to-build-a-listening-route-through-the-night",
      5
    );

    const bridgeTracksMatch = related.find(
      (match) => match.post.slug === "five-tracks-that-hold-a-shuffled-set-together"
    )!;
    const clubWritingMatch = related.find(
      (match) => match.post.slug === "write-about-the-club-without-flattening-it"
    )!;

    expect(bridgeTracksMatch.score).toBe(clubWritingMatch.score);
    expect(related.indexOf(bridgeTracksMatch)).toBeLessThan(
      related.indexOf(clubWritingMatch)
    );
  });

  it("returns an empty list for an unknown slug", () => {
    expect(getRelatedPosts("this-post-does-not-exist")).toEqual([]);
  });
});

describe("getAdjacentPosts", () => {
  it("has no previous post at the start of the archive", () => {
    const { previousPost, nextPost } = getAdjacentPosts(
      "how-to-build-a-listening-route-through-the-night"
    );

    expect(previousPost).toBeUndefined();
    expect(nextPost?.slug).toBe("from-the-blog-to-the-booth");
  });

  it("has no next post at the end of the archive", () => {
    const { previousPost, nextPost } = getAdjacentPosts(
      "write-about-the-club-without-flattening-it"
    );

    expect(nextPost).toBeUndefined();
    expect(previousPost?.slug).toBe(
      "five-tracks-that-hold-a-shuffled-set-together"
    );
  });

  it("returns no neighbors for an unknown slug", () => {
    expect(getAdjacentPosts("this-post-does-not-exist")).toEqual({
      previousPost: undefined,
      nextPost: undefined
    });
  });
});

describe("getTags", () => {
  it("sorts by post count descending, then alphabetically", () => {
    const tags = getTags();
    const titles = tags.map((tag) => tag.title);

    expect(titles.slice(0, 3)).toEqual(["Atmosphere", "Bridge tracks", "Pacing"]);

    for (let index = 1; index < tags.length; index += 1) {
      expect(tags[index - 1]!.posts.length).toBeGreaterThanOrEqual(
        tags[index]!.posts.length
      );
    }
  });
});

describe("slugifyCategory / slugifyTag", () => {
  it("lowercases and hyphenates category and tag names", () => {
    expect(slugifyCategory("After-hours essay")).toBe("after-hours-essay");
    expect(slugifyTag("Peak-time pressure")).toBe("peak-time-pressure");
  });

  it("collapses runs of whitespace and punctuation and trims stray dashes", () => {
    expect(slugifyTag("  Multiple   Spaces!!")).toBe("multiple-spaces");
    expect(slugifyTag("2AM")).toBe("2am");
  });
});

describe("getArchiveHref", () => {
  it("returns the bare archive route when no filters are set", () => {
    expect(getArchiveHref()).toBe("/posts");
    expect(getArchiveHref({ query: "   " })).toBe("/posts");
  });

  it("builds a query string with trimmed search text and slugified filters", () => {
    expect(
      getArchiveHref({
        query: "  murky basement  ",
        category: "Floor notes",
        tag: "Low-end pressure"
      })
    ).toBe("/posts?q=murky+basement&lane=floor-notes&tag=low-end-pressure");
  });

  it("omits filters that were not provided", () => {
    expect(getArchiveHref({ category: "Booth notes" })).toBe(
      "/posts?lane=booth-notes"
    );
  });
});
