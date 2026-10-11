import React, { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
  TaskItem,
  ColumnId,
  Category,
  TaskFilter,
} from './types/task';
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  resetTasksStorage,
} from './utils/storage';
import { Header } from './components/Header';
import { SummaryCards } from './components/SummaryCards';
import { FilterBar } from './components/FilterBar';
import { TaskColumn } from './components/TaskColumn';
import { TaskCard } from './components/TaskCard';
import { TaskModal } from './components/TaskModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { TaskDetailsModal } from './components/TaskDetailsModal';

const CATEGORIES: Category[] = [
  'Academics',
  'Faculty & Staff',
  'Exams & Evaluations',
  'NBA & Accreditation',
  'Administration',
  'Student Affairs',
  'Labs & Research',
];

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadTasksFromStorage());
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultColumn, setModalDefaultColumn] = useState<ColumnId>('todo');
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);
  const [activeDetailsTask, setActiveDetailsTask] = useState<TaskItem | null>(null);

  // Filters state
  const [filter, setFilter] = useState<TaskFilter>({
    search: '',
    priority: 'all',
    category: 'all',
  });

  // Mobile column view tab (all, todo, done, next_month)
  const [mobileTab, setMobileTab] = useState<'all' | ColumnId>('all');

  // Persistence effect
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  // DnD Sensors config - optimized for touch and mouse
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Search filter
      if (filter.search.trim()) {
        const query = filter.search.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description?.toLowerCase().includes(query);
        const matchesCategory = task.category.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesCategory) return false;
      }

      // Priority filter
      if (filter.priority !== 'all' && task.priority !== filter.priority) {
        return false;
      }

      // Category filter
      if (filter.category !== 'all' && task.category !== filter.category) {
        return false;
      }

      return true;
    });
  }, [tasks, filter]);

  // Tasks per column sorted by order
  const todoTasks = useMemo(
    () =>
      filteredTasks
        .filter((t) => t.column === 'todo')
        .sort((a, b) => a.order - b.order),
    [filteredTasks]
  );

  const doneTasks = useMemo(
    () =>
      filteredTasks
        .filter((t) => t.column === 'done')
        .sort((a, b) => a.order - b.order),
    [filteredTasks]
  );

  const nextMonthTasks = useMemo(
    () =>
      filteredTasks
        .filter((t) => t.column === 'next_month')
        .sort((a, b) => a.order - b.order),
    [filteredTasks]
  );

  // Handler: Add or Update Task
  const handleSaveTask = (taskData: Partial<TaskItem>) => {
    if (editingTask) {
      // Update existing
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== editingTask.id) return t;

          const updatedColumn = taskData.column || t.column;
          return {
            ...t,
            ...taskData,
            column: updatedColumn,
            completedAt:
              updatedColumn === 'done'
                ? t.completedAt || new Date().toISOString()
                : undefined,
          };
        })
      );
      setEditingTask(null);
    } else {
      // Create new task
      const targetColumn = taskData.column || 'todo';
      const columnTasks = tasks.filter((t) => t.column === targetColumn);
      const newTask: TaskItem = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: taskData.title || '',
        description: taskData.description,
        column: targetColumn,
        priority: taskData.priority || 'medium',
        category: taskData.category || 'Academics',
        dueDate: taskData.dueDate,
        plannedMonth:
          targetColumn === 'next_month'
            ? taskData.plannedMonth || 'November 2026'
            : undefined,
        createdAt: new Date().toISOString(),
        completedAt: targetColumn === 'done' ? new Date().toISOString() : undefined,
        order: columnTasks.length,
      };

      setTasks((prev) => [...prev, newTask]);
    }
  };

  // Handler: Update Task Details (Notes, Report, Attachments)
  const handleUpdateTaskDetails = (updatedTask: TaskItem) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
    setActiveDetailsTask(updatedTask);
  };

  // Handler: Delete Task
  const handleConfirmDelete = () => {
    if (!taskToDelete) return;
    if (activeDetailsTask && activeDetailsTask.id === taskToDelete.id) {
      setActiveDetailsTask(null);
    }
    setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    setTaskToDelete(null);
  };

  // Handler: Quick Move button (Accessible & Mobile Touch Alternative)
  const handleQuickMove = (taskId: string, targetColumn: ColumnId) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const currentTask = prev[taskIndex];
      if (currentTask.column === targetColumn) return prev;

      const targetColumnTasks = prev.filter((t) => t.column === targetColumn);
      const updatedTask: TaskItem = {
        ...currentTask,
        column: targetColumn,
        order: targetColumnTasks.length,
        completedAt:
          targetColumn === 'done' ? new Date().toISOString() : undefined,
        plannedMonth:
          targetColumn === 'next_month' && !currentTask.plannedMonth
            ? 'November 2026'
            : currentTask.plannedMonth,
      };

      if (activeDetailsTask && activeDetailsTask.id === taskId) {
        setActiveDetailsTask(updatedTask);
      }

      const copy = [...prev];
      copy[taskIndex] = updatedTask;
      return copy;
    });
  };

  // Reset demo data
  const handleResetData = () => {
    if (window.confirm('Reset all tasks to sample College HOD departmental duties?')) {
      const initial = resetTasksStorage();
      setTasks([...initial]);
    }
  };

  // Export JSON backup
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `HOD_Department_Tasks_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Open Add modal with specified column
  const handleOpenAddModal = (column: ColumnId = 'todo') => {
    setEditingTask(null);
    setModalDefaultColumn(column);
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEditModal = (task: TaskItem) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // Drag and Drop Handlers
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Moving a Task over another Task in a DIFFERENT column
    if (isOverTask) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        const overIndex = prev.findIndex((t) => t.id === overId);

        if (activeIndex === -1 || overIndex === -1) return prev;

        const currentActive = prev[activeIndex];
        const currentOver = prev[overIndex];

        if (currentActive.column !== currentOver.column) {
          const updatedActive: TaskItem = {
            ...currentActive,
            column: currentOver.column,
            completedAt:
              currentOver.column === 'done'
                ? currentActive.completedAt || new Date().toISOString()
                : undefined,
            plannedMonth:
              currentOver.column === 'next_month' && !currentActive.plannedMonth
                ? 'November 2026'
                : currentActive.plannedMonth,
          };

          const newTasks = [...prev];
          newTasks[activeIndex] = updatedActive;
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return prev;
      });
    }

    // Moving a Task over an EMPTY Column container
    if (isOverColumn) {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === activeId);
        if (activeIndex === -1) return prev;

        const currentActive = prev[activeIndex];
        const overColumnId = over.data.current?.columnId as ColumnId;

        if (currentActive.column !== overColumnId) {
          const updatedActive: TaskItem = {
            ...currentActive,
            column: overColumnId,
            completedAt:
              overColumnId === 'done'
                ? currentActive.completedAt || new Date().toISOString()
                : undefined,
            plannedMonth:
              overColumnId === 'next_month' && !currentActive.plannedMonth
                ? 'November 2026'
                : currentActive.plannedMonth,
          };

          const newTasks = [...prev];
          newTasks[activeIndex] = updatedActive;
          return newTasks;
        }

        return prev;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTaskObj = tasks.find((t) => t.id === activeId);
    if (!activeTaskObj) return;

    // Same column reorder or final destination adjustment
    setTasks((prev) => {
      const activeIndex = prev.findIndex((t) => t.id === activeId);
      const overIndex = prev.findIndex((t) => t.id === overId);

      if (activeIndex === -1) return prev;

      let newTasks = [...prev];

      if (overIndex !== -1 && activeIndex !== overIndex) {
        newTasks = arrayMove(newTasks, activeIndex, overIndex);
      }

      // Re-normalize 'order' index per column to ensure consistent sorting
      const columnGroups: Record<ColumnId, TaskItem[]> = {
        todo: [],
        done: [],
        next_month: [],
      };

      newTasks.forEach((t) => {
        columnGroups[t.column].push(t);
      });

      const reindexedTasks: TaskItem[] = [];
      (Object.keys(columnGroups) as ColumnId[]).forEach((colKey) => {
        columnGroups[colKey].forEach((task, idx) => {
          reindexedTasks.push({
            ...task,
            order: idx,
          });
        });
      });

      return reindexedTasks;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Header */}
      <Header
        onOpenAddModal={() => handleOpenAddModal('todo')}
        onResetData={handleResetData}
        onExportData={handleExportData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Metric Summary Cards */}
        <SummaryCards tasks={tasks} />

        {/* Search & Filter Controls */}
        <FilterBar
          filter={filter}
          onChange={setFilter}
          categories={CATEGORIES}
        />

        {/* Mobile View Tab Switcher */}
        <div className="flex md:hidden items-center justify-between bg-white border border-slate-200 rounded-xl p-1 mb-4">
          <button
            onClick={() => setMobileTab('all')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({tasks.length})
          </button>
          <button
            onClick={() => setMobileTab('todo')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'todo'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            To-Do ({todoTasks.length})
          </button>
          <button
            onClick={() => setMobileTab('done')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'done'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Done ({doneTasks.length})
          </button>
          <button
            onClick={() => setMobileTab('next_month')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mobileTab === 'next_month'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Next Month ({nextMonthTasks.length})
          </button>
        </div>

        {/* Dnd Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-start">
            {/* 1. To-Do Column (Blue) */}
            <div className={mobileTab !== 'all' && mobileTab !== 'todo' ? 'hidden md:block' : 'block'}>
              <TaskColumn
                id="todo"
                title="To-Do"
                subtitle="Pending tasks & active priorities"
                theme="blue"
                tasks={todoTasks}
                onOpenAddModal={handleOpenAddModal}
                onEditTask={handleOpenEditModal}
                onDeleteTask={setTaskToDelete}
                onQuickMove={handleQuickMove}
                onOpenDetails={setActiveDetailsTask}
              />
            </div>

            {/* 2. Done Column (Green) */}
            <div className={mobileTab !== 'all' && mobileTab !== 'done' ? 'hidden md:block' : 'block'}>
              <TaskColumn
                id="done"
                title="Done"
                subtitle="Completed departmental responsibilities"
                theme="green"
                tasks={doneTasks}
                onOpenAddModal={handleOpenAddModal}
                onEditTask={handleOpenEditModal}
                onDeleteTask={setTaskToDelete}
                onQuickMove={handleQuickMove}
                onOpenDetails={setActiveDetailsTask}
              />
            </div>

            {/* 3. Plan for Next Month Column (Purple) */}
            <div className={mobileTab !== 'all' && mobileTab !== 'next_month' ? 'hidden md:block' : 'block'}>
              <TaskColumn
                id="next_month"
                title="Plan for Next Month"
                subtitle="Upcoming semester duties & academic goals"
                theme="purple"
                tasks={nextMonthTasks}
                onOpenAddModal={handleOpenAddModal}
                onEditTask={handleOpenEditModal}
                onDeleteTask={setTaskToDelete}
                onQuickMove={handleQuickMove}
                onOpenDetails={setActiveDetailsTask}
              />
            </div>
          </div>

          {/* Active Drag Overlay preview */}
          <DragOverlay>
            {activeTask ? (
              <div className="w-[320px]">
                <TaskCard
                  task={activeTask}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onQuickMove={() => {}}
                  isOverlay
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400">
          College Department Task Management Portal • Computer Science & Engineering
        </div>
      </footer>

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        defaultColumn={modalDefaultColumn}
        categories={CATEGORIES}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!taskToDelete}
        task={taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Notes & Reports Task Details Modal */}
      <TaskDetailsModal
        isOpen={!!activeDetailsTask}
        task={activeDetailsTask}
        onClose={() => setActiveDetailsTask(null)}
        onUpdateTask={handleUpdateTaskDetails}
        onQuickMove={handleQuickMove}
      />
    </div>
  );
};

export default App;
