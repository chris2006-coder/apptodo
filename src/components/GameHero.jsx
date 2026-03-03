import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Moon, Star, Sun } from 'lucide-react';

const GameHero = ({ state }) => {
    return (
        <div className="relative flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full aspect-video pro-panel overflow-hidden border-white/5 flex items-center justify-center"
            >
                {/* ASTRAL VISUALIZER BACKGROUND */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10" />

                {/* FLOATING ASTRAL OBJECTS */}
                <motion.div
                    animate={{
                        y: [0, -15, 0],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10"
                >
                    <div className="relative">
                        <Moon size={80} strokeWidth={1} className="text-slate-200 drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]" />
                        <motion.div
                            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute -top-4 -right-4"
                        >
                            <Sparkles size={24} className="text-accent" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* AMBIENT STARS */}
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            opacity: [0.2, 0.6, 0.2],
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            duration: 2 + i,
                            repeat: Infinity,
                            delay: i * 0.5
                        }}
                        className="absolute text-slate-500"
                        style={{
                            top: `${20 + (i * 15)}%`,
                            left: `${15 + (i * 20)}%`
                        }}
                    >
                        <Star size={8} fill="currentColor" />
                    </motion.div>
                ))}

                {/* OVERLAY LABEL */}
                <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm p-3 text-slate-400 text-[10px] tracking-[0.2em] font-bold text-center border-t border-white/5 uppercase">
                    Astral System Synchronized
                </div>
            </motion.div>

            {/* STATUS FX */}
            <AnimatePresence>
                {state === 'victory' && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: -10, opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.1 }}
                        className="mt-6 font-outfit font-extrabold text-xl text-accent astral-glow uppercase tracking-wider"
                    >
                        Mission Accomplished
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GameHero;
