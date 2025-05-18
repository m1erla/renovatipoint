import React from "react";
import {
  CheckIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline"; // Example icons

function RequestCard({ request, onAccept, onReject, onGoToChat, t }) {
  // Added onReject
  const isPending = request.status === "PENDING";
  const isAccepted = request.status === "ACCEPTED";

  return (
    <div className="bg-card dark:bg-gray-800 rounded-lg shadow-md p-4 border border-border dark:border-gray-700">
      <h4 className="font-semibold text-foreground dark:text-white mb-2">
        {t
          ? t(
              "expertProfile.requests.requestCard.cardTitle",
              "Request: {{adTitle}}",
              { adTitle: request.ad?.title || "N/A" }
            )
          : `Request: ${request.ad?.title || "N/A"}`}
      </h4>
      <div className="text-sm space-y-1 mb-3">
        <p>
          <span className="font-medium text-muted-foreground dark:text-gray-400">
            {t
              ? t("expertProfile.requests.requestCard.userLabel", "From:")
              : "From:"}
          </span>{" "}
          {request.user?.name || "N/A"}
        </p>
        <p>
          <span className="font-medium text-muted-foreground dark:text-gray-400">
            {t
              ? t("expertProfile.requests.requestCard.messageLabel", "Message:")
              : "Message:"}
          </span>{" "}
          {request.message || "-"}
        </p>
        <p>
          <span className="font-medium text-muted-foreground dark:text-gray-400">
            {t
              ? t("expertProfile.requests.requestCard.statusLabel", "Status:")
              : "Status:"}
          </span>{" "}
          <span
            className={`font-semibold ${
              isPending
                ? "text-yellow-600 dark:text-yellow-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {request.status || "N/A"}
          </span>
        </p>
      </div>

      <div className="flex justify-end gap-2">
        {isPending &&
          onReject && ( // Add reject button if pending and handler exists
            <button
              onClick={() => onReject(request.id)} // Call onReject handler
              className="inline-flex items-center px-3 py-1.5 border border-red-500 text-xs font-medium rounded shadow-sm text-red-500 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20"
              aria-label={t ? t("common.reject", "Reject") : "Reject"}
            >
              <XMarkIcon className="w-4 h-4 mr-1" />
              {t ? t("common.reject", "Reject") : "Reject"}
            </button>
          )}
        {isPending && (
          <button
            onClick={() => onAccept(request.id)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700"
            aria-label={
              t
                ? t("expertProfile.requests.requestCard.acceptButton", "Accept")
                : "Accept"
            }
          >
            <CheckIcon className="w-4 h-4 mr-1" />
            {t
              ? t("expertProfile.requests.requestCard.acceptButton", "Accept")
              : "Accept"}
          </button>
        )}
        {isAccepted && request.chatRoomId && (
          <button
            onClick={() => onGoToChat(request.chatRoomId)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary hover:bg-primary/90"
            aria-label={
              t
                ? t(
                    "expertProfile.requests.requestCard.goToChatButton",
                    "Go to Chat"
                  )
                : "Go to Chat"
            }
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
            {t
              ? t(
                  "expertProfile.requests.requestCard.goToChatButton",
                  "Go to Chat"
                )
              : "Go to Chat"}
          </button>
        )}
      </div>
    </div>
  );
}

export default RequestCard;
