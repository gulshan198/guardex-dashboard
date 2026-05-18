import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, Clock, MapPin } from 'lucide-react';
import { apiUrl } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AlertDetailDialog } from '@/components/AlertDetailDialog';

export type AlertDetailLine = {
  label: string;
  value: React.ReactNode;
};

type AlertGridCardProps = {
  alertType: string;
  location?: string;
  cameraId?: string;
  time?: string;
  durationLabel?: string;
  details?: AlertDetailLine[];
  imageId?: string;
  imageUrl?: string;
  onResolve?: () => void | Promise<void>;
  showResolve?: boolean;
  onMarkIncorrect?: () => void | Promise<void>;
};

export function AlertGridCard({
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
}: AlertGridCardProps) {
  const [imageError, setImageError] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const imageSrc = imageUrl ?? (imageId ? apiUrl(`/alerts/image/${imageId}`) : '');
  const displayLocation = location || 'Unknown Location';

  const openDialog = () => setDialogOpen(true);

  const handleCardResolve = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!onResolve) return;
    await onResolve();
  };

  return (
    <>
      <Card
        className={cn(
          'group relative h-full overflow-hidden border border-gray-200 bg-white',
          'cursor-pointer transition-all duration-200 hover:border-gray-300 hover:shadow-md'
        )}
        onClick={openDialog}
      >
        <div className='relative aspect-video w-full overflow-hidden bg-gray-100'>
          {imageSrc && !imageError ? (
            <img
              src={imageSrc}
              alt={alertType}
              className='h-full w-full object-contain transition-transform duration-500 group-hover:scale-105'
              onError={() => setImageError(true)}
            />
          ) : (
            <div className='flex h-full w-full items-center justify-center'>
              <Camera size={28} className='text-gray-400' />
            </div>
          )}
          <div className='pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100'>
            <span className='rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-black shadow'>
              View Details
            </span>
          </div>
        </div>

        <CardContent className='flex flex-col gap-2 p-3'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex min-w-0 items-center gap-1.5'>
              <MapPin size={13} className='shrink-0 text-gray-500' />
              <span className='truncate text-[13px] font-medium text-guardai-darkgray'>
                {displayLocation}
                {cameraId && (
                  <span className='ml-1 text-xs font-normal text-gray-500'>
                    ({cameraId})
                  </span>
                )}
              </span>
            </div>
            <Badge className='shrink-0 rounded-full border-none bg-guardai-red/10 px-2 py-0.5 text-[11px] font-medium text-guardai-red shadow-none'>
              {alertType}
            </Badge>
          </div>

          {time && (
            <div className='flex items-center gap-1.5 text-gray-500'>
              <Clock size={12} className='shrink-0' />
              <span className='text-xs'>{time}</span>
            </div>
          )}

          {details.length > 0 && (
            <div className='space-y-1 rounded-md bg-gray-50 px-2 py-1.5'>
              {details.map((line) => (
                <div
                  key={line.label}
                  className='flex items-center justify-between gap-2 text-xs'
                >
                  <span className='text-gray-500'>{line.label}</span>
                  <span className='font-medium text-guardai-darkgray'>
                    {line.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          {showResolve && onResolve && (
            <div
              className='border-t border-gray-100 pt-2'
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                size='sm'
                onClick={handleCardResolve}
                className='h-7 w-full bg-guardai-red text-xs hover:bg-red-600'
              >
                Resolve
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        alertType={alertType}
        location={location}
        cameraId={cameraId}
        time={time}
        durationLabel={durationLabel}
        details={details}
        imageId={imageId}
        imageUrl={imageUrl}
        onResolve={onResolve}
        showResolve={showResolve}
        onMarkIncorrect={onMarkIncorrect}
      />
    </>
  );
}
