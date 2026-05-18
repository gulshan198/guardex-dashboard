import type {
  IdleMachineryAlert,
  LoiteringAlert,
  PpeAlert,
  PhoneAlert,
  SecurityAlert,
  SleepAlert,
} from '@/types/dashboardAlerts';

function pickId(item: Record<string, unknown>) {
  return String(item._id ?? item.id ?? '');
}

function mapCommonFields(item: Record<string, unknown>) {
  const zone = (item.zone ?? item.roomName ?? item.room_name) as string | undefined;
  const timestamp = item.frame_timestamp ?? item.logged_at;
  return {
    zone,
    roomName: (item.roomName ?? item.room_name ?? zone) as string | undefined,
    logged_at: String(timestamp ?? new Date().toISOString()),
    frame_timestamp: timestamp ? String(timestamp) : undefined,
    image_id: item.image_id ? String(item.image_id) : undefined,
  };
}

export function mapIdleFromApi(items: unknown[]): IdleMachineryAlert[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items.map((raw) => {
    const item = raw as Record<string, unknown>;
    const common = mapCommonFields(item);
    return {
      _id: pickId(item),
      machine: String(item.machine ?? item.machine_name ?? item.name ?? '—'),
      camera_id: item.camera_id as string | undefined,
      ...common,
      idle_duration: item.idle_duration as string | undefined,
      operator_present: item.operator_present as boolean | undefined,
      status: 'active',
    };
  });
}

export function mapLoiteringFromApi(items: unknown[]): LoiteringAlert[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items.map((raw) => {
    const item = raw as Record<string, unknown>;
    const personCount = (item.person_count ?? item.box_count) as number | undefined;
    return {
      _id: pickId(item),
      camera_id: item.camera_id as string | undefined,
      ...mapCommonFields(item),
      person_count: personCount,
      box_count: personCount,
      duration: item.duration as string | undefined,
      status: 'active',
    };
  });
}

export function mapPpeFromApi(items: unknown[]): PpeAlert[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items.map((raw) => {
    const item = raw as Record<string, unknown>;
    return {
      _id: pickId(item),
      person_id: item.person_id as string | undefined,
      violation: String(item.violation ?? item.violation_type ?? 'PPE violation'),
      camera_id: item.camera_id as string | undefined,
      ...mapCommonFields(item),
      status: 'active',
    };
  });
}

export function mapPhoneFromApi(items: unknown[]): PhoneAlert[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items.map((raw) => {
    const item = raw as Record<string, unknown>;
    return {
      _id: pickId(item),
      person_id: item.person_id as string | undefined,
      camera_id: item.camera_id as string | undefined,
      ...mapCommonFields(item),
      duration: item.duration as string | undefined,
      status: 'active',
    };
  });
}

export function mapSleepFromApi(items: unknown[]): SleepAlert[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items.map((raw) => {
    const item = raw as Record<string, unknown>;
    return {
      _id: pickId(item),
      person_id: item.person_id as string | undefined,
      camera_id: item.camera_id as string | undefined,
      ...mapCommonFields(item),
      duration: item.duration as string | undefined,
      status: 'active',
    };
  });
}

export function mapSecurityFromApi(items: unknown[]): SecurityAlert[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  return items.map((raw) => {
    const item = raw as Record<string, unknown>;
    return {
      _id: pickId(item),
      camera_id: item.camera_id as string | undefined,
      ...mapCommonFields(item),
      violation_type: String(item.violation_type ?? item.violation ?? 'Security alert'),
      severity: (item.severity as SecurityAlert['severity']) ?? 'high',
      status: 'active',
    };
  });
}
