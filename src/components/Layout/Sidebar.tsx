import React, { useState } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { Calendar, CheckCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import { CreateProjectModal } from '../Project/CreateProjectModal';

export const Sidebar: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<{id: string, name: string, color: string} | null>(null);
  const { projects, currentFilter, setFilter, selectedProjectId, setSelectedProject, deleteProject } = useTaskStore();

  const menuItems = [
    { id: 'today', label: 'Today', icon: Calendar, filter: 'today' as const },
    { id: 'upcoming', label: 'Upcoming', icon: Calendar, filter: 'upcoming' as const },
    { id: 'completed', label: 'Completed', icon: CheckCircle, filter: 'completed' as const },
  ];

  return (
    <>
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentFilter === item.filter && !selectedProjectId;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setFilter(item.filter);
                  setSelectedProject(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Projects
            </h3>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Add Project"
            >
              <Plus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
          
          <nav className="space-y-1">
            {projects.map((project) => {
              const isActive = selectedProjectId === project.id;
              
              return (
                <div key={project.id} className="group relative">
                  <button
                    onClick={() => {
                      setSelectedProject(project.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-sm font-medium truncate pr-8">{project.name}</span>
                  </button>
                  
                  {project.id !== 'inbox' && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-inherit">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingProject({ id: project.id, name: project.name, color: project.color });
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-500"
                        title="Edit Project"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete project "${project.name}" and all its tasks?`)) {
                            deleteProject(project.id);
                          }
                        }}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-gray-500 hover:text-red-600"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      <CreateProjectModal
        isOpen={isCreateModalOpen || !!editingProject}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingProject(null);
        }}
        initialData={editingProject || undefined}
      />
    </>
  );
};
