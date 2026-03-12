import { useState, useEffect } from 'react';
import { useTaskStore } from './stores/taskStore';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { TaskList } from './components/Task/TaskList';
import { AddTaskForm } from './components/Task/AddTaskForm';
import { useHotkeys } from 'react-hotkeys-hook';
import { Plus } from 'lucide-react';

function App() {
  const { darkMode, toggleDarkMode, selectedProjectId, projects, setFilter, setSelectedProject, currentFilter } = useTaskStore();
  const [showAddTask, setShowAddTask] = useState(false);

  useHotkeys('q', (e) => {
    e.preventDefault();
    setShowAddTask(prev => !prev);
  });

  useHotkeys('g i', (e) => {
    e.preventDefault();
    setFilter('all');
    setSelectedProject(null);
  });

  useHotkeys('g t', (e) => {
    e.preventDefault();
    setFilter('today');
    setSelectedProject(null);
  });

  useHotkeys('g u', (e) => {
    e.preventDefault();
    setFilter('upcoming');
    setSelectedProject(null);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const selectedProject = projects.find((p: any) => p.id === selectedProjectId);
  const title = selectedProject ? selectedProject.name : (currentFilter === 'today' ? 'Today' : currentFilter === 'upcoming' ? 'Upcoming' : currentFilter === 'completed' ? 'Completed' : 'All Tasks');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header onToggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {selectedProject && (
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: selectedProject.color }}
                      />
                    )}
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {title}
                    </h1>
                  </div>
                  <button
                    onClick={() => setShowAddTask(true)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-primary-600 transition-colors"
                    title="Add task (Q)"
                  >
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
                {(showAddTask || (selectedProjectId === null && currentFilter === 'all')) && (
                  <AddTaskForm onCancel={() => setShowAddTask(false)} />
                )}
                <TaskList />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
