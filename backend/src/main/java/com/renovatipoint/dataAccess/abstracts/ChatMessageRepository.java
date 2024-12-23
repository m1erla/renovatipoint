package com.renovatipoint.dataAccess.abstracts;

import com.renovatipoint.entities.concretes.ChatMessage;
import com.renovatipoint.entities.concretes.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;


public interface ChatMessageRepository extends JpaRepository<ChatMessage, String>
{
    Page<ChatMessage> findByChatRoomId(String chatRoomId, Pageable pageable);

    List<ChatMessage> findByChatRoomAndSenderIdAndIsReadFalse(ChatRoom chatRoom, String id);

    long countByChatRoomAndSenderIdAndIsReadFalse(ChatRoom chatRoom, String id);
}
