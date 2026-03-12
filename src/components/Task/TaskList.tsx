import React from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { TaskItem } from './TaskItem';

export const TaskList: React.FC = () => {
  const getFilteredTasks = useTaskStore((state) => state.getFilteredTasks);
  const tasks = getFilteredTasks();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No tasks yet. Add one above to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
};
