import React, { useState } from 'react';
import { Task } from '../../types';
import { useTaskStore } from '../../stores/taskStore';
import { Calendar, Flag, MoreHorizontal, X, Edit2, Check } from 'lucide-react';
import { TaskOptionsDropdown } from './TaskOptionsDropdown';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const { updateTask, deleteTask, toggleTask } = useTaskStore();

  const handleSave = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      updateTask(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'text-red-500';
      case 'P2': return 'text-orange-500';
      case 'P3': return 'text-yellow-500';
      case 'P4': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getTimeLeft = (dueDate: Date) => {
    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    
    if (diff <= 0) return 'Overdue';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days > 0) return `${days}d left`;
    if (hours > 0) return `${hours}h left`;
    return `${minutes}m left`;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const isOverdue = task.dueDate && task.dueDate < new Date() && !task.completed;

  return (
    <div className={`task-item ${task.completed ? 'opacity-60' : ''}`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task.id)}
        className="task-checkbox"
      />
      
      <div className="flex-1">
        {isEditing ? (
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="task-input flex-1 border-b border-primary-500 focus:ring-0 px-0"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="p-1 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded transition-colors"
              title="Save"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setEditTitle(task.title);
                setIsEditing(false);
              }}
              className="p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => !task.completed && setIsEditing(true)}
            className={`cursor-pointer group flex items-center gap-2 ${
              task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
            }`}
          >
            <span>{task.title}</span>
            {!task.completed && (
              <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-gray-400 transition-opacity" />
            )}
          </div>
        )}
        
        <div className="flex items-center gap-4 mt-1">
          {task.dueDate && (
            <div className="flex flex-col gap-0.5">
              <div className={`flex items-center gap-1 text-xs ${
                isOverdue ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'
              }`}>
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
                {task.dueDate.getHours() !== 0 || task.dueDate.getMinutes() !== 0 ? 
                  ` at ${String(task.dueDate.getHours()).padStart(2, '0')}:${String(task.dueDate.getMinutes()).padStart(2, '0')}` : ''}
              </div>
              {!task.completed && (
                <div className={`text-[10px] font-medium ${isOverdue ? 'text-red-400' : 'text-gray-400'}`}>
                  {getTimeLeft(task.dueDate)}
                </div>
              )}
            </div>
          )}
          
          <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
        </div>
      </div>
      
      <div className="flex items-center gap-2 relative">
        <button
          onClick={() => deleteTask(task.id)}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors opacity-0 hover:opacity-100"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setShowOptions(!showOptions);
          }}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        <TaskOptionsDropdown
          task={task}
          isOpen={showOptions}
          onClose={() => setShowOptions(false)}
        />
      </div>
    </div>
  );
};
