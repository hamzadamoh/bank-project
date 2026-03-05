import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { VoiceChatbot } from "@/components/voice-chatbot";
import Home from "@/pages/home";
import TaxWise from "@/pages/products/taxwise";
import QueryForge from "@/pages/products/queryforge";
import FactoringGuardian from "@/pages/products/docuguard";
import SkillForge from "@/pages/products/skillforge";
import PolyGlot from "@/pages/products/polyglot";
import WellPulse from "@/pages/products/wellpulse";
import FeedbackIQ from "@/pages/products/feedbackiq";
import Pricing from "@/pages/pricing";
import Contact from "@/pages/contact";
import Newsletter from "@/pages/newsletter";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import CookiePolicy from "@/pages/cookie-policy";
import RefundPolicy from "@/pages/refund-policy";
import Checkout from "@/pages/checkout";
import Login from "@/pages/login";
import About from "@/pages/about";
import Careers from "@/pages/careers";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

// Component to handle scroll to top on route change
function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Scroll to top when route changes, but only if there's no hash
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/products/taxwise" component={TaxWise} />
        <Route path="/products/queryforge" component={QueryForge} />
        <Route path="/products/docuguard" component={FactoringGuardian} />
        <Route path="/products/skillforge" component={SkillForge} />
        <Route path="/products/polyglot" component={PolyGlot} />
        <Route path="/products/wellpulse" component={WellPulse} />
        <Route path="/products/feedbackiq" component={FeedbackIQ} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/contact" component={Contact} />
        <Route path="/newsletter" component={Newsletter} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/refund-policy" component={RefundPolicy} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/login" component={Login} />
        <Route path="/about" component={About} />
        <Route path="/careers" component={Careers} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

import { AuthProvider } from "./hooks/use-auth";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-alabaster-50">
            <Toaster />
            <Router />
            <VoiceChatbot />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
