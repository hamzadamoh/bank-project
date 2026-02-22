import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, Globe, Heart, Zap, Users, ArrowRight, Coffee, Laptop, GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Careers() {
  const { toast } = useToast();

  const handleApply = (position: string) => {
    toast({
      title: "Application Started",
      description: `Your application for ${position} has been initiated. Please check your email for the next steps.`,
    });
  };
  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Casablanca, Morocco",
      type: "Full-time",
      description: "Lead the development of our next-generation AI models for financial analysis and tax advisory.",
      requirements: ["PhD/MSc in Computer Science or AI", "5+ years ML/NLP experience", "Python, TensorFlow/PyTorch", "Financial domain knowledge preferred"],
    },
    {
      title: "Tax Domain Expert",
      department: "Product",
      location: "Remote MENA",
      type: "Full-time",
      description: "Shape our tax advisory AI products with deep knowledge of Moroccan and international tax law.",
      requirements: ["CPA or tax law degree", "10+ years tax consulting", "MENA tax expertise", "Technology-forward mindset"],
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Rabat, Morocco",
      type: "Full-time",
      description: "Guide enterprise customers through their AI transformation journey with dedicated support.",
      requirements: ["3+ years customer success", "Financial services background", "Arabic, French, English fluency", "Technical aptitude"],
    },
    {
      title: "Frontend Engineer",
      department: "Engineering",
      location: "Remote Europe",
      type: "Full-time",
      description: "Build beautiful, intuitive interfaces for complex AI-powered financial tools.",
      requirements: ["React/TypeScript expertise", "3+ years frontend experience", "UX/UI collaboration skills", "Fintech experience plus"],
    },
    {
      title: "Security Engineer",
      department: "Security",
      location: "Casablanca, Morocco",
      type: "Full-time",
      description: "Ensure enterprise-grade security for sensitive financial data and AI systems.",
      requirements: ["Security certifications (CISSP, etc.)", "Cloud security expertise", "Financial compliance knowledge", "Incident response experience"],
    },
    {
      title: "Business Development - France",
      department: "Sales",
      location: "Paris, France",
      type: "Full-time",
      description: "Drive expansion into French market with focus on banking and accounting firms.",
      requirements: ["5+ years B2B sales", "French financial market knowledge", "AI/SaaS sales experience", "Native French speaker"],
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-alabaster-50 via-white to-champagne-100">
      <Navigation />

      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-champagne-200/30 px-4 py-2 rounded-full text-sm font-medium text-ink-950 mb-6">
              <Briefcase className="h-4 w-4" />
              Join Our Team
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-ink-950 mb-6">
              Shape the Future of Financial AI
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Join a diverse, global team building AI solutions that serve Morocco and the world.
              Work on cutting-edge technology while making a real impact on financial services.
            </p>
          </div>

          {/* Why FiscAI */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Why Work at FiscAI?
              </h2>
              <p className="text-xl text-slate-700">
                More than just a job - it's an opportunity to transform an industry
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-4">Cutting-Edge Technology</h3>
                <p className="text-slate-700 leading-relaxed">
                  Work with the latest AI technologies and contribute to research that advances
                  the entire field of financial AI and natural language processing.
                </p>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Globe className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-4">Global Impact</h3>
                <p className="text-slate-700 leading-relaxed">
                  Your work directly impacts financial institutions across Morocco, MENA, and beyond.
                  Help democratize access to sophisticated financial AI tools worldwide.
                </p>
              </GlassCard>

              <GlassCard className="p-8 text-center">
                <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-8 w-8 text-ink-950" />
                </div>
                <h3 className="font-display font-bold text-xl text-ink-950 mb-4">Diverse Team</h3>
                <p className="text-slate-700 leading-relaxed">
                  Join a multicultural team spanning continents and disciplines. Learn from
                  experts in AI, finance, linguistics, and business across different cultures.
                </p>
              </GlassCard>
            </div>
          </div>

          {/* Benefits */}
          <GlassCard className="p-12 mb-20">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-3xl text-ink-950 mb-4">
                Comprehensive Benefits Package
              </h2>
              <p className="text-lg text-slate-700">
                We invest in our team's well-being, growth, and success
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-ink-950" />
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Health & Wellness</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>Comprehensive medical insurance</li>
                  <li>Mental health support</li>
                  <li>Gym membership</li>
                  <li>Annual health checkups</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Laptop className="h-6 w-6 text-ink-950" />
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Remote Work</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>Flexible remote/hybrid options</li>
                  <li>Home office stipend</li>
                  <li>Co-working space allowance</li>
                  <li>Latest equipment provided</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-ink-950" />
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Learning & Growth</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>Conference & training budget</li>
                  <li>Internal tech talks</li>
                  <li>Certification reimbursement</li>
                  <li>Language learning support</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Coffee className="h-6 w-6 text-ink-950" />
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Work-Life Balance</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>Unlimited PTO policy</li>
                  <li>Flexible working hours</li>
                  <li>Team retreats</li>
                  <li>Parental leave</li>
                </ul>
              </div>
            </div>
          </GlassCard>

          {/* Open Positions */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Open Positions
              </h2>
              <p className="text-xl text-slate-700">
                Join our team and help build the future of financial AI
              </p>
            </div>

            <div className="space-y-6">
              {openPositions.map((position, index) => (
                <GlassCard key={index} className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-3">
                        <h3 className="font-display font-bold text-xl text-ink-950">{position.title}</h3>
                        <span className="bg-champagne-200/30 px-3 py-1 rounded-full text-sm text-ink-950 font-medium">
                          {position.department}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {position.type}
                        </div>
                      </div>

                      <p className="text-slate-700 mb-4 leading-relaxed">
                        {position.description}
                      </p>

                      <div>
                        <h4 className="font-semibold text-ink-950 mb-2">Key Requirements:</h4>
                        <ul className="text-sm text-slate-700">
                          {position.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-start gap-2 mb-1">
                              <div className="w-1.5 h-1.5 bg-ink-950 rounded-full mt-2 flex-shrink-0"></div>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="lg:w-48 flex-shrink-0">
                      <Button
                        className="w-full bg-ink-950 text-alabaster-50 hover:bg-ink-900"
                        onClick={() => handleApply(position.title)}
                      >
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Culture */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Our Culture
              </h2>
              <p className="text-xl text-slate-700">
                Values that unite our global, diverse team
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <GlassCard className="p-8">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-4">🌍 Global Mindset</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  We think globally while acting locally. Our diverse team brings perspectives from across
                  Morocco, MENA, Europe, and beyond to create solutions that work everywhere.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Whether you're in Casablanca, Paris, or working remotely from anywhere, you're
                  part of a connected global team building for the world.
                </p>
              </GlassCard>

              <GlassCard className="p-8">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-4">🚀 Innovation First</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  We encourage experimentation, learning from failures, and pushing boundaries.
                  Every team member is empowered to suggest improvements and try new approaches.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  From 20% time for personal projects to hackathons and research collaborations,
                  innovation is woven into everything we do.
                </p>
              </GlassCard>

              <GlassCard className="p-8">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-4">🤝 Collaboration</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  We believe the best solutions come from diverse perspectives working together.
                  Engineers collaborate with domain experts, designers work with product managers.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Our flat organizational structure means everyone's voice is heard and
                  good ideas can come from anywhere.
                </p>
              </GlassCard>

              <GlassCard className="p-8">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-4">💡 Continuous Learning</h3>
                <p className="text-slate-700 leading-relaxed mb-4">
                  The AI field evolves rapidly, and so do we. We invest heavily in our team's
                  continuous learning through training, conferences, and knowledge sharing.
                </p>
                <p className="text-slate-700 leading-relaxed">
                  Regular tech talks, paper reading sessions, and skill-sharing workshops
                  keep everyone at the cutting edge of their field.
                </p>
              </GlassCard>
            </div>
          </div>

          {/* Application Process */}
          <GlassCard className="p-12 mb-20">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-3xl text-ink-950 mb-4">
                Application Process
              </h2>
              <p className="text-lg text-slate-700">
                Our hiring process is designed to be thorough yet respectful of your time
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-ink-950 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Application</h4>
                <p className="text-sm text-slate-700">
                  Submit your resume and cover letter. Tell us why you're excited about FiscAI.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-ink-950 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold">
                  2
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Initial Screen</h4>
                <p className="text-sm text-slate-700">
                  30-minute call with our talent team to discuss your background and interests.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-ink-950 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold">
                  3
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Technical/Domain</h4>
                <p className="text-sm text-slate-700">
                  Role-specific interview covering technical skills, domain knowledge, or case studies.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-ink-950 rounded-xl mx-auto mb-4 flex items-center justify-center text-white font-bold">
                  4
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Team Fit</h4>
                <p className="text-sm text-slate-700">
                  Meet your potential teammates and manager. Cultural fit and collaboration style.
                </p>
              </div>
            </div>
          </GlassCard>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
              Don't See Your Role?
            </h2>
            <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
              We're always looking for exceptional talent. If you're passionate about AI, finance,
              or building great products, we'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-ink-950 text-alabaster-50 hover:bg-ink-900 px-8 py-4 text-lg font-semibold rounded-xl inline-flex items-center justify-center transition-colors">
                Send Us Your Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="https://www.linkedin.com/company/fiscai"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-ink-950 bg-alabaster-50 text-ink-950 hover:bg-alabaster-100 px-8 py-4 text-lg font-semibold rounded-xl inline-flex items-center justify-center transition-colors"
              >
                Follow Us on LinkedIn
              </a>
            </div>

            <div className="mt-8 text-center text-sm text-slate-600">
              <p>FiscAI is an equal opportunity employer committed to diversity and inclusion</p>
              <p>We welcome applications from all qualified candidates regardless of background</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}