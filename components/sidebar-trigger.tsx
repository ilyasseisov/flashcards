"use client";

import { useSidebar } from "@/components/ui/sidebar";

// This is sample data.

export function SidebarTriggerX() {
  //
  const { toggleSidebar } = useSidebar();
  //
  return (
    <>
      <button
        className="border-primary !pointer-events-auto fixed top-3 left-4 !z-[100] h-10 w-10 rounded-xl border-2 md:top-5 md:left-6"
        onClick={toggleSidebar}
      >
        X
      </button>
    </>
  );
}
