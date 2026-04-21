"use client";

import Image from "next/image";
import { startTransition, useState } from "react";

export type PlaylistTrack = {
  title: string;
  artist: string;
  length: string;
  bpm: string;
  vibe: string;
};

type ShufflePlaylistProps = {
  tracks: readonly PlaylistTrack[];
};

function shuffleTracks(tracks: readonly PlaylistTrack[]) {
  const next = [...tracks];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = next[index];

    next[index] = next[swapIndex];
    next[swapIndex] = current;
  }

  return next;
}

export function ShufflePlaylist({ tracks }: ShufflePlaylistProps) {
  const [queue, setQueue] = useState(() => [...tracks]);
  const [shuffleCount, setShuffleCount] = useState(1);

  const nowSpinning = queue[0];
  const upcomingTracks = queue.slice(1, 5);

  function handleShuffle() {
    startTransition(() => {
      setQueue((currentQueue) => shuffleTracks(currentQueue));
      setShuffleCount((currentCount) => currentCount + 1);
    });
  }

  return (
    <section className="playlist-card fade-up" id="playlist">
      <div className="playlist-header">
        <div>
          <p className="playlist-label">Shuffle playlist</p>
          <h2>Booth queue</h2>
        </div>

        <button className="shuffle-button" onClick={handleShuffle} type="button">
          Reshuffle room
        </button>
      </div>

      <div className="playlist-now">
        <div className="playlist-record">
          <Image
            className="spinning-disc"
            src="/record.svg"
            alt=""
            width={160}
            height={160}
            priority
          />
        </div>

        <div className="now-copy">
          <p className="playlist-meta">Now in the mix</p>
          <h3>{nowSpinning.title}</h3>
          <p className="playlist-artist">{nowSpinning.artist}</p>
          <p className="playlist-vibe">{nowSpinning.vibe}</p>

          <div className="now-stats">
            <span>{nowSpinning.length}</span>
            <span>{nowSpinning.bpm}</span>
            <span>Drop #{shuffleCount}</span>
          </div>
        </div>
      </div>

      <ol className="queue-list">
        {upcomingTracks.map((track, index) => (
          <li className="queue-row" key={`${track.title}-${track.artist}`}>
            <span className="queue-index">0{index + 2}</span>

            <div className="queue-copy">
              <strong>{track.title}</strong>
              <span>{track.artist}</span>
            </div>

            <span className="queue-meta">{track.length}</span>
          </li>
        ))}
      </ol>

      <p className="playlist-footer">
        Smoke, pulse, pressure, and small flashes of melody that hit harder when
        the order slips a little out of your control.
      </p>
    </section>
  );
}
