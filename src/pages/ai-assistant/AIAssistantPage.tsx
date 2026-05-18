'use client';

import { useState, useEffect } from 'react';
import { apiUrl } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Bot,
  Send,
  Video,
  Brain,
  Zap,
  MessageSquare,
  AlertTriangle,
  Shield,
  HardHat,
  BarChart2,
  Factory,
  Users,
  Clock,
  Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  photo?: string;
}

interface PredefinedQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ElementType;
}

const predefinedQuestions: PredefinedQuestion[] = [
  {
    id: '1',
    question: 'How many people entered my office unauthorised?',
    answer:
      'Based on the video analysis, there were 3 unauthorized entry attempts detected in the last 24 hours. All incidents were captured by camera cam_06 at the Main Gate and were immediately flagged by our AI system.',
    category: 'Security',
    icon: Shield,
  },
  {
    id: '2',
    question: 'What was the average alert resolution time?',
    answer:
      'The average alert resolution time across all departments is 8.5 minutes. Security alerts are resolved fastest at 4.2 minutes, while compliance alerts take 12.3 minutes on average.',
    category: 'Analytics',
    icon: BarChart2,
  },
  {
    id: '3',
    question: 'Which camera has the most activity?',
    answer:
      'Camera cam_01 in the Blow Moulding Room shows the highest activity with 156 detections today. This includes 23 PPE violations, 8 phone usage alerts, and 6 loitering incidents.',
    category: 'Analytics',
    icon: Video,
  },
  {
    id: '4',
    question: 'How many employees are currently on site?',
    answer:
      'Currently, 142 employees are present on site. The attendance system shows 38 employees are in the Blow Moulding Room, 25 in RO Section, 31 in Filler Room, and the rest distributed across other areas.',
    category: 'Operations',
    icon: Users,
  },
  {
    id: '5',
    question: "What's the current machine idle status?",
    answer:
      '2 machines are currently idle: Machine #7 in the Blow Moulding Room (idle for 30 minutes) and Machine #12 in the Conveyer Belt area (idle for 15 minutes). Maintenance teams have been notified.',
    category: 'Operations',
    icon: Clock,
  },
  {
    id: '6',
    question: 'Show me any loitering alert in\nchemical lab today',
    answer:
      'I found 1 loitering alert in the Chemical Lab today. The incident was captured by camera CAM4 and shows 3 individuals in the laboratory area. The alert has been flagged for review by security.',
    category: 'Operations',
    icon: Factory,
  },
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Video Assistant. I can analyze your security footage and answer questions about what's happening in your facility. Try asking me something!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    setShowDialog(true);
  }, []);

  // Debug: Log when messages change
  useEffect(() => {
    console.log('Messages updated:', messages.length, 'messages');
    messages.forEach((msg, index) => {
      if (msg.photo) {
        console.log(`Message ${index} has photo:`, msg.photo);
      }
    });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let responseText = '';

      // Handle general greetings and help questions
      const lowerText = text.toLowerCase();
      if (
        lowerText.includes('hi') ||
        lowerText.includes('hello') ||
        lowerText.includes('hey')
      ) {
        responseText =
          "Hello! 👋 I'm your AI Video Assistant. I can analyze your security footage and answer questions about what's happening in your facility. Try asking me about specific alerts, camera activity, or use the quick questions below!";
      } else if (
        lowerText.includes('what can you') ||
        lowerText.includes('help') ||
        lowerText.includes('what do you')
      ) {
        responseText =
          'I can help you with:\n\n🔍 **Security Analysis** - Check unauthorized access, loitering alerts\n📊 **Operations Data** - Employee counts, machine status, camera activity\n⚡ **Compliance Monitoring** - PPE violations, safety incidents\n📈 **Analytics** - Alert resolution times, activity patterns\n\nTry asking me specific questions or use the quick questions below!';
      } else {
        responseText =
          "That's a really good question! We at Guardex are working hard to answer that soon! Stay tuned! 🤖✨";
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePredefinedQuestion = (question: PredefinedQuestion) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question.question,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const photoUrl =
        question.id === '6'
          ? apiUrl('/alerts/image/688df366c4729f04f9e094be')
          : undefined;
      console.log('Adding photo URL:', photoUrl); // Debug log

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: question.answer,
        isUser: false,
        timestamp: new Date(),
        photo: photoUrl,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <>
      {/* Welcome Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className='sm:max-w-md border-0 shadow-2xl'>
          <DialogHeader className='text-center'>
            <div className='mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100'>
              <AlertTriangle className='h-6 w-6 text-yellow-600' />
            </div>
            <DialogTitle className='text-xl font-semibold text-gray-900'>
              Work in Progress
            </DialogTitle>
            <DialogDescription className='text-base text-gray-600 mt-2'>
              🛠️ This feature isn't live yet, but you're getting an early look
              at where we're headed.
            </DialogDescription>
          </DialogHeader>
          <div className='flex justify-center mt-6'>
            <Button
              onClick={() => setShowDialog(false)}
              className='bg-gradient-to-r from-guardai-red to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-8 py-3 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105'
            >
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className='h-screen flex flex-col bg-gray-50'>
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='bg-white border-b border-gray-200 p-6'
        >
          <motion.div
            variants={itemVariants}
            className='flex items-center gap-3 mb-2'
          >
            <div className='bg-guardai-red/10 p-3 rounded-lg'>
              <Bot size={28} className='text-guardai-red' />
            </div>
            <div>
              <h1 className='text-2xl font-semibold text-guardai-darkgray'>
                AI Video Assistant
              </h1>
              <p className='text-sm text-guardai-gray'>
                Ask me anything about your security footage and facility
                operations
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className='flex-1 p-6'>
          <motion.div variants={itemVariants} className='w-full'>
            {/* Chat Interface */}
            <Card className='flex flex-col shadow-lg mb-6 border-0 bg-gradient-to-br from-white to-gray-50'>
              <CardHeader className='border-b bg-gradient-to-r from-blue-50 to-indigo-50'>
                <CardTitle className='flex items-center gap-2 text-gray-800'>
                  <Bot size={20} className='text-guardai-red' />
                  AI Video Analysis Chat
                </CardTitle>
              </CardHeader>
              <CardContent className='flex-1 flex flex-col p-0 bg-gradient-to-b from-gray-50 to-white'>
                {/* Messages */}
                <ScrollArea
                  className='flex-1 px-6 py-4'
                  style={{ height: '400px' }}
                >
                  <div className='space-y-4'>
                    <AnimatePresence>
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={cn(
                            'flex',
                            message.isUser ? 'justify-end' : 'justify-start'
                          )}
                        >
                          <div
                            className={cn(
                              'max-w-[70%] rounded-lg px-4 py-3 shadow-sm',
                              message.isUser
                                ? 'bg-gradient-to-r from-guardai-red to-red-500 text-white'
                                : 'bg-gradient-to-r from-white to-blue-50 text-gray-900 border border-blue-200'
                            )}
                          >
                            <p className='text-sm leading-relaxed break-words'>
                              {message.text}
                            </p>
                            {message.photo && (
                              <div className='mt-3'>
                                <img
                                  src={message.photo}
                                  alt='Alert Image'
                                  className='w-full max-w-xs rounded-lg border border-gray-200 shadow-sm'
                                  onLoad={() =>
                                    console.log(
                                      'Image loaded successfully:',
                                      message.photo
                                    )
                                  }
                                  onError={(e) => {
                                    console.log(
                                      'Image failed to load:',
                                      message.photo
                                    );
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <p
                              className={cn(
                                'text-xs mt-2',
                                message.isUser
                                  ? 'text-red-100'
                                  : 'text-gray-500'
                              )}
                            >
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='flex justify-start'
                      >
                        <div className='bg-gradient-to-r from-white to-blue-50 rounded-lg px-4 py-3 border border-blue-200 shadow-sm'>
                          <div className='flex space-x-1'>
                            <div className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'></div>
                            <div
                              className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'
                              style={{ animationDelay: '0.1s' }}
                            ></div>
                            <div
                              className='w-2 h-2 bg-blue-400 rounded-full animate-bounce'
                              style={{ animationDelay: '0.2s' }}
                            ></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className='p-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200'>
                  <div className='flex gap-3'>
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === 'Enter' && handleSendMessage(inputValue)
                      }
                      placeholder='Ask me about your security footage...'
                      className='flex-1 border-gray-300 focus:border-guardai-red focus:ring-guardai-red'
                    />
                    <Button
                      onClick={() => handleSendMessage(inputValue)}
                      disabled={!inputValue.trim() || isTyping}
                      className='bg-gradient-to-r from-guardai-red to-red-600 hover:from-red-600 hover:to-red-700 px-6 shadow-lg'
                    >
                      <Send size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Questions */}
            <Card className='shadow-lg border-0 bg-gradient-to-br from-white to-gray-50'>
              <CardHeader className='border-b bg-gradient-to-r from-green-50 to-emerald-50'>
                <CardTitle className='flex items-center gap-2 text-gray-800'>
                  <MessageSquare size={20} className='text-guardai-red' />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className='p-6'>
                <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
                  {predefinedQuestions.map((question) => {
                    const IconComponent = question.icon;
                    return (
                      <motion.div
                        key={question.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant='outline'
                          className='w-full justify-start text-left h-auto p-4 hover:bg-gradient-to-r hover:from-guardai-red/5 hover:to-red-500/5 border-gray-200 hover:border-guardai-red transition-all duration-200 bg-gradient-to-r from-white to-gray-50'
                          onClick={() => handlePredefinedQuestion(question)}
                          disabled={isTyping}
                        >
                          <div className='flex items-start gap-3'>
                            <div className='bg-gradient-to-r from-guardai-red/10 to-red-500/10 p-2 rounded-lg flex-shrink-0'>
                              <IconComponent
                                size={16}
                                className='text-guardai-red'
                              />
                            </div>
                            <div className='flex-1 min-w-0'>
                              <p className='text-sm font-medium text-gray-900 mb-2 break-words whitespace-pre-line'>
                                {question.question}
                              </p>
                              <div className='flex items-center gap-2 flex-wrap'>
                                <span className='text-xs px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 rounded-full whitespace-nowrap'>
                                  {question.category}
                                </span>
                                <span className='text-xs text-guardai-red font-medium whitespace-nowrap'>
                                  Click to ask
                                </span>
                              </div>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}
