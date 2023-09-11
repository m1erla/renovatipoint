import React from 'react'
import { Link } from 'react-router-dom'
import "./componentCss/affiliate.css"
    const data = [
        {
            id:1,
            htext:"Earn money easily",
            lists:[
                {
                    id:1,
                    list:"A rapidly growing affiliate program"
                },{
                    id:2,
                    list:"We offer a variety of creative materials such as banners, text links, emails..."
                },{
                    id:3,
                    list:"You choose the fields you want"
                }
            ]
        },{
            id:2,
            htext:(
                <>
                <Link className='lineLink' to="https://partner.instapro.com/anmelden.cgi?new=1&cpid=5">Sign up</Link> for our one-click program
                </>
            ),
            lists:[
                {
                    id: 1,
                    list:"Create your profile on our Netslave platform"
                },{
                    id: 2,
                    list:"Integrate our banners into your website"
                },{
                    id: 3,
                    list:"Users click on your links and post jobs on our website"
                },{
                    id: 4,
                    list:"Werkspot pays commission for each lead"
                }
            ]
        },{
            id:3,
            htext:"Who can register?",
            lists:[
                {
                    id:1,
                    list: (
                        <>
                        Content websites, emails (under certain conditions) or price guides: <Link className='lineLink' to="https://partner.instapro.com/anmelden.cgi?new=1&cpid=5">sign up now!</Link>
                        </>
                    )
                },{
                    id:2,
                    list:"Do not hesitate to contact us even if you do not fall into the above categories. We will carefully consider every request."
                },{
                    id: 3,
                    list:"Allowed channels: Display, text links, email (subject to conditions)"
                },{
                    id: 4,
                    list:"Dedicated partnership manager that offers you guidance and support to optimize your performance."
                }
            ]
        },{
            id:4,
            htext:"Support we provide:",
            lists: [
                {
                    id:1,
                    list:"Fast confirmations and payments"
                }, {
                    id:2,
                    list:"Clear and accurate reporting and follow-up process"
                }, {
                    id:3,
                    list:"Multiple and seasonal creative materials"
                }, {
                    id:4,
                    list:"Dedicated partnership manager that offers you guidance and support to optimize your performance."
                }
            ]
        }
    ]

const Affiliate = () => {
  return (
    <div className='container'>
        <div className='affiliate-hero'>
        <h2 className='affiliate-title'>Become an affiliate</h2>
        <p className='updateTime'>Updated on 04-09-2023</p>
        <div className='affiliate-body'>
        <h3>Work with Europe's leading marketplace connecting home owners and artisans</h3>
        <p>Werkspot.nl is the trusted way for homeowners to hire the professionals they need and get the professionals the job they want. With 150,000 job postings posted by over 40,000 active shopkeepers and homeowners each month, Werkspot has established itself as a leading player in the market for all types of businesses, small and large, in and around the home.</p>
        <p>The platform is part of the Instapro Group, Europe's leading marketplace for all business in and around the home. Besides Werkspot.nl in the Netherlands, the Instapro Group also operates in other European countries, including France, Germany, Austria, Italy and the Netherlands.</p>
        </div>
        </div>
        <div className='affiliate-lists'>
            {data.map((data)=>(
                <div className='list-item' key={data.id}>
                    <h3>{data.htext}</h3>
                    <ol className='list-ol'>
                        {data.lists.map((e)=>(
                            <li key={e.id}>
                                {e.list}
                            </li>
                        ))}
                    </ol>
                </div>
            ))}
        </div>
        <div className='affiliate-bottom'>
            <>
            <h3>How do we work?</h3>
            <p>Our online platform connects homeowners with verified and approved local professionals across the Netherlands for all work in and around the home, whether it's renovation, maintenance work or repairs. Homeowners can post their work for free and get responses from available professionals; They can view their profile and read reviews from previous customers before deciding who to connect with.</p>
            </>
            <>
            <h3>We are waiting for you! <Link className='lineLink' to="https://partner.instapro.com/anmelden.cgi?new=1&cpid=5"> Register now</Link></h3>
            <p>If you have any questions or concerns, please contact us at affiliate@instapro.com.</p>
            </>
        </div>
    </div>
  )
}

export default Affiliate