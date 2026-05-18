export type ReportKind =
  | 'operations'
  | 'compliance'
  | 'security'
  | 'attendance';

export type BaseAlert = {
  _id: string;
  camera_id?: string;
  roomName?: string;
  zone?: string;
  logged_at: string;
  frame_timestamp?: string;
  image_id?: string;
  imageUrl?: string;
  status?: 'active' | 'resolved';
};

export type IdleMachineryAlert = BaseAlert & {
  machine?: string;
  frame_timestamp?: string;
  idle_duration?: string;
  operator_present?: boolean;
};

export type LoiteringAlert = BaseAlert & {
  frame_timestamp?: string;
  box_count?: number;
  person_count?: number;
  duration?: string;
};

export type PpeAlert = BaseAlert & {
  violation?: string;
  person_id?: string;
};

export type PhoneAlert = BaseAlert & {
  person_id?: string;
  duration?: string;
};

export type SleepAlert = BaseAlert & {
  person_id?: string;
  duration?: string;
};

export type SecurityAlert = BaseAlert & {
  violation_type?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
};

export type DashboardAlertsState = {
  operations: {
    idleMachinery: IdleMachineryAlert[];
    loitering: LoiteringAlert[];
  };
  compliance: {
    ppe: PpeAlert[];
    phone: PhoneAlert[];
    sleep: SleepAlert[];
  };
  security: {
    perimeter: SecurityAlert[];
    restricted: SecurityAlert[];
    fireSmoke: SecurityAlert[];
  };
};

export type ReportListItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  type: string;
  kind: ReportKind;
  size: string;
  icon: import('lucide-react').LucideIcon;
};

export type ReportTableColumn = {
  key: string;
  label: string;
};

export type ReportDetailSection = {
  id: string;
  title: string;
  description: string;
  columns: ReportTableColumn[];
  rows: Record<string, string | number>[];
  count: number;
};

export type ReportDetailContent = {
  kind: ReportKind;
  title: string;
  subtitle: string;
  summary: { label: string; value: string | number }[];
  sections: ReportDetailSection[];
};
