import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import TaxCounsel from "@/pages/products/tax-counsel";
import QueryArchitect from "@/pages/products/query-architect";
import FactoringGuardian from "@/pages/products/factoring-guardian";
import Solutions from "@/pages/solutions";
import Security from "@/pages/security";
import Pricing from "@/pages/pricing";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products/tax-counsel" component={TaxCounsel} />
      <Route path="/products/query-architect" component={QueryArchitect} />
      <Route path="/products/factoring-guardian" component={FactoringGuardian} />
      <Route path="/solutions" component={Solutions} />
      <Route path="/security" component={Security} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-alabaster-50">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
