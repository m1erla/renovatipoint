import React from 'react'
import PropsalCard from './PropsalCard'
import {VscFileSubmodule} from "react-icons/vsc"

const PropsalstoInfrom = () => {
  return (
    <div>
      <PropsalCard
      icon={<VscFileSubmodule className='icon' />}
      h2="You haven't sent any messages yet"
      p="When you show interest in assignments, your messages will appear here"
      />
      </div>
  )
}

export default PropsalstoInfrom