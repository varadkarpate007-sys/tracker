import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { TaskItem } from '../types/task';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  task: TaskItem | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  task,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Delete Department Task?
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors -mr-2 -mt-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Are you sure you want to permanently delete this task?
              </p>

              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="block text-xs font-semibold text-slate-800 line-clamp-2">
                  "{task.title}"
                </span>
                <span className="block text-[11px] text-slate-400 mt-1 capitalize">
                  Column: {task.column.replace('_', ' ')} • Priority: {task.priority}
                </span>
              </div>

              <p className="text-[11px] text-rose-600 font-medium mt-2">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-sm transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Task</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
