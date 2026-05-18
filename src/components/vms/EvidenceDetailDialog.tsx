'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Clock,
  Image as ImageIcon,
  Info,
  MapPin,
  Video,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { EvidenceVideoPlayer } from '@/components/vms/EvidenceVideoPlayer';
import {
  getAlertEvidenceItems,
  getVmsCameraById,
  vmsEvidenceAlerts,
  type VmsEvidenceAlert,
  type VmsEvidenceItem,
} from '@/lib/vmsDummy';

function nextIndex(current: number, total: number) {
  if (total <= 0) return 0;
  return (current + 1) % total;
}

function prevIndex(current: number, total: number) {
  if (total <= 0) return 0;
  return (current - 1 + total) % total;
}

type EvidenceDetailDialogProps = {
  alert: VmsEvidenceAlert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EvidenceDetailDialog({ alert, open, onOpenChange }: EvidenceDetailDialogProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [resolved, setResolved] = useState(false);

  const evidence = useMemo(
    () => (alert ? getAlertEvidenceItems(alert) : []),
    [alert]
  );
  const activeEvidence = evidence[activeIdx];
  const camera = alert ? getVmsCameraById(alert.cameraId) : undefined;
  const alertNumber = alert
    ? vmsEvidenceAlerts.findIndex((item) => item.id === alert.id) + 1
    : 0;

  useEffect(() => {
    if (!open) return;
    setActiveIdx(0);
    setResolved(false);
  }, [open, alert?.id]);

  const handleResolve = () => {
    setResolved(true);
    onOpenChange(false);
  };

  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className='max-h-[calc(100vh-1.5rem)] w-[min(900px,calc(100vw-1.5rem))] gap-0 overflow-hidden border-none bg-transparent p-0 shadow-none sm:max-w-[min(900px,calc(100vw-1.5rem))]'
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <div className='flex max-h-[calc(100vh-1.5rem)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl'>
          <button
            type='button'
            aria-label='Close'
            onClick={() => onOpenChange(false)}
            className='absolute right-3 top-3 z-50 inline-flex size-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/80'
          >
            <X className='size-4' />
          </button>

          <DialogTitle className='sr-only'>{alert.title}</DialogTitle>

          <div className='relative bg-gray-950 px-3 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4'>
            <div className='relative mx-auto aspect-video w-full max-h-[min(56vh,520px)] overflow-hidden rounded-lg bg-black'>
              <EvidenceMediaStage
                evidence={evidence}
                activeEvidence={activeEvidence}
                activeIdx={activeIdx}
                canNavigate={evidence.length > 1}
                onPrev={() => setActiveIdx((i) => prevIndex(i, evidence.length))}
                onNext={() => setActiveIdx((i) => nextIndex(i, evidence.length))}
              />

              {evidence.length > 1 ? (
                <div className='pointer-events-none absolute inset-x-0 bottom-3 flex flex-col items-center gap-2 px-3'>
                  <div className='rounded-full bg-black/70 px-3 py-1 text-xs text-white'>
                    {activeIdx + 1} / {evidence.length}
                  </div>
                  <div className='pointer-events-auto flex max-w-full justify-center gap-1.5 overflow-x-auto sm:gap-2'>
                    {evidence.map((item, idx) => (
                      <EvidenceThumbnail
                        key={item.id}
                        item={item}
                        active={activeIdx === idx}
                        onSelect={() => setActiveIdx(idx)}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className='flex flex-col border-t border-gray-200 bg-white px-4 py-3'>
            <div className='mb-3 flex items-start justify-between gap-3'>
              <div className='min-w-0'>
                <p className='text-xs text-gray-500'>
                  Alert {alertNumber} of {vmsEvidenceAlerts.length}
                </p>
                <p className='truncate text-sm font-semibold text-guardai-darkgray'>{alert.title}</p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded border px-2 py-0.5 text-[11px] font-medium capitalize',
                  alert.status === 'active'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600'
                    : 'border-amber-400/40 bg-amber-400/10 text-amber-600'
                )}
              >
                {alert.status}
              </span>
            </div>

            <div className='mb-3 flex flex-wrap gap-2'>
              <MetadataChip icon={Clock} label={alert.loggedAt} />
              <MetadataChip icon={MapPin} label={alert.location} />
              <MetadataChip icon={Activity} label={alert.duration} />
              <MetadataChip icon={Info} label={alert.violation} highlight />
              <MetadataChip label={alert.category} />
              {camera ? <MetadataChip label={camera.name} mono /> : null}
            </div>

            {/* <div className='flex gap-2 border-t border-gray-100 pt-3'>
              <Button type='button' variant='outline' className='flex-1' size='sm'>
                Mark incorrect
              </Button>
              <Button
                type='button'
                className='flex-1 bg-guardai-red hover:bg-guardai-red/90'
                size='sm'
                onClick={handleResolve}
                disabled={resolved}
              >
                {resolved ? 'Resolved' : 'Resolve'}
              </Button>
            </div> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MetadataChip({
  icon: Icon,
  label,
  highlight,
  mono,
}: {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex max-w-full items-center gap-1 rounded px-2 py-0.5 text-xs',
        highlight
          ? 'border border-amber-400/50 bg-amber-50 text-amber-800'
          : 'bg-gray-100 text-gray-600'
      )}
    >
      {Icon ? <Icon className='size-3 shrink-0' /> : null}
      <span
        className={cn(
          'truncate font-medium text-guardai-darkgray',
          mono && 'font-mono text-[11px]'
        )}
      >
        {label}
      </span>
    </div>
  );
}

function EvidenceMediaStage({
  evidence,
  activeEvidence,
  activeIdx,
  canNavigate,
  onPrev,
  onNext,
}: {
  evidence: VmsEvidenceItem[];
  activeEvidence: VmsEvidenceItem | undefined;
  activeIdx: number;
  canNavigate: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (!activeEvidence) {
    return (
      <div className='absolute inset-0 flex items-center justify-center text-sm text-gray-400'>
        No evidence available
      </div>
    );
  }

  return (
    <>
      {canNavigate ? (
        <>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute left-2 top-1/2 z-30 size-9 -translate-y-1/2 rounded-full bg-black/70 text-white hover:bg-black/80'
            onClick={onPrev}
            aria-label='Previous evidence'
          >
            <ChevronLeft className='size-5' />
          </Button>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='absolute right-2 top-1/2 z-30 size-9 -translate-y-1/2 rounded-full bg-black/70 text-white hover:bg-black/80'
            onClick={onNext}
            aria-label='Next evidence'
          >
            <ChevronRight className='size-5' />
          </Button>
        </>
      ) : null}

      {activeEvidence.kind === 'video' ? (
        <EvidenceVideoPlayer
          key={`${activeEvidence.id}-${activeIdx}`}
          src={activeEvidence.src}
          className='absolute inset-0 h-full w-full object-contain'
        />
      ) : (
        <img
          key={`${activeEvidence.id}-${activeIdx}`}
          src={activeEvidence.src}
          alt={activeEvidence.label}
          className='absolute inset-0 h-full w-full object-contain'
        />
      )}
    </>
  );
}

function EvidenceThumbnail({
  item,
  active,
  onSelect,
}: {
  item: VmsEvidenceItem;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onSelect}
      aria-label={item.label}
      className={cn(
        'relative size-10 shrink-0 overflow-hidden rounded border-2 transition-all sm:size-14',
        active ? 'scale-110 border-white' : 'border-transparent opacity-60 hover:opacity-100'
      )}
    >
      {item.kind === 'image' ? (
        <img src={item.src} alt='' className='size-full object-cover' />
      ) : (
        <div className='grid size-full place-items-center bg-slate-900 text-white/80'>
          <Video className='size-5' />
        </div>
      )}
      <span className='absolute bottom-0 inset-x-0 bg-black/60 py-px text-center text-[8px] text-white'>
        {item.kind === 'image' ? (
          <ImageIcon className='mx-auto size-2.5' />
        ) : (
          <Video className='mx-auto size-2.5' />
        )}
      </span>
    </button>
  );
}
