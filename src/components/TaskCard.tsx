import { formatDistanceToNow, isAfter, isBefore } from 'date-fns';
import { Check, Edit, Trash2, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onToggle, onEdit, onDelete }: TaskCardProps) => {
  const isOverdue = task.dueDate && !task.completed && isBefore(new Date(task.dueDate), new Date());
  const isDueSoon = task.dueDate && !task.completed && 
    isAfter(new Date(task.dueDate), new Date()) && 
    isBefore(new Date(task.dueDate), new Date(Date.now() + 24 * 60 * 60 * 1000));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-priority-high border-priority-high bg-priority-high/10';
      case 'medium': return 'text-priority-medium border-priority-medium bg-priority-medium/10';
      case 'low': return 'text-priority-low border-priority-low bg-priority-low/10';
      default: return 'text-muted-foreground border-muted bg-muted/10';
    }
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    
    if (isBefore(date, now)) {
      return `Overdue by ${formatDistanceToNow(date)}`;
    }
    
    return `Due ${formatDistanceToNow(date, { addSuffix: true })}`;
  };

  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-card bg-gradient-card",
      task.completed && "opacity-75",
      isOverdue && "border-l-4 border-l-priority-high"
    )}>
      <div className="flex items-start gap-4">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggle(task.id)}
          className="mt-1 data-[state=checked]:bg-success data-[state=checked]:border-success"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-semibold transition-all duration-200",
                task.completed && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              {task.description && (
                <p className={cn(
                  "text-sm text-muted-foreground mt-1",
                  task.completed && "line-through"
                )}>
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                  className="h-8 w-8 p-0 hover:bg-primary/10"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.id)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1",
                isOverdue && "text-priority-high font-medium",
                isDueSoon && "text-priority-medium font-medium"
              )}>
                {isOverdue ? (
                  <AlertTriangle className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {formatDueDate(task.dueDate)}
              </div>
            )}
            
            {task.completed && task.completedAt && (
              <div className="flex items-center gap-1 text-success">
                <Check className="h-3 w-3" />
                Completed {formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}
              </div>
            )}
            
            {!task.completed && (
              <div>
                Created {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};