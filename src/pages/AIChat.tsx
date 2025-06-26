
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Send, Mic, MicOff, Bot, User, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RealtimeAudio } from '@/utils/RealtimeAudio';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const realtimeAudioRef = useRef<RealtimeAudio | null>(null);

  const quickQuestions = [
    { text: "Explain quadratic equations", subject: "Mathematics", icon: "📐" },
    { text: "What is photosynthesis?", subject: "Biology", icon: "🌿" },
    { text: "Help with essay writing", subject: "English", icon: "📝" },
    { text: "Study tips for exams", subject: "General", icon: "💡" }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    initializeRealtimeAudio();
    return () => {
      if (realtimeAudioRef.current) {
        realtimeAudioRef.current.disconnect();
      }
    };
  }, []);

  const initializeRealtimeAudio = async () => {
    try {
      realtimeAudioRef.current = new RealtimeAudio({
        onMessage: (message: string) => {
          if (message.trim()) {
            addMessage('assistant', message);
          }
        },
        onConnectionChange: (connected: boolean) => {
          setIsConnected(connected);
          if (connected) {
            toast({
              title: "Connected to AI Assistant",
              description: "Voice chat is now available",
            });
          } else {
            toast({
              title: "Disconnected",
              description: "Voice chat is not available. Check your connection or API configuration.",
              variant: "destructive"
            });
          }
        },
        onRecordingChange: (recording: boolean) => {
          setIsRecording(recording);
        },
        onSpeakingChange: (speaking: boolean) => {
          setIsSpeaking(speaking);
        }
      });

      await realtimeAudioRef.current.connect();
    } catch (error) {
      console.error('Failed to initialize realtime audio:', error);
      toast({
        title: "Connection Failed",
        description: "Unable to connect to voice chat. Please check if OpenAI API key is configured. Text chat fallback is available.",
        variant: "destructive"
      });
    }
  };

  const addMessage = (type: 'user' | 'assistant', content: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    addMessage('user', userMessage);

    if (realtimeAudioRef.current && isConnected) {
      try {
        realtimeAudioRef.current.sendMessage(userMessage);
      } catch (error) {
        console.error('Error sending message:', error);
        addMessage('assistant', "I'm sorry, there was an error processing your message. Please try again or check your connection.");
      }
    } else {
      // Fallback to basic text response when realtime is not available
      setTimeout(() => {
        addMessage('assistant', "I'm here to help with your studies! However, the AI voice feature is currently unavailable. This might be because the OpenAI API key is not configured. Please contact the administrator to set up the API key for full functionality.");
      }, 1000);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const toggleRecording = () => {
    if (realtimeAudioRef.current && isConnected) {
      if (isRecording) {
        realtimeAudioRef.current.stopRecording();
      } else {
        realtimeAudioRef.current.startRecording();
      }
    } else {
      toast({
        title: "Voice Not Available",
        description: "Voice features require API configuration. Please use text input or contact administrator.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 border border-white/20"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-white font-semibold">AI Study Assistant</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-white/70 text-sm">
                    {isConnected ? 'Voice & text chat available' : 'Text chat only'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {messages.length === 0 && (
          <div className="mb-8">
            <h2 className="text-white text-xl font-semibold mb-4">Quick Questions to Get Started:</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickQuestions.map((question, index) => (
                <Card 
                  key={index}
                  className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer"
                  onClick={() => handleQuickQuestion(question.text)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{question.icon}</div>
                    <h3 className="text-white font-medium text-sm mb-1">{question.text}</h3>
                    <p className="text-white/60 text-xs">{question.subject}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-4">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bot className="h-5 w-5 mr-2" />
              Study Chat
              {isSpeaking && (
                <div className="ml-auto flex items-center space-x-2">
                  <Volume2 className="h-4 w-4 text-purple-400 animate-pulse" />
                  <span className="text-purple-400 text-sm">AI Speaking...</span>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-black/20 rounded-lg">
              {messages.length === 0 && (
                <div className="text-center text-white/60 py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                  <p>Welcome! I'm your AI study assistant.</p>
                  <p className="text-sm mt-2">Ask me questions or select one of the quick questions above to get started.</p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'bg-white/20 text-white border border-white/10'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'assistant' && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                      {message.type === 'user' && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about your studies..."
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <Button
                onClick={toggleRecording}
                variant="outline"
                className={`p-3 border-white/20 hover:bg-white/20 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 border-red-500 text-white' 
                    : 'bg-white/10 text-white hover:text-white'
                }`}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="p-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {!isConnected && (
              <div className="mt-2 text-center text-yellow-400 text-xs">
                Voice features unavailable - API configuration required
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIChat;
