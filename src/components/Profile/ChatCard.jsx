import React from "react";
import {
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline"; // Example icons

function ChatCard({ room, currentUserRole, onGoToChat, formatDateTime, t }) {
  const otherParticipant = currentUserRole === "USER" ? room.expert : room.user;
  const otherRoleLabel =
    currentUserRole === "USER"
      ? t
        ? t("expertProfile.chats.chatCard.expertLabel", "Expert:")
        : "Expert:"
      : t
      ? t("expertProfile.chats.chatCard.userLabel", "User:")
      : "User:";

  return (
    <button
      onClick={() => onGoToChat(room.id)}
      className="w-full text-left bg-card dark:bg-gray-800 rounded-lg shadow-md p-4 border border-border dark:border-gray-700 hover:bg-muted/50 dark:hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label={
        t
          ? t(
              "profile.chats.chatCardAriaLabel",
              "Open chat about ad: {{title}}",
              { title: room.ad?.title || "N/A" }
            )
          : `Open chat about ad: ${room.ad?.title || "N/A"}`
      }
    >
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-semibold text-foreground dark:text-white truncate">
          {room.ad?.title || "Chat"}
        </h5>
        <ChatBubbleLeftRightIcon className="w-5 h-5 text-primary flex-shrink-0" />
      </div>

      <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground dark:text-gray-400">
        <UserCircleIcon className="w-5 h-5" />
        <span>
          {otherRoleLabel} {otherParticipant?.name || "N/A"}
        </span>
      </div>

      <p className="text-xs text-muted-foreground dark:text-gray-500 mb-1">
        {t
          ? t(
              "expertProfile.chats.chatCard.lastActivityLabel",
              "Last Activity:"
            )
          : "Last Activity:"}{" "}
        {formatDateTime
          ? formatDateTime(room.updatedAt)
          : new Date(room.updatedAt).toLocaleString()}
      </p>
      {/* Optionally display last message snippet */}
      {/*
       <p className="text-sm text-foreground dark:text-white truncate">
           {t ? t('expertProfile.chats.chatCard.lastMessageLabel', 'Last Message:') : 'Last Message:'} {room.lastMessage?.content || '...'}
       </p>
       */}
    </button>
  );
}

export default ChatCard;
