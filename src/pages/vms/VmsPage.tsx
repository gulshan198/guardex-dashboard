'use client';

import { useMemo, useState } from 'react';
import { VideoOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { VmsEvidenceVault } from '@/components/vms/VmsEvidenceVault';
import {
  DEFAULT_VMS_ALERT_ID,
  VMS_FOCUS_SPAN,
  VMS_GRID_COLS,
  VMS_GRID_ROWS,
  getEvidenceAlertById,
  vmsCameras,
  type VmsCamera,
  type VmsEvidenceAlert,
} from '@/lib/vmsDummy';

type GridCell = { r: number; c: number };

function freeCells(spanW: number, spanH: number): GridCell[] {
  const cells: GridCell[] = [];
  for (let r = 0; r < VMS_GRID_ROWS; r++) {
    for (let c = 0; c < VMS_GRID_COLS; c++) {
      if (r < spanH && c < spanW) continue;
      cells.push({ r, c });
    }
  }
  return cells;
}

function VmsFocusTile({ alert }: { alert: VmsEvidenceAlert }) {
  return (
    <div className='pointer-events-none relative h-full w-full min-h-0 min-w-0 overflow-hidden bg-gray-900 ring-2 ring-guardai-red ring-inset'>
      <video
        key={alert.id}
        src={alert.evidenceVideoSrc}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        controls={false}
        className='h-full w-full object-cover'
      />
      <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-0.5'>
        <span className='truncate text-[8px] font-medium text-white/90 sm:text-[9px]'>
          {alert.title} · Evidence
        </span>
      </div>
      <span className='absolute left-0.5 top-0.5 rounded bg-guardai-red px-1 py-px font-mono text-[8px] text-white'>
        EVIDENCE
      </span>
    </div>
  );
}

/** Fixed live-cam layout — never tied to which evidence alert is selected. */
function buildMosaicSlots() {
  const spanW = Math.min(VMS_FOCUS_SPAN, VMS_GRID_COLS);
  const spanH = Math.min(VMS_FOCUS_SPAN, VMS_GRID_ROWS);
  const slots = freeCells(spanW, spanH);
  const pool = vmsCameras.filter((c) => c.enabled);

  return slots.map((cell, index) => ({
    cell,
    camera: pool[index] ?? null,
  }));
}

function VmsLiveTile({ camera }: { camera: VmsCamera }) {
  return (
    <div className='pointer-events-none relative h-full w-full min-h-0 min-w-0 overflow-hidden bg-gray-900'>
      <video
        src={camera.videoSrc}
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture
        controls={false}
        className='h-full w-full object-cover'
      />
      <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1 py-0.5'>
        <span className='truncate text-[8px] font-medium text-white/90 sm:text-[9px]'>
          {camera.name}
        </span>
      </div>
      <span className='absolute left-0.5 top-0.5 rounded bg-black/60 px-1 py-px font-mono text-[8px] text-white/90'>
        LIVE
      </span>
    </div>
  );
}

function VmsEmptyTile() {
  return (
    <div className='pointer-events-none relative flex h-full w-full min-h-0 min-w-0 items-center justify-center bg-[#12151a]'>
      <VideoOff size={14} className='text-gray-600 opacity-50' />
    </div>
  );
}

export default function VmsPage() {
  const [activeAlertId, setActiveAlertId] = useState(DEFAULT_VMS_ALERT_ID);

  const activeAlert = getEvidenceAlertById(activeAlertId) ?? getEvidenceAlertById(DEFAULT_VMS_ALERT_ID)!;

  const mosaicSlots = useMemo(() => buildMosaicSlots(), []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='flex h-screen flex-col bg-white'
    >
      <VmsEvidenceVault activeAlertId={activeAlertId} onActiveAlertChange={setActiveAlertId} />

      <div className='relative min-h-0 flex-1 bg-white p-0.5 sm:p-1'>
        <div
          className='pointer-events-none grid h-full min-h-0 gap-0.5 sm:gap-1'
          style={{
            gridTemplateColumns: `repeat(${VMS_GRID_COLS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${VMS_GRID_ROWS}, minmax(0, 1fr))`,
          }}
        >
          <div
            className='min-h-0 min-w-0'
            style={{
              gridColumn: `1 / span ${VMS_FOCUS_SPAN}`,
              gridRow: `1 / span ${VMS_FOCUS_SPAN}`,
            }}
          >
            <VmsFocusTile alert={activeAlert} />
          </div>

          {mosaicSlots.map(({ cell, camera }) => (
            <div
              key={`${cell.r}-${cell.c}`}
              className='min-h-0 min-w-0'
              style={{
                gridColumn: cell.c + 1,
                gridRow: cell.r + 1,
              }}
            >
              {camera ? <VmsLiveTile camera={camera} /> : <VmsEmptyTile />}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
