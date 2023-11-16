package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.User;
import com.werkspot.security.token.Token;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    Optional<User> findByName(String jobTitleName);
    boolean existsByEmail(String email);

    Optional<User> findByToken(List<Token> token);
}
