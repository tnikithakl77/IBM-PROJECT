import { useState } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Task, TaskPriority } from '@/types/task';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const TaskForm = ({ task, onSubmit, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');
  const [dueDate, setDueDate] = useState(
    task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      completed: task?.completed || false,
      completedAt: task?.completedAt,
    });

    // Reset form if adding new task
    if (!task) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
  };

  return (
    <Card className="p-6 mb-6 bg-gradient-card shadow-elegant border-2 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          {task ? <Save className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
          {task ? 'Edit Task' : 'Add New Task'}
        </h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title..."
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value: TaskPriority) => setPriority(value)}>
              <SelectTrigger id="priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high" className="text-priority-high">High Priority</SelectItem>
                <SelectItem value="medium" className="text-priority-medium">Medium Priority</SelectItem>
                <SelectItem value="low" className="text-priority-low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)..."
            className="min-h-[80px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={!title.trim()}
            className="bg-gradient-primary hover:opacity-90 shadow-elegant transition-all duration-300"
          >
            {task ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Task
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};