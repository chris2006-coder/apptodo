import React from 'react';
import { User, Menu, Star, Orbit, ShieldCheck, Sparkles } from 'lucide-react';

const HUD = ({ score, coins, world, user, profileName, profileImage, onMenuClick }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-6 flex items-center justify-between pointer-events-none">
            {/* LEFT: Commander Profile */}
            <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full pl-2 pr-6 py-2 pointer-events-auto">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-[2px] shadow-[0_0_15px_rgba(109,40,217,0.4)]">
                    <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center overflow-hidden">
                        {profileImage ? (
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User className="text-white/80" size={20} />
                        )}
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] items-center font-bold text-slate-500 flex gap-1 uppercase tracking-widest leading-none mb-1">
                        <ShieldCheck size={10} className="text-accent" /> Commander
                    </span>
                    <span className="text-xs font-outfit font-extrabold tracking-tight">
                        {profileName || 'UNKNOWN ENTITY'}
                    </span>
                </div>
            </div>

            {/* CENTER: Status (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-8 px-10 py-3 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl pointer-events-auto">
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Sector</span>
                    <span className="text-xs font-outfit font-bold">{world?.toUpperCase() || 'NEBULA'}-01</span>
                </div>
                <div className="w-[1px] h-6 bg-white/10" />
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Astral Sync</span>
                    <span className="text-xs font-outfit font-bold text-primary flex items-center gap-1">
                        <Star size={10} fill="currentColor" /> {score.toLocaleString()}
                    </span>
                </div>
                <div className="w-[1px] h-6 bg-white/10" />
                <div className="flex flex-col items-center">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Stardust</span>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--theme-accent)] animate-pulse" />
                        <span className="text-xs font-outfit font-bold">x{coins.toString().padStart(2, '0')}</span>
                    </div>
                </div>
            </div>

            {/* RIGHT: Menu Trigger */}
            <button
                onClick={onMenuClick}
                className="group p-4 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-2xl transition-all shadow-[0_0_20px_rgba(109,40,217,0.2)] hover:shadow-[0_0_30px_rgba(109,40,217,0.4)] pointer-events-auto"
            >
                <div className="flex items-center gap-3">
                    <span className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 ml-2">Astral Menu</span>
                    <Orbit className="text-white group-hover:rotate-90 transition-transform duration-500" size={20} />
                </div>
            </button>
        </header>
    );
};

export default HUD;
