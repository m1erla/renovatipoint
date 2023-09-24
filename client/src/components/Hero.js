import React from 'react'
import Search from "../components/searchbar/Search"
import "./componentCss/hero.css"
const Hero = () => {
  return (
    <div className='hero'>
      <div className='container'>
          <div className='hero-wrapper'>
            <h2 className='hero-title'>Evdeki ve çevresindeki tüm işleriniz için bir profesyonel bulun</h2>
            <div className='search-hero'>
              <h3>Ne iş yapıyorsun?</h3>
            <Search />
            </div>
          </div>
      </div>
       
    </div>
  )
}

export default Hero