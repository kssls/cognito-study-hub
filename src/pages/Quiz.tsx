
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Trophy, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

const Quiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Mock quiz questions
  const quizQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: 'What is the value of x in the equation 2x + 5 = 15?',
      options: ['x = 5', 'x = 10', 'x = 7.5', 'x = 2.5'],
      correctAnswer: 0,
      subject: 'Mathematics',
      difficulty: 'easy',
      explanation: 'To solve 2x + 5 = 15, subtract 5 from both sides: 2x = 10, then divide by 2: x = 5'
    },
    {
      id: '2',
      question: 'Which organelle is responsible for photosynthesis in plant cells?',
      options: ['Mitochondria', 'Nucleus', 'Chloroplast', 'Ribosome'],
      correctAnswer: 2,
      subject: 'Biology',
      difficulty: 'easy',
      explanation: 'Chloroplasts contain chlorophyll and are the site where photosynthesis occurs in plant cells.'
    },
    {
      id: '3',
      question: 'What is the chemical formula for water?',
      options: ['CO₂', 'H₂O', 'NaCl', 'CH₄'],
      correctAnswer: 1,
      subject: 'Chemistry',
      difficulty: 'easy',
      explanation: 'Water is composed of two hydrogen atoms and one oxygen atom, hence H₂O.'
    },
    {
      id: '4',
      question: 'Which of the following is a prime number?',
      options: ['15', '21', '17', '25'],
      correctAnswer: 2,
      subject: 'Mathematics',
      difficulty: 'medium',
      explanation: 'A prime number has exactly two factors: 1 and itself. 17 can only be divided by 1 and 17.'
    },
    {
      id: '5',
      question: 'What is the largest planet in our solar system?',
      options: ['Saturn', 'Jupiter', 'Neptune', 'Earth'],
      correctAnswer: 1,
      subject: 'Physics',
      difficulty: 'easy',
      explanation: 'Jupiter is the largest planet in our solar system, with a mass greater than all other planets combined.'
    }
  ];

  // Timer logic
  useEffect(() => {
    if (timeRemaining > 0 && !quizCompleted) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !quizCompleted) {
      completeQuiz();
    }
  }, [timeRemaining, quizCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (selectedAnswer === quizQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    setShowResult(true);
    
    const finalScore = score + (selectedAnswer === quizQuestions[currentQuestionIndex]?.correctAnswer ? 1 : 0);
    const percentage = Math.round((finalScore / quizQuestions.length) * 100);
    
    toast({
      title: "Quiz Completed! 🎉",
      description: `You scored ${finalScore}/${quizQuestions.length} (${percentage}%)`,
    });
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setTimeRemaining(600);
    setQuizCompleted(false);
  };

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;

  if (showResult) {
    const finalScore = score;
    const percentage = Math.round((finalScore / quizQuestions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span className="text-white font-semibold">Quiz Results</span>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-6 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-center">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    percentage >= 80 ? 'bg-green-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}>
                    <Trophy className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-white text-2xl">
                  {percentage >= 80 ? 'Excellent Work!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">
                    {finalScore}/{quizQuestions.length}
                  </div>
                  <div className="text-2xl text-white/70">
                    {percentage}% Score
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-green-400 text-2xl font-bold">{finalScore}</div>
                    <div className="text-white/70 text-sm">Correct</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-red-400 text-2xl font-bold">{quizQuestions.length - finalScore}</div>
                    <div className="text-white/70 text-sm">Incorrect</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-white font-semibold text-left">Review Your Answers:</h3>
                  {quizQuestions.map((question, index) => {
                    const userAnswer = answers[index];
                    const isCorrect = userAnswer === question.correctAnswer;
                    
                    return (
                      <div key={question.id} className="bg-white/5 rounded-lg p-4 text-left">
                        <div className="flex items-start space-x-3">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-400 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <div className="text-white font-medium mb-2">
                              Q{index + 1}: {question.question}
                            </div>
                            <div className="text-sm text-white/70 mb-2">
                              Your answer: {question.options[userAnswer]}
                            </div>
                            {!isCorrect && (
                              <div className="text-sm text-green-400 mb-2">
                                Correct answer: {question.options[question.correctAnswer]}
                              </div>
                            )}
                            <div className="text-xs text-white/60">
                              {question.explanation}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={restartQuiz}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard')}
                    variant="outline"
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-white">
                <Clock className="h-4 w-4" />
                <span className="font-mono">{formatTime(timeRemaining)}</span>
              </div>
              <div className="text-white">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-white/70 text-sm mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  Question {currentQuestionIndex + 1}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-white/20 text-white px-2 py-1 rounded">
                    {currentQuestion.subject}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    currentQuestion.difficulty === 'easy' ? 'bg-green-500' :
                    currentQuestion.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  } text-white`}>
                    {currentQuestion.difficulty}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <h2 className="text-white text-xl font-semibold mb-6">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className={`w-full p-4 h-auto text-left justify-start ${
                      selectedAnswer === index
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 border-transparent text-white'
                        : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedAnswer === index
                          ? 'border-white bg-white'
                          : 'border-white/40'
                      }`}>
                        {selectedAnswer === index && (
                          <div className="w-3 h-3 rounded-full bg-cyan-600"></div>
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                    </div>
                  </Button>
                ))}
              </div>

              <div className="flex justify-end mt-8">
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold px-8"
                >
                  {currentQuestionIndex === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
