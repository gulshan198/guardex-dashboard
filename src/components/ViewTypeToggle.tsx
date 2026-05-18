import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ViewType } from '@/hooks/useViewType';

type ViewTypeToggleProps = {
  viewType: ViewType;
  onViewChange: (type: ViewType) => void;
};

export function ViewTypeToggle({ viewType, onViewChange }: ViewTypeToggleProps) {
  return (
    <div className='flex items-center bg-gray-100 border border-gray-200 rounded-md p-1 h-10'>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => onViewChange('list')}
        className={cn(
          'h-8 px-2 rounded-sm',
          viewType === 'list'
            ? 'bg-white shadow-sm text-guardai-red'
            : 'text-gray-500 hover:text-gray-900'
        )}
      >
        <List className='w-4 h-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => onViewChange('grid')}
        className={cn(
          'h-8 px-2 rounded-sm',
          viewType === 'grid'
            ? 'bg-white shadow-sm text-guardai-red'
            : 'text-gray-500 hover:text-gray-900'
        )}
      >
        <LayoutGrid className='w-4 h-4' />
      </Button>
    </div>
  );
}
