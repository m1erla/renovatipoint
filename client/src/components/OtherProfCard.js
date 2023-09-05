import React from 'react';
import { Link } from 'react-router-dom';

const OtherProfCard = ({text}) => {
  return (
    <Link onClick={() => window.scrollTo(0, 0)} to="" className="other-card">
      <p>{text}</p>
    </Link>
  );
};

export default OtherProfCard;

