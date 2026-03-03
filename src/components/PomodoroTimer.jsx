import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Sparkles, Brain, Moon, Timer, Zap } from 'lucide-react';

const TIMER_MODES = {
    work: { label: 'FOCUS', time: 25, color: 'var(--theme-primary)', icon: Zap },
    shortBreak: { label: 'REST', time: 5, color: 'var(--theme-secondary)', icon: Moon },
    longBreak: { label: 'DEEP REST', time: 15, color: 'var(--theme-accent)', icon: Sparkles },
};

const PomodoroTimer = () => {
    const [mode, setMode] = useState('work');
    const [timeLeft, setTimeLeft] = useState(TIMER_MODES.work.time * 60);
    const [isActive, setIsActive] = useState(false);

    const switchMode = useCallback((newMode) => {
        setMode(newMode);
        setTimeLeft(TIMER_MODES[newMode].time * 60);
        setIsActive(false);
    }, []);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            setTimeout(() => setIsActive(false), 0);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const totalSeconds = TIMER_MODES[mode].time * 60;
    const progress = timeLeft / totalSeconds;
    const CurrentIcon = TIMER_MODES[mode].icon;

    return (
        <div className="pro-panel flex flex-col items-center gap-6">
            <div className="flex items-center gap-3">
                <Brain size={18} className="text-accent animate-astral" />
                <h3 className="text-xs font-bold font-outfit uppercase tracking-[0.2em] opacity-60">
                    Astral Sync
                </h3>
            </div>

            {/* ASTRAL CIRCULAR DISPLAY */}
            <div className="relative w-48 h-48 flex items-center justify-center">
                {/* SVG Progress Circle */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="4"
                        fill="none"
                    />
                    <motion.circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke={TIMER_MODES[mode].color}
                        strokeWidth="4"
                        strokeDasharray="553"
                        initial={{ strokeDashoffset: 553 }}
                        animate={{ strokeDashoffset: 553 * progress }}
                        transition={{ duration: 1, ease: "linear" }}
                        strokeLinecap="round"
                        fill="none"
                        className="drop-shadow-[0_0_8px_var(--theme-glow)]"
                    />
                </svg>

                <div className="z-10 flex flex-col items-center">
                    <span className="text-4xl font-outfit font-extrabold tracking-tighter">
                        {formatTime(timeLeft)}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        {TIMER_MODES[mode].label}
                    </span>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="flex gap-3">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className="pro-button px-6 py-3 rounded-xl"
                >
                    {isActive ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                    onClick={() => switchMode(mode)}
                    className="pro-button-secondary p-3 rounded-xl"
                >
                    <RotateCcw size={18} />
                </button>
            </div>

            {/* MODE SELECTOR */}
            <div className="grid grid-cols-3 gap-2 w-full mt-2">
                {Object.keys(TIMER_MODES).map((m) => {
                    const ModeIcon = TIMER_MODES[m].icon;
                    return (
                        <button
                            key={m}
                            onClick={() => switchMode(m)}
                            className={`text-[9px] font-bold py-3 rounded-xl transition-all flex flex-col items-center gap-1.5 ${mode === m
                                ? 'bg-primary/20 text-white border border-primary/30 shadow-[0_0_15px_rgba(109,40,217,0.2)]'
                                : 'bg-white/5 text-slate-500 border border-transparent hover:bg-white/10'
                                }`}
                        >
                            {m === mode ? <ModeIcon size={12} className="animate-pulse" /> : <div className="h-3" />}
                            {TIMER_MODES[m].label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default PomodoroTimer;
