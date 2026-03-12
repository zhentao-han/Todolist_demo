import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, Project, Label, Priority, FilterType } from '../types';

interface TaskStore {
  tasks: Task[];
  projects: Project[];
  labels: Label[];
  currentFilter: FilterType;
  selectedProjectId: string | null;
  darkMode: boolean;

  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
  
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  addLabel: (label: Omit<Label, 'id'>) => void;
  updateLabel: (id: string, updates: Partial<Label>) => void;
  deleteLabel: (id: string) => void;
  
  setFilter: (filter: FilterType) => void;
  setSelectedProject: (projectId: string | null) => void;
  toggleDarkMode: () => void;
  
  // Getters
  getFilteredTasks: () => Task[];
  getTasksByProject: (projectId: string) => Task[];
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      projects: [
        { id: 'inbox', name: 'Inbox', color: '#3b82f6', createdAt: new Date(), updatedAt: new Date() },
        { id: 'personal', name: 'Personal', color: '#10b981', createdAt: new Date(), updatedAt: new Date() },
        { id: 'work', name: 'Work', color: '#f59e0b', createdAt: new Date(), updatedAt: new Date() },
      ],
      labels: [],
      currentFilter: 'all',
      selectedProjectId: null,
      darkMode: false,

      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      toggleTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, completed: !task.completed, updatedAt: new Date() }
              : task
          ),
        }));
      },

      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ projects: [...state.projects, newProject] }));
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id
              ? { ...project, ...updates, updatedAt: new Date() }
              : project
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
          tasks: state.tasks.filter((task) => task.projectId !== id),
        }));
      },

      addLabel: (labelData) => {
        const newLabel: Label = {
          ...labelData,
          id: Date.now().toString(),
        };
        set((state) => ({ labels: [...state.labels, newLabel] }));
      },

      updateLabel: (id, updates) => {
        set((state) => ({
          labels: state.labels.map((label) =>
            label.id === id ? { ...label, ...updates } : label
          ),
        }));
      },

      deleteLabel: (id) => {
        set((state) => ({
          labels: state.labels.filter((label) => label.id !== id),
          tasks: state.tasks.map((task) => ({
            ...task,
            labels: task.labels.filter((labelId) => labelId !== id),
          })),
        }));
      },

      setFilter: (filter) => set({ currentFilter: filter }),
      setSelectedProject: (projectId) => set({ selectedProjectId: projectId }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      getFilteredTasks: () => {
        const { tasks, currentFilter, selectedProjectId } = get();
        let filtered = tasks;

        // First filter by project if one is selected
        if (selectedProjectId) {
          filtered = filtered.filter((task) => task.projectId === selectedProjectId);
        }

        // Then apply current filter logic
        switch (currentFilter) {
          case 'today':
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
            filtered = filtered.filter(
              (task) => task.dueDate && task.dueDate >= today && task.dueDate < tomorrow
            );
            break;
          case 'upcoming':
            const now = new Date();
            filtered = filtered.filter(
              (task) => task.dueDate && task.dueDate > now
            );
            break;
          case 'completed':
            filtered = filtered.filter((task) => task.completed);
            break;
          case 'all':
          default:
            // For 'all' filter, don't filter by completion status
            // Just show all tasks for the selected project or all projects
            break;
        }

        return filtered.sort((a, b) => {
          if (a.completed !== b.completed) return a.completed ? 1 : -1;
          const priorityOrder = { P1: 0, P2: 1, P3: 2, P4: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
      },

      getTasksByProject: (projectId) => {
        return get().tasks.filter((task) => task.projectId === projectId);
      },
    }),
    {
      name: 'todoist-clone-storage',
    }
  )
);
