import React, { useState } from 'react';
import { useTaskStore } from '../../stores/taskStore';
import { Moon, Sun, Share2, Check } from 'lucide-react';

interface HeaderProps {
  onToggleDarkMode: () => void;
  darkMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onToggleDarkMode, darkMode }) => {
  const [copied, setCopied] = useState(false);
  const { tasks, projects } = useTaskStore();

  const handleShare = () => {
    const data = {
      tasks,
      projects,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todoist-tasks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Todoist Clone
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            title="Export tasks as JSON"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-green-500">Exported!</span>
              </>
            ) : (
              <>
                <Share2 className="w-5 h-5" />
                <span className="text-sm font-medium">Export</span>
              </>
            )}
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1" />

          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
