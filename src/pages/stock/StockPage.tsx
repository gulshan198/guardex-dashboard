'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { Box, Activity, Truck, BarChart3, LineChart as LineChartIcon, Package, RefreshCw, ChevronDown, Loader2 } from 'lucide-react';
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
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
import { STOCK_PRODUCTION } from '@/lib/stockDummy';

const PRODUCTION_START = new Date('2024-01-15');
const DUMMY_PRODUCTION_STATS = STOCK_PRODUCTION;

const DUMMY_CHART_DAYS = [
  { label: format(subDays(new Date(), 7), 'd MMM'), produced: 41800 },
  { label: format(subDays(new Date(), 6), 'd MMM'), produced: 43200 },
  { label: format(subDays(new Date(), 5), 'd MMM'), produced: 40100 },
  { label: format(subDays(new Date(), 4), 'd MMM'), produced: 45800 },
  { label: format(subDays(new Date(), 3), 'd MMM'), produced: 44400 },
  { label: format(subDays(new Date(), 2), 'd MMM'), produced: 47100 },
  { label: format(subDays(new Date(), 1), 'd MMM'), produced: 46300 },
  { label: format(new Date(), 'd MMM'), produced: 48900 },
];

type LoadingOp = {
  id: string;
  timeIn: string;
  timeOut: string;
  loadingTime: string;
  crates: number;
};

const DUMMY_LOADING_OPS: LoadingOp[] = [
  { id: '1', timeIn: '06:12 AM', timeOut: '06:38 AM', loadingTime: '26 min', crates: 840 },
  { id: '2', timeIn: '07:05 AM', timeOut: '07:41 AM', loadingTime: '36 min', crates: 1120 },
  { id: '3', timeIn: '08:22 AM', timeOut: '08:55 AM', loadingTime: '33 min', crates: 980 },
  { id: '4', timeIn: '09:10 AM', timeOut: '09:48 AM', loadingTime: '38 min', crates: 1250 },
  { id: '5', timeIn: '10:33 AM', timeOut: '11:02 AM', loadingTime: '29 min', crates: 760 },
  { id: '6', timeIn: '11:18 AM', timeOut: '11:52 AM', loadingTime: '34 min', crates: 990 },
  { id: '7', timeIn: '12:40 PM', timeOut: '01:15 PM', loadingTime: '35 min', crates: 1080 },
  { id: '8', timeIn: '02:05 PM', timeOut: '02:44 PM', loadingTime: '39 min', crates: 1320 },
  { id: '9', timeIn: '03:12 PM', timeOut: '03:50 PM', loadingTime: '38 min', crates: 1180 },
  { id: '10', timeIn: '04:28 PM', timeOut: '05:01 PM', loadingTime: '33 min', crates: 910 },
  { id: '11', timeIn: '05:45 PM', timeOut: '06:22 PM', loadingTime: '37 min', crates: 1040 },
  { id: '12', timeIn: '07:08 PM', timeOut: '07:40 PM', loadingTime: '32 min', crates: 870 },
];

type PastRecord = {
  id: string;
  type: 'loading' | 'unloading';
  date: string;
  loadedCount: number;
};

const DUMMY_PAST_LOGISTICS: PastRecord[] = Array.from({ length: 24 }, (_, i) => ({
  id: `p-${i}`,
  type: i % 3 === 0 ? 'unloading' : 'loading',
  date: subDays(new Date(), i + 1).toISOString(),
  loadedCount: 400 + (i % 7) * 120 + (i % 4) * 35,
}));

