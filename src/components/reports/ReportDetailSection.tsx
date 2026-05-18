import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FileText } from 'lucide-react';
import type { ReportDetailSection as ReportSection } from '@/types/dashboardAlerts';

type Props = {
  section: ReportSection;
};

export function ReportDetailSectionCard({ section }: Props) {
  return (
    <Card className='border border-gray-200 shadow-sm overflow-hidden'>
      <CardHeader className='bg-gray-50 border-b p-4'>
        <div className='flex flex-wrap items-center justify-between gap-2'>
          <CardTitle className='flex items-center gap-2 text-lg text-guardai-darkgray'>
            <FileText className='h-5 w-5 text-guardai-red' />
            {section.title}
          </CardTitle>
          <Badge variant='secondary' className='text-xs font-medium'>
            {section.count} record{section.count !== 1 ? 's' : ''}
          </Badge>
        </div>
        <p className='mt-1 text-sm text-guardai-gray'>{section.description}</p>
      </CardHeader>
      <CardContent className='p-0'>
        {section.count === 0 ? (
          <p className='py-10 text-center text-sm text-guardai-gray'>
            No incidents in this category for the selected period.
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='bg-guardai-red/5 hover:bg-guardai-red/5'>
                  {section.columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className='text-xs font-semibold text-guardai-darkgray whitespace-nowrap'
                    >
                      {col.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {section.rows.map((row, idx) => (
                  <TableRow key={idx} className='hover:bg-gray-50'>
                    {section.columns.map((col) => {
                      const value = row[col.key];
                      const isStatus = col.key === 'status';
                      return (
                        <TableCell key={col.key} className='text-sm text-guardai-darkgray'>
                          {isStatus ? (
                            <Badge
                              variant='outline'
                              className={
                                String(value).toLowerCase() === 'active'
                                  ? 'border-amber-200 bg-amber-50 text-amber-800'
                                  : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                              }
                            >
                              {value}
                            </Badge>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
