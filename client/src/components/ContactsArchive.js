import React from "react";
import { VscFileSubmodule } from "react-icons/vsc";
import PropsalCard from "./PropsalCard";

const ContactsArchive = () => {
  return (
    <div>
      <PropsalCard
        icon={<VscFileSubmodule className="icon" />}
        h2="No messages have been archived yet"
        p="Messages you want to archive will appear here."
      />
    </div>
  );
};

export default ContactsArchive;
