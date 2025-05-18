import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BanknotesIcon,
  CreditCardIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { setupSepaPayment } from "../../services/paymentService";

function PaymentMethodSection({
  paymentInfo,
  onSetupPayment,
  onRemovePayment,
  formatDateTime,
  loading,
  t,
}) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Account Status & Balance */}
      <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {t
            ? t(
                "expertProfile.paymentMethods.paymentMethodSection.accountStatusLabel",
                "Stripe Account Status"
              )
            : "Stripe Account Status"}
        </h3>
        {/* Display connected account status if available */}
        {paymentInfo?.details_submitted !== undefined && (
          <p
            className={`text-sm font-medium ${
              paymentInfo.details_submitted
                ? "text-green-600 dark:text-green-400"
                : "text-yellow-600 dark:text-yellow-400"
            }`}
          >
            {paymentInfo.details_submitted
              ? t
                ? t(
                    "expertProfile.paymentMethods.paymentMethodSection.accountVerified",
                    "Account Verified"
                  )
                : "Account Verified"
              : t
              ? t(
                  "expertProfile.paymentMethods.paymentMethodSection.verificationNeeded",
                  "Verification Needed"
                )
              : "Verification Needed"}
          </p>
        )}
        {/* Display payouts status */}
        {paymentInfo?.payouts_enabled !== undefined && (
          <p
            className={`mt-1 text-sm ${
              paymentInfo.payouts_enabled
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {paymentInfo.payouts_enabled
              ? t
                ? t(
                    "expertProfile.paymentMethods.paymentMethodSection.payoutsEnabled",
                    "Payouts Enabled"
                  )
                : "Payouts Enabled"
              : t
              ? t(
                  "expertProfile.paymentMethods.paymentMethodSection.payoutsDisabled",
                  "Payouts Disabled"
                )
              : "Payouts Disabled"}
          </p>
        )}
        {/* Example: Display balance */}
        {paymentInfo?.balance && (
          <div className="mt-4">
            <span className="text-sm text-muted-foreground dark:text-gray-400">
              {t
                ? t(
                    "expertProfile.paymentMethods.paymentMethodSection.balanceLabel",
                    "Current Balance:"
                  )
                : "Current Balance:"}{" "}
            </span>
            <span className="font-semibold text-foreground dark:text-white">
              {/* Format currency */}
              {new Intl.NumberFormat(t ? t("locale", "en-US") : "en-US", {
                style: "currency",
                currency: paymentInfo.balance.currency?.toUpperCase() || "EUR",
              }).format(paymentInfo.balance.amount / 100)}
            </span>
          </div>
        )}
        {!paymentInfo && !loading && (
          <p className="text-muted-foreground dark:text-gray-400 mt-2">
            {t
              ? t(
                  "expertProfile.paymentMethods.paymentMethodSection.noStripeAccount",
                  "No Stripe account connected yet."
                )
              : "No Stripe account connected yet."}
          </p>
        )}
      </div>

      {/* Setup Buttons */}
      <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {t
            ? t(
                "expertProfile.paymentMethods.paymentMethodSection.setupTitle",
                "Setup Payment Methods"
              )
            : "Setup Payment Methods"}
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Card Setup Button (Uses Stripe Connect Onboarding) */}
          <button
            onClick={() => onSetupPayment("card")}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            <CreditCardIcon className="w-5 h-5 mr-2" />
            {t
              ? t(
                  "expertProfile.paymentMethods.paymentMethodSection.setupCardPayouts",
                  "Set Up for Card Payouts (Stripe)"
                )
              : "Set Up for Card Payouts (Stripe)"}
          </button>
          {/* SEPA Setup Button (Navigates to specific SEPA form) */}
          <button
            onClick={() => navigate("/setup-sepa-payment")}
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <BanknotesIcon className="w-5 h-5 mr-2" />
            {t
              ? t(
                  "expertProfile.paymentMethods.paymentMethodSection.setupSepaTransfer",
                  "Set Up for SEPA Bank Transfer"
                )
              : "Set Up for SEPA Bank Transfer"}
          </button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground dark:text-gray-400">
          {t
            ? t(
                "expertProfile.paymentMethods.paymentMethodSection.setupNote",
                "Use Stripe setup for receiving payments from clients. Use SEPA setup for direct bank transfers (if applicable)."
              )
            : "Use Stripe setup for receiving payments from clients. Use SEPA setup for direct bank transfers (if applicable)."}
        </p>
      </div>

      {/* Connected Methods (Display SEPA info if available) */}
      <div className="bg-card dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          {t
            ? t(
                "expertProfile.paymentMethods.paymentMethodSection.connectedMethodsTitle",
                "Connected Payment Methods"
              )
            : "Connected Payment Methods"}
        </h3>
        {/* Display SEPA info from paymentInfo (assuming it comes from /experts/.../payment-info via a prop) */}
        {paymentInfo?.hasPaymentSetup &&
        paymentInfo.iban &&
        paymentInfo.bankName ? (
          <div className="flex items-center justify-between p-4 border border-border dark:border-gray-700 rounded-md bg-background dark:bg-gray-700/50">
            <div className="flex items-center gap-3">
              <BanknotesIcon className="w-6 h-6 text-primary dark:text-indigo-400" />
              <div>
                <p className="font-medium text-foreground dark:text-white">
                  {paymentInfo.bankName}
                </p>
                <p className="text-sm text-muted-foreground dark:text-gray-400">
                  {t
                    ? t(
                        "expertProfile.paymentMethods.paymentMethodSection.sepaAccountEndingIn",
                        "SEPA Account ending in"
                      )
                    : "SEPA Account ending in"}{" "}
                  {paymentInfo.lastFourDigits || paymentInfo.iban.slice(-4)}
                </p>
                {/* Optional: Add BIC or added date if available */}
                {/* <p className="text-xs text-muted-foreground dark:text-gray-500">BIC: {paymentInfo.bic}</p> */}
                {/* <p className="text-xs text-muted-foreground dark:text-gray-500">{t ? t('expertProfile.paymentMethods.paymentMethodSection.addedOn', 'Added On:') : 'Added On:'} {formatDateTime ? formatDateTime(paymentInfo.createdAt) : 'N/A'}</p> */}
              </div>
            </div>
            <button
              onClick={() =>
                onRemovePayment(paymentInfo.paymentMethodId, "BANK")
              }
              disabled={loading}
              className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30"
              aria-label={
                t
                  ? t(
                      "expertProfile.paymentMethods.paymentMethodSection.removeButton",
                      "Remove"
                    )
                  : "Remove"
              }
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <p className="text-muted-foreground dark:text-gray-400">
            {t
              ? t(
                  "expertProfile.paymentMethods.paymentMethodSection.noMethods",
                  "You don't have any connected payment methods yet."
                )
              : "You don't have any connected payment methods yet."}
          </p>
        )}
        {/* Placeholder for listing Card methods (if Stripe Connect provides this) */}
        {/* You might need another API call to list cards associated with the Stripe Connect account */}
      </div>
    </div>
  );
}

export default PaymentMethodSection;
