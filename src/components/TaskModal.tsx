import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TaskItem, Priority, ColumnId, Category } from '../types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<TaskItem>) => void;
  initialTask?: TaskItem | null;
  defaultColumn?: ColumnId;
  categories: Category[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  defaultColumn = 'todo',
  categories,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [column, setColumn] = useState<ColumnId>('todo');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('Academics');
  const [dueDate, setDueDate] = useState('');
  const [plannedMonth, setPlannedMonth] = useState('November 2026');
  const [error, setError] = useState('');

  // Load initial data on open / switch
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setColumn(initialTask.column);
      setPriority(initialTask.priority);
      setCategory(initialTask.category);
      setDueDate(initialTask.dueDate || '');
      setPlannedMonth(initialTask.plannedMonth || 'November 2026');
    } else {
      setTitle('');
      setDescription('');
      setColumn(defaultColumn);
      setPriority('medium');
      setCategory(categories[0] || 'Academics');
      setDueDate('');
      setPlannedMonth('November 2026');
    }
    setError('');
  }, [initialTask, defaultColumn, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required.');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      column,
      priority,
      category,
      dueDate: dueDate || undefined,
      plannedMonth: column === 'next_month' ? plannedMonth : undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {initialTask ? 'Edit Task' : 'Add New Department Task'}
              </h2>
              <p className="text-xs text-slate-500">
                {initialTask
                  ? 'Update departmental task details and status'
                  : 'Assign, schedule, and categorize administrative duties'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Task Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g., Finalize End-Semester Practical Exam Examiners"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400"
                autoFocus
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Description / Action Notes <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Add departmental instructions, faculty responsible, or reference circulars..."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400 resize-none"
              />
            </div>

            {/* Target Column Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Column
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setColumn('todo')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    column === 'todo'
                      ? 'bg-blue-50 border-blue-400 text-blue-700 ring-1 ring-blue-400'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  To-Do
                </button>
                <button
                  type="button"
                  onClick={() => setColumn('done')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    column === 'done'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-700 ring-1 ring-emerald-400'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Done
                </button>
                <button
                  type="button"
                  onClick={() => setColumn('next_month')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    column === 'next_month'
                      ? 'bg-purple-50 border-purple-400 text-purple-700 ring-1 ring-purple-400'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Next Month
                </button>
              </div>
            </div>

            {/* Priority Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Priority Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('low')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    priority === 'low'
                      ? 'bg-slate-100 border-slate-400 text-slate-800 ring-1 ring-slate-400'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Low
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('medium')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    priority === 'medium'
                      ? 'bg-amber-50 border-amber-400 text-amber-800 ring-1 ring-amber-400'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('high')}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    priority === 'high'
                      ? 'bg-rose-50 border-rose-400 text-rose-800 ring-1 ring-rose-400'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  High
                </button>
              </div>
            </div>

            {/* Domain / Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Department Domain
                </label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Due Date or Planned Month */}
              <div>
                {column === 'next_month' ? (
                  <div>
                    <label className="block text-xs font-bold text-purple-700 mb-1">
                      Planned Academic Month
                    </label>
                    <select
                      value={plannedMonth}
                      onChange={(e) => setPlannedMonth(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-purple-50/50 border border-purple-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-purple-900"
                    >
                      <option value="November 2026">November 2026</option>
                      <option value="December 2026">December 2026</option>
                      <option value="January 2027">January 2027</option>
                      <option value="February 2027">February 2027</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Due Date <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{initialTask ? 'Save Changes' : 'Create Task'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
