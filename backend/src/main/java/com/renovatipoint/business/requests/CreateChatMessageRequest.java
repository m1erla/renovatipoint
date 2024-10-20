package com.renovatipoint.business.requests;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreateChatMessageRequest {

    private String senderId;
    private String recipientId;
    private String content;
    private boolean isSharedInformation;
}
