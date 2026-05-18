import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  Search,
  Filter,
  X,
  AlertTriangle,
  Clock,
  Camera,
  Calendar,
  Settings,
  MapPin,
  Zap,
  Shield,
  Flame,
  User,
  Phone,
  HardHat,
  Users,
  Activity,
  TrendingUp,
  AlertCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Priority configuration - easily customizable
export const ALERT_PRIORITIES = {
  CRITICAL: {
    level: 1,
    name: 'Critical',
    color: 'bg-red-600',
    textColor: 'text-white',
    icon: Flame,
    description: 'Immediate action required',
  },
  HIGH: {
    level: 2,
    name: 'High',
    color: 'bg-orange-500',
    textColor: 'text-white',
    icon: AlertTriangle,
    description: 'Urgent attention needed',
  },
  MEDIUM: {
    level: 3,
    name: 'Medium',
    color: 'bg-yellow-500',
    textColor: 'text-white',
    icon: Shield,
    description: 'Monitor closely',
  },
  LOW: {
    level: 4,
    name: 'Low',
    color: 'bg-blue-500',
    textColor: 'text-white',
    icon: Bell,
    description: 'Routine monitoring',
  },
};

// Alert types configuration - easily customizable
export const ALERT_TYPES = {
  FIRE_SMOKE: {
    id: 'fire_smoke',
    name: 'Fire & Smoke',
    icon: Flame,
    defaultPriority: 'CRITICAL',
    color: 'bg-red-100 text-red-800',
    description: 'Fire or smoke detection',
  },
  UNAUTHORIZED_ENTRY: {
    id: 'unauthorized_entry',
    name: 'Unauthorized Entry',
    icon: Shield,
    defaultPriority: 'HIGH',
    color: 'bg-orange-100 text-orange-800',
    description: 'Unauthorized access detected',
  },
  PPE_VIOLATION: {
    id: 'ppe_compliance',
    name: 'PPE Violation',
    icon: HardHat,
    defaultPriority: 'MEDIUM',
    color: 'bg-yellow-100 text-yellow-800',
    description: 'Safety equipment violation',
  },
  PHONE_USAGE: {
    id: 'phone',
    name: 'Phone Usage',
    icon: Phone,
    defaultPriority: 'LOW',
    color: 'bg-blue-100 text-blue-800',
    description: 'Unauthorized phone usage',
  },
  SLEEPING: {
    id: 'sleeping',
    name: 'Sleeping on Job',
    icon: User,
    defaultPriority: 'MEDIUM',
    color: 'bg-purple-100 text-purple-800',
    description: 'Employee sleeping detected',
  },
  LOITERING: {
    id: 'loitering',
    name: 'Loitering',
    icon: Users,
    defaultPriority: 'LOW',
    color: 'bg-gray-100 text-gray-800',
    description: 'Unauthorized loitering',
  },
  IDLE_MACHINERY: {
    id: 'idle_machinery',
    name: 'Idle Machinery',
    icon: Activity,
    defaultPriority: 'MEDIUM',
    color: 'bg-indigo-100 text-indigo-800',
    description: 'Machinery not in use',
  },
  ATTENDANCE: {
    id: 'attendance',
    name: 'Attendance',
    icon: Calendar,
    defaultPriority: 'LOW',
    color: 'bg-green-100 text-green-800',
    description: 'Attendance tracking',
  },
};

// Clean Alert Item Component
interface AlertItemProps {
  alert: any;
  onResolve: (id: string) => void;
  priorityConfig: typeof ALERT_PRIORITIES;
  typeConfig: typeof ALERT_TYPES;
  isResolving?: boolean;
}

