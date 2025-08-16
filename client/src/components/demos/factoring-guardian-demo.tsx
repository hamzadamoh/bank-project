import { Badge } from "@/components/ui/badge";

export default function FactoringGuardianDemo() {
  const analyses = [
    {
      title: "Document Analysis",
      status: "validated",
      statusColor: "bg-emerald-400",
      details: "Invoice #INV-2024-001 • €125,450"
    },
    {
      title: "Anomaly Check", 
      status: "alert",
      statusColor: "bg-amber-400",
      details: "IBAN mismatch detected"
    },
    {
      title: "PO Matching",
      status: "matched",
      statusColor: "bg-emerald-400", 
      details: "98.5% line item accuracy"
    }
  ];

  return (
    <div className="space-y-4">
      {analyses.map((analysis, index) => (
        <div key={index} className="bg-white rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{analysis.title}</span>
            <Badge className={`${analysis.statusColor} text-ink-950 text-xs font-semibold`}>
              {analysis.status.toUpperCase()}
            </Badge>
          </div>
          <div className="text-xs text-slate-600">
            {analysis.details}
          </div>
        </div>
      ))}
    </div>
  );
}
