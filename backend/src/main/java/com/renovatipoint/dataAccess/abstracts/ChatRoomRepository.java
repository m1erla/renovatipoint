package com.renovatipoint.dataAccess.abstracts;

import com.renovatipoint.entities.concretes.ChatRoom;
import com.renovatipoint.entities.concretes.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {

    Optional<ChatRoom> findByRequestId(String requestId);

    Optional<ChatRoom> findByRequest(Request request);

    Optional<ChatRoom> findByUserId(String userId);

    List<ChatRoom> findByExpertId(String expertId);
    List<ChatRoom> findByUserIdOrderByLastActivityDesc(String userId);
    List<ChatRoom> findByExpertIdOrderByLastActivityDesc(String expertId);
}
