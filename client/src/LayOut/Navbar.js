import React, { useEffect, useRef, useState } from 'react';
import "./navbar.css"
import { FaBars } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import { links} from '../data/navbarData';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);

  useEffect(() => {
    const linksHeight = linksRef.current?.getBoundingClientRect().height;

    if (isNavOpen) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
    } else {
      linksContainerRef.current.style.height = '0px';
    }
  }, [isNavOpen]);

  return (
    <nav>
      <div className='nav-center'>
        <div className='nav-header'>
          <p>logo</p>
          <button
            className={isNavOpen ? 'nav-toggle cancel-btn' : 'nav-toggle'}
            onClick={() => {
              setIsNavOpen((prev) => !prev);
            }}
          >
            {isNavOpen ? <CgClose /> : <FaBars />}
          </button>
        </div>

        <div
          className={
            isNavOpen ? 'links-container show-container' : 'links-container'
          }
          ref={linksContainerRef}
        >
          <ul className='links' ref={linksRef}>
            {links.map((singleLink) => {
              const { id, url, text } = singleLink;
              return (
                <li key={id}>
                  <Link to={url}>{text}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
