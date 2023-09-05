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
            <h2>Werkspot Quality Requirements</h2>
            <p>Every professional joining Werkspot has to meet certain quality requirements. For example, all of our professionals have a Chamber of Commerce registration.</p>
        </div>
        <div className='quailty-content'>
        <h3>Workspace House Rules</h3>
        <p>The craftsmen at Werkspot take pride in their work and their relationship with the client. They accept the Werkspot House Rules to ensure that all craftsmen offer the right service and quality.</p>
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
        <Link onClick={() => window.scrollTo(0, 0)} to="/apply-for-a-job" className='statsBtn'>Post your job posting</Link>
        </div>
        </div>
  )
}

export default QualityReq