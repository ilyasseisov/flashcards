import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTriggerX } from "./sidebar-trigger";

export default function LeftSidebar() {
  return (
    <>
      <SidebarProvider>
        <aside className="relative">
          <SidebarTriggerX />
          <AppSidebar />
        </aside>
      </SidebarProvider>
    </>
  );
}
