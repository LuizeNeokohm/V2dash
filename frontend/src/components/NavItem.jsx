import React from "react"
import { Link } from "react-router-dom"

const NavItem = ({ icon, text, to, isOpen }) => {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 cursor-pointer w-full hover:text-blue-400"
    >
      <span
        data-tooltip-id={!isOpen ? "sidebar-tooltip" : undefined}
        data-tooltip-content={!isOpen ? text : undefined}
        className="text-xl"
      >
        {icon}
      </span>
      {isOpen && <div>{text}</div>}
    </Link>
  )
}

export default NavItem
