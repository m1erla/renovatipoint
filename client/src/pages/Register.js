import React, { useState } from "react";
import { registerOptionData } from "../data/registerOptionData";
import { Link } from "react-router-dom";
import "./pagesCss/register.css";
import AssignmentsCard from "../components/AssignmentsCard";
import OtherProfCard from "../components/OtherProfCard";

const Register = () => {
  const [formData, setFormData] = useState({
    selectedOption: "",
    postCode: "",
    email: "",
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Verileri backend'e gönderme
    fetch("backend_api_url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Backend'den gelen cevap:", data);
        // Gerekirse cevaba göre işlemler yapabilirsiniz
      })
      .catch((error) => {
        console.error("Hata:", error);
      });
  };

  return (
    <div className="register">
      <div className="container">
        <div className="register-hero">
          <div className="contentSide">
            <img
              className="contentSideImage"
              alt="enginner"
              src="https://images.pexels.com/photos/5408715/pexels-photo-5408715.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            />
          </div>
          <div className="formSide">
            {" "}
            <form className="registerForm" onSubmit={handleFormSubmit}>
              <h2>Are you looking for a job ?</h2>
              <p>
                Er worden klussen gezocht in alle vakgebieden, door heel
                Nederland. Vertel ons waar je wilt werken en we helpen je bij
                het vinden van klussen die overeenkomen met wat je zoekt.
              </p>
              <div className="select">
                <select
                  id="cars"
                  value={formData.selectedOption}
                  onChange={(e) =>
                    setFormData({ ...formData, selectedOption: e.target.value })
                  }
                >
                  {registerOptionData.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.text}
                    </option>
                  ))}
                </select>
              </div>
              <input
                type="text"
                placeholder="Post Code"
                value={formData.postCode}
                onChange={(e) =>
                  setFormData({ ...formData, postCode: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email Adress"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <button type="submit" className="registerBtn">
                sign up for free
              </button>
              <div>
                <span>
                  <Link to="/">Terms and conditions</Link> and{" "}
                  <Link to="/">privacy policy.</Link>{" "}
                </span>
              </div>
            </form>
          </div>
        </div>
        <div className="assignments ">
          <h2 className="assignments-title">Find assignments in 3 steps</h2>
          <div className="cards">
            <AssignmentsCard
              icon="https://cdn.pixabay.com/photo/2017/11/25/16/36/traveling-2977176_1280.jpg"
              text="Choose your tasks yourself"
              subtext="Respond to assignments that interest you with no registration or subscription fees"
            />
            <AssignmentsCard
              icon="https://cdn.pixabay.com/photo/2018/03/11/06/15/social-media-marketing-3216077_1280.jpg"
              text="Show Your Interest"
              subtext="Show interest in an assignment by sending a free message to consumers"
            />
            <AssignmentsCard
              icon="https://cdn.pixabay.com/photo/2017/11/25/16/36/traveling-2977176_1280.jpg"
              text="Consumer Contact Information"
              subtext="You only pay when the consumer shares their contact information to contact you"
            />
          </div>
        </div>
        <div className="tv-wrapper">
          <h3>Working place: known from TV</h3>
          <div className="tvs">
            <img
              alt="tv-kanal"
              src="https://www.werkspot.nl/assets/nl_NL/images/tv-banner/logo_desktop_npo.png"
            />
            <img
              alt="tv-kanal"
              src="https://www.werkspot.nl/assets/nl_NL/images/tv-banner/logo_desktop_tl4.png"
            />
            <img
              alt="tv-kanal"
              src="https://www.werkspot.nl/assets/nl_NL/images/tv-banner/logo_desktop_6.png"
            />
          </div>
        </div>
        <>
        <div className="register-find-work-FirstText">
          <h2 className="find-works-desc-title">How do you find new jobs?</h2>
          <p>
            Whether you're just starting out or have been in the business for
            several years: As a DIY company, it's always interesting to win new
            customers. So where do you start finding new customers?
          </p>
          <ol className="find-works-desc-lists">
            <li className="find-works-desc-list-item">
              <b>Use your own network -</b> Never underestimate the power of
              your own network, especially the power of your old customers. They
              are your gateway to new customers. Think about it: Did you
              dismantle the kitchen of one of your regular customers or fix the
              squeaky door? When your customer's friends are looking for a good
              repair company, your name is likely to be mentioned. All you have
              to do for this is to present the mastery to your customers, and
              you pass the rest by word of mouth.
            </li>
            <li className="find-works-desc-list-item">
              <b>Introduce yourself in the neighborhood -</b> You're seeing
              fewer and fewer flyers these days, and some people say the power
              of door-to-door advertising has grown a bit as a result. That's
              why some mechanic companies prefer to put ads on buses. Another
              possibility is to place an ad in a local or regional newspaper.
              While these methods can help your business gain visibility, such
              actions don't always lead to new business opportunities. Also,
              finding customers this way often takes a lot of time (and money).
            </li>
            <li className="find-works-desc-list-item">
              <b>Share your work on social media -</b> Have you installed a
              cabinet, installed a wall unit, or have another job you're proud
              of? Then it is very nice to share these photos on social media.
              This way, your network can see what you're doing, and if you're
              lucky, you can win new business. The problem is that your photos
              are quickly lost in the information flow, and advertising on
              social media can cost a lot of money.
            </li>
          </ol>
        </div>
        <div className="register-find-work-SecondText">
          <h2 className="find-works-desc-title">
            Are you looking for a job? Werkspot has the solution!
          </h2>
          <p>
            Looking for new jobs? So of course it's nice to get in direct
            contact with people who are looking for a good business company. You
            can be sure to find the customers you are looking for at Werkspot.
            You only respond to assignments that interest you, with no
            registration or subscription fees.
          </p>
          <ol className="find-works-desc-lists">
            <li className="find-works-desc-list-item">
              Create your own profile page.
            </li>
            <li className="find-works-desc-list-item">
              Respond to assignments that interest you.
            </li>
            <li className="find-works-desc-list-item">
              Send free messages to consumers to show your interest in a
              business.
            </li>
            <li className="find-works-desc-list-item">
              Pay only when a consumer shares their contact information to
              contact you.
            </li>
          </ol>
        </div>
        <div className="register-find-work-ThirdText">
          <h2 className="find-works-desc-title">
            Advantages of the profile page on Werkspot
          </h2>
          <ol className="find-works-desc-lists">
            <li className="find-works-desc-list-item">
            Direct communication with customers looking for a mechanic.
            </li>
            <li className="find-works-desc-list-item">
            Consumers can use Werkspot for free. As a result, the number of jobs in a mechanic company is greatly increased.
            </li>
            <li className="find-works-desc-list-item">
            Werkspot has a good reputation: consumers trust the professionals on our platform, thanks to reviews and clear communication.
            </li>
            <li className="find-works-desc-list-item">
              Pay only when a consumer shares their contact information to
              contact you.
            </li>
          </ol>
          <p>
            In short, you can easily find new jobs on Werkspot. If the consumer
            shares their data with you, all we ask in return is an amount. We
            also ask our professionals to be transparent, treat customers right,
            and respond seriously to consumer demands on our platform. This is
            how we work together to find more jobs.
          </p>
        </div>

        </>
        <div className="registerOtherProf">
        <h2 className="title">Other Professions</h2>
        <div className="other-cards">
        <OtherProfCard 
        text="
        Contractor"
        />
         <OtherProfCard 
        text="bathroom specialist"
        />
        <OtherProfCard 
        text="Wallpaper Owner"
        />
        </div>
        </div>
       

      </div>
    </div>
  );
};

export default Register;
