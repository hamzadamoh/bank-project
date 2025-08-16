import { GlassCard } from "@/components/ui/glass-card";

export default function Testimonials() {
  const testimonials = [
    {
      quote: "FiscAI Tax Counsel has transformed our advisory practice. Multi-jurisdiction support and citation accuracy are exceptional.",
      author: "Sarah Benali",
      role: "Partner, KPMG Morocco",
      rating: 5
    },
    {
      quote: "Factoring Guardian caught fraudulent invoices our manual process missed. ROI was immediate.",
      author: "Ahmed Tazi",
      role: "Risk Director, Al Barid Bank",
      rating: 5
    },
    {
      quote: "Query Architect democratized data access across our organization. Non-technical teams now run complex analyses.",
      author: "Marie Dubois",
      role: "CFO, Société Générale Maroc",
      rating: 5
    }
  ];

  return (
    <section className="py-24 px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-ink-950 mb-6">
            Trusted by Finance Leaders
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <GlassCard key={index} className="p-8">
              <div className="mb-6">
                <div className="flex text-champagne-200 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <p className="text-slate-700 italic">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-champagne-200 rounded-full"></div>
                <div>
                  <div className="font-semibold text-ink-950">{testimonial.author}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
