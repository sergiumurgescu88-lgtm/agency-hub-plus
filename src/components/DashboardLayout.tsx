import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="ml-[230px] flex-1 flex flex-col min-h-screen">
        {children}
      </main>
    </div>
  );
}
