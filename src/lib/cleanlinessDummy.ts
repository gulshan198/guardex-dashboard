export type CleanlinessLiveItem = {
  id: string;
  cameraId: string;
  roomName: string;
  clean: boolean | null;
  path_status: boolean | null;
  cleanliness_score: number | null;
  time: string;
  reason: string;
  frameUrl: string;
};

export type CleanlinessAlertItem = {
  _id: string;
  alertType: 'cleanliness' | 'blocked_pathway';
  roomName: string;
  camera_id: string;
  logged_at: string;
  image_id?: string;
  /** Local public asset path (e.g. /alerts-images-list/foo.avif) */
  imageUrl?: string;
  status: 'active' | 'resolved' | 'expired';
  resolved_at?: string;
};

const CLEANLINESS_LIVE_FRAMES = [
  '/alerts-images-list/cleanliness_1.avif',
  '/alerts-images-list/cleanliness_2.avif',
  '/alerts-images-list/cleanliness_3.avif',
  '/alerts-images-list/cleanliness_4.avif',
  '/alerts-images-list/cleanliness_5.avif',
  '/alerts-images-list/cleanliness_6.avif',
] as const;

export const BLOCKED_PATHWAY_IMAGE = '/alerts-images-list/blocked_pathway.avif';

export const DUMMY_CLEANLINESS_LIVE: CleanlinessLiveItem[] = [
  {
    id: '1',
    cameraId: 'CAM-01',
    roomName: 'Chemical Lab',
    clean: true,
    path_status: true,
    cleanliness_score: 92,
    time: new Date().toISOString(),
    reason: 'All Clean',
    frameUrl: CLEANLINESS_LIVE_FRAMES[0],
  },
  {
    id: '2',
    cameraId: 'CAM-02',
    roomName: 'Blow Moulding Room',
    clean: false,
    path_status: false,
    cleanliness_score: 58,
    time: new Date(Date.now() - 15 * 60_000).toISOString(),
    reason: 'Not Clean',
    frameUrl: CLEANLINESS_LIVE_FRAMES[1],
  },
  {
    id: '3',
    cameraId: 'CAM-03',
    roomName: 'QC Department',
    clean: true,
    path_status: true,
    cleanliness_score: 88,
    time: new Date(Date.now() - 32 * 60_000).toISOString(),
    reason: 'All Clean',
    frameUrl: CLEANLINESS_LIVE_FRAMES[2],
  },
  {
    id: '4',
    cameraId: 'CAM-04',
    roomName: 'Loading Dock',
    clean: false,
    path_status: true,
    cleanliness_score: 64,
    time: new Date(Date.now() - 48 * 60_000).toISOString(),
    reason: 'Not Clean',
    frameUrl: CLEANLINESS_LIVE_FRAMES[3],
  },
  {
    id: '5',
    cameraId: 'CAM-05',
    roomName: 'Storage Aisle B',
    clean: true,
    path_status: false,
    cleanliness_score: 71,
    time: new Date(Date.now() - 70 * 60_000).toISOString(),
    reason: 'All Clean',
    frameUrl: CLEANLINESS_LIVE_FRAMES[4],
  },
  {
    id: '6',
    cameraId: 'CAM-06',
    roomName: 'QC Inspection',
    clean: null,
    path_status: null,
    cleanliness_score: null,
    time: new Date(Date.now() - 95 * 60_000).toISOString(),
    reason: 'Pending scan',
    frameUrl: CLEANLINESS_LIVE_FRAMES[5],
  },
];

export const DUMMY_CLEANLINESS_ALERTS: CleanlinessAlertItem[] = [
  {
    _id: 'bp-1',
    alertType: 'blocked_pathway',
    roomName: 'Storage Aisle B',
    camera_id: 'CAM-05',
    logged_at: new Date(Date.now() - 45 * 60_000).toISOString(),
    imageUrl: BLOCKED_PATHWAY_IMAGE,
    status: 'active',
  },
];

export const DUMMY_RESOLVED_CLEANLINESS: CleanlinessAlertItem[] = [
  {
    _id: 'res-bp-1',
    alertType: 'blocked_pathway',
    roomName: 'Loading Dock',
    camera_id: 'CAM-04',
    logged_at: new Date(Date.now() - 5 * 60 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 4 * 60 * 60_000).toISOString(),
    imageUrl: BLOCKED_PATHWAY_IMAGE,
    status: 'resolved',
  },
  {
    _id: 'res-cl-1',
    alertType: 'cleanliness',
    roomName: 'Warehouse Bay 3',
    camera_id: 'CAM-02',
    logged_at: new Date(Date.now() - 26 * 60 * 60_000).toISOString(),
    resolved_at: new Date(Date.now() - 25 * 60 * 60_000).toISOString(),
    imageUrl: CLEANLINESS_LIVE_FRAMES[1],
    status: 'resolved',
  },
];

export const DUMMY_PAST_CLEANLINESS: CleanlinessAlertItem[] = [];
