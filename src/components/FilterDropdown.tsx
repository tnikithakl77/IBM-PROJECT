import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TaskFilter } from '@/types/task';

interface FilterDropdownProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

export const FilterDropdown = ({ filter, onFilterChange }: FilterDropdownProps) => {
  const filterOptions = [
    { value: 'all' as TaskFilter, label: 'All Tasks' },
    { value: 'pending' as TaskFilter, label: 'Pending' },
    { value: 'completed' as TaskFilter, label: 'Completed' },
  ];

  const currentFilter = filterOptions.find(option => option.value === filter);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="transition-all duration-200">
          <Filter className="h-4 w-4 mr-2" />
          {currentFilter?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {filterOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onFilterChange(option.value)}
            className={filter === option.value ? 'bg-primary/10 text-primary' : ''}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};