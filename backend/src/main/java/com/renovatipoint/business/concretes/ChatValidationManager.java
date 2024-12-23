package com.renovatipoint.business.concretes;

import com.renovatipoint.business.requests.CreateChatMessageRequest;
import com.renovatipoint.core.utilities.detector.ContactInfoDetector;
import com.renovatipoint.dataAccess.abstracts.ChatRoomRepository;
import com.renovatipoint.dataAccess.abstracts.ExpertRepository;
import com.renovatipoint.entities.concretes.ChatRoom;
import com.renovatipoint.enums.MessageType;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Slf4j
public class ChatValidationManager {
    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ExpertRepository expertRepository;

    public void validateChatMessageRequest(CreateChatMessageRequest request) {
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Message content cannot be empty");
        }

        if (request.getChatRoomId() == null) {
            throw new IllegalArgumentException("Chat room ID is required");
        }

        if (request.getSenderId() == null) {
            throw new IllegalArgumentException("Sender ID is required");
        }

        // Validate chat room exists and is active
        ChatRoom chatRoom = chatRoomRepository.findById(request.getChatRoomId())
                .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));

        if (!chatRoom.isActive()) {
            throw new IllegalStateException("Chat room is no longer active");
        }

        // Check if sender has access to chat room
        boolean hasAccess = chatRoom.getUser().getId().equals(request.getSenderId()) ||
                chatRoom.getExpert().getId().equals(request.getSenderId());
        if (!hasAccess) {
            throw new AccessDeniedException("Sender does not have access to this chat room");
        }

        // Check if expert is blocked (if sender is expert)
        if (chatRoom.getExpert().getId().equals(request.getSenderId()) &&
                chatRoom.isExpertBlocked()) {
            throw new IllegalStateException("Expert account is blocked");
        }

        // Validate message type
        if (request.getType() == null) {
            request.setType(MessageType.CHAT);
        }

        // Set timestamp if not provided
        if (request.getTimestamp() == null) {
            request.setTimestamp(LocalDateTime.now());
        }

        // Check for contact information if sender is not expert
        if (!chatRoom.getExpert().getId().equals(request.getSenderId()) &&
                ContactInfoDetector.containsContactInformation(request.getContent())) {
            request.setType(MessageType.CONTACT_INFO);
            request.setSharedInformation(true);
        }
    }
}
