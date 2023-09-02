import React from 'react';

const ApplyjobCard = ({ icon, text }) => {
  return (
    <div className="homeSecondSection-card">
      <span>{icon}</span>
      <h4>{text}</h4>
    </div>
  );
};

export default ApplyjobCard;

