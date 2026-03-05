import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import Hero from "@/components/sections/hero";
import ProductsShowcase from "@/components/sections/products-showcase"; import { useEffect } from "react";
import { useLocation, Link } from "wouter";

export default function Home() {
  const [location] = useLocation();

  // Handle hash navigation on mount and hash change
  useEffect(() => {
    const handleHashScroll = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };

    // Handle initial hash
    handleHashScroll();

    // Handle hash changes
    window.addEventListener('hashchange', handleHashScroll);
    return () => window.removeEventListener('hashchange', handleHashScroll);
  }, [location]);

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <ProductsShowcase />

        <section className="py-24 px-6 lg:px-8 bg-ink-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-alabaster-50 mb-6">
              Ready to Transform Your Financial Operations?
            </h2>
            <p className="text-xl text-alabaster-200 mb-12">
              Join leading financial institutions already using FiscAI to make smarter decisions faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pricing" className="bg-alabaster-50 text-ink-950 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-alabaster-100 transition-all duration-200 transform hover:scale-105">
                View Pricing
              </Link>
              <Link href="/contact" className="border-2 border-alabaster-50 text-alabaster-50 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-alabaster-50 hover:text-ink-950 transition-all duration-200">
                Schedule Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
