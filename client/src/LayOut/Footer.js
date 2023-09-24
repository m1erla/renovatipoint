import React from 'react'
import { company,help,resource } from "../data/footerData"
import "./LayoutCss/footer.css"
import { Link } from 'react-router-dom'
import {BsFacebook,BsTwitter,BsInstagram,BsLinkedin} from "react-icons/bs"
const Footer = () => {
  return (
    <footer className='footer'>
      <div className="container">
      <div className="footer-top">
      <div className='footer-Left'>
        <h1>Logo</h1>
        <p>Merhaba, takip edilmesi gerçekten acı verici. Bazı mevcut ihtiyaçlar genellikle yaşamın uçuşudur.</p>
      </div>
        <div className='footer-Right'>
        <div className='company'>
        <h2>Şirket</h2>
        <ul>
        {company.map((company)=>(
          <li key={company.id}>
            <Link onClick={() => window.scrollTo(0, 0)} to={company.to} key={company.id}>{company.title}</Link>
          </li>
        ))}
        </ul>
        </div>
        <div className='company'>
        <h2>Yardım</h2>
        <ul>
        {help.map((help)=>(
          <li key={help.id}>
            <Link onClick={() => window.scrollTo(0, 0)} key={help.id}>{help.title}</Link>
          </li>
        ))}
        </ul>
        </div>
        <div className='company'>
        <h2>ortaklık</h2>
        <ul>
        {resource.map((resource)=>(
          <li key={resource.id}>
            <Link to={resource.to} onClick={() => window.scrollTo(0, 0)} key={resource.id}>{resource.title}</Link>
          </li>
        ))}
        </ul>
        </div>
        </div>
      </div>
      <hr className='hr' />
      <div className="footer-bottom">
          <div className="footer-bottom-socials">
            <div className="icons">
            <Link> <BsFacebook/></Link>
            <Link><BsTwitter/></Link>
            <Link><BsInstagram/></Link>
            <Link><BsLinkedin/></Link>
            </div>
            <div className="links">
              <Link onClick={() => window.scrollTo(0, 0)}>Gizlilik Politikası</Link>
              <Link onClick={() => window.scrollTo(0, 0)}>Şartlar ve koşullar</Link>
              <Link onClick={() => window.scrollTo(0, 0)}>Destek</Link>
            </div>
          </div>

          <p>© 2023 Logo. Her hakkı saklıdır.</p>
      </div>
      </div>
     
    </footer>
  )
}

export default Footer