import { format } from 'date-fns';
import type { IdleMachineryReportPayload } from '@/lib/idleMachineryDummy';
import { STOCK_PRODUCTION, STOCK_SEVEN_DAY } from '@/lib/stockDummy';

export type TruckLogEntry = {
  id: string;
  truck: string;
  type: 'INBOUND' | 'OUTBOUND';
  timeIn: string;
  timeOut: string;
  dock: string;
  boxes: number;
  loadingTime: string;
};

export const DUMMY_TRUCK_LOG: TruckLogEntry[] = [
  { id: '1', truck: 'HR26 AB 4821', type: 'INBOUND', timeIn: '06:22 AM', timeOut: '08:10 AM', dock: 'DOCK-3', boxes: 640, loadingTime: '1h 48m' },
  { id: '2', truck: 'DL01 CD 9934', type: 'OUTBOUND', timeIn: '07:15 AM', timeOut: '09:05 AM', dock: 'DOCK-1', boxes: 520, loadingTime: '1h 50m' },
  { id: '3', truck: 'UP32 EF 7712', type: 'INBOUND', timeIn: '08:40 AM', timeOut: '10:22 AM', dock: 'DOCK-2', boxes: 710, loadingTime: '1h 42m' },
  { id: '4', truck: 'RJ14 GH 2208', type: 'OUTBOUND', timeIn: '09:55 AM', timeOut: '11:48 AM', dock: 'DOCK-4', boxes: 580, loadingTime: '1h 53m' },
  { id: '5', truck: 'MH12 JK 5561', type: 'INBOUND', timeIn: '11:10 AM', timeOut: '12:55 PM', dock: 'DOCK-3', boxes: 690, loadingTime: '1h 45m' },
  { id: '6', truck: 'PB10 LM 8890', type: 'OUTBOUND', timeIn: '01:20 PM', timeOut: '03:05 PM', dock: 'DOCK-1', boxes: 610, loadingTime: '1h 45m' },
];

export const DUMMY_HOURLY_PRODUCTION = [
  { hour: '8 AM', units: 180, alerts: 4 },
  { hour: '9 AM', units: 240, alerts: 6 },
  { hour: '10 AM', units: 310, alerts: 8 },
  { hour: '11 AM', units: 280, alerts: 7 },
  { hour: '12 PM', units: 320, alerts: 5 },
  { hour: '1 PM', units: 290, alerts: 9 },
  { hour: '2 PM', units: 340, alerts: 11 },
  { hour: '3 PM', units: 360, alerts: 10 },
  { hour: '4 PM', units: 300, alerts: 8 },
  { hour: '5 PM', units: 260, alerts: 6 },
  { hour: '6 PM', units: 220, alerts: 4 },
];

/** Scale hourly curve so it sums to `targetTotal` (matches Stock page today production). */
export function scaleHourlyProduction(targetTotal: number) {
  const rawSum = DUMMY_HOURLY_PRODUCTION.reduce((s, p) => s + p.units, 0);
  const factor = rawSum > 0 ? targetTotal / rawSum : 1;
  return DUMMY_HOURLY_PRODUCTION.map((p) => ({
    t: p.hour,
    units: Math.round(p.units * factor),
  }));
}

export function getStockSummary() {
  const totalBoxes = DUMMY_TRUCK_LOG.reduce((s, t) => s + t.boxes, 0);
  const inbound = DUMMY_TRUCK_LOG.filter((t) => t.type === 'INBOUND').length;
  const outbound = DUMMY_TRUCK_LOG.filter((t) => t.type === 'OUTBOUND').length;
  const hourly = scaleHourlyProduction(STOCK_PRODUCTION.todayProduction);
  const peak = hourly.reduce(
    (best, p) => (p.units > best.units ? p : best),
    hourly[0] ?? { t: '—', units: 0 }
  );
  const avgTurnaround = Math.round(
    DUMMY_TRUCK_LOG.reduce((s, t) => {
      const m = parseInt(t.loadingTime, 10) || 35;
      return s + m;
    }, 0) / DUMMY_TRUCK_LOG.length
  );

  return {
    unitsToday: STOCK_PRODUCTION.todayProduction,
    peakHour: peak.t,
    peakUnits: peak.units,
    totalTrucks: DUMMY_TRUCK_LOG.length,
    inbound,
    outbound,
    totalBoxes,
    avgTurnaround,
    sevenDayAlerts: STOCK_SEVEN_DAY.totalAlerts,
    sevenDayAvgUnits: STOCK_SEVEN_DAY.avgUnitsPerDay,
    hourly,
  };
}

