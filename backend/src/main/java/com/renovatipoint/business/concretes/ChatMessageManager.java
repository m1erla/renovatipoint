package com.renovatipoint.business.concretes;

import com.renovatipoint.core.utilities.detector.ContactInfoDetector;
import com.renovatipoint.dataAccess.abstracts.*;
import com.renovatipoint.entities.concretes.*;
import com.stripe.exception.StripeException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ChatMessageManager {
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ExpertRepository expertRepository;
    private final OperationManager operationManager;

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomManager chatRoomManager;

    private final SharedInformationRepository sharedInformationRepository;

    public ChatMessageManager(ChatMessageRepository chatMessageRepository, UserRepository userRepository, ExpertRepository expertRepository, OperationManager operationManager, ChatRoomRepository chatRoomRepository, ChatRoomManager chatRoomManager, SharedInformationRepository sharedInformationRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
        this.expertRepository = expertRepository;
        this.operationManager = operationManager;
        this.chatRoomRepository = chatRoomRepository;
        this.chatRoomManager = chatRoomManager;
        this.sharedInformationRepository = sharedInformationRepository;
    }


    public ChatMessage save(ChatMessage chatMessage){
        if (chatMessage.getContent() == null || chatMessage.getContent().isEmpty()){
            throw new IllegalArgumentException("Chat content cannot be null or empty");
        }
        var chatId = chatRoomManager
                .getChatRoomId(
                        chatMessage.getSenderId(),
                        String.valueOf(chatMessage.getRecipientId()),
                        false)
                .orElseThrow();
        chatMessage.setChatId(chatId);
        chatMessageRepository.save(chatMessage);

    return chatMessage;
    }

    public List<ChatMessage> findChatMessages(String userId, String chatId){
        var chatRoomId = chatRoomManager.getChatRoomId(userId, chatId, false);
        return chatRoomId.map(chatMessageRepository::findByChatId).orElse(new ArrayList<>());
    }
    @Transactional
    public ChatMessage sendMessage(String senderId, String recipientId, String content, boolean isSharedInformation) throws StripeException {
//        if (senderId == null || recipientEmail == null){
//            throw new IllegalArgumentException("Sender ID and Recipient ID must not be null");
//        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new EntityNotFoundException("Sender not found"));
        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new EntityNotFoundException("Recipient not found"));

        if (!isSharedInformation && ContactInfoDetector.containsContactInformation(content)) {
            isSharedInformation = true;
        }

        ChatMessage message = ChatMessage.builder()
                .senderId(senderId)
                .recipientId(recipientId)
                .content(content)
                .build();


        return chatMessageRepository.save(message);
    }


    @Transactional
    public ChatRoom createChat(String userId, String expertEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Expert expert = expertRepository.findByEmail(expertEmail)
                .orElseThrow(() -> new EntityNotFoundException("Expert not found"));

        // Generate a unique chat room ID based on the user and expert IDs
        String chatId = UUID.randomUUID().toString();

        // Check if the chat room already exists
        return chatRoomRepository.findByChatId(chatId)
                .orElseGet(() -> {
                    ChatRoom newChatRoom = new ChatRoom();
                    newChatRoom.setChatId(chatId);
                    newChatRoom.setUser(user);
                    newChatRoom.setExpert(expert);
                    chatRoomRepository.save(newChatRoom);

                    // Create an initial system message to start the chat
                    ChatMessage systemMessage = ChatMessage.builder()
                            .chatRoom(newChatRoom)
                            .content("Chat initiated between " + user.getName() + " and " + expert.getName())
                            .senderId(newChatRoom.getSenderId())
                            .timestamp(new Date())
                            .build();

                    chatMessageRepository.save(systemMessage);

                    return newChatRoom;
                });
    }
    public void processSharedInformation(String senderId, String recipientId, String content){
        ChatMessage message = ChatMessage.builder()
                .senderId(senderId)
                .recipientId(recipientId)
                .content(content)
                .timestamp(new Date())
                .build();

        chatMessageRepository.save(message);
    }

    public void completeChatJob(String chatId, String expertId){
        ChatRoom chatRoom = chatRoomRepository.findByChatId(chatId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));
//        if (!chatRoom.getExpert().getEmail().equals(expertId)){
//            throw new IllegalArgumentException("Expert mismatch for this chat room");
//        }
        chatRoom.setCompleted(true);
        chatRoomRepository.save(chatRoom);
    }
    public Optional<ChatMessage> getConversation(String senderId, String recipientId) {
        return chatMessageRepository.findBySenderIdAndRecipientIdOrderByTimestampAsc(senderId, recipientId);
    }



    @Transactional
    public void deleteMessage(String messageId, String userId){
        ChatMessage message = chatMessageRepository.findById(messageId)
                .orElseThrow(() -> new EntityNotFoundException("Message not found"));
//        if (!message.getSenderId().equals(userId)){
//            throw new IllegalArgumentException("User can only delete their own messages");
//        }
        chatMessageRepository.delete(message);
    }

}

//        if (isSharedInformation && sender.getRole() != Role.EXPERT && recipient instanceof Expert) {
//            Expert expertRecipient = (Expert) recipient;
//
//            SharedInformation sharedInfo = SharedInformation.builder()
//                    .user(sender)
//                    .expert(expertRecipient)
//                    .information(content)
//                    .charged(false)
//                    .build();
//            sharedInformationRepository.save(sharedInfo);
//
//            // Charge the expert
//            operationManager.createInformationSharingTransaction(expertRecipient.getId(), sender.getId());
//        }