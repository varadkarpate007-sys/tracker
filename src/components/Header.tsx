import React from 'react';
import { Plus, Calendar, RotateCcw, Download, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  onResetData: () => void;
  onExportData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onResetData,
  onExportData,
}) => {
  // Format current date nicely
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Left Title & Department Meta */}
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Department Task Manager
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  HOD Administration
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-xs sm:text-sm text-slate-500">
                <span className="font-medium text-slate-600">Department of Computer Science & Engineering</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {todayFormatted}
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              onClick={onResetData}
              title="Reset to default sample tasks"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <button
              onClick={onExportData}
              title="Export tasks to JSON file"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors border border-slate-200"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-all shadow-sm hover:shadow shadow-blue-600/30"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
