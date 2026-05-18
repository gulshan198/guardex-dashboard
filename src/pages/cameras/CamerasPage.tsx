import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera, Plus, Search, Filter, MoreVertical, Power, Settings, MapPin,
  RefreshCw, Shield, Eye, Upload, Download, Trash2, CheckCircle, XCircle,
  Grid, LayoutList
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function CamerasPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
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

  const cameraImages = [
    "/indian-factory-1.jpg", 
    "/indian-shop-1.jpg", 
    "/indian-factory-2.jpg", 
    "/indian-shop-2.jpg", 
    "/indian-factory-3.jpg", 
    "/indian-shop-3.jpg"
  ];

  const cameras = [
    {
      id: "cam-01",
      name: "Factory Entrance",
      location: "North Building",
      status: "online",
      type: "PTZ Camera",
      ip: "192.168.1.101",
      lastMaintenance: "2 months ago",
      resolution: "1080p",
      image: cameraImages[0]
    },
    {
      id: "cam-02",
      name: "Shop Floor",
      location: "East Wing",
      status: "online",
      type: "Dome Camera",
      ip: "192.168.1.102",
      lastMaintenance: "3 months ago",
      resolution: "1080p",
      image: cameraImages[1]
    },
    {
      id: "cam-03",
      name: "Retail Store Entrance",
      location: "South Entrance",
      status: "online",
      type: "Bullet Camera",
      ip: "192.168.1.103",
      lastMaintenance: "1 month ago",
      resolution: "4K",
      image: cameraImages[2]
    },
    {
      id: "cam-04",
      name: "Production Line",
      location: "Main Building",
      status: "online",
      type: "Dome Camera",
      ip: "192.168.1.104",
      lastMaintenance: "5 months ago",
      resolution: "1080p",
      image: cameraImages[3]
    },
    {
      id: "cam-05",
      name: "Inventory Storage",
      location: "West Wing",
      status: "offline",
      type: "Bullet Camera",
      ip: "192.168.1.105",
      lastMaintenance: "6 months ago",
      resolution: "1080p",
      image: cameraImages[4]
    },
    {
      id: "cam-06",
      name: "Shop Counter",
      location: "North Building",
      status: "online",
      type: "PTZ Camera",
      ip: "192.168.1.106",
      lastMaintenance: "4 months ago",
      resolution: "4K",
      image: cameraImages[5]
    }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-1">
        <Camera size={28} className="text-guardai-red" />
        <h1 className="text-2xl font-semibold text-guardai-darkgray">Manage Cameras</h1>
      </motion.div>
      
      <motion.p variants={itemVariants} className="text-guardai-gray mb-6 ml-9">
        Add, remove, and configure individual cameras in your security network.
      </motion.p>

      <motion.div variants={itemVariants} className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-guardai-gray pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search cameras..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-guardai-red/20 focus:border-guardai-red"
          />
        </div>
        
        <Button variant="outline" className="border-guardai-gray/30 flex items-center gap-2">
          <Filter size={16} />
          <span>Filter</span>
        </Button>

        <div className="flex items-center gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="icon"
            className={cn(
              "h-9 w-9 border-guardai-gray/30", 
              view === 'grid' && "bg-guardai-lightgray text-guardai-red"
            )}
            onClick={() => setView('grid')}
          >
            <Grid size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            className={cn(
              "h-9 w-9 border-guardai-gray/30", 
              view === 'list' && "bg-guardai-lightgray text-guardai-red"
            )}
            onClick={() => setView('list')}
          >
            <LayoutList size={16} />
          </Button>
        </div>

        <Button className="bg-guardai-red hover:bg-guardai-red/90 text-white">
          <Plus size={16} className="mr-2" />
          Add Camera
        </Button>
      </motion.div>

      {view === 'grid' ? (
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {cameras.map(camera => (
            <motion.div key={camera.id} variants={itemVariants}>
              <Card className="border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video bg-black relative">
                  <div 
                    className="w-full h-full bg-cover bg-center opacity-80"
                    style={{ 
                      backgroundImage: `url('${camera.image}')`,
                      filter: camera.status === 'offline' ? 'grayscale(1)' : 'none'
                    }}
                  />
                  
                  {/* Camera status overlay */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <div className={cn(
                      "w-2.5 h-2.5 rounded-full animate-pulse",
                      camera.status === 'online' ? "bg-green-500" : "bg-red-500"
                    )} />
                    <span className="text-xs text-white bg-black/60 px-1.5 py-0.5 rounded">
                      {camera.status === 'online' ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  
                  {/* Camera info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">{camera.name}</h3>
                        <div className="text-xs text-gray-300 flex items-center gap-1">
                          <MapPin size={10} /> 
                          {camera.location}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 text-white hover:bg-black/30 -mt-1 -mr-1"
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </div>
                    <div className="flex gap-1 mt-2">
                      <div className="text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">{camera.type}</div>
                      <div className="text-xs bg-black/60 text-white px-1.5 py-0.5 rounded">{camera.resolution}</div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red flex-1"
                    >
                      <Eye size={12} className="mr-1.5" />
                      Live View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red flex-1"
                    >
                      <Settings size={12} className="mr-1.5" />
                      Configure
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={cn(
                        "h-8 text-xs border-guardai-gray/30 flex-1",
                        camera.status === 'online' 
                          ? "hover:bg-red-50 hover:text-red-700 hover:border-red-200" 
                          : "hover:bg-green-50 hover:text-green-700 hover:border-green-200"
                      )}
                    >
                      <Power size={12} className="mr-1.5" />
                      {camera.status === 'online' ? 'Power Off' : 'Power On'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div variants={itemVariants}>
            <Card className="border border-dashed border-gray-300 h-full flex flex-col items-center justify-center min-h-[200px] hover:border-guardai-red/50 transition-colors">
              <Camera size={36} className="text-guardai-gray mb-3" />
              <p className="text-guardai-gray font-medium">Add New Camera</p>
              <p className="text-xs text-center max-w-[200px] text-guardai-gray mb-4 mt-1">
                Connect a new security camera to your network
              </p>
              <Button variant="outline" className="border-guardai-red/30 text-guardai-red hover:bg-guardai-lightgray">
                <Plus size={14} className="mr-2" />
                Add Camera
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants}>
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="p-4 bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera size={18} className="text-guardai-red" />
                <span>Camera Inventory</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-gray-50 text-sm text-guardai-gray">
                  <tr>
                    <th className="px-4 py-3 text-left">Camera Name</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-left">IP Address</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cameras.map(camera => (
                    <tr key={camera.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{camera.name}</div>
                        <div className="text-xs text-guardai-gray">{camera.id}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">{camera.location}</td>
                      <td className="px-4 py-3 text-sm">{camera.type}</td>
                      <td className="px-4 py-3 text-sm font-mono">{camera.ip}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            camera.status === 'online' ? "bg-green-500" : "bg-red-500"
                          )} />
                          <span className="text-sm">
                            {camera.status === 'online' ? 'Online' : 'Offline'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-guardai-gray hover:text-guardai-red">
                            <Eye size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-guardai-gray hover:text-guardai-red">
                            <Settings size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-guardai-gray hover:text-guardai-red">
                            <MoreVertical size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <motion.div variants={itemVariants}>
          <Card className="border border-gray-200 shadow-sm h-full">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield size={18} className="text-guardai-red" />
                <span>Camera Health</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Online</span>
                    <span className="text-guardai-gray">{cameras.filter(c => c.status === 'online').length} cameras</span>
                  </div>
                  <div className="w-full bg-guardai-lightgray rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(cameras.filter(c => c.status === 'online').length / cameras.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Offline</span>
                    <span className="text-guardai-gray">{cameras.filter(c => c.status === 'offline').length} cameras</span>
                  </div>
                  <div className="w-full bg-guardai-lightgray rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(cameras.filter(c => c.status === 'offline').length / cameras.length) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Maintenance Due</span>
                    <span className="text-guardai-gray">2 cameras</span>
                  </div>
                  <div className="w-full bg-guardai-lightgray rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ width: `${(2 / cameras.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                <RefreshCw size={14} className="mr-2" />
                Run Diagnostics
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2">
          <Card className="border border-gray-200 shadow-sm h-full">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings size={18} className="text-guardai-red" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button variant="outline" className="h-auto py-3 flex-col border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                  <RefreshCw size={20} className="mb-1" />
                  <span className="text-xs">Reboot All</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex-col border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                  <Download size={20} className="mb-1" />
                  <span className="text-xs">Backup Config</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex-col border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                  <Upload size={20} className="mb-1" />
                  <span className="text-xs">Update Firmware</span>
                </Button>
                <Button variant="outline" className="h-auto py-3 flex-col border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                  <Trash2 size={20} className="mb-1" />
                  <span className="text-xs">Clear Storage</span>
                </Button>
              </div>
              
              <div className="mt-5 p-3 border border-dashed border-guardai-gray/30 rounded-md bg-gray-50">
                <h4 className="text-sm font-medium mb-2">Configuration Access</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <div className="text-sm">Advanced Settings</div>
                    <Button variant="outline" size="sm" className="h-7 text-xs border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                      Access
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-white rounded border border-gray-200">
                    <div className="text-sm">Network Config</div>
                    <Button variant="outline" size="sm" className="h-7 text-xs border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                      Access
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
