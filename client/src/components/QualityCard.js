import React from "react";
import "./componentCss/qualityreq.css";
const QualityCard = ({ icon, h3, p, lists }) => {
  return (
    <div className="quailtCard">
      <span className="icon">{icon}</span>
      <div className="quailtCard-content">
        <h3>{h3}</h3>
        <ol className="quailtCard-list">
          {lists.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
        <p>{p}</p>
      </div>
    </div>
  );
};

export default QualityCard;
