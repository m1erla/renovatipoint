import React from "react";
import "./componentCss/homecomments.css";
const HomeCommentsCard = ({ img, text, customerText, comment }) => {
  return (
    <div className="homecomments-card">
      <div className="card-top">
        <img alt="img" className="image" src={img} />
        <p>{text}</p>
      </div>
      <div className="rating">
        <input value="5" name="rating" id="star5" type="radio" />
        <label htmlFor="star5"></label>
        <input value="4" name="rating" id="star4" type="radio" />
        <label htmlFor="star4"></label>
        <input value="3" name="rating" id="star3" type="radio" />
        <label htmlFor="star3"></label>
        <input value="2" name="rating" id="star2" type="radio" />
        <label htmlFor="star2"></label>
        <input value="1" name="rating" id="star1" type="radio" />
        <label htmlFor="star1"></label>
      </div>
        <div className="card-bot">
            <p className="customer">This work was done by {customerText}</p>
            <p>{comment}</p>
        </div>
    
    </div>
  );
};

export default HomeCommentsCard;
