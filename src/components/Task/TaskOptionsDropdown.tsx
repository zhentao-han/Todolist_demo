import React, { useState } from 'react';
import { Task, Priority } from '../../types';
import { useTaskStore } from '../../stores/taskStore';
import { Calendar, Flag, Trash2 } from 'lucide-react';
import { DatePicker } from '../UI/DatePicker';

interface TaskOptionsDropdownProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'P1', label: 'Priority 1', color: 'text-red-500' },
  { value: 'P2', label: 'Priority 2', color: 'text-orange-500' },
  { value: 'P3', label: 'Priority 3', color: 'text-yellow-500' },
  { value: 'P4', label: 'Priority 4', color: 'text-gray-400' },
];

export const TaskOptionsDropdown: React.FC<TaskOptionsDropdownProps> = ({ 
  task, 
  isOpen, 
  onClose 
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { updateTask, deleteTask, projects } = useTaskStore();

  const handlePriorityChange = (priority: Priority) => {
    updateTask(task.id, { priority });
    onClose();
  };

  const handleDateChange = (date: Date | undefined) => {
    updateTask(task.id, { dueDate: date });
    setShowDatePicker(false);
    onClose();
  };

  const handleProjectChange = (projectId: string) => {
    updateTask(task.id, { projectId });
    onClose();
  };

  const handleDelete = () => {
    deleteTask(task.id);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute top-full right-0 mt-1 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg animate-slide-down z-50">
        <div className="p-2">
          {/* Priority Section */}
          <div className="mb-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Priority
            </div>
            {priorities.map((priority) => (
              <button
                key={priority.value}
                onClick={() => handlePriorityChange(priority.value)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  task.priority === priority.value ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <Flag className={`w-4 h-4 ${priority.color}`} />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {priority.label}
                </span>
              </button>
            ))}
          </div>

          {/* Due Date Section */}
          <div className="mb-2">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {task.dueDate ? 'Change Due Date' : 'Set Due Date'}
              </span>
            </button>
            
            {showDatePicker && (
              <div className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                <DatePicker 
                  value={task.dueDate} 
                  onChange={handleDateChange}
                />
              </div>
            )}
          </div>

          {/* Move to Project Section */}
          <div className="mb-2">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Move to Project
            </div>
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectChange(project.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  task.projectId === project.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {project.name}
                </span>
              </button>
            ))}
          </div>

          {/* Delete Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">Delete Task</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
