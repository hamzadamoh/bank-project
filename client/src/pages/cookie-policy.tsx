import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Cookie, Settings, BarChart, Shield } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-alabaster-50 via-white to-champagne-100">
      <Navigation />
      
      <div className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-champagne-200/30 px-4 py-2 rounded-full text-sm font-medium text-ink-950 mb-6">
              <Cookie className="h-4 w-4" />
              Cookie & Tracking Policy
            </div>
            <h1 className="font-display font-bold text-5xl lg:text-6xl text-ink-950 mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-slate-700 max-w-3xl mx-auto leading-relaxed">
              Learn how we use cookies and similar technologies to enhance your experience on FiscAI.
            </p>
            <p className="text-sm text-slate-600 mt-4">
              Last updated: January 15, 2025
            </p>
          </div>

          <GlassCard className="p-8 lg:p-12 prose prose-lg max-w-none">
            {/* What Are Cookies */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">What Are Cookies?</h2>
              <p className="text-slate-700 leading-relaxed">
                Cookies are small text files stored on your device when you visit our website. They help us 
                provide you with a better, faster, and safer experience by remembering your preferences, 
                analyzing site performance, and enabling essential functionality.
              </p>
            </section>

            {/* Types of Cookies */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Types of Cookies We Use</h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-champagne-200/20 p-6 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Shield className="h-6 w-6 text-ink-950 mt-1" />
                    <div>
                      <h4 className="font-semibold text-ink-950 mb-2">Essential Cookies</h4>
                      <p className="text-slate-700 text-sm">
                        Required for basic website functionality, security, and user authentication. 
                        These cannot be disabled.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-champagne-200/20 p-6 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <BarChart className="h-6 w-6 text-ink-950 mt-1" />
                    <div>
                      <h4 className="font-semibold text-ink-950 mb-2">Analytics Cookies</h4>
                      <p className="text-slate-700 text-sm">
                        Help us understand how visitors interact with our website to improve 
                        performance and user experience.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-champagne-200/20 p-6 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Settings className="h-6 w-6 text-ink-950 mt-1" />
                    <div>
                      <h4 className="font-semibold text-ink-950 mb-2">Functional Cookies</h4>
                      <p className="text-slate-700 text-sm">
                        Remember your preferences and settings to provide a personalized 
                        experience across sessions.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-champagne-200/20 p-6 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Cookie className="h-6 w-6 text-ink-950 mt-1" />
                    <div>
                      <h4 className="font-semibold text-ink-950 mb-2">Marketing Cookies</h4>
                      <p className="text-slate-700 text-sm">
                        Used to deliver relevant advertisements and track campaign effectiveness. 
                        These require your consent.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Specific Cookies */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Specific Cookies We Use</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-alabaster-300">
                      <th className="text-left p-4 font-semibold text-ink-950">Cookie Name</th>
                      <th className="text-left p-4 font-semibold text-ink-950">Purpose</th>
                      <th className="text-left p-4 font-semibold text-ink-950">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-alabaster-200">
                      <td className="p-4 font-medium text-ink-950">fiscai_session</td>
                      <td className="p-4 text-slate-700">User authentication and session management</td>
                      <td className="p-4 text-slate-700">Session</td>
                    </tr>
                    <tr className="border-b border-alabaster-200">
                      <td className="p-4 font-medium text-ink-950">fiscai_preferences</td>
                      <td className="p-4 text-slate-700">Remember user interface preferences</td>
                      <td className="p-4 text-slate-700">1 year</td>
                    </tr>
                    <tr className="border-b border-alabaster-200">
                      <td className="p-4 font-medium text-ink-950">_ga</td>
                      <td className="p-4 text-slate-700">Google Analytics - distinguish users</td>
                      <td className="p-4 text-slate-700">2 years</td>
                    </tr>
                    <tr className="border-b border-alabaster-200">
                      <td className="p-4 font-medium text-ink-950">_gid</td>
                      <td className="p-4 text-slate-700">Google Analytics - distinguish users</td>
                      <td className="p-4 text-slate-700">24 hours</td>
                    </tr>
                    <tr className="border-b border-alabaster-200">
                      <td className="p-4 font-medium text-ink-950">cookie_consent</td>
                      <td className="p-4 text-slate-700">Remember your cookie preferences</td>
                      <td className="p-4 text-slate-700">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Third-Party Services */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Third-Party Services</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                We use the following third-party services that may set cookies:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Google Analytics:</strong> Website traffic and user behavior analysis</li>
                <li><strong>Intercom:</strong> Customer support and communication</li>
                <li><strong>Stripe:</strong> Payment processing (for billing pages only)</li>
                <li><strong>Cloudflare:</strong> Security and performance optimization</li>
              </ul>
            </section>

            {/* Managing Cookies */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Managing Your Cookie Preferences</h2>
              
              <h3 className="font-semibold text-xl text-ink-950 mb-3">Cookie Banner Controls</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                When you first visit our site, you'll see a cookie banner allowing you to:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-6">
                <li>Accept all cookies</li>
                <li>Reject non-essential cookies</li>
                <li>Customize your preferences by category</li>
                <li>Learn more about each cookie type</li>
              </ul>

              <h3 className="font-semibold text-xl text-ink-950 mb-3">Browser Settings</h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                You can also manage cookies through your browser settings:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                <li><strong>Edge:</strong> Settings → Site permissions → Cookies and site data</li>
              </ul>
            </section>

            {/* Impact of Disabling */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Impact of Disabling Cookies</h2>
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl">
                <h4 className="font-semibold text-amber-800 mb-2">What happens when you disable cookies:</h4>
                <ul className="list-disc list-inside text-amber-700 space-y-1 text-sm">
                  <li>Essential features like login may not work properly</li>
                  <li>Your preferences won't be remembered between sessions</li>
                  <li>Some pages may load more slowly</li>
                  <li>You may see less relevant content and advertisements</li>
                  <li>Analytics data won't include your usage patterns</li>
                </ul>
              </div>
            </section>

            {/* Updates */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Updates to This Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in our practices or 
                for legal, operational, or regulatory reasons. We'll notify you of material changes through 
                our website or by email.
              </p>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="font-display font-bold text-2xl text-ink-950 mb-4">Questions About Cookies?</h2>
              <div className="bg-champagne-200/20 p-6 rounded-2xl">
                <p className="text-slate-700 text-sm">
                  If you have questions about our use of cookies or need help managing your preferences:<br />
                  Email: privacy@fiscai.co<br />
                  Subject: Cookie Policy Inquiry
                </p>
              </div>
            </section>
          </GlassCard>
        </div>
      </div>

      <Footer />
    </div>
  );
}