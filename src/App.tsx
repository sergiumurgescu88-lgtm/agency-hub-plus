import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import BusinessPlan from "./pages/BusinessPlan";
import Proprietati from "./pages/Proprietati";
import Clienti from "./pages/Clienti";
import Pipeline from "./pages/Pipeline";
import Matching from "./pages/Matching";
import Portale from "./pages/Portale";
import SiteAgentie from "./pages/SiteAgentie";
import Campanii from "./pages/Campanii";
import Contracte from "./pages/Contracte";
import Vizionari from "./pages/Vizionari";
import Comisioane from "./pages/Comisioane";
import Analytics from "./pages/Analytics";
import MLS from "./pages/MLS";
import Setari from "./pages/Setari";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/business-plan" element={<BusinessPlan />} />
          <Route path="/proprietati" element={<Proprietati />} />
          <Route path="/clienti" element={<Clienti />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/portale" element={<Portale />} />
          <Route path="/site" element={<SiteAgentie />} />
          <Route path="/campanii" element={<Campanii />} />
          <Route path="/contracte" element={<Contracte />} />
          <Route path="/vizionari" element={<Vizionari />} />
          <Route path="/comisioane" element={<Comisioane />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/mls" element={<MLS />} />
          <Route path="/setari" element={<Setari />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
