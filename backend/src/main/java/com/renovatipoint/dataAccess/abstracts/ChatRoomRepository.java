package com.renovatipoint.dataAccess.abstracts;

import com.renovatipoint.entities.concretes.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(String userId, String chatId);

    Optional<ChatRoom> findByChatId(String chatId);

    Optional<ChatRoom> findByUserId(String userId);
}
