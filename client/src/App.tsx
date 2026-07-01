import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { ReviewaiLanding } from "@/pages/ReviewaiLanding";
import MerchantDashboard from "@/pages/MerchantDashboard";
import BusinessSettingsQr from "@/pages/BusinessSettingsQr";
import CustomerRatingView from "@/pages/CustomerRatingView";

function Router() {
  return (
    <Switch>
      {/* Add pages below */}
      <Route path="/" component={ReviewaiLanding} />
      <Route path="/dashboard" component={MerchantDashboard} />
      <Route path="/business" component={BusinessSettingsQr} />
      <Route path="/rate" component={CustomerRatingView} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
