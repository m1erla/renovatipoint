package com.renovatipoint.entities.concretes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.lang.annotation.Documented;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class ChatMessage
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String chatId;


    private String senderId;


    private String recipientId;


    private String content;

    private Date timestamp;

    @ManyToOne
    @JoinColumn(name = "chat_room")
    private ChatRoom chatRoom;


}
