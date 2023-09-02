import React from 'react'
import Search from "../components/searchbar/Search"
import "./componentCss/hero.css"
const Hero = () => {
  return (
    <div className='hero'>
      <div className='container'>
          <div className='hero-wrapper'>
            <h2 className='hero-title'>Find a professional for all your work in and around the home</h2>
            <div className='search-hero'>
              <h3>What is your business?</h3>
            <Search />
            </div>
          </div>
      </div>
       
    </div>
  )
}

export default Hero