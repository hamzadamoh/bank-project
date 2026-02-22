import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Server, Shield, Settings, Users, Clock, Database, Network, ArrowRight, CheckCircle, AlertTriangle, Download, MapPin, Globe } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function OnSiteDeployment() {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Technical Guide",
      description: "The FiscAI On-Site Deployment Technical Guide has been sent to your email.",
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
              <Server className="h-4 w-4" />
              Enterprise Infrastructure
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-ink-950 mb-6">
              On-Site Deployment
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Complete on-premises deployment with air-gapped environments, custom integrations, and
              full data sovereignty for financial institutions in Morocco and worldwide.
            </p>
          </div>

          {/* Key Benefits */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-6 w-6 text-ink-950" />
              </div>
              <h3 className="font-semibold text-ink-950 mb-2">Data Sovereignty</h3>
              <p className="text-sm text-slate-700">
                Complete control over your data with no external connectivity required
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Network className="h-6 w-6 text-ink-950" />
              </div>
              <h3 className="font-semibold text-ink-950 mb-2">Custom Integration</h3>
              <p className="text-sm text-slate-700">
                Seamless connection with your existing core banking and ERP systems
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Database className="h-6 w-6 text-ink-950" />
              </div>
              <h3 className="font-semibold text-ink-950 mb-2">Performance</h3>
              <p className="text-sm text-slate-700">
                Optimized for your infrastructure with dedicated hardware resources
              </p>
            </GlassCard>

            <GlassCard className="p-6 text-center">
              <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Users className="h-6 w-6 text-ink-950" />
              </div>
              <h3 className="font-semibold text-ink-950 mb-2">Support</h3>
              <p className="text-sm text-slate-700">
                Dedicated engineering support with on-site presence in Morocco
              </p>
            </GlassCard>
          </div>

          {/* Deployment Options */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Deployment Architectures
              </h2>
              <p className="text-xl text-slate-700">
                Choose the deployment model that meets your security and compliance requirements
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <GlassCard className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-ink-950" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-ink-950 mb-2">Air-Gapped</h3>
                  <p className="text-sm text-slate-700">Maximum security isolation</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Complete network isolation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Offline model training</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Physical media updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Military-grade security</span>
                  </div>
                </div>

                <div className="bg-ink-950 text-white p-4 rounded-xl text-center">
                  <div className="font-bold">Best for:</div>
                  <div className="text-sm">Central banks, defense contractors</div>
                </div>
              </GlassCard>

              <GlassCard className="p-8 border-2 border-ink-950 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-ink-950 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>

                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Network className="h-8 w-8 text-ink-950" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-ink-950 mb-2">Private Cloud</h3>
                  <p className="text-sm text-slate-700">Controlled connectivity</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Restricted internet access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Secure model updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">VPN connectivity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Remote monitoring</span>
                  </div>
                </div>

                <div className="bg-ink-950 text-white p-4 rounded-xl text-center">
                  <div className="font-bold">Best for:</div>
                  <div className="text-sm">Commercial banks, insurance companies</div>
                </div>
              </GlassCard>

              <GlassCard className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-champagne-200 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <Server className="h-8 w-8 text-ink-950" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-ink-950 mb-2">Hybrid</h3>
                  <p className="text-sm text-slate-700">Balanced approach</p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">On-premises core</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Cloud model updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Flexible data policies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-slate-700">Cost optimization</span>
                  </div>
                </div>

                <div className="bg-ink-950 text-white p-4 rounded-xl text-center">
                  <div className="font-bold">Best for:</div>
                  <div className="text-sm">Fintechs, accounting firms</div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Infrastructure Requirements
              </h2>
              <p className="text-xl text-slate-700">
                Minimum specifications for optimal FiscAI performance
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <GlassCard className="p-8">
                <h3 className="font-display font-bold text-2xl text-ink-950 mb-6">Minimum Configuration</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-alabaster-200">
                    <span className="font-medium text-ink-950">CPU</span>
                    <span className="text-slate-700">16 cores (Intel Xeon or AMD EPYC)</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-alabaster-200">
                    <span className="font-medium text-ink-950">RAM</span>
                    <span className="text-slate-700">64 GB DDR4</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-alabaster-200">
                    <span className="font-medium text-ink-950">Storage</span>
                    <span className="text-slate-700">2 TB NVMe SSD</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-alabaster-200">
                    <span className="font-medium text-ink-950">GPU</span>
                    <span className="text-slate-700">NVIDIA V100 or equivalent</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-alabaster-200">
                    <span className="font-medium text-ink-950">Network</span>
                    <span className="text-slate-700">10 Gbps</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium text-ink-950">OS</span>
                    <span className="text-slate-700">RHEL 8+ or Ubuntu 20.04+</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-amber-800">For evaluation only</div>
                      <div className="text-sm text-amber-700">Production workloads require enterprise configuration</div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-8 bg-gradient-to-br from-ink-950 to-ink-900 text-white">
                <h3 className="font-display font-bold text-2xl mb-6">Recommended Enterprise</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-alabaster-700">
                    <span className="font-medium">CPU</span>
                    <span className="text-alabaster-200">32+ cores (dual socket)</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-alabaster-700">
                    <span className="font-medium">RAM</span>
                    <span className="text-alabaster-200">256 GB DDR4 ECC</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-alabaster-700">
                    <span className="font-medium">Storage</span>
                    <span className="text-alabaster-200">10 TB NVMe (RAID 10)</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-alabaster-700">
                    <span className="font-medium">GPU</span>
                    <span className="text-alabaster-200">2x NVIDIA A100</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-alabaster-700">
                    <span className="font-medium">Network</span>
                    <span className="text-alabaster-200">25 Gbps redundant</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="font-medium">Redundancy</span>
                    <span className="text-alabaster-200">HA cluster (3+ nodes)</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-900/30 border border-green-400/30 rounded-xl">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-green-200">Production ready</div>
                      <div className="text-sm text-green-300">Supports 1000+ concurrent users</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* Implementation Process */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="font-display font-bold text-4xl text-ink-950 mb-4">
                Implementation Timeline
              </h2>
              <p className="text-xl text-slate-700">
                Structured approach ensuring smooth deployment and minimal disruption
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-champagne-300"></div>

              <div className="space-y-8">
                {/* Phase 1 */}
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-ink-950 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display font-bold text-xl text-ink-950">Assessment & Planning</h3>
                      <span className="text-sm text-slate-600 bg-champagne-200/30 px-3 py-1 rounded-full">Week 1-2</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                      <ul className="space-y-1">
                        <li>• Infrastructure audit and sizing</li>
                        <li>• Security requirements review</li>
                        <li>• Integration planning</li>
                      </ul>
                      <ul className="space-y-1">
                        <li>• Compliance mapping</li>
                        <li>• Team training assessment</li>
                        <li>• Project timeline finalization</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-ink-950 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display font-bold text-xl text-ink-950">Infrastructure Setup</h3>
                      <span className="text-sm text-slate-600 bg-champagne-200/30 px-3 py-1 rounded-full">Week 3-4</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                      <ul className="space-y-1">
                        <li>• Hardware installation and configuration</li>
                        <li>• Network security implementation</li>
                        <li>• Base system deployment</li>
                      </ul>
                      <ul className="space-y-1">
                        <li>• Monitoring and alerting setup</li>
                        <li>• Backup and disaster recovery</li>
                        <li>• Initial security hardening</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-ink-950 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display font-bold text-xl text-ink-950">Application Deployment</h3>
                      <span className="text-sm text-slate-600 bg-champagne-200/30 px-3 py-1 rounded-full">Week 5-6</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                      <ul className="space-y-1">
                        <li>• FiscAI platform installation</li>
                        <li>• AI model deployment and training</li>
                        <li>• Database configuration</li>
                      </ul>
                      <ul className="space-y-1">
                        <li>• Integration with existing systems</li>
                        <li>• User authentication setup</li>
                        <li>• Performance optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Phase 4 */}
                <div className="flex gap-6">
                  <div className="w-16 h-16 bg-ink-950 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-display font-bold text-xl text-ink-950">Testing & Go-Live</h3>
                      <span className="text-sm text-slate-600 bg-champagne-200/30 px-3 py-1 rounded-full">Week 7-8</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-700">
                      <ul className="space-y-1">
                        <li>• User acceptance testing</li>
                        <li>• Security penetration testing</li>
                        <li>• Performance benchmarking</li>
                      </ul>
                      <ul className="space-y-1">
                        <li>• Team training and certification</li>
                        <li>• Production deployment</li>
                        <li>• 24/7 support activation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Support & Maintenance */}
          <GlassCard className="p-12 mb-20">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-3xl text-ink-950 mb-4">
                Ongoing Support & Maintenance
              </h2>
              <p className="text-lg text-slate-700">
                Comprehensive support ensures your on-premises deployment remains optimized and secure
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-ink-950" />
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">24/7 Monitoring</h4>
                <p className="text-sm text-slate-700">
                  Proactive monitoring with automated alerts and incident response
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-ink-950" />
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Regular Updates</h4>
                <p className="text-sm text-slate-700">
                  Quarterly model updates and security patches via secure channels
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-champagne-200 rounded-xl mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 text-ink-950" />
                </div>
                <h4 className="font-semibold text-ink-950 mb-2">Local Presence</h4>
                <p className="text-sm text-slate-700">
                  On-site engineers available in Morocco for critical support
                </p>
              </div>
            </div>
          </GlassCard>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="font-display font-bold text-4xl text-ink-950 mb-6">
              Ready for Enterprise Deployment?
            </h2>
            <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
              Schedule a consultation with our deployment specialists to design your custom on-premises solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="bg-ink-950 text-alabaster-50 hover:bg-ink-900 px-8 py-4 text-lg font-semibold">
                  Schedule Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="px-8 py-4 text-lg font-semibold"
                onClick={handleDownload}
              >
                Download Technical Guide
              </Button>
            </div>

            <div className="mt-8 text-center text-sm text-slate-600">
              <p>Deployment services available across Morocco, MENA, and Europe</p>
              <p>Special government and educational pricing available</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}