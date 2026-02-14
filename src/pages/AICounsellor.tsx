import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Brain, 
  Send, 
  ArrowLeft,
  School,
  Target,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Plus
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import type { ChatMessage, Task } from '@/types';
import { universities } from '@/data/universities';
import { toast } from 'sonner';

export default function AICounsellor() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user, chatHistory, shortlistedUniversities } = state;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const generateAIResponse = (userMessage: string): { content: string; actions?: any[] } => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Profile analysis request
    if (lowerMsg.includes('profile') || lowerMsg.includes('strength') || lowerMsg.includes('weakness')) {
      const gpa = user?.onboarding?.academic.gpa;
      const ielts = user?.onboarding?.exams.ielts;
      const gre = user?.onboarding?.exams.gre;
      
      let response = "Here's my analysis of your profile:\n\n";
      response += "**Strengths:**\n";
      response += `- ${user?.onboarding?.academic.degree} in ${user?.onboarding?.academic.major}\n`;
      response += `- Targeting ${user?.onboarding?.goals.intendedDegree} in ${user?.onboarding?.goals.fieldOfStudy}\n`;
      if (gpa) response += `- GPA: ${gpa} (Good academic standing)\n`;
      
      response += "\n**Areas to Improve:**\n";
      if (ielts === 'not-started') response += `- IELTS/TOEFL not started yet - prioritize this\n`;
      if (gre === 'not-started' && user?.onboarding?.goals.intendedDegree !== "Bachelor's") {
        response += `- GRE/GMAT preparation needed for Master's programs\n`;
      }
      
      response += "\nWould you like me to recommend universities based on your profile?";
      
      return { content: response };
    }
    
    // University recommendations
    if (lowerMsg.includes('university') || lowerMsg.includes('recommend') || lowerMsg.includes('suggest')) {
      const preferredCountries = user?.onboarding?.goals.preferredCountries || [];
      const fieldOfStudy = user?.onboarding?.goals.fieldOfStudy || '';
      
      const recommendations = universities
        .filter(u => preferredCountries.length === 0 || preferredCountries.includes(u.country))
        .filter(u => u.programs.some(p => p.toLowerCase().includes(fieldOfStudy.toLowerCase())))
        .slice(0, 3);
      
      let response = "Based on your profile, here are my top recommendations:\n\n";
      
      recommendations.forEach((uni, i) => {
        response += `${i + 1}. **${uni.name}** (${uni.category.toUpperCase()})\n`;
        response += `   - ${uni.whyFit}\n`;
        response += `   - Cost: $${(uni.totalCost / 1000).toFixed(0)}k/year | Acceptance: ${uni.acceptanceChance}\n\n`;
      });
      
      return {
        content: response,
        actions: recommendations.map(uni => ({
          type: 'shortlist_university',
          payload: { universityId: uni.id },
          label: `Add ${uni.name} to Shortlist`
        }))
      };
    }
    
    // Tasks and next steps
    if (lowerMsg.includes('task') || lowerMsg.includes('todo') || lowerMsg.includes('next step')) {
      const tasks: Task[] = [];
      
      if (user?.onboarding?.exams.ielts === 'not-started') {
        tasks.push({
          id: 'suggested-ielts',
          title: 'Register for IELTS/TOEFL',
          description: 'Book your English proficiency test',
          category: 'exam',
          completed: false,
          priority: 'high',
          createdAt: new Date()
        });
      }
      
      if (user?.onboarding?.exams.sop === 'not-started') {
        tasks.push({
          id: 'suggested-sop',
          title: 'Start SOP Draft',
          description: 'Begin working on your Statement of Purpose',
          category: 'document',
          completed: false,
          priority: 'high',
          createdAt: new Date()
        });
      }
      
      if (shortlistedUniversities.length === 0) {
        tasks.push({
          id: 'suggested-research',
          title: 'Research Universities',
          description: 'Explore and shortlist universities',
          category: 'research',
          completed: false,
          priority: 'high',
          createdAt: new Date()
        });
      }
      
      let response = "Here are your recommended next steps:\n\n";
      tasks.forEach((task, i) => {
        response += `${i + 1}. **${task.title}** (${task.category})\n`;
        response += `   ${task.description}\n\n`;
      });
      
      return {
        content: response,
        actions: tasks.map(task => ({
          type: 'add_task',
          payload: { task },
          label: `Add: ${task.title}`
        }))
      };
    }
    
    // Help or general greeting
    if (lowerMsg.includes('help') || lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
      return {
        content: "Hello! I'm your AI Counsellor. I can help you with:\n\n" +
          "• **Profile Analysis** - Understand your strengths and gaps\n" +
          "• **University Recommendations** - Find Dream, Target, and Safe universities\n" +
          "• **Task Management** - Get personalized next steps\n" +
          "• **Application Guidance** - Know what documents you need\n\n" +
          "What would you like help with today?"
      };
    }
    
    // Default response
    return {
      content: "I understand. To better assist you, could you tell me more about what you're looking for? You can ask me about:\n\n" +
        "• Your profile analysis\n" +
        "• University recommendations\n" +
        "• Next steps and tasks\n" +
        "• Application requirements"
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', payload: userMessage });
    
    setInput('');
    setIsTyping(true);

    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.content);
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        actions: aiResponse.actions
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', payload: aiMessage });
      setIsTyping(false);
    }, 1000);
  };

  const handleAction = (action: any) => {
    switch (action.type) {
      case 'shortlist_university':
        const uni = universities.find(u => u.id === action.payload.universityId);
        if (uni) {
          dispatch({ type: 'SHORTLIST_UNIVERSITY', payload: uni });
          toast.success(`Added ${uni.name} to your shortlist!`);
        }
        break;
      case 'add_task':
        dispatch({ type: 'ADD_TASK', payload: action.payload.task });
        toast.success('Task added to your list!');
        break;
    }
  };

  const quickPrompts = [
    { icon: Target, text: 'Analyze my profile' },
    { icon: School, text: 'Recommend universities' },
    { icon: CheckCircle2, text: 'What are my next steps?' },
    { icon: BookOpen, text: 'Application requirements' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-slate-900">AI Counsellor</span>
                  <p className="text-xs text-slate-500">Always here to help</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/dashboard')}
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col">
        {/* Quick Prompts */}
        {chatHistory.length <= 1 && (
          <div className="mb-6">
            <p className="text-sm text-slate-500 mb-3">Quick prompts to get started:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInput(prompt.text);
                  }}
                  className="bg-white"
                >
                  <prompt.icon className="w-4 h-4 mr-2" />
                  {prompt.text}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.role === 'ai' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-full flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-slate-500">AI Counsellor</span>
                    </div>
                  )}
                  <Card className={`border-0 ${
                    message.role === 'user' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-white shadow-md'
                  }`}>
                    <CardContent className="p-4">
                      <div className="whitespace-pre-line text-sm">
                        {message.content}
                      </div>
                      
                      {/* Action Buttons */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-xs opacity-70">Suggested actions:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.actions.map((action, i) => (
                              <Button
                                key={i}
                                size="sm"
                                variant={message.role === 'user' ? 'secondary' : 'outline'}
                                onClick={() => handleAction(action)}
                                className={message.role === 'user' ? 'bg-white/20' : ''}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                {action.label}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <Card className="bg-white shadow-md border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="mt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything about your study abroad journey..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 h-12 bg-white"
            />
            <Button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="h-12 px-6 bg-gradient-to-r from-indigo-600 to-violet-600"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-slate-500 mt-2 text-center">
            AI Counsellor can help with profile analysis, university recommendations, and next steps.
          </p>
        </div>
      </div>
    </div>
  );
}
