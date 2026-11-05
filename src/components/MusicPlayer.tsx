import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Volume1, 
  Disc3, 
  Music, 
  ListMusic,
  Sparkles
} from "lucide-react";
import ElasticSlider from "./reactbits/ElasticSlider";
import { getAssetUrl } from "@/lib/utils";
import { usePortfolioData } from "@/context/PortfolioContext";

export interface Track {
  id: string;
  title: string;
  artist: string;
  category: string;
  src: string;
  color: string;
}

const DEFAULT_PLAYLIST: Track[] = [
  {
    id: "track-1",
    title: "Deep Focus Ambient (432Hz)",
    artist: "Anannya AK — Coding Session",
    category: "Lo-Fi Ambient Chords",
    src: getAssetUrl("audio/deep-focus.wav"),
    color: "#50C878",
  },
  {
    id: "track-2",
    title: "Midnight Algorave",
    artist: "Data Science Synthesis",
    category: "Melodic Synthwave",
    src: getAssetUrl("audio/midnight-pulse.wav"),
    color: "#D1F2EB",
  },
  {
    id: "track-3",
    title: "Neural Synthesis Drift",
    artist: "Machine Learning Flow",
    category: "Atmospheric Soundscape",
    src: getAssetUrl("audio/neural-drift.wav"),
    color: "#50C878",
  },
];

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export function MusicPlayer({ className = "" }: { className?: string }) {
  const { data } = usePortfolioData();
  const PLAYLIST: Track[] =
    data.music && data.music.length > 0
      ? data.music.map((m) => ({
          id: m.id,
          title: m.title,
          artist: m.artist,
          category: m.category,
          src: m.audioUrl.startsWith("http") ? m.audioUrl : getAssetUrl(m.audioUrl),
          color: m.color || "#50C878",
        }))
      : DEFAULT_PLAYLIST;

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(70);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const currentTrack = PLAYLIST[currentTrackIndex] || PLAYLIST[0];

  // Initialize or update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.src;
    audio.load();
    setCurrentTime(0);
    setLoadError(false);

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Audio playback prevented or error:", err);
        setIsPlaying(false);
      });
    }
  }, [currentTrackIndex]);

  // Sync volume with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Playback error:", err);
          setLoadError(true);
          setIsPlaying(false);
        });
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setDuration(audio.duration || 0);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const bar = progressBarRef.current;
    const audio = audioRef.current;
    if (!bar || !audio || !duration) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width));
    const newTime = newProgress * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(previousVolume || 50);
    } else {
      setPreviousVolume(volume);
      setIsMuted(true);
      setVolume(0);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`relative rounded-3xl p-5 sm:p-6 bg-[#141416]/95 border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 ${className}`}
    >
      {/* Hidden real audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextTrack}
        onError={() => setLoadError(true)}
        preload="metadata"
      />

      {/* Top Header: Badge and Playlist Toggle */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B6E4F]/20 border border-[#50C878]/30 text-[#50C878] text-xs font-mono">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Interactive Audio Hub</span>
        </div>

        <button
          type="button"
          onClick={() => setShowPlaylist(!showPlaylist)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all border ${
            showPlaylist
              ? "bg-[#0B6E4F]/25 text-[#50C878] border-[#50C878]/40"
              : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
          }`}
          aria-label="Toggle playlist view"
        >
          <ListMusic className="w-3.5 h-3.5" />
          <span>Tracks ({PLAYLIST.length})</span>
        </button>
      </div>

      {/* Main Track Display Card */}
      <div className="flex items-center gap-4 mb-5">
        {/* Animated Vinyl / Artwork */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0A0A0A] border border-white/15 flex items-center justify-center shrink-0 shadow-lg overflow-hidden group">
          <div
            className={`w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center bg-black/60 shadow-inner ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "6s" }}
          >
            <div className="w-4 h-4 rounded-full bg-[#50C878] flex items-center justify-center shadow-[0_0_10px_rgba(80,200,120,0.8)]">
              <Disc3 className="w-3 h-3 text-black" />
            </div>
          </div>

          {/* Equalizer Wave Overlay while playing */}
          {isPlaying && (
            <div className="absolute inset-x-2 bottom-1.5 flex items-end justify-center gap-0.5 h-3">
              {[60, 100, 40, 80, 50].map((h, i) => (
                <span
                  key={i}
                  className="w-1 bg-[#50C878] rounded-full animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Track Title & Artist */}
        <div className="overflow-hidden flex-1">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#50C878] block truncate">
            {currentTrack.category}
          </span>
          <h4 className="text-base sm:text-lg font-bold font-display text-white truncate leading-tight mt-0.5">
            {currentTrack.title}
          </h4>
          <p className="text-xs text-zinc-400 truncate mt-0.5">
            {currentTrack.artist}
          </p>
        </div>
      </div>

      {/* Optional Playlist Dropdown List */}
      {showPlaylist && (
        <div className="mb-5 p-2 rounded-2xl bg-black/50 border border-white/10 space-y-1 animate-fade-in">
          {PLAYLIST.map((track, idx) => (
            <button
              key={track.id}
              type="button"
              onClick={() => {
                setCurrentTrackIndex(idx);
                setIsPlaying(true);
              }}
              className={`w-full text-left p-2.5 rounded-xl flex items-center justify-between text-xs transition-all ${
                idx === currentTrackIndex
                  ? "bg-[#0B6E4F]/25 text-[#50C878] font-semibold border border-[#50C878]/30"
                  : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Music className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{track.title}</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 shrink-0 ml-2">
                {idx === currentTrackIndex && isPlaying ? "PLAYING" : "SELECT"}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar & Scrubbing */}
      <div className="mb-4">
        <div
          ref={progressBarRef}
          onClick={handleSeek}
          className="relative h-2 w-full bg-white/10 rounded-full cursor-pointer overflow-hidden group hover:h-2.5 transition-all"
          role="progressbar"
          aria-valuenow={currentTime}
          aria-valuemin={0}
          aria-valuemax={duration || 100}
        >
          {/* Active progress track */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#50C878] to-[#D1F2EB] rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Timestamps */}
        <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 mt-1.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Main Playback Transport Controls */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 mb-5">
        {/* Previous Track */}
        <button
          type="button"
          onClick={prevTrack}
          className="p-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-[#50C878]/40 hover:scale-105 active:scale-95 transition-all"
          aria-label="Previous track"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        {/* Play / Pause Primary Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="p-4 rounded-full bg-gradient-to-r from-[#50C878] to-[#0B6E4F] hover:from-[#50C878] hover:to-[#50C878] text-[#013220] font-bold shadow-[0_0_20px_rgba(80,200,120,0.4)] hover:scale-110 active:scale-95 transition-all"
          aria-label={isPlaying ? "Pause playback" : "Start playback"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Next Track */}
        <button
          type="button"
          onClick={nextTrack}
          className="p-2.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:border-[#50C878]/40 hover:scale-105 active:scale-95 transition-all"
          aria-label="Next track"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Volume Control Using React Bits ElasticSlider */}
      <div className="pt-3 border-t border-white/5 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              className="hover:text-[#50C878] transition-colors p-1"
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : volume < 50 ? (
                <Volume1 className="w-4 h-4 text-[#50C878]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#50C878]" />
              )}
            </button>
            <span className="text-[11px] uppercase tracking-wider">Volume</span>
          </span>
          <span className="text-[11px] text-zinc-500">{isMuted ? "0%" : `${Math.round(volume)}%`}</span>
        </div>

        {/* ElasticSlider integration */}
        <div className="w-full px-1">
          <ElasticSlider
            value={isMuted ? 0 : volume}
            defaultValue={70}
            maxValue={100}
            onChange={handleVolumeChange}
            trackColor="rgba(255, 255, 255, 0.1)"
            rangeColor="linear-gradient(90deg, #14b8a6, #06b6d4)"
            thumbColor="#14b8a6"
            thickness={6}
            ariaLabel="Music Volume Control"
            growOnHover={true}
          />
        </div>
      </div>

      {/* Load error fallback banner if audio fails */}
      {loadError && (
        <div className="mt-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-mono text-center">
          Audio file notice: Ensure audio files exist in <code>public/audio/</code>.
        </div>
      )}
    </div>
  );
}

export default MusicPlayer;
