import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, Filter, ChevronDown, FileCog, PieChart, BarChart, LineChart, Clock, Volume2, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { ReportGenerationDialog } from "@/components/reports/ReportGenerationDialog";
import { DetailedReportView } from "@/components/reports/DetailedReportView";
import { IdleMachinesReportSection } from "@/components/reports/IdleMachinesReportSection";
import { DUMMY_IDLE_MACHINERY_PAYLOAD } from "@/lib/idleMachineryDummy";
import type { ReportListItem } from "@/types/dashboardAlerts";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { DashboardPageShell } from "@/components/layout/DashboardPageShell";
import { cn } from "@/lib/utils";
import { useDashboardAlerts } from "@/contexts/DashboardAlertsContext";
import {
  downloadAnalyticsReportPdf,
  generateSimpleDailyReportPdf,
} from "@/lib/generateAnalyticsReportPdf";

export default function ReportsPage() {
  const [showGenerationDialog, setShowGenerationDialog] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportListItem | null>(null);
  const [reportType, setReportType] = useState("today");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSpecificCalendar, setShowSpecificCalendar] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [dashboardTimePeriod, setDashboardTimePeriod] = useState("today");
  const [dashboardData, setDashboardData] = useState({
    operations: 70,
    security: 47,
    compliance: 39,
    total: 156
  });
  const [staticDashboardData] = useState({
    operations: 70,
    security: 47,
    compliance: 39,
    total: 156
  });

  const getScaledData = (timePeriod: string) => {
    const baseData = {
      operations: 70,
      security: 47,
      compliance: 39,
      total: 156
    };

    let scale = 1;
    switch (timePeriod) {
      case "today":
        scale = 0.3; // ~50 alerts
        break;
      case "lastWeek":
        scale = 2.2; // ~350 alerts
        break;
      case "lastMonth":
        scale = 9.6; // ~1500 alerts
        break;
    }

    return {
      operations: Math.round(baseData.operations * scale),
      security: Math.round(baseData.security * scale),
      compliance: Math.round(baseData.compliance * scale),
      total: Math.round(baseData.total * scale)
    };
  };
  const [showAudioSummary, setShowAudioSummary] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentSummary, setCurrentSummary] = useState("");
  const [scheduledReports, setScheduledReports] = useState({
    dailySummary: { enabled: true, time: "06:00" },
    weeklyAnalytics: { enabled: true, time: "09:00" },
    monthlyCompliance: { enabled: false, time: "08:00" }
  });
  const [idlePayload, setIdlePayload] = useState(DUMMY_IDLE_MACHINERY_PAYLOAD);
  const [idleRefreshing, setIdleRefreshing] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const { alerts } = useDashboardAlerts();

  const handleIdleRefresh = () => {
    setIdleRefreshing(true);
    window.setTimeout(() => {
      setIdlePayload((prev) => ({
        ...prev,
        idleStatsUpdatedAt: new Date().toISOString(),
      }));
      setIdleRefreshing(false);
    }, 800);
  };

  const handleScheduledReportToggle = (reportType: string, enabled: boolean) => {
    setScheduledReports(prev => ({
      ...prev,
      [reportType]: { ...prev[reportType as keyof typeof prev], enabled }
    }));
  };

  const handleScheduledReportTimeChange = (reportType: string, time: string) => {
    setScheduledReports(prev => ({
      ...prev,
      [reportType]: { ...prev[reportType as keyof typeof prev], time }
    }));
  };

  const handleDashboardTimeChange = (value: string) => {
    setDashboardTimePeriod(value);
    generateDashboardData(value);
  };

  const generateDashboardData = (timePeriod: string) => {
    let total = 0;
    let operations = 0;
    let security = 0;
    let compliance = 0;

    switch (timePeriod) {
      case "today":
        total = Math.floor(Math.random() * 30) + 40; // 40-70
        operations = Math.floor(total * 0.45);
        security = Math.floor(total * 0.3);
        compliance = total - operations - security;
        break;
      case "lastWeek":
        total = Math.floor(Math.random() * 100) + 300; // 300-400
        operations = Math.floor(total * 0.45);
        security = Math.floor(total * 0.3);
        compliance = total - operations - security;
        break;
      case "lastMonth":
        total = Math.floor(Math.random() * 500) + 1200; // 1200-1700
        operations = Math.floor(total * 0.45);
        security = Math.floor(total * 0.3);
        compliance = total - operations - security;
        break;
    }

    setDashboardData({ operations, security, compliance, total });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  const handleGenerateReport = (config: any) => {
    console.log("Generating report with config:", config);
    // Simulate report generation
    setTimeout(() => {
      setShowDetailedReport(true);
    }, 1000);
  };

  const handleViewReport = (report: ReportListItem) => {
    setSelectedReport(report);
    setShowDetailedReport(true);
  };

  const handleDownloadAllReports = async () => {
    setIsDownloadingAll(true);
    try {
      const bytes = await generateSimpleDailyReportPdf({
        plantName: 'Gautam Plant',
        alerts,
      });
      downloadAnalyticsReportPdf(
        bytes,
        `Guardex_Daily_Site_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`
      );
    } catch (err) {
      console.error('Failed to generate report PDF:', err);
    } finally {
      setIsDownloadingAll(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate quick refresh
    setTimeout(() => {
      setIsRefreshing(false);
      // Regenerate dashboard data to simulate new data
      generateDashboardData(dashboardTimePeriod);
    }, 800);
  };

  const handleAudioSummary = () => {
    const summary = getTodaySummary();
    setCurrentSummary(summary);
    setShowAudioSummary(true);

    // Start playing audio
    setIsPlayingAudio(true);
    const utterance = new SpeechSynthesisUtterance(summary);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice =>
      voice.name.includes('Google') || voice.name.includes('Samantha') || voice.name.includes('Alex')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    speechSynthesis.speak(utterance);
  };

  const getTodaySummary = () => {
    return `Today's security summary: ${dashboardData.total} total alerts were raised across all dashboards. Operations dashboard had ${dashboardData.operations} alerts, Security dashboard had ${dashboardData.security} alerts, and Compliance dashboard had ${dashboardData.compliance} alerts. The alert resolution rate is currently at 87%. All systems are operating normally with no critical issues reported.`;
  };

  const stopAudio = () => {
    speechSynthesis.cancel();
    setIsPlayingAudio(false);
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
    } else {
      // Use the stored summary instead of generating new one
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(currentSummary);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice =>
        voice.name.includes('Google') || voice.name.includes('Samantha') || voice.name.includes('Alex')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      speechSynthesis.speak(utterance);
    }
  };

  const reports: ReportListItem[] = [
    {
      id: 1,
      title: "Operational Report",
      description: "Idle machinery and loitering incidents from the Operations dashboard",
      date: "Today, 6:00 AM",
      type: "Operations",
      kind: "operations",
      size: "3.2 MB",
      icon: BarChart
    },
    {
      id: 2,
      title: "Attendance Report",
      description: "Employee attendance tracking and workforce management analytics",
      date: "Today, 5:30 AM",
      type: "HR",
      kind: "attendance",
      size: "1.8 MB",
      icon: LineChart
    },
    {
      id: 3,
      title: "Compliance Dashboard Report",
      description: "PPE, phone usage, and sleep violations from the Compliance dashboard",
      date: "Today, 5:00 AM",
      type: "Compliance",
      kind: "compliance",
      size: "2.1 MB",
      icon: PieChart
    },
    {
      id: 4,
      title: "Security Report",
      description: "Perimeter, restricted access, and fire & smoke alerts from Security",
      date: "Today, 4:30 AM",
      type: "Security",
      kind: "security",
      size: "4.5 MB",
      icon: FileCog
    }
  ];

  if (showDetailedReport) {
    return <DetailedReportView onClose={() => setShowDetailedReport(false)} report={selectedReport} />;
  }

  const reportFiltersToolbar = (
    <motion.div variants={itemVariants} className="flex w-full flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Select value={reportType} onValueChange={setReportType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select report type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today's Report</SelectItem>
            <SelectItem value="specific">Specific Date Report</SelectItem>
            <SelectItem value="range">Date Range Report</SelectItem>
          </SelectContent>
        </Select>

        {/* Specific Date Calendar */}
        {reportType === "specific" && (
          <div className="flex items-center gap-2">
            <Popover open={showSpecificCalendar} onOpenChange={setShowSpecificCalendar}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-48 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    setSelectedDate(date);
                    setShowSpecificCalendar(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {selectedDate && (
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-guardai-red hover:bg-guardai-red/90 text-white px-4"
              >
                {isRefreshing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Go"
                )}
              </Button>
            )}
          </div>
        )}

        {/* Date Range Calendar */}
        {reportType === "range" && (
          <div className="flex items-center gap-2">
            <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-48 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? format(dateRange.from, "LLL dd, y") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => {
                    setDateRange({ ...dateRange, from: date || new Date() });
                    setShowStartCalendar(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <span className="text-gray-500">to</span>

            <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-48 justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? format(dateRange.to, "LLL dd, y") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => {
                    setDateRange({ ...dateRange, to: date });
                    setShowEndCalendar(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {dateRange.from && dateRange.to && (
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="bg-guardai-red hover:bg-guardai-red/90 text-white px-4"
              >
                {isRefreshing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading...</span>
                  </div>
                ) : (
                  "Go"
                )}
              </Button>
            )}
          </div>
        )}
      </div>

      <Button
        onClick={handleAudioSummary}
        className="ml-auto bg-guardai-red hover:bg-guardai-red/90 text-white"
      >
        <Mic size={16} className="mr-2" />
        Quick Summary
      </Button>
    </motion.div>
  );

  return (
    <>
      <div
        className={cn(
          "transition-opacity duration-300",
          isRefreshing && "opacity-50"
        )}
      >
        <DashboardPageShell
          icon={<FileText size={28} className="text-guardai-red" />}
          title="Reports"
          description="Timeline and downloadable activity reports from all security systems."
          toolbar={reportFiltersToolbar}
          contentClassName="max-w-7xl mx-auto"
        >
          <motion.div variants={itemVariants}>
            <IdleMachinesReportSection
              payload={idlePayload}
              isLoading={false}
              onRefresh={handleIdleRefresh}
              isRefreshing={idleRefreshing}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border border-gray-200 shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between gap-3 p-4 bg-gray-50 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText size={18} className="text-guardai-red" />
                  <span>Available Reports</span>
                </CardTitle>
                <Button
                  size="sm"
                  disabled={isDownloadingAll}
                  onClick={handleDownloadAllReports}
                  className="shrink-0 bg-guardai-red text-white hover:bg-guardai-red/90"
                >
                  {isDownloadingAll ? (
                    <>
                      <span className="mr-2 inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating…
                    </>
                  ) : (
                    <>
                      <Download size={14} className="mr-1.5" />
                      Download All
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {reports.map(report => (
                    <div key={report.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3 mb-3 md:mb-0">
                        <div className="bg-guardai-lightgray p-2 rounded-md">
                          <report.icon size={20} className="text-guardai-red" />
                        </div>
                        <div>
                          <h3 className="font-medium">{report.title}</h3>
                          <p className="text-sm text-guardai-gray">{report.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-guardai-gray">
                            <span>{report.date}</span>
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full">{report.type}</span>
                            <span>{report.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red" onClick={() => handleViewReport(report)}>
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={itemVariants} className="col-span-1">
              <Card className="border border-gray-200 shadow-sm h-full">
                <CardHeader className="p-4 border-b">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar size={18} className="text-guardai-red" />
                    <span>Schedule Reports</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-guardai-gray mb-4">
                    Set up automatic report generation and delivery to your email.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium">Daily Summary</div>
                        <div className="text-xs text-guardai-gray">Daily operational overview</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {scheduledReports.dailySummary.enabled && (
                          <Select
                            value={scheduledReports.dailySummary.time}
                            onValueChange={(value) => handleScheduledReportTimeChange('dailySummary', value)}
                          >
                            <SelectTrigger className="w-20 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="00:00">00:00</SelectItem>
                              <SelectItem value="01:00">01:00</SelectItem>
                              <SelectItem value="02:00">02:00</SelectItem>
                              <SelectItem value="03:00">03:00</SelectItem>
                              <SelectItem value="04:00">04:00</SelectItem>
                              <SelectItem value="05:00">05:00</SelectItem>
                              <SelectItem value="06:00">06:00</SelectItem>
                              <SelectItem value="07:00">07:00</SelectItem>
                              <SelectItem value="08:00">08:00</SelectItem>
                              <SelectItem value="09:00">09:00</SelectItem>
                              <SelectItem value="10:00">10:00</SelectItem>
                              <SelectItem value="11:00">11:00</SelectItem>
                              <SelectItem value="12:00">12:00</SelectItem>
                              <SelectItem value="13:00">13:00</SelectItem>
                              <SelectItem value="14:00">14:00</SelectItem>
                              <SelectItem value="15:00">15:00</SelectItem>
                              <SelectItem value="16:00">16:00</SelectItem>
                              <SelectItem value="17:00">17:00</SelectItem>
                              <SelectItem value="18:00">18:00</SelectItem>
                              <SelectItem value="19:00">19:00</SelectItem>
                              <SelectItem value="20:00">20:00</SelectItem>
                              <SelectItem value="21:00">21:00</SelectItem>
                              <SelectItem value="22:00">22:00</SelectItem>
                              <SelectItem value="23:00">23:00</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <Switch
                          checked={scheduledReports.dailySummary.enabled}
                          onCheckedChange={(checked) => handleScheduledReportToggle('dailySummary', checked)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium">Weekly Analytics</div>
                        <div className="text-xs text-guardai-gray">Weekly performance metrics</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {scheduledReports.weeklyAnalytics.enabled && (
                          <Select
                            value={scheduledReports.weeklyAnalytics.time}
                            onValueChange={(value) => handleScheduledReportTimeChange('weeklyAnalytics', value)}
                          >
                            <SelectTrigger className="w-20 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="00:00">00:00</SelectItem>
                              <SelectItem value="01:00">01:00</SelectItem>
                              <SelectItem value="02:00">02:00</SelectItem>
                              <SelectItem value="03:00">03:00</SelectItem>
                              <SelectItem value="04:00">04:00</SelectItem>
                              <SelectItem value="05:00">05:00</SelectItem>
                              <SelectItem value="06:00">06:00</SelectItem>
                              <SelectItem value="07:00">07:00</SelectItem>
                              <SelectItem value="08:00">08:00</SelectItem>
                              <SelectItem value="09:00">09:00</SelectItem>
                              <SelectItem value="10:00">10:00</SelectItem>
                              <SelectItem value="11:00">11:00</SelectItem>
                              <SelectItem value="12:00">12:00</SelectItem>
                              <SelectItem value="13:00">13:00</SelectItem>
                              <SelectItem value="14:00">14:00</SelectItem>
                              <SelectItem value="15:00">15:00</SelectItem>
                              <SelectItem value="16:00">16:00</SelectItem>
                              <SelectItem value="17:00">17:00</SelectItem>
                              <SelectItem value="18:00">18:00</SelectItem>
                              <SelectItem value="19:00">19:00</SelectItem>
                              <SelectItem value="20:00">20:00</SelectItem>
                              <SelectItem value="21:00">21:00</SelectItem>
                              <SelectItem value="22:00">22:00</SelectItem>
                              <SelectItem value="23:00">23:00</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <Switch
                          checked={scheduledReports.weeklyAnalytics.enabled}
                          onCheckedChange={(checked) => handleScheduledReportToggle('weeklyAnalytics', checked)}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium">Monthly Compliance</div>
                        <div className="text-xs text-guardai-gray">Monthly compliance overview</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {scheduledReports.monthlyCompliance.enabled && (
                          <Select
                            value={scheduledReports.monthlyCompliance.time}
                            onValueChange={(value) => handleScheduledReportTimeChange('monthlyCompliance', value)}
                          >
                            <SelectTrigger className="w-20 h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="00:00">00:00</SelectItem>
                              <SelectItem value="01:00">01:00</SelectItem>
                              <SelectItem value="02:00">02:00</SelectItem>
                              <SelectItem value="03:00">03:00</SelectItem>
                              <SelectItem value="04:00">04:00</SelectItem>
                              <SelectItem value="05:00">05:00</SelectItem>
                              <SelectItem value="06:00">06:00</SelectItem>
                              <SelectItem value="07:00">07:00</SelectItem>
                              <SelectItem value="08:00">08:00</SelectItem>
                              <SelectItem value="09:00">09:00</SelectItem>
                              <SelectItem value="10:00">10:00</SelectItem>
                              <SelectItem value="11:00">11:00</SelectItem>
                              <SelectItem value="12:00">12:00</SelectItem>
                              <SelectItem value="13:00">13:00</SelectItem>
                              <SelectItem value="14:00">14:00</SelectItem>
                              <SelectItem value="15:00">15:00</SelectItem>
                              <SelectItem value="16:00">16:00</SelectItem>
                              <SelectItem value="17:00">17:00</SelectItem>
                              <SelectItem value="18:00">18:00</SelectItem>
                              <SelectItem value="19:00">19:00</SelectItem>
                              <SelectItem value="20:00">20:00</SelectItem>
                              <SelectItem value="21:00">21:00</SelectItem>
                              <SelectItem value="22:00">22:00</SelectItem>
                              <SelectItem value="23:00">23:00</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <Switch
                          checked={scheduledReports.monthlyCompliance.enabled}
                          onCheckedChange={(checked) => handleScheduledReportToggle('monthlyCompliance', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Weekly Alert Resolution Rate */}
                <Card className="border border-gray-200 shadow-sm h-full">
                  <CardHeader className="p-4 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart size={18} className="text-guardai-red" />
                      <span>Weekly Alert Resolution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-48 flex items-end justify-between border-b border-l relative">
                      {/* Y-axis labels for Alert Count */}
                      <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
                        <span>100</span>
                        <span>75</span>
                        <span>50</span>
                        <span>25</span>
                        <span>0</span>
                      </div>

                      {/* Static data for 7 days */}
                      {[
                        { day: 'Mon', raised: 45, resolved: 38, percentage: 84 },
                        { day: 'Tue', raised: 52, resolved: 44, percentage: 85 },
                        { day: 'Wed', raised: 38, resolved: 32, percentage: 84 },
                        { day: 'Thu', raised: 61, resolved: 55, percentage: 90 },
                        { day: 'Fri', raised: 48, resolved: 41, percentage: 85 },
                        { day: 'Sat', raised: 29, resolved: 25, percentage: 86 },
                        { day: 'Sun', raised: 35, resolved: 30, percentage: 86 }
                      ].map((data, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div className="flex items-end gap-1 mb-2">
                            <div
                              className="w-3 bg-red-500 rounded-t"
                              style={{ height: `${(data.raised / 100) * 120}px` }}
                            />
                            <div
                              className="w-3 bg-green-500 rounded-t"
                              style={{ height: `${(data.resolved / 100) * 120}px` }}
                            />
                          </div>
                          <div className="text-xs text-gray-600 mb-1">{data.day}</div>
                          <div className="text-xs text-green-600 font-medium">{data.percentage}%</div>
                        </div>
                      ))}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 mt-3 text-xs">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span>Raised</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span>Resolved</span>
                      </div>
                    </div>

                    {/* Insight */}
                    <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                      <p className="text-xs text-blue-700">
                        <strong>Thursday</strong> had the highest resolution rate at 90%, with 55 out of 61 alerts resolved.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Dashboard Alert Distribution */}
                <Card className="border border-gray-200 shadow-sm h-full">
                  <CardHeader className="p-4 border-b">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PieChart size={18} className="text-guardai-red" />
                      <span>Dashboard Alert Distribution</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {/* Time Period Selector */}
                    <div className="mb-4">
                      <Select value={dashboardTimePeriod} onValueChange={handleDashboardTimeChange}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="lastWeek">Last Week</SelectItem>
                          <SelectItem value="lastMonth">Last Month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Pie Chart */}
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Operations (Red) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="8"
                          strokeDasharray={`${(getScaledData(dashboardTimePeriod).operations / getScaledData(dashboardTimePeriod).total) * 251.2} 251.2`}
                          strokeDashoffset="0"
                          transform="rotate(-90 50 50)"
                        />
                        {/* Security (Blue) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="8"
                          strokeDasharray={`${(getScaledData(dashboardTimePeriod).security / getScaledData(dashboardTimePeriod).total) * 251.2} 251.2`}
                          strokeDashoffset={`-${(getScaledData(dashboardTimePeriod).operations / getScaledData(dashboardTimePeriod).total) * 251.2}`}
                          transform="rotate(-90 50 50)"
                        />
                        {/* Compliance (Green) */}
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="8"
                          strokeDasharray={`${(getScaledData(dashboardTimePeriod).compliance / getScaledData(dashboardTimePeriod).total) * 251.2} 251.2`}
                          strokeDashoffset={`-${((getScaledData(dashboardTimePeriod).operations + getScaledData(dashboardTimePeriod).security) / getScaledData(dashboardTimePeriod).total) * 251.2}`}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold">{getScaledData(dashboardTimePeriod).total}</div>
                          <div className="text-xs text-gray-600">Total Alerts</div>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span className="text-sm">Operations</span>
                        </div>
                        <span className="text-sm font-medium">{Math.round((getScaledData(dashboardTimePeriod).operations / getScaledData(dashboardTimePeriod).total) * 100)}% ({getScaledData(dashboardTimePeriod).operations} alerts)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <span className="text-sm">Security</span>
                        </div>
                        <span className="text-sm font-medium">{Math.round((getScaledData(dashboardTimePeriod).security / getScaledData(dashboardTimePeriod).total) * 100)}% ({getScaledData(dashboardTimePeriod).security} alerts)</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="text-sm">Compliance</span>
                        </div>
                        <span className="text-sm font-medium">{Math.round((getScaledData(dashboardTimePeriod).compliance / getScaledData(dashboardTimePeriod).total) * 100)}% ({getScaledData(dashboardTimePeriod).compliance} alerts)</span>
                      </div>
                    </div>

                    {/* Insight */}
                    <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                      <p className="text-xs text-yellow-700">
                        <strong>Operations Dashboard</strong> has the highest alert volume, primarily due to machine idle and loitering detection.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </motion.div>
        </DashboardPageShell>
      </div>

      <ReportGenerationDialog
        open={showGenerationDialog}
        onOpenChange={setShowGenerationDialog}
        onGenerateReport={handleGenerateReport}
      />

      {/* Audio Summary Dialog */}
      <Dialog open={showAudioSummary} onOpenChange={setShowAudioSummary}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Volume2 className="text-guardai-red" size={20} />
              AI Quick Summary
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {isPlayingAudio ? (
                  <div className="w-8 h-8 bg-guardai-red rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                ) : (
                  <Volume2 className="w-8 h-8 text-guardai-red" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {currentSummary}
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Duration: ~30 seconds</span>
              <span>Generated: {new Date().toLocaleTimeString()}</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  stopAudio();
                  setShowAudioSummary(false);
                }}
                className="flex-1"
              >
                Close
              </Button>
              <Button
                onClick={toggleAudio}
                className="flex-1 bg-guardai-red hover:bg-guardai-red/90 text-white"
              >
                {isPlayingAudio ? (
                  <>
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2"></div>
                    Stop
                  </>
                ) : (
                  <>
                    <Volume2 size={14} className="mr-2" />
                    Play
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
