import React from 'react'
import HomeSecondSectionCard from './HomeSecondSectionCard'
import {AiOutlineShareAlt,AiFillWechat} from "react-icons/ai"
import {FiRefreshCcw} from "react-icons/fi"
const HomeSecondSection = () => {
  return (
    <div className='container'>
        <div className='homeSecondSection'>
            <h2 className='homeSecondSectionTitle'>How does Werkspot work?</h2>
           <div className='cards'>
           <HomeSecondSectionCard
            icon={<AiOutlineShareAlt/>}
            text="Post your job posting"
            subtext="Post your job posting in a few easy steps and invite interesting professionals to respond."
            />
             <HomeSecondSectionCard
            icon={<FiRefreshCcw/>}
            text="Professionals are responding"
            subtext="Interested masters usually respond within 24 hours of posting your job posting."
            />
             <HomeSecondSectionCard
            icon={<AiFillWechat/>}
            text="Select and join the chat"
            subtext="
            Compare profiles and add your favorite professionals to your selection to discuss your work and request quotes."
            />
           </div>

        </div>
    </div>
  )
}

export default HomeSecondSection