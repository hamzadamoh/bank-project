import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, TrendingUp, Award, ArrowRight, ArrowLeft } from "lucide-react";
import { questionsByCategory, type Question } from "@/lib/skillarcade-questions";

export default function SkillArcade() {
  const [category, setCategory] = useState("technical");
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessment, setAssessment] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  // Load questions when category changes
  useEffect(() => {
    const categoryQuestions = questionsByCategory[category] || [];
    setQuestions(categoryQuestions);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAssessment(null);
  }, [category]);

  const handleStartAssessment = () => {
    setStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAssessment(null);
  };

  const handleAnswer = (answerIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;

    setAnswers({
      ...answers,
      [currentQuestion.id]: answerIndex,
    });

    // Move to next question (don't auto-submit)
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setStartTime(Date.now());
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setStartTime(Date.now());
    }
  };

  const submitAssessment = async () => {
    setIsAssessing(true);

    // Convert answers to API format
    const responses = questions.map((q, index) => {
      const answerIndex = answers[q.id];
      const questionStartTime = startTime || Date.now();
      return {
        questionId: q.id,
        answer: answerIndex !== undefined ? answerIndex : 0, // Default to first option if not answered
        timeSpent: Math.floor((Date.now() - questionStartTime) / 1000),
      };
    });

    try {
      const response = await fetch('/api/skill-assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          responses,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to assess skills');
      }

      const data = await response.json();
      setAssessment(data.assessment);
      setCurrentQuestionIndex(0);
      setAnswers({});
    } catch (error) {
      console.error('Error assessing skills:', error);
      alert('Failed to assess skills. Please try again.');
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-alabaster-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-display font-bold text-4xl md:text-5xl text-ink-950 mb-6">
                SkillArcade
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Gamified skills assessment with AI-powered insights. Level up your professional capabilities.
              </p>
            </div>

            {/* Interactive Demo */}
            <GlassCard className="max-w-4xl mx-auto p-8">
              {!assessment && questions.length === 0 && (
                <div className="mb-6">
                  <h3 className="font-display font-bold text-2xl text-ink-950 mb-4">Take an Assessment</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Skill Category</label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Skills</SelectItem>
                        <SelectItem value="soft">Soft Skills</SelectItem>
                        <SelectItem value="leadership">Leadership</SelectItem>
                        <SelectItem value="analytical">Analytical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleStartAssessment} className="w-full">
                    Start Assessment
                  </Button>
                </div>
              )}

              {/* Question Interface */}
              {!assessment && questions.length > 0 && currentQuestionIndex < questions.length && (
                <div className="space-y-6">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-slate-700">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </span>
                      <span className="text-sm text-slate-600">
                        {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                      </span>
                    </div>
                    <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
                  </div>

                  {/* Question */}
                  <div className="bg-white rounded-xl p-6">
                    <h3 className="font-semibold text-ink-950 text-lg mb-6">
                      {questions[currentQuestionIndex]?.text}
                    </h3>

                    {/* Answer Options */}
                    <div className="space-y-3">
                      {questions[currentQuestionIndex]?.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            answers[questions[currentQuestionIndex].id] === index
                              ? 'border-ink-950 bg-champagne-100'
                              : 'border-slate-200 hover:border-champagne-200 hover:bg-alabaster-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              answers[questions[currentQuestionIndex].id] === index
                                ? 'border-ink-950 bg-ink-950'
                                : 'border-slate-300'
                            }`}>
                              {answers[questions[currentQuestionIndex].id] === index && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span className="text-slate-700">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between">
                    <Button
                      onClick={handlePrevious}
                      disabled={currentQuestionIndex === 0}
                      variant="outline"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Previous
                    </Button>
                    {currentQuestionIndex < questions.length - 1 ? (
                      <Button
                        onClick={() => {
                          if (answers[questions[currentQuestionIndex]?.id] !== undefined) {
                            setCurrentQuestionIndex(currentQuestionIndex + 1);
                            setStartTime(Date.now());
                          }
                        }}
                        disabled={answers[questions[currentQuestionIndex]?.id] === undefined}
                        className="ml-auto"
                      >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={submitAssessment}
                        disabled={answers[questions[currentQuestionIndex]?.id] === undefined || isAssessing}
                        className="ml-auto"
                      >
                        {isAssessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Assessment
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isAssessing && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-ink-950 border-t-transparent mx-auto mb-4" />
                  <p className="text-slate-700">Analyzing your responses...</p>
                </div>
              )}

              {/* Assessment Results */}
              {assessment && (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-ink-950 text-xl">Overall Score</h4>
                      <Badge className="bg-emerald-400 text-ink-950 text-lg px-4 py-1">
                        {assessment.overallScore}%
                      </Badge>
                    </div>
                    <Progress value={assessment.overallScore} className="h-3" />
                  </div>

                  {/* Category Scores */}
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="font-semibold text-ink-950 mb-4">Category Breakdown</h4>
                    <div className="space-y-4">
                      {Object.entries(assessment.categoryScores).map(([skill, score]: [string, any]) => (
                        <div key={skill}>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">{skill}</span>
                            <span className="text-sm font-semibold text-ink-950">{score}%</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-emerald-50 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-5 w-5 text-emerald-400" />
                        <h4 className="font-semibold text-ink-950">Strengths</h4>
                      </div>
                      <ul className="space-y-2">
                        {assessment.strengths.map((strength: string, index: number) => (
                          <li key={index} className="text-sm text-slate-700 flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Target className="h-5 w-5 text-amber-400" />
                        <h4 className="font-semibold text-ink-950">Areas for Improvement</h4>
                      </div>
                      <ul className="space-y-2">
                        {assessment.weaknesses.map((weakness: string, index: number) => (
                          <li key={index} className="text-sm text-slate-700 flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-400 rounded-full" />
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Level Progress */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Trophy className="h-5 w-5 text-ink-950" />
                      <h4 className="font-semibold text-ink-950">Level Progress</h4>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Level {assessment.nextLevel.current} → Level {assessment.nextLevel.target}</span>
                      <span className="text-sm font-semibold text-ink-950">{assessment.nextLevel.progress}%</span>
                    </div>
                    <Progress value={assessment.nextLevel.progress} className="h-3" />
                  </div>

                  {/* Badges */}
                  {assessment.badges.length > 0 && (
                    <div className="bg-white rounded-xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <Award className="h-5 w-5 text-ink-950" />
                        <h4 className="font-semibold text-ink-950">Earned Badges</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {assessment.badges.map((badge: string, index: number) => (
                          <Badge key={index} className="bg-champagne-200 text-ink-950 px-4 py-2">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Insights */}
                  {assessment.insights && (
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-semibold text-ink-950 mb-3">AI Insights</h4>
                      <p className="text-slate-700 text-sm">{assessment.insights}</p>
                    </div>
                  )}

                  {/* Recommendations */}
                  {assessment.recommendations.length > 0 && (
                    <div className="bg-white rounded-xl p-6">
                      <h4 className="font-semibold text-ink-950 mb-4">Recommendations</h4>
                      <ul className="space-y-2">
                        {assessment.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-ink-950 rounded-full mt-2" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button onClick={() => setAssessment(null)} variant="outline" className="w-full">
                    Take Another Assessment
                  </Button>
                </div>
              )}
            </GlassCard>
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Gamification</h3>
                <p className="text-slate-700">
                  Level up, earn badges, and track your professional growth journey.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Target className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">AI-Powered Insights</h3>
                <p className="text-slate-700">
                  Get personalized recommendations and actionable feedback from AI analysis.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Track Progress</h3>
                <p className="text-slate-700">
                  Monitor your skill development over time with detailed analytics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

