"use client";
import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Slash } from "lucide-react";

function BreadcumbComponent() {
  const { toggleSidebar } = useSidebar();
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <div className="flex items-center space-x-2 p-2">
            <Button size="icon" variant="ghost" onClick={toggleSidebar}>
              <Image src={"/folder.svg"} width={20} height={18} alt="Logo" />
            </Button>
          </div>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <Slash />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/components">Menus</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcumbComponent;
