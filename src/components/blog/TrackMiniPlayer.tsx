'use client';

import { Loader2, Music2, Pause, Play } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export interface TrackOfTheWeek {
  id: string;
  title?: string;
}

/**
 * Extracts the first "Track of the Week" Spotify track link from a post's
 * markdown content, e.g. `[Song by Artist](https://open.spotify.com/track/...)`.
 */
export function extractTrackOfTheWeek(content: string): TrackOfTheWeek | null {
  const m = content.match(
    /\[([^\]]*)\]\(\s*(https?:\/\/(?:www\.)?open\.spotify\.com\/(?:intl-[a-z]{2}\/)?track\/([A-Za-z0-9]+)[^)\s]*)\s*\)/
  );
  if (!m) return null;
  return { id: m[3], title: m[1].trim() || undefined };
}

/** Link text convention is "{Song} by {Artist}". */
function splitTitle(title?: string): { song?: string; artist?: string } {
  if (!title) return {};
  const idx = title.lastIndexOf(' by ');
  if (idx === -1) return { song: title };
  return { song: title.slice(0, idx), artist: title.slice(idx + 4) };
}

interface SpotifyEmbedController {
  play: () => void;
  togglePlay: () => void;
  destroy: () => void;
  addListener: (
    event: 'ready' | 'playback_update',
    cb: (e?: { data?: { isPaused?: boolean } }) => void
  ) => void;
}

interface SpotifyIframeApi {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyEmbedController) => void
  ) => void;
}

type SpotifyWindow = Window & {
  onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
  __spotifyIframeApi?: SpotifyIframeApi;
};

const SPOTIFY_IFRAME_API_SRC = 'https://open.spotify.com/embed/iframe-api/v1';

interface TrackPlayerContextValue {
  trackId: string;
  title?: string;
  isPaused: boolean;
  loading: boolean;
  togglePlay: () => void;
  registerHost: (el: HTMLElement | null) => void;
}

const TrackPlayerContext = createContext<TrackPlayerContextValue | null>(null);

export function useTrackPlayer() {
  return useContext(TrackPlayerContext);
}

/**
 * Owns the single Spotify player for the post's Track of the Week. The
 * in-article "Track of the Week" embed registers itself as the host element
 * (the Spotify iFrame API replaces it with the real embed), and the floating
 * mini player controls that same embed — so play/pause state is always in
 * sync between the two.
 */
export function TrackPlayerProvider({
  track,
  children,
}: {
  track: TrackOfTheWeek | null;
  children: ReactNode;
}) {
  const [isPaused, setIsPaused] = useState(true);
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<SpotifyEmbedController | null>(null);
  const readyRef = useRef(false);
  const pendingPlayRef = useRef(false);
  const initRef = useRef(false);
  const trackId = track?.id;

  const registerHost = useCallback(
    (el: HTMLElement | null) => {
      if (!el || initRef.current || !trackId) return;
      initRef.current = true;

      const setup = (api: SpotifyIframeApi) => {
        api.createController(
          el,
          { uri: `spotify:track:${trackId}`, width: '100%', height: 152 },
          (controller) => {
            controllerRef.current = controller;
            controller.addListener('ready', () => {
              readyRef.current = true;
              if (pendingPlayRef.current) {
                pendingPlayRef.current = false;
                controller.play();
              }
            });
            controller.addListener('playback_update', (e) => {
              const paused = e?.data?.isPaused;
              if (typeof paused === 'boolean') {
                setIsPaused(paused);
                setLoading(false);
              }
            });
          }
        );
      };

      const w = window as SpotifyWindow;
      if (w.__spotifyIframeApi) {
        setup(w.__spotifyIframeApi);
        return;
      }
      w.onSpotifyIframeApiReady = (api) => {
        w.__spotifyIframeApi = api;
        setup(api);
      };
      if (!document.querySelector(`script[src="${SPOTIFY_IFRAME_API_SRC}"]`)) {
        const script = document.createElement('script');
        script.src = SPOTIFY_IFRAME_API_SRC;
        script.async = true;
        document.body.appendChild(script);
      }
    },
    [trackId]
  );

  const togglePlay = useCallback(() => {
    // Sending messages before the embed iframe is ready throws, so queue the
    // intent until the controller's 'ready' event fires.
    if (readyRef.current && controllerRef.current) {
      controllerRef.current.togglePlay();
      return;
    }
    pendingPlayRef.current = true;
    setLoading(true);
  }, []);

  useEffect(() => {
    return () => {
      try {
        controllerRef.current?.destroy();
      } catch {
        // Iframe may already be gone during teardown.
      }
      controllerRef.current = null;
    };
  }, []);

  const value = useMemo(
    () =>
      track
        ? {
            trackId: track.id,
            title: track.title,
            isPaused,
            loading,
            togglePlay,
            registerHost,
          }
        : null,
    [track, isPaused, loading, togglePlay, registerHost]
  );

  return <TrackPlayerContext.Provider value={value}>{children}</TrackPlayerContext.Provider>;
}

/**
 * Floating mini player pill (bottom-right, above the back-to-top button):
 * album art, song/artist (linking to Spotify) and a play/pause button that
 * remote-controls the in-article Track of the Week embed.
 */
export function TrackMiniPlayer({ track }: { track: TrackOfTheWeek }) {
  const player = useTrackPlayer();
  const [visible, setVisible] = useState(false);
  const [thumb, setThumb] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Album art via Spotify's oEmbed endpoint.
  useEffect(() => {
    let cancelled = false;
    const trackUrl = `https://open.spotify.com/track/${track.id}`;
    fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(trackUrl)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { thumbnail_url?: string } | null) => {
        if (!cancelled && data?.thumbnail_url) setThumb(data.thumbnail_url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [track.id]);

  if (!player) return null;
  const { isPaused, loading, togglePlay } = player;

  const { song, artist } = splitTitle(track.title);
  // Stay visible while playing/loading so the controls remain reachable.
  const shown = visible || !isPaused || loading;

  return (
    <div
      className={`fixed bottom-20 right-4 z-40 transition-all duration-300 ${
        shown
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-1.5 rounded-full border bg-background/90 py-1.5 pl-1.5 pr-1.5 backdrop-blur-md">
        <a
          href={`https://open.spotify.com/track/${track.id}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={track.title ? `Open ${track.title} on Spotify` : 'Open the track on Spotify'}
          tabIndex={shown ? 0 : -1}
          className="group flex min-w-0 items-center gap-2.5 text-left"
        >
          {thumb ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={thumb} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
          ) : (
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Music2 className="h-4 w-4" />
            </span>
          )}
          <span className="flex min-w-0 flex-col pr-1">
            <span className="text-[0.55rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Track of the Week
            </span>
            {song && (
              <span className="max-w-[9rem] truncate text-xs font-medium text-foreground transition-opacity group-hover:opacity-80 sm:max-w-[13rem]">
                {song}
                {artist && <span className="font-normal text-muted-foreground"> · {artist}</span>}
              </span>
            )}
          </span>
        </a>
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPaused ? 'Play the track of the week' : 'Pause the track of the week'}
          tabIndex={shown ? 0 : -1}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isPaused ? (
            <Play className="ml-0.5 h-4 w-4 fill-current" />
          ) : (
            <Pause className="h-4 w-4 fill-current" />
          )}
        </button>
      </div>
    </div>
  );
}
