import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Heart, Brain, Users, TrendingUp, CheckCircle, AlertTriangle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Rhalia() {
  const [metrics, setMetrics] = useState({
    sleepHours: 7,
    exerciseMinutes: 30,
    steps: 8000,
    stressLevel: 5,
    mood: 7,
    energyLevel: 7,
    teamCollaboration: 7,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const res = await apiRequest("POST", "/api/wellbeing-analysis", {
        physicalMetrics: {
          sleepHours: metrics.sleepHours,
          exerciseMinutes: metrics.exerciseMinutes,
          steps: metrics.steps,
        },
        mentalMetrics: {
          stressLevel: metrics.stressLevel,
          mood: metrics.mood,
          energyLevel: metrics.energyLevel,
        },
        socialMetrics: {
          teamCollaboration: metrics.teamCollaboration,
        },
      });

      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (error: any) {
      console.error('Error analyzing wellbeing:', error);
      const message = error.message?.includes('401')
        ? 'Please log in to use Rhalia.'
        : 'Failed to analyze wellbeing. Please try again.';
      alert(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-emerald-400';
      case 'good': return 'bg-blue-400';
      case 'fair': return 'bg-amber-400';
      default: return 'bg-rose-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
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
                Rhalia
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Holistic well-being analytics platform. Track and improve your physical, mental, and social health.
              </p>
            </div>

            {/* Input Form */}
            <GlassCard className="max-w-4xl mx-auto p-8 mb-8">
              <h3 className="font-display font-bold text-2xl text-ink-950 mb-6">Enter Your Metrics</h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Physical Metrics */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-ink-950 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-400" />
                    Physical Health
                  </h4>

                  <div>
                    <Label>Sleep Hours: {metrics.sleepHours}h</Label>
                    <Slider
                      value={[metrics.sleepHours]}
                      onValueChange={([value]) => setMetrics({ ...metrics, sleepHours: value })}
                      min={4}
                      max={12}
                      step={0.5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Exercise (minutes/day): {metrics.exerciseMinutes}min</Label>
                    <Slider
                      value={[metrics.exerciseMinutes]}
                      onValueChange={([value]) => setMetrics({ ...metrics, exerciseMinutes: value })}
                      min={0}
                      max={120}
                      step={5}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Daily Steps: {metrics.steps}</Label>
                    <Slider
                      value={[metrics.steps]}
                      onValueChange={([value]) => setMetrics({ ...metrics, steps: value })}
                      min={0}
                      max={20000}
                      step={500}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Mental & Social Metrics */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-ink-950 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-400" />
                    Mental & Social Health
                  </h4>

                  <div>
                    <Label>Stress Level: {metrics.stressLevel}/10</Label>
                    <Slider
                      value={[metrics.stressLevel]}
                      onValueChange={([value]) => setMetrics({ ...metrics, stressLevel: value })}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Mood: {metrics.mood}/10</Label>
                    <Slider
                      value={[metrics.mood]}
                      onValueChange={([value]) => setMetrics({ ...metrics, mood: value })}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Energy Level: {metrics.energyLevel}/10</Label>
                    <Slider
                      value={[metrics.energyLevel]}
                      onValueChange={([value]) => setMetrics({ ...metrics, energyLevel: value })}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Team Collaboration: {metrics.teamCollaboration}/10</Label>
                    <Slider
                      value={[metrics.teamCollaboration]}
                      onValueChange={([value]) => setMetrics({ ...metrics, teamCollaboration: value })}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full mt-6">
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Analyzing...
                  </>
                ) : (
                  "Analyze Wellbeing"
                )}
              </Button>
            </GlassCard>

            {/* Analysis Results */}
            {analysis && (
              <GlassCard className="max-w-4xl mx-auto p-8">
                {/* Overall Score */}
                <div className="bg-white rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-2xl text-ink-950">Overall Wellbeing</h3>
                    <Badge className="bg-emerald-400 text-ink-950 text-lg px-4 py-1">
                      {analysis.overallScore}%
                    </Badge>
                  </div>
                  <Progress value={analysis.overallScore} className="h-4" />
                </div>

                {/* Category Scores */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  {/* Physical */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="h-5 w-5 text-rose-400" />
                      <h4 className="font-semibold text-ink-950">Physical</h4>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-ink-950">{analysis.physical.score}%</span>
                      <Badge className={getStatusColor(analysis.physical.status)}>
                        {analysis.physical.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Progress value={analysis.physical.score} className="h-2 mb-3" />
                    <ul className="space-y-1 text-xs text-slate-600">
                      {analysis.physical.insights.slice(0, 2).map((insight: string, index: number) => (
                        <li key={index}>• {insight}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Mental */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="h-5 w-5 text-blue-400" />
                      <h4 className="font-semibold text-ink-950">Mental</h4>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-ink-950">{analysis.mental.score}%</span>
                      <Badge className={getStatusColor(analysis.mental.status)}>
                        {analysis.mental.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Progress value={analysis.mental.score} className="h-2 mb-3" />
                    <ul className="space-y-1 text-xs text-slate-600">
                      {analysis.mental.insights.slice(0, 2).map((insight: string, index: number) => (
                        <li key={index}>• {insight}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Social */}
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-5 w-5 text-emerald-400" />
                      <h4 className="font-semibold text-ink-950">Social</h4>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-ink-950">{analysis.social.score}%</span>
                      <Badge className={getStatusColor(analysis.social.status)}>
                        {analysis.social.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <Progress value={analysis.social.score} className="h-2 mb-3" />
                    <ul className="space-y-1 text-xs text-slate-600">
                      {analysis.social.insights.slice(0, 2).map((insight: string, index: number) => (
                        <li key={index}>• {insight}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-ink-950" />
                    <h4 className="font-semibold text-ink-950">Recommendations</h4>
                  </div>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-ink-950 rounded-full mt-2" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button onClick={() => setAnalysis(null)} variant="outline" className="w-full mt-6">
                  Analyze Again
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
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Holistic View</h3>
                <p className="text-slate-700">
                  Track physical, mental, and social wellbeing in one comprehensive platform.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">AI Insights</h3>
                <p className="text-slate-700">
                  Get personalized recommendations based on your unique wellbeing patterns.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-3">Actionable Steps</h3>
                <p className="text-slate-700">
                  Receive specific, actionable recommendations to improve your wellbeing.
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