const AlertItem = ({
  alert,
  onResolve,
  priorityConfig,
  typeConfig,
  isResolving = false,
}: AlertItemProps) => {
  const priority =
    priorityConfig[alert.priority as keyof typeof priorityConfig] ||
    priorityConfig.MEDIUM;
  const alertType =
    typeConfig[alert.type as keyof typeof typeConfig] || typeConfig.LOITERING;
  const PriorityIcon = priority.icon;
  const TypeIcon = alertType.icon;

  // Get background color based on priority
  const getRowBackgroundColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'CRITICAL':
        return 'bg-red-50/50 border-l-4 border-l-red-500';
      case 'HIGH':
        return 'bg-orange-50/50 border-l-4 border-l-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-50/50 border-l-4 border-l-yellow-500';
      case 'LOW':
        return 'bg-blue-50/50 border-l-4 border-l-blue-500';
      default:
        return 'bg-gray-50/50 border-l-4 border-l-gray-500';
    }
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'border-b border-gray-100 transition-colors',
        getRowBackgroundColor(alert.priority),
        'hover:bg-opacity-80'
      )}
    >
      <td className='px-4 py-3'>
        <div className='flex items-center gap-2'>
          <div className={cn('p-1 rounded', priority.color)}>
            <PriorityIcon size={12} className={priority.textColor} />
          </div>
          <div className='flex items-center gap-1'>
            <Badge className={cn('text-xs', alertType.color)}>
              <TypeIcon size={8} className='mr-1' />
              {alertType.name}
            </Badge>
            <Badge
              variant='outline'
              className={cn(
                'text-xs border',
                priority.color,
                priority.textColor
              )}
            >
              {priority.name}
            </Badge>
          </div>
        </div>
      </td>
      <td className='px-4 py-3 text-sm text-gray-900'>
        {alert.description || alertType.description}
      </td>
      <td className='px-4 py-3 text-sm text-gray-500'>
        {new Date(alert.timestamp || alert.logged_at).toLocaleTimeString()}
      </td>
      <td className='px-4 py-3 text-sm text-gray-500'>{alert.camera_id}</td>
      <td className='px-4 py-3 text-sm text-gray-500'>
        {alert.zone || 'Unknown'}
      </td>
      <td className='px-4 py-3'>
        <div className='flex items-center gap-1'>
          <Button
            variant='ghost'
            size='sm'
            onClick={(event) => {
              console.log('Resolve button clicked for alert:', alert._id);
              onResolve(alert._id);
            }}
            disabled={isResolving}
            className={cn(
              'h-7 w-7 p-0 text-green-600 hover:text-green-700',
              isResolving && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isResolving ? (
              <div className='w-3 h-3 border-2 border-green-600 border-t-transparent rounded-full animate-spin' />
            ) : (
              <X size={12} />
            )}
          </Button>
        </div>
      </td>
    </motion.tr>
  );
};

// Clean Priority Queue Component
interface PriorityQueueProps {
  title: string;
  alerts: any[];
  priority: string;
  onResolve: (id: string) => void;
  priorityConfig: typeof ALERT_PRIORITIES;
  typeConfig: typeof ALERT_TYPES;
  resolvingAlerts: Set<string>;
}

