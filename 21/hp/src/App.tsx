import React, { useState, useEffect } from 'react';
import { StudentProfile, StudentTask, TaskStatus } from './types/student';
import { DEMO_PROFILES, INITIAL_TASKS } from './data/initialData';
import { YADHU_AVATAR_SVG } from './data/yadhuAvatar';
import { Navbar } from './components/Navbar';
import { StudentProfileForm } from './components/StudentProfileForm';
import { StudentProfileCard } from './components/StudentProfileCard';
import { TaskManager } from './components/TaskManager';
import { AnalyticsView } from './components/AnalyticsView';

const STORAGE_KEY_PROFILE = 'student_portal_profile_v7';
const STORAGE_KEY_TASKS = 'student_portal_tasks_v7';

export default function App() {
  // Initialize profile from localStorage or default demo
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      // Purge old cached profiles
      localStorage.removeItem('student_portal_profile_v1');
      localStorage.removeItem('student_portal_profile_v2');
      localStorage.removeItem('student_portal_profile_v3');
      localStorage.removeItem('student_portal_profile_v4');
      localStorage.removeItem('student_portal_profile_v5');
      localStorage.removeItem('student_portal_profile_v6');

      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.photoUrl || parsed.photoUrl.includes('1539571696357') || parsed.photoUrl.includes('Aditya')) {
          parsed.photoUrl = '/image/profile.jpg';
        }
        if (parsed.fullName && parsed.fullName === 'Hridush prakash') {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return DEMO_PROFILES[0].profile;
  });

  // Ensure any lingering blonde placeholder photo in state is replaced immediately with /image/profile.jpg
  useEffect(() => {
    if (profile.photoUrl && profile.photoUrl.includes('1539571696357')) {
      setProfile((prev) => ({ ...prev, photoUrl: '/image/profile.jpg' }));
    }
  }, [profile.photoUrl]);

  // Initialize tasks from localStorage or initial data
  const [tasks, setTasks] = useState<StudentTask[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TASKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_TASKS;
  });

  // Active view tab: 'form' | 'card' | 'tasks' | 'analytics'
  const [activeTab, setActiveTab] = useState<'form' | 'card' | 'tasks' | 'analytics'>('form');

  // Save profile to localStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Save tasks to localStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  const handleSaveProfile = (updatedProfile: StudentProfile) => {
    setProfile(updatedProfile);
  };

  const handleAddTask = (newTask: Omit<StudentTask, 'id' | 'createdAt'>) => {
    const task: StudentTask = {
      ...newTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        taskCount={pendingTasksCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-8 px-4 sm:px-6 max-w-6xl mx-auto w-full">
        {activeTab === 'form' && (
          <StudentProfileForm
            profile={profile}
            onSaveProfile={handleSaveProfile}
            onPreviewProfile={() => setActiveTab('card')}
          />
        )}

        {activeTab === 'card' && (
          <StudentProfileCard
            profile={profile}
            onEdit={() => setActiveTab('form')}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManager
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateStatus={handleUpdateTaskStatus}
            onDeleteTask={handleDeleteTask}
            studentProfile={profile}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            profile={profile}
            tasks={tasks}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            &copy; {new Date().getFullYear()} Student Academic &amp; Placement Management Portal. Built with HTML5, CSS3, JavaScript, React &amp; Tailwind CSS.
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Client-side JavaScript Validation Active</span>
            <span>&bull;</span>
            <button
              onClick={() => setActiveTab('card')}
              className="text-indigo-600 hover:text-indigo-800 underline font-medium"
            >
              Printable Bio-Data Sheet
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
