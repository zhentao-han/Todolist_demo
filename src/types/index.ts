export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: Date;
  projectId: string;
  labels: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export type Priority = 'P1' | 'P2' | 'P3' | 'P4';

export type FilterType = 'all' | 'today' | 'upcoming' | 'completed';

export interface AppState {
  tasks: Task[];
  projects: Project[];
  labels: Label[];
  currentFilter: FilterType;
  selectedProjectId: string | null;
  darkMode: boolean;
}
