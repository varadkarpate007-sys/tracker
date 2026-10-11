export type Priority = 'low' | 'medium' | 'high';

export type ColumnId = 'todo' | 'done' | 'next_month';

export type Category = 
  | 'Academics'
  | 'Faculty & Staff'
  | 'Exams & Evaluations'
  | 'NBA & Accreditation'
  | 'Administration'
  | 'Student Affairs'
  | 'Labs & Research';

export interface TaskAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  column: ColumnId;
  priority: Priority;
  category: Category;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
  plannedMonth?: string; // For 'next_month' column tasks, e.g., "November 2026"
  order: number;
  // Notes & Reports extensions
  notes?: string;
  notesUpdatedAt?: string;
  eventReport?: string;
  reportUpdatedAt?: string;
  attachments?: TaskAttachment[];
}

export interface ColumnDefinition {
  id: ColumnId;
  title: string;
  theme: 'blue' | 'green' | 'purple';
  icon: string;
  emptyMessage: string;
}

export interface TaskFilter {
  search: string;
  priority: Priority | 'all';
  category: Category | 'all';
}
