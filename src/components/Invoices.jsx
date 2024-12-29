import React, { useEffect, useState } from "react";
import api from "./api";

function Invoices() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get("/invoices");
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div>
      <h2>My Invoices</h2>
      <ul>
        {invoices.map((invoice) => (
          <li key={invoice.id}>
            {invoice.invoiceNumber}: {invoice.amount} EUR
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Invoices;
