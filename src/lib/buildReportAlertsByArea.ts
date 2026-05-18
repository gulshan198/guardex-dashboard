import type { DashboardAlertsState } from '@/types/dashboardAlerts';

export type AlertAreaSegment = { key: string; label: string; color: string };

export type AlertAreaRow = Record<string, unknown> & {
  area: string;
  _total: number;
};

const SEGMENTS: AlertAreaSegment[] = [
  { key: 'seg0', label: 'PPE', color: '#e31e24' },
  { key: 'seg1', label: 'Intrusion', color: '#181819' },
  { key: 'seg2', label: 'Loitering', color: '#3d3d42' },
  { key: 'other', label: 'Other alerts', color: '#9ca3af' },
];

type Category = 'ppe' | 'intrusion' | 'loitering' | 'other';

function isActive(status?: string) {
  return !status || status === 'active';
}

function collectActiveAlerts(state: DashboardAlertsState): { room: string; category: Category }[] {
  const out: { room: string; category: Category }[] = [];
  const room = (name?: string, zone?: string) =>
    (name || zone || 'Unknown').trim() || 'Unknown';

  for (const a of state.operations.loitering) {
    if (isActive(a.status)) out.push({ room: room(a.roomName, a.zone), category: 'loitering' });
  }
  for (const a of state.operations.idleMachinery) {
    if (isActive(a.status)) out.push({ room: room(a.roomName), category: 'other' });
  }
  for (const a of state.compliance.ppe) {
    if (isActive(a.status)) out.push({ room: room(a.roomName), category: 'ppe' });
  }
  for (const a of state.compliance.phone) {
    if (isActive(a.status)) out.push({ room: room(a.roomName), category: 'other' });
  }
  for (const a of state.compliance.sleep) {
    if (isActive(a.status)) out.push({ room: room(a.roomName), category: 'other' });
  }
  for (const a of state.security.perimeter) {
    if (isActive(a.status)) out.push({ room: room(a.roomName), category: 'intrusion' });
  }
  for (const a of state.security.restricted) {
    if (isActive(a.status)) out.push({ room: room(a.roomName), category: 'intrusion' });
  }
  for (const a of state.security.fireSmoke) {
    if (isActive(a.status)) out.push({ room: room(a.roomName), category: 'other' });
  }

  return out;
}

const categoryToKey: Record<Category, string> = {
  ppe: 'seg0',
  intrusion: 'seg1',
  loitering: 'seg2',
  other: 'other',
};

export function buildAlertsByAreaFromDashboard(state: DashboardAlertsState) {
  const active = collectActiveAlerts(state);
  const byRoom = new Map<string, AlertAreaRow>();

  for (const { room, category } of active) {
    const key = categoryToKey[category];
    if (!byRoom.has(room)) {
      byRoom.set(room, {
        area: room,
        seg0: 0,
        seg1: 0,
        seg2: 0,
        other: 0,
        _total: 0,
      });
    }
    const row = byRoom.get(room)!;
    row[key] = (Number(row[key]) || 0) + 1;
    row._total = Number(row._total) + 1;
  }

  const rows = [...byRoom.values()].sort((a, b) => b._total - a._total);

  const typeTotals = { seg0: 0, seg1: 0, seg2: 0, other: 0 };
  for (const r of rows) {
    typeTotals.seg0 += Number(r.seg0) || 0;
    typeTotals.seg1 += Number(r.seg1) || 0;
    typeTotals.seg2 += Number(r.seg2) || 0;
    typeTotals.other += Number(r.other) || 0;
  }

  const topTypeEntry = (
    Object.entries(typeTotals) as [keyof typeof typeTotals, number][]
  ).sort((a, b) => b[1] - a[1])[0] ?? ['seg0', 0];

  const labelByKey = Object.fromEntries(SEGMENTS.map((s) => [s.key, s.label]));

  return {
    rows,
    segments: SEGMENTS,
    totalAlerts: active.length,
    topArea: rows[0]
      ? { name: String(rows[0].area), count: Number(rows[0]._total) }
      : { name: '—', count: 0 },
    topType: {
      label: labelByKey[topTypeEntry[0]] || '—',
      count: topTypeEntry[1],
    },
  };
}
