import React from 'react';
import { CheckCircle2, Clock, CalendarDays, Layers, TrendingUp } from 'lucide-react';
import { TaskItem } from '../types/task';

interface SummaryCardsProps {
  tasks: TaskItem[];
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.column === 'todo').length;
  const completedTasks = tasks.filter((t) => t.column === 'done').length;
  const plannedTasks = tasks.filter((t) => t.column === 'next_month').length;

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      {/* 1. Total Tasks */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-slate-500">Total Tasks</span>
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
            <Layers className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalTasks}</span>
          <span className="text-xs text-slate-500">All columns</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
          <span className="font-medium text-slate-600">Active oversight</span>
        </div>
      </div>

      {/* 2. Pending Tasks (To-Do - Blue) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-blue-200/80 shadow-xs hover:border-blue-300 transition-all bg-gradient-to-b from-blue-50/30 to-white">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-blue-700">Pending Tasks</span>
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-900">{pendingTasks}</span>
          <span className="text-xs font-medium text-blue-600">In To-Do</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-blue-600">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>Requires attention</span>
        </div>
      </div>

      {/* 3. Completed Tasks (Done - Green) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-xs hover:border-emerald-300 transition-all bg-gradient-to-b from-emerald-50/30 to-white">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-emerald-700">Completed Tasks</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900">{completedTasks}</span>
          <span className="text-xs font-medium text-emerald-600">{completionRate}% done</span>
        </div>
        {/* Progress bar */}
        <div className="mt-2.5 w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${completionRate}%` }}
          ></div>
        </div>
      </div>

      {/* 4. Planned Tasks (Next Month - Purple) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-200/80 shadow-xs hover:border-purple-300 transition-all bg-gradient-to-b from-purple-50/30 to-white">
        <div className="flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-purple-700">Planned Tasks</span>
          <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-extrabold text-purple-900">{plannedTasks}</span>
          <span className="text-xs font-medium text-purple-600">Next Month</span>
        </div>
        <div className="mt-2.5 flex items-center gap-1 text-xs text-purple-600">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Future roadmap</span>
        </div>
      </div>
    </div>
  );
};
