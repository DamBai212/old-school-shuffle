"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  getPlaylistMomentPreview,
  type PlaylistTrack
} from "@/content/playlist";

type EditorialPreviewButtonProps = {
  track: PlaylistTrack;
  compact?: boolean;
};

const previewPlayEventName = "old-school-shuffle:editorial-preview-play";

export function EditorialPreviewButton({
  track,
  compact = false
}: EditorialPreviewButtonProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const preview = getPlaylistMomentPreview(track.moment);
  const previewId = useId();

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

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handlePause);
    };
  }, []);

  useEffect(() => {
    function handleExternalPlay(event: Event) {
      const audio = audioRef.current;

      if (!audio) {
        return;
      }

      const customEvent = event as CustomEvent<{ previewId: string }>;

      if (customEvent.detail.previewId === previewId) {
        return;
      }

      if (!audio.paused) {
        audio.pause();
      }
    }

    window.addEventListener(previewPlayEventName, handleExternalPlay as EventListener);

    return () => {
      window.removeEventListener(previewPlayEventName, handleExternalPlay as EventListener);
    };
  }, [previewId]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  }, [preview.src]);

  function handleTogglePreview() {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      window.dispatchEvent(
        new CustomEvent(previewPlayEventName, {
          detail: {
            previewId
          }
        })
      );

      void audio.play().catch(() => {
        setIsPlaying(false);
      });

      return;
    }

    audio.pause();
  }

  return (
    <div className={`editorial-preview${compact ? " editorial-preview-compact" : ""}`}>
      <button
        className={`editorial-preview-button${isPlaying ? " editorial-preview-button-active" : ""}`}
        onClick={handleTogglePreview}
        type="button"
      >
        {isPlaying ? "Pause room preview" : "Play room preview"}
      </button>

      <div className="editorial-preview-copy">
        <span className="editorial-preview-label">{preview.title}</span>
        <p className="editorial-preview-note">
          {compact
            ? "Original in-repo audio sketch for this turn."
            : `${preview.description} This is an original site sketch, not the actual song.`}
        </p>
      </div>

      <audio preload="none" ref={audioRef} src={preview.src} />
    </div>
  );
}
