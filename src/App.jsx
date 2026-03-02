import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from './lib/supabase';
import HUD from './components/HUD';
import GameHero from './components/GameHero';
import TaskItem from './components/TaskItem';
import PomodoroTimer from './components/PomodoroTimer';
import FolderList from './components/FolderList';
import BadgeDisplay from './components/BadgeDisplay';
import { Plus, LogOut, Ghost, Star, Zap, Flame, Shield, Trophy, Edit3, Calendar, X, Save } from 'lucide-react';

const SAGAS = [
  { id: 'mario', name: 'Super Mario', icon: Star, color: '#5C94FC' },
  { id: 'pacman', name: 'Pacman', icon: Ghost, color: '#FFFF00' },
  { id: 'sonic', name: 'Sonic', icon: Zap, color: '#0040C0' },
  { id: 'pokemon', name: 'Pokemon', icon: Flame, color: '#FF0000' },
  { id: 'zelda', name: 'Zelda', icon: Shield, color: '#008000' },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [saga, setSaga] = useState('mario');
  const [gameStatus, setGameStatus] = useState('idle');
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [folders, setFolders] = useState(['MAIN']);
  const [activeFolder, setActiveFolder] = useState('MAIN');
  const [totalCompleted, setTotalCompleted] = useState(0);
  const [newDescription, setNewDescription] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (error) console.error('Error fetching tasks:', error);
    if (data) {
      setTasks(data);

      const { data: { user } } = await supabase.auth.getUser();
      let total = user?.user_metadata?.completed_tasks_total;

      if (total === undefined) {
        // Initial sync for existing users
        total = data.filter(t => t.completed).length;
        await supabase.auth.updateUser({
          data: { completed_tasks_total: total }
        });
      }

      setTotalCompleted(total);
      const badgesCount = Math.floor(total / 3);
      setScore(total * 500 + badgesCount * 1000);

      // Extract unique folders from tasks
      const uniqueFolders = Array.from(new Set(data.map(t => t.folder || 'MAIN')));
      setFolders(uniqueFolders.length > 0 ? uniqueFolders : ['MAIN']);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', saga);
  }, [saga]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchTasks();
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchTasks();
    });
    return () => subscription.unsubscribe();
  }, [fetchTasks]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };


  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim() || !user) return;
    const { data, error } = await supabase.from('tasks').insert([{
      title: newTask,
      description: newDescription,
      deadline: newDeadline || null,
      user_id: user.id,
      priority: newPriority,
      folder: activeFolder,
    }]).select();

    if (error) console.error('Error adding task:', error);
    if (!error && data) {
      setTasks([data[0], ...tasks]);
      setNewTask('');
      setNewDescription('');
      setNewDeadline('');
      setNewPriority('medium');
      setGameStatus('jumping');
      setTimeout(() => setGameStatus('idle'), 500);
      fetchTasks();
    }
  };

  const updateTask = async (e) => {
    e.preventDefault();
    if (!editingTask || !editingTask.title.trim()) return;

    const { error } = await supabase
      .from('tasks')
      .update({
        title: editingTask.title,
        description: editingTask.description,
        deadline: editingTask.deadline || null,
        priority: editingTask.priority,
      })
      .eq('id', editingTask.id);

    if (error) {
      console.error('Error updating task:', error);
    } else {
      setEditingTask(null);
      fetchTasks();
    }
  };

  const toggleTask = async (task) => {
    const newStatus = !task.completed;
    const { error } = await supabase.from('tasks').update({ completed: newStatus }).eq('id', task.id);
    if (error) console.error('Error toggling task:', error);
    if (!error) {
      if (newStatus) {
        setGameStatus('victory');
        const newTotal = totalCompleted + 1;
        setTotalCompleted(newTotal);
        await supabase.auth.updateUser({
          data: { completed_tasks_total: newTotal }
        });
        setTimeout(() => setGameStatus('idle'), 2000);
      } else {
        const newTotal = Math.max(0, totalCompleted - 1);
        setTotalCompleted(newTotal);
        await supabase.auth.updateUser({
          data: { completed_tasks_total: newTotal }
        });
      }
      fetchTasks();
    }
  };

  const deleteTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) console.error('Error deleting task:', error);
    if (!error) fetchTasks();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="pro-panel max-w-sm w-full">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-[var(--theme-accent)] border-4 border-[var(--theme-border)] flex items-center justify-center">
              <Trophy className="text-[var(--theme-text)] w-8 h-8" />
            </div>
          </div>
          <h1 className="text-xl text-center mb-8 tracking-tighter font-black">QUEST LOG v2.0</h1>
          <form onSubmit={handleAuth} className="space-y-4">
            <input type="email" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border-4 border-[var(--theme-border)] p-3 font-pixel text-[10px] outline-none" required />
            <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border-4 border-[var(--theme-border)] p-3 font-pixel text-[10px] outline-none" required />
            {authError && <p className="text-red-500 text-[8px] uppercase text-center">{authError}</p>}
            <button type="submit" className="pro-button w-full">{isSignUp ? 'JOIN QUEST' : 'START GAME'}</button>
          </form>
          <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-[8px] mt-6 uppercase font-bold opacity-50 hover:opacity-100 transition-opacity">
            {isSignUp ? 'HAVE ACCOUNT? LOGIN' : 'NEW PLAYER? REGISTER'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[101vh] pb-20">
      <HUD
        score={score}
        coins={totalCompleted}
        world="Overworld"
        saga={saga}
      />

      <main className="max-w-6xl mx-auto pt-32 px-4 grid lg:grid-cols-12 gap-8 items-start">

        {/* LEFT: SAGA & HERO */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
          <div className="pro-panel">
            <h2 className="text-[10px] mb-4 opacity-70">SELECT SAGA</h2>
            <div className="grid grid-cols-5 gap-2">
              {SAGAS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSaga(s.id)}
                  className={`saga-item ${saga === s.id ? 'saga-active' : ''}`}
                  title={s.name}
                >
                  <s.icon size={16} color={saga === s.id ? 'var(--theme-accent)' : s.color} />
                </button>
              ))}
            </div>
          </div>

          <GameHero saga={saga} state={gameStatus} />

          <PomodoroTimer saga={saga} />

          <FolderList
            folders={folders}
            activeFolder={activeFolder}
            onSelect={setActiveFolder}
            onAdd={(name) => {
              if (!folders.includes(name)) setFolders([...folders, name]);
              setActiveFolder(name);
            }}
            saga={saga}
          />

          <BadgeDisplay
            completedCount={totalCompleted}
            saga={saga}
          />

          <button onClick={() => supabase.auth.signOut()} className="pro-button-secondary w-full flex items-center justify-center gap-4 py-6">
            <LogOut size={16} /> EXIT GAME
          </button>
        </div>

        {/* RIGHT: TASKS */}
        <div className="lg:col-span-7 space-y-8">
          <div className="pro-panel">
            <form onSubmit={addTask} className="space-y-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="NEW QUEST OBJECTIVE..."
                className="w-full bg-transparent border-4 border-[var(--theme-border)] p-4 font-pixel text-[10px] outline-none"
                required
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="QUEST DETAILS (OPTIONAL)..."
                className="w-full bg-transparent border-4 border-[var(--theme-border)] p-4 font-pixel text-[8px] outline-none min-h-[80px] resize-none"
              />
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 flex gap-2 items-center bg-transparent border-4 border-[var(--theme-border)] p-2">
                  <Calendar size={14} className="opacity-50" />
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="bg-transparent font-pixel text-[8px] outline-none w-full"
                  />
                </div>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="bg-transparent border-4 border-[var(--theme-border)] p-2 font-pixel text-[8px] outline-none flex-1"
                >
                  <option value="low">LOW PRIORITY</option>
                  <option value="medium">MEDIUM PRIORITY</option>
                  <option value="high">HIGH PRIORITY</option>
                </select>
                <button type="submit" className="pro-button px-8">
                  <Plus size={20} />
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {tasks
                .filter(t => (t.folder || 'MAIN') === activeFolder)
                .sort((a, b) => {
                  const priorityOrder = { high: 0, medium: 1, low: 2 };
                  if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                  }
                  return new Date(b.created_at) - new Date(a.created_at);
                })
                .map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={() => toggleTask(task)}
                    onDelete={() => deleteTask(task.id)}
                    onEdit={() => setEditingTask({ ...task })}
                  />
                ))}
            </AnimatePresence>

            {/* EDIT MODAL */}
            {editingTask && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="pro-panel max-w-2xl w-full">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-[12px] font-black uppercase tracking-tighter">Edit Mission</h2>
                    <button onClick={() => setEditingTask(null)} className="hover:rotate-90 transition-transform">
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={updateTask} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[8px] opacity-60 uppercase font-black">Objective</label>
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        className="w-full bg-transparent border-4 border-[var(--theme-border)] p-4 font-pixel text-[10px] outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] opacity-60 uppercase font-black">Details</label>
                      <textarea
                        value={editingTask.description || ''}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        className="w-full bg-transparent border-4 border-[var(--theme-border)] p-4 font-pixel text-[8px] outline-none min-h-[100px] resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[8px] opacity-60 uppercase font-black">Deadline</label>
                        <div className="flex gap-2 items-center bg-transparent border-4 border-[var(--theme-border)] p-2">
                          <Calendar size={14} className="opacity-50" />
                          <input
                            type="date"
                            value={editingTask.deadline || ''}
                            onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                            className="bg-transparent font-pixel text-[8px] outline-none w-full"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[8px] opacity-60 uppercase font-black">Priority</label>
                        <select
                          value={editingTask.priority}
                          onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                          className="w-full bg-transparent border-4 border-[var(--theme-border)] p-2 font-pixel text-[8px] outline-none h-[44px]"
                        >
                          <option value="low">LOW PRIORITY</option>
                          <option value="medium">MEDIUM PRIORITY</option>
                          <option value="high">HIGH PRIORITY</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setEditingTask(null)} className="pro-button-secondary flex-1 py-4">CANCEL</button>
                      <button type="submit" className="pro-button flex-1 py-4 flex items-center justify-center gap-2">
                        <Save size={16} /> SAVE CHANGES
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {tasks.length === 0 && (
              <div className="text-center py-20 opacity-20 flex flex-col items-center gap-4">
                <Ghost size={48} />
                <p className="text-[10px] uppercase">No active missions available</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
