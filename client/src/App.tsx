import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import BlacklistGenerator from "@/pages/blacklist-generator";
import IncidentsPage from "@/pages/incidents";
import IncidentDetail from "@/pages/incident-detail";
import Navigation from "@/components/navigation";

function Router() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-16">
        <Switch>
          <Route path="/" component={BlacklistGenerator} />
          <Route path="/incidents" component={IncidentsPage} />
          <Route path="/incidents/:id" component={IncidentDetail} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
