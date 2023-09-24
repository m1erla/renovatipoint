import React from 'react'
import { VscFileSubmodule } from "react-icons/vsc";
import PropsalCard from "./PropsalCard";
const ContactsInterest = () => {
  return (
    <div>
       <PropsalCard
        icon={<VscFileSubmodule className="icon" />}
        h2="Henüz iletişim bilgisi paylaşılmadı"
        p="Tüketiciler sizinle iletişime geçmek istediklerinde iletişim bilgileri burada görünecek"
      />
    </div>
  )
}

export default ContactsInterest