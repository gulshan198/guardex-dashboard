import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Camera,
  Clock,
  Info,
  MapPin,
  X as CloseIcon,
} from 'lucide-react';
import { apiUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import type { AlertDetailLine } from '@/components/AlertGridCard';

type AlertDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  alertType: string;
  location?: string;
  cameraId?: string;
  time?: string;
  /** Optional duration label (e.g. idle minutes) shown like guardex Activity pill */
  durationLabel?: string;
  details?: AlertDetailLine[];
  imageId?: string;
  imageUrl?: string;
  onResolve?: () => void | Promise<void>;
  showResolve?: boolean;
  onMarkIncorrect?: () => void | Promise<void>;
  /** 1-based index for "Alert X of Y" (guardex-style) */
  alertIndex?: number;
  alertTotal?: number;
};

export function AlertDetailDialog({
  open,
  onOpenChange,
  alertType,
  location,
  cameraId,
  time,
  durationLabel,
  details = [],
  imageId,
  imageUrl,
  onResolve,
  showResolve = true,
  onMarkIncorrect,
  alertIndex,
  alertTotal,
}: AlertDetailDialogProps) {
  const [imageError, setImageError] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [markingIncorrect, setMarkingIncorrect] = useState(false);
  const imageSrc = imageUrl ?? (imageId ? apiUrl(`/alerts/image/${imageId}`) : '');
  const displayLocation = location || 'Unknown Location';
  const showAlertPosition =
    typeof alertIndex === 'number' &&
    typeof alertTotal === 'number' &&
    alertTotal > 0;

  useEffect(() => {
    if (open) setImageError(false);
  }, [open, imageId, imageUrl]);

  const handleResolve = async () => {
    if (!onResolve) return;
    try {
      setResolving(true);
      await onResolve();
      onOpenChange(false);
    } finally {
      setResolving(false);
    }
  };

  const handleMarkIncorrect = async () => {
    if (!onMarkIncorrect) return;
    try {
      setMarkingIncorrect(true);
      await onMarkIncorrect();
      onOpenChange(false);
    } finally {
      setMarkingIncorrect(false);
    }
  };

  const violationLabel = alertType.replace(/_/g, ' ');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideClose
        className={cn(
          'w-full max-w-4xl translate-x-[-50%] translate-y-[-50%] gap-0 border-none bg-transparent p-0 shadow-none',
          'sm:rounded-lg sm:max-w-4xl'
        )}
      >
        <div
          className={cn(
            'relative flex max-h-[90vh] w-full flex-col overflow-hidden',
            'border border-border bg-background/95 shadow-2xl backdrop-blur-sm',
            'sm:rounded-lg'
          )}
        >
          <button
            type='button'
            aria-label='Close'
            onClick={() => onOpenChange(false)}
            className={cn(
              'absolute right-2 top-2 z-50 sm:right-3 sm:top-3',
              'inline-flex h-8 w-8 items-center justify-center rounded-full sm:h-9 sm:w-9',
              'bg-black/70 text-white hover:bg-black/80',
              'focus:outline-none focus:ring-2 focus:ring-white/60'
            )}
          >
            <CloseIcon className='h-4 w-4 sm:h-5 sm:w-5' />
          </button>

          <DialogTitle className='sr-only'>Alert details</DialogTitle>

          <div className='flex min-h-0 flex-1 flex-col'>
            {/* Image — guardex AlertDetailModal layout */}
            <div className='relative flex min-h-[200px] max-h-[55vh] flex-1 items-center justify-center bg-muted/30'>
              {imageSrc && !imageError ? (
                <img
                  src={imageSrc}
                  alt={alertType}
                  className='h-auto max-h-[55vh] w-full object-contain'
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className='flex h-full min-h-[200px] w-full items-center justify-center'>
                  <Camera size={40} className='text-muted-foreground/50' />
                </div>
              )}
            </div>

            {/* Compact info + actions — matches guardex bottom strip */}
            <div
              className={cn(
                'flex shrink-0 flex-col border-t border-border bg-card',
                'px-3 py-2 sm:px-4 sm:py-3'
              )}
            >
              <div className='space-y-2'>
                {/* <div className='flex items-center justify-between gap-2'>
                  <div className='min-w-0'>
                    {showAlertPosition ? (
                      <p className='text-xs text-muted-foreground'>
                        Alert {alertIndex} of {alertTotal}
                      </p>
                    ) : (
                      <p className='text-xs text-muted-foreground'>
                        Active alert
                      </p>
                    )}
                  </div>
                  <Badge
                    className={cn(
                      'border px-2 py-0.5 text-[11px] font-medium',
                      'border-emerald-500/40 bg-emerald-500/10 text-emerald-600'
                    )}
                  >
                    ACTIVE
                  </Badge>
                </div> */}

                <div className='mb-2 flex flex-wrap items-center gap-3 text-xs'>
                  {time && (
                    <div className='flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-muted-foreground'>
                      <Clock className='h-3 w-3 shrink-0 text-red-400' />
                      <span className='font-medium text-foreground'>{time}</span>
                    </div>
                  )}

                  <div className='flex max-w-[min(100%,220px)] items-center gap-1 rounded bg-muted px-2 py-0.5 text-muted-foreground'>
                    <MapPin className='h-3 w-3 shrink-0 text-blue-400' />
                    <span
                      className='truncate font-medium text-foreground'
                      title={displayLocation}
                    >
                      {displayLocation}
                    </span>
                    {cameraId && (
                      <span className='shrink-0 font-normal text-foreground/70'>
                        ({cameraId})
                      </span>
                    )}
                  </div>

                  {durationLabel && (
                    <div className='flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-muted-foreground'>
                      <Activity className='h-3 w-3 shrink-0 text-amber-400' />
                      <span className='font-medium text-foreground'>
                        {durationLabel}
                      </span>
                    </div>
                  )}

                  <Badge
                    variant='outline'
                    className={cn(
                      'flex items-center gap-1 rounded border-current px-2 py-0.5 font-medium capitalize',
                      'border-amber-500/50 bg-amber-500/10 text-amber-800'
                    )}
                  >
                    <Info className='mr-0.5 h-3 w-3' />
                    <span>{violationLabel}</span>
                  </Badge>
                </div>

                {details.length > 0 && (
                  <div className='flex flex-wrap gap-2 border-border/40 pb-1'>
                    {details.map((line) => (
                      <div
                        key={line.label}
                        className='rounded border border-border/60 bg-muted/50 px-2 py-1 text-xs'
                      >
                        <span className='text-muted-foreground'>
                          {line.label}:{' '}
                        </span>
                        <span className='font-medium text-foreground'>
                          {line.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                className={cn(
                  'flex shrink-0 items-center justify-end gap-2 border-t border-border/60 pt-2'
                )}
              >
                {onMarkIncorrect ? (
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-7 shrink-0 px-3 text-xs'
                    disabled={resolving || markingIncorrect}
                    onClick={handleMarkIncorrect}
                  >
                    {markingIncorrect ? 'Marking…' : 'Mark incorrect'}
                  </Button>
                ) : null}
                {showResolve && onResolve && (
                  <Button
                    variant='default'
                    size='sm'
                    className='h-7 w-1/3 shrink-0 bg-destructive px-3 text-xs text-destructive-foreground hover:bg-destructive/90'
                    disabled={resolving || markingIncorrect}
                    onClick={handleResolve}
                  >
                    {resolving ? 'Resolving…' : 'Resolve'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
