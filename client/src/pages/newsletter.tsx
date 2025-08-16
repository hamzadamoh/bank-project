import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Mail, Globe, TrendingUp, Shield, Zap, Users } from "lucide-react";

export default function Newsletter() {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    company: "",
    role: "",
    country: "",
    interests: [] as string[],
    frequency: ""
  });
  
  const { toast } = useToast();

  const interests = [
    "Tax & Compliance Updates",
    "AI & Technology Trends", 
    "Fintech Innovations",
    "Regulatory Changes",
    "Product Updates",
    "Case Studies",
    "Industry Reports",
    "Webinar Invitations"
  ];

  const handleInterestChange = (interest: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.firstName) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in your email and first name.",
        variant: "destructive"
      });
      return;
    }

    // In production, this would submit to newsletter service
    console.log("Newsletter subscription:", formData);
    
    toast({
      title: "Welcome to FiscAI Insights!",
      description: "Thank you for subscribing. You'll receive your first newsletter soon.",
    });

    // Reset form
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      company: "",
      role: "",
      country: "",
      interests: [],
      frequency: ""
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-alabaster-50 via-white to-champagne-100">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-champagne-200/30 px-4 py-2 rounded-full text-sm font-medium text-ink-950 mb-6">
              <Mail className="h-4 w-4" />
              FiscAI Insights Newsletter
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-ink-950 mb-6">
              Stay Ahead in Finance & AI
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Get exclusive insights on tax advisory, financial AI innovations, and regulatory updates from Morocco and around the world. Join thousands of finance professionals who trust FiscAI for industry intelligence.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-ink-950" />
              </div>
              <h3 className="font-semibold text-ink-950 mb-2">Market Intelligence</h3>
              <p className="text-sm text-slate-700">
                Weekly insights on fintech trends, AI developments, and regulatory changes across Morocco and global markets.
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-ink-950" />
              </div>
              <h3 className="font-semibold text-ink-950 mb-2">Compliance Updates</h3>
              <p className="text-sm text-slate-700">
                Latest tax law changes, regulatory requirements, and compliance best practices for financial institutions.
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-6 w-6 text-ink-950" />
              </div>
              <h3 className="font-semibold text-ink-950 mb-2">Product Previews</h3>
              <p className="text-sm text-slate-700">
                Early access to new FiscAI features, beta programs, and exclusive case studies from leading financial institutions.
              </p>
            </GlassCard>
          </div>

          {/* Subscription Form */}
          <GlassCard className="p-8 lg:p-12">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="font-display font-bold text-2xl text-ink-950 mb-3">
                  Join the FiscAI Community
                </h2>
                <p className="text-slate-700">
                  Customize your newsletter experience and choose the topics that matter most to your work.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Your organization"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cfo">CFO / Finance Director</SelectItem>
                        <SelectItem value="tax-director">Tax Director</SelectItem>
                        <SelectItem value="compliance">Compliance Officer</SelectItem>
                        <SelectItem value="analyst">Financial Analyst</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                        <SelectItem value="consultant">Financial Consultant</SelectItem>
                        <SelectItem value="it-director">IT Director</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morocco">Morocco</SelectItem>
                      <SelectItem value="france">France</SelectItem>
                      <SelectItem value="spain">Spain</SelectItem>
                      <SelectItem value="uae">United Arab Emirates</SelectItem>
                      <SelectItem value="saudi">Saudi Arabia</SelectItem>
                      <SelectItem value="egypt">Egypt</SelectItem>
                      <SelectItem value="tunisia">Tunisia</SelectItem>
                      <SelectItem value="algeria">Algeria</SelectItem>
                      <SelectItem value="other-mena">Other MENA</SelectItem>
                      <SelectItem value="other-europe">Other Europe</SelectItem>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Content Interests (select all that apply)</Label>
                  <div className="mt-3 grid md:grid-cols-2 gap-3">
                    {interests.map((interest) => (
                      <div key={interest} className="flex items-center space-x-2">
                        <Checkbox
                          id={interest}
                          checked={formData.interests.includes(interest)}
                          onCheckedChange={(checked) => handleInterestChange(interest, checked as boolean)}
                        />
                        <Label htmlFor={interest} className="text-sm font-normal">
                          {interest}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Email Frequency</Label>
                  <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="How often would you like to hear from us?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly digest</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly updates</SelectItem>
                      <SelectItem value="monthly">Monthly newsletter</SelectItem>
                      <SelectItem value="quarterly">Quarterly reports only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-ink-950 text-alabaster-50 hover:bg-ink-900 py-3 text-lg font-semibold"
                  >
                    Subscribe to FiscAI Insights
                  </Button>
                </div>

                <div className="text-center text-sm text-slate-600">
                  By subscribing, you agree to receive marketing communications from FiscAI.
                  You can unsubscribe at any time. <br />
                  We respect your privacy and will never share your information with third parties.
                </div>
              </form>
            </div>
          </GlassCard>

          {/* Global Reach Section */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 bg-champagne-200/30 px-4 py-2 rounded-full text-sm font-medium text-ink-950 mb-6">
              <Globe className="h-4 w-4" />
              Serving Morocco & The World
            </div>
            <h2 className="font-display font-bold text-3xl text-ink-950 mb-4">
              Global Insights, Local Expertise
            </h2>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto mb-8">
              While rooted in Morocco's financial landscape, our AI-powered insights serve financial institutions across MENA, Europe, and beyond. Stay connected to both local regulations and global best practices.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-700">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>12,000+ subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>40+ countries</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>98% satisfaction rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}