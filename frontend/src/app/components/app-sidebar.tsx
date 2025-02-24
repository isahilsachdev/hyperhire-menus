"use client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { twMerge } from "tailwind-merge";

// Menu items.
const items = [
  {
    title: "System Code",
    url: "#",
    isActive: false,
  },
  {
    title: "Properties",
    url: "#",
    isActive: false,
  },
  {
    title: "Menus",
    url: "#",
    isActive: true,
  },
  {
    title: "API List",
    url: "#",
    isActive: false,
  },
];

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  return (
    <Sidebar className="bg-[#101828] text-[#667085] text-md font-bold">
      <SidebarHeader>
        <div className="flex p-4 justify-between space-x-2">
          <Image src={"/logo.svg"} width={70} height={21} alt="Logo" />
          <Image onClick={toggleSidebar} src={"/close.svg"} width={20} height={20} alt="Close" />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup className="bg-[#1D2939] rounded-lg">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Image
                      src={"/folder.svg"}
                      width={24}
                      height={24}
                      alt="Logo"
                    />
                    <span>Systems</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={twMerge(
                      item.isActive && "bg-[#9FF443] text-[#101828]", "!h-[48px]"
                    )}
                  >
                    <a href={item.url}>
                      <Image
                        src={item.isActive ? "/menu-active.svg" : "/menu.svg"}
                        width={24}
                        height={18}
                        alt="Logo"
                      />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
