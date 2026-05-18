'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { format, startOfDay, subDays } from 'date-fns';
import {
  Brush,
  Activity,
  CheckCircle2,
  XCircle,
  Camera,
  ImageIcon,
  CheckCircle,
  Calendar,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { CleanlinessViewToggle, type CleanlinessViewType } from '@/components/CleanlinessViewToggle';
import { AlertGridCard } from '@/components/AlertGridCard';
import { cn } from '@/lib/utils';
import {
  DashboardPageShell,
  dashboardItemVariants,
  dashboardTabButtonClass,
  dashboardTabListClass,
} from '@/components/layout/DashboardPageShell';
import {
  dashboardCardClass,
  dashboardCardDescriptionClass,
  dashboardCardHeaderClass,
  dashboardCardTitleClass,
  dashboardCountBadgeClass,
  dashboardIconWrapClass,
  dashboardTableWrapClass,
} from '@/lib/dashboardCardStyles';
import {
  DUMMY_CLEANLINESS_LIVE,
  DUMMY_CLEANLINESS_ALERTS,
  DUMMY_RESOLVED_CLEANLINESS,
  DUMMY_PAST_CLEANLINESS,
  type CleanlinessLiveItem,
  type CleanlinessAlertItem,
} from '@/lib/cleanlinessDummy';

function formatAlertTime(iso: string) {
  return format(new Date(iso), 'h:mm a');
}

function formatAlertDateTime(iso: string) {
  return format(new Date(iso), 'MMM d, yyyy · h:mm a');
}

function alertTypeLabel(type: CleanlinessAlertItem['alertType']) {
  return type === 'blocked_pathway' ? 'Blocked Pathway' : 'Cleanliness';
}

function CleanlinessStatusBadge({ clean }: { clean: boolean | null }) {
  if (clean === null) return <span className='text-guardai-gray'>—</span>;
  if (clean) {
    return (
      <Badge variant='outline' className='border-emerald-200 bg-emerald-50 text-emerald-700'>
        <CheckCircle2 className='mr-1 h-3 w-3' />
        Clean
      </Badge>
    );
  }
  return (
    <Badge variant='outline' className='border-rose-200 bg-rose-50 text-rose-700'>
      <XCircle className='mr-1 h-3 w-3' />
      Dirty
    </Badge>
  );
}

function PathStatusBadge({ pathStatus }: { pathStatus: boolean | null }) {
  if (pathStatus === null) return <span className='text-guardai-gray'>—</span>;
  if (pathStatus) {
    return (
      <Badge variant='outline' className='border-emerald-200 bg-emerald-50 text-emerald-700'>
        <CheckCircle2 className='mr-1 h-3 w-3' />
        Clear
      </Badge>
    );
  }
  return (
    <Badge variant='outline' className='border-rose-200 bg-rose-50 text-rose-700'>
      <XCircle className='mr-1 h-3 w-3' />
      Obstructed
    </Badge>
  );
}

function CleanlinessLiveSection({ items }: { items: CleanlinessLiveItem[] }) {
  const totalCameras = items.length;
  const cleanCameras = items.filter((i) => i.clean === true).length;
  const dirtyCameras = items.filter((i) => i.clean === false).length;
  const status = dirtyCameras > 0 ? 'warning' : 'active';

  return (
    <motion.div variants={dashboardItemVariants}>
      <Card
        className={cn(
          'mb-2 w-full border border-gray-200 bg-white shadow-lg',
          status === 'warning' && 'border-amber-200/80'
        )}
      >
        <CardHeader className='p-4 pb-2'>
          <div className='mb-2 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-guardai-red/10 p-2'>
                <Brush size={24} className='text-guardai-red' />
              </div>
              <div className='rounded-full bg-guardai-red px-3 py-1 text-sm font-medium text-white'>
                {totalCameras}
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div
                className={cn(
                  'h-3 w-3 rounded-full',
                  status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                )}
              />
              <Activity size={12} className='text-guardai-red' />
              <span className='text-xs capitalize text-guardai-gray'>
                {status === 'warning' ? 'Attention' : 'Healthy'}
              </span>
            </div>
          </div>
          <CardTitle className={dashboardCardTitleClass}>Live Cleanliness</CardTitle>
          <p className={dashboardCardDescriptionClass}>
            Per-camera cleanliness status with snapshots and issue details
          </p>
        </CardHeader>
        <CardContent className='p-4 pt-0'>
          <div className='mb-4 grid grid-cols-3 gap-3'>
            <div className='rounded-lg border border-emerald-200/60 bg-emerald-50/80 p-3 text-center'>
              <div className='flex items-center justify-center gap-1 text-base font-bold text-emerald-600 sm:text-lg'>
                <CheckCircle2 className='h-4 w-4' />
                {cleanCameras}
              </div>
              <div className='text-xs text-guardai-darkgray sm:text-sm'>Clean area</div>
            </div>
            <div className='rounded-lg border border-rose-200/60 bg-rose-50/80 p-3 text-center'>
              <div className='flex items-center justify-center gap-1 text-base font-bold text-rose-600 sm:text-lg'>
                <XCircle className='h-4 w-4' />
                {dirtyCameras}
              </div>
              <div className='text-xs text-guardai-darkgray sm:text-sm'>Dirty area</div>
            </div>
            <motion.div className='rounded-lg border border-guardai-lightgray bg-guardai-lightgray/50 p-3 text-center'>
              <motion.div className='text-lg font-bold text-guardai-red'>{totalCameras}</motion.div>
              <motion.div className='text-xs capitalize text-guardai-darkgray'>Total area</motion.div>
            </motion.div>
          </div>

          <div className='overflow-x-auto rounded-xl border border-gray-200'>
            <Table className='min-w-[900px]'>
              <TableHeader>
                <TableRow className='bg-guardai-red/5'>
                  <TableHead className='px-4 py-3 text-xs font-medium text-guardai-darkgray'>Sno.</TableHead>
                  <TableHead className='px-4 py-3 text-xs font-medium text-guardai-darkgray'>Frame</TableHead>
                  <TableHead className='px-4 py-3 text-xs font-medium text-guardai-darkgray'>Room</TableHead>
                  <TableHead className='px-4 py-3 text-xs font-medium text-guardai-darkgray'>Status</TableHead>
                  <TableHead className='px-4 py-3 text-center text-xs font-medium text-guardai-darkgray'>
                    Obstruction
                  </TableHead>
                  <TableHead className='px-4 py-3 text-center text-xs font-medium text-guardai-darkgray'>
                    Score (%)
                  </TableHead>
                  {/* <TableHead className='px-4 py-3 text-center text-xs font-medium text-guardai-darkgray'>Time</TableHead> */}
                  <TableHead className='px-4 py-3 text-xs font-medium text-guardai-darkgray'>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={cn(
                      'border-b border-gray-100',
                      item.clean === false && 'bg-rose-50/40',
                      item.clean === true && 'bg-emerald-50/30'
                    )}
                  >
                    <TableCell className='px-4 py-3 text-xs text-guardai-gray'>
                      {String(index + 1).padStart(2, '0')}
                    </TableCell>
                    <TableCell className='px-4 py-2'>
                      <div className='relative h-16 w-28 overflow-hidden rounded-md border border-gray-200 bg-gray-100 sm:h-20 sm:w-32'>
                        <img
                          src={item.frameUrl}
                          alt={item.roomName}
                          className='h-full w-full object-cover'
                        />
                      </div>
                    </TableCell>
                    <TableCell className='px-4 py-3 text-xs font-medium text-guardai-darkgray'>
                      {item.roomName}
                    </TableCell>
                    <TableCell className='px-4 py-3'>
                      <CleanlinessStatusBadge clean={item.clean} />
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center'>
                      <PathStatusBadge pathStatus={item.path_status} />
                    </TableCell>
                    <TableCell className='px-4 py-3 text-center text-xs text-guardai-darkgray'>
                      {item.cleanliness_score ?? '—'}
                    </TableCell>
                    {/* <TableCell className='px-4 py-3 text-center text-xs text-guardai-gray'>
                      {formatAlertTime(item.time)}
                    </TableCell> */}
                    <TableCell className='px-4 py-3 text-xs text-guardai-darkgray'>
                      {item.reason === 'All Clean' ? 'All clean' : item.reason}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

type AlertFeature = {
  id: string;
  title: string;
  description: string;
  icon: typeof Brush;
  alerts: CleanlinessAlertItem[];
};

function CleanlinessAlertsSection({
  viewType,
  features,
  onResolve,
}: {
  viewType: CleanlinessViewType;
  features: AlertFeature[];
  onResolve: (id: string) => void;
}) {
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});
  const loadStep = viewType === 'table' ? 10 : 6;

  useEffect(() => {
    setVisibleCounts((prev) => {
      const next = { ...prev };
      features.forEach((f) => {
        if (next[f.id] == null) {
          next[f.id] = Math.min(loadStep, f.alerts.length);
        }
      });
      return next;
    });
  }, [features, loadStep]);

  return (
    <div className='space-y-6'>
      {features.map((feature) => {
        const total = feature.alerts.length;
        const visible = Math.min(visibleCounts[feature.id] ?? loadStep, total);
        const slice = feature.alerts.slice(0, visible);
        const status = total > 0 ? 'warning' : 'active';

        return (
          <motion.div key={feature.id} variants={dashboardItemVariants}>
            <Card
              className={cn(
                'mb-2 w-full border border-gray-200 bg-white shadow-lg',
                status === 'warning' && 'border-amber-200/80'
              )}
            >
              <CardHeader className='p-4 pb-2'>
                <div className='mb-2 flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <motion.div className={dashboardIconWrapClass}>
                      <feature.icon size={24} className='text-guardai-red' />
                    </motion.div>
                    <div className='rounded-full bg-guardai-red px-3 py-1 text-sm font-medium text-white'>
                      {total}
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Activity size={12} className='text-guardai-red' />
                    <span className='text-xs capitalize text-guardai-gray'>
                      {status === 'warning' ? 'Active' : 'Normal'}
                    </span>
                  </div>
                </div>
                <CardTitle className={dashboardCardTitleClass}>{feature.title}</CardTitle>
                <p className={dashboardCardDescriptionClass}>{feature.description}</p>
              </CardHeader>
              <CardContent className='p-4 pt-0'>
                {viewType === 'grid' ? (
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {slice.length === 0 ? (
                      <p className='col-span-full py-8 text-center text-sm text-guardai-gray'>
                        No alerts found
                      </p>
                    ) : (
                      slice.map((alert) => (
                        <AlertGridCard
                          key={alert._id}
                          alertType={alertTypeLabel(alert.alertType)}
                          location={alert.roomName}
                          cameraId={alert.camera_id}
                          time={formatAlertTime(alert.logged_at)}
                          imageUrl={alert.imageUrl}
                          imageId={alert.image_id}
                          onResolve={() => onResolve(alert._id)}
                        />
                      ))
                    )}
                  </div>
                ) : (
                  <div className='overflow-x-auto rounded-lg border border-gray-200'>
                    <Table>
                      <TableHeader>
                        <TableRow className='bg-guardai-red/5'>
                          <TableHead className='text-xs text-guardai-darkgray'>S.no</TableHead>
                          <TableHead className='text-xs text-guardai-darkgray'>Room</TableHead>
                          <TableHead className='text-xs text-guardai-darkgray'>Time</TableHead>
                          <TableHead className='text-xs text-guardai-darkgray'>Image</TableHead>
                          <TableHead className='text-center text-xs text-guardai-darkgray'>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {slice.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className='py-6 text-center text-xs text-guardai-gray'>
                              No alerts found
                            </TableCell>
                          </TableRow>
                        ) : (
                          slice.map((alert, idx) => (
                            <TableRow key={alert._id} className='hover:bg-guardai-red/[0.03]'>
                              <TableCell className='text-xs text-guardai-darkgray'>{idx + 1}</TableCell>
                              <TableCell className='text-xs text-guardai-darkgray'>{alert.roomName}</TableCell>
                              <TableCell className='text-xs text-guardai-gray'>
                                {formatAlertTime(alert.logged_at)}
                              </TableCell>
                              <TableCell className='text-xs'>
                                <span className='flex items-center gap-1 text-guardai-red underline'>
                                  <ImageIcon size={14} /> view
                                </span>
                              </TableCell>
                              <TableCell className='text-center'>
                                <Button
                                  size='sm'
                                  className='h-7 bg-guardai-red text-xs hover:bg-red-600'
                                  onClick={() => onResolve(alert._id)}
                                >
                                  Resolve
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
                {visible < total && (
                  <div className='mt-3 flex justify-center'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-8 border border-guardai-red/25 text-xs text-guardai-red hover:bg-guardai-red/5'
                      onClick={() =>
                        setVisibleCounts((prev) => ({
                          ...prev,
                          [feature.id]: Math.min((prev[feature.id] ?? loadStep) + loadStep, total),
                        }))
                      }
                    >
                      <ChevronDown className='mr-1 h-3.5 w-3.5' />
                      Load more ({total - visible} remaining)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

function PaginatedCleanlinessCard({
  title,
  description,
  icon: Icon,
  iconClassName,
  badgeClassName,
  alerts,
  viewType,
  showStatusColumn,
  showResolvedAtColumn,
  headerExtra,
}: {
  title: string;
  description: string;
  icon: typeof CheckCircle;
  iconClassName: string;
  badgeClassName: string;
  alerts: CleanlinessAlertItem[];
  viewType: CleanlinessViewType;
  showStatusColumn?: boolean;
  showResolvedAtColumn?: boolean;
  headerExtra?: ReactNode;
}) {
  const [page, setPage] = useState(1);
  const limit = viewType === 'grid' ? 9 : 10;

  const { rows, pagination } = useMemo(() => {
    const totalCount = alerts.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * limit;
    return {
      rows: alerts.slice(start, start + limit),
      pagination: {
        currentPage,
        totalPages,
        totalCount,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        limit,
      },
    };
  }, [alerts, page, limit]);

  return (
    <motion.div variants={dashboardItemVariants}>
      <Card className={dashboardCardClass}>
        <CardHeader className={dashboardCardHeaderClass}>
          <div className='mb-2 flex flex-wrap items-center justify-between gap-3'>
            <div className='flex items-center gap-3'>
              <div className={cn('rounded-lg p-2', iconClassName)}>
                <Icon size={24} />
              </div>
              <div className={cn('rounded-full px-3 py-1 text-sm font-medium text-white', badgeClassName)}>
                {pagination.totalCount}
              </div>
            </div>
            {headerExtra}
          </div>
          <CardTitle className='text-lg font-semibold text-guardai-darkgray'>{title}</CardTitle>
          <p className='text-sm text-guardai-gray'>{description}</p>
        </CardHeader>
        <CardContent className='p-4 pt-0'>
          {pagination.totalCount === 0 ? (
            <p className='py-10 text-center text-sm text-guardai-gray'>No alerts found</p>
          ) : viewType === 'grid' ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {rows.map((alert) => (
                <AlertGridCard
                  key={alert._id}
                  alertType={alertTypeLabel(alert.alertType)}
                  location={alert.roomName}
                  cameraId={alert.camera_id}
                  time={formatAlertDateTime(alert.logged_at)}
                  imageUrl={alert.imageUrl}
                  imageId={alert.image_id}
                  showResolve={false}
                  details={[
                    ...(showResolvedAtColumn && alert.resolved_at
                      ? [
                          {
                            label: 'Resolved',
                            value: formatAlertDateTime(alert.resolved_at),
                          },
                        ]
                      : []),
                    {
                      label: 'Status',
                      value:
                        alert.status === 'expired'
                          ? 'Expired'
                          : alert.status === 'resolved'
                            ? 'Resolved'
                            : 'Active',
                    },
                  ]}
                />
              ))}
            </div>
          ) : (
            <div className='overflow-x-auto rounded-lg border border-gray-200'>
              <Table>
                <TableHeader>
                  <TableRow className='bg-guardai-red/5'>
                    <TableHead className='text-xs text-guardai-darkgray'>Sno.</TableHead>
                    <TableHead className='text-xs text-guardai-darkgray'>Type</TableHead>
                    <TableHead className='text-xs text-guardai-darkgray'>Room</TableHead>
                    <TableHead className='text-xs text-guardai-darkgray'>Time Detected</TableHead>
                    {showResolvedAtColumn && (
                      <TableHead className='text-xs text-guardai-darkgray'>Time Resolved</TableHead>
                    )}
                    {showStatusColumn && (
                      <TableHead className='text-xs text-guardai-darkgray'>Status</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={
                          4 + (showStatusColumn ? 1 : 0) + (showResolvedAtColumn ? 1 : 0)
                        }
                        className='py-8 text-center text-xs text-guardai-gray'
                      >
                        No alerts found
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.map((alert, idx) => (
                    <TableRow key={alert._id} className='hover:bg-guardai-red/[0.03]'>
                      <TableCell className='text-xs text-guardai-darkgray'>
                        {(pagination.currentPage - 1) * pagination.limit + idx + 1}
                      </TableCell>
                      <TableCell className='text-xs text-guardai-darkgray'>
                        {alertTypeLabel(alert.alertType)}
                      </TableCell>
                      <TableCell className='text-xs text-guardai-darkgray'>{alert.roomName}</TableCell>
                      <TableCell className='text-xs text-guardai-gray'>
                        {formatAlertDateTime(alert.logged_at)}
                      </TableCell>
                      {showResolvedAtColumn && (
                        <TableCell className='text-xs text-guardai-gray'>
                          {alert.resolved_at
                            ? formatAlertDateTime(alert.resolved_at)
                            : '—'}
                        </TableCell>
                      )}
                      {showStatusColumn && (
                        <TableCell className='text-xs capitalize text-guardai-darkgray'>
                          {alert.status === 'resolved' ? 'Resolved' : alert.status}
                        </TableCell>
                      )}
                    </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {pagination.totalPages > 1 && (
          <div className='px-4 pb-4'>
            <motion.div className='mt-3 flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between'>
              <p className='text-xs text-guardai-gray'>
                Showing <span className='font-medium text-guardai-darkgray'>{rows.length}</span> of{' '}
                <span className='font-medium text-guardai-darkgray'>{pagination.totalCount}</span>
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.hasPrevPage) setPage((p) => p - 1);
                      }}
                      className={cn(
                        'cursor-pointer rounded-md border border-gray-200 px-3 py-2 text-xs',
                        !pagination.hasPrevPage && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((n) => (
                    <PaginationItem key={n}>
                      <PaginationLink
                        href='#'
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(n);
                        }}
                        isActive={n === pagination.currentPage}
                        className={cn(
                          'cursor-pointer rounded-md border px-3 py-1 text-xs',
                          n === pagination.currentPage
                            ? 'border-guardai-red bg-guardai-red text-white'
                            : 'border-gray-200 hover:bg-guardai-red/5'
                        )}
                      >
                        {n}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        if (pagination.hasNextPage) setPage((p) => p + 1);
                      }}
                      className={cn(
                        'cursor-pointer rounded-md border border-gray-200 px-3 py-2 text-xs',
                        !pagination.hasNextPage && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </motion.div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default function CleanlinessPage() {
  const [activeTab, setActiveTab] = useState<'live' | 'alerts' | 'resolved' | 'past'>('live');
  const [viewType, setViewType] = useState<CleanlinessViewType>('grid');
  const [dateFilter, setDateFilter] = useState<'today' | 'last7days'>('today');
  const [activeAlerts, setActiveAlerts] = useState(DUMMY_CLEANLINESS_ALERTS);
  const [resolvedAlerts, setResolvedAlerts] = useState(DUMMY_RESOLVED_CLEANLINESS);

  useEffect(() => {
    const saved = localStorage.getItem('cleanliness-view-type');
    if (saved === 'table' || saved === 'grid') setViewType(saved);
  }, []);

  const handleViewChange = (type: CleanlinessViewType) => {
    setViewType(type);
    localStorage.setItem('cleanliness-view-type', type);
  };

  const sortedLiveItems = useMemo(() => {
    const order = (x: CleanlinessLiveItem) =>
      x.clean === false || x.path_status === false ? 0 : x.clean === null ? 1 : 2;
    return [...DUMMY_CLEANLINESS_LIVE].sort((a, b) => order(a) - order(b));
  }, []);

  const handleResolve = (id: string) => {
    const alert = activeAlerts.find((a) => a._id === id);
    if (!alert) return;
    setActiveAlerts((prev) => prev.filter((a) => a._id !== id));
    setResolvedAlerts((prev) => [
      {
        ...alert,
        status: 'resolved',
        resolved_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const filteredResolvedAlerts = useMemo(() => {
    const cutoff =
      dateFilter === 'today'
        ? startOfDay(new Date()).getTime()
        : subDays(new Date(), 7).getTime();
    return resolvedAlerts.filter((alert) => {
      const resolvedTime = new Date(alert.resolved_at || alert.logged_at).getTime();
      return resolvedTime >= cutoff;
    });
  }, [resolvedAlerts, dateFilter]);

  const alertFeatures: AlertFeature[] = useMemo(
    () => [
      {
        id: 'cleanliness',
        title: 'Cleanliness Alerts',
        description: 'Active cleanliness violation alerts detected by the system.',
        icon: Brush,
        alerts: activeAlerts.filter((a) => a.alertType === 'cleanliness'),
      },
      {
        id: 'blocked_pathway',
        title: 'Blocked Pathway Alerts',
        description: 'Active blocked pathway violation alerts detected by the system.',
        icon: AlertTriangle,
        alerts: activeAlerts.filter((a) => a.alertType === 'blocked_pathway'),
      },
    ],
    [activeAlerts]
  );

  return (
    <DashboardPageShell
      icon={<Brush size={28} className='text-guardai-red' />}
      title='Cleanliness Overview'
      description='Monitor the latest cleanliness status for each camera.'
      toolbar={
        <>
          <div className={dashboardTabListClass}>
            <button
              type='button'
              onClick={() => setActiveTab('live')}
              className={dashboardTabButtonClass(activeTab === 'live')}
            >
              Live
            </button>
          </div>
          <div className='hidden h-6 w-px shrink-0 bg-gray-300 sm:block' />
          <div className={dashboardTabListClass}>
            <button
              type='button'
              onClick={() => setActiveTab('alerts')}
              className={dashboardTabButtonClass(activeTab === 'alerts')}
            >
              Alerts
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('resolved')}
              className={dashboardTabButtonClass(activeTab === 'resolved')}
            >
              Resolved
            </button>
            <button
              type='button'
              onClick={() => setActiveTab('past')}
              className={dashboardTabButtonClass(activeTab === 'past')}
            >
              Past
            </button>
          </div>
          <div className='flex-1' />
          {activeTab !== 'live' && (
            <CleanlinessViewToggle viewType={viewType} onViewChange={handleViewChange} />
          )}
        </>
      }
    >
      {activeTab === 'live' && <CleanlinessLiveSection items={sortedLiveItems} />}
      {activeTab === 'alerts' && (
        <CleanlinessAlertsSection
          viewType={viewType}
          features={alertFeatures}
          onResolve={handleResolve}
        />
      )}
      {activeTab === 'resolved' && (
        <PaginatedCleanlinessCard
          title='Resolved Cleanliness Alerts'
          description='Cleanliness and blocked pathway alerts marked as resolved'
          icon={CheckCircle}
          iconClassName='bg-green-500/10 text-green-500'
          badgeClassName='bg-green-500'
          alerts={filteredResolvedAlerts}
          viewType={viewType}
          showResolvedAtColumn
          showStatusColumn
          headerExtra={
            <Select
              value={dateFilter}
              onValueChange={(v) => setDateFilter(v as 'today' | 'last7days')}
            >
              <SelectTrigger className='h-9 w-[140px] border-gray-200 text-xs'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='today'>Today</SelectItem>
                <SelectItem value='last7days'>Last 7 days</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      )}
      {activeTab === 'past' && (
        <PaginatedCleanlinessCard
          title='Past Cleanliness Alerts'
          description='Resolved and expired cleanliness alerts from the last 30 days'
          icon={Calendar}
          iconClassName='bg-guardai-red/10 text-guardai-red'
          badgeClassName='bg-guardai-red'
          alerts={DUMMY_PAST_CLEANLINESS}
          viewType={viewType}
          showStatusColumn
        />
      )}
    </DashboardPageShell>
  );
}
