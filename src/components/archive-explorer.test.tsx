import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Post } from "@/content/posts";
import { ArchiveExplorer } from "./archive-explorer";

const replace = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/posts",
  useRouter: () => ({ replace }),
  useSearchParams: () => new URLSearchParams()
}));

function buildPost(overrides: Partial<Post>): Post {
  return {
    slug: "default-slug",
    category: "Cover story",
    title: "Default title",
    excerpt: "Default excerpt",
    deck: "Default deck",
    author: "Mara Ellis",
    dateline: "Filed from Basement A",
    readLabel: "5 min read",
    cardLabel: "Cover story",
    issue: "Issue 01",
    tags: [],
    quote: "Default quote",
    trackCue: { title: "Default cue", artist: "Default artist", note: "note" },
    sections: [],
    ...overrides
  };
}

const posts: readonly Post[] = [
  buildPost({
    slug: "basement-heat",
    category: "Floor notes",
    title: "Basement heat rises after midnight",
    excerpt: "A murky room that trusts pressure over volume.",
    tags: ["Basement sets"]
  }),
  buildPost({
    slug: "neon-glow",
    category: "Cover story",
    title: "Neon glow on the last train home",
    excerpt: "Bright synths and an after-hours glow.",
    tags: ["Neon dub"]
  })
];

describe("ArchiveExplorer", () => {
  it("shows every post before any filter is applied", () => {
    render(<ArchiveExplorer posts={posts} />);

    expect(screen.getByText("Showing 2 of 2 issues")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Basement heat rises after midnight" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Neon glow on the last train home" })
    ).toBeInTheDocument();
  });

  it("filters posts by search text across title and excerpt", async () => {
    const user = userEvent.setup();
    render(<ArchiveExplorer posts={posts} />);

    await user.type(screen.getByLabelText("Search archive"), "midnight");

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Neon glow on the last train home" })
      ).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("heading", { name: "Basement heat rises after midnight" })
    ).toBeInTheDocument();
  });

  it("filters posts by lane and clears filters on reset", async () => {
    const user = userEvent.setup();
    render(<ArchiveExplorer posts={posts} />);

    await user.click(screen.getByRole("button", { name: "Cover story" }));

    expect(
      screen.queryByRole("heading", { name: "Basement heat rises after midnight" })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Neon glow on the last train home" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(screen.getByText("Showing 2 of 2 issues")).toBeInTheDocument();
  });
});
