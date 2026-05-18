import type { DashboardAlertsState } from '@/types/dashboardAlerts';

const ago = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString();

/** Plant rooms used across dashboard + daily report */
export const PLANT_ROOM_NAMES = {
  chemicalLab: 'Chemical Lab',
  blowMoulding: 'Blow Moulding Room',
  qcDepartment: 'QC Department',
} as const;

/**
 * Active alerts scoped to Chemical Lab, Blow Moulding Room, and QC Department.
 * Counts align with the daily report “Alerts by area” chart (14 active total).
 */
export const DASHBOARD_ALERTS_SEED: DashboardAlertsState = {
  operations: {
    idleMachinery: [
      {
        _id: 'idle-1',
        machine: 'Mixer Line 2',
        camera_id: 'CAM-02',
        roomName: PLANT_ROOM_NAMES.blowMoulding,
        logged_at: ago(95),
        idle_duration: '18m',
        operator_present: false,
        status: 'resolved',
      },
    ],
    loitering: [
      {
        _id: 'loit-1',
        zone: 'Entry aisle',
        camera_id: 'CAM-04',
        roomName: PLANT_ROOM_NAMES.blowMoulding,
        logged_at: ago(45),
        person_count: 4,
        duration: '22m',
        status: 'active',
      },
      {
        _id: 'loit-2',
        zone: 'Moulding bay',
        camera_id: 'CAM-05',
        roomName: PLANT_ROOM_NAMES.blowMoulding,
        logged_at: ago(88),
        person_count: 3,
        duration: '15m',
        status: 'active',
      },
      {
        _id: 'loit-3',
        zone: 'Chemical storage',
        camera_id: 'CAM-07',
        roomName: PLANT_ROOM_NAMES.chemicalLab,
        logged_at: ago(62),
        person_count: 2,
        duration: '11m',
        status: 'active',
      },
    ],
  },
  compliance: {
    ppe: [
      {
        _id: 'ppe-1',
        person_id: 'EMP-1042',
        violation: 'Missing hairnet',
        camera_id: 'CAM-01',
        roomName: PLANT_ROOM_NAMES.chemicalLab,
        logged_at: ago(32),
        status: 'active',
      },
      {
        _id: 'ppe-2',
        person_id: 'EMP-0871',
        violation: 'No safety glasses',
        camera_id: 'CAM-06',
        roomName: PLANT_ROOM_NAMES.qcDepartment,
        logged_at: ago(76),
        status: 'active',
      },
      {
        _id: 'ppe-3',
        person_id: 'EMP-1102',
        violation: 'Missing gloves',
        camera_id: 'CAM-08',
        roomName: PLANT_ROOM_NAMES.chemicalLab,
        logged_at: ago(41),
        status: 'active',
      },
      {
        _id: 'ppe-4',
        person_id: 'EMP-1138',
        violation: 'No hairnet',
        camera_id: 'CAM-09',
        roomName: PLANT_ROOM_NAMES.chemicalLab,
        logged_at: ago(55),
        status: 'active',
      },
      {
        _id: 'ppe-5',
        person_id: 'EMP-1201',
        violation: 'Missing vest',
        camera_id: 'CAM-10',
        roomName: PLANT_ROOM_NAMES.chemicalLab,
        logged_at: ago(28),
        status: 'active',
      },
      {
        _id: 'ppe-6',
        person_id: 'EMP-1210',
        violation: 'No safety glasses',
        camera_id: 'CAM-11',
        roomName: PLANT_ROOM_NAMES.chemicalLab,
        logged_at: ago(19),
        status: 'active',
      },
      {
        _id: 'ppe-7',
        person_id: 'EMP-1222',
        violation: 'Missing hairnet',
        camera_id: 'CAM-12',
        roomName: PLANT_ROOM_NAMES.qcDepartment,
        logged_at: ago(24),
        status: 'active',
      },
      {
        _id: 'ppe-8',
        person_id: 'EMP-1230',
        violation: 'No gloves',
        camera_id: 'CAM-03',
        roomName: PLANT_ROOM_NAMES.blowMoulding,
        logged_at: ago(36),
        status: 'active',
      },
    ],
    phone: [
      {
        _id: 'phone-1',
        person_id: 'EMP-1203',
        camera_id: 'CAM-13',
        roomName: PLANT_ROOM_NAMES.blowMoulding,
        logged_at: ago(18),
        duration: '6m',
        status: 'active',
      },
    ],
    sleep: [],
  },
  security: {
    perimeter: [],
    restricted: [
      {
        _id: 'rest-1',
        camera_id: 'CAM-14',
        roomName: PLANT_ROOM_NAMES.chemicalLab,
        logged_at: ago(28),
        violation_type: 'Restricted zone breach',
        severity: 'critical',
        status: 'active',
      },
      {
        _id: 'rest-2',
        camera_id: 'CAM-15',
        roomName: PLANT_ROOM_NAMES.qcDepartment,
        logged_at: ago(44),
        violation_type: 'Unauthorized access',
        severity: 'high',
        status: 'active',
      },
    ],
    fireSmoke: [],
  },
};
