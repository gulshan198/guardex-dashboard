import { AlertGridCard } from '@/components/AlertGridCard';
import { formatAlertTime } from '@/lib/formatTime';

type SecurityAlert = {
  _id: string;
  camera_id?: string;
  logged_at?: string;
  frame_timestamp?: string;
  image_id?: string;
  violation_type?: string;
  zone?: string;
  roomName?: string;
};

type SecurityAlertGridProps = {
  featureId: string;
  alerts: SecurityAlert[];
  onResolve: (id: string, data: SecurityAlert, type: string) => void;
};

export function SecurityAlertGrid({
  featureId,
  alerts,
  onResolve,
}: SecurityAlertGridProps) {
  if (alerts.length === 0) {
    return (
      <p className='col-span-full text-center text-sm text-guardai-gray py-6'>
        No active alerts
      </p>
    );
  }

  return (
    <>
      {alerts.map((item) => {
        const location = item.zone || item.roomName || 'Unknown Location';
        const time = formatAlertTime(item.frame_timestamp ?? item.logged_at);

        if (featureId === 'perimeter-security') {
          return (
            <AlertGridCard
              key={item._id}
              alertType='Unauthorized Entry'
              location={location || 'Perimeter'}
              cameraId={item.camera_id}
              time={time}
              imageId={item.image_id}
              onResolve={() => onResolve(item._id, item, 'unauthorized_entry')}
            />
          );
        }
        if (featureId === 'restricted-access') {
          return (
            <AlertGridCard
              key={item._id}
              alertType={item.violation_type || 'Restricted Access'}
              location={location || 'Restricted Zone'}
              cameraId={item.camera_id}
              time={time}
              imageId={item.image_id}
              onResolve={() => onResolve(item._id, item, 'restricted')}
            />
          );
        }
        return (
          <AlertGridCard
            key={item._id}
            alertType={item.violation_type || 'Fire & Smoke'}
            location={location || 'Perimeter'}
            cameraId={item.camera_id}
            time={time}
            imageId={item.image_id}
            onResolve={() => onResolve(item._id, item, 'fire_smoke')}
          />
        );
      })}
    </>
  );
}
