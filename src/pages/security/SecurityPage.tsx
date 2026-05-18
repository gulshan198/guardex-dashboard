import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Eye, Flame, Activity, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { api, apiUrl } from '@/lib/api';
import { ViewTypeToggle } from '@/components/ViewTypeToggle';
import { AlertGridCard } from '@/components/AlertGridCard';
import { useViewType } from '@/hooks/useViewType';
import { SecurityAlertGrid } from '@/components/SecurityAlertGrid';
import { useDashboardAlerts } from '@/contexts/DashboardAlertsContext';
import { mapSecurityFromApi } from '@/lib/mapApiAlerts';
import { formatAlertTime } from '@/lib/formatTime';

type FireSmokeAlert = {
  id: string;
  camera_id: string;
  frame_timestamp: string;
  logged_at: string;
  image_id: string;
  box_count: number;
  violation_type: string;
  _id: string;
};

export default function SecurityPage() {
  const {
    alerts: dashboardAlerts,
    setSecurityPerimeter,
    setSecurityRestricted,
    setSecurityFireSmoke,
    removeAlert,
  } = useDashboardAlerts();
  const [fireSmokeAlerts, setFireSmokeAlerts] = useState<FireSmokeAlert[]>(
    dashboardAlerts.security.fireSmoke as FireSmokeAlert[]
  );
  const [restrictedAccessAlerts, setRestrictedAccessAlerts] = useState(
    dashboardAlerts.security.restricted
  );
  const [perimeterAlerts, setPerimeterAlerts] = useState(
    dashboardAlerts.security.perimeter
  );
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const { viewType, handleViewChange } = useViewType('security-view-type');

  // Fetch resolved alerts from database
  const fetchResolvedAlerts = async () => {
    try {
      const response = await api.get('/resolved-alerts/security');
      setResolvedAlerts(response.data);
    } catch (error) {
      console.error('Failed to fetch resolved alerts:', error);
    }
  };

  // Load resolved alerts on component mount
  useEffect(() => {
    fetchResolvedAlerts();
  }, []);

  // Add resolve functionality
  const handleResolve = async (
    id: string,
    alertData: any,
    alertType: string
  ) => {
    try {
      // Create resolved alert in database (soft delete)
      const resolvedAlertData = {
        originalAlertId: id,
        alertType: alertType,
        page: 'security',
        originalData: alertData,
        resolvedBy: 'Admin',
      };

      await api.post('/resolved-alerts', resolvedAlertData);

      // Delete the original alert from the database
      await api.delete(`/alerts/${id}`);

      // Refresh resolved alerts from database
      await fetchResolvedAlerts();

      // Update the appropriate state based on alert type
      if (alertType === 'fire_smoke') {
        setFireSmokeAlerts((prev) => prev.filter((item) => item._id !== id));
        removeAlert('security', 'fireSmoke', id);
      } else if (alertType === 'restricted') {
        setRestrictedAccessAlerts((prev) =>
          prev.filter((item) => item._id !== id)
        );
        removeAlert('security', 'restricted', id);
      } else if (alertType === 'unauthorized_entry') {
        setPerimeterAlerts((prev) => prev.filter((item) => item._id !== id));
        removeAlert('security', 'perimeter', id);
      }
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  const fetchRestrictedAccessAlerts = async () => {
    try {
      const res = await api.get('/alerts/restricted');
      const mapped = mapSecurityFromApi(res.data);
      if (mapped.length > 0) {
        setRestrictedAccessAlerts(mapped);
        setSecurityRestricted(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch restricted access alerts', err);
    }
  };

  const fetchPerimeterAlerts = async () => {
    setPerimeterAlerts(dashboardAlerts.security.perimeter);
    setSecurityPerimeter(dashboardAlerts.security.perimeter);
  };

  useEffect(() => {
    const fetchFireSmokeAlerts = async () => {
      try {
        const res = await api.get('/alerts/fire-smoke');
        const mapped = mapSecurityFromApi(res.data);
        if (mapped.length > 0) {
          setFireSmokeAlerts(mapped as FireSmokeAlert[]);
          setSecurityFireSmoke(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch fire/smoke alerts', err);
      }
    };

    fetchFireSmokeAlerts();
    fetchRestrictedAccessAlerts();
    fetchPerimeterAlerts();

    const interval = setInterval(() => {
      fetchFireSmokeAlerts();
      fetchRestrictedAccessAlerts();
      // fetchPerimeterAlerts(); // Disabled until perimeter alerts are added
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'active':
        return 'border-green-500 bg-green-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const getCountColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'active':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const securityFeatures = [
    {
      id: 'perimeter-security',
      title: 'Perimeter Security',
      description: 'Monitor unauthorized entry and perimeter breaches',
      icon: Shield,
      status: 'active',
      count: perimeterAlerts.length,
      details: {
        unauthorizedEntries: 0,
        camerasCovered: '100%',
        lastIncident: 'None today',
      },
      data: {
        alerts: perimeterAlerts,
      },
    },
    {
      id: 'restricted-access',
      title: 'Restricted Access',
      description: 'Monitor unauthorized access to restricted zones',
      icon: Eye,
      status: restrictedAccessAlerts.length > 0 ? 'critical' : 'active',
      count: restrictedAccessAlerts.length,
      details: {
        unauthorizedAttempts: restrictedAccessAlerts.length,
        restrictedZones: 8,
        lastIncident:
          restrictedAccessAlerts.length > 0 ? 'Recent' : 'None today',
      },
      data: {
        alerts: restrictedAccessAlerts,
      },
    },
    {
      id: 'fire-water-detection',
      title: 'Fire & Smoke Detection',
      description: 'Environmental hazard and leak monitoring',
      icon: Flame,
      status: fireSmokeAlerts.length > 0 ? 'warning' : 'active',
      count: fireSmokeAlerts.length,
      details: {
        fireAlerts: fireSmokeAlerts.length,
        smokeAlerts: 0,
        sos: 'False',
      },
      data: {
        alerts: fireSmokeAlerts,
      },
    },
  ];

  return (
    <div className='h-screen flex flex-col'>
      <motion.div
        variants={containerVariants}
        initial='hidden'
        animate='visible'
        className='p-6 flex-shrink-0'
      >
        <motion.div
          variants={itemVariants}
          className='flex items-center gap-3 mb-1'
        >
          <Shield size={28} className='text-guardai-red' />
          <h1 className='text-2xl font-semibold text-guardai-darkgray'>
            Security Dashboard
          </h1>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className='text-guardai-gray mb-4 ml-9'
        >
          Comprehensive security monitoring including perimeter protection,
          quality control, and hazard detection.
        </motion.p>

        {/* Tab Navigation */}
        <motion.div variants={itemVariants} className='ml-9 mr-6 mb-4 flex items-center gap-3'>
          <div className='flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit'>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'active'
                  ? 'bg-white text-guardai-red shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active Alerts
            </button>
            <button
              onClick={() => setActiveTab('resolved')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'resolved'
                  ? 'bg-white text-guardai-red shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Resolved Alerts
            </button>
          </div>
          <div className='flex-1' />
          {activeTab === 'active' && (
            <ViewTypeToggle viewType={viewType} onViewChange={handleViewChange} />
          )}
        </motion.div>
      </motion.div>

      <ScrollArea className='flex-1 px-6'>
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='space-y-6 pb-6'
        >
          {activeTab === 'resolved' ? (
            <motion.div variants={itemVariants}>
              <Card className='border-2 shadow-lg w-full bg-white'>
                <CardHeader className='p-4 pb-2'>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center gap-3'>
                      <div className='bg-green-500/10 p-2 rounded-lg'>
                        <CheckCircle size={24} className='text-green-500' />
                      </div>
                      <div className='bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium'>
                        {resolvedAlerts.length}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <div className='w-3 h-3 rounded-full bg-green-500'></div>
                      <Activity size={12} className='text-green-500' />
                      <span className='text-xs text-guardai-gray capitalize'>
                        Resolved
                      </span>
                    </div>
                  </div>
                  <CardTitle className='text-lg font-semibold text-guardai-darkgray'>
                    Resolved Security Alerts
                  </CardTitle>
                  <p className='text-sm text-guardai-gray'>
                    History of all resolved fire & smoke detection alerts
                  </p>
                </CardHeader>
                <CardContent className='p-4 pt-0'>
                  <div className='border rounded-lg overflow-hidden'>
                    <Table>
                      <TableHeader>
                        <TableRow className='bg-guardai-red/5'>
                          <TableHead className='text-xs text-guardai-darkgray'>
                            Alert Type
                          </TableHead>
                          <TableHead className='text-xs text-guardai-darkgray'>
                            Camera ID
                          </TableHead>
                          <TableHead className='text-xs text-guardai-darkgray'>
                            Detection Type
                          </TableHead>
                          <TableHead className='text-xs text-guardai-darkgray'>
                            Time Detected
                          </TableHead>
                          <TableHead className='text-xs text-guardai-darkgray'>
                            Time Resolved
                          </TableHead>
                          <TableHead className='text-xs text-guardai-darkgray'>
                            Resolved By
                          </TableHead>
                          <TableHead className='text-xs text-guardai-darkgray'>
                            Image
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {resolvedAlerts.map((alert, idx) => (
                          <TableRow key={idx} className='hover:bg-gray-50'>
                            <TableCell className='text-xs'>
                              <Badge className='bg-green-100 text-green-800 border-green-200'>
                                Fire & Smoke
                              </Badge>
                            </TableCell>
                            <TableCell className='text-xs'>
                              {alert.originalData.camera_id}
                            </TableCell>
                            <TableCell className='text-xs'>
                              {alert.originalData.violation_type}
                            </TableCell>
                            <TableCell className='text-xs'>
                              {new Date(
                                alert.originalData.logged_at
                              ).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </TableCell>
                            <TableCell className='text-xs'>
                              {new Date(alert.resolvedAt).toLocaleTimeString(
                                'en-IN',
                                {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                }
                              )}
                            </TableCell>
                            <TableCell className='text-xs'>
                              {alert.resolvedBy}
                            </TableCell>
                            <TableCell className='text-xs'>
                              <a
                                className='text-blue-600 underline flex items-center gap-1'
                                href={apiUrl(`/alerts/image/${alert.originalData.image_id}`)}
                                target='_blank'
                                rel='noreferrer'
                              >
                                View
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            securityFeatures.map((feature) => (
              <motion.div key={feature.id} variants={itemVariants}>
                <Card
                  className={cn(
                    'border-2 shadow-lg w-full',
                    getStatusColor(feature.status)
                  )}
                >
                  <CardHeader className='p-4 pb-2'>
                    <div className='flex items-center justify-between mb-2'>
                      <feature.icon size={24} className='text-guardai-red' />
                      <div
                        className={cn(
                          'text-xs px-2 py-1 rounded-full font-medium',
                          getCountColor(feature.status)
                        )}
                      >
                        {feature.count}
                      </div>
                    </div>
                    <CardTitle className='text-lg font-semibold'>
                      {feature.title}
                    </CardTitle>
                    <p className='text-sm text-guardai-gray'>
                      {feature.description}
                    </p>
                    <div className='flex items-center gap-2'>
                      <Activity size={12} className='text-guardai-red' />
                      <span className='text-xs text-guardai-gray capitalize'>
                        {feature.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className='p-4 pt-0'>
                    <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4'>
                      {Object.entries(feature.details).map(([key, value]) => (
                        <div
                          key={key}
                          className='text-center p-2 bg-white/60 rounded border'
                        >
                          <div className='text-lg font-bold text-guardai-red'>
                            {String(value)}
                          </div>
                          <div className='text-xs text-guardai-gray'>
                            {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {viewType === 'list' ? (
                    <div className='border rounded'>
                      <Table>
                        <TableHeader>
                          <TableRow className='bg-gray-50'>
                            {feature.id === 'perimeter-security' && (
                              <>
                                <TableHead className='text-xs font-semibold'>
                                  Camera
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Detection
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Time
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Zone
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Image
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Resolve
                                </TableHead>
                              </>
                            )}
                            {feature.id === 'restricted-access' && (
                              <>
                                <TableHead className='text-xs font-semibold'>
                                  Camera
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Detection
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Time
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Zone
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Image
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Resolve
                                </TableHead>
                              </>
                            )}
                            {feature.id === 'fire-water-detection' && (
                              <>
                                <TableHead className='text-xs font-semibold'>
                                  Camera
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Detection
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Time
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Zone
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Image
                                </TableHead>
                                <TableHead className='text-xs font-semibold'>
                                  Resolve
                                </TableHead>
                              </>
                            )}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {(feature.data.alerts || []).map(
                            (item: any, index: number) => (
                              <TableRow
                                key={index}
                                className='hover:bg-gray-50'
                              >
                                {feature.id === 'perimeter-security' && (
                                  <>
                                    <TableCell className='text-xs font-medium'>
                                      {item.camera_id}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      Unauthorized Entry
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {formatAlertTime(item.frame_timestamp ?? item.logged_at)}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.zone || item.roomName || 'Perimeter'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <a
                                        href={apiUrl(`/alerts/image/${item.image_id}`)}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-guardai-red underline text-xs'
                                      >
                                        View
                                      </a>
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <button
                                        onClick={() =>
                                          handleResolve(
                                            item._id,
                                            item,
                                            'unauthorized_entry'
                                          )
                                        }
                                        className='text-xs bg-guardai-red text-white px-2 py-1 rounded hover:bg-red-600'
                                      >
                                        Resolve
                                      </button>
                                    </TableCell>
                                  </>
                                )}
                                {feature.id === 'restricted-access' && (
                                  <>
                                    <TableCell className='text-xs font-medium'>
                                      {item.camera_id}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.violation_type}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {formatAlertTime(item.frame_timestamp ?? item.logged_at)}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.zone || item.roomName || 'Restricted Zone'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <a
                                        href={apiUrl(`/alerts/image/${item.image_id}`)}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-guardai-red underline text-xs'
                                      >
                                        View
                                      </a>
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <button
                                        onClick={() =>
                                          handleResolve(
                                            item._id,
                                            item,
                                            'restricted'
                                          )
                                        }
                                        className='text-xs bg-guardai-red text-white px-2 py-1 rounded hover:bg-red-600'
                                      >
                                        Resolve
                                      </button>
                                    </TableCell>
                                  </>
                                )}
                                {feature.id === 'fire-water-detection' && (
                                  <>
                                    <TableCell className='text-xs font-medium'>
                                      {item.camera_id}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.violation_type}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {formatAlertTime(item.frame_timestamp ?? item.logged_at)}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.zone || item.roomName || 'Perimeter'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <a
                                        href={apiUrl(`/alerts/image/${item.image_id}`)}
                                        target='_blank'
                                        rel='noopener noreferrer'
                                        className='text-guardai-red underline text-xs'
                                      >
                                        View
                                      </a>
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <button
                                        onClick={() =>
                                          handleResolve(
                                            item._id,
                                            item,
                                            'fire_smoke'
                                          )
                                        }
                                        className='text-xs bg-guardai-red text-white px-2 py-1 rounded hover:bg-red-600'
                                      >
                                        Resolve
                                      </button>
                                    </TableCell>
                                  </>
                                )}
                              </TableRow>
                            )
                          )}
                        </TableBody>
                      </Table>
                    </div>
                    ) : (
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        <SecurityAlertGrid
                          featureId={feature.id}
                          alerts={feature.data.alerts || []}
                          onResolve={handleResolve}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </ScrollArea>
    </div>
  );
}
