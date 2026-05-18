import { format } from 'date-fns';
import type {
  DashboardAlertsState,
  ReportDetailContent,
  ReportDetailSection,
  ReportKind,
  ReportListItem,
} from '@/types/dashboardAlerts';

function fmtTime(iso?: string) {
  if (!iso) return '—';
  try {
    return format(new Date(iso), 'MMM d, yyyy · h:mm a');
  } catch {
    return '—';
  }
}

function cap(s: string) {
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function section(
  id: string,
  title: string,
  description: string,
  columns: { key: string; label: string }[],
  rows: Record<string, string | number>[]
): ReportDetailSection {
  return { id, title, description, columns, rows, count: rows.length };
}

function buildOperationsReport(alerts: DashboardAlertsState): ReportDetailContent {
  const { idleMachinery, loitering } = alerts.operations;
  const sections: ReportDetailSection[] = [
    section(
      'idle',
      'Idle Machinery',
      'Machines detected idle beyond threshold',
      [
        { key: 'alertId', label: 'Alert ID' },
        { key: 'machine', label: 'Machine' },
        { key: 'location', label: 'Location' },
        { key: 'camera', label: 'Camera' },
        { key: 'idleDuration', label: 'Idle Duration' },
        { key: 'operator', label: 'Operator Present' },
        { key: 'time', label: 'Logged At' },
        { key: 'status', label: 'Status' },
      ],
      idleMachinery.map((a) => ({
        alertId: a._id,
        machine: a.machine ?? '—',
        location: a.roomName ?? '—',
        camera: a.camera_id ?? '—',
        idleDuration: a.idle_duration ?? '—',
        operator: a.operator_present ? 'Yes' : 'No',
        time: fmtTime(a.logged_at),
        status: cap(a.status ?? 'active'),
      }))
    ),
    section(
      'loitering',
      'Loitering',
      'Clusters of people in sensitive zones',
      [
        { key: 'alertId', label: 'Alert ID' },
        { key: 'zone', label: 'Zone' },
        { key: 'camera', label: 'Camera' },
        { key: 'people', label: 'People' },
        { key: 'duration', label: 'Duration' },
        { key: 'time', label: 'Logged At' },
        { key: 'status', label: 'Status' },
      ],
      loitering.map((a) => ({
        alertId: a._id,
        zone: a.zone ?? a.roomName ?? '—',
        camera: a.camera_id ?? '—',
        people: a.person_count ?? '—',
        duration: a.duration ?? '—',
        time: fmtTime(a.logged_at),
        status: cap(a.status ?? 'active'),
      }))
    ),
  ];

  const total = idleMachinery.length + loitering.length;
  return {
    kind: 'operations',
    title: 'Operational Report',
    subtitle: 'Idle machinery and loitering incidents from the Operations dashboard',
    summary: [
      { label: 'Total incidents', value: total },
      { label: 'Idle machinery', value: idleMachinery.length },
      { label: 'Loitering', value: loitering.length },
      { label: 'Active', value: [...idleMachinery, ...loitering].filter((a) => a.status !== 'resolved').length },
    ],
    sections,
  };
}

function buildComplianceReport(alerts: DashboardAlertsState): ReportDetailContent {
  const { ppe, phone, sleep } = alerts.compliance;
  const sections: ReportDetailSection[] = [
    section(
      'ppe',
      'PPE Violations',
      'Personal protective equipment non-compliance',
      [
        { key: 'alertId', label: 'Alert ID' },
        { key: 'violation', label: 'Violation' },
        { key: 'employee', label: 'Employee' },
        { key: 'location', label: 'Location' },
        { key: 'camera', label: 'Camera' },
        { key: 'time', label: 'Logged At' },
        { key: 'status', label: 'Status' },
      ],
      ppe.map((a) => ({
        alertId: a._id,
        violation: a.violation ?? '—',
        employee: a.person_id ?? '—',
        location: a.roomName ?? '—',
        camera: a.camera_id ?? '—',
        time: fmtTime(a.logged_at),
        status: cap(a.status ?? 'active'),
      }))
    ),
    section(
      'phone',
      'Phone Usage',
      'Unauthorized mobile phone usage on the floor',
      [
        { key: 'alertId', label: 'Alert ID' },
        { key: 'employee', label: 'Employee' },
        { key: 'location', label: 'Location' },
        { key: 'camera', label: 'Camera' },
        { key: 'duration', label: 'Duration' },
        { key: 'time', label: 'Logged At' },
        { key: 'status', label: 'Status' },
      ],
      phone.map((a) => ({
        alertId: a._id,
        employee: a.person_id ?? '—',
        location: a.roomName ?? '—',
        camera: a.camera_id ?? '—',
        duration: a.duration ?? '—',
        time: fmtTime(a.logged_at),
        status: cap(a.status ?? 'active'),
      }))
    ),
    section(
      'sleep',
      'Sleep Detection',
      'Employees detected sleeping on duty',
      [
        { key: 'alertId', label: 'Alert ID' },
        { key: 'employee', label: 'Employee' },
        { key: 'location', label: 'Location' },
        { key: 'camera', label: 'Camera' },
        { key: 'duration', label: 'Duration' },
        { key: 'time', label: 'Logged At' },
        { key: 'status', label: 'Status' },
      ],
      sleep.map((a) => ({
        alertId: a._id,
        employee: a.person_id ?? '—',
        location: a.roomName ?? '—',
        camera: a.camera_id ?? '—',
        duration: a.duration ?? '—',
        time: fmtTime(a.logged_at),
        status: cap(a.status ?? 'active'),
      }))
    ),
  ];

  const total = ppe.length + phone.length + sleep.length;
  return {
    kind: 'compliance',
    title: 'Compliance Dashboard Report',
    subtitle: 'PPE, phone usage, and sleep violations from the Compliance dashboard',
    summary: [
      { label: 'Total violations', value: total },
      { label: 'PPE', value: ppe.length },
      { label: 'Phone usage', value: phone.length },
      { label: 'Sleep', value: sleep.length },
    ],
    sections,
  };
}

function buildSecurityReport(alerts: DashboardAlertsState): ReportDetailContent {
  const { perimeter, restricted, fireSmoke } = alerts.security;
  const sections: ReportDetailSection[] = [
    section(
      'perimeter',
      'Perimeter Security',
      'Unauthorized entry and perimeter breaches',
      [
        { key: 'alertId', label: 'Alert ID' },
        { key: 'location', label: 'Location' },
        { key: 'camera', label: 'Camera' },
        { key: 'type', label: 'Incident Type' },
        { key: 'severity', label: 'Severity' },
        { key: 'time', label: 'Logged At' },
        { key: 'status', label: 'Status' },
      ],
      perimeter.map((a) => ({
        alertId: a._id,
        location: a.roomName ?? '—',
        camera: a.camera_id ?? '—',
        type: a.violation_type ?? '—',
        severity: cap(a.severity ?? 'medium'),
        time: fmtTime(a.logged_at),
        status: cap(a.status ?? 'active'),
      }))
    ),
    section(
      'restricted',
      'Restricted Access',
      'Access violations in restricted zones',
      [
        { key: 'alertId', label: 'Alert ID' },
        { key: 'location', label: 'Location' },
        { key: 'camera', label: 'Camera' },
        { key: 'type', label: 'Incident Type' },
        { key: 'severity', label: 'Severity' },
        { key: 'time', label: 'Logged At' },
        { key: 'status', label: 'Status' },
      ],
      restricted.map((a) => ({
        alertId: a._id,
        location: a.roomName ?? '—',
        camera: a.camera_id ?? '—',
        type: a.violation_type ?? '—',
        severity: cap(a.severity ?? 'medium'),
        time: fmtTime(a.logged_at),
        status: cap(a.status ?? 'active'),
      }))
    ),
    section(
      'fire',
      'Fire & Smoke',
      'Fire and smoke detection events',
      [
        { key: 'alertId', label: 'Alert ID' },
        { key: 'location', label: 'Location' },
        { key: 'camera', label: 'Camera' },
        { key: 'type', label: 'Detection' },
        { key: 'severity', label: 'Severity' },
        { key: 'time', label: 'Logged At' },
        { key: 'status', label: 'Status' },
      ],
      fireSmoke.map((a) => ({
        alertId: a._id,
        location: a.roomName ?? '—',
        camera: a.camera_id ?? '—',
        type: a.violation_type ?? '—',
        severity: cap(a.severity ?? 'critical'),
        time: fmtTime(a.logged_at),
        status: cap(a.status ?? 'active'),
      }))
    ),
  ];

  const total = perimeter.length + restricted.length + fireSmoke.length;
  return {
    kind: 'security',
    title: 'Security Report',
    subtitle: 'Perimeter, restricted access, and fire & smoke alerts from the Security dashboard',
    summary: [
      { label: 'Total alerts', value: total },
      { label: 'Perimeter', value: perimeter.length },
      { label: 'Restricted', value: restricted.length },
      { label: 'Fire & smoke', value: fireSmoke.length },
    ],
    sections,
  };
}

function buildAttendanceReport(): ReportDetailContent {
  return {
    kind: 'attendance',
    title: 'Attendance Report',
    subtitle: 'Workforce attendance summary (HR)',
    summary: [
      { label: 'Present today', value: 168 },
      { label: 'Absent', value: 4 },
      { label: 'Late arrivals', value: 7 },
      { label: 'Attendance rate', value: '94%' },
    ],
    sections: [
      section(
        'shifts',
        'Shift Summary',
        'Attendance by shift',
        [
          { key: 'shift', label: 'Shift' },
          { key: 'present', label: 'Present' },
          { key: 'absent', label: 'Absent' },
          { key: 'rate', label: 'Rate' },
        ],
        [
          { shift: 'Morning (6 AM – 2 PM)', present: 52, absent: 1, rate: '98%' },
          { shift: 'Afternoon (2 PM – 10 PM)', present: 48, absent: 2, rate: '96%' },
          { shift: 'Night (10 PM – 6 AM)', present: 68, absent: 1, rate: '99%' },
        ]
      ),
    ],
  };
}

export type PdfAlertGroup = {
  group: string;
  sections: ReportDetailSection[];
};

/** All dashboard alert tables for the daily PDF export. */
export function buildDailyPdfAlertGroups(
  alerts: DashboardAlertsState
): PdfAlertGroup[] {
  return [
    { group: 'Operations', sections: buildOperationsReport(alerts).sections },
    { group: 'Compliance', sections: buildComplianceReport(alerts).sections },
    { group: 'Security', sections: buildSecurityReport(alerts).sections },
  ];
}

export function buildReportDetail(
  report: Pick<ReportListItem, 'title' | 'kind' | 'type'> | undefined,
  alerts: DashboardAlertsState
): ReportDetailContent {
  const kind: ReportKind =
    report?.kind ??
    (report?.type === 'Operations'
      ? 'operations'
      : report?.type === 'Compliance'
        ? 'compliance'
        : report?.type === 'Security'
          ? 'security'
          : report?.type === 'HR'
            ? 'attendance'
            : 'operations');

  switch (kind) {
    case 'operations':
      return buildOperationsReport(alerts);
    case 'compliance':
      return buildComplianceReport(alerts);
    case 'security':
      return buildSecurityReport(alerts);
    case 'attendance':
      return buildAttendanceReport();
    default:
      return buildOperationsReport(alerts);
  }
}
