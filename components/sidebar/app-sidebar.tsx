"use client";

import * as React from "react";
// ui
import { ChevronRight } from "lucide-react";
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
// next
import Link from "next/link";
import { usePathname } from "next/navigation";
// constants
import ROUTES from "@/constants/routes";
// data fetching
import { getNavCategoriesAndSubcategories } from "@/lib/actions/navigation"; // Import the server action

// Define the structure of the data fetched from the server action
interface NavSubItem {
  title: string;
  slug: string;
  url: string;
  // Add subcategoryId for progress lookup
  subcategoryId: string;
}

interface NavMainItem {
  title: string;
  slug: string;
  url: string;
  items: NavSubItem[];
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [navData, setNavData] = React.useState<NavMainItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchNav = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const nav = await getNavCategoriesAndSubcategories();
        setNavData(nav);
      } catch (err: unknown) {
        console.error("Failed to fetch navigation data:", err as Error);
        setError("Failed to load navigation. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNav();
  }, []);

  // Helper to get subcategoryId from navData (since navData doesn't have subcategoryId, we need to add it in the server action in the future)
  // For now, we will not show icons if subcategoryId is not available

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
              {isLoading ? (
                <p className="text-center text-gray-500">
                  Loading navigation...
                </p>
              ) : error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : navData.length > 0 ? (
                navData.map((item) => (
                  <Collapsible
                    key={item.slug}
                    defaultOpen={pathname.startsWith(item.url)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="mb-2 w-full justify-between text-xl font-extrabold">
                          <Link href={item.url}>{item.title}</Link>
                          <ChevronRight className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                    </SidebarMenuItem>
                    {item.items?.length ? (
                      <CollapsibleContent>
                        <SidebarMenuSub className="ml-0 gap-2 border-l-0 px-1.5">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.slug}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                                className="flex items-center gap-2 text-lg"
                              >
                                <Link
                                  href={subItem.url}
                                  className="flex items-center gap-2"
                                >
                                  {subItem.title}
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    ) : null}
                  </Collapsible>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No categories found.
                </p>
              )}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </>
  );
}
