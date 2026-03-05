import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";
import { Link } from "wouter";

type FormType = "demo" | "contact";

export default function Contact() {
  const [formType, setFormType] = useState<FormType>("demo");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    phone: "",
    subject: "",
    message: "",
    tools: [] as string[],
    useCase: "",
    timeline: "",
    budget: "",
    employees: ""
  });

  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = formType === "demo" ? "/api/demo-requests" : "/api/contact";
      return apiRequest("POST", endpoint, data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: formType === "demo"
          ? "Your demo request has been submitted. We'll contact you within 24 hours."
          : "Your message has been sent. We'll get back to you soon.",
      });
      setFormData({
        name: "",
        email: "",
        company: "",
        role: "",
        phone: "",
        subject: "",
        message: "",
        tools: [],
        useCase: "",
        timeline: "",
        budget: "",
        employees: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formType === "demo") {
      submitMutation.mutate({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        role: formData.role,
        tools: formData.tools,
        message: `Use Case: ${formData.useCase}\nTimeline: ${formData.timeline}\nBudget: ${formData.budget}\nCompany Size: ${formData.employees}\nPhone: ${formData.phone}`
      });
    } else {
      submitMutation.mutate({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        subject: formData.subject,
        message: formData.message
      });
    }
  };

  const handleToolChange = (tool: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tools: checked
        ? [...prev.tools, tool]
        : prev.tools.filter(t => t !== tool)
    }));
  };

  const tools = [
    "FiscAI TaxWise",
    "DocuGuard",
    "QueryForge",
    "SkillForge",
    "PolyGlot",
    "WellPulse",
    "FeedbackIQ"
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-alabaster-50 to-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="font-display font-bold text-4xl md:text-5xl text-ink-950 mb-6">
                Get In Touch
              </h1>
              <p className="text-xl text-slate-700 max-w-3xl mx-auto">
                Ready to transform your financial operations? Let's discuss how FiscAI can solve your specific challenges.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h3 className="font-display font-bold text-2xl text-ink-950 mb-6">Contact Information</h3>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-champagne-200 rounded-xl flex items-center justify-center">
                        <Mail className="h-6 w-6 text-ink-950" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-ink-950">Email</h4>
                        <p className="text-slate-700">hello@fiscai.co</p>
                        <p className="text-sm text-slate-600">We respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-champagne-200 rounded-xl flex items-center justify-center">
                        <Phone className="h-6 w-6 text-ink-950" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-ink-950">Phone</h4>
                        <p className="text-slate-700">+212 5 22 XX XX XX</p>
                        <p className="text-sm text-slate-600">Mon-Fri, 9am-6pm CET</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-champagne-200 rounded-xl flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-ink-950" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-ink-950">Address</h4>
                        <p className="text-slate-700">Casablanca, Morocco</p>
                        <p className="text-sm text-slate-600">Office visits by appointment</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-champagne-200 rounded-xl flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-ink-950" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-ink-950">Schedule a Demo</h4>
                        <p className="text-slate-700">30-minute product walkthrough</p>
                        <p className="text-sm text-slate-600">Available slots within 48 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <GlassCard className="p-8">
                    <div className="mb-6">
                      <div className="flex gap-4 mb-6">
                        <button
                          onClick={() => setFormType("demo")}
                          className={`px-4 py-2 rounded-xl font-semibold transition-colors ${formType === "demo"
                            ? "bg-ink-950 text-alabaster-50"
                            : "bg-alabaster-100 text-slate-700 hover:bg-alabaster-200"
                            }`}
                        >
                          Request Demo
                        </button>
                        <button
                          onClick={() => setFormType("contact")}
                          className={`px-4 py-2 rounded-xl font-semibold transition-colors ${formType === "contact"
                            ? "bg-ink-950 text-alabaster-50"
                            : "bg-alabaster-100 text-slate-700 hover:bg-alabaster-200"
                            }`}
                        >
                          General Contact
                        </button>
                      </div>

                      <h3 className="font-display font-bold text-2xl text-ink-950 mb-2">
                        {formType === "demo" ? "Request a Personalized Demo" : "Send us a Message"}
                      </h3>
                      <p className="text-slate-700">
                        {formType === "demo"
                          ? "Get a tailored demonstration of FiscAI tools relevant to your use case"
                          : "We'd love to hear from you. Send us a message and we'll respond as soon as possible."
                        }
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="your@company.com"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="company">Company *</Label>
                          <Input
                            id="company"
                            type="text"
                            required
                            value={formData.company}
                            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="Your company name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="role">Job Title</Label>
                          <Input
                            id="role"
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                            placeholder="Your job title"
                          />
                        </div>
                      </div>

                      {formType === "demo" ? (
                        <>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+212 XXX XXX XXX"
                            />
                          </div>

                          <div>
                            <Label>Which tools are you interested in? *</Label>
                            <div className="mt-3 grid md:grid-cols-2 gap-3">
                              {tools.map((tool) => (
                                <div key={tool} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={tool}
                                    checked={formData.tools.includes(tool)}
                                    onCheckedChange={(checked) => handleToolChange(tool, checked as boolean)}
                                  />
                                  <Label htmlFor={tool} className="text-sm font-normal">
                                    {tool}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <Label htmlFor="timeline">Implementation Timeline</Label>
                              <Select
                                value={formData.timeline}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select timeline" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="immediate">Immediate (&lt; 1 month)</SelectItem>
                                  <SelectItem value="short">Short term (1-3 months)</SelectItem>
                                  <SelectItem value="medium">Medium term (3-6 months)</SelectItem>
                                  <SelectItem value="long">Long term (6+ months)</SelectItem>
                                  <SelectItem value="exploring">Just exploring</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="employees">Company Size</Label>
                              <Select
                                value={formData.employees}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, employees: value }))}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Number of employees" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1-10">1-10 employees</SelectItem>
                                  <SelectItem value="11-50">11-50 employees</SelectItem>
                                  <SelectItem value="51-200">51-200 employees</SelectItem>
                                  <SelectItem value="201-1000">201-1000 employees</SelectItem>
                                  <SelectItem value="1000+">1000+ employees</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="useCase">Describe Your Use Case *</Label>
                            <Textarea
                              id="useCase"
                              required
                              value={formData.useCase}
                              onChange={(e) => setFormData(prev => ({ ...prev, useCase: e.target.value }))}
                              placeholder="Tell us about your current challenges and how you'd like to use FiscAI..."
                              rows={4}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                              id="subject"
                              type="text"
                              required
                              value={formData.subject}
                              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                              placeholder="What's this about?"
                            />
                          </div>

                          <div>
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                              id="message"
                              required
                              value={formData.message}
                              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                              placeholder="Tell us how we can help..."
                              rows={6}
                            />
                          </div>
                        </>
                      )}

                      <div className="flex items-start gap-3">
                        <Checkbox id="privacy" required />
                        <Label htmlFor="privacy" className="text-sm font-normal text-slate-600">
                          I agree to the privacy policy and terms of service. I understand that FiscAI will use my information to respond to my inquiry and may contact me about relevant products and services.
                        </Label>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={submitMutation.isPending}
                      >
                        {submitMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-alabaster-50 border-t-transparent" />
                            Sending...
                          </div>
                        ) : (
                          formType === "demo" ? "Request Demo" : "Send Message"
                        )}
                      </Button>
                    </form>
                  </GlassCard>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
