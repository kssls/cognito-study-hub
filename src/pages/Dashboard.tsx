
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Clock, 
  Play, 
  Pause, 
  Coffee, 
  Brain, 
  Camera, 
  MessageSquare,
  Trophy,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes in seconds
  const [breakTimeRemaining, setBreakTimeRemaining] = useState(5 * 60); // 5 minutes in seconds
  const [currentSubject, setCurrentSubject] = useState('Mathematics');

  // Mock user data
  const userData = {
    name: 'Alex Johnson',
    class: 'Class 10',
    studyStreak: 7,
    totalSessions: 24
  };

  // Mock study room data
  const studyRoom = {
    id: 'room-123',
    subject: 'Mathematics',
    participants: [
      { name: 'Alex Johnson', status: 'active' },
      { name: 'Sarah Chen', status: 'active' },
      { name: 'Mike Wilson', status: 'break' },
      { name: 'Emma Davis', status: 'active' },
      { name: 'John Smith', status: 'active' }
    ]
  };

  const subjects = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 
    'English', 'History', 'Geography', 'Computer Science'
  ];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isSessionActive && !isBreak && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isSessionActive && isBreak && breakTimeRemaining > 0) {
      interval = setInterval(() => {
        setBreakTimeRemaining(prev => prev - 1);
      }, 1000);
    }

    // Auto-transition from study to break
    if (timeRemaining === 0 && !isBreak) {
      setIsBreak(true);
      toast({
        title: "Break Time! ☕",
        description: "Great job! Take a 5-minute break to recharge.",
      });
    }

    // Auto-transition from break back to study
    if (breakTimeRemaining === 0 && isBreak) {
      setIsBreak(false);
      setTimeRemaining(90 * 60);
      setBreakTimeRemaining(5 * 60);
      toast({
        title: "Break's Over! 📚",
        description: "Ready for another focused study session?",
      });
    }

    return () => clearInterval(interval);
  }, [isSessionActive, isBreak, timeRemaining, breakTimeRemaining, toast]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startSession = () => {
    setIsSessionActive(true);
    toast({
      title: "Session Started! 🚀",
      description: `Focus mode activated for ${currentSubject}`,
    });
  };

  const pauseSession = () => {
    setIsSessionActive(false);
    toast({
      title: "Session Paused",
      description: "Take your time, resume when ready!",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "See you next time! Keep up the great work.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-cyan-500 to-purple-500 p-2 rounded-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold">{userData.name}</h1>
                <p className="text-white/60 text-sm">{userData.class} • {userData.studyStreak} day streak</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10"
                onClick={() => navigate('/focus-monitor')}
              >
                <Camera className="h-4 w-4 mr-2" />
                Focus Monitor
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Study Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Timer */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      {isBreak ? 'Break Time' : 'Study Session'}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {isBreak ? 'Relax and recharge' : `Focused learning - ${currentSubject}`}
                    </CardDescription>
                  </div>
                  <Badge 
                    variant={isSessionActive ? "default" : "secondary"}
                    className={isSessionActive ? "bg-green-500" : "bg-gray-500"}
                  >
                    {isSessionActive ? 'Active' : 'Paused'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className={`text-6xl font-bold mb-4 ${isBreak ? 'text-orange-400' : 'text-cyan-400'}`}>
                    {formatTime(isBreak ? breakTimeRemaining : timeRemaining)}
                  </div>
                  <Progress 
                    value={isBreak 
                      ? ((5 * 60 - breakTimeRemaining) / (5 * 60)) * 100
                      : ((90 * 60 - timeRemaining) / (90 * 60)) * 100
                    }
                    className="h-2 mb-4"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {!isSessionActive ? (
                    <Button 
                      onClick={startSession}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Session
                    </Button>
                  ) : (
                    <Button 
                      onClick={pauseSession}
                      variant="outline"
                      className="flex-1 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Session
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    onClick={() => navigate('/ai-chat')}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    AI Tutor
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                    onClick={() => navigate('/quiz')}
                  >
                    <Trophy className="h-4 w-4 mr-2" />
                    Quiz
                  </Button>
                </div>

                {/* Subject Selection */}
                <div className="mt-6">
                  <label className="text-white text-sm font-medium mb-2 block">
                    Current Subject
                  </label>
                  <select
                    value={currentSubject}
                    onChange={(e) => setCurrentSubject(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {subjects.map((subject) => (
                      <option key={subject} value={subject} className="bg-gray-800">
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline"
                className="h-20 bg-white/5 border-white/20 text-white hover:bg-white/10 flex-col"
                onClick={() => navigate('/ai-chat')}
              >
                <MessageSquare className="h-6 w-6 mb-2" />
                Ask AI
              </Button>
              <Button 
                variant="outline"
                className="h-20 bg-white/5 border-white/20 text-white hover:bg-white/10 flex-col"
                onClick={() => navigate('/focus-monitor')}
              >
                <Camera className="h-6 w-6 mb-2" />
                Focus Check
              </Button>
              <Button 
                variant="outline"
                className="h-20 bg-white/5 border-white/20 text-white hover:bg-white/10 flex-col"
              >
                <Coffee className="h-6 w-6 mb-2" />
                Take Break
              </Button>
              <Button 
                variant="outline"
                className="h-20 bg-white/5 border-white/20 text-white hover:bg-white/10 flex-col"
                onClick={() => navigate('/quiz')}
              >
                <Trophy className="h-6 w-6 mb-2" />
                Start Quiz
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Study Room */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Study Room
                </CardTitle>
                <CardDescription className="text-white/70">
                  Room ID: {studyRoom.id}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {studyRoom.participants.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white text-sm">{participant.name}</span>
                      <Badge 
                        variant={participant.status === 'active' ? 'default' : 'secondary'}
                        className={participant.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}
                      >
                        {participant.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-white/70">Total Sessions</span>
                  <span className="text-white font-semibold">{userData.totalSessions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Study Streak</span>
                  <span className="text-white font-semibold">{userData.studyStreak} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Focus Score</span>
                  <span className="text-white font-semibold">92%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Quiz Average</span>
                  <span className="text-white font-semibold">85%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
