import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Services from "./pages/Services";
import Packages from "./pages/Packages";
import AgentDashboard from "./pages/AgentDashboard";
import CreateContract from "./pages/CreateContract";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/packages" element={<Packages />} />
          
          {/* Agent Routes */}
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/agent/create-contract" element={<CreateContract />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
