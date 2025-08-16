export default function TrustIndicators() {
  const partners = [
    "Bank Al-Maghrib",
    "BMCE Group", 
    "Attijariwafa",
    "CFG Bank",
    "Société Générale",
    "Credit Agricole"
  ];

  return (
    <section className="py-16 px-6 lg:px-8 border-t border-alabaster-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-slate-600 font-medium">Trusted by leading financial institutions</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-60">
          {partners.map((partner, index) => (
            <div key={index} className="text-center font-semibold text-slate-500 text-sm">
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
