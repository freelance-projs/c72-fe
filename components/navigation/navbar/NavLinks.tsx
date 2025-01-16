"use client"

import { SheetClose } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const sidebarLinks = [
  {
    label: "Quản lý thẻ",
    route: "/",
  },
]

function NavLink({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname()

  return (
    <>
      {sidebarLinks.map((item) => {
        const isActive = pathname.includes(item.route) && item.route.length > 1 || pathname === item.route

        const LinkComponent = (
          <Link href={item.route} key={item.label} className={cn(
            isActive ?
              "rounded-lg bg-primary text-white" :
              "text-gray-500",
            "flex items-center justify-between gap-4 p-3",
          )}>
            <p className="text-lg font-semibold">{item.label}</p>
          </Link>
        )

        return isMobile ? <SheetClose asChild>
          {LinkComponent}
        </SheetClose> : <React.Fragment key={item.route}>
          {LinkComponent}
        </React.Fragment>
      })}
    </>
  )
}

export default NavLink
