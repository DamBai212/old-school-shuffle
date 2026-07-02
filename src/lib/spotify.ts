type SpotifyAccessTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

type SpotifyApiImage = {
  url: string;
};

type SpotifyApiArtist = {
  name: string;
};

type SpotifyApiTrack = {
  id: string;
  name: string;
  duration_ms: number;
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
  artists: SpotifyApiArtist[];
  album: {
    images: SpotifyApiImage[];
  };
};

type SpotifyApiPlaylistResponse = {
  id: string;
  name: string;
  description: string;
  external_urls: {
    spotify: string;
  };
  images: SpotifyApiImage[];
  owner: {
    display_name: string;
  };
  tracks: {
    total: number;
    items: Array<{
      track: SpotifyApiTrack | null;
    }>;
  };
};

export type SpotifyEditorialTrack = {
  id: string;
  title: string;
  artistLine: string;
  durationMs: number;
  externalUrl: string;
  imageUrl: string | null;
  previewUrl: string | null;
};

export type SpotifyEditorialPlaylist = {
  id: string;
  name: string;
  description: string;
  externalUrl: string;
  embedUrl: string;
  imageUrl: string | null;
  ownerName: string;
  trackCount: number;
  tracks: readonly SpotifyEditorialTrack[];
};

export type SpotifyEditorialPlaylistState = {
  playlist: SpotifyEditorialPlaylist | null;
  status: "ready" | "missing-config" | "error";
};

const SPOTIFY_ACCOUNTS_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";
const SPOTIFY_PLAYLIST_FIELDS = [
  "id",
  "name",
  "description",
  "external_urls",
  "images",
  "owner(display_name)",
  "tracks(total,items(track(id,name,duration_ms,preview_url,external_urls,artists(name),album(images))))"
].join(",");

let cachedToken:
  | {
      accessToken: string;
      expiresAt: number;
    }
  | undefined;

function getSpotifyConfig() {
  return {
    clientId: process.env.SPOTIFY_CLIENT_ID?.trim(),
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET?.trim(),
    playlistId: normalizePlaylistId(
      process.env.SPOTIFY_EDITORIAL_PLAYLIST_ID ??
        process.env.SPOTIFY_PLAYLIST_ID ??
        ""
    )
  };
}

function normalizePlaylistId(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed.startsWith("spotify:playlist:")) {
    return trimmed.split(":").at(-1) ?? trimmed;
  }

  if (trimmed.startsWith("https://open.spotify.com/playlist/")) {
    try {
      const url = new URL(trimmed);
      const [, playlistId] = url.pathname.split("/").filter(Boolean);

      return playlistId ?? trimmed;
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function getSpotifyAccessToken() {
  const { clientId, clientSecret } = getSpotifyConfig();

  if (!clientId || !clientSecret) {
    return null;
  }

  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.accessToken;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(SPOTIFY_ACCOUNTS_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "client_credentials"
    })
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as SpotifyAccessTokenResponse;
  cachedToken = {
    accessToken: payload.access_token,
    expiresAt: Date.now() + Math.max(payload.expires_in - 60, 60) * 1000
  };

  return cachedToken.accessToken;
}

async function fetchSpotifyPlaylist(playlistId: string) {
  const accessToken = await getSpotifyAccessToken();

  if (!accessToken) {
    return null;
  }

  const query = new URLSearchParams({
    market: "US",
    fields: SPOTIFY_PLAYLIST_FIELDS
  });
  const response = await fetch(
    `${SPOTIFY_API_BASE_URL}/playlists/${playlistId}?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      next: {
        revalidate: 1800
      }
    }
  );

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as SpotifyApiPlaylistResponse;

  return {
    id: payload.id,
    name: payload.name,
    description:
      stripHtml(payload.description) ||
      "A live public playlist pulled into the site's late-night listening room.",
    externalUrl: payload.external_urls.spotify,
    embedUrl: `https://open.spotify.com/embed/playlist/${payload.id}?utm_source=generator&theme=0`,
    imageUrl: payload.images[0]?.url ?? null,
    ownerName: payload.owner.display_name || "Spotify editorial",
    trackCount: payload.tracks.total,
    tracks: payload.tracks.items
      .map((item) => item.track)
      .filter((track): track is SpotifyApiTrack => Boolean(track))
      .slice(0, 5)
      .map((track) => ({
        id: track.id,
        title: track.name,
        artistLine: track.artists.map((artist) => artist.name).join(", "),
        durationMs: track.duration_ms,
        externalUrl: track.external_urls.spotify,
        imageUrl: track.album.images[0]?.url ?? null,
        previewUrl: track.preview_url
      }))
  } satisfies SpotifyEditorialPlaylist;
}

export async function getSpotifyEditorialPlaylist(): Promise<SpotifyEditorialPlaylistState> {
  const { clientId, clientSecret, playlistId } = getSpotifyConfig();

  if (!clientId || !clientSecret || !playlistId) {
    return {
      playlist: null,
      status: "missing-config"
    };
  }

  try {
    const playlist = await fetchSpotifyPlaylist(playlistId);

    if (!playlist) {
      return {
        playlist: null,
        status: "error"
      };
    }

    return {
      playlist,
      status: "ready"
    };
  } catch (error) {
    console.error("Spotify editorial playlist fetch failed.", error);

    return {
      playlist: null,
      status: "error"
    };
  }
}
