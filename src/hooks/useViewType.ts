import { useEffect, useState } from 'react';

export type ViewType = 'list' | 'grid';

export function useViewType(storageKey: string) {
  const [viewType, setViewType] = useState<ViewType>('grid');

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'list' || saved === 'grid') {
      setViewType(saved);
    }
  }, [storageKey]);

  const handleViewChange = (type: ViewType) => {
    setViewType(type);
    localStorage.setItem(storageKey, type);
  };

  return { viewType, handleViewChange };
}
