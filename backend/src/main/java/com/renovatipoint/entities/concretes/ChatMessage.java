package com.renovatipoint.entities.concretes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.renovatipoint.enums.MessageType;
import jakarta.persistence.*;
import lombok.*;

import java.lang.annotation.Documented;
import java.time.LocalDateTime;
import java.util.Date;
@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @Column(nullable = false)
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    private LocalDateTime timestamp;
    @Column(name = "is_read")
    private boolean isRead;

    private boolean isSharedInformation;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type")
    private MessageType messageType;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null){
            timestamp = LocalDateTime.now();
        }
        isRead = false;
        if (messageType == null) {
            messageType = MessageType.CHAT;
        }
    }


}
