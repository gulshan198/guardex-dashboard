export type VmsCamera = {
  id: string;
  name: string;
  enabled: boolean;
  videoSrc?: string;
};

export type VmsEvidenceItem = {
  id: string;
  kind: 'image' | 'video';
  src: string;
  label: string;
};

export type VmsEvidenceSeverity = 'critical' | 'high' | 'medium';

export type VmsEvidenceAlert = {
  id: string;
  cameraId: string;
  title: string;
  violation: string;
  location: string;
  loggedAt: string;
  duration: string;
  category: string;
  status: 'active' | 'reviewed';
  severity: VmsEvidenceSeverity;
  bookmarked: boolean;
  /** Display label on vault card, e.g. CAM-01 */
  cameraLabel: string;
  /** Display time on vault card, e.g. 14:32:18 */
  timeLabel: string;
  /** Thumbnail shown on the evidence vault card */
  imageUrl: string;
  /** Evidence clip — pattern: /videos/evidence_{cameraNum}.mp4 */
  evidenceVideoSrc: string;
};

const EVIDENCE_THUMBNAILS = [
  '/videos/1.png',
  '/videos/2.png',
  '/videos/3.png',
  '/videos/4.png',
] as const;

const VMS_VIDEO_SOURCES: { name: string; videoSrc: string }[] = [
  { name: 'Camera 1', videoSrc: '/videos/01.mov' },
  { name: 'Camera 2', videoSrc: '/videos/02.mp4' },
  { name: 'Camera 3', videoSrc: '/videos/03.mp4' },
  { name: 'Camera 4', videoSrc: '/videos/04.mp4' },
  { name: 'Camera 5', videoSrc: '/videos/05.mp4' },
  { name: 'Camera 6', videoSrc: '/videos/06.mp4' },
  { name: 'Camera 7', videoSrc: '/videos/07.mp4' },
  { name: 'Camera 8', videoSrc: '/videos/08.mp4' },
  { name: 'Camera 9', videoSrc: '/videos/09.mp4' },
  { name: 'Camera 10', videoSrc: '/videos/010.mp4' },
  { name: 'Camera 11', videoSrc: '/videos/011.mov' },
  { name: 'Camera 12', videoSrc: '/videos/01.mov' },
  // { name: 'Camera 10', videoSrc: '/videos/10.mp4' },
];

export const VMS_GRID_COLS = 4;
export const VMS_GRID_ROWS = 4;
/** Manual focus spans 2×2 cells on the mosaic grid. */
export const VMS_FOCUS_SPAN = 2;

export const vmsCameras: VmsCamera[] = Array.from({ length: 16 }, (_, index) => {
  const num = index + 1;
  const id = `cam-${String(num).padStart(2, '0')}`;
  const feed = VMS_VIDEO_SOURCES[index];

  if (feed) {
    return {
      id,
      name: feed.name,
      enabled: true,
      videoSrc: feed.videoSrc,
    };
  }

  return {
    id,
    name: `Camera ${num}`,
    enabled: false,
  };
});

/** Camera numbers for evidence clips (alert index → evidence_{n}.mp4). */
const EVIDENCE_CAMERA_NUMS = [5, 7, 9, 10, 7] as const;

function evidenceVideoPath(cameraNum: number): string {
  return `/videos/evidence_${cameraNum}.mp4`;
}

/** Evidence vault alerts — matches Live View evidence card UI. */
export const vmsEvidenceAlerts: VmsEvidenceAlert[] = [
  {
    id: 'ev-01',
    cameraId: 'cam-01',
    title: 'Intrusion',
    violation: 'Intrusion detected',
    location: 'Chemical lab',
    loggedAt: 'Today, 2:32 PM',
    duration: '4 mins',
    category: 'SECURITY',
    status: 'active',
    severity: 'critical',
    bookmarked: true,
    cameraLabel: 'CAM-01',
    timeLabel: '14:32:18',
    imageUrl: EVIDENCE_THUMBNAILS[0],
    evidenceVideoSrc: evidenceVideoPath(EVIDENCE_CAMERA_NUMS[0]),
  },
  {
    id: 'ev-02',
    cameraId: 'cam-04',
    title: 'Loitering',
    violation: 'Loitering detected',
    location: 'Storage bay',
    loggedAt: 'Today, 2:28 PM',
    duration: '12 mins',
    category: 'SECURITY',
    status: 'active',
    severity: 'high',
    bookmarked: false,
    cameraLabel: 'CAM-04',
    timeLabel: '14:28:05',
    imageUrl: EVIDENCE_THUMBNAILS[1],
    evidenceVideoSrc: evidenceVideoPath(EVIDENCE_CAMERA_NUMS[1]),
  },
  {
    id: 'ev-03',
    cameraId: 'cam-07',
    title: 'Phone usage',
    violation: 'Phone usage detected',
    location: 'Chemical lab',
    loggedAt: 'Today, 2:15 PM',
    duration: '2 mins',
    category: 'SECURITY',
    status: 'active',
    severity: 'critical',
    bookmarked: true,
    cameraLabel: 'CAM-07',
    timeLabel: '14:15:42',
    imageUrl: EVIDENCE_THUMBNAILS[2],
    evidenceVideoSrc: evidenceVideoPath(EVIDENCE_CAMERA_NUMS[2]),
  },
  {
    id: 'ev-04',
    cameraId: 'cam-15',
    title: 'Sleeping',
    violation: 'Sleeping detected',
    location: 'QC Department',
    loggedAt: 'Today, 1:12 PM',
    duration: '6 mins',
    category: 'COMPLIANCE',
    status: 'active',
    severity: 'medium',
    bookmarked: false,
    cameraLabel: 'CAM-15',
    timeLabel: '13:12:08',
    imageUrl: EVIDENCE_THUMBNAILS[3],
    evidenceVideoSrc: evidenceVideoPath(EVIDENCE_CAMERA_NUMS[3]),
  },
  {
    id: 'ev-05',
    cameraId: 'cam-11',
    title: 'Loitering',
    violation: 'Loitering detected',
    location: 'Storage bay',
    loggedAt: 'Today, 12:55 PM',
    duration: '1 min',
    category: 'SECURITY',
    status: 'active',
    severity: 'critical',
    bookmarked: true,
    cameraLabel: 'CAM-11',
    timeLabel: '12:55:44',
    imageUrl: EVIDENCE_THUMBNAILS[0],
    evidenceVideoSrc: evidenceVideoPath(EVIDENCE_CAMERA_NUMS[4]),
  },
];

export const DEFAULT_VMS_ALERT_ID = vmsEvidenceAlerts[0]?.id ?? 'ev-01';

export function getVmsCameraById(cameraId: string): VmsCamera | undefined {
  return vmsCameras.find((c) => c.id === cameraId);
}

export function getEvidenceAlertById(alertId: string): VmsEvidenceAlert | undefined {
  return vmsEvidenceAlerts.find((a) => a.id === alertId);
}

export function getEvidenceAlertVideoSrc(alert: VmsEvidenceAlert): string {
  return alert.evidenceVideoSrc;
}

export function getEvidenceAlertImageSrc(alert: VmsEvidenceAlert): string {
  return alert.imageUrl;
}

export function getAlertEvidenceItems(alert: VmsEvidenceAlert): VmsEvidenceItem[] {
  return [
    {
      id: `${alert.id}-clip`,
      kind: 'video',
      src: alert.evidenceVideoSrc,
      label: 'Video clip',
    },
    {
      id: `${alert.id}-snapshot`,
      kind: 'image',
      src: alert.imageUrl,
      label: 'Snapshot',
    },
    
  ];
}
