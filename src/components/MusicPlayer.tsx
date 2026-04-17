import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Track } from '../types';
import { DUMMY_TRACKS } from '../constants';

const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const onEnded = () => {
    handleNext();
  };

  return (
    <div className="h-full px-6 flex items-center gap-6 border-l-4 border-magenta-glitch bg-surface shadow-[-8px_0_0_#00ffff]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />

      {/* Now Playing Area */}
      <div className="w-[200px] flex flex-col justify-center border-r-2 border-cyan-glitch/20 pr-4">
        <span className="text-[10px] text-magenta-glitch uppercase tracking-widest mb-0.5 animate-pulse">STREAM_ID_0x{currentTrack.id}</span>
        <div className="truncate font-black text-white tracking-widest text-sm glitch-text">
          {currentTrack.title.toUpperCase()}
        </div>
        <div className="truncate text-[10px] text-cyan-glitch/70 font-mono">
          SRC::{currentTrack.artist.replace(/\s+/g, '_').toUpperCase()}
        </div>
      </div>

      {/* Controls Area (Center) */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex items-center gap-6">
          <button 
            onClick={handlePrev}
            className="text-white hover:text-cyan-glitch transition-colors hover:skew-y-12"
          >
            <SkipBack className="w-5 h-5" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-10 h-10 bg-cyan-glitch text-bg flex items-center justify-center hover:bg-magenta-glitch transition-all border-2 border-white"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>

          <button 
            onClick={handleNext}
            className="text-white hover:text-cyan-glitch transition-colors hover:skew-y-12"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        <div className="w-full space-y-1 relative px-4">
          <div className="h-2 w-full bg-bg border border-cyan-glitch shrink-0 relative overflow-hidden">
            <motion.div 
              className="absolute h-full bg-magenta-glitch"
              style={{ width: `${progress}%` }}
              transition={{ type: "spring", bounce: 0, duration: 0.2 }}
            />
            {/* Flickering noise on progress */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono text-cyan-glitch uppercase tracking-widest">
             <span>BIT_POS::{progress.toFixed(0).padStart(3, '0')}</span>
             <span className="animate-pulse">DECODING...</span>
          </div>
        </div>
      </div>

      {/* Volume Area (Right) */}
      <div className="w-[200px] flex items-center gap-3 justify-end border-l-2 border-magenta-glitch/20 pl-4">
        <Volume2 className="w-4 h-4 text-magenta-glitch" />
        <div className="flex-1 max-w-[80px] h-3 bg-bg border border-cyan-glitch relative cursor-crosshair">
           <motion.div 
             className="absolute h-full bg-cyan-glitch left-0 top-0"
             style={{ width: `${volume * 100}%` }}
           />
           <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
            />
        </div>
        <span className="font-mono text-[10px] text-white w-10 text-right">
          VL::{Math.round(volume * 100)}
        </span>
      </div>
    </div>
  );
};

export default MusicPlayer;
