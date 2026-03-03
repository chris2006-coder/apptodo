import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Trash2, CheckCircle, Edit3, Calendar, Circle, Sparkles } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
    return (
        <Motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -50 }}
            whileHover={{ scale: 1.01 }}
            id={`task-${task.id}`}
            className={`mission-block group flex items-center justify-between transition-all duration-300 ${task.completed ? 'completed opacity-40' : ''}`}
            style={{
                borderLeft: `4px solid ${task.priority === 'high' ? '#EF4444' :
                        task.priority === 'medium' ? '#F59E0B' : '#10B981'
                    }`,
                background: task.completed ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.04)'
            }}
        >
            <div className="flex items-center gap-6">
                {/* Modern Astral Checkbox */}
                <button
                    onClick={() => onToggle(task)}
                    className="relative w-10 h-10 flex items-center justify-center rounded-full border border-white/10 transition-all bg-white/5 hover:bg-white/10 group/check"
                >
                    {task.completed ? (
                        <CheckCircle className="text-accent astral-glow" size={20} />
                    ) : (
                        <div className="w-3 h-3 rounded-full border border-slate-500 group-hover/check:border-blue-400 group-hover/check:scale-110 transition-all" />
                    )}
                </button>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <span className={`text-[14px] font-semibold tracking-tight transition-all ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                            {task.title}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        <span
                            className="text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider"
                            style={{
                                backgroundColor: `${task.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' :
                                        task.priority === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)'
                                    }`,
                                color: task.priority === 'high' ? '#F87171' :
                                    task.priority === 'medium' ? '#FBBF24' : '#34D399',
                                border: `1px solid ${task.priority === 'high' ? 'rgba(239, 68, 68, 0.2)' :
                                        task.priority === 'medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)'
                                    }`
                            }}
                        >
                            {task.priority}
                        </span>

                        {task.deadline && (
                            <span className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500 uppercase tracking-widest">
                                <Calendar size={12} strokeWidth={1.5} />
                                {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        )}
                    </div>

                    {task.description && (
                        <p className="text-[11px] text-slate-400 leading-relaxed max-w-md mt-2 italic opacity-60">
                            {task.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 pr-2">
                <button
                    onClick={onEdit}
                    className="opacity-0 group-hover:opacity-100 transition-all p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                >
                    <Edit3 size={16} />
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-all p-2.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-500/50 hover:text-red-500"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </Motion.div>
    );
};

export default TaskItem;
