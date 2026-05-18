import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Building, FileText, Download } from "lucide-react";

interface ReportGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateReport: (config: any) => void;
}

export function ReportGenerationDialog({ open, onOpenChange, onGenerateReport }: ReportGenerationDialogProps) {
  const [reportConfig, setReportConfig] = useState({
    period: "TODAY",
    premises: "Bisleri Bottling Plant, Uttar Pradesh",
    reportType: "full"
  });

  const handleGenerate = () => {
    onGenerateReport(reportConfig);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="text-guardai-red" size={24} />
            GUARDEX REPORT GENERATION
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar size={16} className="text-guardai-red" />
                Generate Report For:
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={reportConfig.period} onValueChange={(value) => setReportConfig({...reportConfig, period: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODAY">TODAY</SelectItem>
                  <SelectItem value="THIS_WEEK">THIS WEEK</SelectItem>
                  <SelectItem value="CUSTOM">CUSTOM RANGE</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2 text-sm text-guardai-gray">
                <Clock size={14} />
                Time Period: {reportConfig.period === "TODAY" ? "27 May 2025" : "20 May 2025 – 26 May 2025"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Building size={16} className="text-guardai-red" />
                Premises & Report Type:
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="font-medium">{reportConfig.premises}</div>
                <div className="text-sm text-guardai-gray">Auto-filled Premises Name</div>
              </div>
              
              <div className="p-3 bg-guardai-lightgray rounded-md">
                <div className="font-medium text-guardai-red">Full AI-Summarized Guardex Report</div>
                <div className="text-sm text-guardai-gray">Operations + Security + Compliance</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Report Export & Delivery Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <strong>Format:</strong> PDF + XLS + JSON
              </div>
              <div className="text-sm">
                <strong>Auto-Email:</strong> ops.manager@guardex.ai
              </div>
              <div className="text-sm">
                <strong>Delivery Time:</strong> Now
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleGenerate} className="flex-1 bg-guardai-red hover:bg-guardai-red/90 text-white">
              <FileText size={16} className="mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
