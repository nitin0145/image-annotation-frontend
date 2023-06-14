import React, { useEffect, useState } from "react";
import canvaLogo from "../../../assets/img/logo.png";
import { Link, NavLink } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
const HeaderNav = [
  {
    Name: "Home",
    Link: "/",
  },
  {
    Name: "collection",
    Link: "/collection",
  },
];
export const Header = () => {
  const [Open, Setopen] = useState(false);
  const HTMLRoot = document.documentElement.classList;
  useEffect(() => {
    HTMLRoot.toggle("cm_overflow", Open);
  }, [Open, HTMLRoot]);
  return (
    <>
      <header className={`Landing_page_header`}>
        <div className={`Landing_page_header_cover`}>
          <div className="container">
            <div className="Landing_page_header_row">
              <div className="Header_left_side">
                <Link
                  onClick={() => Setopen(false)}
                  title="Go To Home Page"
                  to="/"
                  className="Header_logo"
                >
                  <img  className='header_img' src={canvaLogo} alt="canvaLogo" />
                </Link>
              </div>
              <div className={`Nav_cover ${Open === true ? "active" : ""}`}>
                <nav className="Header_nav">
                  {HeaderNav &&
                    HeaderNav?.map((Data, i) => {
                      return (
                        <NavLink
                          onClick={() => Setopen(false)}
                          to={Data?.Link}
                          title={Data?.Name}
                          key={i}
                          className={`NavLink`}
                        >
                          {Data?.Name}
                        </NavLink>
                      );
                    })}
                </nav>
                <a
                  onClick={() => Setopen(false)}
                  href="/"
                  target="_main"
                  title="Contact Me"
                  className="Larnge_Btn"
                >
                  <FaUserAlt className="icon" />
                  Contact Me
                </a>
              </div>
              <div className="Header_right_block">
                <a
                  href="/"
                  target="_main"
                  title="Contact Me"
                  className="Larnge_Btn"
                >
                  <FaUserAlt className="icon" />
                  Contact Me
                </a>
                <div
                  onClick={() => Setopen(!Open)}
                  className={`hamburger ${Open === true ? "active" : ""}`}
                >
                  <div className="line  line1"></div>
                  <div className="line  line2"></div>
                  <div className="line  line3"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
