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
              <li><Link href="/products/tax-counsel"><a className="hover:text-ink-950 transition-colors">Tax Counsel</a></Link></li>
              <li><Link href="/products/factoring-guardian"><a className="hover:text-ink-950 transition-colors">Factoring Guardian</a></Link></li>
              <li><Link href="/products/query-architect"><a className="hover:text-ink-950 transition-colors">Query Architect</a></Link></li>
              <li><a href="#" className="hover:text-ink-950 transition-colors">SkillArcade</a></li>
              <li><a href="#" className="hover:text-ink-950 transition-colors">OmniServe</a></li>
              <li><a href="#" className="hover:text-ink-950 transition-colors">Rhalia</a></li>
              <li><a href="#" className="hover:text-ink-950 transition-colors">SatisfAI</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-ink-950 mb-4">Solutions</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><Link href="/solutions#banking"><a className="hover:text-ink-950 transition-colors">Banking</a></Link></li>
              <li><Link href="/solutions#fintech"><a className="hover:text-ink-950 transition-colors">Fintech</a></Link></li>
              <li><Link href="/solutions#audit"><a className="hover:text-ink-950 transition-colors">Audit</a></Link></li>
              <li><Link href="/solutions#smb"><a className="hover:text-ink-950 transition-colors">SMB Accounting</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-ink-950 mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              <li><Link href="/about"><a className="hover:text-ink-950 transition-colors">About</a></Link></li>
              <li><Link href="/careers"><a className="hover:text-ink-950 transition-colors">Careers</a></Link></li>
              <li><Link href="/security"><a className="hover:text-ink-950 transition-colors">Security</a></Link></li>
              <li><Link href="/contact"><a className="hover:text-ink-950 transition-colors">Contact</a></Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-alabaster-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-slate-600 mb-4 md:mb-0">
            © 2024 FiscAI. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-slate-600">
            <Link href="/privacy-policy"><a className="hover:text-ink-950 transition-colors">Privacy Policy</a></Link>
            <Link href="/terms-of-service"><a className="hover:text-ink-950 transition-colors">Terms of Service</a></Link>
            <Link href="/cookie-policy"><a className="hover:text-ink-950 transition-colors">Cookie Policy</a></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
