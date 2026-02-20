import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { VoiceChatbot } from "@/components/voice-chatbot";
import Home from "@/pages/home";
import TaxCounsel from "@/pages/products/tax-counsel";
import QueryArchitect from "@/pages/products/query-architect";
import FactoringGuardian from "@/pages/products/factoring-guardian";
import SkillArcade from "@/pages/products/skillarcade";
import OmniServe from "@/pages/products/omniserve";
import Rhalia from "@/pages/products/rhalia";
import SatisfAI from "@/pages/products/satisfai";
import Solutions from "@/pages/solutions";
import Security from "@/pages/security";
import Pricing from "@/pages/pricing";
import Contact from "@/pages/contact";
import Newsletter from "@/pages/newsletter";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import CookiePolicy from "@/pages/cookie-policy";
import RefundPolicy from "@/pages/refund-policy";
import DedicatedSupport from "@/pages/dedicated-support";
import CustomTraining from "@/pages/custom-training";
import OnSiteDeployment from "@/pages/on-site-deployment";
import About from "@/pages/about";
import Careers from "@/pages/careers";
import Waitlist from "@/pages/waitlist";
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
        <Route path="/products/tax-counsel" component={TaxCounsel} />
        <Route path="/products/query-architect" component={QueryArchitect} />
        <Route path="/products/factoring-guardian" component={FactoringGuardian} />
        <Route path="/products/skillarcade" component={SkillArcade} />
        <Route path="/products/omniserve" component={OmniServe} />
        <Route path="/products/rhalia" component={Rhalia} />
        <Route path="/products/satisfai" component={SatisfAI} />
        <Route path="/solutions" component={Solutions} />
        <Route path="/security" component={Security} />
        <Route path="/pricing" component={Pricing} />
        <Route path="/contact" component={Contact} />
        <Route path="/newsletter" component={Newsletter} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/cookie-policy" component={CookiePolicy} />
        <Route path="/refund-policy" component={RefundPolicy} />
        <Route path="/dedicated-support" component={DedicatedSupport} />
        <Route path="/custom-training" component={CustomTraining} />
        <Route path="/on-site-deployment" component={OnSiteDeployment} />
        <Route path="/about" component={About} />
        <Route path="/careers" component={Careers} />
        <Route path="/waitlist" component={Waitlist} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-alabaster-50">
          <Toaster />
          <Router />
          <VoiceChatbot />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
