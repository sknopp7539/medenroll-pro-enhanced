import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ProviderProvider } from "./contexts/ProviderContext";

// PAGES (these files already exist per your summary)
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import Payers from "./pages/Payers";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import ReviewQueue from "./pages/ReviewQueue";

// NEW: use the correct layout with the 7-item nav
import DashboardLayout from "@/components/DashboardLayout";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/payers" component={Payers} />
        <Route path="/reviewer-dashboard" component={ReviewerDashboard} />
        <Route path="/review-queue" component={ReviewQueue} />
        <Route path="/reports" component={Reports} />
        <Route path="/settings" component={Settings} />
        <Route path="/users" component={UserManagement} />
        <Route path="/:rest*" component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <ProviderProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ProviderProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
