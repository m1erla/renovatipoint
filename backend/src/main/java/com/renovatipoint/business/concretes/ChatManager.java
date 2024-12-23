package com.renovatipoint.business.concretes;

import com.renovatipoint.core.utilities.detector.ContactInfoDetector;
import com.renovatipoint.core.utilities.events.ChatMessageSentEvent;
import com.renovatipoint.core.utilities.exceptions.InsufficientBalanceException;
import com.renovatipoint.dataAccess.abstracts.*;
import com.renovatipoint.entities.concretes.*;
import com.renovatipoint.enums.ChatRoomStatus;
import com.renovatipoint.enums.MessageType;
import com.stripe.exception.StripeException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class ChatManager {
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;
    private final ExpertRepository expertRepository;
    private final NotificationManager notificationManager;
    private final ApplicationEventPublisher eventPublisher;
    public ChatRoom getChatRoomWithValidation(String chatRoomId, String userEmail){
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));

        if (!canAccessChatRoom(user, chatRoom)){
            throw new AccessDeniedException("You don't have access to this chat room");
        }

        if (user instanceof Expert && chatRoom.isExpertBlocked()){
            throw new IllegalStateException("Expert account is blocked");
        }
        return chatRoom;
    }

    // Chat Room Management
    @Transactional
    public ChatRoom createChatRoomForAcceptedRequest(Request request) {
        log.debug("Creating chat room for accepted request: {}", request.getId());
        // Verify expert account status
        if (request.getExpert().isAccountBlocked()) {
            throw new IllegalStateException("Cannot create chat room: Expert account is blocked");
        }

        // Check if chat room already exists
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByRequest(request);
        if (existingRoom.isPresent()) {
            return existingRoom.get();
        }

        // Create chat room
        ChatRoom chatRoom = ChatRoom.builder()
                .chatId(UUID.randomUUID().toString())
                .user(request.getAd().getUser())
                .expert(request.getExpert())
                .ad(request.getAd())
                .request(request)
                .active(true)
                .expertBlocked(request.getExpert().isAccountBlocked())
                .lastActivity(LocalDateTime.now())
                .status(ChatRoomStatus.ACTIVE)
                .build();

        ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);

        // Create welcome message
        ChatMessage welcomeMessage = ChatMessage.builder()
                .chatRoom(savedChatRoom)
                .content(String.format("Chat room created for ad: %s. Conversation between %s and %s",
                        request.getAd().getTitle(),
                        request.getUser().getName(),
                        request.getExpert().getName()))
                .messageType(MessageType.SYSTEM)
                .sender(request.getUser())
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();
        chatMessageRepository.save(welcomeMessage);

        // Notify participants
        notificationManager.notifyChatRoomCreated(
                request.getAd().getUser().getId(),
                request.getExpert().getId(),
                request.getAd().getTitle(),
                savedChatRoom.getId()
        );
        log.info("Chat room created successfully. ChatRoomId: {}", savedChatRoom.getId());

        return savedChatRoom;
    }





    public Optional<ChatRoom> getChatRoomByRequestId(String requestId) {
        return chatRoomRepository.findByRequestId(requestId);
    }

    // Message Management
    @Transactional
    public ChatMessage sendMessage(String senderId, String chatRoomId, String content, boolean isSharedInformation) throws StripeException {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new EntityNotFoundException("Sender not found"));

        if (!canAccessChatRoom(sender, chatRoom)) {
            throw new AccessDeniedException("User does not have access to this chat room");
        }

        if (chatRoom.isExpertBlocked()) {
            throw new IllegalStateException("Expert account is blocked");
        }

        boolean containsContactInfo = false;
        if (!(sender instanceof Expert) &&
                (isSharedInformation || ContactInfoDetector.containsContactInformation(content))) {
            containsContactInfo = true;
            handleContactInformationSharing(chatRoom.getExpert(), sender);
        }

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .content(content)
                .messageType(containsContactInfo ? MessageType.CONTACT_INFO : MessageType.CHAT)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Update chat room activity
        chatRoom.setLastActivity(LocalDateTime.now());
        chatRoomRepository.save(chatRoom);

        // Notify recipient
        String recipientId = sender.getId().equals(chatRoom.getUser().getId())
                ? chatRoom.getExpert().getId()
                : chatRoom.getUser().getId();

        notificationManager.notifyNewMessage(
                recipientId,
                sender.getId(),
                chatRoom.getId(),
                content
        );

        return savedMessage;
    }


    // Message Retrieval Methods
    public Page<ChatMessage> getChatMessages(String chatRoomId, String userEmail, Pageable pageable) {
        ChatRoom chatRoom = getChatRoomWithValidation(chatRoomId, userEmail);
        return chatMessageRepository.findByChatRoomId(chatRoomId, pageable);
    }

    @Transactional
    public void markMessagesAsRead(String chatRoomId, String userEmail) {
        ChatRoom chatRoom = getChatRoomWithValidation(chatRoomId, userEmail);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        List<ChatMessage> unreadMessages = chatMessageRepository
                .findByChatRoomAndSenderIdAndIsReadFalse(chatRoom, user.getId());

        unreadMessages.forEach(message -> message.setRead(true));
        chatMessageRepository.saveAll(unreadMessages);
    }

    public long getUnreadMessageCount(String userEmail, String chatRoomId) {
        ChatRoom chatRoom = getChatRoomWithValidation(chatRoomId, userEmail);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return chatMessageRepository.countByChatRoomAndSenderIdAndIsReadFalse(chatRoom, user.getId());
    }

    public List<ChatRoom> getUserChatRooms(String userId) {
        return chatRoomRepository.findByUserIdOrderByLastActivityDesc(userId);
    }

    public List<ChatRoom> getExpertChatRooms(String expertId) {
        Expert expert = expertRepository.findById(expertId)
                .orElseThrow(() -> new EntityNotFoundException("Expert not found"));

        if (expert.isAccountBlocked()) {
            return Collections.emptyList();
        }

        return chatRoomRepository.findByExpertIdOrderByLastActivityDesc(expertId);
    }

    private boolean canAccessChatRoom(User user, ChatRoom chatRoom) {
        if (user instanceof Expert) {
            return chatRoom.getExpert().getId().equals(user.getId()) && !chatRoom.isExpertBlocked();
        }
        return chatRoom.getUser().getId().equals(user.getId());
    }

    @Transactional
    protected void handleContactInformationSharing(Expert expert, User user) throws StripeException {
        if (expert.isAccountBlocked()) {
            throw new IllegalStateException("Expert account is blocked");
        }

        BigDecimal contactInfoCharge = new BigDecimal("1.00"); // 1 euro
        if (expert.getBalance().compareTo(contactInfoCharge) < 0) {
            expert.incrementPaymentIssuesCount();
            expertRepository.save(expert);
            throw new InsufficientBalanceException("Insufficient balance for contact information");
        }

        // Deduct from expert's balance
        expert.setBalance(expert.getBalance().subtract(contactInfoCharge));
        expertRepository.save(expert);
    }

    @Transactional
    public void completeChatRoom(String chatRoomId, String userEmail) {
        ChatRoom chatRoom = getChatRoomWithValidation(chatRoomId, userEmail);

        // Only ad owner can complete chat room
        if (!chatRoom.getUser().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("Only the ad owner can complete the chat room");
        }

        chatRoom.setStatus(ChatRoomStatus.COMPLETED);
        chatRoom.setActive(false);
        chatRoomRepository.save(chatRoom);

        notificationManager.notifyChatRoomCompleted(
                chatRoom.getUser().getId(),
                chatRoom.getExpert().getId(),
                chatRoom.getAd().getTitle()
        );
    }
}