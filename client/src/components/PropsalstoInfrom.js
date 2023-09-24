import React from 'react'
import PropsalCard from './PropsalCard'
import {VscFileSubmodule} from "react-icons/vsc"

const PropsalstoInfrom = () => {
  return (
    <div>
      <PropsalCard
      icon={<VscFileSubmodule className='icon' />}
      h2="Henüz mesaj göndermediniz"
      p="Ödevlere ilgi gösterdiğinizde mesajlarınız burada görünecek"
      />
      </div>
  )
}

export default PropsalstoInfrom