export type MachineIdleRow = {
  machine: string;
  camera: string;
  area: string;
  stoppages: number;
  totalIdle: string;
  longestStop: string;
  utilization: number;
};

function parseAuditSec(entry: unknown): number {
  if (!Array.isArray(entry) || entry.length < 2) return 0;
  const start = new Date(String(entry[0])).getTime();
  const end = new Date(String(entry[1])).getTime();
  if (Number.isNaN(start) || Number.isNaN(end)) return 0;
  return Math.max(0, Math.round((end - start) / 1000));
}

function formatDuration(sec: number) {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm > 0 ? `${h}h ${rm}m` : `${h}h`;
}

export function getIdleMachineryReportData(payload: IdleMachineryReportPayload) {
  const machines: MachineIdleRow[] = [];

  for (const cam of payload.cameras) {
    for (const m of cam.machines) {
      const audits = m.audit ?? [];
      const durations = audits.map(parseAuditSec).filter((d) => d >= 60);
      const totalSec = durations.reduce((a, b) => a + b, 0);
      const longest = durations.length ? Math.max(...durations) : 0;
      const staffingTotal = (m.understaffed ?? 0) + (m.overstaffed ?? 0) + (m.normalCount ?? 0);
      const utilization =
        staffingTotal > 0
          ? Math.round(((m.normalCount ?? 0) / staffingTotal) * 100)
          : 94;

      machines.push({
        machine: m.name || 'Machine',
        camera: cam.cameraId,
        area: cam.roomName,
        stoppages: durations.length,
        totalIdle: formatDuration(totalSec),
        longestStop: formatDuration(longest),
        utilization,
      });
    }
  }

  machines.sort((a, b) => {
    const parseIdle = (s: string) => {
      const h = s.includes('h') ? parseInt(s, 10) * 60 : 0;
      const m = s.includes('m') ? parseInt(s.match(/(\d+)m/)?.[1] ?? '0', 10) : 0;
      return h + m;
    };
    return parseIdle(b.totalIdle) - parseIdle(a.totalIdle);
  });

  const totalSec = machines.reduce((s, m) => {
    const match = m.totalIdle.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/);
    if (!match) return s;
    return s + (parseInt(match[1] ?? '0', 10) * 3600 + parseInt(match[2] ?? '0', 10) * 60);
  }, 0);

  const machinesWithStops = machines.filter((m) => m.stoppages > 0).length;
  const longestOverall = machines.reduce(
    (best, m) => (m.longestStop.length > best.length ? m : best),
    machines[0] ?? { longestStop: '0m' }
  );

  const camerasAffected = new Set(
    payload.cameras.filter((c) => c.machines.some((m) => (m.audit?.length ?? 0) > 0)).map((c) => c.cameraId)
  ).size;

  return {
    machines,
    machinesIdle: machinesWithStops,
    totalDowntime: `${(totalSec / 3600).toFixed(1)}h`,
    longestStop: longestOverall.longestStop,
    camerasAffected,
    machineCount: machines.length,
    stoppageCount: machines.reduce((s, m) => s + m.stoppages, 0),
  };
}

export function getReportDocId(date: Date) {
  return `DOC GDX-GTM-${format(date, 'yyyy-MM-dd')}`;
}

export function getReportDateLine(date: Date) {
  return `${format(date, 'EEEE')} · ${format(date, 'd MMMM yyyy')} · Bisleri Plant — Daily Analytics`;
}
