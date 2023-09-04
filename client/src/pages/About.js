import React from "react";
import "./pagesCss/about.css";
import { bodydata } from "../data/aboutData";
import { Link } from "react-router-dom";
import HomeStats from "../components/HomeStats"
const About = () => {
  return (
    <div className="about">
      <div className="about-head">
        <div className="container">
          <h2>About</h2>
        </div>
      </div>
      <div className="">
        <div className="container">
          <div div className="about-body ">
            {bodydata.map((data) => (
              <div className="about-body-content">
                <h3>{data.hText}</h3>
                <p>{data.pText}</p>
              </div>
            ))}
            <div className="about-body-content">
              <h3>History</h3>
              <p>
                In 2005, Joost Gielen and Sjoerd Eikenaar founded Werkspot out
                of personal frustration; finding a suitable professional is very
                difficult and time consuming. It was an immediate success and
                that meant significant growth. To take the next step in
                development, Werkspot moved to Amsterdam in 2012 under the
                direction of a new management team that included CEO Ronald
                Egas. Werkspot has been part of HomeAdvisor, the world market
                leader in the United States, since 2013. Besides Werkspot,
                HomeAdvisor also has leading positions in the UK
                <Link to="https://www.mybuilder.com/"> (Mybuilder.com)</Link>,
                France <Link to="https://www.travaux.com/">(Travaux.com)</Link>{" "}
                and Germany
                <Link to="https://www.my-hammer.de/"> (My-Hammer.de)</Link>.
                HomeAdvisor is part of IAC, known for many successful internet
                companies such as{" "}
                <Link to="https://www.match.com/">Match.com</Link>,{" "}
                <Link to="https://www.lexa.nl/">Lexa.nl</Link> ,
                <Link to="https://www.tripadvisor.com/"> Tripadvisor</Link>,
                <Link to="https://vimeo.com/"> Vimeo</Link>, and{" "}
                <Link to="https://tinder.com/">Tinder</Link> . We are the market
                leader in the Netherlands and more than 350,000 job postings are
                posted on the site every year. We have more than 8,500 committed
                professionals to run these businesses. We are number three on
                the market in Italy with 60,000 jobs and more than 11,000
                connected professionals a year.
              </p>
              <h4>Company Details</h4>
              <p>
                Werkspot BV <br/> Herengracht 469-4 <br/> 1017 BS Amsterdam <br/> Chamber of
                Commerce number: 18079951 <br/> VAT number: NL8212.23.665.B01 <br/> IBAN:
                NL24 CHAS 0200 4000 96 <br/> BIC: CHASNL2X
              </p>
            </div>
          </div>
        </div>
        <div>
            <HomeStats />
          </div>
      </div>
    </div>
  );
};

export default About;
