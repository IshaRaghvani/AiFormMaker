"use client";
import {
  AreaChart,
  LibraryBig,
  MessageCircleMore,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
//import { Progress } from "../../../components/ui/progress";

function SideNav() {
  const menuList = [
    {
      id: 1,
      title: "My Forms",
      icon: LibraryBig,
      path: "/dashboard",
    },
    {
      id: 2,
      title: "Responses",
      icon: MessageCircleMore,
      path: "/dashboard/responses",
    },
    {
      id: 3,
      title: "Analytics",
      icon: AreaChart,
      path: "/dashboard/analytics",
    },
    {
      id: 4,
      title: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
    {
      id: 5,
      title: "Upgrade",
      icon: ShieldAlert,
      path: "/dashboard/upgrades",
    },
  ];
  const path = usePathname();

  return (
    <div className="h-screen shadow-r">
      <div className="p-4 pb-9  text-white">
        {menuList.map((menu, index) => (
          <Link href={menu.path}
            key={index}
            className={`flex mb-4 items-center gap-5 p-3 hover:bg-primary hover:text-white rounded-lg cursor-pointer ${
              path === menu.path ? "bg-primary text-white" : ""
            }`}
          >
            <menu.icon />
            {menu.title}
          </Link>
        ))}
      </div>
      <div className="fixed bottom-7 p-3 w-64 ">
        <Button className=" w-full"> Create Form </Button>

        <div className="mt-7">
          <Progress value={33} />
          <h2 className="text-sm mt-2 text-gray-500"><strong>2 </strong>Out of <strong>5 </strong>Files Created</h2>
          <h2 className="text-sm mt-3 text-gray-500">Upgrade your plan for unlimited AI Forms </h2>
        </div>
      </div>
    </div>
  );
}

export default SideNav;
