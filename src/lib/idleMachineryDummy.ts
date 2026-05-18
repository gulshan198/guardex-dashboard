export type IdleMachineryReportMachine = {
  name: string;
  understaffed: number;
  overstaffed: number;
  normalCount: number;
  audit: unknown[];
};

export type IdleMachineryReportCamera = {
  cameraId: string;
  roomName: string;
  zoneImageUrl: string | null;
  machines: IdleMachineryReportMachine[];
};

export type IdleMachineryReportPayload = {
  featureEnabled: boolean;
  idleStatsUpdatedAt: string | null;
  cameras: IdleMachineryReportCamera[];
};

/** Idle interval as [start, end] ISO strings */
function idleInterval(startMinsAgo: number, durationSec: number): [string, string] {
  const end = Date.now() - startMinsAgo * 60_000;
  const start = end - durationSec * 1000;
  return [new Date(start).toISOString(), new Date(end).toISOString()];
}

export const DUMMY_IDLE_MACHINERY_PAYLOAD: IdleMachineryReportPayload = {
  featureEnabled: true,
  idleStatsUpdatedAt: new Date().toISOString(),
  cameras: [
    {
      cameraId: 'CAM-01',
      roomName: 'Assembly Line A',
      zoneImageUrl: '/idle-machinery/cam_23_idle_machinery.jpg',
      machines: [
        {
          name: 'Machine 1',
          understaffed: 14,
          overstaffed: 2,
          normalCount: 52,
          audit: [
            idleInterval(240, 18 * 60),
            idleInterval(120, 6 * 60),
            idleInterval(45, 90),
          ],
        },
        {
          name: 'Machine 2',
          understaffed: 8,
          overstaffed: 5,
          normalCount: 38,
          audit: [idleInterval(180, 12 * 60), idleInterval(75, 4 * 60)],
        },
        {
          name: 'Machine 3',
          understaffed: 8,
          overstaffed: 5,
          normalCount: 38,
          audit: [idleInterval(180, 12 * 60), idleInterval(75, 4 * 60)],
        },
      ],
    },
    {
      cameraId: 'CAM-03',
      roomName: 'Packaging Zone',
      zoneImageUrl: '/idle-machinery/cam_26_idle_machinery.jpg',
      machines: [
        {
          name: 'Machine 1',
          understaffed: 6,
          overstaffed: 1,
          normalCount: 61,
          audit: [
            idleInterval(300, 22 * 60),
            idleInterval(150, 8 * 60),
          ],
        },
      ],
    },
    {
      cameraId: 'CAM-04',
      roomName: 'Packaging Zone',
      zoneImageUrl: '/idle-machinery/cam_27_idle_machinery.jpg',
      machines: [
        {
          name: 'Machine 1',
          understaffed: 6,
          overstaffed: 1,
          normalCount: 61,
          audit: [
            idleInterval(300, 22 * 60),
            idleInterval(150, 8 * 60),
          ],
        },
      ],
    },
  ],
};
