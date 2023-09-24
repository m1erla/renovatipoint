import React from 'react'
import {VscFileSubmodule} from "react-icons/vsc"
import PropsalCard from './PropsalCard'

const PropsalsArchive = () => {
  return (
    <div>
      <PropsalCard
      icon={<VscFileSubmodule className='icon' />}
      h2="Henüz hiçbir mesaj arşivlenmedi"
      p="Arşivlemek istediğiniz mesajlar burada görünecektir."
      />
    </div>
  )
}

export default PropsalsArchive