const PriorityQueue = ({
  title,
  alerts,
  priority,
  onResolve,
  priorityConfig,
  typeConfig,
  resolvingAlerts,
}: PriorityQueueProps) => {
  const priorityInfo = priorityConfig[priority as keyof typeof priorityConfig];
  const PriorityIcon = priorityInfo?.icon || AlertTriangle;

  return (
    <Card className='h-full border-0 shadow-sm'>
      <CardHeader className='pb-3 px-4 pt-4'>
        <CardTitle className='text-base flex items-center gap-2'>
          <div className={cn('p-1.5 rounded-md', priorityInfo?.color)}>
            <PriorityIcon size={14} className={priorityInfo?.textColor} />
          </div>
          <span className='font-medium'>{title}</span>
          <Badge className='ml-auto text-xs'>{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className='pt-0 px-0 pb-0'>
        <div className='max-h-80 overflow-y-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Description
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Time
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Camera
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Zone
                </th>
                <th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {alerts.map((alert) => (
                  <AlertItem
                    key={alert._id}
                    alert={alert}
                    onResolve={onResolve}
                    priorityConfig={priorityConfig}
                    typeConfig={typeConfig}
                    isResolving={resolvingAlerts.has(alert._id)}
                  />
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {alerts.length === 0 && (
            <div className='text-center py-8 text-gray-400'>
              <Bell size={20} className='mx-auto mb-2 opacity-50' />
              <p className='text-sm'>No alerts</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Live Alert Console Component
export default function AlertsPage() {
  console.log('AlertsPage component rendering...');

  const [alerts, setAlerts] = useState<any[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvingAlerts, setResolvingAlerts] = useState<Set<string>>(
    new Set()
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Helper function to map frontend alert types to backend enum values
  const getAlertTypeForBackend = (frontendType: string): string => {
    const typeMapping: { [key: string]: string } = {
      fire_smoke: 'fire_smoke',
      unauthorized_entry: 'restricted',
      ppe_violation: 'ppe_compliance',
      phone_usage: 'phone',
      sleeping: 'sleeping',
      idle_machinery: 'idle_machinery',
      attendance: 'attendance',
      loitering: 'loitering',
    };

    return typeMapping[frontendType] || 'loitering'; // default fallback
  };

  // Fetch alerts from all endpoints
  const fetchAlerts = async () => {
    try {
      console.log('Fetching alerts from all endpoints...');
      const endpoints = [
        '/alerts/loitering',
        '/alerts/ppe-compliance',
        '/alerts/restricted',
        '/alerts/sleeping',
        '/alerts/phone',
        '/alerts/idle_machinery',
        '/alerts/attendance',
        '/alerts/fire-smoke',
      ];

      const responses = await Promise.all(
        endpoints.map((endpoint) => api.get(endpoint))
      );

      const allAlerts = responses.flatMap((response) => response.data);
      console.log('Fetched total alerts:', allAlerts.length);

      // Process alerts with priority and type
      const processedAlerts = allAlerts.map((alert: any) => {
        console.log(
          'Processing alert with violation_type:',
          alert.violation_type
        );
        let priority = 'MEDIUM';
        let type = 'LOITERING';

        // Determine priority and type based on violation_type
        if (alert.violation_type === 'fire_smoke') {
          priority = 'CRITICAL';
          type = 'FIRE_SMOKE';
        } else if (alert.violation_type === 'unauthorized_entry') {
          priority = 'HIGH';
          type = 'UNAUTHORIZED_ENTRY';
        } else if (
          alert.violation_type === 'PPE' ||
          alert.violation_type === 'ppe'
        ) {
          priority = 'MEDIUM';
          type = 'PPE_VIOLATION';
        } else if (alert.violation_type === 'on_phone') {
          priority = 'LOW';
          type = 'PHONE_USAGE';
        } else if (alert.violation_type === 'sleeping') {
          priority = 'MEDIUM';
          type = 'SLEEPING';
        } else if (alert.violation_type === 'idle_machinery') {
          priority = 'MEDIUM';
          type = 'IDLE_MACHINERY';
        } else if (alert.alert_type === 'attendance') {
          priority = 'LOW';
          type = 'ATTENDANCE';
        }

        return {
          ...alert,
          priority,
          type,
          status: 'active',
        };
      });

      setAlerts(processedAlerts);
      setFilteredAlerts(processedAlerts);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
      setError('Failed to fetch alerts');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Update filtered alerts when alerts change
  useEffect(() => {
    setFilteredAlerts(alerts);
  }, [alerts]);

  // Group alerts by priority
  const criticalAlerts = filteredAlerts.filter(
    (alert) => alert.priority === 'CRITICAL'
  );
  const highAlerts = filteredAlerts.filter(
    (alert) => alert.priority === 'HIGH'
  );
  const mediumAlerts = filteredAlerts.filter(
    (alert) => alert.priority === 'MEDIUM'
  );
  const lowAlerts = filteredAlerts.filter((alert) => alert.priority === 'LOW');

  const handleResolve = async (id: string) => {
    try {
      console.log('Resolving alert:', id);

      if (!id) {
        console.error('No alert ID provided');
        return;
      }

      // Add to resolving set
      setResolvingAlerts((prev) => new Set([...prev, id]));

      // Create resolved alert in database (soft delete)
      const alertToResolve = alerts.find((alert) => alert._id === id);

      if (!alertToResolve) {
        console.error('Alert not found:', id);
        setResolvingAlerts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        return;
      }

      const resolvedAlertData = {
        originalAlertId: id,
        alertType: getAlertTypeForBackend(
          alertToResolve.type?.toLowerCase() || 'unknown'
        ),
        page: 'alerts',
        originalData: alertToResolve,
        resolvedBy: 'Admin',
      };

      console.log('Alert type being processed:', alertToResolve.type);
      console.log(
        'Mapped alert type for backend:',
        getAlertTypeForBackend(alertToResolve.type?.toLowerCase() || 'unknown')
      );
      console.log('Resolved alert data:', resolvedAlertData);

      // Create resolved alert entry
      const createResponse = await api.post(
        '/resolved-alerts',
        resolvedAlertData
      );

      // Delete the original alert from MongoDB
      const deleteResponse = await api.delete(`/alerts/${id}`);

      // Remove from local state
      setAlerts((prev) => prev.filter((alert) => alert._id !== id));
      setFilteredAlerts((prev) => prev.filter((alert) => alert._id !== id));

      console.log('Alert resolved and deleted successfully:', id);

      // Show success message
      setSuccessMessage(`Alert resolved successfully!`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Failed to resolve alert:', error);
      console.error('Error details:', error.response?.data || error.message);

      // Show user-friendly error message
      if (error.response?.status === 404) {
        console.error('Alert not found on server');
      } else if (error.response?.status === 500) {
        console.error('Server error occurred');
      } else {
        console.error('Network or other error:', error.message);
      }
    } finally {
      // Remove from resolving set
      setResolvingAlerts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  return (
    <div className='bg-gray-50'>
      <div className='p-6 space-y-6'>
        {/* Error Display */}
        {error && (
          <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded'>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded'>
            <strong>Success:</strong> {successMessage}
          </div>
        )}

        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              Live Alert Console
            </h1>
            <p className='text-gray-600 mt-1'>
              Real-time monitoring and response center
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className='bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded'>
            <strong>Loading alerts...</strong>
          </div>
        )}

        {/* Priority Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          <Card className='border-l-4 border-l-red-500'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Critical</p>
                  <p className='text-2xl font-bold text-red-600'>
                    {criticalAlerts.length}
                  </p>
                </div>
                <AlertTriangle className='h-8 w-8 text-red-500' />
              </div>
            </CardContent>
          </Card>
          <Card className='border-l-4 border-l-orange-500'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>High</p>
                  <p className='text-2xl font-bold text-orange-600'>
                    {highAlerts.length}
                  </p>
                </div>
                <AlertTriangle className='h-8 w-8 text-orange-500' />
              </div>
            </CardContent>
          </Card>
          <Card className='border-l-4 border-l-yellow-500'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Medium</p>
                  <p className='text-2xl font-bold text-yellow-600'>
                    {mediumAlerts.length}
                  </p>
                </div>
                <Shield className='h-8 w-8 text-yellow-500' />
              </div>
            </CardContent>
          </Card>
          <Card className='border-l-4 border-l-blue-500'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-medium text-gray-600'>Low</p>
                  <p className='text-2xl font-bold text-blue-600'>
                    {lowAlerts.length}
                  </p>
                </div>
                <Bell className='h-8 w-8 text-blue-500' />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Queues - Vertical Layout */}
        <div className='space-y-6'>
          {/* Critical Alerts */}
          <PriorityQueue
            title='Critical Alerts'
            alerts={criticalAlerts}
            priority='CRITICAL'
            onResolve={handleResolve}
            priorityConfig={ALERT_PRIORITIES}
            typeConfig={ALERT_TYPES}
            resolvingAlerts={resolvingAlerts}
          />

          {/* High Priority Alerts */}
          <PriorityQueue
            title='High Priority'
            alerts={highAlerts}
            priority='HIGH'
            onResolve={handleResolve}
            priorityConfig={ALERT_PRIORITIES}
            typeConfig={ALERT_TYPES}
            resolvingAlerts={resolvingAlerts}
          />

          {/* Medium Priority Alerts */}
          <PriorityQueue
            title='Medium Priority'
            alerts={mediumAlerts}
            priority='MEDIUM'
            onResolve={handleResolve}
            priorityConfig={ALERT_PRIORITIES}
            typeConfig={ALERT_TYPES}
            resolvingAlerts={resolvingAlerts}
          />

          {/* Low Priority Alerts */}
          <PriorityQueue
            title='Low Priority'
            alerts={lowAlerts}
            priority='LOW'
            onResolve={handleResolve}
            priorityConfig={ALERT_PRIORITIES}
            typeConfig={ALERT_TYPES}
            resolvingAlerts={resolvingAlerts}
          />
        </div>
      </div>
    </div>
  );
}
