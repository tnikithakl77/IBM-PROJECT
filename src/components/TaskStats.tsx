import { CheckCircle, Clock, AlertTriangle, Target } from 'lucide-react';
import { Task } from '@/types/task';

interface TaskStatsProps {
  tasks: Task[];
}

export const TaskStats = ({ tasks }: TaskStatsProps) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  
  const overdueTasks = tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    new Date(task.dueDate) < new Date()
  ).length;

  const highPriorityTasks = tasks.filter(task => 
    !task.completed && task.priority === 'high'
  ).length;

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Pending',
      value: pendingTasks,
      icon: Clock,
      color: 'text-priority-medium',
      bgColor: 'bg-priority-medium/10',
    },
    {
      label: 'Overdue',
      value: overdueTasks,
      icon: AlertTriangle,
      color: 'text-priority-high',
      bgColor: 'bg-priority-high/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 hover:shadow-sm"
          >
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};