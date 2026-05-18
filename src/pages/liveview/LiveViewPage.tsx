
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Video, AlertCircle, DownloadCloud, Maximize2, PauseCircle, PlayCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function LiveViewPage() {
  const [selectedCamera, setSelectedCamera] = useState("cam-4");
  const [isPaused, setIsPaused] = useState(false);

  // Animation variants
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

  const cameras = [
    { id: "cam-4", name: "Production Line", status: "Active", alert: false, image: "/lovable-uploads/0b1b007b-d9e7-4523-90bd-f2fabfbb8b73.png" },
    { id: "cam-1", name: "Indian Factory Entrance", status: "Active", alert: false, image: "/indian-factory-1.jpg" },
    { id: "cam-2", name: "Shop Floor", status: "Active", alert: true, image: "/indian-shop-1.jpg" },
    { id: "cam-3", name: "Indian Shop Entrance", status: "Active", alert: false, image: "/indian-factory-2.jpg" },
    { id: "cam-5", name: "Warehouse", status: "Offline", alert: false, image: "/indian-factory-3.jpg" },
    { id: "cam-6", name: "Shop Counter", status: "Active", alert: false, image: "/indian-shop-3.jpg" }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-1">
        <Video size={28} className="text-guardai-red" />
        <h1 className="text-2xl font-semibold text-guardai-darkgray">Live View</h1>
      </motion.div>
      
      <motion.p variants={itemVariants} className="text-guardai-gray mb-6 ml-9">
        Access live CCTV feed from all cameras in your network.
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          variants={itemVariants} 
          className="lg:col-span-2"
        >
          <Card className="border border-gray-200 bg-white shadow-sm overflow-hidden">
            <CardHeader className="p-4 bg-black flex flex-row items-center justify-between">
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <Video size={18} className="text-guardai-red" />
                <span>
                  {cameras.find(cam => cam.id === selectedCamera)?.name || "Camera Feed"}
                </span>
              </CardTitle>
              <div className="flex items-center gap-2">
                {cameras.find(cam => cam.id === selectedCamera)?.alert && (
                  <span className="bg-guardai-red text-white text-xs rounded-full px-2 py-0.5 animate-pulse flex items-center gap-1">
                    <AlertCircle size={12} />
                    <span>Motion Detected</span>
                  </span>
                )}
                <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent border-gray-600 text-white hover:bg-gray-800">
                  <Maximize2 size={14} />
                </Button>
                <Button variant="outline" size="icon" className="h-7 w-7 bg-transparent border-gray-600 text-white hover:bg-gray-800">
                  <DownloadCloud size={14} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 relative aspect-video bg-gray-900">
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{
                  backgroundImage: `url('${cameras.find(cam => cam.id === selectedCamera)?.image || ''}')`,
                  filter: isPaused ? 'grayscale(0.5)' : 'none'
                }}
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-guardai-red/80"
                    onClick={() => setIsPaused(!isPaused)}
                  >
                    {isPaused ? <PlayCircle size={18} /> : <PauseCircle size={18} />}
                  </Button>
                  <span className="text-white text-xs bg-black/50 px-2 py-0.5 rounded">LIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-guardai-red/80"
                  >
                    <RefreshCw size={18} />
                  </Button>
                  <span className="text-white text-xs bg-black/50 px-2 py-0.5 rounded">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border border-gray-200 bg-white shadow-sm h-full">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield size={18} className="text-guardai-red" />
                <span>Camera Network</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {cameras.map(camera => (
                  <button
                    key={camera.id}
                    className={cn(
                      "w-full px-4 py-3 text-left flex items-center justify-between transition-colors",
                      selectedCamera === camera.id ? "bg-guardai-lightgray" : "hover:bg-gray-50"
                    )}
                    onClick={() => setSelectedCamera(camera.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Video size={18} className={camera.status === "Active" ? "text-guardai-red" : "text-gray-400"} />
                        {camera.alert && (
                          <span className="absolute -right-1 -top-1 w-2 h-2 bg-guardai-red rounded-full animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{camera.name}</div>
                        <div className={cn(
                          "text-xs",
                          camera.status === "Active" ? "text-green-600" : "text-gray-400"
                        )}>
                          {camera.status}
                        </div>
                      </div>
                    </div>
                    {camera.alert && (
                      <span className="text-guardai-red text-xs animate-pulse flex items-center gap-1">
                        <AlertCircle size={12} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="mt-6">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle size={18} className="text-guardai-red" />
              <span>Activity Log</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="border-l-2 border-guardai-red pl-3 py-1">
                <div className="text-sm font-medium">Idle machinery since 9:30 AM for 45 min!</div>
                <div className="text-xs text-gray-500">Today, 9:30 AM</div>
              </div>
              <div className="border-l-2 border-guardai-red pl-3 py-1">
                <div className="text-sm font-medium">Motion detected - Loading Dock</div>
                <div className="text-xs text-gray-500">Today, 09:42 AM</div>
              </div>
              <div className="border-l-2 border-gray-300 pl-3 py-1">
                <div className="text-sm font-medium">Person in red shirt entered - Office Front Door</div>
                <div className="text-xs text-gray-500">Today, 09:15 AM</div>
              </div>
              <div className="border-l-2 border-gray-300 pl-3 py-1">
                <div className="text-sm font-medium">Unknown vehicle parked - Parking Gate</div>
                <div className="text-xs text-gray-500">Today, 08:53 AM</div>
              </div>
              <div className="border-l-2 border-gray-300 pl-3 py-1">
                <div className="text-sm font-medium">Camera offline - Inventory Room</div>
                <div className="text-xs text-gray-500">Today, 08:30 AM</div>
              </div>
              <div className="border-l-2 border-gray-300 pl-3 py-1">
                <div className="text-sm font-medium">Night mode activated - All Cameras</div>
                <div className="text-xs text-gray-500">Yesterday, 08:00 PM</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
