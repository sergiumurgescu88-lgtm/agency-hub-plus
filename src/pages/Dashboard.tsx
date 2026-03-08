import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Topbar } from "@/components/Topbar";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { PropertiesCard } from "@/components/dashboard/PropertiesCard";
import { PortalsCard } from "@/components/dashboard/PortalsCard";
import { CalendarCard } from "@/components/dashboard/CalendarCard";
import { PipelineCard } from "@/components/dashboard/PipelineCard";
import { LeadsCard } from "@/components/dashboard/LeadsCard";
import { MatchingCard } from "@/components/dashboard/MatchingCard";
import { AgentPerformanceCard } from "@/components/dashboard/AgentPerformanceCard";
import { toast } from "@/hooks/use-toast";

const tabs = ["Overview", "Proprietăți", "Pipeline", "Analytics"];

const Index = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const navigate = useNavigate();

  const handleQuickAction = (label: string) => {
    switch (label) {
      case "Adaugă Proprietate":
        navigate("/proprietati");
        toast({ title: "🏠 Proprietate Nouă", description: "Navighezi la secțiunea Proprietăți." });
        break;
      case "Publică pe Portale":
        navigate("/portale");
        toast({ title: "📤 Publicare", description: "Navighezi la secțiunea Portale Imobiliare." });
        break;
      case "Generează Contract":
        navigate("/contracte");
        toast({ title: "📝 Contract Nou", description: "Navighezi la secțiunea Contracte." });
        break;
      case "Programează Vizionare":
        navigate("/vizionari");
        toast({ title: "📅 Vizionare Nouă", description: "Navighezi la secțiunea Vizionări." });
        break;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "Proprietăți":
        navigate("/proprietati");
        break;
      case "Pipeline":
        navigate("/pipeline");
        break;
      case "Analytics":
        navigate("/analytics");
        break;
    }
  };

  const handleMatchAlert = () => {
    navigate("/matching");
    toast({ title: "🤖 Matching AI", description: "Navighezi la match-urile identificate." });
  };

  return (
    <DashboardLayout>
      <Topbar />
      <div className="p-4 md:p-7 flex-1">
        {/* Alert Strip */}
        <div className="bg-gold-dim border border-gold/20 rounded-xl p-3 px-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3.5 animate-fade-up">
          <span className="text-lg">🤖</span>
          <p className="text-[13px] text-dim flex-1">
            <strong className="text-gold">12 match-uri noi</strong> identificate de AI între cererile active și proprietățile din portofoliu. Potențial comision total: <strong className="text-gold">38.400€</strong>
          </p>
          <button
            onClick={handleMatchAlert}
            className="text-xs font-semibold text-gold bg-transparent border border-gold rounded-md px-3 py-[5px] cursor-pointer hover:bg-gold-dim transition-colors whitespace-nowrap"
          >
            Vezi match-urile →
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5 animate-fade-up">
          {[
            { icon: "🏠", label: "Adaugă Proprietate" },
            { icon: "📤", label: "Publică pe Portale" },
            { icon: "📝", label: "Generează Contract" },
            { icon: "📅", label: "Programează Vizionare" },
          ].map((qa) => (
            <div
              key={qa.label}
              onClick={() => handleQuickAction(qa.label)}
              className="bg-surface border border-subtle rounded-xl p-3 sm:p-3.5 flex flex-col items-center gap-2 cursor-pointer hover:border-gold hover:bg-gold-dim transition-all"
            >
              <span className="text-[20px] sm:text-[22px]">{qa.icon}</span>
              <span className="text-[11px] sm:text-xs text-dim font-medium text-center">{qa.label}</span>
            </div>
          ))}
        </div>

        {/* KPIs */}
        <KpiGrid />

        {/* Tabs */}
        <div className="flex gap-1 mb-3.5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-3 md:px-4 py-[7px] rounded-[7px] text-[12px] md:text-[13px] font-medium cursor-pointer transition-all border-none whitespace-nowrap ${
                activeTab === tab
                  ? "bg-gold-dim text-gold"
                  : "text-dim2 hover:text-dim bg-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Row 1: Properties + Right column */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-3.5 mb-3.5 animate-fade-up-delay-1">
          <PropertiesCard />
          <div className="flex flex-col gap-3.5">
            <PortalsCard />
            <CalendarCard />
          </div>
        </div>

        {/* Row 2: Pipeline */}
        <PipelineCard />

        {/* Row 3: Leads + Matching + Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 animate-fade-up-delay-2">
          <LeadsCard />
          <MatchingCard />
          <AgentPerformanceCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
