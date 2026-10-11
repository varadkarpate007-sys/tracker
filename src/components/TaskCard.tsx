import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GripVertical,
  Calendar,
  Clock,
  CheckCircle2,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowRight,
  AlertCircle,
  Tag,
  ArrowLeftRight,
  FileText,
  StickyNote,
  Paperclip,
} from 'lucide-react';
import { TaskItem, Priority, ColumnId } from '../types/task';

interface TaskCardProps {
  task: TaskItem;
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
  onQuickMove: (taskId: string, targetColumn: ColumnId) => void;
  onOpenDetails?: (task: TaskItem) => void;
  isOverlay?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onQuickMove,
  onOpenDetails,
  isOverlay = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
    disabled: isOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Priority badge styling
  const priorityStyles: Record<Priority, { bg: string; dot: string; label: string }> = {
    high: {
      bg: 'bg-rose-50 border-rose-200 text-rose-700',
      dot: 'bg-rose-500',
      label: 'High Priority',
    },
    medium: {
      bg: 'bg-amber-50 border-amber-200 text-amber-700',
      dot: 'bg-amber-500',
      label: 'Medium Priority',
    },
    low: {
      bg: 'bg-slate-100 border-slate-200 text-slate-600',
      dot: 'bg-slate-400',
      label: 'Low Priority',
    },
  };

  const priorityInfo = priorityStyles[task.priority] || priorityStyles.medium;

  // Format creation & due date
  const isOverdue =
    task.dueDate &&
    task.column !== 'done' &&
    new Date(task.dueDate).getTime() < new Date().setHours(0, 0, 0, 0);

  const formattedDueDate = task.dueDate
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(task.dueDate))
    : null;

  const hasDocumentation =
    task.notes ||
    task.eventReport ||
    (task.attachments && task.attachments.length > 0);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white rounded-xl border transition-all select-none ${
        isDragging
          ? 'opacity-40 border-blue-400 border-dashed shadow-inner scale-[0.98]'
          : isOverlay
          ? 'shadow-xl ring-2 ring-blue-500 border-blue-300 scale-102 cursor-grabbing rotate-1'
          : 'border-slate-200/90 hover:border-slate-300 hover:shadow-md shadow-xs'
      } ${
        task.column === 'done'
          ? 'bg-slate-50/60 border-emerald-200/60'
          : ''
      }`}
    >
      <div className="p-3.5 sm:p-4">
        {/* Top Header Row: Drag Handle + Tags + Menu */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Left: Drag Handle and Priority Badge */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              {...attributes}
              {...listeners}
              className="touch-none p-1 -ml-1 text-slate-300 hover:text-slate-600 cursor-grab active:cursor-grabbing rounded hover:bg-slate-100 transition-colors"
              title="Drag to reorder or move between columns"
              aria-label="Drag task"
            >
              <GripVertical className="w-4 h-4" />
            </button>

            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${priorityInfo.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityInfo.dot}`} />
              {priorityInfo.label}
            </span>

            {task.category && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                <Tag className="w-2.5 h-2.5 text-slate-400" />
                {task.category}
              </span>
            )}
          </div>

          {/* Right: Quick Actions Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Task options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                />
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30 text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onOpenDetails?.(task);
                    }}
                    className="w-full text-left px-3 py-1.5 text-blue-700 font-semibold hover:bg-blue-50 flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>Notes & Reports</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onEdit(task);
                    }}
                    className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Task Settings</span>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Move to Column
                  </div>

                  {task.column !== 'todo' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onQuickMove(task.id, 'todo');
                      }}
                      className="w-full text-left px-3 py-1.5 text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>To-Do</span>
                    </button>
                  )}

                  {task.column !== 'done' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onQuickMove(task.id, 'done');
                      }}
                      className="w-full text-left px-3 py-1.5 text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </button>
                  )}

                  {task.column !== 'next_month' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu(false);
                        onQuickMove(task.id, 'next_month');
                      }}
                      className="w-full text-left px-3 py-1.5 text-purple-600 hover:bg-purple-50 flex items-center gap-2"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Plan for Next Month</span>
                    </button>
                  )}

                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete(task);
                    }}
                    className="w-full text-left px-3 py-1.5 text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Task</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Task Title */}
        <h3
          onClick={() => onOpenDetails?.(task)}
          className={`text-sm sm:text-[15px] font-semibold text-slate-800 leading-snug mb-1.5 cursor-pointer hover:text-blue-600 transition-colors ${
            task.column === 'done' ? 'line-through text-slate-500' : ''
          }`}
        >
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description && (
          <p
            onClick={() => onOpenDetails?.(task)}
            className="text-xs text-slate-500 leading-relaxed mb-2.5 line-clamp-2 cursor-pointer"
          >
            {task.description}
          </p>
        )}

        {/* Documentation Indicators Row (Notes, Report, Attachments) */}
        {hasDocumentation && (
          <div className="flex items-center gap-1.5 flex-wrap mb-2.5 pt-1">
            {task.notes && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails?.(task);
                }}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 cursor-pointer hover:bg-blue-100 transition-colors"
                title="Notes recorded"
              >
                <StickyNote className="w-2.5 h-2.5" />
                <span>Notes added</span>
              </span>
            )}

            {task.eventReport && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails?.(task);
                }}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 cursor-pointer hover:bg-emerald-100 transition-colors"
                title="Event report available"
              >
                <FileText className="w-2.5 h-2.5" />
                <span>Report available</span>
              </span>
            )}

            {task.attachments && task.attachments.length > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetails?.(task);
                }}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors"
                title={`${task.attachments.length} attachment(s)`}
              >
                <Paperclip className="w-2.5 h-2.5" />
                <span>{task.attachments.length} file{task.attachments.length > 1 ? 's' : ''}</span>
              </span>
            )}
          </div>
        )}

        {/* Footer Meta Row: Due date / Planned month / Notes & Reports button */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 flex-wrap">
            {task.column === 'done' ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Completed
              </span>
            ) : task.column === 'next_month' ? (
              <span className="inline-flex items-center gap-1 text-purple-700 font-medium bg-purple-50 px-2 py-0.5 rounded border border-purple-200/60">
                <Calendar className="w-3 h-3 text-purple-500" />
                {task.plannedMonth || 'Upcoming Month'}
              </span>
            ) : formattedDueDate ? (
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  isOverdue
                    ? 'text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded'
                    : 'text-slate-600'
                }`}
              >
                {isOverdue ? (
                  <AlertCircle className="w-3 h-3 text-rose-500" />
                ) : (
                  <Clock className="w-3 h-3 text-slate-400" />
                )}
                <span>
                  {isOverdue ? 'Overdue: ' : 'Due: '}
                  {formattedDueDate}
                </span>
              </span>
            ) : (
              <span className="text-slate-400">No deadline</span>
            )}
          </div>

          {/* Action Buttons: "Notes & Reports" Button + Edit */}
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails?.(task);
              }}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 transition-colors"
              title="Open Notes, Event Report, and Documents"
            >
              <FileText className="w-3 h-3 text-blue-600" />
              <span>Notes & Reports</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
              title="Edit Task"
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(true);
              }}
              className="sm:hidden p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
              title="Move or manage task"
            >
              <ArrowLeftRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
