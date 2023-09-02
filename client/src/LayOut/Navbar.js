import React, { useEffect, useRef, useState } from 'react';
import "./LayoutCss/navbar.css"
import { FaBars } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import { links} from '../data/navbarData';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  const loginLink = links.find(link => link.text === 'Login');
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
          {
  location.pathname === '/register' ? (
    <li key={loginLink.id}>
      <Link to={loginLink.url} className='last-link'>
        {loginLink.text}
      </Link>
    </li>
  ) : (
    links.map((singleLink, index) => (
      <li key={singleLink.id}>
        <Link to={singleLink.url} className={index === links.length - 1 ? 'last-link' : ''}>
          {singleLink.text}
        </Link>
      </li>
    ))
  )
}
</ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
