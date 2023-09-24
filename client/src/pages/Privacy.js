import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import "./pagesCss/privacy.css"

const Privacy = () => {
  const location = useLocation();

  return (
    <div className='container'>
        <div className='privacy-links'>
        <Link to="privacy-policy" className={location.pathname === '/privacy/privacy-policy' ? 'active-link' : 'privacy-link'}>Gizlilik Politikası</Link>
        <Link to="cookies" className={location.pathname === '/privacy/cookies' ? 'active-link' : 'privacy-link'}>Çerezler</Link>
        <Link to="terms-conditions" className={location.pathname === '/privacy/terms-conditions' ? 'active-link' : 'privacy-link'}>Şartlar ve koşullar</Link>
        </div>
      
      <Outlet />
    </div>
  );
}

export default Privacy;
