import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { buildAlertsByAreaFromDashboard } from '@/lib/buildReportAlertsByArea';
import { buildDailyPdfAlertGroups } from '@/lib/buildReportDetail';
import { DASHBOARD_ALERTS_SEED } from '@/lib/dashboardAlertsSeed';
import type { DashboardAlertsState, ReportDetailSection } from '@/types/dashboardAlerts';

export type GenerateSimpleReportOptions = {
  plantName?: string;
  alerts?: DashboardAlertsState;
};

/** Guardex brand red #e31e24 — headings only when alerts exist */
const BRAND_RED: [number, number, number] = [227, 30, 36];
const INK: [number, number, number] = [24, 24, 25];
const MUTED: [number, number, number] = [90, 90, 90];
const PAPER: [number, number, number] = [248, 247, 243];
const TABLE_HEAD_BG: [number, number, number] = [235, 235, 235];
const PAGE_ACCENT: [number, number, number] = [200, 200, 200];

const TABLE_THEME = {
  styles: {
    fontSize: 8,
    cellPadding: 2.2,
    overflow: 'linebreak' as const,
    textColor: INK,
  },
  headStyles: {
    fillColor: TABLE_HEAD_BG,
    textColor: INK,
    fontStyle: 'bold' as const,
  },
  alternateRowStyles: { fillColor: PAPER },
  margin: { left: 14, right: 14 },
};

function headingColor(hasAlerts: boolean): [number, number, number] {
  return hasAlerts ? BRAND_RED : INK;
}

function getLastTableY(doc: jsPDF): number {
  const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    ?.finalY;
  return finalY ?? 14;
}

function drawSectionTable(
  doc: jsPDF,
  startY: number,
  section: ReportDetailSection
): number {
  const head = [section.columns.map((c) => c.label)];
  const body =
    section.rows.length > 0
      ? section.rows.map((row) =>
          section.columns.map((c) => String(row[c.key] ?? '—'))
        )
      : [
          [
            {
              content: 'No alerts recorded',
              colSpan: section.columns.length,
              styles: { halign: 'center' as const, textColor: MUTED },
            },
          ],
        ];

  autoTable(doc, {
    ...TABLE_THEME,
    startY,
    head,
    body,
    theme: 'grid',
  });

  return getLastTableY(doc);
}

function drawBrandHeader(
  doc: jsPDF,
  plantName: string,
  reportDate: Date,
  totalAlerts: number
) {
  const pageW = doc.internal.pageSize.getWidth();
  const hasAlerts = totalAlerts > 0;

  doc.setFillColor(...PAGE_ACCENT);
  doc.rect(0, 0, pageW, 2, 'F');

  let y = 14;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...headingColor(hasAlerts));
  doc.text('Guardex Daily Site Report', 14, y);

  y += 7;
  doc.setDrawColor(...headingColor(hasAlerts));
  doc.setLineWidth(0.4);
  doc.line(14, y, 80, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text(`${plantName} · ${format(reportDate, 'EEEE, dd MMMM yyyy')}`, 14, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...INK);
  doc.text(`Total alerts: ${totalAlerts}`, 14, y);

  return y + 12;
}

function drawHeading(
  doc: jsPDF,
  y: number,
  text: string,
  hasAlerts: boolean,
  size = 12
) {
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(size);
  doc.setTextColor(...headingColor(hasAlerts));
  doc.text(text, 14, y);
  doc.setTextColor(...INK);
  return y + (size >= 12 ? 7 : 5);
}

function ensureSpace(doc: jsPDF, y: number, needed = 40): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  if (y + needed > pageHeight - 14) {
    doc.addPage();
    drawPageAccent(doc);
    return 18;
  }
  return y;
}

function drawPageAccent(doc: jsPDF) {
  const pageW = doc.internal.pageSize.getWidth();
  doc.setFillColor(...PAGE_ACCENT);
  doc.rect(0, 0, pageW, 2, 'F');
}

/** Daily report PDF with summary + one table per alert category. */
export async function generateSimpleDailyReportPdf(
  options: GenerateSimpleReportOptions = {}
): Promise<Uint8Array> {
  const plantName = options.plantName ?? 'Gautam Plant';
  const alerts = options.alerts ?? DASHBOARD_ALERTS_SEED;
  const reportDate = new Date();

  const { rows, segments, totalAlerts } = buildAlertsByAreaFromDashboard(alerts);
  const alertGroups = buildDailyPdfAlertGroups(alerts);
  const hasAnyAlerts = totalAlerts > 0;

  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  let y = drawBrandHeader(doc, plantName, reportDate, totalAlerts);

  y = drawHeading(doc, y, 'Alerts by area', hasAnyAlerts, 12);
  y = ensureSpace(doc, y, 30);

  const areaHead = ['#', 'Area', ...segments.map((s) => s.label), 'Total'];
  const areaBody =
    rows.length > 0
      ? rows.map((r, i) => [
          String(i + 1).padStart(2, '0'),
          String(r.area ?? '—'),
          ...segments.map((s) => String(Number(r[s.key]) || 0)),
          String(r._total ?? 0),
        ])
      : [['—', 'No alerts', ...segments.map(() => '0'), '0']];

  autoTable(doc, {
    ...TABLE_THEME,
    startY: y,
    head: [areaHead],
    body: areaBody,
  });
  y = getLastTableY(doc) + 12;

  for (const { sections } of alertGroups) {
    for (const section of sections) {
      const sectionHasAlerts = section.count > 0;

      y = ensureSpace(doc, y, 28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...headingColor(sectionHasAlerts));
      doc.text(section.title, 14, y);
      y += 4;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...MUTED);
      doc.text(`${section.description} · ${section.count} record(s)`, 14, y);
      doc.setTextColor(...INK);
      y += 5;

      y = drawSectionTable(doc, y, section);
      y += 10;
    }
  }

  return new Uint8Array(doc.output('arraybuffer'));
}

export function downloadAnalyticsReportPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
