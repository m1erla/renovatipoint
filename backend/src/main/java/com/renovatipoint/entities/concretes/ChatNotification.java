package com.renovatipoint.entities.concretes;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class ChatNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String senderId;

    private String recipientId;

    private String content;
}
