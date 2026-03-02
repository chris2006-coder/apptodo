import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Trash2, CheckCircle, Edit3, Calendar } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {


    return (
        <Motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            whileHover={{ scale: 1.01 }}
            id={`task-${task.id}`}
            className={`mission-block group flex items-center justify-between ${task.completed ? 'completed' : ''}`}
            style={{
                borderLeft: `8px solid ${task.priority === 'high' ? '#EF4444' :
                    task.priority === 'medium' ? '#F59E0B' : '#10B981'
                    }`,
                opacity: task.completed ? 0.6 : 1
            }}
        >
            <div className="flex items-center gap-6">
                {/* Custom Retro Checkbox */}
                <button
                    onClick={() => onToggle(task)}
                    className="w-10 h-10 flex items-center justify-center border-[4px] border-[var(--theme-border)] transition-all bg-[var(--theme-panel)] hover:brightness-110"
                >
                    {task.completed ? (
                        <CheckCircle className="text-[var(--theme-primary)]" size={20} />
                    ) : (
                        <span className="text-xl font-black text-[var(--theme-text)]">?</span>
                    )}
                </button>

                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] sm:text-[12px] leading-relaxed uppercase font-black tracking-tight ${task.completed ? 'line-through opacity-40' : ''}`}>
                            {task.title}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center">
                        <span
                            className="text-[7px] px-2 py-0.5 border-2 border-[var(--theme-border)] font-bold"
                            style={{
                                backgroundColor:
                                    task.priority === 'high' ? '#EF4444' :
                                        task.priority === 'medium' ? '#F59E0B' : '#10B981',
                                color: task.priority === 'medium' ? 'black' : 'white'
                            }}
                        >
                            {task.priority.toUpperCase()}
                        </span>

                        {task.deadline && (
                            <span className="flex items-center gap-1 text-[7px] font-bold opacity-70">
                                <Calendar size={10} />
                                DUE: {new Date(task.deadline).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    {task.description && (
                        <p className="text-[8px] opacity-60 leading-relaxed max-w-md mt-1 italic">
                            {task.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={onEdit}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[var(--theme-accent)]/20 border-[3px] border-transparent hover:border-[var(--theme-border)]"
                >
                    <Edit3 size={18} className="text-[var(--theme-text)]" />
                </button>
                <button
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-500/10 border-[3px] border-transparent hover:border-[var(--theme-border)]"
                >
                    <Trash2 size={20} className="text-red-600" />
                </button>
            </div>
        </Motion.div>
    );
};


export default TaskItem;
