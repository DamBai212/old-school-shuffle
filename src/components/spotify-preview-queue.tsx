"use client";

import { useEffect, useRef, useState } from "react";
import type { SpotifyEditorialTrack } from "@/lib/spotify";

type SpotifyPreviewQueueProps = {
  tracks: readonly SpotifyEditorialTrack[];
};

function formatDuration(durationMs: number) {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function SpotifyPreviewQueue({ tracks }: SpotifyPreviewQueueProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    function handlePlay() {
      setIsPlaying(true);
    }

    function handlePause() {
      setIsPlaying(false);
    }

    function handleEnded() {
      setActiveTrackId(null);
      setIsPlaying(false);
    }

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    if (!activeTrackId) {
      return;
    }

    const activeTrackStillExists = tracks.some((track) => track.id === activeTrackId);

    if (activeTrackStillExists) {
      return;
    }

    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }

    setActiveTrackId(null);
    setIsPlaying(false);
  }, [activeTrackId, tracks]);

  function handleTogglePreview(track: SpotifyEditorialTrack) {
    if (!track.previewUrl) {
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (activeTrackId !== track.id) {
      if (audio.src !== track.previewUrl) {
        audio.src = track.previewUrl;
        audio.load();
      }

      setActiveTrackId(track.id);

      void audio.play().catch(() => {
        setIsPlaying(false);
      });

      return;
    }

    if (audio.paused) {
      void audio.play().catch(() => {
        setIsPlaying(false);
      });

      return;
    }

    audio.pause();
  }

  return (
    <>
      <ol className="spotify-preview-list">
        {tracks.map((track, index) => {
          const hasPreview = Boolean(track.previewUrl);
          const isActive = track.id === activeTrackId;
          const buttonLabel = !hasPreview
            ? "No sample"
            : isActive && isPlaying
              ? "Pause sample"
              : "Play sample";

          return (
            <li
              className={`spotify-preview-row${isActive ? " spotify-preview-row-active" : ""}`}
              key={track.id}
            >
              <span className="spotify-preview-index">{`${index + 1}`.padStart(2, "0")}</span>

              <a
                className="spotify-preview-link"
                href={track.externalUrl}
                rel="noreferrer"
                target="_blank"
              >
                <div className="spotify-preview-copy">
                  <strong>{track.title}</strong>
                  <span>{track.artistLine}</span>
                </div>

                <span className="spotify-preview-meta">{formatDuration(track.durationMs)}</span>
              </a>

              <button
                className={`spotify-preview-button${
                  isActive && isPlaying ? " spotify-preview-button-active" : ""
                }`}
                disabled={!hasPreview}
                onClick={() => handleTogglePreview(track)}
                type="button"
              >
                {buttonLabel}
              </button>
            </li>
          );
        })}
      </ol>

      <p className="spotify-preview-footnote">
        Spotify samples are short previews and only appear when Spotify makes them available.
      </p>

      <audio ref={audioRef} preload="none" />
    </>
  );
}
