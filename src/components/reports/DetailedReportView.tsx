import { useMemo } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Factory,
  HardHat,
  Shield,
  Users,
  BarChart3,
} from 'lucide-react';
import { useDashboardAlerts } from '@/contexts/DashboardAlertsContext';
import { buildReportDetail } from '@/lib/buildReportDetail';
import { ReportDetailSectionCard } from '@/components/reports/ReportDetailSection';
import type { ReportKind, ReportListItem } from '@/types/dashboardAlerts';
import { ScrollArea } from '@/components/ui/scroll-area';

type DetailedReportViewProps = {
  onClose: () => void;
  report?: ReportListItem | null;
};

const KIND_ICON: Record<ReportKind, typeof Factory> = {
  operations: Factory,
  compliance: HardHat,
  security: Shield,
  attendance: Users,
};

export function DetailedReportView({ onClose, report }: DetailedReportViewProps) {
  const { alerts } = useDashboardAlerts();

  const content = useMemo(
    () => buildReportDetail(report ?? undefined, alerts),
    [report, alerts]
  );

  const Icon = KIND_ICON[content.kind];
  const generatedAt = format(new Date(), 'MMM d, yyyy · h:mm a');

  return (
    <div className='flex h-screen flex-col bg-gray-50'>
      <div className='shrink-0 border-b border-gray-200 bg-white p-4 sm:p-6'>
        <div className='mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
          <div className='space-y-3'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg border border-guardai-red/15 bg-guardai-red/10 p-2 text-guardai-red'>
                <Icon className='h-6 w-6' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-guardai-darkgray'>{content.title}</h1>
                <p className='text-sm text-guardai-gray'>{content.subtitle}</p>
              </div>
            </div>
            <div className='ml-12 flex flex-wrap items-center gap-3 text-sm text-guardai-gray'>
              <span>Bisleri Bottling Plant, Uttar Pradesh</span>
              <span>·</span>
              <span>Generated {generatedAt}</span>
              {report?.type && (
                <Badge variant='outline' className='font-mono text-[10px]'>
                  {report.type.toUpperCase()}-{report.id}
                </Badge>
              )}
            </div>
          </div>
          <div className='flex shrink-0 gap-2'>
            <Button variant='outline' onClick={onClose}>
              Close Report
            </Button>
          </div>
        </div>

        <div className='mx-auto mt-4 grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-4'>
          {content.summary.map((item) => (
            <Card key={item.label} className='border-gray-200 shadow-sm'>
              <CardContent className='p-3'>
                <p className='text-[10px] font-medium uppercase tracking-wide text-guardai-gray'>
                  {item.label}
                </p>
                <p className='mt-1 text-xl font-semibold text-guardai-darkgray'>{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <ScrollArea className='flex-1'>
        <div className='mx-auto max-w-7xl space-y-6 p-4 sm:p-6'>
          <div className='flex items-center gap-2 text-sm text-guardai-gray'>
            <BarChart3 className='h-4 w-4 text-guardai-red' />
            Alert breakdown sourced from live dashboard data
          </div>
          {content.sections.map((section) => (
            <ReportDetailSectionCard key={section.id} section={section} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
