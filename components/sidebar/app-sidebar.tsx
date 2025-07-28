"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react"; // Added ChevronRight
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Add this import
import ROUTES from "@/constants/routes";

// This is sample data.
const data = {
  navMain: [
    {
      title: "HTML",
      url: "/flashcards/html",
      items: [
        {
          title: "HTML Basics",
          url: "/flashcards/html/html-basics",
        },
        {
          title: "HTML Elements & Tags",
          url: "/flashcards/html/html-elements-&-tags",
        },
        {
          title: "HTML Attributes",
          url: "/flashcards/html/html-attributes",
        },
        {
          title: "HTML Document Structure",
          url: "/flashcards/html/html-document-structure",
        },
        {
          title: "Text Formatting",
          url: "/flashcards/html/text-formatting",
        },
        {
          title: "HTML Forms",
          url: "/flashcards/html/html-forms",
        },
        {
          title: "HTML Media",
          url: "/flashcards/html/html-media",
        },
        {
          title: "HTML Links",
          url: "/flashcards/html/html-links",
        },
        {
          title: "HTML Lists",
          url: "/flashcards/html/html-lists",
        },
        {
          title: "HTML Tables",
          url: "/flashcards/html/html-tables",
        },
        {
          title: "HTML Semantics",
          url: "/flashcards/html/html-semantics",
        },
        {
          title: "HTML APIs",
          url: "/flashcards/html/html-apis",
        },
        {
          title: "HTML Graphics (SVG, Canvas)",
          url: "/flashcards/html/html-graphics-(svg,-canvas)",
        },
        {
          title: "HTML Accessibility",
          url: "/flashcards/html/html-accessibility",
        },
        {
          title: "HTML SEO Basics",
          url: "/flashcards/html/html-seo-basics",
        },
        {
          title: "HTML5 Features",
          url: "/flashcards/html/html5-features",
        },
        {
          title: "HTML & CSS Integration",
          url: "/flashcards/html/html-&-css-integration",
        },
        {
          title: "HTML & JavaScript Integration",
          url: "/flashcards/html/html-&-javascript-integration",
        },
        {
          title: "HTML Validation & Best Practices",
          url: "/flashcards/html/html-validation-&-best-practices",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname(); // Add this hook

  //
  return (
    <>
      <Sidebar variant="floating" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="mt-16 md:mt-0">
              <Link href={ROUTES.APP}>
                <h3 className="ml-2 text-2xl">
                  <span className="font-normal">Dev</span>
                  <span className="text-primary font-extrabold">Cards</span>
                </h3>
              </Link>
            </SidebarMenuItem>
            <Separator />
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-2">
              {data.navMain.map((item) => (
                // Wrap each main item in a Collapsible component
                <Collapsible
                  key={item.title}
                  defaultOpen={false} // You can set this to false if you want them closed by default
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    {/* Use SidebarMenuButton as the CollapsibleTrigger */}
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="mb-2 w-full justify-between text-xl font-extrabold">
                        <Link href={item.url}>{item.title}</Link>
                        {/* Add ChevronRight icon with rotation for visual feedback */}
                        <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                  </SidebarMenuItem>
                  {/* Wrap the sub-items in CollapsibleContent */}
                  {item.items?.length ? (
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-0 gap-2 border-l-0 px-1.5">
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                              className="text-lg"
                            >
                              <Link href={subItem.url}>{subItem.title}</Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  ) : null}
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        {/* SidebarRail was not present in your provided code, so it's removed */}
      </Sidebar>
    </>
  );
}
