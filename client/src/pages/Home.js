import React from 'react'
import Hero from '../components/Hero'
import HomeSecondSection from '../components/HomeSecondSection'
import HomeWorkSide from '../components/HomeWorkSide'
import HomeEveryJob from '../components/HomeEveryJob'
import HomeComments from '../components/HomeComments'
import HomeStats from '../components/HomeStats'


const Home = () => {
  return (
    <div>
        <Hero />
        <HomeSecondSection />
        <HomeWorkSide />
        <HomeEveryJob />
        <HomeComments />
        <HomeStats />
    </div>
  )
}

export default Home