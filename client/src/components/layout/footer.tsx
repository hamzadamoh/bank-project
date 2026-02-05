import { Link } from "wouter";

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
              <div className="w-10 h-10 bg-champagne-200 rounded-xl"></div>
              <div className="w-10 h-10 bg-champagne-200 rounded-xl"></div>
              <div className="w-10 h-10 bg-champagne-200 rounded-xl"></div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-ink-950 mb-4">Products</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><Link href="/products/tax-counsel" className="hover:text-ink-950 transition-colors">Tax Counsel</Link></li>
              <li><Link href="/products/factoring-guardian" className="hover:text-ink-950 transition-colors">Factoring Guardian</Link></li>
              <li><Link href="/products/query-architect" className="hover:text-ink-950 transition-colors">Query Architect</Link></li>
              <li><Link href="/products/skillarcade" className="hover:text-ink-950 transition-colors">SkillArcade</Link></li>
              <li><Link href="/products/omniserve" className="hover:text-ink-950 transition-colors">OmniServe</Link></li>
              <li><Link href="/products/rhalia" className="hover:text-ink-950 transition-colors">Rhalia</Link></li>
              <li><Link href="/products/satisfai" className="hover:text-ink-950 transition-colors">SatisfAI</Link></li>
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
              <li><Link href="/security" className="hover:text-ink-950 transition-colors">Security</Link></li>
              <li><Link href="/contact" className="hover:text-ink-950 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-alabaster-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-slate-600 mb-4 md:mb-0">
            © 2024 FiscAI. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link href="/privacy-policy" className="hover:text-ink-950 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-ink-950 transition-colors">Terms of Service</Link>
            <Link href="/cookie-policy" className="hover:text-ink-950 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
