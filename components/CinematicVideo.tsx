'use client';

import { useEffect, useRef } from 'react';

const VIDEO_SRC = '/ascend-opening.mp4';

export function CinematicVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;

    const play = () => {
      void video.play().catch(() => {
        // Autoplay can be blocked by a browser policy; the visual remains available.
      });
    };

    if (video.readyState >= 2) play();
    else video.addEventListener('canplay', play, { once: true });

    return () => video.removeEventListener('canplay', play);
  }, []);

  return (
    <video
      ref={videoRef}
      className="ascend-realm-video"
      src={VIDEO_SRC}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}
