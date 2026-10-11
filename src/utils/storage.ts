import { TaskItem } from '../types/task';

const STORAGE_KEY = 'college_hod_tasks_v1';

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Review Course Outcomes (CO) & PO Attainment Reports',
    description: 'Verify attainment calculations submitted by course coordinators for Semester VI before NBA mock audit inspection.',
    column: 'todo',
    priority: 'high',
    category: 'NBA & Accreditation',
    dueDate: '2026-10-15',
    createdAt: '2026-10-08T09:00:00.000Z',
    order: 0,
    notes: '• Target threshold set to 60% for direct assessment.\n• Dr. Sharma and Prof. Verma requested an extension until Tuesday for elective subjects.',
    notesUpdatedAt: '2026-10-10T14:30:00.000Z',
    attachments: [
      {
        id: 'att-101',
        name: 'NBA_Criterion_3_Attainment_Guidelines.pdf',
        size: 348160,
        type: 'application/pdf',
        uploadedAt: '2026-10-08T10:15:00.000Z',
      },
    ],
  },
  {
    id: 'task-2',
    title: 'Faculty Workload Allocation & Subject Preferences',
    description: 'Map senior professors and assistant professors to upcoming semester core subjects and elective labs.',
    column: 'todo',
    priority: 'high',
    category: 'Faculty & Staff',
    dueDate: '2026-10-18',
    createdAt: '2026-10-09T11:30:00.000Z',
    order: 1,
    notes: 'Max 16 hours/week for Assistant Professors, 12 hours for Associate Professors/Professors. Allocate AI Lab to 3 faculty teams.',
    notesUpdatedAt: '2026-10-10T11:00:00.000Z',
    attachments: [],
  },
  {
    id: 'task-3',
    title: 'Approve Lab Hardware Procurement Quotations',
    description: 'Scrutinize vendor proposals for 30 high-end GPU workstations for the new AI/ML specialization lab.',
    column: 'todo',
    priority: 'medium',
    category: 'Labs & Research',
    dueDate: '2026-10-22',
    createdAt: '2026-10-10T14:15:00.000Z',
    order: 2,
    notes: 'Received comparative comparative statement from Purchase Department. Vendor B offers 3-year onsite warranty.',
    notesUpdatedAt: '2026-10-11T12:00:00.000Z',
    attachments: [
      {
        id: 'att-102',
        name: 'GPU_Workstation_Vendor_Quotations.xlsx',
        size: 154620,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        uploadedAt: '2026-10-10T15:00:00.000Z',
      },
    ],
  },
  {
    id: 'task-4',
    title: 'Departmental Advisory Board (DAB) Meeting Agenda',
    description: 'Draft discussion points with industry experts regarding syllabus updates and internship tie-ups.',
    column: 'todo',
    priority: 'low',
    category: 'Academics',
    dueDate: '2026-10-25',
    createdAt: '2026-10-11T08:20:00.000Z',
    order: 3,
    attachments: [],
  },
  {
    id: 'task-5',
    title: 'Finalize Mid-Term Exam Question Papers & Rubrics',
    description: 'All 3 sets of moderated question papers sealed and submitted to Examination Controller cell.',
    column: 'done',
    priority: 'high',
    category: 'Exams & Evaluations',
    dueDate: '2026-10-05',
    createdAt: '2026-10-01T10:00:00.000Z',
    completedAt: '2026-10-06T16:45:00.000Z',
    order: 0,
    notes: 'Question paper moderation completed by Department Scrutiny Committee on Oct 4th. Quality check passed for all 6 semesters.',
    notesUpdatedAt: '2026-10-06T14:00:00.000Z',
    eventReport: `### 1. Activity Overview
The Departmental Exam Moderation Committee convened on October 4, 2026, to moderate mid-semester exam questions across 18 undergraduate courses.

### 2. Outcomes & Observations
• All question papers aligned with Revised Bloom's Taxonomy (RBT) Levels L1 through L5.
• 100% of course outcomes (COs) mapped to respective questions.
• Rubrics for coding assignments verified and dispatched to Controller of Examinations.

### 3. Action Items Completed
• 3 distinct sets per subject generated, encrypted, and physically sealed.
• Examination guidelines communicated to invigilator faculty squad.`,
    reportUpdatedAt: '2026-10-06T16:40:00.000Z',
    attachments: [
      {
        id: 'att-103',
        name: 'Moderation_Committee_Minutes_Signed.pdf',
        size: 512000,
        type: 'application/pdf',
        uploadedAt: '2026-10-06T16:30:00.000Z',
      },
    ],
  },
  {
    id: 'task-6',
    title: 'Monthly Department Faculty Meeting & Attendance Audit',
    description: 'Reviewed student attendance shortage cases and dispatched warning notices to guardians.',
    column: 'done',
    priority: 'medium',
    category: 'Administration',
    dueDate: '2026-10-07',
    createdAt: '2026-10-02T13:00:00.000Z',
    completedAt: '2026-10-07T17:30:00.000Z',
    order: 1,
    notes: 'Reviewed attendance reports for September. 24 students identified below 75% attendance threshold. Class teachers assigned to counsel them.',
    notesUpdatedAt: '2026-10-07T16:15:00.000Z',
    attachments: [],
  },
  {
    id: 'task-7',
    title: 'Submit Departmental Annual Budget Plan to Principal',
    description: 'Compile annual CAPEX and OPEX estimates including faculty development conference funds.',
    column: 'next_month',
    priority: 'high',
    category: 'Administration',
    plannedMonth: 'November 2026',
    dueDate: '2026-11-10',
    createdAt: '2026-10-10T16:00:00.000Z',
    order: 0,
    notes: 'Requested laboratory modernization fund of Rs. 15 Lakhs and student hackathon support grant.',
    notesUpdatedAt: '2026-10-11T15:20:00.000Z',
    attachments: [],
  },
  {
    id: 'task-8',
    title: 'Organize National Symposium on Generative AI',
    description: 'Coordinate with IEEE Student Chapter committee, book auditorium, and confirm keynote speakers.',
    column: 'next_month',
    priority: 'medium',
    category: 'Student Affairs',
    plannedMonth: 'November 2026',
    dueDate: '2026-11-20',
    createdAt: '2026-10-11T09:45:00.000Z',
    order: 1,
    notes: '• Invited Dr. K. Ramanathan (IIT Madras) as Keynote Speaker.\n• Budget approved by Finance Committee for conference kits and certificates.',
    notesUpdatedAt: '2026-10-11T17:00:00.000Z',
    attachments: [
      {
        id: 'att-104',
        name: 'Symposium_Schedule_Draft.docx',
        size: 89400,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploadedAt: '2026-10-11T16:45:00.000Z',
      },
    ],
  },
  {
    id: 'task-9',
    title: 'External Academic Audit by University Inspection Panel',
    description: 'Compile course files, lab logbooks, and mentor-mentee records for peer review visit.',
    column: 'next_month',
    priority: 'high',
    category: 'NBA & Accreditation',
    plannedMonth: 'November 2026',
    dueDate: '2026-11-26',
    createdAt: '2026-10-11T12:00:00.000Z',
    order: 2,
    attachments: [],
  },
];

export function loadTasksFromStorage(): TaskItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveTasksToStorage(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Ensure all tasks have backward-compatible structure
      return parsed.map((item: TaskItem) => ({
        ...item,
        attachments: Array.isArray(item.attachments) ? item.attachments : [],
      }));
    }
    return INITIAL_TASKS;
  } catch (e) {
    console.error('Error loading tasks from localStorage, falling back to initial data', e);
    return INITIAL_TASKS;
  }
}

export function saveTasksToStorage(tasks: TaskItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks to localStorage', e);
  }
}

export function resetTasksStorage(): TaskItem[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TASKS));
    return INITIAL_TASKS;
  } catch (e) {
    console.error('Error resetting tasks', e);
    return INITIAL_TASKS;
  }
}
