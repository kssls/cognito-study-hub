
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, Brain, Timer, Camera, Trophy } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<string>('');

  const classOptions = [
    { value: '6', label: 'Class 6', range: '6th Grade' },
    { value: '7', label: 'Class 7', range: '7th Grade' },
    { value: '8', label: 'Class 8', range: '8th Grade' },
    { value: '9', label: 'Class 9', range: '9th Grade' },
    { value: '10', label: 'Class 10', range: '10th Grade' },
    { value: '11', label: 'Class 11', range: '11th Grade' },
    { value: '12', label: 'Class 12', range: '12th Grade' },
    { value: 'graduation', label: 'Graduation', range: 'College Level' },
  ];

  const features = [
    {
      icon: Users,
      title: 'Virtual Study Rooms',
      description: 'Join groups of 5 students from your class for focused study sessions'
    },
    {
      icon: Brain,
      title: 'AI Study Assistant',
      description: 'Get instant help with doubts from our intelligent AI tutor'
    },
    {
      icon: Timer,
      title: 'Structured Sessions',
      description: '1.5-hour focused study periods with 5-minute breaks'
    },
    {
      icon: Camera,
      title: 'Focus Monitoring',
      description: 'Advanced webcam-based distraction detection technology'
    },
    {
      icon: Trophy,
      title: 'Quiz Challenges',
      description: 'Test your knowledge with AI-generated post-session quizzes'
    }
  ];

  const handleGetStarted = () => {
    if (selectedClass) {
      navigate('/auth', { state: { selectedClass } });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-800">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">AIvy</h1>
          </div>
          <Button 
            variant="outline" 
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={() => navigate('/auth')}
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Study Smart,
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {' '}Study Together
            </span>
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join virtual study rooms with AI-powered assistance, focus monitoring, and collaborative learning for students from Class 6 to Graduation.
          </p>

          {/* Class Selection */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-8 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white">Select Your Academic Level</CardTitle>
              <CardDescription className="text-white/70">
                Choose your current class to get matched with appropriate study groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {classOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={selectedClass === option.value ? "default" : "outline"}
                    className={`p-4 h-auto flex-col ${
                      selectedClass === option.value
                        ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white"
                        : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                    }`}
                    onClick={() => setSelectedClass(option.value)}
                  >
                    <span className="font-semibold">{option.label}</span>
                    <span className="text-xs opacity-70">{option.range}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8 py-6 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            onClick={handleGetStarted}
            disabled={!selectedClass}
          >
            Get Started Free
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h3 className="text-4xl font-bold text-white mb-4">Powerful Study Features</h3>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Everything you need for effective, focused, and collaborative studying
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
              <CardHeader>
                <div className="bg-gradient-to-r from-cyan-500 to-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h4 className="text-4xl font-bold text-white mb-2">10,000+</h4>
            <p className="text-white/70">Active Students</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h4 className="text-4xl font-bold text-white mb-2">2,500+</h4>
            <p className="text-white/70">Study Sessions Daily</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h4 className="text-4xl font-bold text-white mb-2">95%</h4>
            <p className="text-white/70">Improved Focus Rate</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 border-t border-white/20">
        <div className="text-center text-white/60">
          <p>&copy; 2024 StudySync. Empowering students with AI-driven collaborative learning.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
