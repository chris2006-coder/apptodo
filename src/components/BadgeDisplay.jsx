import React from 'react';
import { Star, Trophy, Target, Shield, Award, Crown, Rocket, Orbit, Sparkles, Moon } from 'lucide-react';

const astralBadges = [
    { icon: Star, name: 'NOVA' },
    { icon: Rocket, name: 'QUASAR' },
    { icon: Orbit, name: 'PULSAR' },
    { icon: Sparkles, name: 'SUPERNOVA' },
    { icon: Moon, name: 'ECLIPSE' },
];

const BadgeDisplay = ({ completedCount }) => {
    const badgesCount = Math.floor(completedCount / 3);

    if (badgesCount <= 0) return null;

    return (
        <div className="pro-panel overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
                <Crown size={16} className="text-accent animate-astral" />
                <h3 className="text-xs font-bold font-outfit opacity-60 tracking-widest uppercase">Astral Achievements</h3>
            </div>

            <div className="flex flex-wrap gap-4">
                {Array.from({ length: badgesCount }).map((_, i) => {
                    const badge = astralBadges[i % astralBadges.length];
                    const Icon = badge.icon;
                    return (
                        <div
                            key={i}
                            className="relative group cursor-help transition-all duration-300 hover:scale-110"
                            title={`${badge.name} #${Math.floor(i / astralBadges.length) + 1}`}
                        >
                            <div className="w-12 h-12 glass-card flex items-center justify-center border-white/5 shadow-2xl">
                                <Icon
                                    size={20}
                                    className="text-accent drop-shadow-[0_0_10px_var(--theme-glow)]"
                                />
                            </div>
                            {/* MODERN TOOLTIP */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900/90 text-[10px] py-1.5 px-3 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10 backdrop-blur-md">
                                {badge.name}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Astral Energy</span>
                <span className="text-sm font-outfit font-extrabold text-accent">+{badgesCount * 1000} LUX</span>
            </div>
        </div>
    );
};

export default BadgeDisplay;
