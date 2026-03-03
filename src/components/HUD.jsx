import React from 'react';
import { User, Sparkles, Orbit, Clock } from 'lucide-react';

const HUD = ({ score, coins, world }) => {
    return (
        <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-6 sm:p-10">
            <div className="max-w-7xl mx-auto grid grid-cols-4 text-[var(--theme-text)] items-start">

                {/* COMMANDER & SCORE */}
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1 flex items-center gap-2">
                        <User size={12} /> COMMANDER
                    </span>
                    <span className="font-outfit font-extrabold text-xl sm:text-3xl tracking-tight astral-glow">
                        {score.toLocaleString().padStart(7, '0')}
                    </span>
                </div>

                {/* STARDUST */}
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1 flex items-center gap-2">
                        <Sparkles size={12} /> STARDUST
                    </span>
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-accent shadow-[0_0_15px_var(--theme-accent)] animate-pulse" />
                        <span className="font-outfit font-extrabold text-xl sm:text-3xl tracking-tight">
                            x{coins.toString().padStart(2, '0')}
                        </span>
                    </div>
                </div>

                {/* SECTOR */}
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1 flex items-center gap-2">
                        <Orbit size={12} /> SECTOR
                    </span>
                    <span className="font-outfit font-extrabold text-xl sm:text-3xl tracking-tight uppercase">
                        {world}
                    </span>
                </div>

                {/* UPTIME */}
                <div className="flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1 flex items-center gap-2">
                        <Clock size={12} /> UPTIME
                    </span>
                    <span className="font-outfit font-extrabold text-xl sm:text-3xl tracking-tight">
                        300
                    </span>
                </div>

            </div>
        </div>
    );
};

export default HUD;
