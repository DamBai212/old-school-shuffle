export type PostSection = {
  heading: string;
  paragraphs: readonly string[];
};

export type TrackCue = {
  title: string;
  artist: string;
  note: string;
};

export type Post = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  deck: string;
  author: string;
  dateline: string;
  readLabel: string;
  cardLabel: string;
  issue: string;
  tags: readonly string[];
  quote: string;
  trackCue: TrackCue;
  sections: readonly PostSection[];
};

const posts: readonly Post[] = [
  {
    slug: "from-the-blog-to-the-booth",
    category: "Cover story",
    title: "From the blog to the booth, the page should feel like 2AM.",
    excerpt:
      "After-hours dispatches, floor reports, and a playlist that moves like the room does.",
    deck:
      "A music blog should not feel like it is describing nightlife from a safe distance. It should feel humid, impatient, and wired directly into the room.",
    author: "Mara Ellis",
    dateline: "Filed from Basement A",
    readLabel: "6 min read",
    cardLabel: "Night issue",
    issue: "After-hours 04",
    tags: ["Basement house", "Neon dub", "Peak-time pressure", "After-hours soul"],
    quote:
      "When club writing works, you can feel the room temperature change halfway through the paragraph.",
    trackCue: {
      title: "Midnight Strobe",
      artist: "Velvet Transit",
      note:
        "The ideal cover-story cue is not the biggest tune of the night. It is the one that makes the room lean forward together."
    },
    sections: [
      {
        heading: "Write for the room, not the timeline",
        paragraphs: [
          "Most music writing still talks about nightlife as if it is a trend report: clean, detached, and tidy enough to survive in daylight. But the club is not tidy. It is humid, loud, delayed, and full of tiny decisions that only make sense while the bass is still in your chest.",
          "That means the page should feel less like a polished brochure and more like a dispatch. You want language that sounds close to the floor, like it was scribbled between blends or typed on the curb outside while the ears were still ringing."
        ]
      },
      {
        heading: "Shuffle is a pacing tool",
        paragraphs: [
          "A shuffle playlist is not just a cute gimmick on a homepage. In the right context, it behaves like a selector's instinct. The order changes, but the atmosphere stays coherent. That tension between unpredictability and control is exactly what nightlife feels like when the room is good.",
          "The tracks do not need to match by decade or genre as tightly as they match by temperature. They need the same darkness level, the same low-end confidence, and the same ability to suggest that something better is about to happen one song later."
        ]
      },
      {
        heading: "Design like a flyer and a monitor",
        paragraphs: [
          "The visuals should carry a little danger. Not chaos, just enough friction to stop the page from collapsing into a safe SaaS dashboard with music words on top. Dark glass, neon bleed, and printed-editorial typography can all coexist if the hierarchy stays sharp.",
          "A good club-facing homepage should feel like a flyer, a booth monitor, and a late-night notebook at once. That overlap is where the identity becomes believable."
        ]
      }
    ]
  },
  {
    slug: "best-2am-records-found-in-the-dark",
    category: "Scene report",
    title: "Why the best 2AM records sound like they were found in the dark.",
    excerpt:
      "The tension lives in the negative space: the clipped vocal, the delayed snare, the bassline you feel before you place it.",
    deck:
      "Peak-time music rarely wins because it is the loudest option. More often, it wins because it withholds just enough information to keep the room chasing the next bar.",
    author: "Mara Ellis",
    dateline: "South London",
    readLabel: "7 min read",
    cardLabel: "7 min read",
    issue: "Scene report",
    tags: ["2AM", "Negative space", "Low-end pressure"],
    quote:
      "The right 2AM record sounds less like a statement and more like a corridor opening up.",
    trackCue: {
      title: "Chrome Hearts Dub",
      artist: "Night Service",
      note:
        "Dubby tracks work late because they leave enough empty air for the room to project itself into the mix."
    },
    sections: [
      {
        heading: "The hook can arrive late",
        paragraphs: [
          "At 2AM, the floor does not need the entire story in the first sixteen bars. It needs permission to keep moving. Tracks that reveal themselves slowly create a stronger grip than tracks that try to prove their worth before the second phrase lands.",
          "That is why the best late-night records often feel half-hidden at first. You hear a clipped vocal, a metallic texture, or a bassline shadow, and only later realize how much structure was already there."
        ]
      },
      {
        heading: "Room confidence matters more than speed",
        paragraphs: [
          "Faster is not always harder. In a confident room, even medium-tempo records can feel huge if the low end is patient and the arrangement lets tension stretch.",
          "The selector's job is to trust that patience. A room that is already moving will follow a record with restraint if the feeling underneath it stays undeniable."
        ]
      }
    ]
  },
  {
    slug: "basement-sets-getting-murkier-and-better",
    category: "Floor notes",
    title: "Basement sets are getting murkier, slower, and better because of it.",
    excerpt:
      "A dispatch from rooms that trust tension more than volume, and let atmosphere do half the work.",
    deck:
      "The best small rooms right now are not racing toward climax. They are letting the crowd earn it through pacing, shadow, and pressure.",
    author: "Mara Ellis",
    dateline: "London 01:40",
    readLabel: "5 min read",
    cardLabel: "London 01:40",
    issue: "Floor notes",
    tags: ["Basement sets", "Pacing", "Atmosphere"],
    quote:
      "The crowd looks happier when the DJ stops trying to win every transition on impact alone.",
    trackCue: {
      title: "Red Exit Sign",
      artist: "June Arcade",
      note:
        "Warm-up records are doing more of the emotional work now. They do not announce themselves, but they change the room's posture."
    },
    sections: [
      {
        heading: "The room is less impressed by obviousness",
        paragraphs: [
          "Small clubs used to reward blunt force. Big kick, big vocal, big payoff. That still works sometimes, but the rooms people actually talk about the next day are increasingly built on subtler things: a darker sequence, a more patient opening, or a moment where the floor realizes it has been locked for ten minutes without noticing.",
          "That shift makes slower sets feel more alive, not less. The tension has somewhere to live."
        ]
      },
      {
        heading: "Atmosphere is now part of the rhythm section",
        paragraphs: [
          "In tighter rooms, light, smoke, and reverb blur into the groove. The selector is not just programming tracks. They are programming the room's sense of depth.",
          "That is why murkier, moodier sets are landing so well. They give the environment enough space to become part of the experience."
        ]
      }
    ]
  },
  {
    slug: "five-tracks-that-hold-a-shuffled-set-together",
    category: "Booth notes",
    title: "Five tracks that let a shuffled set still feel like one long inhale.",
    excerpt:
      "Bridge cuts, pressure builders, and small left turns that keep the room curious instead of confused.",
    deck:
      "The myth is that shuffled sets are chaotic by default. In practice, they only fall apart when there are no bridge records inside them.",
    author: "Mara Ellis",
    dateline: "Selectors' table",
    readLabel: "6 min read",
    cardLabel: "Selectors' picks",
    issue: "Booth notes",
    tags: ["Bridge tracks", "Shuffle", "Set design"],
    quote:
      "A bridge track is the one that quietly forgives your last risk and makes the next one possible.",
    trackCue: {
      title: "Studio 3AM",
      artist: "Luna Static",
      note:
        "Bridge records do not always sit in the middle. Sometimes the track with the biggest lift is the one that keeps the narrative from snapping."
    },
    sections: [
      {
        heading: "You need glue records",
        paragraphs: [
          "The strongest shuffled playlists are held together by records that are rhythmically and emotionally flexible. They can follow something dusty, precede something glossy, and still sound like they belong in the same air.",
          "These are not filler records. They are structural records. They keep the sequence from feeling like a stack of disconnected taste tests."
        ]
      },
      {
        heading: "The room only notices the bad jumps",
        paragraphs: [
          "People do not leave a dancefloor thinking about the seamless transitions that worked. They remember the one moment the temperature broke. That is why bridge tracks matter so much.",
          "When the shuffle order moves from heartbroken soul into dry, percussive house, you need one record in between that understands both languages."
        ]
      }
    ]
  },
  {
    slug: "write-about-the-club-without-flattening-it",
    category: "After-hours essay",
    title: "How to write about the club without flattening it into lifestyle wallpaper.",
    excerpt:
      "Write about sweat, pacing, light, release, and bodies moving together. The technology is only half the story.",
    deck:
      "Club writing collapses when it treats nightlife like a brand moodboard instead of a social experience with stakes, pacing, and physical detail.",
    author: "Mara Ellis",
    dateline: "Filed at 3:12 AM",
    readLabel: "8 min read",
    cardLabel: "Filed at 3:12 AM",
    issue: "After-hours essay",
    tags: ["Club writing", "Atmosphere", "Bodies in motion"],
    quote:
      "If the only thing your paragraph remembers is the gear, you probably missed the reason the room mattered.",
    trackCue: {
      title: "Blue Laser Static",
      artist: "Saint Monroe",
      note:
        "The best writing cue is often the most emotional one in the set, because it reminds you the room was made of people, not just hardware."
    },
    sections: [
      {
        heading: "Do not write only about equipment",
        paragraphs: [
          "Tech matters. Sound matters. But club writing turns flat the moment it uses machinery as a substitute for observation. Readers need to know what the room felt like, how the floor moved, and what changed when the selector shifted direction.",
          "The texture of nightlife lives in bodies: in patience, in release, in the tiny way the crowd leans before a drop that never fully arrives."
        ]
      },
      {
        heading: "Description needs stakes",
        paragraphs: [
          "A good nightlife paragraph should carry the same suspense as a transition. Something should be at risk: the momentum, the temperature, the crowd's trust, the emotional thread of the set.",
          "That is what keeps club writing from becoming wallpaper. It remembers that the room could have failed and did not."
        ]
      }
    ]
  }
] as const;

export function getAllPosts() {
  return posts;
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}
