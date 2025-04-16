"use client"

import * as React from "react"
import {
  DollarSign,
  GalleryVerticalEnd,
  Settings,
  Sheet,
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
      title: "Thống kê",
      url: "#",
      icon: Sheet,
      items: [
        {
          title: "Phòng ban",
          url: "/statistics/departments",
        },
        {
          title: "Công ty",
          url: "/statistics/companies",
        },
        {
          title: "Thẻ",
          url: "/statistics/tags",
        },
      ],
    },
    {
      title: "Quản lý giao dịch",
      url: "#",
      icon: DollarSign,
      items: [
        {
          title: "Phòng ban",
          url: "/tx-log/department",
        },
        {
          title: "Công ty",
          url: "/tx-log/company",
        },
      ],
    },
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
