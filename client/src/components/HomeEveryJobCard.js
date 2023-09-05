import React from 'react';
import { Link } from 'react-router-dom';

const HomeEveryJobCard = ({ icon, text , links,to }) => {
  return (
    <div className="homeeveryjob-card">
      <p className='homeeveryjob-card-title'>{icon} {text}</p>
      <ul className='homeeveryjob-links'>
        {links.map((linkObj) => (
          <li key={linkObj.id}>
            <Link onClick={() => window.scrollTo(0, 0)} to={to}>{linkObj.link}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeEveryJobCard;

