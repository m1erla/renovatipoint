package com.renovatipoint.business.requests;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.renovatipoint.enums.MessageType;
import lombok.*;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateChatMessageRequest {

    private String senderId;
    private String chatRoomId;
    private String content;
    private boolean isSharedInformation;
    private MessageType type;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")
    private LocalDateTime timestamp;

    public void setSharedInformation(boolean shared){
        this.isSharedInformation = shared;
    }
    public void setIsSharedInformation(boolean shared){
        this.isSharedInformation = shared;
    }
}
