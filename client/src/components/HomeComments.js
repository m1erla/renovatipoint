import React from 'react'
import HomeCommentsCard from './HomeCommentsCard'
import photo from "../assets/heroImage.jpg"
import {TbMessageCircleStar} from "react-icons/tb"
const HomeComments = () => {
  return (
    <div className='homecomments'>
        <div className='container'>
            <h3 className='homecomments-title'>Binlerce yorum mevcut</h3>
            <div className='comment-cards'>
            <HomeCommentsCard 
            img={photo}
            text="8 m²; walkway or pavement; floor tiles"
            customerText="Ali"
            comment="“Kısa sürede çok güzel işler yapıldı. Çalışkan dost canlısı insan. ”"
            />
            <HomeCommentsCard 
            img={photo}
            text="8 m²; walkway or pavement; floor tiles"
            customerText="Ali"
            comment="“Kısa sürede çok güzel işler yapıldı. Çalışkan dost canlısı insan. ”"
            />
            <HomeCommentsCard 
            img={photo}
            text="8 m²; walkway or pavement; floor tiles"
            customerText="Ali"
            comment="“Kısa sürede çok güzel işler yapıldı. Çalışkan dost canlısı insan. ”"
            />
            </div>
            <p className='homecomments-paragraph'><TbMessageCircleStar className='iconComment' />Werkspot'taki yorumlar sizin gibi tüketiciler tarafından yazılmaktadır. Daha iyi bir izlenim için başkalarının deneyimlerini okuyun.</p>
        </div>
        </div>
  )
}

export default HomeComments