
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send, Bot, User, Lightbulb, BookOpen, Calculator, Atom } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  subject?: string;
}

const AIChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI Study Assistant. I'm here to help you with any questions about your studies. Whether it's Math, Science, English, or any other subject - just ask!",
      timestamp: new Date(),
      subject: 'general'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickQuestions = [
    { text: "Explain quadratic equations", subject: "Mathematics", icon: Calculator },
    { text: "What is photosynthesis?", subject: "Biology", icon: Atom },
    { text: "Help with essay writing", subject: "English", icon: BookOpen },
    { text: "Study tips for exams", subject: "General", icon: Lightbulb }
  ];

  const sendMessage = async (messageText?: string) => {
    const messageToSend = messageText || inputMessage.trim();
    if (!messageToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(messageToSend),
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const getAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('quadratic')) {
      return "A quadratic equation is a polynomial equation of degree 2, typically written in the form ax² + bx + c = 0, where a ≠ 0. To solve it, you can use:\n\n1. **Factoring**: Find two numbers that multiply to 'ac' and add to 'b'\n2. **Quadratic Formula**: x = (-b ± √(b²-4ac)) / 2a\n3. **Completing the square**: Rewrite in the form (x-h)² = k\n\nWould you like me to walk through a specific example?";
    }
    
    if (lowerQuestion.includes('photosynthesis')) {
      return "Photosynthesis is the process by which plants convert light energy into chemical energy (glucose). Here's the simplified equation:\n\n**6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂**\n\nThe process occurs in two main stages:\n1. **Light reactions** (in thylakoids): Capture light energy and produce ATP and NADPH\n2. **Calvin cycle** (in stroma): Use ATP and NADPH to convert CO₂ into glucose\n\nThis process is crucial for life on Earth as it produces oxygen and forms the base of food chains!";
    }
    
    if (lowerQuestion.includes('essay') || lowerQuestion.includes('writing')) {
      return "Here's a structured approach to essay writing:\n\n**1. Planning (20% of time)**\n- Understand the question\n- Brainstorm ideas\n- Create an outline\n\n**2. Writing (60% of time)**\n- **Introduction**: Hook + context + thesis\n- **Body paragraphs**: Topic sentence + evidence + analysis + transition\n- **Conclusion**: Restate thesis + summarize + final thought\n\n**3. Editing (20% of time)**\n- Check structure and flow\n- Fix grammar and spelling\n- Ensure clarity and conciseness\n\nWhat type of essay are you working on?";
    }
    
    if (lowerQuestion.includes('study tips') || lowerQuestion.includes('exam')) {
      return "Here are proven study strategies for exam success:\n\n**🧠 Active Learning Techniques:**\n- Use the Pomodoro Technique (25 min focus + 5 min break)\n- Practice retrieval: Test yourself regularly\n- Teach others or explain concepts aloud\n\n**📅 Planning & Organization:**\n- Create a study schedule\n- Break large topics into smaller chunks\n- Use spaced repetition for long-term retention\n\n**🏃‍♂️ Physical & Mental Wellness:**\n- Get 7-9 hours of sleep\n- Take regular breaks\n- Stay hydrated and eat brain-healthy foods\n\nWhat subject are you preparing for?";
    }
    
    // Default response
    return "I'd be happy to help you with that! Could you provide a bit more detail about what specifically you'd like to know? The more context you give me, the better I can assist you with your studies.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-lg">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-semibold">AI Study Assistant</h1>
                  <p className="text-white/60 text-sm">Always here to help with your questions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 h-[calc(100vh-120px)] flex flex-col">
        {/* Quick Questions */}
        {messages.length <= 1 && (
          <div className="mb-6">
            <h2 className="text-white text-lg font-semibold mb-4">Quick Questions to Get Started:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {quickQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 bg-white/5 border-white/20 text-white hover:bg-white/10 flex-col space-y-2 text-left"
                  onClick={() => sendMessage(question.text)}
                >
                  <question.icon className="h-5 w-5 text-cyan-400" />
                  <span className="text-sm">{question.text}</span>
                  <span className="text-xs text-white/60">{question.subject}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Container */}
        <Card className="flex-1 bg-white/10 border-white/20 backdrop-blur-sm flex flex-col overflow-hidden">
          <CardHeader className="flex-shrink-0">
            <CardTitle className="text-white flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              Study Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-6 overflow-hidden">
            {/* Messages Container with proper scrolling */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {message.type === 'ai' && (
                        <Bot className="h-5 w-5 text-cyan-400 mt-1 flex-shrink-0" />
                      )}
                      {message.type === 'user' && (
                        <User className="h-5 w-5 text-white mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed break-words">
                          {message.content}
                        </div>
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-2xl bg-white/20 text-white">
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 text-cyan-400" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="flex space-x-3 flex-shrink-0 border-t border-white/10 pt-4">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your studies..."
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIChat;
