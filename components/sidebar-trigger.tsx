"use client";

import { useSidebar } from "@/components/ui/sidebar";
import UseAnimations from "react-useanimations";
import menu2 from "react-useanimations/lib/menu2";

export function SidebarTriggerX() {
  //
  const { toggleSidebar } = useSidebar();
  //
  return (
    <>
      <button
        className="border-primary/80 bg-primary/80 !pointer-events-auto fixed top-3 left-4 !z-[100] inline h-10 w-10 rounded-xl border-2 md:top-5 md:left-6 md:hidden"
        onClick={toggleSidebar}
      >
        <UseAnimations
          animation={menu2}
          size={24}
          strokeColor="#fcfcfc"
          wrapperStyle={{ width: "100%", height: "100%" }}
        />
      </button>
    </>
  );
}
