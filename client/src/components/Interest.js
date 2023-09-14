import React from "react";
import { BsBoxSeam, BsFillChatFill } from "react-icons/bs";
import { Link, Outlet } from "react-router-dom";
import "../pages/pagesCss/propsals.css"
const Interest = () => {
  return (
    <div>
      <div className="propsals-head">
        <h1>Interest</h1>
      <div className="porpsals-links">
        <Link to="/propsals/interest/to-inform" className="porpsals-link-item"><BsFillChatFill/> To inform</Link>
        <Link to="/propsals/interest/archive" className="porpsals-link-item"><BsBoxSeam/> Archive</Link>
      </div>
      </div>
      
      <Outlet/>
    </div>
  );
};

export default Interest;
