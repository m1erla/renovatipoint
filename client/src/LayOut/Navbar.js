import React, { useEffect, useRef, useState } from "react";
import "./LayoutCss/navbar.css";
import { FaBars } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { Loginlinks, accordionMenuLinks, links } from "../data/navbarData";
import { Link, useLocation } from "react-router-dom";
import AccountMenu from "../components/AcorrdionMenu";
import BasicMenu from "../components/AcorrdionMenu";

const Navbar = () => {
  const [isLogin, setIsLogin] = useState(false); //login için bekliyor
  const [menuOpen, setMenuOpen] = useState(false); // toggle deneme
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); //toggle deneme
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  const loginLink = links.find((link) => link.text === "Login");

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth <= 600 && menuOpen) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  useEffect(() => {
    const linksHeight = linksRef.current?.getBoundingClientRect().height;

    if (isNavOpen) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
    } else {
      linksContainerRef.current.style.height = "0px";
    }
  }, [isNavOpen]);
  return (
    <nav>
      <div className="nav-center">
        <div className="nav-header">
          <p>logo</p>
          <button
            className={isNavOpen ? "nav-toggle cancel-btn" : "nav-toggle"}
            onClick={() => {
              setIsNavOpen((prev) => !prev);
            }}
          >
            {isNavOpen ? <CgClose /> : <FaBars />}
          </button>
        </div>

        <div
          className={
            isNavOpen ? "links-container show-container" : "links-container"
          }
          ref={linksContainerRef}
        >
          <ul className="links" ref={linksRef}>
            {location.pathname === "/register" ? (
              <li key={loginLink.id}>
                <Link to={loginLink.url} className="last-link">
                  {loginLink.text}
                </Link>
              </li>
            ) : !isLogin === true ? (
              links.map((singleLink, index) => (
                <li key={singleLink.id}>
                  <Link
                    to={singleLink.url}
                    className={index === links.length - 1 ? "last-link" : ""}
                  >
                    {singleLink.text}
                  </Link>
                </li>
              ))
            ) : (
              Loginlinks.map((singleLink, index) => (
                <li key={singleLink.id}>
                  <Link
                    to={singleLink.url}
                    className={index === links.length - 1 ? "last-link" : ""}
                  >
                    {singleLink.text}
                  </Link>
                </li>
              ))
            )}
            <>
              {windowWidth > 1024 ? (
                <>
                  {
                    isLogin === true ? (
                      <li className="toggle-list-item">
                    <AccountMenu />
                  </li>):
                    (null)
                  }
                </>
              ) : (
                <>
                  <ul>
                    {accordionMenuLinks.map((data) => (
                      <li key={data.id}>
                        <Link to={data.ulr}>{data.text}</Link>
                      </li>
                    ))}
                    <li>
                      <Link>log out</Link>
                    </li>
                  </ul>
                </>
              )}
            </>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
