import { useMemo, useState } from "react";
import { Factory, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  IdleMachineryReportCamera,
  IdleMachineryReportPayload,
} from "@/lib/idleMachineryDummy";

const MIN_IDLE_SECONDS = 60;

function coerceDate(value: unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    const ms = value < 1e12 ? value * 1000 : value;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string") {
    const t = value.trim();
    if (!t) return null;
    const d = new Date(t);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "object" && value !== null && "$date" in (value as object)) {
    const inner = (value as { $date?: string | number }).$date;
    return coerceDate(inner ?? null);
  }
  return null;
}

function normalizeAuditEntry(entry: unknown): unknown {
  if (typeof entry === "string") {
    const t = entry.trim();
    if (!t) return entry;
    try {
      return JSON.parse(t) as unknown;
    } catch {
      return entry;
    }
  }
  return entry;
}

function parseAuditInterval(entry: unknown): {
  start: Date;
  end: Date;
  durationSec: number;
} | null {
  const raw = normalizeAuditEntry(entry);

  if (Array.isArray(raw) && raw.length >= 2) {
    const start = coerceDate(raw[0]);
    const end = coerceDate(raw[1]);
    if (start && end && end.getTime() >= start.getTime()) {
      return {
        start,
        end,
        durationSec: Math.round((end.getTime() - start.getTime()) / 1000),
      };
    }
  }

  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>;
    const lower = Object.fromEntries(
      Object.entries(o).map(([k, v]) => [k.toLowerCase(), v])
    );

    const startKeys = [
      "start",
      "start_time",
      "starttime",
      "from",
      "begin",
      "t0",
      "idle_start",
      "idlestart",
      "start_ts",
    ];
    const endKeys = [
      "end",
      "end_time",
      "endtime",
      "to",
      "finish",
      "t1",
      "idle_end",
      "idleend",
      "end_ts",
    ];

    let start: Date | null = null;
    let end: Date | null = null;

    for (const k of startKeys) {
      if (k in lower) {
        start = coerceDate(lower[k]);
        break;
      }
    }
    for (const k of endKeys) {
      if (k in lower) {
        end = coerceDate(lower[k]);
        break;
      }
    }

    if (start && end && end.getTime() >= start.getTime()) {
      return {
        start,
        end,
        durationSec: Math.round((end.getTime() - start.getTime()) / 1000),
      };
    }

    const dur =
      (typeof o.duration_seconds === "number" && o.duration_seconds) ||
      (typeof o.durationSeconds === "number" && o.durationSeconds) ||
      (typeof o.duration_sec === "number" && o.duration_sec) ||
      (typeof lower.duration_seconds === "number" && lower.duration_seconds) ||
      null;

    if (start && typeof dur === "number" && dur >= 0) {
      const endFromDur = new Date(start.getTime() + dur * 1000);
      return {
        start,
        end: endFromDur,
        durationSec: Math.round(dur),
      };
    }
  }

  return null;
}

function formatIdleDurationRow(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h : ${m}m : ${String(s).padStart(2, "0")}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

function formatIdleDurationTotal(totalSeconds: number): string {
  const sec = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}h : ${m}m : ${String(s).padStart(2, "0")}s`;
  if (m > 0) return `${m}m : ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
}

function parseAuditRowsAllParsed(audit: unknown[]) {
  const rows: { start: Date; end: Date; durationSec: number }[] = [];
  for (const entry of audit) {
    const row = parseAuditInterval(entry);
    if (row) rows.push(row);
  }
  return rows;
}

function parseAuditRows(audit: unknown[]) {
  return parseAuditRowsAllParsed(audit).filter(
    (r) => r.durationSec >= MIN_IDLE_SECONDS
  );
}

function totalIdleSecondsForCamera(camera: IdleMachineryReportCamera): number {
  let total = 0;
  for (const m of camera.machines) {
    for (const r of parseAuditRows(m.audit)) {
      total += r.durationSec;
    }
  }
  return total;
}

