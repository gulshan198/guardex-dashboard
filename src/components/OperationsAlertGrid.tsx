import { AlertGridCard } from '@/components/AlertGridCard';
import { formatAlertTime } from '@/lib/formatTime';

type OperationsAlert = {
  _id: string;
  camera_id?: string;
  zone?: string;
  roomName?: string;
  box_count?: number;
  person_count?: number;
  frame_timestamp?: string;
  logged_at?: string;
  image_id?: string;
  emp_id?: string;
  name?: string;
};

type OperationsAlertGridProps = {
  featureId: string;
  items: OperationsAlert[];
  onResolve: (id: string, dataType: string, alertData: OperationsAlert) => void;
};

export function OperationsAlertGrid({
  featureId,
  items,
  onResolve,
}: OperationsAlertGridProps) {
  if (items.length === 0) {
    return (
      <p className='col-span-full text-center text-sm text-guardai-gray py-6'>
        No active alerts
      </p>
    );
  }

  return (
    <>
      {items.map((item) => {
        const location = item.zone || item.roomName || 'Unknown Location';
        const time = formatAlertTime(item.frame_timestamp ?? item.logged_at);

        if (featureId === 'loitering-detection') {
          return (
            <AlertGridCard
              key={item._id}
              alertType='Loitering'
              location={location}
              cameraId={item.camera_id}
              time={time}
              details={[
                {
                  label: 'People detected',
                  value: item.box_count ?? item.person_count ?? '—',
                },
              ]}
              imageId={item.image_id}
              onResolve={() => onResolve(item._id, 'loitering', item)}
            />
          );
        }
        if (featureId === 'machine-idle') {
          return (
            <AlertGridCard
              key={item._id}
              alertType='Idle Machinery'
              location={location}
              cameraId={item.camera_id}
              time={time}
              durationLabel='30 min idle'
              imageId={item.image_id}
              onResolve={() => onResolve(item._id, 'idle_machinery', item)}
            />
          );
        }
        if (featureId === 'employee-attendance') {
          return (
            <AlertGridCard
              key={item._id}
              alertType='Attendance'
              location={item.name || 'Unknown Employee'}
              cameraId={item.emp_id}
              time={item.frame_timestamp || 'N/A'}
              details={[{ label: 'Status', value: 'Present' }]}
              imageId={item.image_id}
              showResolve={false}
            />
          );
        }
        return null;
      })}
    </>
  );
}
