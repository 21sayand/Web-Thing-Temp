import React, { useState } from 'react';
import { StudentTask, TaskCategory, TaskPriority, TaskStatus, StudentProfile } from '../types/student';
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Search,
  Filter,
  Briefcase,
  BookOpen,
  Calendar,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface TaskManagerProps {
  tasks: StudentTask[];
  onAddTask: (task: Omit<StudentTask, 'id' | 'createdAt'>) => void;
  onUpdateStatus: (taskId: string, status: TaskStatus) => void;
  onDeleteTask: (taskId: string) => void;
  studentProfile: StudentProfile;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onUpdateStatus,
  onDeleteTask,
  studentProfile
}) => {
  const [activeTab, setActiveTab] = useState<'All' | TaskStatus>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskCategory>('Placement Prep');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskCompany, setNewTaskCompany] = useState('');
  const [formError, setFormError] = useState('');

  // Handle add task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setFormError('Please enter a task title.');
      return;
    }

    onAddTask({
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      status: 'Todo',
      dueDate: newTaskDueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      relatedCompany: newTaskCompany.trim() || undefined
    });

    setNewTaskTitle('');
    setNewTaskDesc('');
    setNewTaskDueDate('');
    setNewTaskCompany('');
    setFormError('');
    setIsAddingTask(false);
  };

  // Add automated tasks for target companies
  const handleAutoPopulatePlacementTasks = () => {
    const targetCompanies = studentProfile.interestedCompanies.length > 0
      ? studentProfile.interestedCompanies
      : ['Infosys', 'TCS (Tata Consultancy Services)', 'Wipro'];

    targetCompanies.slice(0, 3).forEach((comp) => {
      onAddTask({
        title: `${comp}: Solve 15 Core Pseudocode & Reasoning Problems`,
        description: `Target practice tailored for ${comp} campus placement written & technical rounds.`,
        category: 'Placement Prep',
        priority: 'High',
        status: 'Todo',
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
        relatedCompany: comp
      });
    });
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesTab = activeTab === 'All' ? true : task.status === activeTab;
    const matchesCategory = selectedCategory === 'All' ? true : task.category === selectedCategory;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.relatedCompany && task.relatedCompany.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesCategory && matchesSearch;
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const todoCount = tasks.filter((t) => t.status === 'Todo').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold uppercase tracking-wide mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            Academic & Placement Action Tracker
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Student Task & Placement Manager
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Organize study milestones, company-specific mock tests, internal exam prep, and NSS community deadlines.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleAutoPopulatePlacementTasks}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition border border-amber-200 cursor-pointer"
            title="Generate sample placement prep tasks for your chosen companies"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Sync Placement Tasks
          </button>
          <button
            onClick={() => setIsAddingTask(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create New Task
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Tasks</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Pending (To-Do)</span>
          <div className="text-2xl font-black text-amber-600 mt-1">{todoCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">In Progress</span>
          <div className="text-2xl font-black text-blue-600 mt-1">{inProgressCount}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Completion</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completionRate}%</div>
        </div>
      </div>

      {/* Modal / Inline Add Task Form */}
      {isAddingTask && (
        <div className="bg-white rounded-2xl border-2 border-indigo-200 shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              Add Academic or Placement Task
            </h3>
            <button
              onClick={() => setIsAddingTask(false)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              Cancel
            </button>
          </div>

          {formError && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {formError}
            </div>
          )}

          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Task Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Infosys Aptitude Test Practice - Quant & Reasoning"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Category</label>
                <select
                  value={newTaskCategory}
                  onChange={(e) => setNewTaskCategory(e.target.value as TaskCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Placement Prep">Placement Prep (Infosys, TCS, etc.)</option>
                  <option value="Internal Exams">Internal Exams (SGPA / CGPA)</option>
                  <option value="Assignments">Assignments & Labs</option>
                  <option value="Project">Final Year / Mini Project</option>
                  <option value="NSS & Club">NSS & Extracurricular Club</option>
                  <option value="Personal">Personal Study</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Priority</label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Associated Recruiter / Company
                </label>
                <select
                  value={newTaskCompany}
                  onChange={(e) => setNewTaskCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">None / General Academic</option>
                  <option value="Infosys">Infosys</option>
                  <option value="TCS (Tata Consultancy Services)">TCS</option>
                  <option value="Wipro">Wipro</option>
                  <option value="Accenture">Accenture</option>
                  <option value="Cognizant">Cognizant</option>
                  <option value="Google">Google</option>
                  <option value="Microsoft">Microsoft</option>
                  <option value="Amazon">Amazon</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Description / Details</label>
                <textarea
                  rows={2}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Notes, study links, question topics, or deliverables..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingTask(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
              >
                Save Task
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
            {(['All', 'Todo', 'In Progress', 'Completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer ${
                  activeTab === tab
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold mr-1">Category:</span>
          {['All', 'Placement Prep', 'Internal Exams', 'Assignments', 'Project', 'NSS & Club'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No tasks found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              There are no tasks matching your filters. Click "Create New Task" or "Sync Placement Tasks" to add some!
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            const isInProgress = task.status === 'In Progress';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'bg-slate-50/60 border-slate-200 text-slate-500'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:shadow-xs'
                }`}
              >
                {/* Left: Checkmark + Details */}
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() =>
                      onUpdateStatus(task.id, isCompleted ? 'Todo' : 'Completed')
                    }
                    className="mt-0.5 text-slate-400 hover:text-emerald-600 transition shrink-0 cursor-pointer"
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-bold ${
                          isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </span>

                      {/* Priority Badge */}
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          task.priority === 'High'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : task.priority === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {task.priority}
                      </span>

                      {/* Category Tag */}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {task.category}
                      </span>

                      {/* Related Company */}
                      {task.relatedCompany && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                          <Briefcase className="w-2.5 h-2.5" />
                          {task.relatedCompany}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due: {task.dueDate || 'No deadline'}
                      </span>
                      <span>&bull;</span>
                      <span className="font-medium text-slate-600">Status: {task.status}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                  {task.status !== 'In Progress' && !isCompleted && (
                    <button
                      onClick={() => onUpdateStatus(task.id, 'In Progress')}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition cursor-pointer"
                    >
                      Start
                    </button>
                  )}

                  {task.status === 'In Progress' && (
                    <button
                      onClick={() => onUpdateStatus(task.id, 'Completed')}
                      className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition cursor-pointer"
                    >
                      Done
                    </button>
                  )}

                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
