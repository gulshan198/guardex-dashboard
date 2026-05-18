
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Shield, Bell, Cloud, Key, Save, Globe, Database, Wifi, Palette, Monitor } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  
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

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "storage", label: "Storage", icon: Cloud },
    { id: "api", label: "API Access", icon: Key },
  ];

  const getTabIcon = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      const IconComponent = tab.icon;
      return <IconComponent size={18} className="text-guardai-red" />;
    }
    return null;
  };

  const getTabLabel = (tabId: string) => {
    return tabs.find(t => t.id === tabId)?.label || "";
  };
  
  const getTabLargeIcon = (tabId: string) => {
    const tab = tabs.find(t => t.id === tabId);
    if (tab) {
      const IconComponent = tab.icon;
      return <IconComponent size={36} className="text-guardai-red" />;
    }
    return null;
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-1">
        <Settings size={28} className="text-guardai-red" />
        <h1 className="text-2xl font-semibold text-guardai-darkgray">Settings</h1>
      </motion.div>
      
      <motion.p variants={itemVariants} className="text-guardai-gray mb-6 ml-9">
        Organization-level configurations and technical settings.
      </motion.p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="border border-gray-200 shadow-sm sticky top-6">
            <CardHeader className="p-4 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings size={18} className="text-guardai-red" />
                <span>Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                      activeTab === tab.id 
                        ? "bg-guardai-lightgray text-guardai-red" 
                        : "text-guardai-gray hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon size={18} className={activeTab === tab.id ? "text-guardai-red" : ""} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-3">
          {activeTab === "general" && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="p-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings size={18} className="text-guardai-red" />
                  <span>General Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure basic system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-4">System Preferences</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Organization Name</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-guardai-red/20 focus:border-guardai-red"
                            defaultValue="Security Solutions Inc."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Time Zone</label>
                          <select className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-guardai-red/20 focus:border-guardai-red">
                            <option>Eastern Time (ET)</option>
                            <option>Central Time (CT)</option>
                            <option>Mountain Time (MT)</option>
                            <option>Pacific Time (PT)</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Date Format</label>
                          <select className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-guardai-red/20 focus:border-guardai-red">
                            <option>MM/DD/YYYY</option>
                            <option>DD/MM/YYYY</option>
                            <option>YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Time Format</label>
                          <select className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-guardai-red/20 focus:border-guardai-red">
                            <option>12-hour (AM/PM)</option>
                            <option>24-hour</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Palette size={18} className="text-guardai-red" />
                          <div>
                            <div className="text-sm font-medium">Theme Settings</div>
                            <div className="text-xs text-guardai-gray">Change appearance and color scheme</div>
                          </div>
                        </div>
                        <Button variant="outline" className="border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                          Customize
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Monitor size={18} className="text-guardai-red" />
                          <div>
                            <div className="text-sm font-medium">Display Preferences</div>
                            <div className="text-xs text-guardai-gray">Configure dashboard and monitoring views</div>
                          </div>
                        </div>
                        <Button variant="outline" className="border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-base font-medium mb-4">Network & Connectivity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Wifi size={18} className="text-guardai-red" />
                          <div>
                            <div className="text-sm font-medium">Network Configuration</div>
                            <div className="text-xs text-guardai-gray">Configure IP settings and network access</div>
                          </div>
                        </div>
                        <Button variant="outline" className="border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Globe size={18} className="text-guardai-red" />
                          <div>
                            <div className="text-sm font-medium">Remote Access</div>
                            <div className="text-xs text-guardai-gray">Configure VPN and external access points</div>
                          </div>
                        </div>
                        <Button variant="outline" className="border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Database size={18} className="text-guardai-red" />
                          <div>
                            <div className="text-sm font-medium">Database Connections</div>
                            <div className="text-xs text-guardai-gray">Manage connections to external databases</div>
                          </div>
                        </div>
                        <Button variant="outline" className="border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" className="border-guardai-gray/30">
                      Cancel
                    </Button>
                    <Button className="bg-guardai-red hover:bg-guardai-red/90 text-white">
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="p-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield size={18} className="text-guardai-red" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure security policies and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-medium mb-4">Authentication</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="text-sm font-medium">Two-Factor Authentication</div>
                          <div className="text-xs text-guardai-gray">Require 2FA for all users</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-11 h-6 flex items-center bg-guardai-red rounded-full p-1 cursor-pointer">
                            <div className="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-5"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="text-sm font-medium">Password Policy</div>
                          <div className="text-xs text-guardai-gray">Require strong passwords</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-11 h-6 flex items-center bg-guardai-red rounded-full p-1 cursor-pointer">
                            <div className="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-5"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="text-sm font-medium">SSO Integration</div>
                          <div className="text-xs text-guardai-gray">Single sign-on with corporate directory</div>
                        </div>
                        <Button variant="outline" className="border-guardai-gray/30 hover:bg-guardai-lightgray hover:text-guardai-red">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-base font-medium mb-4">Access Control</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="text-sm font-medium">IP Restrictions</div>
                          <div className="text-xs text-guardai-gray">Limit access to specific IP ranges</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-11 h-6 flex items-center bg-gray-200 rounded-full p-1 cursor-pointer">
                            <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="text-sm font-medium">Session Timeout</div>
                          <div className="text-xs text-guardai-gray">Auto-logout after inactivity</div>
                        </div>
                        <select className="px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-guardai-red/20 focus:border-guardai-red">
                          <option>15 minutes</option>
                          <option>30 minutes</option>
                          <option>1 hour</option>
                          <option>4 hours</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="text-sm font-medium">Audit Logging</div>
                          <div className="text-xs text-guardai-gray">Track all security-relevant events</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-11 h-6 flex items-center bg-guardai-red rounded-full p-1 cursor-pointer">
                            <div className="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-5"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <Button variant="outline" className="border-guardai-gray/30">
                      Cancel
                    </Button>
                    <Button className="bg-guardai-red hover:bg-guardai-red/90 text-white">
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Placeholder content for other tabs */}
          {(activeTab !== "general" && activeTab !== "security") && (
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="p-4 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getTabIcon(activeTab)}
                  <span>{getTabLabel(activeTab)} Settings</span>
                </CardTitle>
                <CardDescription>
                  Configure your {getTabLabel(activeTab).toLowerCase()} settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="min-h-[400px] flex items-center justify-center flex-col p-6">
                  <div className="bg-gray-100 p-5 rounded-full mb-4">
                    {getTabLargeIcon(activeTab)}
                  </div>
                  <h3 className="text-lg font-medium text-guardai-darkgray mb-2">
                    {getTabLabel(activeTab)} Settings
                  </h3>
                  <p className="text-guardai-gray text-center max-w-md mb-6">
                    This section allows you to customize your {getTabLabel(activeTab).toLowerCase()} preferences and settings.
                  </p>
                  <Button className="bg-guardai-red hover:bg-guardai-red/90 text-white">
                    Configure {getTabLabel(activeTab)}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
