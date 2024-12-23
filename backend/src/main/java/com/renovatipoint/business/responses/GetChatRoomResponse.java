package com.renovatipoint.business.responses;

import com.renovatipoint.entities.concretes.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GetChatRoomResponse {
    private String id;
    private String chatId;
    private UserInfo user;
    private ExpertInfo expert;
    private AdInfo ad;
    private boolean active;
    private boolean expertBlocked;
    private String lastActivity;
    private List<GetChatMessageResponse> recentMessages;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String id;
        private String name;
        private String email;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExpertInfo {
        private String id;
        private String name;
        private String email;
        private String companyName;
        private boolean accountBlocked;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AdInfo {
        private String id;
        private String title;
        private String descriptions;
    }

    // Convert Entity to DTO
    public static GetChatRoomResponse fromEntity(ChatRoom chatRoom) {
        return GetChatRoomResponse.builder()
                .id(chatRoom.getId())
                .chatId(chatRoom.getChatId())
                .user(UserInfo.builder()
                        .id(chatRoom.getUser().getId())
                        .name(chatRoom.getUser().getName())
                        .email(chatRoom.getUser().getEmail())
                        .build())
                .expert(ExpertInfo.builder()
                        .id(chatRoom.getExpert().getId())
                        .name(chatRoom.getExpert().getName())
                        .email(chatRoom.getExpert().getEmail())
                        .companyName(chatRoom.getExpert().getCompanyName())
                        .accountBlocked(chatRoom.getExpert().isAccountBlocked())
                        .build())
                .ad(AdInfo.builder()
                        .id(chatRoom.getAd().getId())
                        .title(chatRoom.getAd().getTitle())
                        .descriptions(chatRoom.getAd().getDescriptions())
                        .build())
                .active(chatRoom.isActive())
                .expertBlocked(chatRoom.isExpertBlocked())
                .lastActivity(chatRoom.getLastActivity().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                .recentMessages(chatRoom.getMessages().stream()
                        .sorted((m1, m2) -> m2.getTimestamp().compareTo(m1.getTimestamp()))
                        .limit(10)
                        .map(GetChatMessageResponse::fromEntity)
                        .collect(Collectors.toList()))
                .build();
    }
}
