import React from 'react'
import { VscFileSubmodule } from "react-icons/vsc";
import PropsalCard from "./PropsalCard";
const ContactsInterest = () => {
  return (
    <div>
       <PropsalCard
        icon={<VscFileSubmodule className="icon" />}
        h2="No contact details have been shared yet"
        p="When consumers want to get in touch with you, their contact details will appear here"
      />
    </div>
  )
}

export default ContactsInterest