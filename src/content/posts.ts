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

export type Category = {
  title: string;
  slug: string;
  description: string;
  noteTitle: string;
  note: string;
  routeNotes: readonly string[];
  posts: readonly Post[];
};

export type Tag = {
  title: string;
  slug: string;
  description: string;
  noteTitle: string;
  note: string;
  posts: readonly Post[];
};

export type RelatedPost = {
  post: Post;
  sharedTags: readonly string[];
  sharesCategory: boolean;
  editorialDistance: number;
  score: number;
};

export type RelatedCategory = {
  category: Category;
  sharedTags: readonly string[];
  score: number;
};

export type ArchiveFilters = {
  query?: string;
  category?: string;
  tag?: string;
};

type CategoryEditorialNote = Omit<Category, "posts" | "slug" | "title">;
type TagEditorialNote = Omit<Tag, "posts" | "slug" | "title">;

const categoryEditorialNotes: Record<string, CategoryEditorialNote> = {
  "Cover story": {
    description:
      "The lead lane for big-picture arguments about club writing, scene identity, and how the publication should feel at full volume.",
    noteTitle: "The thesis lane",
    note:
      "Cover stories are where the magazine stops reporting from a distance and states what the room is actually teaching us.",
    routeNotes: [
      "Start here when you want the publication's clearest point of view.",
      "Expect bigger arguments, sharper framing, and the strongest mood-setting copy.",
      "These pieces are the entrance point for everything else in the archive."
    ]
  },
  "Scene report": {
    description:
      "Filed from the floor itself: records, pacing choices, and late-night details that only reveal themselves once the room is fully moving.",
    noteTitle: "The floor report lane",
    note:
      "Scene reports stay close to texture and timing. They care about what changed in the room, not just what happened on paper.",
    routeNotes: [
      "Best when you want concrete late-night observations instead of broad theory.",
      "Listen for tension, negative space, and the records that open corridors in a set.",
      "Pair with the playlist when you want to hear the mood under the writing."
    ]
  },
  "Floor notes": {
    description:
      "Dispatches about how rooms behave in real time: crowd patience, small-club energy, and the atmosphere built between obvious moments.",
    noteTitle: "The room-reading lane",
    note:
      "Floor notes care about pressure management. They track the little changes in posture, light, and pacing that decide whether a set really lands.",
    routeNotes: [
      "Best entered when you care about crowd behavior more than genre labels.",
      "Expect slower burns, murkier rooms, and a lot of attention to atmosphere.",
      "These pieces are about why restraint can hit harder than impact."
    ]
  },
  "Booth notes": {
    description:
      "Selector logic, bridge records, and booth-level tactics for keeping a shuffled or adventurous set coherent from first blend to last lights-on tune.",
    noteTitle: "The selector lane",
    note:
      "Booth notes treat sequencing like structure. They are less about taste flexing and more about the records that make risk survivable.",
    routeNotes: [
      "Start here when you want set-design thinking instead of scene description.",
      "Bridge tracks, pacing tools, and emotional glue matter more than big moments.",
      "This lane connects directly to the playlist's logic."
    ]
  },
  "After-hours essay": {
    description:
      "Longer reflections on club language, bodies in motion, and how to write about nightlife without reducing it to aesthetic wallpaper.",
    noteTitle: "The lights-up lane",
    note:
      "After-hours essays arrive once the ringing in your ears becomes reflection. They keep the emotional thread alive after the room empties.",
    routeNotes: [
      "Best when you want reflection, social detail, and a little aftermath.",
      "These pieces remember that nightlife is built from people, not just hardware.",
      "Expect the emotional coda instead of the immediate floor report."
    ]
  }
};

