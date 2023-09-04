import React from 'react'
import { Link } from "react-router-dom"
import "./componentCss/homestats.css"
const HomeStats = () => {
  return (
    <div className='homeStats'>
        <div className='container'>
            <div className='stats'>
            <div className='prof'>
                <div className='count'>10.368</div>
                <div className='count-write'>masters</div>
            </div>
            <div className='prof'>
                <div className='count'>106.368</div>
                <div className='count-write'>The work done</div>
            </div>
            <div className='prof'>
                <div className='count'>30.368</div>
                <div className='count-write'>comments</div>
            </div>
            </div>
        <Link onClick={() => window.scrollTo(0, 0)} to="/apply-for-a-job" className='statsBtn'>Post your job posting</Link>
        </div>
    </div>
  )
}

export default HomeStats