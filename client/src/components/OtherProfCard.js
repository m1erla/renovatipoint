import React from 'react';
import { Link } from 'react-router-dom';

const OtherProfCard = ({text}) => {
  return (
    <Link to="" className="other-card">
      <p>{text}</p>
    </Link>
  );
};

export default OtherProfCard;

