import { useState, useMemo } from 'react';
import { Plus, Search, Filter, BarChart3, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Task, TaskFilter } from '@/types/task';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { TaskStats } from './TaskStats';
import { FilterDropdown } from './FilterDropdown';

const TaskManager = () => {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply filter
    if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    } else if (filter === 'pending') {
      filtered = filtered.filter(task => !task.completed);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by due date, then priority, then creation date
    return filtered.sort((a, b) => {
      // First by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Then by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;

      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }

      // Finally by creation date
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, searchTerm, filter]);

  // Calculate progress
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
    setIsFormOpen(false);
  };

  const updateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    
    setTasks(prev => prev.map(task => 
      task.id === editingTask.id 
        ? { ...task, ...taskData }
        : task
    ));
    setEditingTask(null);
    setIsFormOpen(false);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { 
            ...task, 
            completed: !task.completed,
            completedAt: !task.completed ? new Date().toISOString() : undefined
          }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Task Manager
            </h1>
            <p className="text-muted-foreground mt-2">Stay organized and track your progress</p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="transition-all duration-300"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Progress Section */}
        <Card className="p-6 mb-8 bg-gradient-card shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Progress Overview
            </h2>
            <span className="text-2xl font-bold text-primary">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3 mb-4" />
          <TaskStats tasks={tasks} />
        </Card>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <FilterDropdown filter={filter} onFilterChange={setFilter} />
          <Button 
            onClick={() => {
              setEditingTask(null);
              setIsFormOpen(true);
            }}
            className="bg-gradient-primary hover:opacity-90 shadow-elegant transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Task Form */}
        {isFormOpen && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? updateTask : addTask}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingTask(null);
            }}
          />
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-card">
              <div className="text-muted-foreground">
                {searchTerm || filter !== 'all' ? (
                  <>
                    <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No tasks match your current filter.</p>
                    <p className="text-sm mt-2">Try adjusting your search or filter settings.</p>
                  </>
                ) : (
                  <>
                    <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No tasks yet!</p>
                    <p className="text-sm mt-2">Add your first task to get started.</p>
                  </>
                )}
              </div>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onEdit={editTask}
                onDelete={deleteTask}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;