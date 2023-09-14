import React from 'react'
import { BsBoxSeam, BsFillChatFill } from 'react-icons/bs'
import { Link, Outlet } from 'react-router-dom'
import "../pages/pagesCss/propsals.css"

const Contacts = () => {
  return (
    <div className='propsals-head'>
        <h1>Contacts</h1>
        <div className="porpsals-links">
        <Link to="/propsals/contacts/to-inform" className="porpsals-link-item" ><BsFillChatFill/> To inform</Link>
        <Link to="/propsals/contacts/archive" className="porpsals-link-item" ><BsBoxSeam/> Archive</Link>
      </div>
      <Outlet/>
    </div>
  )
}

export default Contacts