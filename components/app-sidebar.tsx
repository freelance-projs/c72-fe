"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "User name",
    email: "m@example.com",
    avatar: "",
  },
  teams: [
    {
      name: "Tag Scanner Inc",
      logo: GalleryVerticalEnd,
      plan: "Application",
    },
  ],
  navMain: [
    {
      title: "Tag management",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Scan history",
          url: "/scan-histories",
        },
        {
          title: "Set tag name",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
