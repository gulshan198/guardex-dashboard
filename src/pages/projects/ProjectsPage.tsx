
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, PlusCircle, MapPin, Users, Camera, Calendar, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function ProjectsPage() {
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

  const projects = [
    {
      id: 1,
      name: "Downtown Office Building",
      location: "123 Business Ave, New York",
      cameras: 12,
      personnel: 45,
      lastActivity: "2 hours ago",
      image: "https://picsum.photos/id/1076/300/200"
    },
    {
      id: 2,
      name: "West Side Warehouse",
      location: "456 Industrial Pkwy, Chicago",
      cameras: 8,
      personnel: 22,
      lastActivity: "15 minutes ago",
      image: "https://picsum.photos/id/1052/300/200"
    },
    {
      id: 3,
      name: "Retail Mall",
      location: "789 Shopping Blvd, Los Angeles",
      cameras: 24,
      personnel: 120,
      lastActivity: "Just now",
      image: "https://picsum.photos/id/1067/300/200"
    },
    {
      id: 4,
      name: "Harbor Shipping Facility",
      location: "101 Port Way, Seattle",
      cameras: 16,
      personnel: 38,
      lastActivity: "1 day ago",
      image: "https://picsum.photos/id/1055/300/200"
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
        <Folder size={28} className="text-guardai-red" />
        <h1 className="text-2xl font-semibold text-guardai-darkgray">My Projects</h1>
      </motion.div>
      
      <motion.p variants={itemVariants} className="text-guardai-gray mb-6 ml-9">
        List of all project locations being monitored by Guard.AI.
      </motion.p>

      <motion.div variants={itemVariants} className="mb-6 flex justify-between items-center">
        <div className="text-sm text-guardai-gray">
          Showing <span className="font-medium text-guardai-darkgray">{projects.length}</span> projects
        </div>
        <Button className="bg-guardai-red hover:bg-guardai-red/90 text-white">
          <PlusCircle size={16} className="mr-2" />
          Add New Project
        </Button>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map(project => (
          <motion.div key={project.id} variants={itemVariants}>
            <Card className="border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div 
                className="h-36 bg-cover bg-center"
                style={{ backgroundImage: `url('${project.image}')` }}
              />
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between">
                  <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-guardai-gray hover:text-guardai-red">
                    <MoreHorizontal size={18} />
                  </Button>
                </div>
                <div className="flex items-center text-xs text-guardai-gray">
                  <MapPin size={14} className="mr-1" />
                  {project.location}
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                    <Camera size={16} className="text-guardai-red mb-1" />
                    <span className="text-sm font-medium">{project.cameras}</span>
                    <span className="text-xs text-guardai-gray">Cameras</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                    <Users size={16} className="text-guardai-red mb-1" />
                    <span className="text-sm font-medium">{project.personnel}</span>
                    <span className="text-xs text-guardai-gray">Personnel</span>
                  </div>
                  <div className="flex flex-col items-center p-2 bg-gray-50 rounded-md">
                    <Calendar size={16} className="text-guardai-red mb-1" />
                    <span className="text-xs text-guardai-gray">Activity</span>
                    <span className="text-xs font-medium truncate">{project.lastActivity}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 text-guardai-darkgray hover:bg-guardai-lightgray hover:text-guardai-red border-guardai-gray/30">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <motion.div variants={itemVariants}>
          <Card className="border border-dashed border-gray-300 flex flex-col items-center justify-center h-full min-h-[300px] hover:border-guardai-red/50 transition-colors">
            <PlusCircle size={48} className="text-guardai-gray mb-4" />
            <p className="text-guardai-gray font-medium mb-2">Add New Project</p>
            <p className="text-xs text-guardai-gray text-center max-w-[200px] mb-4">
              Set up a new monitoring location with cameras and security protocols
            </p>
            <Button variant="outline" className="border-guardai-red/30 text-guardai-red hover:bg-guardai-lightgray">
              Create Project
            </Button>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
