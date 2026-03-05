import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Heart, TrendingUp, CheckCircle, AlertCircle, Smile } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const categories = [
  { id: 'work', label: 'Work Satisfaction', icon: '💼' },
  { id: 'relationships', label: 'Relationships', icon: '👥' },
  { id: 'achievement', label: 'Achievement', icon: '🏆' },
  { id: 'autonomy', label: 'Autonomy', icon: '🔓' },
  { id: 'growth', label: 'Growth', icon: '📈' },
];

export default function FeedbackIQ() {
  const [ratings, setRatings] = useState<Record<string, number>>({
    work: 7,
    relationships: 7,
    achievement: 7,
    autonomy: 7,
    growth: 7,
  });
  const [comments, setComments] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleRatingChange = (category: string, value: number[]) => {
    setRatings({ ...ratings, [category]: value[0] });
  };

  const handleCommentChange = (category: string, value: string) => {
    setComments({ ...comments, [category]: value });
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);

    const responses = categories.map(cat => ({
      questionId: `q_${cat.id}`,
      category: cat.id as any,
      rating: ratings[cat.id],
      comment: comments[cat.id] || undefined,
    }));

    try {
      const res = await apiRequest("POST", "/api/satisfaction-analysis", {
        responses,
      });

      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (error: any) {
      console.error('Error analyzing satisfaction:', error);
      const message = error.message?.includes('401')
        ? 'Please log in to use FeedbackIQ.'
        : 'Failed to analyze satisfaction. Please try again.';
      alert(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEmotionColor = (primary: string) => {
    if (primary.includes('High')) return 'text-emerald-400';
    if (primary.includes('Moderate')) return 'text-blue-400';
    if (primary.includes('Mixed')) return 'text-amber-400';
    return 'text-rose-400';
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
                FeedbackIQ
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Measure and understand your emotional satisfaction. Get insights into what drives your happiness.
              </p>
            </div>

            {/* Survey Form */}
            <GlassCard className="max-w-4xl mx-auto p-8 mb-8">
              <h3 className="font-display font-bold text-2xl text-ink-950 mb-6">Satisfaction Survey</h3>

              <div className="space-y-8">
                {categories.map((category) => (
                  <div key={category.id} className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{category.icon}</span>
                      <Label className="text-lg font-semibold">{category.label}</Label>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">Rating: {ratings[category.id]}/10</span>
                        <Badge variant="outline">{ratings[category.id] >= 7 ? 'High' : ratings[category.id] >= 5 ? 'Medium' : 'Low'}</Badge>
                      </div>
                      <Slider
                        value={[ratings[category.id]]}
                        onValueChange={(value) => handleRatingChange(category.id, value)}
                        min={1}
                        max={10}
                        step={1}
                      />
                    </div>

                    <div>
                      <Label className="text-sm text-slate-600 mb-2 block">Optional Comment</Label>
                      <Textarea
                        placeholder="Share your thoughts about this area..."
                        value={comments[category.id] || ''}
                        onChange={(e) => handleCommentChange(category.id, e.target.value)}
                        rows={2}
                        className="resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full mt-6">
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Analyzing Satisfaction...
                  </>
                ) : (
                  <>
                    <Smile className="h-4 w-4 mr-2" />
                    Analyze My Satisfaction
                  </>
                )}
              </Button>
            </GlassCard>

            {/* Analysis Results */}
            {analysis && (
              <GlassCard className="max-w-4xl mx-auto p-8">
                {/* Overall Score */}
                <div className="bg-white rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-2xl text-ink-950">Overall Satisfaction</h3>
                    <Badge className="bg-emerald-400 text-ink-950 text-lg px-4 py-1">
                      {analysis.overallScore}%
                    </Badge>
                  </div>
                  <Progress value={analysis.overallScore} className="h-4 mb-4" />

                  {/* Emotional Profile */}
                  <div className="bg-alabaster-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className={`h-5 w-5 ${getEmotionColor(analysis.emotionalProfile.primary)}`} />
                      <span className="font-semibold text-ink-950">{analysis.emotionalProfile.primary}</span>
                    </div>
                    <p className="text-sm text-slate-600">{analysis.emotionalProfile.secondary}</p>
                    <div className="mt-2">
                      <span className="text-xs text-slate-500">Intensity: {analysis.emotionalProfile.intensity}%</span>
                      <Progress value={analysis.emotionalProfile.intensity} className="h-2 mt-1" />
                    </div>
                  </div>
                </div>

                {/* Category Scores */}
                <div className="bg-white rounded-xl p-6 mb-6">
                  <h4 className="font-semibold text-ink-950 mb-4">Category Breakdown</h4>
                  <div className="space-y-4">
                    {Object.entries(analysis.categoryScores).map(([category, score]: [string, any]) => {
                      const catInfo = categories.find(c => c.id === category);
                      return (
                        <div key={category}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span>{catInfo?.icon}</span>
                              <span className="text-sm font-medium text-slate-700">{catInfo?.label}</span>
                            </div>
                            <span className="text-sm font-semibold text-ink-950">{score.toFixed(1)}%</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Key Drivers */}
                <div className="bg-white rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-ink-950" />
                    <h4 className="font-semibold text-ink-950">Key Drivers</h4>
                  </div>
                  <div className="space-y-3">
                    {analysis.keyDrivers.map((driver: any, index: number) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${driver.impact === 'positive' ? 'bg-emerald-50' : 'bg-amber-50'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          {driver.impact === 'positive' ? (
                            <CheckCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                          )}
                          <span className="text-sm font-medium text-ink-950">{driver.factor}</span>
                        </div>
                        <Badge
                          variant={driver.impact === 'positive' ? 'default' : 'destructive'}
                          className="bg-opacity-50"
                        >
                          {driver.impact === 'positive' ? '+' : '-'}{driver.strength}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Insights */}
                {analysis.insights && (
                  <div className="bg-white rounded-xl p-6 mb-6">
                    <h4 className="font-semibold text-ink-950 mb-3">AI Insights</h4>
                    <p className="text-slate-700 text-sm leading-relaxed">{analysis.insights}</p>
                  </div>
                )}

                {/* Recommendations */}
                {analysis.recommendations.length > 0 && (
                  <div className="bg-white rounded-xl p-6">
                    <h4 className="font-semibold text-ink-950 mb-4">Recommendations</h4>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-ink-950 rounded-full mt-2" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button onClick={() => setAnalysis(null)} variant="outline" className="w-full mt-6">
                  Take Survey Again
                </Button>
              </GlassCard>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="py-24 px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Emotional Profile</h3>
                <p className="text-slate-700">
                  Understand your emotional satisfaction profile across multiple dimensions.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Key Drivers</h3>
                <p className="text-slate-700">
                  Identify what factors most impact your satisfaction, both positively and negatively.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Smile className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Actionable Insights</h3>
                <p className="text-slate-700">
                  Receive personalized recommendations to improve your overall satisfaction.
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

