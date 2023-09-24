import React from "react";
import {TbError404} from "react-icons/tb"
import "./componentCss/errorpage.css"
const ErorrPage = () => {
  return(
    <div className="container">
        <div className="error-hero">
        <TbError404 className="error-icon"/>
        <h2>Üzgünüz, bir şeyler ters gitti. Tekrar deneyin.</h2>
        </div>
    
    </div>
  )

};

export default ErorrPage;
