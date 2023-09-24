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
          <h2>Hakkında</h2>
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
              <h3>Tarih</h3>
              <p>
                2005 yılında Joost Gielen ve Sjoerd Eikenaar Werkspot'u kurdu.
                kişisel hayal kırıklığı; uygun bir profesyonel bulmak çok önemlidir
                zor ve zaman alıcıdır. Bu hemen bir başarıydı ve
                bu önemli bir büyüme anlamına geliyordu. Bir sonraki adımı atmak için
                Werkspot, 2012 yılında Amsterdam'a taşındı.
                CEO Ronald'ın da dahil olduğu yeni bir yönetim ekibinin yönetimi
                Egas. Werkspot, dünya pazarı HomeAdvisor'ın bir parçası oldu
                2013'ten beri Amerika Birleşik Devletleri'nde lider. Werkspot'un yanı sıra,
                HomeAdvisor'ın Birleşik Krallık'ta da lider pozisyonları var
                <Link to="https://www.mybuilder.com/"> (Mybuilder.com)</Link>,
                France <Link to="https://www.travaux.com/">(Travaux.com)</Link>{" "}
                and Germany
                <Link to="https://www.my-hammer.de/"> (My-Hammer.de)</Link>.
                HomeAdvisor, birçok başarılı internet deneyimiyle tanınan IAC'nin bir parçasıdır
                gibi şirketler{" "}
                <Link to="https://www.match.com/">Match.com</Link>,{" "}
                <Link to="https://www.lexa.nl/">Lexa.nl</Link> ,
                <Link to="https://www.tripadvisor.com/"> Tripadvisor</Link>,
                <Link to="https://vimeo.com/"> Vimeo</Link>, and{" "}
                <Link to="https://tinder.com/">Tinder</Link> . Biz piyasayız
                Hollanda'da lider ve 350.000'den fazla iş ilanı var
                Her yıl sitede yayınlanmaktadır. 8.500'den fazla taahhütte bulunduk
                Bu işletmeleri yönetecek profesyoneller. Üçüncü sıradayız
                İtalya'daki pazar 60.000 iş ve 11.000'den fazla kişiyle
                yılda bir kez bağlantılı profesyoneller.
              </p>
              <h4>Şirket Detayları</h4>
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
