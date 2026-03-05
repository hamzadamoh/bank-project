import { Link } from "wouter";
import { FaLinkedinIn, FaXTwitter, FaGithub } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-white py-16 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="font-display font-bold text-2xl text-ink-950 mb-4">FiscAI</div>
            <p className="text-slate-700 mb-6 max-w-md">
              Enterprise AI suite for smarter finance and faster decisions. Seven specialized tools built for financial institutions.
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-champagne-200 rounded-xl flex items-center justify-center hover:bg-champagne-300 transition-colors">
                <FaLinkedinIn className="h-5 w-5 text-ink-950" />
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-champagne-200 rounded-xl flex items-center justify-center hover:bg-champagne-300 transition-colors">
                <FaXTwitter className="h-5 w-5 text-ink-950" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-champagne-200 rounded-xl flex items-center justify-center hover:bg-champagne-300 transition-colors">
                <FaGithub className="h-5 w-5 text-ink-950" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-ink-950 mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><Link href="/products/taxwise" className="hover:text-ink-950 transition-colors">TaxWise</Link></li>
              <li><Link href="/products/docuguard" className="hover:text-ink-950 transition-colors">DocuGuard</Link></li>
              <li><Link href="/products/queryforge" className="hover:text-ink-950 transition-colors">QueryForge</Link></li>
              <li><Link href="/products/skillforge" className="hover:text-ink-950 transition-colors">SkillForge</Link></li>
              <li><Link href="/products/polyglot" className="hover:text-ink-950 transition-colors">PolyGlot</Link></li>
              <li><Link href="/products/wellpulse" className="hover:text-ink-950 transition-colors">WellPulse</Link></li>
              <li><Link href="/products/feedbackiq" className="hover:text-ink-950 transition-colors">FeedbackIQ</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-ink-950 mb-4">Solutions</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><Link href="/solutions#banking" className="hover:text-ink-950 transition-colors">Banking</Link></li>
              <li><Link href="/solutions#fintech" className="hover:text-ink-950 transition-colors">Fintech</Link></li>
              <li><Link href="/solutions#audit" className="hover:text-ink-950 transition-colors">Audit</Link></li>
              <li><Link href="/solutions#smb" className="hover:text-ink-950 transition-colors">SMB Accounting</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-ink-950 mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><Link href="/about" className="hover:text-ink-950 transition-colors">About</Link></li>
              <li><Link href="/careers" className="hover:text-ink-950 transition-colors">Careers</Link></li>
              <li><Link href="/waitlist" className="hover:text-ink-950 transition-colors">Join Waitlist</Link></li>
              <li><Link href="/security" className="hover:text-ink-950 transition-colors">Security</Link></li>
              <li><Link href="/contact" className="hover:text-ink-950 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-alabaster-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-slate-600 mb-4 md:mb-0">
            © 2026 FiscAI. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link href="/privacy-policy" className="hover:text-ink-950 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-ink-950 transition-colors">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-ink-950 transition-colors">Cookie Policy</Link>
            <Link href="/refund-policy" className="hover:text-ink-950 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
