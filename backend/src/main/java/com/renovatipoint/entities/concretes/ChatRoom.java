package com.renovatipoint.entities.concretes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.renovatipoint.enums.ChatRoomStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String chatId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "expert_id")
    private Expert expert;

    @ManyToOne
    @JoinColumn(name = "ad_id")
    private Ads ad;

    @OneToOne
    @JoinColumn(name = "request_id")
    private Request request;

    private boolean active;


    @Column(name = "expert_blocked")
    private boolean expertBlocked;

    @Column(name = "last_activity")
    private LocalDateTime lastActivity;

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
    @OrderBy("timestamp DESC")
    private List<ChatMessage> messages = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ChatRoomStatus status;

    @PrePersist
    protected void onCreate() {
        lastActivity = LocalDateTime.now();
        active = true;
        status = ChatRoomStatus.ACTIVE;
        expertBlocked = expert != null && expert.isAccountBlocked();
    }

}
