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
        <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quibusdam necessitatibus praesentium sint saepe fuga vitae fugiat consequatur eum velit repellat id nobis sit impedit soluta molestiae aspernatur</p>
      </div>
        <div className='footer-Right'>
        <div className='company'>
        <h2>Company</h2>
        <ul>
        {company.map((company)=>(
          <li key={company.id}>
            <Link key={company.id}>{company.title}</Link>
          </li>
        ))}
        </ul>
        </div>
        <div className='company'>
        <h2>Help</h2>
        <ul>
        {help.map((help)=>(
          <li key={help.id}>
            <Link key={help.id}>{help.title}</Link>
          </li>
        ))}
        </ul>
        </div>
        <div className='company'>
        <h2>Partnership</h2>
        <ul>
        {resource.map((resource)=>(
          <li key={resource.id}>
            <Link key={resource.id}>{resource.title}</Link>
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
              <Link>Privacy Policy</Link>
              <Link>Terms & Conditions</Link>
              <Link>Support</Link>
            </div>
          </div>

          <p>© 2023 Logo. All rights reserved.</p>
      </div>
      </div>
     
    </footer>
  )
}

export default Footer