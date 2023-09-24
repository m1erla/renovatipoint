import React from 'react'
import {Link} from "react-router-dom"
import "./componentCss/partner.css"
import partnerImage from "../assets/partnerImage.jpg"
import partnerImage2 from "../assets/partnerImage2.jpg"
const Partner = () => {
  return (
    <div className='container'>
        <div className='partner-hero'>
        <h2>Ortağımız Olun</h2>
        <p className='updateTime'>17-07-2023 tarihinde güncellendi</p>
        <p>Güvenilir bir ortağın yardımıyla işinizi büyütmek için yeni fırsatlarla ilgileniyor musunuz?</p>
        <p>Yetenekli profesyonellerden oluşan büyüyen ağımıza değer katabilecek benzer düşüncelere sahip kuruluşlarla bağlantı kurmayı sabırsızlıkla bekliyoruz.</p>
        <p>Sektör ne olursa olsun, her iki tarafın da yararına olacak bir ortaklığı tartışmaya her zaman açığız.</p>
        </div>
        <div className='partner-body'>
        <div>
        <Link className='lineLink' to="https://wtay96d6qws.typeform.com/to/MA07llLs?typeform-source=www.google.com">Bize Ulaşın</Link>
        </div>
        <img src={partnerImage} alt='prtnImg'/>
        <h3>Perakende ortaklığı</h3>
        <p>Müşterilerinizin alışveriş deneyimini iyileştirmenin yollarını mı arıyorsunuz?</p>
        <p>Yoksa mağazanızı büyütmek mi istiyorsunuz?</p>
        <p>Ortağımız olarak ürünlerinizin kurulumunu veya montajını profesyonel ağımıza emanet edebilirsiniz.</p>
        <ol className='partner-list'>
            <li>Müşteri deneyimini geliştirin</li>
            <li>Yeni müşterilere ulaşın</li>
            <li>Cironuzu artırın</li>
        </ol>
        <Link className='lineLink' to="https://wtay96d6qws.typeform.com/to/MA07llLs?typeform-source=www.google.com">Ortak olmak</Link>
        <p>Birlikte nasıl çalışabileceğimizi öğrenmek için sizinle iletişime geçmek istiyoruz!</p>
        <img className="partner-image" src={partnerImage2} alt='partnerImg' />
        </div>
     
    </div>
  )
}

export default Partner