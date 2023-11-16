package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.User;
import com.werkspot.security.token.Token;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    Optional<User> findByToken(String token);

    @Transactional
    @Modifying
    @Query("UPDATE User u " +
    "SET u.enabled = TRUE WHERE u.email = ?1")
    int enableUser(String email);
}
