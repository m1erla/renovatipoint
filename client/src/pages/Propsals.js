import React from "react";
import {Outlet} from "react-router-dom";
import "./pagesCss/propsals.css"

const Propsals = () => {
  return (
    <div className="container propsals">
      <Outlet />
    </div>
  );
};

export default Propsals;
