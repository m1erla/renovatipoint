import React from "react";
import { personaldata, personaldata2, personaldata3, personaldata4, personaldata5, personaldata6, personaldata7, personaldata8, privacyStateHero } from "../data/privacypolicyData";

const PrivacyPolicy = () => {
  return (
    <div className="container">
      {privacyStateHero.map((stat) => (
        <div className="privacyPolicy-hero">
          <h2>{stat.title}</h2>
          <p>{stat.subText}</p>
          <ol className="privacyPolicy-hero-list">
            {stat.linkTexts.map((a) => (
              <a href="#ali">
                <li key={a.id}>
                  <>{a.linkText}</>
                </li>
              </a>
            ))}
          </ol>
          <p>{stat.subText2}</p>
        </div>
      ))}

      {personaldata.map((data) => (
        <div className="privacyParaghrap">
          <h2>{data.hText}</h2>
          <p>{data.sText}</p>
          <ol className="privacyPolicy-policy-list">
            {data.sTexts.map((stext) => (
              <li key={stext.id}>{stext.text}</li>
            ))}
          </ol>
          <h3>{data.hText2}</h3>
          <p>{data.sText2}</p>
          <ol className="privacyPolicy-policy2-list">
            {data.lists.map((e) => (
              <li>{e.list}</li>
            ))}
          </ol>
          <h3>{data.hText3}</h3>
          <p>{data.sText3}</p>
        </div>
      ))}

    {
      personaldata2.map((data)=>(
        <div className="privacyParaghrap">
          <h2>{data.hText}</h2>
          <p>{data.subText}</p>
          <ol className="privacyPolicy-policy3-list">
          {data.lists.map((e)=>(
              <li key={e.id}>
                {e.list}
              </li>
          ))}
          </ol>

        </div>
      ))
    }

    {
      personaldata3.map((data)=>(
        <div className="privacyParaghrap">
          <h2>{data.hText}</h2>
          <p>{data.sText}</p>
          <p>{data.sText2}</p>
          <ol className="privacyPolicy-policy3-list">
            {data.lists.map((e)=>(
              <li key={e.id}>
                {e.list}
              </li>
            ))}
          </ol>
          <p>{data.sText3}</p>
        </div>
      ))
    }

    {
      personaldata4.map((data)=>(
        <div key={data.id} className="privacyParaghrap">
          <h3>{data.hText}</h3>
          <p>{data.sText}</p>
        </div>
      ))
    }

{
      personaldata5.map((data)=>(
        <div key={data.id} className="privacyParaghrap">
          <h3>{data.hText}</h3>
          <p>{data.sText}</p>
          <p>{data.sText2}</p>
          <ol className="privacyPolicy-policy3-list">
          {
            data.lists.map((e)=>(
              <li key={e.id}>
                {e.list}
              </li>
            ))
          }
          </ol>

        </div>
      ))
    }

    {personaldata6.map((data)=>(
      <div className="privacyParaghrap">
        <h2>{data.hText}</h2>
        <p>{data.sText}</p>
        <p>{data.sText2}</p>
        <p>{data.sText3}</p>
        <p>{data.sText4}</p>
        <p>{data.sText5}</p>
      </div>
    ))}

    {personaldata7.map((data)=>(
      <div className="privacyParaghrap">
        <h2>{data.hText}</h2>
      <p>{data.sText}</p>
      </div>
    ))}

    {personaldata8.map((data)=>(
      <div className="privacyParaghrap">
        <h2>{data.hText}</h2>
        <p>{data.sText}</p>
        <p>{data.sText2}</p>
        <p>{data.sText3}</p>
      </div>
    ))}

    </div>
  );
};

export default PrivacyPolicy;
