"use client";

// ============================================================================
// components/listening/youtube-player.tsx
// Loads the YouTube IFrame Player API on demand and renders a 16:9 responsive
// player. Exposes `seekTo(seconds)` to the parent (used by gap-transcript to
// jump playback to a gap's timestamp when its input is focused).
// ============================================================================
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

interface YTPlayerInstance {
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  playVideo: () => void;
  destroy: () => void;
}

interface YTNamespace {
  Player: new (
    elementId: string,
    options: {
      videoId: string;
      playerVars?: Record<string, unknown>;
      events?: { onReady?: () => void };
    }
  ) => YTPlayerInstance;
}

declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
}

export interface YoutubePlayerHandle {
  seekTo: (seconds: number) => void;
}

let apiLoadPromise: Promise<void> | null = null;

/** Injects the IFrame API script once and resolves once window.YT is ready. */
function loadYoutubeApi(): Promise<void> {
  if (typeof window !== "undefined" && window.YT?.Player) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  });
  return apiLoadPromise;
}

export const YoutubePlayer = forwardRef<YoutubePlayerHandle, { videoId: string }>(
  function YoutubePlayer({ videoId }, ref) {
    const containerId = useRef(`yt-player-${videoId}-${Math.random().toString(36).slice(2)}`);
    const playerRef = useRef<YTPlayerInstance | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
      let cancelled = false;

      loadYoutubeApi().then(() => {
        if (cancelled) return;
        playerRef.current = new window.YT.Player(containerId.current, {
          videoId,
          playerVars: { rel: 0 },
          events: {
            onReady: () => {
              if (!cancelled) setReady(true);
            },
          },
        });
      });

      return () => {
        cancelled = true;
        playerRef.current?.destroy?.();
        playerRef.current = null;
      };
    }, [videoId]);

    useImperativeHandle(ref, () => ({
      seekTo(seconds: number) {
        if (!playerRef.current || !ready) return;
        // Seek only — do NOT force playVideo() here. This fires on every
        // gap input's onFocus (see gap-transcript.tsx), so forcing playback
        // meant simply tapping into a field to type an answer made the
        // video jump and blast audio. If it was already playing it keeps
        // playing after the seek; if paused, it stays paused and the user
        // presses play themselves when ready to listen.
        playerRef.current.seekTo(seconds, true);
      },
    }));

    return (
      <div className="aspect-video w-full overflow-hidden rounded-(--radius-card) border border-border bg-surface-muted">
        <div id={containerId.current} className="h-full w-full" />
      </div>
    );
  }
);
