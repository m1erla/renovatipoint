package com.renovatipoint.webApi.controllers;

import com.renovatipoint.business.abstracts.ExpertService;
import com.renovatipoint.business.abstracts.UserService;
import com.renovatipoint.business.concretes.ChatMessageManager;
import com.renovatipoint.business.concretes.RequestManager;
import com.renovatipoint.business.requests.CreateRequestDTO;
import com.renovatipoint.business.responses.GetRequestsResponse;
import com.renovatipoint.dataAccess.abstracts.RequestRepository;
import com.renovatipoint.entities.concretes.ChatRoom;
import com.renovatipoint.entities.concretes.Request;
import com.renovatipoint.enums.RequestStatus;
import com.renovatipoint.security.jwt.JwtService;
import com.stripe.exception.StripeException;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/requests")
public class RequestController {
    private final RequestManager requestManager;
    private final UserService userService;
    private final ExpertService expertService;
    private final JwtService jwtService;
    private final RequestRepository requestRepository;
    private final ChatMessageManager chatMessageManager;
    private final Logger logger = LoggerFactory.getLogger(RequestController.class);

    @Autowired
    public RequestController(RequestManager requestManager, UserService userService, ExpertService expertService, JwtService jwtService, RequestRepository requestRepository, ChatMessageManager chatMessageManager) {
        this.requestManager = requestManager;
        this.userService = userService;
        this.expertService = expertService;
        this.jwtService = jwtService;
        this.requestRepository = requestRepository;
        this.chatMessageManager = chatMessageManager;
    }

//    @PostMapping
//    public ResponseEntity<?> createRequest(@Validated @RequestBody CreateRequestDTO requestDTO) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String currentUserEmail = authentication.getName();
//
//        User currentUser = userService.getByEmail(currentUserEmail);
//        if (!(currentUser instanceof Expert)) {
//            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only experts can create requests");
//        }
//
//        try {
//            Request createdRequest = requestManager.createRequest(currentUser.getId(), requestDTO.getAdId(), requestDTO);
//            return ResponseEntity.ok(createdRequest);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("Failed to create request: " + e.getMessage());
//        }
//    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody CreateRequestDTO requestDTO, @RequestHeader("Authorization") String token) {
        try {
            logger.info("Received request to create request for ad: {}", requestDTO.getAdId());

            // Extract email from JWT token
            String userEmail = jwtService.extractUsername(token.replace("Bearer ", ""));
            logger.info("Extracted user email from token: {}", userEmail);

            if (userEmail == null) {
                logger.error("Failed to extract user email from token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid token");
            }

            Request createdRequest = requestManager.createRequest(requestDTO.getAdId(), userEmail);
            logger.info("Request created successfully: {}", createdRequest.getId());
            return ResponseEntity.ok(createdRequest);
        } catch (Exception e) {
            logger.error("Error creating request", e);
            return ResponseEntity.badRequest().body("Error creating request: " + e.getMessage());
        }
    }
    @GetMapping("/ads/owner/{userId}")
    public ResponseEntity<List<GetRequestsResponse>> getRequestsByAdOwner(@PathVariable String userId) {
        List<GetRequestsResponse> requests = requestManager.getRequestsByAdOwner(userId);
        return ResponseEntity.ok(requests);
    }
    @PutMapping("/{requestId}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable String requestId, @RequestBody Map<String, String> body) {
        try {
            String userId = body.get("userId");
            if (userId == null || userId.isEmpty()) {
                logger.error("UserId is missing in the request body");
                return ResponseEntity.badRequest().body("UserId is required");
            }
            Request request = requestRepository.findById(requestId).orElseThrow(() -> new EntityNotFoundException("Request not found"));
            logger.info("Accepting request: {} for user: {}", requestId, userId);
            GetRequestsResponse acceptedRequest = requestManager.acceptRequest(requestId, userId);
            logger.info("Request accepted successfully: {}", acceptedRequest);

            ChatRoom chatRoom = chatMessageManager.createChat(userId, request.getExpert().getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("request", acceptedRequest);
            response.put("chatRoom", chatRoom);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            logger.error("Error accepting request: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{requestId}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable String requestId, @RequestBody Map<String, String> body) {
        try {
            String userId = body.get("userId");
            if (userId == null) {
                return ResponseEntity.badRequest().body("UserId is required");
            }
            Request rejectedRequest = requestManager.rejectRequest(requestId, userId);
            return ResponseEntity.ok(rejectedRequest);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

//    @PostMapping
//    public ResponseEntity<?> createRequest(@RequestBody CreateRequestDTO requestDTO) {
//        try {
//            Request createdRequest = requestManager.createRequest(requestDTO.getAdId(), requestDTO.getExpertEmail());
//            return ResponseEntity.ok(createdRequest);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body("Error creating request: " + e.getMessage());
//        }
//    }

//    @PutMapping("/{requestId}/accept")
//    public ResponseEntity<?> acceptRequest(@PathVariable String requestId, @RequestParam String userId) {
//        try {
//            Request acceptedRequest = requestManager.acceptRequest(requestId, userId);
//            return ResponseEntity.ok(acceptedRequest);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }

//    @PutMapping("/{requestId}/reject")
//    public ResponseEntity<?> rejectRequest(@PathVariable String requestId, @RequestParam String userId) {
//        try {
//            Request rejectedRequest = requestManager.rejectRequest(requestId, userId);
//            return ResponseEntity.ok(rejectedRequest);
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }
//    @PutMapping("/{requestId}/accept")
//    public ResponseEntity<?> acceptRequest(@PathVariable String requestId) {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        String currentUserEmail = authentication.getName();
//        User currentUser = userService.getByEmail(currentUserEmail);
//
//        try {
//            Request acceptedRequest = requestManager.acceptRequest(requestId, currentUser.getId());
//            return ResponseEntity.ok(acceptedRequest);
//        } catch (EntityNotFoundException | IllegalArgumentException | IllegalStateException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        } catch (StripeException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("An error occurred while processing the payment");
//        }
//    }
    @PutMapping("/{requestId}/complete")
    public ResponseEntity<Request> completeRequest(@PathVariable String requestId, @PathVariable String expertId) {
        try {
            Request request = requestManager.completeRequest(requestId, expertId);
            return ResponseEntity.ok(request);
        } catch (StripeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GetRequestsResponse>> getRequestsByUser(@PathVariable String userId) {
        List<GetRequestsResponse> requests = requestManager.getRequestsByUser(userId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/expert/{expertId}")
    public ResponseEntity<List<GetRequestsResponse>> getRequestsByExpert(@PathVariable String expertId) {
        List<GetRequestsResponse> requests = requestManager.getRequestsByExpert(expertId);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Request>> getRequestsByStatus(@PathVariable RequestStatus status) {
        List<Request> requests = requestManager.getRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }
    @PutMapping("/{requestId}/cancel")
    public ResponseEntity<Request> cancelRequest(@PathVariable String requestId, @RequestParam String userId) {
        Request request = requestManager.cancelRequest(requestId, userId);
        return ResponseEntity.ok(request);
    }

    @GetMapping("/ad/{adId}/pending")
    public ResponseEntity<List<Request>> getPendingRequestsForAd(@PathVariable String adId) {
        List<Request> requests = requestManager.getPendingRequestsForAd(adId);
        return ResponseEntity.ok(requests);
    }

//    @PutMapping("/{requestId}/reject")
//    public ResponseEntity<Request> rejectRequest(@PathVariable String requestId, @RequestParam String expertId) {
//        Request request = requestManager.rejectRequest(requestId, expertId);
//        return ResponseEntity.ok(request);
//    }
}
