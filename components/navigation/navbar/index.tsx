import Link from "next/link"
import MobileNavigation from "./MobileNavigation"

function Navbar() {
  return (
    <nav className="fixed z-50 w-full p-6 flex justify-between bg-white shadow">
      <Link href="/">
        <p className="font-bold text-2xl max-sm:hidden">
          Dev<span className="text-orange-500">Flow</span>
        </p>
      </Link>
      <div>
        <MobileNavigation />
      </div>
    </nav>
  )

}

export default Navbar
