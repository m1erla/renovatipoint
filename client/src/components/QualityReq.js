import React from 'react'
import quailt from "../assets/quailt.webp"
import "./componentCss/qualityreq.css"
import QualityCard from './QualityCard'
import { quailtCardData } from '../data/qualityData'
import {Link} from "react-router-dom"
const QualityReq = () => {
  return (
    <div className='container'>
        <div className='qualityReq-hero'>
            <img className='qualityReqImage' alt='image' src={quailt} />
            <h2>Werkspot Kalite Gereksinimleri</h2>
            <p>Werkspot'a katılan her profesyonelin belirli kalite gereksinimlerini karşılaması gerekir. Mesela tüm profesyonellerimizin Ticaret Odası kaydı var.</p>
        </div>
        <div className='quailty-content'>
        <h3>Çalışma Alanı Ev Kuralları</h3>
        <p>Werkspot'taki ustalar işlerinden ve müşteriyle olan ilişkilerinden gurur duyuyor. Tüm ustaların doğru hizmet ve kaliteyi sunmasını sağlamak için Werkspot Ev Kurallarını kabul ederler.</p>
        </div>
        <div className='quailty-cards'>
            {
                quailtCardData.map((data)=>(
                    <QualityCard
                    key={data.id}
                    icon={data.icon}
                    h3={data.h3}
                    lists={data.lists || []}
                    p={data.p}
                    />
                ))
            }
        <Link onClick={() => window.scrollTo(0, 0)} to="/apply-for-a-job" className='statsBtn'>İş ilanınızı yayınlayın</Link>
        </div>
        </div>
  )
}

export default QualityReq