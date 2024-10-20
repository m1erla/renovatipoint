package com.renovatipoint.dataAccess.abstracts;

import com.renovatipoint.entities.concretes.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;


public interface ChatMessageRepository extends JpaRepository<ChatMessage, String>
{
    Optional<ChatMessage> findBySenderIdAndRecipientIdOrderByTimestampAsc(String senderId, String recipientId);
    List<ChatMessage> findByChatId(String chatId);


}
