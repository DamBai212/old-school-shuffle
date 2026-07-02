export type PlaylistTrack = {
  title: string;
  artist: string;
  length: string;
  bpm: string;
  lane: string;
  moment: PlaylistMomentSlug;
  vibe: string;
  note: string;
  linkedPostSlug: string;
};

export type PlaylistMomentSlug =
  | "threshold"
  | "pressure"
  | "bridge"
  | "lights-up";

export type PlaylistMoment = {
  slug: PlaylistMomentSlug;
  title: string;
  description: string;
  routeNote: string;
  archiveTag: string;
  tracks: readonly PlaylistTrack[];
};

const playlistMomentNotes = {
  threshold: {
    title: "Threshold",
    description: "Where the room leans toward the speakers before it fully commits.",
    routeNote:
      "Start with patient records, low light, and enough empty air to make every new element feel intentional.",
    archiveTag: "Atmosphere"
  },
  pressure: {
    title: "Pressure",
    description: "The stretch where low-end confidence takes over the room.",
    routeNote:
      "This is the part of the set that wins trust through weight, tension, and just enough withheld information.",
    archiveTag: "Low-end pressure"
  },
  bridge: {
    title: "Bridge",
    description: "The cuts that keep jumps in mood feeling deliberate instead of random.",
    routeNote:
      "Use these records when the sequence needs glue: enough flexibility to connect romance, dub, and peak-time momentum.",
    archiveTag: "Bridge tracks"
  },
  "lights-up": {
    title: "Lights-up",
    description: "The final emotional turn once the room stops needing obvious impact.",
    routeNote:
      "Let the closing stretch glow a little. The last records should feel human without softening the night too early.",
    archiveTag: "After-hours soul"
  }
} satisfies Record<
  PlaylistMomentSlug,
  Omit<PlaylistMoment, "slug" | "tracks">
>;

const playlistTracks: readonly PlaylistTrack[] = [
  {
    title: "Midnight Strobe",
    artist: "Velvet Transit",
    length: "5:21",
    bpm: "124 BPM",
    lane: "Cover story",
    moment: "pressure",
    vibe: "Cold synth shimmer, pressure-built bass, and a kick that lands like a light cue.",
    note:
      "This is the record that tells the room the night is committed now. No easing in, just controlled voltage.",
    linkedPostSlug: "from-the-blog-to-the-booth"
  },
  {
    title: "Red Exit Sign",
    artist: "June Arcade",
    length: "4:48",
    bpm: "120 BPM",
    lane: "Warm-up pressure",
    moment: "threshold",
    vibe: "Smoked-out chords and a patient groove for the first ten minutes after midnight.",
    note:
      "It buys trust without begging for it. Perfect for getting the floor to lean in before the obvious tune arrives.",
    linkedPostSlug: "basement-sets-getting-murkier-and-better"
  },
  {
    title: "Chrome Hearts Dub",
    artist: "Night Service",
    length: "6:03",
    bpm: "126 BPM",
    lane: "Scene report",
    moment: "pressure",
    vibe: "Dub delay, metallic percussion, and a bassline built for concrete walls.",
    note:
      "Late-night tracks work hardest when they leave enough air for the room to project its own nerves into the mix.",
    linkedPostSlug: "best-2am-records-found-in-the-dark"
  },
  {
    title: "Blue Laser Static",
    artist: "Saint Monroe",
    length: "3:57",
    bpm: "122 BPM",
    lane: "After-hours glow",
    moment: "lights-up",
    vibe: "A romantic hook hiding inside a track that still belongs in the darkest room.",
    note:
      "You save this for the emotional turn, when the room wants one flash of tenderness without losing the edge.",
    linkedPostSlug: "write-about-the-club-without-flattening-it"
  },
  {
    title: "Studio 3AM",
    artist: "Luna Static",
    length: "5:09",
    bpm: "128 BPM",
    lane: "Bridge record",
    moment: "bridge",
    vibe: "Peak-time lift with enough restraint to keep the floor hungry for one more blend.",
    note:
      "A bridge track keeps the narrative from snapping. It forgives the last risk and sets up the next one.",
    linkedPostSlug: "five-tracks-that-hold-a-shuffled-set-together"
  },
  {
    title: "Velour Panic",
    artist: "Circuit Rosa",
    length: "4:32",
    bpm: "123 BPM",
    lane: "Basement haze",
    moment: "threshold",
    vibe: "Dry hand percussion, low pink synth fog, and vocals that flicker instead of arrive.",
    note:
      "The groove is deliberately half-lit. It keeps the floor moving by withholding the clearest version of itself.",
    linkedPostSlug: "best-2am-records-found-in-the-dark"
  },
  {
    title: "Sweat Economy",
    artist: "Basement Romance",
    length: "5:44",
    bpm: "121 BPM",
    lane: "Floor notes",
    moment: "pressure",
    vibe: "Murky toms, sodium-orange pads, and the kind of bassline that makes a small room feel wider.",
    note:
      "This is what slower club music sounds like when the tension is doing more work than the tempo.",
    linkedPostSlug: "basement-sets-getting-murkier-and-better"
  },
  {
    title: "Closing Smoke",
    artist: "Static Chapel",
    length: "6:11",
    bpm: "119 BPM",
    lane: "Last tune heartbreak",
    moment: "lights-up",
    vibe: "Faded-house drums and a vocal line that sounds like it was found after sunrise.",
    note:
      "Not every ending needs to explode. Sometimes the right closer just lets the room feel what it was already carrying.",
    linkedPostSlug: "write-about-the-club-without-flattening-it"
  }
] as const;

export function getPlaylistTracks() {
  return playlistTracks;
}

export function getPlaylistMomentTitle(slug: PlaylistMomentSlug) {
  return playlistMomentNotes[slug].title;
}

export function getPlaylistMoments() {
  return Object.entries(playlistMomentNotes).map(([slug, moment]) => ({
    slug: slug as PlaylistMomentSlug,
    ...moment,
    tracks: playlistTracks.filter((track) => track.moment === slug)
  })) satisfies PlaylistMoment[];
}
