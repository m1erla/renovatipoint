import React from 'react'
import HomeSecondSectionCard from './HomeSecondSectionCard'
import {AiOutlineShareAlt,AiFillWechat} from "react-icons/ai"
import {FiRefreshCcw} from "react-icons/fi"
const HomeSecondSection = () => {
  return (
    <div className='container'>
        <div className='homeSecondSection'>
            <h2 className='homeSecondSectionTitle'>Werkspot nasıl çalışır?</h2>
           <div className='cards'>
           <HomeSecondSectionCard
            icon={<AiOutlineShareAlt/>}
            text="İş ilanınızı yayınlayın"
            subtext="İş ilanınızı birkaç kolay adımda yayınlayın ve ilgi çekici profesyonelleri yanıt vermeye davet edin."
            />
             <HomeSecondSectionCard
            icon={<FiRefreshCcw/>}
            text="Profesyoneller yanıt veriyor"
            subtext="İlgilenen ustalar genellikle iş ilanınızı yayınladıktan sonraki 24 saat içinde yanıt verirler."
            />
             <HomeSecondSectionCard
            icon={<AiFillWechat/>}
            text="Seçin ve sohbete katılın"
            subtext="
            Profilleri karşılaştırın ve çalışmalarınızı tartışmak ve fiyat teklifi istemek için favori profesyonellerinizi seçiminize ekleyin."
            />
           </div>

        </div>
    </div>
  )
}

export default HomeSecondSection