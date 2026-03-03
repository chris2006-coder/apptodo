import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { supabase } from './lib/supabase';
import HUD from './components/HUD';
import GameHero from './components/GameHero';
import TaskItem from './components/TaskItem';
import PomodoroTimer from './components/PomodoroTimer';
import FolderList from './components/FolderList';
import BadgeDisplay from './components/BadgeDisplay';
import { Plus, LogOut, Ghost, Star, Moon, Orbit, Rocket, Trophy, Edit3, Calendar, X, Save, Sparkles } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
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
        total = data.filter(t => t.completed).length;
        await supabase.auth.updateUser({
          data: { completed_tasks_total: total }
        });
      }

      setTotalCompleted(total);
      const badgesCount = Math.floor(total / 3);
      setScore(total * 500 + badgesCount * 1000);

      const uniqueFolders = Array.from(new Set(data.map(t => t.folder || 'MAIN')));
      setFolders(uniqueFolders.length > 0 ? uniqueFolders : ['MAIN']);
    }
  }, []);

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

    if (error) console.error('Error adding mission:', error);
    if (!error && data) {
      setTasks([data[0], ...tasks]);
      setNewTask('');
      setNewDescription('');
      setNewDeadline('');
      setNewPriority('medium');
      setGameStatus('victory');
      setTimeout(() => setGameStatus('idle'), 2000);
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
      console.error('Error updating mission:', error);
    } else {
      setEditingTask(null);
      fetchTasks();
    }
  };

  const toggleTask = async (task) => {
    const newStatus = !task.completed;
    const { error } = await supabase.from('tasks').update({ completed: newStatus }).eq('id', task.id);
    if (error) console.error('Error toggling status:', error);
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
    if (error) console.error('Error deleting mission:', error);
    if (!error) fetchTasks();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pro-panel max-w-md w-full text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full bg-primary/20 border border-white/10 flex items-center justify-center animate-astral">
              <Rocket className="text-accent w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 tracking-tight">ASTRAL TASK</h1>
          <p className="text-sm text-slate-400 mb-8">Synchronize with the system to begin.</p>
          
          <form onSubmit={handleAuth} className="space-y-4 text-left">
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-2 mb-1 block">Email Address</label>
              <input type="email" placeholder="commander@nebula.io" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-500 ml-2 mb-1 block">Security Key</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {authError && <p className="text-red-400 text-[10px] text-center">{authError}</p>}
            <button type="submit" className="pro-button w-full py-4 text-sm mt-4">
              {isSignUp ? 'INITIALIZE ACCOUNT' : 'ESTABLISH LINK'}
            </button>
          </form>
          
          <button onClick={() => setIsSignUp(!isSignUp)} className="w-full text-[10px] mt-8 uppercase font-semibold text-slate-400 hover:text-white transition-colors">
            {isSignUp ? 'Already connected? Log In' : 'New Commander? Initialize'}
          </button>
        </Motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <HUD
        score={score}
        coins={totalCompleted}
        world="Nebula"
      />

      <main className="max-w-7xl mx-auto pt-32 px-6 grid lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COMPONENT COLUMN */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
          <GameHero state={gameStatus} />

          <PomodoroTimer />

          <FolderList
            folders={folders}
            activeFolder={activeFolder}
            onSelect={setActiveFolder}
            onAdd={(name) => {
              if (!folders.includes(name)) setFolders([...folders, name]);
              setActiveFolder(name);
            }}
          />

          <BadgeDisplay
            completedCount={totalCompleted}
          />

          <button onClick={() => supabase.auth.signOut()} className="pro-button-secondary w-full flex items-center justify-center gap-4 py-6 text-sm">
            <LogOut size={18} /> TERMINATE SESSION
          </button>
        </div>

        {/* RIGHT MISSION COLUMN */}
        <div className="lg:col-span-7 space-y-8">
          <div className="pro-panel">
            <h2 className="text-sm font-bold mb-6 flex items-center gap-2">
              <Sparkles size={16} className="text-accent" /> NEW MISSION OBJECTIVE
            </h2>
            <form onSubmit={addTask} className="space-y-4">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Mission Title..."
                required
              />
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Diagnostic details (Optional)..."
                className="min-h-[100px] resize-none"
              />
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 flex gap-3 items-center bg-slate-900/50 rounded-2xl border border-white/10 p-4">
                  <Calendar size={18} className="opacity-40" />
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="bg-transparent p-0 border-none focus:shadow-none"
                  />
                </div>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="flex-1"
                >
                  <option value="low">LOW PRIORITY</option>
                  <option value="medium">MEDIUM PRIORITY</option>
                  <option value="high">HIGH PRIORITY</option>
                </select>
                <button type="submit" className="pro-button px-10">
                  <Plus size={24} />
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
              <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
                <Motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="pro-panel max-w-2xl w-full"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-bold">RECONFIG MISSION</h2>
                    <button onClick={() => setEditingTask(null)} className="hover:rotate-90 transition-transform p-2 bg-white/5 rounded-full">
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={updateTask} className="space-y-6">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 ml-2 mb-2 block">Objective</label>
                      <input
                        type="text"
                        value={editingTask.title}
                        onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-500 ml-2 mb-2 block">Diagnostic Details</label>
                      <textarea
                        value={editingTask.description || ''}
                        onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                        className="min-h-[120px] resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-2 mb-2 block">Estimated Arrival</label>
                        <div className="flex gap-3 items-center bg-slate-900/50 rounded-2xl border border-white/10 p-4">
                          <Calendar size={18} className="opacity-40" />
                          <input
                            type="date"
                            value={editingTask.deadline || ''}
                            onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                            className="bg-transparent p-0 border-none focus:shadow-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-500 ml-2 mb-2 block">Priority Level</label>
                        <select
                          value={editingTask.priority}
                          onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                        >
                          <option value="low">LOW PRIORITY</option>
                          <option value="medium">MEDIUM PRIORITY</option>
                          <option value="high">HIGH PRIORITY</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="button" onClick={() => setEditingTask(null)} className="pro-button-secondary flex-1 py-4">ABORT</button>
                      <button type="submit" className="pro-button flex-1 py-4">
                        <Save size={18} /> SYNC CHANGES
                      </button>
                    </div>
                  </form>
                </Motion.div>
              </div>
            )}
            {tasks.length === 0 && (
              <div className="text-center py-20 opacity-30 flex flex-col items-center gap-6">
                <Moon size={64} strokeWidth={1} />
                <p className="text-sm tracking-widest uppercase">The sector is currently clear.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
