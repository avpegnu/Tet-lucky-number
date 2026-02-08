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
        className="fixed bottom-4 right-4 z-50 w-11 h-11 rounded-full bg-red-900/80 backdrop-blur-sm border border-amber-400/40 flex items-center justify-center shadow-lg hover:bg-red-800/90 transition-all duration-300"
        title="Mở trình phát nhạc"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fbbf24" className="w-5 h-5">
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

  // Expanded view — full-width bottom bar
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-red-900/95 backdrop-blur-sm border-t border-amber-400/30 shadow-[0_-2px_10px_rgba(0,0,0,0.3)] px-4 py-2.5">
      {/* Progress bar — full width on top */}
      <div
        className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-2 group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-amber-400 rounded-full relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-amber-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Content row */}
      <div className="flex items-center gap-3">
        {/* Track info */}
        <div className="flex-1 min-w-0">
          <p className="text-amber-100 text-sm font-medium truncate">{track.title}</p>
          <p className="text-amber-100/50 text-xs">{fmt(time)} / {fmt(duration)}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={playPrev} className="text-amber-200/70 hover:text-amber-200 transition p-1" title="Bài trước">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <rect x="4" y="6" width="2.5" height="12" rx="0.5" />
              <path d="M19 6.5a1 1 0 00-1.5-.86l-10 5.5a1 1 0 000 1.72l10 5.5A1 1 0 0019 17.5v-11z" />
            </svg>
          </button>

          <button
            onClick={() => (isPlaying ? player.audio.pause() : player.audio.play().catch(() => {}))}
            className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-red-900 transition"
            title={isPlaying ? "Tạm dừng" : "Phát"}
          >
            {isPlaying ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button onClick={playNext} className="text-amber-200/70 hover:text-amber-200 transition p-1" title="Bài tiếp">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <rect x="17.5" y="6" width="2.5" height="12" rx="0.5" />
              <path d="M5 6.5a1 1 0 011.5-.86l10 5.5a1 1 0 010 1.72l-10 5.5A1 1 0 015 17.5v-11z" />
            </svg>
          </button>
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setExpanded(false)}
          className="text-amber-200/50 hover:text-amber-200 transition p-1 shrink-0"
          title="Thu nhỏ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BackgroundMusic;
