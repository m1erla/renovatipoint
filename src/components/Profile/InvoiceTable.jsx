import React from "react";

function InvoiceTable({ invoices, onDownload, formatDateTime, t }) {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="text-center p-8 bg-card dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-1">
          {t
            ? t(
                "expertProfile.invoices.invoiceTable.emptyState.title",
                "No Invoices Found"
              )
            : "No Invoices Found"}
        </h3>
        <p className="text-muted-foreground dark:text-gray-400 text-sm">
          {t
            ? t(
                "expertProfile.invoices.invoiceTable.emptyState.message",
                "You don't have any generated invoices yet."
              )
            : "You don't have any generated invoices yet."}
        </p>
      </div>
    );
  }

  // Basic table structure as a placeholder
  return (
    <div className="bg-card dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-border dark:divide-gray-700">
        <thead className="bg-muted/50 dark:bg-gray-700/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-gray-300 uppercase tracking-wider">
              {t
                ? t(
                    "expertProfile.invoices.invoiceTable.invoiceNumber",
                    "Invoice No"
                  )
                : "Invoice No"}
            </th>
            {/* Add other headers as needed */}
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-gray-300 uppercase tracking-wider">
              {t
                ? t("expertProfile.invoices.invoiceTable.date", "Date")
                : "Date"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-gray-300 uppercase tracking-wider">
              {t
                ? t("expertProfile.invoices.invoiceTable.amount", "Amount")
                : "Amount"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-gray-300 uppercase tracking-wider">
              {t
                ? t("expertProfile.invoices.invoiceTable.status", "Status")
                : "Status"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground dark:text-gray-300 uppercase tracking-wider">
              {t
                ? t("expertProfile.invoices.invoiceTable.actions", "Actions")
                : "Actions"}
            </th>
          </tr>
        </thead>
        <tbody className="bg-card dark:bg-gray-800 divide-y divide-border dark:divide-gray-700">
          {/* Map invoices here */}
          <tr>
            <td
              colSpan="5"
              className="px-6 py-4 text-center text-muted-foreground dark:text-gray-400"
            >
              Invoice rows will go here.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;
