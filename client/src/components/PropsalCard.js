import React from "react";
import "../pages/pagesCss/propsals.css";
import { Link } from "react-router-dom";
const PropsalCard = ({icon,h2,p}) => {
  return (
    <div className="propsals-card">
        <span>{icon}</span>
        <h2>{h2}</h2>
        <p>{p}</p>
        <Link className="propsal-button">View new assignments</Link>
    </div>
  );
};

export default PropsalCard;
