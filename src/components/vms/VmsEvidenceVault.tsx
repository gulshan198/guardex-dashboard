'use client';

import { useState } from 'react';
import { Bookmark, Camera, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EvidenceDetailDialog } from '@/components/vms/EvidenceDetailDialog';
import {
  getEvidenceAlertImageSrc,
  vmsEvidenceAlerts,
  type VmsEvidenceAlert,
  type VmsEvidenceSeverity,
} from '@/lib/vmsDummy';

const SEVERITY_STYLES: Record<
  VmsEvidenceSeverity,
  { border: string; badge: string }
> = {
  critical: {
    border: 'border-[#e53935]',
    badge: 'bg-[#e53935] text-white',
  },
  high: {
    border: 'border-[#ff9800]',
    badge: 'bg-[#ff9800] text-white',
  },
  medium: {
    border: 'border-[#ffc107]',
    badge: 'bg-[#ffc107] text-[#1a1a1a]',
  },
};

function EvidenceAlertCard({
  alert,
  selected,
  onSelect,
}: {
  alert: VmsEvidenceAlert;
  selected: boolean;
  onSelect: (alert: VmsEvidenceAlert) => void;
}) {
  const imageSrc = getEvidenceAlertImageSrc(alert);
  const [imageError, setImageError] = useState(false);
  const severity = SEVERITY_STYLES[alert.severity];

  return (
    <button
      type='button'
      onClick={() => onSelect(alert)}
      className={cn(
        'group relative flex h-[56px] min-w-[220px] max-w-[220px] shrink-0 items-center gap-2.5 rounded-md border bg-white px-2 py-1.5 text-left shadow-sm transition-all hover:shadow-md',
        severity.border,
        selected && 'ring-2 ring-guardai-red/50 ring-offset-1 ring-offset-white'
      )}
    >
      <div className='relative size-10 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100'>
        {imageSrc && !imageError ? (
          <img
            src={imageSrc}
            alt=''
            className='size-full object-cover'
            onError={() => setImageError(true)}
          />
        ) : (
          <div className='flex size-full items-center justify-center text-gray-400'>
            <Camera size={14} />
          </div>
        )}
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex items-center justify-between gap-1'>
          <p className='truncate text-[11px] font-semibold leading-tight text-guardai-darkgray'>
            {alert.title}
          </p>
          <div className='flex shrink-0 items-center gap-0.5'>
            {alert.bookmarked ? (
              <Bookmark
                size={10}
                className='shrink-0 fill-[#ffc107] text-[#ffc107]'
                aria-hidden
              />
            ) : null}
            <span
              className={cn(
                'rounded px-1 py-px text-[8px] font-semibold lowercase leading-none',
                severity.badge
              )}
            >
              {alert.severity}
            </span>
          </div>
        </div>
        <div className='mt-0.5 flex items-center justify-between gap-1'>
          <p className='truncate text-[9px] text-gray-500'>
            {alert.cameraLabel} · {alert.timeLabel}
          </p>
          {alert.status === 'active' ? (
            <span className='shrink-0 rounded bg-red-50 px-1 py-px text-[7px] font-bold uppercase tracking-wide text-red-600'>
              ACTIVE
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

type VmsEvidenceVaultProps = {
  activeAlertId: string;
  onActiveAlertChange: (alertId: string) => void;
};

export function VmsEvidenceVault({ activeAlertId, onActiveAlertChange }: VmsEvidenceVaultProps) {
  const [evidenceDialogOpen, setEvidenceDialogOpen] = useState(false);
  const [dialogAlert, setDialogAlert] = useState<VmsEvidenceAlert | null>(null);

  const handleSelect = (alert: VmsEvidenceAlert) => {
    onActiveAlertChange(alert.id);
    setDialogAlert(alert);
    setEvidenceDialogOpen(true);
  };

  const handleEvidenceDialogChange = (open: boolean) => {
    setEvidenceDialogOpen(open);
    if (!open) {
      setDialogAlert(null);
    }
  };

  return (
    <>
      <div className='shrink-0 border-b border-gray-200 bg-white px-4 py-2 sm:px-6'>
        <div className='mb-2 flex items-center justify-between gap-3'>
          <div className='flex min-w-0 items-center gap-2'>
            <span className='size-2 shrink-0 rounded-full bg-[#e53935]' aria-hidden />
            <h2 className='truncate text-xs font-semibold uppercase tracking-wide text-guardai-darkgray'>
              Evidence Vault
            </h2>
            <span className='shrink-0 text-[11px] text-gray-500'>
              {vmsEvidenceAlerts.length} items
            </span>
          </div>
          <ChevronRight size={14} className='shrink-0 text-gray-400' aria-hidden />
        </div>

        <div className='flex gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {vmsEvidenceAlerts.map((alert) => (
            <EvidenceAlertCard
              key={alert.id}
              alert={alert}
              selected={activeAlertId === alert.id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      <EvidenceDetailDialog
        alert={dialogAlert}
        open={evidenceDialogOpen}
        onOpenChange={handleEvidenceDialogChange}
      />
    </>
  );
}
