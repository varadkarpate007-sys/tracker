import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  FileText,
  StickyNote,
  Paperclip,
  Info,
  Calendar,
  Clock,
  CheckCircle2,
  Tag,
  ArrowRight,
  Upload,
  Download,
  Trash2,
  File,
  FileCode,
  Image as ImageIcon,
  FileSpreadsheet,
  Check,
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Eye,
  Edit3,
  Sparkles,
} from 'lucide-react';
import { TaskItem, ColumnId, TaskAttachment } from '../types/task';
import {
  saveAttachmentFile,
  deleteAttachmentFile,
  downloadAttachment,
} from '../utils/attachmentStorage';

interface TaskDetailsModalProps {
  isOpen: boolean;
  task: TaskItem | null;
  onClose: () => void;
  onUpdateTask: (updatedTask: TaskItem) => void;
  onQuickMove: (taskId: string, targetColumn: ColumnId) => void;
}

type TabType = 'overview' | 'notes' | 'report' | 'attachments';

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  isOpen,
  task,
  onClose,
  onUpdateTask,
  onQuickMove,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Notes state
  const [notesText, setNotesText] = useState('');
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  // Event report state
  const [reportText, setReportText] = useState('');
  const [reportViewMode, setReportViewMode] = useState<'edit' | 'preview'>('edit');
  const [reportSavedSuccess, setReportSavedSuccess] = useState(false);

  // Attachments state
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when task changes
  useEffect(() => {
    if (task) {
      setNotesText(task.notes || '');
      setReportText(task.eventReport || '');
      setAttachments(task.attachments || []);
      setNotesSavedSuccess(false);
      setReportSavedSuccess(false);
      // Auto open report preview if report already exists and opening report tab
      if (task.eventReport) {
        setReportViewMode('preview');
      } else {
        setReportViewMode('edit');
      }
    }
  }, [task]);

  if (!isOpen || !task) return null;

  // Save Notes handler
  const handleSaveNotes = () => {
    const updated: TaskItem = {
      ...task,
      notes: notesText.trim() || undefined,
      notesUpdatedAt: new Date().toISOString(),
    };
    onUpdateTask(updated);
    setNotesSavedSuccess(true);
    setTimeout(() => setNotesSavedSuccess(false), 2500);
  };

  // Save Event Report handler
  const handleSaveReport = () => {
    const updated: TaskItem = {
      ...task,
      eventReport: reportText.trim() || undefined,
      reportUpdatedAt: new Date().toISOString(),
    };
    onUpdateTask(updated);
    setReportSavedSuccess(true);
    setReportViewMode('preview');
    setTimeout(() => setReportSavedSuccess(false), 2500);
  };

  // Insert Standard College Event Report Template
  const handleInsertReportTemplate = () => {
    const template = `### 1. Event Overview & Objectives
• Title: ${task.title}
• Organizing Department: Computer Science & Engineering
• Objectives: To foster hands-on learning, discuss academic goals, and evaluate outcomes.

### 2. Schedule & Key Activities
• Session 1: Formal inauguration, key highlights, and address by HOD.
• Session 2: Technical workshop / deliberation & deliberations.
• Session 3: Interactive Q&A, student & faculty discussions.

### 3. Key Coordinators & Resource Persons
• Chief Coordinator: Head of Department
• Faculty In-Charge: Department Event Cell Committee

### 4. Participation & Demographics
• Total Registered Participants: 
• Faculty Members Attended: 

### 5. Learning Outcomes & Key Achievements
• All planned agenda points successfully addressed.
• Student & faculty feedback recorded as overwhelmingly positive.
• Documentation completed for NBA / NAAC compliance.

### 6. Recommendations & Next Steps
• Plan follow-up session in the upcoming semester.
• Dispatch appreciation certificates and compile archival documentation.`;

    setReportText(template);
    setReportViewMode('edit');
  };

  // Format toolbar helper for report markdown
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('report-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = `${prefix}${selected || 'text'}${suffix}`;

    const newContent =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);

    setReportText(newContent);
  };

  // Attachment upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newAttachments: TaskAttachment[] = [...attachments];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const attachmentId = `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

        // Save binary file into IndexedDB
        await saveAttachmentFile(attachmentId, file);

        newAttachments.push({
          id: attachmentId,
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          uploadedAt: new Date().toISOString(),
        });
      }

      setAttachments(newAttachments);

      // Update parent task
      const updated: TaskItem = {
        ...task,
        attachments: newAttachments,
      };
      onUpdateTask(updated);
    } catch (err) {
      console.error('Failed to upload file to IndexedDB', err);
      alert('File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Delete attachment handler
  const handleDeleteAttachment = async (attachmentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await deleteAttachmentFile(attachmentId);
      const filtered = attachments.filter((a) => a.id !== attachmentId);
      setAttachments(filtered);

      const updated: TaskItem = {
        ...task,
        attachments: filtered,
      };
      onUpdateTask(updated);
    } catch (err) {
      console.error('Failed to delete attachment', err);
    }
  };

  // Helper: File Icon based on MIME type or extension
  const getFileIcon = (filename: string, mime: string) => {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.pdf') || mime.includes('pdf')) {
      return <FileText className="w-5 h-5 text-rose-500" />;
    }
    if (lower.endsWith('.doc') || lower.endsWith('.docx') || mime.includes('word')) {
      return <FileCode className="w-5 h-5 text-blue-500" />;
    }
    if (lower.endsWith('.xls') || lower.endsWith('.xlsx') || mime.includes('sheet')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500" />;
    }
    if (
      lower.endsWith('.png') ||
      lower.endsWith('.jpg') ||
      lower.endsWith('.jpeg') ||
      mime.includes('image')
    ) {
      return <ImageIcon className="w-5 h-5 text-amber-500" />;
    }
    return <File className="w-5 h-5 text-slate-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return null;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoString));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-5">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10 flex flex-col max-h-[92vh]">
          {/* Top Header Bar */}
          <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5 overflow-hidden pr-3">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="truncate">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                    {task.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="capitalize font-semibold text-slate-600">
                    {task.column.replace('_', ' ')}
                  </span>
                  <span>•</span>
                  <span>{task.category}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors shrink-0"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation Navigation */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 gap-1 sm:gap-2 overflow-x-auto text-xs sm:text-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-1.5 py-3 px-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Info className="w-4 h-4" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-1.5 py-3 px-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'notes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <StickyNote className="w-4 h-4" />
              <span>Notes</span>
              {task.notes && (
                <span className="w-2 h-2 rounded-full bg-blue-500 ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-1.5 py-3 px-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'report'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Event Report</span>
              {task.eventReport && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('attachments')}
              className={`flex items-center gap-1.5 py-3 px-3 font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === 'attachments'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Paperclip className="w-4 h-4" />
              <span>Attachments</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-bold ml-0.5">
                {attachments.length}
              </span>
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Task Description & Scope
                  </h4>
                  <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200/80 leading-relaxed">
                    {task.description || 'No detailed description provided for this task.'}
                  </p>
                </div>

                {/* Key Attributes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Current Column
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold capitalize bg-white border border-slate-200 text-slate-800">
                      {task.column.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Priority Level
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold capitalize ${
                        task.priority === 'high'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : task.priority === 'medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {task.priority} Priority
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Department Domain
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                      <Tag className="w-3 h-3 text-slate-400" />
                      {task.category}
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                      Target Schedule
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {task.column === 'next_month'
                        ? task.plannedMonth || 'Next Month'
                        : task.dueDate || 'No deadline'}
                    </span>
                  </div>
                </div>

                {/* Quick Column Transfer Actions */}
                <div className="bg-white p-4 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Quick Transfer to Column:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => onQuickMove(task.id, 'todo')}
                      disabled={task.column === 'todo'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        task.column === 'todo'
                          ? 'bg-blue-600 text-white border-blue-600 opacity-60 cursor-default'
                          : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      Move to To-Do
                    </button>
                    <button
                      onClick={() => onQuickMove(task.id, 'done')}
                      disabled={task.column === 'done'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        task.column === 'done'
                          ? 'bg-emerald-600 text-white border-emerald-600 opacity-60 cursor-default'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      Mark as Done
                    </button>
                    <button
                      onClick={() => onQuickMove(task.id, 'next_month')}
                      disabled={task.column === 'next_month'}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        task.column === 'next_month'
                          ? 'bg-purple-600 text-white border-purple-600 opacity-60 cursor-default'
                          : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                      }`}
                    >
                      Move to Next Month
                    </button>
                  </div>
                </div>

                {/* Documentation Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div
                    onClick={() => setActiveTab('notes')}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/40 hover:border-blue-200 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <StickyNote className="w-4 h-4 text-blue-600" />
                        Meeting Notes & Updates
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {task.notes || 'No general notes written yet. Click to add.'}
                    </p>
                    {task.notesUpdatedAt && (
                      <span className="text-[10px] text-slate-400 mt-2 block">
                        Updated {formatDate(task.notesUpdatedAt)}
                      </span>
                    )}
                  </div>

                  <div
                    onClick={() => setActiveTab('report')}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-emerald-50/40 hover:border-emerald-200 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        Post-Event Formal Report
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {task.eventReport || 'No event report compiled yet. Click to draft.'}
                    </p>
                    {task.reportUpdatedAt && (
                      <span className="text-[10px] text-slate-400 mt-2 block">
                        Updated {formatDate(task.reportUpdatedAt)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div className="border-t border-slate-100 pt-3 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Created: {formatDate(task.createdAt)}</span>
                  {task.completedAt && (
                    <span className="text-emerald-600 font-medium">
                      Completed: {formatDate(task.completedAt)}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: GENERAL NOTES */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Task Notes & Instructions
                    </h3>
                    <p className="text-xs text-slate-500">
                      Record faculty directives, ongoing updates, and meeting discussions.
                    </p>
                  </div>
                  {task.notesUpdatedAt && (
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last saved: {formatDate(task.notesUpdatedAt)}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <textarea
                    value={notesText}
                    onChange={(e) => setNotesText(e.target.value)}
                    rows={10}
                    placeholder="Type general notes, committee discussions, follow-up points, or observations here..."
                    className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400 resize-y font-normal leading-relaxed"
                  />
                  <div className="text-[11px] text-slate-400 text-right mt-1">
                    {notesText.length} characters
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    {notesSavedSuccess && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        Notes saved successfully!
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSaveNotes}
                    className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Notes</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: EVENT REPORT */}
            {activeTab === 'report' && (
              <div className="space-y-4">
                {/* Header & Mode Switcher */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Department Event Report
                    </h3>
                    <p className="text-xs text-slate-500">
                      Comprehensive report covering objectives, activities conducted, outcomes, and achievements.
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setReportViewMode('edit')}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        reportViewMode === 'edit'
                          ? 'bg-white text-slate-800 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setReportViewMode('preview')}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        reportViewMode === 'preview'
                          ? 'bg-white text-emerald-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Formatted Preview</span>
                    </button>
                  </div>
                </div>

                {/* Editor View */}
                {reportViewMode === 'edit' ? (
                  <div className="space-y-2">
                    {/* Formatting Toolbar */}
                    <div className="flex items-center justify-between gap-1 flex-wrap bg-slate-100/90 border border-slate-200 p-1.5 rounded-xl text-xs">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => insertFormatting('### ', '\n')}
                          title="Add Heading"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
                        >
                          <Heading className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('**', '**')}
                          title="Bold Text"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
                        >
                          <Bold className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('*', '*')}
                          title="Italic Text"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
                        >
                          <Italic className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('• ', '\n')}
                          title="Bullet Point"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
                        >
                          <List className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFormatting('1. ', '\n')}
                          title="Numbered List"
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded transition-colors"
                        >
                          <ListOrdered className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Insert Template Button */}
                      <button
                        type="button"
                        onClick={handleInsertReportTemplate}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>Insert College Report Template</span>
                      </button>
                    </div>

                    <textarea
                      id="report-textarea"
                      value={reportText}
                      onChange={(e) => setReportText(e.target.value)}
                      rows={12}
                      placeholder="Write your event report here, or click 'Insert College Report Template' to load standard headings..."
                      className="w-full p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder:text-slate-400 font-mono text-xs leading-relaxed resize-y"
                    />
                  </div>
                ) : (
                  /* Formatted Preview View */
                  <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-5 min-h-[260px] max-h-[380px] overflow-y-auto">
                    {reportText.trim() ? (
                      <div className="prose prose-sm max-w-none text-slate-800 space-y-3">
                        {reportText.split('\n\n').map((block, idx) => {
                          if (block.startsWith('### ')) {
                            return (
                              <h4
                                key={idx}
                                className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-1 mt-4 mb-2"
                              >
                                {block.replace('### ', '')}
                              </h4>
                            );
                          }
                          if (block.startsWith('• ') || block.startsWith('- ')) {
                            return (
                              <ul key={idx} className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                                {block.split('\n').map((line, lIdx) => (
                                  <li key={lIdx}>{line.replace(/^[•\-]\s*/, '')}</li>
                                ))}
                              </ul>
                            );
                          }
                          return (
                            <p key={idx} className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                              {block}
                            </p>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center">
                        <FileText className="w-10 h-10 text-slate-300 mb-2" />
                        <p className="text-xs font-semibold text-slate-600">
                          No event report written yet
                        </p>
                        <p className="text-[11px] text-slate-400 max-w-sm mt-0.5">
                          Switch to the Edit mode and click "Insert College Report Template" to compose the official report.
                        </p>
                        <button
                          onClick={() => setReportViewMode('edit')}
                          className="mt-3 text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs"
                        >
                          Start Drafting Report
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Save & Notification */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    {reportSavedSuccess && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <Check className="w-3.5 h-3.5" />
                        Report saved successfully!
                      </span>
                    )}
                    {task.reportUpdatedAt && (
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        Last saved: {formatDate(task.reportUpdatedAt)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleSaveReport}
                    className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Report</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: ATTACHMENTS */}
            {activeTab === 'attachments' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      Supporting Documents & Media
                    </h3>
                    <p className="text-xs text-slate-500">
                      Upload meeting minutes, official circulars, approval forms, photos, or syllabus rubrics.
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    multiple
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                  </button>
                </div>

                {/* Upload Drag & Drop Area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-2xl p-6 text-center cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Click to browse or drop documents here
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Supports PDF, Word (.docx), Excel (.xlsx), Images (.png, .jpg), and Text files (Stored securely in local database).
                  </p>
                </div>

                {/* Attachments List */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Attached Files ({attachments.length})
                  </h4>

                  {attachments.length > 0 ? (
                    <div className="space-y-2">
                      {attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-center gap-3 overflow-hidden pr-2">
                            <div className="p-2 rounded-lg bg-slate-100 shrink-0">
                              {getFileIcon(att.name, att.type)}
                            </div>
                            <div className="truncate">
                              <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate block">
                                {att.name}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                <span>{formatFileSize(att.size)}</span>
                                <span>•</span>
                                <span>Uploaded {formatDate(att.uploadedAt)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => downloadAttachment(att)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Download document"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAttachment(att.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete document"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-slate-200">
                      <Paperclip className="w-8 h-8 text-slate-300 mx-auto mb-1.5" />
                      <p className="text-xs font-medium text-slate-500">
                        No files attached to this task yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
