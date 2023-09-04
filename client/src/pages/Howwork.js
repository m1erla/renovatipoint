import React from "react";
import "./pagesCss/howwork.css";
import {Link} from "react-router-dom"
import { AiOutlineStar } from "react-icons/ai";
import { GrWorkshop } from "react-icons/gr";
import { BsChatDots, BsCurrencyEuro } from "react-icons/bs";
import { TfiWrite } from "react-icons/tfi";
import { TbBrandWechat, TbStars } from "react-icons/tb";
import { GiConfirmed } from "react-icons/gi";
import { FaInfoCircle } from "react-icons/fa";
import { HiOutlineWrenchScrewdriver } from "react-icons/hi2";
const Howwork = () => {
  return (
    <div className="howwork">
      <div className="howwork-hero">
        <div className="container">
          <div className="leftSide">
            <h2>How does Werkspot work?</h2>
            <p>
              <b>Posting a job on Werkspot is quick and easy.</b> Tell us what
              your needs are and we'll introduce you to some qualified
              professionals. They then send you an offer. After comparing, you
              choose the professional that suits you. It's easy, free and with
              no obligation.
            </p>
          </div>
          <div className="rightSide">
            <GrWorkshop />
          </div>
        </div>
      </div>
      <div className="howwork-steps">
        <div className="container">
          <div className="step">
            <div className="howworksteps-icon">
              <TfiWrite />
            </div>
            <div className="howworksteps-contact">
              <h2 className="howworksteps-contact-title">
                Post your job posting
              </h2>
              <p className="howworksteps-contact-paragrahp">
                In a few simple steps, you can post your job posting and reach
                professionals in your area. Any job, big or small, is possible.
                Include as much information as possible so you can get accurate
                quotes.
              </p>
            </div>
          </div>
          <div className="info">
            <FaInfoCircle />
            <div>
              Tip: Take photos with your phone and add them to your description.
            </div>
          </div>
          <div className="step reverse">
            <div className="howworksteps-icon">
              <TbBrandWechat />
            </div>
            <div className="howworksteps-contact">
              <h2 className="howworksteps-contact-title">Receive proposals</h2>
              <p className="howworksteps-contact-paragrahp">
                After you have posted your job, we will forward your request to
                qualified professionals. Wait patiently until you receive
                proposals via email.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="howworksteps-icon">
              <GiConfirmed />
            </div>
            <div className="howworksteps-contact">
              <h2 className="howworksteps-contact-title">
                Choose the professional that meets your needs
              </h2>
              <p className="howworksteps-contact-paragrahp">
                If you have found a professional who meets your expectations,
                you can contact him via email or telephone.
              </p>
            </div>
          </div>
          <div className="howwork-comment">
            <div className="howwork-comment-card">
              <h3 className="howwork-comment-card-title">
                <BsChatDots /> A personal message
              </h3>
              <p>
                Professionals will introduce themselves and explain in their
                proposal why they are suitable for this job.
              </p>
            </div>
            <div className="howwork-comment-card">
              <h3 className="howwork-comment-card-title">
                <BsCurrencyEuro /> <p>Pice indicator</p>
              </h3>
              <p>
                Whenever possible, our craftsmen can provide information about
                the work done, materials, etc. They give a target price based on
                the quantity. In this way, you can easily choose the master that
                fits your budget.
              </p>
            </div>
            <div className="howwork-comment-card">
              <h3 className="howwork-comment-card-title">
                <AiOutlineStar />
                Ratings and reviews
              </h3>
              <p>
                The client can evaluate for each job performed by a
                professional. So you can also base your choice on reviews given
                by others.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="howworksteps-icon">
              <HiOutlineWrenchScrewdriver />
            </div>
            <div className="howworksteps-contact">
              <h2 className="howworksteps-contact-title"> Do the job</h2>
              <p className="howworksteps-contact-paragrahp">
                After you accept the prices, terms and program, the chosen
                professional will carry out the work.
              </p>
            </div>
          </div>
          <div className="step reverse">
            <div className="howworksteps-icon">
              <TbStars />
            </div>
            <div className="howworksteps-contact">
              <h2 className="howworksteps-contact-title">
                Rate your experience
              </h2>
              <p className="howworksteps-contact-paragrahp">
                After completing your work, you can share your experience with
                the professional. Commenting also helps other consumers choose a
                professional.
              </p>
            </div>
          </div>

        <div className="howworrkShareBtn-wrapper">
          <h3>Keep in touch</h3>
          <Link onClick={() => window.scrollTo(0, 0)} to="/apply-for-a-job" className="howworkBtn">post your job posting</Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Howwork;
