import React from 'react';
import { Link } from 'react-router-dom';
import "./componentCss/homeworkside.css"

const HomeWorkCard = ({ img, iconn, to ,  text ,paragraph , link, subtext , subimg, sublink }) => {
  return (
    <div className="homeWork-card">
      <div className='topSide'>
      <img alt='icon' src={img} className='homeWork-card-image'/>       
      <h4 className='homeWork-card-title'> {iconn} {text}</h4>
      <p>{paragraph}</p>
      <Link to={to}>{link}</Link>
      </div>
      <hr />
      <div className='bottomSide'>
        <div className='bottomSideTop'>
        <img alt="icon2" src={subimg} className='homeWork-card-subimage' />
        <p>{subtext}</p>
        </div>
        <Link to={to}>{sublink}</Link>
      </div>
    </div>
  );
};

export default HomeWorkCard;

