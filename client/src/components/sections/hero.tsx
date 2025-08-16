import { Link } from "wouter";

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-8">
            <span className="text-ink-950">Smarter finance,</span><br />
            <span className="bg-gradient-to-r from-champagne-200 to-champagne-300 bg-clip-text text-transparent">faster decisions</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-700 mb-12 leading-relaxed">
            Enterprise AI suite delivering seven specialized tools for tax advisory, fraud detection, and financial intelligence. Trusted by banks, fintechs, and accounting firms worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <button className="bg-ink-950 text-alabaster-50 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-ink-900 transition-all duration-200 transform hover:scale-105">
                Start Free Trial
              </button>
            </Link>
            <button className="gradient-border bg-alabaster-50 text-ink-950 px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-alabaster-100 transition-all duration-200">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