const tagEditorialNotes: Record<string, TagEditorialNote> = {
  "Basement house": {
    description:
      "Tracks and writing built for low ceilings, pressure-heavy grooves, and the kind of room that gets better the darker it feels.",
    noteTitle: "The concrete-floor signal",
    note:
      "Basement house is about physical confidence more than brightness. It marks pieces that trust low-end pressure and close-room atmosphere."
  },
  "Neon dub": {
    description:
      "A tag for dubby delay, metallic shimmer, and club moods that glow without losing their edge.",
    noteTitle: "The afterglow signal",
    note:
      "Neon dub links writing that carries both haze and detail: enough light to feel seductive, enough shadow to stay believable."
  },
  "Peak-time pressure": {
    description:
      "The point where tension stops building quietly and starts owning the room, without tipping into something obvious.",
    noteTitle: "The pressure signal",
    note:
      "This topic is less about maximalism than control. Peak-time pressure marks pieces that understand impact as pacing, not just force."
  },
  "After-hours soul": {
    description:
      "The emotional residue that sneaks into the set after the hardest moments have already landed.",
    noteTitle: "The lights-up signal",
    note:
      "After-hours soul catches the writing and music cues that keep a little tenderness in the room even after the pressure peaks."
  },
  "2AM": {
    description:
      "A late-night topic for the records, decisions, and moods that only make full sense once the room has properly settled in.",
    noteTitle: "The 2AM signal",
    note:
      "2AM is when obviousness stops working. This topic gathers pieces that care about patience, corridors, and half-hidden hooks."
  },
  "Negative space": {
    description:
      "The clipped vocal, the delayed snare, the half-empty bar that makes the next one land harder.",
    noteTitle: "The restraint signal",
    note:
      "Negative space marks archive pieces that find power in what is withheld instead of what is announced up front."
  },
  "Low-end pressure": {
    description:
      "Bass-led confidence, chest-level tension, and the weight underneath a room's best decisions.",
    noteTitle: "The sub-bass signal",
    note:
      "Low-end pressure is where the archive tracks gravity. These pieces pay attention to what the floor feels before it looks."
  },
  "Basement sets": {
    description:
      "A topic for small-room pacing, murky transitions, and the kind of set design that wins trust without showing off.",
    noteTitle: "The room-shape signal",
    note:
      "Basement sets focus on environment as much as track choice. They care about how a space behaves when the selector stops rushing it."
  },
  Pacing: {
    description:
      "How a night moves, stalls, stretches, and eventually resolves once the room decides to believe in it.",
    noteTitle: "The tempo-of-the-room signal",
    note:
      "Pacing is one of the archive's deepest concerns. It appears whenever structure matters more than spectacle."
  },
  Atmosphere: {
    description:
      "Smoke, light, bodies, and the tonal weather that turns a technically good set into a memorable room.",
    noteTitle: "The weather signal",
    note:
      "Atmosphere connects the archive's writing about context: the parts of nightlife that live between records but change how every record lands."
  },
  "Bridge tracks": {
    description:
      "The cuts that quietly hold a set together when the order jumps between moods, eras, or emotional temperatures.",
    noteTitle: "The glue signal",
    note:
      "Bridge tracks are structural. This topic highlights pieces that care about transitions, forgiveness, and narrative continuity."
  },
  Shuffle: {
    description:
      "Unpredictable order, controlled temperature, and the selector logic that keeps variety from becoming chaos.",
    noteTitle: "The sequence signal",
    note:
      "Shuffle is more than a button here. It marks the archive's ongoing interest in how unpredictability still needs coherence."
  },
  "Set design": {
    description:
      "Architecture for the night: sequencing choices, pressure curves, and the records that make the whole room feel inevitable.",
    noteTitle: "The architecture signal",
    note:
      "Set design gathers the archive's more tactical writing, where structure matters as much as sound selection."
  },
  "Club writing": {
    description:
      "How to write about nightlife without flattening it into gear talk, trend reports, or generic lifestyle texture.",
    noteTitle: "The language signal",
    note:
      "Club writing is where the publication looks at itself. These pieces ask what language actually stays faithful to the room."
  },
  "Bodies in motion": {
    description:
      "The physical detail of a floor in motion: leaning, waiting, releasing, and trusting the next bar.",
    noteTitle: "The human signal",
    note:
      "Bodies in motion keeps the archive grounded in people, not just systems. It marks pieces that remember nightlife is social before it is technical."
  }
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

function slugifyValue(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugifyCategory(category: string) {
  return slugifyValue(category);
}

export function getCategoryHref(category: string) {
  return `/posts/category/${slugifyCategory(category)}`;
}

export function slugifyTag(tag: string) {
  return slugifyValue(tag);
}

export function getTagHref(tag: string) {
  return `/posts/tag/${slugifyTag(tag)}`;
}

export function getArchiveHref(filters: ArchiveFilters = {}) {
  const params = new URLSearchParams();

  if (filters.query?.trim()) {
    params.set("q", filters.query.trim());
  }

  if (filters.category) {
    params.set("lane", slugifyCategory(filters.category));
  }

  if (filters.tag) {
    params.set("tag", slugifyTag(filters.tag));
  }

  const queryString = params.toString();

  return queryString ? `/posts?${queryString}` : "/posts";
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

function getPostIndex(slug: string) {
  return posts.findIndex((post) => post.slug === slug);
}

export function getAdjacentPosts(slug: string) {
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) {
    return {
      previousPost: undefined,
      nextPost: undefined
    };
  }

  return {
    previousPost: posts[currentIndex - 1],
    nextPost: posts[currentIndex + 1]
  };
}

export function getPostsByCategory() {
  return posts.reduce<Record<string, Post[]>>((groups, post) => {
    if (!groups[post.category]) {
      groups[post.category] = [];
    }

    groups[post.category]!.push(post);
    return groups;
  }, {});
}

export function getPostsByTag() {
  return posts.reduce<Record<string, Post[]>>((groups, post) => {
    post.tags.forEach((tag) => {
      if (!groups[tag]) {
        groups[tag] = [];
      }

      groups[tag]!.push(post);
    });

    return groups;
  }, {});
}

function getFallbackCategoryNote(category: string): CategoryEditorialNote {
  return {
    description:
      `${category} is one of the archive's editorial lanes, collecting posts that share a common mood and point of view.`,
    noteTitle: `${category} lane`,
    note:
      "Each lane should feel like its own route through the magazine, with a distinct pace, pressure level, and emotional temperature.",
    routeNotes: [
      "Start with the lane's current issue.",
      "Use the archive to jump between adjacent moods.",
      "Pair the writing with the playlist for the full atmosphere."
    ]
  };
}

function getFallbackTagNote(tag: string): TagEditorialNote {
  return {
    description:
      `${tag} is one of the archive's recurring topic signals, linking posts that share a common pressure point, atmosphere, or writing preoccupation.`,
    noteTitle: `${tag} signal`,
    note:
      "Tags are the publication's second route through the archive. They connect moods and ideas that cut across lanes."
  };
}

export function getCategories() {
  const groups = getPostsByCategory();

  return Object.entries(groups).map(([title, groupedPosts]) => {
    const editorialNote =
      categoryEditorialNotes[title] ?? getFallbackCategoryNote(title);

    return {
      title,
      slug: slugifyCategory(title),
      ...editorialNote,
      posts: groupedPosts
    } satisfies Category;
  });
}

export function getCategoryBySlug(slug: string) {
  return getCategories().find((category) => category.slug === slug);
}

export function getCategoryByName(name: string) {
  return getCategories().find((category) => category.title === name);
}

export function getTags() {
  const groups = getPostsByTag();

  return Object.entries(groups)
    .sort(([leftTitle, leftPosts], [rightTitle, rightPosts]) => {
      if (rightPosts.length !== leftPosts.length) {
        return rightPosts.length - leftPosts.length;
      }

      return leftTitle.localeCompare(rightTitle);
    })
    .map(([title, groupedPosts]) => {
      const editorialNote =
        tagEditorialNotes[title] ?? getFallbackTagNote(title);

      return {
        title,
        slug: slugifyTag(title),
        ...editorialNote,
        posts: groupedPosts
      } satisfies Tag;
    });
}

export function getTagBySlug(slug: string) {
  return getTags().find((tag) => tag.slug === slug);
}

export function getTagByName(name: string) {
  return getTags().find((tag) => tag.title === name);
}

export function getRelatedPosts(slug: string, limit = 3) {
  const post = getPostBySlug(slug);
  const currentIndex = getPostIndex(slug);

  if (!post || currentIndex === -1) {
    return [];
  }

  return posts
    .filter((candidate) => candidate.slug !== slug)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => post.tags.includes(tag));
      const sharesCategory = candidate.category === post.category;
      const candidateIndex = getPostIndex(candidate.slug);
      const editorialDistance = Math.abs(candidateIndex - currentIndex);
      const proximityScore = Math.max(0, 3 - editorialDistance);
      const score =
        sharedTags.length * 4 +
        (sharesCategory ? 3 : 0) +
        proximityScore;

      return {
        post: candidate,
        sharedTags,
        sharesCategory,
        editorialDistance,
        score
      } satisfies RelatedPost;
    })
    .sort((leftMatch, rightMatch) => {
      if (rightMatch.score !== leftMatch.score) {
        return rightMatch.score - leftMatch.score;
      }

      if (rightMatch.sharedTags.length !== leftMatch.sharedTags.length) {
        return rightMatch.sharedTags.length - leftMatch.sharedTags.length;
      }

      return leftMatch.editorialDistance - rightMatch.editorialDistance;
    })
    .slice(0, limit);
}

