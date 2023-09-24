package com.werkspot.dataAccess.abstracts;

import com.werkspot.entities.concretes.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);
    Optional<User> findByJobTitleName(String jobTitleName);
    boolean existsByEmail(String email);
}
