import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Activity, Trophy, Music as MusicIcon, ListMusic, BarChart3, Binary, Terminal } from 'lucide-react';
import { motion } from 'motion/react';
import { DUMMY_TRACKS } from './constants';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-bg text-cyan-glitch font-pixel overflow-hidden selection:bg-magenta-glitch selection:text-white">
      {/* Header Area */}
      <header className="h-[60px] px-8 flex items-center justify-between border-b-4 border-magenta-glitch bg-surface shrink-0 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <Terminal className="w-6 h-6 text-magenta-glitch animate-pulse" />
          <div className="font-black text-2xl tracking-[0.2em] glitch-text uppercase">
            NEON_CORE_0x1
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10 font-mono text-[10px] text-magenta-glitch">
          <div className="hidden md:flex flex-col items-end">
            <span>MEM_ADDR::0xFF45A</span>
            <span className="text-cyan-glitch">SYS_LINK::ESTABLISHED</span>
          </div>
          <div className="w-[2px] h-8 bg-magenta-glitch/30" />
          <div className="flex items-center gap-2">
            <span>Uptime:</span>
            <span className="text-white">00:44:12</span>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-[260px_1fr_260px] gap-0 bg-surface overflow-hidden">
        
        {/* Playlist Pane */}
        <section className="bg-bg p-6 flex flex-col overflow-y-auto border-r-4 border-magenta-glitch relative">
          <div className="flex items-center gap-2 mb-6 text-magenta-glitch">
             <ListMusic className="w-4 h-4" />
             <h3 className="text-xs uppercase tracking-[0.2em]">Data_Packets</h3>
          </div>

          <div className="space-y-4">
            {DUMMY_TRACKS.map((track, i) => (
              <div 
                key={track.id} 
                className={`p-3 relative group transition-all cursor-crosshair border-2 ${i === 0 ? 'bg-magenta-glitch text-bg border-white translate-x-1' : 'bg-surface border-cyan-glitch/20 text-cyan-glitch hover:border-cyan-glitch hover:-translate-x-1'}`}
              >
                <div className="text-[10px] font-bold mb-1 truncate">{track.title.toUpperCase()}</div>
                <div className={`text-[8px] font-mono uppercase ${i === 0 ? 'text-bg' : 'text-text-dim'}`}>
                  {track.artist.replace(/\s+/g, '_')} [EXT]
                </div>
                {i === 0 && (
                  <div className="absolute -left-1 top-0 bottom-0 w-1 bg-white animate-pulse" />
                )}
              </div>
            ))}
          </div>

          <div className="mt-auto p-3 border-2 border-cyan-glitch/30 text-[8px] leading-tight uppercase relative group">
            <div className="absolute inset-0 bg-cyan-glitch/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <p className="relative z-10">
              [SYSTEM_LOG] :: Input vector manipulation directly modulates frequency harmonics. Use W-A-S-D for manual override.
            </p>
          </div>
        </section>

        {/* Game Viewport */}
        <section className="bg-black relative flex items-center justify-center overflow-hidden border-r-4 border-magenta-glitch">
          {/* Grid visual overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none" />
          
          <div className="relative z-10 scale-90 sm:scale-100">
            <SnakeGame 
              onScoreChange={handleScoreChange}
              onGameOver={() => {}}
            />
            {/* Visual Overlays */}
            <div className="absolute -bottom-16 left-0 right-0 flex justify-between items-center px-2">
               <div className="flex items-center gap-2 text-[10px] text-magenta-glitch uppercase italic">
                 <Binary className="w-3 h-3" /> Bit_Level::9
               </div>
               <div className="text-[10px] text-magenta-glitch uppercase tracking-widest animate-pulse">
                 SYNC_CORE::STABLE
               </div>
            </div>
          </div>

          {/* Glitch borders decoration */}
          <div className="absolute top-4 left-4 w-12 h-1 bg-cyan-glitch" />
          <div className="absolute top-4 left-4 w-1 h-12 bg-magenta-glitch" />
          <div className="absolute bottom-4 right-4 w-12 h-1 bg-magenta-glitch" />
          <div className="absolute bottom-4 right-4 w-1 h-12 bg-cyan-glitch" />
        </section>

        {/* Stats Pane */}
        <section className="bg-bg p-6 flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6 text-magenta-glitch">
             <BarChart3 className="w-4 h-4" />
             <h3 className="text-xs uppercase tracking-[0.2em]">Session_Heap</h3>
          </div>
          
          <div className="space-y-6">
            <div className="bg-surface p-4 border-2 border-magenta-glitch relative group">
              <div className="absolute -top-3 left-2 bg-bg px-2 text-[8px] text-white">BYTES_COLLECTED</div>
              <div className="text-3xl font-black text-cyan-glitch font-mono glitch-text">
                {score.toString(16).toUpperCase().padStart(4, '0')}
              </div>
            </div>

            <div className="bg-surface p-4 border-2 border-cyan-glitch relative group">
              <div className="absolute -top-3 left-2 bg-bg px-2 text-[8px] text-white">MAX_HEAP_SIZE</div>
              <div className="text-3xl font-black text-magenta-glitch font-mono">
                {highScore.toString(16).toUpperCase().padStart(4, '0')}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-2 border border-dashed border-magenta-glitch/30">
               <span className="text-[8px] text-text-dim text-center">THREAD_OCCUPANCY</span>
               <div className="flex gap-1 h-1.5 px-1">
                 {[...Array(12)].map((_, i) => (
                   <div key={i} className={`flex-1 ${i < 8 ? 'bg-cyan-glitch' : 'bg-bg border border-cyan-glitch/20'}`} />
                 ))}
               </div>
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="text-[8px] uppercase tracking-[0.2em] text-magenta-glitch mb-3">Buffer_Visualizer</h3>
            <div className="flex items-end gap-[2px] h-10 border-t border-magenta-glitch/20 pt-2">
              {[40, 70, 100, 50, 30, 80, 55, 90, 20, 60].map((h, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: `${h}%` }}
                  transition={{ repeat: Infinity, duration: 0.3 + Math.random(), ease: "steps(4)" }}
                  className={`flex-1 ${i % 3 === 0 ? 'bg-magenta-glitch' : 'bg-cyan-glitch'}`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Area */}
      <footer className="h-[90px] bg-bg border-t-4 border-cyan-glitch shrink-0 relative overflow-hidden">
        <div className="absolute inset-0 bg-cyan-glitch/5 animate-pulse pointer-events-none" />
        <MusicPlayer />
      </footer>
    </div>
  );
}
