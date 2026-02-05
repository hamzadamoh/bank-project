import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "/#products", label: "Products" },
    { href: "/solutions", label: "Solutions" },
    { href: "/security", label: "Security" },
    { href:"/pricing", label: "Pricing" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'glass-card bg-white/80' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="font-display font-bold text-xl text-ink-950 hover:text-slate-800 transition-colors cursor-pointer">
                FiscAI
              </div>
            </Link>
            <div className="hidden md:flex space-x-6 text-sm font-medium">
              {navLinks.map((link) => {
                // Handle hash links with smooth scroll
                const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  if (link.href.startsWith('/#')) {
                    e.preventDefault();
                    const hash = link.href.replace('/#', '');
                    if (location === '/') {
                      // Already on home page, scroll to section
                      const element = document.getElementById(hash);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    } else {
                      // Navigate to home first, then scroll
                      window.location.href = `/#${hash}`;
                    }
                  }
                };
                
                return (
                  <Link key={link.href} href={link.href}>
                    <a 
                      onClick={handleClick}
                      className="text-slate-700 hover:text-ink-950 transition-colors duration-200 cursor-pointer"
                    >
                      {link.label}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/newsletter">
              <button className="text-sm font-medium text-slate-700 hover:text-ink-950 transition-colors duration-200">
                Newsletter
              </button>
            </Link>
            <Link href="/contact">
              <button className="bg-ink-950 text-alabaster-50 px-4 py-2 rounded-xl text-sm font-medium hover:bg-ink-900 transition-all duration-200 transform hover:scale-105">
                Request Demo
              </button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-ink-950 hover:text-slate-800 transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-alabaster-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => {
                const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                  setIsMobileMenuOpen(false);
                  if (link.href.startsWith('/#')) {
                    e.preventDefault();
                    const hash = link.href.replace('/#', '');
                    if (location === '/') {
                      const element = document.getElementById(hash);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    } else {
                      window.location.href = `/#${hash}`;
                    }
                  }
                };
                
                return (
                  <Link key={link.href} href={link.href}>
                    <a 
                      className="block px-3 py-2 text-slate-700 hover:text-ink-950 transition-colors cursor-pointer"
                      onClick={handleClick}
                    >
                      {link.label}
                    </a>
                  </Link>
                );
              })}
              <div className="border-t border-alabaster-200 pt-4">
                <Link href="/newsletter">
                  <button 
                    className="block w-full text-left px-3 py-2 text-slate-700 hover:text-ink-950 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Newsletter
                  </button>
                </Link>
                <Link href="/contact">
                  <button 
                    className="block w-full mt-2 bg-ink-950 text-alabaster-50 px-3 py-2 rounded-xl text-sm font-medium hover:bg-ink-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Request Demo
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
