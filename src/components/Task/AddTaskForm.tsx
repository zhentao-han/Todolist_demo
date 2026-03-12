import React, { useState } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { Plus, ChevronDown, Flag } from 'lucide-react';
import { DatePicker } from '../UI/DatePicker';
import { Priority } from '../../types';

interface AddTaskFormProps {
  onCancel?: () => void;
}

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: 'P1', label: 'Priority 1', color: 'text-red-500' },
  { value: 'P2', label: 'Priority 2', color: 'text-orange-500' },
  { value: 'P3', label: 'Priority 3', color: 'text-yellow-500' },
  { value: 'P4', label: 'Priority 4', color: 'text-gray-400' },
];

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onCancel }) => {
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('inbox');
  const [priority, setPriority] = useState<Priority>('P4');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const { addTask, projects } = useTaskStore();

  const handleCancel = () => {
    setTitle('');
    setIsExpanded(false);
    setSelectedProjectId('inbox');
    setPriority('P4');
    setDueDate(undefined);
    if (onCancel) onCancel();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTask({
        title: title.trim(),
        completed: false,
        priority,
        projectId: selectedProjectId,
        labels: [],
        dueDate,
      });
      handleCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <Plus className="w-5 h-5" />
          </button>
          
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="Add a task..."
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedProject?.color }}
            />
            <span>{selectedProject?.name}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        
        {isExpanded && (
          <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 animate-slide-down">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setSelectedProjectId(project.id)}
                      className={`flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                        selectedProjectId === project.id
                          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <span className="text-sm font-medium">{project.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <div className="flex items-center gap-2">
                  {priorityOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPriority(opt.value)}
                      className={`flex flex-1 items-center justify-center gap-2 p-2 rounded-lg border transition-all ${
                        priority === opt.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                      title={opt.label}
                    >
                      <Flag className={`w-4 h-4 ${opt.color}`} />
                      <span className="text-xs font-medium">{opt.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date
                </label>
                <DatePicker value={dueDate} onChange={setDueDate} />
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="btn-primary text-sm"
                >
                  Add task
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
