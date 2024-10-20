package com.renovatipoint.webApi.controllers;

import com.renovatipoint.business.abstracts.UserService;
import com.renovatipoint.business.concretes.ChatMessageManager;
import com.renovatipoint.business.concretes.OperationManager;
import com.renovatipoint.business.requests.CreateChatMessageRequest;
import com.renovatipoint.core.utilities.exceptions.BusinessException;
import com.renovatipoint.dataAccess.abstracts.ChatRoomRepository;
import com.renovatipoint.dataAccess.abstracts.ExpertRepository;
import com.renovatipoint.dataAccess.abstracts.RequestRepository;
import com.renovatipoint.dataAccess.abstracts.UserRepository;
import com.renovatipoint.entities.concretes.*;
import com.stripe.exception.StripeException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatMessageManager chatMessageManager;
    private final ChatRoomRepository chatRoomRepository;
    private final ExpertRepository expertRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserService userService;
    private final UserRepository userRepository;
    private final RequestRepository requestRepository;
    private final OperationManager operationManager;
    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);


    @PostMapping("/send")
    public ResponseEntity<ChatMessage> sendMessage(
            @RequestBody CreateChatMessageRequest createChatMessageRequest,
            @AuthenticationPrincipal UserDetails userDetails
            ) throws StripeException {
        try {
            ChatMessage message = chatMessageManager.sendMessage(createChatMessageRequest.getSenderId(), createChatMessageRequest.getRecipientId(), createChatMessageRequest.getContent(), createChatMessageRequest.isSharedInformation());
            ChatMessage saved = chatMessageManager.save(message);
            return ResponseEntity.ok(saved);
        }catch (StripeException e){
            return ResponseEntity.badRequest().body(null);
        }

    }

    @MessageMapping("/sendMessage")
    public void processMessage(@Payload ChatMessage chatMessage) {
        try {
            ChatMessage savedMsg = chatMessageManager.save(chatMessage);
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(chatMessage.getRecipientId()), "/queue/messages",
                    new ChatNotification(
                            savedMsg.getId(),
                            savedMsg.getSenderId(),
                            savedMsg.getRecipientId(),
                            savedMsg.getContent()
                    )
            );

        } catch (Exception e) {
            logger.error("Error processing message: ", e);
            throw new BusinessException("Error processing message: " + e.getMessage());
        }
    }
    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(@PathVariable String senderId,
                                                              @PathVariable String recipientId){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        logger.info("Creating chat. Authentication: {}", authentication);
        logger.info("Authentication details - Principal: {}, Authorities: {}",
                authentication.getPrincipal(),
                authentication.getAuthorities());

        if (!authentication.isAuthenticated()) {
            logger.error("User is not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String currentUserEmail = authentication.getName();

        User currentUser = userService.getByEmail(currentUserEmail);
        if (currentUser == null) {
            logger.error("Current user not found for email: {}", currentUserEmail);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (currentUser.getId() == null) {
            logger.error("User ID mismatch. CurrentUser ID: {}, Provided userId: {}", currentUser.getId(), senderId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ChatRoom chatRoom = chatRoomRepository.findByChatId(recipientId).orElseThrow(
                () -> new EntityNotFoundException("Chat ID is missing!"));
        return ResponseEntity.ok(chatMessageManager.findChatMessages(currentUser.getId(), chatRoom.getChatId()));
    }
    @PostMapping("/join")
    public ResponseEntity<?> joinChatRoom(@RequestParam String chatId, @RequestParam String expertId) {
        try {
            // Authenticate the expert
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String currentUserEmail = authentication.getName();

            Expert expert = expertRepository.findByEmail(currentUserEmail)
                    .orElseThrow(() -> new EntityNotFoundException("Expert not found"));

            if (!expert.getId().equals(expertId)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Expert ID mismatch");
            }

            ChatRoom chatRoom = chatRoomRepository.findByChatId(chatId)
                    .orElseThrow(() -> new EntityNotFoundException("Chat room not found"));

            chatRoom.setExpert(expert);
            chatRoomRepository.save(chatRoom);

            return ResponseEntity.ok("Expert joined the chat room successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/conversation")
    public ResponseEntity<Optional<ChatMessage>> getConversation(
            @RequestParam String userId1,
            @RequestParam String userId2
    ){
        Optional<ChatMessage> conversation = chatMessageManager.getConversation(userId1, userId2);
        return ResponseEntity.ok(conversation);
    }


@PostMapping("/create")
public ResponseEntity<ChatRoom> createChat(@RequestParam String userId, @RequestParam String expertEmail) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    logger.info("Creating chat. Authentication: {}", authentication);
    logger.info("Authentication details - Principal: {}, Authorities: {}",
            authentication.getPrincipal(),
            authentication.getAuthorities());

    if (!authentication.isAuthenticated()) {
        logger.error("User is not authenticated");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    String currentUserEmail = authentication.getName();
    logger.info("Creating chat. Current user email: {}, userId: {}, expertEmail: {}", currentUserEmail, userId, expertEmail);

    User currentUser = userService.getByEmail(currentUserEmail);
    if (currentUser == null) {
        logger.error("Current user not found for email: {}", currentUserEmail);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    if (!currentUser.getId().equals(userId)) {
        logger.error("User ID mismatch. CurrentUser ID: {}, Provided userId: {}", currentUser.getId(), userId);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    try {
        ChatRoom chatRoom = chatMessageManager.createChat(userId, expertEmail);
        logger.info("Chat room created successfully: {}", chatRoom);
        return ResponseEntity.ok(chatRoom);
    } catch (Exception e) {
        logger.error("Error creating chat room", e);
        return ResponseEntity.badRequest().build();
    }
}
    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String messageId, @RequestParam String userId) {
        chatMessageManager.deleteMessage(messageId, userId);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/share-information")
    public ResponseEntity<?> shareInformation(@RequestBody CreateChatMessageRequest request){
        try {
            chatMessageManager.processSharedInformation(request.getSenderId(), request.getRecipientId(), request.getContent());
            Operation operation = operationManager.createInformationSharingTransaction(
                    request.getRecipientId(),
                    request.getSenderId()
            );

            return ResponseEntity.ok("Information shared and charged successfully. Operation ID: " + operation.getId());

        }catch (BusinessException | StripeException e){
            logger.error("Payment error while sharing information: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error processing payment: " + e.getMessage());
        }
        catch (Exception e){
            logger.error("Error sharing information: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sharing information.");

        }
    }

    @GetMapping("/room")
    public ResponseEntity<?> getChatRoom(@RequestParam String userId){
        try {
            Optional<ChatRoom> chatRoomOptional = chatRoomRepository.findByUserId(userId);
            if (chatRoomOptional.isPresent()){
                return ResponseEntity.ok(chatRoomOptional.get());
            }else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Chat room not found");
            }
        }catch (Exception e){
            logger.error("Error retrieving chat room: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving chat room");
        }
    }

    @PostMapping("/complete-job")
    public ResponseEntity<?> completeJob(@RequestBody Map<String, String> body){
        String expertId = body.get("userId");
        String chatRoomId = body.get("chatId");
        String userId = body.get("userId");

        try {
            chatMessageManager.completeChatJob(chatRoomId, expertId);

            Operation operation =  operationManager.createJobCompletionTransaction(
                    expertId,
                    userId,
                    chatRoomId
                    );

            return ResponseEntity.ok("Job completed and charged successfully. Operation ID: " + operation.getId());
        }catch (BusinessException | StripeException e){
            logger.error("Payment error while completing the job: ", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error processing payment: " + e.getMessage());
        }catch (Exception e){
            logger.error("Error completing job: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error completing job");
        }
    }
}
//    @PostMapping("/create")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<?> createChat(@RequestBody CreateChatDTO createChatDTO) {
//        try {
//            ChatRoom chatRoom = chatManager.createChat(createChatDTO.getUserId(), createChatDTO.getExpertId());
//            return ResponseEntity.ok(chatRoom);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }