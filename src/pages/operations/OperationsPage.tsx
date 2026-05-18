'use client';

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
import {
  Factory,
  Clock,
  Users,
  Truck,
  TrendingUp,
  Activity,
  ImageIcon,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { api, apiUrl } from '@/lib/api';
import { ViewTypeToggle } from '@/components/ViewTypeToggle';
import { OperationsAlertGrid } from '@/components/OperationsAlertGrid';
import { useViewType } from '@/hooks/useViewType';
import { useDashboardAlerts } from '@/contexts/DashboardAlertsContext';
import { mapIdleFromApi, mapLoiteringFromApi } from '@/lib/mapApiAlerts';

export default function OperationsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const {
    alerts: dashboardAlerts,
    setOperationsIdle,
    setOperationsLoitering,
    removeAlert,
  } = useDashboardAlerts();
  const [loiteringData, setLoiteringData] = useState(dashboardAlerts.operations.loitering);
  const [idleMachineryData, setIdleMachineryData] = useState(
    dashboardAlerts.operations.idleMachinery
  );
  const [attendanceData, setAttendanceData] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [phoneData, setPhoneData] = useState([]);
  const [restrictedData, setRestrictedData] = useState([]);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const { viewType, handleViewChange } = useViewType('operations-view-type');

  // Fetch resolved alerts from database
  const fetchResolvedAlerts = async () => {
    try {
      const response = await api.get('/resolved-alerts/operations');
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
    dataType: string,
    alertData: any
  ) => {
    console.log('Resolve button clicked:', { id, dataType, alertData });
    try {
      // Create resolved alert in database (soft delete)
      const resolvedAlertData = {
        originalAlertId: id,
        alertType: dataType,
        page: 'operations',
        originalData: alertData,
        resolvedBy: 'Admin',
      };

      console.log('Creating resolved alert:', resolvedAlertData);
      await api.post('/resolved-alerts', resolvedAlertData);
      console.log('Resolved alert created successfully');

      // Delete the original alert from the database
      console.log('Deleting original alert:', id);
      await api.delete(`/alerts/${id}`);
      console.log('Original alert deleted successfully');

      // Refresh resolved alerts from database
      await fetchResolvedAlerts();

      // Update the corresponding state based on dataType
      switch (dataType) {
        case 'loitering':
          setLoiteringData((prev) => prev.filter((item) => item._id !== id));
          removeAlert('operations', 'loitering', id);
          break;
        case 'idle_machinery':
          setIdleMachineryData((prev) =>
            prev.filter((item) => item._id !== id)
          );
          removeAlert('operations', 'idleMachinery', id);
          break;
        case 'attendance':
          setAttendanceData((prev) => prev.filter((item) => item._id !== id));
          break;
        case 'restricted':
          setRestrictedData((prev) => prev.filter((item) => item._id !== id));
          break;
        case 'sleeping':
          setSleepData((prev) => prev.filter((item) => item._id !== id));
          break;
        case 'phone':
          setPhoneData((prev) => prev.filter((item) => item._id !== id));
          break;
        default:
          break;
      }
      console.log('Resolve completed successfully');
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  useEffect(() => {
    const fetchLoiteringData = async () => {
      try {
        const res = await api.get('/alerts/loitering');
        const mapped = mapLoiteringFromApi(res.data);
        if (mapped.length > 0) {
          setLoiteringData(mapped);
          setOperationsLoitering(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch loitering data:', err);
      }
    };

    const fetchIdleData = async () => {
      try {
        const res = await api.get('/alerts/idle_machinery');
        const mapped = mapIdleFromApi(res.data);
        if (mapped.length > 0) {
          setIdleMachineryData(mapped);
          setOperationsIdle(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch idle machinery data:', err);
      }
    };

    const fetchAttendanceData = async () => {
      try {
        const res = await api.get('/alerts/attendance');
        setAttendanceData(res.data);
      } catch (err) {
        console.error('Failed to fetch attendance data:', err);
      }
    };

    const fetchRestrictedData = async () => {
      try {
        const res = await api.get('/alerts/restricted');
        setRestrictedData(res.data);
      } catch (err) {
        console.error('Failed to fetch idle machinery data:', err);
      }
    };

    const fetchSleepData = async () => {
      try {
        const res = await api.get('/alerts/sleeping');
        setSleepData(res.data);
      } catch (err) {
        console.error('Failed to fetch attendance data:', err);
      }
    };

    const fetchPhoneData = async () => {
      try {
        const res = await api.get('/alerts/phone');
        setPhoneData(res.data);
      } catch (err) {
        console.error('Failed to fetch attendance data:', err);
      }
    };

    fetchLoiteringData();
    fetchIdleData();
    fetchAttendanceData();

    const interval = setInterval(() => {
      fetchLoiteringData();
      fetchIdleData();
      fetchAttendanceData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const operationsFeatures = [
    {
      id: 'machine-idle',
      title: 'Machine Idle Detection',
      description: 'Monitor machinery idle time and operator presence',
      icon: Clock,
      status: 'critical',
      count: idleMachineryData.length,
      details: {
        alertsSent: idleMachineryData.length,
        totalMachines: 12,
        shift: 'Day Shift',
      },
      data: {
        machines: idleMachineryData,
      },
    },
    {
      id: 'loitering-detection',
      title: 'Loitering Alerts',
      description: 'Detect clusters of people loitering in sensitive zones',
      icon: Users,
      status: 'critical',
      count: loiteringData.length,
      details: {
        activeAlerts: loiteringData.length,
        mostFrequentTime: '11:00 AM',
        frequentLoitering: 'Blow Moulding',
      },
      data: {
        alerts: loiteringData,
      },
    },
    {
      id: 'employee-attendance',
      title: 'Employee Attendance',
      description: 'Face recognition-based real-time attendance tracking',
      icon: Users,
      status: 'active',
      count: attendanceData.length,
      details: {
        present: attendanceData.length,
        unauthorized: 0,
        totalEmployees: 180,
        shift: 'Day Shift',
        avgCheckInTime: '08:12 AM',
        attendanceRate: '94%',
      },
      data: {
        employees: attendanceData,
      },
    },
  ];

  const getFeatureStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'active':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

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
          <Factory size={28} className='text-guardai-red' />
          <h1 className='text-2xl font-semibold text-guardai-darkgray'>
            Operations Dashboard
          </h1>
        </motion.div>
        <motion.p
          variants={itemVariants}
          className='text-guardai-gray mb-4 ml-9'
        >
          Real-time monitoring of manufacturing operations, machinery, and
          workforce management.
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
              <Card className='border border-gray-200 shadow-lg w-full bg-white'>
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
                    Resolved Alerts
                  </CardTitle>
                  <p className='text-sm text-guardai-gray'>
                    History of all resolved alerts and incidents
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
                            Location
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
                                {alert.alertType
                                  .replace('_', ' ')
                                  .replace(/\b\w/g, (l) => l.toUpperCase())}
                              </Badge>
                            </TableCell>
                            <TableCell className='text-xs'>
                              {alert.originalData.camera_id}
                            </TableCell>
                            <TableCell className='text-xs'>
                              {alert.originalData.zone || 'Unknown Location'}
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
                              {new Date(alert.createdAt).toLocaleTimeString(
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
                                <ImageIcon size={14} /> View
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
            <>
              {operationsFeatures.map((feature) => (
                <motion.div key={feature.id} variants={itemVariants}>
                  <Card className='border border-gray-200 shadow-lg w-full bg-white'>
                    <CardHeader className='p-4 pb-2'>
                      <div className='flex items-center justify-between mb-2'>
                        <div className='flex items-center gap-3'>
                          <div className='bg-guardai-red/10 p-2 rounded-lg'>
                            <feature.icon
                              size={24}
                              className='text-guardai-red'
                            />
                          </div>
                          <div className='bg-guardai-red text-white text-sm px-3 py-1 rounded-full font-medium'>
                            {feature.count}
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div
                            className={cn(
                              'w-3 h-3 rounded-full',
                              getFeatureStatusColor(feature.status)
                            )}
                          ></div>
                          <Activity size={12} className='text-guardai-red' />
                          <span className='text-xs text-guardai-gray capitalize'>
                            {feature.status === 'critical'
                              ? 'Critical'
                              : feature.status === 'warning'
                              ? 'Warning'
                              : 'Active'}
                          </span>
                        </div>
                      </div>
                      <CardTitle className='text-lg font-semibold text-guardai-darkgray'>
                        {feature.title}
                      </CardTitle>
                      <p className='text-sm text-guardai-gray'>
                        {feature.description}
                      </p>
                    </CardHeader>
                    <CardContent className='p-4 pt-0'>
                      <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4'>
                        {Object.entries(feature.details).map(([key, value]) => (
                          <div
                            key={key}
                            className='text-center p-3 bg-guardai-lightgray/50 rounded-lg border border-guardai-lightgray'
                          >
                            <div className='text-lg font-bold text-guardai-red'>
                              {value}
                            </div>
                            <div className='text-xs text-guardai-darkgray capitalize'>
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </div>
                          </div>
                        ))}
                      </div>
                      {viewType === 'list' ? (
                      <div className='border rounded-lg overflow-hidden'>
                        <Table>
                          <TableHeader>
                            <TableRow className='bg-guardai-red/5'>
                              {feature.id === 'loitering-detection' && (
                                <>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Zone
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Location
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    # People
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Time of Alert
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Image
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Resolve
                                  </TableHead>
                                </>
                              )}
                              {feature.id === 'machine-idle' && (
                                <>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Camera ID
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Zone
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Time
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Image
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Resolve
                                  </TableHead>
                                </>
                              )}
                              {feature.id === 'employee-attendance' && (
                                <>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Employee ID
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Name
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Time In
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Status
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Image
                                  </TableHead>
                                </>
                              )}
                              {feature.id === 'restricted-access' && (
                                <>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Camera ID
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Location
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Time
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Image
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Resolve
                                  </TableHead>
                                </>
                              )}
                              {feature.id === 'sleep-detection' && (
                                <>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Camera ID
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Location
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Timestamp
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Sleeping From
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Image
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Resolve
                                  </TableHead>
                                </>
                              )}
                              {feature.id === 'phone-detection' && (
                                <>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Camera ID
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Location
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Timestamp
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Using Phone From
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Image
                                  </TableHead>
                                  <TableHead className='text-xs text-guardai-darkgray'>
                                    Resolve
                                  </TableHead>
                                </>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(
                              feature.data.alerts ||
                              feature.data.machines ||
                              feature.data.employees ||
                              []
                            ).map((item, idx) => (
                              <TableRow key={idx}>
                                {feature.id === 'loitering-detection' && (
                                  <>
                                    <TableCell className='text-xs'>
                                      {item.camera_id}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.zone || 'Unknown Location'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.box_count}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.frame_timestamp
                                        ? new Date(
                                            item.frame_timestamp
                                          ).toLocaleTimeString('en-IN', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })
                                        : 'N/A'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <a
                                        className='text-blue-600 underline flex items-center gap-1'
                                        href={apiUrl(`/alerts/image/${item.image_id}`)}
                                        target='_blank'
                                        rel='noreferrer'
                                      >
                                        <ImageIcon size={14} /> View
                                      </a>
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <button
                                        onClick={() =>
                                          handleResolve(
                                            item._id,
                                            'loitering',
                                            item
                                          )
                                        }
                                        className='text-xs bg-guardai-red text-white px-2 py-1 rounded hover:bg-red-600'
                                      >
                                        Resolve
                                      </button>
                                    </TableCell>
                                  </>
                                )}
                                {feature.id === 'machine-idle' && (
                                  <>
                                    <TableCell className='text-xs'>
                                      {item.camera_id}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.zone || 'Unknown Location'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      30 minutes
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <a
                                        className='text-blue-600 underline flex items-center gap-1'
                                        href={apiUrl(`/alerts/image/${item.image_id}`)}
                                        target='_blank'
                                        rel='noreferrer'
                                      >
                                        <ImageIcon size={14} /> View
                                      </a>
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <button
                                        onClick={() =>
                                          handleResolve(
                                            item._id,
                                            'idle_machinery',
                                            item
                                          )
                                        }
                                        className='text-xs bg-guardai-red text-white px-2 py-1 rounded hover:bg-red-600'
                                      >
                                        Resolve
                                      </button>
                                    </TableCell>
                                  </>
                                )}
                                {feature.id === 'employee-attendance' && (
                                  <>
                                    <TableCell className='text-xs'>
                                      {item.emp_id}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.name || 'Unknown Employee'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.frame_timestamp}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {'Present'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <a
                                        className='text-blue-600 underline flex items-center gap-1'
                                        href={apiUrl(`/alerts/image/${item.image_id}`)}
                                        target='_blank'
                                        rel='noreferrer'
                                      >
                                        <ImageIcon size={14} /> View
                                      </a>
                                    </TableCell>
                                  </>
                                )}
                                {feature.id === 'restricted-access' && (
                                  <>
                                    <TableCell className='text-xs'>
                                      {item.camera_id}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.zone || 'Unknown Location'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.frame_timestamp}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <a
                                        className='text-blue-600 underline flex items-center gap-1'
                                        href={apiUrl(`/alerts/image/${item.image_id}`)}
                                        target='_blank'
                                        rel='noreferrer'
                                      >
                                        <ImageIcon size={14} /> View
                                      </a>
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <button
                                        onClick={() =>
                                          handleResolve(
                                            item._id,
                                            'restricted',
                                            item
                                          )
                                        }
                                        className='text-xs bg-guardai-red text-white px-2 py-1 rounded hover:bg-red-600'
                                      >
                                        Resolve
                                      </button>
                                    </TableCell>
                                  </>
                                )}
                                {feature.id === 'sleep-detection' && (
                                  <>
                                    <TableCell className='text-xs'>
                                      {item.camera_id}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.zone || 'Unknown Location'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.frame_timestamp}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {'45 mins'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <a
                                        className='text-blue-600 underline flex items-center gap-1'
                                        href={apiUrl(`/alerts/image/${item.image_id}`)}
                                        target='_blank'
                                        rel='noreferrer'
                                      >
                                        <ImageIcon size={14} /> View
                                      </a>
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <button
                                        onClick={() =>
                                          handleResolve(
                                            item._id,
                                            'sleeping',
                                            item
                                          )
                                        }
                                        className='text-xs bg-guardai-red text-white px-2 py-1 rounded hover:bg-red-600'
                                      >
                                        Resolve
                                      </button>
                                    </TableCell>
                                  </>
                                )}
                                {feature.id === 'phone-detection' && (
                                  <>
                                    <TableCell className='text-xs'>
                                      {item.camera_id}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.zone || 'Unknown Location'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {item.frame_timestamp}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      {'45 mins'}
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <a
                                        className='text-blue-600 underline flex items-center gap-1'
                                        href={apiUrl(`/alerts/image/${item.image_id}`)}
                                        target='_blank'
                                        rel='noreferrer'
                                      >
                                        <ImageIcon size={14} /> View
                                      </a>
                                    </TableCell>
                                    <TableCell className='text-xs'>
                                      <button
                                        onClick={() =>
                                          handleResolve(item._id, 'phone', item)
                                        }
                                        className='text-xs bg-guardai-red text-white px-2 py-1 rounded hover:bg-red-600'
                                      >
                                        Resolve
                                      </button>
                                    </TableCell>
                                  </>
                                )}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                          <OperationsAlertGrid
                            featureId={feature.id}
                            items={
                              feature.data.alerts ||
                              feature.data.machines ||
                              feature.data.employees ||
                              []
                            }
                            onResolve={handleResolve}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Loading & Unloading Operations Table */}
              {/* <motion.div variants={itemVariants}>
                <Card className='border border-gray-200 shadow-lg w-full bg-white'>
                  <CardHeader className='p-4 pb-2'>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-3'>
                        <div className='bg-guardai-red/10 p-2 rounded-lg'>
                          <Truck size={24} className='text-guardai-red' />
                        </div>
                        <div className='bg-guardai-red text-white text-sm px-3 py-1 rounded-full font-medium'>
                          4
                        </div>
                      </div>
                      <div className='flex items-center gap-2'>
                        <div className='w-3 h-3 rounded-full bg-green-500'></div>
                        <Activity size={12} className='text-guardai-red' />
                        <span className='text-xs text-guardai-gray capitalize'>
                          Active
                        </span>
                      </div>
                    </div>
                    <CardTitle className='text-lg font-semibold text-guardai-darkgray'>
                      Loading & Unloading Operations
                    </CardTitle>
                    <p className='text-sm text-guardai-gray'>
                      Track cargo operations and logistics
                    </p>
                  </CardHeader>
                  <CardContent className='p-4 pt-0'>
                    <div className='grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4'>
                      <div className='text-center p-3 bg-guardai-lightgray/50 rounded-lg border border-guardai-lightgray'>
                        <div className='text-lg font-bold text-guardai-red'>
                          28
                        </div>
                        <div className='text-xs text-guardai-darkgray'>
                          today loaded
                        </div>
                      </div>
                      <div className='text-center p-3 bg-guardai-lightgray/50 rounded-lg border border-guardai-lightgray'>
                        <div className='text-lg font-bold text-guardai-red'>
                          3
                        </div>
                        <div className='text-xs text-guardai-darkgray'>
                          pending trucks
                        </div>
                      </div>
                      <div className='text-center p-3 bg-guardai-lightgray/50 rounded-lg border border-guardai-lightgray'>
                        <div className='text-lg font-bold text-guardai-red'>
                          45 min
                        </div>
                        <div className='text-xs text-guardai-darkgray'>
                          average time
                        </div>
                      </div>
                    </div>
                    <div className='border rounded-lg overflow-hidden'>
                      <Table>
                        <TableHeader>
                          <TableRow className='bg-guardai-red/5'>
                            <TableHead className='text-xs text-guardai-darkgray'>
                              Operation ID
                            </TableHead>
                            <TableHead className='text-xs text-guardai-darkgray'>
                              Type
                            </TableHead>
                            <TableHead className='text-xs text-guardai-darkgray'>
                              Truck
                            </TableHead>
                            <TableHead className='text-xs text-guardai-darkgray'>
                              To Be Loaded
                            </TableHead>
                            <TableHead className='text-xs text-guardai-darkgray'>
                              Status
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className='hover:bg-gray-50'>
                            <TableCell className='text-xs'>TR001</TableCell>
                            <TableCell className='text-xs'>Loading</TableCell>
                            <TableCell className='text-xs'>
                              MH-12-AB-1234
                            </TableCell>
                            <TableCell className='text-xs'>500 boxes</TableCell>
                            <TableCell className='text-xs'>
                              <Badge className='bg-green-100 text-green-800 border-green-200'>
                                In Progress
                              </Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow className='hover:bg-gray-50'>
                            <TableCell className='text-xs'>TR002</TableCell>
                            <TableCell className='text-xs'>Unloading</TableCell>
                            <TableCell className='text-xs'>
                              UP-32-CD-5678
                            </TableCell>
                            <TableCell className='text-xs'>750 boxes</TableCell>
                            <TableCell className='text-xs'>
                              <Badge className='bg-blue-100 text-blue-800 border-blue-200'>
                                Completed
                              </Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow className='hover:bg-gray-50'>
                            <TableCell className='text-xs'>TR003</TableCell>
                            <TableCell className='text-xs'>Loading</TableCell>
                            <TableCell className='text-xs'>
                              DL-01-EF-9012
                            </TableCell>
                            <TableCell className='text-xs'>300 boxes</TableCell>
                            <TableCell className='text-xs'>
                              <Badge className='bg-purple-100 text-purple-800 border-purple-200'>
                                Waiting
                              </Badge>
                            </TableCell>
                          </TableRow>
                          <TableRow className='hover:bg-gray-50'>
                            <TableCell className='text-xs'>TR004</TableCell>
                            <TableCell className='text-xs'>Unloading</TableCell>
                            <TableCell className='text-xs'>
                              RJ-14-GH-3456
                            </TableCell>
                            <TableCell className='text-xs'>600 boxes</TableCell>
                            <TableCell className='text-xs'>
                              <Badge className='bg-green-100 text-green-800 border-green-200'>
                                In Progress
                              </Badge>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div> */}
            </>
          )}
        </motion.div>
      </ScrollArea>
    </div>
  );
}
