import React from 'react';

const AssignmentsCard = ({ icon, text , subtext }) => {
  return (
    <div className="assignments-card">
      <img alt='icon' src={icon}/>
      <h4>{text}</h4>
      <p>{subtext}</p>
    </div>
  );
};

export default AssignmentsCard;

