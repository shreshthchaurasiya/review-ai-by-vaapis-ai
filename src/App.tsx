import { Switch, Route, Redirect } from "wouter";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import { ReviewaiLanding } from "@/pages/ReviewaiLanding";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import BusinessPage from "@/pages/BusinessPage";
import FeedbackPage from "@/pages/FeedbackPage";
import CustomerReview from "@/pages/CustomerReview";
import PlansPage from "@/pages/PlansPage";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFC]">
        <Loader2 className="animate-spin text-[#6D28D9]" size={28} />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={ReviewaiLanding} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/business">
        {() => <ProtectedRoute component={BusinessPage} />}
      </Route>
      <Route path="/feedback">
        {() => <ProtectedRoute component={FeedbackPage} />}
      </Route>
      <Route path="/settings">
        {() => <ProtectedRoute component={BusinessPage} />}
      </Route>
      <Route path="/plans">
        {() => <ProtectedRoute component={PlansPage} />}
      </Route>
      <Route path="/r/:slug" component={CustomerReview} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Router />
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
