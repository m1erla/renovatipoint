import React from 'react'
import "./componentCss/homeeveryjob.css"
import { homeeveryjobData } from '../data/homeeveryjobData'
import HomeEveryJobCard from './HomeEveryJobCard'
const HomeEveryJob = () => {
  return (
    <div className='everyjob'>
        <div className='container'>
        <h2 className='everyjob-title'>Find professionals for every job</h2>
        <div className='everjobCards-wrapper'>
            {
                homeeveryjobData.map((data)=>(
                    <HomeEveryJobCard
                    key={data.id}
                    icon={data.icon}
                    text={data.text}
                    links={data.links}
                    to={data.to}
                    />
                ))
            }
        </div>
        </div>
        </div>
  )
}

export default HomeEveryJob