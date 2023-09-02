import React from 'react'
import {conditions, examination, user} from "../data/termsandconditionsData";
import "./componentCss/termsandconditions.css"
const TermsAndConditions = () => {
  return (
    <div className='termsandconditions'>
   <div className='container'>
          {
            conditions.map((data)=>(
              <div className='conditions' key={data.id}>
                <h1 className='htext'>{data.hText}</h1>
                <h2>{data.subHtext}</h2>
                <p>{data.sText}</p>
                <b>{data.articleHead}</b>
                <p>{data.articleText}</p>
                {data.lists.map((e)=>(
                  <div className='lists' key={e.id}>
                    <b>{data.id}.{e.id}.</b>{e.text}         
                    {e.textLists && (
             <>
                  {e.textLists.map((a) => (
                    <p key={a.id}>{a.textList}</p>
                  ))}
               </>
              )}
                    </div>
                ))}
              </div>
            ))
          }
          {
            user.map((data)=>(
              <div className='conditions' key={data.id}>
                <h2>{data.subHtext}</h2>
                <p>{data.sText}</p>
                <b>{data.articleHead}</b>
                <p>{data.articleText}</p>
                {data.lists.map((e)=>(
                  <div key={e.id}>
                    <b>{data.id}.{e.id}.</b>{e.text}         
                    {e.textLists && (
             <>
                  {e.textLists.map((a) => (
                    <p key={a.id}>{a.textList}</p>
                  ))}
               </>
              )}
                    </div>
                ))}
              </div>
            ))
          }
          {
            examination.map((data)=>(
                <div className='conditions' key={data.id}>
                  <h2>{data.subHtext}</h2>
                  <b>{data.articleHead}</b>
                  <p>{data.p1}</p>
                  <p>{data.p2}</p>
                  <p>{data.p3}</p>
                  <p>{data.p4}</p>
                  {data.lists && (
                    <ol>
                    {data.lists.map((e)=>(
                      <li key={e.id}>
                      {e.text}
                      </li>
                    ))}
                    </ol>
                  )}
                  <p>{data.p5}</p>
                  <p>{data.p6}</p>
                </div>
            ))
          }
    </div>
    </div>
 
  )
}

export default TermsAndConditions