import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import NavLink from "./NavLinks"

function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <MenuIcon size={24} className="cursor-pointer" />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <div className="flex flex-col h-[calc(100vh-80px)] overflow-y-auto">
          <NavLink isMobile={true} />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNavigation
