import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type CleanlinessViewType = 'table' | 'grid';

type CleanlinessViewToggleProps = {
  viewType: CleanlinessViewType;
  onViewChange: (type: CleanlinessViewType) => void;
};

export function CleanlinessViewToggle({
  viewType,
  onViewChange,
}: CleanlinessViewToggleProps) {
  return (
    <div className='hidden h-10 items-center rounded-md border border-gray-200 bg-gray-100 p-1 md:flex'>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => onViewChange('table')}
        className={cn(
          'h-8 rounded-sm px-2',
          viewType === 'table'
            ? 'bg-white text-guardai-red shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        )}
      >
        <List className='h-4 w-4' />
      </Button>
      <Button
        variant='ghost'
        size='sm'
        onClick={() => onViewChange('grid')}
        className={cn(
          'h-8 rounded-sm px-2',
          viewType === 'grid'
            ? 'bg-white text-guardai-red shadow-sm'
            : 'text-gray-500 hover:text-gray-900'
        )}
      >
        <LayoutGrid className='h-4 w-4' />
      </Button>
    </div>
  );
}
