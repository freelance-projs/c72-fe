import NavLink from "./navbar/NavLinks";

function LeftSidebar() {
  return (
    <section className="sticky left-0 top-0 pt-24 p-3 h-screen min-w-64 max-sm:hidden shadow-lg">
      <div className="flex flex-1 flex-col gap-6">
        <NavLink />
      </div>
    </section>
  )
}

export default LeftSidebar;
