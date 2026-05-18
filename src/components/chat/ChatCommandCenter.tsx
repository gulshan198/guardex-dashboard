
import { useState, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { QuickActions } from "./QuickActions";
import { Shield, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
interface Message {
  text: string;
  isUser: boolean;
}

// Define animation variants for the container and items
const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: {
    y: 20,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1
  }
};
export function ChatCommandCenter() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmptyState, setShowEmptyState] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const handleSendMessage = (text: string) => {
    setMessages(prev => [...prev, {
      text,
      isUser: true
    }]);
    setShowEmptyState(false);
    setIsLoading(true);

    // Simulate AI response (in a real app, this would be an API call)
    setTimeout(() => {
      setIsLoading(false);
      let response = "I'm processing your request...";

      // Pattern matching for demo purposes
      if (text.toLowerCase().includes("yesterday evening") || text.toLowerCase().includes("unusual")) {
        response = "Detected 3 motion alerts at 'Warehouse B' between 5:30 PM and 8 PM. Want the clips?";
        toast({
          title: "Alert Detected",
          description: "Found 3 motion alerts in specified timeframe",
          variant: "default"
        });
      } else if (text.toLowerCase().includes("camera 6")) {
        response = "Camera 6 recorded normal activity yesterday night. There were 2 authorized personnel entries at 11:45 PM and 2:30 AM.";
      } else if (text.toLowerCase().includes("report")) {
        response = "Generating report... I've compiled all alert data from last week across all locations. There were 17 motion alerts, 5 line crossing events, and 2 unidentified person alerts.";
      } else if (text.toLowerCase().includes("gate")) {
        response = "Activity near Gate 2 this morning: Delivery truck arrived at 8:15 AM, departed at 8:45 AM. No unusual events detected.";
      } else if (text.toLowerCase().includes("red") && (text.toLowerCase().includes("shirt") || text.toLowerCase().includes("tshirt"))) {
        response = "Person wearing a red t-shirt entered the main office at 9:27 AM today through the reception area. They were identified as Alex Peterson, a contractor from BuildTech Solutions. Would you like to see the footage?";
      } else if (text.toLowerCase().includes("suspicious") || text.toLowerCase().includes("unauthorized")) {
        response = "Alert: Detected 1 suspicious activity at the loading dock at 2:45 AM. Unidentified person attempted to access the storage area. Security was notified and responded within 3 minutes. The individual left the premises. Full report available.";
      } else if (text.toLowerCase().includes("visitor") || text.toLowerCase().includes("visitors")) {
        response = "Today's visitor log: 7 registered visitors between 8 AM and 3 PM. All followed standard check-in procedures. Would you like specific visitor details or footage?";
      } else if (text.toLowerCase().includes("after hours") || text.toLowerCase().includes("night")) {
        response = "After-hours activity (8 PM - 6 AM): 3 authorized staff entries using keycards, 1 scheduled cleaning crew at 11 PM, and 1 security patrol at 2 AM. No unauthorized access detected.";
      }
      setMessages(prev => [...prev, {
        text: response,
        isUser: false
      }]);
    }, 1500);
  };
  const EmptyState = () => <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col items-center justify-center h-[400px] text-center px-4 bg-gradient-to-br from-guardai-black-900/5 to-guardai-red-900/5 rounded-lg">
      <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
        
        <h2 className="text-3xl font-bold bg-gradient-to-r from-guardai-red to-guardai-black bg-clip-text text-transparent">Guardex.AI Assistant</h2>
      </motion.div>
      <motion.div variants={itemVariants} className="max-w-md">
        <h3 className="text-xl font-medium mb-6 text-guardai-darkgray">
          Your intelligent security companion
        </h3>
        <div className="space-y-4">
          <p className="text-guardai-gray mb-4">Ask anything like:</p>
          <motion.ul variants={containerVariants} className="space-y-3">
            <motion.li variants={itemVariants} className="p-4 bg-gradient-to-r from-guardai-red/5 to-guardai-black/5 hover:from-guardai-red/10 hover:to-guardai-black/10 transition-all duration-300 cursor-pointer rounded-lg border border-guardai-red/10 hover:border-guardai-red/20 shadow-sm hover:shadow-md">
              "Show me what happened near the loading dock yesterday"
            </motion.li>
            <motion.li variants={itemVariants} className="p-4 bg-gradient-to-r from-guardai-black/5 to-guardai-red/5 hover:from-guardai-black/10 hover:to-guardai-red/10 transition-all duration-300 cursor-pointer rounded-lg border border-guardai-red/10 hover:border-guardai-red/20 shadow-sm hover:shadow-md">
              "When did the person in a red t-shirt enter the office?"
            </motion.li>
            <motion.li variants={itemVariants} className="p-4 bg-gradient-to-r from-guardai-red/5 to-guardai-black/5 hover:from-guardai-red/10 hover:to-guardai-black/10 transition-all duration-300 cursor-pointer rounded-lg border border-guardai-red/10 hover:border-guardai-red/20 shadow-sm hover:shadow-md">
              "Were there any suspicious activities after hours?"
            </motion.li>
          </motion.ul>
        </div>
      </motion.div>
    </motion.div>;
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.5
  }} className="flex flex-col h-full max-w-5xl mx-auto fade-in p-4">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2 bg-white p-4 rounded-lg border border-guardai-lightgray">
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-guardai-red to-guardai-black bg-clip-text text-transparent">Guardex.AI Command Center</h1>
            <p className="text-guardai-gray text-sm">
              Ask anything about your locations, camera events, or reports. I'll help you in seconds.
            </p>
          </div>
        </div>
        
        <QuickActions />
        
        <div className="bg-white border border-guardai-gray/20 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm">
          <ScrollArea className="h-[60vh] md:h-[500px] p-4 scrollbar-thin scrollbar-thumb-guardai-red/20 scrollbar-track-guardai-lightgray/20">
            {showEmptyState && messages.length === 0 ? <EmptyState /> : <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                {messages.map((msg, index) => <motion.div key={index} variants={itemVariants}>
                    <ChatMessage message={msg.text} isUser={msg.isUser} />
                  </motion.div>)}
                {isLoading && <motion.div variants={itemVariants} className="flex space-x-2 p-3 max-w-[80%] mr-auto bg-gradient-to-r from-guardai-lightgray/50 to-guardai-lightgray/30 rounded-tl-xl rounded-tr-xl rounded-br-xl">
                    <div className="h-3 w-3 bg-guardai-red/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="h-3 w-3 bg-guardai-red/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="h-3 w-3 bg-guardai-red/40 rounded-full animate-bounce"></div>
                  </motion.div>}
              </motion.div>}
          </ScrollArea>
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </motion.div>;
}
