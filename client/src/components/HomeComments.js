import React from 'react'
import HomeCommentsCard from './HomeCommentsCard'
import photo from "../assets/heroImage.jpg"
import {TbMessageCircleStar} from "react-icons/tb"
const HomeComments = () => {
  return (
    <div className='homecomments'>
        <div className='container'>
            <h3 className='homecomments-title'>Thousands of comments available</h3>
            <div className='comment-cards'>
            <HomeCommentsCard 
            img={photo}
            text="8 m²; walkway or pavement; floor tiles"
            customerText="Ali"
            comment="“So much good work has been done in a shorter time. Hardworking friendly person. ”"
            />
            <HomeCommentsCard 
            img={photo}
            text="8 m²; walkway or pavement; floor tiles"
            customerText="Ali"
            comment="“So much good work has been done in a shorter time. Hardworking friendly person. ”"
            />
            <HomeCommentsCard 
            img={photo}
            text="8 m²; walkway or pavement; floor tiles"
            customerText="Ali"
            comment="“So much good work has been done in a shorter time. Hardworking friendly person. ”"
            />
            </div>
            <p className='homecomments-paragraph'><TbMessageCircleStar className='iconComment' /> Reviews on Werkspot are written by consumers like you. Read others' experiences for a better impression.</p>
        </div>
        </div>
  )
}

export default HomeComments