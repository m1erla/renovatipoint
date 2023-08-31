import React from 'react'
import HomeWorkCard from './HomeWorkCard'
import { homeworksideData } from '../data/homeworksideData'
import { homeworksideDataTopcategories } from '../data/homeworksideData'
const HomeWorkSide = () => {
  return (
    <div className='container'>
        <div className='homeWorkAll-cards-wrapper'>
        <h2>Get ready for summer</h2>
        <div className='homeWorkSide-cards-wrapper'>
              {homeworksideData.map((card)=>(
                <HomeWorkCard
                key={card.id}
                img={card.img}
                to={card.to}
                iconn={card.iconn}
                text={card.text}
                paragraph={card.paragraph}
                link={card.link}
                subimg={card.subimg}
                subtext={card.subtext}
                sublink={card.sublink}
                />
              ))}
        </div>
        <h2>Top categories</h2>
        <div className='homeWorkSide-cards-wrapper'>
              {homeworksideDataTopcategories.map((card)=>(
                <HomeWorkCard
                key={card.id}
                img={card.img}
                to={card.to}
                iconn={card.iconn}
                text={card.text}
                paragraph={card.paragraph}
                link={card.link}
                subimg={card.subimg}
                subtext={card.subtext}
                sublink={card.sublink}
                />
              ))}
        </div>
        </div>

    </div>
  )
}

export default HomeWorkSide