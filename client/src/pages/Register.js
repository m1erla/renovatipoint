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
    fetch(`${process.env.BASE_API_URL}/masters`, {
      method: "POST",
      headers: {
        "Content-Type": `${process.env.BASE_API_URL}`,
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
              <h2>Bir iş mi arıyorsunuz ?</h2>
              <p>
                Her alanda iş aranıyor
                Hollanda. Bize nerede çalışmak istediğinizi söyleyin, size yardımcı olalım
                aradığınızla eşleşen işleri bulmak.
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
              ücretsiz kaydol
              </button>
              <div>
                <span>
                  <Link onClick={() => window.scrollTo(0, 0)} to="/privacy/privacy-policy">Şartlar ve koşullar</Link> ve{" "}
                  <Link onClick={() => window.scrollTo(0, 0)} to="/">Gizlilik Politikası.</Link>{" "}
                </span>
              </div>
            </form>
          </div>
        </div>
        <div className="assignments ">
          <h2 className="assignments-title">3 adımda ödevleri bulun</h2>
          <div className="cards">
            <AssignmentsCard
              icon="https://cdn.pixabay.com/photo/2017/11/25/16/36/traveling-2977176_1280.jpg"
              text="Görevlerinizi kendiniz seçin"
              subtext="Hiçbir kayıt veya abonelik ücreti olmadan ilginizi çeken ödevlere yanıt verin "
            />
            <AssignmentsCard
              icon="https://cdn.pixabay.com/photo/2018/03/11/06/15/social-media-marketing-3216077_1280.jpg"
              text="
              İlginizi Gösterin"
              subtext="
              Tüketicilere ücretsiz bir mesaj göndererek bir ödeve ilgi gösterin"
            />
            <AssignmentsCard
              icon="https://cdn.pixabay.com/photo/2017/11/25/16/36/traveling-2977176_1280.jpg"
              text="Tüketici İletişim Bilgileri"
              subtext="
              Yalnızca tüketici sizinle iletişim kurmak için iletişim bilgilerini paylaştığında ödeme yaparsınız"
            />
          </div>
        </div>
        <div className="tv-wrapper">
          <h3>Çalışma yeri: TV'den biliniyor</h3>
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
          <h2 className="find-works-desc-title">Yeni işleri nasıl buluyorsunuz?</h2>
          <p>
            İster yeni başlıyor olun ister uzun süredir bu işte çalışıyor olun
            birkaç yıl: Bir DIY şirketi olarak yeni şeyler kazanmak her zaman ilgi çekicidir
            müşteriler. Peki yeni müşteriler bulmaya nereden başlayacaksınız?
          </p>
          <ol className="find-works-desc-lists">
            <li className="find-works-desc-list-item">
              <b>Kendi ağınızı kullanın -</b> Gücünü asla küçümseme
              kendi ağınız, özellikle eski müşterilerinizin gücü. Onlar
              yeni müşterilere açılan kapınızdır. Bir düşünün: Yaptınız mı?
              Düzenli müşterilerinizden birinin mutfağını sökün veya tamir edin
              gıcırdayan kapı mı? Müşterinizin arkadaşları iyi bir ürün aradığında
              onarım şirketi, muhtemelen adınız geçecektir. Sahip olduğun her şey
              Bunun için yapmanız gereken ustalığı müşterilerinize sunmaktır ve
              geri kalanını ağızdan ağza aktarırsınız.
            </li>
            <li className="find-works-desc-list-item">
              <b>Kendinizi mahallede tanıtın -</b> Ygörüyorsun
              bu günlerde el ilanları giderek azalıyor ve bazı insanlar gücün
              Sonuç olarak kapıdan kapıya reklamcılık oranı biraz arttı. bu
              Neden bazı tamirci firmaları otobüslere reklam koymayı tercih ediyor? Bir diğer
              Yerel veya bölgesel bir gazeteye ilan vermek mümkündür.
              Bu yöntemler işletmenizin görünürlük kazanmasına yardımcı olsa da,
              eylemler her zaman yeni iş fırsatlarına yol açmaz. Ayrıca,
              Bu şekilde müşteri bulmak genellikle çok zaman alır (ve para).
            </li>
            <li className="find-works-desc-list-item">
              <b>Çalışmanızı sosyal medyada paylaşın -</b> Bir kurulum yaptınız mı?
              dolabınız var, duvar ünitesi taktınız veya gurur duyduğunuz başka bir işiniz var
              ile ilgili? O zaman bu fotoğrafları sosyal medyada paylaşmak çok güzel.
              Bu şekilde ağınız ne yaptığınızı görebilir ve eğer
              şanslısınız, yeni işler kazanabilirsiniz. Sorun şu ki fotoğraflarınız
              bilgi akışında hızla kayboluyor ve reklamlar
              sosyal medya çok paraya mal olabilir.
            </li>
          </ol>
        </div>
        <div className="register-find-work-SecondText">
          <h2 className="find-works-desc-title">
            Bir iş mi arıyorsunuz? Werkspot'un çözümü var!
          </h2>
          <p>
            Yeni işler mi arıyorsunuz? Tabii ki doğrudan katılmak güzel
            iyi bir iş şirketi arayan insanlarla iletişim kurun. Sen
            Aradığınız müşteriyi Werkspot'ta bulacağınızdan emin olabilirsiniz.
            Yalnızca ilginizi çeken ödevlere yanıt verirsiniz.
            kayıt veya abonelik ücretleri.
          </p>
          <ol className="find-works-desc-lists">
            <li className="find-works-desc-list-item">
            Kendi profil sayfanızı oluşturun.
            </li>
            <li className="find-works-desc-list-item">
             İlginizi çeken ödevlere yanıt verin.
            </li>
            <li className="find-works-desc-list-item">
              İlginizi göstermek için tüketicilere ücretsiz mesajlar gönderin
              işletme.
            </li>
            <li className="find-works-desc-list-item">
              Yalnızca tüketici iletişim bilgilerini paylaştığında ödeme yapın
              seninle iletişime geçme.
            </li>
          </ol>
        </div>
        <div className="register-find-work-ThirdText">
          <h2 className="find-works-desc-title">
            Werkspot'taki profil sayfasının avantajları
          </h2>
          <ol className="find-works-desc-lists">
            <li className="find-works-desc-list-item">
            Tamirci arayan müşterilerle doğrudan iletişim.
            </li>
            <li className="find-works-desc-list-item">
            Tüketiciler Werkspot'u ücretsiz olarak kullanabilirler. Sonuç olarak, bir tamirci şirketindeki iş sayısı büyük ölçüde artar.
            </li>
            <li className="find-works-desc-list-item">
            Werkspot'un iyi bir itibarı var: Tüketiciler, incelemeler ve net iletişim sayesinde platformumuzdaki profesyonellere güveniyor.
            </li>
            <li className="find-works-desc-list-item">
              Yalnızca tüketici iletişim bilgilerini paylaştığında ödeme yapın
              seninle iletişime geçme.
            </li>
          </ol>
          <p>
            Kısacası Werkspot'ta kolayca yeni işler bulabilirsiniz. Eğer tüketici
            Verilerini sizinle paylaşıyor, karşılığında tek istediğimiz bir miktar. Biz
            ayrıca profesyonellerimizden şeffaf olmalarını, müşterilere doğru davranmalarını,
            ve platformumuzda tüketici taleplerine ciddi bir şekilde yanıt veriyoruz. Bu
            daha fazla iş bulmak için nasıl birlikte çalışırız.
          </p>
        </div>

        </>
        <div className="registerOtherProf">
        <h2 className="title">Diğer Meslekler</h2>
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