export function getRelatedCategories(slug: string, limit = 4) {
  const categories = getCategories();
  const currentCategory = categories.find((category) => category.slug === slug);
  const currentIndex = categories.findIndex((category) => category.slug === slug);

  if (!currentCategory || currentIndex === -1) {
    return [];
  }

  const currentTags = new Set(currentCategory.posts.flatMap((post) => post.tags));

  return categories
    .filter((candidateCategory) => candidateCategory.slug !== slug)
    .map((candidateCategory, index) => {
      const candidateTags = new Set(
        candidateCategory.posts.flatMap((post) => post.tags)
      );
      const sharedTags = [...currentTags].filter((tag) => candidateTags.has(tag));
      const editorialDistance = Math.abs(index - currentIndex);
      const proximityScore = Math.max(0, 3 - editorialDistance);
      const score = sharedTags.length * 4 + proximityScore;

      return {
        category: candidateCategory,
        sharedTags,
        score
      } satisfies RelatedCategory;
    })
    .sort((leftMatch, rightMatch) => {
      if (rightMatch.score !== leftMatch.score) {
        return rightMatch.score - leftMatch.score;
      }

      if (rightMatch.sharedTags.length !== leftMatch.sharedTags.length) {
        return rightMatch.sharedTags.length - leftMatch.sharedTags.length;
      }

      return leftMatch.category.title.localeCompare(rightMatch.category.title);
    })
    .slice(0, limit);
}

export function getRelatedTags(tagName: string, limit = 6) {
  const tag = getTagByName(tagName);

  if (!tag) {
    return [];
  }

  const counts = new Map<string, number>();

  tag.posts.forEach((post) => {
    post.tags.forEach((candidateTag) => {
      if (candidateTag === tagName) {
        return;
      }

      counts.set(candidateTag, (counts.get(candidateTag) ?? 0) + 1);
    });
  });

  return getTags()
    .filter((candidateTag) => counts.has(candidateTag.title))
    .sort((leftTag, rightTag) => {
      const rightCount = counts.get(rightTag.title) ?? 0;
      const leftCount = counts.get(leftTag.title) ?? 0;

      if (rightCount !== leftCount) {
        return rightCount - leftCount;
      }

      return leftTag.title.localeCompare(rightTag.title);
    })
    .slice(0, limit);
}
