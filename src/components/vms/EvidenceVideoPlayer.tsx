'use client';

import { useEffect, useRef } from 'react';

type EvidenceVideoPlayerProps = {
  src: string;
  poster?: string;
  className?: string;
};

/** Dialog-safe HTML5 player — play after mount; native controls stay interactive. */
export function EvidenceVideoPlayer({ src, poster, className }: EvidenceVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.load();
    const playAttempt = video.play();
    if (playAttempt) {
      playAttempt.catch(() => {
        // Autoplay may be blocked; user can start via controls.
      });
    }

    return () => {
      video.pause();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      controls
      playsInline
      preload='auto'
      className={className ?? 'h-full w-full object-contain'}
    />
  );
}
