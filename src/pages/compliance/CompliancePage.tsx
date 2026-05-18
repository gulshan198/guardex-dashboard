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
import { HardHat, Trash, Activity, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { api, apiUrl } from '@/lib/api';
import { ViewTypeToggle } from '@/components/ViewTypeToggle';
import { AlertGridCard } from '@/components/AlertGridCard';
import { useViewType } from '@/hooks/useViewType';
import { formatAlertTime } from '@/lib/formatTime';
import { useDashboardAlerts } from '@/contexts/DashboardAlertsContext';
import { mapPpeFromApi, mapPhoneFromApi, mapSleepFromApi } from '@/lib/mapApiAlerts';

export default function CompliancePage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  type PPEViolation = {
    _id: string;
    person_id: string;
    violation: string;
    camera_id: string;
    frame_timestamp: string;
    image_id: string;
    logged_at: string;
  };

  const {
    alerts: dashboardAlerts,
    setCompliancePpe,
    setCompliancePhone,
    setComplianceSleep,
    removeAlert,
  } = useDashboardAlerts();
  const [ppeViolations, setPpeViolations] = useState<PPEViolation[]>(
    dashboardAlerts.compliance.ppe as PPEViolation[]
  );
  const [phoneViolations, setPhoneViolations] = useState(dashboardAlerts.compliance.phone);
  const [sleepViolations, setSleepViolations] = useState(dashboardAlerts.compliance.sleep);
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('active');
  const { viewType, handleViewChange } = useViewType('compliance-view-type');

  // Fetch resolved alerts from database
  const fetchResolvedAlerts = async () => {
    try {
      const response = await api.get('/resolved-alerts/compliance');
      setResolvedAlerts(response.data);
    } catch (error) {
      console.error('Failed to fetch resolved alerts:', error);
    }
  };

  // Load resolved alerts on component mount
  useEffect(() => {
    fetchResolvedAlerts();
  }, []);

  const fetchPPEAlerts = async () => {
    try {
      const res = await api.get('/alerts/ppe-compliance');
      const mapped = mapPpeFromApi(res.data);
      if (mapped.length > 0) {
        setPpeViolations(mapped as PPEViolation[]);
        setCompliancePpe(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch PPE alerts:', err);
    }
  };

  const fetchPhoneAlerts = async () => {
    try {
      const res = await api.get('/alerts/phone');
      const mapped = mapPhoneFromApi(res.data);
      if (mapped.length > 0) {
        setPhoneViolations(mapped);
        setCompliancePhone(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch phone alerts:', err);
    }
  };

  const fetchSleepAlerts = async () => {
    try {
      const res = await api.get('/alerts/sleeping');
      const mapped = mapSleepFromApi(res.data);
      if (mapped.length > 0) {
        setSleepViolations(mapped);
        setComplianceSleep(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch sleep alerts:', err);
    }
  };

  useEffect(() => {
    fetchPPEAlerts();
    fetchPhoneAlerts();
    fetchSleepAlerts();
    const interval = setInterval(() => {
      fetchPPEAlerts();
      fetchPhoneAlerts();
      fetchSleepAlerts();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (
    id: string,
    alertData: any,
    alertType: string
  ) => {
    try {
      console.log('=== COMPLIANCE RESOLVE ===');
      console.log('Resolving alert ID:', id);
      console.log('Alert data:', alertData);
      console.log('Alert type:', alertType);

      // Create resolved alert in database (soft delete)
      const resolvedAlertData = {
        originalAlertId: id,
        alertType: alertType,
        page: 'compliance',
        originalData: alertData,
        resolvedBy: 'Admin',
      };

      console.log('Resolved alert data:', resolvedAlertData);

      await api.post('/resolved-alerts', resolvedAlertData);
      console.log('Resolved alert created successfully');

      // Delete the original alert from the database
      await api.delete(`/alerts/${id}`);
      console.log('Original alert deleted successfully');

      // Refresh resolved alerts from database
      await fetchResolvedAlerts();

      // Update the appropriate state based on alert type
      if (alertType === 'ppe_compliance') {
        setPpeViolations((prev) => prev.filter((item) => item._id !== id));
        removeAlert('compliance', 'ppe', id);
      } else if (alertType === 'phone') {
        setPhoneViolations((prev) => prev.filter((item) => item._id !== id));
        removeAlert('compliance', 'phone', id);
      } else if (alertType === 'sleeping') {
        setSleepViolations((prev) => prev.filter((item) => item._id !== id));
        removeAlert('compliance', 'sleep', id);
      }

      console.log('Alert resolved successfully');
    } catch (err) {
      console.error('Failed to resolve alert:', err);
      console.error('Error details:', err.response?.data || err.message);
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const complianceFeatures = [
    {
      id: 'ppe-compliance',
      title: 'PPE Compliance',
      description: 'Personal protective equipment monitoring',
      icon: HardHat,
      status: ppeViolations.length > 0 ? 'warning' : 'active',
      count: ppeViolations.length,
      data: {
        violations: ppeViolations,
        summary: {
          violations: ppeViolations.length,
          lastViolation: ppeViolations.at(-1)?.logged_at || 'N/A',
        },
      },
    },
    {
      id: 'phone-compliance',
      title: 'Mobile Usage',
      description: 'Monitor unauthorized phone usage during work hours',
      icon: Activity,
      status: phoneViolations.length > 0 ? 'warning' : 'active',
      count: phoneViolations.length,
      data: {
        violations: phoneViolations,
        summary: {
          violations: phoneViolations.length,
          lastViolation: phoneViolations.at(-1)?.logged_at || 'N/A',
        },
      },
    },
    {
      id: 'sleep-compliance',
      title: 'Sleep Detection',
      description: 'Detect employees sleeping on duty',
      icon: Activity,
      status: sleepViolations.length > 0 ? 'critical' : 'active',
      count: sleepViolations.length,
      data: {
        violations: sleepViolations,
        summary: {
          violations: sleepViolations.length,
          lastViolation: sleepViolations.at(-1)?.logged_at || 'N/A',
        },
      },
    },
  ];

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
          <HardHat size={28} className='text-guardai-red' />
          <h1 className='text-2xl font-semibold text-guardai-darkgray'>
            Compliance Dashboard
          </h1>
        </motion.div>
        <motion.p
          variants={itemVariants}
          className='text-guardai-gray mb-4 ml-9'
        >
          Monitor safety compliance, hygiene standards, and regulatory
          requirements in real-time.
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
                    Resolved Compliance Alerts
                  </CardTitle>
                  <p className='text-sm text-guardai-gray'>
                    History of all resolved PPE compliance violations
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
                            Employee ID
                          </TableHead>
                          <TableHead className='text-xs text-guardai-darkgray'>
                            Violation
                          </TableHead>
                          <TableHead className='text-xs text-guardai-darkgray'>
                            Camera ID
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
                                PPE Compliance
                              </Badge>
                            </TableCell>
                            <TableCell className='text-xs'>
                              {alert.originalData.person_id}
                            </TableCell>
                            <TableCell className='text-xs'>
                              Hairnet Missing
                            </TableCell>
                            <TableCell className='text-xs'>
                              {alert.originalData.camera_id}
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
            complianceFeatures.map((feature) => (
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
                    <div className='grid grid-cols-2 lg:grid-cols-2 gap-3 mb-4'>
                      {Object.entries(feature.data.summary).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className='text-center p-2 bg-white/60 rounded border'
                          >
                            <div className='text-lg font-bold text-guardai-red'>
                              {value}
                            </div>
                            <div className='text-xs text-guardai-gray'>
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {viewType === 'list' ? (
                      <div className='border rounded'>
                        <Table>
                          <TableHeader>
                            <TableRow className='bg-gray-50'>
                              <TableHead className='text-xs font-semibold'>
                                Employee
                              </TableHead>
                              <TableHead className='text-xs font-semibold'>
                                Violation
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
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {feature.data.violations.map((item, index) => (
                              <TableRow key={index} className='hover:bg-gray-50'>
                                <TableCell className='text-xs'>
                                  {item.person_id}
                                </TableCell>
                                <TableCell className='text-xs'>
                                  {feature.id === 'ppe-compliance' &&
                                    'Hairnet Missing'}
                                  {feature.id === 'phone-compliance' &&
                                    'Phone Usage'}
                                  {feature.id === 'sleep-compliance' &&
                                    'Sleeping on Duty'}
                                </TableCell>
                                <TableCell className='text-xs'>
                                  {formatAlertTime(item.frame_timestamp ?? item.logged_at)}
                                </TableCell>
                                <TableCell className='text-xs'>
                                  {item.zone || item.roomName || item.camera_id}
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
                                    onClick={() => {
                                      const alertType =
                                        feature.id === 'ppe-compliance'
                                          ? 'ppe_compliance'
                                          : feature.id === 'phone-compliance'
                                          ? 'phone'
                                          : 'sleeping';
                                      handleResolve(item._id, item, alertType);
                                    }}
                                    className='text-xs bg-guardai-red text-white px-2 py-1 rounded hover:bg-red-600'
                                  >
                                    Resolve
                                  </button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {feature.data.violations.length === 0 ? (
                          <p className='col-span-full text-center text-sm text-guardai-gray py-6'>
                            No active alerts
                          </p>
                        ) : (
                          feature.data.violations.map((item) => {
                            const violationLabel =
                              feature.id === 'ppe-compliance'
                                ? 'Hairnet Missing'
                                : feature.id === 'phone-compliance'
                                ? 'Phone Usage'
                                : 'Sleeping on Duty';
                            const alertType =
                              feature.id === 'ppe-compliance'
                                ? 'ppe_compliance'
                                : feature.id === 'phone-compliance'
                                ? 'phone'
                                : 'sleeping';
                            return (
                              <AlertGridCard
                                key={item._id}
                                alertType={violationLabel}
                                location={item.zone || item.roomName || item.camera_id}
                                cameraId={item.camera_id}
                                time={formatAlertTime(item.frame_timestamp ?? item.logged_at)}
                                details={[
                                  { label: 'Employee', value: item.person_id },
                                ]}
                                imageId={item.image_id}
                                onResolve={() =>
                                  handleResolve(item._id, item, alertType)
                                }
                              />
                            );
                          })
                        )}
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
