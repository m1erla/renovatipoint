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
            <h2>Werkspot nasıl çalışır?</h2>
            <p>
              <b>Werkspot'ta iş ilanı vermek hızlı ve kolaydır.</b> Bize ne olduğunu anlat
              ihtiyaçlarınız nelerdir ve sizi bazı kalifiye kişilerle tanıştıracağız
              profesyoneller. Daha sonra size bir teklif gönderiyorlar. Karşılaştırma yaptıktan sonra
              size uygun profesyoneli seçin. Kolay, ücretsiz ve
              mecburiyet yok.
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
                İş ilanınızı yayınlayın
              </h2>
              <p className="howworksteps-contact-paragrahp">
                Birkaç basit adımda iş ilanınızı yayınlayabilir ve ulaşabilirsiniz.
                bölgenizdeki profesyoneller. Büyük ya da küçük her iş mümkündür.
                Doğru bilgiye ulaşabilmeniz için mümkün olduğunca fazla bilgi ekleyin
                alıntılar.
              </p>
            </div>
          </div>
          <div className="info">
            <FaInfoCircle />
            <div>
              İpucu: Telefonunuzla fotoğraf çekin ve bunları açıklamanıza ekleyin.
            </div>
          </div>
          <div className="step reverse">
            <div className="howworksteps-icon">
              <TbBrandWechat />
            </div>
            <div className="howworksteps-contact">
              <h2 className="howworksteps-contact-title">Teklifleri al</h2>
              <p className="howworksteps-contact-paragrahp">
                İş ilanınızı yayınladıktan sonra talebinizi şu adrese ileteceğiz:
                nitelikli profesyoneller. Alıncaya kadar sabırla bekleyin
                e-posta yoluyla teklifler.
              </p>
            </div>
          </div>
          <div className="step">
            <div className="howworksteps-icon">
              <GiConfirmed />
            </div>
            <div className="howworksteps-contact">
              <h2 className="howworksteps-contact-title">
                İhtiyaçlarınızı karşılayan profesyoneli seçin
              </h2>
              <p className="howworksteps-contact-paragrahp">
                Beklentilerinizi karşılayan bir profesyonel bulduysanız,
                onunla e-posta veya telefon yoluyla iletişime geçebilirsiniz.
              </p>
            </div>
          </div>
          <div className="howwork-comment">
            <div className="howwork-comment-card">
              <h3 className="howwork-comment-card-title">
                <BsChatDots /> Kişisel bir mesaj
              </h3>
              <p>
                Profesyoneller kendilerini tanıtacak ve sunumlarında açıklayacaklardır.
                neden bu işe uygun olduklarına dair öneri.
              </p>
            </div>
            <div className="howwork-comment-card">
              <h3 className="howwork-comment-card-title">
                <BsCurrencyEuro /> <p>Fiyat göstergesi</p>
              </h3>
              <p>
                Mümkün oldukça ustalarımız konuyla ilgili bilgi verebilirler.
                yapılan iş, malzeme vs.ye göre hedef fiyat veriyorlar
                miktar. Bu sayede ustayı rahatlıkla seçebilirsiniz.
                bütçenize uygundur.
              </p>
            </div>
            <div className="howwork-comment-card">
              <h3 className="howwork-comment-card-title">
                <AiOutlineStar />
                Oylar ve görüşler
              </h3>
              <p>
                Müşteri, bir kişi tarafından gerçekleştirilen her işi değerlendirebilir.
                profesyonel. Böylece seçiminizi verilen incelemelere göre de yapabilirsiniz.
                diğerleri. 
              </p>
            </div>
          </div>
          <div className="step">
            <div className="howworksteps-icon">
              <HiOutlineWrenchScrewdriver />
            </div>
            <div className="howworksteps-contact">
              <h2 className="howworksteps-contact-title"> İşi yap</h2>
              <p className="howworksteps-contact-paragrahp">
                Fiyatları, şartları ve programı kabul ettikten sonra seçilen
                işi profesyonel yürütecektir.
              </p>
            </div>
          </div>
          <div className="step reverse">
            <div className="howworksteps-icon">
              <TbStars />
            </div>
            <div className="howworksteps-contact">
              <h2 className="howworksteps-contact-title">
              Deneyiminizi derecelendirin
              </h2>
              <p className="howworksteps-contact-paragrahp">
                Çalışmanızı tamamladıktan sonra deneyiminizi paylaşabilirsiniz.
                profesyonel. Yorum yapmak aynı zamanda diğer tüketicilerin bir seçim yapmasına da yardımcı olur.
                profesyonel.
              </p>
            </div>
          </div>

        <div className="howworrkShareBtn-wrapper">
          <h3>İletişimi koparmamak</h3>
          <Link onClick={() => window.scrollTo(0, 0)} to="/apply-for-a-job" className="howworkBtn">iş ilanınızı yayınlayın</Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Howwork;
