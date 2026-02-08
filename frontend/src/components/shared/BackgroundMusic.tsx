import { useEffect, useCallback, useSyncExternalStore, useState } from "react";

// ==================== PLAYLIST ====================
// Thêm bài mới: bỏ file mp3 vào public/audio/ rồi thêm vào đây
const PLAYLIST = [
  { title: "Nhạc Nền", src: "/audio/background-music.mp3" },
  { title: "Tết Này Con Sẽ Về", src: "/audio/tet-nay-con-se-ve.mp3" },
];

// ==================== PLAYER SINGLETON ====================
const PLAYER_KEY = "__music_player__";

interface Player {
  audio: HTMLAudioElement;
  trackIndex: number;
  version: number; // bump to signal snapshot change
}

function getPlayer(): Player {
  const existing = (globalThis as Record<string, unknown>)[PLAYER_KEY];
  if (existing && typeof existing === "object" && "audio" in existing) {
    return existing as Player;
  }

  const p: Player = {
    audio: new Audio(PLAYLIST[0].src),
    trackIndex: 0,
    version: 0,
  };
  p.audio.preload = "auto";

  // When a track ends, go to next (async to avoid render-during-render)
  p.audio.addEventListener("ended", () => {
    setTimeout(() => playNext(), 0);
  });

  (globalThis as Record<string, unknown>)[PLAYER_KEY] = p;
  return p;
}

const player = getPlayer();

function loadAndPlay(index: number) {
  player.trackIndex = index;
  player.audio.src = PLAYLIST[index].src;
  player.audio.load();
  player.audio.play().catch(() => {});
  player.version++;
}

function playNext() {
  const next = (player.trackIndex + 1) % PLAYLIST.length;
  loadAndPlay(next);
}

function playPrev() {
  if (player.audio.currentTime > 3) {
    player.audio.currentTime = 0;
    return;
  }
  const prev = (player.trackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
  loadAndPlay(prev);
}

// ==================== REACT INTEGRATION ====================
const AUDIO_EVENTS = ["play", "pause", "timeupdate", "loadedmetadata"];

function subscribe(cb: () => void) {
  AUDIO_EVENTS.forEach((e) => player.audio.addEventListener(e, cb));
  return () => {
    AUDIO_EVENTS.forEach((e) => player.audio.removeEventListener(e, cb));
  };
}

// Only create a new snapshot object when something actually changed
let snap = buildSnapshot();
let prevKey = snapshotKey();

function buildSnapshot() {
  return {
    isPlaying: !player.audio.paused,
    track: PLAYLIST[player.trackIndex],
    time: player.audio.currentTime,
    duration: player.audio.duration || 0,
  };
}

function snapshotKey() {
  return `${Math.floor(player.audio.currentTime)}|${player.audio.paused}|${player.trackIndex}|${player.version}`;
}

function getSnapshot() {
  const key = snapshotKey();
  if (key !== prevKey) {
    prevKey = key;
    snap = buildSnapshot();
  }
  return snap;
}

// ==================== UTILS ====================
function fmt(s: number) {
  if (!isFinite(s)) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

// ==================== COMPONENT ====================
const BackgroundMusic = () => {
  const { isPlaying, track, time, duration } = useSyncExternalStore(
    subscribe,
    getSnapshot,
  );
  const [expanded, setExpanded] = useState(false);

  const startPlayback = useCallback(() => {
    player.audio.play().catch(() => {});
  }, []);

  // Autoplay policy: start on first user interaction
  useEffect(() => {
    if (!player.audio.paused) return;
    const handler = () => startPlayback();
    document.addEventListener("click", handler, { once: true });
    document.addEventListener("touchstart", handler, { once: true });
    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [startPlayback]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (duration <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    player.audio.currentTime =
      Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)) * duration;
  };

  const progress = duration > 0 ? (time / duration) * 100 : 0;

  // Collapsed view
  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="fixed bottom-4 right-4 z-50 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg hover:bg-white/30 transition-all duration-300"
        title="Mở trình phát nhạc"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          className="w-6 h-6"
        >
          {isPlaying ? (
            <>
              <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
              <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
            </>
          ) : (
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25" />
          )}
        </svg>
      </button>
    );
  }

  // Expanded view
  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl p-3">
      {/* Title + collapse */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white/70 text-sm shrink-0">♪</span>
          <span className="text-white text-sm font-medium truncate">
            {track.title}
          </span>
        </div>
        <button
          onClick={() => setExpanded(false)}
          className="text-white/60 hover:text-white transition shrink-0 ml-2"
          title="Thu nhỏ"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Progress bar */}
      <div
        className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer mb-2 group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-white/80 rounded-full relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Time + controls */}
      <div className="flex items-center justify-between">
        <span className="text-white/60 text-xs w-10">{fmt(time)}</span>

        <div className="flex items-center gap-3">
          {/* Prev */}
          <button
            onClick={playPrev}
            className="text-white/70 hover:text-white transition"
            title="Bài trước"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M9.195 18.44c1.25.714 2.805-.189 2.805-1.629v-2.34l6.945 3.968c1.25.715 2.805-.188 2.805-1.628V7.19c0-1.44-1.555-2.343-2.805-1.628L12 9.53v-2.34c0-1.44-1.555-2.343-2.805-1.628l-7.108 4.061c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={() =>
              isPlaying
                ? player.audio.pause()
                : player.audio.play().catch(() => {})
            }
            className="w-9 h-9 rounded-full bg-white/30 hover:bg-white/40 flex items-center justify-center text-white transition"
            title={isPlaying ? "Tạm dừng" : "Phát"}
          >
            {isPlaying ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={playNext}
            className="text-white/70 hover:text-white transition"
            title="Bài tiếp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path d="M5.055 7.06C3.805 6.347 2.25 7.25 2.25 8.69v6.62c0 1.44 1.555 2.343 2.805 1.628L12 12.97v2.34c0 1.44 1.555 2.343 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.06C13.555 4.715 12 5.617 12 7.058v2.34L5.055 5.44z" />
            </svg>
          </button>
        </div>

        <span className="text-white/60 text-xs w-10 text-right">
          {fmt(duration)}
        </span>
      </div>
    </div>
  );
};

export default BackgroundMusic;