const formatCompactNumber = (value: number): string => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1).replace(/\.0$/, '')}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1).replace(/\.0$/, '')}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1).replace(/\.0$/, '')}K`;
  return value.toLocaleString();
};

const chartConfig = {
  produced: {
    label: 'Production',
    color: '#ea384c',
  },
} satisfies import('@/components/ui/chart').ChartConfig;

function StockActiveSection() {
  const [refreshing, setRefreshing] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loadMoreBusy, setLoadMoreBusy] = useState(false);
  const loadStep = 10;

  const loadingOps = DUMMY_LOADING_OPS;
  const visibleOps = loadingOps.slice(0, Math.min(visibleCount, loadingOps.length));
  const canLoadMore = visibleOps.length < loadingOps.length;
  const totalLoaded = loadingOps.reduce((s, r) => s + r.crates, 0);

  const handleRefresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), 900);
  };

  const handleLoadMore = () => {
    if (!canLoadMore) return;
    setLoadMoreBusy(true);
    setVisibleCount((n) => Math.min(n + loadStep, loadingOps.length));
    window.setTimeout(() => setLoadMoreBusy(false), 200);
  };

  const stats = DUMMY_PRODUCTION_STATS;

  return (
    <motion.div variants={dashboardItemVariants} className='w-full space-y-6'>
      <TooltipProvider>
        <Card className={cn('w-full border border-gray-200 bg-white shadow-lg')}>
          <CardHeader className='p-3 pb-2 sm:p-4'>
            <div className='flex items-center justify-between gap-2 sm:gap-3'>
              <div className='flex min-w-0 items-center gap-2 sm:gap-3'>
                <div className='shrink-0 rounded-lg bg-guardai-red/10 p-2'>
                  <BarChart3 size={24} className='text-guardai-red' />
                </div>
                <div className='flex min-w-0 flex-col'>
                  <CardTitle className='text-lg font-semibold text-guardai-darkgray'>
                    Production Summary
                  </CardTitle>
                  <p className='truncate text-[10px] text-guardai-gray sm:text-xs md:text-sm'>
                    Since {format(PRODUCTION_START, 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-7 gap-1 border-guardai-red/30 px-2 text-xs text-guardai-red hover:bg-guardai-red/5 hover:text-guardai-red sm:h-8 sm:px-3 sm:text-sm'
                    onClick={handleRefresh}
                    disabled={refreshing}
                    aria-label='Refresh production stats'
                  >
                    <RefreshCw className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', refreshing && 'animate-spin')} />
                    <span className='hidden sm:inline'>{refreshing ? 'Refreshing…' : 'Refresh'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side='top'>Refresh production statistics</TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className='p-3 pt-0 sm:p-4'>
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4'>
              {[
                {
                  icon: LineChartIcon,
                  label: 'Total Production',
                  sub: `Units since ${format(PRODUCTION_START, 'MMM d, yyyy')}`,
                  compact: formatCompactNumber(stats.totalProduction),
                  full: stats.totalProduction.toLocaleString(),
                },
                {
                  icon: Package,
                  label: "Today's Production",
                  sub: 'Units',
                  compact: formatCompactNumber(stats.todayProduction),
                  full: stats.todayProduction.toLocaleString(),
                },
                {
                  icon: BarChart3,
                  label: 'Last hour production',
                  sub: 'Units (today)',
                  compact: `${formatCompactNumber(stats.lastHourUnits)} units`,
                  full: `${stats.lastHourUnits.toLocaleString()} units`,
                },
              ].map((cell) => (
                <Card
                  key={cell.label}
                  className={cn(
                    'border border-gray-200 bg-white shadow-sm transition-shadow hover:border-guardai-red/20 hover:shadow-md',
                    refreshing && 'opacity-90'
                  )}
                >
                  <CardContent className='p-2 sm:p-4'>
                    <div className='flex items-center gap-2 sm:gap-3'>
                      <div className='flex min-w-0 flex-1 items-center gap-2 sm:gap-3'>
                        <div className='shrink-0 rounded-lg bg-guardai-red/10 p-2.5'>
                          <cell.icon className='h-3.5 w-3.5 sm:h-[22px] sm:w-[22px]' />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <p className='truncate text-[10px] text-guardai-gray sm:text-sm'>{cell.label}</p>
                          <p
                            className='truncate text-base font-bold tabular-nums text-guardai-red md:hidden sm:text-xl md:text-2xl'
                            title={cell.full}
                          >
                            {cell.compact}
                          </p>
                          <p className='hidden truncate text-base font-bold tabular-nums text-guardai-red sm:text-xl md:block md:text-2xl'>
                            {cell.full}
                          </p>
                          <p className='mt-0.5 text-[10px] text-guardai-gray sm:text-xs'>{cell.sub}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>

      <Card className={cn('w-full border border-gray-200 bg-white shadow-lg')}>
        <CardHeader className='p-3 pb-2 sm:p-4'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex min-w-0 items-center gap-2 sm:gap-3'>
              <div className='shrink-0 rounded-lg bg-guardai-red/10 p-2'>
                <LineChartIcon className='h-4 w-4 sm:h-5 sm:w-5' />
              </div>
              <div>
                <CardTitle className='text-sm font-semibold text-guardai-darkgray sm:text-base'>
                  Production trend
                </CardTitle>
                <p className='text-[10px] text-guardai-gray sm:text-xs'>Last 8 days (sample)</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-3 pt-0 sm:p-4'>
          <div className='h-[150px] w-full sm:h-[168px]'>
            <ChartContainer
              config={chartConfig}
              className='!aspect-auto h-full min-h-0 w-full max-w-none'
            >
              <LineChart data={DUMMY_CHART_DAYS} margin={{ left: 4, right: 8, top: 4, bottom: 4 }}>
                <CartesianGrid vertical={false} strokeDasharray='3 3' className='stroke-gray-200' />
                <XAxis
                  dataKey='label'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={6}
                  tick={{ fill: '#666666', fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatCompactNumber(Number(v))}
                  width={44}
                  tick={{ fill: '#666666', fontSize: 10 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type='monotone'
                  dataKey='produced'
                  stroke='#ea384c'
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#ea384c', stroke: '#fff', strokeWidth: 1 }}
                  activeDot={{ r: 5, fill: '#ea384c' }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className={cn('w-full border border-gray-200 bg-white shadow-lg')}>
        <CardHeader className='p-3 pb-2 sm:p-4'>
          <div className='mb-2 flex items-center justify-between gap-2'>
            <div className='flex min-w-0 items-center gap-2 sm:gap-3'>
              <div className='shrink-0 rounded-lg bg-guardai-red/10 p-2'>
                <Truck className='h-4 w-4 sm:h-6 sm:w-6' />
              </div>
              <div className='min-w-0'>
                <CardTitle className='text-lg font-semibold text-guardai-darkgray'>
                  Loading Operations
                </CardTitle>
                <p className='truncate text-[10px] text-guardai-gray sm:text-sm'>
                  Track loading operations and crates moved
                </p>
              </div>
            </div>
            <div className='flex shrink-0 items-center gap-1.5'>
              <Activity className='h-3 w-3 text-guardai-red sm:h-3 sm:w-3' />
              <span className='text-[10px] capitalize text-guardai-gray sm:text-xs'>Active</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-3 pt-0 sm:p-4'>
          <div className='mb-3 grid grid-cols-2 gap-2 sm:mb-4 sm:gap-3'>
            <div className='rounded-lg border border-guardai-red/20 bg-guardai-red/5 p-2 text-center sm:p-3'>
              <div className='text-sm font-bold tabular-nums text-guardai-red sm:text-base md:text-lg'>{totalLoaded}</div>
              <div className='text-[10px] text-guardai-darkgray sm:text-xs md:text-base'>Total Loading (Crates)</div>
            </div>
            <div className='rounded-lg border border-guardai-red/20 bg-guardai-red/5 p-2 text-center sm:p-3'>
              <div className='text-sm font-bold tabular-nums text-guardai-red sm:text-base md:text-lg'>
                {loadingOps.length}
              </div>
              <div className='text-[10px] text-guardai-darkgray sm:text-xs md:text-base'>Total Operations</div>
            </div>
          </div>
          <div className='-mx-1 overflow-x-auto rounded-lg border border-gray-200 sm:mx-0'>
            <Table>
              <TableHeader>
                <TableRow className='bg-guardai-red/5'>
                  <TableHead className='whitespace-nowrap px-2 py-1.5 text-[10px] text-guardai-darkgray sm:px-3 sm:py-2 sm:text-xs'>
                    Sno.
                  </TableHead>
                  <TableHead className='whitespace-nowrap px-2 py-1.5 text-[10px] text-guardai-darkgray sm:px-3 sm:py-2 sm:text-xs'>
                    Time In
                  </TableHead>
                  <TableHead className='whitespace-nowrap px-2 py-1.5 text-center text-[10px] text-guardai-darkgray sm:px-3 sm:py-2 sm:text-xs'>
                    Time Out
                  </TableHead>
                  <TableHead className='whitespace-nowrap px-2 py-1.5 text-center text-[10px] text-guardai-darkgray sm:px-3 sm:py-2 sm:text-xs'>
                    Loading time
                  </TableHead>
                  <TableHead className='whitespace-nowrap px-2 py-1.5 text-center text-[10px] text-guardai-darkgray sm:px-3 sm:py-2 sm:text-xs'>
                    Crates Loaded
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleOps.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className='px-2 py-3 text-center text-[10px] text-guardai-gray sm:py-4 sm:text-xs'>
                      No loading activity recorded for today yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  visibleOps.map((record, idx) => (
                    <TableRow key={record.id} className='hover:bg-guardai-red/[0.04]'>
                      <TableCell className='whitespace-nowrap px-2 py-1.5 text-[10px] text-guardai-darkgray sm:px-3 sm:py-2 sm:text-xs'>
                        {idx + 1}
                      </TableCell>
                      <TableCell className='whitespace-nowrap px-2 py-1.5 text-[10px] text-guardai-darkgray sm:px-3 sm:py-2 sm:text-xs'>
                        {record.timeIn}
                      </TableCell>
                      <TableCell className='whitespace-nowrap px-2 py-1.5 text-center text-[10px] text-guardai-darkgray sm:px-3 sm:py-2 sm:text-xs'>
                        {record.timeOut}
                      </TableCell>
                      <TableCell className='whitespace-nowrap px-2 py-1.5 text-center text-[10px] tabular-nums text-guardai-darkgray sm:px-3 sm:py-2 sm:text-xs'>
                        {record.loadingTime}
                      </TableCell>
                      <TableCell className='whitespace-nowrap px-2 py-1.5 text-center text-[10px] font-medium text-guardai-red sm:px-3 sm:py-2 sm:text-xs'>
                        {record.crates}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {canLoadMore && (
          <div className='px-3 pb-3 sm:px-4 sm:pb-4'>
            <div className='mt-3 flex justify-center'>
              <Button
                variant='ghost'
                size='sm'
                className={cn(
                  'h-7 border border-guardai-red/25 bg-white px-2 text-xs text-guardai-red hover:bg-guardai-red/5 sm:h-8 sm:px-3',
                  loadMoreBusy && 'cursor-wait opacity-80'
                )}
                onClick={handleLoadMore}
                disabled={loadMoreBusy}
                aria-busy={loadMoreBusy}
              >
                {loadMoreBusy ? (
                  <span className='flex items-center gap-1.5 sm:gap-2'>
                    <Loader2 className='h-3 w-3 animate-spin sm:h-3.5 sm:w-3.5' />
                    <span className='text-[10px] sm:text-xs'>Loading...</span>
                  </span>
                ) : (
                  <span className='flex items-center gap-1.5 sm:gap-2'>
                    <ChevronDown className='h-3 w-3 sm:h-3.5 sm:w-3.5' />
                    <span className='text-[10px] sm:text-xs'>Load more</span>
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

function StockPastSection() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { rows, pagination } = useMemo(() => {
    const totalCount = DUMMY_PAST_LOGISTICS.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * limit;
    const slice = DUMMY_PAST_LOGISTICS.slice(start, start + limit);
    return {
      rows: slice,
      pagination: {
        currentPage,
        totalPages,
        totalCount,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        limit,
      },
    };
  }, [page]);

  return (
    <motion.div variants={dashboardItemVariants} className='w-full space-y-6'>
      <Card className={cn('w-full border border-gray-200 bg-white shadow-lg')}>
        <CardHeader className='p-4 pb-2'>
          <div className='mb-2 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-guardai-red/10 p-2'>
                <Truck size={24} />
              </div>
              <div className='flex items-center gap-3'>
                <div>
                  <CardTitle className='text-lg font-semibold text-guardai-darkgray'>
                    Past Logistics Operations
                  </CardTitle>
                  <p className='text-sm text-guardai-gray'>
                    All loading &amp; unloading operations before today
                  </p>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Activity size={12} className='text-guardai-red' />
              <span className='text-xs capitalize text-guardai-gray'>Past</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className='p-4 pt-0'>
          <div className='overflow-x-auto rounded-lg border border-gray-200'>
            <Table>
              <TableHeader>
                <TableRow className='bg-guardai-red/5'>
                  <TableHead className='whitespace-nowrap text-xs text-guardai-darkgray'>Sno.</TableHead>
                  <TableHead className='whitespace-nowrap text-xs text-guardai-darkgray'>Type</TableHead>
                  <TableHead className='whitespace-nowrap text-xs text-guardai-darkgray'>Time</TableHead>
                  <TableHead className='whitespace-nowrap text-center text-xs text-guardai-darkgray'>Crates Loaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className='py-4 text-center text-xs text-guardai-gray'>
                      No past logistics data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((record, idx) => (
                    <TableRow key={record.id} className='hover:bg-guardai-red/[0.04]'>
                      <TableCell className='whitespace-nowrap text-xs text-guardai-darkgray'>
                        {(pagination.currentPage - 1) * pagination.limit + idx + 1}
                      </TableCell>
                      <TableCell className='whitespace-nowrap text-xs text-guardai-darkgray'>
                        {record.type === 'loading' ? 'Loading' : 'Unloading'}
                      </TableCell>
                      <TableCell className='whitespace-nowrap text-xs text-guardai-darkgray'>
                        {format(new Date(record.date), 'MMM d, yyyy · h:mm a')}
                      </TableCell>
                      <TableCell className='whitespace-nowrap text-center text-xs font-medium text-guardai-red'>
                        {record.loadedCount}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {pagination.totalPages > 1 && (
          <div className='px-4 pb-4'>
            <div className='mt-3 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between'>
              <div className='text-xs text-guardai-gray'>
                Showing{' '}
                <span className='font-medium text-guardai-darkgray'>{rows.length}</span> of{' '}
                <span className='font-medium text-guardai-darkgray'>{pagination.totalCount}</span> past logistics records
              </div>
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
                        'cursor-pointer rounded-md border border-gray-200 px-3 py-2 text-xs text-guardai-darkgray transition-all hover:border-guardai-red/30 hover:bg-guardai-red/5',
                        !pagination.hasPrevPage && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNumber) => (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href='#'
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNumber);
                        }}
                        isActive={pageNumber === pagination.currentPage}
                        className={cn(
                          'cursor-pointer rounded-md border px-3 py-1 text-xs transition-colors',
                          pageNumber === pagination.currentPage
                            ? 'border-guardai-red bg-guardai-red text-white hover:bg-guardai-red/90 hover:text-white'
                            : 'border-gray-200 text-guardai-darkgray hover:border-guardai-red/30 hover:bg-guardai-red/5'
                        )}
                      >
                        {pageNumber}
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
                        'cursor-pointer rounded-md border border-gray-200 px-3 py-2 text-xs text-guardai-darkgray transition-all hover:border-guardai-red/30 hover:bg-guardai-red/5',
                        !pagination.hasNextPage && 'pointer-events-none opacity-50'
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default function StockPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'past'>('active');

  return (
    <DashboardPageShell
      icon={<Box size={28} className='text-guardai-red' />}
      title='Stock Management'
      description='Real-time monitoring of stock management, inventory, and warehouse operations.'
      toolbar={
        <div className={dashboardTabListClass}>
          <button
            type='button'
            onClick={() => setActiveTab('active')}
            className={dashboardTabButtonClass(activeTab === 'active')}
          >
            Active
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('past')}
            className={dashboardTabButtonClass(activeTab === 'past')}
          >
            Past
          </button>
        </div>
      }
    >
      {activeTab === 'active' ? <StockActiveSection /> : <StockPastSection />}
    </DashboardPageShell>
  );
}
