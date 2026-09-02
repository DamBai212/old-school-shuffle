import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShufflePlaylist, shuffleTracks } from "./shuffle-playlist";
import type { PlaylistTrack } from "@/content/playlist";

const tracks: PlaylistTrack[] = Array.from({ length: 6 }, (_, index) => ({
  title: `Track ${index}`,
  artist: `Artist ${index}`,
  length: "4:00",
  bpm: "120 BPM",
  lane: "Test lane",
  moment: "threshold",
  vibe: "vibe",
  note: "note",
  linkedPostSlug: "slug"
}));

vi.mock("next/image", () => ({
  // eslint-disable-next-line @next/next/no-img-element -- test stub, not rendered UI
  default: (props: { alt: string }) => <img alt={props.alt} />
}));

describe("shuffleTracks", () => {
  it("returns a permutation containing exactly the same tracks", () => {
    const result = shuffleTracks(tracks);

    expect(result).toHaveLength(tracks.length);
    expect([...result].sort((a, b) => a.title.localeCompare(b.title))).toEqual(
      [...tracks].sort((a, b) => a.title.localeCompare(b.title))
    );
  });

  it("does not mutate the input array", () => {
    const original = [...tracks];

    shuffleTracks(tracks);

    expect(tracks).toEqual(original);
  });

  it("returns a new array instance", () => {
    expect(shuffleTracks(tracks)).not.toBe(tracks);
  });
});

describe("ShufflePlaylist", () => {
  it("shows the first track as now spinning and reshuffles on click", async () => {
    const user = userEvent.setup();
    render(<ShufflePlaylist tracks={tracks} />);

    expect(screen.getByText("Track 0")).toBeInTheDocument();
    expect(screen.getByText("Drop #1")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /reshuffle room/i }));

    expect(screen.getByText("Drop #2")).toBeInTheDocument();
  });
});
