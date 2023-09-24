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
        <h2>Ne iş yapıyorsun?</h2>
        <p>
          Doğrulanmış ve derecelendirilmiş hizmetlere bağlanmak için ihtiyacınız olan hizmeti bulun
          yakınınızdaki profesyoneller.
        </p>
        <Search />
        </div>
        <div className="applyjob-section">
          <div className="cards">
           <ApplyjobCard 
           icon={<RxPencil2 />}
           text="Doğrulanmış ve derecelendirilmiş hizmetlere bağlanmak için ihtiyacınız olan hizmeti bulun
           yakınınızdaki profesyoneller."
           /> 
           <ApplyjobCard 
           icon={<BsFillPeopleFill />}
           text="51.360'tan fazla bağlantılı profesyonel"
           /> 
           <ApplyjobCard 
           icon={<BiSolidLike />}
           text="540.308'den fazla doğrulanmış yorum"
           /> 
          </div>
        </div>

      </div>
    </div>
  );
};

export default ApplyJob;
