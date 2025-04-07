"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  Settings,
  Shirt,
  Tag,
  User,
  WashingMachine,
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
      name: "Giao diện quản lý",
      logo: GalleryVerticalEnd,
      plan: "Application",
    },
  ],
  navMain: [
    {
      title: "Quản lý thẻ",
      url: "#",
      icon: Tag,
      items: [
        {
          title: "Danh sách thẻ",
          url: "/",
        },
        {
          title: "Quản lý tên thẻ",
          url: "/tag-names",
        },
      ],
    },
    {
      title: "Quản lý giao dịch",
      url: "#",
      icon: User,
      items: [
        {
          title: "Phòng ban mượn đồ",
          url: "/lending",
        },
        {
          title: "Công ty giặt đồ",
          url: "/washing",
        },
      ],
    },
    {
      title: "Phòng ban & công ty",
      url: "#",
      icon: User,
      items: [
        {
          title: "Danh sách phòng ban",
          url: "/departments",
        },
        {
          title: "Danh sách công ty giặt",
          url: "/companies",
        },
      ],
    },
    {
      title: "Cài đặt",
      url: "#",
      icon: Settings,
      items: [
        {
          title: "Cài đặt hệ thống",
          url: "/settings",
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
