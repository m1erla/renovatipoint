package com.renovatipoint.business.concretes;

import com.renovatipoint.dataAccess.abstracts.ChatRoomRepository;
import com.renovatipoint.entities.concretes.ChatRoom;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatRoomManager {

    private final ChatRoomRepository chatRoomRepository;


    public Optional<String> getChatRoomId(String userId, String recipientId, boolean createNewRoomIfNotExists){
        return chatRoomRepository
                .findBySenderIdAndRecipientId(userId, recipientId)
                .map(ChatRoom::getChatId)
                .or(() -> {
                    if (createNewRoomIfNotExists){
                        return createChatId(userId, recipientId).describeConstable();
                    }
                    return Optional.empty();
                });
    }

    private String createChatId(String senderId, String recipientId){
        var chatId = UUID.randomUUID().toString();

        ChatRoom senderRecipient =
                ChatRoom.builder()
                        .chatId(chatId)
                        .senderId(senderId)
                        .recipientId(recipientId)
                        .build();

        ChatRoom recipientSender = ChatRoom
                .builder()
                .chatId(chatId)
                .senderId(recipientId)
                .recipientId(senderId)
                .build();

        chatRoomRepository.save(senderRecipient);
        chatRoomRepository.save(recipientSender);

        return chatId;
    }
}
