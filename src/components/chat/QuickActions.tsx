
import { Button } from "@/components/ui/button";
import { FileText, Video, Bell, BarChart2, Clock, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { useAIModels } from "@/hooks/useAIModels";
import { useToast } from "@/hooks/use-toast";

export function QuickActions() {
  const { loading, runRAG, runMistral, runYOLO } = useAIModels();
  const { toast } = useToast();

  const actions = [
    { 
      icon: FileText, 
      text: "Download Last 24h Report",
      onClick: () => {
        runRAG("Generate a report for the last 24 hours");
        toast({
          title: "Running RAG Model",
          description: "Generating report from the last 24 hours...",
        });
      }
    },
    { 
      icon: Video, 
      text: "Live Feed from All Cameras",
      onClick: () => {
        runYOLO("camera-feed-url");
        toast({
          title: "Running YOLO Model",
          description: "Analyzing camera feeds...",
        });
      }
    },
    { 
      icon: Bell, 
      text: "View Recent Alerts",
      onClick: () => {
        runMistral("List all recent alerts");
        toast({
          title: "Running Mistral Model",
          description: "Retrieving recent alerts...",
        });
      }
    },
    { 
      icon: BarChart2, 
      text: "Security Analytics",
      onClick: () => {
        runRAG("Generate security analytics report");
        toast({
          title: "Running Analytics",
          description: "Generating security analytics...",
        });
      }
    },
    { 
      icon: Clock, 
      text: "Access History",
      onClick: () => {
        runMistral("Show access history");
        toast({
          title: "Retrieving History",
          description: "Fetching access history...",
        });
      }
    },
    { 
      icon: AlertTriangle, 
      text: "Critical Events",
      onClick: () => {
        runRAG("List critical security events");
        toast({
          title: "Critical Events",
          description: "Retrieving critical events...",
        });
      }
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {actions.map((action, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 bg-gradient-to-r from-guardai-lightgray/5 to-transparent hover:from-guardai-red/5 hover:to-guardai-black/5 border-guardai-gray/20 hover:border-guardai-red/30 text-sm px-4 py-3 h-auto transition-all duration-300 rounded-lg group"
            onClick={action.onClick}
            disabled={loading[`${action.text.toLowerCase()}`]}
          >
            <action.icon size={18} className="text-guardai-red transition-colors group-hover:text-guardai-red" />
            <span className="text-xs font-medium text-guardai-darkgray group-hover:text-guardai-black">
              {action.text}
            </span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
