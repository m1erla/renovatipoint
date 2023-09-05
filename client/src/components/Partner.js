import React from 'react'
import {Link} from "react-router-dom"
import "./componentCss/partner.css"
import partnerImage from "../assets/partnerImage.jpg"
import partnerImage2 from "../assets/partnerImage2.jpg"
const Partner = () => {
  return (
    <div className='container'>
        <div className='partner-hero'>
        <h2>Be our partner</h2>
        <p>Updated on 17-07-2023</p>
        <p>Interested in new opportunities to grow your business with the help of a trusted partner?</p>
        <p>We look forward to connecting with like-minded organizations that can add value to our growing network of talented professionals.</p>
        <p>Whatever the industry, we are always open to discussing a partnership that benefits both parties.</p>
        </div>
        <div className='partner-body'>
        <div>
        <Link to="https://wtay96d6qws.typeform.com/to/MA07llLs?typeform-source=www.google.com">Contact us</Link>
        </div>
        <img src={partnerImage} />
        <h3>Retail partnership</h3>
        <p>Looking for ways to improve your customers' shopping experience?</p>
        <p>Or do you want to grow your store?</p>
        <p>As our partner, you can entrust the installation or assembly of your products to our professional network.</p>
        <ol className='partner-list'>
            <li>Enhance the customer experience</li>
            <li>Reach new customers</li>
            <li>Increase your turnover</li>
        </ol>
        <Link to="https://wtay96d6qws.typeform.com/to/MA07llLs?typeform-source=www.google.com">To be a partner</Link>
        <p>We would like to contact you to find out how we can work together!</p>
        <img className="partner-image"src={partnerImage2} />
        </div>
     
    </div>
  )
}

export default Partner