import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus, ListTodo, CheckCircle2, CalendarPlus, Inbox } from 'lucide-react';
import { ColumnId, TaskItem } from '../types/task';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  id: ColumnId;
  title: string;
  theme: 'blue' | 'green' | 'purple';
  subtitle: string;
  tasks: TaskItem[];
  onOpenAddModal: (column: ColumnId) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onQuickMove: (taskId: string, targetColumn: ColumnId) => void;
  onOpenDetails: (task: TaskItem) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  id,
  title,
  theme,
  subtitle,
  tasks,
  onOpenAddModal,
  onEditTask,
  onDeleteTask,
  onQuickMove,
  onOpenDetails,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: 'Column',
      columnId: id,
    },
  });

  // Color schemes for each column
  const themeStyles = {
    blue: {
      border: 'border-blue-200',
      headerBg: 'bg-blue-50/80',
      headerBorder: 'border-blue-100',
      accentDot: 'bg-blue-600',
      badge: 'bg-blue-100 text-blue-800 border-blue-200',
      button: 'text-blue-700 bg-blue-100/80 hover:bg-blue-200/80',
      dropActive: 'ring-2 ring-blue-500 bg-blue-50/40 border-blue-400 border-dashed',
      icon: <ListTodo className="w-4 h-4 text-blue-600" />,
    },
    green: {
      border: 'border-emerald-200',
      headerBg: 'bg-emerald-50/80',
      headerBorder: 'border-emerald-100',
      accentDot: 'bg-emerald-600',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      button: 'text-emerald-700 bg-emerald-100/80 hover:bg-emerald-200/80',
      dropActive: 'ring-2 ring-emerald-500 bg-emerald-50/40 border-emerald-400 border-dashed',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    },
    purple: {
      border: 'border-purple-200',
      headerBg: 'bg-purple-50/80',
      headerBorder: 'border-purple-100',
      accentDot: 'bg-purple-600',
      badge: 'bg-purple-100 text-purple-800 border-purple-200',
      button: 'text-purple-700 bg-purple-100/80 hover:bg-purple-200/80',
      dropActive: 'ring-2 ring-purple-500 bg-purple-50/40 border-purple-400 border-dashed',
      icon: <CalendarPlus className="w-4 h-4 text-purple-600" />,
    },
  }[theme];

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-slate-100/80 rounded-2xl border transition-all duration-200 min-h-[580px] shadow-xs ${
        themeStyles.border
      } ${isOver ? themeStyles.dropActive : ''}`}
    >
      {/* Column Header */}
      <div
        className={`p-4 rounded-t-2xl border-b backdrop-blur-xs flex items-center justify-between gap-3 ${themeStyles.headerBg} ${themeStyles.headerBorder}`}
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white shadow-xs">
            {themeStyles.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800 tracking-tight">
                {title}
              </h2>
              <span
                className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full border ${themeStyles.badge}`}
              >
                {tasks.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">{subtitle}</p>
          </div>
        </div>

        {/* Add button inside header for To-Do and Plan for Next Month */}
        {id !== 'done' && (
          <button
            onClick={() => onOpenAddModal(id)}
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold ${themeStyles.button}`}
            title={`Add task to ${title}`}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        )}
      </div>

      {/* Task List / Droppable Container */}
      <div className="p-3 flex-1 flex flex-col gap-2.5 overflow-y-auto">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onQuickMove={onQuickMove}
              onOpenDetails={onOpenDetails}
            />
          ))}
        </SortableContext>

        {/* Empty state */}
        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center rounded-xl border border-dashed border-slate-300 bg-white/40">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
              <Inbox className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-600">
              No tasks in this column
            </p>
            <p className="text-[11px] text-slate-400 max-w-[180px] mt-0.5">
              {id === 'done'
                ? 'Drag completed tasks here to record completion'
                : 'Click "Add" or drop tasks here to get started'}
            </p>
            {id !== 'done' && (
              <button
                onClick={() => onOpenAddModal(id)}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-xs hover:border-blue-300 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Task</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
