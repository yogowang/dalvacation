import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import {
  faXmark,
  faBarsStaggered,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  // const [dropDownMenu, setDropDownMenu] = useState(false);
  // const navigate = useNavigate();
  let Links = [
    {
      name: "ROOMS",
      link: "/event-list",
    }
  ];

  let [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed left-0 top-0 z-10 w-full">
        <div className="items-center justify-between bg-[#006d77] px-7 py-4 md:flex md:px-10 text-white">
          {/* logo section */}
          <Link
            to={"/"}
            className="flex cursor-pointer items-center gap-1 text-2xl font-bold"
          >
            <span>DalVacationHome</span>
          </Link>

          <div
            onClick={() => setOpen(!open)}
            className="absolute right-8 top-6 h-7 w-7 cursor-pointer md:hidden"
          >
            {open ? (
              <FontAwesomeIcon icon={faXmark} />
            ) : (
              <FontAwesomeIcon icon={faBarsStaggered} />
            )}
          </div>
          <ul
            className={`absolute left-0 z-[-1] w-full bg-[#006d77] text-white pb-12 pl-9 transition-all duration-500 ease-in md:static md:z-auto md:flex md:w-auto md:items-center md:pb-0 md:pl-0 ${open ? "top-12" : "top-[-490px]"
              }`}
          >
            {Links.map((link) => (
              <li className="my-7 font-semibold md:my-0 md:ml-8">
                <a
                  href={link.link}
                  className="text-white duration-500 hover:text-orange-400"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;
