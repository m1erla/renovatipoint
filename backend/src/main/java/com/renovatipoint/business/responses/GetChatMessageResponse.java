package com.renovatipoint.business.responses;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.renovatipoint.entities.concretes.ChatMessage;
import com.renovatipoint.entities.concretes.Expert;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetChatMessageResponse {
    private String id;
    private String chatRoomId;
    private String content;
    private String senderId;
    private String senderName;
    private String senderRole;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime timestamp;
    private boolean isRead;
    private boolean isSharedInformation;


    public static GetChatMessageResponse fromEntity(ChatMessage message) {
        return GetChatMessageResponse.builder()
                .id(message.getId())
                .chatRoomId(message.getChatRoom().getChatId())
                .content(message.getContent())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getName())
                .senderRole(message.getSender() instanceof Expert ? "EXPERT" : "USER")
                .timestamp(message.getTimestamp())
                .isRead(message.isRead())
                .isSharedInformation(message.isSharedInformation())
                .build();
    }
}
