import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Calendar, Award, BookOpen, Video, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function CustomTraining() {
  const { toast } = useToast();

  const handleDownloadCatalog = () => {
    toast({
      title: "Training Catalog",
      description: "The comprehensive training catalog has been sent to your registered email.",
    });
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-alabaster-50 via-white to-champagne-100">
      <Navigation />

      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-champagne-200/30 px-4 py-2 rounded-full text-sm font-medium text-ink-950 mb-6">
              <GraduationCap className="h-4 w-4" />
              Professional Development
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-ink-950 mb-6">
              Custom Training Programs
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Accelerate your team's mastery of FiscAI's AI-powered financial tools with tailored training programs.
              Available on-site in Morocco and globally via virtual delivery.
            </p>
          </div>

          {/* Training Types */}
          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            <GlassCard className="p-8 text-center">
              <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Users className="h-8 w-8 text-ink-950" />
              </div>
              <h3 className="font-display font-bold text-2xl text-ink-950 mb-4">Team Workshops</h3>
              <p className="text-slate-700 mb-6 leading-relaxed">
                Interactive group sessions designed to get your entire team proficient with FiscAI tools quickly and effectively.
              </p>

              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">5-25 participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">1-2 days intensive</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">Hands-on exercises</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">Custom scenarios</span>
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-2xl text-ink-950">$2,500</div>
                <div className="text-sm text-slate-600">per day</div>
              </div>
            </GlassCard>

            <GlassCard className="p-8 text-center border-2 border-ink-950 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-ink-950 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>

              <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <Award className="h-8 w-8 text-ink-950" />
              </div>
              <h3 className="font-display font-bold text-2xl text-ink-950 mb-4">Certification Program</h3>
              <p className="text-slate-700 mb-6 leading-relaxed">
                Comprehensive 5-day certification program with official FiscAI credentials for tax and financial professionals.
              </p>

              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">Up to 15 participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">5-day comprehensive course</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">Official certification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-slate-700">6 months follow-up</span>
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-2xl text-ink-950">$12,500</div>
                <div className="text-sm text-slate-600">complete program</div>
              </div>
            </GlassCard>

            <GlassCard className="p-8 text-center bg-gradient-to-br from-ink-950 to-ink-900 text-white">
              <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-ink-950" />
              </div>
              <h3 className="font-display font-bold text-2xl mb-4">Executive Briefing</h3>
              <p className="text-alabaster-300 mb-6 leading-relaxed">
                Strategic overview for C-level executives and decision makers on AI transformation in finance.
              </p>

              <div className="space-y-3 mb-6 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-alabaster-200">Executive audience</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-alabaster-200">Half-day session</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-alabaster-200">Strategic insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-alabaster-200">ROI analysis</span>
                </div>
              </div>

              <div className="text-center">
                <div className="font-bold text-2xl">$5,000</div>
                <div className="text-sm text-alabaster-400">per session</div>
              </div>
            </GlassCard>
          </div>

          {/* Curriculum Overview */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Comprehensive Curriculum
              </h2>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Our training modules cover every aspect of FiscAI's suite, tailored to your industry and use cases
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <GlassCard className="p-8">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-6">Tax Counsel Mastery</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Multi-Jurisdiction Tax Analysis</h4>
                      <p className="text-sm text-slate-700">Morocco, MENA, and international tax law navigation</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">AI-Powered Research</h4>
                      <p className="text-sm text-slate-700">Leveraging citations and confidence scoring</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Complex Query Construction</h4>
                      <p className="text-sm text-slate-700">Advanced prompting techniques for precise results</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Compliance Workflows</h4>
                      <p className="text-sm text-slate-700">Integrating AI insights into advisory processes</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-8">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-6">Query Architect Expertise</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Natural Language to SQL</h4>
                      <p className="text-sm text-slate-700">Convert business questions into precise database queries</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Performance Optimization</h4>
                      <p className="text-sm text-slate-700">Query efficiency and database best practices</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Financial Data Analysis</h4>
                      <p className="text-sm text-slate-700">Domain-specific querying for financial insights</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Integration Strategies</h4>
                      <p className="text-sm text-slate-700">Embedding Query Architect in existing workflows</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-8">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-6">Factoring Guardian Proficiency</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Document Fraud Detection</h4>
                      <p className="text-sm text-slate-700">AI-powered anomaly detection and verification</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Risk Assessment Workflows</h4>
                      <p className="text-sm text-slate-700">Implementing systematic review processes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Moroccan Business Compliance</h4>
                      <p className="text-sm text-slate-700">Local regulatory requirements and standards</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Case Management</h4>
                      <p className="text-sm text-slate-700">Handling flagged documents and escalation procedures</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-8">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-6">Platform Integration</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">API Development</h4>
                      <p className="text-sm text-slate-700">Connecting FiscAI to your existing systems</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Security Implementation</h4>
                      <p className="text-sm text-slate-700">Enterprise security and compliance considerations</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Change Management</h4>
                      <p className="text-sm text-slate-700">Leading AI transformation in your organization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-ink-950 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-ink-950">Performance Monitoring</h4>
                      <p className="text-sm text-slate-700">Measuring ROI and continuous improvement</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Delivery Formats */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Flexible Delivery Options
              </h2>
              <p className="text-xl text-slate-700">
                Choose the format that best fits your team's schedule and learning preferences
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-semibold text-xl text-ink-950 mb-3">On-Site Training</h3>
                <p className="text-slate-700 mb-4 text-sm">
                  Our trainers come to your location in Morocco or anywhere in the world for immersive, hands-on sessions
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Available in Casablanca, Rabat, and nationwide</li>
                  <li>• International delivery upon request</li>
                  <li>• Custom room setup and equipment</li>
                  <li>• Post-training support included</li>
                </ul>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Video className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-semibold text-xl text-ink-950 mb-3">Virtual Training</h3>
                <p className="text-slate-700 mb-4 text-sm">
                  Interactive online sessions with screen sharing, breakout rooms, and collaborative exercises
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Live instructor-led sessions</li>
                  <li>• Recording available for review</li>
                  <li>• Interactive demonstrations</li>
                  <li>• Global time zone accommodation</li>
                </ul>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Calendar className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-semibold text-xl text-ink-950 mb-3">Blended Learning</h3>
                <p className="text-slate-700 mb-4 text-sm">
                  Combination of on-site workshops, virtual follow-ups, and self-paced learning modules
                </p>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li>• Initial on-site kickoff session</li>
                  <li>• Ongoing virtual check-ins</li>
                  <li>• Self-paced online modules</li>
                  <li>• Extended support period</li>
                </ul>
              </GlassCard>
            </div>
          </div>

          {/* Success Stories */}
          <GlassCard className="p-12 mb-20">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-3xl text-ink-950 mb-4">
                Training Success Stories
              </h2>
              <p className="text-lg text-slate-700">
                See how organizations across Morocco and internationally have transformed their operations
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-champagne-200/20 p-6 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-ink-950 rounded-xl text-white flex items-center justify-center font-bold">
                    AB
                  </div>
                  <div>
                    <div className="font-semibold text-ink-950">Attijariwafa Bank</div>
                    <div className="text-sm text-slate-600">Risk Management Division</div>
                  </div>
                </div>
                <p className="text-slate-700 text-sm italic">
                  "The 5-day certification program transformed our team's approach to document verification.
                  We've reduced false positives by 40% while improving our fraud detection accuracy."
                </p>
              </div>

              <div className="bg-champagne-200/20 p-6 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-ink-950 rounded-xl text-white flex items-center justify-center font-bold">
                    KP
                  </div>
                  <div>
                    <div className="font-semibold text-ink-950">KPMG Morocco</div>
                    <div className="text-sm text-slate-600">Tax Advisory Team</div>
                  </div>
                </div>
                <p className="text-slate-700 text-sm italic">
                  "Custom training on Tax Counsel enabled our advisory team to handle complex multi-jurisdiction
                  queries with confidence. Client satisfaction scores increased by 25% in the first quarter."
                </p>
              </div>
            </div>
          </GlassCard>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
              Ready to Empower Your Team?
            </h2>
            <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
              Invest in comprehensive training that delivers measurable results and lasting expertise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-ink-950 text-alabaster-50 hover:bg-ink-900 px-8 py-4 text-lg font-semibold">
                  Schedule Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="px-8 py-4 text-lg font-semibold"
                onClick={handleDownloadCatalog}
              >
                Download Training Catalog
              </Button>
            </div>

            <div className="mt-8 text-center text-sm text-slate-600">
              <p>Training available in Arabic, French, and English</p>
              <p>Special rates available for Moroccan educational institutions</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}