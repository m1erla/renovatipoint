import React from "react";
import {TbError404} from "react-icons/tb"
import "./componentCss/errorpage.css"
const ErorrPage = () => {
  return(
    <div className="container">
        <div className="error-hero">
        <TbError404 className="error-icon"/>
        <h2>Sorry, something went wrong. Try again.</h2>
        </div>
    
    </div>
  )

};

export default ErorrPage;
