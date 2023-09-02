import React from 'react';

const HomeSecondSectionCard = ({ icon, text , subtext }) => {
  return (
    <div className="homeSecondSection-card">
      <span>{icon}</span>
      <h4>{text}</h4>
      <p>{subtext}</p>
    </div>
  );
};

export default HomeSecondSectionCard;

