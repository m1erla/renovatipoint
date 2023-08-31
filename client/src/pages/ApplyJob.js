import React from "react";
import Search from "../components/searchbar/Search";
import ApplyjobCard from "../components/ApplyjobCard";
import {RxPencil2} from "react-icons/rx"
import {BsFillPeopleFill} from "react-icons/bs"
import {BiSolidLike} from "react-icons/bi"
const ApplyJob = () => {
  return (
    <div className="applyjob">
      <div className="container">
        <div className="applyjob-hero">
        <h2>What is your business?</h2>
        <p>
          Find the service you need to connect with verified and rated
          professionals near you.
        </p>
        <Search />
        </div>
        <div className="applyjob-section">
          <div className="cards">
           <ApplyjobCard 
           icon={<RxPencil2 />}
           text="Post your job posting free of charge and without obligation"
           /> 
           <ApplyjobCard 
           icon={<BsFillPeopleFill />}
           text="More than 51,360 connected professionals"
           /> 
           <ApplyjobCard 
           icon={<BiSolidLike />}
           text="More than 540,308 verified reviews"
           /> 
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApplyJob;