function ZoneWiseIdleTable({ audit }: { audit: unknown[] }) {
  const rows = useMemo(() => parseAuditRows(audit), [audit]);
  const parsedAll = useMemo(() => parseAuditRowsAllParsed(audit), [audit]);
  const totalSec = rows.reduce((s, r) => s + r.durationSec, 0);

  if (audit.length === 0) {
    return (
      <p className="text-[11px] text-guardai-gray py-1.5">No audit records.</p>
    );
  }

  if (parsedAll.length === 0) {
    return (
      <p className="text-[11px] text-guardai-gray py-1.5 leading-snug">
        Could not parse idle intervals. Expected start/end times or duration per
        row.
      </p>
    );
  }

  if (rows.length === 0) {
    return (
      <p className="text-[11px] text-guardai-gray py-1.5 leading-snug">
        No idle periods of 1 minute or longer in this audit (shorter intervals
        are hidden).
      </p>
    );
  }

  return (
    <div className="rounded-md border border-gray-200 bg-white/60 overflow-hidden">
      <div className="max-h-[min(240px,42vh)] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-gray-200 bg-gray-100">
              <TableHead className="text-center text-[10px] uppercase tracking-wide font-semibold text-guardai-gray h-8 px-2 w-10">
                #
              </TableHead>
              <TableHead className="text-center text-[10px] uppercase tracking-wide font-semibold text-guardai-gray h-8 px-2 min-w-[130px]">
                Start
              </TableHead>
              <TableHead className="text-center text-[10px] uppercase tracking-wide font-semibold text-guardai-gray h-8 px-2 min-w-[130px]">
                End
              </TableHead>
              <TableHead className="text-center text-[10px] uppercase tracking-wide font-semibold text-guardai-gray h-8 px-2 w-[100px]">
                Idle
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow
                key={i}
                className={cn(
                  "border-0 text-[11px] text-center",
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                )}
              >
                <TableCell className="py-1.5 px-2 font-medium tabular-nums">
                  {i + 1}
                </TableCell>
                <TableCell className="py-1.5 px-2 whitespace-nowrap tabular-nums">
                  {format(r.start, "dd MMM yyyy, HH:mm:ss")}
                </TableCell>
                <TableCell className="py-1.5 px-2 whitespace-nowrap tabular-nums">
                  {format(r.end, "dd MMM yyyy, HH:mm:ss")}
                </TableCell>
                <TableCell className="py-1.5 px-2 whitespace-nowrap font-medium">
                  {formatIdleDurationRow(r.durationSec)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div
        className={cn(
          "flex items-center justify-end gap-3 border-t px-2 py-1.5 text-[11px]",
          "border-guardai-red/20 bg-guardai-red/10"
        )}
      >
        <span className="text-guardai-red/90 font-medium">Total idle time</span>
        <span className="font-semibold tabular-nums text-guardai-red">
          {formatIdleDurationTotal(totalSec)}
        </span>
      </div>
    </div>
  );
}

function cameraStats(camera: IdleMachineryReportCamera) {
  let intervals = 0;
  for (const m of camera.machines) {
    intervals += parseAuditRows(m.audit).length;
  }
  return {
    machineCount: camera.machines.length,
    intervalCount: intervals,
  };
}

function CameraAccordionItem({ camera }: { camera: IdleMachineryReportCamera }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const { machineCount, intervalCount } = useMemo(
    () => cameraStats(camera),
    [camera]
  );
  const zoneTotalIdleSec = useMemo(
    () => totalIdleSecondsForCamera(camera),
    [camera]
  );

  const formatCount = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    return 0;
  };

  const formatPct = (part: number, total: number) => {
    if (!Number.isFinite(part) || !Number.isFinite(total) || total <= 0)
      return "0%";
    const pct = (part * 100) / total;
    if (!Number.isFinite(pct)) return "0%";
    return `${pct.toFixed(pct < 10 ? 1 : 0)}%`;
  };

  const openPreview = () => {
    if (camera.zoneImageUrl) setPreviewOpen(true);
  };

  return (
    <AccordionItem
      value={camera.cameraId}
      className="border-b-0! border border-gray-200 rounded-lg px-0 mb-2 last:mb-0 overflow-hidden bg-white/40 data-[state=open]:shadow-sm"
    >
      <AccordionTrigger
        className={cn(
          "py-2.5 px-3 hover:no-underline gap-3 [&>svg]:shrink-0",
          "data-[state=open]:bg-gray-50"
        )}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1 text-left">
          {camera.zoneImageUrl ? (
            <span
              className="relative z-10 shrink-0 cursor-zoom-in rounded-md ring-offset-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guardai-red focus-visible:ring-offset-2"
              role="button"
              tabIndex={0}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                openPreview();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  openPreview();
                }
              }}
            >
              <img
                src={camera.zoneImageUrl}
                alt=""
                className="h-11 w-11 rounded-md object-cover border border-gray-200 pointer-events-none"
              />
            </span>
          ) : (
            <div className="h-11 w-11 shrink-0 rounded-md border border-dashed border-gray-200 bg-gray-100" />
          )}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-guardai-darkgray truncate">
              {camera.roomName}
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
              <span className="text-[10px] text-guardai-gray font-mono truncate">
                {camera.cameraId}
              </span>
              <span className="text-[10px] text-guardai-gray">
                · {machineCount} machine{machineCount !== 1 ? "s" : ""}
              </span>
              {intervalCount > 0 && (
                <span className="text-[10px] text-guardai-gray">
                  · {intervalCount} idle period
                  {intervalCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="px-0 pb-0">
        <div className="border-t border-gray-200/80 p-3">
          <div className="grid grid-cols-1 lg:grid-cols-[4fr_6fr] gap-4 items-start">
            <div className="lg:sticky lg:top-0 min-w-0 w-full space-y-2">
              {camera.zoneImageUrl ? (
                <button
                  type="button"
                  onClick={openPreview}
                  className="group w-full rounded-md border border-gray-200 bg-gray-50 p-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-guardai-red focus-visible:ring-offset-2"
                  aria-label={`View full zone image for ${camera.roomName}`}
                >
                  <img
                    src={camera.zoneImageUrl}
                    alt={`Zone ${camera.roomName}`}
                    className="w-full max-h-[min(280px,45vh)] rounded-md object-contain transition-opacity group-hover:opacity-95 cursor-zoom-in"
                  />
                </button>
              ) : (
                <div className="rounded-md border border-dashed border-gray-200 px-3 py-6 text-center text-[10px] text-guardai-gray">
                  No zone image
                </div>
              )}
              {zoneTotalIdleSec > 0 ? (
                <div
                  className={cn(
                    "rounded-md border px-2.5 py-2 text-center",
                    "border-guardai-red/25 bg-guardai-red/5"
                  )}
                >
                  <div className="text-[10px] font-medium uppercase tracking-wide text-guardai-red/90">
                    Total idle
                  </div>
                  <div className="text-sm font-semibold tabular-nums text-guardai-red mt-0.5">
                    {formatIdleDurationTotal(zoneTotalIdleSec)}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 min-w-0 lg:min-w-0">
              <Accordion
                type="single"
                collapsible
                defaultValue={
                  camera.machines.length > 0
                    ? `${camera.cameraId}-m-0`
                    : undefined
                }
                className="w-full space-y-2"
              >
                {camera.machines.map((machine, mi) => {
                  const itemValue = `${camera.cameraId}-m-${mi}`;
                  const label = machine.name?.trim() || `Machine ${mi + 1}`;
                  const iv = parseAuditRows(machine.audit).length;
                  const understaffed = formatCount(machine.understaffed);
                  const overstaffed = formatCount(machine.overstaffed);
                  const normal = formatCount(machine.normalCount);
                  const staffingTotal = understaffed + overstaffed + normal;
                  const uPct = formatPct(understaffed, staffingTotal);
                  const oPct = formatPct(overstaffed, staffingTotal);
                  const nPct = formatPct(normal, staffingTotal);
                  return (
                    <AccordionItem
                      key={itemValue}
                      value={itemValue}
                      className="border-b-0! rounded-md border border-gray-200/70 bg-white/80 overflow-hidden"
                    >
                      <AccordionTrigger
                        className={cn(
                          "py-2 px-2.5 sm:px-3 hover:no-underline gap-2",
                          "hover:bg-gray-50 data-[state=open]:bg-gray-50",
                          "data-[state=open]:border-b data-[state=open]:border-gray-200/50"
                        )}
                      >
                        <div className="flex flex-1 min-w-0 items-center justify-between gap-2 text-left pr-1">
                          <span className="text-xs font-semibold text-guardai-darkgray truncate">
                            {label}
                          </span>
                          <div className="flex flex-wrap items-center justify-end gap-1.5 shrink-0">
                            {iv > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-[10px] h-5 px-1.5 font-normal"
                              >
                                {iv} period{iv !== 1 ? "s" : ""}
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] h-5 px-1.5 font-normal",
                                understaffed > 0
                                  ? "border-guardai-red/30 bg-guardai-red/10 text-guardai-red"
                                  : "text-guardai-gray"
                              )}
                            >
                              U:{understaffed} ({uPct})
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] h-5 px-1.5 font-normal",
                                overstaffed > 0
                                  ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                                  : "text-guardai-gray"
                              )}
                            >
                              O:{overstaffed} ({oPct})
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] h-5 px-1.5 font-normal",
                                normal > 0
                                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                                  : "text-guardai-gray"
                              )}
                            >
                              N:{normal} ({nPct})
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-0 border-t border-gray-200/40">
                        <div className="px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3">
                          <ZoneWiseIdleTable audit={machine.audit} />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </div>
      </AccordionContent>
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[min(96vw,1200px)] max-h-[92vh] overflow-y-auto border-gray-200 p-3 sm:p-4">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold pr-8">
              Zone · {camera.roomName}
            </DialogTitle>
          </DialogHeader>
          {camera.zoneImageUrl ? (
            <img
              src={camera.zoneImageUrl}
              alt={`Zone ${camera.roomName}`}
              className="mx-auto max-h-[min(80vh,900px)] w-auto max-w-full rounded-md border border-gray-200 object-contain bg-gray-50"
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </AccordionItem>
  );
}

interface IdleMachinesReportSectionProps {
  payload: IdleMachineryReportPayload | undefined;
  isLoading: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function IdleMachinesReportSection({
  payload,
  isLoading,
  onRefresh,
  isRefreshing,
}: IdleMachinesReportSectionProps) {
  const camerasWithZoneImage = useMemo(
    () =>
      (payload?.cameras ?? []).filter((c) => Boolean(c.zoneImageUrl?.trim())),
    [payload?.cameras]
  );

  const updatedLabel =
    !isLoading &&
    payload?.idleStatsUpdatedAt &&
    !Number.isNaN(new Date(payload.idleStatsUpdatedAt).getTime())
      ? format(new Date(payload.idleStatsUpdatedAt), "MMM d, yyyy · HH:mm")
      : null;

  const summary = useMemo(() => {
    if (!camerasWithZoneImage.length) {
      return { cameras: 0, machines: 0 };
    }
    const machines = camerasWithZoneImage.reduce(
      (n, c) => n + c.machines.length,
      0
    );
    return { cameras: camerasWithZoneImage.length, machines };
  }, [camerasWithZoneImage]);

  const defaultOpen = useMemo(
    () => camerasWithZoneImage[0]?.cameraId,
    [camerasWithZoneImage]
  );

  const showEmptyState =
    !isLoading &&
    (!payload ||
      payload.featureEnabled === false ||
      camerasWithZoneImage.length === 0);

  return (
    <Card className="border border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="p-3 sm:p-4 pb-2 space-y-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-guardai-red/10 shrink-0 border border-guardai-red/15 text-guardai-red">
              <Factory className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg font-semibold leading-tight text-guardai-darkgray">
                Idle machines
              </CardTitle>
              {updatedLabel && (
                <CardDescription className="text-[11px] sm:text-xs mt-0.5 text-guardai-gray">
                  Snapshot · {updatedLabel}
                </CardDescription>
              )}
            </div>
          </div>
          {!isLoading && camerasWithZoneImage.length ? (
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="secondary" className="text-[10px] h-6 font-medium">
                {summary.cameras} zone{summary.cameras !== 1 ? "s" : ""}
              </Badge>
              <Badge variant="outline" className="text-[10px] h-6 font-medium">
                {summary.machines} machine{summary.machines !== 1 ? "s" : ""}
              </Badge>
              {onRefresh ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-6 px-2 text-[10px] font-medium"
                  onClick={onRefresh}
                  disabled={Boolean(isLoading || isRefreshing)}
                  aria-label="Refresh idle machines report"
                >
                  <RefreshCw
                    className={cn("h-3 w-3", isRefreshing ? "animate-spin" : "")}
                  />
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 pt-0">
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
          </div>
        ) : showEmptyState ? (
          <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-center">
            <p className="text-sm font-medium text-guardai-darkgray">
              No data available
            </p>
            <p className="text-xs text-guardai-gray mt-1">
              There are no idle machinery snapshots to show for this project right
              now.
            </p>
          </div>
        ) : payload ? (
          <Accordion
            type="single"
            collapsible
            defaultValue={defaultOpen}
            className="w-full"
          >
            {camerasWithZoneImage.map((cam) => (
              <CameraAccordionItem key={cam.cameraId} camera={cam} />
            ))}
          </Accordion>
        ) : null}
      </CardContent>
    </Card>
  );
}
