
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Camera, Eye, EyeOff, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FocusMonitor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [focusScore, setFocusScore] = useState(85);
  const [sessionTime, setSessionTime] = useState(0);
  const [distractions, setDistractions] = useState(3);
  const [isLookingAway, setIsLookingAway] = useState(false);

  // Mock focus monitoring data
  const focusData = {
    totalTime: 45 * 60, // 45 minutes
    focusedTime: 38 * 60, // 38 minutes
    distractedTime: 7 * 60, // 7 minutes
    averageFocus: 85,
    posturAlerts: 2,
    lookAwayCount: 12
  };

  const recentEvents = [
    { time: '14:32', type: 'distraction', description: 'Looking away detected' },
    { time: '14:28', type: 'posture', description: 'Poor posture detected' },
    { time: '14:25', type: 'focus', description: 'Great focus streak - 10 minutes!' },
    { time: '14:18', type: 'distraction', description: 'Phone detected in frame' },
    { time: '14:15', type: 'focus', description: 'Monitoring started' }
  ];

  useEffect(() => {
    // Simulate session timer
    let interval: NodeJS.Timeout;
    if (isMonitoring) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        
        // Simulate random focus changes
        if (Math.random() < 0.1) {
          const newScore = Math.max(60, Math.min(100, focusScore + (Math.random() - 0.5) * 20));
          setFocusScore(Math.round(newScore));
        }
        
        // Simulate looking away detection
        if (Math.random() < 0.05) {
          setIsLookingAway(true);
          setTimeout(() => setIsLookingAway(false), 2000);
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isMonitoring, focusScore]);

  useEffect(() => {
    // Auto-request camera permission when component mounts
    requestCameraPermission();
    
    // Cleanup function to stop camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestCameraPermission = async () => {
    try {
      console.log('Requesting camera permission...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });
      
      console.log('Camera permission granted, setting up video stream...');
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Ensure video plays
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play().catch(error => {
              console.error('Error playing video:', error);
            });
          }
        };
      }
      
      setCameraPermission('granted');
      toast({
        title: "Camera Access Granted ✅",
        description: "You should now see yourself in the camera feed!",
      });
    } catch (error) {
      console.error('Camera permission denied:', error);
      setCameraPermission('denied');
      toast({
        title: "Camera Access Denied",
        description: "Please allow camera access and refresh the page to use focus monitoring.",
        variant: "destructive"
      });
    }
  };

  const startMonitoring = () => {
    if (cameraPermission !== 'granted') {
      requestCameraPermission();
      return;
    }
    
    setIsMonitoring(true);
    toast({
      title: "Focus Monitoring Started 👁️",
      description: "AI is now tracking your focus and posture.",
    });
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    toast({
      title: "Focus Monitoring Stopped",
      description: `Session completed! Focus score: ${focusScore}%`,
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getFocusColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getFocusStatus = (score: number) => {
    if (score >= 80) return 'Excellent Focus';
    if (score >= 60) return 'Good Focus';
    return 'Needs Attention';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <Activity className="h-6 w-6 text-cyan-400" />
              <div>
                <h1 className="text-white font-semibold">Focus Monitor</h1>
                <p className="text-white/60 text-sm">AI-powered attention tracking</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Camera Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Camera Card */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Live Camera Feed
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {cameraPermission === 'granted' && (
                      <div className="flex items-center space-x-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm">Camera Active</span>
                      </div>
                    )}
                    {isLookingAway && (
                      <div className="flex items-center space-x-2 text-orange-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Looking Away</span>
                      </div>
                    )}
                    {isMonitoring && (
                      <div className="flex items-center space-x-2 text-cyan-400">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                        <span className="text-sm">Monitoring</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-black/50 rounded-lg overflow-hidden border-2 border-white/20">
                  {cameraPermission === 'granted' ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]"
                        style={{ filter: 'none' }}
                      />
                      {isMonitoring && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded text-sm flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                            Face Detected
                          </div>
                          {isLookingAway && (
                            <div className="absolute inset-0 bg-orange-500/20 flex items-center justify-center">
                              <div className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                                Please look at the screen
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : cameraPermission === 'denied' ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-red-400" />
                        <p className="text-lg mb-2 text-red-400">Camera Access Denied</p>
                        <p className="text-white/70 text-sm mb-4">
                          Please refresh the page and allow camera access to continue
                        </p>
                        <Button
                          onClick={() => window.location.reload()}
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                        >
                          Refresh Page
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center text-white">
                        <Camera className="h-16 w-16 mx-auto mb-4 text-white/50 animate-pulse" />
                        <p className="text-lg mb-2">Setting up camera...</p>
                        <p className="text-white/70 text-sm mb-4">
                          Please allow camera access in your browser
                        </p>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center mt-6">
                  {!isMonitoring ? (
                    <Button
                      onClick={startMonitoring}
                      disabled={cameraPermission !== 'granted'}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Start Monitoring
                    </Button>
                  ) : (
                    <Button
                      onClick={stopMonitoring}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8"
                    >
                      <EyeOff className="h-4 w-4 mr-2" />
                      Stop Monitoring
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Focus Analytics */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Session Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatTime(sessionTime)}
                    </div>
                    <div className="text-white/60 text-sm">Session Time</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold mb-1 ${getFocusColor(focusScore)}`}>
                      {focusScore}%
                    </div>
                    <div className="text-white/60 text-sm">Focus Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-400 mb-1">{distractions}</div>
                    <div className="text-white/60 text-sm">Distractions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">2</div>
                    <div className="text-white/60 text-sm">Posture Alerts</div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex justify-between text-white/70 text-sm mb-2">
                    <span>Focus Level</span>
                    <span>{getFocusStatus(focusScore)}</span>
                  </div>
                  <Progress 
                    value={focusScore} 
                    className={`h-3 ${focusScore >= 80 ? 'bg-green-500' : focusScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Real-time Status */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Real-time Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Face Detection</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Eye Tracking</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Posture Check</span>
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Distraction Alert</span>
                  {isLookingAway ? (
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Events */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentEvents.map((event, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        event.type === 'focus' ? 'bg-green-400' :
                        event.type === 'distraction' ? 'bg-red-400' : 'bg-yellow-400'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white/60 text-xs">{event.time}</div>
                        <div className="text-white text-sm">{event.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Focus Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-white/70 text-sm">
                  <div>• Maintain eye contact with the screen</div>
                  <div>• Keep good posture while studying</div>
                  <div>• Take breaks every 25-30 minutes</div>
                  <div>• Minimize distractions in your environment</div>
                  <div>• Ensure good lighting on your face</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMonitor;
